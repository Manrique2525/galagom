"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { coverageLocations } from "@/data/coverage";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

type MapStatus = "unconfigured" | "loading" | "ready" | "error";

export default function CoverageMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>(apiKey ? "loading" : "unconfigured");

  useEffect(() => {
    if (!apiKey || !mapElement.current) return;
    let cancelled = false;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    const polylines: google.maps.Polyline[] = [];

    async function initializeMap() {
      try {
        setOptions({ key: apiKey, v: "weekly" });
        const [{ Map }, { AdvancedMarkerElement, PinElement }] = await Promise.all([importLibrary("maps"), importLibrary("marker")]);
        if (cancelled || !mapElement.current) return;

        const origin = coverageLocations[0];
        const mapInstance = new Map(mapElement.current, {
          center: origin.position,
          mapId,
          zoom: 8,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        const bounds = new google.maps.LatLngBounds();
        coverageLocations.forEach((location) => {
          bounds.extend(location.position);
          const pin = new PinElement({
            background: "#DC2626",
            borderColor: "#B91C1C",
            glyphColor: "#FFFFFF",
            scale: location.primary ? 1.1 : 1,
          });
          markers.push(new AdvancedMarkerElement({ map: mapInstance, position: location.position, title: location.name, content: pin.element }));
        });

        coverageLocations.slice(1).forEach((destination) => {
          polylines.push(new google.maps.Polyline({
            map: mapInstance,
            path: [origin.position, destination.position],
            geodesic: true,
            strokeColor: "#203050",
            strokeOpacity: 0.75,
            strokeWeight: 2,
          }));
        });

        mapInstance.fitBounds(bounds, 64);
        google.maps.event.addListenerOnce(mapInstance, "idle", () => {
          if ((mapInstance.getZoom() ?? 0) > 9) mapInstance.setZoom(9);
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initializeMap();
    return () => {
      cancelled = true;
      markers.forEach((marker) => { marker.map = null; });
      polylines.forEach((polyline) => { polyline.setMap(null); });
    };
  }, []);

  return <div className="relative h-[380px] w-full overflow-hidden rounded-[var(--radius-md)] bg-surface sm:h-[500px]" data-map-status={status}>
    <div ref={mapElement} className="h-full w-full" aria-hidden={status !== "ready"} aria-label="Mapa de cobertura de GALAGOM en Quintana Roo" />
    {status === "unconfigured" && <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface p-8 text-center" role="status"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">Google Maps</p><p className="mt-3 text-lg font-extrabold text-text">Google Maps pendiente de configurar</p><p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">Agrega la API key pública de Google Maps para mostrar el mapa real.</p></div></div>}
    {status === "loading" && <div className="absolute inset-0 z-10 flex h-full animate-pulse items-center justify-center bg-surface" role="status" aria-label="Cargando mapa de cobertura"><span className="text-sm font-semibold text-text-muted">Cargando mapa de cobertura</span></div>}
    {status === "error" && <div className="absolute inset-0 z-10 flex h-full items-center justify-center bg-surface p-8 text-center" role="alert"><p className="text-sm font-semibold text-text-muted">No fue posible cargar el mapa de cobertura.</p></div>}
  </div>;
}

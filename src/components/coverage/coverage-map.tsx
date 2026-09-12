"use client";

import { useEffect, useRef, useState } from "react";
import { coverageLocations } from "@/data/coverage";
import { mapConfig } from "@/data/map-config";

type MapStatus = "loading" | "ready" | "error";

function pinIcon(L: typeof import("leaflet"), primary = false) {
  return L.divIcon({
    className: "galagom-map-pin",
    html: `<span class="galagom-map-pin__head${primary ? " galagom-map-pin__head--primary" : ""}"><span class="galagom-map-pin__dot"></span></span>`,
    iconSize: primary ? [34, 42] : [28, 36],
    iconAnchor: primary ? [17, 42] : [14, 36],
    popupAnchor: [0, primary ? -38 : -32],
  });
}

export default function CoverageMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");

  useEffect(() => {
    if (!mapElement.current) return;
    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    async function initializeMap() {
      try {
        const L = await import("leaflet");
        if (cancelled || !mapElement.current) return;
        map = L.map(mapElement.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        L.tileLayer(mapConfig.tileUrl, { attribution: mapConfig.attribution, maxZoom: mapConfig.maxZoom }).addTo(map);

        const bounds = L.latLngBounds([]);
        coverageLocations.forEach((location) => {
          const marker = L.marker([location.position.lat, location.position.lng], { title: location.name, alt: location.name, icon: pinIcon(L, location.primary) }).addTo(map as import("leaflet").Map);
          const popup = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = location.name;
          const detail = document.createElement("span");
          detail.textContent = location.detail;
          popup.append(title, document.createElement("br"), detail);
          marker.bindPopup(popup);
          bounds.extend([location.position.lat, location.position.lng]);
        });

        const endpoints: [number, number][] = coverageLocations.map((location) => [location.position.lat, location.position.lng]);
        L.polyline(endpoints, { color: "#203050", weight: 2.5, opacity: 0.6, dashArray: "10 10" }).addTo(map as import("leaflet").Map);
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5 });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initializeMap();
    return () => {
      cancelled = true;
      map?.remove();
      map = null;
    };
  }, []);

  return <div className="relative h-[400px] w-full overflow-hidden rounded-[var(--radius-md)] bg-surface sm:h-[540px]" data-map-status={status}>
    <div ref={mapElement} className="h-full w-full" aria-label="Mapa de cobertura nacional de GALAGOM en México" />
    {status === "loading" && <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-surface" role="status" aria-label="Cargando mapa de cobertura"><span className="text-sm font-semibold text-text-muted">Cargando mapa de cobertura</span></div>}
    {status === "error" && <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface p-8 text-center" role="alert"><p className="text-sm font-semibold text-text-muted">No fue posible cargar el mapa interactivo.</p></div>}
  </div>;
}
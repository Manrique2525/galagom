# Mapas

## Leaflet y OpenStreetMap

La cobertura utiliza `leaflet` directamente en un Client Component. No se utiliza `react-leaflet`, Google Maps, Mapbox, un iframe ni una imagen de mapa.

Los tiles iniciales provienen de:

```text
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

La configuración está centralizada en `src/data/map-config.ts` con URL, attribution y `maxZoom`. El control de attribution de Leaflet permanece activo y muestra `© OpenStreetMap contributors`.

## Política de tiles

OpenStreetMap es un servicio de terceros. Antes de un lanzamiento con tráfico significativo se debe revisar la política de uso de tiles de OpenStreetMap y, si corresponde, cambiar a un proveedor compatible. No se añadieron APIs de Places, geocoding, directions o routes.

## Sustitución futura

Para cambiar de proveedor, actualizar `mapConfig` y confirmar que la attribution exigida por el nuevo proveedor se conserva. Las coordenadas y polylines de cobertura no dependen del proveedor de tiles.

## Responsive y cleanup

El mapa mantiene todos los destinos mediante `fitBounds`, desactiva `scrollWheelZoom` para no capturar el scroll de la landing y elimina la instancia con `map.remove()` al desmontar o durante Fast Refresh.

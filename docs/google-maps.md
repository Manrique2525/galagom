# Google Maps Platform

## Quick setup

1. Crear un proyecto en Google Cloud.
2. Activar **Maps JavaScript API**.
3. Crear una API key.
4. Crear un Map ID habilitado para Advanced Markers.
5. Copiar estas variables a `.env.local`:

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=...
```

6. Reiniciar el servidor:

```bash
npm run dev
```

La key debe restringirse por HTTP referrers y por API en Google Cloud. Nunca se debe versionar `.env.local`.

## Implementación

La sección `#cobertura` usa Google Maps JavaScript API mediante `@googlemaps/js-api-loader`. No usa iframe, Embed API, SVG alternativo, imágenes de mapas, Leaflet, Mapbox, Places API, Geocoding API, Directions API ni Routes API.

El componente importa únicamente las librerías `maps` y `marker`, crea un `google.maps.Map`, cuatro `AdvancedMarkerElement` con `PinElement` rojo y tres `google.maps.Polyline` de visualización desde Cancún. Las polilíneas no representan carreteras ni navegación exacta.

## Variables

Copiar `.env.example` a `.env.local` y completar:

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` es obligatoria para cargar el mapa. Si falta, la UI muestra `Google Maps pendiente de configurar`; no vuelve a una implementación simulada. Si falta el Map ID se usa `DEMO_MAP_ID` como fallback de desarrollo, pero producción debe utilizar un Map ID propio habilitado para Advanced Markers.

## Google Cloud

1. Crear o seleccionar un proyecto de Google Cloud.
2. Habilitar únicamente **Maps JavaScript API** para esta integración.
3. Crear un Map ID y asociarlo a un mapa vectorial o raster según la configuración del proyecto.
4. Crear una API key separada para el frontend.
5. Restringir la key por **HTTP referrers**, incluyendo el dominio productivo y sus variantes necesarias.
6. Restringir las APIs permitidas a **Maps JavaScript API**.
7. Para desarrollo local, permitir explícitamente `http://localhost:3000/*` y el puerto usado por el proyecto.

La key pública llegará al navegador por diseño de Maps JavaScript API, pero nunca debe escribirse en el source code ni en Git. Las restricciones de aplicación y API son obligatorias.

## Desarrollo local

```bash
cp .env.example .env.local
npm run dev
```

Con key válida se verá el mapa oficial con sus tiles, controles y atribución de Google. Sin key se puede revisar el layout y la lista textual mediante el estado de configuración pendiente.

## QA

`npm run qa:visual` comprueba `/` y `/cotizar` en cinco viewports. Sin API key espera el fallback explícito. Con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` configurada espera `ready` y genera:

```text
docs/screenshots/google-map-desktop.png
docs/screenshots/google-map-mobile.png
```

Las coordenadas están centralizadas en `src/data/coverage.ts` y fueron verificadas en las fichas geográficas consultadas:

- Cancún: <https://en.wikipedia.org/wiki/Canc%C3%BAn> (`21.16056, -86.84750`).
- Holbox: <https://en.wikipedia.org/wiki/Isla_Holbox> (`21.53778, -87.22000`).
- Isla Mujeres: <https://en.wikipedia.org/wiki/Isla_Mujeres> (`21.233, -86.733`).
- Cozumel: <https://en.wikipedia.org/wiki/Cozumel> (`20.42, -86.92`).

# Arquitectura frontend

## Stack definitivo de Foundation

- Next.js `16.3.5`, App Router y React Server Components.
- React `19.2.8`.
- TypeScript estricto.
- Tailwind CSS `4` con tokens CSS en `src/styles/tokens.css`.
- ESLint `9` con configuración de Next.
- Manrope con `next/font`.

Se añadió `motion` para los reveals ligeros de Homepage Core. `leaflet` carga el mapa únicamente dentro del componente de cobertura; Playwright está instalado únicamente como `devDependency` para QA visual y smoke checks. No se instalaron wrappers React de mapas ni UI kits.

## Rendering

`src/app/layout.tsx`, `page.tsx`, contenido de hero, servicios, nosotros, CTA, footer, `site-header.tsx` y UI base son Server Components. `mobile-navigation.tsx` gestiona estado y `Escape`. `reveal.tsx`, `process-timeline.tsx`, `coverage-map.tsx`, `three-pl-network.tsx` y `quote-form.tsx` son Client Components aislados para Motion, Leaflet o interacción.

No se usa estado global. Los datos públicos se centralizan en `src/data/site.ts` y los tipos simples viven en `src/types/site.ts`.

## Estructura

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    cotizar/page.tsx
    privacidad/page.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
    api/quote/route.ts
  components/
    layout/
      site-footer.tsx
      site-header.tsx
      skip-link.tsx
    navigation/
      mobile-navigation.tsx
    ui/
      button.tsx
      container.tsx
      section-heading.tsx
      reveal.tsx
      route-decor.tsx
    sections/
      hero.tsx
      about-section.tsx
      quote-cta.tsx
    services/
      service-card.tsx
      services-grid.tsx
    forms/
      quote-form.tsx
      field-error.tsx
      submit-status.tsx
    seo/
      site-structured-data.tsx
  data/site.ts
  data/services.ts
  data/process.ts
  data/coverage.ts
  data/three-pl.ts
  data/map-config.ts
  lib/metadata.ts
  lib/quote-schema.ts
  lib/quote/
    email-provider.ts
    resend-email-provider.ts
  lib/structured-data.ts
  styles/tokens.css
  types/site.ts
```

Las fotografías temporales se sirven desde `public/images/temporary/` mediante `next/image`. No se usa hotlinking ni se requiere una dependencia adicional. Los assets deben sustituirse por fotografías corporativas cuando estén disponibles.

Los módulos de Homepage Core y Logistics Experience se organizan así:

```text
components/
  process/       # historia origen -> destino
  coverage/      # cobertura textual y Leaflet/OpenStreetMap
  three-pl/      # ecosistema de servicios 3PL conectados
  forms/         # formulario Client y estados de cotización
```

## Convenciones

- Componentes con export default y una responsabilidad clara.
- HTML semántico, landmarks y enlaces reales.
- `Button` usa `Link` para destinos navegables y `<button>` para acciones nativas.
- Los IDs de homepage son `servicios`, `proceso`, `cobertura`, `nosotros`, `unidades`, `3pl` y `contacto`.
- No se publica structured data específico de la cotización.

## Metadata y assets

La metadata global está en `layout.tsx`, con `metadataBase`, canonical raíz, robots, Open Graph y Twitter. La homepage define su metadata comercial; `/cotizar` es un redirect a `/#cotizar` y `/privacidad` define su metadata `noindex, follow`. `src/lib/metadata.ts` deja preparado un helper para metadata específica por página. `sitemap.ts` expone únicamente la homepage indexable.

El logo se sirve desde un asset identificado de GALAGOM mediante `next/image` y una regla explícita de `remotePatterns`. Las fotografías temporales se sirven localmente desde `public/images/temporary/` con `next/image`, y su procedencia está registrada en `docs/temporary-assets.md`. Leaflet usa configuración de tiles centralizada en `src/data/map-config.ts` y mantiene la atribución de OpenStreetMap.

## Siguientes fases

El contenido permanece en Server Components siempre que es posible. El formulario es Client Component; `/api/quote`, schema, adapters de email y metadata permanecen server-side. `site-structured-data.tsx` y `structured-data.ts` publican solo `Organization` y `WebSite` con datos confirmados. El servidor valida con el mismo schema, aplica honeypot y Origin, genera request ID y delega en Resend sin exponer secrets. Rate limiting distribuido, anti-spam avanzado y persistencia siguen pendientes.

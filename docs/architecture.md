# Arquitectura frontend

## Stack definitivo de Foundation

- Next.js `16.3.5`, App Router y React Server Components.
- React `19.2.8`.
- TypeScript estricto.
- Tailwind CSS `4` con tokens CSS en `src/styles/tokens.css`.
- ESLint `9` con configuración de Next.
- Manrope con `next/font`.

No se instalaron Motion, Lucide, React Hook Form, Zod, mapas, Playwright ni UI kits. Se añadirán únicamente al llegar a una fase que los necesite.

## Rendering

`src/app/layout.tsx`, `page.tsx`, header, footer y UI base son Server Components. Solo `mobile-navigation.tsx` es Client Component porque necesita estado y escucha de `Escape` para cerrar el menú.

No se usa estado global. Los datos públicos se centralizan en `src/data/site.ts` y los tipos simples viven en `src/types/site.ts`.

## Estructura

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
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
  data/site.ts
  lib/metadata.ts
  styles/tokens.css
  types/site.ts
```

## Convenciones

- Componentes con export default y una responsabilidad clara.
- HTML semántico, landmarks y enlaces reales.
- `Button` usa `Link` para destinos navegables y `<button>` para acciones nativas.
- Los IDs de navegación (`servicios`, `cobertura`, `nosotros`, `contacto`, `cotizar`) se preparan como anchors de fases futuras; la pantalla temporal no inventa esas secciones.
- No se publican schemas estructurados en Foundation: todavía no hay páginas comerciales finales ni datos locales completos confirmados.

## Metadata y assets

La metadata global está en `layout.tsx`, con `metadataBase`, canonical raíz, Open Graph y Twitter. `src/lib/metadata.ts` deja preparado un helper para metadata específica por página.

El logo se sirve desde un asset identificado de GALAGOM mediante `next/image` y una regla explícita de `remotePatterns`. No se han integrado fotografías de logística porque Discovery no pudo confirmar su propiedad o representación corporativa.

## Siguientes fases

La siguiente fase puede reemplazar `src/app/page.tsx` por la homepage comercial y añadir datos de servicios. Después se podrán incorporar Motion para interacciones con propósito, y React Hook Form/Zod cuando se implemente la cotización. Foundation debe permanecer libre de esas responsabilidades.

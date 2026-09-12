# Arquitectura frontend

## Stack definitivo de Foundation

- Next.js `16.3.5`, App Router y React Server Components.
- React `19.2.8`.
- TypeScript estricto.
- Tailwind CSS `4` con tokens CSS en `src/styles/tokens.css`.
- ESLint `9` con configuración de Next.
- Manrope con `next/font`.

Se añadió `motion` para los reveals ligeros de Homepage Core. No se instalaron Lucide, React Hook Form, Zod, mapas, Playwright ni UI kits.

## Rendering

`src/app/layout.tsx`, `page.tsx`, contenido de hero, servicios, nosotros, CTA, footer y UI base son Server Components. `site-header.tsx` es Client Component para observar la salida del hero mediante `IntersectionObserver` y cambiar de header transparente a header claro. `mobile-navigation.tsx` gestiona estado y `Escape`. `reveal.tsx` es un wrapper Client mínimo para Motion y reduced motion.

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
      reveal.tsx
    sections/
      hero.tsx
      trust-strip.tsx
      about-section.tsx
      final-cta.tsx
    services/
      service-card.tsx
      services-grid.tsx
  data/site.ts
  data/services.ts
  lib/metadata.ts
  styles/tokens.css
  types/site.ts
```

## Convenciones

- Componentes con export default y una responsabilidad clara.
- HTML semántico, landmarks y enlaces reales.
- `Button` usa `Link` para destinos navegables y `<button>` para acciones nativas.
- Los IDs de Homepage Core son `servicios`, `nosotros` y `contacto`; `cobertura` queda preparado en la navegación para la fase posterior.
- No se publican schemas estructurados en Foundation: todavía no hay páginas comerciales finales ni datos locales completos confirmados.

## Metadata y assets

La metadata global está en `layout.tsx`, con `metadataBase`, canonical raíz, Open Graph y Twitter. `src/lib/metadata.ts` deja preparado un helper para metadata específica por página.

El logo se sirve desde un asset identificado de GALAGOM mediante `next/image` y una regla explícita de `remotePatterns`. No se han integrado fotografías de logística porque Discovery no pudo confirmar su propiedad o representación corporativa.

## Siguientes fases

La siguiente fase puede añadir cobertura y proceso sin convertir la página completa en Client Component. React Hook Form/Zod siguen reservados para la cotización. El formulario, las páginas internas y la cobertura no forman parte de esta entrega.

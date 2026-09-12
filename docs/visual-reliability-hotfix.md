# Visual Reliability Hotfix

## Causa exacta

El contenido estaba oculto por estados iniciales de Motion antes de que existiera confirmación de viewport:

- `src/components/ui/reveal.tsx` usaba `initial={{ opacity: 0, y: 18 }}`.
- `src/components/process/process-timeline.tsx` iniciaba línea y pasos con escala/opacidad reducidas.
- `src/components/coverage/coverage-map.tsx` iniciaba las rutas con `pathLength: 0` y opacidad reducida.
- `src/components/three-pl/three-pl-network.tsx` iniciaba conexiones y nodos con escala/opacidad reducidas.

Si hidratación, `IntersectionObserver` o Motion se retrasaban, las secciones permanecían visualmente vacías. El problema no era el layout ni el contenido comercial.

## Corrección

Todos los elementos críticos usan `initial={false}`. Motion conserva sus estados `whileInView` como mejora visual, pero el HTML renderizado permanece visible si JavaScript falla, se deshabilita o el observer no dispara.

El header también combina `IntersectionObserver` con un fallback ligero basado en `scrollY`, y cambia el logo claro/oscuro junto con el fondo del header. Así no queda el logo blanco sobre superficie clara.

## Verificación

- Playwright revisó `/` y `/cotizar` en 320, 390, 768, 1440 y 1920 px.
- Se verificó un único H1 por documento.
- Se verificó ausencia de overflow horizontal.
- Se verificó ausencia de errores de consola.
- Contexto con JavaScript deshabilitado: H1 visible y HTTP 200 en ambas rutas.
- Menú móvil abre y cierra con Escape.
- Las capturas full-page contienen todas las secciones; Chromium puede repetir elementos `fixed` durante su composición, por lo que también se revisaron capturas de viewport real.

## Capturas

```text
docs/screenshots/hotfix-home-top-1440.png
docs/screenshots/hotfix-home-full-1440.png
docs/screenshots/hotfix-home-390.png
docs/screenshots/hotfix-quote-1440.png
docs/screenshots/hotfix-quote-390.png
```

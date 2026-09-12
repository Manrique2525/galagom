# Visual QA y UI polish

**Fecha:** 11 de septiembre de 2026  
**Rama:** `feature/ui-polish`  
**Entorno:** Next dev local con Chromium headless mediante Playwright únicamente para QA.

## Viewports revisados

- Homepage: 320x800, 390x844, 768x1024, 1440x1000 y 1920x1080.
- `/cotizar`: 320x800, 390x844, 768x1024, 1440x1000 y 1920x1080.
- Capturas finales: `docs/screenshots/home-390.png`, `home-1440.png`, `quote-390.png`, `quote-1440.png`.

## Hallazgos

| Issue | Severity | Viewport | Component | Observation | Correction | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Card 3PL sin contraste | HIGH | 1440x1000 y responsive | `ServiceCard` / `ServicesGrid` | La quinta card heredaba `bg-white` y texto claro por el orden generado de utilidades, haciendo que su contenido pareciera vacío. | Hacer que el variant featured controle explícitamente fondo, headings, párrafos, enlaces e índices dentro de `ServiceCard`. | Corregido |
| Full-page con elementos fixed | LOW, QA | Todas las full-page | Header / skip link | Chromium puede repetir o desplazar elementos `fixed` al componer una captura full-page; no ocurre en el viewport real. | El script activa reveals recorriendo la página y las capturas se complementan con revisión viewport real. No cambiar el header por este artefacto. | Documentado |
| Secciones Motion inicialmente ocultas durante captura rápida | LOW, QA | Full-page | `Reveal` | Capturar inmediatamente después de `networkidle` deja secciones bajo viewport en estado inicial. | QA recorre la página y espera 700 ms por sección antes de capturar. El comportamiento normal al hacer scroll es correcto. | Resuelto en QA |
| Icono de menú con bajo contraste sobre hero | HIGH | 390x844 | `MobileNavigation` | El botón móvil conservaba el color primario sobre el fondo azul oscuro transparente del hero. | El color del icono y borde cambia según el estado claro/oscuro del header. | Corregido |

## Revisión visual

- Hero: jerarquía clara, CTA principal dominante y composición abstracta consistente con logística B2B.
- Header: buen contraste sobre hero, transición correcta al estado claro y menú móvil usable.
- Trust strip: compacto, legible y diferenciado de una grid de cards.
- Services: composición asimétrica legible; la quinta card destacada ahora funciona como cierre visual.
- Process: línea horizontal en desktop y timeline vertical en móvil sin overflow visible.
- Coverage: mapa editorial reconocible, contraste suficiente y destinos acompañados de texto.
- About: estadística 17+ y copy equilibrados; visual abstracto intencional, no placeholder fotográfico.
- Units: ilustración genérica sin sugerir un modelo de flota concreto.
- 3PL: red diferenciada del proceso y transformación vertical en móvil.
- CTA/footer: cierre claro, teléfono como alternativa secundaria y sin enlaces comerciales inventados.
- `/cotizar`: formulario sencillo, labels visibles, dimensiones cómodas y layout de una columna en móvil.

## Límites de QA

- No se ejecutó Lighthouse; no se atribuyen scores ni métricas Core Web Vitals.
- Playwright se usa solo para screenshots, rutas, overflow, H1, consola y menú móvil.
- La navegación con Tab/Shift+Tab se cubrió mediante inspección de markup y focus states, pero no se simuló manualmente en un navegador interactivo.

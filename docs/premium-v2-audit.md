# Premium Redesign V2 Audit

**Rama:** `feature/premium-v2`  
**Baseline:** capturas de la versión aprobada de Fase 9, conservadas como `v2-before-1440.png` y `v2-before-390.png`.  
**Objetivo:** elevar composición y percepción premium sin cambiar datos comerciales, backend ni accesibilidad.

## Before review

| Issue | Severity | Observation | Direction |
| --- | --- | --- | --- |
| Jerarquía plana | HIGH | Hero, servicios, proceso y contacto repetían una estructura similar de eyebrow, heading, párrafo y bloque. | Alternar rail editorial, bento, split, mapa, network y formulario protagonista. |
| Hero poco memorable | HIGH | La fotografía estaba contenida en un panel correcto pero con poca presencia editorial. | Mantener copy/ruta, integrar foto full-bleed con depth y proof rail. |
| Formulario fuera de la landing narrativa | HIGH | La conversión estaba visualmente separada de la historia principal. | Formulario completo dentro de `#cotizar`, sin duplicar `/cotizar`. |
| About como tarjeta estadística | MEDIUM | El 17+ dominaba una superficie pequeña y separada. | Fotografía vertical, badge y contenido editorial en composición asimétrica. |
| Unidades como sección de relleno | MEDIUM | La ilustración de unidades podía leerse como placeholder de flota. | Integrar su mensaje en About/Process y eliminar la sección independiente. |
| Footer genérico | MEDIUM | El CTA y footer terminaban como dos bloques sin continuidad fuerte. | Cierre más compacto y línea de ruta sobre copyright. |
| Mapa aislado | MEDIUM | Leaflet funcionaba, pero parecía una card añadida a posteriori. | Microbarra, leyenda, tratamiento OSM y proporción 40/60. |

## After review

| Section | Status | Review |
| --- | --- | --- |
| Hero | PASS | Copy izquierda, fotografía logística visible, ruta y proof rail integrados bajo navbar sticky blanco. |
| Trust | PASS | Una sola rail compacta; no se duplica una segunda franja de cards. |
| Services | PASS | Bento asimétrico con dos fotografías, card 3PL destacada y jerarquía de tamaños. |
| Process | PASS | Columna editorial sticky en desktop, timeline vertical natural en mobile, texto visible desde SSR. |
| Coverage | PASS | Leaflet conserva tiles, markers, rutas, attribution y lista textual. |
| About | PASS | Fotografía grande, 17+ editorial y valores sin apariencia de dashboard. |
| Units | PASS | Mensaje integrado en About; no existe una sección vacía o falsa de flota. |
| 3PL | PASS | Imagen secundaria oscurecida y network principal, sin cinco cards repetidas. |
| Quote | PASS | Formulario completo protagonista dentro de homepage con ruta decorativa y estados existentes. |
| Footer | PASS | Menor altura visual, navegación/contacto/privacidad y cierre con línea de nodos. |

## QA evidence

- Homepage: `320`, `375`, `390`, `430`, `768`, `1024`, `1440` y `1920`.
- `/cotizar`: redirect a `/#cotizar` verificado.
- Leaflet: tiles OSM, cuatro markers, tres polylines, popups y attribution verificados.
- Formulario: invalid, 503, conservación de datos y mobile verificados.
- No se añadieron contenido comercial, servicios, clientes, métricas ni integraciones nuevas.

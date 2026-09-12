# Premium Redesign V3 Audit

**Rama:** `feature/premium-v3`  
**Baseline:** `docs/screenshots/v3-before-hero.png` y `docs/screenshots/v3-before-services.png`, extraídas del commit aprobado `e65d261` de Premium V2 antes de esta reconstrucción.  
**Foco:** Hero y Services, sin modificar backend, Leaflet, SEO, privacidad ni seguridad.

## Before review

| Problema | Severidad | Observación | Decisión |
| --- | --- | --- | --- |
| Hero tipo panel | HIGH | La imagen y la ruta estaban confinadas a una tarjeta vertical separada del copy. | Convertir la media en fondo/bleed de una composición hero con mayor presencia fotográfica. |
| Hero poco inmersivo | HIGH | El fondo tenía profundidad gráfica, pero la fotografía no comunicaba operación con suficiente claridad. | Subir visibilidad de la foto y conservar overlay/route como capas secundarias. |
| Navbar pequeño | MEDIUM | El logo y la navegación ocupaban poco espacio visual y no establecían una entrada de marca fuerte. | Aumentar presencia dentro de la altura sticky existente. |
| Proof repetitivo | MEDIUM | Los datos se percibían como una fila de mini estadísticas. | Convertirlos en un proof rail único integrado al Hero. |
| Servicios como cards medianas | HIGH | La grid organizaba cinco cards similares y las imágenes ocupaban franjas pequeñas. | Reconstruir como bloques editoriales de imagen grande, con una sola card 3PL especial. |
| Almacenaje débil | HIGH | La fotografía de almacén no tenía suficiente área ni protagonismo. | Convertirlo en bloque visual con imagen dominante. |
| Carga nacional plana | MEDIUM | La card blanca tenía demasiado espacio sin una imagen o composición fuerte. | Integrarla a un bloque compartido con jerarquía visual. |

## Estrategia V3

- Usar imagen estática local, no video: el asset existente ya comunica camión y operación, evita peso de video y mantiene LCP más predecible.
- Mantener `logistics-hero.webp`, `freight-truck.webp` y `warehouse.webp` sin añadir stock adicional.
- Compartir tratamiento: overlay azul cuando el bloque es oscuro, contraste moderado, radios del sistema y escala hover máxima 1.025.
- Usar ruta/nodos como continuidad de marca, no como decoración repetida.
- Mantener el H1 y el copy verificado, con `text-wrap: balance` y CTA blanco dominante.
- Mantener el formulario completo en `#cotizar` y la API sin cambios.

## After review

| Section | Status | Review |
| --- | --- | --- |
| Hero | PASS | Media visible y dominante, copy legible, CTA contrastado, proof rail integrada y composición no dependiente de una card lateral. |
| Services | PASS | Bloques grandes con fotografía, jerarquía entre Fletes, Almacenaje, Carga, Reparto y 3PL, sin cinco tarjetas equivalentes. |
| Process | PASS | Se conserva la columna editorial y timeline vertical, sin cambios funcionales. |
| Coverage | PASS | Leaflet se conserva con markers, rutas, attribution y lista HTML. |
| About | PASS | Fotografía editorial y tratamiento previo conservados. |
| 3PL | PASS | Network central e imagen oscurecida conservados. |
| Quote | PASS | Formulario completo continúa dentro de homepage. |
| Footer | PASS | Footer compacto y conectado visualmente con el cierre. |

## QA evidence

- Homepage: `320`, `375`, `390`, `430`, `768`, `1024`, `1280`, `1440` y `1920`.
- `/cotizar`: redirect a `/#cotizar`.
- Leaflet: cuatro markers, tres polylines, popups y attribution.
- Formulario: validación, 503 sin credenciales y conservación de datos.
- No se añadió contenido comercial ni ninguna integración externa nueva.

# Design system GALAGOM

## Filosofia

Foundation establece una interfaz sobria y operativa para una empresa B2B de logística: claridad, precisión, confianza y movimiento contenido. La pantalla de Foundation es deliberadamente estática; no representa todavía la homepage comercial.

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-primary` | `#203050` | Acciones principales |
| `--color-primary-dark` | `#16243D` | Fondos oscuros |
| `--color-primary-soft` | `#30466F` | Hover y superficies azules |
| `--color-secondary` | `#585E70` | Texto secundario |
| `--color-white` | `#FFFFFF` | Fondos y texto sobre oscuro |
| `--color-surface` | `#F5F7FA` | Superficies suaves |
| `--color-border` | `#E1E5EB` | Separadores y controles |
| `--color-text` | `#151B26` | Texto principal |
| `--color-text-muted` | `#697386` | Texto auxiliar |

Gradiente corporativo reservado para fases posteriores:

```css
linear-gradient(135deg, #16243D 0%, #203050 45%, #30466F 100%)
```

## Tipografia

Manrope es la única familia actual. Se carga mediante `next/font/google` y se expone como `--font-manrope`. La escala inicial usa display/H1 de `text-3xl` a `text-5xl`, body de 16 a 18 px y labels pequeños en mayúsculas con tracking amplio.

## Spacing y layout

- Container global: `1280px` máximo.
- Padding horizontal: `20px` móvil, `32px` tablet, `40px` desktop.
- Spacing base: escala Tailwind, sin valores arbitrarios por sección.
- Breakpoints: los definidos por Tailwind (`sm`, `lg`) hasta que una necesidad real justifique otro token.

## Componentes

- `Container`: ancho y padding horizontal compartidos.
- `Button`: variantes `primary`, `secondary`, `ghost`; tamaños `default` y `large`.
- `SectionHeading`: eyebrow opcional, heading, descripción y alineación.
- Header, navegación móvil, footer y skip link forman la base de layout.

## Radius y sombras

- `--radius-sm`: controles y botones.
- `--radius-md`: elementos de interfaz intermedios.
- `--radius-lg`: superficies grandes.
- `--shadow-soft`: elevación discreta, reservada a overlays y superficies que lo necesiten.

## Motion principles

Homepage Core usa Motion únicamente para reveals de secciones y cards cuando entran al viewport. Las transiciones CSS cubren color, border, elevación y desplazamientos mínimos. No hay parallax, rutas animadas ni animaciones infinitas. `useReducedMotion` elimina el desplazamiento y deja el contenido visible directamente; la animación nunca es necesaria para comprender el contenido.

Los fondos del hero, cobertura y CTA usan exclusivamente la gama azul corporativa, con grid técnico y rutas SVG como lenguaje visual de movimiento. El mapa y las ilustraciones de unidades usan el mismo stroke fino, nodos circulares y proporciones contenidas.

## Patrones de Logistics Experience

- El proceso usa una línea de progreso única: horizontal en desktop y vertical en móvil.
- Cobertura usa un SVG editorial del estado con Cancún como nodo principal y rutas hacia Holbox, Isla Mujeres y Cozumel.
- Unidades usa una ilustración lineal genérica; no representa un modelo específico de vehículo.
- 3PL usa una red horizontal de servicios conectados en desktop y un eje vertical en móvil, diferenciándose del timeline de proceso.

## Motion

- `process-timeline`, `coverage-map` y `three-pl-network` dibujan líneas una sola vez al entrar en viewport.
- Las duraciones de rutas y conexiones se mantienen entre 900 y 1000 ms; los reveals de copy usan 550 ms.
- `useReducedMotion` muestra líneas, nodos y contenido completos desde el inicio.
- No hay loops, partículas, parallax, canvas ni WebGL.

## Form controls

- Inputs, select nativo y textarea usan surface claro, border corporativo, radius pequeño y focus ring azul.
- Los labels son siempre visibles; el placeholder solo aporta contexto.
- Los errores usan texto claro, color de error contenido y `aria-describedby`.
- La composición del formulario es de una columna en móvil y usa dos columnas selectivamente desde `sm`.
- Los controles mantienen altura táctil cómoda y no dependen de hover.

## Temporary photography

Las fotografías actuales de Pexels son un recurso temporal y siempre se presentan como contexto de transporte/logística, nunca como flota, personal o instalaciones de GALAGOM. Se usa overlay azul corporativo y `object-cover` para integrarlas con los diagramas. El Hero es la única imagen con `priority`; las imágenes de cards y Nosotros son lazy por defecto. Fuentes y sustitución: `docs/temporary-assets.md`.

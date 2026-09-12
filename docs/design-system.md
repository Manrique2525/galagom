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

Foundation usa solo transiciones CSS de color, border y focus. No hay reveals, parallax, rutas ni scroll animations. Se respetará `prefers-reduced-motion` en todo el proyecto; la animación de fases posteriores será progresiva y no necesaria para comprender el contenido.

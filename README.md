# GALAGOM

Base frontend para el rediseño de **GALAGOM - Soluciones Logísticas**, empresa de transporte y logística en Cancún y Quintana Roo.

## Estado

Foundation completada. La página actual es una pantalla temporal para validar el sistema visual, la navegación, la accesibilidad y el comportamiento responsive. La homepage comercial se implementará en fases posteriores.

## Stack

- Next.js 16.3.5 con App Router
- React 19.2.8
- TypeScript 5 en modo estricto
- Tailwind CSS 4
- ESLint 9 con `eslint-config-next`
- Manrope mediante `next/font`

No se han añadido todavía formularios, mapas, animaciones de scroll ni dependencias de estado.

## Requisitos

- Node.js compatible con Next.js 16
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Verificación

```bash
npm run lint
npm run typecheck
npm run build
npm run qa:visual
```

`qa:visual` requiere un servidor local activo, por ejemplo `npm run dev`, y genera las capturas de revisión en `docs/screenshots/`.

## Estructura

```text
src/
  app/                 # rutas y layout raíz
  components/          # layout, navegación y UI reutilizable
  data/                # configuración pública del sitio
  lib/                 # helpers desacoplados
  styles/              # tokens CSS
  types/               # tipos simples compartidos
  content-audit.md     # fuente de verdad del contenido auditado
  design-system.md     # tokens y reglas visuales
  architecture.md      # decisiones técnicas
```

## Decisiones importantes

- GALAGOM mantiene un repositorio independiente dentro de esta carpeta.
- El logo remoto usado por Foundation es un asset identificado de GALAGOM y está restringido mediante `remotePatterns`.
- El correo publicado se centraliza, pero no se muestra como canal comercial en Foundation hasta su validación.
- No se usan assets de Divi, Mudatodo, stock genérico ni contenido de prueba.

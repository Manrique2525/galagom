# Deployment

## Release Candidate 1

Este proyecto requiere un entorno compatible con Next.js App Router y Node.js. No se ha elegido proveedor de hosting ni se ha creado configuración específica de plataforma.

## Requisitos genéricos

- Node.js compatible con Next.js 16.
- Instalación reproducible mediante `npm ci`.
- Build: `npm run build`.
- Runtime: `npm run start` o el comando equivalente del proveedor.
- HTTPS obligatorio para producción.
- Dominio personalizado `https://www.galagom.com`.
- Variables de entorno configuradas en el panel seguro del proveedor.
- Logs server-side sin PII.

## Variables necesarias al activar servicios

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
RESEND_API_KEY
QUOTE_RECIPIENT_EMAIL
QUOTE_FROM_EMAIL
```

No colocar valores en Git ni en imágenes/build logs. La API key de Google debe restringirse por HTTP referrers y Maps JavaScript API; Resend debe utilizar un dominio remitente verificado.

## Pre-deploy

Seguir `docs/release-checklist.md`. El aviso `/privacidad` permanece `noindex` hasta aprobación. Registrar redirects/410 de WordPress en el hosting, enviar el sitemap a Search Console y probar el formulario con una cuenta de correo controlada antes de abrirlo al público.

## Rate limiting y CSP

Rate limiting distribuido debe resolverse con la plataforma, WAF/edge o Redis/Upstash; no usar el Map en memoria de una instancia. Una CSP debe definirse después de confirmar los dominios de Google Maps, fuentes y assets, para no romper el runtime por cumplir un checklist prematuro.

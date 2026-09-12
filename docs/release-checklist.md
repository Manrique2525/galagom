# Release Candidate 1 checklist

## Antes de deploy

- [ ] Aviso de privacidad aprobado.
- [ ] Email ARCO confirmado.
- [ ] Razón social confirmada.
- [ ] Dirección confirmada si se publicará.
- [ ] Leaflet/OpenStreetMap tiles revisados.
- [ ] Attribution de OpenStreetMap visible.
- [ ] Resend API key.
- [ ] Dominio verificado en Resend.
- [ ] `QUOTE_RECIPIENT_EMAIL`.
- [ ] `QUOTE_FROM_EMAIL`.
- [ ] Estrategia de rate limiting.
- [ ] Anti-spam final.
- [ ] Fotografías GALAGOM o aceptación temporal documentada.
- [ ] DNS.
- [ ] HTTPS.
- [ ] Search Console.
- [ ] Sitemap.
- [ ] Robots.
- [ ] Form submission test real.
- [ ] WhatsApp wa.me está vinculado al canal oficial.
- [ ] WhatsApp tooltip y mensaje prefijado revisados. `npm run qa:whatsapp`.

## Verificaciones técnicas

- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm test`.
- [ ] `npm run build`.
- [ ] `npm run qa:visual`.
- [ ] `npm run test:e2e` sin credenciales reales.
- [ ] `npm run qa:mobile-menu`.
- [ ] `npm run qa:whatsapp`.
- [ ] HTTP smoke de `/`, `/cotizar` redirect, `/#cotizar`, `/privacidad`, `/robots.txt`, `/sitemap.xml` y 404.
- [ ] Revisar headers y requests de terceros en producción.

## Performance audit

Local Lighthouse not executed: se evaluó instalarlo, pero sus dependencias transitorias introdujeron vulnerabilidades y se retiró del Release Candidate. La revisión disponible usa Playwright para viewports, consola, overflow y rutas; Core Web Vitals deben medirse en el entorno final.

# Migración desde WordPress

## URLs indexables en Next.js

| URL nueva | Estado | Acción |
| --- | --- | --- |
| `/` | Publicable | Canonical a `https://www.galagom.com/`. |
| `/#cotizar` | Conversión homepage | El formulario completo vive dentro de la landing. |

`/servicios` no se crea en esta fase: con el contenido disponible sería una copia del grid de homepage y no tendría valor independiente suficiente. Tampoco se crean páginas individuales de servicios o localidades.

`/privacidad` existe técnicamente con `noindex, follow`, permanece fuera del sitemap y requiere revisión legal antes de indexarse.

## Rutas heredadas

- `/cotizar/` tiene equivalente en `/cotizar`, que ahora redirige a `/#cotizar`; verificar la redirección y su trailing slash en el hosting/deployment.
- `/borrar/` es contenido de prueba; preferir `410 Gone`, no redirigirlo a homepage.
- `/2024/10/30/hello-world/` es una entrada WordPress de prueba; preferir `410 Gone`, no redirigirla a homepage.
- Categorías, autor, comentarios, feeds y `locations.kml` no tienen equivalente comercial; retirar o responder `410` según el comportamiento del hosting.

Next no recrea estas rutas y no se añadieron redirects engañosos dentro de la aplicación.

## Sitemap y Search Console

1. Publicar `sitemap.xml` generado por `src/app/sitemap.ts` con solo `/`.
2. Publicar `robots.txt` generado por `src/app/robots.ts` y verificar la URL absoluta del sitemap.
3. Validar respuestas 200, canonical y metadata en producción.
4. Registrar los redirects/410 heredados en el proveedor de hosting.
5. Enviar el sitemap nuevo en Google Search Console y revisar cobertura, canonicales y errores 404.
6. Mantener el dominio productivo `https://www.galagom.com`; no usar localhost ni previews en metadata.

## Seguridad de deployment

Se añadieron `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy` mediante `next.config.ts`. No se añadió CSP porque las imágenes remotas de GALAGOM y la fuente de Next requieren una política verificada en el entorno final; definirla después de confirmar si los assets se servirán localmente.

## Pendientes antes de producción

- Endpoint real de cotización y validación server-side.
- Protección anti-spam y política de retención.
- Aviso de privacidad definitivo.
- Confirmación de email, horario, dirección y fotografías corporativas.

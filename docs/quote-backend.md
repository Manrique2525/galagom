# Backend de cotizaciones

## Arquitectura

```text
QuoteForm
  -> POST /api/quote
  -> Content-Type / Origin / payload limits
  -> honeypot
  -> quoteSchema server-side
  -> configuración Resend
  -> EmailProvider
  -> Resend
```

El único método implementado es `POST`. No existen endpoints GET, PUT, PATCH o DELETE para cotizaciones.

## Variables de entorno

```text
RESEND_API_KEY=
QUOTE_RECIPIENT_EMAIL=
QUOTE_FROM_EMAIL=
```

El servidor responde `503` si falta cualquiera de las tres. No se registran datos personales completos y ninguna key llega al navegador.

## Validación y respuestas

El servidor reutiliza `quoteSchema` como autoridad y usa `z.strictObject` para rechazar campos inesperados. Rechaza JSON mal formado con `400`, payload inválido con `422`, configuración incompleta con `503` y fallos del provider con `500`. Las respuestas no incluyen stack traces, keys ni errores crudos de Resend.

## Email

El provider usa Resend exclusivamente en servidor, envía `text/plain`, define `replyTo` con el correo del cliente y usa `QUOTE_FROM_EMAIL` como remitente. La descripción se conserva como texto plano; no se interpola como HTML ni se usa `dangerouslySetInnerHTML`.

## Anti-spam y seguridad

- `website` funciona como honeypot; si llega rellenado, se responde éxito genérico sin invocar Resend.
- `Origin` se valida de forma conservadora para `galagom.com`, `www.galagom.com` y localhost; solicitudes sin Origin se toleran para clientes legítimos que no lo envían.
- El body está limitado a 64 KB, el schema limita cada string y no acepta arrays/objetos inesperados.
- Cada request recibe un `crypto.randomUUID()` para correlación sin PII.
- Rate limiting distribuido, Turnstile/honeypot avanzado, idempotencia y validación server-side adicional del deployment quedan pendientes de infraestructura.

## Pruebas

Vitest mockea el provider y cubre payload válido, campos obligatorios, email/teléfono, servicios, fecha opcional, límites, unexpected fields, JSON inválido, 422, 503, honeypot y contenido `<script>` como texto. `npm test` nunca llama a Resend.

## Producción

Antes de publicar el formulario se debe configurar Resend, verificar el dominio remitente, definir destinatario, repetir validación server-side en cualquier capa adicional y aprobar el aviso de privacidad definitivo. No configurar valores reales en Git ni en `.env.example`.

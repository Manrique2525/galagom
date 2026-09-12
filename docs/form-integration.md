# Integración de cotización

## Estado actual

La sección `/#cotizar` de la homepage contiene el formulario y la validación cliente. `/cotizar` redirige a ese anchor. El navegador envía JSON a `POST /api/quote`; el servidor vuelve a validar, aplica anti-spam y entrega el mensaje al adapter de Resend cuando la configuración existe.

La validación en cliente mejora la experiencia, pero el futuro servidor deberá validar nuevamente todo el payload antes de procesarlo.

## Payload

El schema `src/lib/quote-schema.ts` define el contrato único:

- `name`: nombre del contacto.
- `phone`: teléfono en formatos comunes, incluyendo espacios, paréntesis, guiones y prefijo.
- `email`: correo de contacto.
- `service`: uno de los cinco servicios confirmados u `Otro / Necesito asesoría`.
- `origin`: origen escrito libremente.
- `destination`: destino escrito libremente.
- `date`: fecha estimada opcional.
- `description`: descripción de la carga o necesidad.
- `website`: honeypot vacío para usuarios; no forma parte del email.

El tipo `QuoteFormData` se deriva directamente con `z.infer<typeof quoteSchema>`.

## Integración actual y futura

`src/app/api/quote/route.ts` es el límite server-side. `resend-email-provider.ts` implementa `EmailProvider`, por lo que Resend puede sustituirse sin cambiar el formulario o schema. El formulario muestra éxito únicamente cuando el Route Handler recibe una aceptación real del provider.

No usar Resend, SendGrid, Nodemailer, Formspree, EmailJS o un CRM sin una decisión explícita del proyecto.

## Anti-spam

Antes de producción evaluar honeypot, rate limiting y una solución de baja fricción como Turnstile. No se instaló CAPTCHA en esta fase.

## Estados

- `idle`: formulario listo.
- `submitting`: intento de integración en curso.
- `error`: canal de recepción no configurado o fallo real.
- `success`: solo después de una respuesta exitosa del endpoint y provider.

## Tests

Vitest cubre schema, Route Handler, JSON inválido, 422, 503, honeypot, campos inesperados y payload con contenido `<script>` tratado como texto plano. No se realizan llamadas reales a Resend.

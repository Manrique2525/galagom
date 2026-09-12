# Integración de cotización

## Estado actual

La ruta `/cotizar` contiene el formulario, la validación cliente y una interfaz de servicio desacoplada. No existe endpoint GALAGOM confirmado, por lo que `quoteSubmissionService` lanza explícitamente `QuoteSubmissionUnavailableError`. La UI no muestra un éxito falso ni envía datos a un tercero.

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

El tipo `QuoteFormData` se deriva directamente con `z.infer<typeof quoteSchema>`.

## Integración futura

El proveedor real debe implementar `QuoteSubmissionService` y recibir el payload mediante una ruta de servidor o servicio aprobado. Esa integración deberá definir endpoint, respuesta, timeout, errores de red, confirmación real antes del éxito, protección de datos y retención.

No usar Resend, SendGrid, Nodemailer, Formspree, EmailJS o un CRM sin una decisión explícita del proyecto.

## Anti-spam

Antes de producción evaluar honeypot, rate limiting y una solución de baja fricción como Turnstile. No se instaló CAPTCHA en esta fase.

## Estados

- `idle`: formulario listo.
- `submitting`: intento de integración en curso.
- `error`: canal de recepción no configurado o fallo real.
- No existe `success` hasta que una integración real confirme la recepción.

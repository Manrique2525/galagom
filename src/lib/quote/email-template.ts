import type { QuoteFormData } from "@/lib/quote-schema";

const COLORS = {
  primary: "#203050",
  primaryDark: "#16243D",
  accent: "#30466F",
  text: "#1F2937",
  muted: "#585E70",
  border: "#E1E5EB",
  bg: "#F5F7FA",
  white: "#FFFFFF",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function formatDate(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return escapeHtml(trimmed);
}

function getLogoUrl() {
  const envUrl = process.env.QUOTE_EMAIL_LOGO_URL?.trim();
  if (envUrl) return envUrl;
  return undefined;
}

type EmailContent = {
  html: string;
  text: string;
};

export function buildQuoteEmail(data: QuoteFormData): EmailContent {
  const logoUrl = getLogoUrl();
  const date = formatDate(data.date);
  
  const rows: Array<{ label: string; value: string; multiline?: boolean }> = [];
  rows.push({ label: "Nombre del contacto", value: escapeHtml(data.name.trim()) });
  rows.push({ label: "Correo electrónico", value: escapeHtml(data.email.trim()) });
  rows.push({ label: "Teléfono", value: escapeHtml(data.phone.trim()) });
  rows.push({ label: "Tipo de servicio solicitado", value: escapeHtml(data.service) });
  rows.push({ label: "Origen", value: escapeHtml(data.origin.trim()) });
  rows.push({ label: "Destino", value: escapeHtml(data.destination.trim()) });
  if (date) rows.push({ label: "Fecha estimada", value: date });
  rows.push({ label: "Detalles de la solicitud", value: nl2br(data.description.trim()), multiline: true });

  const htmlRows = rows
    .map(
      (row) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; width: 40%; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 600; color: ${COLORS.muted}; vertical-align: top;">${row.label}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: ${COLORS.text}; vertical-align: top;">${row.value}</td>
        </tr>
      `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva solicitud de cotización - GALAGOM</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bg};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLORS.bg};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; width: 100%;">
          <tr>
            <td style="background-color: ${COLORS.primary}; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    ${logoUrl
                      ? `<img src="${escapeHtml(logoUrl)}" alt="GALAGOM - Soluciones Logísticas" width="140" style="display: block; max-width: 140px; height: auto;" />`
                      : `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; color: ${COLORS.white}; letter-spacing: 0.02em;">GALAGOM</div><div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 600; color: #C1CDE0; letter-spacing: 0.24em; margin-top: 4px;">SOLUCIONES LOGÍSTICAS</div>`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${COLORS.white}; padding: 32px; border: 1px solid ${COLORS.border}; border-top: none;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <div style="display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; color: ${COLORS.accent}; letter-spacing: 0.2em; text-transform: uppercase;">NUEVA SOLICITUD</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; color: ${COLORS.primary}; line-height: 1.3;">Nueva solicitud de cotización</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: ${COLORS.muted};">Has recibido una nueva solicitud a través del sitio web de GALAGOM. A continuación encontrarás los datos proporcionados por el cliente.</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid ${COLORS.border}; border-radius: 6px; overflow: hidden;">
                      <tbody>
                        ${htmlRows}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.6; color: ${COLORS.muted};">Puedes responder directamente a este correo utilizando <strong style="color: ${COLORS.text};">${escapeHtml(data.email.trim())}</strong>.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${COLORS.white}; padding: 24px 32px; border: 1px solid ${COLORS.border}; border-top: none; border-radius: 0 0 8px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 600; color: ${COLORS.primary};">GALAGOM — Soluciones Logísticas</div>
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: ${COLORS.muted}; margin-top: 4px;">Gracias por confiar en GALAGOM para tus necesidades logísticas.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textLines = [
    "GALAGOM — SOLUCIONES LOGÍSTICAS",
    "",
    "NUEVA SOLICITUD",
    "Nueva solicitud de cotización",
    "",
    "Has recibido una nueva solicitud a través del sitio web de GALAGOM.",
    "A continuación encontrarás los datos proporcionados por el cliente.",
    "",
    "--- DATOS DE LA SOLICITUD ---",
    "",
  ];

  for (const row of rows) {
    textLines.push(`${row.label}:`);
    textLines.push(row.value.replace(/<br \/>/g, "\n"));
    textLines.push("");
  }

  textLines.push("---");
  textLines.push(`Puedes responder directamente a este correo: ${data.email.trim()}`);
  textLines.push("");
  textLines.push("GALAGOM — Soluciones Logísticas");
  textLines.push("Gracias por confiar en GALAGOM para tus necesidades logísticas.");

  const text = textLines.join("\n");

  return { html, text };
}

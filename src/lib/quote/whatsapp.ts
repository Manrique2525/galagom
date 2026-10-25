import type { QuoteFormData } from "@/lib/quote-schema";

export const GALAGOM_WHATSAPP_NUMBER = "529982225373";

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  const stringValue = String(value).trim();
  return stringValue;
}

export function buildQuoteWhatsAppMessage(data: QuoteFormData): string {
  const lines: string[] = [];
  lines.push("GALAGOM - Solicitud de cotización");
  lines.push("");
  lines.push("Datos del cliente:");
  lines.push(`- Nombre: ${formatValue(data.name)}`);
  lines.push(`- Teléfono: ${formatValue(data.phone)}`);
  lines.push(`- Correo electrónico: ${formatValue(data.email)}`);
  lines.push("");
  lines.push("Detalles de la solicitud:");
  lines.push(`- Tipo de servicio: ${formatValue(data.service)}`);
  lines.push(`- Origen: ${formatValue(data.origin)}`);
  lines.push(`- Destino: ${formatValue(data.destination)}`);
  if (formatValue(data.date)) {
    lines.push(`- Fecha estimada: ${formatValue(data.date)}`);
  }
  lines.push("");
  lines.push("Descripción:");
  lines.push(formatValue(data.description));
  lines.push("");
  lines.push("Enviado desde galagom.com");
  return lines.join("\n");
}

export function buildQuoteWhatsAppUrl(data: QuoteFormData): string {
  const message = buildQuoteWhatsAppMessage(data);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${GALAGOM_WHATSAPP_NUMBER}?text=${encoded}`;
}

import { Resend } from "resend";
import type { QuoteFormData } from "@/lib/quote-schema";
import type { EmailProvider } from "@/lib/quote/email-provider";

export class EmailProviderNotConfiguredError extends Error {
  constructor() {
    super("Quote email provider is not configured.");
    this.name = "EmailProviderNotConfiguredError";
  }
}

export function isQuoteEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_RECIPIENT_EMAIL && process.env.QUOTE_FROM_EMAIL);
}

export function formatQuoteEmailText(data: QuoteFormData) {
  return [
    "Nueva solicitud de cotización",
    "",
    `Nombre: ${data.name}`,
    `Teléfono: ${data.phone}`,
    `Correo: ${data.email}`,
    `Servicio: ${data.service}`,
    `Origen: ${data.origin}`,
    `Destino: ${data.destination}`,
    `Fecha estimada: ${data.date || "No indicada"}`,
    "",
    "Descripción:",
    data.description,
  ].join("\n");
}

export const resendEmailProvider: EmailProvider = {
  async sendQuote(data, requestId) {
    if (!isQuoteEmailConfigured()) throw new EmailProviderNotConfiguredError();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL ?? "",
      to: process.env.QUOTE_RECIPIENT_EMAIL ?? "",
      replyTo: data.email,
      subject: "Nueva solicitud de cotización — GALAGOM",
      text: formatQuoteEmailText(data),
      headers: { "X-Galagom-Request-Id": requestId },
    });
    if (error) {
      const providerError = new Error("Resend rejected the quote email.");
      providerError.name = "EmailProviderError";
      throw providerError;
    }
  },
};

import { Resend } from "resend";
import type { QuoteFormData } from "@/lib/quote-schema";
import type { EmailProvider } from "@/lib/quote/email-provider";
import { buildQuoteEmail } from "@/lib/quote/email-template";

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
  return buildQuoteEmail(data).text;
}

export const resendEmailProvider: EmailProvider = {
  async sendQuote(data, requestId) {
    if (!isQuoteEmailConfigured()) throw new EmailProviderNotConfiguredError();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { html, text } = buildQuoteEmail(data);
    const { error } = await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL ?? "",
      to: process.env.QUOTE_RECIPIENT_EMAIL ?? "",
      replyTo: data.email,
      subject: "Nueva solicitud de cotización — GALAGOM",
      html,
      text,
      headers: { "X-Galagom-Request-Id": requestId },
    });
    if (error) {
      const providerError = new Error("Resend rejected the quote email.");
      providerError.name = "EmailProviderError";
      throw providerError;
    }
  },
};

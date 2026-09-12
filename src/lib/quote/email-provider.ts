import type { QuoteFormData } from "@/lib/quote-schema";

export interface EmailProvider {
  sendQuote(data: QuoteFormData, requestId: string): Promise<void>;
}

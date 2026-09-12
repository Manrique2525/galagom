import type { QuoteFormData } from "@/lib/quote-schema";

export interface QuoteSubmissionService {
  submit(data: QuoteFormData): Promise<void>;
}

export class QuoteSubmissionUnavailableError extends Error {
  constructor() {
    super("Quote submission channel is not configured.");
    this.name = "QuoteSubmissionUnavailableError";
  }
}

export const quoteSubmissionService: QuoteSubmissionService = {
  async submit(data) {
    void data;
    throw new QuoteSubmissionUnavailableError();
  },
};

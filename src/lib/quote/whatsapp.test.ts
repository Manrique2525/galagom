import { describe, expect, it } from "vitest";
import { buildQuoteWhatsAppMessage, buildQuoteWhatsAppUrl, GALAGOM_WHATSAPP_NUMBER } from "@/lib/quote/whatsapp";
import type { QuoteFormData } from "@/lib/quote-schema";

const baseData: QuoteFormData = {
  name: "María López",
  phone: "998 222 5373",
  email: "maria@example.com",
  service: "Carga nacional y local",
  origin: "Cancún",
  destination: "Cozumel",
  date: "2026-12-01",
  description: "Transportar 2 pallets con productos frágiles.\nRequiere cuidado especial.",
  website: "",
};

describe("WhatsApp quote handoff", () => {
  it("uses the correct GALAGOM WhatsApp number", () => {
    const url = buildQuoteWhatsAppUrl(baseData);
    expect(url).toContain(`https://wa.me/${GALAGOM_WHATSAPP_NUMBER}?text=`);
    expect(GALAGOM_WHATSAPP_NUMBER).toBe("529982225373");
  });

  it("includes all relevant fields in the message", () => {
    const message = buildQuoteWhatsAppMessage(baseData);
    expect(message).toContain("María López");
    expect(message).toContain("998 222 5373");
    expect(message).toContain("maria@example.com");
    expect(message).toContain("Carga nacional y local");
    expect(message).toContain("Cancún");
    expect(message).toContain("Cozumel");
    expect(message).toContain("2026-12-01");
    expect(message).toContain("Transportar 2 pallets con productos frágiles.");
  });

  it("encodes accents, newlines and special characters", () => {
    const url = buildQuoteWhatsAppUrl(baseData);
    expect(url).toContain("text=");
    // Should be encoded (no raw newlines in URL)
    expect(url).not.toContain("\n");
    // Accented characters should be encoded
    expect(decodeURIComponent(url)).toContain("María");
  });
});

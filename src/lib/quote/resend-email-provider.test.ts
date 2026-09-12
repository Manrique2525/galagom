import { describe, expect, it } from "vitest";
import { formatQuoteEmailText } from "@/lib/quote/resend-email-provider";

describe("quote email text", () => {
  it("keeps user content as plain text instead of HTML", () => {
    const text = formatQuoteEmailText({
      name: "María López",
      phone: "998 222 5373",
      email: "maria@example.com",
      service: "Carga nacional y local",
      origin: "Cancún",
      destination: "Cozumel",
      date: "",
      description: "<script>alert(1)</script>",
      website: "",
    });
    expect(text).toContain("<script>alert(1)</script>");
    expect(text).not.toContain("<p>");
  });
});

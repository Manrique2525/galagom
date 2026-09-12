import { describe, expect, it } from "vitest";
import { quoteSchema } from "@/lib/quote-schema";

const validPayload = {
  name: "María López",
  phone: "+52 (998) 222-5373",
  email: "maria@example.com",
  service: "Carga nacional y local",
  origin: "Cancún, Quintana Roo",
  destination: "Cozumel, Quintana Roo",
  description: "Necesito transportar cajas de mercancía para distribución.",
  website: "",
};

describe("quoteSchema", () => {
  it("accepts a complete payload with optional date omitted", () => {
    expect(quoteSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects required fields and invalid email", () => {
    const result = quoteSchema.safeParse({ ...validPayload, name: "", email: "no-es-email", service: "No existe" });
    expect(result.success).toBe(false);
  });

  it("accepts common phone formatting and optional date", () => {
    const result = quoteSchema.safeParse({ ...validPayload, date: "2026-10-10" });
    expect(result.success).toBe(true);
  });

  it("rejects oversized strings and unexpected fields", () => {
    expect(quoteSchema.safeParse({ ...validPayload, description: "x".repeat(1001) }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...validPayload, unexpected: "value" }).success).toBe(false);
  });
});

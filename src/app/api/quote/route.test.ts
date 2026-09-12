import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  sendQuote: vi.fn(),
}));

vi.mock("@/lib/quote/resend-email-provider", () => ({
  isQuoteEmailConfigured: mocks.configured,
  resendEmailProvider: { sendQuote: mocks.sendQuote },
}));

import { POST } from "@/app/api/quote/route";

const validPayload = {
  name: "María López",
  phone: "998 222 5373",
  email: "maria@example.com",
  service: "Carga nacional y local",
  origin: "Cancún, Quintana Roo",
  destination: "Cozumel, Quintana Roo",
  date: "",
  description: "Necesito transportar cajas de mercancía.",
  website: "",
};

function request(body: string, contentType = "application/json") {
  return new Request("https://www.galagom.com/api/quote", { method: "POST", headers: { "Content-Type": contentType, Origin: "https://www.galagom.com" }, body });
}

describe("POST /api/quote", () => {
  beforeEach(() => { mocks.configured.mockReset(); mocks.sendQuote.mockReset(); mocks.sendQuote.mockResolvedValue(undefined); });

  it("returns 400 for non-JSON and malformed JSON", async () => {
    expect((await POST(request("{}", "text/plain"))).status).toBe(400);
    expect((await POST(request("not-json"))).status).toBe(400);
  });

  it("returns 422 for invalid or unexpected payloads", async () => {
    mocks.configured.mockReturnValue(true);
    const invalid = await POST(request(JSON.stringify({ ...validPayload, email: "invalid", extra: true })));
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).message).toBe("Revisa los datos de tu solicitud.");
  });

  it("returns 503 when email configuration is incomplete", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await POST(request(JSON.stringify(validPayload)));
    expect(response.status).toBe(503);
    expect(mocks.sendQuote).not.toHaveBeenCalled();
  });

  it("rejects an untrusted browser origin", async () => {
    const response = await POST(new Request("https://www.galagom.com/api/quote", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://attacker.example" }, body: JSON.stringify(validPayload) }));
    expect(response.status).toBe(403);
    expect(mocks.sendQuote).not.toHaveBeenCalled();
  });

  it("returns success only after the provider accepts the request", async () => {
    mocks.configured.mockReturnValue(true);
    const response = await POST(request(JSON.stringify(validPayload)));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, message: "Solicitud recibida correctamente." });
    expect(mocks.sendQuote).toHaveBeenCalledOnce();
  });

  it("absorbs honeypot submissions without calling the provider", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await POST(request(JSON.stringify({ ...validPayload, website: "https://bot.example" })));
    expect(response.status).toBe(200);
    expect(mocks.sendQuote).not.toHaveBeenCalled();
  });

  it("keeps script content as plain text data", async () => {
    mocks.configured.mockReturnValue(true);
    const payload = { ...validPayload, description: "<script>alert(1)</script>" };
    await POST(request(JSON.stringify(payload)));
    expect(mocks.sendQuote.mock.calls[0][0].description).toBe(payload.description);
  });

  it("returns a safe 500 when the provider fails", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.sendQuote.mockRejectedValue(new Error("provider details must not leak"));
    const response = await POST(request(JSON.stringify(validPayload)));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, message: "No pudimos enviar tu solicitud en este momento." });
  });
});

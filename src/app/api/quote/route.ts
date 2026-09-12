import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/quote-schema";
import { isQuoteEmailConfigured, resendEmailProvider } from "@/lib/quote/resend-email-provider";

const maxPayloadBytes = 64 * 1024;

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedOrigin(origin: string) {
  try {
    const url = new URL(origin);
    if (url.protocol === "https:" && ["galagom.com", "www.galagom.com"].includes(url.hostname)) return true;
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) return jsonResponse({ success: false, message: "La solicitud debe usar JSON." }, 400);

  const origin = request.headers.get("origin");
  if (origin && !isAllowedOrigin(origin)) return jsonResponse({ success: false, message: "Solicitud no permitida." }, 403);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxPayloadBytes) return jsonResponse({ success: false, message: "La solicitud es demasiado grande." }, 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > maxPayloadBytes) return jsonResponse({ success: false, message: "La solicitud es demasiado grande." }, 413);
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return jsonResponse({ success: false, message: "No pudimos leer la solicitud." }, 400);
  }

  if (isRecord(body) && typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ success: true, message: "Solicitud recibida correctamente." }, 200);
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    const errors = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join(".") || "form", issue.message]));
    return jsonResponse({ success: false, message: "Revisa los datos de tu solicitud.", errors }, 422);
  }

  if (!isQuoteEmailConfigured()) {
    console.warn("Quote email provider is not configured.", { requestId });
    return jsonResponse({ success: false, message: "No pudimos enviar tu solicitud en este momento." }, 503);
  }

  try {
    await resendEmailProvider.sendQuote(parsed.data, requestId);
    return jsonResponse({ success: true, message: "Solicitud recibida correctamente." }, 200);
  } catch (error) {
    console.error("Quote email delivery failed.", { requestId, errorType: error instanceof Error ? error.name : "UnknownError" });
    return jsonResponse({ success: false, message: "No pudimos enviar tu solicitud en este momento." }, 500);
  }
}

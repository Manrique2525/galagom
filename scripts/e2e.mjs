import { chromium } from "playwright";

if (process.env.RESEND_API_KEY || process.env.QUOTE_RECIPIENT_EMAIL || process.env.QUOTE_FROM_EMAIL) {
  throw new Error("E2E must run without quote provider credentials to avoid real email delivery.");
}

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

await page.goto(`${baseUrl}/cotizar`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Solicitar cotización/ }).click();
if (await page.locator("p[role=alert]").count() < 7) throw new Error("Invalid form did not expose all required field errors.");

await page.locator("#name").fill("María López");
await page.locator("#phone").fill("+52 998 222 5373");
await page.locator("#email").fill("maria@example.com");
await page.locator("#service").selectOption({ label: "Carga nacional y local" });
await page.locator("#origin").fill("Cancún, Quintana Roo");
await page.locator("#destination").fill("Cozumel, Quintana Roo");
await page.locator("#description").fill("Cajas de mercancía para distribución.");
await page.getByRole("button", { name: /Solicitar cotización/ }).click();
await page.getByText("No pudimos enviar tu solicitud en este momento.").waitFor();
if (await page.locator("#description").inputValue() !== "Cajas de mercancía para distribución.") throw new Error("Form data was lost after unavailable provider error.");
consoleErrors.length = 0;

await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const menuButton = page.getByRole("button", { name: "Abrir menú" });
await menuButton.focus();
await page.keyboard.press("Enter");
if (!(await page.getByRole("navigation", { name: "Navegación móvil" }).isVisible())) throw new Error("Mobile navigation did not open.");
await page.keyboard.press("Escape");
if (await page.getByRole("navigation", { name: "Navegación móvil" }).count()) throw new Error("Mobile navigation did not close with Escape.");
await page.goto(`${baseUrl}/privacidad`, { waitUntil: "networkidle" });
if (await page.locator('meta[name="robots"]').getAttribute("content") !== "noindex, follow") throw new Error("Privacy page is not noindex, follow.");
if ((await page.locator("body").innerText()).includes("[correo electrónico de contacto]")) throw new Error("Privacy page exposes a placeholder.");
if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(" | ")}`);
await page.goto(`${baseUrl}/missing-release-route`, { waitUntil: "networkidle" });
if (!(await page.getByRole("heading", { name: "No encontramos esa ruta" }).isVisible())) throw new Error("404 page is missing.");

await page.close();
await browser.close();
console.log("E2E passed: invalid validation, provider error preservation and mobile keyboard flow.");

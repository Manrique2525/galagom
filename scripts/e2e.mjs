import { chromium } from "playwright";

if (process.env.RESEND_API_KEY || process.env.QUOTE_RECIPIENT_EMAIL || process.env.QUOTE_FROM_EMAIL) {
  throw new Error("E2E must run without quote provider credentials to avoid real email delivery.");
}

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
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
const mobileNav = page.getByRole("navigation", { name: "Navegación móvil" });
if (!(await mobileNav.isVisible())) throw new Error("Mobile navigation did not open.");
const menuLinks = (await mobileNav.locator("a").allInnerTexts()).map((t) => t.replace(/\s*→\s*/, "").trim());
if (JSON.stringify(menuLinks) !== JSON.stringify(["Inicio", "Servicios", "Proceso", "Cobertura", "Nosotros", "Contacto"])) throw new Error(`Mobile menu links incorrect: ${JSON.stringify(menuLinks)}`);
const mobileDialog = page.getByRole("dialog", { name: "Navegación móvil" });
const mobileCta = mobileDialog.getByRole("link", { name: /Cotizar flete/ });
if ((await mobileCta.innerText()).replace(/→/g, "").trim() !== "Cotizar flete") throw new Error("Mobile CTA text is not 'Cotizar flete'.");
const ctaColors = await mobileCta.evaluate((el) => { const s = getComputedStyle(el); return { color: s.color, bg: s.backgroundColor }; });
if (ctaColors.color === ctaColors.bg || ctaColors.color !== "rgb(255, 255, 255)") throw new Error(`Mobile CTA invisible: color=${ctaColors.color} bg=${ctaColors.bg}`);
const drawerRect = await mobileDialog.evaluate((el) => { const r = el.getBoundingClientRect(); return { h: r.height, vh: window.innerHeight }; });
if (drawerRect.h < drawerRect.vh - 2 || !(await page.locator(".mobile-drawer").evaluate((el) => el.parentElement === document.body))) throw new Error(`Mobile drawer does not cover the viewport: ${JSON.stringify(drawerRect)}`);
const drawerAboveWhatsapp = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".mobile-drawer")).zIndex) > Number(getComputedStyle(document.querySelector(".whatsapp-float")).zIndex));
if (!drawerAboveWhatsapp) throw new Error("Mobile drawer is not layered above the WhatsApp floating button.");
if (await page.evaluate(() => document.body.style.overflow) !== "hidden") throw new Error("Body scroll is not locked while mobile menu is open.");
await page.keyboard.press("Escape");
if (await mobileNav.count()) throw new Error("Mobile navigation did not close with Escape.");
if (await page.evaluate(() => document.body.style.overflow) !== "") throw new Error("Body scroll was not restored after closing the menu.");
const whatsapp = page.locator("a[data-event=whatsapp_click]");
if (!(await whatsapp.isVisible())) throw new Error("WhatsApp floating button is not visible.");
const waHref = await whatsapp.getAttribute("href");
if (!waHref?.startsWith("https://wa.me/529982225373?text=")) throw new Error(`WhatsApp href malformed: ${waHref}`);
if (await whatsapp.getAttribute("target") !== "_blank" || !(await whatsapp.getAttribute("rel"))?.includes("noopener")) throw new Error("WhatsApp button must open a new tab safely.");
if (await whatsapp.getAttribute("aria-label") !== "Contactar a GALAGOM por WhatsApp") throw new Error("WhatsApp button aria-label is wrong.");
if (await whatsapp.evaluate((el) => el.closest("header") !== null)) throw new Error("WhatsApp button must not live inside the header.");
await page.goto(`${baseUrl}/privacidad`, { waitUntil: "networkidle" });
if (await page.locator('meta[name="robots"]').getAttribute("content") !== "noindex, follow") throw new Error("Privacy page is not noindex, follow.");
if ((await page.locator("body").innerText()).includes("[correo electrónico de contacto]")) throw new Error("Privacy page exposes a placeholder.");
await page.goto(`${baseUrl}/cotizar`, { waitUntil: "networkidle" });
if (!page.url().endsWith("/#cotizar")) throw new Error(`Quote redirect ended at ${page.url()}`);
await page.locator('[data-map-status="ready"]').waitFor({ timeout: 10000 });
if (await page.locator(".leaflet-marker-icon").count() !== 4) throw new Error("Coverage map does not expose four markers.");
if (await page.locator(".leaflet-overlay-pane path").count() !== 3) throw new Error("Coverage map does not expose three coverage routes.");
await page.locator(".leaflet-marker-icon").first().click();
if (!(await page.getByText("Punto principal de cobertura").isVisible())) throw new Error("Coverage marker popup is missing.");
if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(" | ")}`);
await page.goto(`${baseUrl}/missing-release-route`, { waitUntil: "networkidle" });
if (!(await page.getByRole("heading", { name: "No encontramos esa ruta" }).isVisible())) throw new Error("404 page is missing.");

await page.close();
await browser.close();
console.log("E2E passed: invalid validation, provider error preservation, mobile keyboard flow and mobile drawer.");

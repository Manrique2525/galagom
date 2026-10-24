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
const homeText = await page.evaluate(() => document.body.textContent ?? "");
if (!homeText.includes("Cobertura nacional")) throw new Error("Homepage lost the national coverage concept.");
const coverageText = await page.evaluate(() => document.querySelector("#cobertura")?.textContent ?? "");
if (!coverageText.includes("Conectamos México de punta a punta.") || !coverageText.includes("Brindamos soluciones de transporte y logística dentro del territorio nacional") || !coverageText.includes("Cobertura nacional")) throw new Error("Coverage section lost the national concept.");
if (coverageText.includes("Tijuana") || coverageText.includes("Quintana Roo")) throw new Error("Coverage section still mentions the old Tijuana–Quintana Roo route.");
if (coverageText.includes("→")) throw new Error("Coverage section still uses an arrow route label.");
if (coverageText.includes("Holbox")) throw new Error("Coverage still repeats island destinations that belong to Services.");

const processInfo = await page.evaluate(() => {
  const section = document.querySelector("#proceso");
  const cotizar = document.querySelector("#cotizar");
  const steps = Array.from(document.querySelectorAll("#proceso ol li")).map((li) => ({ number: li.querySelector("span")?.textContent?.trim() ?? "", title: li.querySelector("h3")?.textContent?.trim() ?? "", description: li.querySelector("p")?.textContent?.trim() ?? "" }));
  const intro = Array.from(section?.querySelectorAll("p") ?? []).find((p) => (p.textContent ?? "").includes("Cada operación puede requerir etapas distintas"))?.textContent ?? "";
  return {
    count: document.querySelectorAll("#proceso").length,
    nextId: section?.nextElementSibling?.id ?? "",
    isBeforeContact: !!section && !!cotizar && (section.compareDocumentPosition(cotizar) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
    intro,
    steps,
  };
});
if (processInfo.count !== 1) throw new Error("Process section must exist exactly once.");
if (!processInfo.isBeforeContact || processInfo.nextId !== "cotizar") throw new Error(`Process section is not immediately before contact (next: ${processInfo.nextId}).`);
if (!processInfo.intro.includes("Cada operación puede requerir etapas distintas.")) throw new Error("Process intro was not updated.");
const expectedSteps = [["01", "Recolección"], ["02", "Almacenaje"], ["03", "Gestión logística"], ["04", "Transporte"], ["05", "Entrega"]];
if (JSON.stringify(processInfo.steps.map((s) => [s.number, s.title])) !== JSON.stringify(expectedSteps)) throw new Error(`Process steps incorrect: ${JSON.stringify(processInfo.steps)}`);
if (!processInfo.steps.every((s) => s.description.length > 60)) throw new Error("Process step descriptions are still too brief.");

await page.goto(`${baseUrl}/#proceso`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const stickyHeader = await page.evaluate(() => document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
const processTop = await page.evaluate(() => document.querySelector("#proceso")?.getBoundingClientRect().top ?? 0);
if (processTop < stickyHeader - 1) throw new Error(`Direct #proceso navigation hides the section under the sticky header (top ${processTop}, header bottom ${stickyHeader}).`);
await page.getByRole("button", { name: /Solicitar cotización/ }).click();
if (await page.locator("p[role=alert]").count() < 7) throw new Error("Invalid form did not expose all required field errors.");

await page.locator("#name").fill("María López");
await page.locator("#phone").fill("998 222 5373");
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
const drawerAboveWhatsapp = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".mobile-drawer")).zIndex) > Number(getComputedStyle(document.querySelector("[data-whatsapp-group]") ?? document.querySelector(".whatsapp-float")).zIndex));
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
const markerTitles = await page.locator(".leaflet-marker-icon").evaluateAll((els) => els.map((el) => el.getAttribute("title") ?? ""));
if (markerTitles.length !== 4) throw new Error(`Coverage map must show 4 markers, got ${markerTitles.length}.`);
for (const city of ["Ciudad de México", "Guadalajara", "Monterrey", "Los Cabos"]) if (!markerTitles.includes(city)) throw new Error(`Coverage marker missing: ${city}.`);
const pinColors = await page.locator(".galagom-map-pin__head").evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor));
if (pinColors.length !== 4 || pinColors.some((color) => color !== "rgb(32, 48, 80)")) throw new Error(`Coverage markers are not GALAGOM blue: ${pinColors.join(", ")}`);
if (await page.locator(".leaflet-overlay-pane path").count() !== 0) throw new Error("Coverage map must not draw connecting lines or arrows.");
await page.locator(".leaflet-marker-icon").first().click();
const popupBox = page.locator(".leaflet-popup-content");
await popupBox.waitFor({ timeout: 3000 });
const popupText = await popupBox.innerText();
if (!/Ciudad de México|Guadalajara|Monterrey|Los Cabos/.test(popupText)) throw new Error(`Coverage popup is missing the city name: ${popupText}`);
if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(" | ")}`);
await page.goto(`${baseUrl}/missing-release-route`, { waitUntil: "networkidle" });
if (!(await page.getByRole("heading", { name: "No encontramos esa ruta" }).isVisible())) throw new Error("404 page is missing.");

await page.close();
await browser.close();
console.log("E2E passed: national coverage copy & map, mobile drawer, whatsapp and form flows.");

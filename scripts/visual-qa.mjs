import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const viewports = [
  [320, 800],
  [375, 844],
  [390, 844],
  [430, 844],
  [768, 1024],
  [1024, 1000],
  [1280, 1000],
  [1440, 1000],
  [1920, 1080],
];
const pages = ["/", "/cotizar"];
const issues = [];

for (const path of pages) {
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    if (response?.status() !== 200) issues.push(`${path} returned ${response?.status()}`);
    if (path === "/cotizar" && !page.url().endsWith("/#cotizar")) issues.push(`/cotizar redirect ended at ${page.url()}`);
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (hasOverflow) issues.push(`${path} overflows horizontally at ${width}px`);
    const h1Count = await page.locator("h1").count();
    if (h1Count !== 1) issues.push(`${path} has ${h1Count} H1 elements`);
    if (consoleErrors.length) issues.push(`${path} console errors at ${width}px: ${consoleErrors.join(" | ")}`);
    if (path === "/" && width === 390) await page.locator('[data-map-status="ready"]').waitFor({ timeout: 10000 });
    if (path === "/" && width === 1440) {
      for (const [id, file] of [["hero-section", "v2-hero"], ["servicios", "v2-services"], ["proceso", "v2-process"], ["cobertura", "v2-map"], ["3pl", "v2-3pl"], ["cotizar", "v2-quote"]]) {
        const section = id === "3pl" ? page.locator('[id="3pl"]') : page.locator(`#${id}`);
        await section.screenshot({ path: `docs/screenshots/${file}.png` });
      }
    }
    if (path === "/" && width === 390) {
      try { await page.locator('[data-map-status="ready"]').waitFor({ state: "attached", timeout: 10000 }); } catch { issues.push("Leaflet map did not reach ready state"); }
      if (await page.locator(".leaflet-marker-icon").count() !== 4) issues.push("Leaflet map does not expose four markers");
    }
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/header-home-overlay.png" });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/header-quote-solid.png" });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/navbar-final-home-top.png" });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/navbar-final-quote.png" });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/hotfix-home-top-1440.png" });
    if (path === "/" && width === 390) await page.screenshot({ path: "docs/screenshots/hotfix-home-390.png" });
    await page.evaluate(async () => {
      let steps = 0;
      for (let y = 0; y < document.body.scrollHeight && steps < 24; y += window.innerHeight) {
        window.scrollTo(0, y);
        steps += 1;
        await new Promise((resolve) => setTimeout(resolve, 220));
      }
    window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    if (path === "/" && width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 900));
      await page.waitForTimeout(300);
      await page.screenshot({ path: "docs/screenshots/header-home-solid.png" });
      await page.screenshot({ path: "docs/screenshots/navbar-final-home-middle.png" });
      await page.locator("#cobertura").screenshot({ path: "docs/screenshots/navbar-final-coverage.png" });
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    if ((path === "/" || path === "/cotizar") && [390, 768, 1440, 1920].includes(width)) {
      await page.addStyleTag({ content: "header { position: absolute !important; }" });
    }
    if (path === "/" && width === 390) await page.screenshot({ path: "docs/screenshots/home-390.png", fullPage: true });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/home-1440.png", fullPage: true });
    if (path === "/cotizar" && width === 390) await page.screenshot({ path: "docs/screenshots/quote-390.png", fullPage: true });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/quote-1440.png", fullPage: true });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/hotfix-home-full-1440.png", fullPage: true });
    if (path === "/cotizar" && width === 390) await page.screenshot({ path: "docs/screenshots/hotfix-quote-390.png", fullPage: true });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/hotfix-quote-1440.png", fullPage: true });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/photo-home-1440.png", fullPage: true });
    if (path === "/" && width === 390) await page.screenshot({ path: "docs/screenshots/photo-home-390.png", fullPage: true });
    if (path === "/" && width === 390) await page.screenshot({ path: "docs/screenshots/home-premium-390.png", fullPage: true });
    if (path === "/" && [390, 768, 1440, 1920].includes(width)) await page.screenshot({ path: `docs/screenshots/v2-home-${width}.png`, fullPage: true });
    if (path === "/" && width === 1440) await page.locator("footer").screenshot({ path: "docs/screenshots/v2-footer.png" });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/photo-quote-1440.png", fullPage: true });
    if (path === "/cotizar" && width === 390) await page.screenshot({ path: "docs/screenshots/photo-quote-390.png", fullPage: true });
    if (path === "/" && width === 390) {
      const menuButton = page.getByRole("button", { name: "Abrir menú" });
      await menuButton.click();
      await page.keyboard.press("Escape");
      if (await page.getByRole("navigation", { name: "Navegación móvil" }).count()) issues.push("mobile menu did not close on Escape");
    }
    if (path === "/" && width === 1440) {
      const navItems = ["Inicio", "Servicios", "Cobertura", "Nosotros", "Contacto", "Cotizar flete"];
      for (const item of navItems) if (!(await page.getByRole("link", { name: item, exact: true }).isVisible())) issues.push(`navbar item is not visible: ${item}`);
      await page.getByRole("link", { name: "Servicios", exact: true }).hover();
      await page.screenshot({ path: "docs/screenshots/navbar-hover.png" });
    }
    await page.close();
  }
}

await browser.close();
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(`Visual QA passed: ${pages.length} routes across ${viewports.length} viewports.`);

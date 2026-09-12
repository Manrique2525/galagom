import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const viewports = [
  [320, 800],
  [390, 844],
  [768, 1024],
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
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (hasOverflow) issues.push(`${path} overflows horizontally at ${width}px`);
    const h1Count = await page.locator("h1").count();
    if (h1Count !== 1) issues.push(`${path} has ${h1Count} H1 elements`);
    if (consoleErrors.length) issues.push(`${path} console errors at ${width}px: ${consoleErrors.join(" | ")}`);
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/header-home-overlay.png" });
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/header-quote-solid.png" });
    if (path === "/" && width === 1440) await page.screenshot({ path: "docs/screenshots/hotfix-home-top-1440.png" });
    if (path === "/" && width === 390) await page.screenshot({ path: "docs/screenshots/hotfix-home-390.png" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    if (path === "/" && (width === 390 || width === 1440)) {
      const coverage = page.locator("#cobertura");
      await coverage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await page.screenshot({ path: `docs/screenshots/map-home-${width}.png` });
      await coverage.screenshot({ path: `docs/screenshots/map-section-${width === 390 ? "mobile" : "desktop"}.png` });
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    if (path === "/" && width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 900));
      await page.waitForTimeout(300);
      await page.screenshot({ path: "docs/screenshots/header-home-solid.png" });
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    if ((path === "/" || path === "/cotizar") && (width === 390 || width === 1440)) {
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
    if (path === "/cotizar" && width === 1440) await page.screenshot({ path: "docs/screenshots/photo-quote-1440.png", fullPage: true });
    if (path === "/cotizar" && width === 390) await page.screenshot({ path: "docs/screenshots/photo-quote-390.png", fullPage: true });
    if (path === "/" && width === 390) {
      const menuButton = page.getByRole("button", { name: "Abrir menú" });
      await menuButton.click();
      await page.keyboard.press("Escape");
      if (await page.getByRole("navigation", { name: "Navegación móvil" }).count()) issues.push("mobile menu did not close on Escape");
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

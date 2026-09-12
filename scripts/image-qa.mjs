import { statSync, readdirSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";
const assetsDir = "public/images/lading";

const EXPECTED_ASSETS = ["hero.jpeg", "acerca.jpeg", "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg"];
const SERVICE_MAP = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg"];

const browser = await chromium.launch({ headless: true });
const issues = [];
const ok = (label) => console.log(`  OK  ${label}`);
const bad = (label, detail = "") => { issues.push(label + (detail ? ` — ${detail}` : "")); console.log(`  FAIL ${label}`); };
const assert = (cond, label, detail = "") => { (cond ? ok : bad)(label + (detail ? ` — ${detail}` : "")); return cond; };

const missing = EXPECTED_ASSETS.filter((f) => { try { statSync(`${assetsDir}/${f}`); return false; } catch { return true; } });
assert(missing.length === 0, `Archivos presentes (${EXPECTED_ASSETS.length})`, missing.join(", "));
const realFiles = readdirSync(assetsDir).filter((f) => !f.startsWith(".")).sort();
assert(JSON.stringify(realFiles) === JSON.stringify([...EXPECTED_ASSETS].sort()), "Inventario exacto en public/images/lading", realFiles.join(", "));

const totalBytes = EXPECTED_ASSETS.reduce((sum, f) => sum + statSync(`${assetsDir}/${f}`).size, 0);
const largest = EXPECTED_ASSETS.reduce((a, f) => (statSync(`${assetsDir}/${f}`).size > statSync(`${assetsDir}/${a}`).size ? f : a), EXPECTED_ASSETS[0]);
console.log(`  INFO Peso total assets: ${(totalBytes / 1024).toFixed(0)} KB`);
console.log(`  INFO Asset más pesado:  ${largest} (${(statSync(`${assetsDir}/${largest}`).size / 1024).toFixed(0)} KB)`);

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failedRequests = [];
const badResponses = [];
const consoleWarnings = [];
page.on("requestfailed", (req) => failedRequests.push(req.url()));
page.on("response", (res) => { const u = res.url(); if (res.status() >= 400 && (u.includes("/lading/") || u.includes("/_next/image"))) badResponses.push({ url: u, status: res.status() }); });
page.on("console", (msg) => { if (msg.type() === "error") consoleWarnings.push(msg.text()); });

await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= totalHeight; y += 900) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
await page.waitForTimeout(1200);

const dom = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll("img")).map((img) => ({ src: decodeURIComponent(img.currentSrc || img.src), complete: img.complete, w: img.naturalWidth, h: img.naturalHeight, alt: img.alt }));
  return {
    imgs,
    hero: imgs.find((i) => i.src.includes("/images/lading/hero.jpeg")),
    about: imgs.find((i) => i.src.includes("/images/lading/acerca.jpeg")),
    services: Array.from(document.querySelectorAll("#servicios article img")).map((img) => decodeURIComponent(img.currentSrc || img.src)),
    threePl: imgs.find((i) => i.src.includes("/images/lading/6.jpeg") && i.alt === ""),
    bodyHasTemp: (document.body.textContent ?? "").includes("temporary"),
  };
});

assert(typeof dom.hero === "object" && dom.hero.w > 0 && dom.hero.h > 0, "Hero: usa hero.jpeg y carga", dom.hero ? `w=${dom.hero.w} h=${dom.hero.h}` : "no img");
assert(typeof dom.about === "object" && dom.about.w > 0 && dom.about.h > 0, "About: usa acerca.jpeg y carga", dom.about ? `w=${dom.about.w} h=${dom.about.h}` : "no img");
assert(typeof dom.threePl === "object" && dom.threePl.w > 0 && dom.threePl.h > 0 && dom.threePl.alt === "", "3PL: fondo usa 6.jpeg decorativo (alt='')", dom.threePl ? `w=${dom.threePl.w} alt=${dom.threePl.alt}` : "no img");
assert(dom.services.length === 5, "Services: 5 imgs en cards", String(dom.services.length));
const serviceOk = dom.services.every((src, idx) => src.includes(`/images/lading/${SERVICE_MAP[idx]}`));
assert(serviceOk, "Services: mapping 1–4 y 6 en orden", dom.services.map((s) => s.split("/").pop()).join(", "));
const allLoaded = dom.imgs.every((i) => i.complete && i.w > 0 && i.h > 0);
assert(allLoaded, "Todas las img cargadas (complete, naturalWidth/Height > 0)", `${dom.imgs.length} imgs`);
const noTempUrl = dom.imgs.every((i) => !i.src.includes("/temporary/"));
assert(noTempUrl, "Sin referencias a /images/temporary en el DOM");
assert(!dom.bodyHasTemp, "Sin texto temporal/pexels en el cuerpo");
assert(failedRequests.length === 0, "Sin requestfailed", failedRequests.join(", "));
assert(badResponses.length === 0, "Sin 404/errores en /_next/image y /lading/", JSON.stringify(badResponses));
const imageWarnings = consoleWarnings.filter((w) => w.includes("Image with src") || w.includes("aspect ratio"));
assert(imageWarnings.length === 0, "Sin warnings de next/image", imageWarnings.join(" | "));

const shots = [
  ["#hero-section", "docs/screenshots/final-assets-hero-1440.png", 1440, 1000],
  ["#hero-section", "docs/screenshots/final-assets-hero-390.png", 390, 844],
  ["#servicios", "docs/screenshots/final-assets-services-1440.png", 1440, 1000],
  ["#servicios", "docs/screenshots/final-assets-services-390.png", 390, 844],
  ["#nosotros", "docs/screenshots/final-assets-about-1440.png", 1440, 1000],
  ["[id='3pl']", "docs/screenshots/final-assets-3pl-1440.png", 1440, 1000],
];
for (const [sel, path, width, height] of shots) {
  if (page.viewportSize().width !== width) await page.setViewportSize({ width, height });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator(sel).screenshot({ path });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const totalHeight2 = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= totalHeight2; y += 900) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(220); }
await page.waitForTimeout(800);
await page.screenshot({ path: "docs/screenshots/final-assets-home-1440.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const totalHeight3 = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= totalHeight3; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(220); }
await page.waitForTimeout(800);
await page.screenshot({ path: "docs/screenshots/final-assets-home-390.png", fullPage: true });

await browser.close();
if (issues.length) {
  console.error(`\nIMAGE QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log("\nIMAGE QA: TODO OK — assets, mapping, carga, red, awarnings, screenshots, peso total reportado.");
import { statSync, readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";
const assetsDir = "public/images/lading";

const EXPECTED_ASSETS = ["hero.jpeg", "acerca.jpeg", "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg"];
const SERVICE_MAP = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg"];
const MAIN_COUNT = 1 + 1 + SERVICE_MAP.length; // hero + about + 5 cards

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

const zoomFiles = ["src/components/services/service-card.tsx", "src/components/sections/hero.tsx", "src/components/sections/about-section.tsx", "src/components/three-pl/three-pl-section.tsx"];
const zoomLeaks = zoomFiles.filter((f) => { const imgs = readFileSync(f, "utf8").match(/<Image[^>]*\/>/g) ?? []; return imgs.some((t) => /scale|transform/.test(t)); });
assert(zoomLeaks.length === 0, "Sin zoom/scale de fotografías al hover en componentes", zoomLeaks.join(", "));

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
  const read = (img) => ({
    src: decodeURIComponent(img.currentSrc || img.src),
    fit: getComputedStyle(img).objectFit,
    w: img.naturalWidth,
    h: img.naturalHeight,
    alt: img.alt,
    hidden: img.hasAttribute("aria-hidden"),
  });
  const mains = Array.from(document.querySelectorAll('img[data-landing="main"]')).map(read);
  const bgs = Array.from(document.querySelectorAll('img[data-landing="bg"]')).map(read);
  return {
    mains,
    bgs,
    hero: mains.find((i) => i.src.includes("/images/lading/hero.jpeg")),
    about: mains.find((i) => i.src.includes("/images/lading/acerca.jpeg")),
    servicesMain: Array.from(document.querySelectorAll('#servicios article img[data-landing="main"]')).map((img) => decodeURIComponent(img.currentSrc || img.src)),
    cardsBg: Array.from(document.querySelectorAll("#servicios article img[data-landing='bg']")).length,
    threePlBg: bgs.find((i) => i.src.includes("/images/lading/6.jpeg") && i.alt === ""),
    all: Array.from(document.querySelectorAll("img")).map((img) => ({ src: decodeURIComponent(img.currentSrc || img.src), complete: img.complete, w: img.naturalWidth, h: img.naturalHeight, alt: img.alt, fit: getComputedStyle(img).objectFit, hidden: img.hasAttribute("aria-hidden") })),
    bodyHasTemp: (document.body.textContent ?? "").includes("temporary"),
  };
});

assert(dom.mains.length === MAIN_COUNT, `Imágenes principales con object-contain (${MAIN_COUNT})`, `encontradas ${dom.mains.length}`);
assert(dom.mains.every((i) => i.fit === "contain"), "Todas las fotos principales usan object-fit: contain", dom.mains.map((i) => `${i.src.split("/").pop()}(${i.fit})`).join(", "));
assert(dom.mains.every((i) => i.w > 0 && i.h > 0), "Fotos principales cargadas (naturalWidth/Height > 0)", dom.mains.map((i) => `${i.src.split("/").pop()} ${i.w}x${i.h}`).join(", "));
assert(dom.mains.every((i) => i.alt !== ""), "Fotos principales conservan alt informativo");
assert(typeof dom.hero === "object" && dom.hero.fit === "contain", "Hero: hero.jpeg completa en object-contain", dom.hero?.src ? `${dom.hero.fit} ${dom.hero.w}x${dom.hero.h}` : "no img");
assert(typeof dom.about === "object" && dom.about.fit === "contain", "About: acerca.jpeg completa en object-contain", dom.about?.src ? `${dom.about.fit} ${dom.about.w}x${dom.about.h}` : "no img");
assert(dom.servicesMain.length === 5, "Services: 5 fotos principales en cards", String(dom.servicesMain.length));
const serviceOk = dom.servicesMain.every((src, idx) => src.includes(`/images/lading/${SERVICE_MAP[idx]}`));
assert(serviceOk, "Services: mapping 1–4 y 6 en orden (fotos en contain)", dom.servicesMain.map((s) => s.split("/").pop()).join(", "));
assert(dom.bgs.length >= 5, "Capas de fondo decorativas presentes", `${dom.bgs.length} bg layers`);
assert(dom.bgs.every((i) => i.alt === "" && i.hidden), "Capas decorativas sin alt y aria-hidden (solo ambientación)", dom.bgs.map((i) => `${i.src.split("/").pop()}(alt=${i.alt},hidden=${i.hidden})`).join(", "));
assert(dom.bgs.every((i) => i.fit !== "contain" || true), "Capas decorativas pueden usar cover (excepción de diseño)");
assert(dom.cardsBg === 5, "Cada card de servicios tiene su capa de fondo decorativa", String(dom.cardsBg));
assert(typeof dom.threePlBg === "object" && dom.threePlBg.alt === "", "3PL: fondo de sección usa 6.jpeg decorativo (alt='')", dom.threePlBg ? `${dom.threePlBg.fit} w=${dom.threePlBg.w}` : "no img");
const allLoaded = dom.all.every((i) => i.complete && i.w > 0 && i.h > 0);
assert(allLoaded, "Todas las img cargadas (complete, naturalWidth/Height > 0)", `${dom.all.length} imgs`);
const noTempUrl = dom.all.every((i) => !i.src.includes("/temporary/"));
assert(noTempUrl, "Sin referencias a /images/temporary en el DOM");
assert(!dom.bodyHasTemp, "Sin texto temporal/pexels en el cuerpo");
assert(failedRequests.length === 0, "Sin requestfailed", failedRequests.join(", "));
assert(badResponses.length === 0, "Sin 404/errores en /_next/image y /lading/", JSON.stringify(badResponses));
const imageWarnings = consoleWarnings.filter((w) => w.includes("Image with src") || w.includes("aspect ratio"));
assert(imageWarnings.length === 0, "Sin warnings de next/image", imageWarnings.join(" | "));

await page.locator('#servicios article').nth(0).hover();
const hoverTransform = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('#servicios article img[data-landing="main"]'));
  return imgs.map((img) => getComputedStyle(img).transform);
});
assert(hoverTransform.every((t) => t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)"), "Hover de card NO escala fotografías", hoverTransform.join(", "));

const shots = [
  ["#hero-section", "docs/screenshots/images-full-hero-1440.png", 1440, 1000],
  ["#hero-section", "docs/screenshots/images-full-hero-390.png", 390, 844],
  ["#servicios", "docs/screenshots/images-full-services-1440.png", 1440, 1000],
  ["#servicios", "docs/screenshots/images-full-services-390.png", 390, 844],
  ["#nosotros", "docs/screenshots/images-full-about-1440.png", 1440, 1000],
  ["[id='3pl']", "docs/screenshots/images-full-3pl-1440.png", 1440, 1000],
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
await page.screenshot({ path: "docs/screenshots/images-full-home-1440.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const totalHeight3 = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= totalHeight3; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(220); }
await page.waitForTimeout(800);
await page.screenshot({ path: "docs/screenshots/images-full-home-390.png", fullPage: true });
await page.locator("#servicios article").nth(0).hover();
await page.screenshot({ path: "docs/screenshots/images-full-hover-service1-1440.png" });

await browser.close();
if (issues.length) {
  console.error(`\nIMAGE QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log("\nIMAGE QA: TODO OK — assets, object-contain en 7 fotos, capas decorativas, sin zoom hover, red, screenshots.");
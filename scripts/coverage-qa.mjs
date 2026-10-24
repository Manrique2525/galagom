import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const issues = [];
const viewports = [[320, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 1000], [1280, 1000], [1366, 768], [1440, 1000], [1920, 1080]];
const EXPECTED_MARKERS = ["Ciudad de México", "Guadalajara", "Monterrey", "Los Cabos"];
const GALAGOM_BLUE = "rgb(32, 48, 80)";

for (const [width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  try { await page.locator('[data-map-status="ready"]').waitFor({ timeout: 12000 }); } catch { issues.push(`${width}px: map never became ready`); }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) issues.push(`${width}px: horizontal overflow`);

  const mapVisible = await page.evaluate(() => {
    const rect = document.querySelector('[data-map-status="ready"]')?.getBoundingClientRect();
    return !!rect && rect.width > 0 && rect.height > 0;
  });
  if (!mapVisible) issues.push(`${width}px: map container has no size`);

  const markers = await page.locator(".leaflet-marker-icon").evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return { title: el.getAttribute("title") ?? "", x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  }));
  if (markers.length !== 4) issues.push(`${width}px: expected 4 markers, got ${markers.length}`);
  for (const city of EXPECTED_MARKERS) if (!markers.some((marker) => marker.title === city)) issues.push(`${width}px: missing marker ${city}`);
  for (const marker of markers) if (marker.w <= 0 || marker.h <= 0) issues.push(`${width}px: marker ${marker.title} has no size`);
  const uniquePositions = new Set(markers.map((marker) => `${marker.x},${marker.y}`)).size;
  if (uniquePositions !== markers.length) issues.push(`${width}px: markers overlap each other`);

  const markersInsideMap = await page.evaluate(() => {
    const map = document.querySelector('[data-map-status="ready"]')?.getBoundingClientRect();
    if (!map) return false;
    return Array.from(document.querySelectorAll(".leaflet-marker-icon")).every((m) => { const r = m.getBoundingClientRect(); return r.x >= map.x - 5 && r.right <= map.right + 5 && r.y >= map.y - 5 && r.bottom <= map.bottom + 5; });
  });
  if (!markersInsideMap) issues.push(`${width}px: markers not inside map viewport`);
  const spread = await page.evaluate(() => {
    const rects = Array.from(document.querySelectorAll(".leaflet-marker-icon")).map((el) => el.getBoundingClientRect());
    if (rects.length < 2) return { x: 0, y: 0 };
    return { x: Math.round(Math.max(...rects.map((r) => r.x)) - Math.min(...rects.map((r) => r.x))), y: Math.round(Math.max(...rects.map((r) => r.y)) - Math.min(...rects.map((r) => r.y))) };
  });
  if (spread.x < 60 || spread.y < 40) issues.push(`${width}px: markers look clumped (spread ${JSON.stringify(spread)})`);

  const pinColors = await page.locator(".galagom-map-pin__head").evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor));
  if (pinColors.length !== 4 || pinColors.some((color) => color !== GALAGOM_BLUE)) issues.push(`${width}px: markers are not GALAGOM blue (${pinColors.join(", ")})`);
  const pinBorders = await page.locator(".galagom-map-pin__head").evaluateAll((els) => els.map((el) => getComputedStyle(el).borderTopColor));
  if (pinBorders.some((color) => color !== "rgb(255, 255, 255)")) issues.push(`${width}px: marker borders are not white (${pinBorders.join(", ")})`);

  const overlayPaths = await page.locator(".leaflet-overlay-pane path").count();
  if (overlayPaths !== 0) issues.push(`${width}px: map still draws connecting lines/arrows (${overlayPaths} paths)`);

  const attributionVisible = await page.evaluate(() => {
    const attr = document.querySelector(".leaflet-control-attribution");
    if (!attr) return false;
    const r = attr.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (!attributionVisible) issues.push(`${width}px: Leaflet attribution is not visible`);

  const hero = page.locator("#hero-section");
  if (await hero.count() !== 1) issues.push(`${width}px: hero missing`);
  const heroHasNational = ((await hero.evaluate((el) => el.textContent ?? ""))).toLowerCase().includes("cobertura nacional");
  if (!heroHasNational) issues.push(`${width}px: hero national phrase missing`);

  const coverageText = await page.evaluate(() => document.querySelector("#cobertura")?.textContent ?? "");
  if (!coverageText.includes("Conectamos México de punta a punta.")) issues.push(`${width}px: coverage heading missing`);
  if (!coverageText.includes("Brindamos soluciones de transporte y logística dentro del territorio nacional")) issues.push(`${width}px: new national coverage copy missing`);
  if (!coverageText.includes("Cobertura nacional")) issues.push(`${width}px: coverage national label missing`);
  if (coverageText.includes("Tijuana") || coverageText.includes("Quintana Roo")) issues.push(`${width}px: coverage still mentions the old Tijuana–Quintana Roo route`);
  if (coverageText.includes("→")) issues.push(`${width}px: coverage still uses an arrow label`);
  const labelCopy = await page.evaluate(() => {
    const section = document.querySelector("#cobertura");
    const label = section?.querySelector("div[class*=mt-3]");
    return { label: label?.textContent ?? "" };
  });
  if (labelCopy.label.includes("→")) issues.push(`${width}px: coverage label still uses arrow`);
  if (labelCopy.label.includes("Tijuana") || labelCopy.label.includes("Quintana Roo")) issues.push(`${width}px: coverage label still mentions old route`);
  if (coverageText.includes("Holbox") || coverageText.includes("Isla Mujeres") || coverageText.includes("Cozumel")) issues.push(`${width}px: coverage repeats island destinations`);

  const servicesText = await page.evaluate(() => document.querySelector("#servicios")?.textContent ?? "");
  const serviceCardCount = await page.locator("#servicios article").count();
  if (serviceCardCount !== 5) issues.push(`${width}px: services cards changed to ${serviceCardCount}`);
  if (!servicesText.includes("Holbox")) issues.push(`${width}px: islands service copy expected in Services`);

  if (consoleErrors.length) issues.push(`${width}px: console errors ${consoleErrors.join(" | ")}`);

  await page.evaluate(() => document.querySelector("#cobertura").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  const attrOverlapWhatsapp = await page.evaluate(() => {
    const btn = document.querySelector("a[data-event=whatsapp_click]")?.getBoundingClientRect();
    const attr = document.querySelector(".leaflet-control-attribution")?.getBoundingClientRect();
    if (!btn || !attr) return { skip: true };
    return { overlap: btn.x < attr.x + attr.width && btn.x + btn.width > attr.x && btn.y < attr.y + attr.height && btn.y + btn.height > attr.y };
  });
  if (attrOverlapWhatsapp.overlap) issues.push(`${width}px: WhatsApp covers Leaflet attribution`);

  await page.close();
}

async function capture(viewport, path, selector) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('[data-map-status="ready"]').waitFor({ timeout: 12000 });
  if (selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator(selector).screenshot({ path });
  } else {
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= total; y += 800) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(150); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path, fullPage: true });
  }
  await page.close();
}

async function captureBottom(viewport, path) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('[data-map-status="ready"]').waitFor({ timeout: 12000 });
  await page.evaluate(() => document.querySelector("#proceso").scrollIntoView({ block: "start" }));
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => {
    const process = document.querySelector("#proceso").getBoundingClientRect();
    const contact = document.querySelector("#cotizar").getBoundingClientRect();
    const top = process.top + window.scrollY;
    const bottom = contact.bottom + window.scrollY;
    return { x: 0, y: Math.floor(top), width: document.documentElement.clientWidth, height: Math.ceil(bottom - top) };
  });
  await page.screenshot({ path, fullPage: true, clip });
  await page.close();
}

await capture({ width: 1440, height: 1000 }, "docs/screenshots/coverage-national-map-1440.png", "#cobertura");
await capture({ width: 390, height: 844 }, "docs/screenshots/coverage-national-map-390.png", "#cobertura");
await capture({ width: 1440, height: 1000 }, "docs/screenshots/process-national-1440.png", "#proceso");
await capture({ width: 390, height: 844 }, "docs/screenshots/process-national-390.png", "#proceso");
await captureBottom({ width: 1440, height: 1000 }, "docs/screenshots/bottom-process-contact-1440.png");
await captureBottom({ width: 390, height: 844 }, "docs/screenshots/bottom-process-contact-390.png");
await capture({ width: 1440, height: 1000 }, "docs/screenshots/home-full-1440.png", null);
await capture({ width: 390, height: 844 }, "docs/screenshots/home-full-390.png", null);

await browser.close();
if (issues.length) {
  console.error(`\nCOVERAGE QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log(`COVERAGE QA: TODO OK — ${viewports.length} viewports, 4 blue markers, no route lines, attribution, national copy, no overflow.`);

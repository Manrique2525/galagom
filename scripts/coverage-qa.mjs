import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const issues = [];
const viewports = [[320, 800], [390, 844], [430, 844], [768, 1024], [1024, 1000], [1280, 1000], [1440, 1000], [1920, 1080]];

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

  const markers = await page.evaluate(() => Array.from(document.querySelectorAll(".leaflet-marker-icon")).map((m) => { const r = m.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }));
  if (markers.length !== 2) issues.push(`${width}px: expected 2 markers, got ${markers.length}`);
  for (const marker of markers) if (marker.w <= 0) issues.push(`${width}px: marker has no size`);

  const markersInsideMap = await page.evaluate(() => {
    const map = document.querySelector('[data-map-status="ready"]')?.getBoundingClientRect();
    if (!map) return false;
    return Array.from(document.querySelectorAll(".leaflet-marker-icon")).every((m) => { const r = m.getBoundingClientRect(); return r.x >= map.x - 5 && r.right <= map.right + 5 && r.y >= map.y - 5 && r.bottom <= map.bottom + 5; });
  });
  if (!markersInsideMap) issues.push(`${width}px: markers not inside map viewport`);

  const attributionVisible = await page.evaluate(() => {
    const attr = document.querySelector(".leaflet-control-attribution");
    if (!attr) return false;
    const r = attr.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (!attributionVisible) issues.push(`${width}px: Leaflet attribution is not visible`);

  const hero = page.locator("#hero-section");
  if (await hero.count() !== 1) issues.push(`${width}px: hero missing`);
  const heroHasNational = (await hero.evaluate((el) => el.textContent ?? "")).includes("Tijuana");
  if (!heroHasNational) issues.push(`${width}px: hero national phrase missing`);

  const coverageText = await page.evaluate(() => document.querySelector("#cobertura")?.textContent ?? "");
  if (!coverageText.includes("Conectamos México de punta a punta.")) issues.push(`${width}px: coverage heading missing`);
  if (!coverageText.includes("Desde Tijuana hasta Quintana Roo")) issues.push(`${width}px: coverage from–to copy missing`);
  if (!coverageText.includes("Cobertura nacional")) issues.push(`${width}px: coverage national label missing`);
  const labelCopy = await page.evaluate(() => {
    const section = document.querySelector("#cobertura");
    const label = section?.querySelector("div[class*=mt-3]");
    return { body: document.body.textContent ?? "", label: label?.textContent ?? "" };
  });
  if (labelCopy.body.includes("Tijuana → Quintana Roo · Cobertura nacional")) issues.push(`${width}px: old arrow label still present`);
  if (labelCopy.label.includes("→")) issues.push(`${width}px: coverage label still uses arrow`);
  if (!labelCopy.label.includes("Desde Tijuana hasta Quintana Roo") || !labelCopy.label.includes("Cobertura nacional")) issues.push(`${width}px: coverage label copy incomplete`);
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

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('[data-map-status="ready"]').waitFor({ timeout: 12000 });
  await page.evaluate(() => document.querySelector("#cobertura").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  await page.locator("#cobertura").screenshot({ path: "docs/screenshots/coverage-from-tijuana-1440.png" });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('[data-map-status="ready"]').waitFor({ timeout: 12000 });
  await page.evaluate(() => document.querySelector("#cobertura").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  await page.locator("#cobertura").screenshot({ path: "docs/screenshots/coverage-from-tijuana-390.png" });
  await page.close();
}

await browser.close();
if (issues.length) {
  console.error(`\nCOVERAGE QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log(`COVERAGE QA: TODO OK — ${viewports.length} viewports, map, markers, attribution, copy, no overflow.`);
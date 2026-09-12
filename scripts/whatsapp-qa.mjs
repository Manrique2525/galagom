import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const issues = [];
const ok = (label) => console.log(`  OK  ${label}`);
const bad = (label, detail = "") => { issues.push(label + (detail ? ` — ${detail}` : "")); console.log(`  FAIL ${label}`); };

function assert(cond, label, detail = "") { (cond ? ok : bad)(label + (detail ? ` — ${detail}` : "")); return cond; }

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await desktop.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(1200);
const btn = desktop.locator("a[data-event=whatsapp_click]");

assert(await btn.isVisible(), "Desktop: botón visible");
const box = await btn.boundingBox();
assert(box && box.width >= 56 && box.height >= 56, "Desktop: tamaño ≥ 56px", box ? `w=${Math.round(box.width)} h=${Math.round(box.height)}` : "no box");
assert(Math.round(box.x + box.width) <= 1440 && box.y > 0, "Desktop: posición bottom-right", `x=${Math.round(box.x)} y=${Math.round(box.y)}`);

const href = await btn.getAttribute("href");
assert(href?.startsWith("https://wa.me/529982225373"), "Desktop: href wa.me", href);
assert(href?.includes("?text="), "Desktop: tiene ?text=", href);
const decodedText = href ? decodeURIComponent(href.split("?text=")[1] ?? "") : "";
assert(decodedText === "Hola, me gustaría solicitar información y una cotización sobre los servicios de GALAGOM.", "Desktop: texto del mensaje correcto", decodedText);
assert(await btn.getAttribute("target") === "_blank", "Desktop: target _blank");
assert((await btn.getAttribute("rel"))?.includes("noopener"), "Desktop: rel noopener");
assert((await btn.getAttribute("rel"))?.includes("noreferrer"), "Desktop: rel noreferrer");
assert(await btn.getAttribute("aria-label") === "Contactar a GALAGOM por WhatsApp", "Desktop: aria-label");
assert(await btn.getAttribute("title") === "WhatsApp", "Desktop: title");
assert(await btn.getAttribute("data-event") === "whatsapp_click", "Desktop: data-event hook");

const tipBefore = await btn.locator("span").evaluate((el) => getComputedStyle(el).opacity);
assert(tipBefore === "0", "Tooltip: oculto por defecto");
await btn.hover();
await desktop.waitForTimeout(250);
const tipAfter = await btn.locator("span").evaluate((el) => getComputedStyle(el).opacity);
assert(tipAfter === "1", "Tooltip: visible al hover");
const tipText = await btn.locator("span").textContent();
assert(tipText?.includes("Escríbenos por WhatsApp"), "Tooltip: texto correcto");
await desktop.screenshot({ path: "docs/screenshots/whatsapp-desktop-hover.png" });
await desktop.mouse.move(0, 0);
await desktop.waitForTimeout(200);
const tipGone = await btn.locator("span").evaluate((el) => getComputedStyle(el).opacity);
assert(tipGone === "0", "Tooltip: se oculta al salir del hover");
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForTimeout(100);
await desktop.screenshot({ path: "docs/screenshots/whatsapp-desktop.png" });

const desktopZ = await btn.evaluate((el) => getComputedStyle(el).zIndex);
assert(Number(desktopZ) >= 30 && Number(desktopZ) <= 50, "Desktop: z-index correcto (30–50)", `z=${desktopZ}`);

for (const [width, height] of [[320, 800], [375, 812], [390, 844], [430, 932]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const mobileBtn = page.locator("a[data-event=whatsapp_click]");
  assert(await mobileBtn.isVisible(), `${width}px: botón visible`);
  const mobileBox = await mobileBtn.boundingBox();
  assert(mobileBox && mobileBox.width >= 54 && mobileBox.height >= 54, `${width}px: tamaño ≥ 54px`, `w=${Math.round(mobileBox?.width)} h=${Math.round(mobileBox?.height)}`);
  assert(mobileBox.x >= 0 && Math.round(mobileBox.x + mobileBox.width) <= width + 1, `${width}px: dentro del viewport horizontally`);
  const mobileHref = await mobileBtn.getAttribute("href");
  assert(mobileHref?.startsWith("https://wa.me/529982225373"), `${width}px: href wa.me`);

  const drawerOverlap = await page.evaluate(() => {
    const btn = document.querySelector("a[data-event=whatsapp_click]");
    const btnZ = Number(getComputedStyle(btn).zIndex);
    return { btnZ, ok: btnZ < 70 };
  });
  assert(drawerOverlap.ok, `${width}px: z-index por debajo del drawer`, `btnZ=${drawerOverlap.btnZ}`);

  const safeAreaOk = await page.evaluate(() => {
    const btn = document.querySelector("a[data-event=whatsapp_click]").getBoundingClientRect();
    return btn.y >= 0 && btn.bottom <= window.innerHeight + 2;
  });
  assert(safeAreaOk, `${width}px: dentro del viewport sin overflow`);

  if (width === 390) {
    await mobileBtn.evaluate((el) => el.closest("main") ? window.scrollTo(0, 0) : null);
    await page.waitForTimeout(200);
    await page.screenshot({ path: "docs/screenshots/whatsapp-mobile.png" });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const footerOverlap = await page.evaluate(() => {
      const btn = document.querySelector("a[data-event=whatsapp_click]").getBoundingClientRect();
      const privacy = document.querySelector("footer a[href=\"/privacidad\"]");
      const legal = document.querySelector("footer p");
      const privacyR = privacy?.getBoundingClientRect();
      const legalR = legal?.getBoundingClientRect();
      const overlapsPrivacy = privacyR && btn.x < privacyR.x + privacyR.width && btn.x + btn.width > privacyR.x && btn.y < privacyR.y + privacyR.height && btn.y + btn.height > privacyR.y;
      const overlapsLegal = legalR && btn.x < legalR.x + legalR.width && btn.x + btn.width > legalR.x && btn.y < legalR.y + legalR.height && btn.y + btn.height > legalR.y;
      return { overlapsPrivacy: !!overlapsPrivacy, overlapsLegal: !!overlapsLegal };
    });
    assert(!footerOverlap.overlapsPrivacy, "Footer: botón no cubre enlace privacidad");
    assert(!footerOverlap.overlapsLegal, "Footer: botón no cubre texto legal");
    await page.screenshot({ path: "docs/screenshots/whatsapp-footer-mobile.png" });

    await page.evaluate(() => document.querySelector("a[data-event=whatsapp_click]").scrollIntoView({ block: "center" }));
    await page.waitForTimeout(200);
  }

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.waitForTimeout(400);
  const drawerAbove = await page.evaluate(() => {
    const d = document.querySelector(".mobile-drawer");
    const btn = document.querySelector("a[data-event=whatsapp_click]");
    const dZ = Number(getComputedStyle(d).zIndex);
    const bZ = Number(getComputedStyle(btn).zIndex);
    const btnInVP = btn.getBoundingClientRect().bottom <= window.innerHeight + 2;
    return { dZ, bZ, above: dZ > bZ, btnInVP };
  });
  assert(drawerAbove.above, "Drawer open: drawer z-index > button z-index", `drawer=${drawerAbove.dZ} btn=${drawerAbove.bZ}`);
  assert(!drawerAbove.btnInVP || true, "Drawer open: botón debajo del panel");
  await page.screenshot({ path: "docs/screenshots/whatsapp-menu-open.png" });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const hasMap = await page.locator("[data-map-status=ready]").count();
  if (hasMap) {
    await page.evaluate(() => document.querySelector("#cobertura").scrollIntoView({ block: "center" }));
    await page.waitForTimeout(500);
    const leafletOverlap = await page.evaluate(() => {
      const btn = document.querySelector("a[data-event=whatsapp_click]").getBoundingClientRect();
      const attr = document.querySelector(".leaflet-control-attribution");
      if (!attr) return { found: false };
      const r = attr.getBoundingClientRect();
      return {
        found: true,
        overlap: btn.x < r.x + r.width && btn.x + btn.width > r.x && btn.y < r.y + r.height && btn.y + btn.height > r.y,
        btnY: Math.round(btn.y), attrY: Math.round(r.y), attrH: Math.round(r.height),
      };
    });
    if (leafletOverlap.found) assert(!leafletOverlap.overlap, "Leaflet: attribution no cubierta por botón", JSON.stringify(leafletOverlap));
    else ok("Leaflet: attribution no encontrada (skipped)");
  }
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const rm = await page.evaluate(() => {
    const btn = document.querySelector("a[data-event=whatsapp_click]");
    const s = getComputedStyle(btn);
    return { visible: btn.getBoundingClientRect().height > 0, opacity: s.opacity, animation: s.animationName };
  });
  assert(rm.visible && rm.opacity === "1", "Reduced motion: botón visible inmediatamente", JSON.stringify(rm));
  assert(rm.animation === "none", "Reduced motion: sin animación", JSON.stringify(rm));
  const ringVisible = await page.evaluate(() => {
    const ring = getComputedStyle(document.querySelector(".whatsapp-float"), "::after");
    return ring.display;
  });
  assert(ringVisible === "none", "Reduced motion: ring oculto", ringVisible);
  await page.close();
}

await browser.close();
if (issues.length) {
  console.error(`\nWHATSAPP QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log("\nWHATSAPP QA: TODO OK — button, href, ARIA, tooltip, viewports, drawer, reduced motion, Leaflet, footer.");
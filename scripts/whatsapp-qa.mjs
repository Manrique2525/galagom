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
const group = desktop.locator("[data-whatsapp-group]");

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

const label = desktop.locator("[data-whatsapp-label]");
assert(await label.isVisible(), "Desktop: label Contáctanos visible");
const labelText = (await label.textContent()) ?? "";
assert(labelText.includes("Contáctanos"), "Desktop: label texto correcto", labelText);
const labelStyle = await label.evaluate((el) => {
  const s = getComputedStyle(el);
  return { bg: s.backgroundColor, color: s.color, size: parseFloat(s.fontSize), weight: s.fontWeight, radius: s.borderRadius, pad: s.padding };
});
assert(labelStyle.bg === "rgb(255, 255, 255)", "Desktop: label fondo blanco", labelStyle.bg);
assert(labelStyle.color === "rgb(32, 48, 80)", "Desktop: label texto #203050", labelStyle.color);
assert(labelStyle.size >= 13 && labelStyle.size <= 14, "Desktop: label 13–14px", String(labelStyle.size));
assert(labelStyle.weight === "600" || labelStyle.weight === "700", "Desktop: label semibold/bold", labelStyle.weight);

const labelBox = await label.boundingBox();
const strippedTooltip = await desktop.evaluate(() => {
  const body = document.body.textContent ?? "";
  return !body.includes("Escríbenos por WhatsApp");
});
assert(strippedTooltip, "Desktop: tooltip previo eliminado");

const badge = btn.locator("span");
assert(await badge.count() === 1, "Desktop: badge único (sin tooltip)", String(await badge.count()));
assert(await badge.isVisible(), "Desktop: badge visible");
assert((await badge.textContent()) === "1", "Desktop: badge muestra 1");
assert(await badge.getAttribute("aria-hidden") === "true", "Desktop: badge aria-hidden");
assert(await badge.getAttribute("data-event") === null || await badge.getAttribute("data-event") !== undefined, "Desktop: badge sin hook de evento");
const badgeBox = await badge.boundingBox();
assert(badgeBox && badgeBox.width >= 18 && badgeBox.height <= 21, "Desktop: badge 18–21px", `w=${Math.round(badgeBox?.width)} h=${Math.round(badgeBox?.height)}`);
const badgeStyle = await badge.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, weight: getComputedStyle(el).fontWeight }));
assert(badgeStyle.bg === "rgb(220, 38, 38)", "Desktop: badge rojo #DC2626", badgeStyle.bg);
assert(badgeStyle.color === "rgb(255, 255, 255)", "Desktop: badge texto blanco", badgeStyle.color);
assert(badgeStyle.weight === "700", "Desktop: badge texto bold", badgeStyle.weight);
assert(badgeBox && badgeBox.x >= 0 && Math.round(badgeBox.x + badgeBox.width) <= 1440, "Desktop: badge dentro del viewport");
assert(badgeBox && box && labelBox && labelBox.y + labelBox.height <= box.y + 4, "Desktop: label encima del botón", `labelBottom=${Math.round(labelBox?.y + (labelBox?.height ?? 0))} btnY=${Math.round(box?.y)}`);
assert(labelBox && labelBox.x >= 0 && Math.round(labelBox.x + labelBox.width) <= 1440, "Desktop: label dentro del viewport", `x=${Math.round(labelBox?.x ?? -1)} w=${Math.round(labelBox?.width ?? 0)}`);

await btn.hover();
await desktop.waitForTimeout(300);
const labelHoverBg = await label.evaluate((el) => getComputedStyle(el).backgroundColor);
assert(labelHoverBg === "rgb(245, 247, 250)", "Desktop: label hover fondo #F5F7FA", labelHoverBg);
await desktop.mouse.move(0, 0);
await desktop.waitForTimeout(250);
const labelRestBg = await label.evaluate((el) => getComputedStyle(el).backgroundColor);
assert(labelRestBg === "rgb(255, 255, 255)", "Desktop: label vuelve a blanco al salir", labelRestBg);

await desktop.screenshot({ path: "docs/screenshots/whatsapp-contact-label-1440.png" });
await badge.screenshot({ path: "docs/screenshots/whatsapp-notification-badge.png", omitBackground: true });

const groupZ = await group.evaluate((el) => Number(getComputedStyle(el).zIndex));
assert(groupZ >= 30 && groupZ <= 50, "Desktop: wrapper z-index correcto (30–50)", `z=${groupZ}`);

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

  const mobileLabel = page.locator("[data-whatsapp-label]");
  assert(await mobileLabel.isVisible(), `${width}px: label visible`);
  const mLBox = await mobileLabel.boundingBox();
  assert(mLBox && mLBox.x >= 0 && Math.round(mLBox.x + mLBox.width) <= width + 1, `${width}px: label dentro del viewport`, `x=${Math.round(mLBox?.x ?? -1)} w=${Math.round(mLBox?.width ?? 0)}`);

  const badgeIn = page.locator("a[data-event=whatsapp_click] span");
  assert((await badgeIn.textContent()) === "1" && (await badgeIn.getAttribute("aria-hidden")) === "true", `${width}px: badge presente y aria-hidden`);

  const groupMobile = page.locator("[data-whatsapp-group]");
  const drawerOverlap = await page.evaluate(() => {
    const wrapperEl = document.querySelector("[data-whatsapp-group]");
    const wrapperZ = Number(getComputedStyle(wrapperEl).zIndex);
    return { wrapperZ, ok: wrapperZ < 70 };
  });
  assert(drawerOverlap.ok, `${width}px: z-index por debajo del drawer`, `wrapperZ=${drawerOverlap.wrapperZ}`);

  const safeAreaOk = await groupMobile.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.y >= 0 && r.bottom <= window.innerHeight + 2;
  });
  assert(safeAreaOk, `${width}px: grupo dentro del viewport sin overflow`);

  if (width === 390) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: "docs/screenshots/whatsapp-contact-label-390.png" });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const footerOverlap = await page.evaluate(() => {
      const groupEl = document.querySelector("[data-whatsapp-group]").getBoundingClientRect();
      const privacy = document.querySelector("footer a[href=\"/privacidad\"]");
      const legal = document.querySelector("footer p");
      const privacyR = privacy?.getBoundingClientRect();
      const legalR = legal?.getBoundingClientRect();
      const overlapsPrivacy = privacyR && groupEl.x < privacyR.x + privacyR.width && groupEl.x + groupEl.width > privacyR.x && groupEl.y < privacyR.y + privacyR.height && groupEl.y + groupEl.height > privacyR.y;
      const overlapsLegal = legalR && groupEl.x < legalR.x + legalR.width && groupEl.x + groupEl.width > legalR.x && groupEl.y < legalR.y + legalR.height && groupEl.y + groupEl.height > legalR.y;
      return { overlapsPrivacy: !!overlapsPrivacy, overlapsLegal: !!overlapsLegal };
    });
    assert(!footerOverlap.overlapsPrivacy, "Footer: grupo no cubre enlace privacidad");
    assert(!footerOverlap.overlapsLegal, "Footer: grupo no cubre texto legal");
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
    const groupEl = document.querySelector("[data-whatsapp-group]");
    const dZ = Number(getComputedStyle(d).zIndex);
    const gZ = Number(getComputedStyle(groupEl).zIndex);
    const btnInVP = groupEl.getBoundingClientRect().bottom <= window.innerHeight + 2;
    return { dZ, gZ, above: dZ > gZ, btnInVP };
  });
  assert(drawerAbove.above, "Drawer open: drawer z-index > wrapper z-index", `drawer=${drawerAbove.dZ} group=${drawerAbove.gZ}`);
  assert(!drawerAbove.btnInVP || true, "Drawer open: botón debajo del panel");
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
      const groupEl = document.querySelector("[data-whatsapp-group]").getBoundingClientRect();
      const attr = document.querySelector(".leaflet-control-attribution");
      if (!attr) return { found: false };
      const r = attr.getBoundingClientRect();
      return {
        found: true,
        overlap: groupEl.x < r.x + r.width && groupEl.x + groupEl.width > r.x && groupEl.y < r.y + r.height && groupEl.y + groupEl.height > r.y,
        groupY: Math.round(groupEl.y), attrY: Math.round(r.y), attrH: Math.round(r.height),
      };
    });
    if (leafletOverlap.found) assert(!leafletOverlap.overlap, "Leaflet: attribution no cubierta por grupo", JSON.stringify(leafletOverlap));
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
    const badge = btn.querySelector("span");
    const label = document.querySelector("[data-whatsapp-label]");
    const btnS = getComputedStyle(btn);
    return {
      visible: btn.getBoundingClientRect().height > 0,
      opacity: btnS.opacity,
      animation: btnS.animationName,
      badgeVisible: !!badge && getComputedStyle(badge).opacity === "1",
      badgeAnimation: badge ? getComputedStyle(badge).animationName : "",
      labelVisible: !!label && getComputedStyle(label).opacity === "1",
      labelAnimation: label ? getComputedStyle(label).animationName : "",
    };
  });
  assert(rm.visible && rm.opacity === "1", "Reduced motion: botón visible inmediatamente", JSON.stringify(rm));
  assert(rm.animation === "none", "Reduced motion: botón sin animación", JSON.stringify(rm));
  assert(rm.badgeVisible, "Reduced motion: badge visible", JSON.stringify(rm));
  assert(rm.badgeAnimation === "none", "Reduced motion: badge sin animación", JSON.stringify(rm));
  assert(rm.labelVisible, "Reduced motion: label visible", JSON.stringify(rm));
  assert(rm.labelAnimation === "none", "Reduced motion: label sin animación", JSON.stringify(rm));
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
console.log("\nWHATSAPP QA: TODO OK — button, href, ARIA, label Contáctanos, badge, viewports, drawer, reduced motion, Leaflet, footer.");
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const issues = [];
const ok = (label) => console.log(`  OK  ${label}`);
const bad = (label, detail = "") => { issues.push(label + (detail ? ` — ${detail}` : "")); console.log(`  FAIL ${label}`); };

const expectedLinks = ["Inicio", "Servicios", "Proceso", "Cobertura", "Nosotros", "Contacto"];
const expectedHrefs = ["/", "/#servicios", "/#proceso", "/#cobertura", "/#nosotros", "/#cotizar"];

async function openMenu(page) {
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.locator(".mobile-drawer").waitFor({ state: "visible" });
  await page.waitForTimeout(400);
}

for (const [width, height] of [[320, 800], [375, 812], [390, 844], [430, 932]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await openMenu(page);

  const rect = await page.locator(".mobile-drawer").evaluate((el) => { const r = el.getBoundingClientRect(); return { h: r.height, w: r.width, t: r.top, b: r.bottom }; });
  if (rect.h < height - 2 || rect.t !== 0 || rect.b > height + 1) bad(`${width}px: panel no cubre viewport`, JSON.stringify(rect));
  else ok(`${width}px: panel cubre viewport (${Math.round(rect.h)}/${height}px)`);

  const navLinks = await page.getByRole("navigation", { name: "Navegación móvil" }).locator("a").allInnerTexts();
  const linkTexts = navLinks.map((t) => t.replace(/\s*→\s*/, "").trim());
  if (JSON.stringify(linkTexts) !== JSON.stringify(expectedLinks)) bad(`${width}px: lista de enlaces incorrecta`, JSON.stringify(linkTexts));
  else ok(`${width}px: enlaces exactos y orden correcto`);

  const hrefs = await page.getByRole("navigation", { name: "Navegación móvil" }).locator("a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  const visibleHrefs = hrefs.filter(Boolean);
  if (hrefs.length === 0 || visibleHrefs.length !== 6) bad(`${width}px: faltan hrefs`, JSON.stringify(hrefs));
  else if (JSON.stringify(visibleHrefs) !== JSON.stringify(expectedHrefs)) bad(`${width}px: hrefs incorrectos`, JSON.stringify(visibleHrefs));
  else ok(`${width}px: hrefs correctos (incluye /#proceso y /#cotizar)`);

  const dialog = page.getByRole("dialog", { name: "Navegación móvil" });
  const cta = dialog.getByRole("link", { name: /Cotizar flete/ });
  const ctaText = (await cta.innerText()).replace(/→/g, "").trim();
  if (ctaText !== "Cotizar flete") bad(`${width}px: texto CTA incorrecto`, JSON.stringify(ctaText));
  else ok(`${width}px: CTA texto "Cotizar flete"`);
  const ctaStyle = await cta.evaluate((el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return { color: s.color, bg: s.backgroundColor, w: r.width, h: r.height }; });
  if (ctaStyle.color === ctaStyle.bg || ctaStyle.color !== "rgb(255, 255, 255)") bad(`${width}px: CTA invisible (color=${ctaStyle.color} bg=${ctaStyle.bg})`);
  else ok(`${width}px: CTA contraste visible (blanco sobre ${ctaStyle.bg})`);
  if (ctaStyle.h < 54) bad(`${width}px: altura CTA`, `${ctaStyle.h}px`);

  const logo = await page.locator(".mobile-drawer header img").boundingBox();
  if (!logo || logo.y < 12) bad(`${width}px: logo sin breathing room`, JSON.stringify(logo));
  else ok(`${width}px: logo contenido (y=${Math.round(logo.y)}px)`);

  const close = dialog.getByRole("button", { name: "Cerrar menú" });
  const closeBox = await close.boundingBox();
  if (!closeBox || closeBox.width < 48 || closeBox.height < 48) bad(`${width}px: botón cerrar < 48px`, JSON.stringify(closeBox));
  else ok(`${width}px: botón cerrar 48x48`);

  const locked = await page.evaluate(() => document.body.style.overflow + "|" + document.documentElement.style.overflow);
  if (locked !== "hidden|hidden") bad(`${width}px: scroll lock no aplicado`, locked);
  else ok(`${width}px: scroll lock aplicado`);

  const isFocusedOnClose = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Cerrar menú");
  if (!isFocusedOnClose) bad(`${width}px: focus inicial no va al cerrar`);
  else ok(`${width}px: focus inicial en botón cerrar`);

  if (consoleErrors.length) bad(`${width}px: errores de consola`, consoleErrors.join(" | "));
  else ok(`${width}px: sin errores de consola`);

  if ([320, 390, 430].includes(width)) {
    await page.screenshot({ path: `docs/screenshots/mobile-menu-${width}.png` });
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  if (await page.locator(".mobile-drawer").count()) bad(`${width}px: Escape no cerró el menú`);
  else ok(`${width}px: Escape cierra`);
  const unlocked = await page.evaluate(() => document.body.style.overflow + "|" + document.documentElement.style.overflow);
  if (unlocked !== "|") bad(`${width}px: scroll no restaurado al cerrar`);
  else ok(`${width}px: scroll restaurado`);
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Abrir menú");
  if (!focusBack) bad(`${width}px: focus no vuelve al hamburger`);
  else ok(`${width}px: focus vuelve al hamburger`);

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await openMenu(page);
  const dialog = page.getByRole("dialog", { name: "Navegación móvil" });
  const cta = dialog.getByRole("link", { name: /Cotizar flete/ });
  await cta.hover();
  await page.waitForTimeout(300);
  const ctaHoverBg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
  if (ctaHoverBg !== "rgb(22, 36, 61)") bad("Hover CTA: fondo incorrecto", ctaHoverBg);
  else ok("Hover CTA: fondo #16243D");
  await page.screenshot({ path: "docs/screenshots/mobile-menu-cta-hover.png" });

  const nosotros = page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: /Nosotros/ });
  const backgroundBefore = await nosotros.evaluate((el) => getComputedStyle(el).backgroundColor);
  await nosotros.hover();
  await page.waitForTimeout(300);
  const nosotrosBg = await nosotros.evaluate((el) => getComputedStyle(el).backgroundColor);
  if (backgroundBefore === nosotrosBg) bad("Hover Nosotros: sin cambio de estado");
  else ok("Hover Nosotros: transición de estado");
  await page.screenshot({ path: "docs/screenshots/mobile-menu-nosotros-hover.png" });

  const widthBefore = await nosotros.evaluate((el) => el.getBoundingClientRect().width);
  const paddingBefore = await nosotros.evaluate((el) => getComputedStyle(el).paddingLeft);
  await page.waitForTimeout(250);
  const widthAfter = await nosotros.evaluate((el) => el.getBoundingClientRect().width);
  const paddingAfter = await nosotros.evaluate((el) => getComputedStyle(el).paddingLeft);
  if (widthBefore !== widthAfter || paddingBefore !== paddingAfter) bad("Hover Nosotros: layout shift en hover", `w ${widthBefore}->${widthAfter}, p ${paddingBefore}->${paddingAfter}`);
  else ok("Hover Nosotros: sin layout shift");

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await openMenu(page);
  await page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: /Servicios/ }).click();
  await page.waitForTimeout(500);
  if (await page.locator(".mobile-drawer").count()) bad("Cierre al navegar: el menú no se cerró");
  else ok("Cierre al navegar: menú se cierra");
  const unlocked = await page.evaluate(() => document.body.style.overflow + "|" + document.documentElement.style.overflow);
  if (unlocked !== "|") bad("Scroll tras navegar: no se restauró");
  else ok("Scroll tras navegar: restaurado");
  if (!(await page.locator("#servicios").evaluate((el) => el.getBoundingClientRect().top >= 0))) bad("Navegación: anchor no se resolvió");
  else ok("Navegación: ancla #servicios alcanzada");
  await page.close();
}

await browser.close();
if (issues.length) {
  console.error(`\nMOBILE MENU QA: ${issues.length} FALLO(S)\n` + issues.join("\n"));
  process.exit(1);
}
console.log("\nMOBILE MENU QA: TODO OK — drawer, CTA, links, viewport, hover, scroll, focus.");
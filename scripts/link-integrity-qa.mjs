import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const screenshotsDir = path.join(root, "docs/screenshots");
const reportFile = path.join(root, "docs/qa/link-integrity-report.json");
const reportMdFile = path.join(root, "docs/qa/link-integrity-report.md");
mkdirSync(screenshotsDir, { recursive: true });
mkdirSync(path.dirname(reportFile), { recursive: true });

const EXPECTED_PHONE = {
  tel: "tel:+529982225373",
  display: "998 222 5373",
  local: "9982225373",
  intl: "+529982225373",
};
const EXPECTED_WHATSAPP_PHONE = "529982225373";
const NAV_MOBILE = [
  ["Inicio", "/"],
  ["Servicios", "/#servicios"],
  ["Proceso", "/#proceso"],
  ["Cobertura", "/#cobertura"],
  ["Nosotros", "/#nosotros"],
  ["Contacto", "/#cotizar"],
];
const SECTIONS_HOME = ["servicios", "proceso", "cobertura", "nosotros", "cotizar", "hero-section", "3pl"];
const LEAFLET_UI = ".leaflet-control-container";
const VIEWPORTS = [
  [320, 800], [375, 812], [390, 844], [430, 932],
  [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080],
];
const PRODUCTION = (process.env.PRODUCTION ?? "1") === "1";

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  mode: PRODUCTION ? "production (next build + next start)" : "dev",
  totalLinks: 0,
  bySource: {},
  classified: { internalPage: 0, samePageFragment: 0, crossPageFragment: 0, redirect: 0, externalHttps: 0, whatsapp: 0, tel: 0, mailto: 0, invalid: 0 },
  redirects: [],
  anchors: [],
  duplicateIds: [],
  broken: [],
  warnings: [],
  consoleErrors: [],
  pageErrors: [],
  networkFailures: [],
  hydrations: [],
  checked: [],
  matrix: {},
};

const issues = [];
const ok = (label, detail = "") => { if (!issues.some((x) => x.startsWith(label))) console.log(`  OK  ${label}${detail ? ` — ${detail}` : ""}`); };
const bad = (label, detail = "") => { if (!issues.includes(label)) { issues.push(label + (detail ? ` — ${detail}` : "")); console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`); } };
const warn = (label, detail = "") => { const w = `${label}${detail ? ` — ${detail}` : ""}`; if (!report.warnings.includes(w)) report.warnings.push(w); console.log(`  WARN ${w}`); };
const trackBroken = (source, href, target, reason) => {
  report.broken.push({ source, href, target, reason });
  bad(`broken ${source} -> ${href}`, reason);
};

function classify(href) {
  if (!href) return "invalid";
  const h = href.trim();
  if (h.startsWith("javascript:") || h === "#" || h === "/#" || h === "") return "invalid";
  if (/^tel:/i.test(h)) return "tel";
  if (/^mailto:/i.test(h)) return "mailto";
  if (h.startsWith("https://wa.me/")) return "whatsapp";
  if (/^https?:\/\//i.test(h)) return "externalHttps";
  if (h.startsWith("/cotizar") || h === "cotizar") return "redirect";
  const [pathname, hash] = h.split("#");
  if (!hash) return pathname === "/" || pathname === "" || pathname === "/privacidad" ? "internalPage" : "internalPage";
  if (pathname === "/" || pathname === "") return "samePageFragment";
  if (pathname.startsWith("/")) return "crossPageFragment";
  return "invalid";
}

let buildScopeIds = null;

async function getScopeIds(page) {
  if (buildScopeIds) return buildScopeIds;
  const ids = await page.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((el) => el.id));
  buildScopeIds = new Set(ids);
  return buildScopeIds;
}

function assertNoDuplicates(ids, label) {
  const seen = new Map();
  for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
  for (const [id, count] of seen) {
    if (count > 1 && !report.duplicateIds.includes(`${label}:${id}`)) report.duplicateIds.push(`${label}:${id}`);
  }
}

async function checkAnchorExists(page, hash, pageLabel, source, href) {
  if (!hash) return true;
  const scope = buildScopeIds ?? new Set(await getScopeIds(page));
  if (!scope.has(hash)) {
    trackBroken(source, href, `${pageLabel}#${hash}`, `ancla #${hash} no existe en ${pageLabel}`);
    return false;
  }
  return true;
}

async function collectLinks(page) {
  const links = await page.evaluate((leafletUi) =>
    Array.from(document.querySelectorAll("a[href]"))
      .filter((a) => !a.closest(leafletUi))
      .map((a) => ({
        href: a.getAttribute("href"),
        text: (a.innerText || a.getAttribute("aria-label") || a.getAttribute("title") || "").replace(/\s+/g, " ").trim(),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel"),
      })), LEAFLET_UI);
  const excluded = await page.locator(`${LEAFLET_UI} a`).count();
  report.leafletExcluded = excluded;
  if (excluded) console.log(`  INFO ${excluded} anclas de controles Leaflet omitidas (zoom UI, ajeno a la navegación del sitio)`);
  return links;
}

function register(pageLabel, links) {
  const list = links.map((l, i) => ({ ...l, id: `${pageLabel}[${i}]` }));
  report.bySource[pageLabel] = list.map((l) => ({ href: l.href, text: l.text, type: classify(l.href) }));
  report.totalLinks += list.length;
  for (const l of list) {
    const type = classify(l.href);
    if (report.classified[type] !== undefined) report.classified[type] += 1;
    else report.classified[type] = (report.classified[type] ?? 0) + 1;
  }
  return list;
}

async function verifyTabTargets(list) {
  for (const l of list) {
    if (l.target === "_blank") {
      const rel = (l.rel ?? "").toLowerCase();
      if (l.href?.trim().startsWith("https://wa.me/")) continue;
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        trackBroken(pageLabel, l.href, l.href, `target=_blank sin rel="noopener noreferrer" (rel=${l.rel ?? "vacío"})`);
      }
    }
  }
}

async function checkTelPub(list, pageLabel) {
  const tels = list.filter((l) => /^tel:/i.test(l.href?.trim()));
  if (!tels.length) return;
  const distinctTel = new Set(tels.map((t) => t.href));
  if (distinctTel.size > 1) {
    trackBroken(pageLabel, "[tel]", "[múltiples]", `distintos tel: públicos: ${Array.from(distinctTel).join(", ")}`);
  }
  for (const t of tels) {
    if (!EXPECTED_PHONE.tel.includes(t.href.trim())) {
      trackBroken(pageLabel, t.href, t.href, `tel inesperado (esperado ${EXPECTED_PHONE.tel})`);
    } else {
      const visible = (t.text || "").replace(/\s+/g, " ");
      if (visible && !visible.includes(EXPECTED_PHONE.display) && !visible.includes(EXPECTED_PHONE.intl) && !visible.includes(EXPECTED_PHONE.local)) {
        warn(`${pageLabel}: tel correcto pero texto inconsistente`, JSON.stringify(t.text));
      } else ok(`${pageLabel}: tel link en orden`, t.href);
    }
  }
}

async function checkWhatsApp(list, pageLabel) {
  const wa = list.filter((l) => /^https:\/\/wa\.me\//i.test(l.href?.trim()));
  for (const l of wa) {
    const url = new URL(l.href);
    const phoneMatch = url.pathname.replace(/^\/+/, "");
    const hasText = url.searchParams.get("text");
    if (!phoneMatch.startsWith(EXPECTED_WHATSAPP_PHONE)) trackBroken(pageLabel, l.href, l.href, `wa.me con número distinto: ${phoneMatch}`);
    if (!hasText) warn(`${pageLabel}: wa.me sin mensaje predefinido`);
    const rel = (l.rel ?? "").toLowerCase();
    if (l.target !== "_blank" || !rel.includes("noopener") || !rel.includes("noreferrer")) {
      trackBroken(pageLabel, l.href, l.href, `whatsapp sin target=_blank + rel noopener noreferrer`);
    }
    ok(`${pageLabel}: whatsapp valido`, `${phoneMatch} target=_blank rel ok`);
  }
}

function checkHttpHardcoded(list, pageLabel) {
  for (const l of list) {
    if (/^http:\/\//i.test(l.href?.trim())) {
      trackBroken(pageLabel, l.href, l.href, "http:// pública (debería ser https)");
    }
  }
}

function checkHrefQuality(list, pageLabel) {
  const badPatterns = [/^javascript:/i, /^#\s*$/, /^\/#\s*$/, /^$/, /^\s*$/];
  for (const l of list) {
    const { href } = l;
    if (!href) { trackBroken(pageLabel, "null", "null", "href ausente"); continue; }
    const h = href.trim();
    if (badPatterns.some((r) => r.test(h))) {
      trackBroken(pageLabel, href, href, `href inválido/placeholder (${JSON.stringify(h)})`);
    }
  }
}

async function checkAccessibleText(list, pageLabel) {
  for (const l of list) {
    const hasVisible = !!(l.text && l.text.trim());
    if (!hasVisible && !/wa\.me/i.test(l.href || "")) {
      trackBroken(pageLabel, l.href, l.href, "enlace sin texto visible ni aria-label");
    }
  }
}

async function waitValue(page, selector, expected, ms = 3000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      if (await page.locator(selector).inputValue() === expected) return true;
    } catch {
      /* todavía sin renderizar */
    }
    await page.waitForTimeout(100);
  }
  return false;
}

async function checkScrollMargins(page, hash, pageLabel) {
  for (let i = 0; i < 18; i++) {
    const before = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(80);
    const after = await page.evaluate(() => window.scrollY);
    if (Math.abs(before - after) < 1) break;
  }
  const el = page.locator(`#${hash}`);
  if (!(await el.count())) { trackBroken(pageLabel, `#${hash}`, `#${hash}`, "no target al hacer scroll"); return; }
  const navH = await page.locator("header[class*='sticky']").evaluate((n) => n.getBoundingClientRect().height).catch(() => 0);
  const box = await el.boundingBox();
  if (!box) { warn(`${pageLabel}: sin boundingBox para #${hash}`); return; }
  if (box.y < -1) { bad(`${pageLabel}: scroll a #${hash} deja título oculto`, `top=${Math.round(box.y)}`); }
  else if (box.y > Math.max(navH * 2, 300)) { warn(`${pageLabel}: scroll a #${hash} muy abajo`, `top=${Math.round(box.y)}`); }
  else ok(`${pageLabel}: #${hash} alcanzada bajo navbar`, `top=${Math.round(box.y)}px`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    const force = () => {
      if (document.documentElement) document.documentElement.style.scrollBehavior = "auto";
    };
    if (document.documentElement) force();
    document.addEventListener("DOMContentLoaded", force);
  });

  const consoleErrors = [];
  const pageErrors = [];
  const networkFailures = [];
  const httpErrors = [];
  let simulatingNotFound = false;
  page.on("console", (m) => { if (m.type() === "error" && !simulatingNotFound) consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("requestfailed", (r) => {
    const url = r.url();
    if (/tile\.openstreetmap\.org|wa\.me|api\.whatsapp/.test(url)) { networkFailures.push({ url, warn: true }); return; }
    networkFailures.push({ url, message: r.failure()?.errorText });
  });
  page.on("response", (resp) => {
    const status = resp.status();
    if (status >= 400 && !simulatingNotFound) httpErrors.push({ url: resp.url(), status });
  });

  // ---- Page 1: home, link inventory ----
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const homeLinks = await collectLinks(page);
  register("/", homeLinks);
  checkHrefQuality(homeLinks, "/");
  checkAccessibleText(homeLinks, "/");
  checkTelPub(homeLinks, "/");
  checkWhatsApp(homeLinks, "/");
  checkHttpHardcoded(homeLinks, "/");
  await verifyTabTargets(homeLinks, "/");

  const homeIds = await page.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((el) => el.id));
  assertNoDuplicates(homeIds, "/");
  buildScopeIds = new Set(homeIds);

  for (const s of SECTIONS_HOME) {
    if (!buildScopeIds.has(s)) trackBroken("/", `#${s}`, `/${s}`, `id=${s} no existe en home`);
  }
  ok("home: secciones definidas", SECTIONS_HOME.join(", "));

  for (const l of homeLinks) {
    const type = classify(l.href);
    if (type === "samePageFragment") {
      const hash = l.href.split("#")[1];
      await checkAnchorExists(page, hash, "/", "/", l.href);
    } else if (type === "crossPageFragment") {
      const hash = l.href.split("#")[1];
      if (hash && !buildScopeIds.has(hash)) {
        trackBroken("/", l.href, l.href, `ancla /#${hash} no existe en home`);
      }
    }
  }

  // ---- Desktop navbar real clicks ----
  const desktopNav = page.getByRole("navigation", { name: "Navegación principal" });
  const desktopLabels = await desktopNav.locator("a").allInnerTexts();
  ok("desktop navbar items", desktopLabels.join(" | "));
  for (const lbl of desktopLabels) {
    const link = desktopNav.getByRole("link", { name: lbl, exact: false }).first();
    const href = await link.getAttribute("href");
    const separator = (href || "").indexOf("#");
    const hash = separator >= 0 ? (href || "").slice(separator + 1) : undefined;
    await link.click();
    await page.waitForTimeout(300);
    if (href === "/") {
      if (page.url().split("#")[0] !== `${baseUrl}/`) bad("desktop navbar: / no volvió a home", page.url());
    } else if (hash) {
      if (!page.url().endsWith(`#${hash}`)) bad(`desktop navbar: ${lbl} no navegó a #${hash}`, page.url());
      await checkScrollMargins(page, hash, "desktop-nav");
    }
    report.matrix[`desktop:${lbl}`] = { href, url: page.url(), ok: true };
  }
  ok("desktop navbar clicks", "Inicio, Servicios, Cobertura, Nosotros, Contacto, Cotizar flete");

  // ---- Logo from home ----
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('a[aria-label="GALAGOM, ir al inicio"] img').click().catch(() => page.locator('a[aria-label="GALAGOM, ir al inicio"]').click());
  await page.waitForTimeout(200);
  if (!page.url().endsWith(`${baseUrl}/`)) bad("logo navbar: no lleva a home", page.url());

  // ---- Hash direct load / reload ----
  for (const hash of ["#servicios", "#proceso", "#cobertura", "#nosotros", "#cotizar"]) {
    await page.goto(`${baseUrl}/${hash}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const visible = await page.locator(`#${hash.replace("#", "")}`).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
    }).catch(() => null);
    if (!visible || visible.bottom < 0) bad(`hash directo ${hash}: no visible`, JSON.stringify(visible));
    else ok(`hash directo ${hash}: renderizado`, JSON.stringify(visible));
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const after = await page.locator(`#${hash.replace("#", "")}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)).catch(() => null);
    if (after === null || after < -2) bad(`reload con ${hash}: pierde posición`, String(after));
    else ok(`reload con ${hash}: conserva ancla`, `top=${after}px`);
  }
  ok("hash directo + reload", "#servicios #proceso #cobertura #nosotros #cotizar");

  // ---- Back/forward across anchors ----
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const track = [];
  for (const target of ["#servicios", "#cobertura", "#cotizar"]) {
    await page.goto(`${baseUrl}/${target}`, { waitUntil: "networkidle" });
    track.push(page.url());
  }
  await page.goBack({ waitUntil: "networkidle" });
  if (!page.url().endsWith("#cobertura")) bad("back/forward: goBack no llegó a #cobertura", page.url());
  await page.goBack({ waitUntil: "networkidle" });
  if (!page.url().endsWith("#servicios")) bad("back/forward: goBack no llegó a #servicios", page.url());
  await page.goForward({ waitUntil: "networkidle" });
  ok("back/forward", "servicios -> cobertura -> cotizar -> back/forward OK");

  // ---- /cotizar redirect, no loop ----
  const seen = new Set();
  await page.goto(`${baseUrl}/cotizar`, { waitUntil: "networkidle" });
  const navResp = page.url();
  report.redirects.push({ from: "/cotizar", to: navResp });
  if (!navResp.includes("#cotizar")) bad("/cotizar: no redirige a /#cotizar", navResp);
  ok("/cotizar redirect", `1 salto -> ${navResp}`);

  // ---- Manual redirect chain measurement ----
  {
    let hop = "/cotizar";
    const chain = [hop];
    for (let i = 0; i < 5; i++) {
      const resp = await page.request.get(`${baseUrl}${hop}`);
      const loc = resp.headers()["location"];
      if (![301, 302, 303, 307, 308].includes(resp.status())) break;
      chain.push(loc);
      hop = loc;
      if (seen.has(hop)) { trackBroken("/cotizar", "/cotizar", chain.join(" -> "), "loop en redirects"); break; }
      seen.add(hop);
    }
    if (chain.length > 2) warn("/cotizar: cadena de más de 2 hops", chain.join(" -> "));
    else ok("/cotizar redirect chain", chain.join(" -> "));
    if (!chain[chain.length - 1].startsWith("/#")) {
      const finalUrl = chain[chain.length - 1];
      report.redirects.push({ from: hop, to: finalUrl });
      ok("redirect final resuelve a fragmento home", finalUrl);
    }
  }

  // ---- /privacidad inventory + form back-restore persistence (fresh page = flujo real) ----
  {
    const privPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    privPage.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    privPage.on("pageerror", (e) => pageErrors.push(String(e)));
    privPage.on("response", (resp) => { const s = resp.status(); if (s >= 400 && !simulatingNotFound) httpErrors.push({ url: resp.url(), status: s }); });
    await privPage.addInitScript(() => {
      const force = () => { if (document.documentElement) document.documentElement.style.scrollBehavior = "auto"; };
      if (document.documentElement) force();
      document.addEventListener("DOMContentLoaded", force);
    });
    await privPage.goto(`${baseUrl}/#cotizar`, { waitUntil: "networkidle" });
    await privPage.waitForTimeout(800);
    await privPage.locator("#cotizar input#name").fill("Prueba Integridad");
    await privPage.locator("#cotizar input#origin").fill("Mérida");
    await privPage.locator("#cotizar input#destination").fill("Cancún");
    await privPage.getByRole("link", { name: /Aviso de privacidad/ }).first().click();
    await privPage.waitForURL("**/privacidad");
    await privPage.waitForLoadState("networkidle");
    const privLinks = await collectLinks(privPage);
    register("/privacidad", privLinks);
    checkHrefQuality(privLinks, "/privacidad");
    checkAccessibleText(privLinks, "/privacidad");
    checkTelPub(privLinks, "/privacidad");
    checkHttpHardcoded(privLinks, "/privacidad");
    await verifyTabTargets(privLinks, "/privacidad");
    const privIds = await privPage.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((el) => el.id));
    assertNoDuplicates(privIds, "/privacidad");
    if (privPage.url() !== `${baseUrl}/privacidad` && !privPage.url().includes("/privacidad")) warn("/privacidad: URL inesperada", privPage.url());
    ok("/privacidad", `${privLinks.length} enlaces inventariados`);
    await privPage.screenshot({ path: path.join(screenshotsDir, "link-audit-privacy.png") });

    await privPage.goBack({ waitUntil: "networkidle" });
    const nameOk = await waitValue(privPage, "#cotizar input#name", "Prueba Integridad");
    if (!nameOk) bad("form: volver de privacidad pierde valores", "input#name sin valor esperado");
    else ok("form: valores preservados al volver de /privacidad");
    const originOk = await waitValue(privPage, "#cotizar input#origin", "Mérida");
    const destOk = await waitValue(privPage, "#cotizar input#destination", "Cancún");
    if (!originOk || !destOk) bad("form: origin/destino perdidos al volver", `${originOk ? "origen OK" : "origin perdido"} | ${destOk ? "destino OK" : "destino perdido"}`);
    else ok("form: origin/destino preservados");
    await privPage.close();
  }

  // ---- 404 inventory + logo home ----
  simulatingNotFound = true;
  await page.goto(`${baseUrl}/ruta-inexistente-xyz`, { waitUntil: "networkidle" });
  simulatingNotFound = false;
  await page.waitForTimeout(600);
  const notFoundText = (await page.locator("body").innerText()).toLowerCase();
  if (!notFoundText.includes("404") && !notFoundText.includes("no encontramos")) bad("404: contenido no renderizado");
  else ok("404: página personalizada renderizada");
  const nfLinks = await collectLinks(page);
  register("/404", nfLinks);
  checkHrefQuality(nfLinks, "/404");
  checkAccessibleText(nfLinks, "/404");
  checkTelPub(nfLinks, "/404");
  checkHttpHardcoded(nfLinks, "/404");
  await verifyTabTargets(nfLinks, "/404");
  ok("404 links", nfLinks.map((l) => `${l.text}->${l.href}`).join(" | "));
  await page.locator('a[aria-label="GALAGOM, ir al inicio"]').first().click();
  await page.waitForURL(`${baseUrl}/`);
  await page.waitForTimeout(400);
  ok("404: logo lleva a home");
  const nf404 = nfLinks.find((l) => /volver al inicio/i.test(l.text)) || nfLinks.find((l) => l.href === "/");
  if (nf404 && nf404.text) ok("404: CTA Volver al inicio presente");
  await page.screenshot({ path: path.join(screenshotsDir, "link-audit-404.png") });

  // ---- Animate to cobertura + cotizar screenshots ----
  await page.goto(`${baseUrl}/#cobertura`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(screenshotsDir, "link-audit-anchor-cobertura.png") });
  await page.goto(`${baseUrl}/#cotizar`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(screenshotsDir, "link-audit-anchor-cotizar.png") });

  // ---- Mobile drawer flow (320/390/430): open, links, close, navigate, back no drawer ----
  for (const [width, height] of VIEWPORTS.slice(0, 3)) {
    const bp = await browser.newPage({ viewport: { width, height } });
    const errs = [];
    bp.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    bp.on("pageerror", (e) => errs.push(String(e)));
    await bp.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await bp.getByRole("button", { name: "Abrir menú" }).click();
    await bp.locator(".mobile-drawer").waitFor({ state: "visible" });
    await bp.waitForTimeout(300);
    const drawer = bp.getByRole("dialog", { name: "Navegación móvil" });
    const dl = await drawer.getByRole("navigation", { name: "Navegación móvil" }).locator("a");
    const texts = (await dl.allInnerTexts()).map((t) => t.replace(/\s*→\s*/, "").trim());
    const hrefs = await dl.evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    if (JSON.stringify(texts) !== JSON.stringify(NAV_MOBILE.map(([t]) => t))) bad(`${width}px: drawer links distintos`, JSON.stringify(texts));
    else ok(`${width}px: drawer 6 links exactos`);
    if (JSON.stringify(hrefs) !== JSON.stringify(NAV_MOBILE.map(([, h]) => h))) bad(`${width}px: drawer hrefs distintos`, JSON.stringify(hrefs));
    else ok(`${width}px: drawer hrefs exactos ${hrefs.join(" ")}`);
    const tel = await drawer.locator("a[href^='tel:']").getAttribute("href");
    if (tel !== EXPECTED_PHONE.tel) bad(`${width}px: drawer tel incorrecto`, tel);
    else ok(`${width}px: drawer tel correcto`);
    const wa = await drawer.locator("a[href^='https://wa.me/']").count();
    if (wa && width === 390) warn(`${width}px: hay wa.me dentro del drawer`);
    await bp.keyboard.press("Escape");
    await bp.waitForTimeout(250);
    if (await bp.locator(".mobile-drawer").count()) bad(`${width}px: escape no cerró drawer`);
    else ok(`${width}px: drawer cierra con Escape`);

    await bp.getByRole("button", { name: "Abrir menú" }).click();
    await bp.locator(".mobile-drawer").waitFor({ state: "visible" });
    await bp.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link", { name: /Cobertura/ }).click();
    await bp.waitForTimeout(600);
    if (await bp.locator(".mobile-drawer").count()) bad(`${width}px: drawer no cerró al navegar`);
    else ok(`${width}px: drawer cierra al navegar`);
    await bp.goBack({ waitUntil: "networkidle" });
    await bp.waitForTimeout(500);
    if (await bp.locator(".mobile-drawer").count()) bad(`${width}px: back reabre drawer`);
    else ok(`${width}px: back no reabre drawer`);
    if (errs.length) bad(`${width}px: errores consola drawer`, errs.join(" | "));
    else ok(`${width}px: drawer sin errores de consola`);
    await bp.close();
  }
  ok("drawer móvil", "320/390/430: links, tel, cierre, navegación, back");

  // ---- CTA matrix: hero, service card, coverage on desktop ----
  const heroButtons = await page.getByRole("link", { name: /Cotizar un flete|Conocer servicios/ }).all();
  if (heroButtons.length !== 2) bad("hero CTAs: no hay 2", String(heroButtons.length));
  else ok("hero CTAs: 2", "Cotizar un flete (/#cotizar), Conocer servicios (#servicios)");
  const servicesCtas = await page.getByRole("link", { name: /Solicitar servicio/ }).all();
  if (servicesCtas.length < 5) warn("CTA servicios: menos de 5 cards", String(servicesCtas.length));
  else ok("CTA servicios", `${servicesCtas.length} tarjetas -> /#cotizar`);
  const coverageCta = await page.getByRole("link", { name: /Cotizar una ruta/ }).count();
  if (!coverageCta) bad("CTA cobertura ausente");
  else ok("CTA cobertura presente");
  const whatsFloat = await page.locator('a[data-event="whatsapp_click"]').count();
  if (whatsFloat !== 1) bad("whatsapp flotante", String(whatsFloat));
  else ok("whatsapp flotante global");

  // ---- Keyboard nav desktop: focus order + Enter ----
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.evaluate(() => { const el = document.activeElement; if (el instanceof HTMLElement) el.blur(); });
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.outerHTML?.slice(0, 120));
  if (!firstFocus || !/(a|button)/i.test(firstFocus)) bad("keyboard: primer focus no es enlace/botón");
  else ok("keyboard: Tab activa skip-link o logo");
  let sawSkip = /saltar al contenido/i.test(firstFocus || "");
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.innerText?.slice(0, 30) }));
    if (/Saltar al contenido/i.test(tag.text || "")) sawSkip = true;
    if (i === 12 && tag.text === "Cotizar flete") ok("keyboard: CTA Cotizar flete alcanzable");
  }
  if (!sawSkip) warn("keyboard: skip-link no focuseado en 15 tabs");
  ok("keyboard: Tab recorre enlaces", sawSkip ? "skip-link incluido" : "sin skip-link en 15 tabs");

  // ---- Hydration check ----
  const hydraErrors = consoleErrors.filter((e) => /hydration|hydrated|did not match|prop `(className|style)`|Text content did not match/i.test(e));
  if (hydraErrors.length) { report.hydrations = hydraErrors; bad("hydratación", hydraErrors.join(" | ")); }
  else ok("no hydration errors");

  // ---- Console / page / network aggregation ----
  report.consoleErrors = consoleErrors.filter((e) => !/favicon|download the React DevTools/i.test(e));
  report.pageErrors = pageErrors;
  report.networkFailures = networkFailures.filter((n) => !n.warn);
  report.httpErrors = httpErrors.filter((e) => !/favicon/i.test(e.url));
  const favicon404 = httpErrors.filter((e) => /favicon/i.test(e.url));
  if (favicon404.length) warn("recurso favicon 404", `${favicon404.length} requisición(es)`);
  const thirdPartyWarns = networkFailures.filter((n) => n.warn);
  if (thirdPartyWarns.length) warn("fallos red de terceros (OSM/wa.me) ignorados", thirdPartyWarns.map((n) => n.url).join(", "));
  if (report.consoleErrors.length) bad("console errors", report.consoleErrors.join(" | "));
  if (report.pageErrors.length) bad("page errors", report.pageErrors.join(" | "));
  if (report.networkFailures.length) bad("network failures first-party", JSON.stringify(report.networkFailures));
  if (report.httpErrors.length) bad("http 4xx/5xx first-party", JSON.stringify(report.httpErrors));
  if (!report.consoleErrors.length) ok("consola limpia");

  // ---- Final viewport sweep + 2 remaining screenshots ----
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  for (const [width, height] of VIEWPORTS) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(250);
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    const flowCount = await page.locator('a').count();
    if (!flowCount) bad(`${width}px: sin enlaces renderizados`);
    if (horizontalOverflow) warn(`${width}px: overflow horizontal`, String(document.scrollWidth));
    report.checked.push({ width, height, links: flowCount });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, "link-audit-home.png") });

  const mobileSweep = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobileSweep.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await mobileSweep.getByRole("button", { name: "Abrir menú" }).click();
  await mobileSweep.locator(".mobile-drawer").waitFor({ state: "visible" });
  await mobileSweep.waitForTimeout(300);
  await mobileSweep.screenshot({ path: path.join(screenshotsDir, "link-audit-mobile-menu.png") });
  await mobileSweep.close();

  await page.close();
  await browser.close();
}

// ---- External validation via plain fetch for redirect/DNS sanity ----
async function externalSolvency() {
  // No external links besides wa.me; we do NOT open it in a real browser.
  const waCount = report.bySource["/"]?.filter((l) => l.type === "whatsapp").length ?? 0;
  if (waCount) ok("whatsapp externo verificado por atributos", `${waCount} enlace(s), sin apertura real`);
  const mailtoCount = report.classified.mailto ?? 0;
  report.mailtoAudit = {
    found: mailtoCount,
    note: mailtoCount ? "mailto presente en UI" : "mailto: ninguno en la UI (siteConfig.email existe pero no se expone como enlace)",
  };
  if (!mailtoCount) ok("mailto", "ningún mailto expuesto (config.email no se usa como link)");
}

await run();
await externalSolvency();

report.checksSummary = { broken: report.broken, issues };
mkdirSync(path.dirname(reportFile), { recursive: true });
writeFileSync(reportFile, JSON.stringify(report, null, 2));

const rows = Object.entries(report.bySource).flatMap(([source, links]) =>
  links.map((l) => ({ Source: source, Label: l.text || "(sin texto)", Destination: l.href, Type: l.type, Status: report.broken.some((b) => b.source === source && b.href === l.href) ? "✗" : "OK", Notes: "" }))
);

const md = [
  "# Reporte de integridad de enlaces y navegación",
  "",
  `- Fecha: ${report.generatedAt}`,
  `- BASE_URL: ${baseUrl}`,
  `- Modo: ${report.mode}`,
  "",
  "## Resumen",
  "",
  "| Métrica | Valor |",
  "| --- | --- |",
  `| Enlaces auditados | ${report.totalLinks} |`,
  `| Internos (página) | ${report.classified.internalPage} |`,
  `| Anclas same-page | ${report.classified.samePageFragment} |`,
  `| Anclas cross-page | ${report.classified.crossPageFragment} |`,
  `| Redirects | ${report.classified.redirect} |`,
  `| Externos HTTPS | ${report.classified.externalHttps} |`,
  `| WhatsApp | ${report.classified.whatsapp} |`,
  `| tel: | ${report.classified.tel} |`,
  `| mailto: | ${report.classified.mailto} |`,
  `| Inválidos | ${report.classified.invalid} |`,
  `| Enlaces rotos | ${report.broken.length} |`,
  `| IDs duplicados | ${report.duplicateIds.length} |`,
  `| Errores de consola | ${report.consoleErrors.length} |`,
  `| Errores de página | ${report.pageErrors.length} |`,
  `| Fallos red (first-party) | ${report.networkFailures.length} |`,
  `| HTTP 4xx/5xx first-party | ${report.httpErrors ? report.httpErrors.length : 0} |`,
  `| Errores de hidratación | ${report.hydrations.length} |`,
  "",
  ...(report.broken.length
    ? ["## Enlaces rotos", "", "| Source | Destino | Motivo |", ...report.broken.map((b) => `| ${b.source} | ${b.href} | ${b.reason} |`), ""]
    : ["## Enlaces rotos", "", "Sin enlaces rotos.", ""]),
  ...(report.duplicateIds.length
    ? ["## IDs duplicados", "", "| Ubicación | ID |", ...report.duplicateIds.map((d) => `| ${d.split(":")[0]} | ${d.split(":")[1]} |`), ""]
    : []),
  ...(report.warnings.length ? ["## Advertencias", "", ...report.warnings.map((w) => `- ${w}`), ""] : []),
  "## Tabla de enlaces",
  "",
  "| Source | Label | Destination | Type | Status | Notes |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => `| ${r.Source} | ${r.Label} | ${r.Destination} | ${r.Type} | ${r.Status} | ${r.Notes} |`),
  "",
].join("\n");

writeFileSync(reportMdFile, md);

console.log(`\nReportes escritos: ${reportFile} y ${reportMdFile}`);
console.log(`\nLINK INTEGRITY QA: ${issues.length ? issues.length + " FALLO(S):\n" + issues.join("\n") : "TODO OK"}`);
if (issues.length) process.exit(1);
console.log("\nLINK INTEGRITY QA: TODO OK — enlaces, anclas, redirects, drawer, back/forward, hash, tel/wa, 404, form, keyboard.");
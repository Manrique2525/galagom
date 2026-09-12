import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const EXPECTED = "Transporte que conecta, soluciones que impulsan.";
const EXPECTED_VISIBLE_CHARS = 47;
const issues = [];

const browser = await chromium.launch({ headless: true });

async function sample(page) {
  return page.evaluate(() => {
    const letters = [...document.querySelectorAll("[data-letter]")];
    const visible = letters.filter((l) => getComputedStyle(l).opacity === "1").length;
    const cursor = document.querySelector("[data-cursor]");
    const state = document.querySelector("[data-tw-state]")?.getAttribute("data-tw-state");
    const h1 = document.querySelector("h1");
    const cta = document.querySelector("#hero-section a[href='/#cotizar']")?.getBoundingClientRect() ?? null;
    const h1Rect = h1 ? h1.getBoundingClientRect() : null;
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    return {
      total: letters.length,
      visible,
      cursor: cursor ? getComputedStyle(cursor).opacity : null,
      state,
      h1Count: document.querySelectorAll("h1").length,
      h1Label: h1?.getAttribute("aria-label") ?? null,
      h1Text: h1?.textContent ?? null,
      h1Rect: h1Rect ? { x: h1Rect.x, y: h1Rect.y, w: h1Rect.width, h: h1Rect.height } : null,
      ctaRect: cta ? { x: cta.x, y: cta.y, w: cta.width, h: cta.height } : null,
      overflow,
      bodyText: document.body.innerText,
    };
  });
}

async function waitUntil(page, predicate, label, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const s = await sample(page);
    if (predicate(s)) return s;
    await page.waitForTimeout(90);
  }
  issues.push(`timed out waiting for: ${label}`);
  return sample(page);
}

function rectsEqual(a, b) {
  return !!a && !!b && [a.x, a.y, a.w, a.h].every((v, i) => Math.abs(v - [b.x, b.y, b.w, b.h][i]) < 1);
}

async function heroFlow(page, shots) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#hero-section h1").waitFor({ timeout: 15000 });
  const initial = await sample(page);
  if (initial.h1Count !== 1) issues.push("expected exactly one h1");
  if (initial.h1Label !== EXPECTED) issues.push(`h1 aria-label mismatch: ${initial.h1Label}`);
  if (initial.h1Text.includes("Logística que mueve tu negocio")) issues.push("old headline still present");
  if (!initial.h1Text.includes("Transporte que conecta,") || !initial.h1Text.includes("soluciones que impulsan.")) issues.push("new headline segments missing in h1");
  if (!initial.bodyText.includes("SOLUCIONES LOGÍSTICAS GALAGOM")) issues.push("eyebrow missing");
  if (initial.bodyText.includes("17 años")) issues.push("redundant 17+ claim still present");

  await waitUntil(page, (s) => s.state === "typing" && s.visible > 0 && s.visible < 8, "typing start");
  if (shots.includes("typewriter-start")) await page.locator("#hero-section").screenshot({ path: "docs/screenshots/typewriter-start.png" });

  const mid = await waitUntil(page, (s) => s.state === "typing" && s.visible > 18 && s.visible < EXPECTED_VISIBLE_CHARS, "typing mid");
  if (shots.includes("typewriter-mid")) await page.locator("#hero-section").screenshot({ path: "docs/screenshots/typewriter-mid.png" });

  const final = await waitUntil(page, (s) => s.state === "typing" && s.visible === EXPECTED_VISIBLE_CHARS && s.cursor === "1", "typing end with cursor");
  if (shots.includes("typewriter-final")) await page.locator("#hero-section").screenshot({ path: "docs/screenshots/typewriter-final.png" });

  const done = await waitUntil(page, (s) => s.state === "done" && s.cursor === "0", "cursor faded");
  if (done.h1Count !== 1) issues.push("h1 count changed after animation");
  if (done.total !== EXPECTED_VISIBLE_CHARS) issues.push(`letter count ${done.total} != ${EXPECTED_VISIBLE_CHARS}`);
  if (!rectsEqual(mid.h1Rect, done.h1Rect)) issues.push("h1 box moved during typing (layout shift)");
  if (!rectsEqual(final.ctaRect, done.ctaRect)) issues.push("CTA block moved during animation (layout shift)");
  if (done.overflow) issues.push("horizontal overflow at end");
  if (done.h1Text.trim().replace(/\s+/g, "") !== EXPECTED.replace(/\s+/g, "")) issues.push(`final h1 text mismatched: ${done.h1Text}`);
  return done;
}

const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const desktop = await desktopCtx.newPage();
const desktopErrors = [];
desktop.on("console", (m) => { if (m.type() === "error") desktopErrors.push(m.text()); });
await heroFlow(desktop, ["typewriter-start", "typewriter-mid", "typewriter-final"]);
await pageScreenshot(desktop, "hero-corporate-copy-1440.png");
console.log("desktop consoleErrors", desktopErrors);
if (desktopErrors.length) issues.push("desktop console errors: " + desktopErrors.join(" | "));

const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobile = await mobileCtx.newPage();
await heroFlow(mobile, []);
await pageScreenshot(mobile, "hero-corporate-copy-390.png");

async function pageScreenshot(page, name) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.locator("#hero-section").screenshot({ path: `docs/screenshots/${name}` });
}

const reducedCtx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const reduced = await reducedCtx.newPage();
await reduced.goto(baseUrl, { waitUntil: "domcontentloaded" });
await reduced.locator("#hero-section h1").waitFor({ timeout: 15000 });
await reduced.waitForTimeout(600);
const rm = await sample(reduced);
if (rm.state !== "static") issues.push("reduced motion: expected static state");
if (rm.visible !== rm.total) issues.push("reduced motion: not all letters visible immediately");
if (rm.cursor !== null) issues.push("reduced motion: cursor should not be present");
if (rm.h1Count !== 1) issues.push("reduced motion: h1 count !== 1");
await pageScreenshot(reduced, "typewriter-reduced-motion.png");

const noJsCtx = await browser.newContext({ viewport: { width: 1024, height: 900 }, javaScriptEnabled: false });
const noJs = await noJsCtx.newPage();
await noJs.goto(baseUrl, { waitUntil: "domcontentloaded" });
await noJs.locator("#hero-section h1").waitFor({ timeout: 15000 });
await noJs.waitForTimeout(1600);
const nj = await sample(noJs);
if (nj.visible !== nj.total) issues.push("no-js: letters not all visible");
if (nj.state !== "static") issues.push("no-js: unexpected state");
if (nj.cursor !== null) issues.push("no-js: cursor should not render");
if (nj.h1Count !== 1) issues.push("no-js: h1 count !== 1");
if (nj.h1Label !== EXPECTED) issues.push("no-js: aria-label missing");
if (nj.h1Text.includes("Logística que mueve tu negocio")) issues.push("no-js: old headline present");
if (nj.overflow) issues.push("no-js: horizontal overflow");
await pageScreenshot(noJs, "typewriter-no-js.png");

const narrowCtx = await browser.newContext({ viewport: { width: 320, height: 700 } });
const narrow = await narrowCtx.newPage();
await narrow.goto(baseUrl, { waitUntil: "domcontentloaded" });
await narrow.locator("#hero-section h1").waitFor({ timeout: 15000 });
const nEnd = await waitUntil(narrow, (s) => s.state === "done", "done at 320px");
if (nEnd.overflow) issues.push("320px: horizontal overflow");
if (nEnd.visible !== nEnd.total) issues.push("320px: letters incomplete at end");

await browser.close();

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log("Typewriter QA passed: start/mid/final, reduced motion, no-JS, 1440/390/320.");
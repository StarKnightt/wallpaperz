// Production verification: capture viewport screenshots of live pages.
// Usage: node scripts/screenshot-pages.mjs [path[:name[:scrollTo]] ...]
//   e.g. node scripts/screenshot-pages.mjs /color/green /color/yellow:my-name:600
// With no args, falls back to the default page list below.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://www.wallpaperz.in';

const DEFAULT_PAGES = [
  { url: BASE_URL, name: 'homepage-hero', scrollTo: 0 },
  { url: BASE_URL, name: 'homepage-grid', scrollTo: 1200 },
  { url: `${BASE_URL}/color/purple`, name: 'color-purple', scrollTo: 300 },
  { url: `${BASE_URL}/category/people`, name: 'category-people', scrollTo: 300 },
];

function parseArg(arg) {
  const [pagePath, name, scrollTo] = arg.split(':');
  const derivedName = pagePath.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'homepage';
  return {
    url: `${BASE_URL}${pagePath === '/' ? '' : pagePath}`,
    name: name || derivedName,
    scrollTo: scrollTo !== undefined ? Number(scrollTo) : 300,
  };
}

const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2).map(parseArg)
  : DEFAULT_PAGES;

const OUT_DIR = path.resolve('screenshots');
// Lazy-loaded thumbnails come from ImageKit client-side; give them time to fade in.
const SETTLE_MS = Number(process.env.SETTLE_MS || 2500);

async function capture(browser, { url, name, scrollTo }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch {
      // Analytics beacons can keep the network busy; fall back to 'load' + extra wait.
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(5000);
    }
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await page.waitForTimeout(SETTLE_MS);
    const file = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`ok  ${name} -> ${file}`);
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  let failed = false;
  for (const pageDef of PAGES) {
    try {
      await capture(browser, pageDef);
    } catch (err) {
      failed = true;
      console.error(`FAIL ${pageDef.name} (${pageDef.url}): ${err.message}`);
    }
  }
  await browser.close();
  if (failed) process.exit(1);
}

main();

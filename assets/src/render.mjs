// Renders the banner and avatar to PNG with headless Chromium (Playwright). Usage: node assets/src/render.mjs <playwright index.mjs>
const { chromium } = await import(process.argv[2]);
const here = new URL('.', import.meta.url);
const out = new URL('..', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium' });
for (const [page, file, w, h] of [['banner.html', 'banner.png', 1680, 480], ['avatar.html', 'avatar.png', 1000, 1000]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(new URL(page, here).href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out + file });
  await p.close();
}
await browser.close();

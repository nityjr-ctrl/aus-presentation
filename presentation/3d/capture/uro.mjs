// Shared helpers for capturing the public UroOps 3D AUS page. Page CSS only; nothing is sent to the site.
import { createRequire } from 'node:module';
const require = createRequire(new URL('../', import.meta.url));
export const { chromium } = require('playwright');
export const URL = 'https://uroops3d.com/lab/aus/';
export async function open({ width = 1920, height = 1080, dsf = 1, record } = {}) {
  const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, ...(record ?? {}) });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
  const click = (name) => page.evaluate((n) => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.textContent).trim() === n); if (!b) throw new Error('no button ' + n); b.click(); }, name);
  await click('Pause');
  return { browser, ctx, page, click };
}
// Pin the scene panel to the whole viewport and hide the site chrome around it.
export async function pin(page, extraCss = '') {
  await page.addStyleTag({ content: `
    html, body { overflow: hidden !important; }
    .scene-block { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important;
      max-width: none !important; margin: 0 !important; z-index: 2147483000 !important; background: #10161a !important; border: 0 !important; }
    .feedback-footer, .fc-cmd-trigger, .scene-marker, .scene-hint, .scene-mobile-tools, .scene-cue, .scene-dock, .scene-rail { display: none !important; }
    ${extraCss}` });
  await page.evaluate(() => {
    const block = document.querySelector('.scene-block');
    let el = block.querySelector('canvas');
    while (el.parentElement !== block) el = el.parentElement;
    el.id = 'cap';
    el.style.setProperty('height', '100vh', 'important');
    el.style.setProperty('width', '100vw', 'important');
    for (const b of block.querySelectorAll('button')) if (/Device panel|Full view|^Hide$|^Map$/.test(b.textContent.trim())) b.style.setProperty('display', 'none', 'important');
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(800);
}
export const scrub = (page, v) => page.locator('input.t-scrub').evaluate((e, val) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, String(val));
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, v);
// Hide the narration caption and any label that states a number, a device instruction or back-table preparation.
export const HIDE_CSS = '.anat-say, .aus-panel { display: none !important; }';
export const tidy = (page) => page.evaluate(() => {
  for (const s of document.querySelectorAll('.scene-block .anat-label, .scene-block .aus-error-chip')) {
    const bad = /\d|IFU|Back table|typical|pending/i.test(s.textContent);
    s.style.visibility = bad ? 'hidden' : '';
  }
});

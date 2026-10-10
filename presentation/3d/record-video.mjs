// Records the public UroOps 3D AUS lesson (https://uroops3d.com/lab/aus/) as a 1080p backup video:
// all eleven steps at 1x, then the "Final configuration" preset for 5 s. The scene panel is pinned
// to the full viewport with page CSS only; nothing is sent to the site. Run: node record-video.mjs
// Output: video/aus-flow-1080p.mp4 (H.264, no audio) and video/aus-flow-poster.png
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'video');
const URL = 'https://uroops3d.com/lab/aus/';
const FFMPEG = process.env.FFMPEG ?? 'ffmpeg';
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.webm')) fs.rmSync(path.join(OUT, f));

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
});
const t0 = Date.now();
const page = await context.newPage();
page.setDefaultTimeout(30000);
await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
const click = (name) => page.getByRole('button', { name, exact: true }).first().evaluate((e) => e.click());
await click('1×');
await page.addStyleTag({ content: `
  html, body { overflow: hidden !important; }
  .scene-block { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important;
    max-width: none !important; margin: 0 !important; z-index: 2147483000 !important; background: #10161a !important; }
  .feedback-footer, .fc-cmd-trigger { display: none !important; }` });
await page.evaluate(() => {
  // let the canvas panel take the height the scene block now has, above the step dock
  const block = document.querySelector('.scene-block');
  let el = block.querySelector('canvas');
  while (el.parentElement !== block) el = el.parentElement;
  const dock = block.querySelector('.scene-dock')?.getBoundingClientRect().height ?? 0;
  const cue = block.querySelector('.scene-cue')?.getBoundingClientRect().height ?? 0;
  el.style.setProperty('height', `calc(100vh - ${Math.ceil(dock + cue + 8)}px)`, 'important');
  window.dispatchEvent(new Event('resize'));
});
// back to the start of step 1 and make sure the lesson is playing
await page.locator('input.t-scrub').evaluate((e) => e.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })));
if (await page.getByRole('button', { name: 'Play', exact: true }).count()) await click('Play');
await page.waitForTimeout(1500);
const start = (Date.now() - t0) / 1000;
const stepTimes = [];
let last = -1;
const deadline = Date.now() + 240000;
while (Date.now() < deadline) {
  const v = Number(await page.locator('input.t-scrub').inputValue());
  const s = Math.floor(v);
  if (s !== last) { stepTimes.push([s, ((Date.now() - t0) / 1000 - start).toFixed(1)]); last = s; }
  if (v >= 10.995) break;
  await page.waitForTimeout(250);
}
await page.waitForTimeout(1500);
if (await page.getByRole('button', { name: 'Scene controls', exact: true }).count()) await click('Scene controls');
await click('Final configuration');
if (await page.getByRole('button', { name: 'Close controls', exact: true }).count()) await click('Close controls');
await page.waitForTimeout(5500);
const end = (Date.now() - t0) / 1000;
const video = page.video();
await context.close();
await browser.close();
const webm = await video.path();
console.log('steps (step, seconds from start):', JSON.stringify(stepTimes));
console.log('trim', start.toFixed(2), 'to', end.toFixed(2), 'from', webm);

const mp4 = path.join(OUT, 'aus-flow-1080p.mp4');
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', start.toFixed(2), '-i', webm, '-t', (end - start).toFixed(2),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', '-an', mp4]);
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', '2', '-i', mp4, '-frames:v', '1', path.join(OUT, 'aus-flow-poster.png')]);
fs.rmSync(webm);
console.log('wrote', mp4, fs.statSync(mp4).size, 'bytes');

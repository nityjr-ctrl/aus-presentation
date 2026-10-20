// Steps the public lesson timeline frame by frame and writes JPEG frames. node clip.mjs <id> <cssW> <cssH> <from> <to> <framesPerStep> <captions 0|1> <outdir>
import fs from 'node:fs';
import { open, pin, scrub, tidy, HIDE_CSS } from './uro.mjs';
const [id, w, h, from, to, fps, captions, out] = process.argv.slice(2);
const dir = `${out}/${id}`; fs.mkdirSync(dir, { recursive: true });
const { browser, page } = await open({ width: +w, height: +h, dsf: 2 });
await pin(page, captions === '1' ? '.aus-panel { display: none !important; }' : HIDE_CSS + ' .preview-mark { display: none !important; }');
await scrub(page, (+from + 0.002).toFixed(4)); await page.waitForTimeout(4500);
const n = Math.round((+to - +from) * +fps);
const cap = page.locator('#cap');
for (let i = 0; i <= n; i += 1) {
  const t = Math.min(+to - 0.003, +from + 0.002 + (i / n) * (+to - +from));
  await scrub(page, t.toFixed(4)); await page.waitForTimeout(110);
  if (captions !== '1') await tidy(page);
  await cap.screenshot({ path: `${dir}/f${String(i).padStart(5, '0')}.jpg`, quality: 96, type: 'jpeg' });
}
await page.waitForTimeout(2500);
for (let k = 1; k <= 3; k += 1) await cap.screenshot({ path: `${dir}/f${String(n + k).padStart(5, '0')}.jpg`, quality: 96, type: 'jpeg' });
await browser.close(); fs.writeFileSync(`${dir}/DONE`, String(n + 4)); console.log(id, 'frames', n + 4);

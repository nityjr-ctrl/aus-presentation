import { open, pin, scrub, tidy, HIDE_CSS } from './uro.mjs';
const out = process.argv[2];
const A = [776, 320];
const shots = [
  // name, css w, css h, dsf, scrub time, preset (wide capture, cropped to the content)
  ['std-26', ...A, 4, 1.97], ['std-27', ...A, 4, 3.5], ['std-28', 800, 450, 4, 5.5], ['std-31', ...A, 4, 7.97],
  ['std-06', ...A, 4, 0.5, 'Exploded device'], ['std-16', ...A, 4, 0.5, 'Sagittal'], ['std-33', ...A, 4, 10.97, 'Final configuration'],
  ['d3-26', 730, 375, 3, 1.97], ['d3-27', 730, 375, 3, 3.5], ['d3-28', 730, 375, 3, 5.5], ['d3-30', 600, 410, 3, 6.97],
  ['d3-31', 730, 375, 3, 7.97], ['d3-32', 520, 500, 3, 9.5], ['d3-33', 854, 340, 3, 8.97],
];
const only = process.argv[3]?.split(',');
for (const [name, w, h, dsf, t, preset] of shots) {
  if (only && !only.includes(name)) continue;
  const W = preset ? Math.round(w * 1.6) : w;
  const { browser, page, click } = await open({ width: W, height: h, dsf });
  await pin(page, HIDE_CSS + ' .preview-mark { display: none !important; }');
  await scrub(page, t); await page.waitForTimeout(4000);
  if (preset) { await click(preset); await page.waitForTimeout(4500); }
  await tidy(page); await page.waitForTimeout(200);
  await page.locator('#cap').screenshot({ path: `${out}/${name}${preset ? '.wide' : ''}.png` });
  console.log(name, 'done');
  await browser.close();
}

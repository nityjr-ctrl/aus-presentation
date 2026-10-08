// Renders renders/<id>.png for every step in steps.json with headless Chromium and three.js,
// using the same camera written into the slide's am3d:camera. Run: node render-fallbacks.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary' };
export function serve(dir) {
  const server = http.createServer((req, res) => {
    const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cfg = JSON.parse(fs.readFileSync(path.join(HERE, 'steps.json'), 'utf8'));
  const server = await serve(HERE);
  const port = server.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  fs.mkdirSync(path.join(HERE, 'renders'), { recursive: true });
  for (const step of cfg.slides) {
    const w = Math.round(step.frame.width * 200);
    const h = Math.round(step.frame.height * 200);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    page.on('console', (m) => { if (m.type() === 'error') console.error(step.id, m.text()); });
    page.on('pageerror', (e) => console.error(step.id, e.message));
    await page.goto(`http://127.0.0.1:${port}/viewer.html?step=${step.id}&w=${w}&h=${h}`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
    const out = path.join(HERE, 'renders', `${step.id}.png`);
    await page.locator('canvas').screenshot({ path: out, omitBackground: true });
    const nodes = await page.evaluate(() => window.__nodes.length);
    console.log(step.id, `${w}x${h}`, `${nodes} named objects`, fs.statSync(out).size, 'bytes');
    await page.close();
  }
  await browser.close();
  server.close();
}

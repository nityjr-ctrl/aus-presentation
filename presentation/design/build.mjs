// Builds the redesigned AUS teaching deck (standard and animated) with pptxgenjs.
// usage: node build.mjs            -> build/AUS-teaching-deck.pptx and build/AUS-teaching-deck-3d.pptx
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { PRESENTERS, ACTS, actOf, GLOSSARY, SCRIPT, COVER_NOTES, IMAGE_CREDIT, CLIP_CREDIT, DEVICE_CREDIT, BACKUP_NOTES, REFERENCE_NOTES } from './content.mjs';
import { ASK, EXAMPLE, SUPPORT } from './support.mjs';

const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRES = path.resolve(HERE, '..');
const ASSETS = path.join(PRES, 'assets');
// Optional licensed stock assets (Envato Elements), git-ignored; see assets/envato/README.md.
// section-<1..6>.jpg|png: full-bleed photo behind that section's divider. divider-texture.jpg|png: texture behind every divider.
const ENVATO = path.join(ASSETS, 'envato');
const VEIL_NAME = 'divider gradient veil';
// Replace the marker veil's solid fill with a charcoal gradient: clear over the left 40%, easing to near-solid at the
// right edge, so the divider's slide list always sits on charcoal whatever the picture shows.
async function gradientVeils(file) {
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const grad = `<a:gradFill rotWithShape="1"><a:gsLst>` +
    `<a:gs pos="0"><a:srgbClr val="${C.dark}"><a:alpha val="0"/></a:srgbClr></a:gs>` +
    `<a:gs pos="40000"><a:srgbClr val="${C.dark}"><a:alpha val="0"/></a:srgbClr></a:gs>` +
    `<a:gs pos="72000"><a:srgbClr val="${C.dark}"><a:alpha val="62000"/></a:srgbClr></a:gs>` +
    `<a:gs pos="100000"><a:srgbClr val="${C.dark}"><a:alpha val="96000"/></a:srgbClr></a:gs>` +
    `</a:gsLst><a:lin ang="0" scaled="0"/></a:gradFill>`;
  let n = 0;
  for (const name of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
    let xml = await zip.file(name).async('string');
    if (!xml.includes(`name="${VEIL_NAME}"`)) continue;
    xml = xml.replace(/<p:sp>(?:(?!<\/p:sp>).)*?<\/p:sp>/gs, (sp) => {
      if (!sp.includes(`name="${VEIL_NAME}"`)) return sp;
      n++;
      return sp.replace(/<a:solidFill>(?:(?!<\/a:solidFill>).)*?<\/a:solidFill>/s, grad);
    });
    zip.file(name, xml);
  }
  if (n) fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  return n;
}
function envatoAsset(stem) {
  for (const ext of ['.jpg', '.jpeg', '.png']) {
    const f = path.join(ENVATO, stem + ext);
    if (!fs.existsSync(f)) continue;
    // fit the licensed original to 4K once per build (keeps the decks small; the original is never modified)
    const fitted = path.join(BUILD, `envato-${stem}.jpg`);
    if (!fs.existsSync(fitted) || fs.statSync(fitted).mtimeMs < fs.statSync(f).mtimeMs) {
      execFileSync('python', [path.join(HERE, 'envato_fit.py'), f, fitted], { stdio: 'inherit' });
    }
    return fitted;
  }
  return null;
}
const VIDEO = path.join(PRES, '3d', 'video');
const BUILD = path.join(HERE, 'build');
fs.mkdirSync(BUILD, { recursive: true });

const SLIDES = JSON.parse(fs.readFileSync(path.join(PRES, 'slides.json'), 'utf8'));
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'data', 'deck-data.json'), 'utf8'));
const BACKUP = JSON.parse(fs.readFileSync(path.join(HERE, 'data', 'backup-tables.json'), 'utf8'));

// ---------- design tokens ----------
const C = {
  ink: '1B2430', paper: 'FFFFFF', panel: 'F3F4F6', panel2: 'E9ECF0', rule: 'DDE2E8', muted: '5F6B7A', faint: '8B95A1',
  dark: '1F2326', darkPanel: '2A2F34', onDark: 'F4F5F7', onDarkMuted: 'A7AEB8', onDarkFaint: '7E8791',
  teal: '0F7F86', tealDark: '3FB8BF', amber: 'B8791A', blue: '3B5BA5', terra: 'C2482D', coral: 'E07A5F',
};
const HEAD = 'Segoe UI Semibold';
const BODY = 'Segoe UI';
// (the serif act numerals were dropped on 20 October 2026: plain section dividers)
const W = 13.333, H = 7.5, MX = 0.7; // slide size and side margin
const CONTENT_W = W - 2 * MX;

let SHAPES, CHARTS;
const GAPS = { title: 'Evidence gaps', items: ['Routine versus selective UDS and meaningful outcomes', 'Functional eligibility in DU or chronic retention', 'Staging intervals after different reconstructions', 'Comparative protection from salvage strategies', 'Preparation, irrigation and prolonged prophylaxis', 'Independent long-term ContiClassic outcomes', 'Mechanisms and revision strategy in late leakage'] };
const DECISION = { Implant: C.teal, Optimise: C.amber, Investigate: C.blue, Reconsider: C.terra, Stage: C.blue };

const clipFor = { 25: 'aus-26-exposure', 26: 'aus-27-dissection', 27: 'aus-28-sizing', 29: 'aus-30-balloon', 30: 'aus-31-pump', 31: 'aus-32-check', 32: 'aus-33-overview' };
const clipDims = { 'aus-26-exposure': [1460, 750], 'aus-27-dissection': [1460, 750], 'aus-28-sizing': [1460, 750], 'aus-30-balloon': [1200, 820], 'aus-31-pump': [1460, 750], 'aus-32-check': [1040, 1000], 'aus-33-overview': [1708, 680] };

function poster(name) {
  const png = path.join(BUILD, name + '-poster.png');
  if (!fs.existsSync(png)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(VIDEO, name + '.mp4'), '-frames:v', '1', png]);
  return 'data:image/png;base64,' + fs.readFileSync(png).toString('base64');
}
function clipMs(name) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(VIDEO, name + '.mp4')]).toString();
  return Math.round(parseFloat(out) * 1000);
}

// ---------- notes ----------
// 20 October 2026: the script lives in presenter-guide/AUS-presenter-script.pdf, not in the slides.
// Set DECK_NOTES=1 to put it back into the speaker notes. Picture and clip credits always stay.
const NOTES_IN_DECK = process.env.DECK_NOTES === '1';
function notes(slide, script, credit) {
  const parts = [];
  if (NOTES_IN_DECK && script) parts.push(script);
  if (credit) parts.push(credit);
  if (parts.length) slide.addNotes(parts.join('\n\n'));
}
// Script-format notes. Order on the day: what the slide wants, what to say, one example, what each
// study does on this slide, the line into the next slide.
function studiesBlock(n, codes) {
  if (!codes.length) return '';
  const lines = codes.map((c) => {
    const g = GLOSSARY[c];
    const how = SUPPORT[n] && SUPPORT[n][c];
    if (!g) throw new Error('No glossary entry for ' + c);
    if (!how) throw new Error(`No support line for ${c} on slide ${n}`);
    return `• ${c} — ${g.name} (${g.kind}).\n   ${how}`;
  });
  return 'STUDIES ON THIS SLIDE: WHAT EACH ONE DOES HERE\n' + lines.join('\n');
}
function teachingNotes(n, extra) {
  const s = SCRIPT[n];
  const t = DATA.times[n];
  const act = actOf(n);
  if (!ASK[n] || !EXAMPLE[n]) throw new Error('No ask or example for slide ' + n);
  const head = `[${act.title} · Teaching slide ${String(n).padStart(2, '0')} of 38 · ${t.clock} · ${t.time}]\nTHIS SLIDE WANTS: ${ASK[n]}\nON THE SLIDE: ${s.frame}`;
  const say = 'SAY\n' + s.say.join('\n\n');
  const parts = [head, say, 'EXAMPLE\n' + EXAMPLE[n]];
  const st = studiesBlock(n, DATA.codes[n]);
  if (st) parts.push(st);
  if (s.transition) parts.push('NEXT → ' + s.transition);
  if (extra) parts.push(extra);
  return parts.join('\n\n');
}

// ---------- primitives ----------
function text(slide, str, o) {
  const opts = Object.assign({ fontFace: BODY, color: C.ink, fontSize: 14, margin: 0, isTextBox: true, valign: 'top', align: 'left', fit: 'none' }, o);
  slide.addText(str, opts);
}
function rect(slide, x, y, w, h, fill, extra = {}) {
  slide.addShape(SHAPES.roundRect, Object.assign({ x, y, w, h, fill: { color: fill }, line: { type: 'none' }, rectRadius: 0.14 }, extra));
}
function pill(slide, x, y, w, h, fill, label, color = 'FFFFFF', size = 10) {
  rect(slide, x, y, w, h, fill, { rectRadius: h / 2 });
  text(slide, label, { x, y, w, h, fontSize: size, color, bold: true, align: 'center', valign: 'middle', charSpacing: 1 });
}
function numberBadge(slide, x, y, d, label, fill, color = 'FFFFFF', size = 13) {
  slide.addShape(SHAPES.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
  text(slide, label, { x, y, w: d, h: d, fontSize: size, color, bold: true, align: 'center', valign: 'middle', fontFace: HEAD });
}
function dot(slide, x, y, fill) {
  slide.addShape(SHAPES.ellipse, { x, y, w: 0.11, h: 0.11, fill: { color: fill }, line: { type: 'none' } });
}

// Frame used by every teaching slide: act eyebrow, clock, title, citation codes, takeaway.
function frame(slide, n, title, { dark = false, takeaway = null } = {}) {
  const act = actOf(n);
  const t = DATA.times[n];
  const mutedC = dark ? C.onDarkMuted : C.muted;
  const faintC = dark ? C.onDarkFaint : C.faint;
  const inkC = dark ? C.onDark : C.ink;
  const accent = dark ? C.tealDark : C.teal;
  slide.background = { color: dark ? C.dark : C.paper };
  // Section name on the left, slide number on the right; the running clock lives in the presenter script only.
  text(slide, act.title.toUpperCase(), { x: MX, y: 0.42, w: 7, h: 0.3, fontSize: 9.5, color: accent, bold: true, charSpacing: 2.5 });
  text(slide, `${String(n).padStart(2, '0')} / 38`, { x: W - MX - 5, y: 0.42, w: 5, h: 0.3, fontSize: 9.5, color: mutedC, align: 'right', charSpacing: 1 });
  text(slide, title, { x: MX, y: 0.8, w: CONTENT_W, h: 0.9, fontSize: 30, color: inkC, fontFace: HEAD, valign: 'middle' });
  const codes = DATA.codes[n];
  if (codes.length) text(slide, codes.join('  ·  '), { x: MX, y: H - 0.56, w: CONTENT_W - 1, h: 0.25, fontSize: 8, color: faintC, charSpacing: 0.5 });
  if (takeaway) {
    text(slide, takeaway, { x: MX, y: 6.2, w: CONTENT_W, h: 0.62, fontSize: 12, color: mutedC, italic: true, valign: 'bottom' });
  }
}

// ---------- slide types ----------
function slideDecisions(slide, s) {
  frame(slide, s.n, s.title);
  text(slide, s.lead, { x: MX, y: 1.9, w: CONTENT_W, h: 0.5, fontSize: 18, color: C.muted });
  const gap = 0.3, cw = (CONTENT_W - 3 * gap) / 4, y = 2.75, ch = 3.05;
  s.rows.forEach(([word, desc], i) => {
    const x = MX + i * (cw + gap);
    rect(slide, x, y, cw, ch, C.panel);
    slide.addShape(SHAPES.ellipse, { x: x + 0.32, y: y + 0.4, w: 0.2, h: 0.2, fill: { color: DECISION[word] }, line: { type: 'none' } });
    text(slide, word, { x: x + 0.3, y: y + 0.75, w: cw - 0.6, h: 0.55, fontSize: 24, color: DECISION[word], fontFace: HEAD });
    text(slide, desc, { x: x + 0.3, y: y + 1.4, w: cw - 0.6, h: 1.4, fontSize: 15.5, color: C.ink, lineSpacingMultiple: 1.15 });
  });
}

function styledTable(slide, headers, rows, x, y, w, colW, { fontSize = 13, rowH = null, dark = false } = {}) {
  const header = headers.map((h) => ({ text: h, options: { bold: true, color: 'FFFFFF', fill: { color: C.ink }, fontSize: fontSize - 1, fontFace: HEAD, valign: 'middle', margin: [0.1, 0.16, 0.1, 0.16] } }));
  const body = rows.map((r, ri) => r.map((cell, ci) => ({ text: cell, options: { color: C.ink, bold: ci === 0, fill: { color: ri % 2 === 0 ? C.paper : C.panel }, fontSize, valign: 'middle', margin: [0.12, 0.16, 0.12, 0.16] } })));
  const opts = { x, y, w, colW, border: { type: 'solid', pt: 0.75, color: C.rule }, fontFace: BODY, autoPage: false };
  if (rowH) opts.rowH = rowH;
  slide.addTable([header, ...body], opts);
}

function slideTable(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const n = s.headers.length;
  const colW = n === 2 ? [4.2, CONTENT_W - 4.2] : n === 3 ? [2.6, 4.45, CONTENT_W - 7.05] : Array(n).fill(CONTENT_W / n);
  const short = s.rows.length <= 3;
  const rowH = Math.max(0.6, Math.min(short ? 1.2 : 0.95, 3.7 / s.rows.length));
  styledTable(slide, s.headers, s.rows, MX, 1.95, CONTENT_W, colW, { fontSize: short ? 15 : 13.5, rowH: [0.45, ...Array(s.rows.length).fill(rowH)] });
}

function card(slide, x, y, w, h, header, items, { dark = false, accent = C.teal, fontSize = 15.5 } = {}) {
  rect(slide, x, y, w, h, dark ? C.darkPanel : C.panel);
  text(slide, header, { x: x + 0.35, y: y + 0.32, w: w - 0.7, h: 0.4, fontSize: 15, color: accent, fontFace: HEAD });
  let yy = y + 0.95;
  const lineH = Math.min(0.9, (h - 1.25) / items.length);
  items.forEach((it) => {
    dot(slide, x + 0.35, yy + 0.09, accent);
    text(slide, it, { x: x + 0.62, y: yy, w: w - 0.97, h: lineH - 0.05, fontSize, color: dark ? C.onDark : C.ink, lineSpacingMultiple: 1.1 });
    yy += lineH;
  });
}

function slideColumns(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const gap = 0.35, cw = (CONTENT_W - gap) / 2, y = 1.95, ch = 4.1;
  s.cols.forEach((col, i) => card(slide, MX + i * (cw + gap), y, cw, ch, col[0], col.slice(1), { accent: i === 0 ? C.teal : C.blue }));
}

function slideSteps(slide, s, { clip = null } = {}) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const rows = s.rows;
  const listW = clip ? 7.0 : CONTENT_W;
  const y0 = 2.0, lineH = Math.min(0.95, 4.1 / rows.length);
  rows.forEach(([num, label], i) => {
    const y = y0 + i * lineH;
    numberBadge(slide, MX, y, 0.5, num, C.teal, 'FFFFFF', 13);
    text(slide, label, { x: MX + 0.75, y, w: listW - 0.75, h: 0.5, fontSize: 17, color: C.ink, valign: 'middle' });
    if (i < rows.length - 1) slide.addShape(SHAPES.line, { x: MX + 0.75, y: y + lineH - 0.02, w: listW - 0.75, h: 0, line: { color: C.rule, width: 0.75 } });
  });
  if (clip) placeClip(slide, clip, MX + listW + 0.4, 1.95, CONTENT_W - listW - 0.4, 4.1, true);
}

function imageBox(slide, asset, x, y, w, h, { dark = true } = {}) {
  // UroOps stills are 2.43:1; contain inside the box, aligned to the top.
  const img = path.join(ASSETS, asset);
  const ratio = { 'uroops-exploded.png': 3105 / 1280, 'uroops-sagittal.png': 3105 / 1280, 'uroops-surgeon.png': 3104 / 1280, 'uroops-cuff-site.png': 3104 / 1280, 'uroops-aus.png': 3200 / 1800, 'uroops-three-spaces.png': 3104 / 1280, 'uroops-final.png': 3105 / 1280, 'conticlassic-000.png': 1 }[asset] || 2.4;
  let iw = w, ih = w / ratio;
  if (ih > h) { ih = h; iw = h * ratio; }
  const ix = iw >= 0.8 * w ? x : x + (w - iw) / 2, iy = y + (h - ih) / 2;
  slide.addImage({ path: img, x: ix, y: iy, w: iw, h: ih });
  return { x: ix, y: iy, w: iw, h: ih };
}

// Animated deck: a looping clip replaces the still. Poster = first frame.
let CLIPS_ON = false;
const CLIP_SPECS = []; // {slideIndex, name}
function placeClip(slide, name, x, y, w, h, panel = false) {
  const [vw, vh] = clipDims[name];
  const ratio = vw / vh;
  let iw = w, ih = w / ratio;
  if (ih > h) { ih = h; iw = h * ratio; }
  const cx = !panel && iw >= 0.8 * w ? x : x + (w - iw) / 2, cy = y + (h - ih) / 2;
  if (panel) rect(slide, x, y, w, h, C.darkPanel);
  slide.addMedia({ type: 'video', path: path.join(VIDEO, name + '.mp4'), cover: poster(name), x: cx, y: cy, w: iw, h: ih, objectName: 'UroOps clip ' + name });
  CLIP_SPECS.push({ slide, name });
}

function slideImage(slide, s) {
  frame(slide, s.n, s.title, { dark: true, takeaway: s.bottom });
  const imgW = 7.9, imgH = 3.6, imgY = 2.0;
  const clip = CLIPS_ON && clipFor[s.n];
  if (clip) placeClip(slide, clip, MX, imgY, imgW, imgH);
  else imageBox(slide, s.asset, MX, imgY, imgW, imgH);
  const rx = MX + imgW + 0.5, rw = W - MX - rx;
  text(slide, s.label, { x: rx, y: imgY, w: rw, h: 0.4, fontSize: 15, color: C.tealDark, fontFace: HEAD });
  let yy = imgY + 0.6;
  const lineH = Math.min(0.85, 3.1 / s.items.length);
  s.items.forEach((it) => {
    dot(slide, rx, yy + 0.09, C.tealDark);
    text(slide, it, { x: rx + 0.27, y: yy, w: rw - 0.27, h: lineH - 0.05, fontSize: 14, color: C.onDark, lineSpacingMultiple: 1.12 });
    yy += lineH;
  });
}

function slideCase(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const lw = 6.6;
  pill(slide, MX, 1.95, 2.3, 0.34, C.amber, `FICTIONAL CASE ${s.case}`, 'FFFFFF', 9);
  let yy = 2.55;
  s.facts.forEach((f) => {
    dot(slide, MX, yy + 0.1, C.teal);
    text(slide, f, { x: MX + 0.3, y: yy, w: lw - 0.3, h: 0.75, fontSize: 15.5, color: C.ink, lineSpacingMultiple: 1.1 });
    yy += 0.82;
  });
  const rx = MX + lw + 0.5, rw = W - MX - rx;
  rect(slide, rx, 1.95, rw, 3.95, C.panel);
  text(slide, s.question, { x: rx + 0.4, y: 2.25, w: rw - 0.8, h: 1.6, fontSize: 24, color: C.ink, fontFace: HEAD, lineSpacingMultiple: 1.05 });
  text(slide, 'YOUR CALL', { x: rx + 0.4, y: 3.95, w: rw - 0.8, h: 0.3, fontSize: 9, color: C.muted, bold: true, charSpacing: 2.5 });
  const opts = s.options.split(' / ');
  let cx = rx + 0.4, yv = 4.32;
  opts.forEach((o) => {
    const w = 0.34 + o.length * 0.108;
    if (cx + w > rx + rw - 0.4) { cx = rx + 0.4; yv += 0.52; }
    pill(slide, cx, yv, w, 0.4, DECISION[o] || C.ink, o.toUpperCase(), 'FFFFFF', 10);
    cx += w + 0.14;
  });
}

function slideOutcomes(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const stats = [
    { label: 'AMS 800: zero-pad use', big: '60%', lines: ['61 / 101 at 12 months after activation', 'AUSCO 2026: 115 primary implants'], limit: 'Single-arm, manufacturer-funded study. Missing outcomes and one-year follow-up.' },
    { label: 'ContiClassic: device survival', big: '93.2%', lines: ['12-month Kaplan–Meier estimate', 'First 116 recipients, mixed indications'], limit: 'Abstract-level, no comparator. A standardised continence result is unverified.' },
  ];
  const gap = 0.35, cw = (CONTENT_W - gap) / 2, y = 1.95, ch = 4.15;
  stats.forEach((st, i) => {
    const x = MX + i * (cw + gap);
    rect(slide, x, y, cw, ch, C.panel);
    text(slide, st.label, { x: x + 0.4, y: y + 0.35, w: cw - 0.8, h: 0.4, fontSize: 15, color: C.teal, fontFace: HEAD });
    text(slide, st.big, { x: x + 0.4, y: y + 0.75, w: cw - 0.8, h: 1.35, fontSize: 66, color: C.ink, fontFace: HEAD, valign: 'middle' });
    text(slide, st.lines.join('\n'), { x: x + 0.4, y: y + 2.2, w: cw - 0.8, h: 0.9, fontSize: 14, color: C.ink, lineSpacingMultiple: 1.2 });
    text(slide, st.limit, { x: x + 0.4, y: y + 3.2, w: cw - 0.8, h: 0.8, fontSize: 12, color: C.muted, italic: true, lineSpacingMultiple: 1.15 });
  });
}

function slideStatement(slide, s, accent) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const lw = 5.6;
  text(slide, s.lead, { x: MX, y: 1.95, w: lw, h: 4.0, fontSize: 32, color: accent, fontFace: HEAD, lineSpacingMultiple: 1.05, valign: 'middle' });
  const rx = MX + lw + 0.6, rw = W - MX - rx;
  rect(slide, rx, 1.95, rw, 4.0, C.panel);
  let yy = 2.3;
  s.items.forEach((it, i) => {
    numberBadge(slide, rx + 0.35, yy, 0.42, String(i + 1), accent, 'FFFFFF', 12);
    text(slide, it, { x: rx + 0.95, y: yy - 0.02, w: rw - 1.3, h: 1.0, fontSize: 15.5, color: C.ink, lineSpacingMultiple: 1.12 });
    yy += 1.18;
  });
}

function lineChart(slide, x, y, w, h, values, color, catTitle, valTitle, smooth) {
  slide.addChart(CHARTS.line, [{ name: 'Pressure', labels: values.map((_, i) => String(i)), values }], {
    x, y, w, h, chartColors: [color], lineSize: 3, lineDataSymbol: 'none', lineSmooth: smooth, showLegend: false,
    catAxisTitle: catTitle, showCatAxisTitle: true, catAxisTitleFontSize: 10, catAxisTitleColor: C.muted, catAxisTitleFontFace: '+mn-lt',
    valAxisTitle: valTitle, showValAxisTitle: true, valAxisTitleFontSize: 10, valAxisTitleColor: C.muted, valAxisTitleFontFace: '+mn-lt',
    catAxisLabelFontSize: 9, catAxisLabelColor: C.faint, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontSize: 9, valAxisLabelColor: C.faint, valAxisLabelFontFace: '+mn-lt',
    valAxisMinVal: 0, valAxisMaxVal: 10, valAxisMajorUnit: 2, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    valAxisLineColor: C.rule, catAxisLineColor: C.rule, plotArea: { fill: { color: C.paper } }, chartArea: { fill: { color: C.paper }, roundedCorners: false },
  });
}

function slidePhysiology(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const gap = 0.35, cw = (CONTENT_W - gap) / 2, y = 1.95, ch = 4.15;
  const panels = [
    { head: 'DO: transient contraction', values: [0, 0, 0, 0.4, 2.8, 7, 1.2, 0.4, 0, 0], color: C.teal, cap: 'Involuntary filling contraction', smooth: false },
    { head: 'Poor compliance: sustained rise', values: [0, 0.3, 0.7, 1.2, 1.8, 2.6, 3.5, 4.6, 5.8, 7.2], color: C.terra, cap: 'A separate storage-safety problem', smooth: true },
  ];
  panels.forEach((p, i) => {
    const x = MX + i * (cw + gap);
    rect(slide, x, y, cw, ch, C.panel);
    text(slide, p.head, { x: x + 0.35, y: y + 0.3, w: cw - 0.7, h: 0.4, fontSize: 15, color: p.color, fontFace: HEAD });
    rect(slide, x + 0.3, y + 0.8, cw - 0.6, 2.6, C.paper, { rectRadius: 0.08 });
    lineChart(slide, x + 0.35, y + 0.85, cw - 0.7, 2.5, p.values, p.color, 'Increasing filling volume →  (arbitrary units)', 'Pressure ↑', p.smooth);
    text(slide, p.cap, { x: x + 0.35, y: y + 3.55, w: cw - 0.7, h: 0.4, fontSize: 14, color: C.ink, bold: true });
  });
}

function slideWash(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  text(slide, s.lead, { x: MX, y: 1.9, w: CONTENT_W, h: 0.7, fontSize: 19, color: C.ink, fontFace: HEAD, lineSpacingMultiple: 1.05 });
  const gap = 0.3, cw = (CONTENT_W - gap) / 2, ch = 1.45, y0 = 2.85;
  s.rows.forEach(([label, desc], i) => {
    const x = MX + (i % 2) * (cw + gap), y = y0 + Math.floor(i / 2) * (ch + gap);
    rect(slide, x, y, cw, ch, C.panel);
    numberBadge(slide, x + 0.3, y + 0.32, 0.42, String(i + 1), C.teal, 'FFFFFF', 12);
    text(slide, label, { x: x + 0.9, y: y + 0.3, w: cw - 1.2, h: 0.4, fontSize: 15, color: C.teal, fontFace: HEAD });
    text(slide, desc, { x: x + 0.9, y: y + 0.72, w: cw - 1.2, h: 0.6, fontSize: 14, color: C.ink });
  });
}

function slidePrepChart(slide, s) {
  frame(slide, s.n, s.title, { takeaway: s.bottom });
  const cw = 6.6;
  rect(slide, MX, 1.95, cw, 4.15, C.panel);
  text(slide, 'Positive post-preparation skin cultures', { x: MX + 0.35, y: 2.25, w: cw - 0.7, h: 0.35, fontSize: 13, color: C.muted, bold: true });
  slide.addChart(CHARTS.bar, [{ name: 'Positive cultures', labels: ['Chlorhexidine–alcohol', 'Povidone–iodine'], values: [8, 32] }], {
    x: MX + 0.35, y: 2.65, w: cw - 0.7, h: 3.3, barDir: 'col', chartColors: [C.teal, C.terra], barGapWidthPct: 90,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelFontSize: 16, dataLabelColor: C.ink, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt',
    showLegend: false, valAxisMinVal: 0, valAxisMaxVal: 40, valAxisMajorUnit: 10, valAxisLabelFormatCode: '0"%"',
    valAxisLabelFontSize: 10, valAxisLabelColor: C.faint, valAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 12, catAxisLabelColor: C.ink, catAxisLabelFontFace: '+mn-lt',
    valGridLine: { color: C.rule, size: 0.5 }, catGridLine: { style: 'none' }, valAxisLineShow: false, catAxisLineColor: C.rule,
    plotArea: { fill: { color: C.panel } }, chartArea: { fill: { color: C.panel }, roundedCorners: false },
  });
  const rx = MX + cw + 0.5, rw = W - MX - rx;
  text(slide, 'A microbiological endpoint', { x: rx, y: 2.0, w: rw, h: 0.5, fontSize: 20, color: C.ink, fontFace: HEAD });
  text(slide, 'Direct AUS infection evidence remains limited', { x: rx, y: 2.7, w: rw, h: 0.8, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.15 });
  rect(slide, rx, 3.75, rw, 1.3, C.panel);
  text(slide, 'Correct product, anatomy and complete drying still matter', { x: rx + 0.35, y: 3.95, w: rw - 0.7, h: 0.9, fontSize: 15, color: C.teal, fontFace: HEAD, lineSpacingMultiple: 1.1 });
}

function deviceDark() {
  const out = path.join(BUILD, 'conticlassic-dark.png');
  if (!fs.existsSync(out)) execFileSync('python', [path.join(HERE, 'device_dark.py'), path.join(ASSETS, 'conticlassic-000.png'), out, C.dark]);
  return out;
}

function slideDevice(slide, s) {
  frame(slide, s.n, s.title, { dark: true, takeaway: s.bottom });
  const clip = CLIPS_ON && clipFor[s.n];
  if (clip) placeClip(slide, clip, MX, 1.95, 5.6, 4.0);
  else slide.addImage({ path: deviceDark(), x: MX + 0.8, y: 1.95, w: 4.0, h: 4.0 });
  const rx = MX + 5.6 + 0.6, rw = W - MX - rx;
  const stats = [['ContiClassic label', '60–69 cmH₂O'], ['AMS 800 consensus', 'Commonly 61–70 cmH₂O']];
  stats.forEach(([lab, val], i) => {
    const y = 1.95 + i * 1.75;
    rect(slide, rx, y, rw, 1.5, C.darkPanel);
    text(slide, lab, { x: rx + 0.35, y: y + 0.25, w: rw - 0.7, h: 0.35, fontSize: 13, color: C.tealDark, fontFace: HEAD });
    text(slide, val, { x: rx + 0.35, y: y + 0.62, w: rw - 0.7, h: 0.7, fontSize: 28, color: C.onDark, fontFace: HEAD, valign: 'middle' });
  });
  text(slide, 'These ranges are device-specific', { x: rx, y: 5.55, w: rw, h: 0.4, fontSize: 13, color: C.onDarkMuted, italic: true });
}

function slideDemo(slide, s) {
  frame(slide, s.n, s.title, { dark: true });
  const imgW = 7.9, imgH = 3.6, imgY = 2.0;
  const clip = CLIPS_ON && clipFor[s.n];
  if (clip) placeClip(slide, clip, MX, imgY, imgW, imgH);
  else imageBox(slide, s.asset, MX, imgY, imgW, imgH);
  const rx = MX + imgW + 0.5, rw = W - MX - rx;
  pill(slide, rx, imgY, 2.6, 0.34, C.tealDark, s.label.toUpperCase(), C.dark, 9);
  const items = ['Cuff and dorsal plane', 'Pump access', 'Balloon pocket', 'Tubing route'];
  let yy = imgY + 0.6;
  items.forEach((it, i) => {
    numberBadge(slide, rx, yy, 0.4, String(i + 1), C.tealDark, C.dark, 12);
    text(slide, it, { x: rx + 0.58, y: yy, w: rw - 0.58, h: 0.4, fontSize: 15, color: C.onDark, valign: 'middle' });
    yy += 0.62;
  });
  text(slide, 'uroops3d.com/lab/aus', { x: rx, y: 5.15, w: rw, h: 0.4, fontSize: 14, color: C.tealDark, bold: true, hyperlink: { url: 'https://uroops3d.com/lab/aus' } });
  text(slide, 'Live page. Teaching schematic, clinical review pending.', { x: MX, y: imgY + imgH + 0.15, w: imgW, h: 0.3, fontSize: 10, color: C.onDarkFaint });
}

function slideDiscussion(slide, s) {
  frame(slide, s.n, s.title, { dark: true });
  let yy = 2.3;
  s.items.forEach((q, i) => {
    numberBadge(slide, MX, yy + 0.12, 0.5, String(i + 1), C.tealDark, C.dark, 14);
    text(slide, q, { x: MX + 0.8, y: yy, w: CONTENT_W - 0.8, h: 0.75, fontSize: 24, color: C.onDark, fontFace: HEAD, valign: 'middle' });
    yy += 1.05;
  });
  text(slide, s.bottom, { x: MX, y: 6.0, w: CONTENT_W, h: 0.5, fontSize: 16, color: C.tealDark, italic: true });
}

// ---------- non-teaching slides ----------
function cover(pres) {
  pres.addSection({ title: 'Opening' });
  const slide = pres.addSlide({ sectionTitle: 'Opening' });
  slide.background = { color: C.dark };
  slide.addImage({ path: path.join(ASSETS, 'uroops-cover.png'), x: 5.9, y: 0, w: W - 5.9, h: H, sizing: { type: 'cover', w: W - 5.9, h: H } });
  text(slide, 'EXPERT TEACHING SESSION', { x: MX, y: 1.1, w: 5.5, h: 0.3, fontSize: 9.5, color: C.tealDark, bold: true, charSpacing: 2.5 });
  text(slide, 'Artificial urinary sphincter surgery', { x: MX, y: 1.55, w: 5.4, h: 2.0, fontSize: 42, color: C.onDark, fontFace: HEAD, lineSpacingMultiple: 0.98, valign: 'top' });
  text(slide, 'Patient selection, difficult bladders and difficult urethras', { x: MX, y: 3.65, w: 5.0, h: 0.9, fontSize: 17, color: C.onDarkMuted, lineSpacingMultiple: 1.15 });
  text(slide, '[Meeting and date]', { x: MX, y: 4.65, w: 5, h: 0.3, fontSize: 11, color: C.onDarkFaint });
  let yy = 5.15;
  PRESENTERS.forEach(([name, role]) => {
    text(slide, [{ text: name, options: { bold: true, color: C.onDark, fontSize: 13 } }, { text: '   ' + role, options: { color: C.onDarkMuted, fontSize: 11 } }], { x: MX, y: yy, w: 5.2, h: 0.36, valign: 'middle' });
    yy += 0.42;
  });
  const [coverScript, coverCredit] = COVER_NOTES.split('\n\n');
  notes(slide, coverScript, coverCredit);
}

function divider(pres, act, idx) {
  pres.addSection({ title: act.title });
  const slide = pres.addSlide({ sectionTitle: act.title });
  slide.background = { color: C.dark };
  const photo = envatoAsset('section-' + (idx + 1));
  const texture = photo ? null : envatoAsset('divider-texture');
  if (photo || texture) {
    // Full-bleed image under a charcoal veil so the type keeps its contrast. A photo gets a heavier veil than a
    // texture, and the veil deepens from the middle to the right edge in narrow strips (pptxgenjs has no gradient
    // fill), so the slide list on the right always sits on near-solid charcoal whatever the picture shows.
    slide.addImage({ path: photo || texture, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
    const base = photo ? 30 : 45; // transparency of the uniform veil (lower = darker)
    slide.addShape(SHAPES.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.dark, transparency: base }, line: { type: 'none' } });
    // The second veil is given a real left-to-right gradient by gradientVeils() after the file is written
    // (pptxgenjs writes solid fills only); its name is the marker.
    slide.addShape(SHAPES.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.dark, transparency: 100 }, line: { type: 'none' }, objectName: VEIL_NAME });
  }
  // Plain section divider: title and its one-line question on the left, the section's slides on the right.
  rect(slide, MX, 2.25, 0.6, 0.06, C.tealDark, { rectRadius: 0.03 });
  text(slide, act.title, { x: MX, y: 2.45, w: 6.6, h: 1.3, fontSize: 40, color: C.onDark, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
  text(slide, act.question, { x: MX, y: 3.95, w: 6.3, h: 1.3, fontSize: 15, color: C.onDarkMuted, lineSpacingMultiple: 1.2 });
  // what is in this section
  const rx = 7.9, rw = W - MX - rx;
  text(slide, 'IN THIS SECTION', { x: rx, y: 1.3, w: rw, h: 0.3, fontSize: 10, color: C.onDarkMuted, bold: true, charSpacing: 2 });
  let yy = 1.8;
  const list = SLIDES.filter((s) => s.n >= act.slides[0] && s.n <= act.slides[1]);
  const lineH = Math.min(0.5, 4.2 / list.length);
  list.forEach((s) => {
    text(slide, String(s.n).padStart(2, '0'), { x: rx, y: yy, w: 0.5, h: lineH, fontSize: 11, color: C.tealDark, bold: true, valign: 'middle' });
    text(slide, s.title, { x: rx + 0.5, y: yy, w: rw - 0.5, h: lineH, fontSize: 13, color: C.onDark, valign: 'middle' });
    yy += lineH;
  });
  // progress: six acts
  const segW = (CONTENT_W - 5 * 0.12) / 6;
  ACTS.forEach((a, i) => {
    rect(slide, MX + i * (segW + 0.12), 6.55, segW, 0.09, i <= idx ? C.tealDark : C.darkPanel, { rectRadius: 0.04 });
    text(slide, a.title, { x: MX + i * (segW + 0.12), y: 6.7, w: segW, h: 0.3, fontSize: 8.5, color: i === idx ? C.onDark : C.onDarkFaint });
  });
  const span = `${act.slides[0]}–${act.slides[1]}`;
  notes(slide, `[Section: ${act.title} · ${act.clock} · ${act.minutes} minutes · teaching slides ${span}]\nSection slide; it takes no time from the clock. Read the title, say the one-line question, and move on.\n\nSAY\n"${act.question}"`, null);
}

function backupTable(pres, t, script) {
  const slide = pres.addSlide({ sectionTitle: 'Backup and references' });
  slide.background = { color: C.paper };
  text(slide, 'BACKUP', { x: MX, y: 0.42, w: 7, h: 0.3, fontSize: 9.5, color: C.teal, bold: true, charSpacing: 2.5 });
  text(slide, t.title, { x: MX, y: 0.8, w: CONTENT_W, h: 0.9, fontSize: 30, color: C.ink, fontFace: HEAD, valign: 'middle' });
  const colW = [3.6, 4.1, CONTENT_W - 7.7];
  styledTable(slide, t.headers, t.rows, MX, 1.95, CONTENT_W, colW, { fontSize: 12.5, rowH: [0.45, 1.15, 1.15, 1.15] });
  notes(slide, script, null);
}

function backupGaps(pres, t) {
  const slide = pres.addSlide({ sectionTitle: 'Backup and references' });
  slide.background = { color: C.paper };
  text(slide, 'BACKUP', { x: MX, y: 0.42, w: 7, h: 0.3, fontSize: 9.5, color: C.teal, bold: true, charSpacing: 2.5 });
  text(slide, t.title, { x: MX, y: 0.8, w: CONTENT_W, h: 0.9, fontSize: 30, color: C.ink, fontFace: HEAD, valign: 'middle' });
  const items = t.items;
  const gap = 0.25, cw = (CONTENT_W - gap) / 2, ch = 1.0;
  items.forEach((it, i) => {
    const x = MX + (i % 2) * (cw + gap), y = 1.95 + Math.floor(i / 2) * (ch + gap);
    rect(slide, x, y, cw, ch, C.panel);
    numberBadge(slide, x + 0.3, y + 0.29, 0.42, String(i + 1), C.teal, 'FFFFFF', 12);
    text(slide, it, { x: x + 0.9, y: y + 0.15, w: cw - 1.2, h: ch - 0.3, fontSize: 14, color: C.ink, valign: 'middle' });
  });
  notes(slide, BACKUP_NOTES.gaps, null);
}

function backupVideo(pres) {
  const slide = pres.addSlide({ sectionTitle: 'Backup and references' });
  slide.background = { color: C.dark };
  text(slide, 'BACKUP', { x: MX, y: 0.42, w: 7, h: 0.3, fontSize: 9.5, color: C.tealDark, bold: true, charSpacing: 2.5 });
  text(slide, 'UroOps 3D lesson: recorded run-through', { x: MX, y: 0.8, w: CONTENT_W, h: 0.9, fontSize: 30, color: C.onDark, fontFace: HEAD, valign: 'middle' });
  const vw = 8.9, vh = vw * 1080 / 1920;
  const posterPng = path.join(VIDEO, 'aus-flow-poster.png');
  slide.addMedia({ type: 'video', path: path.join(VIDEO, 'aus-flow-1080p.mp4'), cover: 'data:image/png;base64,' + fs.readFileSync(posterPng).toString('base64'), x: MX, y: 1.95, w: vw, h: vh, objectName: 'UroOps lesson video' });
  const rx = MX + vw + 0.5, rw = W - MX - rx;
  text(slide, 'Use only if the live page fails', { x: rx, y: 1.95, w: rw, h: 0.8, fontSize: 16, color: C.tealDark, fontFace: HEAD, lineSpacingMultiple: 1.1 });
  text(slide, 'Click to play. 102 seconds, no sound. Same four-minute narration as teaching slide 32.', { x: rx, y: 2.85, w: rw, h: 1.4, fontSize: 13, color: C.onDarkMuted, lineSpacingMultiple: 1.2 });
  const videoCredit = IMAGE_CREDIT.replace('Image:', 'Video:');
  notes(slide, BACKUP_NOTES.video.replace(videoCredit, '').trim(), videoCredit);
}

function references(pres) {
  const refs = DATA.refs;
  const perSlide = 20;
  const pages = Math.ceil(refs.length / perSlide);
  for (let p = 0; p < pages; p++) {
    const slide = pres.addSlide({ sectionTitle: 'Backup and references' });
    slide.background = { color: C.paper };
    text(slide, 'REFERENCES', { x: MX, y: 0.42, w: 7, h: 0.3, fontSize: 9.5, color: C.teal, bold: true, charSpacing: 2.5 });
    text(slide, `Sources ${p + 1} of ${pages}`, { x: MX, y: 0.8, w: CONTENT_W, h: 0.9, fontSize: 30, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const chunk = refs.slice(p * perSlide, (p + 1) * perSlide);
    const colW = (CONTENT_W - 0.4) / 2, rowH = 0.46;
    chunk.forEach((r, i) => {
      const col = Math.floor(i / 10), row = i % 10;
      const x = MX + col * (colW + 0.4), y = 1.9 + row * rowH;
      text(slide, r.code, { x, y, w: 1.35, h: rowH, fontSize: 9.5, color: C.teal, bold: true, valign: 'middle' });
      text(slide, r.label, { x: x + 1.4, y, w: colW - 1.4, h: rowH, fontSize: 11.5, color: C.ink, valign: 'middle', hyperlink: { url: r.url } });
      if (row < 9) slide.addShape(SHAPES.line, { x, y: y + rowH, w: colW, h: 0, line: { color: C.rule, width: 0.5 } });
    });
    notes(slide, REFERENCE_NOTES + '\n\n' + chunk.map((r) => `${r.code} ${r.url}`).join('\n'), null);
  }
}

// ---------- assemble ----------
function build(animated) {
  CLIPS_ON = animated;
  CLIP_SPECS.length = 0;
  const pres = new pptxgen();
  SHAPES = pres.ShapeType; CHARTS = pres.ChartType;
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
  pres.title = 'Artificial urinary sphincter surgery';
  pres.subject = 'Patient selection, difficult bladders and difficult urethras';
  pres.author = 'Mr Andrew Baird, Mr Abu Yousif, Nity G';
  pres.lang = 'en-GB';

  cover(pres);
  let actIdx = -1;
  for (const s of SLIDES) {
    const act = actOf(s.n);
    const ai = ACTS.indexOf(act);
    if (ai !== actIdx) { actIdx = ai; divider(pres, act, ai); }
    const slide = pres.addSlide({ sectionTitle: act.title });
    let extra = null;
    switch (s.type) {
      case 'decisions': slideDecisions(slide, s); break;
      case 'table': slideTable(slide, s); break;
      case 'columns': slideColumns(slide, s); break;
      case 'steps': slideSteps(slide, s, { clip: CLIPS_ON && clipFor[s.n] ? clipFor[s.n] : null }); if (CLIPS_ON && clipFor[s.n]) extra = CLIP_CREDIT; break;
      case 'image': slideImage(slide, s); extra = CLIPS_ON && clipFor[s.n] ? CLIP_CREDIT : IMAGE_CREDIT; break;
      case 'case': slideCase(slide, s); break;
      case 'outcomes': slideOutcomes(slide, s); break;
      case 'statement': slideStatement(slide, s, s.n === 28 ? C.terra : C.teal); break;
      case 'physiology': slidePhysiology(slide, s); break;
      case 'wash': slideWash(slide, s); break;
      case 'prepchart': slidePrepChart(slide, s); break;
      case 'device': slideDevice(slide, s); extra = DEVICE_CREDIT + (CLIPS_ON ? '\n\n' + CLIP_CREDIT : ''); break;
      case 'demo': slideDemo(slide, s); extra = CLIPS_ON ? CLIP_CREDIT : IMAGE_CREDIT; break;
      case 'discussion': slideDiscussion(slide, s); break;
      default: throw new Error('unknown type ' + s.type);
    }
    notes(slide, teachingNotes(s.n, null), extra);
  }
  pres.addSection({ title: 'Backup and references' });
  backupTable(pres, BACKUP[0], BACKUP_NOTES.outcomes);
  backupTable(pres, BACKUP[1], BACKUP_NOTES.comparative);
  backupGaps(pres, GAPS);
  if (animated) backupVideo(pres);
  references(pres);
  return pres;
}

async function main() {
  const std = build(false);
  const stdPath = path.join(BUILD, 'AUS-teaching-deck.pptx');
  await std.writeFile({ fileName: stdPath });
  console.log('wrote', stdPath, 'gradient veils', await gradientVeils(stdPath));
  const anim = build(true);
  const animPath = path.join(BUILD, 'AUS-teaching-deck-3d.pptx');
  await anim.writeFile({ fileName: animPath });
  console.log('wrote', animPath, 'clips', CLIP_SPECS.length, 'gradient veils', await gradientVeils(animPath));
  fs.writeFileSync(path.join(BUILD, 'clip-slides.json'), JSON.stringify(CLIP_SPECS.map((c) => ({ name: c.name, ms: clipMs(c.name) })), null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });

// Writes presenter-guide/AUS-presenter-script.md from the same content the deck is built from.
// usage: node script.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTS, actOf, GLOSSARY, SCRIPT, PRESENTERS } from './content.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRES = path.resolve(HERE, '..');
const SLIDES = JSON.parse(fs.readFileSync(path.join(PRES, 'slides.json'), 'utf8'));
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'data', 'deck-data.json'), 'utf8'));
const OUT = path.join(PRES, '..', 'presenter-guide', 'AUS-presenter-script.md');

const L = [];
const p = (s = '') => L.push(s);

p('# Artificial urinary sphincter surgery');
p();
p('## Presenter script: the sixty minutes, slide by slide');
p();
p(`Prepared for ${PRESENTERS.map((x) => x[0]).join(', ')} | Deck redesigned 19 October 2026 | Evidence checked 5 October 2026`);
p();
p('This is the spoken script for the redesigned deck (`presentation/AUS-teaching-deck.pptx` and the animated `AUS-teaching-deck-3d.pptx`). The same text sits in each slide\'s speaker notes. Every teaching slide has four parts: **This slide** (what it represents), **Say** (the flowing narration in the "we" voice agreed on 10 October), **Studies on this slide** (every citation code on the slide, what the source is, and what it says), and **Transition** (the sentence that carries the room to the next slide). Act dividers take no time from the clock. The four clinical cases are fictional. Evidence statements follow the 5 October 2026 audit and the ST5 presenter guide; nothing new is claimed here.');
p();
p('### The sixty minutes at a glance');
p();
p('| Act | Title | Teaching slides | Clock | Minutes |');
p('|---|---|---|---|---|');
for (const a of ACTS) p(`| ${a.numeral} | ${a.title} | ${String(a.slides[0]).padStart(2, '0')}–${String(a.slides[1]).padStart(2, '0')} | ${a.clock} | ${a.minutes} |`);
p();
p('### Before you start');
p();
p('- Add the meeting and date to the cover and your personal disclosures to teaching slide 02.');
p('- Open https://uroops3d.com/lab/aus in a second window before the session for teaching slide 32. If it fails, the slide\'s notes carry the four-minute spoken fallback, and the animated deck has a recorded run-through as a backup slide after the discussion.');
p('- The clock in the top-right corner of every teaching slide is the running time at which that slide should start.');
p('- Say aloud, when the first UroOps picture appears, that the model is a teaching schematic with clinical review pending.');
p();

let currentAct = null;
for (const s of SLIDES) {
  const act = actOf(s.n);
  if (act !== currentAct) {
    currentAct = act;
    p(`## Act ${act.numeral} · ${act.title}`);
    p();
    p(`*${act.clock} · ${act.minutes} minutes · teaching slides ${String(act.slides[0]).padStart(2, '0')} to ${String(act.slides[1]).padStart(2, '0')}*`);
    p();
    p(`**Divider slide, no clock time.** Read the act title, then say: "${act.question}"`);
    p();
  }
  const t = DATA.times[s.n];
  const sc = SCRIPT[s.n];
  p(`### ${String(s.n).padStart(2, '0')} | ${s.title}`);
  p();
  p(`*${t.clock.replace('-', ' – ')} · ${t.time} · ${act.title}*`);
  p();
  p(`**This slide:** ${sc.frame}`);
  p();
  p('**Say**');
  p();
  for (const para of sc.say) { p(para); p(); }
  const codes = DATA.codes[s.n];
  if (codes.length) {
    p('**Studies on this slide**');
    p();
    for (const c of codes) {
      const g = GLOSSARY[c];
      p(`- **${c}** — ${g.name}. *What it is:* ${g.kind}. *What it says:* ${g.says}`);
    }
    p();
  }
  if (sc.transition) { p(`**Transition →** ${sc.transition}`); p(); }
}

p('## Backup slides, outside the clock');
p();
p('- **Outcome evidence: device and endpoint.** Three studies, three different endpoints: AUSCO 2026 (pad outcomes at twelve months), Linder 2015 (freedom from secondary surgery over ten years) and Wilson 2024 (early ContiClassic device survival). Read the denominators aloud; they do not rank devices.');
p('- **Comparative and preparation evidence.** MASTER 2022/2026 (randomised, non-inferior at 24 months, further surgery 11% versus 2%), Yeung 2013 (skin-culture surrogate, 8% versus 32%) and the 2026 gentamicin-withdrawal cohort (three infections in 173 procedures; not equivalence).');
p('- **Evidence gaps.** Seven open comparative questions from section 7 of the manuscript.');
p('- **UroOps 3D lesson: recorded run-through** (animated deck only). 102 seconds, no sound, click to play. Use only if the live page fails.');
p('- **Sources 1–3.** All 58 citation codes with live links.');
p();
p('## Source glossary');
p();
p('Every code used in the deck, in the order of the reference slides.');
p();
for (const r of DATA.refs) {
  const g = GLOSSARY[r.code];
  p(`- **${r.code}** — [${g.name}](${r.url}). *What it is:* ${g.kind}. *What it says:* ${g.says}`);
}
p();
fs.writeFileSync(OUT, L.join('\n'), 'utf8');
console.log('wrote', OUT, L.join('\n').split(/\s+/).length, 'words');

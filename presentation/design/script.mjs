// Writes presenter-guide/AUS-presenter-script.md from the same content the deck is built from.
// usage: node script.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTS, actOf, GLOSSARY, SCRIPT, PRESENTERS } from './content.mjs';
import { ASK, EXAMPLE, SUPPORT } from './support.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRES = path.resolve(HERE, '..');
const SLIDES = JSON.parse(fs.readFileSync(path.join(PRES, 'slides.json'), 'utf8'));
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'data', 'deck-data.json'), 'utf8'));
const OUT = path.join(PRES, '..', 'presenter-guide', 'AUS-presenter-script.md');

const L = [];
const p = (s = '') => L.push(s);
const nn = (n) => String(n).padStart(2, '0');

p('# Artificial urinary sphincter surgery');
p();
p('## Presenter script: the sixty minutes, slide by slide');
p();
p(`Prepared for ${PRESENTERS.map((x) => x[0]).join(', ')} | Script revised 20 October 2026 | Evidence checked 5 October 2026`);
p();
p('This is the spoken script for `presentation/AUS-teaching-deck.pptx` and the animated `AUS-teaching-deck-3d.pptx`. The slides carry no speaker notes (only picture and clip credits on the image slides), so this document is the script: print it, or keep it open on a second screen. The four clinical cases and every patient in the examples are fictional. Evidence statements follow the 5 October 2026 audit and the ST5 presenter guide; nothing new is claimed here.');
p();
p('### How to read each slide');
p();
p('- **This slide wants:** the one thing the slide is asking the room to do.');
p('- **On the slide:** what is actually shown.');
p('- **Say:** the narration, in the "we" voice agreed on 10 October. Pauses are in square brackets.');
p('- **Example:** one concrete, fictional example of the slide\'s ask, to make it land or to answer "what does that look like?"');
p('- **Studies on this slide:** every citation code in the slide footer, what the source is, and what it does for this slide, with its limit. The full "what it says" for every code is in the glossary at the end.');
p('- **Next:** the sentence that carries the room to the next slide.');
p();
p('### The sixty minutes at a glance');
p();
p('| Section | Teaching slides | Clock | Minutes |');
p('|---|---|---|---|');
for (const a of ACTS) p(`| ${a.title} | ${nn(a.slides[0])}–${nn(a.slides[1])} | ${a.clock} | ${a.minutes} |`);
p();
p('### Before you start');
p();
p('- Add the meeting and date to the cover and your personal disclosures to teaching slide 02.');
p('- Open https://uroops3d.com/lab/aus in a second window before the session for teaching slide 32. If it fails, the slide\'s notes carry the four-minute spoken fallback, and the animated deck has a recorded run-through as a backup slide after the discussion.');
p('- The slides carry no timings. The clock beside each slide in this script is the running time at which that slide should start; the six section slides take no time.');
p('- Say aloud, when the first UroOps picture appears, that the model is a teaching schematic with clinical review pending.');
p('- Examples are there to be used if the room needs one. Skipping an example saves about twenty seconds; the clock already allows for the Say text alone.');
p();

let currentAct = null;
for (const s of SLIDES) {
  const act = actOf(s.n);
  if (act !== currentAct) {
    currentAct = act;
    p(`## ${act.title}`);
    p();
    p(`*${act.clock} · ${act.minutes} minutes · teaching slides ${nn(act.slides[0])} to ${nn(act.slides[1])}*`);
    p();
    p(`**Section slide, no clock time.** Read the title, then say: "${act.question}"`);
    p();
  }
  const t = DATA.times[s.n];
  const sc = SCRIPT[s.n];
  p(`### ${nn(s.n)} | ${s.title}`);
  p();
  p(`*${t.clock.replace('-', ' – ')} · ${t.time} · ${act.title}*`);
  p();
  p(`**This slide wants:** ${ASK[s.n]}`);
  p();
  p(`**On the slide:** ${sc.frame}`);
  p();
  p('**Say**');
  p();
  for (const para of sc.say) { p(para); p(); }
  p('**Example**');
  p();
  p(EXAMPLE[s.n]);
  p();
  const codes = DATA.codes[s.n];
  if (codes.length) {
    p('**Studies on this slide**');
    p();
    for (const c of codes) {
      const g = GLOSSARY[c];
      const how = SUPPORT[s.n][c];
      if (!how) throw new Error(`No support line for ${c} on slide ${s.n}`);
      p(`- **${c}** — ${g.name} (${g.kind}). ${how}`);
    }
    p();
  }
  if (sc.transition) { p(`**Next →** ${sc.transition}`); p(); }
}

p('## Backup slides, outside the clock');
p();
p('- **Outcome evidence: device and endpoint.** Three studies, three different endpoints: AUSCO 2026 (pad outcomes at twelve months), Linder 2015 (freedom from secondary surgery over ten years) and Wilson 2024 (early ContiClassic device survival). Read the denominators aloud; they do not rank devices.');
p('- **Comparative and preparation evidence.** MASTER 2022/2026 (randomised, non-inferior at 24 months, further surgery 11% versus 2%), Yeung 2013 (skin-culture surrogate, 8% versus 32%) and the 2026 gentamicin-withdrawal cohort (three infections in 173 procedures; not equivalence).');
p('- **Evidence gaps.** Seven open comparative questions from section 7 of the manuscript.');
p('- **UroOps 3D lesson: recorded run-through** (animated deck only). 102 seconds, no sound, click to play. Use only if the live page fails.');
p('- **Sources 1–3.** All 58 citation codes with live links.');
p();
p('## Source glossary: what each source is and what it says');
p();
p('Every code used in the deck, in the order of the reference slides. The per-slide lines above say what each source does on that slide; this list gives the whole finding and its limit.');
p();
for (const r of DATA.refs) {
  const g = GLOSSARY[r.code];
  p(`- **${r.code}** — [${g.name}](${r.url}). *What it is:* ${g.kind}. *What it says:* ${g.says}`);
}
p();
fs.writeFileSync(OUT, L.join('\n'), 'utf8');
const sayWords = Object.values(SCRIPT).reduce((a, s) => a + s.say.join(' ').split(/\s+/).length, 0);
const exWords = Object.values(EXAMPLE).reduce((a, e) => a + e.split(/\s+/).length, 0);
fs.writeFileSync(path.join(HERE, 'build', 'words.json'), JSON.stringify({ sayWords, exampleWords: exWords, transitionWords: Object.values(SCRIPT).reduce((a, s) => a + (s.transition ? s.transition.split(/\s+/).length : 0), 0) }));
console.log('wrote', OUT, L.join('\n').split(/\s+/).length, 'words; say', sayWords, 'example', exWords);

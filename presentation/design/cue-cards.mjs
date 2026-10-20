// Writes presenter-guide/AUS-cue-cards.md: what to say on each slide, as short spoken lines.
// usage: node cue-cards.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTS, actOf, PRESENTERS } from './content.mjs';
import { CUES, SECTION_CUES } from './cues.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRES = path.resolve(HERE, '..');
const SLIDES = JSON.parse(fs.readFileSync(path.join(PRES, 'slides.json'), 'utf8'));
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'data', 'deck-data.json'), 'utf8'));
const OUT = path.join(PRES, '..', 'presenter-guide', 'AUS-cue-cards.md');

const L = [];
const p = (s = '') => L.push(s);
const nn = (n) => String(n).padStart(2, '0');

p('# Artificial urinary sphincter surgery');
p();
p('## Cue cards: what to say on each slide');
p();
p(`Prepared for ${PRESENTERS.map((x) => x[0]).join(', ')} | 20 October 2026`);
p();
p('One card per slide: the spoken lines in order, each one a sentence you can say as written, ending with the line that carries the room to the next slide. Pauses are in square brackets. The clock under each title is the running time at which the slide should start; it is not on the slides. The full narration, the examples and what each study does on its slide are in the presenter script; this is the short version for the lectern.');
p();

let currentAct = null;
for (const s of SLIDES) {
  const act = actOf(s.n);
  if (act !== currentAct) {
    currentAct = act;
    p(`## ${act.title}`);
    p();
    p(`*${act.clock} · ${act.minutes} minutes · slides ${nn(act.slides[0])} to ${nn(act.slides[1])}*`);
    p();
    p(`**Section slide:** ${SECTION_CUES[act.title]}`);
    p();
  }
  const t = DATA.times[s.n];
  const cues = CUES[s.n];
  if (!cues || !cues.length) throw new Error('No cues for slide ' + s.n);
  p(`### ${nn(s.n)} | ${s.title}`);
  p();
  p(`*${t.clock.replace('-', ' – ')} · ${t.time}*`);
  p();
  for (const c of cues) p(`- ${c}`);
  p();
}
fs.writeFileSync(OUT, L.join('\n'), 'utf8');
const words = Object.values(CUES).reduce((a, c) => a + c.join(' ').split(/\s+/).length, 0);
console.log('wrote', OUT, 'cue words', words, 'slides', Object.keys(CUES).length);

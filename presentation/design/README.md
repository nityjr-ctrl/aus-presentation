# Deck builder (19 October 2026 redesign)

Builds both PowerPoint decks from the unchanged slide specification (`../slides.json`), the running clock and citation codes (`data/deck-data.json`), the backup tables (`data/backup-tables.json`) and the spoken script and study glossary (`content.mjs`).

```
cd presentation/design
npm install                      # pptxgenjs 3.12.0 (node_modules is git-ignored)
node build.mjs                   # build/AUS-teaching-deck.pptx and build/AUS-teaching-deck-3d.pptx
python animate.py build/AUS-teaching-deck-3d.pptx build/clip-slides.json   # start-on-show, looping clips
node script.mjs                  # ../../presenter-guide/AUS-presenter-script.md
python ../../presenter-guide/build_script_pdf.py                           # the PDF of the script
```

Needs Node 18+, `ffmpeg`/`ffprobe` on PATH (poster frames and clip durations), Python 3 with Pillow (the ContiClassic illustration is recoloured onto the dark slide) and the clip files in `../3d/video/` (git-ignored, see `../3d/README.md`). `render.ps1` exports every slide through desktop PowerPoint for visual checks; `sheets.py` tiles the exports into contact sheets.

## What the design does

- Widescreen 13.33 x 7.5 in, Segoe UI and Segoe UI Semibold, one accent (teal) plus the four decision colours used throughout: Implant teal, Optimise amber, Investigate blue, Reconsider terracotta.
- Charcoal `1F2326` for the cover, the six act dividers and the operative image slides, chosen to match the background of the UroOps renders so the pictures sit on the slide without a frame. White content slides.
- Every teaching slide carries its act, its teaching number out of 38, the running clock at which it should start, the citation codes at the foot and the slide's takeaway line in italics.
- Six act dividers (no clock time) list the slides in the act, the act's question and a progress strip.
- Native tables and three native charts (two schematic urodynamic traces, one bar chart of the Yeung 2013 cultures).
- Speaker notes in script form: `THIS SLIDE`, `SAY`, `STUDIES ON THIS SLIDE` (every code decoded: the source, what it is, what it says), `TRANSITION`.

## What did not change

On-slide wording, slide order, tables, chart values, citation codes, the 60-minute clock and every evidence statement. The glossary and script text follow `presenter-guide/AUS-ST5-presenter-guide.md` and `EVIDENCE-AUDIT-2026-10-05.md`. The references were condensed from seven slides to three with the same 58 linked entries.

## Animated deck

`build.mjs` embeds the seven step clips with pptxgenjs and a first-frame poster. pptxgenjs reuses a shape id for the media picture, so `animate.py` renumbers it and adds the same timing block the 10 October deck used (start on slide show, loop). The 102-second backup recording sits after the discussion slide and plays on click.

## Known limits

- Clip autoplay was confirmed through the PowerPoint object model (one effect per clip slide), not by watching a slide show.
- The builder uses installed Windows fonts; on a Mac without Segoe UI the theme substitutes.
- `scripts/build.mjs` (the 5 October Codex builder) is superseded by this folder and kept for history.

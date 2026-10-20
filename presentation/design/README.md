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

- Widescreen 13.33 x 7.5 in, Segoe UI and Segoe UI Semibold (Cambria for the large roman numerals on the act dividers, because I, II and III read as bars in a sans), one accent (teal) plus the four decision colours used throughout: Implant teal, Optimise amber, Investigate blue, Reconsider terracotta.
- Charcoal `1F2326` for the cover, the six act dividers and the operative image slides, chosen to match the background of the UroOps renders so the pictures sit on the slide without a frame. White content slides.
- Every teaching slide carries its act, its teaching number out of 38, the running clock at which it should start, the citation codes at the foot and the slide's takeaway line in italics.
- Six act dividers (no clock time) list the slides in the act, the act's question and a progress strip.
- Native tables and three native charts (two schematic urodynamic traces, one bar chart of the Yeung 2013 cultures). Tables with three rows or fewer get taller rows and larger type; stills and clips sit on the left grid line unless they are much narrower than their box.
- No speaker notes in the slides (owner's decision, 20 October 2026); only picture, clip and IFU-illustration credits sit in the notes pane of image slides. The script is a separate PDF, `../../presenter-guide/AUS-presenter-script.pdf`, built by `script.mjs` and `build_script_pdf.py`: per slide `THIS SLIDE WANTS`, `ON THE SLIDE`, `SAY`, `EXAMPLE` (one concrete fictional example of the ask), `STUDIES ON THIS SLIDE: WHAT EACH ONE DOES HERE` (every footer code: the source, what it is, and how it supports this slide, with its limit) and `NEXT`. The ask, example and per-slide study lines live in `support.mjs`; the narration and the full glossary stay in `content.mjs`. `DECK_NOTES=1 node build.mjs` puts the script into the notes pane again.

## What did not change

On-slide wording, slide order, tables, chart values, citation codes, the 60-minute clock and every evidence statement. The glossary and script text follow `presenter-guide/AUS-ST5-presenter-guide.md` and `EVIDENCE-AUDIT-2026-10-05.md`. The references were condensed from seven slides to three with the same 58 linked entries.

## Optional stock assets (20 October 2026)

`build.mjs` looks in `../assets/envato/` (git-ignored apart from its README) for licensed Envato Elements files: `divider-texture.jpg` goes under all six section dividers, `section-<1..6>.jpg` under one section's divider. Each file is first fitted to at most 3840 x 2160 by `envato_fit.py` into `build/` (the original is untouched), which keeps a 9 MB photograph to about 0.6 MB inside the deck. Since 20 October 2026 the Act V divider carries the licensed surgical-light photograph. The picture is full-bleed under a uniform charcoal veil plus a second veil whose solid fill is replaced with a left-to-right charcoal gradient by `gradientVeils()` after pptxgenjs writes the file, so the slide list on the right always sits on near-solid charcoal. With the folder empty the dividers are plain charcoal, exactly as before. The shortlist and the licensing rule are in `../assets/envato/README.md`.

## Animated deck

`build.mjs` embeds the seven step clips with pptxgenjs and a first-frame poster. pptxgenjs reuses a shape id for the media picture, so `animate.py` renumbers it and adds the same timing block the 10 October deck used (start on slide show, loop). The 102-second backup recording sits after the discussion slide and plays on click.

## Known limits

- Clip autoplay was confirmed through the PowerPoint object model (one effect per clip slide), not by watching a slide show.
- The builder uses installed Windows fonts; on a Mac without Segoe UI the theme substitutes.
- `scripts/build.mjs` (the 5 October Codex builder) is superseded by this folder and kept for history.

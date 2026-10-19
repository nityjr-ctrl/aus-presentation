# AUS visual teaching deck

Presenters: **Mr Andrew Baird, Urology Consultant**, **Mr Abu Yousif, Urology Consultant**, and **Nity G, ST5 Urology Registrar**.

The visual companion to `AUS-expert-presentation.md` retains its 38 teaching slides and 60-minute clock. A cover, three clinical backups and seven reference slides bring the file to 49 slides. The four-minute UroOps demonstration and five-minute discussion retain their original allocations.

The deck uses a restrained clinical teaching style: readable text, case votes, source comparisons, operative schematics and selected evidence graphics. The speaker notes hold the spoken text, and the reference limits for each slide are in the manuscript and `source.json`. It does not claim a personal case series, clinical validation of UroOps, device superiority or an actual preparation duration.

## Redesign of 19 October 2026

Both decks were rebuilt by `design/build.mjs` (pptxgenjs) as a widescreen, Segoe UI deck: charcoal cover and act dividers that match the UroOps renders, white content slides, native tables and charts, and the four decision colours (Implant, Optimise, Investigate, Reconsider) carried from slide 01 through the case votes. Six act dividers were added (Decide before theatre, The bladder, The urethra, Preparation without ritual, The operation, After the implant); they take no clock time. Every teaching slide now shows its act, its number out of 38, the running clock at which it should start, its citation codes and its takeaway line. The references were condensed from seven slides to three. The standard deck has 51 slides; the animated deck has 52. A second review pass the same evening re-rendered every slide at full size and tightened the layout (serif act numerals, bullet alignment, short tables, statement slides, image alignment) without changing any text.

The speaker notes were rewritten in a flowing script format: THIS SLIDE (what the slide represents), SAY (the 10 October spoken text in the "we" voice, with transitions added), STUDIES ON THIS SLIDE (every citation code decoded: the source, what it is and what it says) and TRANSITION. The same script, with a source glossary, is in `../presenter-guide/AUS-presenter-script.md` and `.pdf`.

On-slide wording, slide order, tables, chart values, citation codes and evidence statements are unchanged from the 5 October checkpoint. Build, fonts and limits: `design/README.md`. The superseded 10 October files are in `C:\NityProjects\AUS-Presentation\archive\2026-10-19-pre-redesign\` (outside the repository), with hashes.

## Contents

- `AUS-teaching-deck.pptx`: the 51-slide deck, redesigned 19 October 2026.
- `AUS-teaching-deck-3d.pptx`: the 52-slide animated version, same redesign.
- `design/`: the current builder (`build.mjs`, `content.mjs`, `animate.py`, `script.mjs`) and its README.
- `slides.json`: displayed wording and layout choices for the 38 teaching slides.
- `source.json`: source notes, running clock, reference links and prepared questions.
- `scripts/build.mjs`: the 5 October Codex builder, superseded by `design/` and kept for history.
- `assets/`: used illustrations with provenance in `assets/SOURCES.md`.
- `delivery.json`: file hashes, presenters, and the Google Slides copy with its status.
- `validation.json`: checks run on the current files, with the 5 October checkpoint record kept inside it.
- `evidence-2026.json`: added source cards, clinical meaning, limitations and access level.
- `EVIDENCE-AUDIT-2026-10-05.md`: slide-by-slide currency decisions.

The PowerPoint files here are the current deck (19 October 2026 redesign). The Google Slides copy linked in `delivery.json` was last updated and read back on 5 October 2026 (49 slides, two presenter credits, 49 sets of speaker notes, eight native tables). It has none of the 10 October changes: the third presenter, the rewritten notes or the new pictures. Three charts in the deck are images from the Google conversion. The original native-chart checkpoint is in Git history, and the design builder can regenerate native charts.

## Revision of 10 October 2026

- Cover: Mr Andrew Baird, Mr Abu Yousif and Nity G.
- Speaker notes for teaching slides 01 to 37 rewritten in a plainer "we" voice, 6,300 spoken words in total. The notes pages now hold the spoken text and, on picture slides, the image credit.
- New UroOps stills on slides 6, 16, 26, 27, 28, 31 and 33.
- Cover of both decks: a label-free UroOps view of the implanted device (`assets/uroops-cover.png`), replacing the theatre illustration. In the animated deck an embed error had put the backup video's first frame there. The backup video on slide 40 now shows its own first frame as its poster.
- The "clinical review pending" captions under the UroOps pictures (slides 6, 16, 26 to 28, 31 and 33) were removed from both decks at the owner's request. The image credit in the speaker notes of each picture slide still says so.
- Slide order, on-slide wording, tables, charts and citations are unchanged from the 5 October evidence checkpoint.
- The notes and cover changes were patched into the PowerPoint files directly. `source.json` and `scripts/build.mjs` carry the same text, but the builder has not been rerun.

## Animated version (10 October 2026)

Slide numbers in this section refer to the 10 October file. In the 19 October redesign the clips are on physical slides 31 to 33 and 35 to 38 (teaching slides 25 to 27 and 29 to 32) and the backup video is physical slide 49.

`AUS-teaching-deck-3d.pptx` is the same deck with a looping clip of the matching UroOps 3D AUS lesson steps on slides 26 to 28 and 30 to 33, and a re-recorded backup video of the whole lesson on slide 40. The clips start by themselves when the slide appears and replace the native PowerPoint 3D models of the 8 October build, which rendered flat and pale. Both decks also carry new 4K-wide stills from the same scene on slides 6, 16, 26 to 28, 31 and 33. PowerPoint on the build PC opens both files without repair. Capture scripts, sources and limits are in `3d/README.md`.

## Before the meeting

Add the meeting/date and each presenter's accurate disclosures. Rehearse the UroOps views and timed narration. The model describes itself as a teaching schematic with clinical review pending. Obtain the applicable current ContiClassic IFU and separate OR protocol, and reconcile the local antiseptic, urine and antibiotic policy. The deck deliberately omits unverified fill volumes and product preparation sequences.

## Rebuilding in the Codex runtime

Use the provided Node, Python and module paths, with a `scripts/node_modules` symlink to `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, then run `scripts/build.mjs` using `CODEX_PRIMARY_RUNTIME_NODE`. The script creates a newly named PPTX in `output/`, runs the packaged presentation checks, and renders every slide in `build/renders/`. These transient directories are ignored by Git. Set `PRESENTATIONS_SKILL_DIR` to the installed presentations skill when needed. The builder uses the updated 2026 source and backup tables but creates a fresh design build, which may differ slightly from the cloud checkpoint that was updated by hand. Review every rendered slide before a new import, because the existing Google deck has already been updated in place.

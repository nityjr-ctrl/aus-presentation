# AUS visual teaching deck

Presenters: **Mr Andrew Baird, Urology Consultant**, **Mr Abu Yousif, Urology Consultant**, and **Nity G, ST5 Urology Registrar**.

The visual companion to `AUS-expert-presentation.md` retains its 38 teaching slides and 60-minute clock. A cover, three clinical backups and seven reference slides bring the file to 49 slides. The four-minute UroOps demonstration and five-minute discussion retain their original allocations.

The deck uses a restrained clinical teaching style: readable text, case votes, source comparisons, operative schematics and selected evidence graphics. The speaker notes hold the spoken text, and the reference limits for each slide are in the manuscript and `source.json`. It does not claim a personal case series, clinical validation of UroOps, device superiority or an actual preparation duration.

## Contents

- `AUS-teaching-deck.pptx`: the 49-slide deck, revised 10 October 2026.
- `AUS-teaching-deck-3d.pptx`: the 50-slide animated version (see below).
- `slides.json`: displayed wording and layout choices for the 38 teaching slides.
- `source.json`: source notes, running clock, reference links and prepared questions.
- `scripts/build.mjs`: deck builder using the supplied Codex `@oai/artifact-tool` runtime.
- `assets/`: used illustrations with provenance in `assets/SOURCES.md`.
- `delivery.json`: file hashes, presenters, and the Google Slides copy with its status.
- `validation.json`: checks run on the current files, with the 5 October checkpoint record kept inside it.
- `evidence-2026.json`: added source cards, clinical meaning, limitations and access level.
- `EVIDENCE-AUDIT-2026-10-05.md`: slide-by-slide currency decisions.

The PowerPoint files here are the current deck. The Google Slides copy linked in `delivery.json` was last updated and read back on 5 October 2026 (49 slides, two presenter credits, 49 sets of speaker notes, eight native tables). It has none of the 10 October changes: the third presenter, the rewritten notes or the new pictures. Three charts in the deck are images from the Google conversion. The original native-chart checkpoint is in Git history, and the design builder can regenerate native charts.

## Revision of 10 October 2026

- Cover: Mr Andrew Baird, Mr Abu Yousif and Nity G.
- Speaker notes for teaching slides 01 to 37 rewritten in a plainer "we" voice, 6,300 spoken words in total. The notes pages now hold the spoken text and, on picture slides, the image credit.
- New UroOps stills on slides 6, 16, 26, 27, 28, 31 and 33.
- The "clinical review pending" captions under the UroOps pictures (slides 6, 16, 26 to 28, 31 and 33) were removed from both decks at the owner's request. The image credit in the speaker notes of each picture slide still says so.
- Slide order, on-slide wording, tables, charts and citations are unchanged from the 5 October evidence checkpoint.
- The notes and cover changes were patched into the PowerPoint files directly. `source.json` and `scripts/build.mjs` carry the same text, but the builder has not been rerun.

## Animated version (10 October 2026)

`AUS-teaching-deck-3d.pptx` is the same deck with a looping clip of the matching UroOps 3D AUS lesson steps on slides 26 to 28 and 30 to 33, and a re-recorded backup video of the whole lesson on slide 40. The clips start by themselves when the slide appears and replace the native PowerPoint 3D models of the 8 October build, which rendered flat and pale. Both decks also carry new 4K-wide stills from the same scene on slides 6, 16, 26 to 28, 31 and 33. PowerPoint on the build PC opens both files without repair. Capture scripts, sources and limits are in `3d/README.md`.

## Before the meeting

Add the meeting/date and each presenter's accurate disclosures. Rehearse the UroOps views and timed narration. The model describes itself as a teaching schematic with clinical review pending. Obtain the applicable current ContiClassic IFU and separate OR protocol, and reconcile the local antiseptic, urine and antibiotic policy. The deck deliberately omits unverified fill volumes and product preparation sequences.

## Rebuilding in the Codex runtime

Use the provided Node, Python and module paths, with a `scripts/node_modules` symlink to `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, then run `scripts/build.mjs` using `CODEX_PRIMARY_RUNTIME_NODE`. The script creates a newly named PPTX in `output/`, runs the packaged presentation checks, and renders every slide in `build/renders/`. These transient directories are ignored by Git. Set `PRESENTATIONS_SKILL_DIR` to the installed presentations skill when needed. The builder uses the updated 2026 source and backup tables but creates a fresh design build, which may differ slightly from the cloud checkpoint that was updated by hand. Review every rendered slide before a new import, because the existing Google deck has already been updated in place.

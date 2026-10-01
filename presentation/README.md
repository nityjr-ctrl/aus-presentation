# AUS visual teaching deck

Presenters: **Mr Abu Yousif, Urology Consultant**, and **Nity G, ST5 Urology Registrar**.

The visual companion to `AUS-expert-presentation.md` retains its 38 teaching slides and 60-minute clock. A cover and seven backup slides bring the file to 46 slides. The four-minute UroOps demonstration and five-minute discussion retain their original allocations.

The deck uses a restrained clinical teaching style: readable text, case votes, source comparisons, operative schematics and selected evidence graphics. Longer explanations and the original reference limits remain in speaker notes. It does not claim a personal case series, clinical validation of UroOps, device superiority or an actual preparation duration.

## Contents

- `AUS-teaching-deck.pptx`: checked build used to create native Google Slides.
- `slides.json`: displayed wording and layout choices for the 38 teaching slides.
- `source.json`: source notes, running clock, reference links and prepared questions.
- `scripts/build.mjs`: deck builder using the supplied Codex `@oai/artifact-tool` runtime.
- `assets/`: used illustrations with provenance in `assets/SOURCES.md`.
- `delivery.json`: verified native Google Slides destination and build metadata.

The Google Slides link in `delivery.json` is the working presentation. Readback verified 46 slides, both presenter credits, 46 sets of speaker notes and eight native tables. The Google-exported PDF was rendered for visual review. Three charts converted to images in Google Slides; the checkpoint retains editable charts and embedded workbooks. The repository file is the reproducible checkpoint, rather than a sync service for subsequent cloud edits.

## Before the meeting

Add the meeting/date and each presenter's accurate disclosures. Rehearse the UroOps views and timed narration. The model describes itself as a teaching schematic with clinical review pending. Obtain the applicable current ContiClassic IFU and separate OR protocol, and reconcile the local antiseptic, urine and antibiotic policy. The deck deliberately omits unverified fill volumes and product preparation sequences.

## Rebuilding in the Codex runtime

Use the provided Node, Python and module paths, with a `scripts/node_modules` symlink to `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, then run `scripts/build.mjs` using `CODEX_PRIMARY_RUNTIME_NODE`. The script creates a newly named PPTX in `output/`, runs the packaged presentation checks, and renders every slide in `build/renders/`. These transient directories are ignored by Git. Review the rendered slides before a new native Google Slides import.

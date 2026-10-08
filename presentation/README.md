# AUS visual teaching deck

Presenters: **Mr Abu Yousif, Urology Consultant**, and **Nity G, ST5 Urology Registrar**.

The visual companion to `AUS-expert-presentation.md` retains its 38 teaching slides and 60-minute clock. A cover, three clinical backups and seven reference slides bring the file to 49 slides. The four-minute UroOps demonstration and five-minute discussion retain their original allocations.

The deck uses a restrained clinical teaching style: readable text, case votes, source comparisons, operative schematics and selected evidence graphics. Longer explanations and the original reference limits remain in speaker notes. It does not claim a personal case series, clinical validation of UroOps, device superiority or an actual preparation duration.

## Contents

- `AUS-teaching-deck.pptx`: checked 49-slide update of the corrected final deck.
- `slides.json`: displayed wording and layout choices for the 38 teaching slides.
- `source.json`: source notes, running clock, reference links and prepared questions.
- `scripts/build.mjs`: deck builder using the supplied Codex `@oai/artifact-tool` runtime.
- `assets/`: used illustrations with provenance in `assets/SOURCES.md`.
- `delivery.json`: verified native Google Slides destination and checkpoint metadata.
- `evidence-2026.json`: added source cards, clinical meaning, limitations and access level.
- `EVIDENCE-AUDIT-2026-10-05.md`: slide-by-slide currency decisions.

The Google Slides link in `delivery.json` is the working presentation. Readback verified 49 slides, both presenter credits, 49 sets of speaker notes and eight native tables. The Google-exported PDF was rendered for visual review. The current checkpoint preserves the corrected cloud images, including three charts converted to images. The original native-chart checkpoint is preserved in Git history. The design builder can regenerate native charts. The repository file is the checked 5 October evidence checkpoint. Subsequent cloud edits do not automatically synchronise.

## 3D version (8 October 2026)

`AUS-teaching-deck-3d.pptx` is the same deck with native PowerPoint 3D models of the UroOps 3D AUS steps on slides 26 to 28 and 30 to 33 (Morph between them, picture fallbacks), a disclaimer and one "3D:" speaker-note line on each, and a backup video slide at 40. It is untested in real PowerPoint: open `3d/test-one-slide.pptx` first, and present from `AUS-teaching-deck.pptx` if anything needs repair. Build scripts, checklist and limits are in `3d/README.md`.

## Before the meeting

Add the meeting/date and each presenter's accurate disclosures. Rehearse the UroOps views and timed narration. The model describes itself as a teaching schematic with clinical review pending. Obtain the applicable current ContiClassic IFU and separate OR protocol, and reconcile the local antiseptic, urine and antibiotic policy. The deck deliberately omits unverified fill volumes and product preparation sequences.

## Rebuilding in the Codex runtime

Use the provided Node, Python and module paths, with a `scripts/node_modules` symlink to `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, then run `scripts/build.mjs` using `CODEX_PRIMARY_RUNTIME_NODE`. The script creates a newly named PPTX in `output/`, runs the packaged presentation checks, and renders every slide in `build/renders/`. These transient directories are ignored by Git. Set `PRESENTATIONS_SKILL_DIR` to the installed presentations skill when needed. The builder uses the updated 2026 source and backup tables but creates a fresh design build, which may differ slightly from the surgically updated cloud checkpoint. Review every rendered slide before a new import; the existing Google deck has already been updated in place.

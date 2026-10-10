# AUS deck with embedded animation

## Current state: 10 October 2026

The native PowerPoint 3D models described further down are no longer in `../AUS-teaching-deck-3d.pptx`. They rendered flat and pale next to the UroOps 3D scene, so the step slides now carry clips recorded from the public scene itself.

| Slide | Clip (`video/`, not in Git) | Lesson steps | Length |
|---|---|---|---|
| 26 | `aus-26-exposure.mp4` | 1 and 2 | 18 s |
| 27 | `aus-27-dissection.mp4` | 3 and 4 | 18 s |
| 28 | `aus-28-sizing.mp4` | 5 and 6 | 18 s |
| 30 | `aus-30-balloon.mp4` | 7 | 12 s |
| 31 | `aus-31-pump.mp4` | 8 | 12 s |
| 32 | `aus-32-check.mp4` | 10 and 11 | 18 s |
| 33 | `aus-33-overview.mp4` | 9 | 12 s |
| 40 | `aus-flow-1080p.mp4` | all eleven, with the site's narration captions | 102 s |

- **Playback:** each step clip starts when its slide appears and loops until the next click. Slide 40 plays on click. No clip has sound.
- **Pictures:** `renders/*.png` are now the poster frames of the clips, and PowerPoint shows them if a clip cannot play.
- **How they were made:** `capture/clip.mjs` steps the public lesson timeline (https://uroops3d.com/lab/aus) in small increments and saves each frame at twice the display size, and ffmpeg joins the frames at 30 frames a second. `capture/stills.mjs` and `capture/crop.py` make the stills, and `capture/embed.py` put both into the decks. `embed.py` expects the 8 October deck with models, so it cannot be run again on the current file.
- **What is hidden:** the page controls, the corner preview mark and, on the step clips, the narration caption and any label that states a number, a device instruction or back-table preparation. The slide 40 video keeps the captions.
- **Checked:** PowerPoint on the build PC opens the deck without repair and reports eight media shapes. Nobody has yet watched the clips autoplay in a slide show, so run slides 26 to 33 once with F5 on the lectern PC.
- **Kept for reference:** `steps/*.glb`, `embed-3d.py`, `validate.py`, `test-one-slide.pptx` and `validation-3d.json` belong to the 8 October model build. The Morph transitions between the step slides are still in the deck.

The rest of this file describes the 8 October build.

## 8 October 2026 build (superseded)

Built 8 October 2026 on branch `feat/3d-embedded-aus`. The lectern PC at the last talk was locked to the slide show and the web demo failed, so everything now lives inside the PPTX.

**Untested in real PowerPoint.** No PowerPoint was available on the build PC. The file passes every structural check below and opens in LibreOffice and python-pptx, but nobody has yet seen a 3D model rotate or a Morph run. Open `test-one-slide.pptx` in PowerPoint first. If PowerPoint offers to repair either file, say no, close it, present from the unchanged `../AUS-teaching-deck.pptx`, and use the manual fallback below.

## Files

| File | What it is |
|---|---|
| `../AUS-teaching-deck-3d.pptx` | 50-slide deck: the 5 October checkpoint plus 3D models on slides 26, 27, 28, 30, 31, 32, 33 and a backup video slide at 40 |
| `test-one-slide.pptx` | one slide (slide 28) with one 3D model: the smoke test |
| `steps/*.glb` | one GLB per 3D slide, same scene frame, 0.31 to 0.68 MB, 10,770 to 27,490 triangles |
| `renders/*.png` | fallback pictures (three.js, same camera, transparent background) |
| `contact-sheet.png`, `contact-sheet-3d.png` | LibreOffice render of every slide, and of the 3D slides larger (LibreOffice shows the fallback pictures) |
| `video/aus-flow-1080p.mp4` | optional standalone recording: 1920 x 1080 H.264, 159 s, 42.6 MB, no sound. The same MP4 is versioned inside the committed 3D PPTX and automatically reused on a clean checkout |
| `steps.json` | mapping, node lists, cameras (resolved values written by the build), notes lines |
| `AM3D-NOTES.md` | how the PowerPoint 3D XML was worked out, and what is still uncertain |
| `validation-3d.json` | last `validate.py` result |

## Portable rebuild

Use Python 3.11 or later. From the repository root:

```sh
python -m venv .venv
# Activate .venv (Windows: .venv\Scripts\activate; macOS/Linux: source .venv/bin/activate).
python -m pip install -r presentation/3d/requirements.txt
python presentation/3d/embed-3d.py
python presentation/3d/validate.py
python -m unittest discover -s presentation/3d -p "test_*.py" -v
```

The slide-copy and package-pruning helpers now live in `embed-3d.py` and are versioned with the repository. There is no dependency on Claude, an installed skill, a session directory, Node or the live website for this rebuild. The original 5 October deck, committed step GLBs, fallback PNGs, poster and `steps.json` are the inputs. Python dependencies are pinned in `requirements.txt`.

If the standalone MP4 is absent, the builder extracts the backup from the existing committed `AUS-teaching-deck-3d.pptx` **before** replacing it. It verifies SHA-256 `aea54cc59ed74e87e72b0194e76cb95f49329a0277419853ba6997bb2d9c2982`. Keep that seed PPTX when starting a clean build. To use a separate seed or a new recording:

```sh
python presentation/3d/embed-3d.py --video-from /path/to/existing-3d-deck.pptx
python presentation/3d/embed-3d.py --video /path/to/recording.mp4
```

`--output` and `--test-output` allow builds in a separate directory; the original teaching deck cannot be used as either output. `validate.py --deck PATH --test PATH --report PATH` validates those files without modifying the default report. A full deck is staged until movie insertion succeeds, so a failed build preserves the video seed.

The regression suite builds from a relocated checkout with spaces in its path, an unrelated working directory and an empty user-home path. It runs all 48 structural checks, checks the source deck and seed remain unchanged, and compares every slide, note, media and animation part against the versioned 3D deck byte for byte. Only package-level slide IDs and relationship IDs may differ. It also checks smoke-test pruning, explicit video selection, missing/corrupt video errors and protection against overwriting the original. GitHub Actions runs the suite on Windows and Linux. These checks do not exercise Microsoft PowerPoint rendering.

For deliberate regeneration of the visual assets, run `npm ci`, `node build-steps.mjs`, `node render-fallbacks.mjs` and `node record-video.mjs` in this directory before embedding. That optional pipeline uses a browser and the live public UroOps page; it is separate from the offline rebuild above. Update the versioned seed and video checksum intentionally when changing the backup recording. The existing optional `contact-sheets.py` is configured for the author's Windows LibreOffice installation and also requires PyMuPDF and Pillow; it is not part of the portable rebuild or CI.

## Pre-talk checklist

1. Before the 23 October presentation, test `test-one-slide.pptx` and the full deck in real desktop Microsoft PowerPoint. Record the PowerPoint version/build and the outcome. Repeat the checks on the actual lectern PC before the talk, with the network disconnected, using locally copied files. Also copy the original deck as the fallback.
2. Open it in PowerPoint 2019 or Microsoft 365 on Windows 10 or later (3D models need both).
3. On each 3D slide click the model: a 3D rotation handle should appear. A plain picture with no handle means PowerPoint is showing the fallback.
4. Press F5 and step through 26 to 28 and 30 to 33 to see the Morph transitions.
5. On slide 33 the 8 s cycle (cuff opens, balloon fills, cuff closes) should play. If it does not, select the model and add Animations > Scene.
6. Play the video on slide 40 (backup, outside the timed talk, no sound).
7. Keep the original deck open in the background as plan B.

Still unverified: opening without a repair prompt, native rotation/zoom on all seven models, the slide 33 embedded eight-second animation, Morph versus cross-fade behaviour between different GLBs, video playback, and the lectern's policy/rendering behaviour. Structural validation cannot establish any of these. If a model cannot be manipulated, inspect whether PowerPoint has chosen the static fallback, then use the backup video or original deck. No real-PowerPoint test has been completed by this portability fix.

## Mapping

| Slide | Title | UroOps steps | Camera (focus, mm, az, el) | Morph in |
|---|---|---|---|---|
| 26 | Positioning and exposure | 1 Orientation, 2 Perineal exposure | Lithotomy, 150, 0, -80 | no |
| 27 | Bulbar dissection and tissue preservation | 3 Plane, 4 Mobilisation | Bulb (cuff site), 70, -18, -74 | yes |
| 28 | Cuff measurement and fit | 5 Sizing, 6 Cuff | Bulb, 56, -20, -72 | yes |
| 30 | Balloon pocket and pressure selection | 7 Balloon | Retzius (balloon), 96, 45, 22 | no |
| 31 | Pump position and patient access | 8 Pump | Scrotum (pump pocket), 82, 10, -5 | yes |
| 32 | System checks and handover | 10 Check, 11 Close | Scrotum, 92, 10, -5; cuff open, pump squeezed | yes |
| 33 | UroOps 3D: anatomy and component routes | 9 Connect, whole system | Device, 240, 38, -6; keeps the 8 s cycle | yes |
| 40 | Backup: UroOps 3D AUS flow (video) | all eleven, then Final configuration | recording of the public page | no |

Morph is the only animation in the deck; every other slide still has none. Each Morph has a fade fallback for older PowerPoint. Slide 29 (urethral injury) stays text only. Each 3D slide gained one disclaimer text box and one speaker-note line starting "3D:". No other text, table, reference or note was changed (`validate.py` compares every text run of all 49 original slides and notes).

## Departures from the plan, and why

- **Lens distance not clamped.** UroOps `solve()` clamps the camera to at least 0.62 scene units (0.21 m) for its orbit control. With the clamp every view from 26 to 32 would show the same 193 mm field; without it the planned lens values (56 to 150 mm) apply. `geometry.mjs` keeps the clamp as an option.
- **Scrotum focus = pump pocket.** The scene's `FOCUS.Scrotum` is `PUMP_POCKET`, not `SCROTUM.centre`, so slides 31 and 32 centre on the pump. Slide 33 uses the scene's own `FOCUS.Device` (0.02, -0.07, 0.06).
- **Frames and disclaimers moved where the plan's boxes collided with existing text:** slide 30 frame 6.0 x 4.1 in (not 4.3) with the disclaimer at 5.92 in, in light grey on the dark background; slide 32 frame 4.0 x 3.85 in with a two-line disclaimer at 5.8 in; slide 33 frame 8.54 x 3.4 in with the disclaimer at 5.42 in, above the existing link.
- **Slide 32 row text boxes narrowed** from 11.04 to 6.8 in (text unchanged), as decided on 8 October, because the LibreOffice render showed the frame over their glyphs. Two rows now wrap onto a second line.
- **Testes, connectors and both tubing lines already existed** in the public GLB and were reused; the stubs on 28, 30 and 31 are cut from that same tubing. Tubing carries a blue (to cuff) or dark (to balloon) stripe.
- **Spongiosum at 0.7 opacity** so the urethral lumen and catheter show through.
- **Source file:** the public `4.glb` differs in hash from the checkout copy (an earlier export); the public file was used. See `source/SOURCES.md`.

## Manual fallback (if PowerPoint will not show the models)

1. Open the original deck. Insert > 3D Models > This Device and pick the step GLB from `steps/` (for example `aus-28-sizing.glb`).
2. Size it into the left column (clear of the bullets at 8.21 in).
3. Rotate or zoom it to a useful view. For a fly-through, duplicate the slide, change the view, and set Transitions > Morph on the second slide.
4. Repeat per step. The video slide can be rebuilt with Insert > Video > This Device using a standalone MP4 or the MP4 extracted from `ppt/media/` inside a ZIP copy of the committed 3D deck.

## Known uncertainties

- Whether Morph interpolates between two **different** GLB files with the same object name (`!!AUS3D`). If not, PowerPoint should cross-fade the frames.
- The models use window viewport mode (`am3d:winViewport`), for which no PowerPoint-written sample was found. If PowerPoint repairs the file, switch to `objViewport` in `embed-3d.py` (see `AM3D-NOTES.md`).
- PowerPoint lights the models with its own lights, so colours will differ a little from the fallback pictures.

## Licence, attribution and data

Atlas bones and bladder: Z-Anatomy / BodyParts3D (DBCLS), CC-BY-SA 4.0; the step GLBs are derived and keep that licence. AUS anatomy and device geometry: UroOps3D (Nity G), a schematic of the Rigicon ContiClassic with clinical review pending, not manufacturer artwork. Every GLB carries this in `asset.copyright`, and every 3D slide says "Teaching illustration. Not patient-specific. Not a medical device."

No patient imaging or patient-derived data was used anywhere. All geometry comes from the public UroOps 3D export and the UroOps geometry constants, read from `C:\Users\nityj\Projects\UroOps3D-aus-spatial-ar` under Nity's read-only authorisation of 8 October 2026 (files read only; no Git, build, script or write there).

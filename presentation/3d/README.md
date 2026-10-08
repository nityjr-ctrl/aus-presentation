# AUS deck with embedded 3D models

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
| `video/aus-flow-1080p.mp4` | not in Git: 1920 x 1080 H.264, 159 s, 42.6 MB, no sound; copy in `C:\NityProjects\AUS-Presentation\archive\2026-10-08-3d-build\` |
| `steps.json` | mapping, node lists, cameras (resolved values written by the build), notes lines |
| `AM3D-NOTES.md` | how the PowerPoint 3D XML was worked out, and what is still uncertain |
| `validation-3d.json` | last `validate.py` result |

Rebuild: `npm ci`, then `node build-steps.mjs`, `node render-fallbacks.mjs`, `node record-video.mjs`, `python embed-3d.py`, `python validate.py`, `python contact-sheets.py`.

## Pre-talk checklist

1. The day before, copy `AUS-teaching-deck-3d.pptx` (about 50 MB) and the original deck to the lectern PC.
2. Open it in PowerPoint 2019 or Microsoft 365 on Windows 10 or later (3D models need both).
3. On each 3D slide click the model: a 3D rotation handle should appear. A plain picture with no handle means PowerPoint is showing the fallback.
4. Press F5 and step through 26 to 28 and 30 to 33 to see the Morph transitions.
5. On slide 33 the 8 s cycle (cuff opens, balloon fills, cuff closes) should play. If it does not, select the model and add Animations > Scene.
6. Play the video on slide 40 (backup, outside the timed talk, no sound).
7. Keep the original deck open in the background as plan B.

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
4. Repeat per step. The video slide can be rebuilt with Insert > Video > This Device using the archived MP4.

## Known uncertainties

- Whether Morph interpolates between two **different** GLB files with the same object name (`!!AUS3D`). If not, PowerPoint should cross-fade the frames.
- The models use window viewport mode (`am3d:winViewport`), for which no PowerPoint-written sample was found. If PowerPoint repairs the file, switch to `objViewport` in `embed-3d.py` (see `AM3D-NOTES.md`).
- PowerPoint lights the models with its own lights, so colours will differ a little from the fallback pictures.

## Licence, attribution and data

Atlas bones and bladder: Z-Anatomy / BodyParts3D (DBCLS), CC-BY-SA 4.0; the step GLBs are derived and keep that licence. AUS anatomy and device geometry: UroOps3D (Nity G), a schematic of the Rigicon ContiClassic with clinical review pending, not manufacturer artwork. Every GLB carries this in `asset.copyright`, and every 3D slide says "Teaching illustration. Not patient-specific. Not a medical device."

No patient imaging or patient-derived data was used anywhere. All geometry comes from the public UroOps 3D export and the UroOps geometry constants, read from `C:\Users\nityj\Projects\UroOps3D-aus-spatial-ar` under Nity's read-only authorisation of 8 October 2026 (files read only; no Git, build, script or write there).

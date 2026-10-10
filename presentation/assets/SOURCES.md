# Visual sources

## UroOps 3D

Source: https://uroops3d.com/lab/aus . Recaptured 10 October 2026 from the public page with a scripted browser (`../3d/capture/`), replacing the 1358 x 560 captures of 30 September to 1 October.

| File | Slide | View |
|---|---|---|
| `uroops-exploded.png` | 6 | "Exploded device" preset |
| `uroops-sagittal.png` | 16 | "Sagittal" preset |
| `uroops-surgeon.png` | 26 | lesson step 2, exposure |
| `uroops-cuff-site.png` | 27 | lesson step 4, loop through the tunnel |
| `uroops-aus.png` | 28 | lesson step 6, cuff in place |
| `uroops-three-spaces.png` | 31 | lesson step 8, pump |
| `uroops-final.png` | 33 | "Final configuration" preset |

Each is 3104 x 1280 pixels (3200 x 1800 for slide 28). The scene panel was enlarged with page CSS only, and nothing was sent to the site. The narration caption, the page controls and the "UrOops3D Preview" corner mark are hidden. Labels that state a number, a device instruction or back-table preparation are hidden too, because the deck does not present unverified device-specific detail. The file names are unchanged so `scripts/build.mjs` still finds them, although three names no longer describe the view.

`uroops-cover.png` (3120 x 2080) is the same scene's final-configuration view with every label hidden, captured on 10 October 2026. It is the cover picture of both decks.

Attribution: © UroOps3D / UroRef / Nity G. The public page labels the ContiClassic scene as a schematic with clinical review pending. The slides carry no caption under these pictures (removed at the owner's request on 10 October 2026); the speaker notes on each picture slide identify them as teaching schematics. They do not establish geometric accuracy, tissue perfusion, operative safety or manufacturer instructions. The UroOps repository was not opened or edited.

## ContiClassic device illustration

`conticlassic-000.png`: manufacturer device figure extracted unchanged from printed page 1 / PDF page 4 of the Rigicon ContiClassic Instructions for Use, CC-IFU REV.03, 12 October 2023.

Source: https://www.rigicon.com/files/e-labeling/ContiClassic-IFU.pdf . Accessed 30 September 2026. Manufacturer artwork, used for educational component identification and credited in slide notes. No claim of an open licence or comparative device efficacy is made.

## Theatre illustration

`theatre-illustration.png`: AI-generated illustrative operating theatre and instrument table. It depicts no actual operation, patient or identifiable staff member. It was the cover picture until 10 October 2026 and is no longer used in either deck.

## Charts

The skin-culture chart uses Yeung et al. 2013: 8% versus 32%, 100 initial GU prosthetic procedures, 50 in each group. Source: https://pubmed.ncbi.nlm.nih.gov/23164373/ . This is a surrogate skin-culture endpoint, not AUS infection and not a preparation-duration study.

The DO and poor-compliance plots are explicitly labelled synthetic schematics with arbitrary units. They illustrate transient contraction versus sustained filling-pressure rise. They contain no patient observations or eligibility thresholds. Physiological context: ICS good urodynamic practices, https://doi.org/10.1002/nau.23124 .

## Annotated sites of anatomical narrowing - 5 October 2026

`anatomical-narrowing-colour-annotations-2026.png`: original AI-generated clinical teaching schematic made with the built-in image-generation tool. Blue: anterior/bulbar stricture and corpus spongiosum; orange: bladder-neck contracture after TURP with residual prostate; purple: vesicourethral anastomotic stenosis after radical prostatectomy with prostate absent. The dashed empty outline in the VUAS panel denotes the former prostate region, not remaining gland tissue.

Terminology checked against EAU Urethral Strictures section 4.1.1: https://uroweb.org/guidelines/urethral-strictures/chapter/classifications . Separate panels show different anatomical settings. This is a simplified teaching illustration, not to scale or clinically validated. Image inspected for label accuracy, arrow placement and consistent colours. No patient or UroOps3D source image used; no UroOps3D repository accessed.

Dimensions: 1672 x 941 pixels; 1444046 bytes. SHA-256: `ae30ca22ab4d2004cd5006fccfc9f0488c14af5387913e2bb6363e981c3fff97`. Final prompt and mode are recorded in `anatomical-narrowing-generation-notes-2026.md`. Intended as a replacement illustration for teaching slide 15 / physical slide 16; existing deck and guide were not edited in this image-only request.

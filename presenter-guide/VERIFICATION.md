# ST5 presenter guide verification - 5 October 2026

The current guide follows the corrected final deck after its 2026 evidence update: 49 physical slides, 38 timed teaching slides, 58 citation codes and 68 PDF pages. The prior superseded-draft guide remains in Git history.

Each main slide includes clinical explanation, evidence meaning, a speaking line and presentation cautions. The seven reference slides contain source-by-source interpretation. New 2026 findings and conference access limitations are explained in the relevant sections. BAUS 2025, AUA amended 2024 and EAU 2026 publication years are retained accurately.

All guide pages were rendered for review; reading-size pages, linked slide index, all slide/source entries, link annotations and page bounds were checked. The published PDF is byte-identical to the task deliverable. The accompanying slide checkpoint preserves the corrected source imagery and was reviewed alongside the live Google export.

Current numerical checks and limitations are recorded in [the evidence audit](../presentation/EVIDENCE-AUDIT-2026-10-05.md). Full AUA IP09-17, IP09-18 and IP09-22 results were unavailable. Their topics/DOIs are included without inferred numerical results. ContiClassic country/lot applicability and the separate OR protocol remain unverified. All clinical cases are fictional.

Repository: `nityjr-ctrl/aus-presentation`, public; canonical `C:\NityProjects\AUS-Presentation\repo`; branch `manuscript/aus-expert-60min`. Previous checkpoint `fb238613dc7ddb0734ac9cfbd397f72c5316b3b6`, 5 October 2026 14:15:57 BST, present on origin before editing. Only completed project changes are staged for the new checkpoint.

## Revision of 10 October 2026

The guide text gained three things: a note on the 10 October deck revision (three presenters, rewritten speaker notes, new UroOps pictures, the animated 50-slide version and its slide numbering), wording tidied in about 40 passages without changing any figure or source statement, and a closing provenance paragraph. No source was re-read for this revision and no evidence statement changed. The guide's own speaking lines were not rewritten to match the new deck notes.

The PDF is now built from the Markdown by `build_pdf.py` (ReportLab, Segoe UI). The script that produced the 5 October PDF was never in this repository, so the layout was rebuilt to match it. The new file has 69 pages, 113 outline entries and 370 link annotations: 98 from the slide index, 193 from citation codes to their reference entries and 79 to external sources. The 5 October file had 429 because each reference heading also linked to itself.

Checked on the new PDF: page count, outline, link counts, no text outside the page margins, and the cover, slide index, one teaching slide, one reference page and the last page by eye. The other pages were not individually reviewed.

Working branch: `feat/3d-embedded-aus`. The Google Slides copy of the deck was not updated in this revision.

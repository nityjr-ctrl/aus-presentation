#!/usr/bin/env python3
"""LibreOffice render check. LibreOffice shows the mc:Fallback pictures, so this is the fallback check.

    python contact-sheets.py
Writes contact-sheet.png (all slides) and contact-sheet-3d.png (the 3D slides and the video slide, larger).
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # PyMuPDF

fitz.TOOLS.mupdf_display_errors(False)
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
DECK = HERE.parent / "AUS-teaching-deck-3d.pptx"
SOFFICE = r"C:\Program Files\LibreOffice\program\soffice.exe"


def pages(pdf, width):
    doc = fitz.open(pdf)
    out = []
    for p in doc:
        pix = p.get_pixmap(matrix=fitz.Matrix(width / p.rect.width, width / p.rect.width))
        out.append(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
    return out


def sheet(images, labels, cols, path):
    w, h = images[0].size
    pad, lab = 10, 26
    rows = (len(images) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * (w + pad) + pad, rows * (h + lab + pad) + pad), "#d9dde0")
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 18)
    except OSError:
        font = ImageFont.load_default()
    for i, (im, text) in enumerate(zip(images, labels)):
        x = pad + (i % cols) * (w + pad)
        y = pad + (i // cols) * (h + lab + pad)
        draw.text((x, y + 2), text, fill="#1b2a33", font=font)
        canvas.paste(im, (x, y + lab))
    canvas.save(path, optimize=True)


def main():
    steps = json.loads((HERE / "steps.json").read_text(encoding="utf-8"))["slides"]
    with tempfile.TemporaryDirectory() as t:
        res = subprocess.run([SOFFICE, "--headless", "--convert-to", "pdf", "--outdir", t, str(DECK)], capture_output=True, text=True, timeout=900)
        pdf = Path(t) / (DECK.stem + ".pdf")
        if not pdf.exists():
            sys.exit(f"LibreOffice failed: {res.stdout} {res.stderr}")
        small = pages(pdf, 480)
        sheet(small, [f"Slide {i}" for i in range(1, len(small) + 1)], 6, HERE / "contact-sheet.png")
        big = pages(pdf, 1100)
        pick = [s["slide"] for s in steps] + [40]
        sheet([big[i - 1] for i in pick], [f"Slide {i}" + (" (video backup)" if i == 40 else " (3D fallback)") for i in pick], 2, HERE / "contact-sheet-3d.png")
        print(f"{len(small)} pages rendered; contact sheets written")


if __name__ == "__main__":
    main()

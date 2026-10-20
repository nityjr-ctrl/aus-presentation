# Draws the "cuff bore is not a catheter chart" schematic for teaching slide 13 (20 October 2026).
# Original drawing in the deck's palette; cross-sections are diagrammatic and not to scale.
# usage: cuff_bore_figure.py <out.png>
import sys, math
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
S = 2  # supersample
W, H = 2200 * S, 1000 * S
INK, MUTED, RULE, PANEL = (27, 36, 48), (95, 107, 122), (221, 226, 232), (243, 244, 246)
TEAL, TERRA = (15, 127, 134), (194, 72, 45)
CUFF, CUFF_EDGE = (226, 229, 233), (160, 168, 178)
SPONG, SPONG_EDGE, MUCOSA, LUMEN = (232, 167, 154), (205, 120, 105), (246, 211, 203), (255, 244, 240)
CATH = (15, 127, 134)
F = 'C:/Windows/Fonts/'
def font(size, bold=False):
    return ImageFont.truetype(F + ('seguisb.ttf' if bold else 'segoeui.ttf'), int(size * S))

im = Image.new('RGB', (W, H), (255, 255, 255))
d = ImageDraw.Draw(im)

def ring(cx, cy, r_out, r_in, fill, edge):
    d.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=fill, outline=edge, width=3 * S)
    d.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(255, 255, 255), outline=edge, width=3 * S)

def arrow(x1, y1, x2, y2, color, width=4):
    d.line([x1, y1, x2, y2], fill=color, width=width * S)
    for (ax, ay, bx, by) in ((x1, y1, x2, y2), (x2, y2, x1, y1)):
        ang = math.atan2(by - ay, bx - ax)
        L = 22 * S
        p1 = (ax + L * math.cos(ang + 0.45), ay + L * math.sin(ang + 0.45))
        p2 = (ax + L * math.cos(ang - 0.45), ay + L * math.sin(ang - 0.45))
        d.polygon([(ax, ay), p1, p2], fill=color)

def label(x, y, txt, size=30, color=INK, bold=False, anchor='la'):
    d.text((x, y), txt, font=font(size, bold), fill=color, anchor=anchor)

# panels
pw, gap, top, ph = 1000 * S, 120 * S, 150 * S, 760 * S
lx, rx = 40 * S, 40 * S + pw + gap
for x in (lx, rx):
    d.rounded_rectangle([x, top, x + pw, top + ph], radius=24 * S, fill=PANEL)

label(lx + 40 * S, 60 * S, 'What the label describes', 54, TEAL, True)
label(rx + 40 * S, 60 * S, 'What is actually inside', 54, TERRA, True)

# left: empty deflated cuff
cx, cy, R, r = lx + pw // 2, top + ph // 2 + 10 * S, 250 * S, 190 * S
ring(cx, cy, R, r, CUFF, CUFF_EDGE)
arrow(cx - r + 8 * S, cy, cx + r - 8 * S, cy, TEAL, 5)
label(cx, cy - 40 * S, 'internal diameter', 44, TEAL, True, 'mm')
label(cx, cy + 46 * S, 'of the deflated cuff', 38, TEAL, False, 'mm')
label(cx, top + ph - 60 * S, 'A number on the box: an empty bore', 38, MUTED, False, 'mm')
d.line([cx - R + 30 * S, cy - R + 55 * S, cx - R - 30 * S, cy - R - 20 * S], fill=MUTED, width=2 * S); label(cx - R - 40 * S, cy - R - 36 * S, 'cuff', 36, MUTED, False, 'rm')

# right: cuff with urethra inside
cx2 = rx + pw // 2 - 120 * S
ring(cx2, cy, R, r, CUFF, CUFF_EDGE)
# spongiosum fills the bore
d.ellipse([cx2 - r, cy - r, cx2 + r, cy + r], fill=SPONG, outline=SPONG_EDGE, width=3 * S)
rm = 95 * S
d.ellipse([cx2 - rm, cy - rm, cx2 + rm, cy + rm], fill=MUCOSA, outline=SPONG_EDGE, width=2 * S)
# collapsed lumen: a short horizontal slit
lw, lh = 70 * S, 22 * S
d.ellipse([cx2 - lw, cy - lh, cx2 + lw, cy + lh], fill=LUMEN, outline=SPONG_EDGE, width=2 * S)
# catheter in the slit
rc = 16 * S
d.ellipse([cx2 - rc, cy - rc, cx2 + rc, cy + rc], fill=CATH, outline=(255, 255, 255), width=2 * S)
# arrow for the real space
arrow(cx2 - lw + 4 * S, cy + 70 * S, cx2 + lw - 4 * S, cy + 70 * S, TERRA, 5)
label(cx2, cy + 90 * S, 'room for a catheter', 40, TERRA, True, 'ma')
# callouts
d.line([cx2 + r - 40 * S, cy - r + 40 * S, cx2 + R + 60 * S, cy - R - 10 * S], fill=INK, width=2 * S)
label(cx2 + R + 70 * S, cy - R - 40 * S, 'urethral wall', 40, INK, True)
label(cx2 + R + 70 * S, cy - R + 14 * S, 'fills the cuff', 36, INK)
d.line([cx2 + 6 * S, cy - 4 * S, cx2 + R + 60 * S, cy + 120 * S], fill=INK, width=2 * S)
label(cx2 + R + 70 * S, cy + 106 * S, 'catheter', 40, TEAL, True)
d.line([cx2 - R + 30 * S, cy - R + 55 * S, cx2 - R - 30 * S, cy - R - 20 * S], fill=MUTED, width=2 * S); label(cx2 - R - 40 * S, cy - R - 36 * S, 'cuff', 36, MUTED, False, 'rm')
label(cx2, top + ph - 60 * S, 'The tissue, not the cuff, decides what fits', 38, MUTED, False, 'mm')

# footer
label(40 * S, H - 48 * S, 'Choose the catheter for the urethra, not for the cuff.  Teaching schematic, not to scale.', 36, MUTED)

im = im.resize((W // S, H // S), Image.LANCZOS)
im.save(OUT, optimize=True)
print(OUT, im.size)

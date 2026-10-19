# Recolour the pure-black background of the ContiClassic illustration to the slide's dark colour.
import sys
from PIL import Image
src, out, hexcol = sys.argv[1:4]
bg = tuple(int(hexcol[i:i+2], 16) for i in (0, 2, 4))
im = Image.open(src).convert('RGB')
px = im.load()
w, h = im.size
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        if r < 12 and g < 12 and b < 12:
            px[x, y] = bg
im.save(out)

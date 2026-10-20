# Crop the title band and footer off the narrowing schematic so the slide title is not repeated.
# usage: crop_panels.py <src> <out> <top px> <bottom px>
import sys
from PIL import Image
src, out, top, bottom = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src).convert('RGB')
im.crop((0, top, im.width, bottom)).save(out)
print(out, im.width, bottom - top)

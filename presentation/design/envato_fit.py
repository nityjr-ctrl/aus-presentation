# Fit a licensed Envato asset to the slide: at most 3840 x 2160, JPEG quality 88, EXIF dropped.
# usage: envato_fit.py <source image> <output jpg>
import sys
from PIL import Image, ImageOps
src, out = sys.argv[1:3]
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
im.thumbnail((3840, 2160), Image.LANCZOS)
im.save(out, 'JPEG', quality=88, optimize=True, progressive=True)
print(out, im.size)

# Crop the wide preset captures to the target aspect, centred on the scene content.
import sys, glob, os
from PIL import Image, ImageChops
d = sys.argv[1]
for f in glob.glob(os.path.join(d, '*.wide.png')):
    im = Image.open(f).convert('RGB'); W, H = im.size; tw = round(W / 1.6)
    bg = Image.new('RGB', im.size, im.getpixel((W - 5, H // 2)))
    box = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 28 else 0).getbbox()
    cx = (box[0] + box[2]) // 2; x0 = max(0, min(W - tw, cx - tw // 2))
    im.crop((x0, 0, x0 + tw, H)).save(f.replace('.wide.png', '.png')); print(os.path.basename(f), box, x0)

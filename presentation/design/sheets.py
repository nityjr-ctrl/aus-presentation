import sys, glob, math, re, os
from PIL import Image
src, prefix = sys.argv[1], sys.argv[2]
files = sorted({os.path.normcase(f) for f in glob.glob(os.path.join(src, '*.png')) + glob.glob(os.path.join(src, '*.PNG'))})
files = sorted(files, key=lambda f: int(re.search(r'(\d+)\.png$', f, re.I).group(1)))
imgs = [Image.open(f).convert('RGB').resize((800, 450)) for f in files]
cols, per = 3, 9
for f in glob.glob(prefix + '-*.jpg'): os.remove(f)
for k in range(0, len(imgs), per):
    chunk = imgs[k:k + per]; rows = math.ceil(len(chunk) / cols)
    sheet = Image.new('RGB', (cols * 800 + (cols - 1) * 8, rows * 450 + (rows - 1) * 8), (120, 120, 120))
    for j, im in enumerate(chunk): sheet.paste(im, ((j % cols) * 808, (j // cols) * 458))
    sheet.save(f'{prefix}-{k // per + 1}.jpg', quality=85)
print('slides', len(imgs), 'sheets', math.ceil(len(imgs) / per))

"""JPEG copies of every image the PDF page uses (Chrome embeds JPEG as is, but re-encodes WebP losslessly: 150 MB).
python -I scripts/pdf_imgs.py  ->  assets/pdf-cache/<same path>.jpg, longest side 1800 px"""
import pathlib
from PIL import Image
src, out = pathlib.Path('public'), pathlib.Path('assets/pdf-cache')
for p in list((src / 'img').rglob('*.webp')) + [src / 'hero/seq/d/030.webp']:
    o = out / p.relative_to(src).with_suffix('.jpg')
    if o.exists(): continue
    o.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(p).convert('RGB'); im.thumbnail((1800, 1800), Image.LANCZOS)
    im.save(o, quality=82, optimize=True, progressive=False)

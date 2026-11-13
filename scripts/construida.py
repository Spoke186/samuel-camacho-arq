"""Construida (#103): the lot, his render, the finished building, all in one 3:4 frame.
python -I scripts/construida.py  (needs assets/obra/up/*.png from Real-ESRGAN x4 of Samuel's two WhatsApp photos)"""
from PIL import Image
OUT = (1200, 1600)
def cut(src, box, k, out):
    im = Image.open(src).convert('RGB')
    im.crop(tuple(v * k for v in box)).resize(OUT, Image.LANCZOS).save(f'public/img/obra/{out}.webp', quality=84, method=6)
cut('assets/obra/up/lote.png', (219, 0, 941, 963), 4, 'lote')
cut('assets/obra/up/construida.png', (40, 175, 738, 1106), 4, 'construida')  # the date stamp sits below y 1500, out of the frame
cut('public/img/obra/fachada.webp', (564, 0, 1492, 1238), 1, 'render-34')

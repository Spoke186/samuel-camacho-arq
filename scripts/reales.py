"""Photoreal versions of his renders (DECISIONS #102) → public/img/<sem>/<name>-real.webp.
python -I scripts/reales.py assets/higgsfield/raw public/img
Qwen outputs are used as they come (their inputs were already graded by assets.py). s7/cultural was rejected (it changed the building)."""
import sys, pathlib
from PIL import Image
raw, out = map(pathlib.Path, sys.argv[1:3])
KEEP = ['s1/ocaso', 's2/parador-ocaso', 's2/medianera', 's3/uva', 's4/torre', 's5/aerea', 's6/mova']
for k in KEEP:
    im = Image.open(raw / f"{k.replace('/', '-')}-1.png").convert('RGB')
    im.save(out / f"{k}-real.webp", quality=82, method=6)
    print(k, im.size)

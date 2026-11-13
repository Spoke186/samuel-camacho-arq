"""Material for the second round of interactive pieces.
python -I scripts/extra.py <samuel-raw dir> <public dir>
  aptos  → public/img/s4/apto-1..5.webp   (apartment plans cut from sheet 2, scale 1:50/1:100)
  capas  → public/img/s8/capa-*.webp      (four map layers that share one base map)
  mesa   → public/img/mesa/*.webp + src/data/mesa.json (every delivery sheet, for the drawing table)"""
import sys, json, pathlib, pymupdf
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

raw, pub = map(pathlib.Path, sys.argv[1:3])
P = raw / "PORTAFOLIO"
what = set(sys.argv[3:]) or {"aptos", "capas", "mesa"}


def page(pdf, n, zoom):
    pg = pymupdf.open(P / pdf)[n]
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def cut(im, f):
    return im.crop((round(f[0] * im.width), round(f[1] * im.height), round(f[2] * im.width), round(f[3] * im.height)))


def save(im, path, w, q=78):
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, quality=q, method=6)
    return im.size


if "aptos" in what:
    sheet = Image.open(raw / "img/15/p00_x23_8268x17717.jpg").convert("RGB")
    for i, f in enumerate([(.015, .603, .405, .72), (.52, .603, .925, .712), (.06, .768, .385, .892), (.585, .73, .915, .836), (.478, .853, .735, .967)], 1):
        print("apto", i, save(cut(sheet, f), pub / f"img/s4/apto-{i}.webp", 1400, 82))

if "capas" in what:
    pdf = "8/Análisis urbano Sector _ Gamma y Belmonte.pdf"
    for name, n in (("coberturas", 6), ("alturas", 8), ("llenos", 9), ("fachadas", 10)):
        print("capa", name, save(cut(page(pdf, n, 1.4), (.29, .13, .9, .69)), pub / f"img/s8/capa-{name}.webp", 1800, 80))

if "mesa" in what:
    SHEETS = [  # (semester, pdf, page)
        ("01", "1/FINAL ARQ 1.pdf", 0),
        ("02", "2/CASA MEDIANERA/MEMORIA GENERAL FINAL.pdf", 0), ("02", "2/CASA MEDIANERA/MEMORIA VOLUMETRICA.pdf", 0),
        ("02", "2/CASA MEDIANERA/PLANIMETRICA FINAL.pdf", 0), ("02", "2/PORTERIA/Memoria general (1).pdf", 0),
        ("02", "2/RESTAURANTE/Memoria general FINAL.pdf", 0), ("02", "2/RESTAURANTE/PLANOS FINAL 123.pdf", 0),
        ("03", "3/LAMINA PLANIMETRICA FINAL.pdf", 0), ("03", "3/MEMORIA GENERAL FINAL 1_compressed.pdf", 0),
        ("04", "4/Lamina 1.pdf", 0), ("04", "4/Lamina 2.pdf", 0), ("04", "4/Lamina 3.pdf", 0), ("04", "4/Lamina 4.pdf", 0), ("04", "4/Lamina 5-1.pdf", 0),
        ("05", "6/laminas de todos.pdf", 0), ("05", "6/laminas de todos.pdf", 1), ("05", "6/laminas de todos.pdf", 2), ("05", "6/laminas de todos.pdf", 3),
        ("06", "6/Proyecto VI.pdf", 0), ("06", "6/Proyecto VI.pdf", 1), ("06", "6/Proyecto VI.pdf", 2),
        ("07", "7/ENTREGA ANTE PROYECTO 2025-1.pdf", 0), ("07", "7/MARIA ALEJANDRA CASTANO GUSTAVO MEJIA SANDRA MILENA.pdf", 0),
        ("08", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 6), ("08", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 14),
        ("08", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 21),
    ]
    out = []
    for k, (sem, pdf, n) in enumerate(SHEETS):
        pg = pymupdf.open(P / pdf)[n]
        zoom = 1600 / max(pg.rect.width, pg.rect.height)
        im = page(pdf, n, zoom)
        name = f"{k:02d}"
        w, h = save(im, pub / f"img/mesa/{name}.webp", 1600, 74)
        out.append({"sem": sem, "src": f"/img/mesa/{name}.webp", "w": w, "h": h})
        print("mesa", name, sem, (w, h))
    (pub.parent / "src/data/mesa.json").write_text(json.dumps(out, indent=1))

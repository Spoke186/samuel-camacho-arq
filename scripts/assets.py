"""Site images from the PORTAFOLIO material (extracted PDF images, loose photos, PDF page renders and crops).
python -I scripts/assets.py <samuel-raw dir> <public/img> <src/data/img.json>
Each entry: (slug, name, source). Source forms:
  ("x", "<folder>/<file>")             an image extracted from a PDF (samuel-raw/img/<folder>/<file>)
  ("f", "<path under PORTAFOLIO>")      a loose photo
  ("x", "...", (l, t, r, b))            any of the above cropped by fractions
  ("p", "<pdf under PORTAFOLIO>", page, zoom, (l, t, r, b)?)  a rendered PDF page
"""
import sys, json, re, pathlib, pymupdf
from PIL import Image, ImageEnhance, ImageFilter, ImageChops
Image.MAX_IMAGE_PIXELS = None

# Drawings and sheets stay as drawn; renders and photos get one shared grade so they read as a series.
DRAWING = re.compile(r'planta|corte|operaciones|aula|lamina|fachadas|plantas|cortes|plano|portada|meses|sol|topografia|calor|asoleacion|arboles|portico|recinto|^s8/[gb]\d|^s4/hd|apto|capa')


def grade(im):
    im = ImageEnhance.Color(im).enhance(0.8)
    im = ImageEnhance.Contrast(im).enhance(1.1)
    im = ImageEnhance.Brightness(im).enhance(0.93)
    r, g, b = im.split()  # warm highlights, cooler shadows
    r = r.point(lambda v: min(255, int(v * 1.035 + 2)))
    b = b.point(lambda v: int(v * 0.93 + 6 * (1 - v / 255)))
    return Image.merge('RGB', (r, g, b))

raw, out, manifest = map(pathlib.Path, sys.argv[1:4])
P = raw / "PORTAFOLIO"

S = [
    # 1 · Habitáculo en clima desértico
    ("s1", "render", ("x", "00/p00_x11_5513x11810.jpg", (0, .049, 1, .205))),
    ("s1", "aula", ("x", "00/p00_x11_5513x11810.jpg", (.03, .672, .985, .835))),
    ("s1", "operaciones", ("x", "00/p00_x11_5513x11810.jpg", (.01, .462, .36, .54))),
    ("s1", "maqueta", ("x", "25/p03_x512_1145x859.jpg")),
    ("s1", "ocaso", ("x", "25/p02_x505_1153x701.jpg")),
    # 2 · Parador restaurante, casa medianera, portería
    ("s2", "parador", ("x", "10/p01_x45_1060x1080.jpg")),
    ("s2", "parador-ocaso", ("x", "10/p00_x15_2012x1340.jpg")),
    ("s2", "parador-planta", ("x", "10/p16_x208_1300x1336.jpg")),
    ("s2", "parador-corte", ("x", "10/p19_x231_1489x635.jpg")),
    ("s2", "parador-interior", ("x", "10/p14_x200_1126x634.jpg")),
    ("s2", "parador-ladera", ("x", "10/p07_x112_837x593.jpg")),
    ("s2", "medianera", ("x", "03/p00_x21_1280x720.jpg")),
    ("s2", "medianera-2", ("x", "03/p00_x22_1280x720.jpg")),
    ("s2", "porteria", ("f", "2/PORTERIA/Render plancha 2.jpg")),
    ("s2", "porteria-2", ("f", "2/PORTERIA/Render 33.jpg")),
    # 3 · UVA El Dorado + ejercicios
    ("s3", "uva", ("x", "13/p22_x172_3840x2160.jpg")),
    ("s3", "uva-patio", ("x", "13/p20_x149_1920x1080.jpg")),
    ("s3", "uva-juego", ("x", "13/p21_x151_1920x1080.jpg")),
    ("s3", "uva-panal", ("x", "13/p12_x119_1920x1080.jpg")),
    ("s3", "uva-cancha", ("x", "13/p12_x120_1920x1080.jpg")),
    ("s3", "tectonica", ("x", "13/p03_x83_1536x864.jpg")),
    ("s3", "caja-luz", ("x", "13/p08_x104_1920x1080.jpg")),
    ("s3", "estereotomia", ("x", "13/p07_x100_814x520.jpg")),
    ("s3", "capas", ("x", "13/p10_x113_618x824.jpg")),
    ("s3", "maqueta", ("f", "3/WhatsApp Image 2022-11-17 at 4.10.32 PM.jpeg")),
    # 4 · Vivienda colectiva (calle 23-24)
    ("s4", "torre", ("x", "17/p00_x23_2756x5906.jpg", (0, .045, 1, .53))),
    ("s4", "multifamiliar", ("x", "25/p08_x338_1536x864.jpg")),
    ("s4", "fachadas", ("p", "4/Lamina 1.pdf", 0, 1.0, None)),
    ("s4", "plantas", ("p", "4/Lamina 2.pdf", 0, 1.0, None)),
    ("s4", "cortes", ("p", "4/Lamina 3.pdf", 0, 1.0, None)),
    # 5 · Centro comunitario Travesuras
    ("s5", "aerea", ("x", "19/p02_x2037_1280x818.jpg")),
    ("s5", "aerea-2", ("x", "19/p02_x2038_1536x981.jpg")),
    ("s5", "plaza", ("x", "19/p01_x1992_1536x864.jpg")),
    ("s5", "graderia", ("x", "19/p01_x1989_1152x768.jpg")),
    ("s5", "parque", ("x", "19/p03_x2089_1536x981.jpg")),
    ("s5", "edificio", ("x", "19/p03_x2091_1536x981.jpg")),
    ("s5", "recorrido", ("x", "19/p04_x2182_1448x728.jpg")),
    ("s5", "lamina", ("p", "6/laminas de todos.pdf", 0, .55, None)),
    # 6 · MOVA Ciudad Pereira
    ("s6", "mova", ("x", "20/p00_x3608_960x540.jpg")),
    ("s6", "mova-2", ("x", "20/p02_x3772_960x540.jpg")),
    ("s6", "mova-3", ("x", "20/p02_x3778_960x540.jpg")),
    ("s6", "mova-4", ("x", "20/p00_x3611_960x540.jpg")),
    ("s6", "mobiliario", ("x", "20/p00_x1771_1241x1187.jpg")),
    ("s6", "clid", ("x", "25/p11_x356_1152x648.jpg")),
    ("s6", "lamina", ("p", "6/Proyecto VI.pdf", 0, .5, None)),
    # 7 · Casa campestre Las Margaritas + centro cultural de artes y oficios
    ("s7", "casa", ("x", "21/p07_x227_2304x1296.jpg")),
    ("s7", "casa-acceso", ("x", "21/p05_x209_2304x1296.jpg")),
    ("s7", "casa-terraza", ("x", "21/p06_x219_2304x1296.jpg")),
    ("s7", "casa-sala", ("x", "21/p06_x217_1536x864.jpg")),
    ("s7", "cultural", ("x", "23/p01_x650_3456x1944.jpg")),
    ("s7", "cultural-fachada", ("x", "23/p00_x476_3492x1964.jpg")),
    ("s7", "cultural-corte", ("x", "23/p01_x643_2283x1346.jpg")),
    ("s7", "cultural-planta", ("x", "23/p01_x639_3521x2824.jpg")),
    ("s7", "cultural-a", ("x", "22/p00_x638_2688x1512.jpg")),
    ("s7", "cultural-b", ("x", "22/p01_x761_2688x1512.jpg")),
    ("s7", "artes", ("x", "25/p14_x378_1152x648.jpg")),
    ("s7", "artes-2", ("x", "25/p14_x379_1152x648.jpg")),
    # 8 · Microclima urbano
    ("s8", "portada", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 0, .9, None)),
    ("s8", "topografia", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 3, .9, None)),
    ("s8", "calor", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 14, .9, None)),
    ("s8", "sol", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 17, .9, None)),
    ("s8", "proceso", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 21, .9, None)),
    ("s8", "sombra", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 24, .9, None)),
    ("s8", "meses", ("p", "8/Análisis urbano Sector _ Gamma y Belmonte.pdf", 34, .9, None)),
    # Trabajos: la casa en obra, el seminario
    ("obra", "antes", ("f", "TRABAJOS/WhatsApp Image 2026-11-05 at 1.12.45 AM (1).jpeg")),
    ("obra", "despues", ("f", "TRABAJOS/WhatsApp Image 2026-11-05 at 1.12.45 AM.jpeg")),
    ("obra", "render", ("f", "TRABAJOS/WhatsApp Image 2026-11-05 at 1.12.45 AM (2).jpeg")),
    ("obra", "fachada", ("f", "TRABAJOS/WhatsApp Image 2026-11-05 at 1.12.00 AM.jpeg")),
    ("obra", "plano-a", ("p", "TRABAJOS/planoa.pdf", 0, 2.4, None)),
    ("obra", "plano-c", ("p", "TRABAJOS/PLANO C.pdf", 0, 2.4, None)),
    ("seminario", "portada", ("p", "TRABAJOS/Etapa 1 y 2 SEMINARIO I.pdf", 0, 1.2, None)),
    ("seminario", "calor", ("p", "TRABAJOS/Etapa 1 y 2 SEMINARIO I.pdf", 11, 1.2, None)),
    ("seminario", "asoleacion", ("p", "TRABAJOS/Etapa 1 y 2 SEMINARIO I.pdf", 14, 1.2, None)),
    ("seminario", "arboles", ("p", "TRABAJOS/Etapa 1 y 2 SEMINARIO I.pdf", 17, 1.2, None)),
    # interactive pieces
    ("s1", "portico", ("x", "00/p00_x11_5513x11810.jpg", (.037, .6775, .333, .8205))),
    ("s1", "aula-int", ("x", "00/p00_x11_5513x11810.jpg", (.374, .6775, .666, .8205))),
    ("s1", "recinto", ("x", "00/p00_x11_5513x11810.jpg", (.697, .6775, .983, .8205))),
    ("s3", "luz-manana", ("x", "13/p08_x103_1920x1080.jpg")),
    ("s3", "luz-tarde", ("x", "13/p08_x104_1920x1080.jpg")),
    ("s3", "visual-1", ("x", "13/p09_x107_789x1024.jpg")),
    ("s3", "visual-2", ("x", "13/p09_x109_828x972.jpg")),
] + [("s8", f"g{i + 1:02d}", ("x", f"24/{n}", None, 1600)) for i, n in enumerate([  # shadow study, Gamma
    "p24_x7728_2688x1512.jpg", "p25_x7756_2688x1512.jpg", "p26_x7780_2688x1512.jpg", "p27_x7808_2688x1512.jpg", "p28_x7832_2688x1512.jpg",
    "p29_x7860_2688x1512.jpg", "p30_x7883_2688x1512.jpg", "p31_x7912_2688x1512.jpg", "p32_x7935_2688x1512.jpg", "p33_x7961_2688x1512.jpg"])
] + [("s8", f"b{i + 1:02d}", ("x", f"24/{n}", None, 1600)) for i, n in enumerate([  # Belmonte (p41 repeats p40)
    "p35_x8069_2304x1296.jpg", "p36_x8075_2304x1296.jpg", "p37_x8101_2304x1296.jpg", "p38_x8127_2304x1296.jpg", "p39_x8153_2304x1296.jpg",
    "p40_x8179_2304x1296.jpg", "p42_x8231_2304x1296.jpg", "p43_x8257_2304x1296.jpg", "p44_x8283_2304x1296.jpg", "p45_x8309_2304x1296.jpg"])
] + [("s4/hd", n, ("x", f"{d}/p00_x{x}_8268x17717.jpg", None, 3000)) for n, d, x in (("fachadas", "14", 16), ("plantas", "15", 23), ("cortes", "16", 16))]


def load(src):
    kind = src[0]
    if kind == "p":
        _, pdf, page, zoom, crop = src
        doc = pymupdf.open(P / pdf); pg = doc[page]
        pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom * 2, zoom * 2), alpha=False)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    else:
        path = (raw / "img" / src[1]) if kind == "x" else (P / src[1])
        up = raw / "up" / path.relative_to(raw).with_suffix(".png")  # Real-ESRGAN output, when it exists
        im = Image.open(up if up.exists() else path).convert("RGB")
        crop = src[2] if len(src) > 2 else None
    return im if not crop else im.crop((round(crop[0] * im.width), round(crop[1] * im.height), round(crop[2] * im.width), round(crop[3] * im.height)))


only = set(sys.argv[4:])
data = json.loads(manifest.read_text()) if manifest.exists() else {}
for slug, name, src in S:
    key = f"{slug}/{name}"
    if only and slug not in only and key not in only: continue
    im = load(src)
    mw = src[3] if src[0] == "x" and len(src) > 3 else 2200
    if im.width > mw: im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
    if not DRAWING.search(key): im = grade(im).filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=2))
    (out / slug).mkdir(parents=True, exist_ok=True)
    im.save(out / slug / f"{name}.webp", quality=72 if mw != 2200 else 80, method=6)
    data[key] = [im.width, im.height]
    print(key, im.size)
manifest.parent.mkdir(parents=True, exist_ok=True)
manifest.write_text(json.dumps(data, indent=1))

"""4x AI upscale of every low-res source the site uses, with Real-ESRGAN (ncnn/Vulkan, runs on the AMD GPU).
python -I scripts/upscale.py <samuel-raw dir> <realesrgan-ncnn-vulkan.exe>
Writes samuel-raw/up/<same path>.png; scripts/assets.py picks those up automatically.
Renders and photos use realesrgan-x4plus; drawings are left alone (they are shown on paper at their own size)."""
import sys, re, pathlib, subprocess, importlib.util
from PIL import Image

raw, exe = pathlib.Path(sys.argv[1]), sys.argv[2]
spec = importlib.util.spec_from_file_location("assets_list", pathlib.Path(__file__).with_name("assets.py"))
src = pathlib.Path(spec.origin).read_text(encoding="utf-8")
# read the S list without running the script
S = eval(src[src.index("S = [") + 4: src.index("\n\n\ndef load")], {"__builtins__": {}}, {"enumerate": enumerate})
DRAWING = re.compile(r"planta|corte|operaciones|aula|lamina|fachadas|plantas|cortes|plano|portada|meses|sol|topografia|calor|asoleacion|arboles|portico|recinto|^s8/[gb]\d|^s4/hd|apto|capa")

done = set()
for slug, name, s in S:
    if s[0] not in ("x", "f") or DRAWING.search(f"{slug}/{name}"): continue
    path = (raw / "img" / s[1]) if s[0] == "x" else (raw / "PORTAFOLIO" / s[1])
    if path in done: continue
    done.add(path)
    w = Image.open(path).width
    crop = s[2] if len(s) > 2 else None
    if (w * (crop[2] - crop[0]) if crop else w) >= 1900: continue
    out = raw / "up" / path.relative_to(raw).with_suffix(".png")
    if out.exists(): continue
    out.parent.mkdir(parents=True, exist_ok=True)
    print("upscale", path.relative_to(raw), w, flush=True)
    subprocess.run([exe, "-i", str(path), "-o", str(out), "-n", "realesrgan-x4plus", "-s", "4"], check=True)
print("done", len(done))

"""Hero sequence: Samuel's render → the Kling clip (dusk → night), as WebP frames for the canvas.
python -I scripts/hero_seq.py <kling.mp4> <render.jpg> <realesrgan-ncnn-vulkan.exe> <work dir> public/hero
Frames are upscaled 4x with Real-ESRGAN (x4plus, AMD GPU) before resizing, so neither the 2560 desktop frames
nor the phone crops are blown-up 1080p. The phone crop follows the tower (its centre drifts with the push-in)."""
import sys, pathlib, subprocess, shutil
from PIL import Image
import imageio_ffmpeg

video, render, exe, work, out = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3], pathlib.Path(sys.argv[4]), pathlib.Path(sys.argv[5])
N = 96                    # frames in the scroll
DW = 2560
CX0, CX1 = 0.386, 0.415   # tower centre (fraction of width) in the first and last frame

raw, up = work / "raw", work / "up"
for d in (raw, up): d.mkdir(parents=True, exist_ok=True)
ff = imageio_ffmpeg.get_ffmpeg_exe()
if not any(raw.iterdir()):
    dur = float(subprocess.run([ff, "-i", video], capture_output=True, text=True).stderr.split("Duration: ")[1].split(",")[0].split(":")[2])
    subprocess.run([ff, "-v", "error", "-i", video, "-vf", f"fps={N / dur:.5f}", "-frames:v", str(N), str(raw / "%03d.png")], check=True)
shutil.copy(render, raw / "render.jpg")
missing = [p for p in raw.iterdir() if not (up / f"{p.stem}.jpg").exists()]
if missing:
    tmp = work / "todo"; shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    for p in missing: shutil.copy(p, tmp / p.name)
    subprocess.run([exe, "-i", str(tmp), "-o", str(up), "-n", "realesrgan-x4plus", "-s", "4", "-f", "jpg"], check=True)

def phone(im, cx):
    # the whole tower with a little air: 54 % of the width, full height, 1080 px wide (the canvas adds a blurred surround)
    w = round(im.width * 0.54)
    x = min(max(0, round(im.width * cx - w / 2)), im.width - w)
    return im.crop((x, 0, x + w, im.height)).resize((1080, round(1080 * im.height / w)), Image.LANCZOS)

for d in ("d", "m"): (out / "seq" / d).mkdir(parents=True, exist_ok=True)
frames = sorted(p for p in up.glob("*.jpg") if p.stem != "render")
for i, p in enumerate(frames):
    im = Image.open(p).convert("RGB")
    im.resize((DW, round(DW * im.height / im.width)), Image.LANCZOS).save(out / "seq" / "d" / f"{i:03d}.webp", quality=80, method=6)
    phone(im, CX0 + (CX1 - CX0) * i / max(1, len(frames) - 1)).save(out / "seq" / "m" / f"{i:03d}.webp", quality=80, method=6)
im = Image.open(up / "render.jpg").convert("RGB")
# the render is drawn under frame 0, so it is fitted to the same 16:9 box
im = im.resize((DW, round(DW * 9 / 16)), Image.LANCZOS)
im.save(out / "render-d.webp", quality=84, method=6)
phone(im, CX0).save(out / "render-m.webp", quality=84, method=6)
print("frames", len(frames))

import { gsap } from '@pagx/motion'

/* "Del render a lo real" (DECISIONS #101).
   Load: Samuel's own render opens like a row of timber louvres turning.
   Scroll, first 30 %: the louvres turn again and behind them is the building, real, at sunset.
   Scroll, the rest: the Kling clip scrubs from dusk to night while the flats light up.
   One canvas, drawn only when the state changes; the scroll owns the progress (ScrollTrigger scrub). */

const N = 96
const OPEN = 0.3 // share of the scroll spent turning the louvres
const clamp = (x: number) => Math.min(1, Math.max(0, x))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export function hero(root: HTMLElement, isPhone: boolean, onReady: () => void) {
  const c = root.querySelector<HTMLCanvasElement>('.hero-c')!
  const ctx = c.getContext('2d')!
  const v = isPhone ? 'm' : 'd'
  const load = (src: string) => { const im = new Image(); im.decoding = 'async'; im.src = src; return im }
  const render = load(`/hero/render-${v}.webp`)
  const frames: HTMLImageElement[] = Array.from({ length: N }, () => new Image())
  const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0
  const st = { intro: 0, p: 0 }
  const STRIPS = isPhone ? 9 : 22
  let dpr = 1, bg = '#000'

  // coarse to fine: every 16th frame first, so any scroll position has something close
  const queue = [16, 8, 4, 2, 1].flatMap((k) => Array.from({ length: N }, (_, i) => i).filter((i) => i % k === 0))
  const seen = new Set<number>()
  const fetchFrames = () => {
    let busy = 0
    const next = () => {
      while (busy < 6 && queue.length) {
        const i = queue.shift()!
        if (seen.has(i)) continue
        seen.add(i); busy++
        const im = frames[i]
        im.decoding = 'async'
        im.onload = im.onerror = () => { busy--; draw(); next() }
        im.src = `/hero/seq/${v}/${String(i).padStart(3, '0')}.webp`
      }
    }
    next()
  }
  const nearest = (want: number) => {
    for (let d = 0; d < N; d++) {
      if (want - d >= 0 && ok(frames[want - d])) return frames[want - d]
      if (want + d < N && ok(frames[want + d])) return frames[want + d]
    }
    return null
  }

  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1)
    bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || bg
    c.width = Math.round(c.clientWidth * dpr); c.height = Math.round(c.clientHeight * dpr)
    draw()
  }
  // each image is composed once into a full-canvas layer; the louvres then cut strips out of that layer.
  // desktop: cover-fit, anchored on the tower (40 % across). phone: the whole tower sharp and full-width,
  // over a blurred copy of itself (a 32 px thumbnail stretched up), feathered top and bottom.
  const mk = () => document.createElement('canvas')
  const tiny = mk(), tmp = mk(); tiny.width = tiny.height = 32
  const compose = (im: HTMLImageElement, L: HTMLCanvasElement) => {
    L.width = c.width; L.height = c.height
    const g = L.getContext('2d')!
    const cs = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight), cw = im.naturalWidth * cs, ch = im.naturalHeight * cs
    if (!isPhone) { g.drawImage(im, Math.min(0, Math.max(c.width - cw, c.width * 0.5 - cw * 0.4)), (c.height - ch) / 2, cw, ch); return L }
    const t = tiny.getContext('2d')!, k = Math.max(32 / im.naturalWidth, 32 / im.naturalHeight)
    t.drawImage(im, (32 - im.naturalWidth * k) / 2, (32 - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k)
    g.imageSmoothingQuality = 'high'; g.drawImage(tiny, -c.width * 0.1, -c.height * 0.1, c.width * 1.2, c.height * 1.2)
    const w = c.width, h = Math.round((w * im.naturalHeight) / im.naturalWidth)
    tmp.width = w; tmp.height = h
    const m = tmp.getContext('2d')!
    m.drawImage(im, 0, 0, w, h)
    const f = m.createLinearGradient(0, 0, 0, h)
    f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(0.12, '#000'); f.addColorStop(0.86, '#000'); f.addColorStop(1, 'rgba(0,0,0,0)')
    m.globalCompositeOperation = 'destination-in'; m.fillStyle = f; m.fillRect(0, 0, w, h); m.globalCompositeOperation = 'source-over'
    g.drawImage(tmp, 0, Math.round(c.height * 0.15))
    return L
  }
  const renderL = mk(), realL = mk()
  let renderAt = -1, realOf: HTMLImageElement | null = null, realAt = -1
  const layer = (im: HTMLImageElement) => {
    if (im === render) { if (renderAt !== c.width * 1e5 + c.height) { compose(im, renderL); renderAt = c.width * 1e5 + c.height } return renderL }
    if (realOf !== im || realAt !== c.width * 1e5 + c.height) { compose(im, realL); realOf = im; realAt = c.width * 1e5 + c.height }
    return realL
  }

  // a louvre: one vertical strip of the layer, opened to t (0 shut, 1 open), turning about its own axis
  const louvres = (L: HTMLCanvasElement, t: (i: number) => number) => {
    const sw = c.width / STRIPS
    for (let i = 0; i < STRIPS; i++) {
      const k = t(i)
      if (k <= 0) continue
      const w = sw * k, x = i * sw + (sw - w) / 2
      ctx.drawImage(L, x, 0, w + 0.5, c.height, x, 0, w + 0.5, c.height)
      if (k < 1) { // the edge of the turning board catches the light
        ctx.fillStyle = `rgba(30,30,28,${0.35 * (1 - k)})`
        ctx.fillRect(x, 0, Math.max(1, dpr), c.height); ctx.fillRect(x + w - dpr, 0, Math.max(1, dpr), c.height)
      }
    }
  }
  // strips open outward from the tower
  const order = (i: number) => Math.abs((i + 0.5) / STRIPS - (isPhone ? 0.5 : 0.4)) * 1.6

  function draw() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height)
    if (!ok(render)) return
    const a = clamp(st.p / OPEN)
    const real = nearest(Math.round(clamp((st.p - OPEN) / (1 - OPEN)) * (N - 1)))
    if (a >= 1 && real) return void ctx.drawImage(layer(real), 0, 0)
    louvres(layer(render), (i) => ease(clamp(st.intro * 1.7 - order(i))))
    if (a > 0 && real) louvres(layer(real), (i) => ease(clamp(a * 1.7 - order(i))))
  }

  new ResizeObserver(size).observe(c)
  addEventListener('tema', size) // día / noche: the canvas background follows --bg
  render.decode().catch(() => {}).then(() => {
    size()
    gsap.to(st, { intro: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: draw, onComplete: onReady })
    fetchFrames()
  })
  return {
    st, draw,
    // 18:02 at the first real frame, 19:14 at the last
    hora: () => { const m = 18 * 60 + 2 + Math.round(clamp((st.p - OPEN) / (1 - OPEN)) * 72); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}` },
    real: () => st.p >= OPEN * 0.5,
  }
}

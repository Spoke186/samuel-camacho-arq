import { gsap, ScrollTrigger } from '@pagx/motion'

// Round two: the building index, the program plan, apartments, the site walk, the walk-through,
// the map layers and the drawing table.
type Tier = 'high' | 'medium' | 'static'
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)]
const phone = () => matchMedia('(max-width: 760px)').matches

export function interact2(tier: Tier) {
  torre()
  planta(tier)
  aptos()
  reco()
  camina(tier)
  capas()
  mesa(tier)
}

/* index: the elevator car rides to the hovered floor */
function torre() {
  const root = $('[data-torre]'), car = $('.torre-car', root ?? document), lbl = $('b', car ?? document)
  if (!root || !car || !lbl) return
  const rows = $$('.piso-row', root)
  const go = (row: HTMLElement) => {
    car.style.setProperty('--fh', `${row.offsetHeight}px`)
    car.style.transform = `translateY(${row.offsetTop - rows[0].offsetTop + 3}px)`
    lbl.textContent = row.dataset.n!
  }
  rows.forEach((r) => { r.addEventListener('mouseenter', () => go(r)); r.addEventListener('focus', () => go(r)) })
  go(rows[rows.length - 2]) // parked on the first semester
}

/* 01 · plan pieces add up with the scroll; legend highlights a use; two readings */
function planta(tier: Tier) {
  const root = $('[data-planta]')
  if (!root) return
  const svg = $<HTMLElement>('svg', root)!, pz = $$<HTMLElement>('.pz', root)
  let modo: 'programa' | 'relacion' = 'programa'
  $$('[data-modo]', root).forEach((b) => b.addEventListener('click', () => {
    modo = b.dataset.modo as typeof modo
    $$('[data-modo]', root).forEach((x) => x.setAttribute('aria-selected', String(x === b)))
    $$('[data-ley]', root).forEach((l) => { l.hidden = l.dataset.ley !== modo })
    pz.forEach((p) => p.setAttribute('fill', modo === 'programa' ? p.dataset.cp! : p.dataset.cr!))
  }))
  $$('[data-ley] button', root).forEach((b) => {
    const on = () => { svg.classList.add('dim'); pz.forEach((p) => p.classList.toggle('hi', (modo === 'programa' ? p.dataset.p : p.dataset.r) === b.dataset.k)); b.classList.add('on') }
    const off = () => { svg.classList.remove('dim'); pz.forEach((p) => p.classList.remove('hi')); b.classList.remove('on') }
    b.addEventListener('mouseenter', on); b.addEventListener('mouseleave', off); b.addEventListener('focus', on); b.addEventListener('blur', off)
    b.addEventListener('click', () => (svg.classList.contains('dim') ? off() : on()))
  })
  if (tier === 'static') return
  // adición: each bar slides in from its own side, in order
  const from = pz.map((_, i) => (i % 3 === 0 ? { x: -160 } : i % 3 === 1 ? { y: -160 } : { x: 160 }))
  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 60%', end: 'center center', scrub: 0.8 } })
  pz.forEach((p, i) => tl.fromTo(p, { x: 0, y: 0, ...from[i], opacity: 0.08 }, { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, i * 0.35))
}

/* 04 · apartment picker with a counting area */
function aptos() {
  const root = $('[data-aptos]')
  if (!root) return
  const btns = $$('button', root), ims = $$('img', $('.aptos-plan', root)!), num = $('.aptos-num', root)!
  const o = { v: +btns[0].dataset.m2! }
  const show = (k: number) => {
    btns.forEach((b, j) => b.classList.toggle('on', j === k)); ims.forEach((im, j) => im.classList.toggle('on', j === k))
    gsap.to(o, { v: +btns[k].dataset.m2!, duration: 0.8, ease: 'power3.out', onUpdate: () => { num.textContent = String(Math.round(o.v)) } })
  }
  btns.forEach((b, k) => { b.addEventListener('click', () => show(k)); b.addEventListener('mouseenter', () => show(k)) })
}

/* 05 · hotspots on the site plan open a card next to the point */
function reco() {
  const root = $('[data-reco]')
  if (!root) return
  const data = JSON.parse($('.reco-data', root)!.textContent!) as { k: string; txt: string; src: string; alt: string }[]
  const card = $('.reco-card', root)!, map = $('.reco-map', root)!, pts = $$('.reco-pt', root)
  const close = () => { card.hidden = true; pts.forEach((p) => p.classList.remove('on')) }
  pts.forEach((p, i) => p.addEventListener('click', () => {
    const d = data[i]
    $<HTMLImageElement>('img', card)!.src = d.src; $<HTMLImageElement>('img', card)!.alt = d.alt
    $('.reco-k', card)!.textContent = d.k; $('.reco-t', card)!.textContent = d.txt
    pts.forEach((x) => x.classList.toggle('on', x === p))
    card.hidden = false
    if (!phone()) {
      const x = parseFloat(p.style.left), y = parseFloat(p.style.top)
      card.style.left = x > 55 ? '' : `calc(${x}% + 34px)`; card.style.right = x > 55 ? `calc(${100 - x}% + 34px)` : ''
      card.style.top = `clamp(0px, calc(${y}% - 140px), calc(100% - ${card.offsetHeight}px))`
    }
    gsap.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' })
  }))
  $('.reco-x', card)!.addEventListener('click', close)
  map.addEventListener('click', (e) => { if (e.target === map || (e.target as HTMLElement).tagName === 'IMG' && !card.contains(e.target as Node)) close() })
}

/* 07 · the walk-through video as frames: the scroll is the camera */
function camina(tier: Tier) {
  const root = $('[data-camina]'), c = $<HTMLCanvasElement>('canvas', root ?? document)
  if (!root || !c) return
  const ctx = c.getContext('2d')!
  const m = phone(), n = +(m ? root.dataset.nm! : root.dataset.n!), dir = `/seq/cultural/${m ? 'm' : 'd'}/`
  const frames = Array.from({ length: n }, (_, i) => { const im = new Image(); im.decoding = 'async'; im.dataset.src = `${dir}${String(i).padStart(3, '0')}.webp`; return im })
  const t = $('.camina-t span', root)!
  let cur = -1, want = 0
  const size = () => { const d = Math.min(2, devicePixelRatio); c.width = c.clientWidth * d; c.height = c.clientHeight * d; cur = -1; draw() }
  function draw() {
    // nearest loaded frame at or before the wanted one
    let k = want
    while (k > 0 && !(frames[k].complete && frames[k].naturalWidth)) k--
    const im = frames[k]
    if (k === cur || !im.naturalWidth) return
    cur = k
    const s = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight)
    ctx.drawImage(im, (c.width - im.naturalWidth * s) / 2, (c.height - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s)
  }
  let loading = false
  const load = () => {
    if (loading) return
    loading = true
    // first, a coarse pass (every 8th frame) so scrubbing works at once; then fill in
    const order = [...frames.keys()].sort((a, b) => (a % 8 === 0 ? 0 : 1) - (b % 8 === 0 ? 0 : 1) || a - b)
    order.reduce((p, i) => p.then(() => { frames[i].src = frames[i].dataset.src!; return frames[i].decode().catch(() => {}).then(() => { if (i === want || i === 0) { cur = -1; draw() } }) }), Promise.resolve())
  }
  new ResizeObserver(size).observe(c)
  ScrollTrigger.create({ trigger: root, start: 'top 250%', once: true, onEnter: load })
  if (tier === 'static') { want = 0; load(); return }
  ScrollTrigger.create({
    trigger: root, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (s) => {
      want = Math.min(n - 1, Math.round(s.progress * (n - 1)))
      root.style.setProperty('--p', String(s.progress))
      const sec = Math.round(s.progress * 37)
      t.textContent = `00:${String(sec).padStart(2, '0')}`
      draw()
    },
  })
}

/* 08 · layers switch on and off and combine (multiply over the paper) */
function capas() {
  const root = $('[data-capas]')
  if (!root) return
  const btns = $$('button', root), ims = $$('img', $('.capas-map', root)!)
  btns.forEach((b, i) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true'
    if (!on && btns.filter((x) => x.getAttribute('aria-pressed') === 'true').length === 1) return // keep one on
    b.setAttribute('aria-pressed', String(on)); ims[i].classList.toggle('on', on)
  }))
}

/* the drawing table: drag to pan (with inertia), zoom buttons, scatter ↔ sort by semester */
function mesa(tier: Tier) {
  const root = $('[data-mesa]')
  if (!root) return
  const view = $('.mesa-view', root)!, board = $('.mesa-board', root)!, hojas = $$<HTMLElement>('.hoja', root), labels = $$('.mesa-sem', root)
  const BW = 4200, BH = 2900, K = 0.34
  // deterministic scatter: semesters as loose clusters around the table
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const sems = [...new Set(hojas.map((h) => h.dataset.sem!))]
  const centers = sems.map((_, i) => ({ x: 500 + (i % 4) * 1000 + rnd() * 200, y: 520 + Math.floor(i / 4) * 1250 + rnd() * 200 }))
  const scatter = hojas.map((h) => { const c = centers[sems.indexOf(h.dataset.sem!)]; return { x: c.x + (rnd() - 0.5) * 700, y: c.y + (rnd() - 0.5) * 600, rotation: (rnd() - 0.5) * 16 } })
  // sorted: one row per semester
  const sorted: { x: number; y: number; rotation: number }[] = []
  const rowY: number[] = []
  let y = 120
  sems.forEach((sem) => {
    let x = 260; rowY.push(y)
    let rowH = 0
    hojas.forEach((h, i) => { if (h.dataset.sem !== sem) return; const w = +h.style.getPropertyValue('--w') * K, hh = +h.style.getPropertyValue('--h') * K; sorted[i] = { x, y, rotation: 0 }; x += w + 40; rowH = Math.max(rowH, hh) })
    y += rowH + 70
  })
  hojas.forEach((h, i) => gsap.set(h, { x: scatter[i].x - (+h.style.getPropertyValue('--w') * K) / 2, y: scatter[i].y - (+h.style.getPropertyValue('--h') * K) / 2, rotation: scatter[i].rotation }))
  labels.forEach((l, i) => gsap.set(l, { x: 40, y: rowY[i] }))

  // camera
  const cam = { x: 0, y: 0, z: phone() ? 0.42 : 0.62 }
  const clampCam = () => {
    const vw = view.clientWidth, vh = view.clientHeight
    cam.x = Math.min(80, Math.max(vw - BW * cam.z - 80, cam.x)); cam.y = Math.min(80, Math.max(vh - BH * cam.z - 80, cam.y))
  }
  const apply = (dur = 0) => { clampCam(); gsap.to(board, { x: cam.x, y: cam.y, scale: cam.z, duration: dur, ease: 'power3.out', overwrite: true }) }
  cam.x = (view.clientWidth - BW * cam.z) / 2; cam.y = (view.clientHeight - BH * cam.z) / 2; apply()

  let down = false, moved = 0, lx = 0, ly = 0, vx = 0, vy = 0
  view.addEventListener('pointerdown', (e) => { down = true; moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0; view.setPointerCapture(e.pointerId); view.classList.add('drag') })
  view.addEventListener('pointermove', (e) => {
    if (!down) return
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY
    moved += Math.abs(dx) + Math.abs(dy); vx = dx; vy = dy
    cam.x += dx; cam.y += dy; apply()
  })
  const up = () => {
    if (!down) return
    down = false; view.classList.remove('drag')
    if (tier !== 'static') { cam.x += vx * 12; cam.y += vy * 12; apply(0.9) }
    // a tiny movement counts as a click on a sheet
    root.dataset.drag = moved > 6 ? '1' : ''
  }
  view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up)
  $$('.mesa-z', root).forEach((b) => b.addEventListener('click', () => {
    const z0 = cam.z, z1 = Math.min(1.4, Math.max(0.25, z0 * (+b.dataset.z! > 0 ? 1.35 : 1 / 1.35)))
    const cx = view.clientWidth / 2, cy = view.clientHeight / 2
    cam.x = cx - ((cx - cam.x) * z1) / z0; cam.y = cy - ((cy - cam.y) * z1) / z0; cam.z = z1; apply(0.6)
  }))
  const orden = $('.mesa-orden', root)!
  orden.addEventListener('click', () => {
    const on = orden.getAttribute('aria-pressed') !== 'true'
    orden.setAttribute('aria-pressed', String(on)); orden.textContent = on ? 'Desordenar' : 'Ordenar por semestre'
    hojas.forEach((h, i) => {
      const p = on ? sorted[i] : { ...scatter[i], x: scatter[i].x - (+h.style.getPropertyValue('--w') * K) / 2, y: scatter[i].y - (+h.style.getPropertyValue('--h') * K) / 2 }
      gsap.to(h, { ...p, duration: tier === 'static' ? 0 : 1.2, ease: 'expo.inOut', delay: tier === 'static' ? 0 : i * 0.015 })
    })
    gsap.to(labels, { opacity: on ? 1 : 0, duration: 0.6, delay: on ? 0.8 : 0 })
    cam.z = phone() ? 0.42 : 0.55; cam.x = 40; cam.y = 20; apply(1.2)
  })
}

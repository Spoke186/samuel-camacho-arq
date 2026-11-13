import { ScrollTrigger } from '@pagx/motion'

// The six pieces made from his own material. Each works with a mouse, touch and keyboard;
// the scroll-driven ones fall back to their end state in the static tier.
type Tier = 'high' | 'medium' | 'static'
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)]

export function interact(tier: Tier) {
  partes()
  espiral(tier)
  luz(tier)
  lupa()
  encargo(tier)
  sombras(tier)
}

/* 01 · aula / pórtico / recinto: tabs that also cycle on their own until touched */
function partes() {
  const root = $('[data-partes]')
  if (!root) return
  const tabs = $$('[role=tab]', root), ims = $$('img', $('.partes-media', root)!), txt = $('.partes-txt', root)!
  let i = 0, auto: number | undefined
  const show = (k: number) => {
    i = k
    tabs.forEach((t, j) => t.setAttribute('aria-selected', String(j === k)))
    ims.forEach((im, j) => im.classList.toggle('on', j === k))
    txt.textContent = tabs[k].dataset.t!
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => { clearInterval(auto); show(k) }))
  new IntersectionObserver(([e]) => {
    clearInterval(auto)
    if (e.isIntersecting) auto = window.setInterval(() => show((i + 1) % tabs.length), 3800)
  }, { threshold: 0.5 }).observe(root)
}

/* 02 · the spiral plan is uncovered by a sweeping angle */
function espiral(tier: Tier) {
  const root = $('[data-espiral]'), plan = $('.espiral-plan', root ?? document), deg = $('.espiral-deg span', root ?? document)
  if (!root || !plan || !deg) return
  if (tier === 'static') { deg.textContent = '360'; return }
  ScrollTrigger.create({
    trigger: root, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (s) => { const a = s.progress * 360; plan.style.setProperty('--a', `${a}deg`); deg.textContent = String(Math.round(a)).padStart(3, '0') },
  })
}

/* 03 · drag the sun (or let the scroll move it) from morning to afternoon light */
function luz(tier: Tier) {
  const root = $('[data-luz]'), r = $<HTMLInputElement>('input', root ?? document)
  if (!root || !r) return
  const set = (t: number) => {
    root.style.setProperty('--t', String(t))
    const a = Math.PI * (1 - t) // left (morning) → right (afternoon)
    root.style.setProperty('--sx', `${50 + 46 * Math.cos(a)}%`)
    root.style.setProperty('--sy', `${96 - 88 * Math.sin(a)}%`)
  }
  let touched = false
  r.addEventListener('input', () => { touched = true; set(+r.value / 100) })
  set(0)
  if (tier !== 'static') ScrollTrigger.create({
    trigger: root, start: 'top 75%', end: 'bottom 35%', scrub: true,
    onUpdate: (s) => { if (!touched) { r.value = String(Math.round(s.progress * 100)); set(s.progress) } },
  })
}

/* 04 · a loupe over the delivery sheets, reading the 3000 px version */
function lupa() {
  if (!matchMedia('(pointer: fine)').matches) return
  const lens = document.createElement('div'); lens.className = 'lupa'; document.body.append(lens)
  const Z = 3.2
  $$<HTMLElement>('.fig-btn[data-hd]').forEach((b) => {
    const im = $('img', b)!
    b.addEventListener('pointerenter', () => { lens.style.backgroundImage = `url(${b.dataset.hd})`; lens.classList.add('on') })
    b.addEventListener('pointerleave', () => lens.classList.remove('on'))
    b.addEventListener('pointermove', (e) => {
      const r = im.getBoundingClientRect()
      // the thumbnail shows the sheet from the top (object-position: top), width-fitted
      const w = r.width * Z, h = (w * im.naturalHeight) / im.naturalWidth
      const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / (r.width * im.naturalHeight / im.naturalWidth)
      lens.style.left = `${e.clientX}px`; lens.style.top = `${e.clientY}px`
      lens.style.backgroundSize = `${w}px ${h}px`
      lens.style.backgroundPosition = `${130 - fx * w}px ${130 - fy * h}px`
    })
  })
}

/* 07 · the client's requests, answered one by one as you scroll (or hover) */
function encargo(tier: Tier) {
  const root = $('[data-encargo]')
  if (!root) return
  const btns = $$('button', root), ims = $$('img', $('.encargo-media', root)!)
  let cur = 0
  const show = (k: number) => {
    if (k === cur) return
    ims.forEach((im, j) => { im.classList.toggle('out', j === cur); im.classList.toggle('on', j === k) })
    btns.forEach((b, j) => b.classList.toggle('on', j === k))
    cur = k
  }
  btns.forEach((b, k) => { b.addEventListener('mouseenter', () => show(k)); b.addEventListener('click', () => show(k)); b.addEventListener('focus', () => show(k)) })
  if (tier !== 'static' && matchMedia('(min-width: 901px)').matches) ScrollTrigger.create({
    trigger: root, start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => show(Math.min(btns.length - 1, Math.floor(s.progress * btns.length))),
  })
}

/* 08 · a year of shadows: the scroll scrubs ten frames, crossfading between them */
function sombras(tier: Tier) {
  const root = $('[data-sombras]')
  if (!root) return
  const tabs = $$('[role=tab]', root), sets = $$('.sombras-set', root)
  const mes = $('.sombras-mes', root)!, fr = $('.sombras-fr', root)!, line = $('.sombras-line', root)!
  const ticks = $$('.sombras-tick', root)
  const labels = $$('img', sets[0]).map((im) => im.alt.split(', ').slice(1))
  let p = 0
  const draw = () => {
    const f = p * 9, k = Math.floor(f), t = f - k
    sets.forEach((set) => $$('img', set).forEach((im, j) => { im.style.opacity = j === k ? '1' : j === k + 1 ? String(t) : '0' }))
    const [m, h] = labels[Math.round(f)]
    mes.textContent = m; fr.textContent = h.charAt(0).toUpperCase() + h.slice(1)
    line.style.setProperty('--p', String(p))
    ticks.forEach((tk, j) => tk.style.color = j <= Math.round(f) ? 'var(--ink)' : '')
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => {
    tabs.forEach((x, j) => x.setAttribute('aria-selected', String(i === j)))
    sets.forEach((s, j) => s.classList.toggle('on', i === j))
  }))
  if (tier === 'static') { p = 0; draw(); return }
  ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => { p = s.progress; draw() } })
  draw()
  // preload the frames once the section is near
  ScrollTrigger.create({ trigger: root, start: 'top 200%', once: true, onEnter: () => $$('img', root).forEach((im) => { im.loading = 'eager' }) })
}

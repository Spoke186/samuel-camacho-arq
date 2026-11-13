import { createClock, gsap, ScrollTrigger } from '@pagx/motion'
import { SplitText } from 'gsap/SplitText'
import { hero } from './hero'
import { interact } from './interact'
import { interact2 } from './interact2'

gsap.registerPlugin(SplitText)

type Tier = 'high' | 'medium' | 'static'
type Lenis = ReturnType<typeof createClock>['lenis']
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)]
const phone = () => matchMedia('(max-width: 760px)').matches

export function init() {
  const tier = (document.documentElement.dataset.tier || 'high') as Tier
  const clock = tier === 'static' ? null : createClock({ smooth: tier === 'high', lerp: 0.09 })
  const lenis = clock?.lenis ?? null

  tema()
  anchors(lenis)
  lightbox(lenis)
  compare()
  videos(tier)
  preview()
  if (tier !== 'static') {
    intro()
    if (tier === 'high') track() // pins first, so later triggers measure the spacer
    interact(tier)
    openers()
    reveals(tier)
    ink()
    if (tier === 'high' && matchMedia('(pointer: fine)').matches) cursor()
  }
  if (tier === 'static') interact(tier)
  interact2(tier)
  piso()
  tone()
  vistas(tier)
  construida(tier)
}

// a once-ScrollTrigger owned by a tween crashes GSAP 3.15 on a mid-page reload; a paused anim + onEnter does not
function onView(trigger: Element, start: string, anim: gsap.core.Animation) {
  anim.pause()
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => { anim.play() } })
}

/* ---------- hero ---------- */
function intro() {
  const root = $('.hero')
  if (!root) return
  const name = SplitText.create('.hero-name', { type: 'chars' })
  gsap.set(name.chars, { yPercent: 70, opacity: 0 })
  gsap.set('.hero-name', { opacity: 1 })
  const h = hero(root, phone(), () => {
    gsap.timeline()
      .to(name.chars, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
      .to(['.hero-sub', '.hero-down', '.hero-tag'], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }, 0.4)
  })
  // the scroll owns the build: render → louvres → real tower at dusk → night
  const tag = $('.hero-tag-k')!, hora = $('.hero-tag-h')!
  let real = false
  gsap.to(h.st, {
    p: 1, ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    onUpdate: () => {
      h.draw()
      if (h.real() !== real) { real = h.real(); tag.textContent = real ? 'Visualización realista' : 'Su render' }
      hora.textContent = real ? h.hora() : ''
    },
  })
  gsap.fromTo('.hero-down', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: root, start: 'top top', end: '8% top', scrub: true } })
}

/* ---------- each semester opens like a slit widening into a full frame ---------- */
function openers() {
  $$('.op').forEach((op) => {
    const media = $('.op-media', op), inner = $$('.op-media > img, .op-media > video', op)
    gsap.fromTo(media, { clipPath: 'inset(22% 18% 22% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: op, start: 'top bottom', end: 'top 15%', scrub: true } })
    if (inner.length) gsap.fromTo(inner, { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: op, start: 'top bottom', end: 'bottom top', scrub: true } })
    const n = $('.op-n', op), t = $$('.op-t, .op-meta', op)
    onView(op, 'top 45%', gsap.timeline()
      .from(n, { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out' })
      .from(t, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, 0.15))
  })
}

/* ---------- images close like a floor; photos drift inside their frame ---------- */
function reveals(tier: Tier) {
  ScrollTrigger.batch('.rise', {
    start: 'top 90%', once: true,
    onEnter: (els) => {
      gsap.to(els.map((e) => $('.fig-btn', e)), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', stagger: 0.12 })
      gsap.from(els.map((e) => $('figcaption', e)).filter(Boolean), { opacity: 0, y: 12, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.35 })
    },
  })
  if (tier !== 'high') return
  $$('.fig:not(.contain) .fig-btn > img').forEach((im) => {
    gsap.fromTo(im, { yPercent: -2.5, scale: 1.05 }, { yPercent: 2.5, scale: 1.05, ease: 'none', scrollTrigger: { trigger: im.closest('.fig'), start: 'top bottom', end: 'bottom top', scrub: true } })
  })
}

/* intro sentence inks in word by word with the scroll */
function ink() {
  $$('[data-ink]').forEach((el) => {
    const s = SplitText.create(el, { type: 'words' })
    gsap.fromTo(s.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } })
  })
  $$('.cuenta [data-to]').forEach((el) => {
    const o = { v: 0 }, to = +el.dataset.to!
    onView(el, 'top 85%', gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(2, '0') } }))
  })
}

/* 03: vertical scroll drives the exercises sideways */
function track() {
  const wrap = $('.track-wrap'), t = $('.track')
  if (!wrap || !t) return
  const dist = () => Math.max(0, t.scrollWidth - wrap.clientWidth)
  gsap.to(t, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: wrap, start: 'center center', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } })
}

/* index: the big preview follows the hovered row */
function preview() {
  const box = $('.indice-prev')
  if (!box) return
  const ims = $$('img', box)
  $$('.indice-row').forEach((row, i) => row.addEventListener('mouseenter', () => ims.forEach((im, j) => im.classList.toggle('on', i === j))))
}

/* custom cursor: a ring that becomes "Ver" over images */
function cursor() {
  const el = document.createElement('div'); el.className = 'cur'; el.innerHTML = '<span>Ver</span>'
  document.body.append(el)
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
  addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); el.classList.add('show') }, { passive: true })
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement
    el.classList.toggle('big', !!t.closest('.fig-btn'))
    el.classList.toggle('link', !t.closest('.fig-btn') && !!t.closest('a, button, input'))
  })
  document.addEventListener('pointerleave', () => el.classList.remove('show'))
}

/* elevator readout follows the semester on screen */
function piso() {
  const box = $('.piso'), n = $('.piso-n')
  if (!box || !n) return
  $$('.sem').forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: 'top 55%', end: 'bottom 55%',
    onToggle: (self) => { if (self.isActive) { n.textContent = sec.dataset.n!; gsap.fromTo(n, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }) } },
  }))
  ScrollTrigger.create({ trigger: '#s1', endTrigger: '#s8', start: 'top 55%', end: 'bottom 55%', onToggle: (s) => box.classList.toggle('on', s.isActive) })
}

function videos(tier: Tier) {
  $$<HTMLVideoElement>('video[data-d]').forEach((vid) => {
    let set = false
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!set) { vid.src = (phone() ? vid.dataset.m : vid.dataset.d)!; set = true }
        if (tier !== 'static') vid.play().catch(() => {})
      } else vid.pause()
    }, { rootMargin: '300px' }).observe(vid)
  })
}

function compare() {
  const ba = $('.ba'), r = $<HTMLInputElement>('.ba-r')
  if (!ba || !r) return
  const set = () => ba.style.setProperty('--x', `${r.value}%`)
  r.addEventListener('input', set); set()
}

function lightbox(lenis: Lenis) {
  const dlg = $<HTMLDialogElement>('.lb'), im = $<HTMLImageElement>('.lb-img'), cap = $('.lb-cap')
  if (!dlg || !im || !cap) return
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.fig-btn, .hoja')
    if (!b || (b.classList.contains('hoja') && b.closest<HTMLElement>('[data-mesa]')?.dataset.drag)) return
    im.src = b.dataset.full!; im.alt = b.dataset.cap!; cap.textContent = b.dataset.cap!
    dlg.showModal(); lenis?.stop()
    gsap.fromTo(im, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' })
  })
  dlg.addEventListener('click', (e) => { if (e.target === dlg || (e.target as HTMLElement).closest('.lb-x')) dlg.close() })
  dlg.addEventListener('close', () => lenis?.start())
}

function anchors(lenis: Lenis) {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const t = $(a.getAttribute('href')!)
    if (!t) return
    e.preventDefault()
    lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' })
  }))
}

/* the header reads ink on stone and turns light while a photograph sits under it */
function tone() {
  const html = document.documentElement
  const dark = $$('.hero-pin, .op:not(.op-marco), .camina')
  const set = () => html.classList.toggle('tone-dark', dark.some((el) => { const r = el.getBoundingClientRect(); return r.top <= 40 && r.bottom >= 40 }))
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: set })
  set()
}

/* su render / realista: his render first; the real one turns in through louvres when the frame comes into view,
   and the visitor can switch back. The lightbox opens whichever is on screen. */
function vistas(tier: Tier) {
  $$('[data-vista]').forEach((root) => {
    const layer = $('.op-real, .fig-real', root)!, btns = $$<HTMLButtonElement>('.vista button', root), fig = $<HTMLElement>('.fig-btn', root)
    const src = { 0: fig?.dataset.full, 1: (layer as HTMLImageElement).src || (layer as HTMLVideoElement).poster }
    let touched = false
    const show = (v: 0 | 1, animate = tier !== 'static') => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.v! === v)))
      if (fig) { fig.dataset.full = src[v]!; fig.dataset.cap = (v ? 'Visualización realista hecha desde su render · ' : '') + fig.getAttribute('aria-label')!.replace('Ampliar: ', '') }
      gsap.to(layer, { '--k': v, duration: animate ? 1.1 : 0, ease: 'power3.inOut' })
    }
    btns.forEach((b) => b.addEventListener('click', () => { touched = true; show(+b.dataset.v! as 0 | 1) }))
    if (tier !== 'static') onView(root, 'top 45%', gsap.delayedCall(0.6, () => { if (!touched) show(1) }))
  })
}

/* día / noche (#103): the head script already set data-theme; the button flips it and remembers the choice */
function tema() {
  const html = document.documentElement, b = $<HTMLButtonElement>('.tema'), meta = $<HTMLMetaElement>('meta[name="theme-color"]')
  if (!b) return
  const sync = () => {
    const dark = html.dataset.theme === 'dark'
    b.setAttribute('aria-pressed', String(dark))
    b.setAttribute('aria-label', dark ? 'Modo claro' : 'Modo oscuro')
    $('span', b)!.textContent = dark ? 'Día' : 'Noche'
    if (meta) meta.content = dark ? '#141816' : '#cdc8bd'
  }
  b.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('tema', html.dataset.theme) } catch {}
    sync()
    dispatchEvent(new Event('tema'))
  })
  sync()
}

/* 00 construida: the lot, his render, the building. Each step turns in through louvres over the last;
   on first view it plays through once, unless the visitor picks a step first. */
function construida(tier: Tier) {
  const root = $('[data-cons]')
  if (!root) return
  const ims = $$('.cons-img', root), btns = $$<HTMLButtonElement>('.cons-pasos button', root), tag = $('.cons-tag', root)!
  let cur = 0, z = 1, touched = false
  const show = (i: number) => {
    if (i === cur) return
    cur = i
    btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)))
    tag.textContent = $('.cons-k', btns[i])!.textContent
    const im = ims[i]
    gsap.killTweensOf(im)
    im.style.zIndex = String(++z)
    gsap.fromTo(im, { '--k': 0 }, { '--k': 1, duration: tier === 'static' ? 0 : 1.3, ease: 'power3.inOut' })
  }
  btns.forEach((b, i) => b.addEventListener('click', () => { touched = true; show(i) }))
  if (tier === 'static') return
  onView(root, 'top 40%', gsap.timeline()
    .call(() => { if (!touched) show(1) }, [], 0.7)
    .call(() => { if (!touched) show(2) }, [], 3.2))
}

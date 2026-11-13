import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export type Clock = {
  lenis: Lenis | null
  /** Register a per-frame callback on the master clock (time in ms). Returns an unsubscribe. */
  add: (fn: (timeMs: number, deltaMs: number) => void) => () => void
  destroy: () => void
}

let current: Clock | null = null

/**
 * The single master clock (CLAUDE.md rule 3).
 * gsap.ticker drives Lenis (autoRaf: false); ScrollTrigger updates on Lenis scroll;
 * R3F registers `advance` through `add` so the canvas never runs its own rAF loop.
 */
export function createClock({ smooth = true, lerp = 0.1 }: { smooth?: boolean; lerp?: number } = {}): Clock {
  if (current) return current
  gsap.ticker.lagSmoothing(0)

  const lenis = smooth ? new Lenis({ autoRaf: false, lerp }) : null
  if (lenis) lenis.on('scroll', ScrollTrigger.update)

  const subs = new Set<(t: number, d: number) => void>()
  const tick = (time: number, deltaTime: number) => {
    lenis?.raf(time * 1000)
    subs.forEach((fn) => fn(time * 1000, deltaTime))
  }
  gsap.ticker.add(tick)

  current = {
    lenis,
    add(fn) {
      subs.add(fn)
      return () => subs.delete(fn)
    },
    destroy() {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      subs.clear()
      current = null
    },
  }
  return current
}

export function getClock() {
  return current
}

export { gsap, ScrollTrigger }

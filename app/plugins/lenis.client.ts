import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.1,
    // Exponential easing — fast start, slow settle. Feels physical.
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  // Drive Lenis from GSAP's ticker so both share the same frame loop.
  // lagSmoothing(0) prevents GSAP from skipping frames on tab switch,
  // which would cause Lenis and ScrollTrigger to desync.
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Keep ScrollTrigger in sync with Lenis scroll position
  lenis.on('scroll', ScrollTrigger.update)

  // Expose lenis so composables can call stop/start (e.g., when modals open)
  return {
    provide: { lenis },
  }
})

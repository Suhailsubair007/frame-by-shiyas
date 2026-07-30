import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'

export default defineNuxtPlugin(() => {
  // Register all plugins once, globally, before any component mounts.
  // ScrollTrigger must be registered here — never inside individual components.
  // CSSPlugin is normally auto-registered, but Nuxt's SSR/Vite bundle can drop it
  // from the core instance components import — registering it explicitly guarantees
  // transform/opacity tweens work instead of failing with "Missing plugin?".
  gsap.registerPlugin(CSSPlugin, ScrollTrigger, Flip, Observer)

  gsap.defaults({
    ease: 'power3.out',
    duration: 0.6,
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})

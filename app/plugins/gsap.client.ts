import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'

export default defineNuxtPlugin(() => {
  // Register all plugins once, globally, before any component mounts.
  // ScrollTrigger must be registered here — never inside individual components.
  gsap.registerPlugin(ScrollTrigger, Flip, Observer)

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

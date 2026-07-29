import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION } from '@shared/constants/ANIMATION'

// Direction the reveal wipe travels
type REVEAL_DIRECTION = 'up' | 'down' | 'left' | 'right'

interface REVEAL_OPTIONS {
  direction?:    REVEAL_DIRECTION
  duration?:     number
  ease?:         string
  delay?:        number
  stagger?:      number
  triggerStart?: string
  once?:         boolean
  scrub?:        boolean | number
}

interface PARALLAX_OPTIONS {
  strength?: number   // 0–1 — how much the element moves relative to scroll
  direction?: 'vertical' | 'horizontal'
  triggerStart?: string
  triggerEnd?: string
  scrub?: number
}

export function useReveal() {
  const prefersReducedMotion = useReducedMotion()
  const instances: ScrollTrigger[] = []

  // Clip-path wipe reveal — the cinematic image reveal used throughout the site.
  // A clip-path inset animates from 100% to 0% revealing the element from one edge.
  function clipReveal(
    target: Ref<HTMLElement | null> | HTMLElement | HTMLElement[],
    options: REVEAL_OPTIONS = {},
  ): void {
    const {
      direction    = 'up',
      duration     = ANIMATION.DURATION.CINEMATIC,
      ease         = ANIMATION.EASE.CINEMA,
      delay        = 0,
      stagger      = ANIMATION.STAGGER.LOOSE,
      triggerStart = ANIMATION.SCROLL.START,
      once         = true,
    } = options

    const elements = Array.isArray(target)
      ? target
      : [target instanceof HTMLElement ? target : target.value]

    elements.forEach(el => {
      if (!el) return

      if (prefersReducedMotion.value) {
        gsap.set(el, { clipPath: 'inset(0 0 0% 0)' })
        return
      }

      const fromClip = {
        up:    'inset(0 0 100% 0)',
        down:  'inset(100% 0 0 0)',
        left:  'inset(0 100% 0 0)',
        right: 'inset(0 0 0 100%)',
      }[direction]

      gsap.fromTo(
        el,
        { clipPath: fromClip },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration,
          ease,
          delay,
          scrollTrigger: {
            trigger: el,
            start:   triggerStart,
            once,
          },
        },
      )
    })
  }

  // Fade + translate reveal — for UI elements (labels, buttons, nav items)
  function fadeUp(
    target: Ref<HTMLElement | null> | HTMLElement | (HTMLElement | null)[],
    options: REVEAL_OPTIONS = {},
  ): void {
    const {
      duration     = ANIMATION.DURATION.DEFAULT,
      ease         = ANIMATION.EASE.EXPO_OUT,
      delay        = 0,
      stagger      = ANIMATION.STAGGER.DEFAULT,
      triggerStart = ANIMATION.SCROLL.START,
      once         = true,
    } = options

    const elements = Array.isArray(target)
      ? target.filter(Boolean)
      : [target instanceof HTMLElement ? target : target.value]

    const valid = elements.filter(Boolean) as HTMLElement[]
    if (!valid.length) return

    if (prefersReducedMotion.value) {
      gsap.set(valid, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      valid,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        delay,
        stagger,
        scrollTrigger: {
          trigger: valid[0],
          start:   triggerStart,
          once,
        },
      },
    )
  }

  // Scale reveal — subtle zoom-in for featured images
  function scaleReveal(
    target: Ref<HTMLElement | null> | HTMLElement,
    options: REVEAL_OPTIONS = {},
  ): void {
    const {
      duration     = ANIMATION.DURATION.CINEMATIC,
      ease         = ANIMATION.EASE.EXPO_OUT,
      delay        = 0,
      triggerStart = ANIMATION.SCROLL.START,
      once         = true,
    } = options

    const el = target instanceof HTMLElement ? target : target.value
    if (!el || prefersReducedMotion.value) return

    gsap.fromTo(
      el,
      { scale: 1.12, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        scrollTrigger: { trigger: el, start: triggerStart, once },
      },
    )
  }

  // Parallax — scroll-driven Y translation for depth layering
  function parallax(
    target: Ref<HTMLElement | null> | HTMLElement,
    options: PARALLAX_OPTIONS = {},
  ): void {
    const {
      strength     = 0.15,
      direction    = 'vertical',
      triggerStart = 'top bottom',
      triggerEnd   = 'bottom top',
      scrub        = 1,
    } = options

    const el = target instanceof HTMLElement ? target : target.value
    if (!el || prefersReducedMotion.value) return

    const distance = el.offsetHeight * strength

    const st = ScrollTrigger.create({
      trigger:   el,
      start:     triggerStart,
      end:       triggerEnd,
      scrub,
      animation: direction === 'vertical'
        ? gsap.fromTo(el, { y: -distance }, { y: distance, ease: 'none' })
        : gsap.fromTo(el, { x: -distance }, { x: distance, ease: 'none' }),
    })

    instances.push(st)
  }

  function killAll(): void {
    instances.forEach(st => st.kill())
    instances.length = 0
  }

  onUnmounted(killAll)

  return { clipReveal, fadeUp, scaleReveal, parallax, killAll } as const
}

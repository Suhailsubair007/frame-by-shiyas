import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION } from '@shared/constants/ANIMATION'

interface SCROLL_TRIGGER_OPTIONS {
  trigger?:    Ref<HTMLElement | null> | HTMLElement
  start?:      string
  end?:        string
  scrub?:      boolean | number
  pin?:        boolean
  markers?:    boolean
  onEnter?:    () => void
  onLeave?:    () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

export function useScrollTrigger() {
  const prefersReducedMotion = useReducedMotion()
  const instances: ScrollTrigger[] = []

  function create(options: SCROLL_TRIGGER_OPTIONS): ScrollTrigger | null {
    if (prefersReducedMotion.value) return null

    const triggerEl = options.trigger instanceof HTMLElement
      ? options.trigger
      : options.trigger?.value ?? null

    if (!triggerEl) return null

    const st = ScrollTrigger.create({
      trigger:      triggerEl,
      start:        options.start    ?? ANIMATION.SCROLL.START,
      end:          options.end      ?? ANIMATION.SCROLL.END,
      scrub:        options.scrub    ?? false,
      pin:          options.pin      ?? false,
      markers:      options.markers  ?? false,
      onEnter:      options.onEnter,
      onLeave:      options.onLeave,
      onEnterBack:  options.onEnterBack,
      onLeaveBack:  options.onLeaveBack,
    })

    instances.push(st)
    return st
  }

  // Pin a section for scroll-driven storytelling
  function pin(
    trigger: Ref<HTMLElement | null>,
    options?: Pick<SCROLL_TRIGGER_OPTIONS, 'start' | 'end' | 'markers'>,
  ): ScrollTrigger | null {
    if (prefersReducedMotion.value || !trigger.value) return null

    return create({
      trigger,
      start:   options?.start   ?? ANIMATION.SCROLL.START_CENTER,
      end:     options?.end     ?? '+=100%',
      pin:     true,
      scrub:   true,
      markers: options?.markers ?? false,
    })
  }

  // Scrub a GSAP timeline to scroll position
  function scrub(
    trigger: Ref<HTMLElement | null>,
    tl: gsap.core.Timeline,
    options?: Pick<SCROLL_TRIGGER_OPTIONS, 'start' | 'end' | 'scrub' | 'markers'>,
  ): ScrollTrigger | null {
    if (prefersReducedMotion.value || !trigger.value) return null

    const st = ScrollTrigger.create({
      trigger:  trigger.value,
      start:    options?.start   ?? ANIMATION.SCROLL.START_CENTER,
      end:      options?.end     ?? '+=100%',
      scrub:    options?.scrub   ?? ANIMATION.SCROLL.SCRUB,
      markers:  options?.markers ?? false,
      animation: tl,
    })

    instances.push(st)
    return st
  }

  // Kill all ScrollTrigger instances created by this composable call
  function killAll(): void {
    instances.forEach(st => st.kill())
    instances.length = 0
  }

  onUnmounted(killAll)

  return { create, pin, scrub, killAll, ScrollTrigger } as const
}

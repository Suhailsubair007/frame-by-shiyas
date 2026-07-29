import SplitType from 'split-type'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION } from '@shared/constants/ANIMATION'

type SPLIT_MODE = 'chars' | 'words' | 'lines' | 'words,chars'

interface SPLIT_REVEAL_OPTIONS {
  mode?:       SPLIT_MODE
  duration?:   number
  stagger?:    number
  delay?:      number
  ease?:       string
  y?:          number
  scrollTrigger?: boolean
  triggerStart?: string
}

export function useSplitText() {
  const prefersReducedMotion = useReducedMotion()
  const splits: SplitType[]  = []
  const triggers: ScrollTrigger[] = []

  // Reveal text by animating chars/words/lines up from below with clip masking.
  // Each unit is wrapped in a div.overflow-hidden so the translate
  // creates a "wipe up" effect without needing clip-path.
  function reveal(
    target: Ref<HTMLElement | null> | HTMLElement,
    options: SPLIT_REVEAL_OPTIONS = {},
  ): void {
    const {
      mode        = 'words',
      duration    = ANIMATION.DURATION.CINEMATIC,
      stagger     = ANIMATION.STAGGER.DEFAULT,
      delay       = ANIMATION.DELAY.DEFAULT,
      ease        = ANIMATION.EASE.EXPO_OUT,
      y           = 110,
      scrollTrigger = true,
      triggerStart  = ANIMATION.SCROLL.START,
    } = options

    const el = target instanceof HTMLElement ? target : target.value
    if (!el) return

    if (prefersReducedMotion.value) {
      // Skip animation but ensure text is visible
      gsap.set(el, { opacity: 1 })
      return
    }

    const split = new SplitType(el, { types: mode })
    splits.push(split)

    const units =
      mode.includes('chars') ? split.chars
      : mode.includes('words') ? split.words
      : split.lines

    if (!units?.length) return

    // Each unit's parent gets overflow:hidden so the translateY creates a reveal wipe
    units.forEach(unit => {
      if (unit.parentElement) {
        unit.parentElement.style.overflow = 'hidden'
        unit.parentElement.style.display  = 'block'
      }
    })

    const animVars: gsap.TweenVars = {
      y:        0,
      opacity:  1,
      duration,
      stagger,
      delay,
      ease,
    }

    if (scrollTrigger) {
      gsap.fromTo(
        units,
        { y, opacity: 0 },
        {
          ...animVars,
          scrollTrigger: {
            trigger:  el,
            start:    triggerStart,
            once:     true,
          },
        },
      )
    } else {
      gsap.fromTo(units, { y, opacity: 0 }, animVars)
    }
  }

  // Staggered character scramble — letters animate in one by one
  function scramble(
    target: Ref<HTMLElement | null> | HTMLElement,
    options: Pick<SPLIT_REVEAL_OPTIONS, 'duration' | 'stagger' | 'delay' | 'ease'> = {},
  ): void {
    const el = target instanceof HTMLElement ? target : target.value
    if (!el || prefersReducedMotion.value) return

    const {
      duration = ANIMATION.DURATION.DEFAULT,
      stagger  = ANIMATION.STAGGER.TIGHT,
      delay    = 0,
      ease     = ANIMATION.EASE.EXPO_OUT,
    } = options

    const split = new SplitType(el, { types: 'chars' })
    splits.push(split)

    if (!split.chars?.length) return

    gsap.fromTo(
      split.chars,
      { opacity: 0, rotateY: 90, transformOrigin: 'left center' },
      { opacity: 1, rotateY: 0, duration, stagger, delay, ease },
    )
  }

  // Revert all splits — call before component unmounts to restore original DOM
  function revert(): void {
    splits.forEach(s => s.revert())
    splits.length = 0
    triggers.forEach(t => t.kill())
    triggers.length = 0
  }

  onUnmounted(revert)

  return { reveal, scramble, revert } as const
}

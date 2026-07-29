import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

// Central GSAP composable.
// All components import gsap through here so reduced-motion is always
// enforced in one place rather than checked individually everywhere.
export function useGsap() {
  const prefersReducedMotion = useReducedMotion()

  // Wraps gsap.to — skips animation silently when reduced motion is preferred
  function to(
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
  ): gsap.core.Tween {
    if (prefersReducedMotion.value) {
      return gsap.set(target, { ...vars, duration: 0, delay: 0 }) as unknown as gsap.core.Tween
    }
    return gsap.to(target, vars)
  }

  function from(
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
  ): gsap.core.Tween {
    if (prefersReducedMotion.value) {
      return gsap.set(target, { clearProps: 'all' }) as unknown as gsap.core.Tween
    }
    return gsap.from(target, vars)
  }

  function fromTo(
    target: gsap.TweenTarget,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
  ): gsap.core.Tween {
    if (prefersReducedMotion.value) {
      return gsap.set(target, toVars) as unknown as gsap.core.Tween
    }
    return gsap.fromTo(target, fromVars, toVars)
  }

  function timeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    return gsap.timeline(vars)
  }

  function set(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    return gsap.set(target, vars) as unknown as gsap.core.Tween
  }

  function killAll(targets: gsap.TweenTarget[]): void {
    targets.forEach(t => gsap.killTweensOf(t))
  }

  return { gsap, ScrollTrigger, to, from, fromTo, timeline, set, killAll, prefersReducedMotion } as const
}

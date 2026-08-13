import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Reveal animations (useReveal) start elements at opacity:0 and fade them in when
// their ScrollTrigger is reached. Triggers cache their scroll positions when they
// are created on mount — but the page keeps shifting afterwards: web fonts change
// text metrics, the Films section's pin changes document height, and lazy
// <img>/<video> below the fold load as the user scrolls and push everything under
// them down. ScrollTrigger only auto-refreshes on resize and window `load`, so
// those later shifts leave triggers at stale offsets and a section can stay stuck
// invisible — the intermittent "blank section until refresh" bug. Recompute at
// each of those moments so trigger positions always track the real layout.
export default defineNuxtPlugin(() => {
  const refresh = (): void => ScrollTrigger.refresh()

  // Coalesce bursts (e.g. several images finishing in one frame) into one refresh
  // on the next frame, once layout has settled.
  let rafId = 0
  const scheduleRefresh = (): void => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => requestAnimationFrame(refresh))
  }

  // Fonts swap in after the first paint, changing every heading/paragraph height.
  document.fonts?.ready.then(scheduleRefresh).catch(() => {})

  // Eager, above-the-fold resources are all settled by `load`.
  if (document.readyState === 'complete') scheduleRefresh()
  else window.addEventListener('load', scheduleRefresh, { once: true })

  // Lazy media below the fold loads during scroll. Its load events don't bubble,
  // so listen in the capture phase at the document root.
  document.addEventListener(
    'load',
    (event) => {
      const el = event.target as HTMLElement | null
      if (el && (el.tagName === 'IMG' || el.tagName === 'VIDEO')) scheduleRefresh()
    },
    true,
  )
})

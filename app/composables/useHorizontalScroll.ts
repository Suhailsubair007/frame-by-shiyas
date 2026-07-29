import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useMediaQuery } from '@/composables/useMediaQuery'

interface HORIZONTAL_SCROLL_OPTIONS {
  speed?:    number   // multiplier — 1 is default, higher is faster
  markers?:  boolean
}

// Horizontal scroll section pinned to the viewport.
// The track element scrolls left as the user scrolls down.
// On mobile, falls back to normal vertical scrolling — a deliberate decision
// made at architecture stage (horizontal + touch = poor UX).
export function useHorizontalScroll(
  pinRef:   Ref<HTMLElement | null>,   // outer pinned wrapper
  trackRef: Ref<HTMLElement | null>,   // inner scrolling strip
  options:  HORIZONTAL_SCROLL_OPTIONS = {},
) {
  const { speed = 1, markers = false } = options
  const prefersReducedMotion = useReducedMotion()
  const { isMobile }         = useMediaQuery()

  let scrollTrigger: ScrollTrigger | null = null

  function init(): void {
    const pin   = pinRef.value
    const track = trackRef.value

    if (!pin || !track || isMobile.value || prefersReducedMotion.value) return

    // Total horizontal distance the track needs to travel
    const totalWidth = track.scrollWidth - track.offsetWidth

    scrollTrigger = ScrollTrigger.create({
      trigger:   pin,
      start:     'top top',
      // End point scales with content width so faster content = more scroll room
      end:       () => `+=${totalWidth * speed}`,
      pin:       true,
      scrub:     1.2,
      markers,
      invalidateOnRefresh: true,  // recalculate on window resize
      animation: gsap.to(track, {
        x:    -totalWidth,
        ease: 'none',
      }),
    })
  }

  function destroy(): void {
    scrollTrigger?.kill()
    scrollTrigger = null
  }

  onMounted(() => {
    nextTick(init)
  })

  onUnmounted(destroy)

  // Re-init if viewport or content changes
  watch([isMobile, prefersReducedMotion], () => {
    destroy()
    nextTick(init)
  })

  return { destroy } as const
}

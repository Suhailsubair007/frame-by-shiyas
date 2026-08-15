import { useCursorState }   from '@/composables/useCursorState'
import { useMediaQuery }     from '@/composables/useMediaQuery'
import { useReducedMotion }  from '@/composables/useReducedMotion'

interface CURSOR_FOCUS_OPTIONS {
  // Fraction of the trigger element that must be visible before the cursor parks.
  readonly threshold?: number
  // Fired when the section engages/releases — lets the caller start/stop the clip.
  readonly onEngage?: () => void
  readonly onRelease?: () => void
}

// Ratio below which the section counts as gone and the cursor is released.
const RELEASE_RATIO = 0.05

// When `triggerRef` scrolls into view, park the custom cursor on the section's
// first/active video (returned by `getFocusTarget`) so the playing clip is obvious
// even when the pointer is elsewhere. TheCursor then tracks that element's live
// centre until the user moves the mouse (which reclaims control) or the section
// scrolls back out. Desktop-only: the custom cursor doesn't exist on touch or
// under reduced-motion, so it no-ops there.
export function useCursorFocusInView(
  triggerRef: Ref<HTMLElement | null>,
  getFocusTarget: () => HTMLElement | null,
  options: CURSOR_FOCUS_OPTIONS = {},
): void {
  const { threshold = 0.6, onEngage, onRelease } = options
  const { focusOn, clearFocus } = useCursorState()
  const { hasPointer }          = useMediaQuery()
  const prefersReducedMotion    = useReducedMotion()

  let observer: IntersectionObserver | null = null

  // Hysteresis so the cursor is parked once on entry, not again on the way out.
  let isEngaged = false

  onMounted(() => {
    const trigger = triggerRef.value
    if (!trigger) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.intersectionRatio < RELEASE_RATIO) {
          if (!isEngaged) return
          isEngaged = false
          clearFocus()
          onRelease?.()
          return
        }

        if (entry.intersectionRatio < threshold || isEngaged) return
        if (!hasPointer.value || prefersReducedMotion.value) return

        isEngaged = true
        focusOn(getFocusTarget())
        onEngage?.()
      },
      { threshold: [0, RELEASE_RATIO, threshold, 1] },
    )
    observer.observe(trigger)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}

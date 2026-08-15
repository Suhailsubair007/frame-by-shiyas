import { CURSOR_STATE } from '@shared/enums/CursorState'

// Module-level singleton — one reactive state shared across every component
// that calls this composable. No store needed.
const _state = ref<CURSOR_STATE>(CURSOR_STATE.DEFAULT)
const _isVisible = ref(false)

// An element the cursor is programmatically parked on (e.g. a video that just
// scrolled into view), independent of the real pointer. TheCursor tracks this
// element's live centre every frame so it stays glued on top even while the page
// is still settling. Cleared the instant the user moves the mouse. shallowRef so
// the DOM node is stored by identity, not wrapped in a reactive proxy.
const _focusTarget = shallowRef<HTMLElement | null>(null)

export function useCursorState() {
  function setState(next: CURSOR_STATE): void {
    _state.value = next
  }

  function reset(): void {
    _state.value = CURSOR_STATE.DEFAULT
  }

  function show(): void {
    _isVisible.value = true
  }

  function hide(): void {
    _isVisible.value = false
  }

  // Park the cursor on an element and flag it "playing" so the ring morphs to the
  // Play state over the target video.
  function focusOn(el: HTMLElement | null): void {
    if (!el) return
    _focusTarget.value = el
    _state.value = CURSOR_STATE.PLAY
  }

  function clearFocus(): void {
    if (_focusTarget.value === null) return
    _focusTarget.value = null
    _state.value = CURSOR_STATE.DEFAULT
  }

  return {
    state:       readonly(_state),
    isVisible:   readonly(_isVisible),
    focusTarget: _focusTarget,
    setState,
    reset,
    show,
    hide,
    focusOn,
    clearFocus,
  } as const
}

import { CURSOR_STATE } from '@shared/enums/CursorState'

// Module-level singleton — one reactive state shared across every component
// that calls this composable. No store needed.
const _state = ref<CURSOR_STATE>(CURSOR_STATE.DEFAULT)
const _isVisible = ref(false)

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

  return {
    state:     readonly(_state),
    isVisible: readonly(_isVisible),
    setState,
    reset,
    show,
    hide,
  } as const
}

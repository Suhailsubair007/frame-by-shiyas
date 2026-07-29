// Pure state — side effects (lenis stop/start) handled in the component
// that consumes this composable, not here.
const _isOpen = ref(false)

export function useMenuState() {
  function open():   void { _isOpen.value = true }
  function close():  void { _isOpen.value = false }
  function toggle(): void { _isOpen.value = !_isOpen.value }

  return {
    isOpen: readonly(_isOpen),
    open,
    close,
    toggle,
  } as const
}

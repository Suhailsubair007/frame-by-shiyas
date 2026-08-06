import { STORAGE_KEYS } from '@shared/constants/STORAGE_KEYS'

const _isVisible = ref(false)

export function useMobilePrompt() {
  function show(): void {
    _isVisible.value = true
  }

  function dismiss(): void {
    _isVisible.value = false
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED, '1')
    }
  }

  function isDismissed(): boolean {
    if (!import.meta.client) return false
    return localStorage.getItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED) === '1'
  }

  return {
    isVisible: readonly(_isVisible),
    show,
    dismiss,
    isDismissed,
  } as const
}

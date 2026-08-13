import { STORAGE_KEYS } from '@shared/constants/STORAGE_KEYS'

type THEME = 'dark' | 'light'

// Dark is the default; light is opt-in and persisted. A pre-hydration inline
// script (see nuxt.config) sets data-theme before first paint to avoid a flash.
const theme = ref<THEME>('dark')

export function useTheme() {
  function apply(value: THEME): void {
    theme.value = value
    if (!import.meta.client) return
    document.documentElement.dataset.theme = value
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, value)
    } catch {
      // localStorage can be unavailable (private mode / blocked cookies) — the
      // theme still applies for this session, it just won't persist.
    }
  }

  function toggle(): void {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Sync the reactive ref to whatever the inline script already put on <html>.
  function init(): void {
    if (!import.meta.client) return
    theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  }

  return { theme: readonly(theme), toggle, init } as const
}

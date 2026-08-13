import { STORAGE_KEYS } from '@shared/constants/STORAGE_KEYS'

type THEME = 'dark' | 'light'

// Window over which the whole UI cross-fades its colours on a toggle. The
// `theme-transition` class (see main.css) is only present for this long so the
// transitions never interfere with normal hover/scroll interactions.
const THEME_TRANSITION_MS = 500

// Dark is the default; light is opt-in and persisted. A pre-hydration inline
// script (see nuxt.config) sets data-theme before first paint to avoid a flash.
const theme = ref<THEME>('dark')

let transitionTimer: ReturnType<typeof setTimeout> | null = null

export function useTheme() {
  function toggle(): void {
    const next: THEME = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = next

    if (!import.meta.client) return

    const html = document.documentElement
    // Enable colour transitions for the switch, then strip them back out.
    html.classList.add('theme-transition')
    html.dataset.theme = next
    if (transitionTimer) clearTimeout(transitionTimer)
    transitionTimer = setTimeout(() => html.classList.remove('theme-transition'), THEME_TRANSITION_MS)

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next)
    } catch {
      // localStorage can be unavailable (private mode / blocked cookies) — the
      // theme still applies for this session, it just won't persist.
    }
  }

  // Sync the reactive ref to whatever the inline script already put on <html>.
  function init(): void {
    if (!import.meta.client) return
    theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  }

  return { theme: readonly(theme), toggle, init } as const
}

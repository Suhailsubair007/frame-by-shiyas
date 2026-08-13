import { useTheme } from '@/composables/useTheme'

// Sync the reactive theme state with the data-theme attribute the inline head
// script applied before hydration.
export default defineNuxtPlugin(() => {
  useTheme().init()
})

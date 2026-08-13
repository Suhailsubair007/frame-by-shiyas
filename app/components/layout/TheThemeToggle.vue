<script setup lang="ts">
import { CURSOR_STATE }   from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'
import { useTheme }       from '@/composables/useTheme'

const { theme, toggle }   = useTheme()
const { setState, reset } = useCursorState()
</script>

<template>
  <button
    class="flex h-10 w-8 items-center justify-center text-text focus-visible:outline-none"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
    @mouseenter="setState(CURSOR_STATE.HOVER)"
    @mouseleave="reset"
  >
    <svg
      class="h-4 w-4 transition-opacity duration-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <!-- Moon while dark, sun while light -->
      <path v-if="theme === 'dark'" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      <template v-else>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </template>
    </svg>
  </button>
</template>

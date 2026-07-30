<script setup lang="ts">
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'
import { useMenuState }   from '@/composables/useMenuState'

const { setState, reset } = useCursorState()
const { close }           = useMenuState()

// Expose root element so TheNavigation can animate it on mount
const rootRef = ref<HTMLElement | null>(null)
defineExpose({ rootRef })
</script>

<template>
  <NuxtLink
    ref="rootRef"
    to="/"
    class="group flex flex-col leading-none focus-visible:outline-none"
    aria-label="Muhammed Shiyas — Home"
    @click="close"
    @mouseenter="setState(CURSOR_STATE.HOVER)"
    @mouseleave="reset"
  >
    <span class="font-display text-sm font-light italic tracking-wide text-text transition-opacity duration-300 group-hover:opacity-70">
      Frame
    </span>
    <span class="font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted transition-opacity duration-300 group-hover:opacity-70">
      by Shiyas
    </span>
  </NuxtLink>
</template>

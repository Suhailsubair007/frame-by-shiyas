<script setup lang="ts">
import { gsap } from 'gsap'
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState }  from '@/composables/useCursorState'
import { useMenuState }    from '@/composables/useMenuState'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }       from '@shared/constants/ANIMATION'

const { isOpen, toggle }   = useMenuState()
const { setState, reset }  = useCursorState()
const prefersReducedMotion = useReducedMotion()

const menuLabelRef = ref<HTMLElement | null>(null)
const closeLabelRef = ref<HTMLElement | null>(null)

// Expose for parent mount animation
const rootRef = ref<HTMLElement | null>(null)
defineExpose({ rootRef })

watch(isOpen, (opened) => {
  if (prefersReducedMotion.value) return
  const menu  = menuLabelRef.value
  const close = closeLabelRef.value
  if (!menu || !close) return

  if (opened) {
    gsap.to(menu,  { y: -12, opacity: 0, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT })
    gsap.fromTo(close, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT, delay: 0.05 })
  } else {
    gsap.to(close, { y: -12, opacity: 0, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT })
    gsap.fromTo(menu, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT, delay: 0.05 })
  }
})
</script>

<template>
  <button
    ref="rootRef"
    class="relative flex h-10 flex-col items-end justify-center overflow-hidden focus-visible:outline-none"
    :aria-label="isOpen ? 'Close menu' : 'Open menu'"
    :aria-expanded="isOpen"
    aria-controls="main-menu"
    @click="toggle"
    @mouseenter="setState(CURSOR_STATE.HOVER)"
    @mouseleave="reset"
  >
    <!-- Two labels stacked — GSAP swaps them vertically -->
    <span
      ref="menuLabelRef"
      class="absolute font-mono text-[10px] uppercase tracking-[0.25em] text-text"
      aria-hidden="true"
    >
      Menu
    </span>
    <span
      ref="closeLabelRef"
      class="absolute font-mono text-[10px] uppercase tracking-[0.25em] text-text opacity-0"
      aria-hidden="true"
    >
      Close
    </span>
    <!-- Spacer so button has consistent width -->
    <span class="font-mono text-[10px] uppercase tracking-[0.25em] opacity-0" aria-hidden="true">
      Close
    </span>
  </button>
</template>

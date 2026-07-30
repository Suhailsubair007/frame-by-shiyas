<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isFirstVisit, complete } = usePreloader()
const prefersReducedMotion       = useReducedMotion()

const overlayRef = ref<HTMLElement | null>(null)
const brandRef   = ref<HTMLElement | null>(null)
const lineRef    = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!isFirstVisit || prefersReducedMotion.value) {
    gsap.set(overlayRef.value, { autoAlpha: 0 })
    complete()
    return
  }

  const tl = gsap.timeline({ onComplete: complete })

  tl
    .fromTo(brandRef.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: ANIMATION.EASE.EXPO_OUT },
      0.1,
    )
    .fromTo(lineRef.value,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.6, ease: 'power2.inOut' },
      0.4,
    )
    .to({}, { duration: 0.4 })
    .to(brandRef.value,
      { opacity: 0, y: -10, duration: 0.35, ease: ANIMATION.EASE.DEFAULT },
    )
    .to(overlayRef.value, {
      clipPath: 'inset(0 0 100% 0)',
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
    }, '-=0.2')
})
</script>

<template>
  <div
    ref="overlayRef"
    class="fixed inset-0 flex flex-col items-center justify-center bg-void"
    style="z-index: var(--z-preloader); clip-path: inset(0 0 0% 0);"
    aria-hidden="true"
  >
    <!-- Brand -->
    <div ref="brandRef" class="flex flex-col items-center gap-3 opacity-0">
      <span
        class="font-display italic text-text"
        style="font-size: clamp(28px, 4vw, 60px); letter-spacing: -0.01em; line-height: 1;"
      >
        Frame by Shiyas
      </span>
      <span class="font-mono text-[9px] uppercase tracking-[0.4em] text-text-faint">
        Visual Storyteller
      </span>
    </div>

    <!-- Thin filling line -->
    <div class="mt-8 h-px w-40 overflow-hidden bg-border">
      <div
        ref="lineRef"
        class="h-full w-full origin-left scale-x-0 bg-text-muted"
      />
    </div>
  </div>
</template>

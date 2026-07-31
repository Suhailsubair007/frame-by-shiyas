<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isFirstVisit, canWipe, progress, signalAnimationReady, complete } = usePreloader()
const prefersReducedMotion = useReducedMotion()

const overlayRef = ref<HTMLElement | null>(null)
const brandRef   = ref<HTMLElement | null>(null)

// CSS-driven progress bar — fills in real-time as images load.
// origin-left is set via Tailwind; transform-origin must not be overridden.
const lineStyle = computed(() => ({
  transform:  `scaleX(${progress.value})`,
  transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

// Phase 2: cinematic wipe — fires as soon as canWipe becomes true.
// Brand fades out while the overlay clips upward, revealing the hero.
function runWipe(): void {
  gsap.timeline({ onComplete: complete })
    .to(brandRef.value, {
      opacity:  0,
      y:        -8,
      duration: ANIMATION.DURATION.FAST,
      ease:     ANIMATION.EASE.DEFAULT,
    })
    .to(overlayRef.value, {
      clipPath: 'inset(0 0 100% 0)',
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
    }, '-=0.15')
}

onMounted(() => {
  if (!isFirstVisit || prefersReducedMotion.value) {
    gsap.set(overlayRef.value, { autoAlpha: 0 })
    complete()
    return
  }

  // Phase 1: brand entrance (~0.95 s floor).
  // The progress line tracks real asset loading via CSS — no GSAP needed for it.
  // signalAnimationReady() is the animation-floor gate; wipe waits for both
  // this AND signalAssetsReady() to fire.
  gsap.timeline({ onComplete: signalAnimationReady })
    .fromTo(brandRef.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: ANIMATION.EASE.EXPO_OUT },
      0.1,
    )
    .to({}, { duration: 0.25 })

  // Phase 2: wipe — starts the moment BOTH the animation floor AND all
  // assets have settled. On fast connections assets may arrive before
  // the brand animation ends; on slow connections the brand holds
  // (hard cap enforced in index.vue).
  const stop = watch(canWipe, (ready) => {
    if (!ready) return
    stop()
    runWipe()
  }, { immediate: true })
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

    <!-- Progress bar — driven by real image load progress, not a fake timer -->
    <div class="mt-8 h-px w-40 overflow-hidden bg-border">
      <div
        class="h-full w-full origin-left bg-text-muted"
        :style="lineStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isFirstVisit, canWipe, signalAnimationReady, complete } = usePreloader()
const prefersReducedMotion = useReducedMotion()

const overlayRef = ref<HTMLElement | null>(null)
const brandRef   = ref<HTMLElement | null>(null)
const lineRef    = ref<HTMLElement | null>(null)

// Phase 2: cinematic wipe — fires as soon as canWipe becomes true.
// Brand fades out while the overlay clips upward, revealing the hero.
function runWipe(): void {
  gsap.timeline({ onComplete: complete })
    .to(brandRef.value, {
      opacity:  0,
      y:        -8,
      duration: 0.3,
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

  // Phase 1: Minimum brand moment (~1.35 s).
  // Brand enters and holds — it stays visible until the wipe fires.
  // signalAnimationReady() is the "animation floor" gate for the wipe.
  gsap.timeline({ onComplete: signalAnimationReady })
    .fromTo(brandRef.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: ANIMATION.EASE.EXPO_OUT },
      0.1,
    )
    .fromTo(lineRef.value,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.9, ease: 'power2.inOut' },
      0.2,
    )
    .to({}, { duration: 0.25 })

  // Phase 2: wipe — starts the moment BOTH animation floor AND assets are ready.
  // On fast connections assets may already be ready by the time Phase 1 ends.
  // On slow connections the brand holds until assets arrive (max 5 s — enforced in index.vue).
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

    <!-- Thin filling line -->
    <div class="mt-8 h-px w-40 overflow-hidden bg-border">
      <div
        ref="lineRef"
        class="h-full w-full origin-left scale-x-0 bg-text-muted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isFirstVisit, complete } = usePreloader()
const prefersReducedMotion       = useReducedMotion()

const overlayRef  = ref<HTMLElement | null>(null)
const brandRef    = ref<HTMLElement | null>(null)
const lineRef     = ref<HTMLElement | null>(null)
const counterRef  = ref<HTMLElement | null>(null)

onMounted(async () => {
  // Returning visitors or reduced-motion: skip straight to complete
  if (!isFirstVisit || prefersReducedMotion.value) {
    gsap.set(overlayRef.value, { autoAlpha: 0 })
    complete()
    return
  }

  const tl = gsap.timeline({ onComplete: complete })

  tl
    // Brand name fades in
    .fromTo(brandRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT },
      0.2,
    )
    // Counter counts up 0 → 100
    .to({}, {
      duration: 1.4,
      ease: 'none',
      onUpdate() {
        if (counterRef.value) {
          counterRef.value.textContent = `${Math.round(this.progress() * 100)}`
        }
      },
    }, 0.3)
    // Progress line grows left → right
    .fromTo(lineRef.value,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
      0.3,
    )
    // Short pause — intentional silence before the reveal
    .to({}, { duration: 0.3 })
    // Brand text lifts off
    .to(brandRef.value,
      { opacity: 0, y: -20, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT },
    )
    // Curtain wipes upward, revealing the hero below
    .to(overlayRef.value, {
      clipPath: 'inset(0 0 100% 0)',
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
    }, '-=0.15')
})
</script>

<template>
  <div
    ref="overlayRef"
    class="fixed inset-0 flex flex-col items-center justify-center bg-void"
    style="z-index: var(--z-preloader); clip-path: inset(0 0 0% 0);"
    aria-hidden="true"
  >
    <!-- Brand identity block -->
    <div ref="brandRef" class="flex flex-col items-center gap-3 opacity-0">
      <span class="font-display text-2xl font-light italic text-text">
        Frame by Shiyas
      </span>
      <span class="font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint">
        Visual Storyteller
      </span>
    </div>

    <!-- Progress line + counter -->
    <div class="absolute bottom-10 left-6 right-6 md:left-10 md:right-10">
      <div class="mb-3 flex justify-between">
        <span class="font-mono text-[9px] tracking-widest text-text-faint uppercase">Loading</span>
        <span ref="counterRef" class="font-mono text-[9px] tracking-widest text-text-faint">0</span>
      </div>
      <div class="h-px w-full overflow-hidden bg-border">
        <div ref="lineRef" class="h-full w-full origin-left scale-x-0 bg-text-muted" />
      </div>
    </div>
  </div>
</template>

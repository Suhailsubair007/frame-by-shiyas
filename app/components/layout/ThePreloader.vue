<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isFirstVisit, canWipe, progress, signalAnimationReady, complete } = usePreloader()
const prefersReducedMotion = useReducedMotion()

const overlayRef  = ref<HTMLElement | null>(null)
const brandRef    = ref<HTMLElement | null>(null)
const apertureRef = ref<SVGSVGElement | null>(null)
const titleRef    = ref<HTMLElement | null>(null)

// Slow continuous iris rotation — captured so the wipe can stop it cleanly.
let spin: gsap.core.Tween | null = null

// Film-footage counter: real load progress, zero-padded like a frame count.
const frameCount = computed(() => String(Math.round(progress.value * 100)).padStart(3, '0'))

// CSS-driven progress bar — fills in real-time as images load.
// origin-left is set via Tailwind; transform-origin must not be overridden.
const lineStyle = computed(() => ({
  transform:  `scaleX(${progress.value})`,
  transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

// Phase 2: cinematic wipe — fires as soon as canWipe becomes true.
// Brand fades out while the overlay clips upward, revealing the hero.
function runWipe(): void {
  spin?.kill()
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

  // Phase 1: aperture opens, then the brand racks into focus (~1 s floor).
  // The progress line + frame counter track real asset loading — no GSAP needed.
  // signalAnimationReady() is the animation-floor gate; wipe waits for both
  // this AND signalAssetsReady() to fire.
  const blades = apertureRef.value?.querySelectorAll('.aperture-blade') ?? []

  gsap.timeline({ onComplete: signalAnimationReady })
    .fromTo(apertureRef.value,
      { opacity: 0, scale: 0.6, rotation: -60, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: ANIMATION.EASE.EXPO_OUT },
      0,
    )
    // Iris blades draw themselves in — pathLength="1" normalises every stroke.
    .fromTo(blades,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.7, stagger: ANIMATION.STAGGER.DEFAULT, ease: ANIMATION.EASE.DEFAULT },
      0.2,
    )
    // Rack focus: the name resolves from blur to sharp, like a lens finding focus.
    .fromTo(titleRef.value,
      { opacity: 0, y: 12, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: ANIMATION.EASE.EXPO_OUT },
      0.45,
    )
    .to({}, { duration: 0.2 })

  spin = gsap.to(apertureRef.value, {
    rotation:        '+=360',
    duration:        ANIMATION.DURATION.EPIC * 6,
    ease:            ANIMATION.EASE.NONE,
    repeat:          -1,
    transformOrigin: '50% 50%',
  })

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
    <!-- Brand cluster — aperture, name, tagline; fades together on wipe -->
    <div ref="brandRef" class="flex flex-col items-center gap-5">
      <!-- Camera aperture / iris — the photography & film motif -->
      <svg
        ref="apertureRef"
        viewBox="0 0 24 24"
        class="h-14 w-14 text-accent opacity-0"
        fill="none"
        stroke="currentColor"
        stroke-width="0.6"
        stroke-linecap="round"
      >
        <circle class="aperture-blade" cx="12" cy="12" r="10" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="14.31" y1="8" x2="20.05" y2="17.94" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="9.69" y1="8" x2="21.17" y2="8" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="7.38" y1="12" x2="13.12" y2="2.06" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="9.69" y1="16" x2="3.95" y2="6.06" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="14.31" y1="16" x2="2.83" y2="16" pathLength="1" style="stroke-dasharray: 1" />
        <line class="aperture-blade" x1="16.62" y1="12" x2="10.88" y2="21.94" pathLength="1" style="stroke-dasharray: 1" />
      </svg>

      <div ref="titleRef" class="flex flex-col items-center gap-3 opacity-0">
        <span
          class="font-display italic text-text"
          style="font-size: clamp(28px, 4vw, 60px); letter-spacing: -0.01em; line-height: 1;"
        >
          Frame by Shiyas
        </span>
        <span class="font-mono text-[11px] uppercase tracking-[0.4em] text-text-muted">
          Stills &amp; Motion
        </span>
      </div>
    </div>

    <!-- Progress — thin line plus a film-footage frame counter, both real -->
    <div class="mt-8 flex flex-col items-center gap-3">
      <div class="h-px w-40 overflow-hidden bg-border">
        <div class="h-full w-full origin-left bg-text-muted" :style="lineStyle" />
      </div>
      <span class="font-mono text-[9px] tracking-[0.35em] text-text-faint tabular-nums">
        {{ frameCount }}
      </span>
    </div>
  </div>
</template>

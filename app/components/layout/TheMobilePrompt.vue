<script setup lang="ts">
import { gsap }             from 'gsap'
import { useMobilePrompt }  from '@/composables/useMobilePrompt'
import { useMediaQuery }    from '@/composables/useMediaQuery'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isVisible, show, dismiss, isDismissed } = useMobilePrompt()
const { isMobile }                              = useMediaQuery()
const prefersReducedMotion                      = useReducedMotion()

const promptRef     = ref<HTMLElement | null>(null)
const cardRef       = ref<HTMLElement | null>(null)
const primaryBtnRef = ref<HTMLButtonElement | null>(null)

// ── Timing: show immediately on first visit, mobile only ─────────────────────
onMounted(() => {
  if (isDismissed() || !isMobile.value) return
  show()
})

// ── Keyboard: Escape dismisses ───────────────────────────────────────────────
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isVisible.value) handleDismiss()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Animation: enter ─────────────────────────────────────────────────────────
watch(isVisible, async (val) => {
  if (!val) return
  await nextTick()
  animateIn()
  primaryBtnRef.value?.focus()
})

function animateIn(): void {
  const el   = promptRef.value
  const card = cardRef.value
  if (!el || !card) return

  if (prefersReducedMotion.value) {
    gsap.set(el, { opacity: 1 })
    gsap.set(card, { y: 0 })
    return
  }

  gsap.timeline()
    .fromTo(el, { opacity: 0 }, {
      opacity:  1,
      duration: ANIMATION.DURATION.FAST,
      ease:     'none',
    })
    .fromTo(card, { y: 48 }, {
      y:        0,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     ANIMATION.EASE.EXPO_OUT,
    }, 0)
}

// ── Animation: leave ─────────────────────────────────────────────────────────
function handleDismiss(): void {
  const el = promptRef.value
  if (!el || prefersReducedMotion.value) { dismiss(); return }

  gsap.to(el, {
    opacity:    0,
    duration:   ANIMATION.DURATION.FAST,
    ease:       ANIMATION.EASE.IN,
    onComplete: dismiss,
  })
}
</script>

<template>
  <div
    v-if="isVisible"
    ref="promptRef"
    class="fixed inset-0 opacity-0"
    style="z-index: var(--z-prompt);"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mobile-prompt-heading"
  >
    <!-- Backdrop — intentionally non-dismissible to avoid accidental taps -->
    <div
      class="absolute inset-0"
      style="background: oklch(4% 0 0 / 0.8); backdrop-filter: blur(6px);"
      aria-hidden="true"
    />

    <!-- Card -->
    <div
      ref="cardRef"
      class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-void px-6 pb-10 pt-8"
    >
      <!-- Handle bar -->
      <div
        class="mx-auto mb-6 h-px w-10 bg-border"
        aria-hidden="true"
      />

      <!-- Label -->
      <p class="font-mono text-[8px] uppercase tracking-[0.42em] text-text-faint">
        Heads Up
      </p>

      <!-- Heading -->
      <h2
        id="mobile-prompt-heading"
        class="mt-3 font-display text-[28px] font-normal italic leading-tight text-text"
      >
        Better on Desktop
      </h2>

      <!-- Body -->
      <p class="mt-3 font-sans text-sm leading-relaxed text-text-faint">
        This portfolio is crafted for large screens. For the full cinematic
        experience, visit on a desktop or laptop.
      </p>

      <!-- Actions -->
      <div class="mt-8 flex flex-col gap-3">
        <button
          ref="primaryBtnRef"
          class="w-full rounded-full border border-border-strong py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-text transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:opacity-70"
          @click="handleDismiss"
        >
          Use Desktop
        </button>

        <button
          class="w-full py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-text-faint transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:opacity-50"
          @click="handleDismiss"
        >
          Continue on Mobile
        </button>
      </div>
    </div>
  </div>
</template>

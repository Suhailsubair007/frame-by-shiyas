<script setup lang="ts">
import { gsap }          from 'gsap'
import { useReveal }     from '@/composables/useReveal'
import { ANIMATION }     from '@shared/constants/ANIMATION'
import { REELS }         from '@shared/constants/REELS'

const { fadeUp, clipReveal } = useReveal()

const containerRef = ref<HTMLElement | null>(null)
const eyebrowRef   = ref<HTMLElement | null>(null)
const headingRef   = ref<HTMLElement | null>(null)
const cardRefs     = ref<(HTMLElement | null)[]>([])
const activeIndex  = ref(0)

let cardWidth   = 0
let autoTimer:  ReturnType<typeof setInterval> | null = null
let isPaused    = false

// ── Card position model ─────────────────────────────────────────────────────
// Offsets are in multiples of the card width; sign = direction.
const SLOT_CONFIG: Record<number, { xMult: number; scale: number; opacity: number; zIndex: number }> = {
  0: { xMult: 0,    scale: 1.00, opacity: 1.0, zIndex: 4 },
  1: { xMult: 0.78, scale: 0.78, opacity: 0.55, zIndex: 3 },
  2: { xMult: 1.38, scale: 0.60, opacity: 0.25, zIndex: 2 },
}

function getSlot(cardIdx: number): number {
  const diff   = cardIdx - activeIndex.value
  const half   = REELS.length / 2
  // Normalise to [-half, half] for shortest-path wrapping
  if (diff > half)  return diff - REELS.length
  if (diff < -half) return diff + REELS.length
  return diff
}

function getState(slot: number): { x: number; scale: number; opacity: number; zIndex: number } {
  const absSlot = Math.abs(slot)
  if (absSlot > 2) return { x: (slot > 0 ? 1 : -1) * cardWidth * 2.0, scale: 0.5, opacity: 0, zIndex: 1 }
  const cfg = SLOT_CONFIG[absSlot]
  return { x: (slot > 0 ? 1 : -1) * cardWidth * cfg.xMult, scale: cfg.scale, opacity: cfg.opacity, zIndex: cfg.zIndex }
}

function measureCard(): void {
  if (!containerRef.value) return
  cardWidth = containerRef.value.clientHeight * 9 / 16
}

function placeCards(animate: boolean): void {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const state = getState(getSlot(i))
    const props = { x: state.x, scale: state.scale, opacity: state.opacity, zIndex: state.zIndex }
    if (animate) {
      gsap.to(el, { ...props, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT })
    } else {
      gsap.set(el, props)
    }
  })
}

function advance(): void {
  activeIndex.value = (activeIndex.value + 1) % REELS.length
}

function goTo(index: number): void {
  if (index === activeIndex.value) return
  activeIndex.value = index
}

function startAutoAdvance(): void {
  autoTimer = setInterval(() => {
    if (!isPaused) advance()
  }, 4200)
}

watch(activeIndex, () => placeCards(true))

onMounted(() => {
  nextTick(() => {
    measureCard()
    placeCards(false)
    startAutoAdvance()
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
  })
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<template>
  <section
    class="overflow-hidden bg-void py-24 md:py-32"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Header -->
    <div class="mb-12 px-6 md:mb-16 md:px-10">
      <p
        ref="eyebrowRef"
        class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
      >
        01 — Reels
      </p>
      <h2
        ref="headingRef"
        class="font-display font-light leading-[0.88] text-text"
        style="font-size: clamp(40px, 6vw, 100px);"
      >
        Short<br /><em>Stories.</em>
      </h2>
    </div>

    <!-- Carousel track -->
    <div
      ref="containerRef"
      class="relative mx-auto"
      style="height: clamp(420px, 65vh, 680px);"
    >
      <div
        v-for="(reel, i) in REELS"
        :key="reel.id"
        :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
        class="absolute left-1/2 top-0 -translate-x-1/2 cursor-pointer"
        :style="`height: 100%; aspect-ratio: 9/16; will-change: transform, opacity;`"
        :aria-label="reel.title"
        role="button"
        :tabindex="i === activeIndex ? 0 : -1"
        @click="goTo(i)"
        @keydown.enter="goTo(i)"
        @keydown.space.prevent="goTo(i)"
      >
        <ReelCard :reel="reel" :is-active="i === activeIndex" />
      </div>
    </div>

    <!-- Progress dots -->
    <div class="mt-10 flex items-center justify-center gap-2" aria-hidden="true">
      <button
        v-for="(_, i) in REELS"
        :key="i"
        class="h-px transition-all duration-500 motion-reduce:transition-none"
        :class="i === activeIndex
          ? 'w-8 bg-text'
          : 'w-3 bg-text-faint hover:bg-text-muted'"
        :aria-label="`Go to reel ${i + 1}`"
        @click="goTo(i)"
      />
    </div>

  </section>
</template>

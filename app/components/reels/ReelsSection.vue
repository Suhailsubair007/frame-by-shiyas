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

let cardWidth     = 0
let containerMid  = 0   // = -(cardWidth / 2) — offset to center a card from left:50%
let autoTimer:    ReturnType<typeof setInterval> | null = null
let isPaused      = false

// ── Card slot configs (offsets relative to activeIndex) ──────────────────────
const SLOT: Record<number, { xMult: number; scale: number; opacity: number; zIndex: number }> = {
  0: { xMult: 0,    scale: 1.00, opacity: 1.00, zIndex: 4 },
  1: { xMult: 0.78, scale: 0.78, opacity: 0.55, zIndex: 3 },
  2: { xMult: 1.38, scale: 0.60, opacity: 0.25, zIndex: 2 },
}

function getSlot(cardIdx: number): number {
  const diff = cardIdx - activeIndex.value
  const half = REELS.length / 2
  if (diff >  half) return diff - REELS.length
  if (diff < -half) return diff + REELS.length
  return diff
}

function getState(slot: number): { x: number; scale: number; opacity: number; zIndex: number } {
  const absSlot = Math.abs(slot)
  const sign    = slot >= 0 ? 1 : -1

  // Cards beyond ±2 are hidden off to the side
  if (absSlot > 2) {
    return { x: containerMid + sign * cardWidth * 2.0, scale: 0.55, opacity: 0, zIndex: 1 }
  }

  const cfg = SLOT[absSlot]
  return {
    x:       containerMid + sign * cardWidth * cfg.xMult,
    scale:   cfg.scale,
    opacity: cfg.opacity,
    zIndex:  cfg.zIndex,
  }
}

function measure(): void {
  if (!containerRef.value) return
  // cardWidth from container height × 9:16 ratio
  cardWidth    = containerRef.value.clientHeight * (9 / 16)
  // Centering: the card's left edge must be at 50% - cardWidth/2
  // Since cards use left:50%, we shift left by half a card width
  containerMid = -(cardWidth / 2)
}

function placeCards(animate: boolean): void {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const state = getState(getSlot(i))
    if (animate) {
      gsap.to(el, { ...state, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT })
    } else {
      gsap.set(el, state)
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

watch(activeIndex, () => placeCards(true))

onMounted(() => {
  // Wait for layout paint so clientHeight is non-zero
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      measure()
      placeCards(false)

      autoTimer = setInterval(() => {
        if (!isPaused) advance()
      }, 4200)

      nextTick(() => {
        fadeUp([eyebrowRef.value], {})
        clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
      })
    })
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
    <!-- Section header -->
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

    <!-- Carousel track ──────────────────────────────────────────────────────
         Cards are positioned with left:50% and GSAP x handles ALL horizontal
         placement (including the centering offset). This prevents the
         -translate-x-1/2 CSS class from conflicting with GSAP's transform.
    -->
    <div
      ref="containerRef"
      class="relative mx-auto"
      style="height: clamp(380px, 60vh, 640px);"
    >
      <div
        v-for="(reel, i) in REELS"
        :key="reel.id"
        :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
        class="absolute left-1/2 top-0 cursor-pointer"
        :style="{ height: '100%', aspectRatio: '9/16', willChange: 'transform, opacity' }"
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

    <!-- Progress indicators -->
    <div class="mt-10 flex items-center justify-center gap-2.5" aria-label="Reel navigation">
      <button
        v-for="(_, i) in REELS"
        :key="i"
        class="h-px rounded-full transition-all duration-500 motion-reduce:transition-none"
        :class="i === activeIndex
          ? 'w-8 bg-text'
          : 'w-3 bg-border hover:bg-text-muted'"
        :aria-label="`Reel ${i + 1} of ${REELS.length}`"
        :aria-pressed="i === activeIndex"
        @click="goTo(i)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap }          from 'gsap'
import { useReveal }     from '@/composables/useReveal'
import { ANIMATION }     from '@shared/constants/ANIMATION'
import { REELS }         from '@shared/constants/REELS'

const { fadeUp, clipReveal } = useReveal()

const sectionRef   = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const eyebrowRef   = ref<HTMLElement | null>(null)
const headingRef   = ref<HTMLElement | null>(null)
const cardRefs     = ref<(HTMLElement | null)[]>([])
const activeIndex  = ref(0)
const isNear       = ref(false)

const REEL_AUTOPLAY_INTERVAL_MS = 4_200
// Begin loading reel videos when the section is within this margin of the viewport,
// keeping their metadata fetches off the initial critical path.
const REELS_PRELOAD_ROOT_MARGIN = '400px 0px'
// Only cards this close to the active slot are promoted to their own compositor layer.
const WILL_CHANGE_SLOT_RANGE = 1

let cardWidth     = 0
let containerMid  = 0   // = -(cardWidth / 2) — offset to center a card from left:50%
let autoTimer:    ReturnType<typeof setInterval> | null = null
let nearObserver: IntersectionObserver | null           = null
let isPaused      = false
let touchStartX   = 0
let touchStartY   = 0

// ── Card slot configs (offsets relative to activeIndex) ──────────────────────
// xMult is multiplied by cardWidth and added to containerMid (= -cardWidth/2).
// At xMult 0.92 the adjacent card's visual left edge clears the center card's
// right edge by ~3% of cardWidth — eliminating overlap while keeping depth.
const SLOT: Record<number, { xMult: number; scale: number; opacity: number; zIndex: number }> = {
  0: { xMult: 0,    scale: 1.00, opacity: 1.00, zIndex: 4 },
  1: { xMult: 0.92, scale: 0.78, opacity: 0.65, zIndex: 3 },
  2: { xMult: 1.58, scale: 0.60, opacity: 0.30, zIndex: 2 },
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

// Only the active card and its immediate neighbours get a will-change hint, so at most
// three compositor layers exist at once instead of one permanent layer per card.
function willChangeFor(cardIdx: number): string {
  return Math.abs(getSlot(cardIdx)) <= WILL_CHANGE_SLOT_RANGE ? 'transform, opacity' : 'auto'
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

// ── Touch swipe — mobile only (touch events never fire on desktop) ────────────
// Records the start position; onTouchEnd decides direction once the finger lifts.
// Horizontal-dominant swipes (|ΔX| ≥ |ΔY|, |ΔX| ≥ threshold) advance/retreat.
const SWIPE_THRESHOLD = 50

function onTouchStart(e: TouchEvent): void {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  isPaused    = true
}

function onTouchEnd(e: TouchEvent): void {
  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY

  if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) >= Math.abs(deltaY)) {
    if (deltaX < 0) {
      // Swipe left → next reel
      activeIndex.value = (activeIndex.value + 1) % REELS.length
    } else {
      // Swipe right → previous reel
      activeIndex.value = (activeIndex.value - 1 + REELS.length) % REELS.length
    }
  }

  isPaused = false
}

watch(activeIndex, () => placeCards(true))

onMounted(() => {
  // Defer loading the reel videos until the section nears the viewport.
  if (sectionRef.value) {
    nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        isNear.value = true
        nearObserver?.disconnect()
        nearObserver = null
      },
      { rootMargin: REELS_PRELOAD_ROOT_MARGIN },
    )
    nearObserver.observe(sectionRef.value)
  }

  // Wait for layout paint so clientHeight is non-zero
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      measure()
      placeCards(false)

      autoTimer = setInterval(() => {
        if (!isPaused) advance()
      }, REEL_AUTOPLAY_INTERVAL_MS)

      nextTick(() => {
        fadeUp([eyebrowRef.value], {})
        clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
      })
    })
  })
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
  nearObserver?.disconnect()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="overflow-hidden bg-void py-16 md:py-32"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
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
        class="font-display font-normal leading-[0.88] text-text"
        style="font-size: clamp(40px, 6vw, 100px);"
      >
        Short<br /><em>Reels.</em>
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
      style="height: clamp(480px, 78vh, 820px);"
    >
      <div
        v-for="(reel, i) in REELS"
        :key="reel.id"
        :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
        class="absolute left-1/2 top-0 cursor-pointer"
        :style="{ height: '100%', aspectRatio: '9/16', willChange: willChangeFor(i) }"
        :aria-label="reel.title"
        role="button"
        :tabindex="i === activeIndex ? 0 : -1"
        @click="goTo(i)"
        @keydown.enter="goTo(i)"
        @keydown.space.prevent="goTo(i)"
      >
        <ReelCard :reel="reel" :is-active="i === activeIndex" :should-load="isNear" />
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

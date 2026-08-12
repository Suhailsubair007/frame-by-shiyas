<script setup lang="ts">
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal }           from '@/composables/useReveal'
import { ANIMATION }           from '@shared/constants/ANIMATION'
import { FILMS }               from '@shared/constants/FILMS'

const { fadeUp, clipReveal } = useReveal()

const sectionRef = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const pinRef     = ref<HTMLElement | null>(null)
const trackRef   = ref<HTMLElement | null>(null)
const isNear     = ref(false)

// Start fetching the clips slightly before the rail scrolls into view, keeping
// their downloads off the initial critical path.
const FILMS_PRELOAD_ROOT_MARGIN = '400px 0px'

let nearObserver: IntersectionObserver | null = null

useHorizontalScroll(pinRef, trackRef)

onMounted(() => {
  if (sectionRef.value) {
    nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        isNear.value = true
        nearObserver?.disconnect()
        nearObserver = null
      },
      { rootMargin: FILMS_PRELOAD_ROOT_MARGIN },
    )
    nearObserver.observe(sectionRef.value)
  }

  nextTick(() => {
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })

    const cards = Array.from(
      trackRef.value?.querySelectorAll<HTMLElement>('[data-film-card]') ?? [],
    )
    if (cards.length) {
      fadeUp(cards, {
        triggerStart: ANIMATION.SCROLL.START_EARLY,
        stagger:      ANIMATION.STAGGER.WIDE,
        duration:     ANIMATION.DURATION.SLOW,
      })
    }
  })
})

onUnmounted(() => {
  nearObserver?.disconnect()
})
</script>

<template>
  <section ref="sectionRef" class="relative bg-void">

    <!-- ── Section header ──────────────────────────────────────────────── -->
    <div class="flex items-end justify-between px-6 pb-14 pt-24 md:px-10 md:pb-20 md:pt-32">
      <div>
        <p
          ref="eyebrowRef"
          class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          01 — Films
        </p>
        <h2
          ref="headingRef"
          class="font-display font-normal leading-[0.88] text-text"
          style="font-size: clamp(48px, 7vw, 120px);"
        >
          Selected<br /><em>Films.</em>
        </h2>
      </div>
    </div>

    <!-- ── Horizontal scroll reel ───────────────────────────────────────── -->
    <!-- Mobile: overflow-x snap scroll. Desktop: GSAP-pinned horizontal scrub. -->
    <div
      ref="pinRef"
      class="h-dvh overflow-x-auto overflow-y-hidden md:overflow-hidden"
      style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;"
    >
      <div
        ref="trackRef"
        class="flex h-full items-center gap-5 md:gap-8"
        style="padding-left: 8vw; padding-right: 8vw;"
      >
        <FilmCard
          v-for="(film, i) in FILMS"
          :key="film.id"
          :film="film"
          :index="i"
          :should-load="isNear"
          style="scroll-snap-align: start;"
        />
      </div>
    </div>

  </section>
</template>

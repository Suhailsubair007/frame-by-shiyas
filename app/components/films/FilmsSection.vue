<script setup lang="ts">
import { useFilms }           from '@/composables/useFilms'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal }           from '@/composables/useReveal'
import { ANIMATION }           from '@shared/constants/ANIMATION'

const { films }              = useFilms()
const { fadeUp, clipReveal } = useReveal()

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const pinRef     = ref<HTMLElement | null>(null)
const trackRef   = ref<HTMLElement | null>(null)

useHorizontalScroll(pinRef, trackRef)

onMounted(() => {
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
</script>

<template>
  <section class="relative bg-void">

    <!-- ── Section header ──────────────────────────────────────────────── -->
    <div class="flex items-end justify-between px-6 pb-14 pt-24 md:px-10 md:pb-20 md:pt-32">
      <div>
        <p
          ref="eyebrowRef"
          class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          02 — Films
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
          v-for="(film, i) in films"
          :key="film.id"
          :film="film"
          :index="i"
          style="scroll-snap-align: start;"
        />
      </div>
    </div>

  </section>
</template>

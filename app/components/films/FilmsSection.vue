<script setup lang="ts">
import { useFilms }           from '@/composables/useFilms'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal }           from '@/composables/useReveal'
import { ANIMATION }           from '@shared/constants/ANIMATION'
import { ROUTES }              from '@shared/constants/ROUTES'

const { films }              = useFilms()
const { fadeUp, clipReveal } = useReveal()

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const ctaRef     = ref<HTMLElement | null>(null)
const pinRef     = ref<HTMLElement | null>(null)
const trackRef   = ref<HTMLElement | null>(null)

useHorizontalScroll(pinRef, trackRef)

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value, ctaRef.value], { stagger: ANIMATION.STAGGER.LOOSE })
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
          01 — Films
        </p>
        <h2
          ref="headingRef"
          class="font-display font-light leading-[0.88] text-text"
          style="font-size: clamp(48px, 7vw, 120px);"
        >
          Selected<br /><em>Films.</em>
        </h2>
      </div>

      <div ref="ctaRef" class="hidden opacity-0 md:block">
        <NuxtLink
          :to="ROUTES.FILMS"
          class="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors duration-300 hover:text-text"
        >
          View all
          <span
            class="inline-block transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >→</span>
        </NuxtLink>
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

        <!-- End card — nudge to films page -->
        <div
          class="flex shrink-0 flex-col items-start justify-center"
          style="width: clamp(180px, 16vw, 280px);"
        >
          <NuxtLink :to="ROUTES.FILMS" class="group flex flex-col gap-3">
            <span class="font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint">
              All films
            </span>
            <span
              class="font-display text-4xl font-light italic text-text transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-5xl"
            >
              See more →
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

  </section>
</template>

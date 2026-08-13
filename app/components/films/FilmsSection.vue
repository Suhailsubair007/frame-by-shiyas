<script setup lang="ts">
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal }           from '@/composables/useReveal'
import { ANIMATION }           from '@shared/constants/ANIMATION'
import { FILMS }               from '@shared/constants/FILMS'
import type { FILM }           from '@shared/types/Film'

const { fadeUp, clipReveal } = useReveal()

// Rendered order. Server and first client paint use the source order (so
// hydration matches); the rail is shuffled on mount for a fresh sequence each
// visit, before the reveal plays — the cards are still hidden, so no flash.
const films = ref<readonly FILM[]>(FILMS)

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
  films.value = shuffle(FILMS)

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

    <!-- Full-screen pinned stage: the header sits at the top of the same viewport
         as the rail, so the cards aren't pushed half a screen below the heading.
         On desktop useHorizontalScroll pins this and scrubs the track sideways
         while the header stays put; on mobile the rail below scrolls natively. -->
    <div ref="pinRef" class="flex h-dvh flex-col overflow-hidden">

      <!-- ── Section header ──────────────────────────────────────────────── -->
      <div class="shrink-0 px-6 pt-24 pb-8 md:px-10 md:pt-28 md:pb-10">
        <p
          ref="eyebrowRef"
          class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          01 — Films
        </p>
        <h2
          ref="headingRef"
          class="font-display font-normal leading-[0.88] text-text"
          style="font-size: clamp(44px, 6vw, 104px);"
        >
          Selected<br /><em>Films.</em>
        </h2>
      </div>

      <!-- ── Horizontal scroll reel ───────────────────────────────────────── -->
      <!-- Mobile: native overflow-x snap scroll. Desktop: overflow-hidden while
           GSAP scrubs the track. flex-1/min-h-0 lets it fill the space under the
           header so the cards sit just below the title. -->
      <div
        class="min-h-0 flex-1 overflow-x-auto overflow-y-hidden md:overflow-hidden"
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
            :should-load="isNear"
            style="scroll-snap-align: start;"
          />
        </div>
      </div>

    </div>

  </section>
</template>

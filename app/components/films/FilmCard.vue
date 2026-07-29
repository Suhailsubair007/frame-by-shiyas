<script setup lang="ts">
import { gsap }             from 'gsap'
import { useCursorState }   from '@/composables/useCursorState'
import { useReducedMotion } from '@/composables/useReducedMotion'
import type { FILM_LIST_ITEM } from '@shared/types/Film'
import { FILM_CATEGORY }    from '@shared/enums/FilmCategory'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { CURSOR_STATE }     from '@shared/enums/CursorState'
import { ROUTES }           from '@shared/constants/ROUTES'

const props = defineProps<{
  film:  FILM_LIST_ITEM
  index: number
}>()

const { setState, reset } = useCursorState()
const prefersReducedMotion = useReducedMotion()

const videoRef = ref<HTMLVideoElement | null>(null)

const indexLabel    = computed(() => String(props.index + 1).padStart(2, '0'))
const categoryLabel = computed(() => props.film.category.replace(/_/g, ' '))
const hasVideo      = computed(() => Boolean(props.film.videoUrl))
const hasPoster     = computed(() => Boolean(props.film.posterImage.src))

// Per-category gradient when no real poster exists yet
const POSTER_GRADIENTS: Readonly<Record<FILM_CATEGORY, string>> = {
  [FILM_CATEGORY.WEDDING]:     'radial-gradient(ellipse 110% 120% at 70% 30%, oklch(22% 0.04 60) 0%, oklch(5% 0 0) 70%)',
  [FILM_CATEGORY.DOCUMENTARY]: 'radial-gradient(ellipse 110% 120% at 30% 60%, oklch(18% 0.01 30) 0%, oklch(5% 0 0) 70%)',
  [FILM_CATEGORY.COMMERCIAL]:  'radial-gradient(ellipse 110% 120% at 60% 30%, oklch(20% 0.02 240) 0%, oklch(5% 0 0) 70%)',
  [FILM_CATEGORY.SHORT_FILM]:  'radial-gradient(ellipse 110% 120% at 30% 30%, oklch(20% 0.025 180) 0%, oklch(5% 0 0) 70%)',
  [FILM_CATEGORY.BRAND]:       'radial-gradient(ellipse 110% 120% at 65% 65%, oklch(18% 0.022 300) 0%, oklch(5% 0 0) 70%)',
  [FILM_CATEGORY.EVENT]:       'radial-gradient(ellipse 110% 120% at 40% 40%, oklch(20% 0.015 120) 0%, oklch(5% 0 0) 70%)',
}

const posterGradient = computed(() => POSTER_GRADIENTS[props.film.category])

function onEnter(): void {
  setState(CURSOR_STATE.PLAY)
  if (!hasVideo.value || prefersReducedMotion.value || !videoRef.value) return
  gsap.to(videoRef.value, { opacity: 1, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT })
  videoRef.value.play().catch(() => {})
}

function onLeave(): void {
  reset()
  if (!videoRef.value) return
  gsap.to(videoRef.value, {
    opacity:    0,
    duration:   ANIMATION.DURATION.FAST,
    ease:       ANIMATION.EASE.IN,
    onComplete: () => { videoRef.value?.pause() },
  })
}
</script>

<template>
  <NuxtLink
    :to="ROUTES.FILM(film.slug)"
    :aria-label="`Watch ${film.title}`"
    class="group relative block shrink-0 overflow-hidden rounded-sm"
    style="width: clamp(280px, 52vw, 820px); aspect-ratio: 16/9;"
    data-film-card
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Poster — external placeholder or gradient fallback -->
    <div class="absolute inset-0">
      <img
        v-if="hasPoster"
        :src="film.posterImage.src"
        :alt="film.posterImage.alt"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="h-full w-full" :style="{ background: posterGradient }" />
    </div>

    <!-- Video preview — fades in on hover, pauses on leave -->
    <video
      v-if="hasVideo"
      ref="videoRef"
      :src="film.videoUrl"
      class="absolute inset-0 h-full w-full object-cover opacity-0"
      muted
      loop
      playsinline
      preload="none"
      aria-hidden="true"
    />

    <!-- Gradient veil for text legibility — deepens on hover -->
    <div
      class="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      style="background: linear-gradient(to bottom, transparent 25%, oklch(4% 0 0 / 0.55) 55%, oklch(4% 0 0 / 0.92) 100%);"
      aria-hidden="true"
    />

    <!-- Index — top left -->
    <span
      class="absolute left-5 top-5 font-mono text-[10px] tracking-[0.25em] text-text-faint"
      aria-hidden="true"
    >
      {{ indexLabel }}
    </span>

    <!-- Category — top right -->
    <span
      class="absolute right-5 top-5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint"
      aria-hidden="true"
    >
      {{ categoryLabel }}
    </span>

    <!-- Film info — bottom -->
    <div class="absolute bottom-0 left-0 right-0 p-5 md:p-7">
      <p
        v-if="film.tagline"
        class="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        {{ film.tagline }}
      </p>

      <h3
        class="font-display font-light italic leading-tight text-text transition-transform duration-500 ease-out group-hover:-translate-y-1"
        style="font-size: clamp(22px, 3.2vw, 50px);"
      >
        {{ film.title }}
      </h3>

      <div class="mt-2 flex items-center gap-4">
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
          {{ categoryLabel }}
        </span>
        <span v-if="film.duration" class="font-mono text-[9px] tracking-widest text-text-faint">
          {{ film.duration }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

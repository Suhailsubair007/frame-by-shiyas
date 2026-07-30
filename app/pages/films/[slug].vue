<script setup lang="ts">
import { useReveal }  from '@/composables/useReveal'
import { ANIMATION }  from '@shared/constants/ANIMATION'
import { META }       from '@shared/constants/META'
import { FILMS }      from '@shared/constants/FILMS'
import { ROUTES }     from '@shared/constants/ROUTES'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug  = route.params.slug as string

const film = FILMS.find(f => f.slug === slug)

if (!film) {
  throw createError({ statusCode: 404, statusMessage: 'Film not found' })
}

useSeoMeta({
  title:       `${film.title} — ${META.SITE_NAME}`,
  description: film.tagline ?? `A film by ${META.OWNER}.`,
})

const { fadeUp, clipReveal } = useReveal()

const videoWrapRef   = ref<HTMLElement | null>(null)
const headingRef     = ref<HTMLElement | null>(null)
const metaRef        = ref<HTMLElement | null>(null)

const categoryLabel = computed(() => film!.category.replace(/_/g, ' '))

onMounted(() => {
  nextTick(() => {
    clipReveal(videoWrapRef, { direction: 'up', duration: ANIMATION.DURATION.CINEMATIC })
    clipReveal(headingRef,   { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
    fadeUp([metaRef.value],  { delay: ANIMATION.DELAY.LONG })
  })
})
</script>

<template>
  <main class="min-h-screen bg-void">

    <!-- Video / poster — full width -->
    <div ref="videoWrapRef" class="relative w-full" style="aspect-ratio: 16/9;">
      <video
        v-if="film.videoUrl"
        :src="film.videoUrl"
        :poster="film.posterImage.src"
        class="h-full w-full object-cover"
        controls
        preload="metadata"
        playsinline
      />
      <img
        v-else
        :src="film.posterImage.src"
        :alt="film.posterImage.alt"
        class="h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent 60%, oklch(4% 0 0 / 0.8) 100%);"
        aria-hidden="true"
      />
    </div>

    <!-- Film info -->
    <div class="px-6 py-16 md:px-10 md:py-24">

      <h1
        ref="headingRef"
        class="mb-6 font-display font-normal leading-[0.9] text-text"
        style="font-size: clamp(40px, 6vw, 100px);"
      >
        {{ film.title }}<br />
        <em v-if="film.tagline" class="text-text-muted" style="font-size: 0.6em;">
          {{ film.tagline }}
        </em>
      </h1>

      <div ref="metaRef" class="flex flex-wrap items-center gap-6 opacity-0">
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
          {{ categoryLabel }}
        </span>
        <span v-if="film.duration" class="font-mono text-[9px] tracking-widest text-text-faint">
          {{ film.duration }}
        </span>
      </div>

      <!-- Back -->
      <div class="mt-16">
        <NuxtLink
          :to="ROUTES.FILMS"
          class="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text"
        >
          <span class="inline-block transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
          All films
        </NuxtLink>
      </div>
    </div>

  </main>
</template>

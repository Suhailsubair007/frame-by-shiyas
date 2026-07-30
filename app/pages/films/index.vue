<script setup lang="ts">
import { useFilms }   from '@/composables/useFilms'
import { useReveal }  from '@/composables/useReveal'
import { ANIMATION }  from '@shared/constants/ANIMATION'
import { META }       from '@shared/constants/META'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title:       `Films — ${META.SITE_NAME}`,
  description: 'Cinematic wedding, documentary, commercial, and brand films by Muhammed Shiyas.',
})

const { films }              = useFilms()
const { fadeUp, clipReveal } = useReveal()

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
  })
})
</script>

<template>
  <main class="min-h-screen bg-void pt-32 pb-24 md:pt-40 md:pb-36">

    <!-- Header -->
    <div class="px-6 md:px-10 mb-16 md:mb-24">
      <p
        ref="eyebrowRef"
        class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
      >
        01 — Films
      </p>
      <h1
        ref="headingRef"
        class="font-display font-light leading-[0.88] text-text"
        style="font-size: clamp(48px, 7vw, 120px);"
      >
        All<br /><em>Films.</em>
      </h1>
    </div>

    <!-- Grid — each cell constrains FilmCard to fill the column -->
    <div class="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
      <div
        v-for="(film, i) in films"
        :key="film.id"
        class="bg-void"
        style="aspect-ratio: 16/9;"
      >
        <FilmCard
          :film="film"
          :index="i"
          style="width: 100%; height: 100%;"
        />
      </div>
    </div>

  </main>
</template>

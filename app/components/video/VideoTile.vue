<script setup lang="ts">
import { useInViewVideo } from '@/composables/useInViewVideo'

const props = withDefaults(defineProps<{
  src: string
  title: string
  orientation?: 'portrait' | 'landscape'
  poster?: string
  zoom?: number
}>(), {
  orientation: 'landscape',
})

// Clips open a few seconds in — shared with the home rail/carousel.
const START_SECONDS = 3

const videoRef = ref<HTMLVideoElement | null>(null)

useInViewVideo(videoRef, { startSeconds: START_SECONDS })

const aspectClass = computed(() =>
  props.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video',
)

// Crops letterbox bars baked into a source clip; no-op when zoom is absent.
const videoStyle = computed(() =>
  props.zoom ? { transform: `scale(${props.zoom})` } : undefined,
)
</script>

<template>
  <figure
    class="group relative overflow-hidden rounded-xl bg-black"
    :class="aspectClass"
  >
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      :style="videoStyle"
      class="absolute inset-0 h-full w-full object-cover"
      muted
      playsinline
      preload="none"
      aria-hidden="true"
    />

    <!-- Gradient veil for caption legibility -->
    <div
      class="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      style="background: linear-gradient(to bottom, transparent 45%, oklch(4% 0 0 / 0.85) 100%);"
      aria-hidden="true"
    />

    <figcaption
      class="absolute bottom-0 left-0 right-0 p-4 font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint md:p-5"
    >
      {{ title }}
    </figcaption>
  </figure>
</template>

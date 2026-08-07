<script setup lang="ts">
import type { REEL } from '@shared/types/Reel'

const props = withDefaults(defineProps<{
  reel:        REEL
  isActive?:   boolean
  shouldLoad?: boolean
}>(), {
  isActive:    false,
  shouldLoad:  false,
})

const videoRef = ref<HTMLVideoElement | null>(null)

const START_OFFSET = 3

watch(() => props.isActive, (active) => {
  const v = videoRef.value
  if (!v) return
  if (active) {
    v.currentTime = START_OFFSET
    v.play().catch(() => {})
  } else {
    v.pause()
    v.currentTime = START_OFFSET
  }
}, { immediate: false })

function onLoadedMetadata(): void {
  const v = videoRef.value
  if (!v) return
  v.currentTime = START_OFFSET
  // The active card may finish loading after it is already active — e.g. once the
  // section scrolls near the viewport and its src binds — so start playback here too.
  if (props.isActive) v.play().catch(() => {})
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl">
    <!-- Video — src binds only once the section nears the viewport (shouldLoad), so the
         seven reel videos are not all fetched on initial page load. Inactive cards keep
         preload="metadata" to show their first frame; the active card plays. -->
    <video
      ref="videoRef"
      :src="shouldLoad ? reel.videoUrl : undefined"
      class="h-full w-full object-cover transition-transform duration-700"
      :class="isActive ? 'scale-100' : 'scale-105'"
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
      @loadedmetadata="onLoadedMetadata"
    />

    <!-- Gradient veil -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, transparent 40%, oklch(4% 0 0 / 0.8) 100%);"
      aria-hidden="true"
    />

    <!-- Play indicator -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-opacity duration-300"
      :class="isActive ? 'h-14 w-14 opacity-80' : 'h-10 w-10 opacity-40'"
      aria-hidden="true"
    >
      <svg
        :class="isActive ? 'h-5 w-5 translate-x-0.5' : 'h-3.5 w-3.5 translate-x-px'"
        viewBox="0 0 16 16"
        fill="white"
        aria-hidden="true"
      >
        <polygon points="4,2 14,8 4,14" />
      </svg>
    </div>

    <!-- Title -->
    <div class="absolute bottom-0 left-0 right-0 p-4">
      <p
        class="font-mono text-[9px] uppercase tracking-[0.25em] transition-opacity duration-300"
        :class="isActive ? 'text-white/70 opacity-100' : 'opacity-0'"
      >
        {{ reel.title }}
      </p>
    </div>
  </div>
</template>

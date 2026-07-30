<script setup lang="ts">
import type { REEL } from '@shared/types/Reel'

const props = withDefaults(defineProps<{
  reel:     REEL
  isActive: boolean
}>(), {
  isActive: false,
})

const videoRef = ref<HTMLVideoElement | null>(null)

watch(() => props.isActive, (active) => {
  const v = videoRef.value
  if (!v) return
  if (active) {
    v.play().catch(() => {})
  } else {
    v.pause()
    v.currentTime = 0
  }
}, { immediate: false })
</script>

<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl">
    <!-- Video — preload metadata so the first frame is visible on inactive cards -->
    <video
      ref="videoRef"
      :src="reel.videoUrl"
      class="h-full w-full object-cover transition-transform duration-700"
      :class="isActive ? 'scale-100' : 'scale-105'"
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
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

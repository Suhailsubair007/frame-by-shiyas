<script setup lang="ts">
import { useCursorState }   from '@/composables/useCursorState'
import { useReducedMotion } from '@/composables/useReducedMotion'
import type { FILM }        from '@shared/types/Film'
import { CURSOR_STATE }     from '@shared/enums/CursorState'

const props = defineProps<{
  film: FILM
  index: number
  shouldLoad?: boolean
}>()

const { setState, reset }  = useCursorState()
const prefersReducedMotion = useReducedMotion()

const videoRef = ref<HTMLVideoElement | null>(null)

// Clips open on a stronger frame a few seconds in, so playback both starts and
// loops from here rather than the native loop's fixed 0s restart.
const LOOP_START_SECONDS = 3

const indexLabel = computed(() => String(props.index + 1).padStart(2, '0'))
const canAutoplay = computed(() => props.shouldLoad === true && !prefersReducedMotion.value)

// Crops letterbox bars baked into the source clip; no-op when zoom is absent.
const videoStyle = computed(() =>
  props.film.zoom ? { transform: `scale(${props.film.zoom})` } : undefined,
)

function seekToLoopStart(): void {
  const el = videoRef.value
  if (!el) return
  // Clamp for clips shorter than the offset so the seek never fails.
  el.currentTime = el.duration > LOOP_START_SECONDS ? LOOP_START_SECONDS : 0
}

function onLoadedMetadata(): void {
  seekToLoopStart()
}

function onEnded(): void {
  seekToLoopStart()
  if (canAutoplay.value) videoRef.value?.play().catch(() => {})
}

// Safari occasionally ignores the autoplay attribute when the src is bound after
// mount; nudging play() once the clip is loadable covers that case.
watch(canAutoplay, autoplay => {
  if (!autoplay) return
  seekToLoopStart()
  videoRef.value?.play().catch(() => {})
})

function onEnter(): void {
  setState(CURSOR_STATE.PLAY)
}

function onLeave(): void {
  reset()
}
</script>

<template>
  <div
    class="group relative block shrink-0 overflow-hidden rounded-sm bg-void"
    style="width: clamp(280px, 52vw, 820px); aspect-ratio: 16/9;"
    data-film-card
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Landscape clip — autoplays muted once the rail nears the viewport -->
    <video
      v-if="shouldLoad"
      ref="videoRef"
      :src="film.videoUrl"
      :poster="film.poster"
      :style="videoStyle"
      class="absolute inset-0 h-full w-full object-cover"
      :autoplay="canAutoplay"
      muted
      playsinline
      preload="metadata"
      aria-hidden="true"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
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
      {{ film.category }}
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
        class="font-display font-normal italic leading-tight text-text transition-transform duration-500 ease-out group-hover:-translate-y-1"
        style="font-size: clamp(22px, 3.2vw, 50px);"
      >
        {{ film.title }}
      </h3>

      <div class="mt-2 flex items-center gap-4">
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
          {{ film.category }}
        </span>
        <span v-if="film.duration" class="font-mono text-[9px] tracking-widest text-text-faint">
          {{ film.duration }}
        </span>
      </div>
    </div>
  </div>
</template>

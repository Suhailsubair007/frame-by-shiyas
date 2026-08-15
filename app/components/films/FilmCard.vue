<script setup lang="ts">
import { useCursorState }   from '@/composables/useCursorState'
import { useReducedMotion } from '@/composables/useReducedMotion'
import type { FILM }        from '@shared/types/Film'
import { CURSOR_STATE }     from '@shared/enums/CursorState'

const props = defineProps<{
  film: FILM
  index: number
  shouldLoad?: boolean
  // Autoplay this clip without a hover — set when the section parks the cursor on
  // it, so the first video reads as the active/playing one.
  active?: boolean
}>()

const { setState, reset }  = useCursorState()
const prefersReducedMotion = useReducedMotion()

const videoRef = ref<HTMLVideoElement | null>(null)

const indexLabel = computed(() => String(props.index + 1).padStart(2, '0'))

// Crops letterbox bars baked into the source clip; no-op when zoom is absent.
const videoStyle = computed(() =>
  props.film.zoom ? { transform: `scale(${props.film.zoom})` } : undefined,
)

// Until real thumbnails are supplied, park the idle clip on a frame near the
// middle so the card shows a representative still instead of a black/first frame.
function seekToPreviewFrame(): void {
  const video = videoRef.value
  if (!video || !Number.isFinite(video.duration) || video.duration === 0) return
  video.currentTime = video.duration / 2
}

function onLoadedMetadata(): void {
  // The card may already be active (section in view) before the clip finished
  // loading, so start playback here too.
  if (props.active && !prefersReducedMotion.value) {
    videoRef.value?.play().catch(() => {})
    return
  }
  // A real thumbnail poster, once supplied, is the idle image — don't override it.
  if (props.film.poster) return
  seekToPreviewFrame()
}

// Autoplay driven by the section (cursor parked on the first clip), independent
// of hover. Reduced-motion users keep the still.
watch(() => props.active, (isActive) => {
  const video = videoRef.value
  if (!video) return
  if (isActive && !prefersReducedMotion.value) {
    video.play().catch(() => {})
    return
  }
  video.pause()
  seekToPreviewFrame()
})

// Play only while hovered — no infinite autoplay. Reduced-motion users keep the
// still and the play cursor, but the clip stays paused.
function onEnter(): void {
  setState(CURSOR_STATE.PLAY)
  if (prefersReducedMotion.value) return
  videoRef.value?.play().catch(() => {})
}

function onLeave(): void {
  reset()
  const video = videoRef.value
  if (!video) return
  // The section-driven active clip keeps playing regardless of hover.
  if (props.active) return
  video.pause()
  seekToPreviewFrame()
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
    <!-- Landscape clip — parked on a mid-point still; plays on hover, pauses on leave -->
    <video
      v-if="shouldLoad"
      ref="videoRef"
      :src="film.videoUrl"
      :poster="film.poster"
      :style="videoStyle"
      class="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
      @loadedmetadata="onLoadedMetadata"
    />

    <!-- Bottom fade dissolves each clip into the section background. Built on the
         themed --color-void token, so it's black in dark mode and white in light. -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to top, var(--color-void), transparent 34%);"
      aria-hidden="true"
    />

    <!-- Index — bottom left, sitting over the fade -->
    <span
      class="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.25em] text-text-faint"
      aria-hidden="true"
    >
      {{ indexLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'

interface VIDEO_SOURCE {
  readonly src: string
  readonly type?: string
}

const props = withDefaults(defineProps<{
  src?:         string
  sources?:     VIDEO_SOURCE[]
  poster?:      string
  autoplay?:    boolean
  loop?:        boolean
  muted?:       boolean
  playsinline?: boolean
  preload?:     'none' | 'metadata' | 'auto'
  threshold?:   number
  fit?:         'cover' | 'contain'
  cursorPlay?:  boolean
  reveal?:      boolean
}>(), {
  autoplay:    true,
  loop:        true,
  muted:       true,
  playsinline: true,
  preload:     'none',
  threshold:   0.25,
  fit:         'cover',
  cursorPlay:  false,
  reveal:      false,
})

const emit = defineEmits<{
  play:  []
  pause: []
  ready: []
}>()

const videoRef      = ref<HTMLVideoElement | null>(null)
const isReady       = ref(false)
const isPlaying     = ref(false)
let   fallbackTimer = 0
const { setState, reset } = useCursorState()

// Vue's :muted binding sets the HTML attribute but not the DOM property.
// We also set the DOM property directly, since browsers check it for autoplay.
onMounted(() => {
  const el = videoRef.value
  if (!el) return
  if (props.muted) el.muted = true

  // Fallback: if the video hasn't fired any ready event within 5 s
  // (e.g. very large file, slow connection), show it anyway so the page
  // isn't stuck on a black screen / frozen poster.
  fallbackTimer = window.setTimeout(() => {
    if (!isReady.value) markReady()
  }, 5000)
})

// ── Intersection-observer-driven play / pause ────────────────────────────────
const { stop } = useIntersectionObserver(
  videoRef,
  ([entry]) => {
    const el = videoRef.value
    if (!el || !props.autoplay) return

    if (entry.isIntersecting) {
      // Ensure muted before every play attempt (some browsers reset it)
      if (props.muted) el.muted = true
      el.play().then(() => {
        isPlaying.value = true
        emit('play')
      }).catch(() => {
        // Autoplay blocked by browser policy — silently ignore
      })
    } else {
      el.pause()
      isPlaying.value = false
      emit('pause')
    }
  },
  { threshold: props.threshold },
)

// ── Ready state — show video as soon as first frame is decoded ───────────────
// loadeddata  → first frame available (much earlier than canplaythrough)
// canplaythrough → full buffer ready (may never fire for large files)
// playing     → fallback: video is definitely running, show it now
function markReady(): void {
  if (isReady.value) return
  isReady.value = true
  emit('ready')
}

onUnmounted(() => {
  stop()
  window.clearTimeout(fallbackTimer)
})
</script>

<template>
  <div
    class="relative overflow-hidden"
    :data-reveal="reveal || undefined"
    @mouseenter="cursorPlay ? setState(CURSOR_STATE.PLAY) : undefined"
    @mouseleave="cursorPlay ? reset() : undefined"
  >
    <!-- Poster shown until video is ready -->
    <img
      v-if="poster && !isReady"
      :src="poster"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full object-cover"
    />

    <video
      ref="videoRef"
      :loop="loop"
      :muted="muted"
      :playsinline="playsinline"
      :preload="preload"
      :poster="poster"
      :class="[
        'w-full h-full transition-opacity duration-700',
        fit === 'cover' ? 'object-cover' : 'object-contain',
        isReady ? 'opacity-100' : 'opacity-0',
      ]"
      @loadeddata="markReady"
      @canplaythrough="markReady"
      @playing="markReady"
    >
      <source
        v-for="s in sources"
        :key="s.src"
        :src="s.src"
        :type="s.type"
      />
      <source v-if="src && !sources" :src="src" />
    </video>
  </div>
</template>

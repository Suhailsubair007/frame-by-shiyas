<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'

interface VIDEO_SOURCE {
  readonly src: string
  readonly type?: string
}

const props = withDefaults(defineProps<{
  src?:        string
  sources?:    VIDEO_SOURCE[]
  poster?:     string
  autoplay?:   boolean
  loop?:       boolean
  muted?:      boolean
  playsinline?: boolean
  preload?:    'none' | 'metadata' | 'auto'
  threshold?:  number
  fit?:        'cover' | 'contain'
  cursorPlay?: boolean
  reveal?:     boolean
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
  play:   []
  pause:  []
  ready:  []
}>()

const videoRef  = ref<HTMLVideoElement | null>(null)
const isReady   = ref(false)
const isPlaying = ref(false)
const { setState, reset } = useCursorState()

// Intersection observer auto-play / auto-pause
const { stop } = useIntersectionObserver(
  videoRef,
  ([entry]) => {
    const el = videoRef.value
    if (!el || !props.autoplay) return

    if (entry.isIntersecting) {
      el.play().then(() => {
        isPlaying.value = true
        emit('play')
      }).catch(() => {
        // Autoplay blocked (common on mobile) — silently ignore
      })
    } else {
      el.pause()
      isPlaying.value = false
      emit('pause')
    }
  },
  { threshold: props.threshold },
)

function onCanPlay(): void {
  isReady.value = true
  emit('ready')
}

// loadeddata fires as soon as the first frame is decoded — much earlier than
// canplaythrough (which waits until the full stream can play without rebuffering).
// For a large 4K hero video canplaythrough may never fire on slow connections.
function onLoadedData(): void {
  isReady.value = true
  emit('ready')
}

onUnmounted(stop)
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
      @loadeddata="onLoadedData"
      @canplaythrough="onCanPlay"
    >
      <!-- Multiple sources for resolution/format fallbacks -->
      <source
        v-for="s in sources"
        :key="s.src"
        :src="s.src"
        :type="s.type"
      />
      <!-- Single src shorthand -->
      <source v-if="src && !sources" :src="src" />
    </video>
  </div>
</template>

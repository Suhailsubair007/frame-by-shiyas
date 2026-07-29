<script setup lang="ts">
import { gsap } from 'gsap'
import { useEventListener } from '@vueuse/core'
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { state, show, hide } = useCursorState()
const { hasPointer }        = useMediaQuery()
const prefersReducedMotion  = useReducedMotion()

const dotRef  = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)
const isActive = ref(false)

// gsap.quickTo gives us the smoothest possible cursor follow —
// it creates an optimised tween that updates every frame without recreating.
let xTo: ReturnType<typeof gsap.quickTo>
let yTo: ReturnType<typeof gsap.quickTo>

onMounted(() => {
  if (!hasPointer.value || prefersReducedMotion.value) return

  const ring = ringRef.value
  const dot  = dotRef.value
  if (!ring || !dot) return

  // Position off-screen initially so there's no flash at (0,0)
  gsap.set([ring, dot], { x: -200, y: -200 })

  xTo = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
  yTo = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

  document.documentElement.classList.add('has-custom-cursor')
  hide()
})

onUnmounted(() => {
  document.documentElement.classList.remove('has-custom-cursor')
})

useEventListener('mousemove', (e: MouseEvent) => {
  if (!hasPointer.value || prefersReducedMotion.value) return

  const dot = dotRef.value
  if (!dot) return

  // Dot follows exactly — no lag, instant feedback
  gsap.set(dot, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50 })

  // Ring follows with eased lag via quickTo
  xTo?.(e.clientX)
  yTo?.(e.clientY)

  if (!isActive.value) {
    isActive.value = true
    show()
    gsap.to([dotRef.value, ringRef.value], { opacity: 1, duration: 0.4 })
  }
})

// Morph ring shape and size based on cursor state
watch(state, (next) => {
  const ring = ringRef.value
  if (!ring) return

  const config: Record<CURSOR_STATE, gsap.TweenVars> = {
    [CURSOR_STATE.DEFAULT]: { scale: 1,   scaleX: 1, opacity: 1,   duration: 0.45, ease: 'power2.out' },
    [CURSOR_STATE.HOVER]:   { scale: 1.6, scaleX: 1, opacity: 0.7, duration: 0.35, ease: 'power2.out' },
    [CURSOR_STATE.VIEW]:    { scale: 3.2, scaleX: 1, opacity: 0.9, duration: 0.5,  ease: 'expo.out' },
    [CURSOR_STATE.DRAG]:    { scale: 1.2, scaleX: 2, opacity: 0.8, duration: 0.4,  ease: 'power2.out' },
    [CURSOR_STATE.PLAY]:    { scale: 2.8, scaleX: 1, opacity: 0.9, duration: 0.5,  ease: 'expo.out' },
    [CURSOR_STATE.HIDDEN]:  { scale: 0,   scaleX: 1, opacity: 0,   duration: 0.3,  ease: 'power2.in' },
  }

  gsap.to(ring, config[next])
})

const showLabel = computed(() =>
  state.value === CURSOR_STATE.VIEW
  || state.value === CURSOR_STATE.DRAG
  || state.value === CURSOR_STATE.PLAY,
)

const labelText = computed(() => {
  if (state.value === CURSOR_STATE.VIEW) return 'View'
  if (state.value === CURSOR_STATE.DRAG) return 'Drag'
  if (state.value === CURSOR_STATE.PLAY) return 'Play'
  return ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="hasPointer && !prefersReducedMotion"
      class="pointer-events-none fixed inset-0"
      style="z-index: var(--z-cursor);"
      aria-hidden="true"
    >
      <!-- Dot — exact position, instant -->
      <div
        ref="dotRef"
        class="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-text opacity-0"
        style="transform-origin: center; will-change: transform;"
      />

      <!-- Ring — lagged follow, morphs with state -->
      <div
        ref="ringRef"
        class="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-text opacity-0"
        style="transform-origin: center; will-change: transform; margin: -18px 0 0 -18px;"
      >
        <Transition name="cursor-label">
          <span
            v-if="showLabel"
            class="select-none font-mono text-[8px] uppercase tracking-widest text-text"
          >
            {{ labelText }}
          </span>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cursor-label-enter-active,
.cursor-label-leave-active {
  transition: opacity 0.2s ease;
}
.cursor-label-enter-from,
.cursor-label-leave-to {
  opacity: 0;
}
</style>

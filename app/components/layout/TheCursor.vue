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

// Idempotent and safe to re-attempt. hasPointer is a client-only media query, so
// the v-if below only puts dotRef/ringRef in the DOM a beat after this first runs.
// Reporting failure instead of giving up matters: if xTo is never assigned, the
// quickTo calls below become silent no-ops and the ring stays pinned at its CSS
// origin — the top-left corner.
function initFollow(): boolean {
  if (xTo) return true

  const ring = ringRef.value
  const dot  = dotRef.value
  if (!ring || !dot) return false

  // Position off-screen initially so there's no flash at (0,0).
  // Start ring at DEFAULT scale (0.3) so it's rasterised at its full 120 px
  // natural size from the first frame — all state transitions only scale down.
  gsap.set([ring, dot], { x: -200, y: -200 })
  gsap.set(ring, { scale: 0.3 })

  xTo = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
  yTo = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

  document.documentElement.classList.add('has-custom-cursor')
  hide()
  return true
}

// flush: 'post' runs the callback after the DOM patch, so the refs exist on the
// same pass where hasPointer first flips true.
watch(
  [hasPointer, prefersReducedMotion],
  () => {
    if (!hasPointer.value || prefersReducedMotion.value) return
    initFollow()
  },
  { immediate: true, flush: 'post' },
)

// ── Pointer follow — coalesced to one update per animation frame ──────────────
// Native mousemove can fire far more often than the display refreshes; writing the
// cursor transform on every event is wasted work. We stash the latest coordinates
// and apply them once per rAF, so the cursor never does more than one write per frame.
let pointerX  = 0
let pointerY  = 0
let moveRafId = 0

function flushPointer(): void {
  moveRafId = 0

  // The watch above can fire before Teleport patches the refs into the DOM, so
  // retry here — the first real pointer frame is the latest point at which the
  // cursor markup is guaranteed to exist.
  if (!initFollow()) return

  const dot = dotRef.value
  if (!dot) return

  // Dot follows exactly — no lag, instant feedback
  gsap.set(dot, { x: pointerX, y: pointerY, xPercent: -50, yPercent: -50 })

  // Ring follows with eased lag via quickTo
  xTo?.(pointerX)
  yTo?.(pointerY)

  if (!isActive.value) {
    isActive.value = true
    show()
    gsap.to([dotRef.value, ringRef.value], { opacity: 1, duration: 0.4 })
  }
}

useEventListener('mousemove', (e: MouseEvent) => {
  if (!hasPointer.value || prefersReducedMotion.value) return

  pointerX = e.clientX
  pointerY = e.clientY

  if (moveRafId) return
  moveRafId = requestAnimationFrame(flushPointer)
})

onUnmounted(() => {
  if (moveRafId) cancelAnimationFrame(moveRafId)
  document.documentElement.classList.remove('has-custom-cursor')
})

// Morph ring shape and size based on cursor state
watch(state, (next) => {
  const ring = ringRef.value
  if (!ring) return

  // Ring natural size is 120 px. All scale values are relative to that.
  // Visual size = 120 × scale. We never exceed scale 1 so the GPU only
  // downscales the compositor layer — keeping every state crisp.
  //   DEFAULT → 120 × 0.30 = 36 px  (same visual as before)
  //   HOVER   → 120 × 0.48 = 58 px
  //   VIEW    → 120 × 0.96 = 115 px
  //   DRAG    → 120 × 0.36 = 43 px tall, 120 × 0.60 = 72 px wide
  //   PLAY    → 120 × 0.84 = 101 px
  const config: Record<CURSOR_STATE, gsap.TweenVars> = {
    [CURSOR_STATE.DEFAULT]: { scale: 0.3,  scaleX: 0.3,  opacity: 1,   duration: 0.45, ease: 'power2.out' },
    [CURSOR_STATE.HOVER]:   { scale: 0.48, scaleX: 0.48, opacity: 0.7, duration: 0.35, ease: 'power2.out' },
    [CURSOR_STATE.VIEW]:    { scale: 0.96, scaleX: 0.96, opacity: 0.9, duration: 0.5,  ease: 'expo.out'   },
    [CURSOR_STATE.DRAG]:    { scale: 0.36, scaleX: 0.6,  opacity: 0.8, duration: 0.4,  ease: 'power2.out' },
    [CURSOR_STATE.PLAY]:    { scale: 0.84, scaleX: 0.84, opacity: 0.9, duration: 0.5,  ease: 'expo.out'   },
    [CURSOR_STATE.HIDDEN]:  { scale: 0,    scaleX: 0,    opacity: 0,   duration: 0.3,  ease: 'power2.in'  },
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

      <!-- Ring — lagged follow, morphs with state.
           Natural size 120 px so GPU always downscales the compositor layer,
           keeping the border and label crisp at every state. -->
      <div
        ref="ringRef"
        class="absolute left-0 top-0 flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-text opacity-0"
        style="transform-origin: center; will-change: transform; margin: -60px 0 0 -60px;"
      >
        <Transition name="cursor-label">
          <span
            v-if="showLabel"
            class="select-none font-mono text-[27px] uppercase tracking-widest text-text"
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

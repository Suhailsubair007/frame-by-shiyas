<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useLenis } from '@/composables/useLenis'
import { ANIMATION } from '@shared/constants/ANIMATION'

const prefersReducedMotion = useReducedMotion()
const { stop, start, scrollToTop } = useLenis()

const curtainRef   = ref<HTMLElement | null>(null)
const route        = useRoute()
const isAnimating  = ref(false)

// Page leave — curtain sweeps in from bottom, covering the old page
function onBeforeLeave(): void {
  if (prefersReducedMotion.value) return
  isAnimating.value = true
  stop()

  const curtain = curtainRef.value
  if (!curtain) return

  gsap.fromTo(
    curtain,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
    },
  )
}

// New page enters — curtain sweeps out upward revealing new content
function onEnter(el: Element, done: () => void): void {
  if (prefersReducedMotion.value) {
    done()
    return
  }

  scrollToTop(true)

  const curtain = curtainRef.value
  if (!curtain) {
    done()
    return
  }

  gsap.to(curtain, {
    yPercent: -100,
    duration: ANIMATION.DURATION.CINEMATIC,
    ease:     ANIMATION.EASE.CINEMA,
    delay:    0.1,
    onComplete: () => {
      gsap.set(curtain, { yPercent: 100 })
      isAnimating.value = false
      start()
      ScrollTrigger.refresh()
      done()
    },
  })
}

function onAfterEnter(): void {
  isAnimating.value = false
}

// Expose isAnimating so nav can disable links during transition
defineExpose({ isAnimating: readonly(isAnimating) })
</script>

<template>
  <div class="relative">
    <!-- Transition curtain — sits above content, animates in/out on route change -->
    <div
      ref="curtainRef"
      class="pointer-events-none fixed inset-0 bg-void"
      style="z-index: var(--z-modal); transform: translateY(100%);"
      aria-hidden="true"
    />

    <Transition
      mode="out-in"
      :css="false"
      @before-leave="onBeforeLeave"
      @enter="onEnter"
      @after-enter="onAfterEnter"
    >
      <!-- Keyed wrapper guarantees Transition always sees a single element child.
           Without it, RouterView can resolve to a comment node mid-swap, which
           Transition cannot animate ("non-element root node" warning). -->
      <div :key="route.path">
        <slot />
      </div>
    </Transition>
  </div>
</template>

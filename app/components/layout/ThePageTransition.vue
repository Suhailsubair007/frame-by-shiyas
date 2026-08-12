<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useLenis } from '@/composables/useLenis'
import { ANIMATION } from '@shared/constants/ANIMATION'

const prefersReducedMotion = useReducedMotion()
const { stop, start, scrollToTop } = useLenis()

const curtainRef  = ref<HTMLElement | null>(null)
const route       = useRoute()
const isAnimating = ref(false)

// Leave — curtain sweeps up from the bottom to fully cover the outgoing page.
// Calling `done` is what tells Vue (mode="out-in") the leave has finished, so the
// page swap happens ONLY once the screen is covered — never mid-reveal. Running
// this on @leave (not @before-leave) is the difference: @before-leave cannot
// gate the swap, which left the reveal racing the cover and the curtain stuck.
function onLeave(_el: Element, done: () => void): void {
  if (prefersReducedMotion.value) {
    done()
    return
  }

  const curtain = curtainRef.value
  if (!curtain) {
    done()
    return
  }

  isAnimating.value = true
  stop()

  gsap.fromTo(
    curtain,
    { yPercent: 100 },
    {
      yPercent:   0,
      duration:   ANIMATION.DURATION.DEFAULT,
      ease:       ANIMATION.EASE.CINEMA,
      onComplete: done,
    },
  )
}

// Enter — the new page is already mounted behind the covering curtain. Jump to
// the top, then sweep the curtain off the top edge to reveal it, and restore
// scrolling once it is clear.
function onEnter(_el: Element, done: () => void): void {
  scrollToTop(true)

  if (prefersReducedMotion.value) {
    done()
    return
  }

  const curtain = curtainRef.value
  if (!curtain) {
    done()
    return
  }

  gsap.to(curtain, {
    yPercent: -100,
    duration: ANIMATION.DURATION.DEFAULT,
    ease:     ANIMATION.EASE.CINEMA,
    onComplete: () => {
      // Reset below the fold for the next navigation, restore scroll, and
      // recompute ScrollTrigger positions against the freshly revealed page.
      gsap.set(curtain, { yPercent: 100 })
      isAnimating.value = false
      start()
      ScrollTrigger.refresh()
      done()
    },
  })
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
      @leave="onLeave"
      @enter="onEnter"
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

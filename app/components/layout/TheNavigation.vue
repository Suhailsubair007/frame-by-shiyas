<script setup lang="ts">
import { gsap }             from 'gsap'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { ROUTES }           from '@shared/constants/ROUTES'
import type TheNavLogo      from '@/components/layout/TheNavLogo.vue'
import type TheNavToggle    from '@/components/layout/TheNavToggle.vue'

const prefersReducedMotion = useReducedMotion()
const route = useRoute()

// Archive pages carry their own "← Home" control, so the menu toggle is dropped
// there — no redundant top-right menu.
const isArchive = computed(
  () => route.path === ROUTES.PHOTOGRAPHY || route.path === ROUTES.FILMS,
)

const logoRef   = ref<InstanceType<typeof TheNavLogo> | null>(null)
const toggleRef = ref<InstanceType<typeof TheNavToggle> | null>(null)
const navRef    = ref<HTMLElement | null>(null)

// Mount animation — logo and toggle slide in from their respective edges
onMounted(() => {
  if (prefersReducedMotion.value) return

  const logo   = logoRef.value?.rootRef
  const toggle = toggleRef.value?.rootRef

  if (logo) {
    gsap.fromTo(
      logo,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.6 },
    )
  }
  if (toggle) {
    gsap.fromTo(
      toggle,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.6 },
    )
  }
})
</script>

<template>
  <header ref="navRef" class="fixed left-0 right-0 top-0 z-sticky">
    <!-- Permanent legibility scrim — a fixed, subtle top gradient replaces the old
         scroll-toggled backdrop + border, so there's no flickering and no white
         hairline appearing as you cross the scroll threshold. -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/60 to-transparent"
      aria-hidden="true"
    />

    <div class="relative flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
      <TheNavLogo ref="logoRef" />
      <TheNavToggle v-if="!isArchive" ref="toggleRef" />
    </div>

    <!-- Full-screen menu overlay — mounted once, animated in/out -->
    <TheNavMenu />
  </header>
</template>

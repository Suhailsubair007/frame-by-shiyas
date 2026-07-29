<script setup lang="ts">
import { gsap }             from 'gsap'
import { useWindowScroll }  from '@vueuse/core'
import { useMenuState }     from '@/composables/useMenuState'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isOpen }           = useMenuState()
const prefersReducedMotion = useReducedMotion()

const logoRef   = ref<InstanceType<typeof import('@/components/layout/TheNavLogo.vue')['default']> | null>(null)
const toggleRef = ref<InstanceType<typeof import('@/components/layout/TheNavToggle.vue')['default']> | null>(null)
const navRef    = ref<HTMLElement | null>(null)

// Scroll-reactive backdrop
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 60)

// Mount animation — logo and toggle slide in from their respective edges
onMounted(() => {
  if (prefersReducedMotion.value) return

  const logo   = logoRef.value?.rootRef
  const toggle = toggleRef.value?.rootRef

  if (!logo || !toggle) return

  gsap.fromTo(
    logo,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.6 },
  )
  gsap.fromTo(
    toggle,
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.6 },
  )
})
</script>

<template>
  <header
    ref="navRef"
    class="fixed left-0 right-0 top-0 z-sticky"
    :class="[
      'transition-all duration-500',
      isScrolled && !isOpen
        ? 'border-b border-border bg-void/80 backdrop-blur-md'
        : 'bg-transparent',
    ]"
  >
    <div class="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
      <TheNavLogo ref="logoRef" />
      <TheNavToggle ref="toggleRef" />
    </div>

    <!-- Full-screen menu overlay — mounted once, animated in/out -->
    <TheNavMenu />
  </header>
</template>

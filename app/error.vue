<script setup lang="ts">
import { gsap } from 'gsap'
import { useSplitText } from '@/composables/useSplitText'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION } from '@shared/constants/ANIMATION'
import { META } from '@shared/constants/META'

interface NuxtError {
  url?: string
  statusCode: number
  statusMessage?: string
  message?: string
}

const props = defineProps<{
  error: NuxtError
}>()

const prefersReducedMotion = useReducedMotion()
const { scramble }         = useSplitText()

const eyebrowRef = ref<HTMLElement | null>(null)
const numberRef  = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const bodyRef    = ref<HTMLElement | null>(null)
const ctaRef     = ref<HTMLElement | null>(null)

let floatTween: gsap.core.Tween | null = null

const pageSubheading = computed((): string => {
  const map: Partial<Record<number, string>> = {
    403: 'Access Forbidden',
    404: 'Not Found',
    500: 'Server Error',
    503: 'Unavailable',
  }
  return map[props.error.statusCode] ?? 'Something Went Wrong'
})

const pageDescription = computed((): string => {
  if (props.error.statusCode === 404) {
    return "The frame you're looking for has been moved, removed, or never existed."
  }
  return 'Something went wrong on our end. Please try again in a moment.'
})

onMounted(() => {
  nextTick(() => {
    if (prefersReducedMotion.value) {
      const all = [eyebrowRef.value, numberRef.value, dividerRef.value, headingRef.value, bodyRef.value, ctaRef.value]
        .filter((el): el is HTMLElement => el !== null)
      gsap.set(all, { opacity: 1, y: 0, scaleX: 1 })
      return
    }

    if (eyebrowRef.value) {
      gsap.fromTo(
        eyebrowRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.2 },
      )
    }

    if (numberRef.value) {
      // Make parent visible so SplitType char spans are visible
      gsap.set(numberRef.value, { opacity: 1 })

      scramble(numberRef, {
        delay: 0.35,
        duration: ANIMATION.DURATION.SLOW,
        stagger: ANIMATION.STAGGER.WIDE,
        ease: ANIMATION.EASE.EXPO_OUT,
      })

      // Gentle infinite float begins after the scramble completes
      floatTween = gsap.to(numberRef.value, {
        y: -18,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      })
    }

    if (dividerRef.value) {
      gsap.fromTo(
        dividerRef.value,
        { scaleX: 0 },
        { scaleX: 1, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 1.2, transformOrigin: 'center' },
      )
    }

    if (headingRef.value) {
      gsap.fromTo(
        headingRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 1.35 },
      )
    }

    if (bodyRef.value) {
      gsap.fromTo(
        bodyRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 1.55 },
      )
    }

    if (ctaRef.value) {
      gsap.fromTo(
        ctaRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 1.75 },
      )
    }
  })
})

onUnmounted(() => {
  floatTween?.kill()
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-x-hidden bg-void text-text antialiased">

    <!-- Film grain texture — maintains visual consistency with the rest of the site -->
    <TheGrainOverlay />

    <!-- Top border rule -->
    <div class="mx-6 h-px bg-border md:mx-10" aria-hidden="true" />

    <main
      class="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center md:px-10"
    >

      <!-- Eyebrow label -->
      <p
        ref="eyebrowRef"
        class="mb-8 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
      >
        — Error {{ error.statusCode }} —
      </p>

      <!-- Giant status code — hero typographic element, aria-hidden as it's decorative -->
      <div
        ref="numberRef"
        class="select-none font-display font-normal leading-none text-text opacity-0"
        style="font-size: clamp(110px, 22vw, 340px);"
        aria-hidden="true"
      >
        {{ error.statusCode }}
      </div>

      <!-- Thin decorative divider -->
      <div
        ref="dividerRef"
        class="my-10 h-px w-14 bg-border-strong"
        aria-hidden="true"
      />

      <!-- Semantic page heading -->
      <h1
        ref="headingRef"
        class="mb-6 font-display font-normal leading-tight text-text opacity-0"
        style="font-size: clamp(26px, 4vw, 56px);"
      >
        Page <em>{{ pageSubheading }}</em>
      </h1>

      <!-- Description -->
      <p
        ref="bodyRef"
        class="mb-12 max-w-[36ch] font-sans text-sm font-light leading-relaxed text-text-muted opacity-0"
      >
        {{ pageDescription }}
      </p>

      <!-- Return home CTA -->
      <div ref="ctaRef" class="opacity-0">
        <BaseButton href="/">
          Return Home
        </BaseButton>
      </div>

    </main>

    <!-- Footer bar — copyright -->
    <footer class="flex items-center border-t border-border px-6 py-6 md:px-10">
      <p class="font-mono text-[9px] text-text-faint">
        © {{ new Date().getFullYear() }} {{ META.SITE_NAME }}. All rights reserved.
      </p>
    </footer>

  </div>
</template>

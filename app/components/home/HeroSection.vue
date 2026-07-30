<script setup lang="ts">
import SplitType            from 'split-type'
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

defineProps<{
  videoSrc?:    string
  videoPoster?: string
  imageSrc?:    string
}>()

const { isComplete }       = usePreloader()
const prefersReducedMotion = useReducedMotion()

// Only one ref needed — the h1 for SplitType
const titleRef = ref<HTMLElement | null>(null)

const sel = (k: string): string => `[data-hero="${k}"]`

let split:          SplitType | null        = null
let scrollLineAnim: gsap.core.Tween | null  = null
let animateInPending = false
let fallbackTimer:   ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const wasAlreadyComplete = isComplete.value

  nextTick(() => {
    if (wasAlreadyComplete || prefersReducedMotion.value) {
      startScrollLoop()
      return
    }

    gsap.set([sel('name'), sel('roles'), sel('scroll')], { opacity: 0 })
    gsap.set([sel('rule-l'), sel('rule-r'), sel('divider')], { scaleX: 0 })
    gsap.set('.vf-corner', { opacity: 0 })

    const title = titleRef.value
    if (title) {
      split = new SplitType(title, { types: 'lines,words' })
      split.lines?.forEach(line => {
        line.style.overflow = 'hidden'
        line.style.display  = 'block'
      })
      gsap.set(split.words ?? [], { y: '105%' })
    }

    animateInPending = true

    if (isComplete.value) {
      animateInPending = false
      animateIn()
      return
    }

    fallbackTimer = setTimeout(() => {
      if (!animateInPending) return
      animateInPending = false
      animateIn()
    }, 6000)
  })
})

watch(() => isComplete.value, (done) => {
  if (!done || !animateInPending) return
  animateInPending = false
  if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null }
  nextTick(() => animateIn())
})

function animateIn(): void {
  if (prefersReducedMotion.value) {
    gsap.set([sel('name'), sel('roles'), sel('scroll')], { opacity: 1 })
    gsap.set([sel('rule-l'), sel('rule-r'), sel('divider')], { scaleX: 1 })
    gsap.set('.vf-corner', { opacity: 1 })
    gsap.set(split?.words ?? [], { y: 0 })
    startScrollLoop()
    return
  }

  const tl = gsap.timeline({ delay: 0.05, onComplete: startScrollLoop })

  tl
    .to('.vf-corner', {
      opacity:  1,
      duration: ANIMATION.DURATION.SLOW,
      stagger:  0.05,
      ease:     'none',
    }, 0)
    .to(sel('rule-l'), {
      scaleX:          1,
      transformOrigin: 'right center',
      duration:        ANIMATION.DURATION.DEFAULT,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 0.2)
    .to(sel('rule-r'), {
      scaleX:          1,
      transformOrigin: 'left center',
      duration:        ANIMATION.DURATION.DEFAULT,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 0.2)
    .to(sel('name'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     'none',
    }, 0.38)
    .to(split?.words ?? [], {
      y:        0,
      duration: ANIMATION.DURATION.CINEMATIC,
      stagger:  0.09,
      ease:     ANIMATION.EASE.EXPO_OUT,
    }, 0.52)
    .to(sel('divider'), {
      scaleX:          1,
      transformOrigin: 'left center',
      duration:        ANIMATION.DURATION.SLOW,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 0.9)
    .to(sel('roles'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     'none',
    }, 1.05)
    .to(sel('scroll'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     'none',
    }, 1.2)
}

function startScrollLoop(): void {
  if (scrollLineAnim) return
  const line = document.querySelector<HTMLElement>(`${sel('scroll')} .scroll-line`)
  if (!line || prefersReducedMotion.value) return

  scrollLineAnim = gsap.fromTo(
    line,
    { scaleY: 0, transformOrigin: 'top center' },
    {
      scaleY:      1,
      duration:    1.3,
      ease:        ANIMATION.EASE.INOUT,
      repeat:      -1,
      repeatDelay: 0.5,
      onRepeat()   { gsap.set(line, { scaleY: 0 }) },
    },
  )
}

onUnmounted(() => {
  split?.revert()
  scrollLineAnim?.kill()
  if (fallbackTimer) clearTimeout(fallbackTimer)
})
</script>

<template>
  <section
    class="relative h-dvh w-full overflow-hidden"
    aria-label="Hero — Frame by Shiyas"
  >
    <!-- ── Background ─────────────────────────────────────────── -->
    <div class="absolute inset-0">
      <BaseVideo
        v-if="videoSrc"
        :src="videoSrc"
        :poster="videoPoster ?? imageSrc"
        preload="auto"
        :threshold="0"
        :eager="true"
        fit="cover"
        class="h-full w-full"
      />
      <img
        v-else-if="imageSrc"
        :src="imageSrc"
        alt=""
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
        class="h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div v-else class="h-full w-full bg-void" />

      <!-- Minimal veil — centre stays clear so the video owns the screen -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(180deg, oklch(4% 0 0 / 0.65) 0%, transparent 18%, transparent 54%, oklch(4% 0 0 / 0.88) 100%);"
        aria-hidden="true"
      />
    </div>

    <!-- ── Outer luxury frame line ────────────────────────────── -->
    <div
      class="pointer-events-none absolute inset-0 border border-border"
      aria-hidden="true"
    />

    <!-- ── Viewfinder corner brackets ────────────────────────── -->
    <div aria-hidden="true">
      <!-- top-left -->
      <div class="vf-corner absolute left-6 top-24 md:left-10 md:top-28">
        <div class="h-px w-5 bg-border-strong" />
        <div class="h-5 w-px bg-border-strong" />
      </div>
      <!-- top-right -->
      <div class="vf-corner absolute right-6 top-24 flex flex-col items-end md:right-10 md:top-28">
        <div class="h-px w-5 bg-border-strong" />
        <div class="h-5 w-px bg-border-strong" />
      </div>
      <!-- bottom-left -->
      <div class="vf-corner absolute bottom-20 left-6 flex flex-col-reverse md:bottom-28 md:left-10">
        <div class="h-px w-5 bg-border-strong" />
        <div class="h-5 w-px bg-border-strong" />
      </div>
      <!-- bottom-right -->
      <div class="vf-corner absolute bottom-20 right-6 flex flex-col-reverse items-end md:bottom-28 md:right-10">
        <div class="h-px w-5 bg-border-strong" />
        <div class="h-5 w-px bg-border-strong" />
      </div>
    </div>

    <!-- ── Top strip: name centred between hairline rules ────── -->
    <div class="absolute left-14 right-14 top-24 flex items-center gap-5 md:left-20 md:right-20 md:top-28">
      <div
        data-hero="rule-l"
        class="h-px flex-1 bg-border"
        aria-hidden="true"
      />
      <p
        data-hero="name"
        class="shrink-0 font-mono text-[8px] uppercase tracking-[0.42em] text-text-faint"
      >
        Muhammed Shiyas
      </p>
      <div
        data-hero="rule-r"
        class="h-px flex-1 bg-border"
        aria-hidden="true"
      />
    </div>

    <!-- ── Bottom content ─────────────────────────────────────── -->
    <div class="absolute inset-x-6 bottom-20 md:inset-x-10 md:bottom-28">
      <!-- Divider wipes left → right -->
      <div
        data-hero="divider"
        class="mb-5 h-px w-full bg-border"
        aria-hidden="true"
      />

      <div class="flex items-end justify-between">
        <h1
          ref="titleRef"
          class="font-display font-normal italic leading-[0.87] text-text"
          style="font-size: clamp(46px, 6.5vw, 112px);"
        >
          Visual<br />Storyteller
        </h1>

        <div
          data-hero="roles"
          class="hidden flex-col items-end gap-1.5 pb-0.5 md:flex"
          aria-hidden="true"
        >
          <span class="font-mono text-[9px] uppercase tracking-[0.28em] text-text-faint">Videographer</span>
          <span class="font-mono text-[9px] uppercase tracking-[0.28em] text-text-faint">&amp; Photographer</span>
          <span class="mt-2.5 font-mono text-[8px] uppercase tracking-[0.28em] text-text-faint opacity-50">Kerala, India</span>
        </div>
      </div>
    </div>

    <!-- ── Scroll indicator ───────────────────────────────────── -->
    <div
      data-hero="scroll"
      class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span class="font-mono text-[7px] uppercase tracking-[0.35em] text-text-faint">Scroll</span>
      <div class="relative h-10 w-px overflow-hidden bg-border">
        <div class="scroll-line absolute inset-0 origin-top scale-y-0 bg-accent" />
      </div>
    </div>
  </section>
</template>

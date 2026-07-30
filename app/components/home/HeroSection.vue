<script setup lang="ts">
import SplitType            from 'split-type'
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { HERO }             from '@shared/constants/HERO'
import { META }             from '@shared/constants/META'

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

const FRAME_HIDDEN  = 'inset(100% 0 0 0)'
const FRAME_VISIBLE = 'inset(0% 0 0 0)'

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
    gsap.set(sel('frame'), { clipPath: FRAME_HIDDEN })

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
    gsap.set(sel('frame'), { clipPath: FRAME_VISIBLE })
    gsap.set(split?.words ?? [], { y: 0 })
    startScrollLoop()
    return
  }

  const tl = gsap.timeline({ delay: 0.05, onComplete: startScrollLoop })

  tl
    // The frame is the subject, so it wipes open first and everything else
    // assembles around it.
    .to(sel('frame'), {
      clipPath: FRAME_VISIBLE,
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
    }, 0)
    .to('.vf-corner', {
      opacity:  1,
      duration: ANIMATION.DURATION.SLOW,
      stagger:  ANIMATION.STAGGER.TIGHT,
      ease:     ANIMATION.EASE.NONE,
    }, 0.45)
    .to(sel('rule-l'), {
      scaleX:          1,
      transformOrigin: 'right center',
      duration:        ANIMATION.DURATION.DEFAULT,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 0.5)
    .to(sel('rule-r'), {
      scaleX:          1,
      transformOrigin: 'left center',
      duration:        ANIMATION.DURATION.DEFAULT,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 0.5)
    .to(sel('name'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     ANIMATION.EASE.NONE,
    }, 0.62)
    .to(split?.words ?? [], {
      y:        0,
      duration: ANIMATION.DURATION.CINEMATIC,
      stagger:  0.09,
      ease:     ANIMATION.EASE.EXPO_OUT,
    }, 0.72)
    .to(sel('divider'), {
      scaleX:          1,
      transformOrigin: 'left center',
      duration:        ANIMATION.DURATION.SLOW,
      ease:            ANIMATION.EASE.EXPO_OUT,
    }, 1.05)
    .to(sel('roles'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     ANIMATION.EASE.NONE,
    }, 1.2)
    .to(sel('scroll'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     ANIMATION.EASE.NONE,
    }, 1.35)
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
    class="relative h-dvh w-full overflow-hidden bg-void"
    :aria-label="HERO.A11Y_LABEL"
  >
    <!-- ── Outer luxury frame line ────────────────────────────── -->
    <div
      class="pointer-events-none absolute inset-0 border border-border"
      aria-hidden="true"
    />

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
        {{ META.OWNER }}
      </p>
      <div
        data-hero="rule-r"
        class="h-px flex-1 bg-border"
        aria-hidden="true"
      />
    </div>

    <!-- ── Portrait frame — the work is shot vertical, so the frame is ──
         9:16 and its height drives its width. It never inherits the
         viewport's shape, which is what forced a landscape crop before. -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div
        data-hero="frame"
        class="relative aspect-[9/16] h-[70vh] max-h-[860px] max-w-[calc(100vw-3rem)]"
      >
        <div class="relative h-full w-full overflow-hidden rounded-2xl bg-surface">
          <BaseVideo
            v-if="videoSrc"
            :src="videoSrc"
            :poster="videoPoster ?? imageSrc"
            preload="auto"
            :threshold="0"
            :eager="true"
            fit="cover"
            position="center"
            class="h-full w-full"
          />
          <img
            v-else-if="imageSrc"
            :src="imageSrc"
            alt=""
            width="1080"
            height="1920"
            fetchpriority="high"
            decoding="async"
            class="h-full w-full object-cover object-center"
            aria-hidden="true"
          />

          <!-- Keeps the display type legible where it overlaps the frame
               on narrow viewports -->
          <div class="hero-veil absolute inset-0" aria-hidden="true" />
        </div>

        <!-- Viewfinder brackets hug the frame, not the screen -->
        <div aria-hidden="true">
          <div
            v-for="corner in HERO.FRAME_CORNERS"
            :key="corner"
            class="vf-corner absolute flex"
            :class="corner"
          >
            <div class="h-px w-5 bg-border-strong" />
            <div class="h-5 w-px bg-border-strong" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Display type — overlays the frame on narrow viewports,
             flanks it from lg up ──────────────────────────────── -->
    <h1
      ref="titleRef"
      class="absolute bottom-32 left-6 font-display text-[clamp(44px,5.6vw,104px)] font-normal italic leading-[0.87] text-text lg:bottom-auto lg:left-10 lg:top-1/2 lg:-translate-y-1/2"
    >
      {{ HERO.HEADING_TOP }}<br />{{ HERO.HEADING_FOOT }}
    </h1>

    <div
      data-hero="roles"
      class="absolute right-10 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-1.5 lg:flex"
      aria-hidden="true"
    >
      <span
        v-for="role in HERO.ROLES"
        :key="role"
        class="font-mono text-[9px] uppercase tracking-[0.28em] text-text-faint"
      >
        {{ role }}
      </span>
      <span class="mt-2.5 font-mono text-[8px] uppercase tracking-[0.28em] text-text-faint opacity-50">
        {{ META.LOCATION }}
      </span>
    </div>

    <!-- ── Bottom divider ─────────────────────────────────────── -->
    <div
      data-hero="divider"
      class="absolute inset-x-6 bottom-20 h-px bg-border md:inset-x-10 md:bottom-28"
      aria-hidden="true"
    />

    <!-- ── Scroll indicator ───────────────────────────────────── -->
    <div
      data-hero="scroll"
      class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span class="font-mono text-[7px] uppercase tracking-[0.35em] text-text-faint">
        {{ HERO.SCROLL_LABEL }}
      </span>
      <div class="relative h-10 w-px overflow-hidden bg-border">
        <div class="scroll-line absolute inset-0 origin-top scale-y-0 bg-accent" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Tailwind cannot express a multi-stop oklch gradient without an unreadable
   arbitrary value, so the veil lives here rather than inline. */
.hero-veil {
  background: linear-gradient(
    180deg,
    oklch(4% 0 0 / 0.35) 0%,
    transparent 22%,
    transparent 48%,
    oklch(4% 0 0 / 0.9) 100%
  );
}
</style>

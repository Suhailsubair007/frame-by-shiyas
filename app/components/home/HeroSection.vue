<script setup lang="ts">
import SplitType            from 'split-type'
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { CURSOR_STATE }     from '@shared/enums/CursorState'
import { useCursorState }   from '@/composables/useCursorState'

const props = defineProps<{
  videoSrc?:    string
  videoPoster?: string
}>()

const { isComplete }       = usePreloader()
const prefersReducedMotion = useReducedMotion()
const { setState, reset }  = useCursorState()

const sectionRef    = ref<HTMLElement | null>(null)
const videoWrapRef  = ref<HTMLElement | null>(null)
const titleRef      = ref<HTMLElement | null>(null)
const rolesRef      = ref<HTMLElement | null>(null)
const scrollRef     = ref<HTMLElement | null>(null)

let split: SplitType | null = null

// ── Entry animation — runs once preloader signals complete ──────────────────
watch(isComplete, (done) => {
  if (!done) return
  nextTick(() => animateIn())
})

// Also handle direct page load when preloader was skipped (returning visitor)
onMounted(() => {
  if (isComplete.value) nextTick(() => animateIn())
})

function animateIn(): void {
  const video    = videoWrapRef.value
  const title    = titleRef.value
  const roles    = rolesRef.value
  const scroll   = scrollRef.value

  if (prefersReducedMotion.value) {
    gsap.set([video, title, roles, scroll], { opacity: 1, y: 0, clipPath: 'none' })
    return
  }

  // Split title into individual words for the wipe reveal
  if (title) {
    split = new SplitType(title, { types: 'words' })
    split.words?.forEach(w => {
      const parent = w.parentElement
      if (parent) {
        parent.style.overflow = 'hidden'
        parent.style.display  = 'block'
      }
    })
  }

  const tl = gsap.timeline({ delay: 0.1 })

  tl
    // Video fades in — the cinematic foundation
    .fromTo(video,
      { opacity: 0 },
      { opacity: 1, duration: ANIMATION.DURATION.CINEMATIC, ease: 'none' },
      0,
    )
    // Words wipe up one by one
    .fromTo(
      split?.words ?? [],
      { y: '115%' },
      {
        y:        0,
        duration: ANIMATION.DURATION.CINEMATIC,
        stagger:  0.12,
        ease:     ANIMATION.EASE.EXPO_OUT,
      },
      0.4,
    )
    // Roles fade in
    .fromTo(roles,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT },
      1.0,
    )
    // Scroll indicator fades in last
    .fromTo(scroll,
      { opacity: 0 },
      { opacity: 1, duration: ANIMATION.DURATION.DEFAULT, ease: 'none' },
      1.4,
    )
}

// Scroll indicator line animation — loops indefinitely
onMounted(() => {
  const line = scrollRef.value?.querySelector<HTMLElement>('.scroll-line')
  if (!line || prefersReducedMotion.value) return

  gsap.fromTo(
    line,
    { scaleY: 0, transformOrigin: 'top center' },
    {
      scaleY:   1,
      duration: 1.2,
      ease:     ANIMATION.EASE.INOUT,
      repeat:   -1,
      repeatDelay: 0.4,
      yoyo: false,
      onRepeat() {
        gsap.set(line, { scaleY: 0 })
      },
    },
  )
})

onUnmounted(() => {
  split?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative flex h-dvh w-full flex-col overflow-hidden"
    aria-label="Hero — Frame by Shiyas"
  >
    <!-- ── Video background ─────────────────────────────────────────────── -->
    <div
      ref="videoWrapRef"
      class="absolute inset-0 opacity-0"
    >
      <BaseVideo
        v-if="videoSrc"
        :src="videoSrc"
        :poster="videoPoster"
        fit="cover"
        class="h-full w-full"
      />

      <!-- Fallback gradient when no video is provided -->
      <div
        v-else
        class="h-full w-full"
        style="background: radial-gradient(ellipse 120% 100% at 60% 40%, oklch(14% 0 0) 0%, oklch(4% 0 0) 70%);"
      />

      <!-- Gradient veil — ensures text is always legible -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom, oklch(4% 0 0 / 0.1) 0%, transparent 25%, oklch(4% 0 0 / 0.55) 70%, oklch(4% 0 0 / 0.95) 100%);"
        aria-hidden="true"
      />
    </div>

    <!-- ── Content block — sits at the bottom of the hero ──────────────── -->
    <div class="relative mt-auto flex items-end justify-between px-6 pb-20 md:px-10 md:pb-24">

      <!-- Left — primary headline -->
      <div>
        <!-- Eyebrow -->
        <p class="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint">
          Muhammed Shiyas
        </p>

        <!-- H1 — each word in its own overflow:hidden container -->
        <h1
          ref="titleRef"
          class="font-display font-light italic leading-[0.92] text-text"
          style="font-size: clamp(64px, 9.5vw, 158px);"
        >
          <!-- Words are split by SplitType — initial state set by GSAP -->
          Visual<br />Storyteller
        </h1>
      </div>

      <!-- Right — roles block -->
      <div
        ref="rolesRef"
        class="hidden flex-col items-end gap-1 pb-1 opacity-0 md:flex"
        aria-hidden="true"
      >
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">Photographer</span>
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">Videographer</span>
      </div>
    </div>

    <!-- ── Scroll indicator ─────────────────────────────────────────────── -->
    <div
      ref="scrollRef"
      class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
      aria-hidden="true"
    >
      <span class="font-mono text-[8px] uppercase tracking-[0.3em] text-text-faint">Scroll</span>
      <div class="relative h-12 w-px overflow-hidden bg-border">
        <div class="scroll-line absolute inset-0 origin-top scale-y-0 bg-text-muted" />
      </div>
    </div>

    <!-- ── Decorative index mark — top right ───────────────────────────── -->
    <div
      class="absolute right-6 top-24 md:right-10 md:top-28"
      aria-hidden="true"
    >
      <span
        class="font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint"
        style="writing-mode: vertical-rl; letter-spacing: 0.25em;"
      >
        Visual Storyteller
      </span>
    </div>
  </section>
</template>

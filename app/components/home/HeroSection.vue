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

const sectionRef   = ref<HTMLElement | null>(null)
const videoWrapRef = ref<HTMLElement | null>(null)
const titleRef     = ref<HTMLElement | null>(null)
const rolesRef     = ref<HTMLElement | null>(null)
const scrollRef    = ref<HTMLElement | null>(null)
const eyebrowRef   = ref<HTMLElement | null>(null)
const indexRef     = ref<HTMLElement | null>(null)

let split: SplitType | null = null
let scrollLineAnim: gsap.core.Tween | null = null

// ── Set initial hidden states and prepare splits on mount ──────────────────
// Done here (not in animateIn) so elements are invisible
// before the preloader finishes — prevents any flash.
onMounted(() => {
  nextTick(() => {
    if (prefersReducedMotion.value) return

    // Hide elements that animate in later
    gsap.set([videoWrapRef.value, rolesRef.value, scrollRef.value, eyebrowRef.value, indexRef.value], {
      opacity: 0,
    })

    // Split and hide title words immediately
    const title = titleRef.value
    if (title) {
      split = new SplitType(title, { types: 'words' })
      split.words?.forEach(word => {
        const p = word.parentElement
        if (p) { p.style.overflow = 'hidden'; p.style.display = 'block' }
      })
      gsap.set(split.words ?? [], { y: '115%' })
    }
  })
})

// ── Run entry animation once preloader signals complete ────────────────────
watch(isComplete, (done) => {
  if (!done) return
  nextTick(() => animateIn())
})

// Returning visitors: preloader skips immediately — fire on mount if already done
onMounted(() => {
  if (isComplete.value) nextTick(() => animateIn())
})

function animateIn(): void {
  if (prefersReducedMotion.value) {
    gsap.set(
      [videoWrapRef.value, rolesRef.value, scrollRef.value, eyebrowRef.value, indexRef.value],
      { opacity: 1 },
    )
    gsap.set(split?.words ?? [], { y: 0 })
    startScrollLoop()
    return
  }

  const tl = gsap.timeline({ delay: 0.05, onComplete: startScrollLoop })

  tl
    // Video / gradient background
    .to(videoWrapRef.value, {
      opacity: 1, duration: ANIMATION.DURATION.CINEMATIC, ease: 'none',
    }, 0)

    // Eyebrow label
    .to(eyebrowRef.value, {
      opacity: 1, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT,
    }, 0.15)

    // Words wipe up
    .to(split?.words ?? [], {
      y:        0,
      duration: ANIMATION.DURATION.CINEMATIC,
      stagger:  0.1,
      ease:     ANIMATION.EASE.EXPO_OUT,
    }, 0.2)

    // Roles block
    .to(rolesRef.value, {
      opacity: 1, y: 0, duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASE.EXPO_OUT,
    }, 0.7)

    // Vertical index mark
    .to(indexRef.value, {
      opacity: 1, duration: ANIMATION.DURATION.DEFAULT, ease: 'none',
    }, 0.9)

    // Scroll indicator
    .to(scrollRef.value, {
      opacity: 1, duration: ANIMATION.DURATION.DEFAULT, ease: 'none',
    }, 1.1)
}

function startScrollLoop(): void {
  const line = scrollRef.value?.querySelector<HTMLElement>('.scroll-line')
  if (!line || prefersReducedMotion.value) return

  scrollLineAnim = gsap.fromTo(
    line,
    { scaleY: 0, transformOrigin: 'top center' },
    {
      scaleY:      1,
      duration:    1.2,
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
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative flex h-dvh w-full flex-col overflow-hidden"
    aria-label="Hero — Frame by Shiyas"
  >
    <!-- ── Background — video or gradient ─────────────────────────────── -->
    <div ref="videoWrapRef" class="absolute inset-0">
      <BaseVideo
        v-if="videoSrc"
        :src="videoSrc"
        :poster="videoPoster"
        preload="auto"
        fit="cover"
        class="h-full w-full"
      />

      <div
        v-else
        class="h-full w-full"
        style="background: radial-gradient(ellipse 120% 100% at 60% 40%, oklch(14% 0 0) 0%, oklch(4% 0 0) 70%);"
      />

      <!-- Gradient veil — text legibility over any footage -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom, oklch(4% 0 0 / 0.1) 0%, transparent 30%, oklch(4% 0 0 / 0.5) 65%, oklch(4% 0 0 / 0.95) 100%);"
        aria-hidden="true"
      />
    </div>

    <!-- ── Vertical index mark — top right ────────────────────────────── -->
    <div
      ref="indexRef"
      class="absolute right-6 top-24 md:right-10 md:top-28"
      aria-hidden="true"
    >
      <span
        class="font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint"
        style="writing-mode: vertical-rl;"
      >
        Visual Storyteller
      </span>
    </div>

    <!-- ── Bottom content ─────────────────────────────────────────────── -->
    <div class="relative mt-auto flex items-end justify-between px-6 pb-20 md:px-10 md:pb-24">

      <!-- Left — headline -->
      <div>
        <p
          ref="eyebrowRef"
          class="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint"
        >
          Muhammed Shiyas
        </p>

        <h1
          ref="titleRef"
          class="font-display font-light italic leading-[0.92] text-text"
          style="font-size: clamp(64px, 9.5vw, 158px);"
        >
          Visual<br />Storyteller
        </h1>
      </div>

      <!-- Right — roles -->
      <div
        ref="rolesRef"
        class="hidden flex-col items-end gap-1.5 pb-1 md:flex"
        aria-hidden="true"
      >
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">Photographer</span>
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">Videographer</span>
      </div>
    </div>

    <!-- ── Scroll indicator — center bottom ──────────────────────────── -->
    <div
      ref="scrollRef"
      class="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span class="font-mono text-[8px] uppercase tracking-[0.3em] text-text-faint">Scroll</span>
      <div class="relative h-12 w-px overflow-hidden bg-border">
        <div class="scroll-line absolute inset-0 origin-top scale-y-0 bg-text-muted" />
      </div>
    </div>
  </section>
</template>

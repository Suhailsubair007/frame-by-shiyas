<script setup lang="ts">
import { gsap }             from 'gsap'
import { ScrollTrigger }    from 'gsap/ScrollTrigger'
import { usePreloader }     from '@/composables/usePreloader'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

// SplitType type only — the module itself is imported dynamically post-mount
// so it never blocks the initial component chunk from evaluating.
interface SPLIT_INSTANCE {
  revert(): void
  readonly words?: Element[] | null
  readonly lines?: HTMLElement[] | null
}

defineProps<{
  videoSrc?:    string
  videoPoster?: string
  imageSrc?:    string
}>()

const { isComplete }       = usePreloader()
const prefersReducedMotion = useReducedMotion()

const sectionRef = ref<HTMLElement | null>(null)
const titleRef   = ref<HTMLElement | null>(null)

const sel = (k: string): string => `[data-hero="${k}"]`

let split:                  SPLIT_INSTANCE | null       = null
let scrollLineAnim:         gsap.core.Tween | null      = null
let scrollIndicatorTrigger: ScrollTrigger | null        = null
let animateInPending  = false
let fallbackTimer:    ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const wasAlreadyComplete = isComplete.value

  nextTick(async () => {
    if (wasAlreadyComplete || prefersReducedMotion.value) {
      startScrollLoop()
      return
    }

    gsap.set([sel('name'), sel('meta'), sel('scroll')], { opacity: 0 })
    gsap.set('.vf-corner', { opacity: 0 })

    const title = titleRef.value
    if (title) {
      // Dynamic import — deferred until post-mount so SplitType never
      // blocks the initial component chunk evaluation.
      const { default: SplitType } = await import('split-type')
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

    // Safety valve: animate in after 3 s even if preloader never signals.
    fallbackTimer = setTimeout(() => {
      if (!animateInPending) return
      animateInPending = false
      animateIn()
    }, 3_000)
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
    gsap.set([sel('name'), sel('meta'), sel('scroll')], { opacity: 1 })
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
    .to(sel('meta'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     'none',
    }, 1.0)
    .to(sel('scroll'), {
      opacity:  1,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     'none',
    }, 1.3)
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

  // Pause the indicator once the hero scrolls out of view —
  // a repeat:-1 tween running forever off-screen wastes a ticker slot.
  scrollIndicatorTrigger = ScrollTrigger.create({
    trigger:     sectionRef.value,
    start:       'top top',
    end:         'bottom top',
    onLeave:     () => scrollLineAnim?.pause(),
    onEnterBack: () => scrollLineAnim?.resume(),
  })
}

onUnmounted(() => {
  split?.revert()
  scrollLineAnim?.kill()
  scrollIndicatorTrigger?.kill()
  if (fallbackTimer) clearTimeout(fallbackTimer)
})
</script>

<template>
  <section
    ref="sectionRef"
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
        :eager="false"
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

    <!-- ── Bottom section fade — dissolves hero into the next section ── -->
    <div
      class="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
      style="background: linear-gradient(to bottom, transparent, oklch(4% 0 0));"
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

    <!-- ── Top strip: name centred, corners are the only frame marks ────── -->
    <div class="absolute left-14 right-14 top-24 flex justify-center md:left-20 md:right-20 md:top-28">
      <p
        data-hero="name"
        class="font-mono text-[8px] uppercase tracking-[0.42em] text-text-faint"
      >
        Muhammed Shiyas
      </p>
    </div>

    <!-- ── Bottom content ─────────────────────────────────────── -->
    <div class="absolute inset-x-6 bottom-20 md:inset-x-10 md:bottom-28">
      <!-- Metadata strip -->
      <div
        data-hero="meta"
        class="flex items-center justify-between"
        aria-hidden="true"
      >
        <span class="font-mono text-[8px] uppercase tracking-[0.28em] text-text-faint">
          Cinematographer &amp; Photographer
        </span>
        <span class="hidden font-mono text-[8px] uppercase tracking-[0.28em] text-text-faint opacity-50 md:block">
          Kerala, India
        </span>
      </div>

      <!-- Headline -->
      <h1
        ref="titleRef"
        class="mt-4 font-display font-normal italic leading-[0.87] text-text md:mt-5"
        style="font-size: clamp(46px, 6.5vw, 112px);"
      >
        Craft the<br />Unrepeatable.
      </h1>
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

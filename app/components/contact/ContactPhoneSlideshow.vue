<script setup lang="ts">
import { ABOUT }       from '@shared/constants/ABOUT'
import { PHOTOGRAPHY } from '@shared/constants/PHOTOGRAPHY'

// ── Slide types ───────────────────────────────────────────────────────────────
type SLIDE_PROFILE = { readonly type: 'profile' }
type SLIDE_GRID    = { readonly type: 'grid' }
type SLIDE_PHOTO   = {
  readonly type:     'photo'
  readonly src:      string
  readonly alt:      string
  readonly title:    string
  readonly category: string
}
type PHONE_SLIDE = SLIDE_PROFILE | SLIDE_GRID | SLIDE_PHOTO

// ── Static data ───────────────────────────────────────────────────────────────
const SLIDE_DURATION = 2_800 // ms each slide stays visible

const SLIDES: readonly PHONE_SLIDE[] = [
  { type: 'profile' },
  { type: 'grid' },
  ...PHOTOGRAPHY.map(p => ({
    type:     'photo'     as const,
    src:      p.coverImage.src,
    alt:      p.coverImage.alt,
    title:    p.title,
    category: String(p.category),
  })),
]

// First 9 photos — fills the 3×3 Instagram-style grid
const GRID_THUMBS = PHOTOGRAPHY.slice(0, 9).map(p => ({
  src:    p.coverImage.src,
  alt:    p.coverImage.alt,
  width:  p.coverImage.width,
  height: p.coverImage.height,
}))

// ── Auto-advance ──────────────────────────────────────────────────────────────
const currentIndex = ref(0)
const currentSlide = computed<PHONE_SLIDE>(() => SLIDES[currentIndex.value])

// Narrows to the photo variant only — avoids type casts in the template
const photoSlide = computed<SLIDE_PHOTO | null>(() => {
  const s = currentSlide.value
  return s.type === 'photo' ? s : null
})

let timer: ReturnType<typeof setInterval> | null = null

function advance(): void {
  currentIndex.value = (currentIndex.value + 1) % SLIDES.length
}

onMounted(() => { timer = setInterval(advance, SLIDE_DURATION) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <!--
    Root div is overflow-hidden so the off-screen entering/leaving slides are
    clipped at the screen boundary during the CSS translateX transition.
  -->
  <div class="relative h-full w-full overflow-hidden">
    <Transition name="phone-slide">
      <div :key="currentIndex" class="absolute inset-0">

        <!-- ── Profile slide ────────────────────────────────────── -->
        <template v-if="currentSlide.type === 'profile'">
          <img
            :src="ABOUT.PORTRAIT.src"
            alt=""
            :width="ABOUT.PORTRAIT.width"
            :height="ABOUT.PORTRAIT.height"
            class="h-full w-full object-cover object-top"
            loading="eager"
          />
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to bottom, oklch(4% 0 0 / 0.55) 0%, transparent 30%, transparent 52%, oklch(4% 0 0 / 0.9) 100%);"
          />
          <div class="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1.5">
            <p class="font-mono text-[7px] uppercase tracking-[0.35em] text-text-faint">
              Frame by Shiyas
            </p>
            <p class="font-display italic text-[13px] font-light leading-none text-text">
              Cinematographer
            </p>
          </div>
        </template>

        <!-- ── Grid (portfolio app) slide ──────────────────────── -->
        <template v-else-if="currentSlide.type === 'grid'">
          <div class="flex h-full flex-col" style="background: oklch(4% 0 0);">

            <!-- Header — sits below the Dynamic Island (~36 px) -->
            <div class="px-4 pb-3 pt-12">
              <p class="font-mono text-[7px] uppercase tracking-[0.3em] text-text-faint">
                Portfolio
              </p>
              <p class="mt-0.5 font-display italic text-[15px] font-light leading-none text-text">
                My Work.
              </p>
            </div>

            <!-- Hairline separator -->
            <div class="mx-4 h-px bg-border" aria-hidden="true" />

            <!-- 3×3 grid — grid-rows-3 fills all remaining height so cells are
                 portrait-proportioned (taller than square) and match the photos. -->
            <div class="mt-0.5 grid flex-1 grid-cols-3 grid-rows-3 gap-0.5 overflow-hidden">
              <div
                v-for="thumb in GRID_THUMBS"
                :key="thumb.src"
                class="overflow-hidden"
              >
                <img
                  :src="thumb.src"
                  :alt="thumb.alt"
                  :width="thumb.width"
                  :height="thumb.height"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- ── Photo slide ───────────────────────────────────────── -->
        <template v-else>
          <img
            :src="photoSlide?.src ?? ''"
            :alt="photoSlide?.alt ?? ''"
            class="h-full w-full object-cover object-center"
            loading="lazy"
            width="1280"
            height="1600"
          />
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to bottom, oklch(4% 0 0 / 0.3) 0%, transparent 30%, transparent 56%, oklch(4% 0 0 / 0.88) 100%);"
          />
          <div class="absolute bottom-8 left-4 right-4">
            <p class="font-display italic text-[13px] font-light leading-tight text-text">
              {{ photoSlide?.title }}
            </p>
            <p class="mt-1 font-mono text-[7px] uppercase tracking-[0.25em] text-text-faint">
              {{ photoSlide?.category }}
            </p>
          </div>
        </template>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
/*
  Slide-left animation: entering slide comes from the right,
  leaving slide exits to the left. Both are position:absolute
  during the transition so they visually overlap as they pass.
*/
.phone-slide-enter-active,
.phone-slide-leave-active {
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;
  inset: 0;
}

.phone-slide-enter-from { transform: translateX(100%); }
.phone-slide-leave-to   { transform: translateX(-100%); }
</style>

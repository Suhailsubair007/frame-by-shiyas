<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import { useLenis }  from '@/composables/useLenis'
import { ANIMATION } from '@shared/constants/ANIMATION'
import { ABOUT }     from '@shared/constants/ABOUT'
import { LAYOUT }    from '@shared/constants/LAYOUT'

const { fadeUp, clipReveal, parallax } = useReveal()
const { scrollTo }                     = useLenis()

const CONTACT_HASH = '#contact'

function goToContact(): void {
  scrollTo(CONTACT_HASH, { offset: -LAYOUT.HEADER_OFFSET })
}

const imageWrapRef = ref<HTMLElement | null>(null)
const imageRef     = ref<HTMLElement | null>(null)
const eyebrowRef   = ref<HTMLElement | null>(null)
const headingRef   = ref<HTMLElement | null>(null)
const bioRefs      = ref<(HTMLElement | null)[]>([])
const statsRef     = ref<HTMLElement | null>(null)
const ctaRef       = ref<HTMLElement | null>(null)

// Pre-baked AVIF sibling of the portrait — served to supporting browsers via <picture>.
const portraitAvif = computed(() => toAvifSrc(ABOUT.PORTRAIT.src))

onMounted(() => {
  nextTick(() => {
    clipReveal(imageWrapRef, { direction: 'right', duration: ANIMATION.DURATION.CINEMATIC })
    if (imageRef.value) parallax(imageRef, { strength: 0.08 })

    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
    fadeUp(bioRefs.value, { stagger: ANIMATION.STAGGER.LOOSE, delay: ANIMATION.DELAY.LONG })
    fadeUp([statsRef.value, ctaRef.value], {
      stagger: ANIMATION.STAGGER.LOOSE,
      delay:   ANIMATION.DELAY.LONG,
    })
  })
})
</script>

<template>
  <section class="relative bg-void">

    <!-- Section rule -->
    <div class="mx-6 h-px bg-border md:mx-10" aria-hidden="true" />

    <!-- Main editorial grid -->
    <div class="grid grid-cols-1 md:grid-cols-[55%_1fr]">

      <!-- ── Left: Portrait image ─────────────────────────────────────── -->
      <div
        ref="imageWrapRef"
        class="relative aspect-[2/3] overflow-hidden"
      >
        <!-- display:contents so <img> stays the parallax target and fills the wrapper -->
        <picture class="contents">
          <source :srcset="portraitAvif" type="image/avif" />
          <img
            ref="imageRef"
            :src="ABOUT.PORTRAIT.src"
            :alt="ABOUT.PORTRAIT.alt"
            :width="ABOUT.PORTRAIT.width"
            :height="ABOUT.PORTRAIT.height"
            class="h-full w-full scale-[1.08] object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>

        <!-- Location caption — bottom left -->
        <p
          class="absolute bottom-6 left-6 font-mono text-[13px] font-semibold uppercase tracking-[0.25em] text-text-faint md:bottom-8 md:left-8"
          aria-hidden="true"
        >
          {{ ABOUT.LOCATION }}
        </p>
      </div>

      <!-- ── Right: Content ──────────────────────────────────────────── -->
      <div class="flex flex-col justify-center px-6 py-12 md:px-12 md:py-14 lg:px-16">

        <!-- Eyebrow -->
        <p
          ref="eyebrowRef"
          class="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          04 — About
        </p>

        <!-- Heading -->
        <h2
          ref="headingRef"
          class="mb-10 font-display font-normal leading-[0.9] text-text"
          style="font-size: clamp(40px, 5.5vw, 90px);"
        >
          {{ ABOUT.HEADING_TOP }}<br />
          <em>{{ ABOUT.HEADING_FOOT }}</em>
        </h2>

        <!-- Bio paragraphs -->
        <div class="mb-12 space-y-5">
          <p
            v-for="(line, i) in ABOUT.BIO"
            :key="i"
            :ref="el => { bioRefs[i] = el as HTMLElement | null }"
            class="max-w-[42ch] font-sans text-base font-light leading-relaxed text-text-muted opacity-0"
          >
            {{ line }}
          </p>
        </div>

        <!-- Stats -->
        <div
          ref="statsRef"
          class="mb-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 opacity-0"
        >
          <div
            v-for="stat in ABOUT.STATS"
            :key="stat.label"
          >
            <p
              class="font-display font-bold leading-none text-text whitespace-pre-line"
              style="font-size: clamp(28px, 3.5vw, 52px);"
            >
              {{ stat.value }}
            </p>
            <p class="mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-text-faint">
              {{ stat.label }}
            </p>
          </div>
        </div>

        <!-- CTA -->
        <div ref="ctaRef" class="opacity-0">
          <a
            :href="CONTACT_HASH"
            class="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors duration-300 hover:text-text"
            @click.prevent="goToContact"
          >
            Work with Shiyas
            <span
              class="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            >→</span>
          </a>
        </div>

      </div>
    </div>

  </section>
</template>

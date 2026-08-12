<script setup lang="ts">
import { useReveal }        from '@/composables/useReveal'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { ROUTES }           from '@shared/constants/ROUTES'
import { FEATURED_PHOTOGRAPHY } from '@shared/constants/PHOTOGRAPHY'

const { fadeUp, clipReveal } = useReveal()

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const ctaRef     = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value, ctaRef.value], { stagger: ANIMATION.STAGGER.LOOSE })
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
  })
})
</script>

<template>
  <section class="relative bg-void py-24 md:py-36">

    <!-- ── Section header ──────────────────────────────────────────────── -->
    <div class="flex flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between md:px-10">
      <div>
        <p
          ref="eyebrowRef"
          class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          03 — Photography
        </p>
        <h2
          ref="headingRef"
          class="font-display font-normal leading-[0.88] text-text"
          style="font-size: clamp(48px, 7vw, 120px);"
        >
          Through<br /><em>the Lens.</em>
        </h2>
      </div>

      <div ref="ctaRef" class="opacity-0 md:pb-4">
        <BaseButton :href="ROUTES.PHOTOGRAPHY" variant="text">
          View all photography
        </BaseButton>
      </div>
    </div>

    <!-- ── Featured grid ────────────────────────────────────────────────── -->
    <div class="mt-12 grid grid-cols-1 gap-4 px-6 md:mt-16 md:grid-cols-2 md:gap-6 md:px-10">
      <PhotographyCard
        v-for="(project, i) in FEATURED_PHOTOGRAPHY"
        :key="project.id"
        :project="project"
        :class="i % 2 === 1 ? 'md:mt-20' : ''"
      />
    </div>

  </section>
</template>

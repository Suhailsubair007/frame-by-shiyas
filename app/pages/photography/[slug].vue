<script setup lang="ts">
import { useReveal }    from '@/composables/useReveal'
import { ANIMATION }   from '@shared/constants/ANIMATION'
import { META }        from '@shared/constants/META'
import { PHOTOGRAPHY } from '@shared/constants/PHOTOGRAPHY'
import { ROUTES }      from '@shared/constants/ROUTES'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug  = route.params.slug as string

const project = PHOTOGRAPHY.find(p => p.slug === slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useSeoMeta({
  title:       `${project.title} — ${META.SITE_NAME}`,
  description: project.tagline ?? `Photography by ${META.OWNER}.`,
})

const { fadeUp, clipReveal } = useReveal()

const imageWrapRef  = ref<HTMLElement | null>(null)
const headingRef    = ref<HTMLElement | null>(null)
const metaRef       = ref<HTMLElement | null>(null)

const categoryLabel = computed(() => project!.category.replace(/_/g, ' '))

onMounted(() => {
  nextTick(() => {
    clipReveal(imageWrapRef, { direction: 'up', duration: ANIMATION.DURATION.CINEMATIC })
    clipReveal(headingRef,   { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
    fadeUp([metaRef.value],  { delay: ANIMATION.DELAY.LONG })
  })
})
</script>

<template>
  <main class="min-h-screen bg-void">

    <!-- Cover image — full width -->
    <div
      ref="imageWrapRef"
      class="relative w-full overflow-hidden"
      :class="project.isLandscape ? 'aspect-video' : 'aspect-[3/4] md:aspect-video'"
    >
      <img
        :src="project.coverImage.src"
        :alt="project.coverImage.alt"
        :width="project.coverImage.width"
        :height="project.coverImage.height"
        class="h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent 55%, oklch(4% 0 0 / 0.85) 100%);"
        aria-hidden="true"
      />
    </div>

    <!-- Project info -->
    <div class="px-6 py-16 md:px-10 md:py-24">

      <h1
        ref="headingRef"
        class="mb-6 font-display font-normal leading-[0.9] text-text"
        style="font-size: clamp(40px, 6vw, 100px);"
      >
        {{ project.title }}<br />
        <em v-if="project.tagline" class="text-text-muted" style="font-size: 0.6em;">
          {{ project.tagline }}
        </em>
      </h1>

      <div ref="metaRef" class="flex flex-wrap items-center gap-6 opacity-0">
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
          {{ categoryLabel }}
        </span>
      </div>

      <!-- Back -->
      <div class="mt-16">
        <NuxtLink
          :to="ROUTES.PHOTOGRAPHY"
          class="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text"
        >
          <span class="inline-block transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
          All photography
        </NuxtLink>
      </div>
    </div>

  </main>
</template>

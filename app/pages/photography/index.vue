<script setup lang="ts">
import { usePhotography }   from '@/composables/usePhotography'
import { useReveal }        from '@/composables/useReveal'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { META }             from '@shared/constants/META'
import { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title:       `Photography — ${META.SITE_NAME}`,
  description: 'Wedding, portrait, editorial, commercial, and travel photography by Muhammed Shiyas.',
})

const { filterByCategory } = usePhotography()
const { fadeUp, clipReveal } = useReveal()

const activeCategory    = ref<GALLERY_CATEGORY | null>(null)
const filteredProjects  = computed(() => filterByCategory(activeCategory.value))

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)

function onFilterChange(category: GALLERY_CATEGORY | null): void {
  activeCategory.value = category
}

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
  })
})
</script>

<template>
  <main class="min-h-screen bg-void pt-32 pb-24 md:pt-40 md:pb-36">

    <!-- Header -->
    <div class="flex flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between md:px-10 mb-16 md:mb-24">
      <div>
        <p
          ref="eyebrowRef"
          class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          03 — Photography
        </p>
        <h1
          ref="headingRef"
          class="font-display font-normal leading-[0.88] text-text"
          style="font-size: clamp(48px, 7vw, 120px);"
        >
          All<br /><em>Images.</em>
        </h1>
      </div>

      <PhotographyFilter
        :active="activeCategory"
        @change="onFilterChange"
      />
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:gap-6 md:px-10">
      <PhotographyCard
        v-for="(project, i) in filteredProjects"
        :key="project.id"
        :project="project"
        :class="i % 2 === 1 ? 'md:mt-20' : ''"
      />
    </div>

  </main>
</template>

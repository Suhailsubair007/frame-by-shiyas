<script setup lang="ts">
import { usePhotography } from '@/composables/usePhotography'
import { META } from '@shared/constants/META'
import type { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

definePageMeta({ layout: 'default' })

const { filterByCategory, landscape } = usePhotography()

const activeCategory = ref<GALLERY_CATEGORY | null>(null)
const projects = computed(() => filterByCategory(activeCategory.value))

function onFilterChange(category: GALLERY_CATEGORY | null): void {
  activeCategory.value = category
}

useSeoMeta({
  title: `Photography — ${META.SITE_NAME}`,
  description: 'The full photography archive by Muhammed Shiyas — food, portraits, and product work shot in Sharjah, UAE.',
})
</script>

<template>
  <main class="min-h-screen bg-void pb-24 md:pb-36">
    <PageIntro
      eyebrow="Archive — Photography"
      title="Through"
      emphasis="the Lens."
    />

    <!-- Category filter -->
    <div class="mt-8 px-6 md:mt-10 md:px-10">
      <PhotographyFilter
        :active="activeCategory"
        @change="onFilterChange"
      />
    </div>

    <!-- Full grid -->
    <div class="mt-10 grid grid-cols-1 gap-4 px-6 md:mt-14 md:grid-cols-2 md:gap-6 md:px-10">
      <PhotographyCard
        v-for="(project, i) in projects"
        :key="project.id"
        :project="project"
        :class="i % 2 === 1 ? 'md:mt-20' : ''"
      />
    </div>

    <!-- Landscape — a separate section of wide-format frames -->
    <section v-if="landscape.length" class="mt-24 px-6 md:mt-32 md:px-10">
      <p class="mb-6 border-t border-border pt-10 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint">
        Landscape
      </p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <PhotographyCard
          v-for="project in landscape"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>
  </main>
</template>

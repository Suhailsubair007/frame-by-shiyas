<script setup lang="ts">
import { usePhotography }   from '@/composables/usePhotography'
import { useReveal }        from '@/composables/useReveal'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { PHOTOGRAPHY_PREVIEW_COUNT } from '@shared/constants/PHOTOGRAPHY'
import { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'
import type { PROJECT_LIST_ITEM } from '@shared/types/Project'

const { filterByCategory } = usePhotography()
const { fadeUp, clipReveal } = useReveal()

const activeCategory = ref<GALLERY_CATEGORY | null>(null)
const visibleCount   = ref(PHOTOGRAPHY_PREVIEW_COUNT)

// The "All" and Product tabs are shuffled on mount for a fresh order each visit.
// Server and first client paint keep the source order so hydration matches; cards
// are still hidden behind the reveal when the shuffle lands, so there's no flash.
const allOrder     = ref<readonly PROJECT_LIST_ITEM[] | null>(null)
const productOrder = ref<readonly PROJECT_LIST_ITEM[] | null>(null)

const filteredProjects = computed(() => {
  if (activeCategory.value === null) {
    return allOrder.value ?? filterByCategory(null)
  }
  if (activeCategory.value === GALLERY_CATEGORY.PRODUCT) {
    return productOrder.value ?? filterByCategory(GALLERY_CATEGORY.PRODUCT)
  }
  return filterByCategory(activeCategory.value)
})
const visibleProjects  = computed(() => filteredProjects.value.slice(0, visibleCount.value))
const hasMore          = computed(() => visibleCount.value < filteredProjects.value.length)

// These tabs mix wide and tall orientations, so they flow through a masonry column
// layout at their true aspect ratio instead of the uniform portrait grid. "All"
// spans every category, so it's mixed too.
const MASONRY_CATEGORIES: ReadonlySet<GALLERY_CATEGORY> = new Set([
  GALLERY_CATEGORY.LANDSCAPE,
  GALLERY_CATEGORY.OTHERS,
])
const isMasonry = computed(() => {
  const category = activeCategory.value
  return category === null || MASONRY_CATEGORIES.has(category)
})

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const ctaRef     = ref<HTMLElement | null>(null)

function onFilterChange(category: GALLERY_CATEGORY | null): void {
  activeCategory.value = category
  visibleCount.value = PHOTOGRAPHY_PREVIEW_COUNT
}

function loadMore(): void {
  visibleCount.value = filteredProjects.value.length
}

// Cards past the initial preview only ever appear after a "Load more" click, so
// they reveal on mount with a stagger keyed to their position in the batch.
function revealDelayFor(index: number): number {
  if (index < PHOTOGRAPHY_PREVIEW_COUNT) return 0
  return (index - PHOTOGRAPHY_PREVIEW_COUNT) * ANIMATION.STAGGER.DEFAULT
}

onMounted(() => {
  allOrder.value     = shuffle(filterByCategory(null))
  productOrder.value = shuffle(filterByCategory(GALLERY_CATEGORY.PRODUCT))

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
          style="font-size: clamp(38px, 5.6vw, 96px);"
        >
          Through<br /><em>the Lens.</em>
        </h2>
      </div>

      <!-- Filter -->
      <div ref="ctaRef" class="flex flex-col items-start gap-6 opacity-0 md:items-end">
        <PhotographyFilter
          :active="activeCategory"
          @change="onFilterChange"
        />
      </div>
    </div>

    <!-- ── Grid — uniform portrait grid, or masonry for mixed landscape ──── -->
    <div
      class="mt-12 px-6 md:mt-16 md:px-10"
      :class="isMasonry
        ? 'columns-1 gap-4 md:columns-2 md:gap-6'
        : 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'"
    >
      <PhotographyCard
        v-for="(project, i) in visibleProjects"
        :key="project.id"
        :project="project"
        :natural-aspect="isMasonry"
        :immediate="i >= PHOTOGRAPHY_PREVIEW_COUNT"
        :reveal-delay="revealDelayFor(i)"
        :class="isMasonry
          ? 'mb-4 break-inside-avoid md:mb-6'
          : (i % 2 === 1 ? 'md:mt-20' : '')"
      />
    </div>

    <!-- ── Load more ────────────────────────────────────────────────────── -->
    <div v-if="hasMore" class="mt-16 flex justify-center px-6 md:mt-20 md:px-10">
      <BaseButton variant="default" class="rounded-[28px]" @click="loadMore">
        Load more
      </BaseButton>
    </div>

  </section>
</template>

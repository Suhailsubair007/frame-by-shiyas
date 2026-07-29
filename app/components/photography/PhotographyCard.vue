<script setup lang="ts">
import { useCursorState }         from '@/composables/useCursorState'
import { useReveal }              from '@/composables/useReveal'
import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
import { CURSOR_STATE }           from '@shared/enums/CursorState'
import { ROUTES }                 from '@shared/constants/ROUTES'

const props = defineProps<{
  project: PROJECT_LIST_ITEM
}>()

const { setState, reset } = useCursorState()
const { clipReveal }      = useReveal()

const wrapRef       = ref<HTMLElement | null>(null)
const categoryLabel = computed(() => props.project.category.replace(/_/g, ' '))

onMounted(() => {
  nextTick(() => {
    if (!wrapRef.value) return
    clipReveal(wrapRef, { direction: 'up' })
  })
})
</script>

<template>
  <!-- Wrapper carries the ref for clipReveal; NuxtLink is inside -->
  <div
    ref="wrapRef"
    class="relative overflow-hidden rounded-sm bg-surface/5"
    :class="project.isLandscape ? 'aspect-video' : 'aspect-[3/4]'"
  >
  <NuxtLink
    :to="ROUTES.PROJECT(project.slug)"
    :aria-label="`View ${project.title}`"
    class="group absolute inset-0 block"
    @mouseenter="setState(CURSOR_STATE.VIEW)"
    @mouseleave="reset()"
  >
    <!-- Cover image — external placeholder, plain <img> to bypass IPX proxy -->
    <img
      :src="project.coverImage.src"
      :alt="project.coverImage.alt"
      :width="project.coverImage.width"
      :height="project.coverImage.height"
      class="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      loading="lazy"
      decoding="async"
    />

    <!-- Bottom-gradient veil for text legibility -->
    <div
      class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style="background: linear-gradient(to bottom, transparent 35%, oklch(4% 0 0 / 0.85) 100%);"
      aria-hidden="true"
    />

    <!-- Metadata revealed on hover -->
    <div
      class="absolute bottom-0 left-0 right-0 translate-y-2 p-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
    >
      <p class="mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint">
        {{ categoryLabel }}
      </p>
      <h3 class="font-display text-xl font-light italic leading-tight text-text">
        {{ project.title }}
      </h3>
      <p v-if="project.tagline" class="mt-1 font-mono text-[9px] text-text-muted">
        {{ project.tagline }}
      </p>
    </div>
  </NuxtLink>
  </div>
</template>

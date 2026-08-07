<script setup lang="ts">
import { useCursorState }         from '@/composables/useCursorState'
import { useReveal }              from '@/composables/useReveal'
import { useMediaQuery }          from '@/composables/useMediaQuery'
import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
import { CURSOR_STATE }           from '@shared/enums/CursorState'

const props = defineProps<{
  project: PROJECT_LIST_ITEM
}>()

const { setState, reset } = useCursorState()
const { clipReveal }      = useReveal()
const { hasPointer }      = useMediaQuery()
const isRevealed          = ref(false)

const wrapRef       = ref<HTMLElement | null>(null)
const categoryLabel = computed(() => props.project.category.replace(/_/g, ' '))

function handleCardClick(): void {
  if (!hasPointer.value) {
    isRevealed.value = !isRevealed.value
  }
}

onMounted(() => {
  nextTick(() => {
    if (!wrapRef.value) return
    clipReveal(wrapRef, { direction: 'up' })
  })
})
</script>

<template>
  <div
    ref="wrapRef"
    class="relative overflow-hidden rounded-sm bg-surface/5"
    :class="project.isLandscape ? 'aspect-video' : 'aspect-[3/4]'"
  >
    <div
      class="group absolute inset-0 block"
      @click="handleCardClick"
      @mouseenter="setState(CURSOR_STATE.VIEW)"
      @mouseleave="reset()"
    >
      <BaseImage
        :src="project.coverImage.src"
        :alt="project.coverImage.alt"
        :width="project.coverImage.width"
        :height="project.coverImage.height"
        sizes="(max-width: 767px) calc(100vw - 48px), calc(50vw - 52px)"
        class="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      />

      <!-- Gradient veil:
           Pointer device  → opacity follows group-hover
           Touch device    → opacity follows isRevealed -->
      <div
        class="absolute inset-0 transition-opacity duration-500"
        :class="hasPointer
          ? 'opacity-0 group-hover:opacity-100'
          : (isRevealed ? 'opacity-100' : 'opacity-0')"
        style="background: linear-gradient(to bottom, transparent 35%, oklch(4% 0 0 / 0.85) 100%);"
        aria-hidden="true"
      />

      <!-- Metadata:
           Pointer device  → slides up and fades in on hover
           Touch device    → appears/disappears instantly on tap -->
      <div
        class="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out"
        :class="hasPointer
          ? 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          : (isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')"
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
    </div>
  </div>
</template>

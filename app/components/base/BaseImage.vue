<script setup lang="ts">
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'

type IMAGE_FIT = 'cover' | 'contain' | 'fill'

const props = withDefaults(defineProps<{
  src:        string
  alt:        string
  width?:     number
  height?:    number
  sizes?:     string
  fit?:       IMAGE_FIT
  priority?:  boolean
  reveal?:    boolean
  caption?:   string
  cursorView?: boolean
}>(), {
  fit:        'cover',
  priority:   false,
  reveal:     false,
  cursorView: false,
})

const emit = defineEmits<{
  load:  []
  error: []
}>()

const isLoaded = ref(false)
const { setState, reset } = useCursorState()

const fitClass: Record<IMAGE_FIT, string> = {
  cover:   'object-cover',
  contain: 'object-contain',
  fill:    'object-fill',
}

function onLoad(): void {
  isLoaded.value = true
  emit('load')
}

function onError(): void {
  emit('error')
}
</script>

<template>
  <figure
    class="group relative overflow-hidden"
    :data-reveal="reveal || undefined"
    @mouseenter="cursorView ? setState(CURSOR_STATE.VIEW) : undefined"
    @mouseleave="cursorView ? reset() : undefined"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes ?? '100vw'"
      :class="[
        'w-full h-full transition-opacity duration-700',
        fitClass[fit],
        isLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      :loading="priority ? 'eager' : 'lazy'"
      :preload="priority"
      format="avif"
      quality="85"
      @load="onLoad"
      @error="onError"
    />

    <figcaption
      v-if="caption"
      class="mt-3 font-mono text-[10px] tracking-widest text-text-faint uppercase"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { VIDEO_FILTERS } from '@shared/constants/VIDEO_FILTERS'
import type { VIDEO_TAB } from '@shared/constants/VIDEO_FILTERS'

defineProps<{
  active: VIDEO_TAB
}>()

const emit = defineEmits<{
  change: [tab: VIDEO_TAB]
}>()
</script>

<template>
  <nav aria-label="Filter videos by type">
    <ul class="flex flex-wrap gap-2">
      <li v-for="f in VIDEO_FILTERS" :key="f.value">
        <button
          type="button"
          class="rounded-full border px-4 py-2.5 md:py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300"
          :class="active === f.value
            ? 'border-text bg-text text-void'
            : 'border-text/20 text-text-muted hover:border-text/50 hover:text-text'"
          :aria-pressed="active === f.value"
          @click="emit('change', f.value)"
        >
          {{ f.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

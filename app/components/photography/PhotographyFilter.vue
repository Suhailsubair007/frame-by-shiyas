<script setup lang="ts">
import { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

const props = defineProps<{
  active: GALLERY_CATEGORY | null
}>()

const emit = defineEmits<{
  change: [category: GALLERY_CATEGORY | null]
}>()

// Display labels map — avoids repeating .replace(/_/g, ' ') in template
const CATEGORY_LABELS: Readonly<Record<GALLERY_CATEGORY, string>> = {
  [GALLERY_CATEGORY.WEDDING]:    'Wedding',
  [GALLERY_CATEGORY.PORTRAIT]:   'Portrait',
  [GALLERY_CATEGORY.COMMERCIAL]: 'Commercial',
  [GALLERY_CATEGORY.EDITORIAL]:  'Editorial',
  [GALLERY_CATEGORY.TRAVEL]:     'Travel',
  [GALLERY_CATEGORY.STREET]:     'Street',
  [GALLERY_CATEGORY.LIFESTYLE]:  'Lifestyle',
}

const filters: Array<{ label: string; value: GALLERY_CATEGORY | null }> = [
  { label: 'All', value: null },
  ...Object.values(GALLERY_CATEGORY).map(c => ({ label: CATEGORY_LABELS[c], value: c })),
]
</script>

<template>
  <nav aria-label="Filter photography by category">
    <ul class="flex flex-wrap gap-2">
      <li v-for="f in filters" :key="f.label">
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

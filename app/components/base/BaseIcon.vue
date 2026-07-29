<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: number
  label?: string
}>(), {
  size: 24,
})
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    :aria-label="props.label"
    :aria-hidden="!props.label"
    role="img"
  >
    <slot />
  </span>
</template>

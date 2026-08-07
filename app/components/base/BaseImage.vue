<script setup lang="ts">
// Renders a <picture> that serves a pre-baked AVIF (≈75% smaller) to supporting
// browsers and the original JPEG as a universal fallback. No build-time image
// service is required — the AVIF sibling is a committed static asset, so this works
// identically on static (`nuxt generate`) and SSR deployments.
//
// inheritAttrs is disabled so caller-supplied class / listeners land on the <img>
// (the visually rendered element) rather than the wrapping <picture>.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src:      string
    alt:      string
    width?:   number
    height?:  number
    sizes?:   string
    eager?:   boolean
  }>(),
  {
    width:  undefined,
    height: undefined,
    sizes:  undefined,
    eager:  false,
  },
)

const avifSrc = computed(() => toAvifSrc(props.src))
</script>

<template>
  <!-- display:contents so the <img> inherits the caller's grid/flex box directly and
       height utilities (h-full) resolve against the real parent, not the <picture>. -->
  <picture class="contents">
    <source :srcset="avifSrc" type="image/avif" />
    <img
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
    />
  </picture>
</template>

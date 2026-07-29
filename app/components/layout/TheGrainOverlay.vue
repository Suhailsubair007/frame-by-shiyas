<script setup lang="ts">
// SVG feTurbulence grain — no external assets required.
// mix-blend-mode: overlay gives depth without overwhelming dark backgrounds.
// Opacity is intentionally very low (0.035) — barely perceptible on its own
// but adds material texture that separates this from flat digital surfaces.
const filterId = 'grain-noise'
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0"
    style="z-index: var(--z-toast); opacity: 0.035; mix-blend-mode: overlay;"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-full w-full"
    >
      <filter :id="filterId" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect
        width="100%"
        height="100%"
        :filter="`url(#${filterId})`"
      />
    </svg>
  </div>
</template>

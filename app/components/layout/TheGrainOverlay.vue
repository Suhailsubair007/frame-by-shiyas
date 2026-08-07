<script setup lang="ts">
// A single 140×140 tile of grayscale film grain, rasterized ONCE by the browser from
// an inline SVG data URI and repeated with background-repeat. This replaces a
// full-viewport live <feTurbulence> filter that had to re-rasterize the entire screen
// on every repaint — the dominant scroll-jank cost on low-end GPUs. mix-blend-mode is
// dropped for the same reason (a fixed full-screen blend forces a whole-backdrop
// recomposite each scroll frame); at this opacity the plain overlay is visually
// indistinguishable from the previous effect.
const GRAIN_TILE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='140'%20height='140'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.72'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3CfeColorMatrix%20type='saturate'%20values='0'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E"

const grainStyle = {
  zIndex: 'var(--z-toast)',
  opacity: '0.05',
  backgroundImage: `url("${GRAIN_TILE}")`,
  backgroundSize: '140px 140px',
  backgroundRepeat: 'repeat',
} as const
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0"
    :style="grainStyle"
    aria-hidden="true"
  />
</template>

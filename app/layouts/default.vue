<script setup lang="ts">
// TheNavigation and TheFooter will be added in Phase 4
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-void text-text antialiased">
    <!-- Global overlays — always on top, pointer-events disabled -->
    <TheGrainOverlay />
    <TheCursor />

    <ThePageTransition>
      <slot />
    </ThePageTransition>
  </div>
</template>

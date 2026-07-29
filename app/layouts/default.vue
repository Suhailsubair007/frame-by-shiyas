<script setup lang="ts">
// TheFooter will be added in Phase 8
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-void text-text antialiased">
    <!-- Global overlays — pointer-events disabled, always on top -->
    <TheGrainOverlay />
    <TheCursor />

    <!-- Navigation — fixed, above page content -->
    <TheNavigation />

    <!-- Page content wrapped in cinematic route transition -->
    <ThePageTransition>
      <slot />
    </ThePageTransition>
  </div>
</template>

<script setup lang="ts">
// TheFooter will be added in Phase 8
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-void text-text antialiased">
    <!-- Global overlays — pointer-events disabled, always on top -->
    <TheGrainOverlay />
    <TheCursor />

    <!-- Page content wrapped in cinematic route transition -->
    <ThePageTransition>
      <slot />
    </ThePageTransition>

    <!-- Floating quick-contact dock — call, WhatsApp, email, theme, jump to contact -->
    <TheContactDock />
  </div>
</template>

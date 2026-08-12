<script setup lang="ts">
import { ROUTES } from '@shared/constants/ROUTES'

defineProps<{
  eyebrow: string
  title: string
  emphasis?: string
}>()
</script>

<template>
  <header class="px-6 pt-32 md:px-10 md:pt-40">
    <NuxtLink
      :to="ROUTES.HOME"
      class="mb-10 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted transition-colors duration-300 hover:text-text focus-visible:outline-none"
    >
      <span aria-hidden="true">←</span> Home
    </NuxtLink>

    <p class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint">
      {{ eyebrow }}
    </p>

    <h1
      class="font-display font-normal leading-[0.88] text-text"
      style="font-size: clamp(48px, 7vw, 120px);"
    >
      {{ title }}<template v-if="emphasis"><br /><em>{{ emphasis }}</em></template>
    </h1>
  </header>
</template>

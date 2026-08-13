<script setup lang="ts">
import { ROUTES } from '@shared/constants/ROUTES'

defineProps<{
  eyebrow: string
  title: string
  emphasis?: string
}>()
</script>

<template>
  <header class="px-6 pt-24 md:px-10">
    <NuxtLink
      :to="ROUTES.HOME"
      class="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-text/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors duration-300 hover:border-text/60 hover:text-text focus-visible:outline-none"
    >
      <span
        class="inline-block transition-transform duration-300 group-hover:-translate-x-1"
        aria-hidden="true"
      >←</span>
      Home
    </NuxtLink>

    <p class="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint">
      {{ eyebrow }}
    </p>

    <h1
      class="font-display font-normal leading-[0.9] text-text"
      style="font-size: clamp(40px, 5vw, 72px);"
    >
      {{ title }}<template v-if="emphasis"><br /><em>{{ emphasis }}</em></template>
    </h1>
  </header>
</template>

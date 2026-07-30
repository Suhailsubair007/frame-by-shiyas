<script setup lang="ts">
import { META } from '@shared/constants/META'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title:       `About — ${META.SITE_NAME}`,
  description: `${META.OWNER} is a photographer and filmmaker based in Kerala, India.`,
})
</script>

<template>
  <main class="min-h-screen bg-void pt-24 md:pt-32">
    <AboutSection />
  </main>
</template>

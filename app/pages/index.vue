<script setup lang="ts">
import { META } from '@shared/constants/META'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title:           META.DEFAULT_TITLE,
  description:     META.DEFAULT_DESCRIPTION,
  ogTitle:         META.DEFAULT_TITLE,
  ogDescription:   META.DEFAULT_DESCRIPTION,
  ogImage:         META.OG_IMAGE,
  twitterCard:     'summary_large_image',
})
</script>

<template>
  <main>
    <!--
      videoSrc / videoPoster will be real assets once media is provided.
      The hero renders beautifully with the gradient fallback until then.
    -->
    <HeroSection
      video-src=""
      video-poster=""
    />

    <FilmsSection />

    <!-- Phase 7: PhotographySection -->
    <!-- Phase 8: AboutSection -->
  </main>
</template>

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
    <!--
      Placeholder media from public CDNs — swap for real production assets.
      Video: Google Sample Videos (public domain, for dev only).
      Poster: Picsum Photos seeded image shown while video buffers.
    -->
    <HeroSection
      video-src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
      video-poster="https://picsum.photos/seed/hero-shiyas/1920/1080"
    />

    <FilmsSection />

    <!-- Phase 7: PhotographySection -->
    <!-- Phase 8: AboutSection -->
  </main>
</template>

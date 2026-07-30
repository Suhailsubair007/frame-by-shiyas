<script setup lang="ts">
import { META } from '@shared/constants/META'

definePageMeta({ layout: 'default' })

const HERO_VIDEO  = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/15086082_3840_2160_30fps%20(1).mp4'
const HERO_POSTER = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/AJ709696.jpg'

useSeoMeta({
  title:           META.DEFAULT_TITLE,
  description:     META.DEFAULT_DESCRIPTION,
  ogTitle:         META.DEFAULT_TITLE,
  ogDescription:   META.DEFAULT_DESCRIPTION,
  ogImage:         META.OG_IMAGE,
  twitterCard:     'summary_large_image',
})

// Preload the poster image so it shows instantly while the video buffers
useHead({
  link: [{ rel: 'preload', as: 'image', href: HERO_POSTER }],
})
</script>

<template>
  <main>
    <HeroSection
      id="hero"
      :video-src="HERO_VIDEO"
      :video-poster="HERO_POSTER"
    />

    <ReelsSection id="reels" />

    <!-- Films is a 16:9 landscape rail, and the work on show is vertical.
         Parked until there is landscape work worth leading with — restore
         alongside the Films entry in NAVIGATION (shared/constants/META.ts).
    <FilmsSection id="films" />
    -->

    <PhotographySection id="photography" />

    <AboutSection id="about" />

    <ContactSection id="contact" />
  </main>
</template>

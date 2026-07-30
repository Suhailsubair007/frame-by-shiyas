<script setup lang="ts">
import { META } from '@shared/constants/META'

definePageMeta({ layout: 'default' })

const HERO_IMAGE = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/AJ709696.jpg'

useSeoMeta({
  title:           META.DEFAULT_TITLE,
  description:     META.DEFAULT_DESCRIPTION,
  ogTitle:         META.DEFAULT_TITLE,
  ogDescription:   META.DEFAULT_DESCRIPTION,
  ogImage:         META.OG_IMAGE,
  twitterCard:     'summary_large_image',
})

// Preload the hero image so it is ready before the preloader animation ends
useHead({
  link: [{ rel: 'preload', as: 'image', href: HERO_IMAGE }],
})
</script>

<template>
  <main>
    <HeroSection :image-src="HERO_IMAGE" />

    <ReelsSection />

    <FilmsSection />

    <PhotographySection />

    <AboutSection />

    <ContactSection />
  </main>
</template>

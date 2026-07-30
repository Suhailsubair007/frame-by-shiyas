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
    <HeroSection
      image-src="https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/AJ709954.jpg"
    />

    <FilmsSection />

    <PhotographySection />

    <AboutSection />

    <ContactSection />
  </main>
</template>

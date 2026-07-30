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
      image-src="https://res.cloudinary.com/duzyrjr0g/image/upload/v1747719310/samples/two-ladies.jpg"
    />

    <FilmsSection />

    <PhotographySection />

    <AboutSection />

    <ContactSection />
  </main>
</template>

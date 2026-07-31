<script setup lang="ts">
import { META }         from '@shared/constants/META'
import { usePreloader } from '@/composables/usePreloader'

definePageMeta({ layout: 'default' })

const HERO_VIDEO  = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/TITLE.mp4'
const HERO_POSTER = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas/AJ709696.jpg'

useSeoMeta({
  title:           META.DEFAULT_TITLE,
  description:     META.DEFAULT_DESCRIPTION,
  ogTitle:         META.DEFAULT_TITLE,
  ogDescription:   META.DEFAULT_DESCRIPTION,
  ogImage:         META.OG_IMAGE,
  twitterCard:     'summary_large_image',
})

// Preload the poster so it's already in cache when the hero mounts.
useHead({
  link: [{ rel: 'preload', as: 'image', href: HERO_POSTER }],
})

// Signal the preloader as soon as above-the-fold assets are ready.
// The wipe fires only after BOTH this signal AND the brand animation
// minimum have completed — whichever is slower sets the pace.
// A 5 s hard cap prevents the splash from hanging on very slow connections.
const { signalAssetsReady } = usePreloader()

onMounted(() => {
  const ASSET_TIMEOUT_MS = 5_000

  const posterReady = new Promise<void>((resolve) => {
    const img = new Image()
    img.onload  = () => resolve()
    img.onerror = () => resolve()
    img.src = HERO_POSTER
  })

  const timeout = new Promise<void>(resolve => setTimeout(resolve, ASSET_TIMEOUT_MS))

  Promise.race([
    Promise.all([posterReady, document.fonts.ready]),
    timeout,
  ])
    .then(() => signalAssetsReady())
    .catch(() => signalAssetsReady())
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

    <!-- <FilmsSection id="films" /> -->

    <PhotographySection id="photography" />

    <AboutSection id="about" />

    <ContactSection id="contact" />
  </main>
</template>

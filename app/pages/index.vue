<script setup lang="ts">
import { META }         from '@shared/constants/META'
import { PHOTOGRAPHY }  from '@shared/constants/PHOTOGRAPHY'
import { ABOUT }        from '@shared/constants/ABOUT'
import { usePreloader } from '@/composables/usePreloader'

definePageMeta({ layout: 'default' })

const HERO_VIDEO  = 'https://cdn.muhmdshiyas.com/shiyas/Timeline%201website%201.mp4'
const HERO_POSTER = 'https://cdn.muhmdshiyas.com/shiyas/2.jpg'

useSeoMeta({
  title:           META.DEFAULT_TITLE,
  description:     META.DEFAULT_DESCRIPTION,
  ogTitle:         META.DEFAULT_TITLE,
  ogDescription:   META.DEFAULT_DESCRIPTION,
  ogImage:         META.OG_IMAGE,
  twitterCard:     'summary_large_image',
})

// Preload the hero poster so it's in cache before the hero mounts.
useHead({
  link: [{ rel: 'preload', as: 'image', href: HERO_POSTER }],
})

const { signalAssetsReady, updateProgress } = usePreloader()

onMounted(() => {
  // All images that must be loaded before the splash dismisses.
  // Hero poster (CDN) + every photography card + the about portrait.
  const imageSrcs: readonly string[] = [
    HERO_POSTER,
    ...PHOTOGRAPHY.map(p => p.coverImage.src),
    ABOUT.PORTRAIT.src,
  ]

  const total = imageSrcs.length
  let loaded = 0

  updateProgress(0, total)

  const imagePromises = imageSrcs.map(
    src => new Promise<void>((resolve) => {
      const img = new Image()
      img.onload  = () => { loaded++; updateProgress(loaded, total); resolve() }
      img.onerror = () => { loaded++; updateProgress(loaded, total); resolve() }
      img.src = src
    }),
  )

  // 4 s hard cap — prevents the splash hanging on slow or distant connections.
  const timeout = new Promise<void>(resolve => setTimeout(resolve, 4_000))

  Promise.race([
    Promise.all([...imagePromises, document.fonts.ready]),
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

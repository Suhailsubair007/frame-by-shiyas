<script setup lang="ts">
import { HERO_VIDEO as HERO_VIDEO_MEDIA } from '@shared/constants/MEDIA'
import { usePreloader } from '@/composables/usePreloader'
import { useLenis } from '@/composables/useLenis'
import { ANIMATION } from '@shared/constants/ANIMATION'
import { LAYOUT } from '@shared/constants/LAYOUT'

definePageMeta({ layout: 'default' })

const HERO_VIDEO  = HERO_VIDEO_MEDIA.url
const HERO_POSTER = HERO_VIDEO_MEDIA.poster ?? ''

// Hard cap so the splash never hangs on a slow or distant connection.
const PRELOAD_TIMEOUT_MS = 4_000

// A hash means we arrived from a sub-page nav click; wait for the route curtain
// to finish sweeping out (it resets scroll to top on enter) before scrolling.
const HASH_SCROLL_DELAY_MS = (ANIMATION.DURATION.CINEMATIC + 0.3) * 1_000

const route = useRoute()
const { scrollTo } = useLenis()

// All head/meta + schema.org structured data — see composables/useSeo.ts
useSeo()

// Preload the hero poster at high priority so it paints as the LCP element the instant
// the splash lifts. The video is fetched by the <video preload="auto"> element itself
// (started immediately by its in-view IntersectionObserver), so a separate
// `rel=preload as=video` is intentionally omitted — it would double-fetch and steal
// bandwidth from the poster on slow links, which is what made the poster linger.
useHead({
  link: [
    { rel: 'preload', as: 'image', href: HERO_POSTER, fetchpriority: 'high' },
  ],
})

const { signalAssetsReady, updateProgress } = usePreloader()

onMounted(() => {
  // Gate the splash ONLY on the hero poster + web fonts — the above-the-fold critical
  // path. Below-the-fold photography/about imagery loads lazily on scroll (and is tiny
  // now that it's AVIF), so it no longer blocks the reveal or inflates LCP.
  const criticalImages: readonly string[] = [HERO_POSTER]

  const total = criticalImages.length
  let loaded = 0

  updateProgress(0, total)

  const imagePromises = criticalImages.map(
    src => new Promise<void>((resolve) => {
      const img = new Image()
      img.onload  = () => { loaded++; updateProgress(loaded, total); resolve() }
      img.onerror = () => { loaded++; updateProgress(loaded, total); resolve() }
      img.src = src
    }),
  )

  const timeout = new Promise<void>(resolve => setTimeout(resolve, PRELOAD_TIMEOUT_MS))

  Promise.race([
    Promise.all([...imagePromises, document.fonts.ready]),
    timeout,
  ])
    .then(() => signalAssetsReady())
    .catch(() => signalAssetsReady())
})

onMounted(() => {
  if (!route.hash) return
  setTimeout(() => {
    scrollTo(route.hash, { offset: -LAYOUT.HEADER_OFFSET })
  }, HASH_SCROLL_DELAY_MS)
})
</script>

<template>
  <main>
    <HeroSection
      id="hero"
      :video-src="HERO_VIDEO"
      :video-poster="HERO_POSTER"
    />

    <FilmsSection id="films" />

    <ReelsSection id="reels" />

    <PhotographySection id="photography" />

    <AboutSection id="about" />

    <ContactSection id="contact" />
  </main>
</template>

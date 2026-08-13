<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/composables/useLenis'
import { useNavHistory } from '@/composables/useNavHistory'
import { ROUTES } from '@shared/constants/ROUTES'
import { LAYOUT } from '@shared/constants/LAYOUT'

const route = useRoute()
const { scrollTo, scrollToTop } = useLenis()
const { previousPath } = useNavHistory()

// Returning to the home page from a sub-page lands on the section whose "View all"
// opened it, instead of snapping to the top. Fresh forward navigations go to top.
const RETURN_ANCHOR: Readonly<Record<string, string>> = {
  [ROUTES.FILMS]:       '#reels',
  [ROUTES.PHOTOGRAPHY]: '#photography',
}

function restoreScroll(): void {
  const anchor = route.path === ROUTES.HOME ? RETURN_ANCHOR[previousPath.value] : undefined

  if (!anchor) {
    scrollToTop(true)
    return
  }

  // Wait for the home page to lay out — the pinned Films section adds scroll
  // distance below it, so the target section's real offset is only known once its
  // ScrollTrigger has been (re)built. Then jump straight there, no smooth scroll.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      scrollTo(anchor, { offset: -LAYOUT.HEADER_OFFSET, immediate: true })
    })
  })
}

function onEnter(): void {
  restoreScroll()
}
</script>

<template>
  <Transition name="page" mode="out-in" @enter="onEnter">
    <div :key="route.path">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
/* A light cross-fade replaces the old full-screen curtain — navigation stays
   quick and no longer stops scrolling mid-transition. */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>

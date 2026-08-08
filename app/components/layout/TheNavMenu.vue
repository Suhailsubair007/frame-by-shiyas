<script setup lang="ts">
import { gsap } from 'gsap'
import { CURSOR_STATE }    from '@shared/enums/CursorState'
import { useCursorState }  from '@/composables/useCursorState'
import { useMenuState }    from '@/composables/useMenuState'
import { useLenis }        from '@/composables/useLenis'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { NAVIGATION, META } from '@shared/constants/META'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { LAYOUT }           from '@shared/constants/LAYOUT'

const { isOpen, close }       = useMenuState()
const { setState, reset }     = useCursorState()
const { stop, start, scrollTo } = useLenis()
const prefersReducedMotion = useReducedMotion()
const route                = useRoute()

const overlayRef   = ref<HTMLElement | null>(null)
const linksRef     = ref<HTMLElement[]>([])
const footerRef    = ref<HTMLElement | null>(null)

// Close on route change
watch(route, close)

// Animate open / close
watch(isOpen, async (opened) => {
  const overlay = overlayRef.value
  if (!overlay) return

  if (opened) {
    stop()
    overlay.style.pointerEvents = 'auto'

    if (prefersReducedMotion.value) {
      gsap.set(overlay, { clipPath: 'inset(0 0 0% 0)', opacity: 1 })
      return
    }

    // 1. Overlay wipes in from top
    await gsap.fromTo(
      overlay,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: ANIMATION.DURATION.CINEMATIC, ease: ANIMATION.EASE.CINEMA },
    )

    // 2. Links stagger up
    gsap.fromTo(
      linksRef.value,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: ANIMATION.DURATION.SLOW, stagger: ANIMATION.STAGGER.LOOSE, ease: ANIMATION.EASE.EXPO_OUT },
    )

    // 3. Footer fades in
    gsap.fromTo(
      footerRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: ANIMATION.DURATION.DEFAULT, ease: ANIMATION.EASE.EXPO_OUT, delay: 0.3 },
    )

  } else {
    overlay.style.pointerEvents = 'none'

    if (prefersReducedMotion.value) {
      gsap.set(overlay, { clipPath: 'inset(0 0 100% 0)' })
      start()
      return
    }

    // Elements out first, then overlay closes
    gsap.to([...linksRef.value, footerRef.value], {
      opacity: 0, y: -20, duration: ANIMATION.DURATION.FAST, stagger: 0.03, ease: ANIMATION.EASE.DEFAULT,
    })

    await gsap.to(overlay, {
      clipPath: 'inset(100% 0 0% 0)',
      duration: ANIMATION.DURATION.CINEMATIC,
      ease:     ANIMATION.EASE.CINEMA,
      delay:    0.1,
    })

    // Reset for next open
    gsap.set(overlay, { clipPath: 'inset(0 0 100% 0)' })
    gsap.set([...linksRef.value, footerRef.value], { opacity: 0, y: 60 })
    start()
  }
})

function setLinkRef(el: Element | ComponentPublicInstance | null, index: number): void {
  if (el instanceof HTMLElement) linksRef.value[index] = el
}

// Close the overlay and smooth-scroll to the target section. `force` lets Lenis
// scroll while it is still stopped from the open menu; closing restarts it after.
function onNavClick(hash: string): void {
  close()
  scrollTo(hash, { offset: -LAYOUT.HEADER_OFFSET, force: true })
}
</script>

<template>
  <div
    id="main-menu"
    ref="overlayRef"
    class="fixed inset-0 flex flex-col bg-surface"
    style="clip-path: inset(0 0 100% 0); pointer-events: none; z-index: var(--z-fixed);"
    :aria-hidden="!isOpen"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
  >
    <!-- ── Top bar ── -->
    <div class="flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
      <TheNavLogo />
      <TheNavToggle />
    </div>

    <!-- ── Nav links — the centrepiece ── -->
    <nav class="flex flex-1 flex-col justify-center px-6 md:px-10">
      <ul class="space-y-0" role="list">
        <li
          v-for="(item, i) in NAVIGATION"
          :key="item.hash"
          :ref="el => setLinkRef(el, i)"
          class="opacity-0"
        >
          <a
            :href="item.hash"
            class="group flex items-baseline gap-4 py-1 focus-visible:outline-none md:py-2"
            :tabindex="isOpen ? 0 : -1"
            @click.prevent="onNavClick(item.hash)"
            @mouseenter="setState(CURSOR_STATE.HOVER)"
            @mouseleave="reset"
          >
            <!-- Index number -->
            <span class="font-mono text-[10px] tracking-widest text-text-faint transition-opacity duration-300 group-hover:text-text-muted md:text-xs">
              {{ item.index }}
            </span>

            <!-- Link label — enormous editorial type -->
            <span class="relative font-display text-5xl font-light italic leading-none text-text transition-all duration-500 ease-expo group-hover:translate-x-3 group-hover:text-accent sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]">
              {{ item.label }}
            </span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- ── Footer row ── -->
    <div
      ref="footerRef"
      class="flex items-end justify-between px-6 pb-safe opacity-0 md:px-10"
    >
      <div class="flex gap-5">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] uppercase tracking-widest text-text-faint transition-colors duration-300 hover:text-text"
          :tabindex="isOpen ? 0 : -1"
        >
          Instagram
        </a>
        <a
          href="https://vimeo.com"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] uppercase tracking-widest text-text-faint transition-colors duration-300 hover:text-text"
          :tabindex="isOpen ? 0 : -1"
        >
          Vimeo
        </a>
        <a
          :href="META.WORKS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-text-faint transition-colors duration-300 hover:text-text"
          :tabindex="isOpen ? 0 : -1"
        >
          Additional Works
          <span
            class="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >↗</span>
        </a>
      </div>

      <span class="font-mono text-[10px] tracking-widest text-text-faint">
        © {{ new Date().getFullYear() }} {{ META.OWNER }}
      </span>
    </div>
  </div>
</template>

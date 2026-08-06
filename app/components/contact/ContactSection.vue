<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import { useLenis }  from '@/composables/useLenis'
import { ANIMATION } from '@shared/constants/ANIMATION'
import { CONTACT }   from '@shared/constants/CONTACT'
import { LAYOUT }    from '@shared/constants/LAYOUT'
import { META, NAVIGATION } from '@shared/constants/META'

const { fadeUp, clipReveal } = useReveal()
const { scrollTo }           = useLenis()

function onNavClick(hash: string): void {
  scrollTo(hash, { offset: -LAYOUT.HEADER_OFFSET })
}

const eyebrowRef  = ref<HTMLElement | null>(null)
const headingRef  = ref<HTMLElement | null>(null)
const taglineRef  = ref<HTMLElement | null>(null)
const emailRef    = ref<HTMLElement | null>(null)
const socialsRef  = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
    fadeUp([taglineRef.value, emailRef.value, socialsRef.value], {
      stagger: ANIMATION.STAGGER.LOOSE,
      delay:   ANIMATION.DELAY.LONG,
    })
  })
})
</script>

<template>
  <section class="relative flex min-h-screen flex-col bg-void">

    <!-- Section rule -->
    <div class="mx-6 h-px bg-border md:mx-10" aria-hidden="true" />

    <!-- Main content: single column on mobile, two columns on desktop -->
    <div class="flex flex-1 flex-col md:flex-row">

      <!-- Left column: text content -->
      <div class="flex flex-col justify-center px-6 py-24 md:flex-1 md:px-10">

        <!-- Eyebrow -->
        <p
          ref="eyebrowRef"
          class="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
        >
          05 — Contact
        </p>

        <!-- Heading -->
        <!-- pb-4 extends the padding box so clip-path: inset(0 0 0% 0) from clipReveal
             doesn't cut off descenders (g, y) in "Together." at tight leading-[0.88]. -->
        <h2
          ref="headingRef"
          class="mb-8 pb-6 font-display font-normal leading-[0.88] text-text"
          style="font-size: clamp(52px, 9vw, 144px);"
        >
          {{ CONTACT.HEADING_TOP }}<br />
          <em>{{ CONTACT.HEADING_FOOT }}</em>
        </h2>

        <!-- Tagline -->
        <p
          ref="taglineRef"
          class="mb-14 max-w-[52ch] font-sans text-base font-light leading-relaxed text-text-muted opacity-0"
        >
          {{ CONTACT.TAGLINE }}
        </p>

        <!-- Email — the hero CTA link -->
        <a
          ref="emailRef"
          :href="`mailto:${CONTACT.EMAIL}`"
          class="group relative mb-16 inline-block w-fit font-display font-normal italic leading-[1.2] text-text opacity-0"
          style="font-size: clamp(22px, 3.5vw, 52px);"
          :aria-label="`Email ${CONTACT.EMAIL}`"
        >
          {{ CONTACT.EMAIL }}
          <!-- Animated underline -->
          <span
            class="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-text transition-transform duration-500 ease-out group-hover:scale-x-100"
            aria-hidden="true"
          />
        </a>

        <!-- Social links -->
        <nav ref="socialsRef" aria-label="Social links" class="opacity-0">
          <ul class="flex flex-wrap gap-8">
            <li v-for="social in CONTACT.SOCIALS" :key="social.label">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors duration-300 hover:text-text"
              >
                {{ social.label }}
                <span
                  class="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Right column: phone mockup (desktop only) -->
      <div
        class="hidden md:flex md:flex-1 items-end justify-center pb-12 pr-10 lg:pr-20"
        aria-hidden="true"
      >
        <!-- Phone frame -->
        <div
          class="relative overflow-hidden rounded-[40px] border border-text/10"
          style="width: clamp(200px, 22vw, 300px); aspect-ratio: 9/19.5; background: oklch(6% 0 0);"
        >
          <!-- Dynamic Island — iPhone 16 Pro proportions: ~30% screen width, tall pill -->
          <div
            class="absolute left-1/2 z-10 -translate-x-1/2 rounded-[14px]"
            style="width: 30%; height: 22px; top: 14px; background: oklch(2% 0 0);"
          />

          <!-- Animated screen — slides through profile → grid → project photos -->
          <ContactPhoneSlideshow class="absolute inset-0" />

          <!-- Home bar sits above the slideshow -->
          <div class="absolute bottom-2 left-1/2 z-10 h-0.5 w-10 -translate-x-1/2 rounded-full bg-text/20" />
        </div>
      </div>
    </div>

    <!-- Bottom bar — site nav + copyright -->
    <footer class="flex items-center justify-between border-t border-border px-6 py-6 md:px-10">
      <p class="font-mono text-[9px] text-text-faint">
        © {{ new Date().getFullYear() }} {{ META.SITE_NAME }}. All rights reserved.
      </p>
      <nav aria-label="Footer navigation">
        <ul class="flex gap-6">
          <li v-for="item in NAVIGATION" :key="item.hash">
            <a
              :href="item.hash"
              class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint transition-colors duration-300 hover:text-text"
              @click.prevent="onNavClick(item.hash)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </footer>

  </section>
</template>

<script setup lang="ts">
import { useReveal }  from '@/composables/useReveal'
import { ANIMATION } from '@shared/constants/ANIMATION'
import { CONTACT }   from '@shared/constants/CONTACT'
import { META }      from '@shared/constants/META'
import { NAVIGATION } from '@shared/constants/META'

const { fadeUp, clipReveal } = useReveal()

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

    <!-- Main content — vertically centred in remaining height -->
    <div class="flex flex-1 flex-col justify-center px-6 py-24 md:px-10">

      <!-- Eyebrow -->
      <p
        ref="eyebrowRef"
        class="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
      >
        05 — Contact
      </p>

      <!-- Heading -->
      <h2
        ref="headingRef"
        class="mb-8 font-display font-normal leading-[0.88] text-text"
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
        class="group relative mb-16 inline-block w-fit overflow-hidden font-display font-normal italic leading-none text-text opacity-0"
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

    <!-- Bottom bar — site nav + copyright -->
    <footer class="flex items-center justify-between border-t border-border px-6 py-6 md:px-10">
      <p class="font-mono text-[9px] text-text-faint">
        © {{ new Date().getFullYear() }} {{ META.SITE_NAME }}. All rights reserved.
      </p>
      <nav aria-label="Footer navigation">
        <ul class="flex gap-6">
          <li v-for="item in NAVIGATION" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint transition-colors duration-300 hover:text-text"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </footer>

  </section>
</template>

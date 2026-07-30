<script setup lang="ts">
import { useReveal }  from '@/composables/useReveal'
import { ANIMATION }  from '@shared/constants/ANIMATION'
import { META }       from '@shared/constants/META'
import { CONTACT }    from '@shared/constants/CONTACT'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title:       `Contact — ${META.SITE_NAME}`,
  description: `Get in touch with ${META.OWNER} for weddings, portraits, commercial projects, and brand films.`,
})

const { fadeUp, clipReveal } = useReveal()

const eyebrowRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const formRef    = ref<HTMLElement | null>(null)
const infoRef    = ref<HTMLElement | null>(null)

const form = reactive({
  name:    '',
  email:   '',
  project: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted  = ref(false)

async function onSubmit(): Promise<void> {
  isSubmitting.value = true
  // Placeholder — wire to a real form endpoint (Resend, Formspree, etc.) before launch
  await new Promise<void>(resolve => setTimeout(resolve, 1000))
  isSubmitting.value = false
  isSubmitted.value  = true
}

onMounted(() => {
  nextTick(() => {
    fadeUp([eyebrowRef.value], {})
    clipReveal(headingRef, { direction: 'up', delay: ANIMATION.DELAY.DEFAULT })
    fadeUp([infoRef.value, formRef.value], {
      stagger: ANIMATION.STAGGER.LOOSE,
      delay:   ANIMATION.DELAY.LONG,
    })
  })
})
</script>

<template>
  <main class="min-h-screen bg-void px-6 pb-24 pt-32 md:px-10 md:pb-36 md:pt-40">

    <!-- Header -->
    <div class="mb-16 md:mb-24">
      <p
        ref="eyebrowRef"
        class="mb-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint opacity-0"
      >
        04 — Contact
      </p>
      <h1
        ref="headingRef"
        class="font-display font-light leading-[0.88] text-text"
        style="font-size: clamp(48px, 7vw, 120px);"
      >
        Begin a<br /><em>Project.</em>
      </h1>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24">

      <!-- Left: contact info -->
      <div ref="infoRef" class="opacity-0">
        <p class="mb-10 max-w-[38ch] font-sans text-base font-light leading-relaxed text-text-muted">
          {{ CONTACT.TAGLINE }}
        </p>

        <div class="mb-10">
          <p class="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">Email</p>
          <a
            :href="`mailto:${CONTACT.EMAIL}`"
            class="font-display text-xl font-light italic text-text transition-opacity hover:opacity-70"
          >
            {{ CONTACT.EMAIL }}
          </a>
        </div>

        <div>
          <p class="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">Follow</p>
          <ul class="flex flex-col gap-2">
            <li v-for="social in CONTACT.SOCIALS" :key="social.label">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-text"
              >
                {{ social.label }}
                <span class="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right: form -->
      <div ref="formRef" class="opacity-0">

        <!-- Success state -->
        <div v-if="isSubmitted" class="flex flex-col gap-4">
          <p class="font-display text-3xl font-light italic text-text">Thank you.</p>
          <p class="font-sans text-base font-light text-text-muted">
            Your message has been received. I'll be in touch shortly.
          </p>
        </div>

        <form v-else class="flex flex-col gap-8" @submit.prevent="onSubmit">

          <!-- Name -->
          <div class="flex flex-col gap-2">
            <label for="name" class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
              Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              placeholder="Your name"
              class="border-b border-border bg-transparent py-3 font-sans text-base font-light text-text placeholder:text-text-faint focus:border-text focus:outline-none transition-colors"
            />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              class="border-b border-border bg-transparent py-3 font-sans text-base font-light text-text placeholder:text-text-faint focus:border-text focus:outline-none transition-colors"
            />
          </div>

          <!-- Project type -->
          <div class="flex flex-col gap-2">
            <label for="project" class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
              Project type
            </label>
            <input
              id="project"
              v-model="form.project"
              type="text"
              placeholder="Wedding, portrait, commercial…"
              class="border-b border-border bg-transparent py-3 font-sans text-base font-light text-text placeholder:text-text-faint focus:border-text focus:outline-none transition-colors"
            />
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-2">
            <label for="message" class="font-mono text-[9px] uppercase tracking-[0.2em] text-text-faint">
              Message
            </label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="4"
              placeholder="Tell me about your project…"
              class="resize-none border-b border-border bg-transparent py-3 font-sans text-base font-light text-text placeholder:text-text-faint focus:border-text focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="group mt-2 flex w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            <span>{{ isSubmitting ? 'Sending…' : 'Send message' }}</span>
            <span class="inline-block transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
          </button>

        </form>
      </div>
    </div>

  </main>
</template>

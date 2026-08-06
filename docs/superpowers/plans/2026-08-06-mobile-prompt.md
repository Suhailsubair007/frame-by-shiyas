# Mobile Experience Prompt — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a one-time, non-blocking overlay to mobile visitors after the splash screen wipes away, recommending the desktop experience, with two dismiss-only buttons.

**Architecture:** Module-level singleton composable (`useMobilePrompt`) owns visibility state and localStorage persistence. `TheMobilePrompt.vue` owns timing (watches preloader completion, checks mobile breakpoint) and GSAP animation. Mounted in `app.vue` as a singleton alongside `ThePreloader`.

**Tech Stack:** Vue 3.5 `<script setup>`, GSAP, Tailwind CSS v4, `@vueuse/core`, `localStorage`

## Global Constraints

- TypeScript strict — no `any`, explicit return types on all exported functions
- No inline `style=""` except for values unreachable via Tailwind (complex gradients, CSS custom property references)
- All `localStorage` access guarded by `import.meta.client`
- Animations respect `useReducedMotion()` — skip translate, keep opacity-only transitions
- GSAP durations and eases sourced from `ANIMATION` constants only
- No magic strings — all storage keys live in `STORAGE_KEYS` constant
- `readonly()` on all externally exposed refs
- Section order in SFCs: `<script setup>` → `<template>` → `<style scoped>`
- z-index via CSS custom properties from `main.css` (e.g. `var(--z-modal)`)

---

### Task 1: STORAGE_KEYS constant

**Files:**
- Create: `shared/constants/STORAGE_KEYS.ts`

**Interfaces:**
- Produces: `STORAGE_KEYS.MOBILE_PROMPT_DISMISSED` — string constant `'fbs-mobile-prompt-dismissed'`, consumed by Task 2

- [ ] **Step 1: Create the file**

```ts
// shared/constants/STORAGE_KEYS.ts
export const STORAGE_KEYS = {
  MOBILE_PROMPT_DISMISSED: 'fbs-mobile-prompt-dismissed',
} as const
```

- [ ] **Step 2: Verify TypeScript accepts it**

```bash
cd /Users/suhail/Desktop/frame-by-shiyas
npx nuxi typecheck
```

Expected: no new errors introduced.

- [ ] **Step 3: Commit**

```bash
git add shared/constants/STORAGE_KEYS.ts
git commit -m "feat(constants): add STORAGE_KEYS for localStorage key management"
```

---

### Task 2: useMobilePrompt composable

**Files:**
- Create: `app/composables/useMobilePrompt.ts`

**Interfaces:**
- Consumes: `STORAGE_KEYS.MOBILE_PROMPT_DISMISSED` from `@shared/constants/STORAGE_KEYS`
- Produces:
  - `useMobilePrompt()` → `{ isVisible: Readonly<Ref<boolean>>, show(): void, dismiss(): void, isDismissed(): boolean }`
  - `show()` — sets `_isVisible` to `true`
  - `dismiss()` — sets `_isVisible` to `false` and writes to localStorage
  - `isDismissed()` — reads localStorage, returns `true` if already dismissed

- [ ] **Step 1: Create the composable**

```ts
// app/composables/useMobilePrompt.ts
import { STORAGE_KEYS } from '@shared/constants/STORAGE_KEYS'

// Module-level singleton — persists for the lifetime of the page session.
const _isVisible = ref(false)

export function useMobilePrompt() {
  function show(): void {
    _isVisible.value = true
  }

  function dismiss(): void {
    _isVisible.value = false
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED, '1')
    }
  }

  function isDismissed(): boolean {
    if (!import.meta.client) return false
    return localStorage.getItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED) === '1'
  }

  return {
    isVisible: readonly(_isVisible),
    show,
    dismiss,
    isDismissed,
  } as const
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx nuxi typecheck
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/composables/useMobilePrompt.ts
git commit -m "feat(composable): add useMobilePrompt for mobile overlay state and persistence"
```

---

### Task 3: TheMobilePrompt component

**Files:**
- Create: `app/components/layout/TheMobilePrompt.vue`

**Interfaces:**
- Consumes:
  - `useMobilePrompt()` — `{ isVisible, show, dismiss, isDismissed }`
  - `usePreloader()` — `{ isComplete: Readonly<Ref<boolean>> }`
  - `useMediaQuery()` — `{ isMobile: Ref<boolean> }`
  - `useReducedMotion()` — returns `Ref<boolean>`
  - `ANIMATION.DURATION.FAST` (0.3), `ANIMATION.DURATION.DEFAULT` (0.6)
  - `ANIMATION.EASE.EXPO_OUT`, `ANIMATION.EASE.IN`

- [ ] **Step 1: Create the component**

```vue
<!-- app/components/layout/TheMobilePrompt.vue -->
<script setup lang="ts">
import { gsap }             from 'gsap'
import { usePreloader }     from '@/composables/usePreloader'
import { useMobilePrompt }  from '@/composables/useMobilePrompt'
import { useMediaQuery }    from '@/composables/useMediaQuery'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'

const { isComplete }       = usePreloader()
const { isVisible, show, dismiss, isDismissed } = useMobilePrompt()
const { isMobile }         = useMediaQuery()
const prefersReducedMotion = useReducedMotion()

const promptRef     = ref<HTMLElement | null>(null)
const cardRef       = ref<HTMLElement | null>(null)
const primaryBtnRef = ref<HTMLButtonElement | null>(null)

// ── Timing: show after preloader wipes away ──────────────────────────────────
onMounted(() => {
  if (isDismissed()) return

  const stop = watch(isComplete, (done) => {
    if (!done) return
    stop()
    if (!isMobile.value) return
    setTimeout(() => show(), 400)
  }, { immediate: true })
})

// ── Keyboard: Escape dismisses ───────────────────────────────────────────────
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isVisible.value) handleDismiss()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Animation: enter ─────────────────────────────────────────────────────────
watch(isVisible, async (val) => {
  if (!val) return
  await nextTick()
  animateIn()
  primaryBtnRef.value?.focus()
})

function animateIn(): void {
  const el   = promptRef.value
  const card = cardRef.value
  if (!el || !card) return

  if (prefersReducedMotion.value) {
    gsap.set(el, { opacity: 1 })
    gsap.set(card, { y: 0 })
    return
  }

  gsap.timeline()
    .fromTo(el, { opacity: 0 }, {
      opacity:  1,
      duration: ANIMATION.DURATION.FAST,
      ease:     'none',
    })
    .fromTo(card, { y: 48 }, {
      y:        0,
      duration: ANIMATION.DURATION.DEFAULT,
      ease:     ANIMATION.EASE.EXPO_OUT,
    }, 0)
}

// ── Animation: leave ─────────────────────────────────────────────────────────
function handleDismiss(): void {
  const el = promptRef.value
  if (!el || prefersReducedMotion.value) { dismiss(); return }

  gsap.to(el, {
    opacity:    0,
    duration:   ANIMATION.DURATION.FAST,
    ease:       ANIMATION.EASE.IN,
    onComplete: dismiss,
  })
}
</script>

<template>
  <div
    v-if="isVisible"
    ref="promptRef"
    class="fixed inset-0 opacity-0"
    style="z-index: var(--z-modal);"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mobile-prompt-heading"
  >
    <!-- Backdrop — does not dismiss on click (avoids accidental taps) -->
    <div
      class="absolute inset-0"
      style="background: oklch(4% 0 0 / 0.8); backdrop-filter: blur(6px);"
      aria-hidden="true"
    />

    <!-- Card -->
    <div
      ref="cardRef"
      class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-void px-6 pb-10 pt-8"
    >
      <!-- Handle bar -->
      <div class="mx-auto mb-6 h-px w-10 bg-border" aria-hidden="true" />

      <!-- Label -->
      <p class="font-mono text-[8px] uppercase tracking-[0.42em] text-text-faint">
        Heads Up
      </p>

      <!-- Heading -->
      <h2
        id="mobile-prompt-heading"
        class="mt-3 font-display text-[28px] font-normal italic leading-tight text-text"
      >
        Better on Desktop
      </h2>

      <!-- Body -->
      <p class="mt-3 font-sans text-sm leading-relaxed text-text-faint">
        This portfolio is crafted for large screens. For the full cinematic
        experience, visit on a desktop or laptop.
      </p>

      <!-- Actions -->
      <div class="mt-8 flex flex-col gap-3">
        <!-- Primary -->
        <button
          ref="primaryBtnRef"
          class="w-full rounded-full border border-border-strong py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-text transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:opacity-70"
          @click="handleDismiss"
        >
          Use Desktop
        </button>

        <!-- Secondary -->
        <button
          class="w-full py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-text-faint transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:opacity-50"
          @click="handleDismiss"
        >
          Continue on Mobile
        </button>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify it renders in isolation — open the dev server**

```bash
npm run dev
```

Open the site on a mobile viewport (DevTools → Toggle device toolbar, pick any phone). Confirm the prompt appears after the splash wipes. Confirm both buttons dismiss it. Confirm it does not appear on a desktop viewport.

- [ ] **Step 3: Verify localStorage persistence**

In DevTools → Application → Local Storage, confirm `fbs-mobile-prompt-dismissed` is set to `'1'` after dismissal. Hard-refresh the page — confirm the prompt does not appear again.

Clear the key (`localStorage.removeItem('fbs-mobile-prompt-dismissed')`) and refresh — confirm it reappears.

- [ ] **Step 4: Commit**

```bash
git add app/components/layout/TheMobilePrompt.vue
git commit -m "feat(layout): add TheMobilePrompt singleton overlay for mobile visitors"
```

---

### Task 4: Wire into app.vue

**Files:**
- Modify: `app/app.vue`

**Interfaces:**
- Consumes: `TheMobilePrompt` (auto-imported by Nuxt from `app/components/layout/`)

- [ ] **Step 1: Add the component**

Replace the current `app/app.vue` content with:

```vue
<template>
  <div>
    <!-- Preloader sits above everything; rendered in SSR so the overlay
         is in HTML from the first paint — prevents hero flash. -->
    <ThePreloader />

    <!-- Mobile experience prompt — shown once to mobile visitors after
         the splash wipes, recommending the desktop experience. -->
    <TheMobilePrompt />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

- [ ] **Step 2: Full end-to-end verification**

```bash
npm run dev
```

Checklist:
- [ ] Desktop viewport (≥ 768px): prompt never appears
- [ ] Mobile viewport (< 768px), first visit: prompt appears ~400ms after splash
- [ ] Mobile viewport, after dismissal via either button: prompt gone, localStorage key set
- [ ] Mobile viewport, page hard-refresh after dismissal: prompt never reappears
- [ ] Escape key dismisses the prompt
- [ ] `prefers-reduced-motion` emulated in DevTools: no slide animation, opacity only
- [ ] Tab key cycles between the two buttons

- [ ] **Step 3: Commit**

```bash
git add app/app.vue
git commit -m "feat(app): mount TheMobilePrompt alongside ThePreloader"
```

# Mobile Responsive Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix eight discrete mobile UX issues identified in the full-site audit — one functional overflow bug, one interaction dead-zone, two touch-target violations, two missing safe-area insets, and three spacing imbalances.

**Architecture:** Each task is an isolated, file-scoped change. No new composables or components are introduced. The tap-to-reveal feature in Task 2 reuses the existing `useMediaQuery` composable's `hasPointer` value to branch behaviour between pointer and touch devices. The safe-area utility added in Task 1 is consumed by Tasks 6 and 7.

**Tech Stack:** Nuxt 4, Vue 3.5 (`<script setup lang="ts">`), Tailwind CSS v4, TypeScript strict.

## Global Constraints

- All Vue components use `<script setup lang="ts">` — Options API is forbidden.
- `any` type is forbidden — TypeScript strict mode must pass with zero errors.
- Inline `style=""` is permitted only for CSS values Tailwind cannot generate (e.g. `clamp()`, `env()`).
- Tailwind arbitrary values are forbidden for values that exist on the standard scale.
- All interactive elements must remain keyboard-accessible after changes.
- No console.log or debug statements in committed code.
- Commit messages follow Conventional Commits: `fix(scope): description`.

---

## File Map

| File | Role in this plan |
|---|---|
| `app/assets/css/main.css` | Add `.pb-safe` utility (Task 1) |
| `app/components/photography/PhotographyCard.vue` | Tap-to-reveal on touch (Task 2) |
| `app/components/photography/PhotographyFilter.vue` | Larger touch targets (Task 3) |
| `app/components/contact/ContactSection.vue` | Footer stack + spacing (Task 4) |
| `app/components/about/AboutSection.vue` | Consistent gutter padding (Task 5) |
| `app/components/layout/TheMobilePrompt.vue` | Handle bar + safe area (Task 6) |
| `app/components/layout/TheNavMenu.vue` | Safe area footer padding (Task 7) |
| `app/components/reels/ReelsSection.vue` | Reduced mobile vertical padding (Task 8) |

---

## Task 1: Add `.pb-safe` CSS utility

**Files:**
- Modify: `app/assets/css/main.css`

**Interfaces:**
- Produces: `.pb-safe` — applies `padding-bottom: max(2.5rem, env(safe-area-inset-bottom, 0px))`. Used by Tasks 6 and 7.

- [ ] **Step 1: Open `app/assets/css/main.css` and add the utility inside `@layer utilities`**

  Locate the existing `@layer utilities { ... }` block. Add this rule as the last entry before the closing `}`:

  ```css
  /* Safe-area bottom padding — floors at 2.5 rem (40 px) on devices without
     a home indicator; uses the env inset on notched iPhones (≈34 px + flooring). */
  .pb-safe {
    padding-bottom: max(2.5rem, env(safe-area-inset-bottom, 0px));
  }
  ```

- [ ] **Step 2: Verify the build picks it up**

  Run: `npm run dev`
  Open browser DevTools → Elements → search for `.pb-safe`. Confirm the rule is present in the generated CSS. No error should appear in the terminal.

- [ ] **Step 3: Commit**

  ```bash
  git add app/assets/css/main.css
  git commit -m "fix(css): add pb-safe utility for safe-area-inset-bottom"
  ```

---

## Task 2: Photography Card — Tap-to-Reveal on Touch

**Files:**
- Modify: `app/components/photography/PhotographyCard.vue`

**Interfaces:**
- Consumes: `useMediaQuery` from `@/composables/useMediaQuery` — specifically `hasPointer` (`Ref<boolean>`, true when `(hover: hover) and (pointer: fine)`, i.e. a real mouse).
- Consumes: `useCursorState` and `useReveal` — already present, untouched.

- [ ] **Step 1: Read the current file to understand the exact structure**

  The file is at `app/components/photography/PhotographyCard.vue`. Current `<script setup>` imports `useCursorState` and `useReveal`. Current template inner `div` carries the `group` class and all `group-hover:` bindings. Confirm this before editing.

- [ ] **Step 2: Add `useMediaQuery` import and reactive state to `<script setup>`**

  In `<script setup lang="ts">`, after the existing imports, add:

  ```ts
  import { useMediaQuery } from '@/composables/useMediaQuery'

  const { hasPointer } = useMediaQuery()
  const isRevealed     = ref(false)

  function handleCardClick(): void {
    if (!hasPointer.value) {
      isRevealed.value = !isRevealed.value
    }
  }
  ```

  The full `<script setup>` block should look like:

  ```vue
  <script setup lang="ts">
  import { useCursorState }         from '@/composables/useCursorState'
  import { useReveal }              from '@/composables/useReveal'
  import { useMediaQuery }          from '@/composables/useMediaQuery'
  import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
  import { CURSOR_STATE }           from '@shared/enums/CursorState'

  const props = defineProps<{
    project: PROJECT_LIST_ITEM
  }>()

  const { setState, reset } = useCursorState()
  const { clipReveal }      = useReveal()
  const { hasPointer }      = useMediaQuery()
  const isRevealed          = ref(false)

  const wrapRef       = ref<HTMLElement | null>(null)
  const categoryLabel = computed(() => props.project.category.replace(/_/g, ' '))

  function handleCardClick(): void {
    if (!hasPointer.value) {
      isRevealed.value = !isRevealed.value
    }
  }

  onMounted(() => {
    nextTick(() => {
      if (!wrapRef.value) return
      clipReveal(wrapRef, { direction: 'up' })
    })
  })
  </script>
  ```

- [ ] **Step 3: Update the template — add `@click` and replace hover-only class bindings**

  Replace the entire `<template>` with:

  ```vue
  <template>
    <div
      ref="wrapRef"
      class="relative overflow-hidden rounded-sm bg-surface/5"
      :class="project.isLandscape ? 'aspect-video' : 'aspect-[3/4]'"
    >
      <div
        class="group absolute inset-0 block"
        @click="handleCardClick"
        @mouseenter="setState(CURSOR_STATE.VIEW)"
        @mouseleave="reset()"
      >
        <img
          :src="project.coverImage.src"
          :alt="project.coverImage.alt"
          :width="project.coverImage.width"
          :height="project.coverImage.height"
          sizes="(max-width: 767px) calc(100vw - 48px), calc(50vw - 52px)"
          class="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        <!-- Gradient veil:
             Pointer device  → opacity follows group-hover
             Touch device    → opacity follows isRevealed -->
        <div
          class="absolute inset-0 transition-opacity duration-500"
          :class="hasPointer
            ? 'opacity-0 group-hover:opacity-100'
            : (isRevealed ? 'opacity-100' : 'opacity-0')"
          style="background: linear-gradient(to bottom, transparent 35%, oklch(4% 0 0 / 0.85) 100%);"
          aria-hidden="true"
        />

        <!-- Metadata:
             Pointer device  → slides up and fades in on hover
             Touch device    → appears/disappears instantly on tap -->
        <div
          class="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out"
          :class="hasPointer
            ? 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            : (isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')"
        >
          <p class="mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-text-faint">
            {{ categoryLabel }}
          </p>
          <h3 class="font-display text-xl font-light italic leading-tight text-text">
            {{ project.title }}
          </h3>
          <p v-if="project.tagline" class="mt-1 font-mono text-[9px] text-text-muted">
            {{ project.tagline }}
          </p>
        </div>
      </div>
    </div>
  </template>
  ```

- [ ] **Step 4: Verify — desktop hover still works, touch tap reveals**

  ```
  npm run dev
  ```
  Desktop: hover a card → gradient veil and metadata appear. Move mouse away → they disappear. ✓
  Mobile emulation (DevTools → Toggle Device Toolbar): tap a card → metadata appears. Tap again → hides. ✓

- [ ] **Step 5: Commit**

  ```bash
  git add app/components/photography/PhotographyCard.vue
  git commit -m "fix(photography): tap-to-reveal card metadata on touch devices"
  ```

---

## Task 3: Photography Filter — Touch Target Size

**Files:**
- Modify: `app/components/photography/PhotographyFilter.vue`

**Interfaces:**
- None. Self-contained visual change.

- [ ] **Step 1: Change `py-1.5` to `py-2.5 md:py-1.5` on the filter button**

  In `app/components/photography/PhotographyFilter.vue`, locate the `<button>` element's class string. Change:

  ```
  class="rounded-full border px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300"
  ```

  to:

  ```
  class="rounded-full border px-4 py-2.5 md:py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300"
  ```

- [ ] **Step 2: Verify in mobile emulation**

  ```
  npm run dev
  ```
  DevTools → Toggle Device Toolbar → check Photography section filter row.
  Each pill must be at least 44px tall on mobile. Desktop pills remain smaller. ✓

- [ ] **Step 3: Commit**

  ```bash
  git add app/components/photography/PhotographyFilter.vue
  git commit -m "fix(photography): increase filter pill touch targets to 44px on mobile"
  ```

---

## Task 4: Contact Section — Footer Stack + Spacing

**Files:**
- Modify: `app/components/contact/ContactSection.vue`

**Interfaces:**
- None. Self-contained layout + spacing changes.

- [ ] **Step 1: Fix the footer layout — stack on mobile**

  Locate the `<footer>` element (currently line ~137). It reads:

  ```html
  <footer class="flex items-center justify-between border-t border-border px-6 py-6 md:px-10">
  ```

  Change to:

  ```html
  <footer class="flex flex-col gap-4 border-t border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
  ```

- [ ] **Step 2: Fix the tagline bottom margin**

  Locate the tagline `<p>` (currently has `mb-14`). Change `mb-14` to `mb-10 md:mb-14`:

  ```html
  <p
    ref="taglineRef"
    class="mb-10 md:mb-14 max-w-[52ch] font-sans text-base font-light leading-relaxed text-text-muted opacity-0"
  >
  ```

- [ ] **Step 3: Fix the email link font size clamp**

  Locate the email `<a>` element. Its inline style currently reads:
  ```
  style="font-size: clamp(22px, 3.5vw, 52px);"
  ```
  Change to:
  ```
  style="font-size: clamp(26px, 3.5vw, 52px);"
  ```

- [ ] **Step 4: Verify**

  ```
  npm run dev
  ```
  Mobile emulation: scroll to Contact section footer.
  Copyright text is on its own row. Nav links appear below it. No horizontal overflow. ✓
  Email address text is comfortably legible (≥26px). ✓
  Spacing between tagline and email is tighter on mobile (40px gap) than desktop (56px). ✓

- [ ] **Step 5: Commit**

  ```bash
  git add app/components/contact/ContactSection.vue
  git commit -m "fix(contact): stack footer on mobile, tighten tagline margin, bump email size"
  ```

---

## Task 5: About Section — Consistent Gutter Padding

**Files:**
- Modify: `app/components/about/AboutSection.vue`

**Interfaces:**
- None. Single class string change.

- [ ] **Step 1: Change `px-8` to `px-6` on the right content column**

  Locate the right content `<div>`. Its class currently starts with:
  ```
  class="flex flex-col justify-center px-8 py-12 md:px-12 md:py-14 lg:px-16"
  ```
  Change to:
  ```
  class="flex flex-col justify-center px-6 py-12 md:px-12 md:py-14 lg:px-16"
  ```

- [ ] **Step 2: Verify**

  ```
  npm run dev
  ```
  Mobile emulation: scroll to About section. The right column's left and right gutters (24px) should match the `px-6` gutters used in every other section. ✓

- [ ] **Step 3: Commit**

  ```bash
  git add app/components/about/AboutSection.vue
  git commit -m "fix(about): align content column padding to site-wide px-6 gutter on mobile"
  ```

---

## Task 6: Mobile Prompt — Handle Bar + Safe Area

**Files:**
- Modify: `app/components/layout/TheMobilePrompt.vue`

**Interfaces:**
- Consumes: `.pb-safe` utility from Task 1.

- [ ] **Step 1: Confirm Task 1 is complete** — `.pb-safe` must exist in `main.css` before this task runs.

- [ ] **Step 2: Fix the handle bar from 1px to 4px**

  Locate the handle bar `<div>`:
  ```html
  <div
    class="mx-auto mb-6 h-px w-10 bg-border"
    aria-hidden="true"
  />
  ```
  Change `h-px` to `h-1 rounded-full`:
  ```html
  <div
    class="mx-auto mb-6 h-1 w-10 rounded-full bg-border"
    aria-hidden="true"
  />
  ```

- [ ] **Step 3: Add safe-area padding to the card**

  Locate the card `<div>`:
  ```html
  <div
    ref="cardRef"
    class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-void px-6 pb-10 pt-8"
  >
  ```
  Replace `pb-10` with `pb-safe`:
  ```html
  <div
    ref="cardRef"
    class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-void px-6 pb-safe pt-8"
  >
  ```

- [ ] **Step 4: Verify**

  ```
  npm run dev
  ```
  Mobile emulation: trigger the mobile prompt (first visit, or clear `localStorage` for `mobile-prompt-dismissed`).
  Handle bar is visually a 4px pill — clearly a drag affordance. ✓
  On a simulated notched device (iPhone X in DevTools), the buttons should sit above the safe area. ✓

- [ ] **Step 5: Commit**

  ```bash
  git add app/components/layout/TheMobilePrompt.vue
  git commit -m "fix(mobile-prompt): thicken handle bar to 4px, add safe-area bottom padding"
  ```

---

## Task 7: Nav Menu — Safe Area Footer Padding

**Files:**
- Modify: `app/components/layout/TheNavMenu.vue`

**Interfaces:**
- Consumes: `.pb-safe` utility from Task 1.

- [ ] **Step 1: Confirm Task 1 is complete** — `.pb-safe` must exist in `main.css`.

- [ ] **Step 2: Change `pb-8` to `pb-safe` on the nav menu footer row**

  Locate the footer `<div>` inside `TheNavMenu.vue`:
  ```html
  <div
    ref="footerRef"
    class="flex items-end justify-between px-6 pb-8 opacity-0 md:px-10"
  >
  ```
  Replace `pb-8` with `pb-safe`:
  ```html
  <div
    ref="footerRef"
    class="flex items-end justify-between px-6 pb-safe opacity-0 md:px-10"
  >
  ```

- [ ] **Step 3: Verify**

  ```
  npm run dev
  ```
  Mobile emulation (iPhone X profile): open the nav menu. Social links and copyright must sit above the home indicator area — not obscured by the 34px gesture zone. ✓
  On a device without a home indicator (older iPhone simulation): padding resolves to `2.5rem` (40px) — same comfortable spacing as before. ✓

- [ ] **Step 4: Commit**

  ```bash
  git add app/components/layout/TheNavMenu.vue
  git commit -m "fix(nav): add safe-area bottom padding to menu footer row"
  ```

---

## Task 8: Reels Section — Reduce Mobile Vertical Padding

**Files:**
- Modify: `app/components/reels/ReelsSection.vue`

**Interfaces:**
- None. Single class string change on the `<section>` element.

- [ ] **Step 1: Change `py-24` to `py-16` on mobile**

  Locate the `<section>` opening tag:
  ```html
  <section
    class="overflow-hidden bg-void py-24 md:py-32"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
  ```
  Change `py-24 md:py-32` to `py-16 md:py-32`:
  ```html
  <section
    class="overflow-hidden bg-void py-16 md:py-32"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
  ```

- [ ] **Step 2: Verify**

  ```
  npm run dev
  ```
  Mobile emulation: scroll to Reels section. The section breathes comfortably without the excess 96px top/bottom padding. Carousel remains centered and fully visible. ✓
  Desktop: padding is still `py-32` (128px). ✓

- [ ] **Step 3: Commit**

  ```bash
  git add app/components/reels/ReelsSection.vue
  git commit -m "fix(reels): reduce section vertical padding on mobile from py-24 to py-16"
  ```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `.pb-safe` CSS utility | Task 1 ✓ |
| Photography card tap-to-reveal | Task 2 ✓ |
| Photography filter `py-2.5 md:py-1.5` | Task 3 ✓ |
| Contact footer `flex-col` on mobile | Task 4 ✓ |
| Contact tagline `mb-10 md:mb-14` | Task 4 ✓ |
| Contact email `clamp(26px,...)` | Task 4 ✓ |
| About `px-6` on mobile | Task 5 ✓ |
| Mobile prompt `h-1 rounded-full` handle | Task 6 ✓ |
| Mobile prompt `pb-safe` | Task 6 ✓ |
| Nav menu `pb-safe` | Task 7 ✓ |
| Reels `py-16 md:py-32` | Task 8 ✓ |

**Dependency order:** Task 1 must run before Tasks 6 and 7. Tasks 2–5, 8 are fully independent of each other and of Tasks 6–7. Safe to run 2–5 and 8 in any order in parallel with Task 1, then run 6 and 7 after Task 1.

**Placeholder scan:** None found. All steps contain exact code or exact class strings.

**Type consistency:** `hasPointer` is of type `Ref<boolean>` per `useMediaQuery.ts`. Used as `.value` in `handleCardClick()` — consistent. `isRevealed` is `ref(false)` — used as `.value` — consistent.

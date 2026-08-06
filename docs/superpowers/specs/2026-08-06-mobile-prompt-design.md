# Mobile Experience Prompt — Design Spec

**Date:** 2026-08-06
**Status:** Approved

---

## Overview

A one-time overlay shown to mobile visitors after the splash screen wipes away. It politely recommends the desktop experience but is fully non-blocking — both CTA buttons dismiss the prompt and let the user proceed normally on mobile. Shown once per user via `localStorage`; never shown again until storage is cleared.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `app/composables/useMobilePrompt.ts` | All state, detection, persistence, and dismiss logic |
| `app/components/layout/TheMobilePrompt.vue` | Singleton presentational component |
| `shared/constants/STORAGE_KEYS.ts` | Centralises all localStorage/sessionStorage key strings |

### Modified files

| File | Change |
|---|---|
| `app/app.vue` | Add `<TheMobilePrompt />` alongside `<ThePreloader />` |

---

## Composable — `useMobilePrompt.ts`

### State (module-level singletons)

```ts
const _isVisible = ref(false)
```

### Logic

- Uses `useMediaQuery().isMobile` (existing composable, `max-width: 767px`) for device detection.
- On `onMounted` (client only, guarded with `import.meta.client`):
  - Read `localStorage.getItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED)`.
  - If already dismissed → do nothing, return early.
- Watch `isComplete` from `usePreloader`:
  - When it becomes `true` AND `isMobile.value` is `true` → wait 400 ms, then set `_isVisible.value = true`.
  - Stop the watch after firing (one-shot).
- `dismiss()` function:
  - Sets `_isVisible.value = false`.
  - Writes `localStorage.setItem(STORAGE_KEYS.MOBILE_PROMPT_DISMISSED, '1')`.

### Return shape

```ts
return {
  isVisible: readonly(_isVisible),
  dismiss,
} as const
```

---

## Constants — `STORAGE_KEYS.ts`

```ts
export const STORAGE_KEYS = {
  MOBILE_PROMPT_DISMISSED: 'fbs-mobile-prompt-dismissed',
} as const
```

Mirrors existing constant conventions (`ANIMATION`, `BREAKPOINTS`, etc.).

---

## Component — `TheMobilePrompt.vue`

### Visual design

- **Overlay:** `position: fixed`, full screen, `z-index` above all content. Semi-transparent dark backdrop: `oklch(4% 0 0 / 0.75)` with `backdrop-filter: blur(4px)`. Clicking the backdrop does NOT dismiss (avoids accidental dismissals).
- **Card:** Bottom-anchored, slides up from below. Dark surface matching the site palette (`bg-void` or equivalent). Rounded top corners (`rounded-t-2xl`). Padding `px-6 py-8`.
- **Contents (top to bottom):**
  1. Small mono label: `HEADS UP` — `font-mono text-[8px] uppercase tracking-[0.42em] text-text-faint`
  2. Heading: `Better on Desktop` — `font-display italic` at ~28px
  3. Body: `"This portfolio is crafted for large screens. For the full cinematic experience, visit on a desktop or laptop."` — `font-sans text-sm text-text-faint`
  4. Two buttons side by side (full width, stacked on very small screens):
     - **Continue on Mobile** — ghost/outline style, secondary action
     - **Use Desktop** — filled accent style, primary action
  5. Both buttons call `dismiss()`. No navigation, no redirect.

### Animation

- **Enter:** Backdrop fades in (`opacity: 0 → 1`, 300ms), card slides up (`y: 40px → 0`, 400ms, `expo.out`). Uses GSAP, triggered when `isVisible` becomes `true` via `watch`.
- **Leave:** Fade out entire prompt (`opacity: 1 → 0`, 250ms, `power2.in`), then set `display: none`. Triggered by `dismiss()`.
- **Reduced motion:** Skip translate, opacity-only transitions. Respect `useReducedMotion()`.

### Props / Emits

None. The component reads directly from `useMobilePrompt()`.

---

## Integration — `app.vue`

```vue
<template>
  <div>
    <ThePreloader />
    <TheMobilePrompt />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

`TheMobilePrompt` renders `null` (via `v-if="isVisible"` on the overlay) until triggered, so there is zero DOM overhead on desktop.

---

## Persistence

- **Storage:** `localStorage` (key: `fbs-mobile-prompt-dismissed`).
- **Value:** `'1'` (presence check, not boolean, avoids JSON parsing).
- **Scope:** Permanent per browser profile until storage is cleared.
- **SSR safety:** All localStorage access is guarded by `import.meta.client`.

---

## Accessibility

- Overlay uses `role="dialog"` and `aria-modal="true"`.
- `aria-labelledby` points to the heading.
- Focus is trapped within the card while it is visible (`useFocusTrap` from VueUse or manual implementation).
- Buttons are full keyboard-navigable.
- No `aria-live` regions needed (prompt is not dynamic content).

---

## Checklist

- [ ] `useMobilePrompt` composable with module-level singleton state
- [ ] `STORAGE_KEYS` constant file
- [ ] `TheMobilePrompt.vue` with GSAP enter/leave animations
- [ ] `app.vue` integration
- [ ] `prefers-reduced-motion` respected
- [ ] SSR safety (`import.meta.client` guards on all localStorage access)
- [ ] Focus trap while prompt is visible
- [ ] TypeScript strict — no `any`, explicit return types on exported functions

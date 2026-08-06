# Mobile Responsive Optimization — Design Spec
**Date:** 2026-08-07
**Scope:** `frame-by-shiyas` portfolio — full mobile audit from Hero to Footer

---

## Background

A full audit of every section from `HeroSection` through `ContactSection` revealed nine
discrete mobile UX issues: one functional overflow bug, one interaction dead-zone, two
touch-target violations, two missing safe-area insets, and three spacing imbalances.
This spec defines the fix for each.

---

## Issues and Fixes

### 1 — Photography Card: Touch Interaction Dead-Zone

**Problem:** `PhotographyCard.vue` reveals title and category only via `group-hover:` CSS.
On touch devices, hover never fires. Card metadata is permanently invisible on mobile.

**Decision (user-confirmed):** Tap to reveal — first tap shows the overlay/metadata, a
second tap hides it. Desktop hover behaviour is preserved unchanged.

**Implementation:**
- Import `useMediaQuery` (already exists); destructure `hasPointer`.
- Add `const isRevealed = ref(false)`.
- Add `function handleCardClick(): void` that toggles `isRevealed` only when
  `!hasPointer.value`.
- Bind `@click="handleCardClick"` on the inner group `div`.
- Replace hardcoded `opacity-0 group-hover:opacity-100` classes on the gradient veil
  and metadata block with computed `:class` bindings that use `group-hover:` on pointer
  devices and `isRevealed` state on touch devices.

**Files changed:** `app/components/photography/PhotographyCard.vue`

---

### 2 — Photography Filter: Touch Targets Too Small

**Problem:** Filter pills have `py-1.5` (≈32px tap height). iOS HIG minimum is 44px.

**Fix:** Change `py-1.5` → `py-2.5 md:py-1.5` on each `<button>` in
`PhotographyFilter.vue`. No visual change on desktop.

**Files changed:** `app/components/photography/PhotographyFilter.vue`

---

### 3 — Contact Footer: Overflow on Mobile

**Problem:** `ContactSection.vue` footer uses `flex items-center justify-between`.
On a 375px screen (327px content area), the copyright string "© 2026 Frame by Shiyas.
All rights reserved." is ~200px wide, leaving insufficient room for four nav items
without overflow or collision.

**Fix:**
- Footer element: `flex flex-col gap-4 items-start md:flex-row md:items-center md:justify-between`.
- The copyright renders first (top on mobile), nav links below it.
- On `md+` the existing side-by-side layout is restored.

**Additional spacing fixes in the same file:**
- Tagline `mb-14` → `mb-10 md:mb-14` (56px → 40px on mobile).
- Email link clamp: `clamp(22px, 3.5vw, 52px)` → `clamp(26px, 3.5vw, 52px)` for a
  slightly more comfortable tap target.

**Files changed:** `app/components/contact/ContactSection.vue`

---

### 4 — About Section: Inconsistent Padding

**Problem:** Right content column uses `px-8` (32px per side) on mobile. Every other
section uses `px-6` (24px). Creates a narrower content column than the site standard.

**Fix:** Change `px-8 py-12 md:px-12 md:py-14 lg:px-16` →
`px-6 py-12 md:px-12 md:py-14 lg:px-16`.

**Files changed:** `app/components/about/AboutSection.vue`

---

### 5 — Mobile Prompt: Handle Bar & Safe Area

**Problem A:** The drag handle is `h-px` (1px). iOS HIG specifies 4–5px.
**Problem B:** The card uses `pb-10` with no safe-area-inset-bottom handling. On iPhone
models with a home indicator, the action buttons sit in the gesture area.

**Fix A:** Handle bar `h-px w-10` → `h-1 w-10 rounded-full`.
**Fix B:** Card `pb-10` → `pb-safe` (custom utility defined in §8).

**Files changed:** `app/components/layout/TheMobilePrompt.vue`

---

### 6 — Nav Menu Footer: Safe Area

**Problem:** Nav overlay footer has `pb-8` with no safe-area handling. On iPhones with
a home indicator (≈34px gesture area), social links and copyright can sit behind the
system bar.

**Fix:** Change `pb-8` → `pb-safe` in `TheNavMenu.vue`.

**Files changed:** `app/components/layout/TheNavMenu.vue`

---

### 7 — Reels Section: Vertical Padding Imbalance

**Problem:** `py-24 md:py-32` leaves 96px top and bottom padding on mobile — the same
as desktop. The section already has a tall carousel; on small phones the combined height
can feel oppressive.

**Fix:** `py-24 md:py-32` → `py-16 md:py-32` on the section.
Section header `mb-12 md:mb-16` → unchanged (already responsive).

**Files changed:** `app/components/reels/ReelsSection.vue`

---

### 8 — Global CSS: Safe Area Utility

**Problem:** No utility exists for safe-area-inset-bottom handling.

**Fix:** Add to `app/assets/css/main.css` in `@layer utilities`:

```css
.pb-safe {
  padding-bottom: max(2.5rem, env(safe-area-inset-bottom, 0px));
}
```

This resolves to 40px on devices without a home indicator, and to the inset (≈34px on
modern iPhones, plus flooring at 40px) on notched devices. Used by fixes 5 and 6.

**Files changed:** `app/assets/css/main.css`

---

## Files Modified (Summary)

| File | Change |
|---|---|
| `app/assets/css/main.css` | Add `.pb-safe` utility |
| `app/components/photography/PhotographyCard.vue` | Tap-to-reveal on touch |
| `app/components/photography/PhotographyFilter.vue` | Larger touch targets |
| `app/components/contact/ContactSection.vue` | Footer stack + spacing |
| `app/components/about/AboutSection.vue` | Consistent gutter padding |
| `app/components/layout/TheMobilePrompt.vue` | Handle bar height + safe area |
| `app/components/layout/TheNavMenu.vue` | Safe area footer padding |
| `app/components/reels/ReelsSection.vue` | Reduced mobile vertical padding |

---

## What Is Not Changed

- Hero section: viewfinder corners, headline clamp, and scroll indicator positions are
  correct as-is.
- Reels carousel height: `clamp(480px, 78vh, 820px)` is appropriate across screen sizes.
- Navigation header: `px-6 py-5 md:px-10 md:py-6` is correct.
- TheCursor: already hidden on touch via `html.has-custom-cursor` which only applies on
  pointer devices.
- Films section: currently commented out in `pages/index.vue`; out of scope.

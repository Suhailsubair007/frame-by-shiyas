# CLAUDE.md — Engineering Standards for frame-by-shiyas

> This document is the single source of truth for every engineering decision in this project.
> Every line of code generated must comply with every rule defined here.
> Before writing a single line, re-read the relevant sections of this document.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 |
| UI Runtime | Vue 3.5 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Linting | ESLint (with `@nuxt/eslint`) |
| Formatting | Prettier |
| Build | Vite (via Nuxt) |
| Package Manager | npm |

---

## The Final Principle

Before submitting any code, ask:

> "If this project grows to hundreds of components and multiple developers, would this still be considered clean, scalable, maintainable, and production-ready?"

If the answer is **no** — rewrite before presenting.

---

## Before Writing Code

Every feature implementation must follow this sequence:

1. Analyse the full request and understand intent.
2. Identify all reusable abstractions the feature requires.
3. Check whether existing components can be extended or reused.
4. Check whether existing composables can be extended.
5. Identify all types, constants, and enums the feature needs.
6. State the implementation plan explicitly before writing code.
7. Only then begin implementation.

Never skip steps. Never write first and plan later.

---

## Project Structure

This project uses **Nuxt 4's `app/` directory** as the application root.

```
frame-by-shiyas/
├── app/                          # Application root (Nuxt 4)
│   ├── app.vue                   # Root component — layout outlet only
│   ├── assets/                   # Processed by Vite (fonts, images, SVGs, global CSS)
│   │   ├── css/
│   │   │   └── main.css          # Tailwind entry, CSS custom properties
│   │   ├── fonts/
│   │   └── images/               # Images that need Vite processing
│   ├── components/               # Reusable Vue components (auto-imported)
│   │   ├── base/                 # Primitive UI atoms (BaseButton, BaseImage, etc.)
│   │   ├── layout/               # Structural components (TheHeader, TheFooter)
│   │   └── [feature]/            # Feature-scoped components
│   ├── composables/              # Reusable stateful logic (auto-imported)
│   ├── layouts/                  # Page layout wrappers
│   ├── middleware/               # Route middleware
│   ├── pages/                    # File-based routing
│   ├── plugins/                  # Nuxt plugins
│   └── utils/                    # Pure utility functions (auto-imported)
├── shared/                       # Code shared between app and server (Nuxt 4)
│   ├── constants/                # Application-wide constants
│   ├── enums/                    # TypeScript enums
│   ├── types/                    # Shared TypeScript types and interfaces
│   └── utils/                    # Isomorphic utility functions
├── server/                       # Server-only code (H3 / Nitro)
│   ├── api/                      # API route handlers
│   ├── middleware/               # Server middleware
│   └── utils/                    # Server-only utilities
├── public/                       # Static files served as-is (favicon, robots.txt)
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
├── eslint.config.mjs             # ESLint flat config
├── .prettierrc                   # Prettier configuration
└── tsconfig.json                 # TypeScript project references
```

### Folder Responsibilities

**`app/app.vue`**
The root component. Contains only `<NuxtLayout>` and `<NuxtPage>`. No business logic. No styles.

**`app/assets/`**
Files processed by Vite's asset pipeline. Use for fonts, images requiring optimisation, SVGs used in components, and the global CSS entry point. Never reference files in `public/` from components — put them here instead unless they must be served at a fixed URL.

**`app/components/`**
Reusable Vue components. Organised into sub-folders by domain. The `base/` folder holds primitive atoms used across all features. The `layout/` folder holds singleton structural components prefixed with `The`. Feature folders hold components scoped to a single feature domain.

**`app/composables/`**
All reusable stateful logic. Auto-imported by Nuxt. Each composable encapsulates one focused concern. Business logic must not live in components — it belongs here.

**`app/layouts/`**
Page layout wrappers. Each layout defines the chrome surrounding a page (header, footer, nav). Pages declare which layout to use via `definePageMeta`.

**`app/middleware/`**
Route middleware executed before navigation. Keep middleware thin — validate, redirect, or guard. No business logic.

**`app/pages/`**
File-based routing. Page components are responsible only for composing layouts of feature components. No business logic inside pages.

**`app/plugins/`**
Nuxt plugins for global setup: registering third-party libraries, providing global state, configuring directives. Plugins run once. Keep them small.

**`app/utils/`**
Pure, framework-independent utility functions. Auto-imported. No side effects. No Vue reactivity. No Nuxt dependencies.

**`shared/`**
Code that is safe to run on both the client and server. Types, constants, enums, and pure utilities that both `app/` and `server/` need live here.

**`server/`**
Server-only code running in Nitro. API route handlers, server middleware, and server utilities. Never import Vue or browser APIs here.

**`public/`**
Files served verbatim at the root URL. Use only for files that must have a stable public URL (favicon, robots.txt, sitemaps, open-graph images). Do not reference these from components via `/path` — use the `public/` path only in metadata or external links.

---

## File Naming Conventions

| Context | Convention | Examples |
|---|---|---|
| Vue components | `PascalCase.vue` | `ProjectCard.vue`, `TheHeader.vue`, `BaseButton.vue` |
| Pages | `kebab-case.vue` | `index.vue`, `about.vue`, `project-[slug].vue` |
| Layouts | `kebab-case.vue` | `default.vue`, `minimal.vue` |
| Composables | `camelCase.ts` | `useGallery.ts`, `useScroll.ts`, `useVideo.ts` |
| Utilities | `camelCase.ts` | `formatDate.ts`, `slugify.ts`, `clamp.ts` |
| Types / Interfaces | `PascalCase.ts` | `Project.ts`, `GalleryImage.ts` |
| Enums | `PascalCase.ts` | `MediaType.ts`, `GalleryCategory.ts` |
| Constants | `SCREAMING_SNAKE_CASE.ts` or `camelCase.ts` | `ROUTES.ts`, `BREAKPOINTS.ts`, `animationConfig.ts` |
| Stores (Pinia) | `camelCase.ts` + `Store` suffix | `useGalleryStore.ts`, `useUiStore.ts` |
| Plugins | `kebab-case.ts` | `analytics.client.ts`, `gsap.client.ts` |
| Server routes | `kebab-case.ts` | `projects.get.ts`, `[id].get.ts` |
| CSS / assets | `kebab-case` | `main.css`, `hero-bg.jpg`, `inter-variable.woff2` |

### Critical Naming Rules

- Singleton components used exactly once per page are prefixed with `The`: `TheHeader.vue`, `TheFooter.vue`, `TheNavigation.vue`.
- Base primitive components are prefixed with `Base`: `BaseButton.vue`, `BaseImage.vue`, `BaseIcon.vue`.
- Composables always begin with `use`: `useScroll`, `useMediaQuery`, `useProjectFilter`.
- Pages use `kebab-case` to match URL segments directly.
- `.client.ts` suffix on plugins runs client-only. `.server.ts` suffix runs server-only.

---

## Import Rules

### Alias Configuration

Configure path aliases in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, 'app'),
    '~': resolve(__dirname, 'app'),
    '@shared': resolve(__dirname, 'shared'),
    '@server': resolve(__dirname, 'server'),
  },
})
```

### Import Order

All imports must follow this exact order, separated by blank lines:

```ts
// 1. Framework (Vue, Nuxt, Vue Router)
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Third-party libraries
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 3. Internal aliases — composables, components, utils
import { useGallery } from '@/composables/useGallery'
import { formatDate } from '@/utils/formatDate'

// 4. Shared types and interfaces
import type { PROJECT, GALLERY_ITEM } from '@shared/types/Project'

// 5. Constants and enums
import { ROUTES } from '@shared/constants/ROUTES'
import { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

// 6. Styles (only in entry files or plugins)
import '@/assets/css/main.css'
```

### Forbidden Import Patterns

```ts
// FORBIDDEN — relative traversal imports
import { useGallery } from '../../../composables/useGallery'
import type { PROJECT } from '../../../../types/Project'

// REQUIRED — alias imports
import { useGallery } from '@/composables/useGallery'
import type { PROJECT } from '@shared/types/Project'
```

### Rules

- Relative imports (`../`) are forbidden for anything more than one level deep.
- Same-directory relative imports (`./ `) are permitted.
- Unused imports are forbidden. ESLint enforces this.
- Circular imports are forbidden. Restructure before importing.
- Type-only imports must use `import type`.

---

## TypeScript

### Configuration

`tsconfig.json` extends Nuxt's generated config. The Nuxt-generated config already enables strict mode. Never weaken it.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Rules

**`any` is forbidden.** Use `unknown` when the type is genuinely unknown, then narrow it.

```ts
// FORBIDDEN
function process(data: any) {}

// CORRECT
function process(data: unknown) {
  if (typeof data === 'string') { /* ... */ }
}
```

**Explicit return types on all exported functions.**

```ts
// FORBIDDEN
export function getProjectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

// CORRECT
export function getProjectSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-')
}
```

**Interfaces for object contracts. Type aliases for unions, intersections, and primitives.**

```ts
// Object contract — use interface
interface PROJECT {
  readonly id: string
  title: string
  slug: string
  category: GALLERY_CATEGORY
  publishedAt: Date
  images: readonly GALLERY_IMAGE[]
}

// Union — use type alias
type LOADING_STATE = 'idle' | 'loading' | 'success' | 'error'

// Discriminated union — use type alias
type API_RESULT<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
```

**`readonly` on all properties that must not be mutated after construction.**

**No magic strings.** Every domain string lives in an enum or constant.

**No magic numbers.** Every numeric literal with meaning lives in a named constant.

**No implicit `any` from JSON.parse, API responses, or untyped third-party libraries.** Define types. Use type guards or Zod schemas to validate at runtime boundaries.

---

## Component Rules

### Structure

Every Single File Component must follow this exact section order:

```vue
<script setup lang="ts">
// imports
// props
// emits
// composables
// computed
// methods
// lifecycle hooks
</script>

<template>
  <!-- template -->
</template>

<style scoped>
/* only when Tailwind is insufficient */
</style>
```

Always use `<script setup lang="ts">`. Never use the Options API.

### Props

```ts
// Define props with runtime validation and TypeScript
const props = defineProps<{
  project: PROJECT
  isActive?: boolean
  variant?: 'primary' | 'secondary'
}>()

// Defaults via withDefaults
const props = withDefaults(defineProps<{
  isActive?: boolean
  variant?: 'primary' | 'secondary'
}>(), {
  isActive: false,
  variant: 'primary',
})
```

### Emits

```ts
const emit = defineEmits<{
  select: [project: PROJECT]
  close: []
}>()
```

### Size and Complexity

- A component should do exactly one thing.
- If a component's template exceeds ~80 lines, extract sub-components.
- If a component's `<script setup>` exceeds ~60 lines, extract logic into a composable.
- Never duplicate template markup. Extract shared markup into a component.
- Never duplicate business logic. Extract into a composable.

### Component Categories

| Prefix | Purpose | Example |
|---|---|---|
| `Base` | Primitive atoms — no business logic | `BaseButton`, `BaseImage` |
| `The` | Singleton structural — one per page | `TheHeader`, `TheFooter` |
| *(none)* | Feature component — domain-specific | `ProjectCard`, `GalleryGrid` |

### Forbidden Patterns

```vue
<!-- FORBIDDEN: inline styles -->
<div style="margin-top: 24px">

<!-- FORBIDDEN: magic numbers in template -->
<div class="mt-[24px]" />

<!-- FORBIDDEN: complex logic in template -->
<div v-if="projects.filter(p => p.category === 'wedding' && p.published).length > 0">

<!-- CORRECT: computed property -->
<div v-if="hasPublishedWeddingProjects">
```

---

## Composables

### Rules

- Every composable begins with `use`: `useGallery`, `useScroll`, `useVideo`.
- One composable, one concern. A composable that does many things must be split.
- Composables may use other composables — but watch for circular dependencies.
- Always return a plain object with named properties. Never return a single ref directly.
- Composables used in components must be called at the top level of `<script setup>`, never conditionally.

### Structure

```ts
// app/composables/useGallery.ts

export function useGallery(category: Ref<GALLERY_CATEGORY>) {
  const projects = ref<PROJECT[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredProjects = computed(() =>
    projects.value.filter(p => p.category === category.value)
  )

  async function fetchProjects(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      projects.value = await projectService.getAll()
    } catch (e) {
      error.value = 'Failed to load projects.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects: readonly(projects),
    filteredProjects,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchProjects,
  } as const
}
```

### Forbidden Patterns

```ts
// FORBIDDEN: God composable doing everything
export function useApp() { /* fetches, routes, animates, handles auth... */ }

// FORBIDDEN: returning raw ref
export function useIsOpen() {
  const isOpen = ref(false)
  return isOpen // caller can mutate internal state
}

// CORRECT: controlled exposure
export function useIsOpen() {
  const isOpen = ref(false)
  function open() { isOpen.value = true }
  function close() { isOpen.value = false }
  return { isOpen: readonly(isOpen), open, close } as const
}
```

---

## Utilities

### Rules

- Pure functions only. No side effects. No mutation of arguments.
- Framework-independent. No Vue imports. No Nuxt imports.
- Single responsibility. One function, one transformation.
- Fully typed input and output.
- Auto-imported by Nuxt from `app/utils/`.

```ts
// app/utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// app/utils/clamp.ts
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
```

---

## Constants

Constants live in `shared/constants/`. Every constant is exported as an immutable value.

```ts
// shared/constants/ROUTES.ts
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  GALLERY: '/gallery',
  PROJECT: (slug: string) => `/gallery/${slug}`,
  CONTACT: '/contact',
} as const

// shared/constants/ANIMATION.ts
export const ANIMATION = {
  DURATION_FAST: 0.2,
  DURATION_DEFAULT: 0.4,
  DURATION_SLOW: 0.8,
  EASE_DEFAULT: 'power2.out',
  EASE_IN: 'power2.in',
  EASE_INOUT: 'power2.inOut',
} as const

// shared/constants/BREAKPOINTS.ts
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// shared/constants/META.ts
export const META = {
  SITE_NAME: 'Frame by Shiyas',
  DEFAULT_TITLE: 'Frame by Shiyas — Photography',
  DEFAULT_DESCRIPTION: 'Professional photography by Shiyas.',
  OG_IMAGE: '/og-image.jpg',
} as const
```

### What Must Always Be a Constant

- All route paths
- All animation durations and easing values
- All breakpoint values
- All API endpoint paths
- All storage keys
- All regex patterns used more than once
- All UI limit values (max file size, pagination limits, etc.)
- All repeated user-facing messages and labels

---

## Enums

Use enums for finite domain values that represent a closed set of options.

```ts
// shared/enums/GalleryCategory.ts
export enum GALLERY_CATEGORY {
  WEDDING = 'wedding',
  PORTRAIT = 'portrait',
  COMMERCIAL = 'commercial',
  EDITORIAL = 'editorial',
  TRAVEL = 'travel',
}

// shared/enums/MediaType.ts
export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
}

// shared/enums/AnimationState.ts
export enum ANIMATION_STATE {
  IDLE = 'idle',
  ENTERING = 'entering',
  VISIBLE = 'visible',
  LEAVING = 'leaving',
}
```

When only two or three values exist and they are obvious, prefer a literal union type over an enum:

```ts
// Prefer union for simple binary/ternary values
type THEME = 'light' | 'dark'
type ORIENTATION = 'horizontal' | 'vertical'

// Use enum when values are domain concepts with many members
export enum GALLERY_CATEGORY { /* ... */ }
```

---

## Types and Interfaces

All shared types live in `shared/types/`. App-only types may live in `app/types/` if they are not needed server-side.

```ts
// shared/types/Project.ts
import type { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'
import type { MEDIA_TYPE } from '@shared/enums/MediaType'

export interface GALLERY_IMAGE {
  readonly id: string
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly blurDataUrl?: string
}

export interface PROJECT {
  readonly id: string
  title: string
  slug: string
  category: GALLERY_CATEGORY
  description: string
  coverImage: GALLERY_IMAGE
  images: readonly GALLERY_IMAGE[]
  publishedAt: string
  isFeatured: boolean
}

export interface PROJECT_LIST_ITEM
  extends Pick<PROJECT, 'id' | 'title' | 'slug' | 'category' | 'coverImage' | 'isFeatured'> {}
```

### Rules

- Interfaces for all object shapes and contracts.
- `readonly` on all properties that should not change after creation.
- Use `Pick`, `Omit`, `Partial`, and `Required` to derive types rather than duplicating shape definitions.
- All `import type` — never import types with `import` when only type information is needed.
- No `any`. No `object`. No `{}` as a type (use `Record<string, unknown>` or a specific interface).

---

## Styling — Tailwind CSS

### Setup

Use Tailwind CSS v4 (CSS-first configuration via `@import "tailwindcss"` in `app/assets/css/main.css`).

```css
/* app/assets/css/main.css */
@import "tailwindcss";

@theme {
  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;

  --color-brand: oklch(55% 0.2 260);
  --color-surface: oklch(98% 0 0);
  --color-text: oklch(15% 0 0);

  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Rules

- Use Tailwind utility classes exclusively for layout, spacing, typography, and colour.
- Maintain consistent use of the design scale. Do not introduce arbitrary spacing values unless unavoidable. Prefer the scale: `4`, `8`, `12`, `16`, `24`, `32`, `48`, `64`, `96`.
- When the same combination of utilities appears in more than one component, extract it into a reusable component — not a Tailwind `@apply` class.
- `@apply` in `<style scoped>` is permitted only for complex interactive states (pseudo-elements, animations) that are not achievable with utilities in the template.
- Inline styles (`style=""`) are forbidden.
- Avoid `!important`. If you need it, the CSS architecture has a problem.
- Respect `prefers-reduced-motion` with `motion-safe:` and `motion-reduce:` variants.

```vue
<!-- FORBIDDEN: arbitrary values for values that exist on the scale -->
<div class="mt-[16px] px-[24px]">

<!-- CORRECT: using the scale -->
<div class="mt-4 px-6">

<!-- FORBIDDEN: inline style -->
<div style="margin-top: 16px">

<!-- CORRECT: tailwind utility -->
<div class="mt-4">

<!-- CORRECT: respecting motion preference -->
<div class="transition-opacity duration-300 motion-reduce:transition-none">
```

---

## Code Style

### Early Returns

Prefer early returns over nested conditionals.

```ts
// FORBIDDEN: nested
function getProjectUrl(project: PROJECT | null): string {
  if (project !== null) {
    if (project.slug) {
      return ROUTES.PROJECT(project.slug)
    } else {
      return ROUTES.GALLERY
    }
  } else {
    return ROUTES.GALLERY
  }
}

// CORRECT: early returns
function getProjectUrl(project: PROJECT | null): string {
  if (!project?.slug) return ROUTES.GALLERY
  return ROUTES.PROJECT(project.slug)
}
```

### Boolean Naming

Boolean variables and props must read naturally as a predicate:

```ts
// CORRECT
const isLoading = ref(false)
const hasImages = computed(() => images.value.length > 0)
const canNavigate = computed(() => currentIndex.value < totalCount.value - 1)
const shouldAnimate = computed(() => !prefersReducedMotion.value)

// FORBIDDEN
const loading = ref(false)
const images_exist = computed(...)
const navigatable = computed(...)
```

### Function Design

- One function, one responsibility.
- Avoid functions with more than 3–4 parameters. Group related parameters into an options object.
- Avoid functions longer than ~30 lines. Extract sub-operations.
- Prefer `const` arrow functions for utilities. Prefer `function` declarations for composable methods (hoisting clarity).

### Nesting Depth

Maximum template and logic nesting depth: **3 levels**. Beyond 3, extract into a sub-component or composable.

---

## Comments

**Comments explain WHY, never WHAT.**

```ts
// FORBIDDEN: states the obvious
// increment the counter
count.value++

// FORBIDDEN: re-describes the code
// filter projects by category
const filtered = projects.filter(p => p.category === activeCategory.value)

// CORRECT: explains a non-obvious constraint
// GSAP's ScrollTrigger must be registered before any ScrollTrigger instances are created.
// Doing this in a plugin ensures it runs once, before any page component mounts.
gsap.registerPlugin(ScrollTrigger)

// CORRECT: documents a browser quirk
// Safari requires a non-zero duration on transitions for them to fire on display:none changes.
```

Write zero comments unless they meet one of these criteria:

- A non-obvious business rule or domain constraint.
- A browser bug workaround.
- An architectural decision with significant trade-offs.
- A timing/ordering requirement that is not apparent from the code.

---

## Performance

### Vue Reactivity

- Prefer `computed` over `watch`. Computed properties are lazy and cached; watchers are eager and can fire unnecessarily.
- Avoid `watch` with `deep: true` unless absolutely necessary — it forces full traversal on every change.
- Never put expensive operations inside `computed` that has side effects.
- Use `watchEffect` only when the dependency list is dynamic and cannot be expressed as a `computed`.

### Rendering

- Lazy-load heavy components with `defineAsyncComponent` and `<Suspense>`:

```ts
const HeavyGallery = defineAsyncComponent(() => import('@/components/HeavyGallery.vue'))
```

- Use `v-once` on static content that will never update.
- Use `v-memo` on large lists where appropriate.
- Avoid `v-if` + `v-for` on the same element. Use a `computed` to filter the list first, then `v-for` over the result.

### Images and Media

- All images must specify explicit `width` and `height` to prevent layout shift.
- Use `loading="lazy"` on all below-the-fold images.
- Use `<video>` with `preload="none"` or `preload="metadata"`. Never auto-preload large video files.
- Prefer modern formats: WebP for photos, AVIF where supported.
- Provide `srcset` for responsive images.

### Nuxt Specifics

- Use `useFetch` and `useAsyncData` for server-side data fetching. Never fetch inside `onMounted` for data that can be fetched on the server.
- Use `<NuxtLink>` instead of `<a>` for all internal links — it enables prefetching.
- Leverage `<NuxtPicture>` for automatic image optimisation.

---

## Accessibility

- Use semantic HTML. `<button>` for actions. `<a>` for navigation. `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>` appropriately.
- Every interactive element must be keyboard-navigable (Tab) and activatable (Enter / Space).
- All `<img>` elements must have meaningful `alt` text. Decorative images use `alt=""`.
- Visible focus styles must never be removed. Customise with Tailwind's `focus-visible:` variant rather than removing outlines.
- Use ARIA attributes only when semantic HTML cannot express the required role or state. Prefer semantic HTML over ARIA.
- All animations must respect `prefers-reduced-motion`. Use `motion-safe:` and `motion-reduce:` Tailwind variants, or check `window.matchMedia('(prefers-reduced-motion: reduce)')` in GSAP logic.
- Colour contrast must meet WCAG AA (4.5:1 for body text, 3:1 for large text).

---

## Error Handling

### Rules

- Never swallow errors with empty catch blocks.
- Every async operation in a composable must expose an `error` ref.
- Errors at API boundaries must be caught, logged, and surfaced to the user.
- User-facing error messages must be human-readable and actionable.

```ts
// FORBIDDEN: silent error
try {
  await fetchProjects()
} catch {}

// FORBIDDEN: raw error exposed to user
catch (e) {
  error.value = (e as Error).message
}

// CORRECT: controlled error handling
catch (e) {
  console.error('[useGallery] Failed to fetch projects:', e)
  error.value = 'We could not load the gallery. Please try again.'
}
```

### Server Routes

Every server API route must:

1. Validate the request input with explicit type guards or a schema validator.
2. Return a consistent response shape: `{ data: T }` on success, `{ error: string }` on failure.
3. Use `createError` from H3 for HTTP error responses.

---

## Pages

Pages are thin orchestration layers. They compose feature components and provide layout context. They do not contain business logic.

```vue
<!-- app/pages/gallery/[slug].vue -->
<script setup lang="ts">
import { ROUTES } from '@shared/constants/ROUTES'
import { useProject } from '@/composables/useProject'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { project, isLoading, error } = await useProject(route.params.slug as string)

useSeoMeta({
  title: () => project.value?.title ?? META.DEFAULT_TITLE,
  description: () => project.value?.description ?? META.DEFAULT_DESCRIPTION,
})
</script>

<template>
  <main>
    <ProjectDetail
      v-if="project"
      :project="project"
    />
    <LoadingState v-else-if="isLoading" />
    <ErrorState
      v-else-if="error"
      :message="error"
    />
  </main>
</template>
```

---

## Layouts

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
// No business logic in layouts
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
```

---

## Server (API Routes)

```ts
// server/api/projects/index.get.ts
import type { PROJECT } from '@shared/types/Project'

export default defineEventHandler(async (): Promise<{ data: PROJECT[] }> => {
  const projects = await fetchProjectsFromCms()
  return { data: projects }
})

// server/api/projects/[slug].get.ts
export default defineEventHandler(async (event): Promise<{ data: PROJECT }> => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required.' })
  }

  const project = await fetchProjectBySlug(slug)

  if (!project) {
    throw createError({ statusCode: 404, message: 'Project not found.' })
  }

  return { data: project }
})
```

---

## Clean Code Principles

### SOLID

- **S** — Single Responsibility: every component, composable, and function does one thing.
- **O** — Open/Closed: extend behaviour via composition, not modification of existing code.
- **L** — Liskov Substitution: subtypes must honour parent contracts (relevant to generic composables).
- **I** — Interface Segregation: prefer small, focused interfaces over large monolithic ones.
- **D** — Dependency Inversion: composables depend on abstractions (interfaces/types), not concrete implementations.

### DRY

If code appears in more than one place, extract it. No exceptions.

### KISS

Prefer the simplest solution that is correct and maintainable. Do not over-engineer.

### YAGNI

Do not implement features, abstractions, or generalisations that are not required now. Solve today's problem. Refactor when the second use case arrives.

---

## Reusability Decision Tree

```
Does this UI markup appear in more than one component?
  → YES: Extract into a reusable component.

Does this business logic appear in more than one component?
  → YES: Extract into a composable.

Does this function appear in more than one composable or utility?
  → YES: Move to app/utils/ or shared/utils/.

Does this value appear hardcoded in more than one place?
  → YES: Move to shared/constants/.

Does this type/interface appear in more than one file?
  → YES: Move to shared/types/.
```

---

## Git Conventions

### Commit Message Format (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | When to use |
|---|---|
| `feat` | A new feature or user-visible capability |
| `fix` | A bug fix |
| `refactor` | Code restructuring with no behaviour change |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace, no logic changes |
| `docs` | Documentation changes |
| `test` | Adding or correcting tests |
| `chore` | Build tooling, dependencies, CI configuration |
| `a11y` | Accessibility improvements |

### Examples

```
feat(gallery): add infinite scroll to project grid
fix(header): correct mobile menu close on route change
refactor(useGallery): extract filter logic into pure utility
perf(images): add blur placeholder to above-fold hero image
a11y(navigation): add keyboard trap to mobile menu overlay
chore(deps): upgrade nuxt to 4.5.1
```

### Rules

- Subject line: imperative mood, present tense, no full stop, max 72 characters.
- Body: explains WHY, not WHAT. The diff explains what changed.
- Never commit commented-out code.
- Never commit `console.log` or debug statements.
- Never commit `.env` files, secrets, or credentials.

---

## ESLint and Prettier

### ESLint (`eslint.config.mjs`)

Use `@nuxt/eslint` which includes Vue and TypeScript rules.

Key enforced rules:

- `no-unused-vars` — error
- `no-console` — warn (permitted in server routes and plugins, not components)
- `vue/component-api-style: ['script-setup']` — error
- `vue/define-props-declaration: ['typescript']` — error
- `vue/no-v-html` — error (XSS risk)
- `@typescript-eslint/no-explicit-any` — error
- `@typescript-eslint/explicit-function-return-type` — error for exported functions
- `import/no-cycle` — error
- `import/order` — error (enforces import group order above)

### Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## Checklist Before Any Code Is Merged

- [ ] TypeScript strict mode passes with zero errors.
- [ ] ESLint passes with zero errors.
- [ ] No `any` types.
- [ ] No unused imports or variables.
- [ ] No hardcoded strings, numbers, or routes.
- [ ] No relative imports deeper than one level.
- [ ] No business logic in page or layout components.
- [ ] No duplicated logic — composables and utilities are DRY.
- [ ] No duplicated UI — reusable components are used.
- [ ] All images have explicit `width`, `height`, and `alt`.
- [ ] All interactive elements are keyboard-accessible.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Errors are handled and surfaced meaningfully.
- [ ] Component template nesting is 3 levels or fewer.
- [ ] Commit message follows Conventional Commits format.

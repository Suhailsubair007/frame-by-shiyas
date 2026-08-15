import type { MEDIA_IMAGE, MEDIA_VIDEO, MEDIA_FILM } from '@shared/types/Media'
import { GALLERY_CATEGORY }              from '@shared/enums/GalleryCategory'

// ── CDN roots ────────────────────────────────────────────────────────────────
// Single source of truth for every remote asset. Change the host once here and
// every gallery, reel, and the hero video follow.
const CDN_ORIGIN = 'https://cdn.muhmdshiyas.com'
const IMAGE_BASE = `${CDN_ORIGIN}/images`
const VIDEO_BASE = `${CDN_ORIGIN}/videos`

// Portrait aspect used by the source photography; kept as constants so no raw
// numbers leak into the generated items.
const IMAGE_WIDTH  = 1280
const IMAGE_HEIGHT = 1600

// The showreel is the last clip; everything before it feeds the reels carousel.
const HERO_VIDEO_INDEX = 24
const REELS_VIDEO_COUNT = 23

// Landscape films rail — 16:9 clips (L1–Ln) that autoplay when scrolled into view.
const FILM_COUNT        = 4
const FILM_IMAGE_WIDTH  = 1920
const FILM_IMAGE_HEIGHT = 1080

const CATEGORY_LABEL: Readonly<Record<GALLERY_CATEGORY, string>> = {
  [GALLERY_CATEGORY.FOOD]:      'Food',
  [GALLERY_CATEGORY.OUTDOOR]:   'Portraits',
  [GALLERY_CATEGORY.PRODUCT]:   'Product',
  [GALLERY_CATEGORY.LANDSCAPE]: 'Real Estate',
  [GALLERY_CATEGORY.OTHERS]:    'Others',
}

// Inclusive integer range with optional exclusions (e.g. Food skips the missing P10).
function range(start: number, end: number, exclude: readonly number[] = []): number[] {
  const out: number[] = []
  for (let n = start; n <= end; n++) {
    if (!exclude.includes(n)) out.push(n)
  }
  return out
}

function buildImage(category: GALLERY_CATEGORY, frame: number): MEDIA_IMAGE {
  const label = CATEGORY_LABEL[category]
  return {
    id:       `${category}-${frame}`,
    url:      `${IMAGE_BASE}/${category}/P${frame}.webp`,
    title:    `${label} ${frame}`,
    alt:      `${label} photography by Muhammed Shiyas — Sharjah, UAE`,
    category,
    width:    IMAGE_WIDTH,
    height:   IMAGE_HEIGHT,
    tags:     [category],
  }
}

function buildImageGallery(
  category: GALLERY_CATEGORY,
  frames: readonly number[],
): readonly MEDIA_IMAGE[] {
  return frames.map(frame => buildImage(category, frame))
}

// Mixed-orientation stills (LS-1…LS-11): some landscape (3:2), some portrait (2:3).
// True per-frame dimensions are kept so each card reserves the right box and the
// masonry grid lays out wide and tall frames together without cropping.
const LANDSCAPE_IMAGE_COUNT = 11
const LANDSCAPE_LONG_EDGE   = 1600
const LANDSCAPE_SHORT_EDGE  = 1067

// LS-n frames shot in portrait; every other frame is landscape.
const LANDSCAPE_PORTRAIT_FRAMES: readonly number[] = [7, 8, 9, 11]

function buildLandscapeImage(index: number): MEDIA_IMAGE {
  const isPortrait = LANDSCAPE_PORTRAIT_FRAMES.includes(index)
  return {
    id:       `landscape-${index}`,
    url:      `${IMAGE_BASE}/new-landscape/LS-${index}.webp`,
    title:    `Real Estate ${index}`,
    alt:      `Real estate photography by Muhammed Shiyas — Sharjah, UAE`,
    category: GALLERY_CATEGORY.LANDSCAPE,
    width:    isPortrait ? LANDSCAPE_SHORT_EDGE : LANDSCAPE_LONG_EDGE,
    height:   isPortrait ? LANDSCAPE_LONG_EDGE  : LANDSCAPE_SHORT_EDGE,
    tags:     ['landscape'],
  }
}

const LANDSCAPE_IMAGES: readonly MEDIA_IMAGE[] =
  range(1, LANDSCAPE_IMAGE_COUNT).map(buildLandscapeImage)

// "Others" tab — LS-12…LS-18 from the same pool. Mixed-orientation (masonry) too;
// LS-15 is an extra-wide crop, so its height differs from the standard 3:2 frames.
const OTHERS_FRAME_START  = 12
const OTHERS_FRAME_END    = 18
const OTHERS_IMAGE_WIDTH  = 1600
const OTHERS_IMAGE_HEIGHT = 1067
const OTHERS_WIDE_FRAMES: Readonly<Record<number, number>> = { 15: 838 }

function buildOthersImage(frame: number, position: number): MEDIA_IMAGE {
  return {
    id:       `others-${frame}`,
    url:      `${IMAGE_BASE}/new-landscape/LS-${frame}.webp`,
    title:    `Frame ${position}`,
    alt:      `Photography by Muhammed Shiyas — Sharjah, UAE`,
    category: GALLERY_CATEGORY.OTHERS,
    width:    OTHERS_IMAGE_WIDTH,
    height:   OTHERS_WIDE_FRAMES[frame] ?? OTHERS_IMAGE_HEIGHT,
    tags:     ['others'],
  }
}

const OTHERS_IMAGES: readonly MEDIA_IMAGE[] =
  range(OTHERS_FRAME_START, OTHERS_FRAME_END).map((frame, i) => buildOthersImage(frame, i + 1))

function buildVideo(index: number): MEDIA_VIDEO {
  return {
    id:    `v${index}`,
    url:   `${VIDEO_BASE}/V${index}.mp4`,
    title: `Reel ${index}`,
  }
}

function buildFilm(index: number): MEDIA_FILM {
  return {
    id:       `f${index}`,
    videoUrl: `${VIDEO_BASE}/L${index}.mp4`,
    width:    FILM_IMAGE_WIDTH,
    height:   FILM_IMAGE_HEIGHT,
  }
}

// ── Image galleries ──────────────────────────────────────────────────────────
// P10 is intentionally absent from the Food set — the asset does not exist.
export const FOOD_GALLERY:    readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.FOOD,    range(1, 12, [10]))
export const OUTDOOR_GALLERY: readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.OUTDOOR, range(1, 14))

// Landscape stills surfaced under the "Real Estate" photography filter tab.
export const LANDSCAPE_GALLERY: readonly MEDIA_IMAGE[] = LANDSCAPE_IMAGES
export const PRODUCT_GALLERY: readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.PRODUCT, range(1, 13))

// Stills surfaced under the "Others" photography filter tab.
export const OTHERS_GALLERY: readonly MEDIA_IMAGE[] = OTHERS_IMAGES

// Lookup so any consumer can resolve a category's gallery without a switch.
export const IMAGE_GALLERIES: Readonly<Record<GALLERY_CATEGORY, readonly MEDIA_IMAGE[]>> = {
  [GALLERY_CATEGORY.FOOD]:      FOOD_GALLERY,
  [GALLERY_CATEGORY.OUTDOOR]:   OUTDOOR_GALLERY,
  [GALLERY_CATEGORY.PRODUCT]:   PRODUCT_GALLERY,
  [GALLERY_CATEGORY.LANDSCAPE]: LANDSCAPE_GALLERY,
  [GALLERY_CATEGORY.OTHERS]:    OTHERS_GALLERY,
}

// Flat list across every category — the source for the full photography grid.
export const ALL_IMAGES: readonly MEDIA_IMAGE[] = [
  ...FOOD_GALLERY,
  ...OUTDOOR_GALLERY,
  ...PRODUCT_GALLERY,
  ...LANDSCAPE_GALLERY,
  ...OTHERS_GALLERY,
]

// ── Videos ───────────────────────────────────────────────────────────────────
export const HERO_VIDEO: MEDIA_VIDEO = {
  ...buildVideo(HERO_VIDEO_INDEX),
  title:  'Showreel',
  poster: `${CDN_ORIGIN}/shiyas/2.jpg`,
}

export const REELS_VIDEOS: readonly MEDIA_VIDEO[] = range(1, REELS_VIDEO_COUNT).map(buildVideo)

// ── Films ──────────────────────────────────────────────────────────────────
export const FILMS_MEDIA: readonly MEDIA_FILM[] = range(1, FILM_COUNT).map(buildFilm)

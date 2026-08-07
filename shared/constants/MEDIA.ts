import type { MEDIA_IMAGE, MEDIA_VIDEO } from '@shared/types/Media'
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

const CATEGORY_LABEL: Readonly<Record<GALLERY_CATEGORY, string>> = {
  [GALLERY_CATEGORY.FOOD]:    'Food',
  [GALLERY_CATEGORY.OUTDOOR]: 'Outdoor',
  [GALLERY_CATEGORY.PRODUCT]: 'Product',
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
    alt:      `${label} photography — frame ${frame}`,
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

function buildVideo(index: number): MEDIA_VIDEO {
  return {
    id:    `v${index}`,
    url:   `${VIDEO_BASE}/V${index}.mp4`,
    title: `Reel ${index}`,
  }
}

// ── Image galleries ──────────────────────────────────────────────────────────
// P10 is intentionally absent from the Food set — the asset does not exist.
export const FOOD_GALLERY:    readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.FOOD,    range(1, 12, [10]))
export const OUTDOOR_GALLERY: readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.OUTDOOR, range(1, 14))
export const PRODUCT_GALLERY: readonly MEDIA_IMAGE[] = buildImageGallery(GALLERY_CATEGORY.PRODUCT, range(1, 13))

// Lookup so any consumer can resolve a category's gallery without a switch.
export const IMAGE_GALLERIES: Readonly<Record<GALLERY_CATEGORY, readonly MEDIA_IMAGE[]>> = {
  [GALLERY_CATEGORY.FOOD]:    FOOD_GALLERY,
  [GALLERY_CATEGORY.OUTDOOR]: OUTDOOR_GALLERY,
  [GALLERY_CATEGORY.PRODUCT]: PRODUCT_GALLERY,
}

// Flat list across every category — used by the "All" gallery filter.
export const ALL_IMAGES: readonly MEDIA_IMAGE[] = [
  ...FOOD_GALLERY,
  ...OUTDOOR_GALLERY,
  ...PRODUCT_GALLERY,
]

// ── Videos ───────────────────────────────────────────────────────────────────
export const HERO_VIDEO: MEDIA_VIDEO = {
  ...buildVideo(HERO_VIDEO_INDEX),
  title:  'Showreel',
  poster: `${CDN_ORIGIN}/shiyas/2.jpg`,
}

export const REELS_VIDEOS: readonly MEDIA_VIDEO[] = range(1, REELS_VIDEO_COUNT).map(buildVideo)

import type { PROJECT_LIST_ITEM, GALLERY_IMAGE } from '@shared/types/Project'
import type { MEDIA_IMAGE }                       from '@shared/types/Media'
import { ALL_IMAGES }                             from '@shared/constants/MEDIA'
import { seededShuffle }                          from '@shared/utils/shuffle'

// The photography grid is a projection of the centralised image galleries — no
// URLs are hardcoded here. Each media item maps to a gallery card 1:1, and the
// item's id (e.g. `food-1`) doubles as its route slug.
function toProject(image: MEDIA_IMAGE): PROJECT_LIST_ITEM {
  const coverImage: GALLERY_IMAGE = {
    id:     image.id,
    src:    image.url,
    alt:    image.alt,
    width:  image.width,
    height: image.height,
  }

  return {
    id:          image.id,
    title:       image.title,
    slug:        image.id,
    category:    image.category,
    coverImage,
    isFeatured:  false,
    isLandscape: false,
  }
}

export const PHOTOGRAPHY: readonly PROJECT_LIST_ITEM[] = ALL_IMAGES.map(toProject)

// Fixed seed so the "All" tab mixes categories together instead of showing them
// grouped, while staying stable across renders and SSR hydration.
const ALL_SHUFFLE_SEED = 0x5f3759df

export const PHOTOGRAPHY_ALL: readonly PROJECT_LIST_ITEM[] = seededShuffle(
  PHOTOGRAPHY,
  ALL_SHUFFLE_SEED,
)

import type { PROJECT_LIST_ITEM, GALLERY_IMAGE } from '@shared/types/Project'
import type { MEDIA_IMAGE }                       from '@shared/types/Media'
import { ALL_IMAGES, FOOD_GALLERY, OUTDOOR_GALLERY, PRODUCT_GALLERY } from '@shared/constants/MEDIA'
import { interleave }                             from '@shared/utils/interleave'

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

// The "All" tab round-robins the categories — one Food, one Outdoor, one
// Product, then repeat — so the grid alternates instead of showing each
// category in a block.
export const PHOTOGRAPHY_ALL: readonly PROJECT_LIST_ITEM[] = interleave([
  FOOD_GALLERY.map(toProject),
  OUTDOOR_GALLERY.map(toProject),
  PRODUCT_GALLERY.map(toProject),
])

// Curated picks previewed on the home page before "View all". Edit these ids to
// promote your best frames — each must match a PHOTOGRAPHY item id (e.g. `outdoor-3`).
const FEATURED_PHOTOGRAPHY_IDS: readonly string[] = [
  'outdoor-1',
  'food-1',
  'product-1',
  'outdoor-5',
  'food-4',
  'product-6',
]

const PHOTOGRAPHY_BY_ID: ReadonlyMap<string, PROJECT_LIST_ITEM> = new Map(
  PHOTOGRAPHY.map(project => [project.id, project]),
)

export const FEATURED_PHOTOGRAPHY: readonly PROJECT_LIST_ITEM[] = FEATURED_PHOTOGRAPHY_IDS
  .map(id => PHOTOGRAPHY_BY_ID.get(id))
  .filter((project): project is PROJECT_LIST_ITEM => project !== undefined)

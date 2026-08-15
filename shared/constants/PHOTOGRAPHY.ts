import type { PROJECT_LIST_ITEM, GALLERY_IMAGE } from '@shared/types/Project'
import type { MEDIA_IMAGE }                       from '@shared/types/Media'
import { ALL_IMAGES, FOOD_GALLERY, OUTDOOR_GALLERY, PRODUCT_GALLERY, LANDSCAPE_GALLERY, OTHERS_GALLERY } from '@shared/constants/MEDIA'
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
    // Wide frames render as landscape cards; taller frames stay portrait.
    isLandscape: image.width > image.height,
  }
}

export const PHOTOGRAPHY: readonly PROJECT_LIST_ITEM[] = ALL_IMAGES.map(toProject)

// The "All" tab round-robins every category — one from each in turn, then repeat —
// so the grid alternates categories instead of showing each in a block. It spans
// all galleries (including the mixed-orientation Real Estate and Others sets).
export const PHOTOGRAPHY_ALL: readonly PROJECT_LIST_ITEM[] = interleave([
  FOOD_GALLERY.map(toProject),
  OUTDOOR_GALLERY.map(toProject),
  PRODUCT_GALLERY.map(toProject),
  LANDSCAPE_GALLERY.map(toProject),
  OTHERS_GALLERY.map(toProject),
])

// Number of frames the home photography grid shows before "Load more" reveals
// the remaining images of the active filter, inline on the same page.
export const PHOTOGRAPHY_PREVIEW_COUNT = 6

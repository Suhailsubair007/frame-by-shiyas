import { PHOTOGRAPHY, PHOTOGRAPHY_ALL } from '@shared/constants/PHOTOGRAPHY'
import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
import type { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

export function usePhotography() {
  const projects: readonly PROJECT_LIST_ITEM[] = PHOTOGRAPHY

  // "All" shows categories mixed together; a specific tab keeps its own order.
  function filterByCategory(category: GALLERY_CATEGORY | null): readonly PROJECT_LIST_ITEM[] {
    if (!category) return PHOTOGRAPHY_ALL
    return PHOTOGRAPHY.filter(p => p.category === category)
  }

  return { projects, filterByCategory } as const
}

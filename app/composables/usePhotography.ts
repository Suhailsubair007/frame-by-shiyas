import { PHOTOGRAPHY } from '@shared/constants/PHOTOGRAPHY'
import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
import { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

export function usePhotography() {
  const projects: readonly PROJECT_LIST_ITEM[] = PHOTOGRAPHY

  function filterByCategory(category: GALLERY_CATEGORY | null): readonly PROJECT_LIST_ITEM[] {
    if (!category) return PHOTOGRAPHY
    return PHOTOGRAPHY.filter(p => p.category === category)
  }

  return { projects, filterByCategory } as const
}

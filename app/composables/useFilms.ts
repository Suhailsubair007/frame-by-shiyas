import { FILMS } from '@shared/constants/FILMS'
import type { FILM_LIST_ITEM } from '@shared/types/Film'

export function useFilms() {
  const films: readonly FILM_LIST_ITEM[] = FILMS

  const featured = computed<FILM_LIST_ITEM[]>(() =>
    FILMS.filter(f => f.isFeatured),
  )

  return { films, featured } as const
}

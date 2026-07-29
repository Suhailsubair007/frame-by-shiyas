import type { FILM_CATEGORY } from '@shared/enums/FilmCategory'
import type { GALLERY_IMAGE } from '@shared/types/Project'

export interface FILM {
  readonly id: string
  title: string
  slug: string
  category: FILM_CATEGORY
  description: string
  tagline?: string
  videoUrl: string
  posterImage: GALLERY_IMAGE
  duration?: string
  publishedAt: string
  isFeatured: boolean
  client?: string
  location?: string
  credits?: readonly FILM_CREDIT[]
}

export interface FILM_CREDIT {
  readonly role: string
  readonly name: string
}

export interface FILM_LIST_ITEM
  extends Pick<FILM, 'id' | 'title' | 'slug' | 'category' | 'posterImage' | 'videoUrl' | 'duration' | 'isFeatured' | 'tagline'> {}

import type { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

export interface GALLERY_IMAGE {
  readonly id: string
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly blurDataUrl?: string
  readonly caption?: string
}

export interface PROJECT {
  readonly id: string
  title: string
  slug: string
  category: GALLERY_CATEGORY
  description: string
  tagline?: string
  coverImage: GALLERY_IMAGE
  images: readonly GALLERY_IMAGE[]
  publishedAt: string
  isFeatured: boolean
  isLandscape: boolean
  client?: string
  location?: string
  tags?: readonly string[]
}

export interface PROJECT_LIST_ITEM
  extends Pick<PROJECT, 'id' | 'title' | 'slug' | 'category' | 'coverImage' | 'isFeatured' | 'tagline' | 'isLandscape'> {}

import type { GALLERY_CATEGORY } from '@shared/enums/GalleryCategory'

export interface MEDIA_IMAGE {
  readonly id: string
  readonly url: string
  readonly title: string
  readonly alt: string
  readonly category: GALLERY_CATEGORY
  readonly width: number
  readonly height: number
  readonly description?: string
  readonly tags?: readonly string[]
  readonly thumbnail?: string
}

export interface MEDIA_VIDEO {
  readonly id: string
  readonly url: string
  readonly title: string
  readonly description?: string
  readonly poster?: string
  readonly tags?: readonly string[]
}

export interface FILM {
  readonly id: string
  readonly title: string
  readonly videoUrl: string
  readonly category: string
  readonly width: number
  readonly height: number
  readonly poster?: string
  readonly tagline?: string
  readonly duration?: string
  // Upscale factor to crop letterbox bars baked into the source clip (1 = none).
  readonly zoom?: number
}

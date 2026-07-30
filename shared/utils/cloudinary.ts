// Cloudinary URL builder — production-ready media delivery.
//
// SETUP: Set NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment and pass it
// via useRuntimeConfig() at the call site. The functions below accept cloudName
// as their first argument so they remain pure and isomorphic (usable on both
// server and client without relying on Nuxt composables).
//
// MIGRATION: When media is moved from R2/placeholders to Cloudinary:
//   1. Upload assets via Cloudinary dashboard or CLI.
//   2. Replace raw src strings in REELS.ts / FILMS.ts / PHOTOGRAPHY.ts with
//      cloudinaryImageUrl(cloudName, publicId, options).
//   3. For video, use cloudinaryVideoUrl with f_auto so the CDN delivers
//      WebM/VP9 to browsers that support it and MP4/H.264 as fallback.

const CLOUDINARY_BASE = 'https://res.cloudinary.com'

export interface CLOUDINARY_IMAGE_OPTIONS {
  readonly width?:       number
  readonly height?:      number
  readonly quality?:     'auto' | number
  readonly format?:      'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  readonly crop?:        'fill' | 'fit' | 'limit' | 'scale' | 'crop' | 'thumb'
  readonly gravity?:     'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  readonly dpr?:         'auto' | number
  readonly aspectRatio?: string
}

export interface CLOUDINARY_VIDEO_OPTIONS {
  readonly width?:       number
  readonly quality?:     'auto' | number
  readonly format?:      'auto' | 'mp4' | 'webm'
  readonly videoCodec?:  'auto' | 'h264' | 'vp9' | 'av1'
  readonly bitrate?:     string
}

function buildTransforms(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}_${v}`)
    .join(',')
}

// Returns a Cloudinary image URL with automatic quality, format, and optional
// responsive sizing. Default: q_auto,f_auto — smallest file the browser can use.
export function cloudinaryImageUrl(
  cloudName: string,
  publicId:  string,
  options:   CLOUDINARY_IMAGE_OPTIONS = {},
): string {
  const params: Record<string, string | number> = {
    q: options.quality ?? 'auto',
    f: options.format  ?? 'auto',
  }

  if (options.width)       params['w']   = options.width
  if (options.height)      params['h']   = options.height
  if (options.crop)        params['c']   = options.crop
  if (options.gravity)     params['g']   = options.gravity
  if (options.dpr)         params['dpr'] = options.dpr
  if (options.aspectRatio) params['ar']  = options.aspectRatio

  const transforms = buildTransforms(params)
  return `${CLOUDINARY_BASE}/${cloudName}/image/upload/${transforms}/${publicId}`
}

// Returns a Cloudinary video URL with automatic quality and codec selection.
// f_auto delivers WebM/VP9 to modern browsers; MP4/H.264 to legacy ones.
// vc_auto lets Cloudinary pick the best codec for the target format.
export function cloudinaryVideoUrl(
  cloudName: string,
  publicId:  string,
  options:   CLOUDINARY_VIDEO_OPTIONS = {},
): string {
  const params: Record<string, string | number> = {
    q:  options.quality    ?? 'auto',
    f:  options.format     ?? 'auto',
    vc: options.videoCodec ?? 'auto',
  }

  if (options.width)   params['w']  = options.width
  if (options.bitrate) params['br'] = options.bitrate

  const transforms = buildTransforms(params)
  return `${CLOUDINARY_BASE}/${cloudName}/video/upload/${transforms}/${publicId}`
}

// Generates a srcset string for responsive images across breakpoints.
// Usage: :srcset="cloudinaryResponsiveSrcset(cloudName, 'hero.jpg', [640, 1024, 1440, 1920])"
export function cloudinaryResponsiveSrcset(
  cloudName:   string,
  publicId:    string,
  widths:      readonly number[],
  baseOptions: Omit<CLOUDINARY_IMAGE_OPTIONS, 'width'> = {},
): string {
  return widths
    .map(w => `${cloudinaryImageUrl(cloudName, publicId, { ...baseOptions, width: w })} ${w}w`)
    .join(', ')
}

// Derives the pre-baked AVIF sibling path for a local raster image.
// AVIF variants are generated at author time (macOS `sips`) and committed next to
// the JPEG originals, which remain the <picture> fallback for the small share of
// browsers without AVIF support. Pure string transform — no runtime image pipeline.
export function toAvifSrc(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, '.avif')
}

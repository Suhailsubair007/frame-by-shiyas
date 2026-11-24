import { META } from '@shared/constants/META'
import { SITEMAP_ENTRIES } from '@shared/constants/SITEMAP'

// Served at /sitemap.xml and referenced from robots.txt. Driven by
// SITEMAP_ENTRIES so every indexable page is covered — no lastmod is emitted
// because this repository has no reliable per-route last-modified source, and
// a fabricated current timestamp on every request would be worse than omitting it.
export default defineEventHandler((event): string => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const urls = SITEMAP_ENTRIES.map(entry => `
  <url>
    <loc>${META.BASE_URL}${entry.path}</loc>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`
})

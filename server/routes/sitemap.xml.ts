import { META } from '@shared/constants/META'

// Single-page site — one canonical URL. Served at /sitemap.xml and referenced
// from robots.txt so crawlers discover and index the homepage reliably.
export default defineEventHandler((event): string => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${META.BASE_URL}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
})

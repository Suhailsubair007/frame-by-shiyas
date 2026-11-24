import { ROUTES } from '@shared/constants/ROUTES'

interface SITEMAP_ENTRY {
  readonly path: string
  readonly changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  readonly priority: number
}

// Every indexable route, centralised so the sitemap can never silently drop a
// page that ROUTES already knows about. Add a route here the same time it is
// added to ROUTES and given a page.
export const SITEMAP_ENTRIES: readonly SITEMAP_ENTRY[] = [
  { path: ROUTES.HOME,  changeFrequency: 'monthly', priority: 1.0 },
  { path: ROUTES.FILMS, changeFrequency: 'monthly', priority: 0.8 },
]

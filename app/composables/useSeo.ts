import { META }    from '@shared/constants/META'
import { CONTACT } from '@shared/constants/CONTACT'

interface BREADCRUMB_ITEM {
  readonly name: string
  readonly path: string
}

interface PAGE_SEO_OPTIONS {
  readonly path?: string
  readonly title?: string
  readonly description?: string
  readonly ogImage?: string
  readonly ogImageAlt?: string
  readonly breadcrumbs?: readonly BREADCRUMB_ITEM[]
}

// Always resolves through BASE_URL + path (never a bare BASE_URL for '/') so the
// canonical/OG URL this emits for the homepage matches the sitemap's <loc> for
// it exactly — a mismatched trailing slash between the two is a duplicate-URL
// signal Google can read as two different pages.
function toAbsoluteUrl(path: string): string {
  return `${META.BASE_URL}${path}`
}

// Centralises every head/meta and schema.org concern for the site. Call once per
// page — every indexable page gets its own canonical, OG/Twitter tags and a
// WebPage node in the graph, not just the homepage.
export function useSeo(options: PAGE_SEO_OPTIONS = {}): void {
  const path        = options.path ?? '/'
  const pageUrl      = toAbsoluteUrl(path)
  const title        = options.title ?? META.DEFAULT_TITLE
  const description  = options.description ?? META.DEFAULT_DESCRIPTION
  const image        = options.ogImage ?? META.OG_IMAGE
  const imageAlt      = options.ogImageAlt ?? META.OG_IMAGE_ALT

  useSeoMeta({
    title,
    description,
    author:            META.OWNER,
    robots:            'index, follow',

    ogTitle:           title,
    ogDescription:     description,
    ogType:            'website',
    ogUrl:             pageUrl,
    ogSiteName:        META.SITE_NAME,
    // Primary market UAE, secondary India — signalled to social scrapers.
    ogLocale:          'en_AE',
    ogLocaleAlternate: ['en_IN'],
    ogImage:           image,
    ogImageAlt:        imageAlt,
    ogImageType:       'image/jpeg',

    twitterCard:        'summary_large_image',
    twitterTitle:       title,
    twitterDescription: description,
    twitterImage:       image,
    twitterImageAlt:    imageAlt,
  })

  // Person + business + website graph. Google reads this to understand *who*
  // Muhammed Shiyas is (local-service context, service area, socials) — the
  // groundwork for rich results and a Knowledge Panel. Emitted on every page so
  // each one links back to the same entities via their stable @id.
  const postalAddress = {
    '@type':         'PostalAddress',
    addressLocality: META.ADDRESS_LOCALITY,
    addressRegion:   META.ADDRESS_LOCALITY,
    addressCountry:  META.ADDRESS_COUNTRY,
  }

  // areaServed ordered UAE-first, then India — Google reads the ordering as
  // the primary-to-secondary service-market priority.
  const areaServed = META.SERVICE_AREAS.map(area => ({ '@type': area.type, name: area.name }))

  const graph: unknown[] = [
    {
      '@type': 'Person',
      '@id':   `${META.BASE_URL}/#person`,
      name:          META.OWNER,
      url:           META.BASE_URL,
      image:         META.OG_IMAGE,
      jobTitle:      META.JOB_TITLE,
      description:   META.DEFAULT_DESCRIPTION,
      worksFor:      { '@id': `${META.BASE_URL}/#business` },
      sameAs:        [CONTACT.INSTAGRAM],
      knowsLanguage: META.LANGUAGES,
      knowsAbout:    META.SERVICES,
      homeLocation:  { '@type': 'Place', name: `${META.ADDRESS_LOCALITY}, United Arab Emirates` },
      workLocation:  { '@type': 'Place', name: 'United Arab Emirates' },
      address:       postalAddress,
    },
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id':   `${META.BASE_URL}/#business`,
      name:        META.SITE_NAME,
      url:         META.BASE_URL,
      image:       META.OG_IMAGE,
      email:       CONTACT.EMAIL,
      telephone:   CONTACT.PHONE_TEL,
      description: META.DEFAULT_DESCRIPTION,
      priceRange:  '$$',
      founder:     { '@id': `${META.BASE_URL}/#person` },
      sameAs:      [CONTACT.INSTAGRAM],
      knowsAbout:  META.SERVICES,
      address:     postalAddress,
      areaServed,
      geo: {
        '@type':   'GeoCoordinates',
        latitude:  META.GEO.LATITUDE,
        longitude: META.GEO.LONGITUDE,
      },
      contactPoint: {
        '@type':           'ContactPoint',
        telephone:         CONTACT.PHONE_TEL,
        contactType:       'customer service',
        areaServed:        [META.ADDRESS_COUNTRY, 'IN'],
        availableLanguage: META.LANGUAGES,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name:    'Videography & Photography Services',
        itemListElement: META.SERVICES.map(name => ({
          '@type':      'Offer',
          itemOffered:  { '@type': 'Service', name, areaServed: 'United Arab Emirates' },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id':   `${META.BASE_URL}/#website`,
      url:        META.BASE_URL,
      name:       META.SITE_NAME,
      inLanguage: 'en',
      publisher:  { '@id': `${META.BASE_URL}/#business` },
    },
    {
      '@type':     'WebPage',
      '@id':       `${pageUrl}#webpage`,
      url:         pageUrl,
      name:        title,
      description,
      inLanguage:  'en',
      isPartOf:    { '@id': `${META.BASE_URL}/#website` },
      about:       { '@id': `${META.BASE_URL}/#business` },
    },
  ]

  if (options.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id':   `${pageUrl}#breadcrumb`,
      itemListElement: options.breadcrumbs.map((item, index) => ({
        '@type':   'ListItem',
        position:  index + 1,
        name:      item.name,
        item:      toAbsoluteUrl(item.path),
      })),
    })
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph':   graph,
  }

  useHead({
    link: [{ rel: 'canonical', href: pageUrl }],
    meta: [
      { name: 'geo.region',    content: META.GEO.REGION },
      { name: 'geo.placename', content: META.GEO.PLACENAME },
      { name: 'geo.position',  content: `${META.GEO.LATITUDE};${META.GEO.LONGITUDE}` },
      { name: 'ICBM',          content: `${META.GEO.LATITUDE}, ${META.GEO.LONGITUDE}` },
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
  })
}

import { META }    from '@shared/constants/META'
import { CONTACT } from '@shared/constants/CONTACT'

// Centralises every head/meta and schema.org concern for the site. Called once
// from the home page. All output lives in <head> — none of it renders visually.
export function useSeo(): void {
  const url   = META.BASE_URL
  const image = META.OG_IMAGE

  useSeoMeta({
    title:              META.DEFAULT_TITLE,
    description:        META.DEFAULT_DESCRIPTION,
    author:            META.OWNER,
    robots:            'index, follow',

    ogTitle:           META.DEFAULT_TITLE,
    ogDescription:     META.DEFAULT_DESCRIPTION,
    ogType:            'website',
    ogUrl:             url,
    ogSiteName:        META.SITE_NAME,
    // Primary market UAE, secondary India — signalled to social scrapers.
    ogLocale:          'en_AE',
    ogLocaleAlternate: ['en_IN'],
    ogImage:           image,
    ogImageAlt:        META.OG_IMAGE_ALT,
    ogImageType:       'image/jpeg',

    twitterCard:        'summary_large_image',
    twitterTitle:       META.DEFAULT_TITLE,
    twitterDescription: META.DEFAULT_DESCRIPTION,
    twitterImage:       image,
    twitterImageAlt:    META.OG_IMAGE_ALT,
  })

  // Person + business + website graph. Google reads this to understand *who*
  // Muhammed Shiyas is (local-service context, service area, socials) — the
  // groundwork for rich results and a Knowledge Panel.
  const postalAddress = {
    '@type':         'PostalAddress',
    addressLocality: META.ADDRESS_LOCALITY,
    addressRegion:   META.ADDRESS_LOCALITY,
    addressCountry:  META.ADDRESS_COUNTRY,
  }

  // areaServed ordered UAE-first, then India — Google reads the ordering as
  // the primary-to-secondary service-market priority.
  const areaServed = META.SERVICE_AREAS.map(area => ({ '@type': area.type, name: area.name }))

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id':   `${url}/#person`,
        name:          META.OWNER,
        url,
        image,
        jobTitle:      META.JOB_TITLE,
        description:   META.DEFAULT_DESCRIPTION,
        worksFor:      { '@id': `${url}/#business` },
        sameAs:        [CONTACT.INSTAGRAM],
        knowsLanguage: META.LANGUAGES,
        knowsAbout:    META.SERVICES,
        homeLocation:  { '@type': 'Place', name: `${META.ADDRESS_LOCALITY}, United Arab Emirates` },
        workLocation:  { '@type': 'Place', name: 'United Arab Emirates' },
        address:       postalAddress,
      },
      {
        '@type': ['ProfessionalService', 'LocalBusiness'],
        '@id':   `${url}/#business`,
        name:        META.SITE_NAME,
        url,
        image,
        email:       CONTACT.EMAIL,
        telephone:   CONTACT.PHONE_TEL,
        description: META.DEFAULT_DESCRIPTION,
        priceRange:  '$$',
        founder:     { '@id': `${url}/#person` },
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
        '@id':   `${url}/#website`,
        url,
        name:       META.SITE_NAME,
        inLanguage: 'en',
        publisher:  { '@id': `${url}/#business` },
      },
    ],
  }

  useHead({
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'keywords',     content: META.KEYWORDS },
      { name: 'geo.region',   content: META.GEO.REGION },
      { name: 'geo.placename', content: META.GEO.PLACENAME },
      { name: 'geo.position', content: `${META.GEO.LATITUDE};${META.GEO.LONGITUDE}` },
      { name: 'ICBM',         content: `${META.GEO.LATITUDE}, ${META.GEO.LONGITUDE}` },
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
  })
}

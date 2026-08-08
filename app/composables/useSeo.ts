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
    ogLocale:          'en_US',
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
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id':   `${url}/#person`,
        name:        META.OWNER,
        url,
        image,
        jobTitle:    META.JOB_TITLE,
        description: META.DEFAULT_DESCRIPTION,
        worksFor:    { '@id': `${url}/#business` },
        sameAs:      [CONTACT.INSTAGRAM],
        address: {
          '@type':         'PostalAddress',
          addressLocality: META.ADDRESS_LOCALITY,
          addressCountry:  META.ADDRESS_COUNTRY,
        },
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
        areaServed:  META.AREA_SERVED,
        sameAs:      [CONTACT.INSTAGRAM],
        address: {
          '@type':         'PostalAddress',
          addressLocality: META.ADDRESS_LOCALITY,
          addressCountry:  META.ADDRESS_COUNTRY,
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
    link:   [{ rel: 'canonical', href: url }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
  })
}

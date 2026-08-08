export const META = {
  SITE_NAME:           'Frame by Shiyas',
  OWNER:               'Muhammed Shiyas',
  JOB_TITLE:           'Videographer & Photographer',
  TAGLINE:             'Visual Storyteller',
  LOCATION:            'Sharjah, UAE',
  DEFAULT_TITLE:       'Muhammed Shiyas — Videographer & Photographer in Sharjah, UAE',
  DEFAULT_DESCRIPTION: 'Muhammed Shiyas is a videographer, photographer and editor based in Sharjah, UAE — delivering broadcast-quality content for advertising campaigns, weddings, and brands across the UAE and India.',
  // Absolute URL to a real CDN-served landscape image so social shares (WhatsApp,
  // Instagram, X) render a preview. Must stay absolute — relative paths break scrapers.
  OG_IMAGE:            'https://cdn.muhmdshiyas.com/shiyas/2.jpg',
  OG_IMAGE_ALT:        'Muhammed Shiyas — videographer and photographer based in Sharjah, UAE',
  TWITTER_HANDLE:      '@framebyshiyas',
  BASE_URL:            'https://muhmdshiyas.com',
  EMAIL:               'm1shiyas1@gmail.com',
  WORKS_URL:           'https://drive.google.com/drive/folders/19ChoROaaYKoOcms9ksamDZhjHyLnhZmT',

  // Structured-data (schema.org) address + service area for local search.
  ADDRESS_LOCALITY:    'Sharjah',
  ADDRESS_COUNTRY:     'AE',
  AREA_SERVED:         ['United Arab Emirates', 'India'],
} as const

// Single-page site — nav items scroll to in-page section anchors, not routes.
export const NAVIGATION = [
  { label: 'Films',       hash: '#films',       index: '01' },
  { label: 'Photography', hash: '#photography', index: '02' },
  { label: 'About',       hash: '#about',       index: '03' },
  { label: 'Contact',     hash: '#contact',     index: '04' },
] as const

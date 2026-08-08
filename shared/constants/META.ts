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

  // Structured-data (schema.org) address for local search.
  ADDRESS_LOCALITY:    'Sharjah',
  ADDRESS_COUNTRY:     'AE',

  // Geo signals for the business location (Sharjah, UAE) — powers geo.* meta
  // tags and the LocalBusiness GeoCoordinates.
  GEO: {
    REGION:    'AE-SH',
    PLACENAME: 'Sharjah',
    LATITUDE:  25.3463,
    LONGITUDE: 55.4209,
  },

  // Service areas ordered by priority — UAE first, India second. Drives the
  // schema.org areaServed list and, by ordering, signals primary market.
  SERVICE_AREAS: [
    { type: 'Country', name: 'United Arab Emirates' },
    { type: 'City',    name: 'Sharjah' },
    { type: 'City',    name: 'Dubai' },
    { type: 'City',    name: 'Abu Dhabi' },
    { type: 'Country', name: 'India' },
  ],

  // Offered services — feeds the schema.org OfferCatalog and knowsAbout.
  SERVICES: [
    'Wedding Videography',
    'Wedding Photography',
    'Advertising Campaign Production',
    'Corporate Video Production',
    'Commercial Photography',
    'Social Media Content Creation',
    'Event Videography',
  ],

  LANGUAGES: ['English', 'Hindi', 'Arabic', 'Malayalam'],

  // Keyword matching for search engines — UAE terms lead, India follows.
  KEYWORDS: [
    'videographer Sharjah',
    'videographer UAE',
    'videographer Dubai',
    'photographer Sharjah',
    'photographer UAE',
    'wedding videographer UAE',
    'wedding photographer UAE',
    'advertising videographer UAE',
    'corporate video production UAE',
    'commercial photographer Dubai',
    'social media content creator UAE',
    'videographer India',
    'wedding videographer India',
    'Muhammed Shiyas',
  ].join(', '),
} as const

// Single-page site — nav items scroll to in-page section anchors, not routes.
export const NAVIGATION = [
  { label: 'Films',       hash: '#films',       index: '01' },
  { label: 'Photography', hash: '#photography', index: '02' },
  { label: 'About',       hash: '#about',       index: '03' },
  { label: 'Contact',     hash: '#contact',     index: '04' },
] as const

export const META = {
  SITE_NAME:           'Frame by Shiyas',
  OWNER:               'Muhammed Shiyas',
  TAGLINE:             'Visual Storyteller',
  LOCATION:            'Sharjah, UAE',
  DEFAULT_TITLE:       'Muhammed Shiyas — Videographer & Photographer',
  DEFAULT_DESCRIPTION: 'Muhammed Shiyas is a videographer, photographer and editor based in Sharjah, UAE — delivering broadcast-quality content for advertising campaigns, weddings, and brands across the UAE and India.',
  OG_IMAGE:            '/og-image.jpg',
  TWITTER_HANDLE:      '@framebyshiyas',
  BASE_URL:            'https://framebyshiyas.com',
  EMAIL:               'm1shiyas1@gmail.com',
} as const

// Single-page site — nav items scroll to in-page section anchors, not routes.
export const NAVIGATION = [
  { label: 'Films',       hash: '#films',       index: '01' },
  { label: 'Photography', hash: '#photography', index: '02' },
  { label: 'About',       hash: '#about',       index: '03' },
  { label: 'Contact',     hash: '#contact',     index: '04' },
] as const

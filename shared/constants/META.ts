export const META = {
  SITE_NAME:           'Frame by Shiyas',
  OWNER:               'Muhammed Shiyas',
  TAGLINE:             'Visual Storyteller',
  DEFAULT_TITLE:       'Frame by Shiyas — Videographer & Photographer',
  DEFAULT_DESCRIPTION: 'Muhammed Shiyas is a videographer, photographer and editor based in Sharjah, UAE — delivering broadcast-quality content for advertising campaigns, weddings, and brands across the UAE and India.',
  OG_IMAGE:            '/og-image.jpg',
  TWITTER_HANDLE:      '@framebyshiyas',
  BASE_URL:            'https://framebyshiyas.com',
  EMAIL:               'm1shiyas1@gmail.com',
} as const

export const NAVIGATION = [
  { label: 'Films',       path: '/films',       index: '01' },
  { label: 'Photography', path: '/photography', index: '02' },
  { label: 'About',       path: '/about',       index: '03' },
  { label: 'Contact',     path: '/contact',     index: '04' },
] as const

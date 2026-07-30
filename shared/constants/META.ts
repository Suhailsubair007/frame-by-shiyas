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
  // Films is parked while the portfolio leads with vertical work — see the
  // commented-out FilmsSection in app/pages/index.vue. Leaving the entry in
  // would scroll to an anchor that no longer renders.
  // { label: 'Films',       hash: '#films',       index: '01' },
  { label: 'Photography', hash: '#photography', index: '01' },
  { label: 'About',       hash: '#about',       index: '02' },
  { label: 'Contact',     hash: '#contact',     index: '03' },
] as const

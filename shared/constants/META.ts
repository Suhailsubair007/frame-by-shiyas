export const META = {
  SITE_NAME:           'Frame by Shiyas',
  OWNER:               'Muhammed Shiyas',
  TAGLINE:             'Visual Storyteller',
  DEFAULT_TITLE:       'Frame by Shiyas — Visual Storyteller',
  DEFAULT_DESCRIPTION: 'Muhammed Shiyas is a professional photographer and videographer crafting cinematic visual stories.',
  OG_IMAGE:            '/og-image.jpg',
  TWITTER_HANDLE:      '@framebyshiyas',
  BASE_URL:            'https://framebyshiyas.com',
  EMAIL:               'hello@framebyshiyas.com',
} as const

export const NAVIGATION = [
  { label: 'Films',       path: '/films',       index: '01' },
  { label: 'Photography', path: '/photography', index: '02' },
  { label: 'About',       path: '/about',       index: '03' },
  { label: 'Contact',     path: '/contact',     index: '04' },
] as const

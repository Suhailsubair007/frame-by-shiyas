export const ROUTES = {
  HOME:        '/',
  FILMS:       '/films',
  FILM:        (slug: string) => `/films/${slug}`,
  PHOTOGRAPHY: '/photography',
  PROJECT:     (slug: string) => `/photography/${slug}`,
  ABOUT:       '/about',
  CONTACT:     '/contact',
} as const

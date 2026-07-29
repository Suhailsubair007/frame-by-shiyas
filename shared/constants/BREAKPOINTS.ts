// Mirror Tailwind's screen scale — use for JS matchMedia checks
export const BREAKPOINTS = {
  SM:   640,
  MD:   768,
  LG:   1024,
  XL:   1280,
  '2XL': 1536,
  '3XL': 1920,
} as const

export type BREAKPOINT_KEY = keyof typeof BREAKPOINTS

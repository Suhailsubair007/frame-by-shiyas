import type { REEL } from '@shared/types/Reel'

// Placeholder covers — portrait 9:16 (720×1280). Swap for real reel thumbnails.
export const REELS: readonly REEL[] = [
  { id: 'r1', title: 'Wedding Moments',   cover: 'https://picsum.photos/seed/reel-wed/720/1280' },
  { id: 'r2', title: 'Golden Hour',       cover: 'https://picsum.photos/seed/reel-gold/720/1280' },
  { id: 'r3', title: 'Candid Portraits',  cover: 'https://picsum.photos/seed/reel-port/720/1280' },
  { id: 'r4', title: 'City Lights',       cover: 'https://picsum.photos/seed/reel-city/720/1280' },
  { id: 'r5', title: 'Coastal Stories',   cover: 'https://picsum.photos/seed/reel-coast/720/1280' },
  { id: 'r6', title: 'Bridal Grace',      cover: 'https://picsum.photos/seed/reel-bride/720/1280' },
  { id: 'r7', title: 'Forest Light',      cover: 'https://picsum.photos/seed/reel-forst/720/1280' },
] as const

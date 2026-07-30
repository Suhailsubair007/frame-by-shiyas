import type { REEL } from '@shared/types/Reel'

const R2 = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas'

export const REELS: readonly REEL[] = [
  { id: 'r1', title: 'Wedding Moments',  videoUrl: `${R2}/T1.mp4` },
  { id: 'r2', title: 'Golden Hour',      videoUrl: `${R2}/T2.mp4` },
  { id: 'r3', title: 'Candid Portraits', videoUrl: `${R2}/T3.mp4` },
  { id: 'r4', title: 'City Lights',      videoUrl: `${R2}/T4.mp4` },
  { id: 'r5', title: 'Coastal Stories',  videoUrl: `${R2}/T5.mp4` },
  { id: 'r6', title: 'Bridal Grace',     videoUrl: `${R2}/T6.mp4` },
  { id: 'r7', title: 'Forest Light',     videoUrl: `${R2}/T7.mp4` },
] as const

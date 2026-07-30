import type { REEL } from '@shared/types/Reel'

const R2 = 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev/shiyas'

export const REELS: readonly REEL[] = [
  { id: 'r1', title: 'Define the Frame', videoUrl: `${R2}/T1.mp4` },
  { id: 'r2', title: 'Steel & Motion',   videoUrl: `${R2}/T2.mp4` },
  { id: 'r3', title: 'Sharp Lines',      videoUrl: `${R2}/T3.mp4` },
  { id: 'r4', title: 'The Pour',         videoUrl: `${R2}/T4.mp4` },
  { id: 'r5', title: 'Plated.',          videoUrl: `${R2}/T5.mp4` },
  { id: 'r6', title: 'Draped in Light',  videoUrl: `${R2}/T6.mp4` },
  { id: 'r7', title: 'Built Different',  videoUrl: `${R2}/T7.mp4` },
] as const

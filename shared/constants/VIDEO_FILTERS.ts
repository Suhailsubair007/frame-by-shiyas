export type VIDEO_TAB = 'all' | 'reels' | 'landscape'

export const VIDEO_FILTERS: ReadonlyArray<{ readonly label: string; readonly value: VIDEO_TAB }> = [
  { label: 'All',       value: 'all' },
  { label: 'Reels',     value: 'reels' },
  { label: 'Landscape', value: 'landscape' },
]

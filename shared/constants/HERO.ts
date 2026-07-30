export const HERO = {
  HEADING_TOP:  'Visual',
  HEADING_FOOT: 'Storyteller',

  ROLES: ['Videographer', '& Photographer'],

  SCROLL_LABEL: 'Scroll',
  A11Y_LABEL:   'Showreel',

  // Viewfinder bracket positions, one entry per corner of the portrait frame.
  // Kept as data so the bracket markup is written once, not four times.
  FRAME_CORNERS: [
    '-left-3 -top-3 flex-col',
    '-right-3 -top-3 flex-col items-end',
    '-bottom-3 -left-3 flex-col-reverse',
    '-bottom-3 -right-3 flex-col-reverse items-end',
  ],
} as const

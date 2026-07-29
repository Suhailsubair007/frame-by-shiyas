// All durations in seconds (GSAP convention)
// Easing strings match GSAP's ease registry exactly
export const ANIMATION = {
  DURATION: {
    INSTANT:   0.15,
    FAST:      0.3,
    DEFAULT:   0.6,
    SLOW:      1.0,
    CINEMATIC: 1.4,
    EPIC:      2.0,
  },
  EASE: {
    DEFAULT:    'power3.out',
    IN:         'power3.in',
    INOUT:      'power3.inOut',
    EXPO_OUT:   'expo.out',
    EXPO_IN:    'expo.in',
    EXPO_INOUT: 'expo.inOut',
    CIRC_OUT:   'circ.out',
    BACK_OUT:   'back.out(1.7)',
    NONE:       'none',
    // Matches --ease-cinema CSS token — used for clip-path and mask reveals
    CINEMA:     'power4.inOut',
  },
  STAGGER: {
    TIGHT:   0.03,
    DEFAULT: 0.06,
    LOOSE:   0.1,
    WIDE:    0.18,
  },
  DELAY: {
    SHORT:   0.1,
    DEFAULT: 0.2,
    LONG:    0.4,
  },
  // ScrollTrigger defaults
  SCROLL: {
    START:        'top 85%',
    START_EARLY:  'top 95%',
    START_CENTER: 'center center',
    END:          'bottom top',
    SCRUB:        1.2,
  },
} as const

import type { PROJECT_LIST_ITEM } from '@shared/types/Project'
import type { GALLERY_IMAGE }    from '@shared/types/Project'
import { GALLERY_CATEGORY }      from '@shared/enums/GalleryCategory'

// Placeholder cover images from Picsum Photos (seeded — consistent per project).
// isLandscape drives aspect ratio: true → 16:9, false → 3:4 portrait.
// Swap src paths for real production assets when media is delivered.

function cover(seed: string, alt: string, landscape: boolean): GALLERY_IMAGE {
  const w = landscape ? 1920 : 1080
  const h = landscape ? 1080 : 1350
  return { id: `${seed}-cover`, src: `https://picsum.photos/seed/${seed}/${w}/${h}`, alt, width: w, height: h }
}

export const PHOTOGRAPHY: readonly PROJECT_LIST_ITEM[] = [
  {
    id:          'ph1',
    title:       'Golden Hour',
    slug:        'golden-hour',
    category:    GALLERY_CATEGORY.WEDDING,
    coverImage:  cover('golden-hour', 'Golden Hour — Wedding', true),
    isFeatured:  true,
    isLandscape: true,
    tagline:     'Light as witness.',
  },
  {
    id:          'ph2',
    title:       'Reverie',
    slug:        'reverie',
    category:    GALLERY_CATEGORY.PORTRAIT,
    coverImage:  cover('reverie-portrait', 'Reverie — Portrait', false),
    isFeatured:  true,
    isLandscape: false,
    tagline:     'Between waking and dreaming.',
  },
  {
    id:          'ph3',
    title:       'Concrete',
    slug:        'concrete',
    category:    GALLERY_CATEGORY.STREET,
    coverImage:  cover('concrete-street', 'Concrete — Street', false),
    isFeatured:  false,
    isLandscape: false,
  },
  {
    id:          'ph4',
    title:       'Fragments',
    slug:        'fragments',
    category:    GALLERY_CATEGORY.EDITORIAL,
    coverImage:  cover('fragments-editorial', 'Fragments — Editorial', true),
    isFeatured:  false,
    isLandscape: true,
    tagline:     'A frame within a frame.',
  },
  {
    id:          'ph5',
    title:       'Dusk',
    slug:        'dusk',
    category:    GALLERY_CATEGORY.TRAVEL,
    coverImage:  cover('dusk-travel', 'Dusk — Travel', true),
    isFeatured:  false,
    isLandscape: true,
    tagline:     'The hour that belongs to no one.',
  },
  {
    id:          'ph6',
    title:       'Bloom',
    slug:        'bloom-portrait',
    category:    GALLERY_CATEGORY.LIFESTYLE,
    coverImage:  cover('bloom-lifestyle', 'Bloom — Lifestyle', false),
    isFeatured:  false,
    isLandscape: false,
  },
  {
    id:          'ph7',
    title:       'Veil',
    slug:        'veil',
    category:    GALLERY_CATEGORY.WEDDING,
    coverImage:  cover('veil-wedding', 'Veil — Wedding', false),
    isFeatured:  false,
    isLandscape: false,
    tagline:     'What the veil keeps sacred.',
  },
  {
    id:          'ph8',
    title:       'Form',
    slug:        'form',
    category:    GALLERY_CATEGORY.COMMERCIAL,
    coverImage:  cover('form-commercial', 'Form — Commercial', true),
    isFeatured:  true,
    isLandscape: true,
    tagline:     'Design stripped to its essence.',
  },
  {
    id:          'ph9',
    title:       'Horizon',
    slug:        'horizon',
    category:    GALLERY_CATEGORY.TRAVEL,
    coverImage:  cover('horizon-travel', 'Horizon — Travel', false),
    isFeatured:  false,
    isLandscape: false,
  },
  {
    id:          'ph10',
    title:       'Presence',
    slug:        'presence',
    category:    GALLERY_CATEGORY.PORTRAIT,
    coverImage:  cover('presence-portrait', 'Presence — Portrait', true),
    isFeatured:  false,
    isLandscape: true,
    tagline:     'To be seen is to exist.',
  },
  {
    id:          'ph11',
    title:       'Still',
    slug:        'still',
    category:    GALLERY_CATEGORY.EDITORIAL,
    coverImage:  cover('still-editorial', 'Still — Editorial', true),
    isFeatured:  false,
    isLandscape: true,
  },
  {
    id:          'ph12',
    title:       'Drift',
    slug:        'drift',
    category:    GALLERY_CATEGORY.STREET,
    coverImage:  cover('drift-street', 'Drift — Street', false),
    isFeatured:  false,
    isLandscape: false,
    tagline:     'The city never sleeps, only shifts.',
  },
]

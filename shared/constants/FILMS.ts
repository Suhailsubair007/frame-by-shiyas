import type { FILM_LIST_ITEM } from '@shared/types/Film'
import { FILM_CATEGORY } from '@shared/enums/FilmCategory'

// Poster images: Picsum Photos (seeded — same image every load, no auth needed).
// Video previews: MDN/W3C CC0-licensed public-domain clips — just for hover-preview demo.
// Swap both for real production assets once client delivers media.

const PICSUM = (seed: string) =>
  `https://picsum.photos/seed/${seed}/1920/1080`

const MDN = (name: string) =>
  `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/${name}.mp4`

const W3C = (path: string) =>
  `https://media.w3.org/2010/05/${path}.mp4`

export const FILMS: readonly FILM_LIST_ITEM[] = [
  {
    id:          'f1',
    title:       'Into the Light',
    slug:        'into-the-light',
    category:    FILM_CATEGORY.WEDDING,
    posterImage: { id: 'f1-poster', src: PICSUM('into-the-light'), alt: 'Into the Light — Wedding Film', width: 1920, height: 1080 },
    videoUrl:    MDN('friday'),
    duration:    '08:42',
    isFeatured:  true,
    tagline:     'A love story told through golden hour.',
  },
  {
    id:          'f2',
    title:       'City of Silence',
    slug:        'city-of-silence',
    category:    FILM_CATEGORY.DOCUMENTARY,
    posterImage: { id: 'f2-poster', src: PICSUM('city-silence'), alt: 'City of Silence — Documentary', width: 1920, height: 1080 },
    videoUrl:    MDN('friday'),
    duration:    '14:30',
    isFeatured:  false,
    tagline:     'The streets speak when no one is listening.',
  },
  {
    id:          'f3',
    title:       'Bloom',
    slug:        'bloom',
    category:    FILM_CATEGORY.COMMERCIAL,
    posterImage: { id: 'f3-poster', src: PICSUM('bloom-nature'), alt: 'Bloom — Commercial Film', width: 1920, height: 1080 },
    videoUrl:    MDN('flower'),
    duration:    '02:15',
    isFeatured:  true,
    tagline:     'Nature. Refined.',
  },
  {
    id:          'f4',
    title:       'Before Dawn',
    slug:        'before-dawn',
    category:    FILM_CATEGORY.SHORT_FILM,
    posterImage: { id: 'f4-poster', src: PICSUM('before-dawn'), alt: 'Before Dawn — Short Film', width: 1920, height: 1080 },
    videoUrl:    W3C('sintel/trailer_hd'),
    duration:    '06:55',
    isFeatured:  false,
    tagline:     'Some moments only exist in the threshold.',
  },
  {
    id:          'f5',
    title:       'Resonance',
    slug:        'resonance',
    category:    FILM_CATEGORY.BRAND,
    posterImage: { id: 'f5-poster', src: PICSUM('resonance-brand'), alt: 'Resonance — Brand Film', width: 1920, height: 1080 },
    videoUrl:    MDN('flower'),
    duration:    '03:40',
    isFeatured:  false,
    tagline:     'Sound and vision, unified.',
  },
  {
    id:          'f6',
    title:       'Ceremony',
    slug:        'ceremony',
    category:    FILM_CATEGORY.EVENT,
    posterImage: { id: 'f6-poster', src: PICSUM('ceremony-event'), alt: 'Ceremony — Event Film', width: 1920, height: 1080 },
    videoUrl:    MDN('friday'),
    duration:    '05:20',
    isFeatured:  false,
    tagline:     'Every gathering has a soul.',
  },
]

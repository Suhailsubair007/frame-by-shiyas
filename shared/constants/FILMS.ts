import type { FILM }       from '@shared/types/Film'
import type { MEDIA_FILM } from '@shared/types/Media'
import { FILMS_MEDIA }     from '@shared/constants/MEDIA'

// The media module owns each film's asset URLs and dimensions (F1–F6); this
// projection layers the editorial copy over them. Replace the placeholder copy
// with the real titles once the films are supplied.
interface FILM_META {
  readonly title: string
  readonly category: string
  readonly tagline: string
  readonly duration: string
  readonly zoom?: number
}

// L2 ships with cinematic letterbox bars baked into its 16:9 frame (content is
// ~1600×682). Scaling the clip up by this factor pushes the bars past the card
// edges so it fills like the full-frame clips. 900 / 682 ≈ 1.32, rounded up a
// hair so no black line survives the crop.
const LETTERBOX_FILL_SCALE = 1.34

const FILM_META_BY_INDEX: readonly FILM_META[] = [
  { title: 'Vows at Golden Hour', category: 'Wedding',     tagline: 'A coastal celebration',  duration: '3:24' },
  { title: 'Desert Light',        category: 'Documentary', tagline: 'Between the dunes',       duration: '4:10', zoom: LETTERBOX_FILL_SCALE },
  { title: 'City in Motion',      category: 'Commercial',  tagline: 'A brand story',           duration: '1:48' },
  { title: 'Quiet Frames',        category: 'Short Film',  tagline: 'Stillness, in six acts',  duration: '5:02' },
]

function toFilm(media: MEDIA_FILM, index: number): FILM {
  const meta = FILM_META_BY_INDEX[index] ?? FILM_META_BY_INDEX[0]!
  return {
    id:       media.id,
    title:    meta.title,
    videoUrl: media.videoUrl,
    category: meta.category,
    width:    media.width,
    height:   media.height,
    tagline:  meta.tagline,
    duration: meta.duration,
    ...(media.poster ? { poster: media.poster } : {}),
    ...(meta.zoom ? { zoom: meta.zoom } : {}),
  }
}

export const FILMS: readonly FILM[] = FILMS_MEDIA.map(toFilm)

import type { REEL }        from '@shared/types/Reel'
import type { MEDIA_VIDEO } from '@shared/types/Media'
import { REELS_VIDEOS }     from '@shared/constants/MEDIA'

// The reels carousel is a projection of the centralised reel videos (V1–V23).
function toReel(video: MEDIA_VIDEO): REEL {
  return { id: video.id, title: video.title, videoUrl: video.url }
}

export const REELS: readonly REEL[] = REELS_VIDEOS.map(toReel)

// Curated reels previewed on the home carousel before "View all". Edit these ids
// (v1–v23) to change which reels lead on the home page.
const FEATURED_REEL_IDS: readonly string[] = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6']

const REEL_BY_ID: ReadonlyMap<string, REEL> = new Map(REELS.map(reel => [reel.id, reel]))

export const FEATURED_REELS: readonly REEL[] = FEATURED_REEL_IDS
  .map(id => REEL_BY_ID.get(id))
  .filter((reel): reel is REEL => reel !== undefined)

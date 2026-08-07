import type { REEL }        from '@shared/types/Reel'
import type { MEDIA_VIDEO } from '@shared/types/Media'
import { REELS_VIDEOS }     from '@shared/constants/MEDIA'

// The reels carousel is a projection of the centralised reel videos (V1–V23).
function toReel(video: MEDIA_VIDEO): REEL {
  return { id: video.id, title: video.title, videoUrl: video.url }
}

export const REELS: readonly REEL[] = REELS_VIDEOS.map(toReel)

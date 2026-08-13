import { useReducedMotion } from '@/composables/useReducedMotion'

interface IN_VIEW_VIDEO_OPTIONS {
  // Second the clip both starts and loops from — many clips open on a stronger
  // frame a beat in, so 0 is rarely the best entry point.
  readonly startSeconds?: number
  // Fraction of the tile that must be visible before playback begins.
  readonly threshold?: number
}

// Plays a video only while it is on screen and loops it back to `startSeconds`
// instead of the native loop's fixed 0s restart. Keeps archive grids of many
// clips cheap — off-screen tiles stay paused and (with preload="none") unfetched.
export function useInViewVideo(
  videoRef: Ref<HTMLVideoElement | null>,
  options: IN_VIEW_VIDEO_OPTIONS = {},
): void {
  const { startSeconds = 0, threshold = 0.35 } = options
  const prefersReducedMotion = useReducedMotion()

  let observer: IntersectionObserver | null = null

  function seekToStart(): void {
    const video = videoRef.value
    if (!video) return
    video.currentTime = video.duration > startSeconds ? startSeconds : 0
  }

  function play(): void {
    if (prefersReducedMotion.value) return
    const video = videoRef.value
    if (!video) return
    seekToStart()
    video.play().catch(() => {})
  }

  function onEnded(): void {
    play()
  }

  onMounted(() => {
    const video = videoRef.value
    if (!video) return

    video.addEventListener('ended', onEnded)
    video.addEventListener('loadedmetadata', seekToStart)

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play()
        else video.pause()
      },
      { threshold },
    )
    observer.observe(video)
  })

  onUnmounted(() => {
    observer?.disconnect()
    const video = videoRef.value
    video?.removeEventListener('ended', onEnded)
    video?.removeEventListener('loadedmetadata', seekToStart)
  })
}

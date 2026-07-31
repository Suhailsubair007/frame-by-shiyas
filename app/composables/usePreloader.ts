// Module-level singletons — persist for the lifetime of the page session.
// On SPA navigation ThePreloader is not remounted, so these remain true.
const _isComplete = ref(false)
const _animDone   = ref(false)
const _assetsDone = ref(false)
const _progress   = ref(0)

// Wipe fires when BOTH conditions are satisfied — whichever is slower.
// Using computed so the signal propagates reactively without manual tryWipe calls.
const _canWipe = computed(() => _animDone.value && _assetsDone.value)

export function usePreloader() {
  // Dev: always show preloader (so you see it on every hard refresh).
  // Prod: skip on repeat visits within the same browser session.
  const isFirstVisit = import.meta.client
    ? (import.meta.dev ? true : !sessionStorage.getItem('fbs-visited'))
    : true

  function complete(): void {
    _isComplete.value = true
    if (import.meta.client && !import.meta.dev) {
      sessionStorage.setItem('fbs-visited', '1')
    }
  }

  // Called by ThePreloader when the minimum brand animation has played.
  function signalAnimationReady(): void {
    _animDone.value = true
  }

  // Called by the page when all above-the-fold assets have settled.
  // On returning visits ThePreloader calls complete() directly — this is a no-op.
  function signalAssetsReady(): void {
    _assetsDone.value = true
  }

  // Reports how many of the total assets have loaded (0–1 ratio).
  function updateProgress(loaded: number, total: number): void {
    _progress.value = total > 0 ? loaded / total : 1
  }

  return {
    isComplete:           readonly(_isComplete),
    canWipe:              readonly(_canWipe),
    progress:             readonly(_progress),
    isFirstVisit,
    complete,
    signalAnimationReady,
    signalAssetsReady,
    updateProgress,
  } as const
}

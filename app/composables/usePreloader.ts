const _isComplete = ref(false)

export function usePreloader() {
  // In dev: always show the preloader so you can see it on every hard-refresh.
  // In production: skip it on repeat visits within the same browser session.
  const isFirstVisit = import.meta.client
    ? (import.meta.dev ? true : !sessionStorage.getItem('fbs-visited'))
    : true

  function complete(): void {
    _isComplete.value = true
    if (import.meta.client && !import.meta.dev) {
      sessionStorage.setItem('fbs-visited', '1')
    }
  }

  return {
    isComplete:   readonly(_isComplete),
    isFirstVisit,
    complete,
  } as const
}

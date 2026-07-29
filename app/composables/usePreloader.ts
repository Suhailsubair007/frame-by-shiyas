const _isComplete = ref(false)

export function usePreloader() {
  // Skip the full animation on repeat visits within the same session
  const isFirstVisit = import.meta.client
    ? !sessionStorage.getItem('fbs-visited')
    : true

  function complete(): void {
    _isComplete.value = true
    if (import.meta.client) sessionStorage.setItem('fbs-visited', '1')
  }

  return {
    isComplete:   readonly(_isComplete),
    isFirstVisit,
    complete,
  } as const
}

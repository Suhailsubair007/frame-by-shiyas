import type Lenis from 'lenis'

export function useLenis() {
  const { $lenis } = useNuxtApp()
  const lenis = $lenis as Lenis

  function stop(): void {
    lenis?.stop()
  }

  function start(): void {
    lenis?.start()
  }

  function scrollTo(target: string | number | HTMLElement, options?: Parameters<Lenis['scrollTo']>[1]): void {
    lenis?.scrollTo(target, options)
  }

  function scrollToTop(immediate = false): void {
    lenis?.scrollTo(0, { immediate })
  }

  return { lenis, stop, start, scrollTo, scrollToTop } as const
}

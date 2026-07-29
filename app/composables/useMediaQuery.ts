import { useMediaQuery as vueUseMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@shared/constants/BREAKPOINTS'

export function useMediaQuery() {
  const isMobile  = vueUseMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`)
  const isTablet  = vueUseMediaQuery(`(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`)
  const isDesktop = vueUseMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`)
  // True only on devices with a real pointer (mouse) — not touch
  const hasPointer = vueUseMediaQuery('(hover: hover) and (pointer: fine)')

  return { isMobile, isTablet, isDesktop, hasPointer } as const
}

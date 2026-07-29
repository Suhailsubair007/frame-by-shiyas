import { usePreferredReducedMotion } from '@vueuse/core'

export function useReducedMotion(): Readonly<Ref<boolean>> {
  const preference = usePreferredReducedMotion()
  return computed(() => preference.value === 'reduce')
}

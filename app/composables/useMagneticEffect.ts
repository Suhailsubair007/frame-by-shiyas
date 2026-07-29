import { gsap } from 'gsap'

interface MAGNETIC_OPTIONS {
  readonly strength?: number
  readonly radius?: number
}

export function useMagneticEffect(options: MAGNETIC_OPTIONS = {}) {
  const { strength = 0.38, radius = 100 } = options
  const elementRef = ref<HTMLElement | null>(null)

  function onMouseMove(e: MouseEvent): void {
    const el = elementRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    if (Math.sqrt(dx ** 2 + dy ** 2) < radius) {
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: 'power2.out' })
    }
  }

  function onMouseLeave(): void {
    const el = elementRef.value
    if (!el) return
    // Elastic snap-back — gives a springy, physical feel
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  }

  onMounted(() => {
    const el = elementRef.value
    if (!el) return
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
  })

  onUnmounted(() => {
    const el = elementRef.value
    if (!el) return
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseleave', onMouseLeave)
  })

  return { elementRef } as const
}

<script setup lang="ts">
import { gsap }             from 'gsap'
import { CURSOR_STATE }     from '@shared/enums/CursorState'
import { useCursorState }   from '@/composables/useCursorState'
import { useLenis }         from '@/composables/useLenis'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ANIMATION }        from '@shared/constants/ANIMATION'
import { CONTACT }          from '@shared/constants/CONTACT'
import { LAYOUT }           from '@shared/constants/LAYOUT'

interface DOCK_ACTION {
  readonly key:      string
  readonly label:    string
  readonly icon:     string
  readonly href:     string | null
  readonly external: boolean
}

const { setState, reset }   = useCursorState()
const { scrollTo }          = useLenis()
const prefersReducedMotion  = useReducedMotion()

const isOpen   = ref(false)
const rootRef  = ref<HTMLElement | null>(null)
const itemsRef = ref<HTMLElement[]>([])

// Ordered bottom-to-top in the fan; call/WhatsApp sit nearest the thumb.
const actions: readonly DOCK_ACTION[] = [
  { key: 'call',     label: 'Call',    icon: 'icon-phone',    href: `tel:${CONTACT.PHONE_TEL}`,        external: false },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'icon-whatsapp', href: `https://wa.me/${CONTACT.WHATSAPP}`, external: true  },
  { key: 'email',    label: 'Email',   icon: 'icon-mail',     href: `mailto:${CONTACT.EMAIL}`,          external: false },
  { key: 'contact',  label: 'Contact', icon: 'icon-arrow',    href: null,                               external: false },
] as const

function setItemRef(el: Element | ComponentPublicInstance | null, index: number): void {
  if (el instanceof HTMLElement) itemsRef.value[index] = el
}

function open(): void {
  isOpen.value = true
}

function close(): void {
  isOpen.value = false
}

function toggle(): void {
  if (isOpen.value) {
    close()
    return
  }
  open()
}

// The final action ('Contact') has no href — it smooth-scrolls to #contact.
function onActionClick(action: DOCK_ACTION, event: MouseEvent): void {
  close()
  if (action.href !== null) return
  event.preventDefault()
  scrollTo('#contact', { offset: -LAYOUT.HEADER_OFFSET })
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

function onPointerDown(event: PointerEvent): void {
  if (!isOpen.value) return
  if (rootRef.value?.contains(event.target as Node)) return
  close()
}

watch(isOpen, (opened) => {
  const items = itemsRef.value.filter(Boolean)
  if (items.length === 0) return

  if (prefersReducedMotion.value) {
    gsap.set(items, opened ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.85 })
    return
  }

  if (opened) {
    gsap.fromTo(
      items,
      { opacity: 0, y: 12, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: ANIMATION.DURATION.FAST,
        stagger:  ANIMATION.STAGGER.DEFAULT,
        ease:     ANIMATION.EASE.BACK_OUT,
      },
    )
    return
  }

  gsap.to([...items].reverse(), {
    opacity: 0, y: 12, scale: 0.85,
    duration: ANIMATION.DURATION.INSTANT,
    stagger:  ANIMATION.STAGGER.TIGHT,
    ease:     ANIMATION.EASE.DEFAULT,
  })
})

onMounted(() => {
  gsap.set(itemsRef.value.filter(Boolean), { opacity: 0, y: 12, scale: 0.85 })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div
    ref="rootRef"
    class="fixed bottom-6 right-6 flex flex-col items-end gap-3"
    style="z-index: var(--z-sticky);"
  >
    <!-- Icon sprite — defined once, referenced by every action via <use> -->
    <svg width="0" height="0" aria-hidden="true" class="absolute">
      <symbol id="icon-phone" viewBox="0 0 24 24">
        <path
          fill="none" stroke="currentColor" stroke-width="1.75"
          stroke-linecap="round" stroke-linejoin="round"
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
        />
      </symbol>
      <symbol id="icon-whatsapp" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.42Z"
        />
      </symbol>
      <symbol id="icon-mail" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </g>
      </symbol>
      <symbol id="icon-arrow" viewBox="0 0 24 24">
        <path
          fill="none" stroke="currentColor" stroke-width="1.75"
          stroke-linecap="round" stroke-linejoin="round"
          d="M12 5v14M19 12l-7 7-7-7"
        />
      </symbol>
    </svg>

    <!-- Action fan -->
    <ul id="contact-dock-actions" class="flex flex-col items-end gap-3" role="list">
      <li
        v-for="(action, i) in actions"
        :key="action.key"
        :ref="el => setItemRef(el, i)"
        class="opacity-0"
      >
        <a
          :href="action.href ?? '#contact'"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noopener noreferrer' : undefined"
          :tabindex="isOpen ? 0 : -1"
          :aria-hidden="!isOpen"
          :aria-label="action.label"
          class="group flex items-center justify-end gap-3"
          @click="onActionClick(action, $event)"
          @mouseenter="setState(CURSOR_STATE.HOVER)"
          @mouseleave="reset"
        >
          <span
            class="rounded-full border border-border bg-surface-elevated/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted backdrop-blur transition-colors duration-300 group-hover:text-text"
          >
            {{ action.label }}
          </span>
          <span
            class="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface-elevated/90 text-text backdrop-blur transition-colors duration-300 group-hover:border-accent group-hover:text-accent"
          >
            <svg class="h-5 w-5" aria-hidden="true">
              <use :href="`#${action.icon}`" />
            </svg>
          </span>
        </a>
      </li>
    </ul>

    <!-- Toggle FAB -->
    <button
      type="button"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-void shadow-lg shadow-black/30 transition-transform duration-300 ease-expo hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void"
      :aria-expanded="isOpen"
      aria-label="Contact quick actions"
      aria-controls="contact-dock-actions"
      @click="toggle"
      @mouseenter="setState(CURSOR_STATE.HOVER)"
      @mouseleave="reset"
    >
      <svg
        class="h-6 w-6 transition-transform duration-300 ease-expo motion-reduce:transition-none"
        :class="isOpen ? 'rotate-90' : 'rotate-0'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <template v-if="isOpen">
          <path d="M18 6 6 18M6 6l12 12" />
        </template>
        <template v-else>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        </template>
      </svg>
    </button>
  </div>
</template>

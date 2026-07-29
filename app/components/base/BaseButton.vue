<script setup lang="ts">
import { CURSOR_STATE } from '@shared/enums/CursorState'
import { useCursorState } from '@/composables/useCursorState'
import { useMagneticEffect } from '@/composables/useMagneticEffect'
import { useReducedMotion } from '@/composables/useReducedMotion'

type BUTTON_VARIANT = 'default' | 'ghost' | 'text' | 'icon'
type BUTTON_SIZE    = 'sm' | 'md' | 'lg'
type BUTTON_TYPE    = 'button' | 'submit' | 'reset'

const props = withDefaults(defineProps<{
  variant?:  BUTTON_VARIANT
  size?:     BUTTON_SIZE
  href?:     string
  external?: boolean
  magnetic?: boolean
  disabled?: boolean
  type?:     BUTTON_TYPE
}>(), {
  variant:  'default',
  size:     'md',
  magnetic: false,
  disabled: false,
  type:     'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const prefersReducedMotion = useReducedMotion()
const { setState, reset }  = useCursorState()
const { elementRef }       = useMagneticEffect({ strength: 0.35, radius: 90 })

// Resolve the rendered element
const NuxtLink = resolveComponent('NuxtLink')

const tag = computed(() => {
  if (!props.href) return 'button'
  if (props.external) return 'a'
  return NuxtLink
})

const tagProps = computed(() => {
  if (!props.href) return { type: props.type, disabled: props.disabled }
  if (props.external) return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
  return { to: props.href }
})

// Magnetic ref only applies when magnetic + no reduced motion preference
const magneticRef = computed(() =>
  props.magnetic && !prefersReducedMotion.value ? elementRef : null,
)

const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-sans font-light tracking-widest uppercase transition-opacity duration-300 focus-visible:outline-none'

const variantClasses: Record<BUTTON_VARIANT, string> = {
  default: 'border border-border-strong text-text px-8 py-3.5 text-xs hover:border-text',
  ghost:   'border border-border text-text-muted px-8 py-3.5 text-xs hover:text-text hover:border-border-strong',
  text:    'text-text-muted text-xs hover:text-text group',
  icon:    'border border-border w-11 h-11 rounded-full hover:border-border-strong',
}

const sizeClasses: Record<BUTTON_SIZE, string> = {
  sm: 'text-[10px] px-5 py-2.5',
  md: '',
  lg: 'text-xs px-10 py-4',
}

function onMouseEnter(): void {
  setState(CURSOR_STATE.HOVER)
}

function onMouseLeave(): void {
  reset()
}

function onClick(e: MouseEvent): void {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <component
    :is="tag"
    :ref="magneticRef"
    v-bind="tagProps"
    :class="[baseClasses, variantClasses[variant], props.size !== 'md' ? sizeClasses[size] : '', props.disabled ? 'opacity-40 pointer-events-none' : '']"
    :aria-disabled="disabled || undefined"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <slot />

    <!-- Arrow indicator for text variant -->
    <span
      v-if="variant === 'text'"
      class="inline-block translate-x-0 transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
      aria-hidden="true"
    >
      →
    </span>
  </component>
</template>

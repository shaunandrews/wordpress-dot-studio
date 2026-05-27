<!--
@component Button
@description Renders the shared call-to-action control as a native button or anchor.
@props href - Optional URL that switches the root element to an anchor.
@props type - Native button type used when no href is provided.
@props variant - Visual style, either default or primary.
@slots default - Button label or inline content.
-->
<script setup>
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary'].includes(value),
  },
});

const attrs = useAttrs();

const tag = computed(() => (props.href ? 'a' : 'button'));
const buttonAttrs = computed(() => {
  const { class: className, ...rest } = attrs;

  return {
    ...rest,
    class: ['button', `button-${props.variant}`, className],
    href: props.href || undefined,
    type: props.href ? undefined : props.type,
  };
});
</script>

<template>
  <component :is="tag" v-bind="buttonAttrs">
    <slot></slot>
  </component>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  height: 40px;
  padding: var(--space-m) var(--space-l);
  border: 1px dashed var(--color-chrome-border);
  border-radius: 6px;
  color: var(--color-chrome-fg-muted);
  background: var(--color-chrome-fill);
  font: inherit;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.075s linear;
}

.button:hover {
  border-color: var(--color-theme-fill);
  color: var(--color-theme-fill);
}

.button-primary {
  border: 1px solid var(--color-theme-fill);
  color: var(--color-theme-fg);
  background: var(--color-theme-fill);
  box-shadow: inset 0 1px 0.5px var(--color-theme-fill-highlight);
}

.button-primary:hover {
  border-color: var(--color-theme-fill-accent);
  color: var(--color-theme-fg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3),
              inset 0 1px 1px var(--color-theme-fill-highlight);
  transform: rotate(-1deg);
}
</style>

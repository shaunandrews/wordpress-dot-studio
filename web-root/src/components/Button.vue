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
  min-height: 2.25rem;
  padding: var(--space-m) var(--space-l);
  border: 1px solid var(--color-chrome-border);
  border-radius: 4px;
  color: inherit;
  background: var(--color-chrome-fill);
  font: inherit;
  line-height: var(--line-height-snug);
  text-decoration: none;
  cursor: pointer;
}

.button-primary {
  border-color: var(--color-chrome-fg);
  color: var(--color-chrome-fill);
  background: var(--color-chrome-fg);
}
</style>

<!--
@component Button
@description Renders the shared call-to-action control as a native button or anchor.
@props href - Optional URL that switches the root element to an anchor.
@props type - Native button type used when no href is provided.
@props variant - Visual style, either default or primary.
@props dashSize - Length of each dash for the default button outline.
@props dashGap - Gap between dashes for the default button outline.
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
  dashSize: {
    type: String,
    default: '4px',
  },
  dashGap: {
    type: String,
    default: '4px',
  },
});

const attrs = useAttrs();

const tag = computed(() => (props.href ? 'a' : 'button'));

function randomizePrimaryRotation(event) {
  if (props.variant !== 'primary') return;

  const direction = Math.random() < 0.5 ? -1 : 1;
  const rotation = (0.7 + Math.random() * 0.8) * direction;

  event.currentTarget.style.setProperty('--button-hover-rotate', `${rotation.toFixed(2)}deg`);
}

const buttonAttrs = computed(() => {
  const { class: className, style, ...rest } = attrs;

  return {
    ...rest,
    class: ['button', `button-${props.variant}`, className],
    href: props.href || undefined,
    style: [
      {
        '--button-dash-size': props.dashSize,
        '--button-dash-gap': props.dashGap,
      },
      style,
    ],
    type: props.href ? undefined : props.type,
  };
});
</script>

<template>
  <component
    :is="tag"
    v-bind="buttonAttrs"
    @focus="randomizePrimaryRotation"
    @pointerenter="randomizePrimaryRotation"
  >
    <svg class="button-outline" aria-hidden="true" focusable="false">
      <rect class="button-outline-rect" />
    </svg>
    <span class="button-content">
      <slot></slot>
    </span>
  </component>
</template>

<style scoped>
.button {
  --button-border-width: 1px;
  --button-dash-color: var(--color-chrome-border);
  --button-dash-step: calc(var(--button-dash-size) + var(--button-dash-gap));
  --button-hover-rotate: 0deg;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  height: 40px;
  padding: var(--space-m) var(--space-l);
  /* border: var(--button-border-width) solid transparent; */
  border: none;
  border-radius: 6px;
  color: var(--color-chrome-fg-muted);
  background: var(--color-chrome-fill-transparent);
  backdrop-filter: blur(4px);
  font: inherit;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.14s ease,
    background-color 0.14s ease,
    border-color 0.14s ease,
    box-shadow 0.14s ease,
    transform 0.14s cubic-bezier(0.16, 1, 0.3, 1);
}

.button-outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.button-outline-rect {
  x: calc(var(--button-border-width) / 2);
  y: calc(var(--button-border-width) / 2);
  width: calc(100% - var(--button-border-width));
  height: calc(100% - var(--button-border-width));
  rx: 6px;
  fill: none;
  stroke: var(--button-dash-color);
  stroke-width: var(--button-border-width);
  stroke-dasharray: var(--button-dash-size) var(--button-dash-gap);
  transition: stroke 0.14s ease;
  vector-effect: non-scaling-stroke;
}

.button-content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
}

.button:hover {
  --button-dash-color: var(--color-theme-fill);

  color: var(--color-theme-fill);
}

.button:hover .button-outline-rect {
  animation: button-outline-march 2s linear infinite;
}

.button-primary {
  border: 1px solid var(--color-theme-fill);
  color: var(--color-theme-fg);
  background: var(--color-theme-fill);
  box-shadow: inset 0 1px 0.5px var(--color-theme-fill-highlight);
}

.button-primary .button-outline {
  display: none;
}

.button-primary:hover {
  border-color: var(--color-theme-fill-accent);
  color: var(--color-theme-fg);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px var(--color-theme-fill-highlight);
  transform: rotate(var(--button-hover-rotate));
}

@keyframes button-outline-march {
  to {
    stroke-dashoffset: calc(var(--button-dash-step) * -1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition-duration: 0.01ms;
  }

  .button:hover .button-outline-rect {
    animation: none;
  }

  .button-primary:hover {
    transform: none;
  }
}
</style>

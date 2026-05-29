<!--
@component CommandLineCopy
@description Renders an input-like command snippet that copies its command from the field or icon button.
@props command - The shell command to display and copy.
@props label - Accessible label for the copy action.
-->
<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  command: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Copy command',
  },
});

const copied = ref(false);
let copiedTimer = null;

const actionLabel = computed(() => (copied.value ? 'Copied' : props.label));

function markCopied() {
  copied.value = true;
  window.clearTimeout(copiedTimer);
  copiedTimer = window.setTimeout(() => {
    copied.value = false;
  }, 1600);
}

function copyWithTextarea() {
  const textarea = document.createElement('textarea');

  textarea.value = props.command;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.inset = '0 auto auto 0';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

async function copyCommand() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.command);
    } else {
      copyWithTextarea();
    }

    markCopied();
  } catch {
    copyWithTextarea();
    markCopied();
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(copiedTimer);
});
</script>

<template>
  <div class="command-line-copy">
    <button
      class="command-line-copy-field"
      type="button"
      :aria-label="`${label}: ${command}`"
      @click="copyCommand"
    >
      <code data-install-command>{{ command }}</code>
    </button>
    <button
      class="command-line-copy-button"
      type="button"
      :aria-label="actionLabel"
      :title="actionLabel"
      @click="copyCommand"
    >
      <svg v-if="copied" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="10" height="10" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span class="command-line-copy-status" aria-live="polite">{{ copied ? 'Copied' : '' }}</span>
    </button>
  </div>
</template>

<style scoped>
.command-line-copy {
  --command-line-copy-hover-border: var(--color-theme-fill);
  --command-line-copy-hover-fg: var(--color-chrome-fg);
  --command-line-copy-hover-ring: color-mix(in srgb, var(--color-theme-fill) 16%, transparent);
  --command-line-copy-button-hover-bg: color-mix(in srgb, var(--color-theme-fill) 10%, transparent);
  --command-line-copy-button-hover-fg: var(--color-theme-fill);

  position: relative;
  min-width: min(100%, 18rem);
  max-width: 100%;
  color: var(--color-chrome-fg-muted);
}

.command-line-copy-field {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: var(--space-m) calc(36px + var(--space-m)) var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  color: inherit;
  font: inherit;
  overflow: hidden;
  text-align: left;
  cursor: copy;
  transition:
    border-color 0.14s ease,
    box-shadow 0.14s ease,
    color 0.14s ease;
}

.command-line-copy-field code {
  display: block;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--font-size-s);
  line-height: var(--line-height-normal);
  scrollbar-width: none;
  white-space: nowrap;
}

.command-line-copy-field code::-webkit-scrollbar {
  display: none;
}

.command-line-copy-field:hover,
.command-line-copy-field:focus-visible,
.command-line-copy:focus-within .command-line-copy-field {
  border-color: var(--command-line-copy-hover-border);
  color: var(--command-line-copy-hover-fg);
  box-shadow: 0 0 0 3px var(--command-line-copy-hover-ring);
  outline: none;
}

.command-line-copy-button {
  position: absolute;
  top: 50%;
  right: var(--space-s);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background-color 0.14s ease,
    color 0.14s ease;
}

.command-line-copy-button:hover,
.command-line-copy-button:focus-visible {
  background: var(--command-line-copy-button-hover-bg);
  color: var(--command-line-copy-button-hover-fg);
  outline: none;
}

.command-line-copy-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.command-line-copy-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>

<script setup>
import Button from './Button.vue';

defineProps({
  primaryLabel: {
    type: String,
    required: true,
  },
  command: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="home-hero-actions hstack gap-m">
    <Button variant="primary" href="/download">{{ primaryLabel }}</Button>
    <code>{{ command }}</code>
  </div>
</template>

<style scoped>
.home-hero-actions {
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.home-hero-actions code {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  color: var(--color-chrome-fg-muted);
  font-size: var(--font-size-s);
}

@media (max-width: 760px) {
  .home-hero-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .home-hero-actions :deep(.button) {
    width: 100%;
  }

  .home-hero-actions code {
    width: 100%;
    justify-content: center;
    overflow-wrap: anywhere;
    white-space: normal;
  }
}
</style>

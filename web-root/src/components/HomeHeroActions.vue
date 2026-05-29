<script setup>
import Button from './Button.vue';
import CommandLineCopy from './CommandLineCopy.vue';

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
    <CommandLineCopy :command="command" />
  </div>
</template>

<style scoped>
.home-hero-actions {
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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

  .home-hero-actions :deep(.command-line-copy) {
    width: 100%;
  }
}
</style>

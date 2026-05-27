<!--
@component FpoImage
@description Displays a reusable FPO placeholder for unfinished media or illustration slots.
@props shadow - Toggles the default box shadow on or off.
@notes Marked aria-hidden because it communicates layout intent rather than page content.
-->
<script setup>
defineProps({
  shadow: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <figure class="fpo-image" :class="{ 'fpo-image-shadow': shadow }" aria-hidden="true">
    <p class="type-caption type-s">FPO</p>
  </figure>
</template>

<style scoped>
.fpo-image {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
  border-radius: var(--space-m);
  backdrop-filter: blur(4px);
  overflow: hidden;
}

.fpo-image-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fpo-image > * {
  margin: 0;
}
</style>

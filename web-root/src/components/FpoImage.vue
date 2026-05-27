<!--
@component FpoImage
@description Displays a reusable FPO placeholder for unfinished media or illustration slots.
@props boxShadow - CSS box-shadow value for the placeholder; pass false or an empty string to remove it.
@notes Marked aria-hidden because it communicates layout intent rather than page content.
-->
<script setup>
import { computed } from 'vue';

const DEFAULT_BOX_SHADOW = '0 2px 4px rgba(0, 0, 0, 0.3)';

const props = defineProps({
  boxShadow: {
    type: [String, Boolean],
    default: DEFAULT_BOX_SHADOW,
  },
});

const imageStyle = computed(() => ({
  '--fpo-box-shadow': props.boxShadow === false || props.boxShadow === ''
    ? 'none'
    : props.boxShadow === true
      ? DEFAULT_BOX_SHADOW
      : props.boxShadow,
}));
</script>

<template>
  <figure class="fpo-image" :style="imageStyle" aria-hidden="true">
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
  box-shadow: var(--fpo-box-shadow);
}

.fpo-image > * {
  margin: 0;
}
</style>

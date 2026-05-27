<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  preserveWhite: {
    type: Boolean,
    default: false,
  },
});

const markup = ref('');

watchEffect(async () => {
  markup.value = '';
  const response = await fetch(props.src);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  markup.value = await response.text();
});
</script>

<template>
  <span
    class="inline-svg"
    :class="{ 'inline-svg-preserve-white': preserveWhite }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    v-html="markup"
  />
</template>

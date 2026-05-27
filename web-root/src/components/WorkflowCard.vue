<script setup>
import InlineSvg from './InlineSvg.vue';

defineProps({
  step: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article class="workflow-card">
    <InlineSvg :src="`/assets/illustration-${step.key}.svg`" />
    <h3 class="type-heading" :class="step.headingSize ?? 'type-xl'">{{ step.title }}</h3>
    <p class="type-body type-s">{{ step.body }}</p>
  </article>
</template>

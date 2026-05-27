<!--
@component WorkflowCard
@description Displays one workflow step with its matching illustration, title, and short body copy.
@props step - Workflow step object with key, title, body, and optional headingSize.
-->
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
    <div class="px-l pb-xl">
      <h3 class="type-heading" :class="step.headingSize ?? 'type-xl'">{{ step.title }}</h3>
      <p class="type-body type-s">{{ step.body }}</p>
    </div>
  </article>
</template>

<style scoped>
.workflow-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-l);
  text-align: center;
}

.workflow-card > * {
  margin: 0;
}
</style>

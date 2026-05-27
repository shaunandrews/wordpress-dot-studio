<!--
@component SectionIntro
@description Renders a shared section heading and paragraph with configurable alignment and sizing.
@props title - Heading text rendered as an h2.
@props body - Supporting paragraph text rendered as a p.
@props align - Text alignment for the intro block.
@props maxWidth - Optional max-width style for the intro block.
@props titleSize - Type size class applied to the heading.
@props bodySize - Type size class applied to the paragraph.
-->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
  maxWidth: {
    type: String,
    default: 'var(--line-length-l)',
  },
  titleSize: {
    type: String,
    default: 'type-xxl',
  },
  bodySize: {
    type: String,
    default: 'type-l',
  },
});

const rootStyle = computed(() => ({
  '--section-intro-max-width': props.maxWidth,
}));
</script>

<template>
  <div class="section-intro" :class="`section-intro-${align}`" :style="rootStyle">
    <h2 class="type-heading" :class="titleSize">{{ title }}</h2>
    <p class="type-body" :class="bodySize">{{ body }}</p>
  </div>
</template>

<style scoped>
.section-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  max-width: var(--section-intro-max-width);
  margin-inline: auto;
}

.section-intro-left {
  align-items: flex-start;
  text-align: left;
}

.section-intro-center {
  align-items: center;
  text-align: center;
}

.section-intro-right {
  align-items: flex-end;
  text-align: right;
}

.section-intro > * {
  margin: 0;
}
</style>

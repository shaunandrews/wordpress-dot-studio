<!--
@component HomeStudioCode
@description Highlights the Studio Code foundation inside a centered blueprint-style DotGrid panel.
@notes Reuses DotGrid so blueprint texture behavior stays consistent with the hero surface.
-->
<script setup>
import Button from './Button.vue';
import DotGrid from './DotGrid.vue';
</script>

<template>
  <section class="home-studio-code px-l">
    <DotGrid
      as="div"
      class="studio-code-blueprint"
      :cross-size="3"
      :cross-thickness="0.6"
      :opacity="0.16"
      :repulsion="0.12"
      :ripple-strength="0.35"
      :spacing="16"
    >
      <div class="studio-code-blueprint-content">
        <h2 class="type-heading type-xxl">Powered by Studio Code</h2>
        <p class="type-body type-l">The Studio desktop app and web site are built upon Studio Code, an AI-powered WordPress agent that can write code, design themes, and more.</p>
        <Button>Learn more</Button>
      </div>
    </DotGrid>
  </section>
</template>

<style scoped>
.home-studio-code {
  display: grid;
  justify-items: center;
  width: 100%;
}

.studio-code-blueprint {
  position: relative;
  display: flex;
  width: min(100%, var(--line-length-l));
  flex-direction: column;
  align-items: center;
  border: 1px solid color-mix(in srgb, currentColor 26%, transparent);
  border-radius: 18px;
  overflow: hidden;
  text-align: center;
}

.studio-code-blueprint::before,
.studio-code-blueprint::after {
  position: absolute;
  width: 72px;
  height: 72px;
  content: "";
  pointer-events: none;
}

.studio-code-blueprint::before {
  top: var(--space-l);
  left: var(--space-l);
  border-top: 1px solid currentColor;
  border-left: 1px solid currentColor;
  opacity: 0.28;
}

.studio-code-blueprint::after {
  right: var(--space-l);
  bottom: var(--space-l);
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  opacity: 0.28;
}

.studio-code-blueprint-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xxl);
}

.studio-code-blueprint-content > * {
  margin-bottom: 0;
}

.studio-code-blueprint-content > * + * {
  margin-top: var(--space-l);
}

@media (max-width: 700px) {
  .studio-code-blueprint-content {
    padding: var(--space-xl);
  }
}
</style>

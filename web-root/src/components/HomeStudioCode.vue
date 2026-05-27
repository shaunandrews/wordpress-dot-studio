<script setup>
import Button from './Button.vue';
</script>

<template>
  <section class="home-studio-code px-l">
    <div class="studio-code-blueprint">
      <h2 class="type-heading type-xxl">Powered by Studio Code</h2>
      <p class="type-body type-l">The Studio desktop app and web site are built upon Studio Code, an AI-powered WordPress agent that can write code, design themes, and more.</p>
      <Button>Learn more</Button>
    </div>
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
  padding: var(--space-xxl);
  border: 1px solid color-mix(in srgb, currentColor 26%, transparent);
  border-radius: 18px;
  overflow: hidden;
  text-align: center;
  background:
    linear-gradient(color-mix(in srgb, currentColor 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, currentColor 10%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in srgb, currentColor 5%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, currentColor 5%, transparent) 1px, transparent 1px);
  background-position: center;
  background-size: 64px 64px, 64px 64px, 16px 16px, 16px 16px;
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

.studio-code-blueprint > * {
  position: relative;
  margin-bottom: 0;
}

.studio-code-blueprint > * + * {
  margin-top: var(--space-l);
}

@media (max-width: 700px) {
  .studio-code-blueprint {
    padding: var(--space-xl);
  }
}
</style>

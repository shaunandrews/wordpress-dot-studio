<!--
@component HomeHero
@description Renders the landing page hero with dot-grid atmosphere, primary calls to action, and a media placeholder.
@notes Consumes the site header height custom property so hero spacing accounts for the fixed header.
-->
<script setup>
import Button from './Button.vue';
import DotGrid from './DotGrid.vue';
import FpoImage from './FpoImage.vue';
</script>

<template>
  <DotGrid as="section" class="home-hero hstack gap-xxl w-full align-center justify-between p-xl pl-xxxl" aria-label="WordPress Studio overview">
    <div class="home-hero-message">
      <h1 class="type-display type-xxxxl">Make anything with WordPress</h1>
      <p class="type-body type-l">A modern toolkit for professional WordPress development to build, preview, and ships sites and apps.</p>
      <div class="hstack gap-m">
        <Button variant="primary" href="/download">Download for macOS</Button>
        <Button>Learn more</Button>
      </div>
    </div>
    <FpoImage class="home-hero-media" />
  </DotGrid>
</template>

<style scoped>
.home-hero {
  padding-top: calc(var(--site-header-height, 0px) + var(--space-l));
  min-height: 80dvh;
  border-bottom: 1px solid var(--color-chrome-border);
}

.home-hero-message {
  max-width: 480px;
}

.home-hero-media {
  flex: 1;
  align-self: stretch;
}
</style>

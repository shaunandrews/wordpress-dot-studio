<!--
@component HomeHero
@description Renders the landing page hero with dot-grid atmosphere, primary calls to action, and a media placeholder.
@notes Consumes the site header height custom property so hero spacing accounts for the fixed header.
-->
<script setup>
import Button from './Button.vue';
import DotGrid from './DotGrid.vue';
import StudioDesktopMockup from './StudioDesktopMockup.vue';
</script>

<template>
  <DotGrid as="section" class="home-hero hstack gap-xxl w-full align-center justify-between p-xl pl-xxxl" aria-label="WordPress Studio overview">
    <div class="home-hero-message vstack gap-l">
      <h1 class="type-display type-xxxxl">Make anything with WordPress</h1>
      <p class="type-body type-l">A modern toolkit for professional WordPress development to build, preview, and ships sites and apps.</p>
      <div class="hstack gap-m">
        <Button variant="primary" href="/download">Download for macOS</Button>
        <Button>Learn more</Button>
      </div>
    </div>
    <StudioDesktopMockup class="home-hero-media" />
  </DotGrid>
</template>

<style scoped>
.home-hero {
  padding-top: calc(var(--site-header-height, 0px) + var(--space-l));
  min-height: 40dvh;
  border-bottom: 1px solid var(--color-chrome-border);
}

.home-hero-message {
  max-width: 480px;

  p {
    color: var(--color-chrome-fg-muted);
  }
}

.home-hero-media {
  flex: 1;
  align-self: stretch;
  max-width: 980px;
}

@media (max-width: 1100px) {
  .home-hero {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding-inline: var(--space-xl);
  }

  .home-hero-message {
    max-width: var(--line-length-m);
  }

  .home-hero-media {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 680px) {
  .home-hero {
    padding-inline: var(--space-l);
  }
}
</style>

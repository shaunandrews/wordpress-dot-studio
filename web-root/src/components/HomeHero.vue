<!--
@component HomeHero
@description Renders the landing page hero with the surface treatment and painting carousel.
@notes Consumes the site header height custom property through HomeHeroSurface.
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import HomeHeroSurface from './HomeHeroSurface.vue';
import { paintingOptions } from './homeHeroData.js';

const selectedPaintingId = ref(paintingOptions[0].id);
const paintingSources = paintingOptions.map((painting) => painting.src);
let autoSwitchTimer = 0;

const selectedPainting = computed(
  () =>
    paintingOptions.find((painting) => painting.id === selectedPaintingId.value) ??
    paintingOptions[0]
);

function advancePainting() {
  const currentIndex = paintingOptions.findIndex(
    (painting) => painting.id === selectedPaintingId.value
  );
  const nextIndex = (currentIndex + 1) % paintingOptions.length;
  selectedPaintingId.value = paintingOptions[nextIndex].id;
}

onMounted(() => {
  autoSwitchTimer = window.setInterval(advancePainting, 12000);
});

onBeforeUnmount(() => {
  window.clearInterval(autoSwitchTimer);
});
</script>

<template>
  <div class="home-hero">
    <HomeHeroSurface :painting="selectedPainting" :painting-sources="paintingSources" />
  </div>
</template>

<style scoped>
.home-hero {
  position: relative;
  z-index: 1;
  isolation: isolate;
}
</style>

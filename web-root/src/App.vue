<script setup>
import HomeDownload from './components/HomeDownload.vue';
import HomeHero from './components/HomeHero.vue';
import HomeInterfaces from './components/HomeInterfaces.vue';
import HomeStudioCode from './components/HomeStudioCode.vue';
import HomeWorkflow from './components/HomeWorkflow.vue';
import SiteHeader from './components/SiteHeader.vue';
</script>

<template>
  <div class="wp-studio page-home vstack">
    <SiteHeader />

    <main id="main" class="vstack gap-xl">
      <HomeHero />
      <HomeWorkflow />
      <HomeInterfaces />
      <HomeStudioCode />
      <HomeDownload />
    </main>

    <footer class="site-footer">
      <p class="type-caption type-s">An Automattic product</p>
    </footer>
  </div>
</template>

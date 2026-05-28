<!--
@component HomePage
@description Renders the WordPress Studio landing page sections at the root route.
@notes Keeps homepage ordering local to the home route while App.vue owns the global shell.
-->
<script setup>
import HomeDownload from '../components/HomeDownload.vue';
import HomeHero from '../components/HomeHero.vue';
import HomeInterfaces from '../components/HomeInterfaces.vue';
import HomeStudioCode from '../components/HomeStudioCode.vue';
import HomeWorkflow from '../components/HomeWorkflow.vue';
</script>

<template>
  <main id="main" class="page-home vstack">
    <HomeHero />
    <HomeWorkflow />
    <HomeInterfaces />
    <HomeStudioCode />
    <HomeDownload />
  </main>
</template>

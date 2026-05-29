<!--
@component App
@description Composes the WordPress Studio shared page shell, route outlet, footer, and optional dev-only Agentation overlay.
@notes Keeps global layout centralized so routed pages can stay focused on page content.
-->
<script setup>
import { defineAsyncComponent } from 'vue';
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';

const AgentationOverlay =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_AGENTATION === 'true'
    ? defineAsyncComponent(() => import('./components/AgentationOverlay.vue'))
    : null;
</script>

<template>
  <div class="wp-studio vstack">
    <SiteHeader />

    <RouterView />

    <footer class="site-footer p-l">
      <p>An Automattic product</p>
    </footer>

    <component :is="AgentationOverlay" v-if="AgentationOverlay" />
  </div>
</template>

<style scoped>
.site-footer {
  text-align: center;
}
</style>

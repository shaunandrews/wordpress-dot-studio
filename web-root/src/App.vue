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

    <footer class="site-footer">
      <div class="site-footer-inner">
        <p>
          An
          <a href="https://automattic.com/" target="_blank" rel="noopener noreferrer">
            Automattic
          </a>
          product
        </p>

        <nav class="site-footer-links" aria-label="Footer">
          <a href="https://automattic.com/work-with-us/" target="_blank" rel="noopener noreferrer">
            Work with us
          </a>
          <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
          <a href="https://wordpress.com/tos/" target="_blank" rel="noopener noreferrer">
            Terms
          </a>
        </nav>
      </div>
    </footer>

    <component :is="AgentationOverlay" v-if="AgentationOverlay" />
  </div>
</template>

<style scoped>
.site-footer {
  padding: var(--space-xl) var(--section-inline, var(--space-xl));
}

.site-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, var(--content-max-width, 1440px));
  margin: 0 auto;
  gap: var(--space-l);
  color: var(--color-chrome-fg-muted);
  font-size: var(--font-size-s);
  line-height: var(--line-height-normal);
}

.site-footer p {
  margin: 0;
}

.site-footer a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-m) var(--space-l);
}

@media (max-width: 760px) {
  .site-footer {
    padding-inline: var(--space-l);
  }

  .site-footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer-links {
    justify-content: flex-start;
  }
}
</style>

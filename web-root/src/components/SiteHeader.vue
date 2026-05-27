<!--
@component SiteHeader
@description Renders the fixed global header with brand, primary navigation, actions, and progressive blur backing.
@notes Publishes --site-header-height so downstream sections can offset fixed-header overlap.
-->
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Button from './Button.vue';
import InlineSvg from './InlineSvg.vue';
import ProgressiveBlur from './ProgressiveBlur.vue';

const navItems = [
  { label: 'Desktop', href: '/app' },
  { label: 'CLI', href: '/cli' },
  { label: 'Web', href: '/web' },
  { label: 'Docs', href: '/docs' },
];

const header = ref(null);
let headerObserver;

function updateHeaderHeight() {
  if (!header.value) return;
  document.documentElement.style.setProperty('--site-header-height', `${header.value.offsetHeight}px`);
}

onMounted(() => {
  updateHeaderHeight();

  if (header.value) {
    headerObserver = new ResizeObserver(updateHeaderHeight);
    headerObserver.observe(header.value);
  }
});

onBeforeUnmount(() => {
  headerObserver?.disconnect();
  document.documentElement.style.removeProperty('--site-header-height');
});
</script>

<template>
  <header ref="header" class="site-header hstack gap-xl w-full align-center justify-between p-l">
    <ProgressiveBlur
      direction="top"
      :strength="8"
      :layers="8"
      :extent="0.75"
      tint="var(--site-header-blur-tint)"
    />

    <div class="site-header-start hstack gap-m align-center">
      <InlineSvg src="/assets/studio-icon.svg" label="WordPress Studio Icon" preserve-white />
      <a class="brand type-heading type-m" href="/" aria-label="WordPress Studio home">WordPress Studio</a>
    </div>

    <div class="site-header-center">
      <nav class="site-nav hstack gap-m" aria-label="Primary navigation">
        <a
          v-for="item in navItems"
          :key="item.href"
          class="type-label type-s"
          :href="item.href"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>

    <div class="site-header-end hstack gap-m">
      <Button>Log in</Button>
      <Button variant="primary" href="/download">Download</Button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  --site-header-blur-tint: rgb(255 255 255 / 0.16);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.site-header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.site-header-start,
.site-header-end {
  position: relative;
  z-index: 1;
}

.site-header-center {
  z-index: 1;
}

@media (prefers-color-scheme: dark) {
  .site-header {
    --site-header-blur-tint: rgb(0 0 0 / 0.18);
  }
}
</style>

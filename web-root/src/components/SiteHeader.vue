<!--
@component SiteHeader
@description Renders the fixed global header with brand, primary navigation, actions, and progressive blur backing.
@notes Publishes --site-header-height so downstream sections can offset fixed-header overlap.
-->
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Button from './Button.vue';
import InlineSvg from './InlineSvg.vue';
import ProgressiveBlur from './ProgressiveBlur.vue';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Desktop', href: '/desktop' },
  { label: 'CLI', href: '/cli' },
  { label: 'Web', href: '/web' },
  { label: 'Docs', href: '/docs' },
];

const header = ref(null);
const siteNav = ref(null);
const isNavIndicatorReady = ref(false);
const route = useRoute();
let headerObserver;
let navObserver;
let frameRequest;

function updateHeaderHeight() {
  if (!header.value) return;
  document.documentElement.style.setProperty(
    '--site-header-height',
    `${header.value.offsetHeight}px`
  );
}

function updateNavIndicator() {
  cancelAnimationFrame(frameRequest);

  frameRequest = requestAnimationFrame(() => {
    const nav = siteNav.value;
    const activeLink = nav?.querySelector('.nav-link-active');

    if (!nav || !activeLink) {
      isNavIndicatorReady.value = false;
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();

    nav.style.setProperty('--active-nav-x', `${activeRect.left - navRect.left}px`);
    nav.style.setProperty('--active-nav-width', `${activeRect.width}px`);
    isNavIndicatorReady.value = true;
  });
}

onMounted(() => {
  updateHeaderHeight();
  updateNavIndicator();

  if (header.value) {
    headerObserver = new ResizeObserver(updateHeaderHeight);
    headerObserver.observe(header.value);
  }

  if (siteNav.value) {
    navObserver = new ResizeObserver(updateNavIndicator);
    navObserver.observe(siteNav.value);
  }

  window.addEventListener('resize', updateNavIndicator);
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    updateNavIndicator();
  }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(frameRequest);
  headerObserver?.disconnect();
  navObserver?.disconnect();
  window.removeEventListener('resize', updateNavIndicator);
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
      <RouterLink class="brand type-heading type-m" to="/" aria-label="WordPress Studio home"
        >WordPress Studio</RouterLink
      >
    </div>

    <div class="site-header-center">
      <nav
        ref="siteNav"
        class="site-nav hstack gap-s"
        :class="{ 'site-nav-indicator-ready': isNavIndicatorReady }"
        aria-label="Primary navigation"
      >
        <span class="site-nav-indicator" aria-hidden="true"></span>
        <RouterLink
          v-for="item in navItems"
          :key="item.href"
          class="nav-link"
          :to="item.href"
          exact-active-class="nav-link-active"
        >
          {{ item.label }}
        </RouterLink>
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
  z-index: 1;
}

.site-header-start,
.site-header-end {
  position: relative;
  z-index: 1;
}

.site-nav {
  --active-nav-width: 0px;
  --active-nav-x: 0px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  /* border-top: 1px solid rgba(255,255,255,1); */
  /* border-bottom: 1px solid rgba(0,0,0,0.15); */
  box-shadow:
    0 2px 0.5px rgba(255, 255, 255, 0.8) inset,
    0 1px 3px rgba(0, 0, 0, 0.25);
  padding: 4px;
  border-radius: 10px;
  position: relative;
}

.site-nav-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  width: var(--active-nav-width);
  border-radius: 6px;
  background: var(--color-chrome-fg);
  opacity: 0;
  transform: translateX(var(--active-nav-x));
  transition:
    opacity 120ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    width 220ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 0;
}

.site-nav-indicator-ready .site-nav-indicator {
  opacity: 1;
}

.site-nav .nav-link {
  position: relative;
  z-index: 1;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  padding: var(--space-m) var(--space-l);
  color: var(--color-chrome-fg-muted);
  border-radius: 4px;
  transition:
    background-color 160ms ease,
    color 160ms ease;

  &:hover {
    color: var(--color-chrome-fg);
  }
}

.site-nav .nav-link-active {
  color: var(--color-chrome-fill);

  &:hover {
    color: var(--color-chrome-fill);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-nav-indicator {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .site-header {
    --site-header-blur-tint: rgb(0 0 0 / 0.18);
  }
}
</style>

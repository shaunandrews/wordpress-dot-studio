<!--
@component SiteHeader
@description Renders the fixed global header with brand, primary navigation, actions, and progressive blur backing.
@notes Publishes --site-header-height so downstream sections can offset fixed-header overlap.
-->
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Button from './Button.vue';
import InlineSvg from './InlineSvg.vue';
import ProgressiveBlur from './ProgressiveBlur.vue';
import studioIconUrl from '../../assets/studio-icon.svg?url';

const navItems = [
  { label: 'WordPress Studio', href: '/', isBrand: true },
  { label: 'Desktop', href: '/desktop' },
  { label: 'CLI', href: '/cli' },
  { label: 'Web', href: '/web' },
  { label: 'Docs', href: '/docs' },
];

const compactNavItems = [{ label: 'Home', href: '/' }, ...navItems.filter((item) => !item.isBrand)];

const header = ref(null);
const siteNav = ref(null);
const isNavIndicatorReady = ref(false);
const isCompactMenuOpen = ref(false);
const route = useRoute();
const activeNavHref = computed(() => {
  const activeItem = navItems.find((item) => item.href === route.path);
  return activeItem?.href || '';
});
const activeCompactLabel = computed(() => {
  if (route.path === '/download') {
    return 'Download';
  }

  const activeItem = compactNavItems.find((item) => item.href === route.path);
  return activeItem?.label || 'Home';
});
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
    const activeLink = Array.from(nav?.querySelectorAll('.nav-link') || []).find(
      (link) => link.dataset.navHref === activeNavHref.value
    );

    if (!nav || !activeLink || !activeNavHref.value) {
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

function closeCompactMenu() {
  isCompactMenuOpen.value = false;
}

function toggleCompactMenu() {
  isCompactMenuOpen.value = !isCompactMenuOpen.value;
}

function closeCompactMenuOnOutsideClick(event) {
  if (!isCompactMenuOpen.value || header.value?.contains(event.target)) {
    return;
  }

  closeCompactMenu();
}

function closeCompactMenuOnEscape(event) {
  if (event.key === 'Escape') {
    closeCompactMenu();
  }
}

onMounted(() => {
  updateHeaderHeight();
  nextTick(updateNavIndicator);

  if (header.value) {
    headerObserver = new ResizeObserver(updateHeaderHeight);
    headerObserver.observe(header.value);
  }

  if (siteNav.value) {
    navObserver = new ResizeObserver(updateNavIndicator);
    navObserver.observe(siteNav.value);
  }

  window.addEventListener('resize', updateNavIndicator);
  document.addEventListener('pointerdown', closeCompactMenuOnOutsideClick);
  document.addEventListener('keydown', closeCompactMenuOnEscape);
});

watch(
  activeNavHref,
  async () => {
    closeCompactMenu();
    await nextTick();
    updateNavIndicator();
  },
  { flush: 'post', immediate: true }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(frameRequest);
  headerObserver?.disconnect();
  navObserver?.disconnect();
  window.removeEventListener('resize', updateNavIndicator);
  document.removeEventListener('pointerdown', closeCompactMenuOnOutsideClick);
  document.removeEventListener('keydown', closeCompactMenuOnEscape);
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
      <RouterLink class="compact-brand" to="/" aria-label="WordPress Studio home">
        <span class="nav-brand-mark" aria-hidden="true">
          <InlineSvg :src="studioIconUrl" label="" preserve-white />
        </span>
        <span class="nav-brand-text type-heading type-s">WordPress Studio</span>
      </RouterLink>

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
          :class="{ 'nav-link-active': item.href === activeNavHref }"
          :data-nav-href="item.href"
          :to="item.href"
          :aria-label="item.isBrand ? 'WordPress Studio home' : undefined"
          exact-active-class="nav-link-active"
        >
          <template v-if="item.isBrand">
            <span class="nav-brand-mark" aria-hidden="true">
              <InlineSvg :src="studioIconUrl" label="" preserve-white />
            </span>
            <span class="nav-brand-text type-heading type-s">{{ item.label }}</span>
          </template>
          <template v-else>{{ item.label }}</template>
        </RouterLink>
      </nav>
    </div>

    <div class="compact-nav" :class="{ 'compact-nav-open': isCompactMenuOpen }">
      <button
        class="compact-nav-toggle"
        type="button"
        :aria-expanded="isCompactMenuOpen ? 'true' : 'false'"
        aria-controls="compact-nav-menu"
        @click="toggleCompactMenu"
      >
        <span>{{ activeCompactLabel }}</span>
        <svg class="compact-nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4.2 6.2 8 10l3.8-3.8" />
        </svg>
      </button>

      <div v-if="isCompactMenuOpen" id="compact-nav-menu" class="compact-nav-menu">
        <nav class="compact-nav-list" aria-label="Primary navigation">
          <RouterLink
            v-for="item in compactNavItems"
            :key="item.href"
            class="compact-nav-link"
            :class="{ 'compact-nav-link-active': item.href === activeNavHref }"
            :to="item.href"
            exact-active-class="compact-nav-link-active"
            @click="closeCompactMenu"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="compact-nav-actions">
          <Button @click="closeCompactMenu">Log in</Button>
          <Button variant="primary" href="/download" @click="closeCompactMenu">Download</Button>
        </div>
      </div>
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

.site-header-start,
.site-header-end {
  position: relative;
  z-index: 1;
}

.site-nav {
  --active-nav-width: 0px;
  --active-nav-x: 0px;
  --nav-brand-mark-size: 32px;
  align-items: center;
  background: var(--color-chrome-fill-transparent);
  backdrop-filter: blur(4px);
  box-shadow:
    0 2px 0.5px var(--color-chrome-fill-transparent) inset,
    0 1px 3px var(--color-nav-shadow);
  padding: 4px;
  border-radius: 10px;
  position: relative;
}

.compact-brand,
.compact-nav {
  display: none;
}

.site-nav-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  width: var(--active-nav-width);
  height: var(--nav-brand-mark-size);
  border-radius: 6px;
  background: var(--color-nav-indicator-fill);
  opacity: 0;
  transform: translate(var(--active-nav-x), -50%);
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
  display: inline-flex;
  align-items: center;
  gap: var(--space-s);
  height: var(--nav-brand-mark-size);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  padding: 0 var(--space-l);
  color: var(--color-chrome-fg-muted);
  border-radius: 4px;
  transition:
    background-color 160ms ease,
    color 160ms ease;

  &:hover {
    color: var(--color-chrome-fg);
  }
}

.site-nav .nav-link:first-of-type {
  padding-left: 0;
}

.nav-brand-mark {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: var(--nav-brand-mark-size, 32px);
  aspect-ratio: 1;
}

.nav-brand-mark :deep(.inline-svg),
.nav-brand-mark :deep(.inline-svg svg) {
  width: 100%;
  height: 100%;
}

.nav-brand-text {
  color: currentColor;
  white-space: nowrap;
}

.site-nav .nav-link-active {
  color: var(--color-nav-indicator-fg);

  &:hover {
    color: var(--color-nav-indicator-fg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-nav-indicator {
    transition: none;
  }
}

@media (max-width: 760px) {
  .site-header {
    gap: var(--space-m);
    padding: var(--space-m);
  }

  .site-header-start {
    min-width: 0;
  }

  .site-nav,
  .site-header-end {
    display: none;
  }

  .compact-brand {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    gap: var(--space-s);
    color: var(--color-chrome-fg);
    text-decoration: none;
  }

  .compact-brand .nav-brand-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compact-nav {
    position: relative;
    z-index: 2;
    display: block;
    flex: 0 0 auto;
  }

  .compact-nav-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-m);
    min-width: 8.5rem;
    max-width: 42vw;
    height: 44px;
    justify-content: space-between;
    padding: 0 var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-chrome-border) 80%, transparent);
    border-radius: 10px;
    color: var(--color-chrome-fg);
    background: var(--color-chrome-fill-transparent);
    backdrop-filter: blur(4px);
    box-shadow:
      0 2px 0.5px var(--color-chrome-fill-transparent) inset,
      0 1px 3px var(--color-nav-shadow);
    font: inherit;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
  }

  .compact-nav-toggle span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-nav-chevron {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 160ms ease;
  }

  .compact-nav-open .compact-nav-chevron {
    transform: rotate(180deg);
  }

  .compact-nav-menu {
    position: absolute;
    top: calc(100% + var(--space-m));
    right: 0;
    width: min(88vw, 22rem);
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-chrome-border) 78%, transparent);
    border-radius: 10px;
    background: var(--color-chrome-fill-transparent);
    backdrop-filter: blur(10px);
    box-shadow:
      0 2px 0.5px var(--color-chrome-fill-transparent) inset,
      0 18px 44px var(--color-nav-shadow);
  }

  .compact-nav-list {
    display: grid;
    gap: var(--space-s);
  }

  .compact-nav-link {
    display: flex;
    min-height: 44px;
    align-items: center;
    padding: 0 var(--space-m);
    border-radius: 6px;
    color: var(--color-chrome-fg-muted);
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-snug);
    text-decoration: none;
  }

  .compact-nav-link:hover,
  .compact-nav-link:focus-visible {
    color: var(--color-chrome-fg);
  }

  .compact-nav-link-active {
    color: var(--color-nav-indicator-fg);
    background: var(--color-nav-indicator-fill);
  }

  .compact-nav-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-m);
    margin-top: var(--space-l);
    padding-top: var(--space-l);
    border-top: 1px solid color-mix(in srgb, var(--color-chrome-border) 72%, transparent);
  }

  .compact-nav-actions :deep(.button) {
    width: 100%;
  }
}

@media (prefers-color-scheme: dark) {
  .site-header {
    --site-header-blur-tint: rgb(0 0 0 / 0.18);
  }
}
</style>

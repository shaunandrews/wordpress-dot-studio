<!--
@component DesktopPage
@description Renders the first-draft product page for WordPress Studio desktop.
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Button from '../components/Button.vue';
import HeroVfxImage from '../components/HeroVfxImage.vue';
import HeroSurfaceShape from '../components/HeroSurfaceShape.vue';
import { paintingOptions } from '../components/homeHeroData.js';

const platforms = ['macOS', 'Windows', 'Linux'];

// Cycle the hero painting like the home hero so the digital effect keeps moving.
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

const workflow = [
  {
    title: 'Start locally',
    body: 'Create a full WordPress site on your machine in a few minutes, with the runtime handled for you.',
  },
  {
    title: 'Sync from anywhere',
    body: 'Pull an existing WordPress site into Studio so you can inspect, edit, and test it locally.',
  },
  {
    title: 'Publish when ready',
    body: 'Move local work to WordPress.com or Pressable when it is time to share, review, or launch.',
  },
];

const features = [
  {
    title: 'No dependency setup',
    body: 'Studio gives you a working local WordPress environment without installing PHP, configuring a database, or learning server tooling first.',
  },
  {
    title: 'Real sites on your machine',
    body: 'Your local site behaves like WordPress because it is WordPress, running privately on your computer while you build.',
  },
  {
    title: 'Bring production closer',
    body: 'Sync sites down, make changes in a local workspace, then publish back to hosted WordPress when the work is ready.',
  },
];

const upcoming = [
  {
    title: 'Agentic workflow',
    body: 'A new assistant-led interface for planning, editing, and shipping WordPress work inside Studio.',
  },
  {
    title: 'Desks',
    body: 'A more visual way to organize, group, and manage the local sites you are actively working on.',
  },
];
</script>

<template>
  <main id="main" class="desktop-page vstack">
    <section class="desktop-hero">
      <div class="desktop-hero-art" aria-hidden="true">
        <HeroVfxImage
          :src="selectedPainting.src"
          :sources="paintingSources"
          class="desktop-hero-vfx"
          render-mode="local-pixel"
        />
      </div>

      <HeroSurfaceShape />

      <div class="desktop-hero-copy vstack gap-l align-center">
        <h1 class="type-display type-xxxxl">Run WordPress locally in minutes</h1>
        <p class="type-body type-l">
          Studio Desktop gives you a full WordPress site on your machine without dependency setup,
          server configuration, or technical overhead.
        </p>
        <div class="desktop-actions hstack gap-m">
          <Button variant="primary" href="/download">Download Studio</Button>
          <Button href="#sync">Sync an existing site</Button>
        </div>
        <div class="platform-list hstack gap-s" aria-label="Supported desktop platforms">
          <span v-for="platform in platforms" :key="platform">{{ platform }}</span>
        </div>
      </div>
    </section>

    <section class="desktop-workflow px-xxxl">
      <div class="section-heading vstack gap-m">
        <p class="type-label type-s">Workflow</p>
        <h2 class="type-heading type-xxxl">From local idea to hosted site</h2>
      </div>

      <div class="workflow-steps">
        <article v-for="(step, index) in workflow" :key="step.title" class="workflow-step vstack gap-m">
          <span class="step-number type-label type-s">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="type-heading type-xl">{{ step.title }}</h3>
          <p class="type-body type-m">{{ step.body }}</p>
        </article>
      </div>
    </section>

    <section id="sync" class="desktop-detail hstack gap-xxl px-xxxl">
      <div class="detail-copy vstack gap-m">
        <p class="type-label type-s">Local WordPress</p>
        <h2 class="type-heading type-xxxl">A complete site, not a setup project</h2>
        <p class="type-body type-l">
          Studio is designed for people who want to build with WordPress, not spend the first hour
          managing dependencies. Create a local site, open WP Admin, edit files, test changes, and
          keep moving.
        </p>
      </div>

      <div class="feature-list vstack">
        <article v-for="feature in features" :key="feature.title" class="feature-row">
          <h3 class="type-heading type-l">{{ feature.title }}</h3>
          <p class="type-body type-m">{{ feature.body }}</p>
        </article>
      </div>
    </section>

    <section class="publishing-band hstack align-center justify-between gap-xl px-xxxl">
      <div class="vstack gap-m">
        <p class="type-label type-s">Publishing</p>
        <h2 class="type-heading type-xxl">Push local work to WordPress.com or Pressable</h2>
      </div>
      <p class="type-body type-l">
        Build and review locally, then publish to trusted WordPress hosting when the site is ready for
        collaborators, clients, or the public.
      </p>
    </section>

    <section class="upcoming-section px-xxxl">
      <div class="section-heading vstack gap-m">
        <p class="type-label type-s">Coming next</p>
        <h2 class="type-heading type-xxxl">A more visual, agentic Studio</h2>
      </div>

      <div class="upcoming-grid">
        <article v-for="item in upcoming" :key="item.title" class="upcoming-item vstack gap-m">
          <h3 class="type-heading type-xl">{{ item.title }}</h3>
          <p class="type-body type-m">{{ item.body }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.desktop-page {
  --desktop-rule: color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  --desktop-muted-fill: color-mix(in srgb, var(--color-chrome-fill) 78%, var(--color-theme-fill) 6%);
  background:
    linear-gradient(180deg, transparent 0, color-mix(in srgb, var(--color-chrome-fill) 52%, transparent) 100%),
    var(--color-chrome-fill);
}

.desktop-page :is(.type-display, .type-heading) {
  letter-spacing: 0;
}

.desktop-hero {
  /* Fixed, not vh-scaled: the copy is bottom-anchored and the art/background
     boundary sits at 0.6x the shape height, mirroring the home hero surface. */
  --surface-shape-height: 500px;
  --surface-art-bottom: calc(var(--surface-shape-height) * 0.6);
  position: relative;
  z-index: 1;
  isolation: isolate;
  display: grid;
  align-items: end;
  min-height: max(80dvh, 760px);
  padding: calc(var(--site-header-height, 72px) + clamp(68px, 8vw, 112px)) var(--space-xl)
    clamp(56px, 7vw, 96px);
  overflow-x: clip;
  overflow-y: visible;
  text-align: center;
  border-bottom: 1px solid var(--desktop-rule);
}

.desktop-hero-art {
  position: absolute;
  inset: 0 0 var(--surface-art-bottom);
  z-index: 0;
  contain: paint;
  isolation: isolate;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-chrome-fill) 55%, canvas 45%);
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--color-chrome-border) 62%, transparent);
}

.desktop-hero-art :deep(.hero-vfx-image) {
  inset: 0;
}

.desktop-hero-vfx :deep(.hero-vfx-image-effect-source) {
  opacity: calc(var(--vfx-lens-opacity) * 0.96) !important;
  filter: saturate(1.2) contrast(1.16) brightness(1.02);
  mix-blend-mode: normal;
}

.desktop-hero-copy {
  position: relative;
  z-index: 3;
  justify-self: center;
  width: min(100%, 900px);
  margin: 0 auto;
  color: var(--color-chrome-fg);
  /* Fixed downward nudge keeps the copy sitting in the background band below
     the painting, matching the home hero. */
  transform: translateY(92px);
}

.desktop-hero-copy h1 {
  max-width: 760px;
  margin: 0 auto;
  text-wrap: balance;
}

.desktop-hero-copy p {
  max-width: 780px;
  margin: 0 auto;
  text-wrap: pretty;
}

.desktop-hero-copy .type-body,
.section-heading + .workflow-steps p,
.detail-copy .type-body,
.feature-row p,
.publishing-band > p,
.upcoming-item p {
  color: var(--color-chrome-fg-muted);
}

.desktop-actions {
  flex-wrap: wrap;
}

.platform-list {
  flex-wrap: wrap;
}

.platform-list span {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: var(--space-s) var(--space-m);
  border: 1px solid var(--desktop-rule);
  border-radius: 6px;
  color: var(--color-chrome-fg-muted);
  background: var(--desktop-muted-fill);
  font-size: var(--font-size-s);
}

.desktop-workflow,
.desktop-detail,
.upcoming-section {
  padding-top: var(--space-xxxl);
  padding-bottom: var(--space-xxxl);
  border-bottom: 1px solid var(--desktop-rule);
}

.section-heading {
  max-width: var(--line-length-m);
  margin-bottom: var(--space-xxl);
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-l);
}

.workflow-step {
  min-height: 260px;
  padding: var(--space-xl);
  border: 1px solid var(--desktop-rule);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
}

.step-number {
  color: var(--color-theme-fill);
}

.desktop-detail {
  align-items: flex-start;
}

.detail-copy {
  flex: 0 0 min(38vw, 520px);
  position: sticky;
  top: calc(var(--site-header-height, 72px) + var(--space-xl));
}

.feature-list {
  flex: 1 1 auto;
  border-top: 1px solid var(--desktop-rule);
}

.feature-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.6fr) minmax(0, 1fr);
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--desktop-rule);
}

.publishing-band {
  padding-top: var(--space-xxl);
  padding-bottom: var(--space-xxl);
  border-bottom: 1px solid var(--desktop-rule);
  background: color-mix(in srgb, var(--color-theme-fill) 7%, transparent);
}

.publishing-band > p {
  max-width: var(--line-length-s);
}

.upcoming-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);
}

.upcoming-item {
  min-height: 220px;
  padding: var(--space-xl);
  border: 1px solid var(--desktop-rule);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-theme-fill) 5%, transparent);
}

@media (max-width: 1120px) {
  .desktop-detail,
  .publishing-band {
    flex-direction: column;
    align-items: stretch;
  }

  .detail-copy {
    flex-basis: auto;
    max-width: var(--line-length-m);
    position: static;
  }

  .desktop-workflow,
  .desktop-detail,
  .upcoming-section,
  .publishing-band {
    padding-inline: var(--space-xl);
  }

  .workflow-steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .desktop-hero,
  .desktop-workflow,
  .desktop-detail,
  .upcoming-section,
  .publishing-band {
    padding-inline: var(--space-l);
  }

  .desktop-hero {
    --surface-shape-height: 360px;
    min-height: max(78dvh, 600px);
  }

  .desktop-hero-copy {
    transform: translateY(56px);
  }

  .desktop-hero-copy h1 {
    font-size: var(--font-size-xxxl);
    line-height: var(--line-height-tight);
  }

  .desktop-hero-copy p {
    font-size: var(--font-size-l);
  }

  .desktop-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .desktop-actions :deep(.button) {
    width: 100%;
  }

  .feature-row,
  .upcoming-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .desktop-hero-copy h1 {
    font-size: 36px;
  }

  .desktop-hero-copy p {
    font-size: var(--font-size-m);
    line-height: var(--line-height-relaxed);
  }
}
</style>

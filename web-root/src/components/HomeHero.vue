<!--
@component HomeHero
@description Renders the landing page hero with an interactive wall of WordPress development solutions.
@notes Consumes the site header height custom property so hero spacing accounts for the fixed header.
-->
<script setup>
import { computed, ref } from 'vue';
import Button from './Button.vue';
import DotGrid from './DotGrid.vue';
import InlineSvg from './InlineSvg.vue';
import studioIconUrl from '../../assets/studio-icon.svg?url';

const solutionTitles = [
  'Work on any site locally',
  'Build a custom block',
  'Create a block theme',
  'Update a page template',
  'Debug a plugin issue',
  'Send a client preview',
  'Sync changes back',
  'Hand off work to an agent',
  'Run WP-CLI commands',
  'Inspect the database',
  'Test a PHP upgrade',
  'Clone a client site',
  'Ship a theme change',
  'Review mobile layouts',
  'Generate demo content',
  'Create a plugin scaffold',
  'Patch a production bug',
  'Open the site in Cursor',
  'Automate a release check',
  'Try a new pattern library',
  'Compare before and after',
  'Share work with QA',
  'Rebuild a template part',
  'Import a backup',
  'Export a local archive',
  'Start from a Blueprint',
  'Tune performance',
  'Capture a screenshot',
  'Validate block markup',
  'Publish when approved',
  'Keep a session running',
  'Document the setup',
  'Review agent changes',
  'Open phpMyAdmin',
  'Switch WordPress versions',
  'Start fresh in minutes',
];

const cards = computed(() => solutionTitles.map((title, index) => ({
  id: `${index}-${title}`,
  title,
  lane: index % 4,
})));

const heroStyle = ref({
  '--tilt-x': '0deg',
  '--tilt-y': '0deg',
  '--pointer-x': '0px',
  '--pointer-y': '0px',
});

function updatePointer(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) - 0.5;
  const y = ((event.clientY - bounds.top) / bounds.height) - 0.5;

  heroStyle.value = {
    '--tilt-x': `${y * -7}deg`,
    '--tilt-y': `${x * 9}deg`,
    '--pointer-x': `${x * 26}px`,
    '--pointer-y': `${y * 18}px`,
  };
}

function resetPointer() {
  heroStyle.value = {
    '--tilt-x': '0deg',
    '--tilt-y': '0deg',
    '--pointer-x': '0px',
    '--pointer-y': '0px',
  };
}
</script>

<template>
  <DotGrid
    as="section"
    class="home-hero vstack gap-xl w-full align-center justify-center p-xl"
    :style="heroStyle"
    aria-label="WordPress Studio overview"
    @pointermove="updatePointer"
    @pointerleave="resetPointer"
  >
    <div class="solution-wall" aria-label="WordPress development jobs Studio helps with">
      <div class="studio-mark">
        <InlineSvg :src="studioIconUrl" label="WordPress Studio" preserve-white />
      </div>

      <div class="wall-plane">
        <div class="wall-track">
          <article
            v-for="card in cards"
            :key="card.id"
            class="solution-card"
            :class="`lane-${card.lane}`"
          >
            {{ card.title }}
          </article>
        </div>
      </div>
    </div>

    <div class="home-hero-message vstack gap-l align-center">
      <h1 class="type-display type-xxxxl">One place for the work around WordPress</h1>
      <p class="type-body type-l">
        Spin up local sites, share previews, sync hosted work, automate the boring parts, and hand
        bigger tasks to agents without rebuilding your workflow every time.
      </p>
      <div class="home-hero-actions hstack gap-m">
        <Button variant="primary" href="/download">Download for macOS</Button>
        <code>npm install -g wp-studio@latest</code>
      </div>
    </div>
  </DotGrid>
</template>

<style scoped>
.home-hero {
  padding-top: calc(var(--site-header-height, 0px) + var(--space-l));
  min-height: 78dvh;
  border-bottom: 1px solid var(--color-chrome-border);
  text-align: center;
}

.home-hero-message {
  position: relative;
  z-index: 2;
  max-width: 820px;

  p {
    color: var(--color-chrome-fg-muted);
  }
}

.home-hero-actions {
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.home-hero-actions code {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  color: var(--color-chrome-fg-muted);
  font-size: var(--font-size-s);
}

.solution-wall {
  --hero-rule: color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  --hero-paper: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 1060px);
  height: clamp(280px, 30vw, 390px);
  margin-top: var(--space-xl);
  perspective: 1200px;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
}

.studio-mark {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 112px;
  aspect-ratio: 1;
  filter: drop-shadow(0 20px 34px rgb(0 0 0 / 0.16));
  transform:
    translate(var(--pointer-x), var(--pointer-y))
    rotate(-4deg);
}

.studio-mark :deep(.inline-svg) {
  width: 112px;
  height: 112px;
}

.studio-mark :deep(.inline-svg svg) {
  width: 100%;
  height: 100%;
}

.wall-plane {
  position: absolute;
  inset: var(--space-xl) 0;
  transform:
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  transition: transform 140ms ease-out;
}

.wall-track {
  display: grid;
  grid-template-columns: repeat(9, minmax(180px, 1fr));
  grid-auto-rows: 72px;
  gap: var(--space-l);
  width: 1720px;
  transform: translateX(-80px);
  animation: wall-drift 34s linear infinite;
}

.solution-card {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: var(--space-m) var(--space-l);
  border: 1px dashed var(--hero-rule);
  border-radius: 8px;
  background: var(--hero-paper);
  color: var(--color-chrome-fg);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-align: left;
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.08);
  transform: translateZ(0);
}

.lane-0 {
  transform: translateY(0) translateZ(22px) rotate(-1deg);
}

.lane-1 {
  transform: translateY(18px) translateZ(10px) rotate(1deg);
}

.lane-2 {
  transform: translateY(-10px) translateZ(16px) rotate(-0.5deg);
}

.lane-3 {
  transform: translateY(10px) translateZ(4px) rotate(0.75deg);
}

@keyframes wall-drift {
  from {
    transform: translateX(-80px);
  }

  to {
    transform: translateX(-480px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wall-track {
    animation: none;
  }

  .wall-plane,
  .studio-mark {
    transition: none;
    transform: none;
  }
}

@media (max-width: 1120px) {
  .home-hero {
    padding-inline: var(--space-xl);
  }

  .wall-track {
    width: 1480px;
    grid-template-columns: repeat(9, minmax(150px, 1fr));
  }
}

@media (max-width: 760px) {
  .home-hero {
    padding-inline: var(--space-l);
  }

  .home-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .home-hero-actions :deep(.button) {
    width: 100%;
  }

  .home-hero-actions code {
    width: 100%;
    justify-content: center;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .solution-wall {
    height: 340px;
  }

  .studio-mark,
  .studio-mark :deep(.inline-svg) {
    width: 82px;
    height: 82px;
  }

  .wall-track {
    width: 1180px;
    grid-template-columns: repeat(9, minmax(120px, 1fr));
    grid-auto-rows: 68px;
  }
}
</style>

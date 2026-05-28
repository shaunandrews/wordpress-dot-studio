<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import HomeHeroActions from './HomeHeroActions.vue';
import HeroVfxImage from './HeroVfxImage.vue';
import InlineSvg from './InlineSvg.vue';
import { heroCopy, heroUseCases } from './homeHeroData.js';
import studioIconUrl from '../../assets/studio-icon.svg?url';

defineProps({
  painting: {
    type: Object,
    required: true,
  },
  paintingSources: {
    type: Array,
    required: true,
  },
});

const selectedUseCaseId = ref('');
const currentField = ref(null);
const currentPaused = ref(false);
let currentAnimationFrame = 0;
let currentLastTimestamp = 0;
let currentTime = 0;
let reducedMotionQuery;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const selectedUseCase = computed(
  () => heroUseCases.find((useCase) => useCase.id === selectedUseCaseId.value) ?? null
);

function getUseCaseStyle(useCase) {
  return { '--use-case-start': useCase.start };
}

function openUseCase(useCaseId) {
  selectedUseCaseId.value = useCaseId;
  currentPaused.value = true;
}

function closeUseCase() {
  selectedUseCaseId.value = '';
  currentPaused.value = false;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeUseCase();
  }
}

function setCurrentPaused(paused) {
  if (!selectedUseCase.value) {
    currentPaused.value = paused;
  }
}

function getCurrentMetrics() {
  const width = currentField.value?.offsetWidth ?? window.innerWidth;
  const height = currentField.value?.offsetHeight ?? 420;
  const mobile = window.innerWidth <= 760;
  const radiusX = mobile ? width * 0.27 : clamp(width * 0.18, 320, 430);
  const radiusY = mobile ? height * 0.52 : clamp(height * 0.44, 210, 255);

  return {
    width,
    height,
    centerX: width * 0.5,
    centerY: height * (mobile ? 0.66 : 0.64),
    radiusX,
    radiusY,
    crownSpreadX: mobile ? width * 0.035 : clamp(width * 0.018, 24, 38),
    crownSpreadY: mobile ? height * 0.09 : clamp(height * 0.06, 30, 42),
  };
}

function renderCurrentItems() {
  if (!currentField.value) return;

  const metrics = getCurrentMetrics();
  const nodes = [...currentField.value.querySelectorAll('.home-hero-use-case-drift')];

  nodes.forEach((node, index) => {
    const useCase = heroUseCases[index];
    const progress = (useCase.start + currentTime / useCase.duration) % 1;
    const angle = (150 + progress * 240) * (Math.PI / 180);
    const prominence = Math.sin(progress * Math.PI);
    const crownSpread = Math.max(0, (prominence - 0.66) / 0.34);
    const crownEase = crownSpread * crownSpread * (3 - 2 * crownSpread);
    const side = index % 2 === 0 ? -1 : 1;
    const x =
      metrics.centerX + Math.cos(angle) * metrics.radiusX + side * metrics.crownSpreadX * crownEase;
    const y =
      metrics.centerY +
      Math.sin(angle) * metrics.radiusY +
      useCase.crownLane * metrics.crownSpreadY * crownEase;
    const scale = 0.58 + prominence * 0.36;
    const tilt = useCase.tilt + Math.cos(angle) * 1.8;
    const shadow = 0.1 + prominence * 0.14;

    node.style.zIndex = String(Math.round(10 + prominence * 30));
    node.style.setProperty('--use-case-shadow-alpha', shadow.toFixed(3));
    node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(2)}deg)`;
  });
}

function tickCurrent(timestamp) {
  if (!currentLastTimestamp) {
    currentLastTimestamp = timestamp;
  }

  const delta = Math.min((timestamp - currentLastTimestamp) / 1000, 0.04);
  currentLastTimestamp = timestamp;

  if (!currentPaused.value) {
    currentTime += delta;
  }

  renderCurrentItems();
  currentAnimationFrame = window.requestAnimationFrame(tickCurrent);
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', renderCurrentItems);

  nextTick(() => {
    renderCurrentItems();

    if (!reducedMotionQuery.matches) {
      currentAnimationFrame = window.requestAnimationFrame(tickCurrent);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', renderCurrentItems);
  window.cancelAnimationFrame(currentAnimationFrame);
});
</script>

<template>
  <section class="home-hero-surface" aria-label="WordPress Studio overview">
    <div class="home-hero-surface-art" aria-hidden="true">
      <HeroVfxImage
        :src="painting.src"
        :sources="paintingSources"
        class="home-hero-surface-vfx"
        render-mode="local-pixel"
      />
    </div>

    <div class="home-hero-surface-shape" aria-hidden="true">
      <svg viewBox="0 0 1440 520" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="surfaceChromeMist" x1="0" x2="0" y1="0" y2="1">
            <stop class="home-hero-surface-stop-mist-start" offset="0%" stop-color="currentColor" />
            <stop class="home-hero-surface-stop-mist-mid" offset="58%" stop-color="currentColor" />
            <stop class="home-hero-surface-stop-mist-end" offset="100%" stop-color="currentColor" />
          </linearGradient>
          <linearGradient id="surfaceChromeFeather" x1="0" x2="0" y1="0" y2="1">
            <stop
              class="home-hero-surface-stop-feather-start"
              offset="0%"
              stop-color="currentColor"
            />
            <stop
              class="home-hero-surface-stop-feather-mid"
              offset="46%"
              stop-color="currentColor"
            />
            <stop
              class="home-hero-surface-stop-feather-end"
              offset="100%"
              stop-color="currentColor"
            />
          </linearGradient>
        </defs>
        <path
          class="home-hero-surface-mist"
          d="M0 132 C170 108 344 104 512 126 C660 146 788 172 930 140 C1092 104 1266 110 1440 144 L1440 202 C1264 154 1084 138 922 172 C784 202 650 184 504 166 C332 144 164 166 0 198 Z"
        />
        <path
          class="home-hero-surface-mist home-hero-surface-mist-secondary"
          d="M0 154 C154 126 320 118 500 140 C650 158 778 186 920 154 C1080 118 1266 126 1440 166 L1440 216 C1262 166 1082 150 922 184 C784 214 650 196 504 178 C332 156 164 178 0 210 Z"
        />
        <path
          class="home-hero-surface-feather"
          d="M0 188 C164 160 332 144 504 166 C650 184 784 202 922 172 C1084 138 1264 154 1440 202 L1440 224 C1264 178 1084 162 922 196 C784 224 650 208 504 190 C332 170 164 190 0 222 Z"
        />
        <path
          class="home-hero-surface-feather home-hero-surface-feather-secondary"
          d="M0 202 C160 174 326 158 502 180 C650 198 784 216 922 188 C1086 154 1264 170 1440 216 L1440 236 C1262 190 1084 174 922 208 C784 236 650 220 504 202 C332 182 164 202 0 234 Z"
        />
        <path
          class="home-hero-surface-fill"
          d="M0 222 C164 190 332 170 504 190 C650 208 784 224 922 196 C1084 162 1264 178 1440 224 L1440 520 L0 520 Z"
        />
      </svg>
    </div>

    <div
      ref="currentField"
      class="home-hero-use-case-current"
      aria-label="Things WordPress Studio can help you with"
    >
      <div
        v-for="useCase in heroUseCases"
        :key="useCase.id"
        class="home-hero-use-case-drift"
        :style="getUseCaseStyle(useCase)"
      >
        <button
          class="home-hero-use-case"
          type="button"
          aria-haspopup="dialog"
          @blur="setCurrentPaused(false)"
          @click="openUseCase(useCase.id)"
          @focus="setCurrentPaused(true)"
          @pointerenter="setCurrentPaused(true)"
          @pointerleave="setCurrentPaused(false)"
        >
          <span>{{ useCase.label }}</span>
        </button>
      </div>
    </div>

    <div class="home-hero-surface-copy vstack gap-l align-center">
      <div class="home-hero-surface-mark-wrap">
        <div class="home-hero-surface-mark">
          <InlineSvg :src="studioIconUrl" label="WordPress Studio" preserve-white />
        </div>
      </div>

      <h1 class="type-display type-xxxxl">{{ heroCopy.title }}</h1>
      <p class="type-body type-l">{{ heroCopy.body }}</p>
      <HomeHeroActions :primary-label="heroCopy.primaryAction" :command="heroCopy.installCommand" />
    </div>

    <Teleport to="body">
      <div
        v-if="selectedUseCase"
        class="home-hero-use-case-modal"
        role="presentation"
        @click.self="closeUseCase"
      >
        <section
          class="home-hero-use-case-dialog vstack gap-l"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`${selectedUseCase.id}-title`"
        >
          <button
            class="home-hero-use-case-close"
            type="button"
            aria-label="Close use case details"
            @click="closeUseCase"
          >
            <span aria-hidden="true">x</span>
          </button>
          <div class="home-hero-use-case-dialog-copy vstack gap-m">
            <p class="home-hero-use-case-kicker type-body type-s">Studio can help you...</p>
            <h2 :id="`${selectedUseCase.id}-title`" class="type-heading type-xxl">
              {{ selectedUseCase.title }}
            </h2>
            <p class="type-body type-m">{{ selectedUseCase.body }}</p>
          </div>
        </section>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.home-hero-surface {
  --surface-shape-height: clamp(390px, 40vh, 500px);
  --surface-art-bottom: calc(var(--surface-shape-height) * 0.6);
  position: relative;
  z-index: 1;
  isolation: isolate;
  display: grid;
  align-items: end;
  min-height: 80dvh;
  padding: calc(var(--site-header-height, 0px) + clamp(68px, 8vw, 112px)) var(--space-xl)
    clamp(56px, 7vw, 96px);
  overflow: hidden;
  text-align: center;
  background: var(--color-chrome-fill);
}

.home-hero-surface::after {
  position: absolute;
  inset: auto 0 0;
  z-index: 1;
  height: 8px;
  background: var(--color-chrome-fill);
  content: '';
  pointer-events: none;
}

.home-hero-surface-art {
  position: absolute;
  inset: 0 0 var(--surface-art-bottom);
  z-index: 0;
  contain: paint;
  isolation: isolate;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-chrome-fill) 55%, canvas 45%);
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--color-chrome-border) 62%, transparent);
}

.home-hero-surface-art :deep(.hero-vfx-image) {
  inset: 0;
}

.home-hero-surface-vfx :deep(.hero-vfx-image-effect-source) {
  opacity: calc(var(--vfx-lens-opacity) * 0.96) !important;
  filter: saturate(1.2) contrast(1.16) brightness(1.02);
  mix-blend-mode: normal;
}

.home-hero-surface-shape {
  position: absolute;
  inset: auto 0 -2px;
  z-index: 2;
  height: calc(var(--surface-shape-height) + 2px);
  color: var(--color-chrome-fill);
  pointer-events: none;
}

.home-hero-surface-shape svg {
  display: block;
  width: 100%;
  height: 100%;
}

.home-hero-surface-mist {
  fill: url('#surfaceChromeMist');
  opacity: 0.78;
}

.home-hero-surface-feather {
  fill: url('#surfaceChromeFeather');
}

.home-hero-surface-mist-secondary {
  opacity: 0.42;
}

.home-hero-surface-feather-secondary {
  opacity: 0.34;
}

.home-hero-surface-stop-mist-start {
  stop-opacity: 0;
}

.home-hero-surface-stop-mist-mid {
  animation: surface-mist-mid-opacity 8.5s ease-in-out infinite alternate;
  stop-opacity: 0.16;
}

.home-hero-surface-stop-mist-end {
  animation: surface-mist-end-opacity 10s ease-in-out infinite alternate;
  stop-opacity: 0.42;
}

.home-hero-surface-stop-feather-start {
  animation: surface-feather-start-opacity 9s ease-in-out infinite alternate;
  stop-opacity: 0.18;
}

.home-hero-surface-stop-feather-mid {
  animation: surface-feather-mid-opacity 7.5s ease-in-out infinite alternate;
  stop-opacity: 0.72;
}

.home-hero-surface-stop-feather-end {
  stop-opacity: 1;
}

.home-hero-surface-fill {
  fill: currentColor;
}

@keyframes surface-mist-mid-opacity {
  from {
    stop-opacity: 0.08;
  }

  to {
    stop-opacity: 0.22;
  }
}

@keyframes surface-mist-end-opacity {
  from {
    stop-opacity: 0.34;
  }

  to {
    stop-opacity: 0.5;
  }
}

@keyframes surface-feather-start-opacity {
  from {
    stop-opacity: 0.1;
  }

  to {
    stop-opacity: 0.26;
  }
}

@keyframes surface-feather-mid-opacity {
  from {
    stop-opacity: 0.58;
  }

  to {
    stop-opacity: 0.84;
  }
}

.home-hero-surface-copy {
  position: relative;
  z-index: 3;
  justify-self: center;
  width: min(100%, 900px);
  margin-bottom: 0;
  color: var(--color-chrome-fg);
  transform: translateY(clamp(56px, 7.2vh, 92px));
}

.home-hero-surface-copy h1 {
  max-width: 760px;
  margin: 0 auto;
  text-wrap: balance;
}

.home-hero-surface-copy p {
  max-width: 780px;
  margin: 0 auto;
  color: var(--color-chrome-fg-muted);
  text-wrap: pretty;
}

.home-hero-surface-mark-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(88px, 10vw, 136px);
  aspect-ratio: 1;
}

.home-hero-surface-mark {
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border: 8px solid color-mix(in srgb, var(--color-chrome-fill) 50%, transparent);
  border-radius: 30px;
  filter: drop-shadow(0 24px 36px rgb(0 0 0 / 0.22));
}

.home-hero-surface-mark :deep(.inline-svg),
.home-hero-surface-mark :deep(.inline-svg svg) {
  width: 100%;
  height: 100%;
}

.home-hero-use-case-current {
  position: absolute;
  right: 0;
  bottom: clamp(84px, 11vh, 142px);
  left: 0;
  z-index: 1;
  height: clamp(380px, 40vw, 580px);
  overflow: visible;
  pointer-events: none;
}

.home-hero-use-case-drift {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
}

.home-hero-use-case {
  --use-case-shadow-alpha: 0.16;

  display: inline-flex;
  align-items: center;
  max-width: calc(100vw - var(--space-xl) * 2);
  min-height: 34px;
  padding: var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 80%, transparent);
  border-radius: 5px;
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
  box-shadow:
    0 14px 30px rgb(0 0 0 / var(--use-case-shadow-alpha)),
    inset 0 1px 0 rgb(255 255 255 / 0.72);
  cursor: pointer;
  font: inherit;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-align: left;
  white-space: nowrap;
  pointer-events: auto;
  transition:
    border-color 0.14s ease,
    color 0.14s ease,
    box-shadow 0.14s ease,
    transform 0.14s ease;
}

.home-hero-use-case:hover,
.home-hero-use-case:focus-visible {
  border-color: color-mix(in srgb, var(--color-theme-fill) 68%, var(--color-chrome-border));
  color: var(--color-theme-fill);
  box-shadow:
    0 16px 38px rgb(0 0 0 / 0.18),
    inset 0 1px 0 rgb(255 255 255 / 0.7);
  transform: translateY(-2px);
}

.home-hero-use-case:focus-visible {
  outline: 2px solid var(--color-theme-fill);
  outline-offset: 3px;
}

.home-hero-use-case-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--space-xl);
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(8px);
}

.home-hero-use-case-dialog {
  position: relative;
  width: min(100%, 520px);
  padding: var(--space-xl);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 78%, transparent);
  border-radius: 8px;
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
  box-shadow: 0 24px 72px rgb(0 0 0 / 0.28);
}

.home-hero-use-case-dialog h2,
.home-hero-use-case-dialog p {
  margin: 0;
}

.home-hero-use-case-dialog .type-body {
  color: var(--color-chrome-fg-muted);
}

.home-hero-use-case-kicker {
  color: var(--color-theme-fill);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.home-hero-use-case-close {
  position: absolute;
  top: var(--space-l);
  right: var(--space-l);
  display: grid;
  place-items: center;
  width: 32px;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 80%, transparent);
  border-radius: 50%;
  color: var(--color-chrome-fg-muted);
  background: color-mix(in srgb, var(--color-chrome-fill) 86%, canvas 14%);
  cursor: pointer;
  font: inherit;
  line-height: 1;
}

.home-hero-use-case-close:hover,
.home-hero-use-case-close:focus-visible {
  color: var(--color-chrome-fg);
  border-color: var(--color-theme-fill);
}

.home-hero-use-case-close:focus-visible {
  outline: 2px solid var(--color-theme-fill);
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .home-hero-surface {
    --surface-shape-height: clamp(360px, 56vh, 480px);
    min-height: 76dvh;
    padding-inline: var(--space-l);
    padding-bottom: clamp(64px, 20vw, 104px);
  }

  .home-hero-surface-shape {
    left: -28%;
    right: -28%;
    width: 156%;
  }

  .home-hero-surface-copy {
    gap: var(--space-m);
    transform: translateY(clamp(36px, 7vh, 60px));
  }

  .home-hero-surface-copy p {
    max-width: 620px;
  }

  .home-hero-use-case-current {
    right: -10%;
    bottom: clamp(70px, 17vh, 132px);
    left: -10%;
    height: clamp(330px, 86vw, 470px);
  }

  .home-hero-use-case {
    max-width: calc(100vw - var(--space-l) * 2);
    font-size: 12px;
  }

  .home-hero-use-case-modal {
    padding: var(--space-l);
  }

  .home-hero-use-case-dialog {
    padding: var(--space-xl) var(--space-l) var(--space-l);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-surface-stop-mist-mid,
  .home-hero-surface-stop-mist-end,
  .home-hero-surface-stop-feather-start,
  .home-hero-surface-stop-feather-mid {
    animation: none;
  }

  .home-hero-use-case-drift {
    will-change: auto;
  }
}
</style>

<!--
@component HeroVfxImage
@description Applies a drifting animated liquid pixel mask to the hero painting.
-->
<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { VFX } from '@vfx-js/core';
import { PixelateEffect } from '@vfx-js/effects';

const TRANSITION_DURATION = 1400;
const TRANSITION_SETTLE_DELAY = 90;
const INITIAL_PIXEL_SIZE = 5;
const PIXEL_SIZE_AMPLITUDE = 0.1;
const PIXEL_SIZE_CYCLE_MS = 10200;
const MAX_EFFECT_PIXEL_WIDTH = 1400;
const EFFECT_RENDER_SCALE = 0.55;
const LOCAL_PIXEL_RENDER_SCALE = 0.09;
const KEN_BURNS_CYCLE_MS = 23000;
const VFX_SETTINGS = {
  pixelSize: INITIAL_PIXEL_SIZE,
  pixelAmplitude: PIXEL_SIZE_AMPLITUDE,
  pixelCycleMs: PIXEL_SIZE_CYCLE_MS,
  targetXMin: 22,
  targetXMax: 78,
  targetYMin: 24,
  targetYMax: 96,
  blobSpeedMin: 8.5,
  blobSpeedMax: 12.5,
  targetHoldMinMs: 4200,
  targetHoldMaxMs: 7600,
  radiusScale: 168,
  wobbleScale: 226,
  breatheMs: 1150,
  driftMs: 3100,
  flowX: 8.8,
  flowY: 10.6,
  flowXMs: 2300,
  flowYMs: 3400,
  localMaskSpeed: 2.05,
  localMaskRadiusScale: 0.62,
  localMaskFlowScale: 1.42,
};

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  renderMode: {
    type: String,
    default: 'vfx',
    validator: (value) => ['vfx', 'local-pixel'].includes(value),
  },
  sources: {
    type: Array,
    default: () => [],
  },
});

const root = ref(null);
const effectSource = ref(null);
const currentSrc = ref(props.src);
const incomingSrc = ref(null);
const incomingKey = ref(0);
const pixelEffect = new PixelateEffect({ size: INITIAL_PIXEL_SIZE });
const sourceImages = new Map();
const sourceImagePromises = new Map();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let vfxInstance = null;
let animationFrame = 0;
let transitionTimer = 0;
let transitionFrame = 0;
let transitionToken = 0;
let cancelled = false;
let effectTransition = null;
let sourceNeedsUpdate = true;
let motionStart = 0;
let lastFrame = 0;
const liquidBlobs = [
  {
    id: 'a',
    x: 0.48,
    y: 0.48,
    targetX: 0.66,
    targetY: 0.38,
    speed: 0.042,
    radius: 276,
    wobble: 0.24,
    phase: 0,
    nextTargetAt: 0,
  },
  {
    id: 'b',
    x: 0.38,
    y: 0.58,
    targetX: 0.24,
    targetY: 0.36,
    speed: 0.048,
    radius: 218,
    wobble: 0.3,
    phase: 1.9,
    nextTargetAt: 0,
  },
  {
    id: 'c',
    x: 0.62,
    y: 0.42,
    targetX: 0.78,
    targetY: 0.62,
    speed: 0.036,
    radius: 242,
    wobble: 0.26,
    phase: 3.7,
    nextTargetAt: 0,
  },
];

function randomBetween(min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);

  return low + Math.random() * (high - low);
}

function chooseNextBlobTarget(blob, timestamp) {
  blob.targetX = randomBetween(VFX_SETTINGS.targetXMin / 100, VFX_SETTINGS.targetXMax / 100);
  blob.targetY = randomBetween(VFX_SETTINGS.targetYMin / 100, VFX_SETTINGS.targetYMax / 100);
  blob.speed = randomBetween(VFX_SETTINGS.blobSpeedMin / 100, VFX_SETTINGS.blobSpeedMax / 100);
  blob.nextTargetAt =
    timestamp + randomBetween(VFX_SETTINGS.targetHoldMinMs, VFX_SETTINGS.targetHoldMaxMs);
}

function updatePixelSize(timestamp) {
  const cycle = ((timestamp - motionStart) / VFX_SETTINGS.pixelCycleMs) * Math.PI * 2;
  const size = VFX_SETTINGS.pixelSize + Math.sin(cycle) * VFX_SETTINGS.pixelAmplitude;

  pixelEffect.setParams({ size: Number(size.toFixed(2)) });
}

function updateKenBurns(timestamp) {
  if (!root.value || !motionStart) {
    return;
  }

  const cycle = ((timestamp - motionStart) % KEN_BURNS_CYCLE_MS) / KEN_BURNS_CYCLE_MS;
  const progress = cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2;
  const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
  const scale = 1.04 + easedProgress * 0.08;
  const x = -1.2 + easedProgress * 2.6;
  const y = -0.6 + easedProgress * 1.4;

  root.value.style.setProperty(
    '--hero-ken-burns-transform',
    `scale(${scale.toFixed(4)}) translate3d(${x.toFixed(3)}%, ${y.toFixed(3)}%, 0)`
  );
}

function updateLiquidBlob(blob, timestamp, deltaSeconds, bounds) {
  if (!blob.nextTargetAt || timestamp >= blob.nextTargetAt) {
    chooseNextBlobTarget(blob, timestamp);
  }

  let dx = blob.targetX - blob.x;
  let dy = blob.targetY - blob.y;
  let distance = Math.hypot(dx, dy);

  if (distance < 0.05) {
    chooseNextBlobTarget(blob, timestamp);
    dx = blob.targetX - blob.x;
    dy = blob.targetY - blob.y;
    distance = Math.hypot(dx, dy);
  }

  if (distance > 0) {
    const step = Math.min(distance, blob.speed * deltaSeconds);
    const easing = Math.min(1, 0.42 + distance * 1.7);

    blob.x += (dx / distance) * step * easing;
    blob.y += (dy / distance) * step * easing;
  }

  const elapsed = timestamp - motionStart;
  const localMaskBoost = props.renderMode === 'local-pixel' ? VFX_SETTINGS.localMaskSpeed : 1;
  const localRadiusScale =
    props.renderMode === 'local-pixel' ? VFX_SETTINGS.localMaskRadiusScale : 1;
  const localFlowScale = props.renderMode === 'local-pixel' ? VFX_SETTINGS.localMaskFlowScale : 1;
  const radius = blob.radius * (VFX_SETTINGS.radiusScale / 100) * localRadiusScale;
  const wobble = blob.wobble * (VFX_SETTINGS.wobbleScale / 100);
  const breathe = Math.sin((elapsed / VFX_SETTINGS.breatheMs) * localMaskBoost + blob.phase);
  const drift = Math.cos((elapsed / VFX_SETTINGS.driftMs) * localMaskBoost + blob.phase * 1.3);
  const flowX =
    Math.sin((elapsed / VFX_SETTINGS.flowXMs) * localMaskBoost + blob.phase * 1.7) *
    bounds.width *
    (VFX_SETTINGS.flowX / 100) *
    localFlowScale;
  const flowY =
    Math.cos((elapsed / VFX_SETTINGS.flowYMs) * localMaskBoost + blob.phase * 1.1) *
    bounds.height *
    (VFX_SETTINGS.flowY / 100) *
    localFlowScale;
  const width = Math.round(radius * (1.12 + breathe * wobble));
  const height = Math.round(radius * (0.9 + drift * wobble * 0.84));

  root.value.style.setProperty(`--vfx-blob-${blob.id}-x`, `${bounds.width * blob.x + flowX}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-y`, `${bounds.height * blob.y + flowY}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-width`, `${width}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-height`, `${height}px`);
}

function updateLiquidMask(timestamp) {
  if (!root.value) {
    return;
  }

  const deltaSeconds = Math.min(0.064, (timestamp - lastFrame) / 1000);
  lastFrame = timestamp;

  const bounds = root.value.getBoundingClientRect();
  liquidBlobs.forEach((blob) => updateLiquidBlob(blob, timestamp, deltaSeconds, bounds));
  root.value.style.setProperty('--vfx-lens-opacity', '1');
}

function updatePixelLayer(timestamp) {
  if (props.renderMode === 'vfx') {
    updatePixelSize(timestamp);
  }

  if (renderEffectSource(timestamp)) {
    updateEffectTexture();
  }
}

function animateLens(timestamp) {
  if (!root.value || cancelled) {
    return;
  }

  if (prefersReducedMotion.matches) {
    return;
  }

  if (!motionStart) {
    motionStart = timestamp;
    lastFrame = timestamp;
    liquidBlobs.forEach((blob) => chooseNextBlobTarget(blob, timestamp));
  }

  updateKenBurns(timestamp);
  updateLiquidMask(timestamp);
  updatePixelLayer(timestamp);

  animationFrame = window.requestAnimationFrame(animateLens);
}

function completeTransition(nextSrc, token) {
  window.clearTimeout(transitionTimer);
  window.cancelAnimationFrame(transitionFrame);
  transitionTimer = window.setTimeout(() => {
    if (token !== transitionToken || cancelled) {
      return;
    }

    currentSrc.value = nextSrc;
    sourceNeedsUpdate = true;

    if (renderEffectSource()) {
      updateEffectTexture();
    }

    transitionFrame = window.requestAnimationFrame(() => {
      transitionFrame = window.requestAnimationFrame(() => {
        if (token !== transitionToken || cancelled) {
          return;
        }

        incomingSrc.value = null;
        effectTransition = null;
        sourceNeedsUpdate = true;

        if (renderEffectSource()) {
          updateEffectTexture();
        }
      });
    });
  }, TRANSITION_DURATION + TRANSITION_SETTLE_DELAY);
}

function preloadImage(src) {
  if (sourceImages.has(src)) {
    return Promise.resolve(sourceImages.get(src));
  }

  if (sourceImagePromises.has(src)) {
    return sourceImagePromises.get(src);
  }

  const loadPromise = new Promise((resolve) => {
    const nextImage = new Image();

    nextImage.decoding = 'async';
    nextImage.onload = async () => {
      if (nextImage.decode) {
        try {
          await nextImage.decode();
        } catch {
          // Keep the transition moving if the browser has already decoded it.
        }
      }

      sourceImages.set(src, nextImage);
      resolve(nextImage);
    };
    nextImage.onerror = () => resolve(null);
    nextImage.src = src;
  });

  sourceImagePromises.set(src, loadPromise);
  return loadPromise;
}

function warmImageCache() {
  const warm = () => {
    props.sources.forEach((source) => preloadImage(source));
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warm, { timeout: 1800 });
    return;
  }

  window.setTimeout(warm, 0);
}

function resizeEffectSource(timestamp = window.performance.now()) {
  if (!root.value || !effectSource.value) {
    return false;
  }

  const bounds = root.value.getBoundingClientRect();
  const renderScale =
    props.renderMode === 'local-pixel' ? LOCAL_PIXEL_RENDER_SCALE : EFFECT_RENDER_SCALE;
  const ratio = Math.min(
    window.devicePixelRatio || 1,
    MAX_EFFECT_PIXEL_WIDTH / Math.max(bounds.width, 1),
    renderScale
  );
  const width = Math.max(1, Math.round(bounds.width * ratio));
  const height = Math.max(1, Math.round(bounds.height * ratio));

  if (effectSource.value.width === width && effectSource.value.height === height) {
    return false;
  }

  effectSource.value.width = width;
  effectSource.value.height = height;
  sourceNeedsUpdate = true;
  return true;
}

function easeTransitionProgress(progress) {
  return 0.5 - Math.cos(progress * Math.PI) / 2;
}

function drawPainting(context, painting, alpha, clipProgress = 1) {
  if (!painting?.naturalWidth || !painting?.naturalHeight || !effectSource.value) {
    return;
  }

  const canvasWidth = effectSource.value.width;
  const canvasHeight = effectSource.value.height;
  const clippedWidth = canvasWidth * clipProgress;

  if (clippedWidth <= 0) {
    return;
  }

  const scale = Math.max(
    canvasWidth / painting.naturalWidth,
    canvasHeight / painting.naturalHeight
  );
  const width = painting.naturalWidth * scale;
  const height = painting.naturalHeight * scale;
  const x = (canvasWidth - width) * 0.5;
  const y = (canvasHeight - height) * 0.34;

  context.save();
  context.beginPath();
  context.rect(0, 0, clippedWidth, canvasHeight);
  context.clip();
  context.globalAlpha = alpha;
  context.drawImage(painting, x, y, width, height);
  context.restore();
}

function renderEffectSource(timestamp = window.performance.now()) {
  if (!effectSource.value) {
    return false;
  }

  const resized = resizeEffectSource(timestamp);
  const context = effectSource.value.getContext('2d');
  const currentImage = sourceImages.get(currentSrc.value);

  if (!context || !currentImage) {
    return false;
  }

  context.clearRect(0, 0, effectSource.value.width, effectSource.value.height);

  if (effectTransition) {
    const progress = Math.min(1, (timestamp - effectTransition.start) / TRANSITION_DURATION);
    const easedProgress = easeTransitionProgress(progress);

    drawPainting(context, effectTransition.fromImage, 1);
    drawPainting(context, effectTransition.toImage, easedProgress, easedProgress);
    return true;
  }

  drawPainting(context, currentImage, 1);

  if (sourceNeedsUpdate || resized) {
    sourceNeedsUpdate = false;
    return true;
  }

  return false;
}

function updateEffectTexture() {
  if (vfxInstance && effectSource.value) {
    vfxInstance.update(effectSource.value);
  }
}

async function applyEffect() {
  if (
    props.renderMode !== 'vfx' ||
    !root.value ||
    !effectSource.value ||
    vfxInstance ||
    cancelled
  ) {
    return;
  }

  renderEffectSource();

  vfxInstance = VFX.init({
    wrapper: root.value,
    zIndex: 3,
    scrollPadding: false,
  });

  if (!vfxInstance) {
    return;
  }

  await vfxInstance.add(effectSource.value, {
    overlay: true,
    effect: [pixelEffect],
  });
}

watch(
  () => props.src,
  async (nextSrc) => {
    window.clearTimeout(transitionTimer);
    incomingSrc.value = null;
    effectTransition = null;
    sourceNeedsUpdate = true;

    if (nextSrc === currentSrc.value) {
      transitionToken += 1;
      if (renderEffectSource()) {
        updateEffectTexture();
      }
      return;
    }

    const token = ++transitionToken;
    const fromImage = sourceImages.get(currentSrc.value) ?? (await preloadImage(currentSrc.value));
    const nextImage = await preloadImage(nextSrc);

    if (!nextImage || token !== transitionToken || cancelled || nextSrc === currentSrc.value) {
      return;
    }

    if (prefersReducedMotion.matches || !fromImage) {
      currentSrc.value = nextSrc;

      if (renderEffectSource()) {
        updateEffectTexture();
      }

      return;
    }

    incomingKey.value += 1;
    incomingSrc.value = nextSrc;
    effectTransition = {
      fromImage,
      toImage: nextImage,
      start: window.performance.now(),
    };
    sourceNeedsUpdate = true;
    completeTransition(nextSrc, token);
  }
);

onMounted(async () => {
  warmImageCache();

  const initialImage = await preloadImage(props.src);

  if (initialImage && !cancelled) {
    sourceNeedsUpdate = true;

    if (!prefersReducedMotion.matches) {
      animationFrame = window.requestAnimationFrame(animateLens);
      if (props.renderMode === 'vfx') {
        await applyEffect();
      }
    } else if (props.renderMode === 'local-pixel') {
      renderEffectSource();
    }
  }
});

onBeforeUnmount(() => {
  cancelled = true;
  transitionToken += 1;
  window.clearTimeout(transitionTimer);
  window.cancelAnimationFrame(transitionFrame);
  window.cancelAnimationFrame(animationFrame);
  vfxInstance?.remove(effectSource.value);
  vfxInstance?.destroy();
});
</script>

<template>
  <div ref="root" class="hero-vfx-image" :class="`hero-vfx-image-${renderMode}`">
    <canvas ref="effectSource" class="hero-vfx-image-effect-source"></canvas>
    <img :src="currentSrc" alt="" class="hero-vfx-image-current" decoding="async" />
    <img
      v-if="incomingSrc"
      :key="incomingKey"
      :src="incomingSrc"
      alt=""
      class="hero-vfx-image-incoming"
      decoding="async"
    />
  </div>
</template>

<style scoped>
.hero-vfx-image {
  --hero-ken-burns-transform: scale(1.04) translate3d(-1.2%, -0.6%, 0);
  --vfx-lens-opacity: 0;
  --vfx-blob-a-x: 50%;
  --vfx-blob-a-y: 50%;
  --vfx-blob-a-width: 310px;
  --vfx-blob-a-height: 250px;
  --vfx-blob-b-x: 38%;
  --vfx-blob-b-y: 58%;
  --vfx-blob-b-width: 244px;
  --vfx-blob-b-height: 196px;
  --vfx-blob-c-x: 62%;
  --vfx-blob-c-y: 42%;
  --vfx-blob-c-width: 270px;
  --vfx-blob-c-height: 218px;
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-vfx-image-current,
.hero-vfx-image-incoming,
.hero-vfx-image-effect-source {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 34%;
  transform-origin: center 34%;
  transform: var(--hero-ken-burns-transform);
  will-change: transform;
}

.hero-vfx-image-effect-source {
  z-index: 0 !important;
  opacity: 0 !important;
  mask-image: none !important;
}

.hero-vfx-image-local-pixel .hero-vfx-image-effect-source {
  z-index: 2 !important;
  opacity: var(--vfx-lens-opacity) !important;
  image-rendering: pixelated;
  animation: hero-local-mask-flow 6200ms ease-in-out infinite alternate;
  transition: opacity 180ms ease;
  will-change: mask-position, transform;
  -webkit-mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 38%,
      rgb(0 0 0 / 0.72) 62%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 36%,
      rgb(0 0 0 / 0.68) 61%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 36%,
      rgb(0 0 0 / 0.66) 60%,
      transparent 100%
    ) !important;
  mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 38%,
      rgb(0 0 0 / 0.72) 62%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 36%,
      rgb(0 0 0 / 0.68) 61%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 36%,
      rgb(0 0 0 / 0.66) 60%,
      transparent 100%
    ) !important;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size:
    104% 104%,
    103% 103%,
    105% 105%;
  mask-size:
    104% 104%,
    103% 103%,
    105% 105%;
}

@keyframes hero-local-mask-flow {
  0% {
    -webkit-mask-position:
      -1.4vw 0.2vh,
      1.2vw -0.6vh,
      -0.6vw 0.8vh;
    mask-position:
      -1.4vw 0.2vh,
      1.2vw -0.6vh,
      -0.6vw 0.8vh;
  }

  48% {
    -webkit-mask-position:
      1.1vw -0.7vh,
      -1.5vw 0.9vh,
      1.3vw 0.1vh;
    mask-position:
      1.1vw -0.7vh,
      -1.5vw 0.9vh,
      1.3vw 0.1vh;
  }

  100% {
    -webkit-mask-position:
      0.7vw 1vh,
      -0.8vw -0.4vh,
      1.8vw -0.9vh;
    mask-position:
      0.7vw 1vh,
      -0.8vw -0.4vh,
      1.8vw -0.9vh;
  }
}

.hero-vfx-image-incoming {
  z-index: 1;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
  animation: hero-image-cross-fade-wipe 1400ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
  will-change: clip-path, opacity, transform;
}

.hero-vfx-image :deep(canvas) {
  z-index: 2;
  opacity: var(--vfx-lens-opacity);
  transform-origin: center 34%;
  transform: var(--hero-ken-burns-transform);
  will-change: transform;
  transition: opacity 180ms ease;
  -webkit-mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 38%,
      rgb(0 0 0 / 0.72) 62%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 36%,
      rgb(0 0 0 / 0.68) 61%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 36%,
      rgb(0 0 0 / 0.66) 60%,
      transparent 100%
    );
  mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 38%,
      rgb(0 0 0 / 0.72) 62%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 36%,
      rgb(0 0 0 / 0.68) 61%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 36%,
      rgb(0 0 0 / 0.66) 60%,
      transparent 100%
    );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

@keyframes hero-image-cross-fade-wipe {
  from {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }

  42% {
    opacity: 0.72;
  }

  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-vfx-image-local-pixel .hero-vfx-image-effect-source,
  .hero-vfx-image-incoming {
    animation: none;
  }

  .hero-vfx-image-current,
  .hero-vfx-image-incoming,
  .hero-vfx-image-effect-source,
  .hero-vfx-image :deep(canvas) {
    transform: none;
  }

  .hero-vfx-image-incoming {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}
</style>

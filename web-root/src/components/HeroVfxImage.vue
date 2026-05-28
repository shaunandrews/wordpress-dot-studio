<!--
@component HeroVfxImage
@description Applies a drifting animated liquid pixel mask to the hero painting.
-->
<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { VFX } from '@vfx-js/core';
import { PixelateEffect } from '@vfx-js/effects';

const TRANSITION_DURATION = 720;
const INITIAL_PIXEL_SIZE = 10;
const PIXEL_SIZE_AMPLITUDE = 0.1;
const PIXEL_SIZE_CYCLE_MS = 10200;
const MAX_EFFECT_PIXEL_WIDTH = 1400;
const EFFECT_RENDER_SCALE = 0.55;
const VFX_SETTINGS = {
  pixelSize: INITIAL_PIXEL_SIZE,
  pixelAmplitude: PIXEL_SIZE_AMPLITUDE,
  pixelCycleMs: PIXEL_SIZE_CYCLE_MS,
  targetXMin: 22,
  targetXMax: 78,
  targetYMin: 24,
  targetYMax: 96,
  blobSpeedMin: 4.2,
  blobSpeedMax: 5.9,
  targetHoldMinMs: 13900,
  targetHoldMaxMs: 8800,
  radiusScale: 155,
  wobbleScale: 193,
  breatheMs: 1000,
  driftMs: 5800,
  flowX: 3.5,
  flowY: 4.7,
  flowXMs: 1500,
  flowYMs: 7400,
};

const props = defineProps({
  src: {
    type: String,
    required: true,
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
  const radius = blob.radius * (VFX_SETTINGS.radiusScale / 100);
  const wobble = blob.wobble * (VFX_SETTINGS.wobbleScale / 100);
  const breathe = Math.sin(elapsed / VFX_SETTINGS.breatheMs + blob.phase);
  const drift = Math.cos(elapsed / VFX_SETTINGS.driftMs + blob.phase * 1.3);
  const flowX =
    Math.sin(elapsed / VFX_SETTINGS.flowXMs + blob.phase * 1.7) *
    bounds.width *
    (VFX_SETTINGS.flowX / 100);
  const flowY =
    Math.cos(elapsed / VFX_SETTINGS.flowYMs + blob.phase * 1.1) *
    bounds.height *
    (VFX_SETTINGS.flowY / 100);
  const width = Math.round(radius * (1.12 + breathe * wobble));
  const height = Math.round(radius * (0.9 + drift * wobble * 0.84));

  root.value.style.setProperty(`--vfx-blob-${blob.id}-x`, `${bounds.width * blob.x + flowX}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-y`, `${bounds.height * blob.y + flowY}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-width`, `${width}px`);
  root.value.style.setProperty(`--vfx-blob-${blob.id}-height`, `${height}px`);
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

  const deltaSeconds = Math.min(0.064, (timestamp - lastFrame) / 1000);
  lastFrame = timestamp;
  updatePixelSize(timestamp);

  const bounds = root.value.getBoundingClientRect();
  liquidBlobs.forEach((blob) => updateLiquidBlob(blob, timestamp, deltaSeconds, bounds));
  root.value.style.setProperty('--vfx-lens-opacity', '1');

  if (renderEffectSource(timestamp)) {
    updateEffectTexture();
  }

  animationFrame = window.requestAnimationFrame(animateLens);
}

function completeTransition(nextSrc, token) {
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    if (token !== transitionToken || cancelled) {
      return;
    }

    currentSrc.value = nextSrc;
    incomingSrc.value = null;
    effectTransition = null;
    sourceNeedsUpdate = true;

    if (renderEffectSource()) {
      updateEffectTexture();
    }
  }, TRANSITION_DURATION);
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

function resizeEffectSource() {
  if (!root.value || !effectSource.value) {
    return false;
  }

  const bounds = root.value.getBoundingClientRect();
  const ratio = Math.min(
    window.devicePixelRatio || 1,
    MAX_EFFECT_PIXEL_WIDTH / Math.max(bounds.width, 1),
    EFFECT_RENDER_SCALE
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

function drawPainting(context, painting, alpha) {
  if (!painting?.naturalWidth || !painting?.naturalHeight || !effectSource.value) {
    return;
  }

  const canvasWidth = effectSource.value.width;
  const canvasHeight = effectSource.value.height;
  const scale = Math.max(
    canvasWidth / painting.naturalWidth,
    canvasHeight / painting.naturalHeight
  );
  const width = painting.naturalWidth * scale;
  const height = painting.naturalHeight * scale;
  const x = (canvasWidth - width) * 0.5;
  const y = (canvasHeight - height) * 0.34;

  context.save();
  context.globalAlpha = alpha;
  context.drawImage(painting, x, y, width, height);
  context.restore();
}

function renderEffectSource(timestamp = window.performance.now()) {
  if (!effectSource.value) {
    return false;
  }

  const resized = resizeEffectSource();
  const context = effectSource.value.getContext('2d');
  const currentImage = sourceImages.get(currentSrc.value);

  if (!context || !currentImage) {
    return false;
  }

  context.clearRect(0, 0, effectSource.value.width, effectSource.value.height);

  if (effectTransition) {
    const progress = Math.min(1, (timestamp - effectTransition.start) / TRANSITION_DURATION);

    drawPainting(context, effectTransition.fromImage, 1 - progress);
    drawPainting(context, effectTransition.toImage, progress);
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
  if (!root.value || !effectSource.value || vfxInstance || cancelled) {
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
      await applyEffect();
    }
  }
});

onBeforeUnmount(() => {
  cancelled = true;
  transitionToken += 1;
  window.clearTimeout(transitionTimer);
  window.cancelAnimationFrame(animationFrame);
  vfxInstance?.remove(effectSource.value);
  vfxInstance?.destroy();
});
</script>

<template>
  <div ref="root" class="hero-vfx-image">
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
}

.hero-vfx-image-effect-source {
  z-index: 0 !important;
  opacity: 0 !important;
  mask-image: none !important;
}

.hero-vfx-image-incoming {
  z-index: 1;
  opacity: 0;
  animation: hero-image-fade-in 720ms ease forwards;
}

.hero-vfx-image :deep(canvas) {
  z-index: 2;
  opacity: var(--vfx-lens-opacity);
  transition: opacity 180ms ease;
  -webkit-mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 46%,
      rgb(0 0 0 / 0.72) 68%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 44%,
      rgb(0 0 0 / 0.68) 67%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 44%,
      rgb(0 0 0 / 0.66) 66%,
      transparent 100%
    );
  mask-image:
    radial-gradient(
      ellipse var(--vfx-blob-a-width) var(--vfx-blob-a-height) at var(--vfx-blob-a-x)
        var(--vfx-blob-a-y),
      #000 0 46%,
      rgb(0 0 0 / 0.72) 68%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-b-width) var(--vfx-blob-b-height) at var(--vfx-blob-b-x)
        var(--vfx-blob-b-y),
      #000 0 44%,
      rgb(0 0 0 / 0.68) 67%,
      transparent 100%
    ),
    radial-gradient(
      ellipse var(--vfx-blob-c-width) var(--vfx-blob-c-height) at var(--vfx-blob-c-x)
        var(--vfx-blob-c-y),
      #000 0 44%,
      rgb(0 0 0 / 0.66) 66%,
      transparent 100%
    );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

@keyframes hero-image-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import HomeHeroActions from './HomeHeroActions.vue';
import HeroVfxImage from './HeroVfxImage.vue';
import UseCaseGridOverlay from './UseCaseGridOverlay.vue';
import InlineSvg from './InlineSvg.vue';
import { heroCopy, heroUseCases } from './homeHeroData.js';
import studioIconUrl from '../../assets/studio-icon.svg?url';

const props = defineProps({
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
const markWrap = ref(null);
const currentPaused = ref(false);
const paintingTooltipVisible = ref(false);
const paintingTooltipText = ref('');
const paintingTooltipEl = ref(null);
let currentAnimationFrame = 0;
let currentLastTimestamp = 0;
let currentTime = 0;
let lastRenderTime = 0;
let petalFlips = null;
let reducedMotionQuery;

// Tooltip spring physics: the chip trails the cursor, overshoots, and wobbles.
const TIP_OFFSET_X = 16;
const TIP_OFFSET_Y = 22;
const TIP_STIFFNESS = 240;
const TIP_DAMPING = 16;
let tooltipFrame = 0;
let tooltipLastTs = 0;
let tipX = 0;
let tipY = 0;
let tipVX = 0;
let tipVY = 0;
let tipRot = 0;
let tipTargetX = 0;
let tipTargetY = 0;
let typewriterTimer = 0;
let typewriterToken = 0;

const mobileUseCaseLayout = [
  { x: 0.3, y: 0.32, scale: 0.98, tilt: -4 },
  { x: 0.7, y: 0.39, scale: 1.02, tilt: 3 },
  { x: 0.5, y: 0.54, scale: 1.08, tilt: -2 },
  { x: 0.25, y: 0.69, scale: 0.96, tilt: 4 },
  { x: 0.75, y: 0.73, scale: 0.96, tilt: -5 },
  { x: 0.38, y: 0.88, scale: 0.84, tilt: 2 },
  { x: 0.66, y: 0.92, scale: 0.84, tilt: -3 },
];

const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Anticipation + overshoot easing for the card flip's personality.
function easeInOutBack(x) {
  const c2 = 1.70158 * 1.525;
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (2 * x - 2) + c2) + 2) / 2;
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

function applyTooltipTransform() {
  const el = paintingTooltipEl.value;
  if (!el) return;
  el.style.transform = `translate3d(${tipX.toFixed(2)}px, ${tipY.toFixed(2)}px, 0) rotate(${tipRot.toFixed(2)}deg)`;
}

function tooltipTick(timestamp) {
  if (!tooltipLastTs) {
    tooltipLastTs = timestamp;
  }

  const dt = Math.min((timestamp - tooltipLastTs) / 1000, 0.04);
  tooltipLastTs = timestamp;

  // Underdamped spring toward the cursor: lags, overshoots, then settles.
  const ax = (tipTargetX - tipX) * TIP_STIFFNESS - tipVX * TIP_DAMPING;
  const ay = (tipTargetY - tipY) * TIP_STIFFNESS - tipVY * TIP_DAMPING;
  tipVX += ax * dt;
  tipVY += ay * dt;
  tipX += tipVX * dt;
  tipY += tipVY * dt;

  // Tilt with horizontal velocity; the spring's wobble carries into the tilt.
  const targetRot = clamp(tipVX * 0.012, -14, 14);
  tipRot += (targetRot - tipRot) * Math.min(1, dt * 12);

  applyTooltipTransform();
  tooltipFrame = window.requestAnimationFrame(tooltipTick);
}

function startTooltipLoop() {
  if (tooltipFrame) return;
  tooltipLastTs = 0;
  tooltipFrame = window.requestAnimationFrame(tooltipTick);
}

function stopTooltipLoop() {
  window.cancelAnimationFrame(tooltipFrame);
  tooltipFrame = 0;
}

function cancelTypewriter() {
  window.clearTimeout(typewriterTimer);
  typewriterToken += 1;
}

// Type the label out one character at a time, optionally backspacing the old
// label first so a painting change reads like someone retyping the word.
function runTypewriter(target, eraseFirst) {
  cancelTypewriter();

  if (reducedMotionQuery?.matches) {
    paintingTooltipText.value = target;
    return;
  }

  const token = typewriterToken;

  const typeForward = () => {
    if (token !== typewriterToken) return;
    const current = paintingTooltipText.value;
    if (current.length >= target.length) return;
    paintingTooltipText.value = target.slice(0, current.length + 1);
    typewriterTimer = window.setTimeout(typeForward, 30 + Math.random() * 75);
  };

  const eraseBackward = () => {
    if (token !== typewriterToken) return;
    const current = paintingTooltipText.value;
    if (current.length === 0) {
      typeForward();
      return;
    }
    paintingTooltipText.value = current.slice(0, -1);
    typewriterTimer = window.setTimeout(eraseBackward, 16 + Math.random() * 20);
  };

  if (eraseFirst && paintingTooltipText.value.length > 0) {
    eraseBackward();
  } else {
    paintingTooltipText.value = '';
    typeForward();
  }
}

function movePaintingTooltip(event) {
  tipTargetX = event.clientX + TIP_OFFSET_X;
  tipTargetY = event.clientY + TIP_OFFSET_Y;

  if (reducedMotionQuery?.matches) {
    tipX = tipTargetX;
    tipY = tipTargetY;
    applyTooltipTransform();
  }
}

function showPaintingTooltip(event) {
  if (!props.painting?.tooltip) return;

  tipTargetX = event.clientX + TIP_OFFSET_X;
  tipTargetY = event.clientY + TIP_OFFSET_Y;
  // Appear where the cursor entered rather than springing in from a corner.
  tipX = tipTargetX;
  tipY = tipTargetY;
  tipVX = 0;
  tipVY = 0;
  tipRot = 0;
  paintingTooltipVisible.value = true;

  nextTick(() => {
    applyTooltipTransform();
    if (!reducedMotionQuery?.matches) {
      startTooltipLoop();
    }
  });

  runTypewriter(props.painting.tooltip, false);
}

function hidePaintingTooltip() {
  paintingTooltipVisible.value = false;
  stopTooltipLoop();
  cancelTypewriter();
  paintingTooltipText.value = '';
}

// Retype while the chip is open whenever the painting (and its label) changes.
watch(
  () => props.painting?.tooltip,
  (next) => {
    if (!next) return;
    if (paintingTooltipVisible.value) {
      runTypewriter(next, true);
    } else {
      cancelTypewriter();
      paintingTooltipText.value = '';
    }
  }
);

function renderCurrentItems() {
  if (!currentField.value) return;

  const fieldRect = currentField.value.getBoundingClientRect();
  const width = fieldRect.width || window.innerWidth;
  const height = fieldRect.height || window.innerHeight;
  const mobile = window.innerWidth <= 760;
  const nodes = [...currentField.value.querySelectorAll('.home-hero-use-case-drift')];

  if (mobile) {
    nodes.forEach((node, index) => {
      const layout = mobileUseCaseLayout[index];

      if (!layout) {
        node.style.transform = 'translate3d(-999vw, -999vh, 0)';
        return;
      }

      const drift = Math.sin(currentTime * 0.7 + index * 1.9) * 5;
      const x = width * layout.x;
      const y = height * layout.y + drift;

      node.style.zIndex = String(3 - index);
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${layout.scale}) rotate(${layout.tilt}deg)`;
    });
    return;
  }

  // Desktop: use cases revolve around the app icon like petals on a slowly
  // turning flower. Each petal's inner edge is pinned to a ring at the icon's
  // edge and points radially outward, tracking that orientation smoothly as it
  // orbits. Staying upright needs a 180deg re-orientation once per turn; that
  // happens ONLY at the top, played as a 3D card flip around the Y axis (with
  // anticipation + overshoot). The matching flip at the bottom is an instant
  // snap, hidden behind the surface horizon (the field sits below it z-index).
  const markRect = markWrap.value?.getBoundingClientRect();
  const originX = markRect ? markRect.left + markRect.width / 2 - fieldRect.left : width * 0.5;
  const originY = markRect ? markRect.top + markRect.height / 2 - fieldRect.top : height * 0.66;
  const iconHalf = markRect ? markRect.width / 2 : 60;

  const count = nodes.length;
  const innerRadius = iconHalf + clamp(width * 0.03, 44, 80);
  const ringStep = clamp(width * 0.022, 24, 44);
  const revolve = currentTime * 0.1; // slow turn around the icon
  const flipDuration = 0.62; // seconds for the top card flip

  const dt = Math.max(0, Math.min(currentTime - lastRenderTime, 0.05));
  lastRenderTime = currentTime;

  if (!petalFlips || petalFlips.length !== count) {
    petalFlips = nodes.map(() => ({ z: null, prevSin: 0, flip: 1, preZ: 0 }));
  }

  nodes.forEach((node, index) => {
    const useCase = heroUseCases[index];
    const phase = useCase.start * TAU;
    const state = petalFlips[index];

    // Even spacing around the full circle, slowly revolving.
    const beta = (index / count) * TAU + revolve;
    const sinB = Math.sin(beta); // beta: 0 = straight up, increasing clockwise
    const dirX = sinB;
    const dirY = -Math.cos(beta);
    const perpX = Math.cos(beta);
    const perpY = Math.sin(beta);

    // A little bob so each petal drifts with its own personality.
    const bobR =
      Math.sin(currentTime * 0.9 + phase) * 5 + Math.sin(currentTime * 1.7 + phase * 1.6) * 2.5;
    const bobT = Math.cos(currentTime * 0.8 + phase * 1.3) * 4;
    const ring = innerRadius + useCase.crownLane * ringStep + bobR;
    const innerX = originX + dirX * ring + perpX * bobT;
    const innerY = originY + dirY * ring + perpY * bobT;

    // Upright target rotation: aligned to the radius, flipped 180deg on the
    // half where the label would otherwise read upside-down.
    let targetRho = Math.atan2(dirY, dirX);
    if (Math.cos(targetRho) < 0) {
      targetRho += Math.PI;
    }
    const targetZ = (targetRho * 180) / Math.PI;

    if (state.z === null) {
      state.z = targetZ;
      state.prevSin = sinB;
    }

    // The upright correction toggles where the petal is vertical: the top
    // (dirY < 0) plays an animated flip, the masked bottom just snaps.
    if (state.prevSin < 0 !== sinB < 0) {
      if (dirY < 0) {
        if (state.flip >= 1) {
          state.flip = 0;
          state.preZ = state.z;
        }
      } else {
        state.z = targetZ;
      }
    }
    state.prevSin = sinB;

    // Drive the card flip: rotateY 0 -> 360 so it lands face-on (un-mirrored),
    // swapping the in-plane orientation while edge-on/back at the midpoint.
    let rotateY = 0;
    let flipScale = 1;
    if (state.flip < 1) {
      state.flip = Math.min(1, state.flip + dt / flipDuration);
      rotateY = 360 * easeInOutBack(state.flip);
      flipScale = 1 + Math.sin(state.flip * Math.PI) * 0.07;
      state.z = state.flip < 0.5 ? state.preZ : targetZ;
    } else {
      state.z = targetZ;
    }

    const wobbleDeg = Math.sin(currentTime * 1.3 + phase * 1.7) * 1.6;
    const zDeg = state.z + wobbleDeg;

    // The pill spans from its inner edge (at the icon) outward along the radius.
    const w = node.offsetWidth || 180;
    const cx = innerX + dirX * (w / 2);
    const cy = innerY + dirY * (w / 2);

    const depth = (dirY + 1) * 0.5; // 0 at the top, 1 at the bottom

    // Shrink petals as they sink past the horizontal toward the bottom: it
    // reads as receding into the horizon and keeps long labels from poking
    // out below the surface. Full size at the sides (depth 0.5) and above.
    const sink = clamp((depth - 0.5) / 0.5, 0, 1);
    const depthScale = 1 - sink * sink * 0.5; // 1 at the sides → ~0.5 at the bottom

    const scale = (0.97 + Math.sin(currentTime * 1.2 + phase) * 0.025) * flipScale * depthScale;

    node.style.zIndex = String(state.flip < 1 ? 40 : Math.round(22 - depth * 16));
    node.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) translate(-50%, -50%) perspective(900px) rotateZ(${zDeg.toFixed(2)}deg) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
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
  window.addEventListener('resize', renderCurrentItems);

  nextTick(() => {
    renderCurrentItems();

    if (!reducedMotionQuery.matches) {
      currentAnimationFrame = window.requestAnimationFrame(tickCurrent);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderCurrentItems);
  window.cancelAnimationFrame(currentAnimationFrame);
  stopTooltipLoop();
  cancelTypewriter();
});
</script>

<template>
  <section class="home-hero-surface" aria-label="WordPress Studio overview">
    <div
      class="home-hero-surface-art"
      aria-hidden="true"
      @mouseenter="showPaintingTooltip"
      @mousemove="movePaintingTooltip"
      @mouseleave="hidePaintingTooltip"
    >
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
          @click="openUseCase(useCase.id)"
        >
          <span>{{ useCase.label }}</span>
        </button>
      </div>
    </div>

    <div class="home-hero-surface-copy vstack gap-l align-center">
      <div ref="markWrap" class="home-hero-surface-mark-wrap">
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
        ref="paintingTooltipEl"
        class="home-hero-painting-tooltip"
        :class="{ 'is-visible': paintingTooltipVisible }"
        aria-hidden="true"
      >
        <span class="home-hero-painting-tooltip-text">{{ paintingTooltipText }}</span>
        <span class="home-hero-painting-tooltip-caret"></span>
      </div>
    </Teleport>

    <UseCaseGridOverlay
      v-if="selectedUseCase"
      :use-cases="heroUseCases"
      :initial-id="selectedUseCaseId"
      @close="closeUseCase"
    />
  </section>
</template>

<style scoped>
.home-hero-surface {
  /* Fixed, not vh-scaled: the copy is bottom-anchored and the image/white
     boundary sits at 0.6x this height. When this shrank with viewport height
     the boundary dropped while the (fixed-height) headline stayed put, so the
     text rode up over the image at shorter viewports. */
  --surface-shape-height: 500px;
  --surface-art-bottom: calc(var(--surface-shape-height) * 0.6);
  position: relative;
  z-index: 1;
  isolation: isolate;
  display: grid;
  align-items: end;
  /* Floor keeps enough height for the painting to read on short (laptop)
     viewports, where 80dvh would otherwise collapse the visible art band.
     80dvh still wins on taller screens. */
  min-height: max(80dvh, 760px);
  padding: calc(var(--site-header-height, 0px) + clamp(68px, 8vw, 112px)) var(--space-xl)
    clamp(56px, 7vw, 96px);
  overflow-x: clip;
  overflow-y: visible;
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
  /* Fixed downward nudge to keep the copy sitting in the white area. Pairing a
     vh-scaled nudge with the (formerly) vh-scaled surface height let the two
     drift apart, lifting the text over the image at shorter viewports. */
  transform: translateY(92px);
  pointer-events: none;
}

.home-hero-surface-copy :deep(a),
.home-hero-surface-copy :deep(button) {
  pointer-events: auto;
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
  /* Fixed size: the mark no longer scales with viewport width. */
  width: 136px;
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
  inset: 0;
  z-index: 1;
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
  display: inline-flex;
  align-items: center;
  max-width: calc(100vw - var(--space-xl) * 2);
  min-height: 34px;
  padding: var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 80%, transparent);
  border-radius: 5px;
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.16);
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
    transform 0.14s ease;
}

.home-hero-use-case:hover,
.home-hero-use-case:focus-visible {
  border-color: color-mix(in srgb, var(--color-theme-fill) 68%, var(--color-chrome-border));
  color: var(--color-theme-fill);
  box-shadow: 0 10px 26px rgb(0 0 0 / 0.22);
  transform: translateY(-2px);
}

.home-hero-use-case:focus-visible {
  outline: 2px solid var(--color-theme-fill);
  outline-offset: 3px;
}

.home-hero-painting-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  display: inline-flex;
  align-items: center;
  padding: var(--space-s) var(--space-m);
  border-radius: 6px;
  /* Inverted chip: dark in light mode, light in dark mode. */
  color: var(--color-chrome-fill);
  background: var(--color-chrome-fg);
  box-shadow: 0 10px 26px rgb(0 0 0 / 0.26);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform-origin: left center;
  transition: opacity 150ms ease;
  will-change: transform, opacity;
}

.home-hero-painting-tooltip.is-visible {
  opacity: 1;
}

.home-hero-painting-tooltip-caret {
  display: inline-block;
  width: 2px;
  height: 1.05em;
  margin-left: 2px;
  background: currentColor;
  border-radius: 1px;
  opacity: 0;
}

.home-hero-painting-tooltip.is-visible .home-hero-painting-tooltip-caret {
  animation: home-hero-tooltip-caret-blink 1.05s steps(1, end) infinite;
}

@keyframes home-hero-tooltip-caret-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@media (max-width: 760px) {
  .home-hero-surface {
    --mobile-art-height: 340px;
    --surface-shape-height: 150px;
    --surface-art-bottom: 0px;

    align-items: start;
    min-height: auto;
    padding: calc(var(--site-header-height, 0px) + var(--mobile-art-height) - 34px) var(--space-l)
      var(--space-xl);
  }

  .home-hero-surface-art {
    inset: 0 0 auto;
    height: calc(var(--site-header-height, 0px) + var(--mobile-art-height));
  }

  .home-hero-surface-shape {
    top: calc(
      var(--site-header-height, 0px) + var(--mobile-art-height) - var(--surface-shape-height)
    );
    bottom: auto;
    left: -18%;
    right: -18%;
    width: 136%;
  }

  .home-hero-surface-copy {
    gap: var(--space-m);
    width: 100%;
    padding-top: 68px;
    transform: none;
  }

  .home-hero-surface-mark-wrap {
    position: absolute;
    top: -94px;
    left: 50%;
    z-index: 5;
    width: clamp(120px, 34vw, 156px);
    transform: translateX(-50%);
  }

  .home-hero-surface-mark {
    border-width: 8px;
    border-radius: 34px;
    filter: drop-shadow(0 24px 42px rgb(0 0 0 / 0.24));
  }

  .home-hero-surface-copy h1 {
    max-width: 34rem;
    font-size: var(--font-size-xxxl);
    line-height: var(--line-height-tight);
  }

  .home-hero-surface-copy p {
    max-width: 36rem;
    font-size: var(--font-size-l);
  }

  .home-hero-use-case-current {
    top: calc(var(--site-header-height, 0px) + 94px);
    bottom: auto;
    z-index: 3;
    height: calc(var(--mobile-art-height) - 90px);
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }

  .home-hero-use-case-drift:nth-child(n + 8) {
    display: none;
  }

  .home-hero-use-case {
    max-width: min(74vw, 22rem);
    min-height: 36px;
    padding: var(--space-m) var(--space-l);
    box-shadow: 0 8px 18px rgb(0 0 0 / 0.16);
    font-size: var(--font-size-s);
  }
}

@media (max-width: 560px) {
  .home-hero-surface-copy h1 {
    max-width: 21rem;
    font-size: 36px;
  }

  .home-hero-surface-copy p {
    max-width: 22rem;
    font-size: var(--font-size-m);
    line-height: var(--line-height-relaxed);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-surface-stop-mist-mid,
  .home-hero-surface-stop-mist-end,
  .home-hero-surface-stop-feather-start,
  .home-hero-surface-stop-feather-mid {
    animation: none;
  }

  .home-hero-painting-tooltip.is-visible .home-hero-painting-tooltip-caret {
    animation: none;
    opacity: 1;
  }

  .home-hero-use-case-drift {
    will-change: auto;
  }
}
</style>

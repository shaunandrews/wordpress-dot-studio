<!--
@component UseCaseGridOverlay
@description Full-screen infinite, pannable grid of every hero use case. The
  selected card centers and enlarges; the camera springs from card to card as
  the user navigates by arrows, click, drag/swipe, or scroll. The visible
  lattice is virtualized and decorative (aria-hidden); an off-screen list and a
  live region carry the accessible semantics.
@notes Mounted only while open (parent v-if). Motion is disabled under
  prefers-reduced-motion. Leave is instant, matching the prior modal.
-->
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  cardIndexForCell,
  cellCenter,
  fpoGraphicStyle,
  nearestCell,
  stepCell,
  visibleCells,
} from './useCaseGrid.js';

const props = defineProps({
  useCases: { type: Array, required: true },
  initialId: { type: String, default: '' },
});
const emit = defineEmits(['close']);

const COLS = 6;
const CENTER_SCALE = 1.6;
const MIN_SCALE = 0.7;
const FALLOFF = 2.2; // cells from center where scale reaches MIN
const SPRING_STIFFNESS = 210;
const SPRING_DAMPING = 22;
const SCROLL_IDLE_MS = 140;
const DRAG_THRESHOLD = 6;

const count = props.useCases.length;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const rootEl = ref(null);
const layerEl = ref(null);
const cells = ref([]);
const cellW = ref(340);
const cellH = ref(380);
const liveLabel = ref('');
const visible = ref(false);

// Camera + spring state (lattice space, mutated imperatively each frame).
let camX = 0;
let camY = 0;
let velX = 0;
let velY = 0;
let targetX = 0;
let targetY = 0;
let selCol = 0;
let selRow = 0;

let dragging = false;
let didDrag = false;
let dragStartX = 0;
let dragStartY = 0;
let dragCamX = 0;
let dragCamY = 0;
let scrollIdleTimer = 0;
let rafId = 0;
let lastTs = 0;
let lastBounds = null;
let previouslyFocused = null;

function viewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function responsiveMetrics() {
  const w = window.innerWidth;
  if (w <= 560) return { cellW: 210, cellH: 240 };
  if (w <= 760) return { cellW: 250, cellH: 280 };
  return { cellW: 340, cellH: 380 };
}

function canonicalCellForIndex(index) {
  return { col: index % COLS, row: Math.floor(index / COLS) };
}

function setTargetToCell(col, row) {
  const c = cellCenter(col, row, cellW.value, cellH.value);
  targetX = c.x;
  targetY = c.y;
  if (reducedMotion.matches) {
    camX = targetX;
    camY = targetY;
    velX = 0;
    velY = 0;
  }
}

function selectCell(col, row) {
  selCol = col;
  selRow = row;
  const index = cardIndexForCell(col, row, count, COLS);
  liveLabel.value = props.useCases[index].title;
  setTargetToCell(col, row);
}

function selectIndex(index) {
  const cell = canonicalCellForIndex(index);
  selectCell(cell.col, cell.row);
}

function rebuildCellsIfNeeded() {
  const b = visibleCells({ x: camX, y: camY }, viewport(), cellW.value, cellH.value, 1);
  if (
    lastBounds &&
    b.colMin === lastBounds.colMin &&
    b.colMax === lastBounds.colMax &&
    b.rowMin === lastBounds.rowMin &&
    b.rowMax === lastBounds.rowMax
  ) {
    return;
  }
  lastBounds = b;
  const next = [];
  for (let row = b.rowMin; row <= b.rowMax; row += 1) {
    for (let col = b.colMin; col <= b.colMax; col += 1) {
      const index = cardIndexForCell(col, row, count, COLS);
      next.push({ key: `${col},${row}`, col, row, index, useCase: props.useCases[index] });
    }
  }
  cells.value = next;
}

function applyTransforms() {
  if (!layerEl.value) return;
  const vp = viewport();
  layerEl.value.style.transform = `translate3d(${(vp.width / 2 - camX).toFixed(2)}px, ${(
    vp.height / 2 -
    camY
  ).toFixed(2)}px, 0)`;

  const camCol = camX / cellW.value;
  const camRow = camY / cellH.value;
  const nodes = layerEl.value.querySelectorAll('.use-case-grid-card');
  nodes.forEach((node) => {
    const col = Number(node.dataset.col);
    const row = Number(node.dataset.row);
    const d = Math.hypot(col + 0.5 - camCol, row + 0.5 - camRow);
    const t = Math.max(0, 1 - d / FALLOFF);
    const smooth = t * t * (3 - 2 * t);
    const scale = MIN_SCALE + (CENTER_SCALE - MIN_SCALE) * smooth;
    const opacity = 0.5 + 0.5 * Math.max(0, 1 - d / (FALLOFF + 1.4));
    node.style.transform = `scale(${scale.toFixed(3)})`;
    node.style.opacity = opacity.toFixed(3);
    node.style.zIndex = String(Math.round(100 - d * 10));
  });
}

function tick(ts) {
  if (!lastTs) lastTs = ts;
  const dt = Math.min((ts - lastTs) / 1000, 0.04);
  lastTs = ts;

  if (!reducedMotion.matches && !dragging) {
    const ax = (targetX - camX) * SPRING_STIFFNESS - velX * SPRING_DAMPING;
    const ay = (targetY - camY) * SPRING_STIFFNESS - velY * SPRING_DAMPING;
    velX += ax * dt;
    velY += ay * dt;
    camX += velX * dt;
    camY += velY * dt;
  }

  rebuildCellsIfNeeded();
  applyTransforms();
  rafId = window.requestAnimationFrame(tick);
}

function move(direction) {
  const next = stepCell({ col: selCol, row: selRow }, direction);
  selectCell(next.col, next.row);
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    emit('close');
    return;
  }
  if (event.key === 'Tab') {
    trapFocus(event);
    return;
  }
  const dir = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  }[event.key];
  if (dir) {
    event.preventDefault();
    move(dir);
  }
}

function trapFocus(event) {
  const focusable = rootEl.value?.querySelectorAll(
    'button:not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable || focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onCardClick(cell) {
  if (didDrag) return;
  selectCell(cell.col, cell.row);
}

function onPointerDown(event) {
  if (typeof event.button === 'number' && event.button !== 0) return;
  dragging = true;
  didDrag = false;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragCamX = camX;
  dragCamY = camY;
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
  if (!dragging) return;
  event.preventDefault();
  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;
  if (Math.hypot(dx, dy) > DRAG_THRESHOLD) didDrag = true;
  camX = dragCamX - dx;
  camY = dragCamY - dy;
  targetX = camX;
  targetY = camY;
  velX = 0;
  velY = 0;
}

function onPointerUp() {
  if (!dragging) return;
  dragging = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  if (didDrag) {
    const near = nearestCell({ x: camX, y: camY }, cellW.value, cellH.value);
    selectCell(near.col, near.row);
  }
}

function onWheel(event) {
  event.preventDefault();
  camX += event.deltaX;
  camY += event.deltaY;
  targetX = camX;
  targetY = camY;
  velX = 0;
  velY = 0;
  window.clearTimeout(scrollIdleTimer);
  scrollIdleTimer = window.setTimeout(() => {
    const near = nearestCell({ x: camX, y: camY }, cellW.value, cellH.value);
    selectCell(near.col, near.row);
  }, SCROLL_IDLE_MS);
}

function onResize() {
  const m = responsiveMetrics();
  cellW.value = m.cellW;
  cellH.value = m.cellH;
  const c = cellCenter(selCol, selRow, cellW.value, cellH.value);
  camX = c.x;
  camY = c.y;
  targetX = c.x;
  targetY = c.y;
  velX = 0;
  velY = 0;
  lastBounds = null;
}

onMounted(() => {
  previouslyFocused = document.activeElement;
  const m = responsiveMetrics();
  cellW.value = m.cellW;
  cellH.value = m.cellH;

  const startIndex = Math.max(
    0,
    props.useCases.findIndex((u) => u.id === props.initialId)
  );
  const cell = canonicalCellForIndex(startIndex);
  selCol = cell.col;
  selRow = cell.row;
  liveLabel.value = props.useCases[startIndex].title;

  const c = cellCenter(selCol, selRow, cellW.value, cellH.value);
  targetX = c.x;
  targetY = c.y;
  camX = c.x;
  // Start a touch low so the spring settles up into place (skipped if reduced).
  camY = c.y + (reducedMotion.matches ? 0 : 36);

  window.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);
  rootEl.value?.addEventListener('wheel', onWheel, { passive: false });

  rebuildCellsIfNeeded();
  rafId = window.requestAnimationFrame(tick);

  nextTick(() => {
    visible.value = true;
    rootEl.value?.querySelector('.use-case-grid-close')?.focus();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  rootEl.value?.removeEventListener('wheel', onWheel);
  window.cancelAnimationFrame(rafId);
  window.clearTimeout(scrollIdleTimer);
  previouslyFocused?.focus?.();
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="rootEl"
      class="use-case-grid"
      :class="{ 'is-visible': visible }"
      role="dialog"
      aria-modal="true"
      :aria-label="`WordPress Studio use cases — ${liveLabel}`"
      @pointerdown="onPointerDown"
    >
      <div class="use-case-grid-backdrop" aria-hidden="true"></div>

      <div ref="layerEl" class="use-case-grid-layer" aria-hidden="true">
        <div
          v-for="cell in cells"
          :key="cell.key"
          class="use-case-grid-cell"
          :style="{
            width: `${cellW}px`,
            height: `${cellH}px`,
            transform: `translate(${cell.col * cellW}px, ${cell.row * cellH}px)`,
          }"
        >
          <button
            class="use-case-grid-card"
            type="button"
            tabindex="-1"
            :data-col="cell.col"
            :data-row="cell.row"
            @click="onCardClick(cell)"
          >
            <span class="use-case-grid-card-graphic" :style="fpoGraphicStyle(cell.index, count)"></span>
            <span class="use-case-grid-card-title type-heading">{{ cell.useCase.title }}</span>
            <span class="use-case-grid-card-body type-body">{{ cell.useCase.body }}</span>
          </button>
        </div>
      </div>

      <button
        class="use-case-grid-close"
        type="button"
        aria-label="Close use cases"
        @click="emit('close')"
      >
        <span aria-hidden="true">×</span>
      </button>

      <ul class="use-case-grid-a11y-list">
        <li v-for="(useCase, index) in useCases" :key="useCase.id">
          <button type="button" @click="selectIndex(index)">{{ useCase.title }}</button>
        </li>
      </ul>

      <p class="use-case-grid-live" aria-live="polite">{{ liveLabel }}</p>
    </div>
  </Teleport>
</template>

<style scoped>
.use-case-grid {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  opacity: 0;
  touch-action: none;
  user-select: none;
  transition: opacity 0.22s ease;
}

.use-case-grid.is-visible {
  opacity: 1;
}

.use-case-grid-backdrop {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(10px);
}

.use-case-grid-layer {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.use-case-grid-cell {
  position: absolute;
  top: 0;
  left: 0;
}

.use-case-grid-card {
  position: absolute;
  inset: 14px;
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  padding: var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 78%, transparent);
  border-radius: 10px;
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
  box-shadow: 0 12px 30px rgb(0 0 0 / 0.24);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  transform-origin: center;
  will-change: transform, opacity;
}

.use-case-grid-card-graphic {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  flex-shrink: 0;
}

.use-case-grid-card-title {
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
}

.use-case-grid-card-body {
  color: var(--color-chrome-fg-muted);
  font-size: var(--font-size-s);
  line-height: var(--line-height-relaxed);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.use-case-grid-close {
  position: fixed;
  top: var(--space-l);
  right: var(--space-l);
  z-index: 110;
  display: grid;
  place-items: center;
  width: 44px;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 80%, transparent);
  border-radius: 50%;
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.28);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.use-case-grid-close:focus-visible {
  outline: 2px solid var(--color-theme-fill);
  outline-offset: 3px;
}

/* Off-screen accessible list + live region: real semantics for SR/keyboard. */
.use-case-grid-a11y-list,
.use-case-grid-live {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .use-case-grid {
    transition: none;
  }

  .use-case-grid-backdrop {
    backdrop-filter: none;
    background: rgb(0 0 0 / 0.6);
  }

  .use-case-grid-card {
    will-change: auto;
  }
}
</style>

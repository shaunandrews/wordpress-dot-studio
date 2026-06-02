# Use Case Grid Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-use-case hero modal with a full-screen infinite, pannable grid overlay where the selected card centers and enlarges and the camera springs from card to card.

**Architecture:** A pure math module (`useCaseGrid.js`) maps an infinite integer lattice to the 22 use cases and computes visible-cell ranges, nearest-cell snapping, and arrow stepping. A new Vue component (`UseCaseGridOverlay.vue`) virtualizes the visible cells, drives one vector spring + per-card scaling on `requestAnimationFrame`, and handles arrows/click/drag/scroll. `HomeHeroSurface.vue` opens the overlay instead of the old modal.

**Tech Stack:** Vue 3 `<script setup>`, plain ESM, `node --test` (source-regex + pure-unit tests), CSS scoped styles. No new dependencies.

---

## File Structure

- **Create** `web-root/src/components/useCaseGrid.js` — pure lattice math + FPO graphic helper. No DOM, no Vue. One responsibility: grid geometry.
- **Create** `web-root/src/components/useCaseGrid.test.js` — unit tests for the pure module.
- **Create** `web-root/src/components/UseCaseGridOverlay.vue` — the overlay UI, motion, interaction, and accessibility.
- **Create** `web-root/src/components/UseCaseGridOverlay.test.js` — source-level assertions for the component (matches the repo's existing source-test style).
- **Modify** `web-root/src/components/HomeHeroSurface.vue` — open the overlay from `openUseCase`, delete the old modal markup/CSS, remove the old `Escape` handler.
- **Modify** `web-root/src/components/HomeHero.test.js` — assert the overlay is wired and the old modal is gone.

**Conventions to follow (from the existing code):**
- Tests are `node:test` files read as source text (see `HomeHero.test.js`) for components, and real unit tests for pure JS.
- Run a single test file: `node --test web-root/src/components/<file>.test.js`
- Run everything: `npm test` (from repo root). Note: two pre-existing failures in `HeroVfxImage.test.js` (asserting `localMaskSpeed: 1.72` and `KEN_BURNS_CYCLE_MS = 16800`) are unrelated WIP and expected to remain red.

---

## Task 1: Lattice mapping + geometry (`useCaseGrid.js`)

**Files:**
- Create: `web-root/src/components/useCaseGrid.js`
- Test: `web-root/src/components/useCaseGrid.test.js`

- [ ] **Step 1: Write the failing test**

Create `web-root/src/components/useCaseGrid.test.js`:

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cardIndexForCell, cellCenter, nearestCell } from './useCaseGrid.js';

describe('cardIndexForCell', () => {
  it('maps cells to card indices and wraps in both directions', () => {
    assert.equal(cardIndexForCell(0, 0, 22, 6), 0);
    assert.equal(cardIndexForCell(5, 0, 22, 6), 5);
    assert.equal(cardIndexForCell(0, 1, 22, 6), 6); // row 1 = +cols
    assert.equal(cardIndexForCell(6, 0, 22, 6), 6); // wraps past cols
    assert.equal(cardIndexForCell(0, 4, 22, 6), 2); // 24 % 22
    assert.equal(cardIndexForCell(-1, 0, 22, 6), 21); // negative wraps
  });
});

describe('cellCenter', () => {
  it('returns the lattice-space pixel center of a cell', () => {
    assert.deepEqual(cellCenter(0, 0, 340, 380), { x: 170, y: 190 });
    assert.deepEqual(cellCenter(2, 1, 340, 380), { x: 850, y: 570 });
  });
});

describe('nearestCell', () => {
  it('rounds a camera position to the closest cell', () => {
    assert.deepEqual(nearestCell({ x: 175, y: 188 }, 340, 380), { col: 0, row: 0 });
    assert.deepEqual(nearestCell({ x: 520, y: 190 }, 340, 380), { col: 1, row: 0 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test web-root/src/components/useCaseGrid.test.js`
Expected: FAIL — `Cannot find module './useCaseGrid.js'`.

- [ ] **Step 3: Write the implementation**

Create `web-root/src/components/useCaseGrid.js`:

```js
// Pure geometry for the infinite use-case grid. No DOM, no Vue — unit-testable.

// Map an infinite lattice cell (col, row) to a card index. Wraps for negative
// and large coordinates so the grid repeats forever.
export function cardIndexForCell(col, row, count, cols) {
  const linear = row * cols + col;
  return ((linear % count) + count) % count;
}

// Lattice-space pixel center of a cell.
export function cellCenter(col, row, cellW, cellH) {
  return { x: col * cellW + cellW / 2, y: row * cellH + cellH / 2 };
}

// Lattice cell whose center is closest to a camera position.
export function nearestCell(camera, cellW, cellH) {
  return {
    col: Math.round((camera.x - cellW / 2) / cellW),
    row: Math.round((camera.y - cellH / 2) / cellH),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test web-root/src/components/useCaseGrid.test.js`
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add web-root/src/components/useCaseGrid.js web-root/src/components/useCaseGrid.test.js
git commit -m "feat: add use-case grid lattice mapping and geometry"
```

---

## Task 2: Visible range, arrow stepping, FPO graphic (`useCaseGrid.js`)

**Files:**
- Modify: `web-root/src/components/useCaseGrid.js`
- Test: `web-root/src/components/useCaseGrid.test.js`

- [ ] **Step 1: Add the failing tests**

Append to `web-root/src/components/useCaseGrid.test.js`:

```js
import { visibleCells, stepCell, fpoGraphicStyle } from './useCaseGrid.js';

describe('visibleCells', () => {
  it('returns the cell range intersecting the viewport plus a one-cell margin', () => {
    const bounds = visibleCells(
      { x: 0, y: 0 },
      { width: 1000, height: 800 },
      340,
      380,
      1
    );
    assert.deepEqual(bounds, { colMin: -3, colMax: 2, rowMin: -3, rowMax: 2 });
  });
});

describe('stepCell', () => {
  it('moves one cell per direction and copies on unknown input', () => {
    assert.deepEqual(stepCell({ col: 2, row: 3 }, 'up'), { col: 2, row: 2 });
    assert.deepEqual(stepCell({ col: 2, row: 3 }, 'down'), { col: 2, row: 4 });
    assert.deepEqual(stepCell({ col: 2, row: 3 }, 'left'), { col: 1, row: 3 });
    assert.deepEqual(stepCell({ col: 2, row: 3 }, 'right'), { col: 3, row: 3 });
    assert.deepEqual(stepCell({ col: 2, row: 3 }, 'nope'), { col: 2, row: 3 });
  });
});

describe('fpoGraphicStyle', () => {
  it('returns a deterministic gradient keyed to the card index', () => {
    const a = fpoGraphicStyle(0, 22);
    assert.match(a.background, /linear-gradient/);
    assert.match(a.background, /hsl\(0 /);
    const b = fpoGraphicStyle(11, 22);
    assert.match(b.background, /hsl\(180 /);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test web-root/src/components/useCaseGrid.test.js`
Expected: FAIL — `visibleCells` / `stepCell` / `fpoGraphicStyle` are not exported.

- [ ] **Step 3: Add the implementations**

Append to `web-root/src/components/useCaseGrid.js`:

```js
// Range of cells whose centers fall within the viewport, expanded by a margin
// ring (in cells). Returned bounds are inclusive integer col/row limits.
export function visibleCells(camera, viewport, cellW, cellH, margin = 1) {
  const halfW = viewport.width / 2 + margin * cellW;
  const halfH = viewport.height / 2 + margin * cellH;
  return {
    colMin: Math.floor((camera.x - halfW - cellW / 2) / cellW),
    colMax: Math.ceil((camera.x + halfW - cellW / 2) / cellW),
    rowMin: Math.floor((camera.y - halfH - cellH / 2) / cellH),
    rowMax: Math.ceil((camera.y + halfH - cellH / 2) / cellH),
  };
}

const STEPS = {
  up: { dCol: 0, dRow: -1 },
  down: { dCol: 0, dRow: 1 },
  left: { dCol: -1, dRow: 0 },
  right: { dCol: 1, dRow: 0 },
};

// Move a cell one step in a direction; unknown directions return a copy.
export function stepCell(cell, direction) {
  const step = STEPS[direction] ?? { dCol: 0, dRow: 0 };
  return { col: cell.col + step.dCol, row: cell.row + step.dRow };
}

// Deterministic FPO placeholder gradient for a card index. Swapped for real art
// later via a per-use-case `graphic` field; until then every card looks distinct.
export function fpoGraphicStyle(index, count) {
  const hue = Math.round((index / count) * 360);
  const hue2 = (hue + 40) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue} 70% 52%), hsl(${hue2} 72% 42%))`,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test web-root/src/components/useCaseGrid.test.js`
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add web-root/src/components/useCaseGrid.js web-root/src/components/useCaseGrid.test.js
git commit -m "feat: add visible-range, arrow stepping, and FPO graphic helpers"
```

---

## Task 3: The overlay component (`UseCaseGridOverlay.vue`)

**Files:**
- Create: `web-root/src/components/UseCaseGridOverlay.vue`
- Test: `web-root/src/components/UseCaseGridOverlay.test.js`

- [ ] **Step 1: Write the failing source-level test**

Create `web-root/src/components/UseCaseGridOverlay.test.js`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./UseCaseGridOverlay.vue', import.meta.url), 'utf8');

describe('UseCaseGridOverlay', () => {
  it('consumes the pure grid module and defines the controlled API', () => {
    assert.match(source, /from '\.\/useCaseGrid\.js'/);
    assert.match(source, /cardIndexForCell/);
    assert.match(source, /visibleCells/);
    assert.match(source, /nearestCell/);
    assert.match(source, /stepCell/);
    assert.match(source, /defineEmits\(\['close'\]\)/);
  });

  it('drives motion on requestAnimationFrame with a spring camera', () => {
    assert.match(source, /requestAnimationFrame/);
    assert.match(source, /SPRING_STIFFNESS/);
    assert.match(source, /SPRING_DAMPING/);
  });

  it('supports arrows, click, drag, and scroll', () => {
    assert.match(source, /ArrowUp/);
    assert.match(source, /onPointerDown/);
    assert.match(source, /onWheel/);
  });

  it('is an accessible dialog with an off-screen list and live region', () => {
    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /use-case-grid-a11y-list/);
    assert.match(source, /aria-live="polite"/);
    assert.match(source, /prefers-reduced-motion/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test web-root/src/components/UseCaseGridOverlay.test.js`
Expected: FAIL — `ENOENT` reading `UseCaseGridOverlay.vue`.

- [ ] **Step 3: Create the component**

Create `web-root/src/components/UseCaseGridOverlay.vue`:

```vue
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test web-root/src/components/UseCaseGridOverlay.test.js`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add web-root/src/components/UseCaseGridOverlay.vue web-root/src/components/UseCaseGridOverlay.test.js
git commit -m "feat: add infinite pannable use-case grid overlay"
```

---

## Task 4: Wire the overlay into the hero and remove the old modal

**Files:**
- Modify: `web-root/src/components/HomeHeroSurface.vue`
- Modify: `web-root/src/components/HomeHero.test.js`

- [ ] **Step 1: Update the wiring test (failing)**

In `web-root/src/components/HomeHero.test.js`, replace the test block `it('keeps the surface image, cutout, and chrome copy treatment', ...)`'s final three `doesNotMatch` lines region by adding a new test after it. Insert this new `it(...)` block immediately after the closing `});` of that test (around line 61):

```js
  it('opens the grid overlay instead of the single-card modal', () => {
    assert.match(surfaceSource, /import UseCaseGridOverlay from '\.\/UseCaseGridOverlay\.vue';/);
    assert.match(surfaceSource, /<UseCaseGridOverlay/);
    assert.match(surfaceSource, /:use-cases="heroUseCases"/);
    assert.match(surfaceSource, /@close="closeUseCase"/);
    assert.doesNotMatch(surfaceSource, /home-hero-use-case-modal/);
    assert.doesNotMatch(surfaceSource, /home-hero-use-case-dialog/);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test web-root/src/components/HomeHero.test.js`
Expected: FAIL — `UseCaseGridOverlay` import not found / `home-hero-use-case-modal` still present.

- [ ] **Step 3: Import the overlay component**

In `web-root/src/components/HomeHeroSurface.vue`, add the import alongside the other component imports (just after `import HeroVfxImage from './HeroVfxImage.vue';`):

```js
import UseCaseGridOverlay from './UseCaseGridOverlay.vue';
```

- [ ] **Step 4: Remove the old Escape handler and its listeners**

In `web-root/src/components/HomeHeroSurface.vue`, delete the `handleKeydown` function:

```js
function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeUseCase();
  }
}
```

Then remove its registration in `onMounted` (delete this line):

```js
  window.addEventListener('keydown', handleKeydown);
```

And remove its teardown in `onBeforeUnmount` (delete this line):

```js
  window.removeEventListener('keydown', handleKeydown);
```

(The overlay owns its own `Escape` handling now.)

- [ ] **Step 5: Replace the modal markup with the overlay**

In `web-root/src/components/HomeHeroSurface.vue`, replace the entire second `<Teleport to="body">` block (the one containing `home-hero-use-case-modal` / `home-hero-use-case-dialog`, from `<Teleport to="body">` through its matching `</Teleport>`) with:

```vue
    <UseCaseGridOverlay
      v-if="selectedUseCase"
      :use-cases="heroUseCases"
      :initial-id="selectedUseCaseId"
      @close="closeUseCase"
    />
```

- [ ] **Step 6: Remove the old modal/dialog CSS**

In `web-root/src/components/HomeHeroSurface.vue`, delete these scoped style rules entirely:
- `.home-hero-use-case-modal { … }`
- `.home-hero-use-case-dialog { … }`
- `.home-hero-use-case-dialog h2, .home-hero-use-case-dialog p { … }`
- `.home-hero-use-case-dialog .type-body { … }`
- `.home-hero-use-case-kicker { … }`
- `.home-hero-use-case-close { … }`
- `.home-hero-use-case-close:hover, .home-hero-use-case-close:focus-visible { … }`
- `.home-hero-use-case-close:focus-visible { … }`

And in the `@media (max-width: 760px)` block, delete the `.home-hero-use-case-modal { … }` and `.home-hero-use-case-dialog { … }` overrides.

- [ ] **Step 7: Run the hero test to verify it passes**

Run: `node --test web-root/src/components/HomeHero.test.js`
Expected: PASS — all `HomeHero` tests pass, including the new overlay-wiring test.

- [ ] **Step 8: Run the full suite**

Run: `npm test`
Expected: `useCaseGrid`, `UseCaseGridOverlay`, and `HomeHero` tests all PASS. The two pre-existing `HeroVfxImage.test.js` failures (`localMaskSpeed: 1.72`, `KEN_BURNS_CYCLE_MS = 16800`) remain — they are unrelated WIP and out of scope.

- [ ] **Step 9: Commit**

```bash
git add web-root/src/components/HomeHeroSurface.vue web-root/src/components/HomeHero.test.js
git commit -m "feat: open use-case grid overlay from hero, remove old modal"
```

---

## Manual verification (after Task 4)

On the dev server (`:5174`), click an orbiting use-case pill and confirm:
- The overlay opens centered on that use case, with a small settle-bounce.
- Arrow keys move the selection one card at a time; the camera springs and the centered card grows while neighbors shrink.
- Clicking a card recenters on it; dragging/swiping free-pans and snaps; trackpad/wheel pans and snaps.
- `Esc` and the close button dismiss it; focus returns to the page.
- Resize the window — cards rescale and the selection stays centered.
- With OS "reduce motion" on, selection cuts instantly (no spring/blur) and still works.

---

## Self-Review

**Spec coverage:**
- Replace modal with grid overlay → Task 4. ✓
- Infinite repeating lattice (`COLS = 6`, modulo mapping) → Task 1 (`cardIndexForCell`), Task 3 (component). ✓
- Virtualized visible cells → Task 2 (`visibleCells`), Task 3 (`rebuildCellsIfNeeded`). ✓
- Spring camera + bounce → Task 3 (`tick`, spring constants). ✓
- Per-card scale-by-distance + opacity falloff → Task 3 (`applyTransforms`). ✓
- Arrows / click / drag-swipe / scroll, snap to nearest → Task 3 (`onKeydown`, `onCardClick`, pointer handlers, `onWheel`, `nearestCell`). ✓
- Open centered on clicked card; close via Esc/button with focus restore → Task 3 (`onMounted`, `onBeforeUnmount`, close button). ✓
- Every card shows graphic + title + description → Task 3 template. ✓
- FPO graphic, forward-compatible → Task 2 (`fpoGraphicStyle`); real `graphic` field is a future drop-in. ✓
- Dimmed + blurred hero backdrop → Task 3 CSS. ✓
- Responsive (760/560 steps), touch-tuned → Task 3 (`responsiveMetrics`, `touch-action: none`). ✓
- Accessibility (dialog, aria-hidden lattice, off-screen list, aria-live, focus trap/restore, reduced-motion) → Task 3. ✓
- Tests: pure-function units + source-level wiring → Tasks 1–4. ✓

**Placeholder scan:** No TBD/TODO; all steps contain full code or exact edit instructions. ✓

**Type/name consistency:** `cardIndexForCell`, `cellCenter`, `nearestCell`, `visibleCells`, `stepCell`, `fpoGraphicStyle` signatures match between `useCaseGrid.js`, its tests, and the component's imports/usage. Camera/selection variable names (`camX/camY`, `selCol/selRow`, `targetX/targetY`) are used consistently throughout `tick`/handlers. ✓

**Minor, intentional spec deviations:** the overlay is existence-controlled by the parent `v-if` (matching the prior modal) rather than an `:open` prop, and leave is instant (no exit animation), consistent with the modal it replaces.

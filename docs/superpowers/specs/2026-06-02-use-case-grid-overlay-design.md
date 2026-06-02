# Use Case Grid Overlay — Design

Date: 2026-06-02
Component area: homepage hero (`web-root/src/components/HomeHeroSurface.vue`)

## Overview

Today, clicking one of the orbiting use-case pills in the hero opens a single
modal showing that one use case's title and body. This replaces that with a
full-screen **infinite, pannable grid overlay**: the clicked use case sits
centered and enlarged, every other use case tiles outward in a grid that repeats
forever in all directions, and the "camera" springs from card to card as the
user navigates. Each card shows a graphic (FPO for now), a title, and a
description.

The interaction model: arrow keys move the selection one cell at a time; clicking
a card centers it; drag/touch-swipe and scroll/trackpad free-pan and snap to the
nearest card. Motion is springy with overshoot ("bounce"). The card under the
camera grows; neighbors shrink with distance.

## Goals

- Replace the single-use-case modal with a grid overlay showing all 22 use cases.
- Infinite repeating grid — cards tile in 2D and repeat as the user pans.
- Selected/centered card is large; surrounding cards scale down by distance.
- Navigation by arrow keys, click, drag/swipe, and scroll/trackpad — all snapping
  to the nearest card with a springy, bouncy recenter.
- One consistent experience on desktop and touch/mobile, tuned per breakpoint.
- Every card shows graphic + title + description.

## Non-goals

- Real card artwork. Graphics are deterministic FPO placeholders this round;
  real art drops in later via a single data field.
- Changing the hero orbit behavior, copy, or layout (covered by prior work).
- Deep-linking / routing to a specific use case.

## Architecture & Components

### `UseCaseGridOverlay.vue` (new)
A focused, self-contained component that owns the overlay UI and all runtime
motion/interaction.

- **Props:**
  - `open: Boolean` — whether the overlay is shown.
  - `useCases: Array` — the `heroUseCases` data (id, label, title, body, …).
  - `initialId: String` — the use case to center when opening.
- **Emits:**
  - `close` — user dismissed the overlay (Esc / close button).
- **Responsibilities:** render the virtualized card lattice, run the camera
  spring + per-card scaling on `requestAnimationFrame`, handle arrows / click /
  drag / scroll / snap, manage the dialog semantics (focus trap, restore,
  `aria-live`), and the open/close transitions.

### `useCaseGrid.js` (new, pure module)
No DOM, no Vue — just math, so it is unit-testable in isolation.

- `cardIndexForCell(col, row, count, cols)` → index into `useCases`
  (`(((row * cols + col) % count) + count) % count`).
- `visibleCells(camera, viewport, cell, margin)` → `{ colMin, colMax, rowMin,
  rowMax }` range of cells intersecting the viewport plus a margin ring.
- `nearestCell(camera, cell)` → `{ col, row }` closest to the camera center.
- `stepCell(cell, direction)` → next `{ col, row }` for an arrow press.
- `cellCenter(col, row, cell)` → lattice-space pixel center of a cell.

### `HomeHeroSurface.vue` (modified)
- `openUseCase(id)` now opens the overlay (sets `selectedUseCaseId`,
  `currentPaused = true`) instead of the old modal.
- The `home-hero-use-case-modal` / `home-hero-use-case-dialog` markup and all of
  their scoped CSS (incl. `home-hero-use-case-kicker`, `home-hero-use-case-close`)
  are removed and replaced by `<UseCaseGridOverlay :open=… :use-cases=…
  :initial-id=… @close=closeUseCase />`.
- `currentPaused` keeps freezing the orbit while the overlay is open. `escape`
  handling for the old modal is removed (the overlay owns its own Esc handling).

### Data: FPO graphics
- Each card needs a graphic. For now it is derived deterministically from the
  card's index (a colored gradient block, e.g. hue = `index / count * 360`), so
  every card looks distinct with no new asset files.
- Forward-compatible: if a use case later gains a `graphic` field (an asset URL),
  the card renders that; otherwise it falls back to the FPO block. No structural
  change required to swap in real art.

## The Infinite Lattice

- The grid is a conceptual infinite integer lattice of cells `(col, row)`,
  `col, row ∈ ℤ`.
- Each cell maps to a card: `index = cardIndexForCell(col, row, 22, COLS)` with
  **`COLS = 6`** (tunable). Because `22 % 6 ≠ 0`, the card directly above/below a
  given cell differs by 6, so repeats are offset and the field never reads as
  stacked duplicates.
- A cell's lattice-space center is `(col * CELL_W + CELL_W/2, row * CELL_H +
  CELL_H/2)` where `CELL_W`/`CELL_H` are card size + gap.

### Virtualization
- Animate a continuous **camera** `(camX, camY)` in lattice space.
- Each frame, compute `visibleCells(camera, viewport, cell, margin)` and render
  only those cells (≈30–60 nodes for a typical viewport), in a `v-for` keyed by
  `` `${col},${row}` `` so Vue creates/recycles nodes as cells enter/leave.
- The card layer transform is `translate(viewportCenterX - camX,
  viewportCenterY - camY)`.

## Motion

- One vector spring (the underdamped spring already used by the painting tooltip
  in `HomeHeroSurface.vue`: stiffness ≈ 240, damping ≈ 16 as a starting point,
  retuned for a satisfying bounce) drives `camera → target`.
- **Target sources:**
  - Arrows / click / snap set the target to a cell center → spring overshoots →
    bounce.
  - Drag and scroll write `camera` directly (free pan, no spring); on
    release/idle, target = `nearestCell` center, and the spring settles it in.
- **Per-card scale:** a continuous function of a card's distance `d` (in cells)
  from the camera center — centered card large (~`1.6×`), falling off to ~`0.7×`
  by a couple of cells out. Distance also drives a small opacity/blur falloff
  toward the viewport edges for depth. Because it is a function of live camera
  position, cards grow/shrink smoothly as the camera glides.

## Interaction

- **Open:** overlay mounts already centered on `initialId`'s cell, plays a quick
  scale/fade-in with a small settle-bounce.
- **Arrow keys:** `stepCell` moves the selected cell ±1 in the pressed direction.
  Infinite lattice, so there are no wrap edges to special-case.
- **Click:** centers the *specific clicked cell* (its actual `(col,row)`), so the
  camera pans the short distance to the on-screen card rather than to a far
  repeated instance.
- **Drag / touch-swipe:** pointer events pan the camera 1:1; on pointer-up, snap
  to `nearestCell`.
- **Scroll / trackpad:** wheel `deltaX`/`deltaY` pan the camera; debounced, then
  snap to `nearestCell`.
- **Close:** `Esc` or a fixed close (X) button top-right. No click-outside (the
  grid fills the screen). Focus returns to the originating pill.
- **Pointer vs keyboard split:** the visual lattice cards are pointer-only
  (click/tap/drag) and not keyboard-focusable (`tabindex="-1"`, `aria-hidden`).
  Keyboard users navigate via arrow keys (handled at the dialog level) and the
  off-screen accessible list (see Accessibility), whose buttons center a card on
  Enter/Space. This avoids focusable-but-aria-hidden elements.

## Visual Design

- **Card:** FPO graphic on top (≈16:9 gradient block), then `title`, then
  `description`, on a surface-fill card reusing the existing rounded-corner /
  border / soft-shadow language. Centered card: stronger shadow, full-size type.
  Smaller cards keep the same internal layout, just scaled — so titles/bodies
  stay legible a ring or two out.
- **Backdrop:** dimmed + blurred frozen hero — `rgb(0 0 0 / ~0.45)` +
  `backdrop-filter: blur(10px)` — matching today's modal treatment.

## Responsive

- Card size, cell pitch, and center-scale are driven by values that step down at
  the existing `760px` and `560px` breakpoints.
- On phones: smaller cards, fewer visible neighbors (a center card with partial
  neighbors peeking), swipe to pan, tap to center. Same component and same math,
  smaller numbers.

## Accessibility

- Overlay is `role="dialog" aria-modal="true"`, labelled by the centered card's
  title, with a focus trap and focus-restore to the originating pill on close.
- The repeating visual lattice is `aria-hidden` (decorative and confusing to a
  screen reader). Alongside it, an off-screen accessible list of the 22 real use
  cases renders as buttons, giving SR/keyboard users a clean linear path;
  activating one centers it. Selection changes announce the new title via
  `aria-live="polite"`.
- `prefers-reduced-motion`: spring/bounce and blur-falloff are disabled —
  selection still works, it cuts to the centered card instead of gliding.

## Testing

- **Pure-function unit tests (`node --test`)** on `useCaseGrid.js`:
  - `cardIndexForCell` wraps correctly for negative and large `col`/`row`.
  - `visibleCells` returns the right range for a given camera/viewport/margin.
  - `nearestCell` picks the closest cell to a camera position.
  - `stepCell` moves correctly in all four directions.
- **Source-level test** (matching `HomeHero.test.js` style): `UseCaseGridOverlay`
  is imported and wired into `HomeHeroSurface.vue`, and the old
  `home-hero-use-case-modal` markup/CSS is gone.

## Tunable parameters (single source of truth in the overlay)

- `COLS = 6` — lattice column count (controls repeat offset / variety).
- `CELL_W`, `CELL_H` — card footprint + gap, per breakpoint.
- Spring stiffness/damping — bounce feel.
- Center scale (`~1.6×`) and falloff (`~0.7×`), plus edge opacity/blur falloff.
- Visible-cell `margin` ring size.

## Files

- **New:** `web-root/src/components/UseCaseGridOverlay.vue`
- **New:** `web-root/src/components/useCaseGrid.js`
- **New:** `web-root/src/components/useCaseGrid.test.js`
- **Modified:** `web-root/src/components/HomeHeroSurface.vue` (open overlay, remove
  old modal markup + CSS + Esc handling)
- **Modified:** `web-root/src/components/HomeHero.test.js` (assert overlay wired,
  old modal gone)

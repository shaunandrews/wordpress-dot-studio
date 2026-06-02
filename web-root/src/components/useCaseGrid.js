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
    col: Math.round((camera.x - cellW / 2) / cellW) || 0,
    row: Math.round((camera.y - cellH / 2) / cellH) || 0,
  };
}

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

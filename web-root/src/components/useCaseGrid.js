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

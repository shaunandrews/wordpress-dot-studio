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

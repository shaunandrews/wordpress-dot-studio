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

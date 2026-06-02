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

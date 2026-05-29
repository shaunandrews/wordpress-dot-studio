import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeInterfaces.vue', import.meta.url), 'utf8');

function mediaBlock(maxWidth) {
  const start = source.indexOf(`@media (max-width: ${maxWidth}px)`);
  const next = source.indexOf('@media', start + 1);

  return source.slice(start, next === -1 ? undefined : next);
}

describe('HomeInterfaces', () => {
  it('keeps the rail and interface preview in two columns until narrow viewports', () => {
    const reflowBlock = mediaBlock(1120);
    const narrowBlock = mediaBlock(760);

    assert.match(source, /\.home-interfaces\s*{[^}]*display:\s*grid;/);
    assert.match(
      source,
      /\.home-interfaces\s*{[^}]*grid-template-columns:\s*minmax\(10rem, 16rem\) minmax\(0, 1fr\);/
    );
    assert.doesNotMatch(source, /features:\s*\[/);
    assert.doesNotMatch(source, /v-for="feature in item\.features"/);
    assert.match(source, /summary:/);
    assert.match(source, /href:\s*'\/desktop'/);
    assert.match(source, /href:\s*'\/cli'/);
    assert.match(source, /href:\s*'\/web'/);
    assert.match(source, /class="interface-detail vstack gap-m"/);
    assert.match(source, /<p class="type-body type-xs">{{ item\.summary }}<\/p>/);
    assert.match(source, /class="interface-detail-link type-body type-xs" :href="item\.href">Learn more<\/a>/);
    assert.match(source, /const scrollToInterface = \(key\) => {/);
    assert.match(source, /list\.scrollTo\(\{/);
    assert.match(source, /card\.scrollIntoView\(\{/);
    assert.match(source, /@click\.prevent="scrollToInterface\(item\.key\)"/);
    assert.match(source, /interfacesScroller\?\.addEventListener\('scroll', scheduleActiveUpdate, \{ passive: true \}\);/);
    assert.match(source, /\.interfaces-rail :deep\(\.section-intro-title-line\)\s*{[^}]*white-space:\s*nowrap;/);
    assert.match(
      reflowBlock,
      /\.home-interfaces\s*{[^}]*grid-template-columns:\s*minmax\(10rem, 14rem\) minmax\(0, 1fr\);/
    );
    assert.doesNotMatch(reflowBlock, /flex-direction:\s*column;/);
    assert.match(narrowBlock, /\.home-interfaces\s*{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*overflow-x:\s*clip;/);
    assert.match(narrowBlock, /\.interfaces-nav\s*{[^}]*position:\s*sticky;[^}]*flex-wrap:\s*nowrap;/);
    assert.doesNotMatch(narrowBlock, /\.interfaces-nav\s*{[^}]*overflow-x:\s*auto;/);
    assert.match(narrowBlock, /\.interfaces-list\s*{[^}]*box-sizing:\s*border-box;[^}]*width:\s*calc\(100% \+ \(var\(--space-l\) \* 2\)\);[^}]*max-width:\s*none;[^}]*margin-right:\s*calc\(var\(--space-l\) \* -1\);[^}]*margin-left:\s*calc\(var\(--space-l\) \* -1\);[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory;/);
    assert.match(narrowBlock, /\.interface-card\s*{[^}]*flex:\s*0 0 min\(82vw, 520px\);[^}]*scroll-snap-align:\s*start;/);
    assert.match(narrowBlock, /\.interface-image,\s*\.interface-card :deep\(\.fpo-image\)\s*{[^}]*max-height:\s*min\(48vh, 360px\);/);
  });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeHero.vue', import.meta.url), 'utf8');
const surfaceSource = readFileSync(new URL('./HomeHeroSurface.vue', import.meta.url), 'utf8');
const dataSource = readFileSync(new URL('./homeHeroData.js', import.meta.url), 'utf8');

describe('HomeHero', () => {
  it('renders only the surface hero treatment', () => {
    assert.match(source, /import HomeHeroSurface from '\.\/HomeHeroSurface\.vue';/);
    assert.match(source, /<HomeHeroSurface :painting="selectedPainting"/);
    assert.doesNotMatch(source, /HomeHeroVariation/);
    assert.doesNotMatch(source, /heroVariations/);
    assert.doesNotMatch(source, /selectedHeroVariation/);
    assert.doesNotMatch(source, /home-hero-variation-switcher/);
    assert.doesNotMatch(dataSource, /export const heroVariations/);
  });

  it('rotates hero paintings from the available image assets without rendering a picker', () => {
    assert.match(source, /import \{ computed, onBeforeUnmount, onMounted, ref \} from 'vue';/);
    assert.match(dataSource, /export const paintingOptions = \[/);
    assert.doesNotMatch(dataSource, /painting-abstract-colors\.png\?url/);
    assert.doesNotMatch(dataSource, /id:\s*'abstract'/);
    assert.match(dataSource, /painting-drafting-table\.png\?url/);
    assert.match(dataSource, /painting-fashion-house\.png\?url/);
    assert.match(dataSource, /painting-green-field\.png\?url/);
    assert.match(dataSource, /painting-music-studio\.png\?url/);
    assert.match(dataSource, /painting-dance-studio\.png\?url/);
    assert.match(dataSource, /painting-photo-shoot\.png\?url/);
    assert.match(dataSource, /painting-studio-apartment\.png\?url/);
    assert.match(dataSource, /painting-tv-studio\.png\?url/);
    assert.match(dataSource, /painting-workbench\.png\?url/);
    assert.match(source, /const selectedPainting = computed/);
    assert.match(source, /function advancePainting\(\)/);
    assert.match(source, /autoSwitchTimer = window\.setInterval\(advancePainting, 5200\)/);
    assert.match(source, /window\.clearInterval\(autoSwitchTimer\)/);
    assert.doesNotMatch(source, /class="home-hero-painting-switcher"/);
    assert.doesNotMatch(source, /:aria-pressed="selectedPaintingId === painting\.id"/);
  });

  it('keeps the surface image, cutout, and chrome copy treatment', () => {
    assert.match(surfaceSource, /import HeroVfxImage from '\.\/HeroVfxImage\.vue';/);
    assert.match(surfaceSource, /class="home-hero-surface-art"/);
    assert.match(surfaceSource, /class="home-hero-surface-vfx"/);
    assert.match(surfaceSource, /render-mode="local-pixel"/);
    assert.match(surfaceSource, /class="home-hero-surface-shape"/);
    assert.match(surfaceSource, /<svg viewBox="0 0 1440 520"/);
    assert.match(surfaceSource, /class="home-hero-surface-feather"/);
    assert.match(surfaceSource, /class="home-hero-surface-fill"/);
    assert.match(surfaceSource, /\.home-hero-surface-vfx :deep\(\.hero-vfx-image-effect-source\)/);
    assert.match(surfaceSource, /mix-blend-mode:\s*normal;/);
    assert.match(surfaceSource, /background:\s*var\(--color-chrome-fill\);/);
    assert.match(surfaceSource, /color:\s*var\(--color-chrome-fg\);/);
    assert.match(surfaceSource, /color:\s*var\(--color-chrome-fg-muted\);/);
    assert.doesNotMatch(surfaceSource, /home-hero-copy-panel/);
    assert.doesNotMatch(surfaceSource, /mask-composite:\s*subtract/);
    assert.doesNotMatch(surfaceSource, /box-shadow:\s*0 -20px 54px/);
  });

  it('does not bring back the older experimental hero pieces', () => {
    const combinedSource = [source, surfaceSource].join('\n');

    assert.doesNotMatch(combinedSource, /DotGrid/);
    assert.doesNotMatch(combinedSource, /solutionTitles/);
    assert.doesNotMatch(combinedSource, /solution-card/);
    assert.doesNotMatch(combinedSource, /orbit-field/);
    assert.doesNotMatch(combinedSource, /renderOrbit/);
    assert.doesNotMatch(combinedSource, /home-hero-split/);
    assert.doesNotMatch(combinedSource, /home-hero-classic/);
  });
});

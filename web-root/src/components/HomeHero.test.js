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
    assert.doesNotMatch(dataSource, /painting-green-field\.png\?url/);
    assert.match(dataSource, /painting-music-studio\.png\?url/);
    assert.match(dataSource, /painting-dance-studio\.png\?url/);
    assert.match(dataSource, /painting-photo-shoot\.png\?url/);
    assert.match(dataSource, /painting-studio-apartment\.png\?url/);
    assert.match(dataSource, /painting-tv-studio\.png\?url/);
    assert.match(dataSource, /painting-workbench\.png\?url/);
    assert.match(source, /const selectedPainting = computed/);
    assert.match(source, /function advancePainting\(\)/);
    assert.match(source, /autoSwitchTimer = window\.setInterval\(advancePainting, 12000\)/);
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
    assert.match(surfaceSource, /overflow-x:\s*clip;/);
    assert.match(surfaceSource, /overflow-y:\s*visible;/);
    assert.match(surfaceSource, /color:\s*var\(--color-chrome-fg\);/);
    assert.match(surfaceSource, /color:\s*var\(--color-chrome-fg-muted\);/);
    assert.doesNotMatch(surfaceSource, /home-hero-copy-panel/);
    assert.doesNotMatch(surfaceSource, /mask-composite:\s*subtract/);
    assert.doesNotMatch(surfaceSource, /box-shadow:\s*0 -20px 54px/);
  });

  it('keeps the hero layers responsive on mobile', () => {
    assert.match(surfaceSource, /@media \(max-width: 760px\) \{/);
    assert.match(surfaceSource, /--mobile-art-height:\s*340px;/);
    assert.match(surfaceSource, /align-items:\s*start;/);
    assert.match(surfaceSource, /min-height:\s*auto;/);
    assert.match(surfaceSource, /\.home-hero-surface-art\s*{[^}]*inset:\s*0 0 auto;[^}]*height:\s*calc\(var\(--site-header-height, 0px\) \+ var\(--mobile-art-height\)\);/);
    assert.match(surfaceSource, /\.home-hero-surface-copy\s*{[^}]*width:\s*100%;[^}]*transform:\s*none;/);
    assert.match(surfaceSource, /\.home-hero-surface-mark-wrap\s*{[^}]*position:\s*absolute;[^}]*top:\s*-94px;[^}]*width:\s*clamp\(120px, 34vw, 156px\);[^}]*transform:\s*translateX\(-50%\);/);
    assert.match(surfaceSource, /\.home-hero-surface-copy h1\s*{[^}]*font-size:\s*var\(--font-size-xxxl\);/);
    assert.match(surfaceSource, /\.home-hero-use-case-current\s*{[^}]*top:\s*calc\(var\(--site-header-height, 0px\) \+ 94px\);[^}]*height:\s*calc\(var\(--mobile-art-height\) - 90px\);/);
    assert.match(surfaceSource, /\.home-hero-use-case-drift:nth-child\(n \+ 8\)\s*{[^}]*display:\s*none;/);
    assert.match(surfaceSource, /\.home-hero-use-case\s*{[^}]*max-width:\s*min\(74vw, 22rem\);[^}]*font-size:\s*var\(--font-size-s\);/);
    assert.match(surfaceSource, /@media \(max-width: 560px\)\s*{[\s\S]*?\.home-hero-surface-copy h1\s*{[^}]*max-width:\s*21rem;[^}]*font-size:\s*36px;/);
    assert.doesNotMatch(surfaceSource, /\.home-hero-surface-mark-wrap\s*{[^}]*display:\s*none;/);
    assert.doesNotMatch(surfaceSource, /\.home-hero-use-case-current\s*{[^}]*display:\s*none;/);
    assert.doesNotMatch(surfaceSource, /translateY\(clamp\(36px, 7vh, 60px\)\)/);
  });

  it('opens the grid overlay instead of the single-card modal', () => {
    assert.match(surfaceSource, /import UseCaseGridOverlay from '\.\/UseCaseGridOverlay\.vue';/);
    assert.match(surfaceSource, /<UseCaseGridOverlay/);
    assert.match(surfaceSource, /:use-cases="heroUseCases"/);
    assert.match(surfaceSource, /@close="closeUseCase"/);
    assert.doesNotMatch(surfaceSource, /home-hero-use-case-modal/);
    assert.doesNotMatch(surfaceSource, /home-hero-use-case-dialog/);
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

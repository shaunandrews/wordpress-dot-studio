import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeHero.vue', import.meta.url), 'utf8');

describe('HomeHero', () => {
  it('renders a large Studio icon above the hero heading', () => {
    assert.doesNotMatch(source, /import DotGrid from '\.\/DotGrid\.vue';/);
    assert.doesNotMatch(source, /<DotGrid/);
    assert.match(source, /<section[\s\S]*?class="home-hero/);
    assert.match(source, /\.home-hero\s*{[^}]*position:\s*relative;/);
    assert.match(source, /\.home-hero\s*{[^}]*overflow:\s*hidden;/);
    assert.match(source, /<div class="home-hero-mark">/);
    assert.match(
      source,
      /<InlineSvg :src="studioIconUrl" label="WordPress Studio" preserve-white \/>/
    );
    assert.match(source, /home-hero-mark[\s\S]*?width:\s*clamp\(96px, 12vw, 156px\)/);
  });

  it('does not render or animate the floating solution cards', () => {
    assert.doesNotMatch(source, /solutionTitles/);
    assert.doesNotMatch(source, /solution-card/);
    assert.doesNotMatch(source, /orbit-field/);
    assert.doesNotMatch(source, /renderOrbit/);
    assert.doesNotMatch(source, /requestAnimationFrame/);
    assert.doesNotMatch(source, /ResizeObserver/);
  });

  it('lets the hero painting be switched from the available image assets', () => {
    assert.match(
      source,
      /import \{ computed, onBeforeUnmount, onMounted, ref, watch \} from 'vue';/
    );
    assert.match(source, /const paintingOptions = \[/);
    assert.doesNotMatch(source, /painting-abstract-colors\.png\?url/);
    assert.doesNotMatch(source, /id:\s*'abstract'/);
    assert.match(source, /painting-drafting-table\.png\?url/);
    assert.match(source, /painting-fashion-house\.png\?url/);
    assert.match(source, /painting-green-field\.png\?url/);
    assert.match(source, /painting-music-studio\.png\?url/);
    assert.match(source, /painting-dance-studio\.png\?url/);
    assert.match(source, /painting-photo-shoot\.png\?url/);
    assert.match(source, /painting-studio-apartment\.png\?url/);
    assert.match(source, /painting-tv-studio\.png\?url/);
    assert.match(source, /painting-workbench\.png\?url/);
    assert.match(source, /const selectedPainting = computed/);
    assert.match(source, /function advancePainting\(\)/);
    assert.match(source, /autoSwitchTimer = window\.setInterval\(advancePainting, 5200\)/);
    assert.match(source, /window\.clearInterval\(autoSwitchTimer\)/);
    assert.match(source, /class="home-hero-painting-corner"/);
    assert.match(source, /class="home-hero-painting-switcher"/);
    assert.match(source, /:aria-pressed="selectedPaintingId === painting\.id"/);
    assert.match(source, /<img :src="painting\.src" alt="" loading="lazy" decoding="async" \/>/);
    assert.match(source, /<span class="visually-hidden">\{\{ painting\.label \}\}<\/span>/);
    assert.doesNotMatch(source, />\s*\{\{ painting\.label \}\}\s*<\/button>/);
    assert.match(source, /\.home-hero-painting-switcher\s*{[^}]*flex-wrap:\s*nowrap;/);
    assert.match(source, /\.home-hero-painting-switcher\s*{[^}]*opacity:\s*0;/);
    assert.match(source, /\.home-hero-painting-corner:hover \.home-hero-painting-switcher/);
    assert.match(source, /\.home-hero-painting-switcher button\s*{[^}]*width:\s*38px;/);
  });

  it('updates hero copy contrast against the selected painting', () => {
    assert.match(source, /const heroReadability = ref\(LIGHT_BACKGROUND_READABILITY\)/);
    assert.match(source, /scrim:\s*'rgb\(255 255 255 \/ 0\.4\)'/);
    assert.match(source, /scrim:\s*'rgb\(0 0 0 \/ 0\.42\)'/);
    assert.match(source, /const heroReadabilityStyle = computed/);
    assert.match(source, /function getPaintingLuminance\(src\)/);
    assert.match(source, /function getReadabilityForLuminance\(luminance\)/);
    assert.match(source, /watch\(\s*\(\) => selectedPainting\.value\.src,/);
    assert.match(source, /:style="heroReadabilityStyle"/);
    assert.match(source, /--home-hero-text-color/);
    assert.match(source, /--home-hero-muted-color/);
    assert.match(source, /--home-hero-scrim-color/);
    assert.match(source, /<div class="home-hero-copy vstack gap-l align-center">/);
    assert.match(source, /\.home-hero-copy::before\s*{/);
    assert.match(source, /inset:\s*clamp\(-18px, -2\.2vw, -10px\) clamp\(-52px, -6vw, -24px\)/);
    assert.match(source, /border-radius:\s*clamp\(18px, 2\.8vw, 34px\)/);
    assert.match(source, /linear-gradient\(\s*90deg,\s*transparent 0%,/);
    assert.match(
      source,
      /color-mix\(in srgb, var\(--home-hero-scrim-color\) 76%, transparent\) 18%/
    );
    assert.match(
      source,
      /color-mix\(in srgb, var\(--home-hero-scrim-color\) 76%, transparent\) 82%/
    );
    assert.match(source, /mask-image:\s*linear-gradient\(\s*180deg,\s*transparent 0%,/);
    assert.doesNotMatch(source, /border-radius:\s*999px/);
    assert.doesNotMatch(source, /radial-gradient\(/);
    assert.doesNotMatch(source, /\.home-hero-message::before\s*{/);
    assert.doesNotMatch(source, /border:\s*1px solid[^;]*home-hero-message/);
  });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HeroVfxImage.vue', import.meta.url), 'utf8');
const heroSource = readFileSync(new URL('./HomeHero.vue', import.meta.url), 'utf8');

describe('HeroVfxImage', () => {
  it('does not render the temporary VFX tuning controls', () => {
    assert.doesNotMatch(source, /DEFAULT_VFX_KNOBS/);
    assert.doesNotMatch(source, /vfxKnobs/);
    assert.doesNotMatch(source, /<Teleport to="body">/);
    assert.doesNotMatch(source, /hero-vfx-controls/);
    assert.doesNotMatch(source, /Temp VFX knobs/);
    assert.doesNotMatch(source, /v-model\.number=/);
    assert.doesNotMatch(source, /resetVfxKnobs/);
    assert.doesNotMatch(source, /effectModes/);
    assert.doesNotMatch(source, /v-model="activeMode"/);
    assert.doesNotMatch(source, /HalftoneEffect|ScanlineEffect|VoronoiEffect|BloomEffect/);
  });

  it('animates the pixel effect size with a tiny continuous pulse', () => {
    assert.match(source, /import \{ VFX \} from '@vfx-js\/core';/);
    assert.match(source, /import \{ PixelateEffect \} from '@vfx-js\/effects';/);
    assert.match(source, /const INITIAL_PIXEL_SIZE = 10;/);
    assert.match(source, /const PIXEL_SIZE_AMPLITUDE = 0\.1;/);
    assert.match(source, /const PIXEL_SIZE_CYCLE_MS = 10200;/);
    assert.match(source, /const VFX_SETTINGS = \{/);
    assert.match(source, /pixelSize:\s*INITIAL_PIXEL_SIZE/);
    assert.match(source, /pixelAmplitude:\s*PIXEL_SIZE_AMPLITUDE/);
    assert.match(source, /pixelCycleMs:\s*PIXEL_SIZE_CYCLE_MS/);
    assert.match(
      source,
      /const pixelEffect = new PixelateEffect\(\{ size: INITIAL_PIXEL_SIZE \}\)/
    );
    assert.match(source, /function updatePixelSize\(timestamp\)/);
    assert.match(source, /\(timestamp - motionStart\) \/ VFX_SETTINGS\.pixelCycleMs/);
    assert.match(source, /Math\.sin\(cycle\) \* VFX_SETTINGS\.pixelAmplitude/);
    assert.match(source, /pixelEffect\.setParams\(\{ size: Number\(size\.toFixed\(2\)\) \}\)/);
    assert.match(source, /updatePixelSize\(timestamp\)/);
    assert.doesNotMatch(source, /chooseNextPixelSize/);
    assert.doesNotMatch(source, /pixelTargetSize/);
    assert.match(source, /effect:\s*\[\s*pixelEffect,?\s*\]/);
  });

  it('moves and morphs the liquid mask autonomously instead of following the cursor', () => {
    assert.match(source, /function animateLens\(timestamp\)/);
    assert.match(source, /const liquidBlobs = \[/);
    assert.match(source, /function chooseNextBlobTarget\(blob, timestamp\)/);
    assert.match(source, /function updateLiquidBlob\(blob, timestamp, deltaSeconds, bounds\)/);
    assert.match(source, /const deltaSeconds = Math\.min/);
    assert.match(source, /targetYMax:\s*96/);
    assert.match(source, /blobSpeedMin:\s*4\.2/);
    assert.match(source, /blobSpeedMax:\s*5\.9/);
    assert.match(source, /targetHoldMinMs:\s*13900/);
    assert.match(source, /targetHoldMaxMs:\s*8800/);
    assert.match(source, /radiusScale:\s*155/);
    assert.match(source, /wobbleScale:\s*193/);
    assert.match(source, /breatheMs:\s*1000/);
    assert.match(source, /driftMs:\s*5800/);
    assert.match(source, /flowY:\s*4\.7/);
    assert.match(source, /flowXMs:\s*1500/);
    assert.match(source, /flowYMs:\s*7400/);
    assert.match(
      source,
      /randomBetween\(VFX_SETTINGS\.targetHoldMinMs, VFX_SETTINGS\.targetHoldMaxMs\)/
    );
    assert.match(
      source,
      /randomBetween\(VFX_SETTINGS\.blobSpeedMin \/ 100, VFX_SETTINGS\.blobSpeedMax \/ 100\)/
    );
    assert.match(
      source,
      /randomBetween\(VFX_SETTINGS\.targetXMin \/ 100, VFX_SETTINGS\.targetXMax \/ 100\)/
    );
    assert.match(
      source,
      /randomBetween\(VFX_SETTINGS\.targetYMin \/ 100, VFX_SETTINGS\.targetYMax \/ 100\)/
    );
    assert.match(source, /const step = Math\.min\(distance, blob\.speed \* deltaSeconds\)/);
    assert.match(source, /const easing = Math\.min\(1, 0\.42 \+ distance \* 1\.7\)/);
    assert.match(source, /const radius = blob\.radius \* \(VFX_SETTINGS\.radiusScale \/ 100\)/);
    assert.match(source, /const wobble = blob\.wobble \* \(VFX_SETTINGS\.wobbleScale \/ 100\)/);
    assert.match(
      source,
      /const breathe = Math\.sin\(elapsed \/ VFX_SETTINGS\.breatheMs \+ blob\.phase\)/
    );
    assert.match(
      source,
      /const drift = Math\.cos\(elapsed \/ VFX_SETTINGS\.driftMs \+ blob\.phase \* 1\.3\)/
    );
    assert.match(source, /const flowX =\s*Math\.sin\([\s\S]*VFX_SETTINGS\.flowX \/ 100\)/);
    assert.match(source, /const flowY =\s*Math\.cos\([\s\S]*VFX_SETTINGS\.flowY \/ 100\)/);
    assert.match(source, /radius: 276/);
    assert.match(source, /radius: 218/);
    assert.match(source, /radius: 242/);
    assert.match(source, /animationFrame = window\.requestAnimationFrame\(animateLens\)/);
    assert.match(source, /window\.cancelAnimationFrame\(animationFrame\)/);
    assert.match(source, /Math\.random\(\)/);
    assert.match(source, /--vfx-blob-a-width/);
    assert.match(source, /--vfx-blob-b-width/);
    assert.match(source, /--vfx-blob-c-width/);
    assert.doesNotMatch(source, /easeInOut/);
    assert.doesNotMatch(source, /progress >= 1/);
    assert.doesNotMatch(source, /pointermove/);
    assert.doesNotMatch(source, /function updateLens\(event\)/);
  });

  it('cleans up the VFX instance when the component unmounts', () => {
    assert.match(source, /onBeforeUnmount/);
    assert.match(source, /vfxInstance\?\.remove\(effectSource\.value\)/);
    assert.match(source, /vfxInstance\?\.destroy\(\)/);
  });

  it('opts out of VFX-JS scroll-coupled canvas padding', () => {
    assert.match(source, /scrollPadding:\s*false/);
  });

  it('keeps the source image visible as the stable base layer', () => {
    assert.match(source, /overlay:\s*true/);
    assert.match(source, /const effectSource = ref\(null\)/);
    assert.match(source, /const currentSrc = ref\(props\.src\)/);
    assert.match(source, /const incomingSrc = ref\(null\)/);
    assert.match(source, /watch\(\s*\(\) => props\.src,/);
    assert.match(source, /function preloadImage\(src\)/);
    assert.match(source, /const nextImage = await preloadImage\(nextSrc\)/);
    assert.match(source, /transitionToken/);
    assert.match(source, /function completeTransition\(nextSrc, token\)/);
    assert.match(source, /function renderEffectSource\(timestamp = window\.performance\.now\(\)\)/);
    assert.match(source, /function updateEffectTexture\(\)/);
    assert.match(source, /vfxInstance\.update\(effectSource\.value\)/);
    assert.match(source, /vfxInstance\.add\(effectSource\.value,/);
    assert.doesNotMatch(source, /vfxInstance\.remove\(image\.value\)/);
    assert.match(source, /v-if="incomingSrc"/);
    assert.match(source, /:src="currentSrc"/);
    assert.match(source, /:src="incomingSrc"/);
    assert.match(source, /<canvas\s+ref="effectSource"/);
    assert.match(source, /incomingSrc\.value = nextSrc/);
    assert.match(source, /currentSrc\.value = nextSrc/);
    assert.match(source, /incomingSrc\.value = null/);
    assert.match(source, /effectTransition = \{/);
    assert.match(source, /drawPainting\(context, effectTransition\.fromImage, 1 - progress\)/);
    assert.match(source, /drawPainting\(context, effectTransition\.toImage, progress\)/);
    assert.match(
      source,
      /\.hero-vfx-image :deep\(canvas\)\s*{[\s\S]*?opacity:\s*var\(--vfx-lens-opacity\);/
    );
    assert.match(source, /\.hero-vfx-image-effect-source\s*{[\s\S]*?opacity:\s*0;/);
    assert.match(source, /animation:\s*hero-image-fade-in 720ms ease forwards;/);
  });

  it('preloads candidate images before transitions need them', () => {
    assert.match(source, /sources:\s*\{/);
    assert.match(source, /function warmImageCache\(\)/);
    assert.match(source, /props\.sources\.forEach\(\(source\) => preloadImage\(source\)\)/);
    assert.match(source, /warmImageCache\(\)/);
  });

  it('bounds transition texture work and cancels stale incoming frames', () => {
    assert.match(source, /const MAX_EFFECT_PIXEL_WIDTH = 1400;/);
    assert.match(source, /const EFFECT_RENDER_SCALE = 0\.55;/);
    assert.match(
      source,
      /Math\.min\(\s*window\.devicePixelRatio \|\| 1,\s*MAX_EFFECT_PIXEL_WIDTH \/ Math\.max\(bounds\.width, 1\),\s*EFFECT_RENDER_SCALE\s*\)/
    );
    assert.match(
      source,
      /incomingSrc\.value = null;\s*effectTransition = null;\s*sourceNeedsUpdate = true;/
    );
  });

  it('keeps lens coordinates local to the hero and respects reduced motion', () => {
    assert.match(
      source,
      /const prefersReducedMotion = window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/
    );
    assert.match(source, /if \(prefersReducedMotion\.matches\) \{/);
    assert.match(source, /`\$\{bounds\.width \* blob\.x \+ flowX\}px`/);
    assert.match(source, /`\$\{bounds\.height \* blob\.y \+ flowY\}px`/);
    assert.doesNotMatch(source, /bounds\.left \+ bounds\.width \* blob\.x/);
    assert.doesNotMatch(source, /bounds\.top \+ bounds\.height \* blob\.y/);
  });

  it('reveals the pixel effect only inside the animated liquid mask', () => {
    assert.match(source, /zIndex:\s*3/);
    assert.match(source, /\.hero-vfx-image-incoming\s*{[\s\S]*?z-index:\s*1;/);
    assert.match(
      source,
      /root\.value\.style\.setProperty\(`--vfx-blob-\$\{blob\.id\}-x`, `\$\{bounds\.width \* blob\.x \+ flowX\}px`\)/
    );
    assert.match(
      source,
      /root\.value\.style\.setProperty\(`--vfx-blob-\$\{blob\.id\}-y`, `\$\{bounds\.height \* blob\.y \+ flowY\}px`\)/
    );
    assert.match(
      source,
      /root\.value\.style\.setProperty\(`--vfx-blob-\$\{blob\.id\}-width`, `\$\{width\}px`\)/
    );
    assert.match(
      source,
      /root\.value\.style\.setProperty\(`--vfx-blob-\$\{blob\.id\}-height`, `\$\{height\}px`\)/
    );
    assert.match(source, /root\.value\.style\.setProperty\('--vfx-lens-opacity', '1'\)/);
    assert.match(source, /pointer-events:\s*none;/);
    assert.match(
      source,
      /mask-image:\s*radial-gradient\(\s*ellipse var\(--vfx-blob-a-width\) var\(--vfx-blob-a-height\) at var\(--vfx-blob-a-x\)\s*var\(--vfx-blob-a-y\),/
    );
    assert.match(
      source,
      /ellipse var\(--vfx-blob-b-width\) var\(--vfx-blob-b-height\) at var\(--vfx-blob-b-x\)\s*var\(--vfx-blob-b-y\),/
    );
    assert.match(
      source,
      /ellipse var\(--vfx-blob-c-width\) var\(--vfx-blob-c-height\) at var\(--vfx-blob-c-x\)\s*var\(--vfx-blob-c-y\),/
    );
    assert.match(source, /transparent 100%/);
  });
});

describe('HomeHero', () => {
  it('renders the VFX hero image behind the hero content', () => {
    assert.match(heroSource, /import HeroVfxImage from '\.\/HeroVfxImage\.vue';/);
    assert.doesNotMatch(heroSource, /import DotGrid from '\.\/DotGrid\.vue';/);
    assert.doesNotMatch(heroSource, /<DotGrid/);
    assert.match(
      heroSource,
      /<HeroVfxImage\s+:src="selectedPainting\.src"\s+:sources="paintingSources"\s+class="home-hero-vfx"/
    );
    assert.doesNotMatch(heroSource, /:key="selectedPainting\.id"/);
    assert.doesNotMatch(heroSource, /\.home-hero::before\s*{/);
    assert.doesNotMatch(heroSource, /radial-gradient\(circle, #000 0 1px, transparent 1\.4px\)/);
  });

  it('renders a painting switcher for the available hero images', () => {
    assert.match(heroSource, /const paintingOptions = \[/);
    assert.doesNotMatch(heroSource, /painting-abstract-colors\.png\?url/);
    assert.doesNotMatch(heroSource, /id:\s*'abstract'/);
    assert.match(heroSource, /painting-drafting-table\.png\?url/);
    assert.match(heroSource, /painting-fashion-house\.png\?url/);
    assert.match(heroSource, /painting-green-field\.png\?url/);
    assert.match(heroSource, /painting-music-studio\.png\?url/);
    assert.match(heroSource, /painting-dance-studio\.png\?url/);
    assert.match(heroSource, /painting-photo-shoot\.png\?url/);
    assert.match(heroSource, /painting-studio-apartment\.png\?url/);
    assert.match(heroSource, /painting-workbench\.png\?url/);
    assert.match(heroSource, /class="home-hero-painting-switcher"/);
    assert.match(heroSource, /class="home-hero-painting-corner"/);
    assert.match(heroSource, /v-for="painting in paintingOptions"/);
    assert.match(heroSource, /@click="selectedPaintingId = painting\.id"/);
    assert.match(
      heroSource,
      /<img :src="painting\.src" alt="" loading="lazy" decoding="async" \/>/
    );
    assert.match(heroSource, /<span class="visually-hidden">\{\{ painting\.label \}\}<\/span>/);
    assert.match(heroSource, /\.home-hero-painting-switcher\s*{[^}]*flex-wrap:\s*nowrap;/);
    assert.match(heroSource, /\.home-hero-painting-switcher\s*{[^}]*opacity:\s*0;/);
    assert.match(heroSource, /\.home-hero-painting-corner:hover \.home-hero-painting-switcher/);
  });
});

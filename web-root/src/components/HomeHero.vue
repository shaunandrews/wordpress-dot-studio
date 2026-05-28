<!--
@component HomeHero
@description Renders the landing page hero with the Studio mark, core message, and background treatment.
@notes Consumes the site header height custom property so hero spacing accounts for the fixed header.
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Button from './Button.vue';
import HeroVfxImage from './HeroVfxImage.vue';
import InlineSvg from './InlineSvg.vue';
import danceStudioPaintingUrl from '../../assets/painting-dance-studio.png?url';
import draftingPaintingUrl from '../../assets/painting-drafting-table.png?url';
import fashionPaintingUrl from '../../assets/painting-fashion-house.png?url';
import fieldPaintingUrl from '../../assets/painting-green-field.png?url';
import musicStudioPaintingUrl from '../../assets/painting-music-studio.png?url';
import photoShootPaintingUrl from '../../assets/painting-photo-shoot.png?url';
import studioApartmentPaintingUrl from '../../assets/painting-studio-apartment.png?url';
import tvStudioPaintingUrl from '../../assets/painting-tv-studio.png?url';
import workbenchPaintingUrl from '../../assets/painting-workbench.png?url';
import studioIconUrl from '../../assets/studio-icon.svg?url';

const LIGHT_BACKGROUND_READABILITY = {
  text: 'rgb(0 0 0)',
  muted: 'rgb(48 48 48 / 0.86)',
  scrim: 'rgb(255 255 255 / 0.4)',
  shadow: 'rgb(255 255 255 / 0.5)',
};
const DARK_BACKGROUND_READABILITY = {
  text: 'rgb(255 255 255)',
  muted: 'rgb(255 255 255 / 0.82)',
  scrim: 'rgb(0 0 0 / 0.42)',
  shadow: 'rgb(0 0 0 / 0.46)',
};

const paintingOptions = [
  { id: 'drafting', label: 'Drafting', src: draftingPaintingUrl },
  { id: 'fashion', label: 'Fashion house', src: fashionPaintingUrl },
  { id: 'field', label: 'Field', src: fieldPaintingUrl },
  { id: 'music-studio', label: 'Music studio', src: musicStudioPaintingUrl },
  { id: 'dance-studio', label: 'Dance studio', src: danceStudioPaintingUrl },
  { id: 'photo-shoot', label: 'Photo shoot', src: photoShootPaintingUrl },
  { id: 'studio-apartment', label: 'Studio apartment', src: studioApartmentPaintingUrl },
  { id: 'tv-studio', label: 'TV studio', src: tvStudioPaintingUrl },
  { id: 'workbench', label: 'Workbench', src: workbenchPaintingUrl },
];

const selectedPaintingId = ref(paintingOptions[0].id);
const selectedPainting = computed(
  () =>
    paintingOptions.find((painting) => painting.id === selectedPaintingId.value) ??
    paintingOptions[0]
);
const paintingSources = paintingOptions.map((painting) => painting.src);
const heroReadability = ref(LIGHT_BACKGROUND_READABILITY);
const heroReadabilityStyle = computed(() => ({
  '--home-hero-text-color': heroReadability.value.text,
  '--home-hero-muted-color': heroReadability.value.muted,
  '--home-hero-scrim-color': heroReadability.value.scrim,
  '--home-hero-shadow-color': heroReadability.value.shadow,
}));
let autoSwitchTimer = 0;
let readabilityToken = 0;

function getLinearChannel(value) {
  const channel = value / 255;

  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(red, green, blue) {
  return (
    0.2126 * getLinearChannel(red) +
    0.7152 * getLinearChannel(green) +
    0.0722 * getLinearChannel(blue)
  );
}

function getContrastRatio(first, second) {
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

function getReadabilityForLuminance(luminance) {
  const darkTextContrast = getContrastRatio(luminance, 0);
  const lightTextContrast = getContrastRatio(luminance, 1);

  return darkTextContrast >= lightTextContrast
    ? LIGHT_BACKGROUND_READABILITY
    : DARK_BACKGROUND_READABILITY;
}

function getPaintingLuminance(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = 'async';
    image.onload = async () => {
      try {
        if (image.decode) {
          await image.decode();
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = 40;
        canvas.height = 24;

        if (!context) {
          reject(new Error('Could not sample hero painting'));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(8, 7, 24, 10).data;
        let luminance = 0;
        const pixelCount = imageData.length / 4;

        for (let index = 0; index < imageData.length; index += 4) {
          luminance += getRelativeLuminance(
            imageData[index],
            imageData[index + 1],
            imageData[index + 2]
          );
        }

        resolve(luminance / pixelCount);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = src;
  });
}

async function updateHeroReadability(src) {
  const token = ++readabilityToken;

  try {
    const luminance = await getPaintingLuminance(src);

    if (token === readabilityToken) {
      heroReadability.value = getReadabilityForLuminance(luminance);
    }
  } catch {
    if (token === readabilityToken) {
      heroReadability.value = LIGHT_BACKGROUND_READABILITY;
    }
  }
}

function advancePainting() {
  const currentIndex = paintingOptions.findIndex(
    (painting) => painting.id === selectedPaintingId.value
  );
  const nextIndex = (currentIndex + 1) % paintingOptions.length;
  selectedPaintingId.value = paintingOptions[nextIndex].id;
}

onMounted(() => {
  autoSwitchTimer = window.setInterval(advancePainting, 5200);
});

onBeforeUnmount(() => {
  readabilityToken += 1;
  window.clearInterval(autoSwitchTimer);
});

watch(
  () => selectedPainting.value.src,
  (src) => {
    updateHeroReadability(src);
  },
  { immediate: true }
);
</script>

<template>
  <section
    class="home-hero vstack gap-xl w-full align-center justify-center p-xl"
    aria-label="WordPress Studio overview"
  >
    <HeroVfxImage :src="selectedPainting.src" :sources="paintingSources" class="home-hero-vfx" />

    <div class="home-hero-message vstack gap-l align-center" :style="heroReadabilityStyle">
      <div class="home-hero-mark">
        <InlineSvg :src="studioIconUrl" label="WordPress Studio" preserve-white />
      </div>

      <div class="home-hero-copy vstack gap-l align-center">
        <h1 class="type-display type-xxxxl">One place for the work around WordPress</h1>
        <p class="type-body type-l">
          Spin up local sites, share previews, sync hosted work, automate the boring parts, and hand
          bigger tasks to agents without rebuilding your workflow every time.
        </p>
        <div class="home-hero-actions hstack gap-m">
          <Button variant="primary" href="/download">Download for macOS</Button>
          <code>npm install -g wp-studio@latest</code>
        </div>
      </div>
    </div>

    <div class="home-hero-painting-corner">
      <div class="home-hero-painting-switcher" aria-label="Hero painting">
        <button
          v-for="painting in paintingOptions"
          :key="painting.id"
          type="button"
          :aria-pressed="selectedPaintingId === painting.id"
          @click="selectedPaintingId = painting.id"
        >
          <img :src="painting.src" alt="" loading="lazy" decoding="async" />
          <span class="visually-hidden">{{ painting.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: calc(var(--site-header-height, 0px) + var(--space-l));
  padding-bottom: clamp(var(--space-l), 6vh, var(--space-xl));
  min-height: 58dvh;
  text-align: center;
}

.home-hero-vfx {
  z-index: 0;
}

.home-hero-message {
  color: var(--home-hero-text-color);
  position: relative;
  z-index: 2;
  max-width: 820px;
  padding: clamp(10px, 2.2vw, 28px) clamp(16px, 3.4vw, 44px);
  text-shadow: 0 1px 18px var(--home-hero-shadow-color);
  transition:
    color 260ms ease,
    text-shadow 260ms ease;

  p {
    color: var(--home-hero-muted-color);
    transition: color 260ms ease;
  }
}

.home-hero-copy {
  position: relative;
  isolation: isolate;
}

.home-hero-copy::before {
  position: absolute;
  z-index: -1;
  inset: clamp(-18px, -2.2vw, -10px) clamp(-52px, -6vw, -24px);
  border-radius: clamp(18px, 2.8vw, 34px);
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--home-hero-scrim-color) 76%, transparent) 18%,
    var(--home-hero-scrim-color) 38%,
    var(--home-hero-scrim-color) 62%,
    color-mix(in srgb, var(--home-hero-scrim-color) 76%, transparent) 82%,
    transparent 100%
  );
  content: '';
  filter: blur(6px);
  mask-image: linear-gradient(180deg, transparent 0%, #000 10%, #000 88%, transparent 100%);
  transition: background 260ms ease;
}

.home-hero-mark {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: clamp(96px, 12vw, 156px);
  aspect-ratio: 1;
  margin-bottom: var(--space-s);
  filter: drop-shadow(0 22px 36px rgb(0 0 0 / 0.16))
    drop-shadow(0 0 26px color-mix(in srgb, var(--color-theme-fill-highlight) 36%, transparent));
}

.home-hero-mark :deep(.inline-svg),
.home-hero-mark :deep(.inline-svg svg) {
  width: 100%;
  height: 100%;
}

.home-hero-actions {
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.home-hero-actions code {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: var(--space-m) var(--space-l);
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 76%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  color: var(--color-chrome-fg-muted);
  font-size: var(--font-size-s);
}

.home-hero-painting-corner {
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  display: grid;
  align-items: end;
  justify-items: start;
  width: min(360px, 72vw);
  height: 96px;
  padding: clamp(12px, 2vw, 28px);
}

.home-hero-painting-switcher {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  max-width: calc(100% - 24px);
  padding: 4px;
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 72%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-chrome-fill) 88%, transparent);
  box-shadow: 0 12px 34px rgb(0 0 0 / 0.12);
  overflow-x: auto;
  opacity: 0;
  scrollbar-width: none;
  transform: translateY(10px);
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.home-hero-painting-switcher::-webkit-scrollbar {
  display: none;
}

.home-hero-painting-corner:hover .home-hero-painting-switcher,
.home-hero-painting-corner:focus-within .home-hero-painting-switcher {
  opacity: 1;
  transform: translateY(0);
}

.home-hero-painting-switcher button {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 38px;
  aspect-ratio: 4 / 3;
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
}

.home-hero-painting-switcher button[aria-pressed='true'] {
  border-color: color-mix(
    in srgb,
    var(--color-theme-fill-highlight) 72%,
    var(--color-chrome-border)
  );
  background: color-mix(in srgb, var(--color-theme-fill-highlight) 16%, canvas 84%);
}

.home-hero-painting-switcher img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 1120px) {
  .home-hero {
    padding-inline: var(--space-xl);
  }
}

@media (max-width: 760px) {
  .home-hero {
    padding-inline: var(--space-l);
  }

  .home-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .home-hero-actions :deep(.button) {
    width: 100%;
  }

  .home-hero-actions code {
    width: 100%;
    justify-content: center;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .home-hero-painting-corner {
    right: 0;
    width: auto;
    padding: 12px;
  }

  .home-hero-painting-switcher {
    justify-content: flex-start;
    max-width: none;
  }
}
</style>

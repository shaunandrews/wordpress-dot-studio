<!--
@component HomeDownload
@description Renders the landing page download and signup options for desktop apps, CLI, and web access.
@notes Download card data lives locally because this section is static marketing content.
-->
<script setup>
import Button from './Button.vue';
import CommandLineCopy from './CommandLineCopy.vue';
import downloadCardCli from '../../assets/download-card-cli.webp';
import downloadCardLinux from '../../assets/download-card-linux.webp';
import downloadCardMacos from '../../assets/download-card-macos.webp';
import downloadCardWeb from '../../assets/download-card-web.webp';
import downloadCardWindows from '../../assets/download-card-windows.webp';
import iconMacosFinder from '../../assets/icon-macos-finder.svg?url';
import platformWindows from '../../assets/platform-windows.svg?url';

const downloads = [
  {
    title: 'macOS',
    body: 'Apple Silicon and Intel',
    cta: 'Download for macOS',
    ctaHref: '/download',
    icon: iconMacosFinder,
    background: downloadCardMacos,
    cardTheme: 'dark',
    cardTone: 'macos',
  },
  {
    title: 'Windows',
    body: 'Windows 10 and 11',
    cta: 'Download for Windows',
    ctaHref: '/download',
    icon: platformWindows,
    iconClass: 'platform-icon-windows',
    background: downloadCardWindows,
    cardTheme: 'dark',
  },
  {
    title: 'Linux',
    body: 'Debian and RPM packages',
    cta: 'Download for Linux',
    ctaHref: '/download',
    iconSymbol: 'linux',
    background: downloadCardLinux,
    cardTheme: 'dark',
    cardTone: 'linux',
  },
  {
    title: 'CLI',
    body: 'Via Node Package Manager',
    command: 'npm install -g wordpress-studio',
    iconSymbol: 'terminal',
    background: downloadCardCli,
    cardTheme: 'dark',
  },
  {
    title: 'Web',
    body: 'Access anywhere at',
    href: 'https://wordpress.studio',
    linkLabel: 'wordpress.studio',
    cta: 'Get started',
    ctaHref: '/signup',
    iconSymbol: 'globe',
    background: downloadCardWeb,
    cardTheme: 'light',
  },
];
</script>

<template>
  <section class="home-download px-l">
    <h2 class="type-heading type-xxl">Start your Studio today</h2>
    <p class="type-body type-l">
      Download the desktop app, install the CLI, or create an account on the web.
    </p>

    <div class="download-options hstack gap-l">
      <article
        v-for="item in downloads"
        :key="item.title"
        class="download-card vstack gap-m"
        :class="[
          `download-card-${item.cardTheme}`,
          item.cardTone && `download-card-${item.cardTone}`,
        ]"
        :style="{ '--download-card-bg': `url(${item.background})` }"
      >
        <div v-if="item.iconSymbol" class="platform-sketch-icon" aria-hidden="true">
          <svg
            v-if="item.iconSymbol === 'terminal'"
            viewBox="0 0 64 64"
            focusable="false"
            class="platform-sketch-icon-terminal"
          >
            <rect x="9" y="12" width="46" height="40" rx="13" />
            <path d="m21 24 10 8-10 8" />
            <path d="M35 40h12" />
          </svg>
          <svg
            v-else-if="item.iconSymbol === 'linux'"
            viewBox="0 0 64 64"
            focusable="false"
            class="platform-sketch-icon-linux"
          >
            <path d="M22 40c-5 3-8 7-8 12" />
            <path d="M42 40c5 3 8 7 8 12" />
            <path d="M21 36c0-15 5-24 11-24s11 9 11 24" />
            <path d="M22 38c3 7 17 7 20 0" />
            <path d="M27 25h.1" />
            <path d="M37 25h.1" />
            <path d="M29 32c2 2 4 2 6 0" />
          </svg>
          <svg v-else viewBox="0 0 64 64" focusable="false" class="platform-sketch-icon-globe">
            <circle cx="32" cy="32" r="22" />
            <path d="M14 34c5-5 10-5 14-1 3 3 1 6-3 7-5 1-7 3-8 7" />
            <path d="M26 12c-2 8-1 13 4 14 4 1 8-3 11 0s-2 7 1 11c2 3 6 3 10 0" />
            <path d="M47 16c-2 7-1 13 5 18" />
          </svg>
        </div>
        <img
          v-else
          class="platform-icon"
          :class="item.iconClass"
          :src="item.icon"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
        <h3 class="type-heading type-l">{{ item.title }}</h3>
        <p v-if="item.href" class="type-body type-s">
          {{ item.body }} <a :href="item.href">{{ item.linkLabel }}</a>
        </p>
        <p v-else class="type-body type-s">{{ item.body }}</p>
        <CommandLineCopy v-if="item.command" :command="item.command" />
        <Button v-else :href="item.ctaHref">{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-download {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  max-width: 960px;
  margin: auto;
}

.download-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);
}

.download-card {
  --download-icon-slot-size: 40px;
  --download-card-fg: var(--color-chrome-fg);
  --download-card-muted: var(--color-chrome-fg);
  --download-card-control-fill: rgb(255 255 255 / 0.62);
  --download-card-control-border: rgb(0 0 0 / 0.18);
  --download-card-control-hover-fill: rgb(255 255 255 / 0.82);
  --download-card-control-hover-border: rgb(0 0 0 / 0.34);
  --download-card-control-hover-fg: var(--download-card-fg);
  --download-card-control-hover-ring: rgb(0 0 0 / 0.12);
  --download-card-image-opacity: 1;
  --download-card-shadow: rgb(255 255 255 / 0.46);

  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: var(--space-l);
  border: 1px dashed var(--color-chrome-border);
  border-radius: var(--space-m);
  color: var(--download-card-fg);
}

.download-card::before,
.download-card::after {
  position: absolute;
  content: '';
  pointer-events: none;
}

.download-card::before {
  inset: 0;
  background-image: var(--download-card-bg);
  background-position: center;
  background-size: cover;
  opacity: var(--download-card-image-opacity);
}

.download-card::after {
  inset: 0;
  background: linear-gradient(90deg, rgb(0 0 0 / 0.44), rgb(0 0 0 / 0.08));
}

.download-card-light {
  --download-card-fg: #050505;
  --download-card-muted: #111;
}

.download-card-light::after {
  background:
    linear-gradient(90deg, rgb(255 255 255 / 0.58), rgb(255 255 255 / 0.22)),
    linear-gradient(180deg, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.48));
}

.download-card-macos::after {
  background: linear-gradient(90deg, rgb(0 0 0 / 0.46), rgb(0 0 0 / 0.12));
}

.download-card-dark {
  --download-card-fg: #fff;
  --download-card-muted: rgb(255 255 255 / 0.88);
  --download-card-control-fill: rgb(0 0 0 / 0.3);
  --download-card-control-border: rgb(255 255 255 / 0.34);
  --download-card-control-hover-fill: rgb(255 255 255 / 0.16);
  --download-card-control-hover-border: rgb(255 255 255 / 0.72);
  --download-card-control-hover-fg: #fff;
  --download-card-control-hover-ring: rgb(255 255 255 / 0.18);
  --download-card-shadow: rgb(0 0 0 / 0.34);
  border-color: rgb(255 255 255 / 0.34);
  text-shadow: 0 1px 8px rgb(0 0 0 / 0.4);
}

.download-card-linux::before {
  background-position: center 58%;
}

.download-card > * {
  position: relative;
  z-index: 1;
}

.download-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.download-card p,
.download-card a {
  color: var(--download-card-muted);
}

.download-card :deep(.button),
.download-card :deep(.command-line-copy-field) {
  border-color: var(--download-card-control-border);
  background: var(--download-card-control-fill);
  box-shadow: 0 1px 12px var(--download-card-shadow);
}

.download-card :deep(.button) {
  color: var(--download-card-fg);
}

.download-card :deep(.button:hover),
.download-card :deep(.button:focus-visible) {
  --button-dash-color: var(--download-card-control-hover-border);

  background: var(--download-card-control-hover-fill);
  color: var(--download-card-control-hover-fg);
  box-shadow: 0 0 0 3px var(--download-card-control-hover-ring);
}

.download-card :deep(.command-line-copy) {
  --command-line-copy-hover-border: var(--download-card-control-hover-border);
  --command-line-copy-hover-fg: var(--download-card-control-hover-fg);
  --command-line-copy-hover-ring: var(--download-card-control-hover-ring);
  --command-line-copy-button-hover-bg: var(--download-card-control-hover-fill);
  --command-line-copy-button-hover-fg: var(--download-card-control-hover-fg);

  color: var(--download-card-fg);
}

.platform-icon {
  width: var(--download-icon-slot-size);
  height: var(--download-icon-slot-size);
  margin-bottom: var(--space-s);
}

.platform-icon {
  display: block;
  max-width: 32px;
  max-height: 32px;
  object-fit: contain;
}

.platform-icon-windows {
  max-width: 28px;
  max-height: 28px;
}

.platform-sketch-icon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--download-icon-slot-size);
  height: var(--download-icon-slot-size);
  margin-bottom: var(--space-s);
  color: var(--download-card-fg);
}

.platform-sketch-icon svg {
  width: 34px;
  height: 34px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.platform-sketch-icon-terminal {
  stroke-width: 5;
}

.platform-sketch-icon-linux {
  stroke-width: 4;
}

.platform-sketch-icon-globe {
  stroke-width: 4;
}

@media (max-width: 760px) {
  .download-options {
    grid-template-columns: 1fr;
  }

  .download-card:last-child:nth-child(odd) {
    grid-column: auto;
  }
}
</style>

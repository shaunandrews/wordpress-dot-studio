<!--
@component HomeDownload
@description Renders the landing page download and signup options for desktop apps, CLI, and web access.
@notes Download card data lives locally because this section is static marketing content.
-->
<script setup>
import Button from './Button.vue';
import browserFirefox from '../../assets/browser-firefox.svg?url';
import browserChrome from '../../assets/browser-google-chrome.svg?url';
import browserSafari from '../../assets/browser-safari.svg?url';
import iconMacosFinder from '../../assets/icon-macos-finder.svg?url';
import iconTerminal from '../../assets/icon-terminal.svg?url';
import platformWindows from '../../assets/platform-windows.svg?url';

const webBrowsers = [
  { name: 'Chrome', icon: browserChrome },
  { name: 'Firefox', icon: browserFirefox },
  { name: 'Safari', icon: browserSafari },
];

const downloads = [
  {
    title: 'macOS',
    body: 'Apple Silicon and Intel',
    cta: 'Download for macOS',
    ctaHref: '/download',
    icon: iconMacosFinder,
  },
  {
    title: 'Windows',
    body: 'Windows 10 and 11',
    cta: 'Download for Windows',
    ctaHref: '/download',
    icon: platformWindows,
  },
  {
    title: 'CLI',
    body: 'Via Node Package Manager',
    command: 'npm install -g wordpress-studio',
    icon: iconTerminal,
  },
  {
    title: 'Web',
    body: 'Access anywhere at',
    href: 'https://wordpress.studio',
    linkLabel: 'wordpress.studio',
    cta: 'Get started',
    ctaHref: '/signup',
    browsers: webBrowsers,
  },
];
</script>

<template>
  <section class="home-download px-l">
    <h2 class="type-heading type-xxl">Start your Studio today</h2>
    <p class="type-body type-l">Download the desktop app, install the CLI, or create an account on the web.</p>

    <div class="download-options hstack gap-l">
      <article v-for="item in downloads" :key="item.title" class="download-card vstack gap-m">
        <div v-if="item.browsers" class="platform-browser-stack" aria-label="Chrome, Firefox, and Safari">
          <img
            v-for="browser in item.browsers"
            :key="browser.name"
            :src="browser.icon"
            :alt="browser.name"
            loading="lazy"
          />
        </div>
        <img v-else class="platform-icon" :src="item.icon" alt="" loading="lazy" aria-hidden="true" />
        <h3 class="type-heading type-l">{{ item.title }}</h3>
        <p v-if="item.href" class="type-body type-s">
          {{ item.body }} <a :href="item.href">{{ item.linkLabel }}</a>
        </p>
        <p v-else class="type-body type-s">{{ item.body }}</p>
        <div v-if="item.command" class="command-rail">
          <code data-install-command>{{ item.command }}</code>
          <Button :data-copy="item.command">Copy</Button>
        </div>
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
  max-width: 680px;
  margin: auto;
}

.download-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);
}

.download-card {
  min-width: 0;
  padding: var(--space-l);
  border: 1px dashed var(--color-chrome-border);
  border-radius: var(--space-m);
}

.platform-icon,
.platform-browser-stack {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-s);
}

.platform-icon {
  display: block;
  object-fit: contain;
}

.platform-browser-stack {
  position: relative;
}

.platform-browser-stack img {
  position: absolute;
  display: block;
  width: 38px;
  height: 38px;
  padding: var(--space-s);
  border: 1px solid var(--color-chrome-border);
  border-radius: 50%;
  background: var(--color-chrome-fill);
  object-fit: contain;
}

.platform-browser-stack img:nth-child(1) {
  left: 0;
  top: 14px;
  z-index: 3;
}

.platform-browser-stack img:nth-child(2) {
  left: 20px;
  top: 0;
  z-index: 2;
}

.platform-browser-stack img:nth-child(3) {
  left: 26px;
  top: 26px;
  z-index: 1;
}

.command-rail {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  align-items: center;
}

.command-rail code {
  min-width: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-mono);
  font-size: var(--font-size-s);
}

@media (max-width: 760px) {
  .download-options {
    grid-template-columns: 1fr;
  }
}
</style>

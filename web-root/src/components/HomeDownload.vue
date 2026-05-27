<!--
@component HomeDownload
@description Renders the landing page download and signup options for desktop apps, CLI, and web access.
@notes Download card data lives locally because this section is static marketing content.
-->
<script setup>
import Button from './Button.vue';

const downloads = [
  {
    title: 'macOS',
    body: 'Apple Silicon and Intel',
    cta: 'Download for macOS',
    ctaHref: '/download',
  },
  {
    title: 'Windows',
    body: 'Windows 10 and 11',
    cta: 'Download for Windows',
    ctaHref: '/download',
  },
  {
    title: 'CLI',
    body: 'Via Node Package Manager',
    command: 'npm install -g wordpress-studio',
  },
  {
    title: 'Web',
    body: 'Access anywhere at',
    href: 'https://wordpress.studio',
    linkLabel: 'wordpress.studio',
    cta: 'Get started',
    ctaHref: '/signup',
  },
];
</script>

<template>
  <section class="home-download px-l">
    <h2 class="type-heading type-xxl">Start your Studio today</h2>
    <p class="type-body type-l">Download the desktop app, install the CLI, or create an account on the web.</p>

    <div class="home-download hstack gap-l">
      <article v-for="item in downloads" :key="item.title">
        <h3 class="type-heading type-l">{{ item.title }}</h3>
        <p v-if="item.href" class="type-body type-s">
          {{ item.body }} <a :href="item.href">{{ item.linkLabel }}</a>
        </p>
        <p v-else class="type-body type-s">{{ item.body }}</p>
        <div v-if="item.command" class="command-rail">
          <code data-install-command>{{ item.command }}</code>
          <Button :data-copy="item.command">Copy</Button>
        </div>
        <Button v-else variant="primary" :href="item.ctaHref">{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>

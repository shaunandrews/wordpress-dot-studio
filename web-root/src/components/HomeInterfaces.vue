<!--
@component HomeInterfaces
@description Presents the three Studio surfaces: desktop app, CLI, and web dashboard.
@notes Uses FPO placeholders until final interface visuals are ready.
-->
<script setup>
import Button from './Button.vue';
import FpoImage from './FpoImage.vue';
import SectionIntro from './SectionIntro.vue';
import screenshotStudioCode from '../../assets/screenshot-studio-code.png?url';
import screenshotStudioMacos from '../../assets/screenshot-studio-macos.png?url';

const interfaces = [
  {
    key: 'app',
    title: 'Studio Desktop',
    body: 'A local agentic environment for managing your WordPress sites and apps.',
    cta: 'About the apps',
    image: screenshotStudioMacos,
  },
  {
    key: 'cli',
    title: 'Studio CLI',
    body: 'Perfect for automation and agentic workflows anywhere you can launch a terminal.',
    cta: 'Meet the CLI',
    image: screenshotStudioCode,
  },
  {
    key: 'web',
    title: 'Studio Web',
    body: 'Access your Studio from anywhere and collaborate with your team.',
    cta: 'Get started on Web',
  },
];
</script>

<template>
  <section class="home-interfaces hstack gap-xxl align-start px-xl pl-xxl">
    <SectionIntro
      align="left"
      verticalAlign="center"
      maxWidth="min(28rem, 32%)"
      title="Three tools. One Studio."
      body="Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state."
      titleSize="type-xxl"
      bodySize="type-l"
    />

    <div class="interfaces-list hstack gap-xxl fill min-0">
      <article v-for="item in interfaces" :key="item.key" class="interface-card vstack gap-m equal">
        <img
          v-if="item.image"
          class="interface-image"
          :src="item.image"
          :alt="`${item.title} interface screenshot`"
          loading="lazy"
        />
        <FpoImage v-else />
        <h3 class="type-heading type-l">{{ item.title }}</h3>
        <p class="type-body type-s">{{ item.body }}</p>
        <Button class="interface-cta">{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.interface-image,
.interface-card :deep(.fpo-image) {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: 0;
  border-radius: var(--space-m);
  object-fit: cover;
  object-position: top left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>

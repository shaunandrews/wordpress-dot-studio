<!--
@component HomeInterfaces
@description Presents the three Studio surfaces: desktop app, CLI, and web dashboard.
@notes Uses FPO placeholders until final interface visuals are ready.
-->
<script setup>
import Button from './Button.vue';
import FpoImage from './FpoImage.vue';
import SectionIntro from './SectionIntro.vue';

const interfaces = [
  {
    key: 'app',
    title: 'Studio Desktop',
    body: 'A local agentic environment for managing your WordPress sites and apps.',
    cta: 'About the apps',
  },
  {
    key: 'cli',
    title: 'Studio CLI',
    body: 'Perfect for automation and agentic workflows anywhere you can launch a terminal.',
    cta: 'Meet the CLI',
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
      <article v-for="item in interfaces" :key="item.key" class="interface-card vstack equal">
        <FpoImage />
        <h3 class="type-heading type-xl">{{ item.title }}</h3>
        <p class="type-body type-m">{{ item.body }}</p>
        <Button class="interface-cta">{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.interface-card {
  gap: var(--space-l);
}

.interface-card :deep(.fpo-image) {
  aspect-ratio: 16 / 10;
  min-height: 0;
}

.interface-card h3,
.interface-card p {
  margin: 0;
}

.interface-cta {
  align-self: center;
}
</style>

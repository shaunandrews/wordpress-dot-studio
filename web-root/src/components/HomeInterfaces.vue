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
      class="interface-intro"
      align="center"
      maxWidth="min(28rem, 32%)"
      title="Three tools. One Studio."
      body="Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state."
      titleSize="type-xxl"
      bodySize="type-l"
    />

    <div class="interface-desk hstack">
      <article v-for="item in interfaces" :key="item.key" class="interface-card">
        <FpoImage class="interface-fpo" :shadow="false" />
        <div class="interface-copy">
          <h3 class="type-heading type-xl">{{ item.title }}</h3>
          <p class="type-body type-m">{{ item.body }}</p>
        </div>
        <Button class="interface-cta">{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-interfaces {
  width: 100%;
}

.interface-intro {
  align-self: center;
  flex: 0 0 min(28rem, 32%);
}

.interface-intro > * {
  margin-bottom: 0;
}

.interface-intro > * + * {
  margin-top: var(--space-l);
}

.interface-desk {
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
}

.interface-card {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-l);
  padding: var(--space-xl);
  border: 1px solid var(--color-chrome-border);
  border-radius: 18px;
}

.interface-fpo {
  width: 100%;
  min-height: 12rem;
}

.interface-copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.interface-copy > * {
  margin: 0;
}

.interface-cta {
  align-self: flex-start;
  margin-top: auto;
}

@media (max-width: 900px) {
  .home-interfaces,
  .interface-desk {
    flex-direction: column;
  }

  .interface-intro {
    flex-basis: auto;
  }
}
</style>

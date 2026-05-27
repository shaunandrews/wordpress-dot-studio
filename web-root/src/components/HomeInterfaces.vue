<!--
@component HomeInterfaces
@description Presents the three Studio surfaces: desktop app, CLI, and web dashboard.
@notes Uses FPO placeholders until final interface visuals are ready.
-->
<script setup>
import Button from './Button.vue';
import FpoImage from './FpoImage.vue';

const interfaces = [
  {
    key: 'app',
    title: 'Studio App',
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
    <div class="interface-intro">
      <h2 class="type-heading type-xxl">Three tools. One Studio.</h2>
      <p class="type-body type-l">Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state.</p>
    </div>

    <div class="interface-desk hstack gap-xl">
      <article v-for="item in interfaces" :key="item.key" class="interface-card">
        <FpoImage class="interface-fpo" />
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

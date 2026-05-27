<script setup>
import Button from './Button.vue';
import InlineSvg from './InlineSvg.vue';

const interfaces = [
  {
    key: 'app',
    title: 'Studio App',
    body: 'A local agentic environment for managing your WordPress sites and apps.',
    cta: 'About the apps',
    illustration: '/assets/illustration-interface-app.svg',
    illustrationLabel: 'Studio App desktop workspace illustration',
  },
  {
    key: 'cli',
    title: 'Studio CLI',
    body: 'Perfect for automation and agentic workflows anywhere you can launch a terminal.',
    cta: 'Meet the CLI',
    illustration: '/assets/illustration-interface-cli.svg',
    illustrationLabel: 'Studio CLI terminal illustration',
  },
  {
    key: 'web',
    title: 'Studio Web',
    body: 'Access your Studio from anywhere and collaborate with your team.',
    cta: 'Get started on Web',
    illustration: '/assets/illustration-interface-web.svg',
    illustrationLabel: 'Studio Web staging, production, and sharing illustration',
  },
];
</script>

<template>
  <section class="home-interfaces px-l">
    <h2 class="type-heading type-xxl">Three tools. One Studio.</h2>
    <p class="type-body type-l">Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state.</p>

    <div class="interface-desk hstack gap-xl">
      <article v-for="item in interfaces" :key="item.key" class="interface-card">
        <InlineSvg
          class="interface-illustration"
          :src="item.illustration"
          :label="item.illustrationLabel"
        />
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
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.home-interfaces > .type-heading,
.home-interfaces > .type-body {
  margin-bottom: 0;
}

.interface-desk {
  align-items: stretch;
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

.interface-card > * {
  margin: 0;
}

.interface-illustration {
  width: 100%;
  color: var(--color-chrome-fg);
}

.interface-illustration :deep(svg) {
  width: 100%;
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
  .interface-desk {
    flex-direction: column;
  }
}
</style>

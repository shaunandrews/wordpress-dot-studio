<!--
@component HomeWorkflow
@description Renders the Studio workflow section, from planning through shipping.
@notes Renders workflow cards directly in the template so the section stays self-contained.
-->
<script setup>
import SectionIntro from './SectionIntro.vue';
import InlineSvg from './InlineSvg.vue';
import illustrationBuild from '../../assets/illustration-build.svg?url';
import illustrationPlan from '../../assets/illustration-plan.svg?url';
import illustrationPreview from '../../assets/illustration-preview.svg?url';
import illustrationShip from '../../assets/illustration-ship.svg?url';

const workflowIllustrations = {
  build: illustrationBuild,
  plan: illustrationPlan,
  preview: illustrationPreview,
  ship: illustrationShip,
};

const workflowSteps = [
  {
    key: 'plan',
    title: 'Plan',
    body: 'Start from blueprints and map the site before code begins.',
    href: '/docs',
  },
  {
    key: 'build',
    title: 'Build',
    body: 'Run WordPress locally with app tools, logs, and database access.',
    href: '/desktop',
  },
  {
    key: 'preview',
    title: 'Preview',
    body: 'Share context and test changes against the real site surface.',
    href: '/web',
  },
  {
    key: 'ship',
    title: 'Ship',
    body: 'Deploy with snapshots, status, and a clear record of changes.',
    href: '/docs',
  },
];
</script>

<template>
  <section class="home-workflow p-xxxl w-full vstack gap-xl">
    <SectionIntro
      title="Get in the flow with Studio"
      body="Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow."
      verticalAlign="start"
    />

    <div class="home-workflow-process hstack gap-xxl">
      <article v-for="step in workflowSteps" :key="step.key" class="workflow-card vstack gap-s">
        <div class="workflow-card-illustration">
          <InlineSvg :src="workflowIllustrations[step.key]" />
        </div>
        <h3 class="type-heading type-l">{{ step.title }}</h3>
        <p class="type-body type-s">{{ step.body }}</p>
        <a class="workflow-card-link type-body type-s" :href="step.href">Learn more -></a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-workflow {
  position: relative;
  z-index: 0;
  margin: auto;
  padding-top: var(--space-xxxl);
  padding-right: var(--space-xl);
  padding-left: var(--space-xxl);
}

.home-workflow :deep(.section-intro),
.home-workflow-process {
  position: relative;
  z-index: 1;
}

.workflow-card {
  flex: 1 1 0;
  min-width: 0;
  text-align: left;
}

.workflow-card-illustration {
  display: flex;
  justify-content: flex-start;
  padding: 15px 30px;
  background: var(--color-chrome-fill);
  margin-bottom: var(--space-m);
}

.workflow-card p {
  color: var(--color-chrome-fg-muted);
}

.workflow-card-link {
  width: fit-content;
  color: var(--color-chrome-fg);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.workflow-card-link:hover,
.workflow-card-link:focus-visible {
  text-decoration: underline;
}

@media (max-width: 760px) {
  .home-workflow {
    --home-hero-overhang: clamp(56px, 14vw, 84px);
  }
}
</style>

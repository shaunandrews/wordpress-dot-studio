<!--
@component HomeWorkflow
@description Renders the Studio workflow section, from planning through shipping.
@notes Renders workflow cards directly in the template so the section stays self-contained.
-->
<script setup>
import SectionIntro from './SectionIntro.vue';
import InlineSvg from './InlineSvg.vue';

const workflowSteps = [
  {
    key: 'plan',
    title: 'Plan',
    body: 'Start from blueprints and map the site before code begins.',
    headingSize: 'type-l',
  },
  {
    key: 'build',
    title: 'Build',
    body: 'Run WordPress locally with app tools, logs, and database access.',
  },
  {
    key: 'preview',
    title: 'Preview',
    body: 'Share context and test changes against the real site surface.',
  },
  {
    key: 'ship',
    title: 'Ship',
    body: 'Deploy with snapshots, status, and a clear record of changes.',
  },
];
</script>

<template>
  <section class="home-workflow p-xxl w-full vstack gap-xxl">
    <SectionIntro
      title="Get in the flow with Studio"
      body="Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow."
      verticalAlign="start"
    />

    <div class="home-workflow-process hstack justify-space-between px-xxl gap-xxl">
      <article
        v-for="step in workflowSteps"
        :key="step.key"
        class="workflow-card vstack"
      >
        <InlineSvg :src="`/assets/illustration-${step.key}.svg`" />
        <div>
          <h3 class="type-heading" :class="step.headingSize ?? 'type-l'">{{ step.title }}</h3>
          <p class="type-body type-s">{{ step.body }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.workflow-card {
  text-align: center;
}

.workflow-card p {
  color: var(--color-chrome-fg-muted);
}
</style>

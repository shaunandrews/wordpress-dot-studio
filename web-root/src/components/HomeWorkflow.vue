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
  <section class="home-workflow p-xxl w-full vstack gap-xl">
    <SectionIntro
      title="Get in the flow with Studio"
      body="Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow."
      verticalAlign="start"
    />

    <div class="home-workflow-process hstack gap-xxl">
      <article
        v-for="step in workflowSteps"
        :key="step.key"
        class="workflow-card vstack debug"
      >
        <div class="workflow-card-illustration">
          <InlineSvg :src="`/assets/illustration-${step.key}.svg`" />
        </div>
        <h3 class="type-heading type-l">{{ step.title }}</h3>
        <p class="type-body type-s">{{ step.body }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-workflow {
  max-width: 1200px;
  margin: auto;
}
.workflow-card {
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
}

.workflow-card-illustration {
  display: flex;
  justify-content: center;
  padding: 30px;
}

.workflow-card p {
  color: var(--color-chrome-fg-muted);
}
</style>

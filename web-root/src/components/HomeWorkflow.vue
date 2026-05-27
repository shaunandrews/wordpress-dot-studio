<!--
@component HomeWorkflow
@description Renders the Studio workflow section, from planning through shipping.
@notes Supplies static workflow step data to WorkflowCard for consistent card rendering.
-->
<script setup>
import SectionIntro from './SectionIntro.vue';
import WorkflowCard from './WorkflowCard.vue';

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
    <SectionIntro>
      <h2 class="type-heading type-xxl">Get in the flow with Studio</h2>
      <p class="type-body type-l">Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow.</p>
    </SectionIntro>

    <div class="home-workflow-process hstack justify-space-between px-xxl gap-xxl">
      <WorkflowCard
        v-for="step in workflowSteps"
        :key="step.key"
        :step="step"
      />
    </div>
  </section>
</template>

<style scoped>
.home-workflow-process {
  /* border: 1px solid var(--color-chrome-border); */
}

.home-workflow-process :deep(.inline-svg svg) {
  max-width: 240px;
}
</style>

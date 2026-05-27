<!--
@component HomeWorkflow
@description Renders the Studio workflow section, from planning through shipping.
@notes Supplies static workflow step data to a local subcomponent for consistent card rendering.
-->
<script setup>
import { defineComponent, h } from 'vue';
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

const WorkflowCard = defineComponent({
  name: 'WorkflowCard',
  props: {
    step: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return () => h(
      'article',
      { class: 'workflow-card vstack' },
      [
        h(InlineSvg, { src: `/assets/illustration-${props.step.key}.svg` }),
        h('div', null, [
          h('h3', { class: ['type-heading', props.step.headingSize ?? 'type-l'] }, props.step.title),
          h('p', { class: ['type-body', 'type-s'] }, props.step.body),
        ]),
      ],
    );
  },
});
</script>

<template>
  <section class="home-workflow p-xxl w-full vstack gap-xxl">
    <SectionIntro
      title="Get in the flow with Studio"
      body="Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow."
      verticalAlign="start"
    />

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
.workflow-card {
  text-align: center;
}

.workflow-card p {
  color: var(--color-chrome-fg-muted);
}
</style>

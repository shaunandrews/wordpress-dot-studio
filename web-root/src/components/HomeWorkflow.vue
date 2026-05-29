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
        <div class="workflow-card-copy vstack gap-s">
          <h3 class="type-heading type-l">{{ step.title }}</h3>
          <p class="type-body type-s">{{ step.body }}</p>
          <a class="workflow-card-link type-body type-s" :href="step.href">
            <span>Learn more</span>
            <svg class="workflow-card-link-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8.78 3.22 13.56 8l-4.78 4.78-1.06-1.06 2.97-2.97H2v-1.5h8.69L7.72 4.28l1.06-1.06Z" />
            </svg>
          </a>
        </div>
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
  padding-bottom: var(--space-xxl);
  padding-left: var(--space-xxl);
}

.home-workflow :deep(.section-intro),
.home-workflow-process {
  position: relative;
  z-index: 1;
}

.home-workflow-process {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.workflow-card {
  min-width: 0;
  text-align: left;
}

.workflow-card-copy {
  min-width: 0;
  max-width: 28rem;
}

.workflow-card-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 58%, transparent);
  border-radius: var(--space-m);
  background: color-mix(in srgb, var(--color-chrome-fill) 86%, var(--color-chrome-border) 14%);
  margin-bottom: var(--space-m);
}

.workflow-card-illustration :deep(svg) {
  width: 100%;
  max-width: 160px;
}

.workflow-card p {
  color: var(--color-chrome-fg-muted);
}

.workflow-card-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: var(--space-s);
  margin-top: var(--space-m);
  color: var(--color-theme-fill);
  font-weight: var(--font-weight-regular);
  text-decoration: underline;
  text-underline-offset: 0.12em;
  text-decoration-thickness: 0.08em;
}

.workflow-card-link:hover,
.workflow-card-link:focus-visible {
  color: var(--color-theme-fill-accent);
}

.workflow-card-link-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  fill: currentColor;
}

@media (max-width: 1120px) {
  .home-workflow-process {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-xl);
  }

  .workflow-card {
    display: grid;
    grid-template-columns: minmax(116px, 0.28fr) minmax(0, 1fr);
    align-items: start;
    gap: var(--space-xl);
  }

  .workflow-card-copy {
    max-width: 26rem;
  }

  .workflow-card-illustration {
    margin-bottom: 0;
    padding: var(--space-s) var(--space-m);
  }

  .workflow-card-illustration :deep(svg) {
    max-width: 108px;
  }
}

@media (max-width: 760px) {
  .home-workflow {
    --home-hero-overhang: clamp(56px, 14vw, 84px);
    padding-top: var(--space-xl);
    padding-right: var(--space-l);
    padding-bottom: var(--space-xl);
    padding-left: var(--space-l);
  }

  .home-workflow-process {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .workflow-card {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: var(--space-l);
  }

  .workflow-card-copy {
    max-width: 22rem;
  }

  .workflow-card-illustration :deep(svg) {
    max-width: 88px;
  }
}
</style>

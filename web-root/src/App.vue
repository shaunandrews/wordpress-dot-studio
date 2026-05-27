<script setup>
import WorkflowCard from './components/WorkflowCard.vue';

const navItems = [
  { label: 'App', href: '/app' },
  { label: 'CLI', href: '/cli' },
  { label: 'Web', href: '/web' },
  { label: 'Docs', href: '/docs' },
];

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

const interfaces = [
  {
    title: 'Studio App',
    body: 'A local agentic environment for managing your WordPress sites and apps.',
    cta: 'About the apps',
  },
  {
    title: 'Studio CLI',
    body: 'Perfect for automation and agentic workflows anywhere you can launch a terminal.',
    cta: 'Meet the CLI',
  },
  {
    title: 'Studio Web',
    body: 'Access your Studio from anywhere and collaborate with your team.',
    cta: 'Get started on Web',
  },
];

const downloads = [
  {
    title: 'macOS',
    body: 'Apple Silicon and Intel',
    cta: 'Download for macOS',
    ctaHref: '/download',
  },
  {
    title: 'Windows',
    body: 'Windows 10 and 11',
    cta: 'Download for Windows',
    ctaHref: '/download',
  },
  {
    title: 'CLI',
    body: 'Via Node Package Manager',
    command: 'npm install -g wordpress-studio',
  },
  {
    title: 'Web',
    body: 'Access anywhere at',
    href: 'https://wordpress.studio',
    linkLabel: 'wordpress.studio',
    cta: 'Get started',
    ctaHref: '/signup',
  },
];
</script>

<template>
  <div class="wp-studio page-home vstack">
    <header class="site-header hstack gap-xl w-full align-center justify-between p-l" data-site-header>
      <div class="site-header-start hstack gap-m align-center">
        <img src="/assets/studio-icon.svg" alt="WordPress Studio Icon">
        <a class="brand type-heading type-m" href="/" aria-label="WordPress Studio home">WordPress Studio</a>
      </div>

      <nav class="site-nav hstack gap-m" aria-label="Primary navigation">
        <a
          v-for="item in navItems"
          :key="item.href"
          class="type-label type-s"
          :href="item.href"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="site-header-end">
        <button>Log in</button>
        <button class="button-primary">Download</button>
      </div>
    </header>

    <main id="main" class="vstack">
      <section class="home-hero hstack w-full align-center justify-between" aria-label="WordPress Studio overview">
        <dot-grid></dot-grid>
        <div class="home-hero-message p-xxl">
          <h1 class="type-display type-xxxxl">The complete WordPress development suite</h1>
          <p class="type-body type-l">Build, preview, and ship sites and apps powered by WordPress with a unified CLI, web dashboard, and desktop app.</p>
          <div class="hstack gap-m">
            <button class="button-primary" href="/download">Download for macOS</button>
            <button>Learn more</button>
          </div>
        </div>
        <figure aria-hidden="true">
          <p class="type-caption type-s">FPO</p>
        </figure>
      </section>

      <section class="home-workflow px-l w-full">
        <h2 class="type-heading type-xxl">Get in the flow with Studio</h2>
        <p class="type-body type-l">Focus on the output, and let Studio help you move between planning, building, previewing, and shipping with a fully integrated workflow.</p>

        <div class="home-workflow-process hstack justify-space-between gap-xl">
          <WorkflowCard
            v-for="step in workflowSteps"
            :key="step.key"
            :step="step"
          />
        </div>
      </section>

      <section class="home-interfaces px-l">
        <h2 class="type-heading type-xxl">Three tools. One Studio.</h2>
        <p class="type-body type-l">Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state.</p>

        <div class="interface-desk hstack gap-xl">
          <article v-for="item in interfaces" :key="item.title">
            <h3 class="type-heading type-xl">{{ item.title }}</h3>
            <p class="type-body type-m">{{ item.body }}</p>
            <button>{{ item.cta }}</button>
          </article>
        </div>
      </section>

      <section class="home-studio-code px-l">
        <h2 class="type-heading type-xxl">Powered by Studio Code</h2>
        <p class="type-body type-l">The Studio desktop app and web site are built upon Studio Code, an AI-powered WordPress agent that can write code, design themes, and more.</p>
        <button>Learn more</button>
      </section>

      <section class="home-download px-l">
        <h2 class="type-heading type-xxl">Start your Studio today</h2>
        <p class="type-body type-l">Download the desktop app, install the CLI, or create an account on the web.</p>

        <div class="home-download hstack gap-l">
          <article v-for="item in downloads" :key="item.title">
            <h3 class="type-heading type-l">{{ item.title }}</h3>
            <p v-if="item.href" class="type-body type-s">
              {{ item.body }} <a :href="item.href">{{ item.linkLabel }}</a>
            </p>
            <p v-else class="type-body type-s">{{ item.body }}</p>
            <div v-if="item.command" class="command-rail">
              <code data-install-command>{{ item.command }}</code>
              <button type="button" :data-copy="item.command">Copy</button>
            </div>
            <button v-else class="button-primary" :href="item.ctaHref">{{ item.cta }}</button>
          </article>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="type-caption type-s">An Automattic product</p>
    </footer>
  </div>
</template>

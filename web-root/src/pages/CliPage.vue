<!--
@component CliPage
@description Renders the first-draft product page for WordPress Studio CLI and Studio Code.
-->
<script setup>
import Button from '../components/Button.vue';

const commands = [
  {
    name: 'auth',
    body: 'Connect Studio CLI to WordPress.com so automation can create and manage previews.',
  },
  {
    name: 'site',
    body: 'Create, list, start, stop, and manage local Studio sites from scripts or terminals.',
  },
  {
    name: 'preview',
    body: 'Create and update shareable preview sites for reviews, CI flows, and handoff.',
  },
  {
    name: 'wp',
    body: 'Run WP-CLI commands against Studio sites without installing a separate WordPress stack.',
  },
  {
    name: 'blueprint',
    body: 'Automate repeatable site setup from declarative Studio blueprints.',
  },
  {
    name: 'code',
    body: 'Start Studio Code, the AI-powered coding agent built for WordPress work.',
  },
];

const automation = [
  {
    title: 'Script site operations',
    body: 'Create local sites, start environments, run setup commands, and tear workspaces down from repeatable scripts.',
  },
  {
    title: 'Create CI previews',
    body: 'Turn a build or branch into a hosted preview that teammates and clients can review without pulling code.',
  },
  {
    title: 'Give agents a real interface',
    body: 'AI agents work best with clear commands, readable output, and files they can inspect. Studio CLI gives them that surface for WordPress.',
  },
];

const snippets = [
  'npm install -g wp-studio@latest',
  'studio site create client-redesign',
  'studio preview create client-redesign',
  'studio code',
];
</script>

<template>
  <main id="main" class="cli-page vstack">
    <section class="cli-hero hstack align-center gap-xxl px-xxxl">
      <div class="cli-hero-copy vstack gap-l">
        <p class="type-label type-s">Studio CLI</p>
        <h1 class="type-display type-xxxxl">Automate WordPress with Studio CLI</h1>
        <p class="type-body type-l">
          Studio CLI exposes WordPress development commands for automation, CI, and AI agents
          that thrive in the terminal.
        </p>
        <div class="cli-actions hstack gap-m">
          <Button variant="primary" href="https://developer.wordpress.com/docs/developer-tools/studio/cli/">Read CLI docs</Button>
          <Button href="#studio-code">Meet Studio Code</Button>
        </div>
      </div>

      <div class="terminal-panel" aria-label="Studio CLI command examples">
        <div class="terminal-titlebar hstack align-center justify-between">
          <span>studio</span>
          <span>automation ready</span>
        </div>
        <div class="terminal-body vstack">
          <p v-for="snippet in snippets" :key="snippet"><span>$</span> {{ snippet }}</p>
        </div>
      </div>
    </section>

    <section class="command-section px-xxxl">
      <div class="section-heading vstack gap-m">
        <p class="type-label type-s">Command surface</p>
        <h2 class="type-heading type-xxxl">One CLI for the WordPress work around your site</h2>
      </div>

      <div class="command-grid">
        <article v-for="command in commands" :key="command.name" class="command-item vstack gap-m">
          <code>studio {{ command.name }}</code>
          <p class="type-body type-m">{{ command.body }}</p>
        </article>
      </div>
    </section>

    <section class="automation-section hstack gap-xxl px-xxxl">
      <div class="automation-copy vstack gap-m">
        <p class="type-label type-s">Automation and CI</p>
        <h2 class="type-heading type-xxxl">Built for repeatable WordPress workflows</h2>
        <p class="type-body type-l">
          Use Studio CLI anywhere a command can run: local scripts, CI pipelines, release checks,
          preview creation, and agent-driven development loops.
        </p>
      </div>

      <div class="automation-list vstack">
        <article v-for="item in automation" :key="item.title" class="automation-row">
          <h3 class="type-heading type-l">{{ item.title }}</h3>
          <p class="type-body type-m">{{ item.body }}</p>
        </article>
      </div>
    </section>

    <section class="agent-band hstack align-center justify-between gap-xl px-xxxl">
      <div class="vstack gap-m">
        <p class="type-label type-s">AI agent friendly</p>
        <h2 class="type-heading type-xxl">A terminal surface agents can understand</h2>
      </div>
      <p class="type-body type-l">
        Agents can run commands, inspect output, update files, create previews, and follow project
        guidance through files like <code>AGENTS.md</code>.
      </p>
    </section>

    <section id="studio-code" class="studio-code-section hstack align-center gap-xxl px-xxxl">
      <div class="studio-code-copy vstack gap-l">
        <p class="type-label type-s">Studio Code</p>
        <h2 class="type-heading type-xxxl">An AI-powered coding agent for WordPress</h2>
        <p class="type-body type-l">
          Studio Code works conversationally from your terminal to build, customize, and manage
          WordPress sites with the context of Studio and its CLI commands.
        </p>
        <div class="cli-actions hstack gap-m">
          <Button variant="primary" href="https://developer.wordpress.com/docs/developer-tools/studio/studio-code/">Read Studio Code docs</Button>
          <Button href="https://developer.wordpress.com/docs/developer-tools/studio/cli/">CLI reference</Button>
        </div>
      </div>

      <div class="chat-panel vstack gap-l" aria-label="Studio Code conversation example">
        <div class="chat-message user-message">
          Build a local WordPress site for a conference landing page.
        </div>
        <div class="chat-message agent-message">
          I will create the Studio site, add the theme structure, and prepare a preview command.
        </div>
        <div class="chat-command"><span>$</span> studio code</div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.cli-page {
  --cli-rule: color-mix(in srgb, var(--color-chrome-border) 74%, transparent);
  --cli-surface: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  --cli-ink: color-mix(in srgb, var(--color-chrome-fg) 92%, var(--color-theme-fill) 8%);
  background:
    linear-gradient(180deg, transparent 0, color-mix(in srgb, var(--color-chrome-fill) 52%, transparent) 100%),
    var(--color-chrome-fill);
}

.cli-page :is(.type-display, .type-heading) {
  letter-spacing: 0;
}

.cli-hero {
  min-height: 100vh;
  padding-top: calc(var(--site-header-height, 72px) + var(--space-xxl));
  padding-bottom: var(--space-xxl);
  border-bottom: 1px solid var(--cli-rule);
}

.cli-hero-copy {
  flex: 0 0 min(42vw, 560px);
}

.cli-hero-copy .type-body,
.command-item p,
.automation-copy .type-body,
.automation-row p,
.agent-band > p,
.studio-code-copy .type-body {
  color: var(--color-chrome-fg-muted);
}

.cli-actions {
  flex-wrap: wrap;
}

.terminal-panel,
.chat-panel {
  border: 1px solid var(--cli-rule);
  border-radius: 8px;
  background: var(--cli-ink);
  color: color-mix(in srgb, var(--color-theme-fg) 92%, var(--color-theme-fill) 8%);
  box-shadow: 0 18px 44px rgb(0 0 0 / 0.22);
}

.terminal-panel {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 720px;
  overflow: hidden;
}

.terminal-titlebar {
  min-height: 48px;
  padding: 0 var(--space-l);
  border-bottom: 1px solid rgb(255 255 255 / 0.13);
  color: rgb(255 255 255 / 0.62);
  font-family: var(--font-mono);
  font-size: var(--font-size-s);
}

.terminal-body {
  padding: var(--space-xl);
  gap: var(--space-l);
  font-family: var(--font-mono);
  font-size: var(--font-size-m);
  line-height: var(--line-height-relaxed);
}

.terminal-body p,
.chat-command {
  margin: 0;
  overflow-wrap: anywhere;
}

.terminal-body span,
.chat-command span {
  color: color-mix(in srgb, var(--color-theme-fill) 72%, white 28%);
}

.command-section,
.automation-section,
.studio-code-section {
  padding-top: var(--space-xxxl);
  padding-bottom: var(--space-xxxl);
  border-bottom: 1px solid var(--cli-rule);
}

.section-heading {
  max-width: var(--line-length-m);
  margin-bottom: var(--space-xxl);
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-l);
}

.command-item {
  min-height: 210px;
  padding: var(--space-xl);
  border: 1px solid var(--cli-rule);
  border-radius: 8px;
  background: var(--cli-surface);
}

.command-item code {
  width: fit-content;
  color: var(--color-theme-fill);
}

.automation-section {
  align-items: flex-start;
}

.automation-copy {
  flex: 0 0 min(38vw, 520px);
  position: sticky;
  top: calc(var(--site-header-height, 72px) + var(--space-xl));
}

.automation-list {
  flex: 1 1 auto;
  border-top: 1px solid var(--cli-rule);
}

.automation-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.6fr) minmax(0, 1fr);
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--cli-rule);
}

.agent-band {
  padding-top: var(--space-xxl);
  padding-bottom: var(--space-xxl);
  border-bottom: 1px solid var(--cli-rule);
  background: color-mix(in srgb, var(--color-theme-fill) 7%, transparent);
}

.agent-band > p {
  max-width: var(--line-length-s);
}

.studio-code-section {
  align-items: stretch;
}

.studio-code-copy {
  flex: 1 1 0;
  justify-content: center;
}

.chat-panel {
  flex: 0 0 min(42vw, 560px);
  justify-content: center;
  min-height: 420px;
  padding: var(--space-xl);
}

.chat-message,
.chat-command {
  max-width: 82%;
  padding: var(--space-l);
  border-radius: 8px;
  font-size: var(--font-size-m);
  line-height: var(--line-height-relaxed);
}

.user-message {
  align-self: flex-end;
  background: rgb(255 255 255 / 0.12);
}

.agent-message {
  align-self: flex-start;
  background: color-mix(in srgb, var(--color-theme-fill) 36%, transparent);
}

.chat-command {
  align-self: stretch;
  max-width: none;
  border: 1px solid rgb(255 255 255 / 0.13);
  background: rgb(0 0 0 / 0.18);
  font-family: var(--font-mono);
}

@media (max-width: 1120px) {
  .cli-hero,
  .automation-section,
  .agent-band,
  .studio-code-section {
    flex-direction: column;
    align-items: stretch;
  }

  .cli-hero,
  .command-section,
  .automation-section,
  .agent-band,
  .studio-code-section {
    padding-inline: var(--space-xl);
  }

  .cli-hero-copy,
  .automation-copy,
  .terminal-panel,
  .chat-panel {
    flex-basis: auto;
    max-width: none;
  }

  .automation-copy {
    position: static;
  }

  .command-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .cli-hero,
  .command-section,
  .automation-section,
  .agent-band,
  .studio-code-section {
    padding-inline: var(--space-l);
  }

  .cli-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cli-actions :deep(.button) {
    width: 100%;
  }

  .terminal-body {
    padding: var(--space-l);
    font-size: var(--font-size-s);
  }

  .command-grid,
  .automation-row {
    grid-template-columns: 1fr;
  }

  .chat-panel {
    min-height: 360px;
  }

  .chat-message {
    max-width: 100%;
  }
}
</style>

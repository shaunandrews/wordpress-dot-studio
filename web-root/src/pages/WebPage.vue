<!--
@component WebPage
@description Renders the first-draft future-facing product page for Studio Web.
-->
<script setup>
import Button from '../components/Button.vue';

const sessions = [
  {
    site: 'Editorial launch',
    task: 'Studio Code is updating the homepage template',
    status: 'Running in cloud',
  },
  {
    site: 'Client store',
    task: 'Ready to review product page changes',
    status: 'Needs review',
  },
  {
    site: 'Plugin sandbox',
    task: 'Desktop session paused 12 minutes ago',
    status: 'Resume',
  },
];

const continuity = [
  {
    title: 'Start in Desktop',
    body: 'Work locally with the full Studio app, your files, your running sites, and the familiar desktop interface.',
  },
  {
    title: 'Send to Web',
    body: 'Move a site, chat, or working session into Studio Web when the work needs to continue away from your machine.',
  },
  {
    title: 'Let agents continue',
    body: 'Studio Code can keep working in the cloud, carrying the conversation and task context forward.',
  },
  {
    title: 'Pick up anywhere',
    body: 'Review progress, continue a chat, or check a site from a browser, laptop, tablet, or phone.',
  },
];

const features = [
  {
    title: 'Sites and sessions together',
    body: 'Studio Web is imagined as a place to see your Studio sites, active work sessions, paused chats, and agent progress in one browser-accessible view.',
  },
  {
    title: 'A familiar Studio interface',
    body: 'Because Studio is built with web technology, the web experience can stay close to the desktop app instead of becoming a separate product surface.',
  },
  {
    title: 'Studio Code in the cloud',
    body: 'The same agentic workflow behind Studio Code can continue tasks beyond the desktop app, including long-running site work and follow-up changes.',
  },
  {
    title: 'Useful from a phone',
    body: 'Studio Web should make it practical to check sessions, review agent work, and resume lightweight decisions while away from your desk.',
  },
];
</script>

<template>
  <main id="main" class="web-page vstack">
    <section class="web-hero hstack align-center gap-xxl px-xxxl">
      <div class="web-hero-copy vstack gap-l">
        <p class="type-label type-s">Studio Web</p>
        <h1 class="type-display type-xxxxl">Where WordPress work keeps going</h1>
        <p class="type-body type-l">
          Studio Web is an exploration for interacting with Studio sites, chats, and agent sessions
          from anywhere with a browser.
        </p>
        <div class="web-actions hstack gap-m">
          <Button variant="primary" href="/desktop">Explore Studio Desktop</Button>
          <Button href="#cloud-agents">Cloud agent workflow</Button>
        </div>
        <p class="availability-note type-caption">
          Studio Web is not currently available. This page describes a product direction.
        </p>
      </div>

      <div class="web-app-preview" aria-label="Studio Web product direction preview">
        <div class="browser-bar hstack align-center justify-between">
          <div class="browser-dots hstack gap-s" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>studio.wordpress.com</span>
        </div>

        <div class="web-app-shell">
          <aside class="web-sidebar vstack">
            <span class="sidebar-label type-label type-s">Sites</span>
            <button type="button" class="site-pill is-active">Editorial launch</button>
            <button type="button" class="site-pill">Client store</button>
            <button type="button" class="site-pill">Plugin sandbox</button>
          </aside>

          <section class="session-panel vstack gap-l">
            <div class="session-header hstack align-start justify-between gap-l">
              <div>
                <p class="type-label type-s">Active session</p>
                <h2 class="type-heading type-xl">Homepage refresh</h2>
              </div>
              <span>Live</span>
            </div>

            <div class="agent-thread vstack gap-m">
              <p>Studio Code is applying the approved layout changes.</p>
              <p>Preview will be ready after the template update and content pass.</p>
            </div>

            <div class="session-list vstack">
              <article v-for="session in sessions" :key="session.site" class="session-row">
                <div>
                  <strong>{{ session.site }}</strong>
                  <p>{{ session.task }}</p>
                </div>
                <span>{{ session.status }}</span>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>

    <section class="continuity-section px-xxxl">
      <div class="section-heading vstack gap-m">
        <p class="type-label type-s">Continuity</p>
        <h2 class="type-heading type-xxxl">Start at your desk, continue in the cloud</h2>
      </div>

      <div class="continuity-grid">
        <article v-for="(step, index) in continuity" :key="step.title" class="continuity-step vstack gap-m">
          <span class="step-number type-label type-s">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="type-heading type-xl">{{ step.title }}</h3>
          <p class="type-body type-m">{{ step.body }}</p>
        </article>
      </div>
    </section>

    <section id="cloud-agents" class="web-detail hstack gap-xxl px-xxxl">
      <div class="detail-copy vstack gap-m">
        <p class="type-label type-s">Cloud Studio Code</p>
        <h2 class="type-heading type-xxxl">Agents that can keep working after you step away</h2>
        <p class="type-body type-l">
          The goal for Studio Web is to make Studio Code useful beyond a single local session:
          continue a conversation, keep a task running, and return when there is something to review.
        </p>
      </div>

      <div class="feature-list vstack">
        <article v-for="feature in features" :key="feature.title" class="feature-row">
          <h3 class="type-heading type-l">{{ feature.title }}</h3>
          <p class="type-body type-m">{{ feature.body }}</p>
        </article>
      </div>
    </section>

    <section class="status-band hstack align-center justify-between gap-xl px-xxxl">
      <div class="vstack gap-m">
        <p class="type-label type-s">Product direction</p>
        <h2 class="type-heading type-xxl">A future web surface for Studio work</h2>
      </div>
      <div class="status-actions vstack gap-m">
        <p class="type-body type-l">
          Studio Web is still an idea under exploration, shaped around the desktop app, Studio Code,
          and browser access to ongoing WordPress work.
        </p>
        <div class="web-actions hstack gap-m">
          <Button href="https://developer.wordpress.com/docs/developer-tools/studio/studio-code/">Read Studio Code docs</Button>
          <Button href="/desktop">Studio Desktop</Button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.web-page {
  --web-rule: color-mix(in srgb, var(--color-chrome-border) 74%, transparent);
  --web-surface: color-mix(in srgb, var(--color-chrome-fill) 90%, canvas 10%);
  --web-panel: color-mix(in srgb, var(--color-chrome-fill) 84%, var(--color-theme-fill) 5%);
  background:
    linear-gradient(180deg, transparent 0, color-mix(in srgb, var(--color-chrome-fill) 52%, transparent) 100%),
    var(--color-chrome-fill);
}

.web-page :is(.type-display, .type-heading) {
  letter-spacing: 0;
}

.web-hero {
  min-height: 100vh;
  padding-top: calc(var(--site-header-height, 72px) + var(--space-xxl));
  padding-bottom: var(--space-xxl);
  border-bottom: 1px solid var(--web-rule);
}

.web-hero-copy {
  flex: 0 0 min(42vw, 560px);
}

.web-hero-copy .type-body,
.availability-note,
.continuity-step p,
.detail-copy .type-body,
.feature-row p,
.status-actions > p,
.session-row p,
.agent-thread p {
  color: var(--color-chrome-fg-muted);
}

.web-actions {
  flex-wrap: wrap;
}

.availability-note {
  max-width: var(--line-length-s);
}

.web-app-preview {
  flex: 1 1 auto;
  min-width: 0;
  border: 1px solid var(--web-rule);
  border-radius: 10px;
  overflow: hidden;
  background: var(--web-surface);
  box-shadow: 0 18px 44px rgb(0 0 0 / 0.18);
}

.browser-bar {
  min-height: 48px;
  padding: 0 var(--space-l);
  border-bottom: 1px solid var(--web-rule);
  color: var(--color-chrome-fg-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-s);
}

.browser-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--color-chrome-border);
}

.web-app-shell {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  min-height: 520px;
}

.web-sidebar {
  gap: var(--space-s);
  padding: var(--space-l);
  border-right: 1px solid var(--web-rule);
  background: var(--web-panel);
}

.sidebar-label {
  margin-bottom: var(--space-m);
  color: var(--color-chrome-fg-muted);
}

.site-pill {
  min-height: 38px;
  padding: var(--space-s) var(--space-m);
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-chrome-fg-muted);
  background: transparent;
  font: inherit;
  text-align: left;
}

.site-pill.is-active {
  border-color: var(--web-rule);
  color: var(--color-chrome-fg);
  background: var(--color-chrome-fill);
}

.session-panel {
  padding: var(--space-xl);
}

.session-header span,
.session-row > span {
  flex: 0 0 auto;
  padding: var(--space-s) var(--space-m);
  border: 1px solid var(--web-rule);
  border-radius: 999px;
  color: var(--color-theme-fill);
  font-size: var(--font-size-s);
}

.agent-thread {
  padding: var(--space-l);
  border: 1px solid var(--web-rule);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-theme-fill) 5%, transparent);
}

.agent-thread p,
.session-row p {
  margin: 0;
}

.session-list {
  border-top: 1px solid var(--web-rule);
}

.session-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-l);
  padding: var(--space-l) 0;
  border-bottom: 1px solid var(--web-rule);
}

.continuity-section,
.web-detail {
  padding-top: var(--space-xxxl);
  padding-bottom: var(--space-xxxl);
  border-bottom: 1px solid var(--web-rule);
}

.section-heading {
  max-width: var(--line-length-m);
  margin-bottom: var(--space-xxl);
}

.continuity-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-l);
}

.continuity-step {
  min-height: 260px;
  padding: var(--space-xl);
  border: 1px solid var(--web-rule);
  border-radius: 8px;
  background: var(--web-surface);
}

.step-number {
  color: var(--color-theme-fill);
}

.web-detail {
  align-items: flex-start;
}

.detail-copy {
  flex: 0 0 min(38vw, 520px);
  position: sticky;
  top: calc(var(--site-header-height, 72px) + var(--space-xl));
}

.feature-list {
  flex: 1 1 auto;
  border-top: 1px solid var(--web-rule);
}

.feature-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.6fr) minmax(0, 1fr);
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--web-rule);
}

.status-band {
  padding-top: var(--space-xxl);
  padding-bottom: var(--space-xxl);
  background: color-mix(in srgb, var(--color-theme-fill) 7%, transparent);
}

.status-actions {
  max-width: var(--line-length-m);
}

@media (max-width: 1120px) {
  .web-hero,
  .web-detail,
  .status-band {
    flex-direction: column;
    align-items: stretch;
  }

  .web-hero,
  .continuity-section,
  .web-detail,
  .status-band {
    padding-inline: var(--space-xl);
  }

  .web-hero-copy,
  .detail-copy {
    flex-basis: auto;
    max-width: var(--line-length-m);
  }

  .detail-copy {
    position: static;
  }

  .continuity-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .web-hero,
  .continuity-section,
  .web-detail,
  .status-band {
    padding-inline: var(--space-l);
  }

  .web-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .web-actions :deep(.button) {
    width: 100%;
  }

  .web-app-shell,
  .continuity-grid,
  .feature-row {
    grid-template-columns: 1fr;
  }

  .web-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--web-rule);
  }

  .session-row,
  .session-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

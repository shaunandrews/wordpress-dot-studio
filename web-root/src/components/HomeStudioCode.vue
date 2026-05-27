<!--
@component HomeStudioCode
@description Highlights the Studio Code foundation inside a centered blueprint-style DotGrid panel.
@notes Reuses DotGrid so blueprint texture behavior stays consistent with the hero surface.
-->
<script setup>
import Button from './Button.vue';
import DotGrid from './DotGrid.vue';
</script>

<template>
  <section class="home-studio-code px-l">
    <DotGrid
      as="div"
      class="studio-code-blueprint"
      :cross-size="2.5"
      :cross-thickness="0.5"
      :opacity="0.2"
      :repulsion="0.08"
      :ripple-strength="0.25"
      :spacing="18"
    >
      <div class="studio-code-blueprint-ruler" aria-hidden="true"></div>
      <div class="studio-code-blueprint-content">
        <span class="studio-code-blueprint-kicker">Fig. 04 / Foundation</span>
        <h2 class="type-heading type-xxl">Powered by Studio Code</h2>
        <p class="type-body type-l">
          The Studio desktop app and web site are built upon Studio Code, an AI-powered WordPress
          agent that can write code, design themes, and more.
        </p>
        <Button>Learn more</Button>
      </div>
    </DotGrid>
  </section>
</template>

<style scoped>
.home-studio-code {
  display: grid;
  justify-items: center;
  width: 100%;
}

.studio-code-blueprint {
  --blueprint-paper: #124ca8;
  --blueprint-ink: #dcecff;
  --blueprint-ink-muted: #a9c8f8;
  --blueprint-line: rgba(220, 236, 255, 0.34);
  --blueprint-shadow: rgba(7, 22, 48, 0.24);

  position: relative;
  display: flex;
  width: min(100%, var(--line-length-l));
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(220, 236, 255, 0.58);
  border-radius: 2px;
  color: var(--blueprint-ink);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent 18%) top left / 96px 96px
      no-repeat,
    linear-gradient(225deg, rgba(255, 255, 255, 0.18), transparent 16%) top right / 82px 82px
      no-repeat,
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.12), transparent 28%),
    var(--blueprint-paper);
  background-size:
    96px 96px,
    82px 82px,
    12px 12px,
    12px 12px,
    72px 72px,
    72px 72px,
    auto,
    auto;
  box-shadow:
    0 32px 80px var(--blueprint-shadow),
    0 10px 28px rgba(7, 22, 48, 0.18),
    inset 0 0 0 8px rgba(220, 236, 255, 0.05),
    inset 0 0 48px rgba(0, 20, 66, 0.16);
  overflow: hidden;
  text-align: center;
  transform: rotate(-0.7deg);
}

.studio-code-blueprint::before,
.studio-code-blueprint::after {
  position: absolute;
  content: '';
  pointer-events: none;
}

.studio-code-blueprint::before {
  inset: 18px;
  border: 1px solid var(--blueprint-line);
  box-shadow: inset 0 0 0 1px rgba(18, 76, 168, 0.42);
}

.studio-code-blueprint::after {
  top: -1px;
  right: -1px;
  width: 78px;
  height: 78px;
  background: linear-gradient(
    225deg,
    rgba(229, 242, 255, 0.9) 0 49%,
    rgba(34, 91, 178, 0.82) 50% 100%
  );
  box-shadow: -5px 6px 14px rgba(0, 24, 70, 0.18);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  opacity: 0.95;
}

.studio-code-blueprint-ruler {
  position: absolute;
  inset: 18px;
  pointer-events: none;
}

.studio-code-blueprint-ruler::before,
.studio-code-blueprint-ruler::after {
  position: absolute;
  content: '';
  opacity: 0.48;
  pointer-events: none;
}

.studio-code-blueprint-ruler::before {
  top: 14px;
  right: 38px;
  left: 38px;
  height: 12px;
  background: repeating-linear-gradient(90deg, var(--blueprint-ink) 0 1px, transparent 1px 18px);
}

.studio-code-blueprint-ruler::after {
  top: 38px;
  bottom: 38px;
  left: 14px;
  width: 12px;
  background: repeating-linear-gradient(180deg, var(--blueprint-ink) 0 1px, transparent 1px 18px);
}

.studio-code-blueprint-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 43rem);
  padding: calc(var(--space-xxl) + var(--space-l)) var(--space-xxl);
  text-shadow: 0 0 12px rgba(220, 236, 255, 0.24);
}

.studio-code-blueprint-kicker {
  color: var(--blueprint-ink-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-snug);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.studio-code-blueprint-content h2 {
  color: var(--blueprint-ink);
  font-family: var(--font-mono);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0;
  text-transform: uppercase;
}

.studio-code-blueprint-content p {
  color: var(--blueprint-ink);
  font-family: var(--font-mono);
  font-size: var(--font-size-m);
  line-height: var(--line-height-loose);
}

.studio-code-blueprint-content > * {
  margin-bottom: 0;
}

.studio-code-blueprint-content > * + * {
  margin-top: var(--space-l);
}

.studio-code-blueprint :deep(.button) {
  border-color: rgba(220, 236, 255, 0.68);
  color: var(--blueprint-ink);
  background: rgba(10, 42, 140, 0.18);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.studio-code-blueprint :deep(.button:hover) {
  border-color: var(--blueprint-ink);
  color: var(--blueprint-ink);
  background: rgba(220, 236, 255, 0.12);
}

@media (max-width: 700px) {
  .studio-code-blueprint {
    min-height: 420px;
    transform: rotate(-0.4deg);
  }

  .studio-code-blueprint::before,
  .studio-code-blueprint-ruler {
    inset: 12px;
  }

  .studio-code-blueprint-content {
    padding: var(--space-xxl) var(--space-xl);
  }
}
</style>

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
  <DotGrid
    as="section"
    class="home-studio-code"
    :cross-size="5"
    :cross-thickness="1"
    :opacity="0.22"
    :repulsion="0.6"
    :ripple-strength="2"
    :spacing="27"
  >
    <div class="studio-code-blueprint-content">
      <svg
        class="studio-code-blueprint-logo"
        viewBox="0 0 102 103"
        role="img"
        aria-label="Pixel WordPress logo"
        shape-rendering="crispEdges"
      >
        <path
          class="studio-code-blueprint-logo-fill"
          d="M32.2618 8.16895L71.1262 8.17089L71.1253 13.7448L76.3053 13.7489L76.3054 19.3208L84.2745 19.3272L84.2706 24.6989L89.4525 24.7087L89.4502 30.2784L92.0459 30.2826L92.0546 35.8582L94.6333 35.865L94.6351 68.9276L92.0437 68.9339L92.0452 74.5093L89.4549 74.5125L89.4542 80.0847L84.2751 80.0895L84.2792 85.4642L76.3064 85.4636L76.3107 91.0426L71.1321 91.0405L71.1313 96.6205L32.2697 96.6228L32.2694 91.0372L26.8896 91.043L26.8976 85.462L19.1212 85.4669L19.1242 80.0819L13.9424 80.0962L13.9439 74.5034L11.3517 74.5191L11.3569 68.9298L6.17382 68.9386L6.16895 35.862L11.3555 35.8531L11.348 30.2845L13.9439 30.2793L13.942 24.702L19.1233 24.7038L19.1162 19.3227L26.8995 19.3224L26.8892 13.7472L32.2733 13.7489L32.2618 8.16895Z"
        />
        <path
          class="studio-code-blueprint-logo-cutout"
          d="M32.2618 8.16895L71.1262 8.17089L71.1253 13.7448L76.3053 13.7489L76.3054 19.3208L84.2745 19.3272L84.2706 24.6989L89.4525 24.7087L89.4502 30.2784L92.0459 30.2826L92.0546 35.8582L94.6333 35.865L94.6351 68.9276L92.0436 68.9339L92.0452 74.5093L89.4549 74.5125L89.4542 80.0847L84.2751 80.0895L84.2792 85.4642L76.3064 85.4636L73.7239 85.4686L73.7156 74.514L76.3069 74.506L76.305 63.3508L73.7063 63.3518C73.6854 65.1974 73.7066 67.0805 73.7083 68.9293L65.9428 68.9254L65.946 52.3974L63.3654 52.3995L63.3539 41.2425L58.186 41.2418L58.1772 30.2845C52.1664 30.2216 46.0552 30.2746 40.0359 30.2844L40.041 35.8681L45.2244 35.8594L45.2159 41.2416L47.8065 41.23L47.8158 63.3578C46.9812 63.3347 46.0555 63.3556 45.2136 63.3563L45.2219 68.9215L37.4692 68.9275L37.4555 57.9769L32.2878 57.9761L32.2761 46.8188L29.6896 46.8189L29.6894 35.8642L32.2792 35.8611L32.2789 30.2835L26.8958 30.2769L26.8995 19.3224L26.8892 13.7472L32.2733 13.7489L32.2618 8.16895Z"
        />
        <path
          class="studio-code-blueprint-logo-fill"
          d="M32.2618 8.16895L71.1262 8.17089L71.1253 13.7448L76.3053 13.7489L76.3054 19.3208L84.2745 19.3272L84.2706 24.6989L89.4525 24.7087L89.4502 30.2784L92.0459 30.2826L92.0546 35.8582L94.6333 35.865L94.6351 68.9276L92.0436 68.9339L92.0452 74.5093L89.4549 74.5125L89.4542 80.0847L84.2751 80.0895L84.2792 85.4642L76.3064 85.4636L73.7239 85.4686L73.7156 74.514L76.3069 74.506L76.305 63.3508C76.1948 56.0738 76.3 48.525 76.3008 41.2257L73.7067 41.2433L73.7092 35.8548L71.1177 35.8712L71.1129 24.7065L73.7095 24.7016L73.7066 19.3183C70.281 19.3598 66.7792 19.3238 63.3473 19.3258L63.3479 13.7405L40.0537 13.7433L40.053 19.3234L26.8995 19.3224L26.8892 13.7472L32.2733 13.7489L32.2618 8.16895Z"
        />
        <path
          class="studio-code-blueprint-logo-cutout"
          d="M84.2805 41.2356C86.844 41.235 89.4765 41.2665 92.0339 41.2314L92.0362 63.3489L89.4412 63.3547L89.4485 68.9213L84.2626 68.9322L84.2705 74.498L81.4728 74.511L81.4798 80.0779L76.294 80.0872L76.3063 85.4633L73.7238 85.4683L73.7156 74.5136L76.3068 74.5057L76.3049 63.3505L81.4863 63.3498L81.4918 57.9689L84.2794 57.973L84.2805 41.2356Z"
        />
        <path
          class="studio-code-blueprint-logo-cutout"
          d="M11.3663 41.2357L16.6545 41.2394L19.1203 41.2324L19.1204 52.4002L21.7146 52.3822L21.7098 57.9726C23.4077 57.9706 25.2056 58 26.8947 57.9629L26.8908 68.9406L29.6849 68.9295L29.6805 80.0949L32.2715 80.0814L32.2738 85.4651L26.8976 85.462L26.8987 80.0912L21.7145 80.0779L21.7192 74.5133L19.1417 74.5071L19.1308 68.934L13.9617 68.926L13.9533 63.3549L11.3564 63.3486L11.3663 41.2357Z"
        />
        <path
          class="studio-code-blueprint-logo-cutout"
          d="M47.8158 63.3575L55.5837 63.3511L55.5783 68.9406L58.1698 68.9249C58.1681 72.6299 58.1296 76.3965 58.1688 80.0961L63.3507 80.0815L63.3516 91.043L60.6992 91.041H45.2275L45.2284 74.5124L47.8186 74.5092C47.819 70.957 47.9251 66.861 47.8158 63.3575Z"
        />
      </svg>
      <div class="studio-code-blueprint-copy">
        <h2 class="type-heading type-xxl">Studio Code</h2>
        <p class="type-body type-l">
          Studio Code is an AI-powered WordPress agent that can write code, design themes, and
          manage site work conversationally.
        </p>
        <Button>Learn more</Button>
      </div>
    </div>
  </DotGrid>
</template>

<style scoped>
.home-studio-code {
  --blueprint-paper: #124ca8;
  --blueprint-ink: #dcecff;
  --blueprint-ink-muted: #a9c8f8;
  --blueprint-line: rgba(220, 236, 255, 0.34);
  --blueprint-line-strong: rgba(220, 236, 255, 0.58);
  --blueprint-shadow: rgba(7, 22, 48, 0.22);

  position: relative;
  display: grid;
  width: 100%;
  min-height: 270px;
  margin: clamp(56px, 7vw, 96px) 0;
  border: 1px solid var(--blueprint-line-strong);
  border-radius: 2px;
  color: var(--blueprint-ink);
  background: var(--blueprint-paper);
  overflow: hidden;
  text-align: left;
}

.home-studio-code::before {
  position: absolute;
  content: '';
  pointer-events: none;
}

.home-studio-code :deep(.dot-grid-canvas) {
  z-index: 0;
  color: rgba(220, 236, 255, 0.78);
  mix-blend-mode: screen;
}

.studio-code-blueprint-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-xl);
  box-sizing: border-box;
  width: 100%;
  max-width: var(--home-content-max-width);
  margin-inline: auto;
  padding: var(--space-xxl) var(--space-l);
  text-shadow: 0 0 12px rgba(220, 236, 255, 0.24);
}

.studio-code-blueprint-copy {
  max-width: 32rem;
}

.studio-code-blueprint-logo {
  width: clamp(152px, 18vw, 220px);
  height: auto;
  color: rgba(220, 236, 255, 0.82);
  filter:
    drop-shadow(0 0 4px rgba(220, 236, 255, 0.42))
    drop-shadow(0 0 22px rgba(86, 178, 255, 0.24));
  animation: studio-code-logo-breathe 5.8s ease-in-out infinite;
}

.studio-code-blueprint-logo-fill {
  fill: currentColor;
  stroke: transparent;
  stroke-width: 0;
}

.studio-code-blueprint-logo-fill:first-of-type {
  stroke: #7ff7ff;
  stroke-width: 1.4;
  stroke-dasharray: 18 260;
  stroke-dashoffset: 0;
  stroke-linejoin: round;
  filter:
    drop-shadow(0 0 5px rgba(127, 247, 255, 0.9))
    drop-shadow(0 0 14px rgba(127, 247, 255, 0.44));
  animation: studio-code-blueprint-trace 4.8s ease-in-out infinite;
}

.studio-code-blueprint-logo-fill:nth-of-type(3) {
  color: rgba(154, 214, 255, 0.72);
  stroke: #e9ff6a;
  stroke-width: 1.1;
  stroke-dasharray: 12 220;
  stroke-linejoin: round;
  filter:
    drop-shadow(0 0 4px rgba(233, 255, 106, 0.72))
    drop-shadow(0 0 12px rgba(233, 255, 106, 0.34));
  animation: studio-code-blueprint-trace 5.8s ease-in-out infinite;
  animation-direction: reverse;
  animation-delay: 1.2s;
}

.studio-code-blueprint-logo-cutout {
  fill: var(--blueprint-paper);
  stroke: transparent;
  stroke-width: 0;
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
  font-size: var(--font-size-s);
  line-height: var(--line-height-relaxed);
}

.studio-code-blueprint-copy > * {
  margin-bottom: 0;
}

.studio-code-blueprint-copy > * + * {
  margin-top: var(--space-l);
}

.home-studio-code :deep(.button) {
  flex: none;
  border-color: rgba(220, 236, 255, 0.68);
  color: var(--blueprint-ink);
  background: rgba(10, 42, 140, 0.18);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.home-studio-code :deep(.button:hover) {
  border-color: var(--blueprint-ink);
  color: var(--blueprint-ink);
  background: rgba(220, 236, 255, 0.12);
}

@keyframes studio-code-logo-breathe {
  0%,
  100% {
    filter:
      drop-shadow(0 0 4px rgba(220, 236, 255, 0.36))
      drop-shadow(0 0 18px rgba(86, 178, 255, 0.18));
  }

  50% {
    filter:
      drop-shadow(0 0 7px rgba(220, 236, 255, 0.5))
      drop-shadow(0 0 30px rgba(86, 178, 255, 0.32));
  }
}

@keyframes studio-code-blueprint-trace {
  0% {
    stroke-dashoffset: 70;
    stroke-opacity: 0;
  }

  14% {
    stroke-opacity: 0.95;
  }

  64% {
    stroke-opacity: 0.95;
  }

  84% {
    stroke-opacity: 0;
  }

  to {
    stroke-dashoffset: -250;
    stroke-opacity: 0;
  }
}

@media (max-width: 760px) {
  .home-studio-code {
    min-height: 330px;
    margin: clamp(48px, 12vw, 80px) 0;
  }

  .home-studio-code::before {
    inset: 12px;
  }

  .studio-code-blueprint-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .studio-code-blueprint-logo,
  .home-studio-code :deep(.button) {
    justify-self: start;
  }

  .studio-code-blueprint-logo {
    width: clamp(148px, 48vw, 220px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .studio-code-blueprint-logo,
  .studio-code-blueprint-logo-fill,
  .studio-code-blueprint-logo-cutout {
    animation: none;
  }
}
</style>

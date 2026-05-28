<!--
@component HomeInterfaces
@description Presents the three Studio surfaces: desktop app, CLI, and web dashboard.
@notes Uses FPO placeholders until final interface visuals are ready.
-->
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import FpoImage from './FpoImage.vue';
import SectionIntro from './SectionIntro.vue';
import screenshotStudioCode from '../../assets/screenshot-studio-code.png?url';
import screenshotStudioMacos from '../../assets/screenshot-studio-macos.png?url';

const interfaces = [
  {
    key: 'app',
    navLabel: 'Desktop',
    title: 'Studio Desktop',
    image: screenshotStudioMacos,
    features: [
      {
        title: 'Local site control',
        body: 'Create, start, stop, and inspect WordPress projects from one focused desktop workspace.',
      },
      {
        title: 'Built-in WordPress tools',
        body: 'Jump into WP admin, open the local site, manage imports, and adjust settings without context switching.',
      },
      {
        title: 'Agent-ready workspace',
        body: 'Keep site state, paths, services, and debugging details visible for human and AI-assisted work.',
      },
    ],
  },
  {
    key: 'cli',
    navLabel: 'CLI',
    title: 'Studio CLI',
    image: screenshotStudioCode,
    features: [
      {
        title: 'Scriptable workflows',
        body: 'Run repeatable Studio tasks from the terminal, shell scripts, or automated development flows.',
      },
      {
        title: 'Portable context',
        body: 'Bring WordPress-aware commands into the same environment where your code and agents already work.',
      },
      {
        title: 'Fast project actions',
        body: 'Move quickly through setup, inspection, and lifecycle commands without opening the full desktop app.',
      },
    ],
  },
  {
    key: 'web',
    navLabel: 'Web',
    title: 'Studio Web',
    features: [
      {
        title: 'Shared visibility',
        body: 'Give teammates a clear view into project status, activity, and running work from a browser.',
      },
      {
        title: 'Remote continuity',
        body: 'Check in on Studio work after you step away from your desk or switch machines.',
      },
      {
        title: 'Team-ready surfaces',
        body: 'Coordinate site work, reviews, and handoffs with interfaces designed for collaborative workflows.',
      },
    ],
  },
];

const root = ref(null);
const activeKey = ref(interfaces[0].key);

let observer;
let scrollFrame;

const updateActiveInterface = () => {
  if (!root.value) {
    return;
  }

  const cards = [...root.value.querySelectorAll('.interface-card')];
  const viewportAnchor = window.innerHeight * 0.38;
  const closest = cards.reduce((current, card) => {
    const { top } = card.getBoundingClientRect();
    const distance = Math.abs(top - viewportAnchor);

    if (!current || distance < current.distance) {
      return { key: card.dataset.interfaceKey, distance };
    }

    return current;
  }, null);

  if (closest?.key) {
    activeKey.value = closest.key;
  }
};

const scheduleActiveUpdate = () => {
  if (scrollFrame) {
    return;
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = undefined;
    updateActiveInterface();
  });
};

onMounted(() => {
  updateActiveInterface();

  observer = new IntersectionObserver(scheduleActiveUpdate, {
    rootMargin: '-20% 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  root.value?.querySelectorAll('.interface-card').forEach((card) => observer.observe(card));
  window.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveUpdate);
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener('scroll', scheduleActiveUpdate);
  window.removeEventListener('resize', scheduleActiveUpdate);

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame);
  }
});
</script>

<template>
  <section ref="root" class="home-interfaces px-xl pt-xxxl pl-xxl">
    <aside class="interfaces-rail vstack gap-xl">
      <SectionIntro
        align="left"
        verticalAlign="start"
        maxWidth="100%"
        :title="'Three tools.\nOne Studio.'"
        body="Choose the right surface for local work, automation, or team visibility."
        titleSize="type-xxl"
        bodySize="type-l"
      />

      <nav class="interfaces-nav" aria-label="Studio interfaces">
        <a
          v-for="item in interfaces"
          :key="item.key"
          class="interfaces-nav-link"
          :class="{ 'is-active': activeKey === item.key }"
          :aria-current="activeKey === item.key ? 'true' : undefined"
          :href="`#interface-${item.key}`"
        >
          {{ item.navLabel }}
        </a>
      </nav>
    </aside>

    <div class="interfaces-list vstack gap-xxxl">
      <article
        v-for="item in interfaces"
        :id="`interface-${item.key}`"
        :key="item.key"
        class="interface-card vstack gap-l"
        :data-interface-key="item.key"
      >
        <img
          v-if="item.image"
          class="interface-image"
          :src="item.image"
          :alt="`${item.title} interface screenshot`"
          loading="lazy"
        />
        <FpoImage v-else />
        <div class="interface-features">
          <article v-for="feature in item.features" :key="feature.title" class="interface-feature">
            <h4 class="type-heading type-m">{{ feature.title }}</h4>
            <p class="type-body type-s">{{ feature.body }}</p>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-interfaces {
  display: grid;
  grid-template-columns: minmax(12rem, 20rem) minmax(0, 1fr);
  gap: clamp(var(--space-xl), 5vw, var(--space-xxxl));
  align-items: start;
}

.interfaces-rail {
  position: sticky;
  /* top: clamp(var(--space-xl), calc(50vh - 13rem), var(--space-xxxl)); */
  top: 120px;
  max-width: 20rem;
}

.interfaces-rail :deep(.section-intro) {
  margin-inline: 0;
}

.interfaces-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.interfaces-nav-link {
  color: var(--color-chrome-fg);
  font-family: var(--font-heading);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-decoration: none;
}

.interfaces-nav-link.is-active {
  color: var(--color-theme-fill);
  font-weight: var(--font-weight-bold);
}

.interfaces-list {
  width: 100%;
}

.interface-card {
  width: 100%;
  scroll-margin-top: var(--space-xxl);
}

.interface-image,
.interface-card :deep(.fpo-image) {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: 0;
  border-radius: var(--space-m);
  object-fit: cover;
  object-position: top left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.interface-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(var(--space-xl), 4vw, var(--space-xxl));
  margin-top: var(--space-l);
  width: 100%;
}

.interface-feature {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.interface-feature h4,
.interface-feature p {
  margin: 0;
}

.interface-feature p {
  color: var(--color-chrome-fg-muted);
  line-height: var(--line-height-relaxed);
}

@media (max-width: 1120px) {
  .home-interfaces {
    display: flex;
    flex-direction: column;
    gap: var(--space-xxl);
  }

  .interfaces-rail {
    position: static;
    max-width: 100%;
  }

  .interfaces-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-m) var(--space-xl);
  }

  .interfaces-nav-link {
    font-size: var(--font-size-xl);
  }

  .interface-features {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}
</style>

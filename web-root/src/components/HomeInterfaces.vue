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
    summary:
      'Create, start, stop, and inspect WordPress projects from one focused desktop workspace.',
    href: '/desktop',
  },
  {
    key: 'cli',
    navLabel: 'CLI',
    title: 'Studio CLI',
    image: screenshotStudioCode,
    summary:
      'Run repeatable Studio tasks from the terminal, shell scripts, or automated development flows.',
    href: '/cli',
  },
  {
    key: 'web',
    navLabel: 'Web',
    title: 'Studio Web',
    summary:
      'Give teammates a clear view into project status, activity, and running work from a browser.',
    href: '/web',
  },
];

const root = ref(null);
const activeKey = ref(interfaces[0].key);

let observer;
let scrollFrame;
let interfacesScroller;

const updateActiveInterface = () => {
  if (!root.value) {
    return;
  }

  const cards = [...root.value.querySelectorAll('.interface-card')];
  const list = root.value.querySelector('.interfaces-list');
  const isHorizontalScroller = list && list.scrollWidth > list.clientWidth + 1;
  const listRect = list?.getBoundingClientRect();
  const viewportAnchor = window.innerHeight * 0.38;
  const closest = cards.reduce((current, card) => {
    const rect = card.getBoundingClientRect();
    const distance = isHorizontalScroller
      ? Math.abs(rect.left - listRect.left)
      : Math.abs(rect.top - viewportAnchor);

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

const scrollToInterface = (key) => {
  const list = root.value?.querySelector('.interfaces-list');
  const card = root.value?.querySelector(`#interface-${key}`);

  if (!card) {
    return;
  }

  activeKey.value = key;

  if (list && list.scrollWidth > list.clientWidth + 1) {
    list.scrollTo({
      left: card.offsetLeft - list.offsetLeft,
      behavior: 'smooth',
    });

    return;
  }

  card.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start',
  });
};

onMounted(() => {
  updateActiveInterface();

  observer = new IntersectionObserver(scheduleActiveUpdate, {
    rootMargin: '-20% 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  root.value?.querySelectorAll('.interface-card').forEach((card) => observer.observe(card));
  interfacesScroller = root.value?.querySelector('.interfaces-list');
  interfacesScroller?.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
  window.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveUpdate);
});

onUnmounted(() => {
  observer?.disconnect();
  interfacesScroller?.removeEventListener('scroll', scheduleActiveUpdate);
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
          @click.prevent="scrollToInterface(item.key)"
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
        <div class="interface-detail vstack gap-m">
          <h4 class="type-heading type-m">{{ item.title }}</h4>
          <p class="type-body type-xs">{{ item.summary }}</p>
          <a class="interface-detail-link type-body type-xs" :href="item.href">Learn more</a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-interfaces {
  display: grid;
  grid-template-columns: minmax(10rem, 16rem) minmax(0, 1fr);
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

.interfaces-rail :deep(.section-intro-title-line) {
  white-space: nowrap;
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

.interface-detail {
  margin-top: var(--space-l);
  max-width: var(--line-length-s);
}

.interface-detail h4,
.interface-detail p {
  margin: 0;
}

.interface-detail p {
  color: var(--color-chrome-fg-muted);
  line-height: var(--line-height-relaxed);
}

.interface-detail-link {
  width: fit-content;
  color: var(--color-theme-fill);
  text-decoration: underline;
  text-underline-offset: 0.12em;
}

.interface-detail-link:hover,
.interface-detail-link:focus-visible {
  color: var(--color-theme-fill-accent);
}

@media (max-width: 1120px) {
  .home-interfaces {
    grid-template-columns: minmax(10rem, 14rem) minmax(0, 1fr);
    gap: var(--space-xl);
  }
}

@media (max-width: 760px) {
  .home-interfaces {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    overflow-x: clip;
    padding-right: var(--space-l);
    padding-left: var(--space-l);
  }

  .interfaces-rail {
    position: static;
    max-width: 100%;
  }

  .interfaces-nav {
    position: sticky;
    top: var(--space-l);
    z-index: 2;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: var(--space-m) var(--space-xl);
    padding: var(--space-m) 0;
    background: var(--color-chrome-fill-transparent);
    backdrop-filter: blur(8px);
  }

  .interfaces-nav-link {
    flex: 0 0 auto;
    font-size: var(--font-size-xl);
  }

  .interfaces-list {
    display: flex;
    flex-direction: row;
    gap: var(--space-xl);
    box-sizing: border-box;
    width: calc(100% + (var(--space-l) * 2));
    max-width: none;
    margin-right: calc(var(--space-l) * -1);
    margin-left: calc(var(--space-l) * -1);
    padding-right: var(--space-l);
    padding-left: var(--space-l);
    overflow-x: auto;
    scroll-padding-inline: var(--space-l);
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .interface-card {
    flex: 0 0 min(82vw, 520px);
    scroll-snap-align: start;
    scroll-margin-inline: var(--space-l);
  }

  .interface-image,
  .interface-card :deep(.fpo-image) {
    max-height: min(48vh, 360px);
  }

  .interface-detail {
    gap: var(--space-l);
  }
}
</style>

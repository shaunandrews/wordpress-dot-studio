<!--
@component DocsPage
@description Renders the local Studio documentation reader with navigation, article content, and in-page anchors.
-->
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { studioDocGroups, studioDocs } from '../data/studioDocs.js';

const articleScroller = ref(null);
const activeSlug = ref(studioDocs[0].slug);

const articlesBySlug = computed(() => new Map(studioDocs.map((article) => [article.slug, article])));
const activeArticle = computed(() => articlesBySlug.value.get(activeSlug.value) || studioDocs[0]);
const activeSections = computed(() => activeArticle.value.content.filter((block) => block.type === 'section'));

function selectArticle(slug, replace = false) {
  if (!articlesBySlug.value.has(slug)) return;
  activeSlug.value = slug;

  const nextHash = `#${slug}`;
  if (window.location.hash !== nextHash) {
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](null, '', nextHash);
  }
}

function syncFromHash() {
  const slug = window.location.hash.replace('#', '');
  selectArticle(slug || studioDocs[0].slug, true);
}

watch(activeSlug, async () => {
  await nextTick();
  if (articleScroller.value) articleScroller.value.scrollTop = 0;
});

onMounted(() => {
  syncFromHash();
  window.addEventListener('hashchange', syncFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncFromHash);
});
</script>

<template>
  <main id="main" class="docs-page">
    <div class="docs-shell">
      <aside class="docs-sidebar" aria-label="Studio documentation">
        <div class="docs-sidebar-heading">
          <p class="type-label type-s">Docs</p>
          <h1 class="type-heading type-xl">WordPress Studio</h1>
        </div>

        <nav class="docs-nav" aria-label="Documentation sections">
          <section v-for="group in studioDocGroups" :key="group.title" class="docs-nav-group">
            <h2 class="type-label type-s">{{ group.title }}</h2>
            <button
              v-for="slug in group.articles"
              :key="slug"
              type="button"
              :class="{ 'is-active': activeSlug === slug }"
              @click="selectArticle(slug)"
            >
              {{ articlesBySlug.get(slug)?.title }}
            </button>
          </section>
        </nav>
      </aside>

      <article ref="articleScroller" class="docs-article">
        <header class="article-header">
          <p class="type-label type-s">{{ activeArticle.updated ? `Updated ${activeArticle.updated}` : 'Studio docs' }}</p>
          <h2 class="type-display type-xxxxl">{{ activeArticle.title }}</h2>
          <p class="type-body type-l">{{ activeArticle.description }}</p>
        </header>

        <section
          v-for="section in activeSections"
          :id="section.id"
          :key="section.id"
          class="article-section"
        >
          <h3 class="type-heading type-xxl">{{ section.title }}</h3>

          <template v-for="(block, index) in section.children" :key="`${section.id}-${index}`">
            <p v-if="block.type === 'p'" class="type-body type-m">{{ block.text }}</p>

            <ul v-else-if="block.type === 'ul'" class="article-list">
              <li v-for="item in block.items" :key="item">{{ item }}</li>
            </ul>

            <ol v-else-if="block.type === 'ol'" class="article-list">
              <li v-for="item in block.items" :key="item">{{ item }}</li>
            </ol>

            <pre v-else-if="block.type === 'code'"><code>{{ block.text }}</code></pre>

            <aside v-else-if="block.type === 'note'" class="article-note">
              {{ block.text }}
            </aside>

            <div v-else-if="block.type === 'table'" class="article-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th v-for="header in block.headers" :key="header">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in block.rows" :key="row.join('-')">
                    <td v-for="cell in row" :key="cell">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </section>

        <footer class="article-footer">
          <a :href="activeArticle.source">Source page</a>
        </footer>
      </article>

      <aside class="docs-toc" aria-label="On this page">
        <p class="type-label type-s">On this page</p>
        <a v-for="section in activeSections" :key="section.id" :href="`#${activeSlug}`" @click.prevent="articleScroller?.querySelector(`#${section.id}`)?.scrollIntoView({ block: 'start' })">
          {{ section.title }}
        </a>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.docs-page {
  --docs-rule: color-mix(in srgb, var(--color-chrome-border) 74%, transparent);
  --docs-surface: color-mix(in srgb, var(--color-chrome-fill) 88%, canvas 12%);
  height: 100%;
  padding-top: var(--site-header-height, 72px);
  overflow: hidden;
  background:
    linear-gradient(180deg, transparent 0, color-mix(in srgb, var(--color-chrome-fill) 52%, transparent) 100%),
    var(--color-chrome-fill);
}

.docs-page :is(.type-display, .type-heading) {
  letter-spacing: 0;
}

.docs-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 220px;
  height: 100%;
  min-height: 0;
  border-top: 1px solid var(--docs-rule);
}

.docs-sidebar,
.docs-toc {
  min-height: 0;
  overflow-y: auto;
  background: color-mix(in srgb, var(--color-chrome-fill) 92%, canvas 8%);
}

.docs-sidebar {
  border-right: 1px solid var(--docs-rule);
}

.docs-sidebar-heading {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--docs-rule);
}

.docs-sidebar-heading p,
.docs-toc p,
.article-header p,
.article-section p,
.article-list,
.article-note,
.article-footer {
  color: var(--color-chrome-fg-muted);
}

.docs-nav {
  padding: var(--space-l);
}

.docs-nav-group + .docs-nav-group {
  margin-top: var(--space-xl);
}

.docs-nav-group h2 {
  margin-bottom: var(--space-m);
  color: var(--color-chrome-fg-muted);
}

.docs-nav button {
  display: block;
  width: 100%;
  min-height: 34px;
  padding: var(--space-s) var(--space-m);
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-chrome-fg-muted);
  background: transparent;
  font: inherit;
  font-size: var(--font-size-s);
  text-align: left;
  cursor: pointer;
}

.docs-nav button:hover,
.docs-nav button.is-active {
  border-color: var(--docs-rule);
  color: var(--color-chrome-fg);
  background: var(--docs-surface);
}

.docs-article {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: var(--space-xxl) clamp(var(--space-xl), 6vw, var(--space-xxxl));
}

.article-header {
  max-width: var(--line-length-m);
  padding-bottom: var(--space-xxl);
  border-bottom: 1px solid var(--docs-rule);
}

.article-header h2 {
  margin: var(--space-m) 0 var(--space-l);
}

.article-section {
  max-width: var(--line-length-m);
  padding: var(--space-xxl) 0;
  border-bottom: 1px solid var(--docs-rule);
  scroll-margin-top: var(--space-xl);
}

.article-section h3 {
  margin-bottom: var(--space-l);
}

.article-section p + p,
.article-section p + .article-list,
.article-list + p,
.article-list + .article-note,
.article-section pre,
.article-table-wrap,
.article-note {
  margin-top: var(--space-l);
}

.article-list {
  padding-left: 1.25rem;
  line-height: var(--line-height-relaxed);
}

.article-list li + li {
  margin-top: var(--space-s);
}

.article-note {
  padding: var(--space-l);
  border: 1px solid var(--docs-rule);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-theme-fill) 6%, transparent);
}

.article-table-wrap {
  overflow-x: auto;
}

.article-footer {
  max-width: var(--line-length-m);
  padding-top: var(--space-xl);
}

.article-footer a,
.docs-toc a {
  color: var(--color-theme-fill);
}

.docs-toc {
  padding: var(--space-xl);
  border-left: 1px solid var(--docs-rule);
}

.docs-toc p {
  margin-bottom: var(--space-m);
}

.docs-toc a {
  display: block;
  padding: var(--space-s) 0;
  font-size: var(--font-size-s);
  line-height: var(--line-height-relaxed);
  text-decoration: none;
}

pre {
  max-width: 100%;
}

@media (max-width: 1120px) {
  .docs-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .docs-toc {
    display: none;
  }
}

@media (max-width: 760px) {
  .docs-page {
    overflow-y: auto;
  }

  .docs-shell {
    display: block;
    height: auto;
  }

  .docs-sidebar,
  .docs-article {
    overflow: visible;
  }

  .docs-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--docs-rule);
  }

  .docs-nav {
    display: flex;
    gap: var(--space-l);
    overflow-x: auto;
  }

  .docs-nav-group {
    flex: 0 0 220px;
  }

  .docs-nav-group + .docs-nav-group {
    margin-top: 0;
  }

  .docs-article {
    padding: var(--space-xl) var(--space-l);
  }
}
</style>

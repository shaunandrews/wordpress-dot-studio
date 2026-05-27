# Routing Stubs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vue Router routes and initial stub pages for Home, Desktop, CLI, Web, Docs, and Download.

**Architecture:** Keep the global shell in `App.vue`, move the existing landing page composition into `HomePage.vue`, and define route metadata in a focused `routes.js` file. `router.js` owns `createRouter` and `main.js` installs it.

**Tech Stack:** Vue 3, Vite, Vue Router, Node built-in test runner for route metadata, Vite build for integration verification.

---

### Task 1: Route Metadata Test

**Files:**
- Create: `web-root/src/routes.test.js`
- Create: `web-root/src/routes.js`

- [ ] **Step 1: Write the failing route metadata test**

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { routes } from './routes.js';

describe('routes', () => {
  it('defines the public page routes', () => {
    assert.deepEqual(
      routes.map((route) => route.path),
      ['/', '/desktop', '/cli', '/web', '/docs', '/download']
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test web-root/src/routes.test.js`
Expected: FAIL because `web-root/src/routes.js` does not exist yet.

- [ ] **Step 3: Add minimal route metadata**

```js
export const routes = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/desktop', name: 'desktop', component: () => import('./pages/DesktopPage.vue') },
  { path: '/cli', name: 'cli', component: () => import('./pages/CliPage.vue') },
  { path: '/web', name: 'web', component: () => import('./pages/WebPage.vue') },
  { path: '/docs', name: 'docs', component: () => import('./pages/DocsPage.vue') },
  { path: '/download', name: 'download', component: () => import('./pages/DownloadPage.vue') },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test web-root/src/routes.test.js`
Expected: PASS.

### Task 2: Router Shell and Pages

**Files:**
- Create: `web-root/src/router.js`
- Create: `web-root/src/pages/HomePage.vue`
- Create: `web-root/src/pages/DesktopPage.vue`
- Create: `web-root/src/pages/CliPage.vue`
- Create: `web-root/src/pages/WebPage.vue`
- Create: `web-root/src/pages/DocsPage.vue`
- Create: `web-root/src/pages/DownloadPage.vue`
- Modify: `web-root/src/main.js`
- Modify: `web-root/src/App.vue`
- Modify: `web-root/src/components/SiteHeader.vue`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install Vue Router**

Run: `npm install vue-router`
Expected: dependency added to `package.json` and lockfile.

- [ ] **Step 2: Create router**

```js
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes.js';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

- [ ] **Step 3: Install router in Vue**

```js
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router.js';
import '../styles/site.css';

createApp(App).use(router).mount('#app');
```

- [ ] **Step 4: Move current home sections into `HomePage.vue`**

Use the existing imports and `<main>` content from `App.vue` without changing section internals.

- [ ] **Step 5: Make `App.vue` a global shell**

Keep `SiteHeader`, footer, and dev-only `AgentationOverlay`; replace home section imports with `<RouterView />`.

- [ ] **Step 6: Add simple stub pages**

Each stub renders one full-width page section with an `h1` and one short paragraph using existing style tokens.

- [ ] **Step 7: Update header navigation**

Use `RouterLink` for internal links and change Desktop from `/app` to `/desktop`.

### Task 3: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run route metadata test**

Run: `node --test web-root/src/routes.test.js`
Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Start Vite and inspect routes if build passes**

Run: `npm run dev -- --host 127.0.0.1`
Expected: Vite serves the app on port 5174 and the new URLs render.

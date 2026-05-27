export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/desktop',
    name: 'desktop',
    component: () => import('./pages/DesktopPage.vue'),
  },
  {
    path: '/cli',
    name: 'cli',
    component: () => import('./pages/CliPage.vue'),
  },
  {
    path: '/web',
    name: 'web',
    component: () => import('./pages/WebPage.vue'),
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('./pages/DocsPage.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('./pages/DownloadPage.vue'),
  },
];

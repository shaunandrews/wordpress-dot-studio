import { createRouter, createWebHistory } from 'vue-router';
import { createPageTransitionHandler } from './pageTransitions.js';
import { routes } from './routes.js';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

createPageTransitionHandler({ router });

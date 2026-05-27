import { nextTick } from 'vue';

export function shouldUseViewTransitions({
  document: documentLike = globalThis.document,
  window: windowLike = globalThis.window,
} = {}) {
  if (typeof documentLike?.startViewTransition !== 'function') {
    return false;
  }

  return !windowLike?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function createPageTransitionHandler({
  document: documentLike = globalThis.document,
  router,
  tick = nextTick,
  window: windowLike = globalThis.window,
} = {}) {
  if (!router) {
    throw new TypeError('A Vue Router instance is required to install page transitions.');
  }

  router.afterEach((to, from, failure) => {
    if (failure || to.fullPath === from.fullPath) {
      return;
    }

    if (!to.meta?.pageTransition) {
      return;
    }

    if (!shouldUseViewTransitions({ document: documentLike, window: windowLike })) {
      return;
    }

    return documentLike.startViewTransition(async () => {
      await tick();
    });
  });
}

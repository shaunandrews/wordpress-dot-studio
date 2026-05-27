import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createPageTransitionHandler, shouldUseViewTransitions } from './pageTransitions.js';

describe('page transitions', () => {
  it('uses the View Transitions API for opted-in successful route changes', async () => {
    let afterEach;
    const router = {
      afterEach(callback) {
        afterEach = callback;
      },
    };
    const calls = [];
    const documentLike = {
      startViewTransition(callback) {
        calls.push('start');
        return callback();
      },
    };

    createPageTransitionHandler({
      document: documentLike,
      router,
      tick: async () => calls.push('tick'),
    });

    await afterEach({ fullPath: '/docs', meta: { pageTransition: true } }, { fullPath: '/' });

    assert.deepEqual(calls, ['start', 'tick']);
  });

  it('does not start a transition for routes that are not opted in', async () => {
    let afterEach;
    const router = {
      afterEach(callback) {
        afterEach = callback;
      },
    };
    const documentLike = {
      startViewTransition() {
        throw new Error('should not transition routes by default');
      },
    };

    createPageTransitionHandler({ document: documentLike, router });

    await afterEach({ fullPath: '/cli', meta: {} }, { fullPath: '/' });
  });

  it('does not start a transition when navigation fails', async () => {
    let afterEach;
    const router = {
      afterEach(callback) {
        afterEach = callback;
      },
    };
    const documentLike = {
      startViewTransition() {
        throw new Error('should not transition failed navigation');
      },
    };

    createPageTransitionHandler({ document: documentLike, router });

    await afterEach({ fullPath: '/docs' }, { fullPath: '/' }, new Error('aborted'));
  });

  it('does not use view transitions when reduced motion is requested', () => {
    const documentLike = {
      startViewTransition() {},
    };
    const windowLike = {
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: true };
      },
    };

    assert.equal(shouldUseViewTransitions({ document: documentLike, window: windowLike }), false);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { routes } from './routes.js';

describe('routes', () => {
  it('defines the public page routes', () => {
    assert.deepEqual(
      routes.map((route) => route.path),
      ['/', '/desktop', '/cli', '/web', '/docs', '/download']
    );
  });
});

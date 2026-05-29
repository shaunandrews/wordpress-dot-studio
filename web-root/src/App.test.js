import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./App.vue', import.meta.url), 'utf8');

describe('App', () => {
  it('keeps the Agentation dev overlay opt-in so third-party overlay errors cannot blank the app', () => {
    assert.match(
      source,
      /import\.meta\.env\.DEV && import\.meta\.env\.VITE_ENABLE_AGENTATION === 'true'/
    );
    assert.match(
      source,
      /defineAsyncComponent\(\(\) => import\('\.\/components\/AgentationOverlay\.vue'\)\)/
    );
  });
});

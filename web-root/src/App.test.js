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

  it('includes footer links for Automattic and legal resources', () => {
    assert.match(source, /href="https:\/\/automattic\.com\/"/);
    assert.match(source, />\s*Automattic\s*<\/a>/);
    assert.match(source, /href="https:\/\/automattic\.com\/work-with-us\/"/);
    assert.match(source, />\s*Work with us\s*<\/a>/);
    assert.match(source, /href="https:\/\/automattic\.com\/privacy\/"/);
    assert.match(source, />\s*Privacy\s*<\/a>/);
    assert.match(source, /href="https:\/\/wordpress\.com\/tos\/"/);
    assert.match(source, />\s*Terms\s*<\/a>/);
    assert.match(source, /rel="noopener noreferrer"/);
  });
});

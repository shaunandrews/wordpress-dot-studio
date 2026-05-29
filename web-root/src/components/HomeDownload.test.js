import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeDownload.vue', import.meta.url), 'utf8');

describe('HomeDownload', () => {
  it('uses a wide frame for download options', () => {
    assert.match(source, /<section class="home-download px-l">/);
    assert.match(source, /\.home-download\s*{[^}]*max-width:\s*var\(--home-content-max-width\);/);
  });
});

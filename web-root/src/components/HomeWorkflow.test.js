import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeWorkflow.vue', import.meta.url), 'utf8');

describe('HomeWorkflow', () => {
  it('renders the workflow section inside a DotGrid backdrop', () => {
    assert.match(source, /import DotGrid from '\.\/DotGrid\.vue';/);
    assert.match(source, /<DotGrid as="section" class="home-workflow p-xxl w-full vstack gap-xl">/);
    assert.match(source, /<\/DotGrid>/);
    assert.match(source, /\.home-workflow :deep\(\.dot-grid-canvas\)/);
  });
});

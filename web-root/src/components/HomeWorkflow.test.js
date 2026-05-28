import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeWorkflow.vue', import.meta.url), 'utf8');

describe('HomeWorkflow', () => {
  it('renders the workflow section without a dot grid backdrop', () => {
    assert.doesNotMatch(source, /import DotGrid from '\.\/DotGrid\.vue';/);
    assert.match(source, /<section class="home-workflow p-xxxl w-full vstack gap-xl">/);
    assert.match(source, /<\/section>/);
    assert.match(source, /\.home-workflow\s*{[^}]*position:\s*relative;/);
    assert.match(source, /\.home-workflow\s*{[^}]*z-index:\s*0;/);
    assert.match(source, /\.home-workflow\s*{[^}]*padding-top:\s*var\(--space-xxxl\);/);
    assert.match(source, /\.home-workflow\s*{[^}]*padding-right:\s*var\(--space-xl\);/);
    assert.match(source, /\.home-workflow\s*{[^}]*padding-left:\s*var\(--space-xxl\);/);
    assert.doesNotMatch(source, /\.home-workflow :deep\(\.dot-grid-canvas\)/);
    assert.match(source, /class="workflow-card-link type-body type-s" :href="step\.href"/);
    assert.match(source, /Learn more ->/);
    assert.match(source, /\.workflow-card\s*{[^}]*text-align:\s*left;/);
    assert.doesNotMatch(source, /\.workflow-card-illustration\s*{[^}]*border:/);
    assert.doesNotMatch(source, /\.workflow-card-illustration\s*{[^}]*border-radius:/);
  });
});

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
    assert.match(source, /\.home-workflow\s*{[^}]*padding-bottom:\s*var\(--space-xxl\);/);
    assert.match(source, /\.home-workflow\s*{[^}]*padding-left:\s*var\(--space-xxl\);/);
    assert.doesNotMatch(source, /\.home-workflow :deep\(\.dot-grid-canvas\)/);
    assert.match(source, /class="workflow-card-copy vstack gap-s"/);
    assert.match(source, /class="workflow-card-link type-body type-s" :href="step\.href"/);
    assert.match(source, /<span>Learn more<\/span>/);
    assert.match(source, /class="workflow-card-link-icon"/);
    assert.match(source, /\.home-workflow-process\s*{[^}]*display:\s*grid;/);
    assert.match(source, /\.home-workflow-process\s*{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/);
    assert.match(source, /\.workflow-card\s*{[^}]*text-align:\s*left;/);
    assert.match(source, /\.workflow-card-copy\s*{[^}]*max-width:\s*28rem;/);
    assert.match(source, /\.workflow-card-illustration\s*{[^}]*justify-content:\s*center;[^}]*align-items:\s*center;/);
    assert.match(source, /\.workflow-card-link\s*{[^}]*margin-top:\s*var\(--space-m\);[^}]*color:\s*var\(--color-theme-fill\);[^}]*font-weight:\s*var\(--font-weight-regular\);[^}]*text-decoration:\s*underline;/);
    assert.match(source, /@media \(max-width: 1120px\)\s*{[\s\S]*?\.home-workflow-process\s*{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/);
    assert.match(source, /@media \(max-width: 1120px\)\s*{[\s\S]*?\.workflow-card\s*{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(116px, 0\.28fr\) minmax\(0, 1fr\);/);
    assert.match(source, /@media \(max-width: 760px\)\s*{[\s\S]*?\.home-workflow-process\s*{[^}]*grid-template-columns:\s*1fr;/);
    assert.match(source, /@media \(max-width: 760px\)\s*{[\s\S]*?\.home-workflow\s*{[^}]*padding-bottom:\s*var\(--space-xl\);/);
    assert.match(source, /\.workflow-card-illustration\s*{[^}]*border:\s*1px solid color-mix\(in srgb, var\(--color-chrome-border\) 58%, transparent\);/);
    assert.match(source, /\.workflow-card-illustration\s*{[^}]*border-radius:\s*var\(--space-m\);/);
    assert.match(source, /\.workflow-card-illustration\s*{[^}]*background:\s*color-mix\(in srgb, var\(--color-chrome-fill\) 86%, var\(--color-chrome-border\) 14%\);/);
  });
});

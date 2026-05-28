import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./SectionIntro.vue', import.meta.url), 'utf8');

describe('SectionIntro', () => {
  it('renders newline-separated title text on separate lines', () => {
    assert.match(source, /const titleLines = computed\(\(\) => props\.title\.split\('\\n'\)\);/);
    assert.match(source, /<span[\s\S]*?v-for="\(\s*line,\s*index\s*\) in titleLines"/);
    assert.match(source, /class="section-intro-title-line"/);
    assert.match(source, /\.section-intro-title-line\s*{[^}]*display:\s*block;/);
  });
});

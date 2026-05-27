import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./SiteHeader.vue', import.meta.url), 'utf8');

describe('SiteHeader', () => {
  it('marks the current nav link with an exact active class', () => {
    assert.match(source, /exact-active-class="nav-link-active"/);
  });

  it('styles the active nav link distinctly from inactive links', () => {
    assert.match(source, /\.site-nav \.nav-link-active\s*{/);
  });

  it('renders a dedicated active nav indicator', () => {
    assert.match(source, /ref="siteNav"/);
    assert.match(source, /class="site-nav-indicator"/);
    assert.match(source, /--active-nav-x/);
    assert.match(source, /--active-nav-width/);
  });
});

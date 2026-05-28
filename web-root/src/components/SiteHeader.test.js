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

  it('uses theme-aware nav color tokens', () => {
    assert.match(source, /background:\s*var\(--color-chrome-fill-transparent\)/);
    assert.match(source, /background:\s*var\(--color-nav-indicator-fill\)/);
    assert.match(source, /color:\s*var\(--color-nav-indicator-fg\)/);
  });

  it('renders a dedicated active nav indicator', () => {
    assert.match(source, /ref="siteNav"/);
    assert.match(source, /class="site-nav-indicator"/);
    assert.match(source, /--active-nav-x/);
    assert.match(source, /--active-nav-width/);
  });

  it('renders a compact navigation menu for narrow viewports', () => {
    assert.match(source, /class="compact-brand"/);
    assert.match(source, /class="compact-nav-toggle"/);
    assert.match(source, /activeCompactLabel/);
    assert.match(source, /v-for="item in compactNavItems"/);
    assert.match(source, /@media \(max-width: 760px\)/);
  });

  it('closes the compact menu after navigation or escape', () => {
    assert.match(source, /function closeCompactMenu\(\)/);
    assert.match(source, /@click="closeCompactMenu"/);
    assert.match(source, /event\.key === 'Escape'/);
  });
});

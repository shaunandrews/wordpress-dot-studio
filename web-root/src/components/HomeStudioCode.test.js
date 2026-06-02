import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./HomeStudioCode.vue', import.meta.url), 'utf8');

describe('HomeStudioCode', () => {
  it('keeps the blueprint content aligned to the shared section gutter', () => {
    assert.match(source, /class="home-studio-code"/);
    assert.doesNotMatch(source, /class="home-studio-code px-l"/);
    assert.match(source, /\.home-studio-code\s*{[^}]*width:\s*100%;/);
    assert.match(source, /\.home-studio-code\s*{[^}]*margin:\s*clamp\(56px, 7vw, 96px\) 0;/);
    assert.doesNotMatch(source, /\.home-studio-code\s*{[^}]*justify-content:\s*center;/);
    assert.match(source, /\.studio-code-blueprint-content\s*{[^}]*box-sizing:\s*border-box;[^}]*width:\s*100%;[^}]*max-width:\s*var\(--home-content-max-width\);[^}]*margin-inline:\s*auto;[^}]*padding:\s*var\(--space-xxl\) var\(--space-l\);/);
    assert.doesNotMatch(source, /studio-code-blueprint-logo-shell/);
    assert.match(source, /\.studio-code-blueprint-logo\s*{[^}]*width:\s*clamp\(152px, 18vw, 220px\);/);
    // The logo renders as the plain pixel mark: no glow filter, no animation, no
    // cyan/yellow trace strokes.
    assert.doesNotMatch(source, /studio-code-logo-breathe/);
    assert.doesNotMatch(source, /studio-code-blueprint-trace/);
    assert.doesNotMatch(source, /#7ff7ff/);
    assert.doesNotMatch(source, /#e9ff6a/);
    assert.doesNotMatch(source, /\.studio-code-blueprint-logo\s*{[^}]*filter:/);
    assert.doesNotMatch(source, /\.studio-code-blueprint-logo\s*{[^}]*animation:/);
    assert.match(source, /\.studio-code-blueprint-logo-fill\s*{[^}]*fill:\s*currentColor;/);
    assert.match(source, /\.studio-code-blueprint-logo-cutout\s*{[^}]*fill:\s*var\(--blueprint-paper\);/);
    assert.doesNotMatch(source, /studio-code-vector-glitch/);
    assert.doesNotMatch(source, /studio-code-cutout-flicker/);
    assert.doesNotMatch(source, /width:\s*min\(calc\(100% - \(var\(--space-l\) \* 2\)\), 30rem\);/);
    assert.match(
      source,
      /@media \(max-width: 760px\)\s*{[\s\S]*?\.home-studio-code\s*{[^}]*margin:\s*clamp\(48px, 12vw, 80px\) 0;/
    );
  });
});

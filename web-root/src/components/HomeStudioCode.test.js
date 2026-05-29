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
    assert.match(source, /\.studio-code-blueprint-logo\s*{[^}]*animation:\s*studio-code-logo-breathe 5\.8s ease-in-out infinite;/);
    assert.match(source, /\.studio-code-blueprint-logo-fill:first-of-type\s*{[^}]*stroke:\s*#7ff7ff;[^}]*stroke-dasharray:\s*18 260;[^}]*animation:\s*studio-code-blueprint-trace 4\.8s ease-in-out infinite;/);
    assert.match(source, /\.studio-code-blueprint-logo-fill:nth-of-type\(3\)\s*{[^}]*stroke:\s*#e9ff6a;[^}]*stroke-dasharray:\s*12 220;[^}]*animation:\s*studio-code-blueprint-trace 5\.8s ease-in-out infinite;/);
    assert.match(source, /\.studio-code-blueprint-logo-cutout\s*{[^}]*stroke:\s*transparent;/);
    assert.doesNotMatch(source, /studio-code-vector-glitch/);
    assert.doesNotMatch(source, /studio-code-cutout-flicker/);
    assert.doesNotMatch(source, /width:\s*min\(calc\(100% - \(var\(--space-l\) \* 2\)\), 30rem\);/);
    assert.match(
      source,
      /@media \(max-width: 760px\)\s*{[\s\S]*?\.home-studio-code\s*{[^}]*margin:\s*clamp\(48px, 12vw, 80px\) 0;/
    );
  });
});

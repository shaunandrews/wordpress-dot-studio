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
    assert.match(source, /\.studio-code-blueprint-content\s*{[^}]*box-sizing:\s*border-box;[^}]*width:\s*100%;[^}]*max-width:\s*960px;[^}]*margin-inline:\s*auto;[^}]*padding:\s*var\(--space-xxl\) var\(--space-l\);/);
    assert.doesNotMatch(source, /width:\s*min\(calc\(100% - \(var\(--space-l\) \* 2\)\), 30rem\);/);
    assert.match(
      source,
      /@media \(max-width: 760px\)\s*{[\s\S]*?\.home-studio-code\s*{[^}]*margin:\s*clamp\(48px, 12vw, 80px\) 0;/
    );
  });
});

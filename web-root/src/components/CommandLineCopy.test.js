import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./CommandLineCopy.vue', import.meta.url), 'utf8');
const heroActionsSource = readFileSync(new URL('./HomeHeroActions.vue', import.meta.url), 'utf8');
const downloadSource = readFileSync(new URL('./HomeDownload.vue', import.meta.url), 'utf8');

describe('CommandLineCopy', () => {
  it('copies from both the input-like command field and the icon button', () => {
    assert.match(source, /async function copyCommand\(\)/);
    assert.match(source, /navigator\.clipboard\?\.writeText/);
    assert.match(source, /function copyWithTextarea\(\)/);
    assert.match(source, /class="command-line-copy-field"[\s\S]*?@click="copyCommand"/);
    assert.match(source, /class="command-line-copy-button"[\s\S]*?@click="copyCommand"/);
    assert.match(source, /<code data-install-command>\{\{ command \}\}<\/code>/);
  });

  it('is used for homepage command snippets', () => {
    assert.match(heroActionsSource, /import CommandLineCopy from '\.\/CommandLineCopy\.vue';/);
    assert.match(heroActionsSource, /<CommandLineCopy :command="command" \/>/);
    assert.match(downloadSource, /import CommandLineCopy from '\.\/CommandLineCopy\.vue';/);
    assert.match(
      downloadSource,
      /<CommandLineCopy v-if="item\.command" :command="item\.command" \/>/
    );
    assert.doesNotMatch(downloadSource, /:data-copy="item\.command"/);
    assert.doesNotMatch(downloadSource, />Copy<\/Button>/);
  });
});

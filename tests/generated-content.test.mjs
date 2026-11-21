import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { escapeHtml, renderLinkedText } from '../scripts/generated-content.mjs';

const read = (file) => readFileSync(new URL('../' + file, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('the original FAQ HTML includes each published question and answer', () => {
    const faq = read('faq.html');
    const { categories } = JSON.parse(read('data/faq.json'));
    const items = categories.flatMap(({ items }) => items);
    assert.equal((faq.match(/<details class="faq-item">/g) || []).length, items.length);
    for (const { question, answer } of items) {
        assert.ok(faq.includes('<span>' + escapeHtml(question) + '</span>'), question);
        assert.ok(faq.includes('<p>' + renderLinkedText(answer) + '</p>'), question);
    }
    assert.doesNotMatch(faq, /Loading FAQ…/);
});

test('the original changelog HTML includes each published entry', () => {
    const changelog = read('changelog.html');
    const { entries } = JSON.parse(read('data/changelog.json'));
    assert.equal((changelog.match(/<article class="changelog-entry">/g) || []).length, entries.length);
    for (const { date, title, content } of entries) {
        assert.ok(changelog.includes('datetime="' + escapeHtml(date) + '"'), date);
        assert.ok(changelog.includes('<h3>' + escapeHtml(title) + '</h3>'), title);
        assert.ok(changelog.includes('<p>' + renderLinkedText(content) + '</p>'), title);
    }
    assert.doesNotMatch(changelog, /Loading changelog…/);
});

test('generators update static pages on Markdown edits and are stable on rerun', (t) => {
    const cwd = mkdtempSync(join(tmpdir(), 'upanga-content-'));
    const fixtures = {
        'docs/FAQ.MD': '# FAQ\n## Sample\n### Is <teal> safe?\n[Google Play](https://example.com/?a=1&b=2) [unsafe](javascript:alert(1))',
        'docs/CHANGELOG.MD': '# Changelog\n## 2026-11-20\n### First release\n<em>New</em> [Details](https://example.com/)',
        'faq.html': 'before\n<!-- content:faq:start -->\nold\n<!-- content:faq:end -->\nafter\n',
        'changelog.html': 'before\n<!-- content:changelog:start -->\nold\n<!-- content:changelog:end -->\nafter\n',
    };
    const files = [...Object.keys(fixtures), 'data/faq.json', 'data/changelog.json'];
    t.after(() => {
        for (const file of files) {
            try { unlinkSync(join(cwd, file)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
        rmdirSync(join(cwd, 'docs'));
        rmdirSync(join(cwd, 'data'));
        rmdirSync(cwd);
    });
    mkdirSync(join(cwd, 'docs'));
    mkdirSync(join(cwd, 'data'));
    for (const [file, content] of Object.entries(fixtures)) writeFileSync(join(cwd, file), content);

    const generate = () => {
        for (const kind of ['faq', 'changelog']) {
            const script = fileURLToPath(new URL('../scripts/generate-' + kind + '.mjs', import.meta.url));
            execFileSync(process.execPath, [script], { cwd });
        }
    };
    const readFixture = (file) => readFileSync(join(cwd, file), 'utf8');
    generate();
    const faq = readFixture('faq.html');
    assert.match(faq, /Is &lt;teal&gt; safe\?/);
    assert.match(faq, /<a href="https:\/\/example\.com\/\?a=1&amp;b=2">Google Play<\/a>/);
    assert.doesNotMatch(faq, /href="javascript:/);
    assert.match(readFixture('changelog.html'), /&lt;em&gt;New&lt;\/em&gt; <a href="https:\/\/example\.com\/">Details<\/a>/);
    for (const file of ['faq.html', 'changelog.html']) {
        assert.ok(readFixture(file).startsWith('before\n'));
        assert.ok(readFixture(file).endsWith('\nafter\n'));
    }

    const before = files.map(readFixture);
    generate();
    assert.deepEqual(files.map(readFixture), before);
});

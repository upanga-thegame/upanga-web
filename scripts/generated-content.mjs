import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => htmlEntities[character]);
}

export function renderLinkedText(content) {
    return escapeHtml(content)
        .replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/gi, '<a href="$2">$1</a>');
}

export function writeGeneratedHtml(file, kind, markup) {
    const original = readFileSync(file, 'utf8');
    const startMarker = '<!-- content:' + kind + ':start -->';
    const endMarker = '<!-- content:' + kind + ':end -->';
    const start = original.indexOf(startMarker);
    const end = original.indexOf(endMarker);
    if (start < 0 || end <= start || start !== original.lastIndexOf(startMarker) || end !== original.lastIndexOf(endMarker)) {
        throw new Error('Expected one ordered pair of ' + kind + ' content markers in ' + file);
    }
    const newline = original.includes('\r\n') ? '\r\n' : '\n';
    const block = [startMarker, markup, endMarker].join('\n').replace(/\r?\n/g, newline);
    const updated = original.slice(0, start) + block + original.slice(end + endMarker.length);
    if (updated !== original) writeFileSync(file, updated, 'utf8');
}

export function writeGeneratedJson(file, content) {
    try {
        const { generatedAt, ...existing } = JSON.parse(readFileSync(file, 'utf8')) ?? {};
        if (typeof generatedAt === 'string' && !Number.isNaN(Date.parse(generatedAt)) && JSON.stringify(existing) === JSON.stringify(content)) {
            return;
        }
    } catch (error) {
        if (!(error instanceof SyntaxError) && error.code !== 'ENOENT') throw error;
    }

    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), ...content }, null, 2), 'utf8');
}

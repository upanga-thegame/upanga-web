import fs from 'fs';
import path from 'path';
import { escapeHtml, renderLinkedText, writeGeneratedHtml, writeGeneratedJson } from './generated-content.mjs';

const sourcePath = path.join(process.cwd(), 'docs', 'CHANGELOG.MD');
const outputPath = path.join(process.cwd(), 'data', 'changelog.json');

if (!fs.existsSync(sourcePath)) {
    console.error('Error: docs/CHANGELOG.MD not found.');
    process.exit(1);
}

const lines = fs.readFileSync(sourcePath, 'utf8').split('\n');
const entries = [];
let currentDate = '';
let currentEntry = null;

for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
        if (currentEntry) entries.push(currentEntry);
        currentDate = trimmed.substring(3).trim();
        currentEntry = null;
    } else if (trimmed.startsWith('### ')) {
        if (currentEntry) entries.push(currentEntry);
        currentEntry = { date: currentDate, title: trimmed.substring(4).trim(), content: '' };
    } else if (currentEntry && trimmed) {
        currentEntry.content += (currentEntry.content ? '\n' : '') + trimmed;
    }
}

if (currentEntry) entries.push(currentEntry);
const markup = entries.map(({ date, title, content }) => `<article class="changelog-entry">
    <time class="changelog-date" datetime="${escapeHtml(date)}">${escapeHtml(date)}</time>
    <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${renderLinkedText(content)}</p>
    </div>
</article>`).join('\n');

writeGeneratedHtml(path.join(process.cwd(), 'changelog.html'), 'changelog', markup);
writeGeneratedJson(outputPath, { entries });
console.log('Generated the changelog page and JSON.');

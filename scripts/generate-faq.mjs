import fs from 'fs';
import path from 'path';
import { escapeHtml, renderLinkedText, writeGeneratedHtml, writeGeneratedJson } from './generated-content.mjs';

const faqPath = path.join(process.cwd(), 'docs', 'FAQ.MD');
const outputPath = path.join(process.cwd(), 'data', 'faq.json');

if (!fs.existsSync(faqPath)) {
    console.error('Error: docs/FAQ.MD not found.');
    process.exit(1);
}

const markdown = fs.readFileSync(faqPath, 'utf-8');
const lines = markdown.split('\n');

const faqData = {
    categories: [],
};

let currentCategory = null;
let currentItem = null;

for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('## ')) {
        if (currentCategory) {
            if (currentItem) {
                currentCategory.items.push(currentItem);
            }
            faqData.categories.push(currentCategory);
        }
        currentCategory = {
            title: trimmedLine.substring(3).trim(),
            items: [],
        };
        currentItem = null;
    } else if (trimmedLine.startsWith('### ')) {
        if (currentItem) {
            currentCategory.items.push(currentItem);
        }
        currentItem = {
            question: trimmedLine.substring(4).trim(),
            answer: '',
        };
    } else if (currentItem && trimmedLine) {
        currentItem.answer += (currentItem.answer ? '\n' : '') + trimmedLine;
    }
}

if (currentCategory) {
    if (currentItem) {
        currentCategory.items.push(currentItem);
    }
    faqData.categories.push(currentCategory);
}

const markup = faqData.categories.map(({ title, items }) => {
    const questions = items.map(({ question, answer }) => `    <details class="faq-item">
        <summary class="faq-question"><span>${escapeHtml(question)}</span><span aria-hidden="true">+</span></summary>
        <div class="faq-answer"><p>${renderLinkedText(answer)}</p></div>
    </details>`).join('\n');
    return `<section class="faq-category">
    <h2>${escapeHtml(title)}</h2>
${questions}
</section>`;
}).join('\n');

writeGeneratedHtml(path.join(process.cwd(), 'faq.html'), 'faq', markup);
writeGeneratedJson(outputPath, faqData);
console.log('Generated the FAQ page and JSON.');

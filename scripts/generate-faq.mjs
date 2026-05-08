import fs from 'fs';
import path from 'path';

const faqPath = path.join(process.cwd(), 'docs', 'FAQ.MD');
const outputPath = path.join(process.cwd(), 'data', 'faq.json');

if (!fs.existsSync(faqPath)) {
    console.error('Error: docs/FAQ.MD not found.');
    process.exit(1);
}

const markdown = fs.readFileSync(faqPath, 'utf-8');
const lines = markdown.split('\n');

const faqData = {
    generatedAt: new Date().toISOString(),
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

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(faqData, null, 2));

console.log(`Successfully generated ${outputPath}`);

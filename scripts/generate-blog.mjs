import fs from 'fs';
import path from 'path';

const blogPath = path.join(process.cwd(), 'docs', 'BLOG.MD');
const outputPath = path.join(process.cwd(), 'data', 'blog.json');

if (!fs.existsSync(blogPath)) {
    console.error('Error: docs/BLOG.MD not found.');
    process.exit(1);
}

const markdown = fs.readFileSync(blogPath, 'utf-8');
const lines = markdown.split('\n');

const blogData = {
    generatedAt: new Date().toISOString(),
    entries: [],
};

let currentEntry = null;

for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('## ')) {
        if (currentEntry) {
            blogData.entries.push(currentEntry);
        }
        currentEntry = {
            title: trimmedLine.substring(3).trim(),
            content: '',
        };
    } else if (currentEntry && trimmedLine) {
        currentEntry.content += (currentEntry.content ? '\n' : '') + trimmedLine;
    }
}

if (currentEntry) {
    blogData.entries.push(currentEntry);
}

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2));

console.log(`Successfully generated ${outputPath}`);

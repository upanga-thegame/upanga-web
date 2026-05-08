import fs from "node:fs";
import path from "node:path";

const TODO_PATH = path.join(process.cwd(), "docs", "TODO.MD");
const OUTPUT_DIR = path.join(process.cwd(), "data");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "dev-tracker.json");

function normalizeStatus(text) {
    const lower = text.toLowerCase();
    if (lower.includes("blocked")) return "Blocked";
    if (lower.includes("in progress") || lower.includes("wip") || lower.includes("working on")) return "In Progress";
    return null;
}

function determineStatus(marker, text) {
    const backwardStatus = normalizeStatus(text);
    if (backwardStatus) return backwardStatus;

    switch (marker) {
        case 'x':
        case 'X':
            return 'Complete';
        case '~':
            return 'In Progress';
        case '!':
            return 'Blocked';
        case ' ':
        default:
            return 'Planned';
    }
}

function cleanTaskText(text) {
    return text.replace(/\*\*/g, "").replace(/__/g, "").replace(/`/g, "").trim();
}

function ensureGroup(groups, title) {
    let group = groups.find((entry) => entry.title === title);
    if (!group) {
        group = { title, items: [] };
        groups.push(group);
    }
    return group;
}

function parseTodoMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const openGroups = [];
    const completedGroups = [];
    const allItems = [];
    let currentGroupTitle = "General";

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const title = cleanTaskText(headingMatch[2]);
            if (!title.toLowerCase().includes("completed")) {
                currentGroupTitle = title;
            }
            continue;
        }
        if (line.startsWith("## #")) continue; // Skip separator

        const itemMatch = line.match(/^[-*]\s+(.+)$/);
        if (itemMatch) {
            let title = itemMatch[1].trim();
            let status = "Planned";
            
            const checkboxMatch = title.match(/^\s*\[([ |x|X|~|!])\]\s+(.+)/);
            if (checkboxMatch) {
                const marker = checkboxMatch[1].trim();
                title = cleanTaskText(checkboxMatch[2]);
                status = determineStatus(marker, title);
            } else {
                title = cleanTaskText(title);
                status = normalizeStatus(title, false);
            }
            
            if (!title) continue;

            allItems.push({ title, status, group: currentGroupTitle });
        }
    }

    // Segregate items into open and completed groups
    for (const item of allItems) {
        if (item.status === 'Complete') {
            const group = ensureGroup(completedGroups, item.group);
            group.items.push(item);
        } else {
            const group = ensureGroup(openGroups, item.group);
            group.items.push(item);
        }
    }

    return { openGroups, completedGroups, allItems };
}

function buildSummary(allItems) {
    const summary = { total: 0, complete: 0, inProgress: 0, planned: 0, blocked: 0, open: 0 };
    for (const item of allItems) {
        summary.total++;
        if (item.status === "Complete") summary.complete++;
        else if (item.status === "In Progress") summary.inProgress++;
        else if (item.status === "Blocked") summary.blocked++;
        else summary.planned++;
    }
    summary.open = summary.inProgress + summary.planned + summary.blocked;
    return summary;
}

function main() {
    if (!fs.existsSync(TODO_PATH)) {
        console.error(`Missing TODO file: ${TODO_PATH}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(TODO_PATH, "utf8");
    const { openGroups, completedGroups, allItems } = parseTodoMarkdown(markdown);
    const summary = buildSummary(allItems);

    const output = { 
        generatedAt: new Date().toISOString(), 
        summary, 
        groups: openGroups.filter(g => g.items.length > 0),
        completedGroups: completedGroups.filter(g => g.items.length > 0),
    };

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");

    console.log(`Generated ${OUTPUT_PATH}`);
    console.log(`Tasks: ${summary.total}, Open: ${summary.open}, Complete: ${summary.complete}`);
}

main();

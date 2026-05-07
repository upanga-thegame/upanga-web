import fs from "node:fs";
import path from "node:path";

const TODO_PATH = path.join(process.cwd(), "docs", "TODO.MD");
const OUTPUT_DIR = path.join(process.cwd(), "data");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "dev-tracker.json");

function normalizeStatus(text, checked) {
    const lower = text.toLowerCase();

    if (lower.includes("blocked")) {
        return "Blocked";
    }

    if (
        lower.includes("in progress") ||
        lower.includes("wip") ||
        lower.includes("working on")
    ) {
        return "In Progress";
    }

    if (checked) {
        return "Complete";
    }

    return "Planned";
}

function cleanTaskText(text) {
    return text
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")
        .trim();
}

function ensureGroup(groups, currentGroupTitle) {
    let group = groups.find((entry) => entry.title === currentGroupTitle);

    if (!group) {
        group = {
            title: currentGroupTitle,
            items: [],
        };
        groups.push(group);
    }

    return group;
}

function parseTodoMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const groups = [];
    let currentGroupTitle = "General";

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!line) {
            continue;
        }

        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            currentGroupTitle = cleanTaskText(headingMatch[2]);
            ensureGroup(groups, currentGroupTitle);
            continue;
        }

        const checkboxMatch = line.match(/^[-*]\s+\[( |x|X)\]\s+(.+)$/);
        if (checkboxMatch) {
            const checked = checkboxMatch[1].toLowerCase() === "x";
            const title = cleanTaskText(checkboxMatch[2]);
            const status = normalizeStatus(title, checked);
            const group = ensureGroup(groups, currentGroupTitle);

            group.items.push({
                title,
                status,
                notes: "",
            });

            continue;
        }

        const bulletMatch = line.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
            const title = cleanTaskText(bulletMatch[1]);
            const status = normalizeStatus(title, false);
            const group = ensureGroup(groups, currentGroupTitle);

            group.items.push({
                title,
                status,
                notes: "",
            });
        }

    }

    return groups.filter((group) => group.items.length > 0);
}

function buildSummary(groups) {
    const summary = {
        total: 0,
        complete: 0,
        inProgress: 0,
        planned: 0,
        blocked: 0,
    };

    for (const group of groups) {
        for (const item of group.items) {
            summary.total += 1;

            if (item.status === "Complete") {
                summary.complete += 1;
            } else if (item.status === "In Progress") {
                summary.inProgress += 1;
            } else if (item.status === "Blocked") {
                summary.blocked += 1;
            } else {
                summary.planned += 1;
            }
        }

    }

    return summary;
}

function main() {
    if (!fs.existsSync(TODO_PATH)) {
        console.error(`Missing TODO file: ${TODO_PATH}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(TODO_PATH, "utf8");
    const groups = parseTodoMarkdown(markdown);
    const summary = buildSummary(groups);

    const output = {
        generatedAt: new Date().toISOString(),
        summary,
        groups,
    };

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");

    console.log(`Generated ${OUTPUT_PATH}`);
    console.log(
        `Tasks: ${summary.total}, Complete: ${summary.complete}, In Progress: ${summary.inProgress}, Planned: ${summary.planned}, Blocked: ${summary.blocked}`
    );
}

main();
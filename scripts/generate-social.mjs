import { readFile, writeFile } from 'node:fs/promises';

// Generate real, script-independent links from one shared configuration.
const root = new URL('../', import.meta.url);
const accounts = JSON.parse(await readFile(new URL('data/social-links.json', root), 'utf8'));
const escape = (value) => value.replace(/[&"<>]/g, (char) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[char]));
const links = [];
for (const { id, name, url } of accounts) {
    if (!/^[a-z]+$/.test(id) || new URL(url).protocol !== 'https:') throw new Error(`Invalid social account: ${id}`);
    const source = await readFile(new URL(`images/social-icons/${id}.svg`, root), 'utf8');
    const path = source.match(/<path d="([^"]+)"\s*\/?>(?:<\/path>)?/);
    if (!path) throw new Error(`Missing SVG path: ${id}`);
    const icon = `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="${path[1]}"/></svg>`;
    const label = `Follow Upanga on ${name}${id === 'facebook' ? ' (game Page)' : ''} (opens in a new tab)`;
    links.push({ url, name, id, icon, label });
}

const renderLinks = (compact) => links.map(({ url, name, id, icon, label }) =>
    `<a class="social-link" data-social="${id}" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(label)}"${compact ? ` title="${escape(name)}"` : ''}>${icon}${compact ? '' : `<span>${escape(name)}</span>`}</a>`
).join('\n');

const blocks = {
    banner: `<section class="follow-section" id="follow" aria-labelledby="follow-heading">
    <div class="section-frame">
        <div class="follow-banner">
            <div class="follow-copy">
                <p class="eyebrow">The journey continues</p>
                <h2 id="follow-heading">Follow <em>Upanga</em></h2>
                <p>Discover battles, new artwork and development updates.</p>
                <span class="follow-note">From the kingdoms of Bomende to your feed <span aria-hidden="true">↗</span></span>
            </div>
            <nav class="follow-links" aria-label="Follow Upanga on social media">
${renderLinks(false)}
            </nav>
        </div>
    </div>
</section>`,
    footer: `<nav class="footer-social-links" aria-label="Upanga social media">
    <span class="footer-social-label">Follow Upanga</span>
    <div class="footer-social-icons">
${renderLinks(true)}
    </div>
</nav>`
};

for (const page of ['index.html', 'changelog.html', 'faq.html', 'privacy.html', 'terms.html', 'data-deletion.html']) {
    const file = new URL(page, root);
    let html = await readFile(file, 'utf8');
    for (const kind of page === 'index.html' ? ['banner', 'footer'] : ['footer']) {
        const start = `<!-- social:${kind}:start -->`;
        const end = `<!-- social:${kind}:end -->`;
        const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
        if (!pattern.test(html)) throw new Error(`Missing ${kind} markers in ${page}`);
        const newline = html.includes('\r\n') ? '\r\n' : '\n';
        const block = `${start}\n${blocks[kind]}\n${end}`.replaceAll('\n', newline);
        html = html.replace(pattern, () => block);
    }
    await writeFile(file, html);
}
console.log('Generated the Follow Upanga banner and six page footers.');

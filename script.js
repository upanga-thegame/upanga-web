document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu (hamburger)
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

    // Dev Tracker
    loadDevTracker();

    // Hero Modal
    initializeHeroModal();

    // Screenshot Modal
    initializeScreenshotModal();

    // FAQ
    loadFaq();

    // DevBlog
    loadDevBlog();
});

async function loadDevTracker() {
    const summaryContainer = document.getElementById('dev-tracker-summary');
    const listContainer = document.getElementById('dev-tracker-list');
    const lastUpdatedContainer = document.getElementById('dev-tracker-last-updated');

    if (!summaryContainer || !listContainer || !lastUpdatedContainer) return;

    try {
        const response = await fetch('./data/dev-tracker.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        renderLastUpdated(data.generatedAt, lastUpdatedContainer);
        renderDevTrackerSummary(data.summary, summaryContainer);
        renderDevTracker(data, listContainer);
        addCollapsibleListeners();

    } catch (error) {
        console.error("Failed to load Dev Tracker data:", error);
        listContainer.innerHTML = `<p class="tracker-error">Failed to load Dev Tracker. The data file might be missing or corrupted.</p>`;
    }
}

function renderLastUpdated(generatedAt, container) {
    const date = new Date(generatedAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    container.textContent = `Last Updated: ${date.toLocaleDateString(undefined, options)}`;
}

function renderDevTrackerSummary(summary, container) {
    container.innerHTML = `
        <div class="tracker-summary">
            <div class="tracker-summary-card">Total Tasks <span>${escapeHtml(summary.total)}</span></div>
            <div class="tracker-summary-card">Open <span>${escapeHtml(summary.open)}</span></div>
            <div class="tracker-summary-card">Completed <span>${escapeHtml(summary.complete)}</span></div>
        </div>
    `;
}

function renderDevTracker(data, container) {
    const { groups, completedGroups } = data;
    let html = '';

    // Render Open Tasks
    if (groups && groups.length > 0) {
        html += '<div class="open-tracker-section">';
        html += '<h3 class="tracker-section-heading">Open Tasks</h3>';
        html += renderGroups(groups, true);
        html += '</div>';
    }

    // Render Completed Tasks
    if (completedGroups && completedGroups.length > 0) {
        html += '<div class="completed-tracker-section">';
        html += '<h3 class="tracker-section-heading">Completed</h3>';
        html += renderGroups(completedGroups, true);
        html += '</div>';
    } else {
        html += '<div class="completed-tracker-section"><p>No completed tasks yet.</p></div>';
    }

    container.innerHTML = html;
}

function renderGroups(groups, isCollapsible) {
    return `
        <div class="tracker-groups">
            ${groups.map(group => `
                <div class="tracker-group ${isCollapsible ? 'collapsible' : ''}">
                    <h4 class="tracker-group-title ${isCollapsible ? 'collapsible-header' : ''}">${escapeHtml(group.title)}</h4>
                    <div class="dev-grid ${isCollapsible ? 'collapsible-content' : ''}">
                        ${group.items.map(item => `
                            <div class="tracker-card">
                                <span class="status-badge ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>
                                <span class="tracker-card-title">${escapeHtml(item.title)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addCollapsibleListeners() {
    const collapsibles = document.querySelectorAll('.collapsible-header');
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

async function loadDevBlog() {
    const devBlogContainer = document.getElementById('devblog-list');
    if (!devBlogContainer) return;

    try {
        const response = await fetch('./data/blog.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        renderDevBlog(data.entries, devBlogContainer);
        addDevBlogListeners();

    } catch (error) {
        console.error("Failed to load DevBlog data:", error);
        devBlogContainer.innerHTML = `<p class="devblog-error">DevBlog data could not be loaded. Please check back later.</p>`;
    }
}

function renderDevBlog(entries, container) {
    let html = '';
    entries.forEach((entry, index) => {
        html += `
            <div class="devblog-entry">
                <button class="devblog-title" aria-expanded="false" aria-controls="devblog-content-${index}">
                    ${escapeHtml(entry.title)}
                </button>
                <div id="devblog-content-${index}" class="devblog-content">
                    <div class="devblog-content-wrapper">
                        <p>${escapeHtml(entry.content).replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function addDevBlogListeners() {
    const titles = document.querySelectorAll('.devblog-title');
    titles.forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            const isExpanded = title.getAttribute('aria-expanded') === 'true';

            title.setAttribute('aria-expanded', !isExpanded);

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

async function loadFaq() {
    const faqContainer = document.getElementById('faq-list');
    if (!faqContainer) return;

    try {
        const response = await fetch('./data/faq.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        renderFaq(data.categories, faqContainer);
        addFaqListeners();

    } catch (error) {
        console.error("Failed to load FAQ data:", error);
        faqContainer.innerHTML = `<p class="faq-error">FAQ data could not be loaded. Please check back later.</p>`;
    }
}

function renderFaq(categories, container) {
    let html = '';
    categories.forEach(category => {
        html += `
            <div class="faq-category">
                <h3 class="faq-category-title">${escapeHtml(category.title)}</h3>
                ${category.items.map((item, index) => `
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${category.title.replace(/\s+/g, '-')}-${index}">
                            ${escapeHtml(item.question)}
                        </button>
                        <div id="faq-answer-${category.title.replace(/\s+/g, '-')}-${index}" class="faq-answer">
                            <div class="faq-answer-wrapper">
                                <p>${escapeHtml(item.answer).replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    container.innerHTML = html;
}

function addFaqListeners() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('open');

            if (answer.classList.contains('open')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

function getStatusClass(status) {
    const lowerStatus = (status || '').toLowerCase();
    if (lowerStatus === 'complete') return 'status-complete';
    if (lowerStatus === 'in progress') return 'status-in-progress';
    if (lowerStatus === 'blocked') return 'status-blocked';
    return 'status-planned';
}

function escapeHtml(value) {
    const str = String(value);
    return str.replace(/[&<>"'\`]/g, (match) => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '\`': '&#x60;'
        };
        return escape[match];
    });
}

function initializeHeroModal() {
    const modal = document.getElementById('hero-modal');
    const modalName = document.getElementById('modal-hero-name');
    const modalBio = document.getElementById('modal-hero-bio');
    const closeModal = document.querySelector('.modal-close');
    const heroCards = document.querySelectorAll('.hero-card');

    if (!modal || !closeModal || heroCards.length === 0) return;

    heroCards.forEach(card => {
        const imagePlaceholder = card.querySelector('.hero-placeholder');
        imagePlaceholder.addEventListener('click', () => {
            const heroName = card.querySelector('h3').textContent;
            let heroBio = card.dataset.bio;
            const abilitiesIndex = heroBio.indexOf('Abilities:');

            modalName.textContent = heroName;

            if (abilitiesIndex !== -1) {
                const mainBio = heroBio.substring(0, abilitiesIndex);
                const abilities = heroBio.substring(abilitiesIndex);
                modalBio.innerHTML = `${mainBio}<br><br><span class="modal-hero-abilities">${abilities}</span>`;
            } else {
                modalBio.textContent = heroBio;
            }

            modal.classList.add('active');
        });
    });

    const close = () => modal.classList.remove('active');

    closeModal.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            close();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.classList.contains('active')) {
            close();
        }
    });
}

function initializeScreenshotModal() {
    const modal = document.getElementById('screenshot-modal');
    const modalImg = document.getElementById('screenshot-modal-img');
    const screenshotCards = document.querySelectorAll('.screenshot-card img');
    const closeModal = document.querySelector('#screenshot-modal .screenshot-close');

    if (!modal || !modalImg || !closeModal || screenshotCards.length === 0) return;

    screenshotCards.forEach(card => {
        card.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = card.src;
        });
    });

    const close = () => modal.style.display = "none";

    closeModal.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            close();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
            close();
        }
    });
}

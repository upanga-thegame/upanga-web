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

    // Contact Form Placeholder
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formMessage.style.display = 'block';
            formMessage.style.opacity = '1';
            setTimeout(() => {
                formMessage.style.opacity = '0';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 500);
            }, 4000);
        });
    }

    // Dev Tracker
    loadDevTracker();
});

/**
 * Fetches and renders the Dev Tracker data.
 */
async function loadDevTracker() {
    const summaryContainer = document.getElementById('dev-tracker-summary');
    const listContainer = document.getElementById('dev-tracker-list');

    if (!summaryContainer || !listContainer) return;

    try {
        const response = await fetch('./data/dev-tracker.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        renderDevTrackerSummary(data.summary, summaryContainer);
        renderDevTrackerGroups(data.groups, listContainer);

    } catch (error) {
        console.error("Failed to load Dev Tracker data:", error);
        listContainer.innerHTML = `<p class="tracker-error">Failed to load Dev Tracker. The data file might be missing or corrupted.</p>`;
    }
}

/**
 * Renders the summary section of the Dev Tracker.
 * @param {object} summary - The summary object from the JSON data.
 * @param {HTMLElement} container - The container element to render into.
 */
function renderDevTrackerSummary(summary, container) {
    container.innerHTML = `
        <div class="tracker-summary">
            <div class="tracker-summary-card">Total Tasks <span>${escapeHtml(summary.total)}</span></div>
            <div class="tracker-summary-card">Complete <span>${escapeHtml(summary.complete)}</span></div>
            <div class="tracker-summary-card">In Progress <span>${escapeHtml(summary.inProgress)}</span></div>
            <div class="tracker-summary-card">Planned <span>${escapeHtml(summary.planned)}</span></div>
        </div>
    `;
}

/**
 * Renders the groups and tasks of the Dev Tracker.
 * @param {Array<object>} groups - The array of groups from the JSON data.
 * @param {HTMLElement} container - The container element to render into.
 */
function renderDevTrackerGroups(groups, container) {
    if (!groups || groups.length === 0) {
        container.innerHTML = '<p>No development tasks found.</p>';
        return;
    }

    const html = `
        <div class="tracker-groups">
            ${groups.map(group => `
                <div class="tracker-group">
                    <h3 class="tracker-group-title">${escapeHtml(group.title)}</h3>
                    <div class="dev-grid">
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

    container.innerHTML = html;
}

/**
 * Maps a status string to a CSS class.
 * @param {string} status - The status of the task.
 * @returns {string} The corresponding CSS class.
 */
function getStatusClass(status) {
    const lowerStatus = (status || '').toLowerCase();
    if (lowerStatus === 'complete') return 'status-complete';
    if (lowerStatus === 'in progress') return 'status-in-progress';
    if (lowerStatus === 'blocked') return 'status-blocked';
    return 'status-planned';
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {any} value - The value to escape.
 * @returns {string} The escaped string.
 */
function escapeHtml(value) {
    const str = String(value);
    return str.replace(/[&<>"'`]/g, (match) => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#x60;'
        };
        return escape[match];
    });
}

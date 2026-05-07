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

async function loadDevTracker() {
    const summaryContainer = document.getElementById('dev-tracker-summary');
    const listContainer = document.getElementById('dev-tracker-list');

    if (!summaryContainer || !listContainer) return;

    try {
        const response = await fetch('./data/dev-tracker.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        renderDevTrackerSummary(data.summary, summaryContainer);
        renderDevTracker(data, listContainer);

    } catch (error) {
        console.error("Failed to load Dev Tracker data:", error);
        listContainer.innerHTML = `<p class="tracker-error">Failed to load Dev Tracker. The data file might be missing or corrupted.</p>`;
    }
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
        html += renderGroups(groups);
        html += '</div>';
    }

    // Render Completed Tasks
    if (completedGroups && completedGroups.length > 0) {
        html += '<div class="completed-tracker-section">';
        html += '<h3 class="tracker-section-heading">Completed</h3>';
        html += renderGroups(completedGroups);
        html += '</div>';
    } else {
        html += '<div class="completed-tracker-section"><p>No completed tasks yet.</p></div>';
    }

    container.innerHTML = html;
}

function renderGroups(groups) {
    return `
        <div class="tracker-groups">
            ${groups.map(group => `
                <div class="tracker-group">
                    <h4 class="tracker-group-title">${escapeHtml(group.title)}</h4>
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

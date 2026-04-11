// app.js - Main Application Logic
// Task 4: JavaScript - Core Features ONLY
// Features: Display today's events, date picker, event filters, card rendering

// State 
const state = {
    date: new Date(),
    type: 'events',
    allItems: [],
    filtered: [],
    page: 1,
    perPage: 9,
};

// DOM refs
const dateInput = document.getElementById('history-date');
const dateBannerText = document.getElementById('date-banner-text');
const filterNav = document.getElementById('filter-nav');
const eventsGrid = document.getElementById('events-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Date helpers
function formatDisplay(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

function toInputValue(date) {
    return date.toISOString().split('T')[0];
}

function getMonthDay(date) {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return { month: m, day: d };
}

// Init date
function initDate() {
    dateInput.value = toInputValue(state.date);
    dateBannerText.textContent = formatDisplay(state.date);
}

// Render cards 
function getWikiLink(pages) {
    if (!pages || !pages.length) return '#';
    const title = pages[0].title;
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
}

function getThumb(pages) {
    if (!pages || !pages.length) return null;
    return pages[0].thumbnail?.source ?? null;
}

function getExtract(pages) {
    if (!pages || !pages.length) return '';
    return pages[0].extract ?? '';
}

function renderCards() {
    const start = (state.page - 1) * state.perPage;
    const slice = state.filtered.slice(start, start + state.perPage);
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));

    pageInfo.textContent = `Page ${state.page} of ${totalPages}`;

    // Prev button
    if (state.page <= 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('disabled');
    }

    // Next button
    if (state.page >= totalPages) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
    }

    if (!slice.length) {
        eventsGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 0;">No results found.</p>`;
        return;
    }

    eventsGrid.innerHTML = slice.map((item, i) => {
        const year = item.year ?? '';
        const text = item.text ?? '';
        const pages = item.pages ?? [];
        const thumb = getThumb(pages);
        const extract = getExtract(pages);
        const link = getWikiLink(pages);

        const imgHTML = thumb
            ? `<img class="card-image" src="${thumb}" alt="${text.slice(0, 60)}" loading="lazy">`
            : '';

        const captionHTML = extract
            ? `<div class="card-caption">${extract.slice(0, 140)}${extract.length > 140 ? '…' : ''}</div>`
            : '';

        return `
            <article class="event-card" style="animation-delay:${i * 60}ms">
                <div class="card-header">
                    <span class="year">${year}</span>
                </div>
                <div class="card-body">${text}</div>
                ${imgHTML}
                ${captionHTML}
                <a href="${link}" target="_blank" rel="noopener" class="read-more-btn">Read More ↗</a>
            </article>
        `;
    }).join('');
}

// Apply filter
function applyFilter() {
    state.filtered = state.allItems[state.type] ?? [];
    state.page = 1;
    renderCards();
}

// Loading skeleton
function showSkeleton() {
    eventsGrid.innerHTML = Array.from({ length: 9 }).map((_, i) => `
        <article class="event-card" style="animation-delay:${i * 60}ms">
            <div class="card-header">
                <span class="skeleton" style="width:48px;height:18px;display:inline-block;border-radius:4px;"></span>
            </div>
            <div class="card-body">
                <div class="skeleton" style="height:13px;margin-bottom:6px;"></div>
                <div class="skeleton" style="height:13px;width:80%;margin-bottom:6px;"></div>
                <div class="skeleton" style="height:13px;width:60%;"></div>
            </div>
            <div class="skeleton" style="width:100%;aspect-ratio:4/3;"></div>
            <div style="margin:8px 14px 14px;">
                <div class="skeleton" style="height:32px;border-radius:6px;"></div>
            </div>
        </article>
    `).join('');
}

// Load data - CALLS getEvents() from api.js
async function loadData(date) {
    showSkeleton();

    try {
        const { month, day } = getMonthDay(date);

        // CALL api.js getEvents() function
        const allData = {
            events: await getEvents('events', month, day),
            births: await getEvents('births', month, day),
            deaths: await getEvents('deaths', month, day),
            holidays: await getEvents('holidays', month, day),
        };

        state.allItems = allData;
        applyFilter();

    } catch (err) {
        eventsGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 0;">Failed to load events.</p>`;
        console.error(err);
    }
}

// Event listeners

// Date picker
dateInput.addEventListener('change', e => {
    const [y, m, d] = e.target.value.split('-').map(Number);
    state.date = new Date(y, m - 1, d);
    dateBannerText.textContent = formatDisplay(state.date);
    loadData(state.date);
});

// Filter tabs
filterNav.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    filterNav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.type = btn.dataset.type;
    applyFilter();
});

// Pagination
prevBtn.addEventListener('click', () => {
    if (state.page > 1) { state.page--; renderCards(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
});

nextBtn.addEventListener('click', () => {
    const total = Math.ceil(state.filtered.length / state.perPage);
    if (state.page < total) { state.page++; renderCards(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
});

// Bootstrap the app
initDate();
loadData(state.date);

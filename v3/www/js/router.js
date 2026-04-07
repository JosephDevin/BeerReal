import {alcodex} from "./stats/alcodex/alcodexHelper";

const routes = {
    map:   () => import('./map/map.js'),
    home:  () => import('./home/home.js'),
    stats: () => import('./stats/stats.js'),
};

const DEFAULT_ROUTE = 'home';

let currentPage = null;

export async function navigate(routeName) {
    if (currentPage === routeName) return;
    currentPage = routeName;

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.route === routeName);
    });

    const contentArea = document.getElementById('nav-host-fragment');
    if (!contentArea) return;
    contentArea.innerHTML = '<div class="page-loading"></div>';

    try {
        const module = await routes[routeName]();
        contentArea.innerHTML = '';
        module.render(contentArea);
    } catch (e) {
        contentArea.innerHTML = `<p class="page-error">Failed to load page: ${e.message}</p>`;
        console.error(e);
    }
}

export function initRouter() {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.route));
    });

    navigate(DEFAULT_ROUTE);
}

// ── App startup ───────────────────────────────────────────────────────────────
async function onAppStart() {
    try {
        // Dynamic import — only runs on device where Capacitor is available
        const { initialiseCSV, createImageDir } = await import('./stats/storage/csvHelper.js');

        await initialiseCSV();
        await alcodex.init();
        await alcodex.syncFromCsv();

        await createImageDir();

    } catch (e) {
        console.error('App startup error (expected in browser):', e);
    }
}

// Boot — router always starts even if startup fails
onAppStart().then(() => initRouter());
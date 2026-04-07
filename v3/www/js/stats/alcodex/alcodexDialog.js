// alcodexDialog.js
// Opens the Alcodex dialog — a scrollable 3-column grid of beer brand photos.

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor }             from '@capacitor/core';
import { alcodex }               from './alcodexHelper.js';

import '../../../css/stats/alcodex/alcodex.css';

// ─────────────────────────────────────────────────────────────────────────────

export async function openAlcodexDialog() {
    await alcodex.init();
    const beers = alcodex.getBeers();
    _buildDialog(beers);
}


// ─────────────────────────────────────────────────────────────────────────────
// BUILD
// ─────────────────────────────────────────────────────────────────────────────

function _buildDialog(beers) {

    const entries = Object.entries(beers).sort(([a], [b]) => a.localeCompare(b));
    const count   = entries.length;

    // ── Backdrop ──────────────────────────────────────────────────────────────
    const backdrop = document.createElement('div');
    backdrop.className = 'bm-backdrop';

    // ── Dialog card ───────────────────────────────────────────────────────────
    const dialog = document.createElement('div');
    dialog.className = 'bm-dialog alcodex-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Alcodex');

    // ── Drag handle ───────────────────────────────────────────────────────────
    const dragHandle = document.createElement('div');
    dragHandle.className = 'alcodex-drag-handle';

    // ── Title ─────────────────────────────────────────────────────────────────
    const titleBar = document.createElement('h2');
    titleBar.className = 'bm-title';
    titleBar.textContent = `Alcodex — ${count}`;

    // ── Scrollable body ───────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'bm-body alcodex-body';

    // ── 3-column grid ─────────────────────────────────────────────────────────
    const grid = document.createElement('div');
    grid.className = 'alcodex-grid';

    if (count === 0) {
        const empty = document.createElement('p');
        empty.className   = 'alcodex-empty';
        empty.textContent = t.alcodex_empty;
        grid.appendChild(empty);
    } else {
        for (const [brand, info] of entries) {
            grid.appendChild(_buildCard(brand, info));
        }
    }

    body.appendChild(grid);

    // ── Assemble — no button row ───────────────────────────────────────────────
    dialog.appendChild(dragHandle);
    dialog.appendChild(titleBar);
    dialog.appendChild(body);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    requestAnimationFrame(() =>
        requestAnimationFrame(() => backdrop.classList.add('bm-backdrop--visible'))
    );

    // ── Load images async (after dialog is visible) ───────────────────────────
    _hydrateImages(grid, Object.fromEntries(entries));

    // ── Close on backdrop tap ─────────────────────────────────────────────────
    function close() {
        backdrop.classList.remove('bm-backdrop--visible');
        backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
    }

    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    _addSwipeToClose(dialog, body, close);
}


// ─────────────────────────────────────────────────────────────────────────────
// SWIPE TO CLOSE
// ─────────────────────────────────────────────────────────────────────────────

function _addSwipeToClose(dialog, scrollEl, closeFn) {
    let startY = 0;
    let dragging = false;

    dialog.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
        dragging = false;
    }, { passive: true });

    dialog.addEventListener('touchmove', e => {
        const dy = e.touches[0].clientY - startY;
        if (dy > 0 && scrollEl.scrollTop === 0) {
            dragging = true;
            dialog.style.transform = `translateY(${dy}px)`;
            dialog.style.transition = 'none';
        }
    }, { passive: true });

    dialog.addEventListener('touchend', e => {
        const dy = e.changedTouches[0].clientY - startY;
        if (dragging && dy > 80) {
            dialog.style.transition = 'transform 0.2s ease';
            dialog.style.transform = `translateY(${window.innerHeight}px)`;
            setTimeout(closeFn, 200);
        } else {
            dialog.style.transition = '';
            dialog.style.transform = '';
        }
        dragging = false;
    }, { passive: true });
}


// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────

function _buildCard(brand, info) {
    const card = document.createElement('div');
    card.className     = 'alcodex-card';
    card.dataset.brand = brand;

    const img = document.createElement('img');
    img.className         = 'alcodex-img';
    img.alt               = brand;
    img.src               = '';
    img.dataset.photoPath = info.photoPath ?? '';

    _setPlaceholder(img);

    const label = document.createElement('span');
    label.className   = 'alcodex-label';
    label.textContent = brand;

    card.appendChild(img);
    card.appendChild(label);
    return card;
}


// ─────────────────────────────────────────────────────────────────────────────
// IMAGE LOADING
// ─────────────────────────────────────────────────────────────────────────────

async function _hydrateImages(grid, beers) {
    const cards = grid.querySelectorAll('.alcodex-card');

    for (const card of cards) {
        const brand = card.dataset.brand;
        const info  = beers[brand];
        const img   = card.querySelector('.alcodex-img');

        if (!info?.hasImage || !info.photoPath) continue;

        try {
            const uri    = await Filesystem.getUri({ path: `pics/${info.photoPath}`, directory: Directory.External });
            const webSrc = Capacitor.convertFileSrc(uri.uri);

            img.onload  = () => img.classList.add('alcodex-img--loaded');
            img.onerror = () => _setPlaceholder(img);
            img.src     = webSrc;
        } catch (e) {
            console.warn(`Alcodex: could not load image for "${brand}"`, e);
        }
    }
}

function _setPlaceholder(img) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="80" height="100">
        <rect width="80" height="100" rx="10" fill="#3a3a3a"/>
        <text x="40" y="58" font-size="36" text-anchor="middle" dominant-baseline="middle">🍺</text>
    </svg>`;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
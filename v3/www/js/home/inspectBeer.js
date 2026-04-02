import '../../css/home/inspectBeer.css';
import { removeLine } from '../stats/storage/csvHelper.js';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { t } from '../../assets/strings/strings.js';


export function showFeedCard(feedItem) {
    const line = feedItem.getLine();

    // Parse hour from date string (format: YYYY-MM-DD-HH:MM)
    const hour = line.date ? line.date.slice(-5) : '';

    removeFeedCard();

    const overlay = document.createElement('div');
    overlay.id = 'feed-card-overlay';
    overlay.innerHTML = `
        <div class="fc-backdrop"></div>
        <div class="fc-card" role="dialog" aria-modal="true">

            <div class="fc-photo-wrapper">
                <img
                    class="fc-photo"
                    src="${escHtml(feedItem.getImageUrl())}"
                    alt="${escHtml(line.Title)} photo"
                />
                <div class="fc-photo-scrim"></div>
                <span class="fc-pill">${escHtml(line.Volume)}L</span>
                <span class="fc-hour">${escHtml(hour)}</span>
                <button class="fc-close" aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="fc-body">
                <div class="fc-row-top">
                    <div class="fc-name-group">
                        <p class="fc-brand">${escHtml(line.Brand)}</p>
                        <p class="fc-bar">${escHtml(line.Bar)}</p>
                    </div>
                    <p class="fc-price">${escHtml(line.Price.toFixed(2))}€</p>
                </div>

                <div class="fc-divider"></div>

                <div class="fc-row-bottom">
                    <div class="fc-stars" data-rating="${escHtml(line.Rating)}"></div>
                    <div class="fc-actions">
                        <button class="fc-btn-edit" data-path="${escHtml(line.Picture)}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2.2"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="fc-btn-delete" data-path="${escHtml(line.Picture)}">Delete</button>
                    </div>
                </div>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    renderStars(overlay.querySelector('.fc-stars'), parseFloat(line.Rating));

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('fc-visible'));

    // Close handlers
    overlay.querySelector('.fc-backdrop').addEventListener('click', removeFeedCard);
    overlay.querySelector('.fc-close').addEventListener('click', removeFeedCard);
    document.addEventListener('keydown', onEscKey);

    // Edit button
    overlay.querySelector('.fc-btn-edit').addEventListener('click', () => {
        removeFeedCard();
        document.dispatchEvent(new CustomEvent('feedcard:edit', { detail: { line } }));
    });

    // Delete button — show confirmation first
    overlay.querySelector('.fc-btn-delete').addEventListener('click', () => {
        showDeleteConfirm(line.Picture, () => {
            removeFeedCard();
        });
    });
}

export function removeFeedCard() {
    const overlay = document.getElementById('feed-card-overlay');
    if (!overlay) return;
    overlay.classList.remove('fc-visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    document.removeEventListener('keydown', onEscKey);
}


// ── DELETE CONFIRMATION ───────────────────────────────────────────────────────

function showDeleteConfirm(picturePath, onDeleted) {
    const existing = document.getElementById('fc-delete-confirm');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'fc-delete-confirm';
    dialog.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
    `;

    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        position: relative; background: #1e1e1e; border-radius: 16px;
        padding: 24px; width: min(320px, 85vw); text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;
    box.innerHTML = `
        <p style="margin:0 0 6px; font-size:17px; font-weight:600; color:#fff;">
            ${t.confirm_title ?? 'Delete beer?'}
        </p>
        <p style="margin:0 0 20px; font-size:14px; color:rgba(255,255,255,0.55);">
            ${t.confirm_subtitle ?? 'This cannot be undone.'}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="fc-cancel-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.1); color:#fff; font-size:15px; cursor:pointer;">
                ${t.confirm_cancel}
            </button>
            <button id="fc-delete-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:600; cursor:pointer;">${t.confirm_delete}</button>
        </div>
    `;

    dialog.appendChild(backdrop);
    dialog.appendChild(box);
    document.body.appendChild(dialog);

    const dismiss = () => dialog.remove();

    backdrop.addEventListener('click', dismiss);
    box.querySelector('#fc-cancel-btn').addEventListener('click', dismiss);
    box.querySelector('#fc-delete-btn').addEventListener('click', async () => {
        await deleteBeer(picturePath);
        dismiss();
        onDeleted();
        document.dispatchEvent(new CustomEvent('feedcard:deleted'));
    });
}
function dismissDeleteConfirm(dialog) {
    dialog.classList.remove('fc-confirm-visible');
    dialog.addEventListener('transitionend', () => dialog.remove(), { once: true });
}

async function deleteBeer(picturePath) {
    await removeLine(picturePath);

    // Delete the image file if one exists
    if (picturePath) {
        try {
            await Filesystem.deleteFile({
                path: `pics/${picturePath}`,
                directory: Directory.External,
            });
        } catch (e) {
            console.error('Failed to delete image file:', e);
        }
    }
}


// ── HELPERS ───────────────────────────────────────────────────────────────────

function onEscKey(e) {
    if (e.key === 'Escape') removeFeedCard();
}

function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderStars(container, rating) {
    for (let i = 1; i <= 5; i++) {
        const fill =
            i <= Math.floor(rating)              ? '#EFAB27' :
                i === Math.ceil(rating) && rating % 1 >= 0.5 ? 'url(#fc-half)' :
                    'rgba(255,255,255,0.15)';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = `
            <defs>
                <linearGradient id="fc-half">
                    <stop offset="50%" stop-color="#EFAB27"/>
                    <stop offset="50%" stop-color="rgba(255,255,255,0.15)"/>
                </linearGradient>
            </defs>
            <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill="${fill}"
                stroke="#EFAB27"
                stroke-width="1.5"
                stroke-linejoin="round"
            />`;
        container.appendChild(svg);
    }
}

export function isFeedCardOpen() {
    return !!document.getElementById('feed-card-overlay');
}
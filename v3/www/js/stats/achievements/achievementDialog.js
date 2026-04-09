// achievementDialog.js
// Mirrors Java's AchievementFragment — opens a modal listing unlocked/locked
// json. Instantly renders cached state, then re-checks in the background.

import { achievements }            from './jsonHelper.js';
import { checkForNewAchievements } from './achievementHandler.js';
import { t }                        from '../../../assets/strings/strings.js';


// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

export async function openAchievementsDialog() {
    await achievements.init();

    // ── Backdrop ──────────────────────────────────────────────────────────────
    const backdrop = document.createElement('div');
    backdrop.className = 'ach-backdrop';

    // ── Dialog ────────────────────────────────────────────────────────────────
    const dialog = document.createElement('div');
    dialog.className = 'ach-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Achievements');

    // ── Drag handle ───────────────────────────────────────────────────────────
    const dragHandle = document.createElement('div');
    dragHandle.className = 'ach-drag-handle';

    // ── Header ────────────────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'ach-header';

    const title = document.createElement('h2');
    title.className = 'ach-title';
    title.textContent = t.achievement_title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'ach-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`;

    header.appendChild(title);
    header.appendChild(closeBtn);

    // ── Scrollable body ───────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'ach-body';

    // Sections — populated immediately from cache, then refreshed after BG check
    const unlockedSection = _buildSection(body, 'unlocked');
    const lockedSection   = _buildSection(body, 'locked');

    _populateLists(unlockedSection, lockedSection);

    // ── Footer disclaimer (mirrors @string/abuse) ─────────────────────────────
    const footer = document.createElement('p');
    footer.className = 'ach-footer';
    footer.textContent = t.warning;

    body.appendChild(footer);

    // ── Assemble ──────────────────────────────────────────────────────────────
    dialog.appendChild(dragHandle);
    dialog.appendChild(header);
    dialog.appendChild(body);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(() =>
        requestAnimationFrame(() => backdrop.classList.add('ach-backdrop--visible'))
    );

    // ── Close logic ───────────────────────────────────────────────────────────
    function close() {
        backdrop.classList.remove('ach-backdrop--visible');
        backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
    }

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    _addSwipeToClose(dialog, body, close);

    // ── Background achievement check (mirrors the Thread() in Java) ───────────
    // Runs silently — refreshes the lists if anything changed.
    checkForNewAchievements(false)
        .then(changed => {
            if (changed.length === 0) return;
            // Re-render both sections with the updated state
            unlockedSection.list.innerHTML = '';
            lockedSection.list.innerHTML   = '';
            _populateLists(unlockedSection, lockedSection);
            _updateSectionHeader(unlockedSection);
            _updateSectionHeader(lockedSection);
        })
        .catch(console.error);
}


// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE — SECTION BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a labelled section (Unlocked / Locked) inside `parent` and returns
 * refs so the caller can update count and list content independently.
 * @param {HTMLElement} parent
 * @param {'unlocked'|'locked'} type
 */
function _buildSection(parent, type) {
    const wrap = document.createElement('div');
    wrap.className = 'ach-section';

    const heading = document.createElement('p');
    heading.className = 'ach-section-heading';

    const list = document.createElement('div');
    list.className = 'ach-list';

    wrap.appendChild(heading);
    wrap.appendChild(list);
    parent.appendChild(wrap);

    return { heading, list, type };
}

function _updateSectionHeader({ heading, list, type }) {
    const count = list.querySelectorAll('.ach-row').length;
    heading.textContent = type === 'unlocked'
        ? t.unlocked + count
        : t.locked +count;
}


// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE — LIST POPULATION
// ─────────────────────────────────────────────────────────────────────────────

function _populateLists(unlockedSection, lockedSection) {
    const unlockedList = achievements.getAllUnlocked();
    const lockedList   = achievements.getAllLocked();

    unlockedList.forEach((a, i) =>
        _addRow(unlockedSection.list, a, 'unlocked', i < unlockedList.length - 1)
    );
    lockedList.forEach((a, i) =>
        _addRow(lockedSection.list, a, 'locked', i < lockedList.length - 1)
    );

    _updateSectionHeader(unlockedSection);
    _updateSectionHeader(lockedSection);
}

/**
 * @param {HTMLElement}         list
 * @param {import('./achievement.js').Achievement} a
 * @param {'unlocked'|'locked'} state
 * @param {boolean}             addDivider
 */
function _addRow(list, a, state, addDivider) {
    const row = document.createElement('div');
    row.className = `ach-row ach-row--${state}`;

    const label = document.createElement('span');
    label.className = 'ach-row-label';
    label.textContent = a.name;

    row.appendChild(label);
    list.appendChild(row);

    // Tap → tooltip with description (mirrors showTooltip in Java)
    row.addEventListener('click', () => _showTooltip(row, a.description));

    if (addDivider) {
        const divider = document.createElement('div');
        divider.className = 'ach-divider';
        list.appendChild(divider);
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE — SWIPE TO CLOSE
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
// PRIVATE — TOOLTIP  (mirrors PopupWindow + Handler.postDelayed)
// ─────────────────────────────────────────────────────────────────────────────

let _activeTooltip = null;

function _showTooltip(anchor, text) {
    // Dismiss any existing tooltip immediately
    if (_activeTooltip) {
        _activeTooltip.remove();
        _activeTooltip = null;
    }

    const tip = document.createElement('div');
    tip.className = 'ach-tooltip';
    tip.textContent = text;

    // Insert after anchor so it flows naturally in the scroll container
    anchor.parentNode.insertBefore(tip, anchor.nextSibling);
    _activeTooltip = tip;

    // Fade in
    requestAnimationFrame(() =>
        requestAnimationFrame(() => tip.classList.add('ach-tooltip--visible'))
    );

    // Auto-dismiss after 2 s (mirrors Handler.postDelayed 2000)
    const dismiss = () => {
        tip.classList.remove('ach-tooltip--visible');
        tip.addEventListener('transitionend', () => {
            tip.remove();
            if (_activeTooltip === tip) _activeTooltip = null;
        }, { once: true });
    };

    const timer = setTimeout(dismiss, 2000);

    // Also dismiss on next tap anywhere
    const onOutside = (e) => {
        if (!tip.contains(e.target)) {
            clearTimeout(timer);
            dismiss();
            document.removeEventListener('click', onOutside, true);
        }
    };
    // Defer so the current click doesn't immediately trigger it
    setTimeout(() => document.addEventListener('click', onOutside, true), 0);
}
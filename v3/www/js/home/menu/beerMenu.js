import { addLineCsv, updateLine }            from '../../stats/storage/csvHelper.js';
import { t }                                  from '../../../assets/strings/strings.js';
import { checkForNewAchievements }            from '../../stats/achievements/achievementHandler.js';
import {alcodex} from "../../stats/alcodex/alcodexHelper";


export function openBeerMenu(filename, coordsPromise, onSubmit, onCancel) {
    _buildDialog({ filename, coordsPromise, existingLine: null, onSubmit, onCancel });
}

export function openEditBeerMenu(existingLine, onSubmit, onCancel) {
    _buildDialog({ filename: existingLine.Picture, coordsPromise: null, existingLine, onSubmit, onCancel });
}


// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL
// ─────────────────────────────────────────────────────────────────────────────

function _buildDialog({ filename, coordsPromise, existingLine, onSubmit, onCancel }) {
    const isEditing = existingLine !== null;

    // ── Backdrop ──────────────────────────────────────────────────────────────
    const backdrop = document.createElement('div');
    backdrop.className = 'bm-backdrop';

    // ── Dialog card ───────────────────────────────────────────────────────────
    const dialog = document.createElement('div');
    dialog.className = 'bm-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', isEditing ? t.edit_title : t.beer_information);

    // ── Title ─────────────────────────────────────────────────────────────────
    const titleBar = document.createElement('h2');
    titleBar.className = 'bm-title';
    titleBar.textContent = isEditing ? t.edit_title : t.beer_information;

    // ── Form body ─────────────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'bm-body';

    const fields = _buildFields(isEditing ? existingLine : null);
    body.appendChild(fields.form);

    // ── Buttons ───────────────────────────────────────────────────────────────
    const btnRow = document.createElement('div');
    btnRow.className = 'bm-btn-row';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'bm-btn bm-btn--cancel';
    cancelBtn.textContent = t.cancel;

    const submitBtn = document.createElement('button');
    submitBtn.className = 'bm-btn bm-btn--submit';
    submitBtn.textContent = isEditing ? t.update : t.submit;

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);

    // ── Assemble ──────────────────────────────────────────────────────────────
    dialog.appendChild(titleBar);
    dialog.appendChild(body);
    dialog.appendChild(btnRow);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    requestAnimationFrame(() => requestAnimationFrame(() => backdrop.classList.add('bm-backdrop--visible')));

    // ── Helpers ───────────────────────────────────────────────────────────────
    function close() {
        backdrop.classList.remove('bm-backdrop--visible');
        backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
    }

    // ── Cancel ────────────────────────────────────────────────────────────────
    cancelBtn.addEventListener('click', () => {
        close();
        onCancel?.();
    });

    // ── Submit ────────────────────────────────────────────────────────────────
    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;

        const { title, brand, bar, volume, price, rating, error } = _readFields(fields);
        if (error) {
            _showToast(error);
            submitBtn.disabled = false;
            return;
        }

        if (isEditing) {
            const oldBrand = existingLine.Brand;
            const brandChanged = _normalize(brand) !== _normalize(oldBrand);

            await updateLine(existingLine.Picture, title, brand, volume, price, rating, bar);

            await alcodex.init();
            if (brandChanged) {
                await alcodex.handleBrandRename(oldBrand, brand, existingLine.Picture);
            }
            // (If brand didn't change the photo path is the same — nothing to update)
            // ─────────────────────────────────────────────────────────────────────────

            close();
            onSubmit?.({ ...existingLine, Title: title, Brand: brand,
                Volume: volume, Price: price, Rating: rating, Bar: bar });

            _runAchievementCheck();
        } else {
            // ── New beer path ─────────────────────────────────────────────────
            submitBtn.textContent = t.locating;

            // Await here — resolves instantly if GPS already came back during form fill
            const [latitude, longitude] = await coordsPromise;

            if (latitude === 0 && longitude === 0) {
                _showToast(t.error_location);
                try {
                    const { Filesystem, Directory } = await import('@capacitor/filesystem');
                    await Filesystem.deleteFile({ path: `pics/${filename}`, directory: Directory.External });
                } catch (_) { /* best-effort */ }
                close();
                onCancel?.();
                return;
            }


            const newLine = await addLineCsv(
                filename, title, brand, volume, price,
                [latitude, longitude],
                new Date(), rating, bar
            );

            await alcodex.init();
            const isNewBrand = !alcodex.hasBrand(brand);

            if (isNewBrand) {
                close();
                onSubmit?.(newLine);
                _runAchievementCheck();
                _showAlcodexConfirm(brand, async () => {
                    await alcodex.addOrUpdateBrand(brand, filename);
                });
            } else {
                await alcodex.addOrUpdateBrand(brand, filename);
                close();
                onSubmit?.(newLine);
                _runAchievementCheck();
            }
        }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENT CHECK
// ─────────────────────────────────────────────────────────────────────────────

async function _runAchievementCheck() {
    try {
        const newlyUnlocked = await checkForNewAchievements(false);

        if (newlyUnlocked.length === 0) return;

        // Show one toast per unlocked achievement, staggered by 600 ms
        for (let i = 0; i < newlyUnlocked.length; i++) {
            setTimeout(() => {
                _showToast(t.achievement_unlocked +  newlyUnlocked[i]);
            }, i * 600);
        }
    } catch (e) {
        console.error('Achievement check failed:', e);
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// FIELD BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function _buildFields(prefill) {
    const form = document.createElement('div');
    form.className = 'bm-form';

    const titleInput  = _input('text',   t.beer_title,  prefill?.Title  ?? '');
    const brandInput  = _input('text',   t.beer_brand,  prefill?.Brand  ?? '');
    const volumeInput = _input('number', t.beer_volume, prefill?.Volume != null ? String(prefill.Volume) : '');
    const priceInput  = _input('number', t.beer_price,  prefill?.Price  != null ? String(prefill.Price)  : '');
    const barInput    = _input('text',   t.beer_bar,    prefill?.Bar    ?? '');

    // ── Star rating ───────────────────────────────────────────────────────────
    const ratingLabel = document.createElement('p');
    ratingLabel.className = 'bm-rating-label';
    ratingLabel.textContent = t.beer_rating;

    const { wrapper: ratingWrapper, getValue: getRating, setValue: setRating }
        = _buildStarRating(5, 0.5);
    setRating(prefill?.Rating ?? 2.5);

    form.appendChild(titleInput.wrap);
    form.appendChild(brandInput.wrap);
    form.appendChild(volumeInput.wrap);
    form.appendChild(priceInput.wrap);
    form.appendChild(barInput.wrap);
    form.appendChild(ratingLabel);
    form.appendChild(ratingWrapper);

    return { form, titleInput, brandInput, volumeInput, priceInput, barInput, getRating };
}

function _readFields({ titleInput, brandInput, volumeInput, priceInput, barInput, getRating }) {
    let title  = titleInput.el.value.trim()  || 'Unknown Title';
    let brand  = brandInput.el.value.trim()  || 'Unknown Brand';
    let bar    = barInput.el.value.trim()    || 'Unknown Bar';

    const MAX = 30;
    for (const [label, val] of [['Title', title], ['Brand', brand], ['Bar', bar]]) {
        if (val.includes(',') || val.length > MAX) {
            return { error: `${t.error_chars}` };
        }
    }

    const volume = _safeFloat(volumeInput.el.value, 0);
    const price  = _safeFloat(priceInput.el.value,  0);
    const rating = getRating();

    return { title, brand, bar, volume, price, rating, error: null };
}


// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING  (5 stars, 0.5-step, mirrors Android RatingBar)
// ─────────────────────────────────────────────────────────────────────────────

function _buildStarRating(numStars, step) {
    let currentValue = 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'bm-stars';
    wrapper.setAttribute('role', 'radiogroup');
    wrapper.setAttribute('aria-label', 'Rating');

    const stars = [];

    for (let i = 1; i <= numStars; i++) {
        const star = document.createElement('span');
        star.className = 'bm-star';
        star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);

        const emptySvg = _starSvg('rgba(255,255,255,0.3)');
        emptySvg.setAttribute('class', 'bm-star__empty');

        const filledWrap = document.createElement('span');
        filledWrap.className = 'bm-star__filled';
        filledWrap.appendChild(_starSvg('#FBB122'));

        ['left', 'right'].forEach(half => {
            const zone = document.createElement('span');
            zone.className = `bm-star__half bm-star__half--${half}`;
            zone.dataset.value = half === 'left' ? i - 0.5 : i;
            zone.addEventListener('click', () => setValue(parseFloat(zone.dataset.value)));
            star.appendChild(zone);
        });

        star.appendChild(emptySvg);
        star.appendChild(filledWrap);
        wrapper.appendChild(star);
        stars.push(star);
    }

    function _starSvg(fillColour) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = `<path fill="${fillColour}" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`;
        return svg;
    }

    function setValue(v) {
        currentValue = Math.round(v / step) * step;
        currentValue = Math.max(0, Math.min(numStars, currentValue));
        _renderStars(stars, currentValue);
    }

    function getValue() { return currentValue; }

    setValue(2.5);
    return { wrapper, getValue, setValue };
}

function _renderStars(stars, value) {
    stars.forEach((star, idx) => {
        const starNum = idx + 1;
        if (value >= starNum)            star.dataset.fill = 'full';
        else if (value >= starNum - 0.5) star.dataset.fill = 'half';
        else                             star.dataset.fill = 'empty';
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _input(type, placeholder, value) {
    const wrap = document.createElement('div');
    wrap.className = 'bm-input-wrap';

    const el = document.createElement('input');
    el.type         = type === 'number' ? 'text' : type;
    el.inputMode    = type === 'number' ? 'decimal' : 'text';
    el.placeholder  = placeholder;
    el.value        = value;
    el.className    = 'bm-input';
    el.autocomplete = 'off';

    wrap.appendChild(el);
    return { wrap, el };
}

function _safeFloat(str, fallback) {
    const v = parseFloat(String(str).trim());
    return isNaN(v) ? fallback : v;
}

function _normalize(str) {
    return String(str ?? '').trim().toLowerCase();
}

function _showAlcodexConfirm(brand, onConfirm) {
    const existing = document.getElementById('bm-alcodex-confirm');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'bm-alcodex-confirm';
    dialog.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
    `;

    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    `;

    const safeBrand = brand.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const box = document.createElement('div');
    box.style.cssText = `
        position: relative; background: #1e1e1e; border-radius: 16px;
        padding: 24px; width: min(320px, 85vw); text-align: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    `;
    box.innerHTML = `
        <p style="margin:0 0 6px; font-size:17px; font-weight:600; color:#fff;">
            ${t.alcodex_title}
        </p>
        <p style="margin:0 0 20px; font-size:14px; color:rgba(255,255,255,0.55);">
           ${t.alcodex_sub}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="bm-alcodex-skip-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.1); color:#fff; font-size:15px; cursor:pointer;">
                ${t.skip}
            </button>
            <button id="bm-alcodex-add-btn" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:600; cursor:pointer;">
                ${t.add}
            </button>
        </div>
    `;

    dialog.appendChild(backdrop);
    dialog.appendChild(box);
    document.body.appendChild(dialog);

    const dismiss = () => dialog.remove();

    backdrop.addEventListener('click', dismiss);
    box.querySelector('#bm-alcodex-skip-btn').addEventListener('click', dismiss);
    box.querySelector('#bm-alcodex-add-btn').addEventListener('click', async () => {
        dismiss();
        await onConfirm();
    });
}

function _showToast(message) {
    const toast = document.createElement('div');
    toast.className   = 'bm-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('bm-toast--visible'));
    setTimeout(() => {
        toast.classList.remove('bm-toast--visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3500);
}
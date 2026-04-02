import { addLineCsv, updateLine } from '../stats/storage/csvHelper.js';
import { Geolocation }            from '@capacitor/geolocation';
import { t }                      from '../../assets/strings/strings.js';


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
    dialog.setAttribute('aria-label', isEditing ? 'Edit beer' : 'Beer information');

    // ── Title ─────────────────────────────────────────────────────────────────
    const titleBar = document.createElement('h2');
    titleBar.className = 'bm-title';
    titleBar.textContent = isEditing ? 'Edit beer' : 'Beer information';

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
    cancelBtn.textContent = 'Cancel';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'bm-btn bm-btn--submit';
    submitBtn.textContent = isEditing ? 'Update' : 'Submit';

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
            await updateLine(existingLine.Picture, title, brand, volume, price, rating, bar);
            close();
            onSubmit?.({ ...existingLine, Title: title, Brand: brand,
                Volume: volume, Price: price, Rating: rating, Bar: bar });

        } else {
            submitBtn.textContent = 'Locating…';

            // Await here — resolves instantly if GPS already came back during form fill
            const [latitude, longitude] = await coordsPromise;

            if (latitude === 0 && longitude === 0) {
                _showToast('Location is disabled. Please enable it to submit.');
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
            close();
            onSubmit?.(newLine);
        }
    });
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
            return { error: `The maximum length is ${MAX} characters and commas are not allowed.` };
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
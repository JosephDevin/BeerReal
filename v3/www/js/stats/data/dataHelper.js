// ── DAY COUNTERS (replaces CsvHelper static helpers) ─────────────────────────

/** Days elapsed since Monday of the current week (Mon = 1 … Sun = 7) */
export function getDaysSoFarThisWeek() {
    const day = new Date().getDay(); // 0 = Sun, 1 = Mon …
    return day === 0 ? 7 : day;
}

/** Day-of-month index (1-based) */
export function getDaysSoFarThisMonth() {
    return new Date().getDate();
}

/** Day-of-year index (1-based) */
export function getDaysSoFarThisYear() {
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86_400_000);
}

/**
 * Days between the earliest beer entry and today (inclusive).
 * @param {object[]} lines  – raw beer objects (must have a .Date field)
 */
export function getDaysFromEarliestDate(lines) {
    if (!lines.length) return 1;
    const earliest = lines
        .map(l => parseEntryDate(l.Date).getTime())
        .reduce((min, t) => Math.min(min, t), Infinity);
    return Math.max(1, Math.floor((Date.now() - earliest) / 86_400_000) + 1);
}


// ── DATE PARSING ──────────────────────────────────────────────────────────────

/**
 * Parses the app's date format: "yyyy-MM-dd-HH:mm"
 * @param  {string} dateStr
 * @returns {Date}
 */
export function parseEntryDate(dateStr) {
    const [year, month, day, time] = dateStr.split('-');
    const [hour, minute] = time.split(':');
    return new Date(+year, +month - 1, +day, +hour, +minute);
}


// ── NUMERIC HELPERS ───────────────────────────────────────────────────────────

/** Sum a list of numbers. */
export function sum(list) {
    return list.reduce((acc, v) => acc + v, 0);
}

/** Count how many distinct calendar days appear in an array of date strings. */
export function countUniqueDays(dateStrings) {
    return new Set(dateStrings.map(d => d.substring(0, 10))).size;
}


// ── STRING / FREQUENCY HELPERS ────────────────────────────────────────────────

/**
 * Returns the most-frequent value(s) in a string array with a count label.
 * e.g. "leffe (5)" or "leffe / jupiler (3)"
 */
export function getMost(input) {
    if (!input.length) return 'N/A';

    const counts = {};
    for (const s of input) {
        const key = s.trim().toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
    }

    let maxCount  = 0;
    let favorites = [];
    for (const [key, count] of Object.entries(counts)) {
        if (count > maxCount)       { maxCount = count; favorites = [key]; }
        else if (count === maxCount){ favorites.push(key); }
    }

    return `${favorites.join(' / ')} (${maxCount})`;
}


// ── STREAK HELPERS ────────────────────────────────────────────────────────────

/**
 * Longest consecutive drinking streak (days in a row).
 * @param {string[]} dateStrings – e.g. ["2025-05-18-20:56", …]
 */
export function findLongestStreak(dateStrings) {
    if (!dateStrings.length) return 0;

    const dateSet  = new Set(dateStrings.map(d => d.substring(0, 10)));
    const sorted   = [...dateSet].sort();

    let best = 1, current = 1;

    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diff = (curr - prev) / 86_400_000;

        if (diff === 1) { current++; best = Math.max(best, current); }
        else            { current = 1; }
    }

    return best;
}

/**
 * Longest consecutive non-drinking streak (gap between recorded days).
 * @param {string[]} dateStrings
 */
export function findLongestMissingStreak(dateStrings) {
    if (!dateStrings.length) return 0;

    const dateSet = new Set(dateStrings.map(d => d.substring(0, 10)));
    const sorted  = [...dateSet].sort();
    const min     = new Date(sorted[0]);
    const max     = new Date(sorted[sorted.length - 1]);

    let longest = 0, current = 0;
    const cursor = new Date(min);

    while (cursor <= max) {
        const key = cursor.toISOString().substring(0, 10);
        if (!dateSet.has(key)) { current++; longest = Math.max(longest, current); }
        else                   { current = 0; }
        cursor.setDate(cursor.getDate() + 1);
    }

    return longest;
}
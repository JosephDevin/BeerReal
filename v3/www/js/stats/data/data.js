import { getLinesCsv }           from '../storage/csvHelper';
import {
    getDaysSoFarThisWeek,
    getDaysSoFarThisMonth,
    getDaysSoFarThisYear,
    getDaysFromEarliestDate,
    parseEntryDate,
    sum,
    countUniqueDays,
    getMost,
    findLongestStreak,
    findLongestMissingStreak,
} from './dataHelper.js';

import { COUNTRY_VALUES } from '../../../assets/countryValues';



// ── TIME ENUM ─────────────────────────────────────────────────────────────────

export const Times = Object.freeze({
    WEEK:     'WEEK',
    MONTH:    'MONTH',
    YEAR:     'YEAR',
    ALL_TIME: 'ALL_TIME',
});


// ── DATA CLASS ────────────────────────────────────────────────────────────────

export class Data {

    /**
     * Don't call directly — use the async factory `Data.create(time)`.
     * @param {object[]} allLines  – full list returned by getLinesCsv()
     * @param {string}   time      – one of the Times enum values
     */
    constructor(allLines, time) {
        this._lines         = allLines;
        this._time          = time;
        this._filteredLines = [];

        // Flat arrays (mirrors the Java fields)
        this._brands  = [];
        this._volumes = [];
        this._prices  = [];
        this._dates   = [];
        this._bars    = [];
        this._ratings = [];

        // Public summary fields
        this.size        = 0;
        this.pricesTotal = 0;
        this.volumeTotal = 0;
        this.uniqueDays  = 0;
        this.days        = 0;

        if (!allLines.length) return;

        // Determine the denominator (# of days in the chosen period)
        switch (time) {
            case Times.WEEK:     this.days = getDaysSoFarThisWeek();         break;
            case Times.MONTH:    this.days = getDaysSoFarThisMonth();        break;
            case Times.ALL_TIME: this.days = getDaysFromEarliestDate(allLines); break;
            default:             this.days = getDaysSoFarThisYear();         break;
        }

        this._selectTimeToLoad();
    }

    /** Async factory — loads the CSV then constructs the object. */
    static async create(time) {
        const lines = await getLinesCsv();
        return new Data(lines, time);
    }


    // ── PRIVATE: FILTER + LOAD ────────────────────────────────────────────────

    _selectTimeToLoad() {
        switch (this._time) {
            case Times.WEEK:     this._filteredLines = this._linesThisWeek();  break;
            case Times.MONTH:    this._filteredLines = this._linesThisMonth(); break;
            case Times.YEAR:     this._filteredLines = this._linesThisYear();  break;
            case Times.ALL_TIME: this._filteredLines = this._lines;            break;
        }
        this._loadAllLines(this._filteredLines);
    }

    _loadAllLines(lines) {
        for (const l of lines) {
            this.size++;
            this._brands .push(l.Brand);
            this._volumes.push(l.Volume);
            this._prices .push(l.Price);
            this._dates  .push(l.Date);
            this._bars   .push(l.Bar);
            this._ratings.push(l.Rating);
        }

        this.pricesTotal = sum(this._prices);
        this.volumeTotal = sum(this._volumes);
        this.uniqueDays  = countUniqueDays(this._dates);
    }


    // ── PRIVATE: DATE FILTERING ───────────────────────────────────────────────

    /** ISO week number (Monday-first, matches Java's Calendar.WEEK_OF_YEAR). */
    _isoWeek(date) {
        const d      = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(((d - yearStart) / 86_400_000 + 1) / 7);
    }

    _linesThisWeek() {
        const now  = new Date();
        const week = this._isoWeek(now);
        const year = now.getFullYear();
        return this._lines.filter(l => {
            const d = parseEntryDate(l.Date);
            return this._isoWeek(d) === week && d.getFullYear() === year;
        });
    }

    _linesThisMonth() {
        const now = new Date();
        return this._lines.filter(l => {
            const d = parseEntryDate(l.Date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
    }

    _linesThisYear() {
        const year = new Date().getFullYear();
        return this._lines.filter(l => parseEntryDate(l.Date).getFullYear() === year);
    }


    // ── TOTALS ────────────────────────────────────────────────────────────────

    getTotalBeers()          { return this.size; }
    getTotalCost()           { return this.pricesTotal; }
    getTotalVolume()         { return this.volumeTotal; }
    getAverageSatisfaction() { return this.size === 0 ? null : sum(this._ratings) / this.size; }


    // ── AVERAGES PER DAY ──────────────────────────────────────────────────────

    getAverageDrinksPerDay()  { return this.size === 0 ? 0 : this.size        / this.days; }
    getAverageCostPerDay()    { return this.size === 0 ? 0 : this.pricesTotal / this.days; }
    getAverageVolumePerDay()  { return this.size === 0 ? 0 : this.volumeTotal / this.days; }


    // ── TIE-BREAKING HELPER ───────────────────────────────────────────────────

    /**
     * Given an array of tied keys, walks _filteredLines newest-first and returns
     * up to `limit` distinct keys in recency order, appending "..." when truncated.
     * @param {string[]} tiedKeys
     * @param {function} keyFn     – (line) => string|null, extracts the key from a line
     * @param {number}   limit
     */
    _pickMostRecent(tiedKeys, keyFn, limit = 3) {
        const keySet = new Set(tiedKeys);
        const seen   = [];

        for (let i = this._filteredLines.length - 1; i >= 0 && seen.length < limit; i--) {
            const k = keyFn(this._filteredLines[i]);
            if (k !== null && keySet.has(k) && !seen.includes(k)) seen.push(k);
        }

        return seen.join(', ') + (tiedKeys.length > limit ? ', ...' : '');
    }


    // ── FAVORITES (highest average rating) ───────────────────────────────────

    getFavoriteBar() {
        if (this.size === 0) return 'None';

        const sums = {}, counts = {};
        for (const l of this._filteredLines) {
            const key    = l.Bar.trim().toLowerCase();
            sums[key]   = (sums[key]   || 0) + l.Rating;
            counts[key] = (counts[key] || 0) + 1;
        }

        let bestAvg = -1;
        const tied  = [];
        for (const key of Object.keys(sums)) {
            const avg = sums[key] / counts[key];
            if      (avg > bestAvg) { bestAvg = avg; tied.length = 0; tied.push(key); }
            else if (avg === bestAvg){ tied.push(key); }
        }

        const label = tied.length === 1 ? tied[0] : this._pickMostRecent(tied, l => l.Bar.trim().toLowerCase());
        return `${label} (${bestAvg.toFixed(2)})`;
    }

    getFavoriteBrand() {
        if (!this._brands.length) return 'None';

        const brandRatings = {};
        for (let i = 0; i < this._brands.length; i++) {
            const b = this._brands[i];
            if (!brandRatings[b]) brandRatings[b] = [];
            brandRatings[b].push(this._ratings[i]);
        }

        let maxAvg = -1;
        const tied = [];
        for (const [brand, ratings] of Object.entries(brandRatings)) {
            const avg = sum(ratings) / ratings.length;
            if      (avg > maxAvg) { maxAvg = avg; tied.length = 0; tied.push(brand); }
            else if (avg === maxAvg){ tied.push(brand); }
        }

        return tied.length === 1 ? tied[0] : this._pickMostRecent(tied, l => l.Brand);
    }

    getFavoriteHour() {
        if (this.size === 0) return 'None';

        const sums = {}, counts = {};
        for (const l of this._filteredLines) {
            if (l.Date?.length >= 13) {
                const hour   = l.Date.substring(11, 13);
                sums[hour]   = (sums[hour]   || 0) + l.Rating;
                counts[hour] = (counts[hour] || 0) + 1;
            }
        }

        let bestAvg = -1;
        const tied  = [];
        for (const hour of Object.keys(sums)) {
            const avg = sums[hour] / counts[hour];
            if      (avg > bestAvg) { bestAvg = avg; tied.length = 0; tied.push(hour); }
            else if (avg === bestAvg){ tied.push(hour); }
        }

        const label = tied.length === 1 ? tied[0] : this._pickMostRecent(tied, l => l.Date?.substring(11, 13) ?? null);
        return `${label}h (${bestAvg.toFixed(2)})`;
    }

    getUniqueBars() {
        return new Set(this._bars.filter(b => b?.trim()).map(b => b.trim())).size;
    }

    /** Returns true if the brand has never been recorded in the current data set. */
    isBrandNew(brand) {
        return !this._brands.some(b => b?.toLowerCase() === brand.toLowerCase());
    }


    // ── MOST FREQUENT ─────────────────────────────────────────────────────────

    _getMostWithRecency(input, keyFn) {
        if (!input.length) return 'None';

        const counts = {};
        for (const s of input) {
            const k = s.trim().toLowerCase();
            counts[k] = (counts[k] || 0) + 1;
        }

        let maxCount = 0;
        const tied   = [];
        for (const [key, count] of Object.entries(counts)) {
            if      (count > maxCount) { maxCount = count; tied.length = 0; tied.push(key); }
            else if (count === maxCount){ tied.push(key); }
        }

        const label = tied.length === 1 ? tied[0] : this._pickMostRecent(tied, keyFn);
        return `${label} (${maxCount})`;
    }

    getMostBar()   { return this._getMostWithRecency(this._bars,   l => l.Bar.trim().toLowerCase());   }
    getMostBrand() { return this._getMostWithRecency(this._brands, l => l.Brand.trim().toLowerCase()); }

    getMostHour() {
        const hours = this._dates
            .map(d => { const p = d.split('-'); return p.length >= 4 ? p[3].substring(0, 2) : null; })
            .filter(Boolean);
        return this._getMostWithRecency(hours, l => { const p = l.Date?.split('-'); return p?.length >= 4 ? p[3].substring(0, 2) : null; });
    }


    // ── COST ──────────────────────────────────────────────────────────────────

    getAverageCost() { return this.size === 0 ? 0 : this.pricesTotal / this.size; }

    getCheapestBeer() {
        if (!this._filteredLines.length) return 'None';
        const l = this._filteredLines.reduce((min, c) => c.Price < min.Price ? c : min);
        return `${l.Price.toFixed(2)}€ - ${l.Brand.trim()} @ ${l.Bar.trim()}`;
    }

    getCheapestBeerPrice() {
        const valid = this._filteredLines.filter(l => l.Price > 0);
        return valid.length ? Math.min(...valid.map(l => l.Price)) : -1;
    }

    getMostExpensiveBeer() {
        if (!this._filteredLines.length) return 'None';
        const l = this._filteredLines.reduce((max, c) => c.Price > max.Price ? c : max);
        return `${l.Price.toFixed(2)}€ - ${l.Brand.trim()} @ ${l.Bar.trim()}`;
    }


    // ── STREAKS ───────────────────────────────────────────────────────────────

    getLongestDrinkingStreak()    { return findLongestStreak(this._dates);        }
    getLongestNonDrinkingStreak() { return findLongestMissingStreak(this._dates); }


    // ── HEALTH ────────────────────────────────────────────────────────────────

    getCaloricIntake() { return this.size === 0 ? 0 : (this.volumeTotal / 0.5) * 215.4; }
    getAlcoholUnits()  { return this.size === 0 ? 0 : (this.volumeTotal * 0.05) / 0.01; }


    // ── GLOBAL COMPARISON ─────────────────────────────────────────────────────

    getClosestCountry() {
        if (this.size === 0) return '';
        const target = (this.getAlcoholUnits() * 0.01) / this.days;
        return COUNTRY_VALUES.reduce((best, c) =>
            Math.abs(c.value - target) < Math.abs(best.value - target) ? c : best
        ).country;
    }


    compareToWorldsDrinkers() {
        if (this.size === 0) return { czechia: 0, latvia: 0, estonia: 0, france: 0, ireland: 0, usa: 0, bangladesh: 0 };
        const daily = (this.getAlcoholUnits() * 0.01) / this.days;
        return {
            czechia:    daily / 0.0355890411,
            latvia:     daily / 0.0344657534,
            estonia:    daily / 0.0330410959,
            france:     daily / 0.0289589041,
            ireland:    daily / 0.0278082192,
            usa:        daily / 0.0257808219,
            bangladesh: daily / 5.4795e-6,
        };
    }


    // ── DEBUG ─────────────────────────────────────────────────────────────────

    toString() {
        const r = this.compareToWorldsDrinkers();
        return [
            '📊 Beer Stats Summary',
            '-----------------------------',
            `🍺 Total Beers: ${this.getTotalBeers()}`,
            `💶 Total Cost: ${this.getTotalCost().toFixed(2)}€`,
            `📦 Total Volume: ${this.getTotalVolume().toFixed(2)}L`,
            `⭐ Average Satisfaction: ${this.getAverageSatisfaction().toFixed(2)}/5.0`,
            '',
            '📅 Daily Averages',
            `🍺 Beers/Day: ${this.getAverageDrinksPerDay().toFixed(2)}`,
            `💶 Cost/Day: ${this.getAverageCostPerDay().toFixed(2)}€`,
            '',
            '🏆 Favorites',
            `📍 Bar: ${this.getFavoriteBar()}`,
            `🏷️ Brand: ${this.getFavoriteBrand()}`,
            `🕔 Hour: ${this.getFavoriteHour()}`,
            '',
            '📈 Streaks',
            `🔥 Longest Drinking Streak: ${this.getLongestDrinkingStreak()} day(s)`,
            `❄️ Longest Non-Drinking Streak: ${this.getLongestNonDrinkingStreak()} day(s)`,
            '',
            '💸 Cost Breakdown',
            `💶 Avg Cost per Beer: ${this.getAverageCost().toFixed(2)}€`,
            `🟢 Cheapest: ${this.getCheapestBeer()}`,
            `🔴 Most Expensive: ${this.getMostExpensiveBeer()}`,
            '',
            '🧠 Health Metrics',
            `🔥 Estimated Calories: ${Math.round(this.getCaloricIntake())} kcal`,
            `🥴 Alcohol Units: ${this.getAlcoholUnits().toFixed(2)}`,
            '',
            '🌍 Global Comparison (your daily alcohol vs per-capita average)',
            `🇨🇿 Czechia: ${r.czechia.toFixed(2)}x`,
            `🇱🇻 Latvia: ${r.latvia.toFixed(2)}x`,
            `🇪🇪 Estonia: ${r.estonia.toFixed(2)}x`,
            `🇫🇷 France: ${r.france.toFixed(2)}x`,
            `🇮🇪 Ireland: ${r.ireland.toFixed(2)}x`,
            `🇺🇸 USA: ${r.usa.toFixed(2)}x`,
            `🇧🇩 Bangladesh: ${r.bangladesh.toFixed(2)}x`,
        ].join('\n');
    }
}
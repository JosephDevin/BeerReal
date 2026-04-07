// alcodexHelper.js
// Manages csv/alcodex.json — maps brand names to their first photo path.
// Singleton, must be init()-ed before use (same pattern as jsonHelper).

import { Filesystem, Directory } from '@capacitor/filesystem';

const FILE_PATH = 'csv/alcodex.json';
const DIR       = Directory.External;

// ─────────────────────────────────────────────────────────────────────────────

class AlcodexHelper {

    constructor() {
        /** @type {Object.<string, { photoPath: string|null, hasImage: boolean }>} */
        this._beers       = {};
        this._initPromise = null;
    }


    // ── PUBLIC ────────────────────────────────────────────────────────────────

    /** Must be awaited before any other method. Safe to call multiple times. */
    async init() {
        if (this._initPromise) return this._initPromise;
        this._initPromise = this._doInit();
        return this._initPromise;
    }

    /**
     * Add a brand if it has never been seen before.
     * If it already exists but has no image yet, update the photo path.
     * No-ops silently if nothing changed.
     * @param {string}      brand
     * @param {string|null} photoPath  filename inside the pics/ directory
     */
    async addOrUpdateBrand(brand, photoPath) {
        const normalized   = _normalize(brand);
        const existingKey  = Object.keys(this._beers)
            .find(k => _normalize(k) === normalized);

        if (existingKey) {
            // Brand already known — fill in the photo only if we didn't have one
            if (photoPath && !this._beers[existingKey].hasImage) {
                this._beers[existingKey].photoPath = photoPath;
                this._beers[existingKey].hasImage  = true;
                await this._saveToFile();
            }
        } else {
            // Brand is brand-new to the alcodex
            this._beers[brand] = {
                photoPath: photoPath ?? null,
                hasImage:  !!photoPath,
            };
            await this._saveToFile();
        }
    }

    /** @returns {Object.<string, { photoPath: string|null, hasImage: boolean }>} */
    getBeers() { return { ...this._beers }; }

    /** @returns {boolean} */
    hasBrand(brand) {
        const n = _normalize(brand);
        return Object.keys(this._beers).some(k => _normalize(k) === n);
    }


    // ── PRIVATE ───────────────────────────────────────────────────────────────

    async _doInit() {
        await this._initializeIfMissing();
        await this._readFromFile();
    }

    async _initializeIfMissing() {
        try {
            await Filesystem.stat({ path: FILE_PATH, directory: DIR });
        } catch {
            // First launch — create an empty alcodex
            await Filesystem.writeFile({
                path:      FILE_PATH,
                data:      JSON.stringify({}, null, 2),
                directory: DIR,
                recursive: true,
                encoding:  'utf8',
            });
        }
    }

    async _readFromFile() {
        const result = await Filesystem.readFile({
            path:     FILE_PATH,
            directory: DIR,
            encoding:  'utf8',
        });

        const json = typeof result.data === 'string'
            ? result.data
            : await result.data.text();

        this._beers = json.trim() ? JSON.parse(json) : {};
    }

    async _saveToFile() {
        await Filesystem.writeFile({
            path:      FILE_PATH,
            data:      JSON.stringify(this._beers, null, 2),
            directory: DIR,
            encoding:  'utf8',
        });
    }

    async syncFromCsv() {
        const { loadCsvAsStrings } = await import('../storage/csvHelper.js'); // adjust path

        const lines = await loadCsvAsStrings();

        // Skip header (index 0), ignore malformed rows
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < 3) continue;

            const photoPath = parts[0].trim();
            const brand     = parts[2].trim();

            if (brand) await this.addOrUpdateBrand(brand, photoPath);
        }
    }


    async resyncBrand(brand) {
        const { loadCsvAsStrings } = await import('../storage/csvHelper.js'); // adjust path
        const lines                = await loadCsvAsStrings();
        const normalized           = _normalize(brand);

        let firstPhoto = null;

        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < 3) continue;

            if (_normalize(parts[2].trim()) === normalized) {
                firstPhoto = parts[0].trim() || null;
                break;
            }
        }

        // Find the canonical key stored in the map (case may differ)
        const existingKey = Object.keys(this._beers)
            .find(k => _normalize(k) === normalized);

        if (!existingKey) return; // brand was never in alcodex — nothing to do

        if (firstPhoto === null) {
            // No beers of this brand left → remove from alcodex
            delete this._beers[existingKey];
        } else {
            // Update photo to whatever is now the first entry
            this._beers[existingKey].photoPath = firstPhoto;
            this._beers[existingKey].hasImage  = true;
        }

        await this._saveToFile();
    }

    /**
     * Convenience wrapper for a brand-rename on edit:
     * resyncs the old brand (may disappear) and registers the new one.
     * @param {string}      oldBrand
     * @param {string}      newBrand
     * @param {string|null} photoPath  filename of the edited entry
     */
    async handleBrandRename(oldBrand, newBrand, photoPath) {
        await this.resyncBrand(oldBrand);          // old brand: remove or re-point
        await this.addOrUpdateBrand(newBrand, photoPath);  // new brand: add if missing
    }

}



// ── HELPERS ───────────────────────────────────────────────────────────────────

function _normalize(brand) {
    return brand.toLowerCase().replace(/[^a-z]/g, '');
}

// ── SINGLETON ─────────────────────────────────────────────────────────────────
export const alcodex = new AlcodexHelper();
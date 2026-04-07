// jsonHelper.js
// Manages reading/writing json.json to the device filesystem.
// Mirrors the Java JSONHelper class — exported as a singleton `json`.
// Supports EN/FR locale switching: translations are re-applied on language
// change while unlocked states are preserved.

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Achievement }           from './achievement.js';
import { DEFAULT_ACHIEVEMENTS }    from '../../../assets/json/defaultAchievements.js';
import { DEFAULT_ACHIEVEMENTS_FR } from '../../../assets/json/defaultAchievements-fr.js';

const FILE_PATH = 'csv/json.json';
const DIR       = Directory.External;
const LANG_KEY  = 'achievement_lang';

// ─────────────────────────────────────────────────────────────────────────────

function _detectLang() {
    return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function _getDefaults(lang) {
    return lang === 'fr' ? DEFAULT_ACHIEVEMENTS_FR : DEFAULT_ACHIEVEMENTS;
}

// ─────────────────────────────────────────────────────────────────────────────

class JsonHelper {

    constructor() {
        /** @type {Achievement[]} */
        this._achievements = [];

        // Ensure concurrent callers all wait for the same init promise
        this._initPromise = null;
    }


    // ── PUBLIC ────────────────────────────────────────────────────────────────

    /**
     * Must be awaited before any other method.
     * Safe to call multiple times — only initialises once.
     */
    async init() {
        if (this._initPromise) return this._initPromise;
        this._initPromise = this._doInit();
        return this._initPromise;
    }

    /** @returns {Achievement[]} */
    getAllAchievements() { return this._achievements; }

    /** @returns {Achievement[]} */
    getAllUnlocked() { return this._achievements.filter(a => a.unlocked); }

    /** @returns {Achievement[]} */
    getAllLocked() { return this._achievements.filter(a => !a.unlocked); }

    /**
     * Set the unlocked state of an achievement by its title (Name in Java).
     * Persists immediately to disk.
     * @param {string}  name
     * @param {boolean} value
     */
    async setUnlocked(name, value) {
        const a = this._achievements.find(a => a.name === name);
        if (!a) throw new Error(`Achievement "${name}" not found`);
        a.unlocked = value;
        await this._saveToFile();
        return true;
    }


    // ── PRIVATE ───────────────────────────────────────────────────────────────

    async _doInit() {
        const lang       = _detectLang();
        const storedLang = localStorage.getItem(LANG_KEY);

        const fileExists = await this._fileExists();

        if (!fileExists) {
            // First launch — seed with defaults in the current language
            await this._writeDefaults(lang);
        } else if (storedLang !== lang) {
            // Language changed — re-apply translations, preserve unlocked states
            await this._resyncLocale(lang);
        }

        localStorage.setItem(LANG_KEY, lang);
        await this._readFromFile();
    }

    async _fileExists() {
        try {
            await Filesystem.stat({ path: FILE_PATH, directory: DIR });
            return true;
        } catch {
            return false;
        }
    }

    async _writeDefaults(lang) {
        await Filesystem.writeFile({
            path:      FILE_PATH,
            data:      JSON.stringify(_getDefaults(lang), null, 2),
            directory: DIR,
            recursive: true,   // creates csv/ dir if needed
            encoding:  'utf8',
        });
    }

    /**
     * Reads the stored file, builds an id→unlocked map, then rewrites the file
     * with the new language's titles/descriptions and the preserved unlock states.
     */
    async _resyncLocale(lang) {
        const raw     = await this._readRaw();
        const current = JSON.parse(raw);

        const unlockedById = Object.fromEntries(
            current.map(a => [a.id, a.unlocked === true || a.unlocked === 'true'])
        );

        const updated = _getDefaults(lang).map(a => ({
            ...a,
            unlocked: unlockedById[a.id] ?? false,
        }));

        await Filesystem.writeFile({
            path:      FILE_PATH,
            data:      JSON.stringify(updated, null, 2),
            directory: DIR,
            encoding:  'utf8',
        });
    }

    async _readRaw() {
        const result = await Filesystem.readFile({
            path:      FILE_PATH,
            directory: DIR,
            encoding:  'utf8',
        });
        return typeof result.data === 'string' ? result.data : await result.data.text();
    }

    async _readFromFile() {
        const raw = await this._readRaw();

        if (!raw.trim()) throw new Error('json.json is empty or corrupt');

        const arr = JSON.parse(raw);

        this._achievements = arr.map(obj => new Achievement(
            obj.id          ?? '',
            obj.title       ?? '',
            obj.description ?? '',
            // Guard against the "false" string that appears in the original JSON
            obj.unlocked === true || obj.unlocked === 'true',
        ));
    }

    async _saveToFile() {
        const arr = this._achievements.map(a => ({
            id:          a.id,
            title:       a.name,
            description: a.description,
            unlocked:    a.unlocked,
        }));

        await Filesystem.writeFile({
            path:      FILE_PATH,
            data:      JSON.stringify(arr, null, 2),
            directory: DIR,
            encoding:  'utf8',
        });
    }
}


// ── SINGLETON ─────────────────────────────────────────────────────────────────
export const achievements = new JsonHelper();

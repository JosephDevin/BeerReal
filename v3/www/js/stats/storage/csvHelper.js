import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { createBeer } from './beer.js';

const DIR      = Directory.External;
const CSV_DIR  = 'csv';
const CSV_FILE = 'csv/data.csv';
const PICS_DIR = 'pics';
const HEADER   = 'Photo_path,Title,Brand,Volume,Price,Latitude,Longitude,Date,Rating,Bar\n';


// ── INITIALIZATION ────────────────────────────────────────────────────────────

export async function initialiseCSV() {
    try {
        await Filesystem.mkdir({ path: CSV_DIR, directory: DIR, recursive: true }).catch(() => {});

        const exists = await Filesystem.stat({ path: CSV_FILE, directory: DIR })
            .then(() => true).catch(() => false);

        if (!exists) {
            await Filesystem.writeFile({ path: CSV_FILE, data: HEADER, directory: DIR, encoding: Encoding.UTF8 });
            console.log("CSV correctly initialized");
        }
    } catch (e) {
        console.error('initialiseCSV error:', e);
    }
}

export async function createImageDir() {
    try {
        await Filesystem.mkdir({ path: PICS_DIR, directory: DIR, recursive: true }).catch(() => {});
        console.log("Image directory initialized");
    } catch (e) {
        console.error('createImageDir error:', e);
    }
}


// ── MANAGING NEW DATA ─────────────────────────────────────────────────────────

export async function addLineCsv(photoPath, title, brand, volume, price, coords, date, rating, bar) {
    const formatted = new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(date).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

    const dateStr = `${formatted.year}-${formatted.month}-${formatted.day}-${formatted.hour}:${formatted.minute}`;
    const line    = [photoPath, title, brand, volume, price, coords[0], coords[1], dateStr, rating, bar].join(',') + '\n';

    try {
        const existing = await Filesystem.readFile({ path: CSV_FILE, directory: DIR, encoding: Encoding.UTF8 });
        await Filesystem.writeFile({ path: CSV_FILE, data: existing.data + line, directory: DIR, encoding: Encoding.UTF8 });
        console.log('Line written');
    } catch (e) {
        console.error('addLineCsv error:', e);
    }
}


// ── LOADING LINES ─────────────────────────────────────────────────────────────

export async function loadCsvAsStrings() {
    try {
        const result = await Filesystem.readFile({ path: CSV_FILE, directory: DIR, encoding: Encoding.UTF8 });
        return result.data.split('\n').filter(l => l.trim() !== '');
    } catch (e) {
        console.error('loadCsvAsStrings error:', e);
        return [];
    }
}

export async function getLinesCsv() {
    const lines = await loadCsvAsStrings();
    const result = [];

    if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < 10) continue;

            result.push(createBeer(
                parts[0],  // Picture path
                parts[1],  // Title
                parts[2],  // Brand
                parts[3],  // Volume
                parts[4],  // Price
                parts[5],  // Latitude
                parts[6],  // Longitude
                parts[7],  // Date
                parts[8],  // Rating
                parts[9],  // Bar
            ));
        }
    }

    return result;
}


// ── REMOVE LINE ───────────────────────────────────────────────────────────────

// uniqueValue = Photo_path (first column, acts as primary key)
export async function removeLine(uniqueValue) {
    try {
        const lines   = await loadCsvAsStrings();
        const filtered = lines.filter(line => {
            const fields = line.split(',');
            return fields[0] !== uniqueValue; // keep header + non-matching rows
        });

        await Filesystem.writeFile({
            path: CSV_FILE, directory: DIR, encoding: Encoding.UTF8,
            data: filtered.join('\n') + '\n',
        });
    } catch (e) {
        console.error('removeLine error:', e);
    }
}


// ── EDIT LINE ─────────────────────────────────────────────────────────────────

export async function updateLine(uniqueValue, title, brand, volume, price, rating, bar) {
    try {
        const lines   = await loadCsvAsStrings();
        const updated = lines.map(line => {
            const fields = line.split(',');
            if (fields[0] === uniqueValue) {
                return [
                    fields[0],  // photo path (key — unchanged)
                    title,
                    brand,
                    volume,
                    price,
                    fields[5],  // latitude  — unchanged
                    fields[6],  // longitude — unchanged
                    fields[7],  // date      — unchanged
                    rating,
                    bar,
                ].join(',');
            }
            return line;
        });

        await Filesystem.writeFile({
            path: CSV_FILE, directory: DIR, encoding: Encoding.UTF8,
            data: updated.join('\n') + '\n',
        });
    } catch (e) {
        console.error('updateLine error:', e);
    }
}
// backupManager.js
// Handles exporting the full data set (csv/ + pics/) to a .zip and importing
// a previously exported .zip back onto the device, replacing all data.

import { Filesystem, Directory } from '@capacitor/filesystem';
import JSZip                      from 'jszip';

const DIR       = Directory.External;
const CSV_NAMES = ['data.csv', 'json.json', 'alcodex.json'];
const ZIP_PATH  = 'csv/beerreal_backup.zip';


// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// Returns: 'shared' | 'cancelled' | 'saved_only'
// ─────────────────────────────────────────────────────────────────────────────

export async function exportBackup() {
    const zip = new JSZip();

    // ── Pack text files from csv/ ─────────────────────────────────────────────
    for (const name of CSV_NAMES) {
        try {
            const result = await Filesystem.readFile({
                path:      `csv/${name}`,
                directory: DIR,
                encoding:  'utf8',
            });
            const text = typeof result.data === 'string'
                ? result.data
                : await result.data.text();
            zip.file(`csv/${name}`, text);
        } catch { /* file may not exist yet */ }
    }

    // ── Pack binary image files from pics/ ────────────────────────────────────
    try {
        const { files } = await Filesystem.readdir({ path: 'pics', directory: DIR });
        for (const entry of files) {
            const name = entry.name ?? entry;
            if (!name) continue;
            try {
                const result = await Filesystem.readFile({
                    path:      `pics/${name}`,
                    directory: DIR,
                });
                const b64 = typeof result.data === 'string'
                    ? result.data
                    : await result.data.text();
                zip.file(`pics/${name}`, b64, { base64: true });
            } catch { /* skip unreadable files */ }
        }
    } catch { /* pics/ may not exist */ }

    // ── Generate zip ──────────────────────────────────────────────────────────
    const blob = await zip.generateAsync({
        type:               'blob',
        compression:        'DEFLATE',
        compressionOptions: { level: 6 },
    });

    // ── Always write to disk first as a reliable fallback ─────────────────────
    const base64 = await _blobToBase64(blob);
    await Filesystem.writeFile({
        path:      ZIP_PATH,
        data:      base64,
        directory: DIR,
        recursive: true,
    });

    // ── Try Web Share API (works if gesture context is still alive) ───────────
    const zipFile = new File([blob], 'beerreal_backup.zip', { type: 'application/zip' });
    if (navigator.share) {
        try {
            await navigator.share({ files: [zipFile], title: 'BeerReal Backup' });
            return 'shared';
        } catch (e) {
            if (e.name === 'AbortError') return 'cancelled';
            // Fall through to @capacitor/share
        }
    }

    // ── Try @capacitor/share with the saved file URI ──────────────────────────
    try {
        const { uri }  = await Filesystem.getUri({ path: ZIP_PATH, directory: DIR });
        const { Share } = await import('@capacitor/share');
        await Share.share({
            url:         uri,
            title:       'BeerReal Backup',
            dialogTitle: 'Save your BeerReal backup',
        });
        return 'shared';
    } catch {
        // Share sheet unavailable — file is saved on disk, caller will inform user
        return 'saved_only';
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// IMPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function importBackup(file) {
    const buffer = await file.arrayBuffer();
    const zip    = await JSZip.loadAsync(buffer);

    await _clearDir('csv');
    await _clearDir('pics');

    const writes = [];
    zip.forEach((relativePath, entry) => {
        if (entry.dir) return;
        writes.push(_writeEntry(relativePath, entry));
    });
    await Promise.all(writes);

    location.reload();
}


// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function _writeEntry(path, zipEntry) {
    if (path.startsWith('csv/')) {
        const text = await zipEntry.async('string');
        await Filesystem.writeFile({
            path, data: text, directory: DIR, recursive: true, encoding: 'utf8',
        });
    } else {
        const b64 = await zipEntry.async('base64');
        await Filesystem.writeFile({
            path, data: b64, directory: DIR, recursive: true,
        });
    }
}

async function _clearDir(dirPath) {
    try {
        const { files } = await Filesystem.readdir({ path: dirPath, directory: DIR });
        await Promise.all(
            files.map(entry => {
                const name = entry.name ?? entry;
                return Filesystem.deleteFile({
                    path: `${dirPath}/${name}`, directory: DIR,
                }).catch(() => {});
            })
        );
    } catch { /* directory may not exist */ }
}

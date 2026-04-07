import { exportBackup, importBackup } from './backupManager.js';
import { t } from '../../../assets/strings/strings.js';



// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export async function triggerExport(btn) {
    const original = btn.textContent;
    btn.disabled    = true;
    btn.textContent = '…';
    try {
        const result = await exportBackup();
        if (result === 'shared') {
            _showToast('✓ Backup exported');
        } else if (result === 'saved_only') {
            _showToast('Saved to Android/data/…/files/csv/ — open with a file manager');
        }
        // 'cancelled' → user dismissed share sheet, no toast needed
    } catch (e) {
        console.error('Export failed:', e);
        _showToast('Export failed: ' + (e?.message ?? e));
    } finally {
        btn.disabled    = false;
        btn.textContent = original;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// IMPORT DIALOG
// ─────────────────────────────────────────────────────────────────────────────

export function openImportDialog() {
    const existing = document.getElementById('br-import-dialog');
    if (existing) existing.remove();

    // ── Wrapper ───────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.id = 'br-import-dialog';
    wrapper.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
    `;

    // ── Backdrop ──────────────────────────────────────────────────────────────
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.65); backdrop-filter: blur(3px);
    `;

    // ── Box ───────────────────────────────────────────────────────────────────
    const box = document.createElement('div');
    box.style.cssText = `
        position: relative;
        background: #1e1e1e;
        border-radius: 16px;
        padding: 24px 20px 20px;
        width: min(360px, 100%);
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    `;

    box.innerHTML = `
        <p style="margin:0 0 8px; font-size:17px; font-weight:700; color:#fff; text-align:center;">
            ${t.import_title}
        </p>
        <p style="margin:0 0 20px; font-size:13px; color:rgba(255,255,255,0.45); line-height:1.5;">
            ${t.import_body}
        </p>
        <div style="display:flex; gap:10px;">
            <button id="br-import-cancel" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:rgba(255,255,255,0.08); color:#fff;
                font-size:15px; cursor:pointer;">
                Cancel
            </button>
            <label id="br-import-confirm" style="
                flex:1; padding:12px; border-radius:10px; border:none;
                background:#EFAB27; color:#000; font-size:15px;
                font-weight:700; cursor:pointer;
                display:flex; align-items:center; justify-content:center;">
                Choose file…
                <input id="br-import-input" type="file" accept=".zip"
                       style="display:none;">
            </label>
        </div>
    `;

    wrapper.appendChild(backdrop);
    wrapper.appendChild(box);
    document.body.appendChild(wrapper);

    // ── Animate in ────────────────────────────────────────────────────────────
    box.style.opacity   = '0';
    box.style.transform = 'scale(0.95)';
    box.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        box.style.opacity   = '1';
        box.style.transform = 'scale(1)';
    }));

    // ── Close helper ──────────────────────────────────────────────────────────
    function dismiss() {
        box.style.opacity   = '0';
        box.style.transform = 'scale(0.95)';
        setTimeout(() => wrapper.remove(), 180);
    }

    backdrop.addEventListener('click', dismiss);
    box.querySelector('#br-import-cancel').addEventListener('click', dismiss);

    // ── File chosen ───────────────────────────────────────────────────────────
    const fileInput = box.querySelector('#br-import-input');
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        dismiss();

        // Small delay to let the dialog animate out before the heavy work starts
        setTimeout(async () => {
            _showToast('Importing…');
            try {
                await importBackup(file);
                // importBackup calls location.reload() on success
            } catch (e) {
                console.error('Import failed:', e);
                _showToast('Import failed — check the file and try again');
            }
        }, 200);
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────

function _showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.82); color: #fff;
        padding: 10px 20px; border-radius: 20px; font-size: 13px;
        z-index: 10000; pointer-events: none; white-space: nowrap;
        opacity: 0; transition: opacity 0.2s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.opacity = '1');
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3000);
}

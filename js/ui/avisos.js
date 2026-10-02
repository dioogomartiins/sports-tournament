import { fmtTimestamp } from '../utils.js';
import { dom } from './dom.js';

// ---------------------------------------------------------------------------
// Toasts e indicadores de estado de gravação
// ---------------------------------------------------------------------------
let flashSavedTimer = null;

export function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = `toast${type === 'error' ? ' toast-error' : type === 'ok' ? ' toast-ok' : ''}`;
  t.textContent = msg;
  dom.toastRoot.appendChild(t);
  requestAnimationFrame(() => { t.classList.add('show'); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.remove(); }, 300);
  }, 3200);
}

export function flashSaved() {
  dom.savePill.textContent = 'Guardado ✓';
  dom.savePill.classList.remove('pill-error');
  dom.savePill.classList.add('pill-ok');
  clearTimeout(flashSavedTimer);
  flashSavedTimer = setTimeout(() => {
    dom.savePill.textContent = 'Guardado';
    dom.savePill.classList.remove('pill-ok');
  }, 1600);
}

export function flashError() {
  dom.savePill.textContent = 'Erro';
  dom.savePill.classList.add('pill-error');
}

export function flashBackup(isoTimestamp) {
  dom.backupPill.textContent = `💾 Backup ${fmtTimestamp(isoTimestamp)}`;
  dom.backupPill.classList.add('pill-fresh');
}

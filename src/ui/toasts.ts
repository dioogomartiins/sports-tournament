import { fmtTimestamp } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Toasts and save status pills
// ---------------------------------------------------------------------------
let flashSavedTimer: number | undefined;

export type ToastType = 'ok' | 'error';

export function showToast(msg: string, type?: ToastType): void {
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

export function flashSaved(): void {
  dom.savePill.textContent = en.common.savedCheck;
  dom.savePill.classList.remove('pill-error');
  dom.savePill.classList.add('pill-ok');
  clearTimeout(flashSavedTimer);
  flashSavedTimer = window.setTimeout(() => {
    dom.savePill.textContent = en.common.saved;
    dom.savePill.classList.remove('pill-ok');
  }, 1600);
}

export function flashError(): void {
  dom.savePill.textContent = en.common.error;
  dom.savePill.classList.add('pill-error');
}

export function flashBackup(isoTimestamp?: string): void {
  if (!isoTimestamp) return;
  dom.backupPill.textContent = `💾 ${en.common.backup} ${fmtTimestamp(isoTimestamp)}`;
  dom.backupPill.classList.add('pill-fresh');
}

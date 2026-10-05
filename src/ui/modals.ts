import { html, render } from 'lit';
import type { TemplateResult } from 'lit';
import { state } from '../state.js';
import { getTeamName } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// The app dialog (#modalOverlay): confirmations, pickers and editors
// ---------------------------------------------------------------------------
// One dialog for the whole app: a title, a body drawn with a Lit template and
// two buttons. The confirm button runs the dialog's callback; the bodies that
// need input (the delete word, the pair picker) enable it with
// setConfirmEnabled().

/** Dialog body: a Lit template, or plain text. */
export type DialogContent = TemplateResult | string;

/** Colour of a dialog button. */
export type ButtonTone = 'danger' | 'gold' | 'pitch' | 'paper' | 'green';

export interface DialogButton {
  label: string;
  tone: ButtonTone;
}

export interface DialogOptions {
  title: string;
  body: DialogContent;
  /** The right-hand button; null hides it (an information dialog). */
  confirm: DialogButton | null;
  /** The left-hand button, which closes the dialog. */
  cancel?: DialogButton;
  onConfirm?: (() => void) | null;
}

const TONES: Record<ButtonTone, { background: string; color: string }> = {
  danger: { background: 'var(--danger)', color: '#fff' },
  gold: { background: 'var(--gold)', color: '#000' },
  pitch: { background: 'var(--pitch-500)', color: '#fff' },
  green: { background: 'var(--pitch-600)', color: '#fff' },
  paper: { background: 'var(--paper)', color: 'var(--ink)' },
};

const CANCEL: DialogButton = { label: en.common.cancel, tone: 'paper' };

let confirmCallback: (() => void) | null = null;

function styleButton(btn: HTMLElement, b: DialogButton): void {
  btn.textContent = b.label;
  btn.style.background = TONES[b.tone].background;
  btn.style.color = TONES[b.tone].color;
  btn.hidden = false;
  btn.style.display = '';
}

/** Opens the dialog; the body's first field (or the confirm button) gets the focus. */
export function openDialog(o: DialogOptions): void {
  dom.modalTitle.textContent = o.title;
  render(o.body, dom.modalBody);
  confirmCallback = o.onConfirm ?? null;
  styleButton(dom.modalCancel, o.cancel ?? CANCEL);
  const confirm = dom.modalConfirm as HTMLButtonElement;
  if (o.confirm) styleButton(confirm, o.confirm);
  else {
    confirm.hidden = true;
    confirm.style.display = 'none';
  }
  setConfirmEnabled(true);
  dom.modalOverlay.hidden = false;
  const first = dom.modalBody.querySelector<HTMLElement>('input, select');
  (first || (o.confirm ? confirm : dom.modalCancel)).focus();
}

/** Enables the confirm button (bodies that need a valid input first). */
export function setConfirmEnabled(enabled: boolean): void {
  const confirm = dom.modalConfirm as HTMLButtonElement;
  confirm.disabled = !enabled;
  confirm.style.opacity = enabled ? '' : '0.4';
  confirm.style.cursor = enabled ? '' : 'not-allowed';
}

export function closeConfirm(): void {
  dom.modalOverlay.hidden = true;
  confirmCallback = null;
  setConfirmEnabled(true);
}

/** The confirm button: closes the dialog, then runs its callback. */
export function runConfirm(): void {
  const cb = confirmCallback;
  if ((dom.modalConfirm as HTMLButtonElement).disabled) return;
  closeConfirm();
  if (cb) cb();
}

/** A yes/no question; the confirm button is red. */
export function openConfirm(title: string, body: DialogContent, onConfirm: () => void | Promise<void>): void {
  openDialog({ title, body, confirm: { label: en.common.confirm, tone: 'danger' }, onConfirm: () => { onConfirm(); } });
}

/**
 * Opens a danger confirmation that needs the delete word typed. Who may
 * delete is decided by the Firebase rules (admins only); the word only guards
 * against accidental taps.
 * @param itemLabels - what is being deleted, one per line
 */
export function openDangerConfirm(title: string, itemLabels: string[], onConfirm: () => void | Promise<void>): void {
  const word = en.modals.deleteWord;
  const onInput = (e: Event) => {
    const inp = e.target as HTMLInputElement;
    const ok = inp.value.trim() === word;
    setConfirmEnabled(ok);
    if (ok) inp.classList.remove('danger-confirm-input--error');
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const inp = e.target as HTMLInputElement;
    if (inp.value.trim() === word) {
      runConfirm();
    } else {
      inp.classList.add('danger-confirm-input--error');
      setTimeout(() => inp.classList.remove('danger-confirm-input--error'), 500);
    }
  };
  openDialog({
    title,
    body: html`
      <p style="margin-bottom:6px;">${en.modals.permanentlyDelete}</p>
      <ul class="danger-confirm-summary">${itemLabels.map((l) => html`<li>${l}</li>`)}</ul>
      <label style="font-size:13px;font-weight:600;color:var(--ink-soft);">${en.modals.toConfirmType(word)}</label>
      <input type="text" class="danger-confirm-input" autocomplete="off" spellcheck="false" placeholder=${word}
        @input=${onInput} @keydown=${onKeydown}>`,
    confirm: { label: en.modals.confirmDelete, tone: 'danger' },
    onConfirm: () => { onConfirm(); },
  });
  setConfirmEnabled(false);
}

/** A player in a pick list. */
export interface PickPlayer {
  id: string;
  label: string;
}

/** A column of player buttons; picking one closes the dialog. */
function playerButtons(players: PickPlayer[], empty: string, onSelect: (pid: string) => void): TemplateResult {
  if (!players.length) return html`<p class="empty" style="margin-bottom:14px;">${empty}</p>`;
  return html`${players.map((p) => html`
    <button class="btn btn-ghost scorer-btn" @click=${() => { closeConfirm(); onSelect(p.id); }}>${p.label}</button>`)}`;
}

/**
 * Modal to pick a player (assist, MVP).
 * @param noneLabel - the confirm button, for "none" (returns '')
 * @param onSelect - receives the chosen id, or ''
 */
export function openPickPlayerModal(title: string, players: PickPlayer[], noneLabel: string, onSelect: (pid: string) => void): void {
  openDialog({
    title,
    body: playerButtons(players, en.modals.noPlayersAvailable, onSelect),
    confirm: { label: noneLabel, tone: 'pitch' },
    onConfirm: () => onSelect(''),
  });
}

/** Squad players of a tournament team, in openPickPlayerModal format. */
export function squadPickList(teamIdx: number | string, excludeId?: string): PickPlayer[] {
  if (typeof teamIdx !== 'number' && !/^\d+$/.test(String(teamIdx))) return [];
  return (state.squads?.[Number(teamIdx)] || [])
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, label: `${p.num} - ${p.name}` }));
}

/** Who scored for one side; "Own goal" returns 'auto'. */
export function openScorerModal(gi: string | number, side: 'home' | 'away', onSelect: (pid: string) => void): void {
  const game = state.schedule[Number(gi)];
  if (!game) return;
  const teamIdx = side === 'home' ? game.home : game.away;
  openDialog({
    title: en.modals.goalForTeam(getTeamName(teamIdx)),
    body: playerButtons(squadPickList(teamIdx), en.modals.noPlayersInTeam, onSelect),
    cancel: { label: en.modals.cancelButton, tone: 'danger' },
    confirm: { label: en.modals.ownGoalButton, tone: 'pitch' },
    onConfirm: () => onSelect('auto'),
  });
}

import { state } from '../state.js';
import { getTeamName, escapeHtml } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Modal — general (confirmations and scorer)
// ---------------------------------------------------------------------------
export var confirmCallback = null;

/** For modals defined in other modules (an import cannot be reassigned). */
export function setConfirmCallback(fn) {
  confirmCallback = fn;
}

export function openConfirm(title, body, onConfirm) {
  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML = body;
  confirmCallback = onConfirm;

  dom.modalCancel.innerHTML = en.common.cancel;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = en.common.confirm;
  dom.modalConfirm.style.background = 'var(--danger)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  dom.modalOverlay.hidden = false;
  dom.modalConfirm.focus();
}

export function closeConfirm() {
  dom.modalOverlay.hidden = true;
  confirmCallback = null;
  // Reset danger-confirm button state
  dom.modalConfirm.disabled = false;
  dom.modalConfirm.style.opacity = '';
  dom.modalConfirm.style.cursor = '';
}

/**
 * Opens a danger-confirm modal that requires typing the confirmation word.
 * Who may delete is decided by the Firebase rules (admins only); the word
 * only guards against accidental taps.
 * @param {string} title
 * @param {string[]} itemLabels — list of human-readable items being deleted
 * @param {Function} onConfirm — called only when the word matches
 */
export function openDangerConfirm(title, itemLabels, onConfirm) {
  const secret = en.modals.deleteWord;

  dom.modalTitle.textContent = title;

  // Build body: summary list + password input
  const listHtml = itemLabels.map(l => `<li>${escapeHtml(l)}</li>`).join('');
  dom.modalBody.innerHTML =
    `<p style="margin-bottom:6px;">${escapeHtml(en.modals.permanentlyDelete)}</p>` +
    `<ul class="danger-confirm-summary">${listHtml}</ul>` +
    `<label style="font-size:13px;font-weight:600;color:var(--ink-soft);">${escapeHtml(en.modals.toConfirmType(secret))}</label>` +
    `<input type="text" class="danger-confirm-input" id="dangerConfirmInput" autocomplete="off" spellcheck="false" placeholder="${secret}">`;

  dom.modalCancel.innerHTML = en.common.cancel;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = escapeHtml(en.modals.confirmDelete);
  dom.modalConfirm.style.background = 'var(--danger)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';
  dom.modalConfirm.disabled = true;
  dom.modalConfirm.style.opacity = '0.4';
  dom.modalConfirm.style.cursor = 'not-allowed';

  dom.modalOverlay.hidden = false;

  const inp = document.getElementById('dangerConfirmInput');
  if (inp) {
    inp.focus();
    inp.addEventListener('input', () => {
      const match = inp.value.trim() === secret;
      dom.modalConfirm.disabled = !match;
      dom.modalConfirm.style.opacity = match ? '1' : '0.4';
      dom.modalConfirm.style.cursor = match ? 'pointer' : 'not-allowed';
      if (match) {
        inp.classList.remove('danger-confirm-input--error');
      }
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !dom.modalConfirm.disabled) {
        const cb = confirmCallback;
        closeConfirm();
        if (cb) cb();
      } else if (e.key === 'Enter') {
        inp.classList.add('danger-confirm-input--error');
        setTimeout(() => inp.classList.remove('danger-confirm-input--error'), 500);
      }
    });
  }

  confirmCallback = () => {
    // Reset button styles
    dom.modalConfirm.disabled = false;
    dom.modalConfirm.style.opacity = '';
    dom.modalConfirm.style.cursor = '';
    onConfirm();
  };
}

/**
 * Modal to pick a player (assist, MVP).
 * @param {string} title
 * @param {{id:string, label:string}[]} players
 * @param {string} noneLabel — button for "none" (returns '')
 * @param {Function} onSelect — receives selected id or ''
 */
export function openPickPlayerModal(title, players, noneLabel, onSelect) {
  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML = players.length
    ? players.map((p) =>
      `<button class="btn btn-ghost scorer-btn" data-pid="${escapeHtml(p.id)}">${escapeHtml(p.label)}</button>`
    ).join('')
    : `<p class="empty" style="margin-bottom:14px;">${escapeHtml(en.modals.noPlayersAvailable)}</p>`;

  dom.modalCancel.innerHTML = en.common.cancel;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = noneLabel;
  dom.modalConfirm.style.background = 'var(--pitch-500)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  confirmCallback = () => {
    dom.modalOverlay.hidden = true;
    onSelect('');
  };

  dom.modalOverlay.hidden = false;

  Array.from(dom.modalBody.querySelectorAll('.scorer-btn')).forEach((b) => {
    b.onclick = () => {
      dom.modalOverlay.hidden = true;
      onSelect(b.dataset.pid);
    };
  });
}

/** Squad players of a tournament team, in openPickPlayerModal format. */
export function squadPickList(teamIdx, excludeId) {
  if (typeof teamIdx !== 'number' && !/^\d+$/.test(String(teamIdx))) return [];
  return (state.squads[teamIdx] || [])
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, label: `${p.num} - ${p.name}` }));
}

export function openScorerModal(gi, side, onSelect) {
  const game = state.schedule[gi];
  const teamIdx = side === 'home' ? game.home : game.away;
  const teamName = getTeamName(teamIdx);
  const players = (state.squads && state.squads[teamIdx]) ? state.squads[teamIdx] : [];

  dom.modalTitle.textContent = en.modals.goalForTeam(teamName);

  dom.modalBody.innerHTML = players.length
    ? players.map((p) =>
      `<button class="btn btn-ghost scorer-btn" data-pid="${escapeHtml(p.id)}">${escapeHtml(p.num)} - ${escapeHtml(p.name)}</button>`
    ).join('')
    : `<p class="empty" style="margin-bottom:14px;">${escapeHtml(en.modals.noPlayersInTeam)}</p>`;

  dom.modalCancel.innerHTML = escapeHtml(en.modals.cancelButton);
  dom.modalCancel.style.background = 'var(--danger)';
  dom.modalCancel.style.color = '#fff';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = escapeHtml(en.modals.ownGoalButton);
  dom.modalConfirm.style.background = 'var(--pitch-500)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  confirmCallback = () => {
    dom.modalOverlay.hidden = true;
    onSelect('auto');
  };

  dom.modalOverlay.hidden = false;

  Array.from(dom.modalBody.querySelectorAll('.scorer-btn')).forEach((b) => {
    b.onclick = () => {
      dom.modalOverlay.hidden = true;
      onSelect(b.dataset.pid);
    };
  });
}

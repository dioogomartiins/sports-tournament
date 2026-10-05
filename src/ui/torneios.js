import { escapeHtml, fmtDate } from '../utils.js';
import { getSport } from '../sports/registry.js';
import { dom } from './dom.js';
import { html } from 'lit';
import { openDialog } from './modals.js';
import { en } from '../i18n/en.js';

/**
 * Renders active tournaments list in the Dashboard.
 *
 * @param {Array} tournaments - List of all tournaments (with meta)
 * @param {string} currentId - ID of currently selected tournament
 * @param {Function} onSelect - Callback when selecting a tournament
 * @param {Function} onFinish - Callback when finishing a tournament
 */
export function renderTournamentsList(tournaments, currentId, onSelect, onFinish) {
  if (!dom.listaTorneiosAtivos) return;

  const active = (tournaments || []).filter((t) => t.status === 'active');

  if (!active.length) {
    dom.listaTorneiosAtivos.innerHTML = `
      <p class="empty" style="margin: 8px 0;">${escapeHtml(en.dashboard.noActiveTournaments)}</p>
    `;
    return;
  }

  dom.listaTorneiosAtivos.innerHTML = active.map((t) => {
    const isCurrent = t.id === currentId;
    const sport = getSport(t.sport);
    const isKnown = t.sport && (t.sport === 'football' || t.sport === 'futebol' || sport.id === t.sport);
    const label = isKnown ? (sport.name || 'Football') : (t.sport ? t.sport.charAt(0).toUpperCase() + t.sport.slice(1) : 'Football');
    const icon = isKnown ? (sport.icon || '🏆') : (t.sport === 'padel' ? '🎾' : '🏆');
    const sportLabel = `${icon} ${label}`;
    const dateStr = t.createdAt ? fmtDate(t.createdAt) : en.dashboard.dateUnavailable;

    return `
      <div class="torneio-card ${isCurrent ? 'active' : ''}" data-tid="${escapeHtml(t.id)}">
        <div class="torneio-card-top">
          <div>
            <div class="torneio-card-title">${escapeHtml(t.name || en.tournaments.defaultNewName)}</div>
            <div class="torneio-badges" style="margin-top:6px;">
              <span class="sport-badge">${escapeHtml(sportLabel)}</span>
              <span class="status-badge-active">🟢 ${escapeHtml(en.dashboard.activeBadge)}</span>
              ${isCurrent ? `<span class="current-badge">✓ ${escapeHtml(en.dashboard.viewingNow)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="torneio-card-meta">
          <span>${escapeHtml(en.dashboard.createdOn(dateStr))}</span>
        </div>
        <div class="torneio-card-actions">
          ${!isCurrent ? `<button class="btn btn-sm btn-ghost btn-trocar-torneio" data-tid="${escapeHtml(t.id)}">👁️ ${escapeHtml(en.dashboard.viewTournament)}</button>` : ''}
          ${isCurrent ? `<button class="btn btn-sm btn-danger btn-terminar-torneio" data-requires="admin" data-tid="${escapeHtml(t.id)}">🏁 ${escapeHtml(en.dashboard.finishTournament)}</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Event listeners for switching tournament
  dom.listaTorneiosAtivos.querySelectorAll('.torneio-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      // If finish button was clicked, don't change selection
      if (e?.target?.closest?.('.btn-terminar-torneio')) return;
      const tid = card.dataset.tid;
      if (tid && tid !== currentId && onSelect) {
        onSelect(tid);
      }
    });
  });

  // Event listeners for finish button
  dom.listaTorneiosAtivos.querySelectorAll('.btn-terminar-torneio').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tid = btn.dataset.tid;
      if (tid && onFinish) {
        onFinish(tid);
      }
    });
  });
}

/**
 * Updates header title and sport badge with current tournament.
 */
export function renderHeaderTournament(meta) {
  if (dom.tournamentTitle) {
    dom.tournamentTitle.textContent = meta?.name || 'Football Tournament';
  }
  if (dom.headerSportBadge) {
    const sport = getSport(meta?.sport);
    const isKnown = meta?.sport && (meta.sport === 'football' || meta.sport === 'futebol' || sport.id === meta.sport);
    const label = isKnown ? (sport.name || 'Football') : (meta?.sport ? meta.sport.charAt(0).toUpperCase() + meta.sport.slice(1) : 'Football');
    const icon = isKnown ? (sport.icon || '🏆') : (meta?.sport === 'padel' ? '🎾' : '🏆');
    dom.headerSportBadge.textContent = `${icon} ${label}`;
  }
  // Settings that only apply to one sport
  if (typeof document === 'undefined') return;
  const sportId = getSport(meta?.sport).id;
  document.body.dataset.sport = sportId;
  document.querySelectorAll('[data-sport-only]').forEach((el) => {
    el.hidden = el.dataset.sportOnly !== sportId;
  });
}

/**
 * Opens the new tournament dialog.
 * @param {(t: { name: string, sport: string, numEquipas: number }) => Promise<void>} onCreate
 * @param {{ id: string, label: string }[]} sports - sports the user may create
 */
export function openNovoTorneioModal(onCreate, sports) {
  const value = (id) => dom.modalBody.querySelector(`#${id}`)?.value;
  openDialog({
    title: en.tournaments.modalTitle,
    body: html`
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="field">
          <label for="novoTorneioNome">${en.tournaments.nameLabel}</label>
          <input type="text" id="novoTorneioNome" class="input" placeholder=${en.tournaments.namePlaceholder} maxlength="60" required>
        </div>
        <div class="field">
          <label for="novoTorneioSport">${en.tournaments.sportLabel}</label>
          <select id="novoTorneioSport" class="input">${sports.map((s) => html`<option value=${s.id}>${s.label}</option>`)}</select>
        </div>
        <div class="field">
          <label for="novoTorneioEquipas">${en.tournaments.numTeamsLabel}</label>
          <input type="number" id="novoTorneioEquipas" class="input" min="2" max="32" value="8">
        </div>
      </div>`,
    confirm: { label: en.tournaments.createButton, tone: 'gold' },
    onConfirm: () => {
      const name = (value('novoTorneioNome') || '').trim() || en.tournaments.defaultNewName;
      const sport = value('novoTorneioSport') || 'football';
      const numEquipas = Number(value('novoTorneioEquipas')) || 8;
      onCreate({ name, sport, numEquipas });
    },
  });
}

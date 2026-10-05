import { state, MAX_TEAMS } from '../state.js';
import { getTeamName, escapeHtml, safeColor } from '../utils.js';
import { getPlayerRating, getTeamTotalRating } from '../algorithms.js';
import { dom, isAdminView } from './dom.js';
import { en } from '../i18n/en.js';
import { getSport } from '../sports/registry.js';
import { setConfirmCallback } from './modais.js';

// ---------------------------------------------------------------------------
// Render — Teams
// ---------------------------------------------------------------------------
export function renderTeams() {
  const html = [];
  const ro = isAdminView() ? '' : ' disabled';
  for (let i = 0; i < MAX_TEAMS; i++) {
    const active = i < state.scheduleTeamCount;
    const t = state.teams[i] || { name: '', color: '#2F7A4F' };
    const groupTag = (active && state.config.numGrupos > 1 && t.group !== undefined)
      ? `<span class="team-tag" style="background:var(--pitch-800); color:#fff; border:none; margin-left: 8px;">${en.teams.groupBadge(String.fromCharCode(65 + t.group))}</span>`
      : '';

    html.push(
      `<div class="team-row${active ? '' : ' team-row-inactive'}">` +
      `<span class="team-num">${i + 1}</span>` +
      `<input type="color" class="team-color-picker team-prop" data-prop="color" data-idx="${i}" value="${safeColor(t.color)}" title="${en.teams.teamColorTitle}"${ro}>` +
      `<input type="text" class="input team-prop" data-prop="name" data-idx="${i}" value="${escapeHtml(t.name)}" placeholder="${en.teams.teamPlaceholder(i + 1)}"${ro}>` +
      groupTag +
      (active ? '' : `<span class="team-tag">${en.teams.outsideSchedule}</span>`) +
      '</div>'
    );
  }

  dom.teamsList.innerHTML = html.join('');

  Array.from(dom.teamsList.querySelectorAll('.team-prop')).forEach((inp) => {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });
}

// ---------------------------------------------------------------------------
// Render — Squads
// ---------------------------------------------------------------------------
export function renderSquadsDropdown() {
  const sel = dom.squadTeamSelect.value;
  const html = [];
  for (let i = 0; i < state.scheduleTeamCount; i++) {
    html.push(`<option value="${i}">${escapeHtml(getTeamName(i))}</option>`);
  }
  dom.squadTeamSelect.innerHTML = html.join('');

  if (sel && dom.squadTeamSelect.querySelector(`option[value="${sel}"]`)) {
    dom.squadTeamSelect.value = sel;
  }

  renderSquadList();
}

export function renderSquadList() {
  const tIdx = dom.squadTeamSelect.value;
  if (!tIdx) {
    dom.squadList.innerHTML = `<p class="empty">${en.squads.noTeamSelected}</p>`;
    return;
  }

  const squad = state.squads[tIdx] || [];
  if (!squad.length) {
    dom.squadList.innerHTML = `<p class="empty" style="padding-top:20px;">${isAdminView() ? en.squads.noPlayersAdmin : en.squads.noPlayersReadonly}</p>`;
    return;
  }

  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const numbered = getSport(currentSport).usesJerseyNumbers;
  const sortedSquad = squad.slice().sort((a, b) => (numbered ? a.num - b.num : a.name.localeCompare(b.name)));
  const html = sortedSquad.map((p) => {
    const dbPlayer = state.players.find((pl) => pl.id === p.id);
    const ratingStr = dbPlayer ? ` <span style="font-size:12px; color:var(--gold-dark); font-weight:700;">&#9733; ${getPlayerRating(dbPlayer, currentSport).toFixed(1)}</span>` : '';
    return (
      `<div class="player-row">` +
      `<div class="player-info">${numbered ? `<span class="player-num">${escapeHtml(p.num)}</span>` : ''}<span style="font-weight:600;">${escapeHtml(p.name)}</span>${ratingStr}</div>` +
      `<div style="display:flex; gap:6px;">` +
      `<button class="btn btn-ghost player-stats-btn" data-idx="${tIdx}" data-pid="${escapeHtml(p.id)}" style="color:var(--pitch-800); background:var(--paper); border:1px solid var(--line); padding:4px 8px; font-size:12px;">📊 ${en.common.stats}</button>` +
      `<button class="player-del" data-requires="admin" data-idx="${tIdx}" data-pid="${escapeHtml(p.id)}" title="${en.squads.removePlayerTitle}">&times;</button>` +
      `</div></div>`
    );
  }).join('');

  const squadPlayersObj = squad.map(p => state.players.find(pl => pl.id === p.id)).filter(Boolean);
  const totalRating = getTeamTotalRating(squadPlayersObj, currentSport);
  const media = squadPlayersObj.length > 0 ? (totalRating / squadPlayersObj.length) : 0;

  const ratingHeaderHtml =
    `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; margin-bottom:12px; padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm);">` +
    `<span style="font-size:13px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">${en.squads.playersCount(squad.length)}</span>` +
    `<span style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);" title="${en.squads.avgRatingTitle}">${en.squads.avgRating(media.toFixed(1))}</span>` +
    `</div>`;

  dom.squadList.innerHTML = ratingHeaderHtml + `<div>${html}</div>`;
}

/**
 * Populates the squad player-from-DB dropdown with all players not yet in this squad.
 */
export function renderSquadPlayerFromDBDropdown() {
  if (!dom.squadPlayerFromDB) return;
  const tIdx = dom.squadTeamSelect ? dom.squadTeamSelect.value : null;
  const currentSquad = tIdx ? (state.squads[tIdx] || []) : [];
  const currentIds = new Set(currentSquad.map((p) => p.id));

  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const opts = [`<option value="">${en.squads.selectPlayerPlaceholder}</option>`];
  const sorted = state.players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  sorted.forEach((pl) => {
    if (!currentIds.has(pl.id)) {
      opts.push(`<option value="${escapeHtml(pl.id)}">${escapeHtml(pl.nome)} (★ ${getPlayerRating(pl, currentSport).toFixed(1)})</option>`);
    }
  });
  dom.squadPlayerFromDB.innerHTML = opts.join('');
}

/**
 * Asks which players to draw into pairs (two per team, balanced by rating).
 * @param {(ids: string[]) => void} onDraw - receives the chosen player ids.
 */
export function openDrawPairsModal(onDraw) {
  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const needed = state.scheduleTeamCount * 2;
  const sorted = state.players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const rows = sorted.map((p) =>
    `<label class="draft-player-row">` +
    `<input type="checkbox" class="draft-checkbox" data-pid="${escapeHtml(p.id)}">` +
    `<span class="draft-player-nome">${escapeHtml(p.nome)}</span>` +
    `<span class="draft-player-rating">★ ${getPlayerRating(p, currentSport).toFixed(1)}</span>` +
    `</label>`
  ).join('');

  dom.modalTitle.textContent = en.squads.drawPairsTitle;
  dom.modalBody.innerHTML =
    `<p class="field-note" style="margin-bottom:10px;">${escapeHtml(en.squads.drawPairsNote(needed))}</p>` +
    `<p class="draft-selected-count" id="drawPairsCount">${escapeHtml(en.squads.drawPairsCount(0, needed))}</p>` +
    (rows || `<p class="empty">${en.players.noPlayersAdmin}</p>`);

  const boxes = Array.from(dom.modalBody.querySelectorAll('.draft-checkbox'));
  const chosen = () => boxes.filter((b) => b.checked).map((b) => b.dataset.pid);
  const refresh = () => {
    const n = chosen().length;
    document.getElementById('drawPairsCount').textContent = en.squads.drawPairsCount(n, needed);
    dom.modalConfirm.disabled = n !== needed;
    dom.modalConfirm.style.opacity = n === needed ? '' : '0.5';
  };
  boxes.forEach((b) => b.addEventListener('change', refresh));

  dom.modalCancel.innerHTML = en.common.cancel;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;
  dom.modalConfirm.innerHTML = en.squads.drawPairsButton;
  dom.modalConfirm.style.background = 'var(--gold)';
  dom.modalConfirm.style.color = '#000';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';
  refresh();

  setConfirmCallback(() => onDraw(chosen()));
  dom.modalOverlay.hidden = false;
}

import { state, MAX_TEAMS } from '../state.js';
import { getTeamName, escapeHtml, safeColor } from '../utils.js';
import { getPlayerRating, getTeamTotalRating } from '../algorithms.js';
import { dom, isAdminView } from './dom.js';

// ---------------------------------------------------------------------------
// Render — equipas
// ---------------------------------------------------------------------------
export function renderTeams() {
  const html = [];
  const ro = isAdminView() ? '' : ' disabled';
  for (let i = 0; i < MAX_TEAMS; i++) {
    const active = i < state.scheduleTeamCount;
    const t = state.teams[i] || { name: '', color: '#2F7A4F' };
    const groupTag = (active && state.config.numGrupos > 1 && t.group !== undefined)
      ? `<span class="team-tag" style="background:var(--pitch-800); color:#fff; border:none; margin-left: 8px;">Grupo ${String.fromCharCode(65 + t.group)}</span>`
      : '';

    html.push(
      `<div class="team-row${active ? '' : ' team-row-inactive'}">` +
      `<span class="team-num">${i + 1}</span>` +
      `<input type="color" class="team-color-picker team-prop" data-prop="color" data-idx="${i}" value="${safeColor(t.color)}" title="Cor da Equipa"${ro}>` +
      `<input type="text" class="input team-prop" data-prop="name" data-idx="${i}" value="${escapeHtml(t.name)}" placeholder="Equipa ${i + 1}"${ro}>` +
      groupTag +
      (active ? '' : '<span class="team-tag">fora do calendário atual</span>') +
      '</div>'
    );
  }

  dom.teamsList.innerHTML = html.join('');

  // A gravação é ligada no main.js (delegação em dom.teamsList)
  Array.from(dom.teamsList.querySelectorAll('.team-prop')).forEach((inp) => {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });
}

// ---------------------------------------------------------------------------
// Render — plantéis
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
    dom.squadList.innerHTML = '<p class="empty">Nenhuma equipa selecionada.</p>';
    return;
  }

  const squad = state.squads[tIdx] || [];
  if (!squad.length) {
    dom.squadList.innerHTML = `<p class="empty" style="padding-top:20px;">${isAdminView() ? 'Sem jogadores. Adiciona usando o dropdown acima!' : 'Sem jogadores neste plantel.'}</p>`;
    return;
  }

  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const sortedSquad = squad.slice().sort((a, b) => a.num - b.num);
  const html = sortedSquad.map((p) => {
    // Procura o jogador na BD global para mostrar o rating
    const dbPlayer = state.players.find((pl) => pl.id === p.id);
    const ratingStr = dbPlayer ? ` <span style="font-size:12px; color:var(--gold-dark); font-weight:700;">&#9733; ${getPlayerRating(dbPlayer, currentSport).toFixed(1)}</span>` : '';
    return (
      `<div class="player-row">` +
      `<div class="player-info"><span class="player-num">${escapeHtml(p.num)}</span><span style="font-weight:600;">${escapeHtml(p.name)}</span>${ratingStr}</div>` +
      `<div style="display:flex; gap:6px;">` +
      `<button class="btn btn-ghost player-stats-btn" data-idx="${tIdx}" data-pid="${escapeHtml(p.id)}" style="color:var(--pitch-800); background:var(--paper); border:1px solid var(--line); padding:4px 8px; font-size:12px;">📊 Ficha</button>` +
      `<button class="player-del" data-requires="admin" data-idx="${tIdx}" data-pid="${escapeHtml(p.id)}" title="Remover jogador">&times;</button>` +
      `</div></div>`
    );
  }).join('');

  const squadPlayersObj = squad.map(p => state.players.find(pl => pl.id === p.id)).filter(Boolean);
  const totalRating = getTeamTotalRating(squadPlayersObj, currentSport);
  const media = squadPlayersObj.length > 0 ? (totalRating / squadPlayersObj.length) : 0;

  const ratingHeaderHtml =
    `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; margin-bottom:12px; padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm);">` +
    `<span style="font-size:13px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">Jogadores (${squad.length})</span>` +
    `<span style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);" title="Rating Médio (calculado a partir da Base de Dados)">Média ★ ${media.toFixed(1)}</span>` +
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

  const opts = ['<option value="">-- Escolher jogador --</option>'];
  const sorted = state.players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  sorted.forEach((pl) => {
    if (!currentIds.has(pl.id)) {
      opts.push(`<option value="${escapeHtml(pl.id)}">${escapeHtml(pl.nome)} (★ ${getPlayerRating(pl).toFixed(1)})</option>`);
    }
  });
  dom.squadPlayerFromDB.innerHTML = opts.join('');
}

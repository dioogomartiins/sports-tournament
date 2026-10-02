import { state, MAX_TEAMS, normalizePlayer, persistPlayers, persistConfigTeams, persistJogosSingulares, persistArquivo } from './state.js';
import { getTeamName, getTeamDisplay, escapeHtml, fmtTimestamp, clamp, safeColor } from './utils.js';
import { computeStandings, GAME_STATUS, getPlayerRating, getTeamTotalRating, tallyPlayerStats, mergePlayerStats, archiveTally, gameGoals, standingsOrder, rankMoves } from './algorithms.js';
import { onStatusBtnClick, onScoreBtnClick, onResultCommit, onTeamPropChange, onSquadListClick } from './main.js';
import { ROLES, isKnownRole, roleLabel } from './permissions.js';

// ---------------------------------------------------------------------------
// Estado local do módulo UI (não exportado — privado)
// ---------------------------------------------------------------------------
export var confirmCallback = null;
let flashSavedTimer = null;

// ---------------------------------------------------------------------------
// Cache de elementos DOM
// ---------------------------------------------------------------------------
export const dom = {};

export function cacheDom() {
  [
    'tournamentTitle', 'savePill', 'backupPill', 'marqueeTicker',
    'btnGerarCalendario', 'btnNovoTorneio', 'btnAtualizar', 'btnDarkMode', 'btnExportar', 'btnImportar', 'inputImportar',
    'btnMobileMenu', 'tabs',
    'btnAdicionarVolta', 'btnGerarEliminatorias', 'calendarActions',
    'dashboardPodium', 'dashboardStandings', 'dashboardStats', 'dashboardScorers',
    'cfgNome', 'cfgNumEquipas', 'cfgNumGrupos', 'cfgNumVoltas', 'cfgVitoria', 'cfgEmpate', 'cfgDerrota', 'cfgBonus', 'cfgGoleada', 'scheduleHint',
    'cfgMataMata', 'cfgNumPlayoffTeams',
    'teamsList', 'squadTeamSelect', 'squadPlayerNum', 'squadPlayerFromDB', 'btnAddPlayerFromDB', 'squadList',
    'calendarList', 'resultsList', 'standingsWrapper', 'statsGrid',
    'modalOverlay', 'modalTitle', 'modalBody', 'modalCancel', 'modalConfirm', 'toastRoot',
    'btnNewPlayer', 'playerSearchInput', 'playersList',
    'draftNomeA', 'draftNomeB', 'draftPlayerList', 'btnFazerDraft', 'draftResultCard', 'draftTeamsResult',
    'draftLabelA', 'draftLabelB', 'draftScoreA', 'draftScoreB', 'btnGuardarJogo',
    'singularHistoricoList',
    'btnConta', 'usersList', 'logList',
    'historicoSempre', 'arquivoList', 'btnArquivar', 'btnPartilharTabela',
  ].forEach((id) => { dom[id] = document.getElementById(id); });

  dom.panels = Array.from(document.querySelectorAll('.panel'));
}

// ---------------------------------------------------------------------------
// Render de topo — redesenha toda a UI
// ---------------------------------------------------------------------------
export function renderAll() {
  populateConfigForm();
  renderTeams();
  renderSquadsDropdown();
  renderCalendar();
  renderResults();
  refreshComputed();
  renderPlayersList();
  renderSquadPlayerFromDBDropdown();
  renderDraftPlayerList();
  renderSingularHistorico();
  renderHistorico();
}

export function refreshComputed() {
  const summary = computeStatsSummary();
  renderStandingsWrapper(summary.groupsData);
  renderStatsGrid(summary);
  renderDashboard(summary);
  updateTicker(summary);
  renderScheduleHint();

  // Esconde "Adicionar Volta Extra" quando o torneio usa grupos (apenas Liga Única suportada)
  if (dom.btnAdicionarVolta) {
    const isLeague = (state.config.numGrupos || 1) === 1;
    dom.btnAdicionarVolta.style.display = isLeague ? '' : 'none';
  }

  if (state.config.mataMata && dom.btnGerarEliminatorias) {
    let leagueTotal = 0;
    let leaguePlayed = 0;
    let hasPlayoffs = false;

    state.schedule.forEach((g, gi) => {
      if (g.isPlayoff) { hasPlayoffs = true; return; }
      leagueTotal++;
      const res = state.results[gi];
      if (res && typeof res === 'object' && res.status === GAME_STATUS.TERMINADO) leaguePlayed++;
    });

    const leagueFinished = leagueTotal > 0 && leagueTotal === leaguePlayed;
    dom.btnGerarEliminatorias.style.display = (leagueFinished && !hasPlayoffs) ? 'inline-flex' : 'none';
  }
}


// ---------------------------------------------------------------------------
// Formulário de configuração
// ---------------------------------------------------------------------------
export function populateConfigForm() {
  dom.cfgNome.value = state.config.nome;
  dom.cfgNumEquipas.value = state.config.numEquipas;
  dom.cfgNumGrupos.value = state.config.numGrupos || 1;
  dom.cfgNumVoltas.value = state.config.numVoltas;
  dom.cfgVitoria.value = state.config.pontosVitoria;
  dom.cfgEmpate.value = state.config.pontosEmpate;
  dom.cfgDerrota.value = state.config.pontosDerrota;
  dom.cfgBonus.value = state.config.bonusGoleada;
  dom.cfgGoleada.value = state.config.golosGoleada;
  dom.cfgMataMata.checked = state.config.mataMata || false;
  dom.cfgNumPlayoffTeams.value = state.config.numPlayoffTeams || 4;
}

export function renderScheduleHint() {
  const confN = clamp(parseInt(dom.cfgNumEquipas.value, 10) || state.config.numEquipas, 2, 32);
  const confV = clamp(parseInt(dom.cfgNumVoltas.value, 10) || state.config.numVoltas, 1, 20);
  let live = `Calendário atual: <strong>${escapeHtml(state.scheduleTeamCount)} equipas / ${escapeHtml(state.scheduleVoltas)} volta(s)</strong> · ${state.schedule.length} jogos.`;

  if (confN !== state.scheduleTeamCount || confV !== state.scheduleVoltas) {
    live += ` Configurado agora: ${confN} equipas / ${confV} volta(s) — clica em 🔄 Gerar Calendário para aplicar.`;
  }

  dom.scheduleHint.innerHTML = live;
}

// ---------------------------------------------------------------------------
// Render — equipas
// ---------------------------------------------------------------------------
/** O perfil atual é admin? (o mesmo que o CSS usa para esconder controlos) */
function isAdminView() {
  return document.body.dataset.role === 'admin';
}

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

  Array.from(dom.teamsList.querySelectorAll('.team-prop')).forEach((inp) => {
    inp.addEventListener('blur', onTeamPropChange);
    inp.addEventListener('change', (e) => { if (e.target.type === 'color') onTeamPropChange(e); });
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

  const sortedSquad = squad.slice().sort((a, b) => a.num - b.num);
  const html = sortedSquad.map((p) => {
    // Procura o jogador na BD global para mostrar o rating
    const dbPlayer = state.players.find((pl) => pl.id === p.id);
    const ratingStr = dbPlayer ? ` <span style="font-size:12px; color:var(--gold-dark); font-weight:700;">&#9733; ${getPlayerRating(dbPlayer).toFixed(1)}</span>` : '';
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
  const totalRating = getTeamTotalRating(squadPlayersObj);
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

// ---------------------------------------------------------------------------
// Render — calendário
// ---------------------------------------------------------------------------
export function getStatusBadge(status, gi) {
  const labels = {
    [GAME_STATUS.AGENDADO]: '📅 Agendado',
    [GAME_STATUS.DECORRER]: '⏳ A Decorrer',
    [GAME_STATUS.TERMINADO]: '✅ Terminado',
  };
  // O estado vem do Firebase: só aceitar valores conhecidos (vai para um atributo)
  const safe = Object.prototype.hasOwnProperty.call(labels, status) ? status : GAME_STATUS.AGENDADO;
  return `<button class="status-badge status-${safe}" data-gi="${escapeHtml(gi)}" title="Clique para mudar estado">${labels[safe]}</button>`;
}

export function renderCalendar() {
  const hasSchedule = state.schedule.length > 0;
  dom.calendarActions.style.display = hasSchedule ? 'block' : 'none';

  if (!hasSchedule) {
    dom.calendarList.innerHTML = '<p class="empty">Ainda não há calendário. Vai a Configuração e clica em 🔄 Gerar Calendário.</p>';
    return;
  }

  const byRound = {};
  state.schedule.forEach((g, gi) => {
    if (!byRound[g.jornada]) byRound[g.jornada] = [];
    byRound[g.jornada].push({ g, gi });
  });

  const byeMap = {};
  state.roundsMeta.forEach((r) => {
    if (r.bye !== null && r.bye !== undefined) byeMap[r.jornada] = r.bye;
  });

  const parts = [];
  state.roundsMeta.forEach((rm) => {
    const j = rm.jornada;
    const games = byRound[j] || [];
    parts.push(`<div class="round-card"><div class="round-head">Jornada ${escapeHtml(j)}</div><div class="round-games">`);

    games.forEach(({ g, gi }) => {
      const val = state.results[gi];
      const status = val && val.status ? val.status : GAME_STATUS.AGENDADO;
      parts.push(
        `<div class="fixture fixture-open" data-game="${gi}" title="Ver o jogo"><span class="fx-home">${getTeamDisplay(g.home)}</span>` +
        `<span class="fx-vs">${getStatusBadge(status, gi)} VS</span>` +
        `<span class="fx-away">${getTeamDisplay(g.away)}</span></div>`
      );
    });

    if (byeMap[j] !== undefined) {
      parts.push(`<div class="fixture fixture-bye">💤 ${getTeamDisplay(byeMap[j])} — folga esta jornada</div>`);
    }

    parts.push('</div></div>');
  });

  dom.calendarList.innerHTML = parts.join('');

  Array.from(dom.calendarList.querySelectorAll('.status-badge')).forEach((btn) => {
    btn.addEventListener('click', onStatusBtnClick);
  });

  Array.from(dom.calendarList.querySelectorAll('.fixture-open')).forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.status-badge')) return;
      openGameModal(row.dataset.game);
    });
  });
}

// ---------------------------------------------------------------------------
// Render — resultados
// ---------------------------------------------------------------------------
export function renderResults() {
  if (!state.schedule.length) {
    dom.resultsList.innerHTML = '<p class="empty">Sem jogos agendados.</p>';
    return;
  }

  const byRound = {};
  state.schedule.forEach((g, gi) => {
    if (!byRound[g.jornada]) byRound[g.jornada] = [];
    byRound[g.jornada].push({ g, gi });
  });

  const parts = [];

  state.roundsMeta.forEach((rm) => {
    const j = rm.jornada;
    const games = byRound[j] || [];
    if (!games.length) return;

    parts.push(`<div class="round-card"><div class="round-head">Jornada ${escapeHtml(j)}</div><div class="round-games">`);

    games.forEach(({ g, gi }) => {
      const val = state.results[gi];
      let vHome = '', vAway = '';
      let pHome = '', pAway = '';
      let status = GAME_STATUS.AGENDADO;

      if (val) {
        status = val.status || GAME_STATUS.AGENDADO;
        const scoreStr = typeof val === 'object' ? val.score : String(val);
        const m = /^(\d+)-(\d+)$/.exec(scoreStr);
        if (m) { vHome = m[1]; vAway = m[2]; }

        if (val.penalties) {
          const mp = /^(\d+)-(\d+)$/.exec(val.penalties);
          if (mp) { pHome = mp[1]; pAway = mp[2]; }
        }
      }

      const isTie = vHome !== '' && vAway !== '' && vHome === vAway;
      const isTerminado = status === GAME_STATUS.TERMINADO;
      const isPlayoff = g.isPlayoff;

      let penaltiesHtml = '';
      if (isTerminado && isTie && isPlayoff) {
        penaltiesHtml =
          `<div class="penalties-split">` +
          `<span class="pen-label">Penáltis</span>` +
          `<input type="number" class="input pen-box" data-gi="${gi}" data-side="home" value="${escapeHtml(pHome)}" min="0" max="99" inputmode="numeric">` +
          `<span class="res-sep">-</span>` +
          `<input type="number" class="input pen-box" data-gi="${gi}" data-side="away" value="${escapeHtml(pAway)}" min="0" max="99" inputmode="numeric">` +
          `</div>`;
      }

      parts.push(
        `<div class="fixture fixture-input" data-game="${gi}">` +
        `<span class="fx-home">${getTeamDisplay(g.home)}</span>` +
        `<div class="result-split">` +
        `<button class="score-btn" data-gi="${gi}" data-side="home" data-action="sub">-</button>` +
        `<input type="number" class="input res-box" data-gi="${gi}" data-side="home" value="${escapeHtml(vHome)}" min="0" max="99" inputmode="numeric">` +
        `<button class="score-btn" data-gi="${gi}" data-side="home" data-action="add">+</button>` +
        `<span class="res-sep">-</span>` +
        `<button class="score-btn" data-gi="${gi}" data-side="away" data-action="sub">-</button>` +
        `<input type="number" class="input res-box" data-gi="${gi}" data-side="away" value="${escapeHtml(vAway)}" min="0" max="99" inputmode="numeric">` +
        `<button class="score-btn" data-gi="${gi}" data-side="away" data-action="add">+</button>` +
        `</div>` +
        `<span class="fx-away">${getTeamDisplay(g.away)}</span>` +
        penaltiesHtml +
        `<div class="fixture-actions">${getStatusBadge(status, gi)}` +
        `<button class="mini-btn game-open-btn" data-gi="${gi}" title="Ver golos, assistências e MVP">📋 Jogo</button>` +
        `</div>` +
        `</div>`
      );
    });

    parts.push('</div></div>');
  });

  dom.resultsList.innerHTML = parts.join('');

  Array.from(dom.resultsList.querySelectorAll('.game-open-btn')).forEach((btn) => {
    btn.addEventListener('click', () => openGameModal(btn.dataset.gi));
  });

  Array.from(dom.resultsList.querySelectorAll('.res-box, .pen-box')).forEach((inp) => {
    inp.addEventListener('blur', onResultCommit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });

  Array.from(dom.resultsList.querySelectorAll('.score-btn')).forEach((btn) => {
    btn.addEventListener('click', onScoreBtnClick);
  });

  Array.from(dom.resultsList.querySelectorAll('.status-badge')).forEach((btn) => {
    btn.addEventListener('click', onStatusBtnClick);
  });

  refreshGameModal();
}

// ---------------------------------------------------------------------------
// Render — classificação
// ---------------------------------------------------------------------------

/** Posição vertical de cada linha da tabela (por equipa), antes de redesenhar. */
function rowPositions(container) {
  const pos = new Map();
  container.querySelectorAll('tr[data-team]').forEach((r) => {
    const top = r.getBoundingClientRect().top;
    if (top) pos.set(r.dataset.team, top);
  });
  return pos;
}

/** Faz as equipas que mudaram de lugar deslizar da posição antiga para a nova. */
function slideRows(container, before, duration = 450) {
  if (!before.size || prefersReducedMotion()) return;
  container.querySelectorAll('tr[data-team]').forEach((r) => {
    const old = before.get(r.dataset.team);
    const now = r.getBoundingClientRect().top;
    if (old === undefined || !now || Math.abs(old - now) < 1 || !r.animate) return;
    r.animate(
      [{ transform: `translateY(${old - now}px)`, background: 'rgba(203,161,53,.22)' }, { transform: 'none' }],
      { duration, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
  });
}

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
/** Seta com os lugares ganhos (verde) ou perdidos (vermelho). */
function moveBadge(team) {
  const n = standingsMoves.get(String(team));
  if (!n) return '';
  const up = n > 0;
  const label = `${up ? 'Subiu' : 'Desceu'} ${Math.abs(n)} ${Math.abs(n) === 1 ? 'lugar' : 'lugares'}`;
  return `<span class="pos-move ${up ? 'up' : 'down'}" title="${label}" aria-label="${label}">${up ? '▲' : '▼'}${Math.abs(n)}</span>`;
}

function standingsHtml(groupsData) {
  if (!groupsData || !groupsData.length || !groupsData[0].standings.length) {
    return '<table class="standings-table"><tr><td colspan="10" class="empty">Sem equipas configuradas.</td></tr></table>';
  }

  const html = groupsData.map((group) => {
    const rows = group.standings.map((s, i) => {
      const cls = i === 0 ? 'pos-gold' : i === 1 ? 'pos-silver' : i === 2 ? 'pos-bronze' : '';
      const dgTxt = (s.DG > 0 ? '+' : '') + s.DG;
      return (
        `<tr class="${cls}" data-team="${escapeHtml(s.idx)}">` +
        `<td class="pos-cell"><span class="pos-badge">${i + 1}</span>${moveBadge(s.idx)}</td>` +
        `<td class="team-cell">${getTeamDisplay(s.idx)}</td>` +
        `<td class="num pts-cell">${s.Pts}</td>` +
        `<td class="num">${s.J}</td><td class="num">${s.V}</td><td class="num">${s.E}</td><td class="num">${s.D}</td>` +
        `<td class="num">${s.GM}</td><td class="num">${s.GS}</td><td class="num">${dgTxt}</td>` +
        `</tr>`
      );
    });

    const titleHtml = groupsData.length > 1
      ? `<h3 style="margin-top:20px; margin-bottom:10px; color:var(--pitch-800); font-weight:600;">${group.name}</h3>`
      : '';

    return (
      titleHtml +
      `<table class="standings-table">` +
      `<thead><tr>` +
      `<th>Pos</th><th class="team-cell">Equipa</th><th>Pts</th>` +
      `<th>J</th><th>V</th><th>E</th><th>D</th><th>GM</th><th>GS</th><th>DG</th>` +
      `</tr></thead>` +
      `<tbody>${rows.join('')}</tbody>` +
      `</table>`
    );
  });
  return html.join('');
}

// A classificação é atualizada mesmo escondida. Para se ver quem subiu ou
// desceu, guarda-se a tabela tal como foi vista da última vez e, ao voltar ao
// separador, mostra-se essa versão por um instante antes de animar para a atual.
// As setas mostram os lugares ganhos/perdidos face a essa versão e ficam até
// a ordem voltar a mudar.
let seenStandingsHtml = null;
let seenStandingsOrder = null;
let standingsMoves = new Map();
let lastGroupsData = null;
let standingsReplayTimer = null;
const STANDINGS_HOLD = 600; // ms com a classificação anterior à vista

/** Atualiza as setas quando a ordem mudou desde a última vez que foi vista. */
function noteStandingsSeen(groupsData) {
  const order = standingsOrder(groupsData);
  const moves = rankMoves(seenStandingsOrder, order);
  if (moves.size) standingsMoves = moves;
  seenStandingsOrder = order;
}

export function renderStandingsWrapper(groupsData) {
  lastGroupsData = groupsData;
  clearTimeout(standingsReplayTimer);
  const visible = !!dom.standingsWrapper.offsetParent;
  if (visible) noteStandingsSeen(groupsData);
  const before = rowPositions(dom.standingsWrapper);
  dom.standingsWrapper.innerHTML = standingsHtml(groupsData);
  slideRows(dom.standingsWrapper, before);
  // Só conta como "vista" se a tabela estiver no ecrã
  if (visible) seenStandingsHtml = dom.standingsWrapper.innerHTML;
}

function replayStandings() {
  const wrapper = dom.standingsWrapper;
  if (!wrapper || !lastGroupsData) return;
  clearTimeout(standingsReplayTimer);
  const previous = seenStandingsHtml;
  noteStandingsSeen(lastGroupsData);
  wrapper.innerHTML = standingsHtml(lastGroupsData);
  const current = wrapper.innerHTML;
  seenStandingsHtml = current;
  if (previous === null || previous === current || prefersReducedMotion()) return;
  wrapper.innerHTML = previous;
  standingsReplayTimer = setTimeout(() => {
    const before = rowPositions(wrapper);
    wrapper.innerHTML = current;
    slideRows(wrapper, before, 800);
  }, STANDINGS_HOLD);
}

// ---------------------------------------------------------------------------
// Estatísticas — marcadores
// ---------------------------------------------------------------------------

/**
 * Constrói um índice pId → { name, team } percorrendo os plantéis uma única vez,
 * evitando a busca O(n²) anterior.
 */
export function buildPlayerIndex() {
  const index = {};
  state.players.forEach((p) => {
    const tName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'Sem Equipa';
    index[p.id] = { name: p.nome, team: tName };
  });
  state.squads.forEach((squad, teamIndex) => {
    squad.forEach((player) => {
      index[player.id] = { name: player.name, team: getTeamName(teamIndex) };
    });
  });
  return index;
}

export function computeScorerStats() {
  const playerIndex = buildPlayerIndex();
  const stats = {};

  function addGoal(pId) {
    if (pId === 'auto') return;
    if (!stats[pId]) {
      const info = playerIndex[pId] || { name: 'Jogador Desconhecido', team: 'Sem Equipa' };
      stats[pId] = { name: info.name, team: info.team, count: 0 };
    }
    stats[pId].count++;
  }

  Object.keys(state.results).forEach((gi) => {
    const res = state.results[gi];
    if (!res || typeof res !== 'object' || !res.scorers) return;

    ['home', 'away'].forEach((side) => {
      if (!res.scorers[side]) return;
      res.scorers[side].forEach(addGoal);
    });
  });

  state.jogosSingulares.forEach((jogo) => {
    if (jogo.scorersA) jogo.scorersA.forEach(addGoal);
    if (jogo.scorersB) jogo.scorersB.forEach(addGoal);
  });

  return Object.values(stats).sort((a, b) => b.count - a.count);
}

export function statCardsHtml(summary) {
  const cards = [
    ['Jogos realizados', `${summary.played} / ${summary.total}`],
    ['Jogos em falta', String(summary.pendentes)],
    ['Golos marcados', String(summary.totalGoals)],
    ['Média de golos / jogo', summary.media.toFixed(2)],
    ['🔥 Melhor ataque', summary.bestAtkLabel],
    ['🧱 Melhor defesa', summary.bestDefLabel],
    ['Maior goleada', summary.biggestWinLabel],
    ['Mais vitórias', summary.mostWinsLabel],
    ['Mais empates', summary.mostDrawsLabel],
  ];

  return cards.map(([label, value]) =>
    `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${escapeHtml(value)}</div></div>`
  ).join('');
}

export function renderStatsGrid(summary) {
  const scorers = computeScorerStats().slice(0, 10);
  let html = statCardsHtml(summary);

  const scorerRows = scorers.length
    ? scorers.map((s) =>
      `<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${s.count}</strong> golos — ${escapeHtml(s.name)} <span style="color:var(--ink-faint); font-size:13px;">(${escapeHtml(s.team)})</span></div>`
    ).join('')
    : '<p class="empty">Nenhum golo registado ainda.</p>';

  html += `<div class="card stats-half"><div class="section-title">👟 Tabela de Marcadores</div>${scorerRows}</div>`;

  const tally = tallyPlayerStats(state.results, state.jogosSingulares);
  const index = buildPlayerIndex();
  const topBy = (key, unit) => {
    const rows = Object.keys(tally)
      .filter((pid) => tally[pid][key] > 0)
      .sort((a, b) => tally[b][key] - tally[a][key])
      .slice(0, 10);
    return rows.length
      ? rows.map((pid) => {
        const info = index[pid] || { name: 'Jogador Desconhecido', team: 'Sem Equipa' };
        return `<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${tally[pid][key]}</strong> ${unit} — ${escapeHtml(info.name)} <span style="color:var(--ink-faint); font-size:13px;">(${escapeHtml(info.team)})</span></div>`;
      }).join('')
      : '<p class="empty">Ainda nada registado.</p>';
  };

  html += `<div class="card stats-half"><div class="section-title">🅰️ Assistências</div>${topBy('assistencias', 'assist.')}</div>`;
  html += `<div class="card stats-half"><div class="section-title">⭐ MVP</div>${topBy('mvp', '×')}</div>`;
  dom.statsGrid.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Estatísticas gerais (usadas no dashboard e em gerarEliminatórias)
// ---------------------------------------------------------------------------
export function computeStatsSummary() {
  const teamsArray = state.teams.slice(0, state.scheduleTeamCount);
  const groupsData = computeStandings(teamsArray, state.schedule, state.results, state.config);
  let flatStandings = [];
  groupsData.forEach((g) => { flatStandings = flatStandings.concat(g.standings); });

  const total = state.schedule.length;

  const playedKeys = Object.keys(state.results).filter((k) => {
    const val = state.results[k];
    if (typeof val === 'object' && val.status === GAME_STATUS.AGENDADO) return false;
    const scoreStr = val ? (typeof val === 'object' ? val.score : String(val)) : '';
    return /^\d+-\d+$/.test(scoreStr.trim());
  });

  const played = playedKeys.length;
  const totalGoals = flatStandings.reduce((s, t) => s + t.GM, 0);
  const media = played > 0 ? totalGoals / played : 0;
  const withGames = flatStandings.filter((s) => s.J > 0);

  function pick(arr, better) {
    if (!arr.length) return null;
    return arr.reduce((a, b) => (better(b, a) ? b : a));
  }

  const bestAtk = pick(withGames, (b, a) => b.GM > a.GM);
  const bestDef = pick(withGames, (b, a) => b.GS < a.GS);
  const mostWins = pick(withGames, (b, a) => b.V > a.V);
  const mostDraws = pick(withGames, (b, a) => b.E > a.E);

  let biggestWin = null;
  state.schedule.forEach((g, gi) => {
    const resObj = state.results[gi];
    if (!resObj) return;
    if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;
    const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
    const m = /^(\d+)-(\d+)$/.exec(resStr.trim());
    if (!m) return;
    const diff = Math.abs(+m[1] - +m[2]);
    if (!biggestWin || diff > biggestWin.diff) {
      biggestWin = { diff, text: `${getTeamName(g.home)} ${resStr} ${getTeamName(g.away)}` };
    }
  });

  const roundPlayed = {};
  state.schedule.forEach((g, gi) => {
    if (!roundPlayed[g.jornada]) roundPlayed[g.jornada] = { played: 0, total: 0 };
    roundPlayed[g.jornada].total++;
    const val = state.results[gi];
    if (val && typeof val === 'object' && val.status !== GAME_STATUS.AGENDADO) roundPlayed[g.jornada].played++;
    else if (typeof val === 'string' && val.trim() !== '') roundPlayed[g.jornada].played++;
  });

  let currentRound = state.roundsMeta.length ? state.roundsMeta[state.roundsMeta.length - 1].jornada : 0;
  for (const rm of state.roundsMeta) {
    const rp = roundPlayed[rm.jornada] || { played: 0, total: 0 };
    if (rp.played < rp.total) { currentRound = rm.jornada; break; }
  }

  return {
    groupsData,
    flatStandings,
    total,
    played,
    pendentes: total - played,
    totalGoals,
    media,
    bestAtkLabel: bestAtk ? `${bestAtk.name} — ${bestAtk.GM} golos` : '—',
    bestDefLabel: bestDef ? `${bestDef.name} — ${bestDef.GS} sofridos` : '—',
    mostWinsLabel: mostWins ? `${mostWins.name} — ${mostWins.V} vitórias` : '—',
    mostDrawsLabel: mostDraws ? `${mostDraws.name} — ${mostDraws.E} empates` : '—',
    biggestWinLabel: biggestWin ? `${biggestWin.text}  (dif. ${biggestWin.diff})` : '—',
    totalRounds: state.roundsMeta.length,
    currentRound,
  };
}

// ---------------------------------------------------------------------------
// Render — dashboard
// ---------------------------------------------------------------------------
export function renderDashboard(summary) {
  dom.tournamentTitle.textContent = (state.config.nome || 'Torneio').toUpperCase();

  const sortedAll = summary.flatStandings.slice().sort((a, b) =>
    (b.Pts - a.Pts) || (b.DG - a.DG) || (b.GM - a.GM)
  );
  const top3 = sortedAll.slice(0, 3);

  dom.dashboardPodium.innerHTML = top3.length
    ? top3.map((s, i) =>
      `<div class="podium-card podium-${i + 1}">` +
      `<div class="podium-rank">${i + 1}º LUGAR</div>` +
      `<div class="podium-name">${escapeHtml(s.name)}</div>` +
      `<div class="podium-pts">${s.Pts} pts · ${s.J} jogos</div>` +
      `</div>`
    ).join('')
    : '<p class="empty">Sem equipas configuradas.</p>';

  const rest = sortedAll.slice(3, 8);
  dom.dashboardStandings.innerHTML = rest.length
    ? `<table class="mini-table"><thead><tr><th>Pos</th><th style="text-align:left;">Equipa</th><th>J</th><th>Pts</th></tr></thead><tbody>` +
    rest.map((s, i) =>
      `<tr><td class="num">${i + 4}</td><td style="text-align:left;">${getTeamDisplay(s.idx)}</td><td class="num">${s.J}</td><td class="num">${s.Pts}</td></tr>`
    ).join('') +
    `</tbody></table>`
    : '';

  dom.dashboardStats.innerHTML = statCardsHtml(summary);

  const scorers = computeScorerStats().slice(0, 5);
  const scorerHtml = scorers.length > 0
    ? scorers.map((s, i) =>
      `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">` +
      `<span>${i + 1}. ${escapeHtml(s.name)} <span style="color:var(--ink-faint); font-size:12px;">(${escapeHtml(s.team)})</span></span>` +
      `<span style="font-weight:700;">${s.count} golos</span></div>`
    ).join('')
    : '<p class="empty" style="padding-top:20px;">Nenhum golo registado ainda.</p>';

  document.getElementById('dashboardScorers').innerHTML =
    `<div class="section-title" style="margin-top:20px;">👟 Top Marcadores</div>${scorerHtml}`;
}

export function updateTicker(summary) {
  if (!summary.totalRounds) {
    dom.marqueeTicker.textContent = 'SEM CALENDÁRIO';
    return;
  }
  dom.marqueeTicker.textContent = `JORNADA ${summary.currentRound} / ${summary.totalRounds}   ·   ${summary.played}/${summary.total} JOGOS DISPUTADOS`;
}

// ---------------------------------------------------------------------------
// Modal — geral (confirmações e scorer)
// ---------------------------------------------------------------------------
export function openConfirm(title, body, onConfirm) {
  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML = body;
  confirmCallback = onConfirm;

  dom.modalCancel.innerHTML = 'Cancelar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = 'Confirmar';
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
  const secret = 'APAGAR';

  dom.modalTitle.textContent = title;

  // Build body: summary list + password input
  const listHtml = itemLabels.map(l => `<li>${escapeHtml(l)}</li>`).join('');
  dom.modalBody.innerHTML =
    `<p style="margin-bottom:6px;">Vais apagar permanentemente:</p>` +
    `<ul class="danger-confirm-summary">${listHtml}</ul>` +
    `<label style="font-size:13px;font-weight:600;color:var(--ink-soft);">Para confirmar, escreve ${secret}:</label>` +
    `<input type="text" class="danger-confirm-input" id="dangerConfirmInput" autocomplete="off" spellcheck="false" placeholder="${secret}">`;

  dom.modalCancel.innerHTML = 'Cancelar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = '🔒 Confirmar';
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
 * Modal para escolher um jogador (assistência, MVP).
 * @param {string} title
 * @param {{id:string, label:string}[]} players
 * @param {string} noneLabel — botão para "nenhum" (devolve '')
 * @param {Function} onSelect — recebe o id escolhido ou ''
 */
export function openPickPlayerModal(title, players, noneLabel, onSelect) {
  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML = players.length
    ? players.map((p) =>
      `<button class="btn btn-ghost scorer-btn" data-pid="${escapeHtml(p.id)}">${escapeHtml(p.label)}</button>`
    ).join('')
    : '<p class="empty" style="margin-bottom:14px;">Nenhum jogador disponível.</p>';

  dom.modalCancel.innerHTML = 'Cancelar';
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

/** Jogadores do plantel de uma equipa do torneio, no formato de openPickPlayerModal. */
export function squadPickList(teamIdx, excludeId) {
  if (typeof teamIdx !== 'number' && !/^\d+$/.test(String(teamIdx))) return [];
  return (state.squads[teamIdx] || [])
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, label: `${p.num} - ${p.name}` }));
}

/** Nome de um jogador (base de dados, plantéis ou arquivo). */
export function playerName(pid) {
  const info = buildPlayerIndex()[pid];
  if (info) return info.name;
  for (const e of state.arquivo) {
    const j = e.jogadores.find((x) => x.pid === pid);
    if (j) return j.nome;
  }
  return 'Jogador Desconhecido';
}

export function openScorerModal(gi, side, onSelect) {
  const game = state.schedule[gi];
  const teamIdx = side === 'home' ? game.home : game.away;
  const teamName = getTeamName(teamIdx);
  const players = (state.squads && state.squads[teamIdx]) ? state.squads[teamIdx] : [];

  dom.modalTitle.textContent = `Golo: ${teamName}`;

  dom.modalBody.innerHTML = players.length
    ? players.map((p) =>
      `<button class="btn btn-ghost scorer-btn" data-pid="${escapeHtml(p.id)}">${escapeHtml(p.num)} - ${escapeHtml(p.name)}</button>`
    ).join('')
    : '<p class="empty" style="margin-bottom:14px;">Nenhum jogador registado nesta equipa.</p>';

  dom.modalCancel.innerHTML = '❌ Cancelar';
  dom.modalCancel.style.background = 'var(--danger)';
  dom.modalCancel.style.color = '#fff';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = '✅ Auto-Golo';
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

export function openPlayerProfile(pId, tIdx = null) {
  const dbPlayer = state.players.find((p) => p.id === pId);
  let player = dbPlayer ? { id: dbPlayer.id, name: dbPlayer.nome, num: '?' } : null;
  let teamName = dbPlayer && dbPlayer.teamIdx !== null && dbPlayer.teamIdx !== undefined ? getTeamName(dbPlayer.teamIdx) : 'Sem equipa';

  if (!player && tIdx !== null) {
    const sqPlayer = (state.squads[tIdx] || []).find((p) => p.id === pId);
    if (sqPlayer) {
      player = sqPlayer;
      teamName = getTeamName(tIdx);
    }
  }

  if (tIdx !== null && dbPlayer) {
    const sqPlayer = (state.squads[tIdx] || []).find((p) => p.id === pId);
    if (sqPlayer) { player.num = sqPlayer.num; teamName = getTeamName(tIdx); }
  }

  if (!player) return;

  let attrsHtml = '';
  if (dbPlayer) {
    const rating = getPlayerRating(dbPlayer);
    const ATTR_LABELS = { velocidade: 'Velocidade', finalizacao: 'Finalização', passe: 'Passe', drible: 'Drible', defesa: 'Defesa', fisico: 'Físico' };
    const attrs = Object.entries(ATTR_LABELS).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(dbPlayer.atributos[key]) || 0}</span>` +
      `</div>`
    ).join('');
    attrsHtml =
      `<div style="margin-top: 20px; padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">` +
      `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">` +
      `<div style="font-size:12px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">Atributos Base</div>` +
      `<div style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);">★ ${rating.toFixed(1)}</div>` +
      `</div>` +
      `<div class="player-attrs-mini">${attrs}</div>` +
      `</div>`;
  }

  const totais = computeAllTimeStats()[pId] || { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };

  dom.modalTitle.textContent = 'Ficha de Jogador';
  dom.modalBody.innerHTML =
    `<div style="text-align:center; padding: 10px 0;">` +
    `<div style="font-size:40px; margin-bottom:10px;">👤</div>` +
    `<h2 style="font-size:24px; margin-bottom:4px;">${escapeHtml(player.name)}</h2>` +
    `<div style="color:var(--ink-faint); font-weight:600;">Camisola ${player.num} • ${escapeHtml(teamName)}</div>` +
    `</div>` +
    attrsHtml +
    `<div class="stats-grid" style="margin-top:20px; grid-template-columns: 1fr 1fr;">` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Total de Golos</div><div class="stat-value">${totais.golos}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Assistências</div><div class="stat-value">${totais.assistencias}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">MVP</div><div class="stat-value">${totais.mvp}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Jogos a Marcar</div><div class="stat-value">${totais.jogosAMarcar}</div></div>` +
    `<div class="stat-card" style="grid-column: span 2; text-align:center;"><div class="stat-label">Recorde num só jogo</div><div class="stat-value">${totais.recorde} <span style="font-size:14px; font-weight:normal; color:var(--ink-faint);">golos</span></div></div>` +
    `</div>` +
    `<p style="text-align:center; font-size:12px; color:var(--ink-faint); margin-top:8px;">Inclui torneios arquivados e jogos singulares.</p>`;

  dom.modalCancel.innerHTML = 'Fechar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;
  dom.modalConfirm.hidden = true;
  dom.modalConfirm.style.display = 'none';

  dom.modalOverlay.hidden = false;
  confirmCallback = null;
}

// ---------------------------------------------------------------------------
// Toasts e indicadores de estado de gravação
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Navegação por tabs
// ---------------------------------------------------------------------------
export function switchTab(name) {
  const tabsContainer = document.getElementById('tabs');
  Array.from(document.querySelectorAll('.tab')).forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  dom.panels.forEach((p) => { p.classList.toggle('active', p.id === `tab-${name}`); });
  if (tabsContainer) tabsContainer.classList.remove('menu-open');
  if (name === 'standings') replayStandings();
}

// ---------------------------------------------------------------------------
// Render — Jogadores (Base de Dados)
// ---------------------------------------------------------------------------

const ATTR_LABELS = {
  velocidade: 'Velocidade',
  finalizacao: 'Finalização',
  passe: 'Passe',
  drible: 'Drible',
  defesa: 'Defesa',
  fisico: 'Físico',
};

function playerInitials(nome) {
  return (nome || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function renderPlayersList() {
  if (!dom.playersList) return;

  const search = (dom.playerSearchInput ? dom.playerSearchInput.value.toLowerCase() : '');
  const players = state.players.filter((p) => !search || p.nome.toLowerCase().includes(search));

  if (!players.length) {
    dom.playersList.innerHTML = `<p class="empty">${search ? 'Nenhum jogador encontrado.' : (isAdminView() ? 'Ainda não há jogadores. Clica em "+ Novo Jogador" para começar!' : 'Ainda não há jogadores.')}</p>`;
    return;
  }

  const sorted = players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const cards = sorted.map((p) => {
    const rating = getPlayerRating(p);
    const teamName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'Sem equipa';
    const attrs = Object.entries(ATTR_LABELS).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(p.atributos[key]) || 0}</span>` +
      `</div>`
    ).join('');

    return (
      `<div class="player-db-card">` +
      `<div class="player-db-header">` +
      `<div class="player-avatar">${escapeHtml(playerInitials(p.nome))}</div>` +
      `<div>` +
      `<div class="player-db-name">${escapeHtml(p.nome)}</div>` +
      `<div class="player-db-team">${escapeHtml(teamName)}</div>` +
      `</div>` +
      `<div class="player-db-rating">★ ${rating.toFixed(1)}</div>` +
      `</div>` +
      `<div class="player-attrs-mini">${attrs}</div>` +
      `<div class="player-db-actions">` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-action="view-profile" data-pid="${escapeHtml(p.id)}">📊 Ficha</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-requires="admin" data-action="edit-player" data-pid="${escapeHtml(p.id)}">✏️ Editar</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-requires="admin" data-action="del-player" data-pid="${escapeHtml(p.id)}">🗑️</button>` +
      `</div>` +
      `</div>`
    );
  }).join('');

  dom.playersList.innerHTML = `<div class="player-db-grid">${cards}</div>`;

  dom.playersList.querySelectorAll('[data-action="view-profile"]').forEach((btn) => {
    btn.addEventListener('click', () => openPlayerProfile(btn.dataset.pid));
  });
  dom.playersList.querySelectorAll('[data-action="edit-player"]').forEach((btn) => {
    btn.addEventListener('click', () => openPlayerModal(btn.dataset.pid));
  });
  dom.playersList.querySelectorAll('[data-action="del-player"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.pid;
      const pl = state.players.find((p) => p.id === pid);
      openConfirm('Apagar Jogador', `Tens a certeza que queres apagar <strong>${escapeHtml(pl ? pl.nome : pid)}</strong>? Será removido de todos os plantéis.`, async () => {
        state.players = state.players.filter((p) => p.id !== pid);
        // Remove dos squads também
        state.squads.forEach((squad, i) => {
          state.squads[i] = squad.filter((p) => p.id !== pid);
        });
        await persistPlayers();
        await persistConfigTeams();
        renderPlayersList();
        renderSquadList();
        renderSquadPlayerFromDBDropdown();
        renderDraftPlayerList();
      });
    });
  });
}

/**
 * Opens the player create/edit modal.
 * @param {string|null} pid - Player ID to edit, or null to create new.
 */
export function openPlayerModal(pid = null) {
  const existing = pid ? state.players.find((p) => p.id === pid) : null;
  const title = existing ? 'Editar Jogador' : 'Novo Jogador';

  // Build team options
  const teamOpts = ['<option value="">Sem equipa</option>'];
  for (let i = 0; i < state.scheduleTeamCount; i++) {
    const sel = existing && existing.teamIdx === i ? 'selected' : '';
    teamOpts.push(`<option value="${i}" ${sel}>${escapeHtml(getTeamName(i))}</option>`);
  }

  // Build attr rows
  const currentAttrs = existing ? existing.atributos : { velocidade: 0, finalizacao: 0, passe: 0, drible: 0, defesa: 0, fisico: 0 };
  const attrRows = Object.entries(ATTR_LABELS).map(([key, label]) => {
    const val = currentAttrs[key] || 0;
    const stars = [1, 2, 3, 4, 5].map((n) =>
      `<button type="button" class="star-btn${n <= val ? ' filled' : ''}" data-attr="${key}" data-val="${n}">★</button>`
    ).join('');
    return (
      `<div class="star-row">` +
      `<span class="star-row-label">${label}</span>` +
      `<div class="stars-input" data-attr="${key}">${stars}</div>` +
      `</div>`
    );
  }).join('');

  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML =
    `<div style="margin-bottom:12px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">Nome</label>` +
    `<input type="text" id="playerModalNome" class="input" value="${escapeHtml(existing ? existing.nome : '')}" placeholder="Ex: João Silva" maxlength="60" style="width:100%;">` +
    `</div>` +
    `<div style="margin-bottom:16px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">Equipa</label>` +
    `<select id="playerModalTeam" class="input" style="width:100%;">${teamOpts.join('')}</select>` +
    `</div>` +
    `<div id="playerModalRatingPreview" class="rating-preview">★ 0.0</div>` +
    `<div class="rating-preview-label">Rating Global</div>` +
    `${attrRows}`;

  // Live star interaction
  const currentVals = { ...currentAttrs };

  function updateRatingPreview() {
    const avg = Object.values(currentVals).reduce((s, v) => s + v, 0) / 6;
    const el = document.getElementById('playerModalRatingPreview');
    if (el) el.textContent = `★ ${avg.toFixed(1)}`;
  }

  updateRatingPreview();

  dom.modalBody.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const attr = btn.dataset.attr;
      const val = parseInt(btn.dataset.val, 10);
      // Toggle: click same star = set to 0
      currentVals[attr] = currentVals[attr] === val ? 0 : val;
      // Re-render stars in this row
      const row = dom.modalBody.querySelector(`.stars-input[data-attr="${attr}"]`);
      row.querySelectorAll('.star-btn').forEach((s) => {
        s.classList.toggle('filled', parseInt(s.dataset.val, 10) <= currentVals[attr]);
      });
      updateRatingPreview();
    });
  });

  dom.modalCancel.innerHTML = 'Cancelar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = existing ? '💾 Guardar' : '✅ Criar Jogador';
  dom.modalConfirm.style.background = 'var(--pitch-600)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  confirmCallback = async () => {
    const nome = document.getElementById('playerModalNome').value.trim();
    if (!nome) { showToast('O nome é obrigatório.', 'error'); return; }

    const teamVal = document.getElementById('playerModalTeam').value;
    const teamIdx = teamVal !== '' ? parseInt(teamVal, 10) : null;


    if (existing) {
      const idx = state.players.findIndex((p) => p.id === existing.id);
      if (idx !== -1) {
        state.players[idx] = normalizePlayer({ ...existing, nome, teamIdx, atributos: { ...currentVals } });
        // Update name in all squads
        state.squads.forEach((squad) => {
          const sp = squad.find((p) => p.id === existing.id);
          if (sp) sp.name = nome;
        });
      }
    } else {
      const newPlayer = normalizePlayer({ id: crypto.randomUUID(), nome, teamIdx, atributos: { ...currentVals } });
      state.players.push(newPlayer);
    }

    await persistPlayers();
    renderPlayersList();
    renderSquadPlayerFromDBDropdown();
    renderDraftPlayerList();
    dom.modalOverlay.hidden = true;
    showToast(existing ? 'Jogador atualizado!' : 'Jogador criado!', 'ok');
  };

  dom.modalOverlay.hidden = false;
  document.getElementById('playerModalNome').focus();
}

// ---------------------------------------------------------------------------
// Render — Jogo Singular (Draft + Histórico)
// ---------------------------------------------------------------------------

// Stores current draft state (module-level, not persisted)
export let currentDraft = { equipaA: [], equipaB: [] };

export function renderDraftPlayerList() {
  if (!dom.draftPlayerList) return;

  if (!state.players.length) {
    dom.draftPlayerList.innerHTML = '<p class="empty">Ainda não há jogadores na base de dados. Cria-os primeiro na aba 👤 Jogadores.</p>';
    if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = true;
    return;
  }

  const sorted = state.players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const rows = sorted.map((p) => {
    const rating = getPlayerRating(p);
    const teamName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : '';
    const badge = teamName ? `<span class="draft-player-team-badge">${escapeHtml(teamName)}</span>` : '';
    return (
      `<label class="draft-player-row">` +
      `<input type="checkbox" class="draft-checkbox" data-pid="${escapeHtml(p.id)}">` +
      `<span class="draft-player-nome">${escapeHtml(p.nome)}</span>` +
      `${badge}` +
      `<span class="draft-player-rating">★ ${rating.toFixed(1)}</span>` +
      `</label>`
    );
  }).join('');

  dom.draftPlayerList.innerHTML =
    `<p class="draft-selected-count" id="draftSelectedCount">0 jogadores selecionados</p>` +
    rows;

  // Update counter + enable button
  dom.draftPlayerList.querySelectorAll('.draft-checkbox').forEach((cb) => {
    cb.addEventListener('change', () => {
      const count = dom.draftPlayerList.querySelectorAll('.draft-checkbox:checked').length;
      const el = document.getElementById('draftSelectedCount');
      if (el) el.textContent = `${count} jogador${count !== 1 ? 'es' : ''} selecionado${count !== 1 ? 's' : ''}`;
      if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = count < 2;
    });
  });

  if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = true;
}

export function renderDraftTeams(nomeA, nomeB, equipaA, equipaB) {
  if (!dom.draftTeamsResult) return;

  const ratingA = getTeamTotalRating(equipaA);
  const ratingB = getTeamTotalRating(equipaB);
  const diff = Math.abs(ratingA - ratingB).toFixed(1);

  function teamCard(nome, players, cls) {
    const isTeamA = cls === 'team-a';
    const scorersArr = isTeamA ? (currentDraft.scorersA || []) : (currentDraft.scorersB || []);

    const rows = players.map((p, i) => {
      const gCount = scorersArr.filter(id => id === p.id).length;
      const assistsArr = isTeamA ? (currentDraft.assistsA || []) : (currentDraft.assistsB || []);
      const aCount = assistsArr.filter(id => id === p.id).length;
      return (
        `<div class="draft-team-player-row">` +
        `<span class="draft-pick-num">${i + 1}.</span>` +
        `<span style="flex:1; font-weight:600;">${escapeHtml(p.nome)}${currentDraft.mvp === p.id ? ' ⭐' : ''}${aCount ? ` <span style="font-size:12px; color:var(--ink-faint); font-weight:500;">${aCount} 🅰️</span>` : ''}</span>` +
        `<span style="font-size:12px; color:var(--gold-dark); font-weight:700; margin-right:12px;">★ ${getPlayerRating(p).toFixed(1)}</span>` +
        `<div style="display:flex; align-items:center; gap:8px;">` +
        `<button class="btn btn-ghost" style="padding: 2px 8px; font-size:14px; color:var(--danger); border:1px solid var(--line);" data-action="draft-goal-sub" data-side="${isTeamA ? 'A' : 'B'}" data-pid="${escapeHtml(p.id)}">-</button>` +
        `<span style="font-weight:700; color:var(--pitch-600); min-width:14px; text-align:center;">${gCount}</span>` +
        `<button class="btn btn-ghost" style="padding: 2px 8px; font-size:14px; color:var(--pitch-600); border:1px solid var(--line);" data-action="draft-goal-add" data-side="${isTeamA ? 'A' : 'B'}" data-pid="${escapeHtml(p.id)}">⚽+</button>` +
        `</div>` +
        `</div>`
      );
    }).join('');

    return (
      `<div class="draft-team-card ${cls}">` +
      `<div class="draft-team-name">${escapeHtml(nome)}</div>` +
      `<div class="draft-team-rating-total">Rating total: ${cls === 'team-a' ? ratingA : ratingB}</div>` +
      rows +
      `</div>`
    );
  }

  dom.draftTeamsResult.innerHTML =
    `<div class="draft-teams-grid">` +
    teamCard(nomeA, equipaA, 'team-a') +
    teamCard(nomeB, equipaB, 'team-b') +
    `<div class="draft-balance-bar">Diferença de rating: <span class="draft-balance-diff">${diff} ★</span></div>` +
    `<button class="btn btn-ghost draft-mvp-btn" data-action="draft-mvp">⭐ MVP: ${currentDraft.mvp ? escapeHtml(playerName(currentDraft.mvp)) : 'escolher'}</button>` +
    `</div>`;

  // Golos e assistências do draft: as listas de assistências ficam alinhadas com as de marcadores
  const lists = (side) => {
    const sc = side === 'A' ? 'scorersA' : 'scorersB';
    const as = side === 'A' ? 'assistsA' : 'assistsB';
    if (!currentDraft[sc]) currentDraft[sc] = [];
    if (!currentDraft[as]) currentDraft[as] = [];
    while (currentDraft[as].length < currentDraft[sc].length) currentDraft[as].push('');
    return { scorers: currentDraft[sc], assists: currentDraft[as] };
  };
  const scoreInput = (side) => (side === 'A' ? dom.draftScoreA : dom.draftScoreB);
  const rerender = () => renderDraftTeams(nomeA, nomeB, equipaA, equipaB);

  dom.draftTeamsResult.querySelectorAll('[data-action="draft-goal-add"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const pid = btn.dataset.pid;
      const team = side === 'A' ? equipaA : equipaB;
      const mates = team.filter((p) => p.id !== pid).map((p) => ({ id: p.id, label: p.nome }));
      openPickPlayerModal('Assistência', mates, 'Sem assistência', (aid) => {
        const { scorers, assists } = lists(side);
        scorers.push(pid);
        assists.push(aid);
        const inp = scoreInput(side);
        if (inp) inp.value = (parseInt(inp.value || 0, 10) + 1);
        rerender();
      });
    });
  });

  dom.draftTeamsResult.querySelectorAll('[data-action="draft-goal-sub"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const { scorers, assists } = lists(side);
      const idx = scorers.lastIndexOf(btn.dataset.pid);
      if (idx === -1) return;
      scorers.splice(idx, 1);
      assists.splice(idx, 1);
      const inp = scoreInput(side);
      if (inp) inp.value = Math.max(0, (parseInt(inp.value || 0, 10) - 1));
      rerender();
    });
  });

  const mvpBtn = dom.draftTeamsResult.querySelector('[data-action="draft-mvp"]');
  if (mvpBtn) {
    mvpBtn.addEventListener('click', () => {
      const all = [...equipaA, ...equipaB].map((p) => ({ id: p.id, label: p.nome }));
      openPickPlayerModal('MVP do Jogo', all, 'Sem MVP', (pid) => {
        currentDraft.mvp = pid;
        rerender();
      });
    });
  }

  // Update score labels
  if (dom.draftLabelA) dom.draftLabelA.textContent = nomeA || 'Equipa A';
  if (dom.draftLabelB) dom.draftLabelB.textContent = nomeB || 'Equipa B';

  if (dom.draftResultCard) dom.draftResultCard.style.display = 'block';
}

export function renderSingularHistorico() {
  if (!dom.singularHistoricoList) return;

  if (!state.jogosSingulares.length) {
    dom.singularHistoricoList.innerHTML = '<p class="empty">Ainda não há jogos registados.</p>';
    return;
  }

  const sorted = state.jogosSingulares.slice().reverse();
  const cards = sorted.map((jogo) => {
    const dateStr = fmtTimestamp(jogo.data);
    const playersA = (jogo.equipaA || []).map((pid) => {
      const p = state.players.find((pl) => pl.id === pid);
      return p ? p.nome : pid;
    }).join(', ');
    const playersB = (jogo.equipaB || []).map((pid) => {
      const p = state.players.find((pl) => pl.id === pid);
      return p ? p.nome : pid;
    }).join(', ');

    return (
      `<div class="historico-card">` +
      `<div class="historico-header">` +
      `<span class="historico-date">📅 ${escapeHtml(dateStr)}</span>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-action="del-jogo" data-jid="${escapeHtml(jogo.id)}">🗑️</button>` +
      `</div>` +
      `<div class="historico-teams">` +
      `<div>` +
      `<div class="historico-team-name">${escapeHtml(jogo.nomeEquipaA)}</div>` +
      `<div class="historico-team-players">${escapeHtml(playersA)}</div>` +
      `</div>` +
      `<div class="historico-resultado">${escapeHtml(jogo.resultado || '—')}${jogo.mvp ? `<div class="historico-mvp">⭐ ${escapeHtml(playerName(jogo.mvp))}</div>` : ''}</div>` +
      `<div style="text-align:right;">` +
      `<div class="historico-team-name">${escapeHtml(jogo.nomeEquipaB)}</div>` +
      `<div class="historico-team-players">${escapeHtml(playersB)}</div>` +
      `</div>` +
      `</div>` +
      `</div>`
    );
  }).join('');

  dom.singularHistoricoList.innerHTML = cards;

  dom.singularHistoricoList.querySelectorAll('[data-action="del-jogo"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const jid = btn.dataset.jid;
      openConfirm('Apagar Jogo', 'Tens a certeza que queres apagar este registo do histórico?', async () => {
        state.jogosSingulares = state.jogosSingulares.filter((j) => j.id !== jid);
        await persistJogosSingulares();
        renderSingularHistorico();
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Sessão e administração
// ---------------------------------------------------------------------------

/** Atualiza o botão de conta e o perfil usado pelo CSS para esconder controlos. */
export function renderAuth(user, role) {
  document.body.dataset.role = (user && isKnownRole(role)) ? role : 'viewer';
  if (dom.teamsList) {
    dom.teamsList.querySelectorAll('.team-prop').forEach((inp) => { inp.disabled = !isAdminView(); });
  }
  // Textos de lista vazia dependem do perfil
  if (state.config) { renderSquadList(); renderPlayersList(); }

  if (dom.btnConta) {
    if (user) {
      const nome = (user.displayName || user.email || '').split(' ')[0];
      // No telemóvel só se vê o ícone; o nome e o perfil ficam no title
      dom.btnConta.innerHTML = `👤<span class="auth-label"> ${escapeHtml(nome)} · ${escapeHtml(roleLabel(role))}</span>`;
      dom.btnConta.title = `${nome} · ${roleLabel(role)} — Terminar sessão`;
    } else {
      dom.btnConta.textContent = '🔑 Entrar';
      dom.btnConta.title = 'Entrar com Google';
    }
  }

  // Se o separador atual ficou escondido, volta ao dashboard
  const active = document.querySelector('.tab.active[data-requires]');
  if (active && getComputedStyle(active).display === 'none') switchTab('dashboard');
}

function fmtMillis(ms) {
  return typeof ms === 'number' ? fmtTimestamp(new Date(ms).toISOString()) : '—';
}

/**
 * @param {object[]} users — { uid, nome, email, role, ultimoAcesso }
 * @param {string}   selfUid — o admin atual não pode mudar o próprio perfil
 */
export function renderUsers(users, selfUid) {
  if (!dom.usersList) return;
  if (!users.length) {
    dom.usersList.innerHTML = '<p class="empty">Ainda ninguém entrou.</p>';
    return;
  }
  const order = { admin: 0, user: 1 };
  const sorted = users.slice().sort((a, b) =>
    (order[a.role] ?? 2) - (order[b.role] ?? 2) || String(a.nome || '').localeCompare(String(b.nome || '')));

  dom.usersList.innerHTML = sorted.map((u) => {
    const role = isKnownRole(u.role) ? u.role : '';
    const opt = (val, label) => `<option value="${val}"${role === val ? ' selected' : ''}>${label}</option>`;
    return `<div class="user-row">` +
      `<div class="user-row__info">` +
      `<div class="user-row__name">${escapeHtml(u.nome || 'Sem nome')}</div>` +
      `<div class="user-row__meta">${escapeHtml(u.email || '')} · último acesso ${escapeHtml(fmtMillis(u.ultimoAcesso))}</div>` +
      `</div>` +
      `<select data-uid="${escapeHtml(u.uid)}" data-nome="${escapeHtml(u.nome || '')}"${u.uid === selfUid ? ' disabled title="Não podes mudar o teu próprio perfil"' : ''}>` +
      opt('', 'Pendente') + opt('user', ROLES.user) + opt('admin', ROLES.admin) +
      `</select>` +
      `</div>`;
  }).join('');
}

/** @param {object[]} entries — { nome, acao, quando }, mais recentes primeiro */
export function renderLog(entries) {
  if (!dom.logList) return;
  dom.logList.innerHTML = entries.length
    ? entries.map((e) =>
      `<div class="log-row"><div class="log-row__info">` +
      `<div class="log-row__acao">${escapeHtml(e.acao || '')}</div>` +
      `<div class="log-row__meta">${escapeHtml(e.nome || '')} · ${escapeHtml(fmtMillis(e.quando))}</div>` +
      `</div></div>`
    ).join('')
    : '<p class="empty">Ainda não há alterações registadas.</p>';
}

// ---------------------------------------------------------------------------
// Histórico — torneios arquivados e estatísticas de sempre
// ---------------------------------------------------------------------------

/** Estatísticas de sempre por jogador: arquivo + torneio atual + jogos singulares. */
export function computeAllTimeStats() {
  return mergePlayerStats(
    ...state.arquivo.map(archiveTally),
    tallyPlayerStats(state.results, state.jogosSingulares),
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('pt-PT');
}

function allTimeRows() {
  const index = buildPlayerIndex();
  const archivedNames = {};
  state.arquivo.forEach((e) => e.jogadores.forEach((j) => { archivedNames[j.pid] = j.nome; }));
  const titles = {};
  state.arquivo.forEach((e) => { if (e.campeao) titles[e.campeao.nome] = (titles[e.campeao.nome] || 0) + 1; });

  const totals = computeAllTimeStats();
  const rows = Object.keys(totals)
    .map((pid) => ({ pid, nome: (index[pid] && index[pid].name) || archivedNames[pid] || 'Jogador Desconhecido', ...totals[pid] }))
    .filter((r) => r.golos || r.assistencias || r.mvp)
    .sort((a, b) => (b.golos - a.golos) || (b.assistencias - a.assistencias) || (b.mvp - a.mvp));
  return { rows, titles };
}

export function renderHistorico() {
  if (!dom.historicoSempre || !dom.arquivoList) return;

  const { rows, titles } = allTimeRows();
  const titleList = Object.keys(titles).sort((a, b) => titles[b] - titles[a]);
  const titlesHtml = titleList.length
    ? `<div class="historico-titulos">${titleList.map((n) => `<span class="historico-titulo">🏆 ${escapeHtml(n)} × ${titles[n]}</span>`).join('')}</div>`
    : '';

  dom.historicoSempre.innerHTML = titlesHtml + (rows.length
    ? `<table class="standings-table historico-sempre"><thead><tr>` +
      `<th style="text-align:left;">Jogador</th><th title="Golos">⚽</th><th title="Assistências">🅰️</th><th title="MVP">⭐</th>` +
      `</tr></thead><tbody>` +
      rows.slice(0, 20).map((r) =>
        `<tr><td class="team-cell">${escapeHtml(r.nome)}</td><td class="num">${r.golos}</td><td class="num">${r.assistencias}</td><td class="num">${r.mvp}</td></tr>`
      ).join('') +
      `</tbody></table>`
    : '<p class="empty">Ainda não há golos registados.</p>');

  if (!state.arquivo.length) {
    dom.arquivoList.innerHTML = '<p class="empty">Ainda não há torneios arquivados. Um admin pode arquivar o torneio atual em Gestão → Dados.</p>';
    return;
  }

  dom.arquivoList.innerHTML = state.arquivo.slice().reverse().map((e) => {
    const campeao = e.campeao
      ? `<span class="arquivo-campeao"><span class="arquivo-cor" style="background:${safeColor(e.campeao.cor)}"></span>${escapeHtml(e.campeao.nome)}</span>`
      : '<span class="arquivo-campeao">Sem campeão</span>';
    const tabelas = e.grupos.map((g) =>
      (e.grupos.length > 1 ? `<div class="arquivo-grupo">${escapeHtml(g.nome)}</div>` : '') +
      `<table class="standings-table"><thead><tr><th>Pos</th><th style="text-align:left;">Equipa</th><th>J</th><th>DG</th><th>Pts</th></tr></thead><tbody>` +
      g.tabela.map((t, i) =>
        `<tr><td><span class="pos-badge">${i + 1}</span></td>` +
        `<td class="team-cell"><span class="arquivo-cor" style="background:${safeColor(t.cor)}"></span>${escapeHtml(t.nome)}</td>` +
        `<td class="num">${Number(t.J) || 0}</td><td class="num">${(Number(t.DG) || 0) > 0 ? '+' : ''}${Number(t.DG) || 0}</td><td class="num pts-cell">${Number(t.Pts) || 0}</td></tr>`
      ).join('') +
      `</tbody></table>`
    ).join('');
    const top = e.jogadores.filter((j) => j.golos || j.assistencias || j.mvp).slice(0, 5);
    const topHtml = top.length
      ? `<div class="arquivo-top">${top.map((j) =>
        `<div>${escapeHtml(j.nome)} — ${Number(j.golos) || 0} ⚽ · ${Number(j.assistencias) || 0} 🅰️ · ${Number(j.mvp) || 0} ⭐</div>`).join('')}</div>`
      : '';
    return (
      `<details class="arquivo-card">` +
      `<summary><div class="arquivo-head"><div>` +
      `<div class="arquivo-nome">${escapeHtml(e.nome)}</div>` +
      `<div class="arquivo-meta">${escapeHtml(fmtDate(e.data))} · ${Number(e.jogos) || 0} jogos · ${Number(e.golos) || 0} golos</div>` +
      `</div><span>🏆 ${campeao}</span></div></summary>` +
      tabelas + topHtml +
      `<button class="btn btn-ghost arquivo-del" data-requires="admin" data-aid="${escapeHtml(e.id)}">🗑️ Apagar do histórico</button>` +
      `</details>`
    );
  }).join('');

  dom.arquivoList.querySelectorAll('.arquivo-del').forEach((btn) => {
    btn.addEventListener('click', () => {
      openConfirm('Apagar do Histórico', 'Este torneio arquivado vai ser apagado. Continuar?', async () => {
        state.arquivo = state.arquivo.filter((x) => x.id !== btn.dataset.aid);
        await persistArquivo();
        renderHistorico();
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Janela do jogo — resultado, cronologia de golos e assistências
// ---------------------------------------------------------------------------
let openGameGi = null;

function goalScorerName(pid) {
  if (pid === 'auto') return 'Autogolo';
  return pid ? playerName(pid) : 'Golo';
}

function gameStatusLine(val) {
  const status = val && typeof val === 'object' ? (val.status || GAME_STATUS.AGENDADO) : (val ? GAME_STATUS.TERMINADO : GAME_STATUS.AGENDADO);
  if (status === GAME_STATUS.DECORRER) return '<span class="gm-live">● A decorrer</span>';
  if (status === GAME_STATUS.TERMINADO) return 'Terminado';
  return 'Agendado';
}

function gameTeamHtml(idx, cls) {
  const color = typeof idx === 'number' && state.teams[idx] ? state.teams[idx].color : '#888888';
  return (
    `<div class="gm-team ${cls}">` +
    `<span class="gm-crest" style="background:${safeColor(color)}"></span>` +
    `<span class="gm-team-name">${escapeHtml(getTeamName(idx))}</span>` +
    `</div>`
  );
}

function gameModalHtml(gi) {
  const g = state.schedule[gi];
  if (!g) return '<p class="empty">Este jogo já não existe.</p>';
  const val = state.results[gi];
  const score = (val && typeof val === 'object' ? val.score : val) || '';
  const m = /^(\d+)-(\d+)$/.exec(score);
  const [h, a] = m ? [m[1], m[2]] : ['–', '–'];
  const ronda = typeof g.jornada === 'number' ? `Jornada ${g.jornada}` : String(g.jornada || '');
  const pen = val && val.penalties ? `<div class="gm-pen">Penáltis ${escapeHtml(val.penalties)}</div>` : '';

  const goals = gameGoals(val);
  const goalCard = (goal) => {
    const assist = goal.aid && goal.aid !== 'auto' ? `<div class="gm-assist">${escapeHtml(playerName(goal.aid))}</div>` : '';
    return (
      `<div class="gm-card">` +
      `<span class="gm-ball" aria-hidden="true">⚽</span>` +
      `<div><div class="gm-scorer">${escapeHtml(goalScorerName(goal.pid))}</div>${assist}</div>` +
      `</div>`
    );
  };
  const hasGoals = goals.home.length || goals.away.length;
  const cols = hasGoals
    ? `<div class="gm-goals">` +
      `<div class="gm-col gm-col-home">${goals.home.map(goalCard).join('')}</div>` +
      `<div class="gm-col gm-col-away">${goals.away.map(goalCard).join('')}</div>` +
      `</div>`
    : '';

  // MVP e partilha só fazem sentido com o jogo terminado
  const terminado = val && (typeof val !== 'object' || val.status === GAME_STATUS.TERMINADO);
  const mvpNome = val && val.mvp ? escapeHtml(playerName(val.mvp)) : '';
  const mvp = terminado && typeof val === 'object'
    ? `<div class="gm-actions">` +
      `<button class="btn gm-action" data-action="mvp" title="Escolher o MVP do jogo">⭐ ${mvpNome ? `MVP: <strong>${mvpNome}</strong>` : 'Escolher MVP'}</button>` +
      `<button class="btn gm-action" data-action="share" title="Partilhar a imagem do resultado">📤 Partilhar imagem</button>` +
      `</div>`
    : (mvpNome ? `<div class="gm-mvp">⭐ MVP: <strong>${mvpNome}</strong></div>` : '');

  return (
    `<div class="gm-head" data-game="${escapeHtml(gi)}">` +
    (ronda ? `<div class="gm-round">${escapeHtml(ronda)}</div>` : '') +
    `<div class="gm-score-row">` +
    gameTeamHtml(g.home, 'gm-home') +
    `<div class="gm-score"><span data-side="home">${escapeHtml(h)}</span><span class="gm-colon">:</span><span data-side="away">${escapeHtml(a)}</span></div>` +
    gameTeamHtml(g.away, 'gm-away') +
    `</div>` +
    `<div class="gm-status">${gameStatusLine(val)}</div>${pen}` +
    `</div>` +
    `<div class="gm-body">` +
    (cols || '<p class="empty gm-empty">Ainda não há golos neste jogo.</p>') +
    mvp +
    `</div>`
  );
}

export function openGameModal(gi) {
  const overlay = document.getElementById('gameOverlay');
  if (!overlay) return;
  openGameGi = String(gi);
  document.getElementById('gameModalContent').innerHTML = gameModalHtml(openGameGi);
  overlay.hidden = false;
  document.getElementById('gameModalClose').focus();
}

export function closeGameModal() {
  const overlay = document.getElementById('gameOverlay');
  if (overlay) overlay.hidden = true;
  openGameGi = null;
}

/** Redesenha a janela do jogo aberta (resultados mudaram aqui ou noutro telemóvel). */
export function refreshGameModal() {
  if (openGameGi === null) return;
  const el = document.getElementById('gameModalContent');
  if (el) el.innerHTML = gameModalHtml(openGameGi);
}

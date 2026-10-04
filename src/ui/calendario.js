import { state } from '../state.js';
import { getTeamDisplay, escapeHtml } from '../utils.js';
import { GAME_STATUS } from '../algorithms.js';
import { dom } from './dom.js';
import { openGameModal, refreshGameModal } from './jogo.js';

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

  // O clique no estado é tratado no main.js (delegação em dom.calendarList)
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

  // Gravar resultados, golos e estado é ligado no main.js (delegação em dom.resultsList)
  Array.from(dom.resultsList.querySelectorAll('.res-box, .pen-box')).forEach((inp) => {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });

  refreshGameModal();
}

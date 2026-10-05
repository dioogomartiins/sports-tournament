import { state } from '../state.js';
import { getTeamName, escapeHtml, safeColor, playerName } from '../utils.js';
import { GAME_STATUS, gameGoals } from '../algorithms.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Match window — score, timeline of goals and assists
// ---------------------------------------------------------------------------
let openGameGi = null;

function goalScorerName(pid) {
  if (pid === 'auto') return en.gameModal.ownGoal;
  return pid ? playerName(pid) : en.gameModal.goal;
}

function gameStatusLine(val) {
  const status = val && typeof val === 'object' ? (val.status || GAME_STATUS.AGENDADO) : (val ? GAME_STATUS.TERMINADO : GAME_STATUS.AGENDADO);
  if (status === GAME_STATUS.DECORRER) return `<span class="gm-live">${escapeHtml(en.gameModal.liveStatus)}</span>`;
  if (status === GAME_STATUS.TERMINADO) return escapeHtml(en.gameModal.finishedStatus);
  return escapeHtml(en.gameModal.scheduledStatus);
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
  if (!g) return `<p class="empty">${escapeHtml(en.gameModal.matchNotFound)}</p>`;
  const val = state.results[gi];
  const score = (val && typeof val === 'object' ? val.score : val) || '';
  const m = /^(\d+)-(\d+)$/.exec(score);
  const [h, a] = m ? [m[1], m[2]] : ['–', '–'];
  const ronda = typeof g.jornada === 'number' ? en.gameModal.roundLabel(g.jornada) : String(g.jornada || '');
  const pen = val && val.penalties ? `<div class="gm-pen">${escapeHtml(en.gameModal.penalties(val.penalties))}</div>` : '';

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

  // MVP and sharing only make sense with the match finished
  const terminado = val && (typeof val !== 'object' || val.status === GAME_STATUS.TERMINADO);
  const mvpNome = val && val.mvp ? escapeHtml(playerName(val.mvp)) : '';
  const mvp = terminado && typeof val === 'object'
    ? `<div class="gm-actions">` +
      `<button class="btn gm-action" data-action="mvp" title="${escapeHtml(en.gameModal.pickMvpTitle)}">⭐ ${mvpNome ? `MVP: <strong>${mvpNome}</strong>` : escapeHtml(en.gameModal.pickMvpButton)}</button>` +
      `<button class="btn gm-action" data-action="share" title="${escapeHtml(en.gameModal.shareImageTitle)}">${escapeHtml(en.gameModal.shareImageButton)}</button>` +
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
    (cols || `<p class="empty gm-empty">${escapeHtml(en.gameModal.noGoalsInMatch)}</p>`) +
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

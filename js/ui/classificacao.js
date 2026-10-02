import { getTeamDisplay, escapeHtml, prefersReducedMotion } from '../utils.js';
import { standingsOrder, rankMoves } from '../algorithms.js';
import { dom } from './dom.js';

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

export function replayStandings() {
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

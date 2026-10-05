import { getTeamDisplay, escapeHtml, prefersReducedMotion } from '../utils.js';
import { standingsOrder, rankMoves } from '../algorithms.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Render — Standings
// ---------------------------------------------------------------------------

/** Vertical position of each row in the standings table (by team) before re-rendering. */
function rowPositions(container) {
  const pos = new Map();
  container.querySelectorAll('tr[data-team]').forEach((r) => {
    const top = r.getBoundingClientRect().top;
    if (top) pos.set(r.dataset.team, top);
  });
  return pos;
}

/** Slides teams that moved places from old position to new position. */
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

/** Arrow indicator for gained (green) or lost (red) positions. */
function moveBadge(team) {
  const n = standingsMoves.get(String(team));
  if (!n) return '';
  const up = n > 0;
  const label = up ? en.standings.movedUp(Math.abs(n)) : en.standings.movedDown(Math.abs(n));
  return `<span class="pos-move ${up ? 'up' : 'down'}" title="${label}" aria-label="${label}">${up ? '▲' : '▼'}${Math.abs(n)}</span>`;
}

function standingsHtml(groupsData) {
  if (!groupsData || !groupsData.length || !groupsData[0].standings.length) {
    return `<table class="standings-table"><tr><td colspan="10" class="empty">${en.standings.noTeams}</td></tr></table>`;
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
      ? `<h3 style="margin-top:20px; margin-bottom:10px; color:var(--pitch-800); font-weight:600;">${escapeHtml(group.name)}</h3>`
      : '';

    return (
      titleHtml +
      `<table class="standings-table">` +
      `<thead><tr>` +
      `<th>${en.standings.cols.pos}</th><th class="team-cell">${en.standings.cols.team}</th><th>${en.standings.cols.pts}</th>` +
      `<th>${en.standings.cols.p}</th><th>${en.standings.cols.w}</th><th>${en.standings.cols.d}</th><th>${en.standings.cols.l}</th><th>${en.standings.cols.gf}</th><th>${en.standings.cols.ga}</th><th>${en.standings.cols.gd}</th>` +
      `</tr></thead>` +
      `<tbody>${rows.join('')}</tbody>` +
      `</table>`
    );
  });
  return html.join('');
}

let seenStandingsHtml = null;
let seenStandingsOrder = null;
let standingsMoves = new Map();
let lastGroupsData = null;
let standingsReplayTimer = null;
const STANDINGS_HOLD = 600;

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

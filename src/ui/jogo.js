import { state } from '../state.js';
import { getTeamName, safeColor, prefersReducedMotion } from '../utils.js';
import { resultEvents } from '../algorithms.js';
import { FootballScore } from '../sports/football/FootballScore.js';
import { isAdminView } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Match window — hosts <football-score> and plays match events everywhere
// ---------------------------------------------------------------------------
let openGameGi = null;

/** What the score panel shows about one match, read from the state. */
export function matchView(gi) {
  const g = state.schedule[gi];
  if (!g) return null;
  const team = (idx) => ({
    name: getTeamName(idx),
    color: typeof idx === 'number' && state.teams[idx] ? safeColor(state.teams[idx].color) : null,
  });
  return {
    gi: String(gi),
    round: typeof g.jornada === 'number' ? en.gameModal.roundLabel(g.jornada) : String(g.jornada || ''),
    home: team(g.home),
    away: team(g.away),
    result: state.results[gi],
  };
}

function openPanel() {
  return document.querySelector('#gameModalContent football-score');
}

export function openGameModal(gi) {
  const overlay = document.getElementById('gameOverlay');
  if (!overlay) return;
  openGameGi = String(gi);
  const content = document.getElementById('gameModalContent');
  content.replaceChildren(new FootballScore());
  refreshGameModal();
  overlay.hidden = false;
  document.getElementById('gameModalClose').focus();
}

export function closeGameModal() {
  const overlay = document.getElementById('gameOverlay');
  if (overlay) overlay.hidden = true;
  openGameGi = null;
  document.getElementById('gameModalContent')?.replaceChildren();
}

/** Redraws the open match window (results changed here or on another phone). */
export function refreshGameModal() {
  const panel = openPanel();
  if (openGameGi === null || !panel) return;
  panel.match = matchView(openGameGi);
  panel.canEdit = isAdminView();
}

// ---------------------------------------------------------------------------
// Match events — kick-off, goal, cancelled goal, full time
// ---------------------------------------------------------------------------
// Events come from comparing the last results with the current ones, so they
// play on every phone: on the one that saved and on those that got the change
// from Firebase.
let baseline = null;

/**
 * Compares the results with the previous call and plays what changed.
 * `silent` only records the state (first Firebase read, rejected save).
 */
export function animateResultChanges({ silent = false } = {}) {
  const prev = baseline;
  baseline = JSON.parse(JSON.stringify(state.results || {}));
  if (silent || !prev || prefersReducedMotion()) return;

  const events = resultEvents(prev, state.results);
  if (!events.length) return;

  // Wait for the redraw; several events on the same match play in turn
  const queue = {};
  requestAnimationFrame(() => {
    events.forEach((ev) => {
      const panel = openPanel();
      if (panel && openGameGi === String(ev.gi)) panel.onPoint(ev);

      const n = queue[ev.gi] || 0;
      queue[ev.gi] = n + 1;
      setTimeout(() => playOnCards(ev), n * FootballScore.STAGGER);
    });
  });
}

/** Plays an event on the visible fixture cards of its match. */
function playOnCards(ev) {
  const view = matchView(ev.gi);
  if (!view) return;
  const banner = new FootballScore();
  banner.match = view;
  document.querySelectorAll(`[data-game="${CSS.escape(String(ev.gi))}"]`).forEach((card) => {
    // Only what is on screen (active tab)
    if (card.offsetParent) banner.playOn(card, ev);
  });
}

import { state } from '../state.js';
import { sideName, safeColor, prefersReducedMotion } from '../utils.js';
import { getSport } from '../sports/registry.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { ScoreBase } from '../components/ScoreBase.js';
import type { ScoreMatch } from '../components/ScoreBase.js';
import { FootballScore } from '../sports/football/FootballScore.js';
import { PadelScore } from '../sports/padel/PadelScore.js';
import { TennisScore } from '../sports/tennis/TennisScore.js';
import type { GameEvent, MatchResult } from '../types.js';
import { isAdminView } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Match window — hosts the sport's score panel and plays match events everywhere
// ---------------------------------------------------------------------------
let openGameGi: string | null = null;

/** Score panel class per sport id; sports without one use football's. */
const SCORE_PANELS: Record<string, new () => ScoreBase> = { football: FootballScore, padel: PadelScore, tennis: TennisScore };

function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

function newScorePanel(): ScoreBase {
  const Panel = SCORE_PANELS[currentSport().id] || FootballScore;
  return new Panel();
}

/** What the score panel shows about one match, read from the state. */
export function matchView(gi: string | number): ScoreMatch | null {
  const g = state.schedule[Number(gi)];
  if (!g) return null;
  const sport = currentSport();
  const team = (side: 'home' | 'away') => {
    const idx = g[side];
    return {
      name: sideName(g, side),
      color: typeof idx === 'number' && state.teams?.[idx] ? safeColor(state.teams[idx].color) : null,
    };
  };
  return {
    gi: String(gi),
    round: typeof g.jornada === 'number' ? en.gameModal.roundLabel(g.jornada) : String(g.jornada || ''),
    home: team('home'),
    away: team('away'),
    result: state.results[gi],
    format: sport instanceof RacketSport ? sport.format(state.config) : undefined,
    points: sport instanceof RacketSport ? sport.pointsPerMatch(state.config) ?? undefined : undefined,
  };
}

function openPanel(): ScoreBase | null {
  const panel = document.getElementById('gameModalContent')?.firstElementChild;
  return panel instanceof ScoreBase ? panel : null;
}

export function openGameModal(gi: string | number): void {
  const overlay = document.getElementById('gameOverlay');
  const content = document.getElementById('gameModalContent');
  if (!overlay || !content) return;
  openGameGi = String(gi);
  content.replaceChildren(newScorePanel());
  refreshGameModal();
  overlay.hidden = false;
  document.getElementById('gameModalClose')?.focus();
}

export function closeGameModal(): void {
  const overlay = document.getElementById('gameOverlay');
  if (overlay) overlay.hidden = true;
  openGameGi = null;
  document.getElementById('gameModalContent')?.replaceChildren();
}

/** Redraws the open match window (results changed here or on another phone). */
export function refreshGameModal(): void {
  const panel = openPanel();
  if (openGameGi === null || !panel) return;
  panel.match = matchView(openGameGi);
  panel.canEdit = isAdminView();
}

// ---------------------------------------------------------------------------
// Match events — kick-off, point, cancelled point, full time
// ---------------------------------------------------------------------------
// Events come from comparing the last results with the current ones, so they
// play on every phone: on the one that saved and on those that got the change
// from Firebase.
let baseline: Record<string, MatchResult> | null = null;

/**
 * Compares the results with the previous call and plays what changed.
 * `silent` only records the state (first Firebase read, rejected save).
 */
export function animateResultChanges({ silent = false } = {}): void {
  const prev = baseline;
  baseline = JSON.parse(JSON.stringify(state.results || {}));
  if (silent || !prev || prefersReducedMotion()) return;

  const events = currentSport().resultEvents(prev, state.results as Record<string, MatchResult>, state.config ?? undefined);
  if (!events.length) return;

  // Wait for the redraw; several events on the same match play in turn
  const queue: Record<string, number> = {};
  requestAnimationFrame(() => {
    events.forEach((ev) => {
      const panel = openPanel();
      if (panel && openGameGi === String(ev.gi)) panel.onPoint(ev);

      const n = queue[ev.gi] || 0;
      queue[ev.gi] = n + 1;
      setTimeout(() => playOnCards(ev), n * ScoreBase.STAGGER);
    });
  });
}

/** Plays an event on the visible fixture cards of its match. */
function playOnCards(ev: GameEvent): void {
  const view = matchView(ev.gi);
  if (!view) return;
  const banner = newScorePanel();
  banner.match = view;
  document.querySelectorAll<HTMLElement>(`[data-game="${CSS.escape(String(ev.gi))}"]`).forEach((card) => {
    // Only what is on screen (active tab)
    if (card.offsetParent) banner.playOn(card, ev);
  });
}

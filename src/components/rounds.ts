// ---------------------------------------------------------------------------
// Rounds of the schedule, as the schedule and results lists show them
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { GAME_STATUS } from '../types.js';
import type { GameStatus, Match, MatchResult, RoundMeta } from '../types.js';
import { en } from '../i18n/en.js';

export interface RoundGame {
  game: Match;
  /** Index of the match in the schedule (the key of its result). */
  gi: number;
}

export interface Round {
  title: string;
  games: RoundGame[];
  /** Team resting this round (odd number of teams), if any. */
  bye: number | string | null;
}

/** Groups the schedule by round, in the order of `roundsMeta`. */
export function groupRounds(schedule: Match[], roundsMeta: RoundMeta[]): Round[] {
  const byRound = new Map<string, RoundGame[]>();
  schedule.forEach((game, gi) => {
    const key = String(game.jornada);
    if (!byRound.has(key)) byRound.set(key, []);
    byRound.get(key)!.push({ game, gi });
  });
  return roundsMeta.map((rm) => ({
    title: typeof rm.jornada === 'number' ? en.schedule.roundHead(rm.jornada) : String(rm.jornada),
    games: byRound.get(String(rm.jornada)) || [],
    bye: rm.bye ?? null,
  }));
}

/** Status of a result; only known values are accepted (results come from Firebase). */
export function statusOf(res: MatchResult | undefined): GameStatus {
  const status = res && typeof res === 'object' ? res.status : undefined;
  return status === GAME_STATUS.DECORRER || status === GAME_STATUS.TERMINADO ? status : GAME_STATUS.AGENDADO;
}

const STATUS_LABELS: Record<GameStatus, string> = {
  [GAME_STATUS.AGENDADO]: en.results.statusScheduled,
  [GAME_STATUS.DECORRER]: en.results.statusInProgress,
  [GAME_STATUS.TERMINADO]: en.results.statusFinished,
};

/**
 * The status pill; clicking it moves the match to the next status. Without
 * `onClick` (a profile that cannot change results) it is only a label.
 */
export function statusBadge(status: GameStatus, onClick?: (e: Event) => void): TemplateResult {
  if (!onClick) return html`<span class="status-badge status-${status}">${STATUS_LABELS[status]}</span>`;
  return html`<button class="status-badge status-${status}" title=${en.results.changeStatusTitle}
    @click=${onClick}>${STATUS_LABELS[status]}</button>`;
}

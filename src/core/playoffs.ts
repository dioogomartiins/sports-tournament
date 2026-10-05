import type { Match, RoundMeta, StandingsRow } from '../types.js';
import { en } from '../i18n/en.js';
import { buildFirstRoundSeeding } from './schedule.js';

// ---------------------------------------------------------------------------
// Knockout bracket
// ---------------------------------------------------------------------------

export interface PlayoffRound {
  prefix: string;
  label: string;
}

/**
 * Every knockout round, largest first: Round of 16 → Quarter-Finals → Semi-Finals → Final.
 * A bracket of N teams starts at index `length - log2(N)`; supporting 32 teams
 * only needs one more entry at the start.
 */
export const ROUND_CHAIN: readonly PlayoffRound[] = [
  { prefix: 'OF', label: en.playoffs.roundOf16 },
  { prefix: 'QF', label: en.playoffs.quarterFinals },
  { prefix: 'MF', label: en.playoffs.semiFinals },
  { prefix: 'F', label: en.playoffs.final },
];

/** Index in ROUND_CHAIN of the first round for teamCount teams, or null if it is not supported. */
export function firstRoundIndex(teamCount: number): number | null {
  const start = ROUND_CHAIN.length - Math.log2(teamCount);
  return Number.isInteger(start) && start >= 0 ? start : null;
}

/**
 * Picks the knockout teams by position, alternating groups (1st A, 1st B, 2nd A, 2nd B, …).
 * Returns null when a group has fewer than perGroup teams.
 */
export function playoffSeeds(groups: { standings: StandingsRow[] }[], perGroup: number): StandingsRow[] | null {
  if (!groups.every((g) => g.standings.length >= perGroup)) return null;
  const seeds: StandingsRow[] = [];
  for (let pos = 0; pos < perGroup; pos++) {
    groups.forEach((g) => seeds.push(g.standings[pos]));
  }
  return seeds;
}

/**
 * Builds the whole knockout bracket.
 *
 * The 1st round pairs the highest seed with the lowest (1 vs N, …) so the best
 * teams do not meet early. Later rounds hold "Winner Xn" placeholders that are
 * filled in when results come in (see advanceWinner).
 *
 * @param teamCount - Teams in the bracket (a power of 2, at most 16)
 * @param seeds - Teams ordered by seed (index 0 = 1st seed)
 */
export function buildPlayoffBracket(teamCount: number, seeds: { idx: number }[]): { games: Match[]; rounds: RoundMeta[] } {
  const startIndex = firstRoundIndex(teamCount);
  if (startIndex === null || seeds.length < teamCount) return { games: [], rounds: [] };

  const roundDefs = ROUND_CHAIN.slice(startIndex);
  const firstRoundSeeding = buildFirstRoundSeeding(teamCount);
  const games: Match[] = [];
  const rounds: RoundMeta[] = [];

  roundDefs.forEach(({ prefix, label }, roundIndex) => {
    const next = roundDefs[roundIndex + 1]?.prefix ?? null;
    const matchCount = teamCount / Math.pow(2, roundIndex + 1);
    rounds.push({ jornada: label, bye: null });

    for (let i = 0; i < matchCount; i++) {
      const nextMatchId = next ? `${next}${Math.floor(i / 2) + 1}_${i % 2 === 0 ? 'home' : 'away'}` : null;
      let home: number | string;
      let away: number | string;
      if (roundIndex === 0) {
        const [seedA, seedB] = firstRoundSeeding[i];
        home = seeds[seedA].idx;
        away = seeds[seedB].idx;
      } else {
        const prevPrefix = roundDefs[roundIndex - 1].prefix;
        home = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 1);
        away = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 2);
      }
      games.push({ jornada: label, home, away, isPlayoff: true, playoffMatchId: `${prefix}${i + 1}`, nextMatchId });
    }
  });

  return { games, rounds };
}

/**
 * Puts the winner of a knockout match into its slot of the next match.
 * @returns true when the schedule changed
 */
export function advanceWinner(schedule: Match[], game: Match, winnerIdx: number | string): boolean {
  if (!game.nextMatchId) return false;
  const [targetMatchId, targetSide] = String(game.nextMatchId).split('_');
  if (targetSide !== 'home' && targetSide !== 'away') return false;
  const target = schedule.find((g) => g.playoffMatchId === targetMatchId);
  if (!target || target[targetSide] === winnerIdx) return false;
  target[targetSide] = winnerIdx;
  return true;
}

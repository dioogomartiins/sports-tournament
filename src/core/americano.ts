import type { Match, MatchResult, RoundMeta, StandingsRow, Team } from '../types.js';
import { GAME_STATUS } from '../types.js';
import { bergerRounds } from './schedule.js';

// ---------------------------------------------------------------------------
// Americano and Mexicano (padel with rotating partners)
// ---------------------------------------------------------------------------
// Every team slot holds one player. A match is two pairs of players: `home`
// and `away` are the first player of each pair and `partners` the second.
// Each match is played to a fixed total of points ("15-9" of 24) and every
// player keeps the points their pair won.
//
// - Americano: every player partners every other player once (n − 1 rounds).
// - Mexicano: one round at a time; in each group of four by ranking,
//   1st + 4th play 2nd + 3rd.

export type RotationFormat = 'americano' | 'mexicano';

export const ROTATION_FORMATS: readonly RotationFormat[] = ['americano', 'mexicano'];

/** Players per match. Rotating formats need a multiple of this many players. */
export const PLAYERS_PER_MATCH = 4;

export interface RotationMatch {
  home: [number, number];
  away: [number, number];
}

export function isRotationFormat(value: unknown): value is RotationFormat {
  return ROTATION_FORMATS.includes(value as RotationFormat);
}

/** Can a rotating tournament be played with this many players? */
export function validPlayerCount(n: number): boolean {
  return Number.isInteger(n) && n >= PLAYERS_PER_MATCH && n % PLAYERS_PER_MATCH === 0;
}

/**
 * Americano rounds: the Berger round-robin of the players gives the partner
 * pairs of each round (every pair exactly once), and consecutive pairs play
 * each other.
 */
export function americanoRounds(n: number): RotationMatch[][] {
  if (!validPlayerCount(n)) return [];
  return bergerRounds(n).map(({ pairs }) => {
    const matches: RotationMatch[] = [];
    for (let i = 0; i + 1 < pairs.length; i += 2) matches.push({ home: pairs[i], away: pairs[i + 1] });
    return matches;
  });
}

/** A Mexicano round from a ranking (best first): 1st + 4th vs 2nd + 3rd in each group of four. */
export function mexicanoRound(ranking: number[]): RotationMatch[] {
  if (!validPlayerCount(ranking.length)) return [];
  const matches: RotationMatch[] = [];
  for (let i = 0; i < ranking.length; i += PLAYERS_PER_MATCH) {
    const [a, b, c, d] = ranking.slice(i, i + PLAYERS_PER_MATCH);
    matches.push({ home: [a, d], away: [b, c] });
  }
  return matches;
}

/** Turns rounds into schedule matches, numbering the rounds from firstRound. */
export function rotationSchedule(rounds: RotationMatch[][], firstRound = 1): { games: Match[]; rounds: RoundMeta[] } {
  const games: Match[] = [];
  const meta: RoundMeta[] = [];
  rounds.forEach((matches, r) => {
    const jornada = firstRound + r;
    meta.push({ jornada, bye: null });
    matches.forEach((m) => {
      games.push({ jornada, home: m.home[0], away: m.away[0], partners: { home: m.home[1], away: m.away[1] } });
    });
  });
  return { games, rounds: meta };
}

/** The partner of a match side, if the match has rotating pairs. */
export function partnerOf(game: Match, side: 'home' | 'away'): number | null {
  const v = game.partners?.[side];
  return typeof v === 'number' ? v : null;
}

/** Both players of a side (just one for a fixed team). */
export function sidePlayers(game: Match, side: 'home' | 'away'): number[] {
  const first = game[side];
  if (typeof first !== 'number') return [];
  const partner = partnerOf(game, side);
  return partner === null ? [first] : [first, partner];
}

/** Points of a "15-9" score, or null. */
export function parsePoints(score: unknown): { home: number; away: number } | null {
  const m = /^(\d{1,3})-(\d{1,3})$/.exec(String(score ?? '').trim());
  return m ? { home: Number(m[1]), away: Number(m[2]) } : null;
}

function scoreOf(res: MatchResult | undefined): string {
  if (!res) return '';
  return typeof res === 'object' ? res.score || '' : res;
}

/**
 * Standings per player: points won (Pts and GM), points lost (GS), difference,
 * matches played, won, drawn and lost. Ranked by points won, then difference,
 * then wins, then name.
 */
export function playerStandings(
  teams: (Team | string)[],
  schedule: Match[],
  results: Record<string | number, MatchResult>,
): StandingsRow[] {
  const rows: StandingsRow[] = teams.map((t, idx) => ({
    idx,
    name: typeof t === 'string' ? t : t?.name || `Player ${idx + 1}`,
    J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, DG: 0, Pts: 0,
  }));

  schedule.forEach((game, gi) => {
    const res = results[gi];
    if (!res || (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO)) return;
    const pts = parsePoints(scoreOf(res));
    if (!pts) return;
    (['home', 'away'] as const).forEach((side) => {
      const mine = pts[side];
      const theirs = pts[side === 'home' ? 'away' : 'home'];
      sidePlayers(game, side).forEach((p) => {
        const r = rows[p];
        if (!r) return;
        r.J++;
        r.GM += mine;
        r.GS += theirs;
        if (mine > theirs) r.V++;
        else if (mine < theirs) r.D++;
        else r.E++;
      });
    });
  });

  rows.forEach((r) => {
    r.DG = r.GM - r.GS;
    r.Pts = r.GM;
  });
  return rows.sort((x, y) => y.Pts - x.Pts || (y.DG ?? 0) - (x.DG ?? 0) || y.V - x.V || x.name.localeCompare(y.name));
}

/** Have all matches of the latest round been played? */
export function lastRoundFinished(schedule: Match[], results: Record<string | number, MatchResult>): boolean {
  if (!schedule.length) return false;
  const last = schedule[schedule.length - 1].jornada;
  return schedule.every((g, gi) => {
    if (g.jornada !== last) return true;
    const res = results[gi];
    return !!res && (typeof res !== 'object' || res.status === GAME_STATUS.TERMINADO);
  });
}

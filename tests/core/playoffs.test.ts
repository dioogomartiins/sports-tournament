import { describe, it, expect } from 'vitest';
import { buildPlayoffBracket, firstRoundIndex, playoffSeeds, advanceWinner, ROUND_CHAIN } from '../../src/core/playoffs.js';
import type { StandingsRow } from '../../src/types.js';

const seeds = (n: number) => Array.from({ length: n }, (_, i) => ({ idx: i * 10 }));
const row = (idx: number) => ({ idx, name: `T${idx}` }) as StandingsRow;

describe('firstRoundIndex', () => {
  it('starts 2, 4, 8 and 16 team brackets at the final, semis, quarters and round of 16', () => {
    expect([2, 4, 8, 16].map(firstRoundIndex)).toEqual([3, 2, 1, 0]);
  });

  it('rejects sizes that are not a power of two or are too big', () => {
    expect(firstRoundIndex(6)).toBeNull();
    expect(firstRoundIndex(32)).toBeNull();
  });
});

describe('buildPlayoffBracket', () => {
  it('builds semi-finals and a final for 4 teams, 1st against 4th', () => {
    const { games, rounds } = buildPlayoffBracket(4, seeds(4));
    expect(rounds.map((r) => r.jornada)).toEqual([ROUND_CHAIN[2].label, ROUND_CHAIN[3].label]);
    expect(games).toHaveLength(3);
    expect(games[0]).toMatchObject({ home: 0, away: 30, playoffMatchId: 'MF1', nextMatchId: 'F1_home', isPlayoff: true });
    expect(games[1]).toMatchObject({ home: 10, away: 20, playoffMatchId: 'MF2', nextMatchId: 'F1_away' });
    expect(games[2]).toMatchObject({ playoffMatchId: 'F1', nextMatchId: null });
    expect(typeof games[2].home).toBe('string');
  });

  it('builds 15 matches for 16 teams', () => {
    expect(buildPlayoffBracket(16, seeds(16)).games).toHaveLength(15);
  });

  it('returns nothing for an unsupported size or too few seeds', () => {
    expect(buildPlayoffBracket(6, seeds(6)).games).toEqual([]);
    expect(buildPlayoffBracket(8, seeds(4)).games).toEqual([]);
  });
});

describe('playoffSeeds', () => {
  it('alternates groups by position', () => {
    const groups = [{ standings: [row(1), row(2), row(3)] }, { standings: [row(4), row(5)] }];
    expect(playoffSeeds(groups, 2)?.map((s) => s.idx)).toEqual([1, 4, 2, 5]);
  });

  it('returns null when a group is too small', () => {
    expect(playoffSeeds([{ standings: [row(1)] }], 2)).toBeNull();
  });
});

describe('advanceWinner', () => {
  it('fills the slot of the next match once', () => {
    const { games } = buildPlayoffBracket(4, seeds(4));
    expect(advanceWinner(games, games[1], 20)).toBe(true);
    expect(games[2].away).toBe(20);
    expect(advanceWinner(games, games[1], 20)).toBe(false);
  });

  it('does nothing for the final', () => {
    const { games } = buildPlayoffBracket(2, seeds(2));
    expect(advanceWinner(games, games[0], 0)).toBe(false);
  });
});

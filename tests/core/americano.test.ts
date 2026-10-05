import { describe, it, expect } from 'vitest';
import {
  americanoRounds, mexicanoRound, rotationSchedule, playerStandings, lastRoundFinished,
  validPlayerCount, sidePlayers, parsePoints,
} from '../../src/core/americano.js';
import { padel } from '../../src/sports/padel/Padel.js';
import type { Config, MatchResult } from '../../src/types.js';

const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

describe('americanoRounds', () => {
  it('needs a multiple of 4 players', () => {
    expect([4, 8, 12].map(validPlayerCount)).toEqual([true, true, true]);
    expect([2, 6, 10].map(validPlayerCount)).toEqual([false, false, false]);
    expect(americanoRounds(6)).toEqual([]);
  });

  it.each([4, 8, 12])('makes every player partner every other player exactly once with %i players', (n) => {
    const rounds = americanoRounds(n);
    expect(rounds).toHaveLength(n - 1);
    const partners = new Map<string, number>();
    rounds.forEach((matches) => {
      expect(matches).toHaveLength(n / 4);
      // Everyone plays every round, once
      const seen = matches.flatMap((m) => [...m.home, ...m.away]).sort((a, b) => a - b);
      expect(seen).toEqual(Array.from({ length: n }, (_, i) => i));
      matches.forEach((m) => [m.home, m.away].forEach(([a, b]) => {
        partners.set(pairKey(a, b), (partners.get(pairKey(a, b)) || 0) + 1);
      }));
    });
    expect(partners.size).toBe((n * (n - 1)) / 2);
    expect([...partners.values()].every((c) => c === 1)).toBe(true);
  });
});

describe('mexicanoRound', () => {
  it('pairs 1st with 4th against 2nd and 3rd in each group of four', () => {
    expect(mexicanoRound([7, 3, 5, 1, 0, 2, 4, 6])).toEqual([
      { home: [7, 1], away: [3, 5] },
      { home: [0, 6], away: [2, 4] },
    ]);
  });
});

describe('rotationSchedule', () => {
  it('stores the first player of each pair in home / away and the second in partners', () => {
    const { games, rounds } = rotationSchedule([[{ home: [0, 3], away: [1, 2] }]], 5);
    expect(rounds).toEqual([{ jornada: 5, bye: null }]);
    expect(games[0]).toEqual({ jornada: 5, home: 0, away: 1, partners: { home: 3, away: 2 } });
    expect(sidePlayers(games[0], 'home')).toEqual([0, 3]);
    expect(sidePlayers({ jornada: 1, home: 4, away: 5 }, 'away')).toEqual([5]);
  });
});

describe('playerStandings', () => {
  const teams = ['Ana', 'Bruno', 'Carla', 'Rui'].map((name) => ({ name, color: '#000' }));
  const { games } = rotationSchedule(americanoRounds(4));

  it('gives every player the points of their pair and ranks by points won', () => {
    const results: Record<number, MatchResult> = {
      0: { score: '15-9', status: 'terminado' },
      1: { score: '12-12', status: 'terminado' },
    };
    const rows = playerStandings(teams, games, results);
    const byIdx = new Map(rows.map((r) => [r.idx, r]));
    const [h1, h2] = sidePlayers(games[0], 'home');
    expect(byIdx.get(h1)).toMatchObject({ J: 2 });
    expect(byIdx.get(h1)!.GM).toBe(15 + 12);
    expect(byIdx.get(h2)!.V).toBe(1);
    expect(rows[0].Pts).toBeGreaterThanOrEqual(rows[3].Pts);
    expect(rows.reduce((s, r) => s + r.J, 0)).toBe(8);
  });

  it('ignores scheduled matches', () => {
    const rows = playerStandings(teams, games, { 0: { score: '10-14', status: 'agendado' } });
    expect(rows.every((r) => r.J === 0)).toBe(true);
  });

  it('knows when the last round has been played', () => {
    const one = rotationSchedule([[{ home: [0, 3], away: [1, 2] }]]).games;
    expect(lastRoundFinished(one, {})).toBe(false);
    expect(lastRoundFinished(one, { 0: { score: '13-11', status: 'terminado' } })).toBe(true);
  });
});

describe('padel played to points', () => {
  const config = (extra: Partial<Config> = {}): Config => ({
    nome: 'A', numEquipas: 4, numGrupos: 1, numVoltas: 1, pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0,
    bonusGoleada: 0, golosGoleada: 99, mataMata: false, numPlayoffTeams: 2, sport: 'padel', ...extra,
  });

  it('plays to 24 points by default only in Americano and Mexicano', () => {
    expect(padel.pointsPerMatch(config())).toBeNull();
    expect(padel.pointsPerMatch(config({ padelFormat: 'americano' }))).toBe(24);
    expect(padel.pointsPerMatch(config({ padelFormat: 'mexicano', matchPoints: 32 }))).toBe(32);
    expect(padel.pointsPerMatch(config({ padelFormat: 'americano', matchPoints: 2 }))).toBe(24);
  });

  it('adds points until the total and cancels them', () => {
    const cfg = config({ padelFormat: 'americano', matchPoints: 4 });
    let res: MatchResult | undefined;
    for (const side of ['home', 'home', 'away', 'home', 'away'] as const) res = padel.addPoint(res, side, cfg);
    expect(parsePoints(typeof res === 'object' ? res.score : res)).toEqual({ home: 3, away: 1 });
    expect(padel.removePoint(res, 'home').score).toBe('2-1');
  });

  it('finishes the match when the points total is reached', () => {
    const cfg = config({ padelFormat: 'americano', matchPoints: 4 });
    expect(padel.addPoint({ score: '2-0', status: 'decorrer' }, 'away', cfg).status).toBe('decorrer');
    expect(padel.addPoint({ score: '2-1', status: 'decorrer' }, 'away', cfg)).toEqual({ score: '2-2', status: 'terminado' });
    expect(padel.removePoint({ score: '2-2', status: 'terminado' }, 'away', cfg)).toEqual({ score: '2-1', status: 'decorrer' });
  });

  it('ranks players, not pairs, with points columns', () => {
    const cfg = config({ padelFormat: 'americano' });
    const teams = ['A', 'B', 'C', 'D'].map((name) => ({ name, color: '#000' }));
    const { games } = rotationSchedule(americanoRounds(4));
    const groups = padel.computeStandings(teams, games, { 0: { score: '20-4', status: 'terminado' } }, cfg);
    expect(groups).toHaveLength(1);
    expect(groups[0].standings[0].Pts).toBe(20);
    expect(padel.standingsColumns(cfg)[0].label).toBe('PW');
    expect(padel.standingsColumns()[0].label).toBe('Pts');
  });

  it('reports points, never sets, as live events', () => {
    const cfg = config({ padelFormat: 'americano' });
    const ev = padel.resultEvents({ 0: { score: '5-6', status: 'decorrer' } }, { 0: { score: '6-6', status: 'decorrer' } }, cfg);
    expect(ev).toEqual([{ type: 'game', gi: '0', side: 'home' }]);
  });
});

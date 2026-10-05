import { describe, it, expect } from 'vitest';
import { padel } from '../src/sports/padel/Padel.js';
import type { Config, Match, MatchResult } from '../src/types.js';

const config = (extra: Partial<Config> = {}): Config => ({
  nome: 'Padel', numEquipas: 4, numGrupos: 1, numVoltas: 1,
  pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0, bonusGoleada: 0, golosGoleada: 99,
  mataMata: false, numPlayoffTeams: 2, sport: 'padel', ...extra,
});
const F = padel.format(config());

describe('set format', () => {
  it('defaults to best of 3, 6 games, super tie-break', () => {
    expect(F).toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: true });
  });

  it('uses the tournament format and fixes invalid values', () => {
    expect(padel.format(config({ setFormat: { sets: 1, gamesPerSet: 4, superTieBreak: true } })))
      .toEqual({ sets: 1, gamesPerSet: 4, superTieBreak: false });
    expect(padel.format(config({ setFormat: { sets: 2, gamesPerSet: 50, superTieBreak: false } })))
      .toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: false });
  });
});

describe('score text', () => {
  it('parses and writes sets', () => {
    expect(padel.parseSets('6-4 3-6 10-7')).toEqual([{ home: 6, away: 4 }, { home: 3, away: 6 }, { home: 10, away: 7 }]);
    expect(padel.formatSets(padel.parseSets('6-4 3-6 10-7'))).toBe('6-4 3-6 10-7');
    expect(padel.parseSets('')).toEqual([]);
    expect(padel.parseSets('6-4,3-6')).toEqual([]);
  });
});

describe('set and match completion', () => {
  it('wins a set with two games ahead, or 7-5 / 7-6', () => {
    expect(padel.setWinner({ home: 6, away: 4 }, 0, F)).toBe('home');
    expect(padel.setWinner({ home: 6, away: 5 }, 0, F)).toBeNull();
    expect(padel.setWinner({ home: 5, away: 7 }, 0, F)).toBe('away');
    expect(padel.setWinner({ home: 7, away: 6 }, 1, F)).toBe('home');
  });

  it('plays the deciding set as a super tie-break to 10', () => {
    expect(padel.setWinner({ home: 10, away: 8 }, 2, F)).toBe('home');
    expect(padel.setWinner({ home: 10, away: 9 }, 2, F)).toBeNull();
    expect(padel.setWinner({ home: 7, away: 6 }, 2, F)).toBeNull();
  });

  it('decides the match on the majority of sets', () => {
    expect(padel.matchWinner(padel.parseSets('6-4 6-3'), F)).toBe('home');
    expect(padel.matchWinner(padel.parseSets('6-4 3-6'), F)).toBeNull();
    expect(padel.matchWinner(padel.parseSets('6-4 3-6 7-10'), F)).toBe('away');
  });

  it('counts a super tie-break as one game for its winner', () => {
    expect(padel.gamesOf(padel.parseSets('6-4 3-6 10-7'), F)).toEqual({ home: 10, away: 10 });
  });
});

describe('scoring game by game', () => {
  it('starts the match and adds games to the current set', () => {
    let res: MatchResult | undefined = padel.addPoint(undefined, 'home', config());
    expect(res).toEqual({ score: '1-0', status: 'decorrer' });
    res = padel.addPoint(res, 'away', config());
    expect(res.score).toBe('1-1');
  });

  it('opens the next set when one is won and stops when the match is decided', () => {
    let res: MatchResult = { score: '5-4', status: 'decorrer' };
    res = padel.addPoint(res, 'home', config());
    expect(res.score).toBe('6-4');
    res = padel.addPoint(res, 'away', config());
    expect(res.score).toBe('6-4 0-1');
    const done = padel.addPoint({ score: '6-4 6-3', status: 'decorrer' }, 'away', config());
    expect(done.score).toBe('6-4 6-3');
  });

  it('cancels the last game of a side, reopening the previous set when the current one is empty', () => {
    expect(padel.removePoint({ score: '6-4 2-1', status: 'decorrer' }, 'home').score).toBe('6-4 1-1');
    expect(padel.removePoint({ score: '6-4 0-0', status: 'decorrer' }, 'home').score).toBe('5-4');
    expect(padel.removePoint({ score: '6-4 0-1', status: 'decorrer' }, 'home').score).toBe('6-4 0-1');
  });

  it('finishes the match on the game that decides it', () => {
    const won = padel.addPoint({ score: '6-4 5-3', status: 'decorrer' }, 'home', config());
    expect(won).toEqual({ score: '6-4 6-3', status: 'terminado' });
    // A set that is not the last one keeps the match going
    expect(padel.addPoint({ score: '5-4', status: 'decorrer' }, 'home', config()).status).toBe('decorrer');
    // One set of 4 games
    const oneSet = config({ setFormat: { sets: 1, gamesPerSet: 4, superTieBreak: false } });
    expect(padel.addPoint({ score: '3-2', status: 'decorrer' }, 'away', oneSet).status).toBe('decorrer');
    expect(padel.addPoint({ score: '3-2', status: 'decorrer' }, 'home', oneSet)).toEqual({ score: '4-2', status: 'terminado' });
  });

  it('reopens a finished match when the deciding game is cancelled', () => {
    expect(padel.removePoint({ score: '6-4 6-3', status: 'terminado' }, 'home', config())).toEqual({ score: '6-4 5-3', status: 'decorrer' });
    // Still decided (the other side lost a game): stays finished
    expect(padel.removePoint({ score: '6-4 6-3', status: 'terminado' }, 'away', config()).status).toBe('terminado');
  });

  it('starts at 0-0 in the first set', () => {
    expect(padel.setGameStatus(undefined, 'decorrer')).toEqual({ score: '0-0', status: 'decorrer' });
    expect(padel.addPoint(padel.setGameStatus(undefined, 'decorrer'), 'away', config()).score).toBe('0-1');
  });

  it('does not change the saved result', () => {
    const saved: MatchResult = { score: '1-0', status: 'decorrer' };
    padel.addPoint(saved, 'home', config());
    expect(saved.score).toBe('1-0');
  });
});

describe('standings by matches won', () => {
  const teams = ['A', 'B', 'C'];
  const schedule: Match[] = [
    { jornada: 1, home: 0, away: 1 },
    { jornada: 1, home: 1, away: 2 },
    { jornada: 2, home: 0, away: 2 },
    { jornada: 3, home: 0, away: 1, isPlayoff: true },
  ];

  it('gives the win points per match won and counts sets and games', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B 2-0
      1: { score: '6-0 6-0', status: 'terminado' }, // B beats C 2-0
      2: { score: '3-6 6-3 10-8', status: 'terminado' }, // A beats C 2-1
    };
    const [group] = padel.computeStandings(teams, schedule, results, config());
    expect(group.standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
    const a = group.standings[0];
    expect([a.J, a.V, a.D, a.SW, a.SL, a.Pts]).toEqual([2, 2, 0, 4, 1, 2]);
    const [three] = padel.computeStandings(teams, schedule, results, config({ winPoints: 3 }));
    expect(three.standings.map((r) => r.Pts)).toEqual([6, 3, 0]);
  });

  it('breaks level wins on set difference, then game difference', () => {
    // One win each. A +1 set (0 games), B 0 sets (+8 games), C -1 set: sets come first
    const circle: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B 2-0
      1: { score: '6-0 6-0', status: 'terminado' }, // B beats C 2-0
      2: { score: '6-4 2-6 4-6', status: 'terminado' }, // C beats A 2-1
    };
    expect(padel.computeStandings(teams, schedule, circle, config())[0].standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
    // A and C both beat B 2-0: A has the better game difference
    const games: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B
      1: { score: '0-6 0-6', status: 'terminado' }, // C beats B
    };
    expect(padel.computeStandings(teams, schedule, games, config())[0].standings.map((r) => r.name)).toEqual(['C', 'A', 'B']);
  });

  it('goes to head-to-head when wins, sets and games are level', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-3', status: 'terminado' }, // A beats B
      2: { score: '3-6', status: 'terminado' }, // C beats A
      1: { score: '6-3', status: 'terminado' }, // B beats C
    };
    const fmt = config({ setFormat: { sets: 1, gamesPerSet: 6, superTieBreak: false } });
    const [group] = padel.computeStandings(teams, schedule, results, fmt);
    // all one win, 1-1 sets, 9-9 games, and a circle in head-to-head: fewest games lost, then name
    expect(group.standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
  });

  it('puts the pair that won the match between them first', () => {
    const rows = [
      { idx: 0, name: 'Zeta', J: 1, V: 1, E: 0, D: 0, GM: 9, GS: 9, DG: 0, Pts: 1 },
      { idx: 1, name: 'Alfa', J: 1, V: 1, E: 0, D: 0, GM: 9, GS: 9, DG: 0, Pts: 1 },
    ];
    const games: Match[] = [{ jornada: 1, home: 1, away: 0 }];
    const sorted = padel.resolveHeadToHead(rows, games, { 0: { score: '4-6', status: 'terminado' } }, config());
    expect(sorted.map((r) => r.name)).toEqual(['Zeta', 'Alfa']);
  });

  it('ignores scheduled matches and the playoffs', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-0', status: 'agendado' },
      3: { score: '6-0 6-0', status: 'terminado' },
    };
    const [group] = padel.computeStandings(teams, schedule, results, config());
    expect(group.standings.every((r) => r.J === 0)).toBe(true);
  });

  it('reads the win points from the settings (1 by default, 0 to 10)', () => {
    expect(padel.winPoints(config())).toBe(1);
    expect(padel.winPoints(config({ winPoints: 3 }))).toBe(3);
    expect(padel.winPoints(config({ winPoints: 0 }))).toBe(0);
    expect(padel.winPoints(config({ winPoints: 99 }))).toBe(1);
  });
});

describe('playoffs and pair stats', () => {
  const final: Match = { jornada: 'Final', home: 0, away: 1, isPlayoff: true };

  it('gives the playoff to the side that won the match', () => {
    expect(padel.getPlayoffWinner(final, { score: '4-6 6-3 8-10', status: 'terminado' })).toBe(1);
    expect(padel.getPlayoffWinner(final, { score: '6-4 2-1', status: 'terminado' })).toBeNull();
    expect(padel.getPlayoffWinner(final, { score: '6-4 6-4', status: 'decorrer' })).toBeNull();
  });

  it('counts matches, wins, games and win percentage per pair', () => {
    const schedule: Match[] = [{ jornada: 1, home: 0, away: 1 }, { jornada: 2, home: 1, away: 0 }];
    const results: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' },
      1: { score: '6-2 6-2', status: 'terminado' },
    };
    const [p0, p1] = padel.pairStats(2, schedule, results, config());
    expect(p0).toEqual({ played: 2, won: 1, lost: 1, gamesWon: 16, gamesLost: 20, winPct: 50 });
    expect(p1.gamesWon).toBe(20);
  });
});

describe('live events', () => {
  it('reports games, sets, cancelled games, kick-off and full time', () => {
    const ev = (prev: MatchResult | undefined, next: MatchResult) =>
      padel.resultEvents(prev ? { 0: prev } : {}, { 0: next }, config());
    expect(ev(undefined, padel.setGameStatus(undefined, 'decorrer'))).toEqual([{ type: 'inicio', gi: '0' }]);
    expect(ev({ score: '1-0', status: 'decorrer' }, { score: '1-1', status: 'decorrer' })).toEqual([{ type: 'game', gi: '0', side: 'away' }]);
    expect(ev({ score: '5-4', status: 'decorrer' }, { score: '6-4', status: 'decorrer' })).toEqual([{ type: 'set', gi: '0', side: 'home' }]);
    expect(ev({ score: '6-4 1-0', status: 'decorrer' }, { score: '6-4 0-0', status: 'decorrer' })).toEqual([{ type: 'anulado', gi: '0', side: 'home' }]);
    expect(ev({ score: '6-4 6-4', status: 'decorrer' }, { score: '6-4 6-4', status: 'terminado' })).toEqual([{ type: 'fim', gi: '0' }]);
  });
});

describe('player records', () => {
  it('counts matches played and won per player from the pairs', () => {
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 0 },
    ];
    const squads = [[{ id: 'a', num: '', name: 'A' }, { id: 'b', num: '', name: 'B' }], [{ id: 'c', num: '', name: 'C' }]];
    const results: Record<number, MatchResult> = {
      0: { score: '6-4 6-3', status: 'terminado' },
      1: { score: '6-4 2-1', status: 'decorrer' },
      2: { score: '4-6 7-5 10-8', status: 'terminado' },
    };
    expect(padel.playerRecords(schedule, results, squads, [], config({ setFormat: { sets: 3, gamesPerSet: 6, superTieBreak: true } })))
      .toEqual({ a: { played: 2, won: 1 }, b: { played: 2, won: 1 }, c: { played: 2, won: 1 } });
    expect(padel.profileStats({ golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 })).toEqual([]);
  });
});

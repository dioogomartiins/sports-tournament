import { describe, it, expect } from 'vitest';
import { tennis } from '../src/sports/tennis/Tennis.js';
import { getSport, listSports } from '../src/sports/registry.js';
import { RacketSport } from '../src/sports/RacketSport.js';
import type { Config, MatchResult } from '../src/types.js';

const config = (extra: Partial<Config> = {}): Config => ({
  nome: 'Tennis', numEquipas: 4, numGrupos: 1, numVoltas: 1,
  pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0, bonusGoleada: 0, golosGoleada: 99,
  mataMata: false, numPlayoffTeams: 2, sport: 'tennis', ...extra,
});
const F = tennis.format(config());

/** Plays games in order: 'h' for home, 'a' for away. */
function play(games: string, cfg = config()): MatchResult | undefined {
  let res: MatchResult | undefined;
  for (const g of games) res = tennis.addPoint(res, g === 'h' ? 'home' : 'away', cfg);
  return res;
}

describe('tennis', () => {
  it('is registered as a racket sport with its own ratings and no jersey numbers', () => {
    expect(getSport('tennis')).toBe(tennis);
    expect(listSports()).toContain(tennis);
    expect(tennis).toBeInstanceOf(RacketSport);
    expect(tennis.usesJerseyNumbers).toBe(false);
    expect(Object.keys(tennis.ratingAttributes())).toEqual(['serve', 'return', 'forehand', 'backhand', 'volley', 'fitness']);
  });

  it('defaults to best of 3 sets of 6 games with a full deciding set', () => {
    expect(F).toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: false });
  });

  it('plays the deciding set as a normal set, not a super tie-break', () => {
    expect(tennis.isSuperTieBreak(2, F)).toBe(false);
    expect(tennis.setWinner({ home: 10, away: 8 }, 2, F)).toBe('home');
    expect(tennis.setWinner({ home: 7, away: 6 }, 2, F)).toBe('home');
    expect(tennis.setWinner({ home: 6, away: 6 }, 2, F)).toBeNull();
  });

  it('can use a super tie-break or best of 5 when the tournament says so', () => {
    expect(tennis.format(config({ setFormat: { sets: 3, gamesPerSet: 6, superTieBreak: true } })).superTieBreak).toBe(true);
    const five = tennis.format(config({ setFormat: { sets: 5, gamesPerSet: 6, superTieBreak: false } }));
    expect(tennis.matchWinner(tennis.parseSets('6-4 6-4'), five)).toBeNull();
    expect(tennis.matchWinner(tennis.parseSets('6-4 6-4 6-4'), five)).toBe('home');
  });

  it('scores a three-set match game by game and stops once it is decided', () => {
    const res = play('hhhhhh' + 'aaaaaa' + 'hhhhhaaaaahh');
    expect(typeof res === 'object' && res.score).toBe('6-0 0-6 7-5');
    expect(tennis.matchWinner(tennis.setsOf(res), F)).toBe('home');
    const after = tennis.addPoint(res, 'away', config());
    expect(after.score).toBe('6-0 0-6 7-5');
  });

  it('counts every game of the deciding set in the standings', () => {
    expect(tennis.gamesOf(tennis.parseSets('6-4 3-6 7-6'), F)).toEqual({ home: 16, away: 16 });
  });
});

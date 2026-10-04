import { describe, it, expect } from 'vitest';
import {
  bergerRounds,
  generateSchedule,
  buildExtraVolta,
  buildFirstRoundSeeding,
} from '../../src/core/schedule.js';

function pairKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join('-');
}

describe('bergerRounds', () => {
  it.each([4, 5, 6, 7, 8])('com %i equipas, cada par joga exatamente uma vez', (n) => {
    const rounds = bergerRounds(n);
    expect(rounds).toHaveLength(n % 2 === 0 ? n - 1 : n);

    const seen = new Set<string>();
    for (const r of rounds) {
      const inRound = new Set<number>();
      for (const [a, b] of r.pairs) {
        expect(inRound.has(a) || inRound.has(b)).toBe(false);
        inRound.add(a);
        inRound.add(b);
        const key = pairKey(a, b);
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
    expect(seen.size).toBe((n * (n - 1)) / 2);
  });

  it('com número ímpar, cada equipa folga exatamente uma vez', () => {
    const byes = bergerRounds(5).map((r) => r.bye);
    expect(byes.slice().sort()).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('generateSchedule', () => {
  it('a segunda volta inverte casa e fora', () => {
    const { schedule, roundsMeta } = generateSchedule([[0, 1, 2, 3]], 2);
    expect(schedule).toHaveLength(12);
    expect(roundsMeta).toHaveLength(6);
    const first = schedule.slice(0, 6).map((g) => `${g.home}-${g.away}`);
    const second = schedule.slice(6).map((g) => `${g.away}-${g.home}`);
    expect(second).toEqual(first);
  });

  it('mapeia os índices de cada grupo para as equipas reais', () => {
    const { schedule } = generateSchedule([[0, 2], [1, 3]], 1);
    expect(schedule).toEqual([
      { jornada: 1, home: 0, away: 2, group: 0 },
      { jornada: 1, home: 1, away: 3, group: 1 },
    ]);
  });
});

describe('volta extra', () => {
  it('acrescenta a volta no fim, espelhada, sem mexer nos jogos existentes', () => {
    const { schedule, roundsMeta } = generateSchedule([[0, 1, 2, 3]], 1);
    const { games, rounds } = buildExtraVolta(schedule, roundsMeta, 1);
    const full = generateSchedule([[0, 1, 2, 3]], 2);

    expect(games).toEqual(full.schedule.slice(schedule.length));
    expect(rounds).toEqual(full.roundsMeta.slice(roundsMeta.length));
  });

  it('a 3ª volta repete a orientação da 1ª', () => {
    const two = generateSchedule([[0, 1, 2, 3, 4]], 2);
    const three = generateSchedule([[0, 1, 2, 3, 4]], 3);
    const { games, rounds } = buildExtraVolta(two.schedule, two.roundsMeta, 2);

    expect(games).toEqual(three.schedule.slice(two.schedule.length));
    expect(rounds).toEqual(three.roundsMeta.slice(two.roundsMeta.length));
  });
});

describe('eliminatórias - seeding', () => {
  const seeded = (n: number) => buildFirstRoundSeeding(n).map((p) => p.map((s) => s + 1));

  it('emparelha os seeds no padrão de bracket', () => {
    expect(seeded(2)).toEqual([[1, 2]]);
    expect(seeded(4)).toEqual([[1, 4], [2, 3]]);
    expect(seeded(8)).toEqual([[1, 8], [4, 5], [2, 7], [3, 6]]);
    expect(seeded(16)).toEqual([
      [1, 16], [8, 9], [4, 13], [5, 12], [2, 15], [7, 10], [3, 14], [6, 11],
    ]);
  });
});

import { describe, it, expect, vi } from 'vitest';

// algorithms.js importa state.js/utils.js, que por sua vez carregam a UI e o Firebase.
// Os testes só precisam da lógica pura, por isso substituímos esses módulos.
vi.mock('../js/state.js', () => ({ state: { teams: [] } }));
vi.mock('../js/utils.js', () => ({ getTeamName: (i) => `Equipa ${i + 1}` }));

const {
  bergerRounds,
  generateSchedule,
  computeStandings,
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  buildExtraVolta,
  buildFirstRoundSeeding,
  getPlayoffWinner,
  GAME_STATUS,
} = await import('../js/algorithms.js');

const config = {
  numGrupos: 1,
  pontosVitoria: 3,
  pontosEmpate: 1,
  pontosDerrota: 0,
  bonusGoleada: 1,
  golosGoleada: 3,
};

function pairKey(a, b) {
  return [a, b].sort((x, y) => x - y).join('-');
}

describe('bergerRounds', () => {
  it.each([4, 5, 6, 7, 8])('com %i equipas, cada par joga exatamente uma vez', (n) => {
    const rounds = bergerRounds(n);
    expect(rounds).toHaveLength(n % 2 === 0 ? n - 1 : n);

    const seen = new Set();
    for (const r of rounds) {
      const inRound = new Set();
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

describe('computeStandings', () => {
  const teams = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];

  it('soma pontos com bónus de goleada e ignora jogos agendados', () => {
    const schedule = [
      { home: 0, away: 1 },
      { home: 1, away: 2 },
      { home: 2, away: 0 },
    ];
    const results = {
      0: { score: '3-0', status: GAME_STATUS.TERMINADO },
      1: '1-1',
      2: { score: '5-0', status: GAME_STATUS.AGENDADO },
    };
    const [group] = computeStandings(teams, schedule, results, config);
    const byName = Object.fromEntries(group.standings.map((s) => [s.name, s]));
    expect(byName.A.Pts).toBe(4); // vitória + bónus de goleada
    expect(byName.B.Pts).toBe(1);
    expect(byName.C.Pts).toBe(1);
    expect(byName.C.J).toBe(1);
    expect(group.standings[0].name).toBe('A');
  });

  it('desempata pelo confronto direto', () => {
    // A e B acabam iguais em pontos, DG e golos marcados; B venceu o jogo entre eles,
    // por isso fica à frente apesar da ordem alfabética.
    const four = [...teams, { name: 'D' }];
    const schedule = [
      { home: 1, away: 0 },
      { home: 2, away: 1 },
      { home: 0, away: 3 },
    ];
    const results = { 0: '1-0', 1: '1-0', 2: '1-0' };
    const [group] = computeStandings(four, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['C', 'B', 'A', 'D']);
  });

  it('ignora jogos de playoff', () => {
    const [group] = computeStandings(teams, [{ home: 0, away: 1, isPlayoff: true }], { 0: '2-0' }, config);
    expect(group.standings.every((s) => s.J === 0)).toBe(true);
  });

  it('ignora jogos de playoff no confronto direto', () => {
    // A e B empatam na liga; B vence A nas eliminatórias, o que não pode mexer na tabela.
    const two = [{ name: 'A' }, { name: 'B' }];
    const schedule = [
      { home: 0, away: 1 },
      { home: 1, away: 0, isPlayoff: true },
    ];
    const results = { 0: '1-1', 1: '2-0' };
    const [group] = computeStandings(two, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['A', 'B']);
  });
});

describe('ratings e snake draft', () => {
  const p = (name, v) => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });

  it('calcula o rating como média dos atributos', () => {
    expect(getPlayerRating(p('x', 4))).toBe(4);
    expect(getPlayerRating({})).toBe(0);
    expect(getTeamTotalRating([p('x', 4), p('y', 3.5)])).toBe(7.5);
  });

  it('distribui os picks no padrão A, B, B, A, A, B, B, A', () => {
    const players = [8, 7, 6, 5, 4, 3, 2, 1].map((v) => p(`p${v}`, v / 2));
    const { equipaA, equipaB } = snakeDraft(players);
    expect(equipaA.map((x) => x.name)).toEqual(['p8', 'p5', 'p4', 'p1']);
    expect(equipaB.map((x) => x.name)).toEqual(['p7', 'p6', 'p3', 'p2']);
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

describe('eliminatórias', () => {
  const seeded = (n) => buildFirstRoundSeeding(n).map((p) => p.map((s) => s + 1));

  it('emparelha os seeds no padrão de bracket', () => {
    expect(seeded(2)).toEqual([[1, 2]]);
    expect(seeded(4)).toEqual([[1, 4], [2, 3]]);
    expect(seeded(8)).toEqual([[1, 8], [4, 5], [2, 7], [3, 6]]);
    expect(seeded(16)).toEqual([
      [1, 16], [8, 9], [4, 13], [5, 12], [2, 15], [7, 10], [3, 14], [6, 11],
    ]);
  });

  it('decide o vencedor pelo resultado ou pelos penáltis', () => {
    const game = { home: 3, away: 5, isPlayoff: true };
    const done = (score, penalties) => ({ score, penalties, status: GAME_STATUS.TERMINADO });

    expect(getPlayoffWinner(game, done('2-1'))).toBe(3);
    expect(getPlayoffWinner(game, done('0-1'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1', '4-5'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1'))).toBe(null);
    expect(getPlayoffWinner(game, { score: '2-1', status: GAME_STATUS.DECORRER })).toBe(null);
  });
});

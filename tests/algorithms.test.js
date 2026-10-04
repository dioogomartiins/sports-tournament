import { describe, it, expect } from 'vitest';
import {
  bergerRounds,
  generateSchedule,
  computeStandings,
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  buildExtraVolta,
  buildFirstRoundSeeding,
  getPlayoffWinner,
  addGoal,
  removeGoal,
  setGameStatus,
  gameGoals,
  resultEvents,
  balancedDraft,
  tallyPlayerStats,
  mergePlayerStats,
  getChampion,
  buildArchiveEntry,
  archiveTally,
  standingsOrder,
  rankMoves,
  GAME_STATUS,
} from '../src/algorithms.js';

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

describe('equipas equilibradas', () => {
  const p = (name, v) => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });
  const sum = (arr) => arr.reduce((s, x) => s + getPlayerRating(x), 0);
  const gap = ({ equipaA, equipaB }) => Math.round(Math.abs(sum(equipaA) - sum(equipaB)) * 10) / 10;

  it('encontra a divisão perfeita que o snake draft falha', () => {
    const players = [10, 9, 6, 5, 3, 1].map((v) => p(`p${v}`, v / 2));
    expect(gap(snakeDraft(players))).toBe(1);
    const out = balancedDraft(players);
    expect(gap(out)).toBe(0);
    expect(out.equipaA.length).toBe(3);
    expect(out.equipaB.length).toBe(3);
  });

  it('nunca fica pior que o snake draft e mantém o tamanho das equipas', () => {
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let n = 2; n <= 24; n++) {
      const players = Array.from({ length: n }, (_, i) => p(`p${i}`, Math.round(rand() * 50) / 10));
      const out = balancedDraft(players);
      expect(gap(out)).toBeLessThanOrEqual(gap(snakeDraft(players)));
      expect(Math.abs(out.equipaA.length - out.equipaB.length)).toBeLessThanOrEqual(1);
      expect(out.equipaA.length + out.equipaB.length).toBe(n);
    }
  });

  it('lida com um só jogador', () => {
    const out = balancedDraft([p('a', 3)]);
    expect(out.equipaA.length + out.equipaB.length).toBe(1);
  });
});

describe('estatísticas de jogadores', () => {
  const results = {
    0: {
      score: '3-1',
      scorers: { home: ['ana', 'ana', 'auto'], away: ['rui'] },
      assists: { home: ['rui', '', ''], away: ['ze'] },
      mvp: 'ana',
    },
    1: { score: '1-0', scorers: { home: ['rui'], away: [] } },
    2: '2-2',
  };
  const singulares = [{ scorersA: ['ana'], scorersB: [], assistsA: ['ze'], mvp: 'ze' }];

  it('conta golos, assistências, MVP e recorde, sem autogolos', () => {
    const t = tallyPlayerStats(results, singulares);
    expect(t.ana).toEqual({ golos: 3, assistencias: 0, mvp: 1, jogosAMarcar: 2, recorde: 2 });
    expect(t.rui).toEqual({ golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 2, recorde: 1 });
    expect(t.ze).toEqual({ golos: 0, assistencias: 2, mvp: 1, jogosAMarcar: 0, recorde: 0 });
    expect(t.auto).toBeUndefined();
  });

  it('dados antigos sem assistências continuam a contar', () => {
    const t = tallyPlayerStats({ 0: { scorers: { home: ['a'] } } }, [{ scorersA: ['a', 'a'] }]);
    expect(t.a.golos).toBe(3);
    expect(t.a.recorde).toBe(2);
  });

  it('ids como __proto__ não poluem o protótipo de Object', () => {
    const t = tallyPlayerStats(
      { 0: { scorers: { home: ['__proto__', 'constructor'] }, assists: { home: ['__proto__', ''] }, mvp: '__proto__' } },
      [],
    );
    expect(t['__proto__']).toEqual({ golos: 1, assistencias: 1, mvp: 1, jogosAMarcar: 1, recorde: 1 });
    expect(t.constructor.golos).toBe(1);
    expect({}.golos).toBeUndefined();
    expect(Object.golos).toBeUndefined();
  });

  it('junta contagens somando e mantendo o recorde máximo', () => {
    const a = { x: { golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 1, recorde: 2 } };
    const b = { x: { golos: 1, assistencias: 0, mvp: 1, jogosAMarcar: 1, recorde: 1 }, y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 } };
    expect(mergePlayerStats(a, b)).toEqual({
      x: { golos: 3, assistencias: 1, mvp: 1, jogosAMarcar: 2, recorde: 2 },
      y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 },
    });
  });
});

describe('arquivo de torneios', () => {
  const teams = [{ name: 'Leões', color: '#111111' }, { name: 'Águias', color: '#222222' }, { name: 'Dragões', color: '#333333' }];
  const schedule = [{ home: 0, away: 1 }, { home: 1, away: 2 }, { home: 2, away: 0 }];
  const done = (score, extra = {}) => ({ score, status: GAME_STATUS.TERMINADO, scorers: { home: [], away: [] }, ...extra });

  it('campeão é o líder da liga sem eliminatórias', () => {
    const results = { 0: done('2-0'), 1: done('1-1'), 2: done('0-1') };
    const groups = computeStandings(teams, schedule, results, config);
    expect(getChampion(schedule, results, groups)).toBe(0);
    expect(getChampion(schedule, {}, computeStandings(teams, schedule, {}, config))).toBe(null);
  });

  it('com eliminatórias, campeão é o vencedor da final', () => {
    const sch = [...schedule,
      { home: 0, away: 2, isPlayoff: true, playoffMatchId: 'm1', nextMatchId: 'm2_home' },
      { home: 0, away: 1, isPlayoff: true, playoffMatchId: 'm2' }];
    const results = { 0: done('2-0'), 3: done('1-0'), 4: done('1-1', { penalties: '3-4' }) };
    const groups = computeStandings(teams, sch, results, config);
    expect(getChampion(sch, results, groups)).toBe(1);
    expect(getChampion(sch, { 0: done('2-0') }, groups)).toBe(null);
  });

  it('guarda tabela, campeão e jogadores do torneio', () => {
    const results = {
      0: done('2-0', { scorers: { home: ['ana', 'ana'], away: [] }, assists: { home: ['rui', ''], away: [] }, mvp: 'ana' }),
      1: done('1-1', { scorers: { home: ['rui'], away: ['ze'] } }),
      2: { score: '0-0', status: GAME_STATUS.AGENDADO },
    };
    const entry = buildArchiveEntry(
      { config: { ...config, nome: 'Verão' }, teams, schedule, results, scheduleTeamCount: 3 },
      { ana: 'Ana', rui: 'Rui' }, 'id1', '2026-10-02T10:00:00.000Z',
    );
    expect(entry.nome).toBe('Verão');
    expect(entry.campeao).toEqual({ nome: 'Leões', cor: '#111111' });
    expect(entry.jogos).toBe(2);
    expect(entry.golos).toBe(4);
    expect(entry.grupos[0].tabela.map((t) => t.nome)).toEqual(['Leões', 'Dragões', 'Águias']);
    expect(entry.jogadores[0]).toEqual({ pid: 'ana', nome: 'Ana', golos: 2, assistencias: 0, mvp: 1, jogosAMarcar: 1, recorde: 2 });
    expect(entry.jogadores.find((j) => j.pid === 'ze').nome).toBe('Jogador Desconhecido');
    expect(archiveTally(entry).rui).toEqual({ golos: 1, assistencias: 1, mvp: 0, jogosAMarcar: 1, recorde: 1 });
  });
});

describe('golos de um jogo', () => {
  it('soma ao resultado guardado e não ao que estava no ecrã', () => {
    // Outro telemóvel já registou o 1-0; este regista um golo do visitante
    const guardado = { score: '1-0', status: 'decorrer', scorers: { home: ['ana'], away: [] }, assists: { home: [''], away: [] } };
    const novo = addGoal(guardado, 'away', 'rui', 'ze');
    expect(novo.score).toBe('1-1');
    expect(novo.scorers).toEqual({ home: ['ana'], away: ['rui'] });
    expect(novo.assists).toEqual({ home: [''], away: ['ze'] });
    expect(guardado.score).toBe('1-0');
  });

  it('primeiro golo cria o resultado e põe o jogo a decorrer', () => {
    expect(addGoal(undefined, 'home', 'auto', '')).toEqual({
      score: '1-0', status: 'decorrer', scorers: { home: ['auto'], away: [] }, assists: { home: [''] },
    });
    expect(addGoal({ score: '0-0', status: 'agendado', scorers: { home: [], away: [] } }, 'home', 'a', '').status).toBe('decorrer');
  });

  it('resultados antigos só com texto mantêm o marcador', () => {
    expect(addGoal('2-1', 'home', 'a', '').score).toBe('3-1');
    expect(removeGoal('2-1', 'away')).toMatchObject({ score: '2-0', status: 'terminado' });
  });

  it('tirar golo remove o último marcador e a assistência', () => {
    const r = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['c'] } };
    const novo = removeGoal(r, 'home');
    expect(novo.score).toBe('1-0');
    expect(novo.scorers.home).toEqual(['a']);
    expect(novo.assists.home).toEqual(['c']);
    expect(novo.status).toBe('terminado');
  });

  it('com 0 golos ou sem resultado não muda nada', () => {
    const r = { score: '0-1', scorers: { home: [], away: ['x'] } };
    expect(removeGoal(r, 'home')).toBe(r);
    expect(removeGoal(undefined, 'home')).toBeUndefined();
  });
});

describe('estado e golos de um jogo', () => {
  it('muda o estado e converte resultados antigos em texto', () => {
    expect(setGameStatus(undefined, 'decorrer')).toMatchObject({ score: '0-0', status: 'decorrer' });
    expect(setGameStatus('2-1', 'terminado')).toMatchObject({ score: '2-1', status: 'terminado' });
  });

  it('golos de cada equipa pela ordem, com assistências', () => {
    const r = { score: '2-1', scorers: { home: ['a', 'b'], away: ['c'] }, assists: { home: ['', 'x'] } };
    expect(gameGoals(r)).toEqual({
      home: [{ pid: 'a', aid: '' }, { pid: 'b', aid: 'x' }],
      away: [{ pid: 'c', aid: '' }],
    });
    expect(gameGoals('1-0')).toEqual({ home: [], away: [] });
  });
});

describe('eventos para animações', () => {
  const base = { 0: { score: '1-0', status: 'decorrer', scorers: { home: ['a'], away: [] } } };

  it('golo com marcador e assistência', () => {
    const next = { 0: { score: '1-1', status: 'decorrer', scorers: { home: ['a'], away: ['b'] }, assists: { away: ['c'] } } };
    expect(resultEvents(base, next)).toEqual([{ type: 'golo', gi: '0', side: 'away', pid: 'b', aid: 'c' }]);
  });

  it('golo anulado', () => {
    const next = { 0: { score: '0-0', status: 'decorrer', scorers: { home: [], away: [] } } };
    expect(resultEvents(base, next)).toEqual([{ type: 'anulado', gi: '0', side: 'home', pid: 'a' }]);
  });

  it('jogo começou e jogo terminou', () => {
    expect(resultEvents({}, { 1: { score: '0-0', status: 'decorrer' } })).toEqual([{ type: 'inicio', gi: '1' }]);
    expect(resultEvents(base, { 0: { ...base[0], status: 'terminado' } })).toEqual([{ type: 'fim', gi: '0' }]);
  });

  it('primeiro golo num jogo agendado só anima o golo', () => {
    const next = { 1: { score: '1-0', status: 'decorrer', scorers: { home: ['z'] } } };
    expect(resultEvents({ 1: { score: '0-0', status: 'agendado' } }, next).map((e) => e.type)).toEqual(['golo']);
  });

  it('resultado escrito já terminado só anima o fim; sem mudanças não anima', () => {
    expect(resultEvents({}, { 2: { score: '3-1', status: 'terminado' } })).toEqual([{ type: 'fim', gi: '2' }]);
    expect(resultEvents(base, JSON.parse(JSON.stringify(base)))).toEqual([]);
  });
});

describe('rankMoves', () => {
  const groups = (...ids) => ids.map((g) => ({ standings: g.map((idx) => ({ idx })) }));

  it('conta lugares ganhos e perdidos', () => {
    const before = standingsOrder(groups([0, 1, 2, 3]));
    const after = standingsOrder(groups([2, 0, 1, 3]));
    expect(Object.fromEntries(rankMoves(before, after))).toEqual({ 2: 2, 0: -1, 1: -1 });
  });

  it('ignora equipas sem mudança, novas ou noutro grupo', () => {
    const before = standingsOrder(groups([0, 1], [2, 3]));
    const after = standingsOrder(groups([0, 2], [1, 3, 4]));
    expect(rankMoves(before, after).size).toBe(0);
  });

  it('sem classificação anterior não há mudanças', () => {
    expect(rankMoves(null, standingsOrder(groups([0, 1]))).size).toBe(0);
  });
});

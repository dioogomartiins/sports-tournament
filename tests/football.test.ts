import { describe, it, expect } from 'vitest';
import {
  computeStandings,
  getPlayoffWinner,
  addGoal,
  removeGoal,
  setGameStatus,
  gameGoals,
  resultEvents,
  tallyPlayerStats,
  mergePlayerStats,
  standingsOrder,
  rankMoves,
} from '../src/sports/football/Football.js';
import { GAME_STATUS, type Config, type Match, type MatchResult, type Team } from '../src/types.js';

const config: Config = {
  nome: 'Futebol ILOG',
  numEquipas: 8,
  numGrupos: 1,
  numVoltas: 2,
  pontosVitoria: 3,
  pontosEmpate: 1,
  pontosDerrota: 0,
  bonusGoleada: 1,
  golosGoleada: 3,
  mataMata: false,
  numPlayoffTeams: 4,
};

describe('computeStandings', () => {
  const teams: Team[] = [{ name: 'A', color: '#111' }, { name: 'B', color: '#222' }, { name: 'C', color: '#333' }];

  it('soma pontos com bónus de goleada e ignora jogos agendados', () => {
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 2 },
      { jornada: 3, home: 2, away: 0 },
    ];
    const results: Record<string | number, MatchResult> = {
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
    const four: Team[] = [...teams, { name: 'D', color: '#444' }];
    const schedule: Match[] = [
      { jornada: 1, home: 1, away: 0 },
      { jornada: 2, home: 2, away: 1 },
      { jornada: 3, home: 0, away: 3 },
    ];
    const results: Record<string | number, MatchResult> = { 0: '1-0', 1: '1-0', 2: '1-0' };
    const [group] = computeStandings(four, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['C', 'B', 'A', 'D']);
  });

  it('ignora jogos de playoff', () => {
    const [group] = computeStandings(teams, [{ jornada: 1, home: 0, away: 1, isPlayoff: true }], { 0: '2-0' }, config);
    expect(group.standings.every((s) => s.J === 0)).toBe(true);
  });

  it('ignora jogos de playoff no confronto direto', () => {
    // A e B empatam na liga; B vence A nas eliminatórias, o que não pode mexer na tabela.
    const two: Team[] = [{ name: 'A', color: '#111' }, { name: 'B', color: '#222' }];
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 0, isPlayoff: true },
    ];
    const results: Record<string | number, MatchResult> = { 0: '1-1', 1: '2-0' };
    const [group] = computeStandings(two, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['A', 'B']);
  });
});

describe('eliminatórias - playoff winner', () => {
  it('decide o vencedor pelo resultado ou pelos penáltis', () => {
    const game: Match = { jornada: 1, home: 3, away: 5, isPlayoff: true };
    const done = (score: string, penalties?: string): MatchResult => ({ score, penalties, status: GAME_STATUS.TERMINADO });

    expect(getPlayoffWinner(game, done('2-1'))).toBe(3);
    expect(getPlayoffWinner(game, done('0-1'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1', '4-5'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1'))).toBe(null);
    expect(getPlayoffWinner(game, { score: '2-1', status: GAME_STATUS.DECORRER })).toBe(null);
  });
});

describe('estatísticas de jogadores', () => {
  const results: Record<string | number, MatchResult> = {
    0: {
      score: '3-1',
      scorers: { home: ['ana', 'ana', 'auto'], away: ['rui'] },
      assists: { home: ['rui', '', ''], away: ['ze'] },
      mvp: 'ana',
    },
    1: { score: '1-0', scorers: { home: ['rui'], away: [] } },
    2: '2-2',
  };
  const singulares = [{ nomeA: 'Equipa A', nomeB: 'Equipa B', scoreA: 1, scoreB: 0, scorersA: ['ana'], scorersB: [], assistsA: ['ze'], mvp: 'ze' }];

  it('conta golos, assistências, MVP e recorde, sem autogolos', () => {
    const t = tallyPlayerStats(results, singulares);
    expect(t.ana).toEqual({ golos: 3, assistencias: 0, mvp: 1, jogosAMarcar: 2, recorde: 2 });
    expect(t.rui).toEqual({ golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 2, recorde: 1 });
    expect(t.ze).toEqual({ golos: 0, assistencias: 2, mvp: 1, jogosAMarcar: 0, recorde: 0 });
    expect((t as Record<string, unknown>).auto).toBeUndefined();
  });

  it('dados antigos sem assistências continuam a contar', () => {
    const t = tallyPlayerStats({ 0: { scorers: { home: ['a'], away: [] } } }, [{ nomeA: 'A', nomeB: 'B', scoreA: 2, scoreB: 0, scorersA: ['a', 'a'] }]);
    expect(t.a.golos).toBe(3);
    expect(t.a.recorde).toBe(2);
  });

  it('ids como __proto__ não poluem o protótipo de Object', () => {
    const t = tallyPlayerStats(
      { 0: { scorers: { home: ['__proto__', 'constructor'], away: [] }, assists: { home: ['__proto__', ''], away: [] }, mvp: '__proto__' } },
      []
    );
    expect(t['__proto__']).toEqual({ golos: 1, assistencias: 1, mvp: 1, jogosAMarcar: 1, recorde: 1 });
    expect(t.constructor.golos).toBe(1);
    expect(({} as Record<string, unknown>).golos).toBeUndefined();
    expect((Object as unknown as Record<string, unknown>).golos).toBeUndefined();
  });

  it('junta contagens somando e mantendo o recorde máximo', () => {
    const a = { x: { golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 1, recorde: 2 } };
    const b = {
      x: { golos: 1, assistencias: 0, mvp: 1, jogosAMarcar: 1, recorde: 1 },
      y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 },
    };
    expect(mergePlayerStats(a, b)).toEqual({
      x: { golos: 3, assistencias: 1, mvp: 1, jogosAMarcar: 2, recorde: 2 },
      y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 },
    });
  });
});

describe('golos de um jogo', () => {
  it('soma ao resultado guardado e não ao que estava no ecrã', () => {
    // Outro telemóvel já registou o 1-0; este regista um golo do visitante
    const guardado: MatchResult = { score: '1-0', status: 'decorrer', scorers: { home: ['ana'], away: [] }, assists: { home: [''], away: [] } };
    const novo = addGoal(guardado, 'away', 'rui', 'ze');
    expect(novo.score).toBe('1-1');
    expect(novo.scorers).toEqual({ home: ['ana'], away: ['rui'] });
    expect(novo.assists).toEqual({ home: [''], away: ['ze'] });
    expect(guardado.score).toBe('1-0');
  });

  it('primeiro golo cria o resultado e põe o jogo a decorrer', () => {
    expect(addGoal(undefined, 'home', 'auto', '')).toEqual({
      score: '1-0',
      status: 'decorrer',
      scorers: { home: ['auto'], away: [] },
      assists: { home: [''] },
    });
    expect(addGoal({ score: '0-0', status: 'agendado', scorers: { home: [], away: [] } }, 'home', 'a', '').status).toBe('decorrer');
  });

  it('resultados antigos só com texto mantêm o marcador', () => {
    expect(addGoal('2-1', 'home', 'a', '').score).toBe('3-1');
    expect(removeGoal('2-1', 'away')).toMatchObject({ score: '2-0', status: 'terminado' });
  });

  it('tirar golo remove o último marcador e a assistência', () => {
    const r: MatchResult = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['c'] } };
    const novo = removeGoal(r, 'home');
    expect(novo.score).toBe('1-0');
    expect(novo.scorers?.home).toEqual(['a']);
    expect(novo.assists?.home).toEqual(['c']);
    expect(novo.status).toBe('terminado');
  });

  it('com 0 golos ou sem resultado não muda nada', () => {
    const r: MatchResult = { score: '0-1', scorers: { home: [], away: ['x'] } };
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
    const r: MatchResult = { score: '2-1', scorers: { home: ['a', 'b'], away: ['c'] }, assists: { home: ['', 'x'], away: [] } };
    expect(gameGoals(r)).toEqual({
      home: [{ pid: 'a', aid: '' }, { pid: 'b', aid: 'x' }],
      away: [{ pid: 'c', aid: '' }],
    });
    expect(gameGoals('1-0')).toEqual({ home: [], away: [] });
  });
});

describe('eventos para animações', () => {
  const base: Record<string, MatchResult> = {
    0: { score: '1-0', status: 'decorrer', scorers: { home: ['a'], away: [] } },
  };

  it('golo com marcador e assistência', () => {
    const next: Record<string, MatchResult> = {
      0: { score: '1-1', status: 'decorrer', scorers: { home: ['a'], away: ['b'] }, assists: { home: [], away: ['c'] } },
    };
    expect(resultEvents(base, next)).toEqual([{ type: 'golo', gi: '0', side: 'away', pid: 'b', aid: 'c' }]);
  });

  it('golo anulado', () => {
    const next: Record<string, MatchResult> = {
      0: { score: '0-0', status: 'decorrer', scorers: { home: [], away: [] } },
    };
    expect(resultEvents(base, next)).toEqual([{ type: 'anulado', gi: '0', side: 'home', pid: 'a' }]);
  });

  it('jogo começou e jogo terminou', () => {
    expect(resultEvents({}, { 1: { score: '0-0', status: 'decorrer' } })).toEqual([{ type: 'inicio', gi: '1' }]);
    expect(resultEvents(base, { 0: { ...(base[0] as object), status: 'terminado' } })).toEqual([{ type: 'fim', gi: '0' }]);
  });

  it('primeiro golo num jogo agendado só anima o golo', () => {
    const next: Record<string, MatchResult> = {
      1: { score: '1-0', status: 'decorrer', scorers: { home: ['z'], away: [] } },
    };
    expect(resultEvents({ 1: { score: '0-0', status: 'agendado' } }, next).map((e) => e.type)).toEqual(['golo']);
  });

  it('resultado escrito já terminado só anima o fim; sem mudanças não anima', () => {
    expect(resultEvents({}, { 2: { score: '3-1', status: 'terminado' } })).toEqual([{ type: 'fim', gi: '2' }]);
    expect(resultEvents(base, JSON.parse(JSON.stringify(base)))).toEqual([]);
  });
});

describe('rankMoves', () => {
  const groups = (...ids: number[][]) =>
    ids.map((g) => ({
      name: 'Grupo',
      standings: g.map((idx) => ({
        idx,
        name: `Team ${idx}`,
        J: 0,
        V: 0,
        E: 0,
        D: 0,
        GM: 0,
        GS: 0,
        Pts: 0,
      })),
    }));

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

import { describe, it, expect } from 'vitest';
import {
  countPlayedGames,
  getChampion,
  buildArchiveEntry,
  archiveTally,
} from '../../src/core/archive.js';
import { computeStandings } from '../../src/sports/football/Football.js';
import { GAME_STATUS, type Config, type Match, type MatchResult, type Team } from '../../src/types.js';

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

describe('arquivo de torneios', () => {
  const teams: Team[] = [
    { name: 'Leões', color: '#111111' },
    { name: 'Águias', color: '#222222' },
    { name: 'Dragões', color: '#333333' },
  ];
  const schedule: Match[] = [
    { jornada: 1, home: 0, away: 1 },
    { jornada: 2, home: 1, away: 2 },
    { jornada: 3, home: 2, away: 0 },
  ];
  const done = (score: string, extra: Record<string, unknown> = {}): MatchResult => ({
    score,
    status: GAME_STATUS.TERMINADO,
    scorers: { home: [], away: [] },
    ...extra,
  });

  it('campeão é o líder da liga sem eliminatórias', () => {
    const results: Record<string | number, MatchResult> = {
      0: done('2-0'),
      1: done('1-1'),
      2: done('0-1'),
    };
    const groups = computeStandings(teams, schedule, results, config);
    expect(getChampion(schedule, results, groups)).toBe(0);
    expect(getChampion(schedule, {}, computeStandings(teams, schedule, {}, config))).toBe(null);
  });

  it('com eliminatórias, campeão é o vencedor da final', () => {
    const sch: Match[] = [
      ...schedule,
      { jornada: 4, home: 0, away: 2, isPlayoff: true, playoffMatchId: 'm1', nextMatchId: 'm2_home' },
      { jornada: 5, home: 0, away: 1, isPlayoff: true, playoffMatchId: 'm2' },
    ];
    const results: Record<string | number, MatchResult> = {
      0: done('2-0'),
      3: done('1-0'),
      4: done('1-1', { penalties: '3-4' }),
    };
    const groups = computeStandings(teams, sch, results, config);
    expect(getChampion(sch, results, groups)).toBe(1);
    expect(getChampion(sch, { 0: done('2-0') }, groups)).toBe(null);
  });

  it('guarda tabela, campeão e jogadores do torneio', () => {
    const results: Record<string | number, MatchResult> = {
      0: done('2-0', {
        scorers: { home: ['ana', 'ana'], away: [] },
        assists: { home: ['rui', ''], away: [] },
        mvp: 'ana',
      }),
      1: done('1-1', { scorers: { home: ['rui'], away: ['ze'] } }),
      2: { score: '0-0', status: GAME_STATUS.AGENDADO },
    };
    const entry = buildArchiveEntry(
      { config: { ...config, nome: 'Verão' }, teams, schedule, results, scheduleTeamCount: 3 },
      { ana: 'Ana', rui: 'Rui' },
      'id1',
      '2026-10-02T10:00:00.000Z'
    );
    expect(entry.nome).toBe('Verão');
    expect(entry.sport).toBe('football');
    expect(entry.campeao).toEqual({ nome: 'Leões', cor: '#111111' });
    expect(countPlayedGames(results)).toBe(2);
    expect(entry.jogos).toBe(2);
    expect(entry.golos).toBe(4);
    expect(entry.grupos[0].tabela.map((t) => t.nome)).toEqual(['Leões', 'Dragões', 'Águias']);
    expect(entry.jogadores[0]).toEqual({
      pid: 'ana',
      nome: 'Ana',
      golos: 2,
      assistencias: 0,
      mvp: 1,
      jogosAMarcar: 1,
      recorde: 2,
    });
    expect(entry.jogadores.find((j) => j.pid === 'ze')?.nome).toBe('Jogador Desconhecido');
    expect(archiveTally(entry).rui).toEqual({
      golos: 1,
      assistencias: 1,
      mvp: 0,
      jogosAMarcar: 1,
      recorde: 1,
    });

    const entryWithMeta = buildArchiveEntry(
      {
        meta: { name: 'Padel Open', sport: 'padel', status: 'finished', createdAt: 123 },
        config: { ...config, nome: 'Padel Open' },
        teams,
        schedule,
        results,
        scheduleTeamCount: 3,
      },
      {},
      'id2',
      '2026-10-02T10:00:00.000Z'
    );
    expect(entryWithMeta.sport).toBe('padel');
    expect(entryWithMeta.nome).toBe('Padel Open');
  });
});

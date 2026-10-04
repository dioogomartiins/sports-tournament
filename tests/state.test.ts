import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
}));

import { applySnapshot, state, defaultConfig, SNAPSHOT_VERSION, buildSnapshot } from '../src/state.js';
import type { TournamentSnapshot } from '../src/types.js';

describe('state and snapshot versioning', () => {
  beforeEach(() => {
    state.config = null;
    state.teams = null;
    state.squads = null;
    state.schedule = [];
    state.roundsMeta = [];
    state.scheduleTeamCount = 0;
    state.scheduleVoltas = 0;
    state.results = {};
    state.players = [];
    state.jogosSingulares = [];
    state.arquivo = [];
  });

  it('SNAPSHOT_VERSION is 8', () => {
    expect(SNAPSHOT_VERSION).toBe(8);
  });

  it('defaultConfig initializes sport as football', () => {
    const config = defaultConfig();
    expect(config.sport).toBe('football');
    expect(config.nome).toBe('Futebol ILOG');
  });

  it('loads a real version 7 snapshot and assigns football as sport', () => {
    const v7Snapshot: Record<string, unknown> = {
      version: 7,
      exportedAt: '2026-03-01T10:00:00.000Z',
      config: {
        nome: 'Torneio da Primavera',
        numEquipas: 4,
        numGrupos: 1,
        numVoltas: 1,
        pontosVitoria: 3,
        pontosEmpate: 1,
        pontosDerrota: 0,
        bonusGoleada: 1,
        golosGoleada: 3,
        mataMata: false,
        numPlayoffTeams: 4,
        // Notice: version 7 snapshots do NOT have a `sport` field
      },
      teams: [
        { name: 'Águias', color: '#2F7A4F' },
        { name: 'Leões', color: '#C0392B' },
        { name: 'Tigres', color: '#2980B9' },
        { name: 'Panteras', color: '#8E44AD' },
      ],
      squads: [[], [], [], []],
      schedule: [
        { jornada: 1, home: 0, away: 1 },
        { jornada: 1, home: 2, away: 3 },
      ],
      roundsMeta: [{ jornada: 1, bye: null }],
      scheduleTeamCount: 4,
      scheduleVoltas: 1,
      results: {
        0: { score: '2-1', status: 'terminado', scorers: { home: ['p1', 'p1'], away: ['p2'] } },
      },
      players: [
        {
          id: 'p1',
          nome: 'Avançado',
          teamIdx: 0,
          atributos: { velocidade: 80, finalizacao: 85, passe: 70, drible: 75, defesa: 50, fisico: 60 },
        },
        {
          id: 'p2',
          nome: 'Defesa',
          teamIdx: 1,
          atributos: { velocidade: 75, finalizacao: 80, passe: 65, drible: 70, defesa: 55, fisico: 65 },
        },
      ],
      jogosSingulares: [],
      arquivo: [],
    };

    applySnapshot(v7Snapshot as unknown as TournamentSnapshot);

    expect(state.config).toBeDefined();
    expect(state.config?.sport).toBe('football');
    expect(state.config?.nome).toBe('Torneio da Primavera');
    expect(state.teams?.length).toBe(32); // ensureTeamsStructure pads to MAX_TEAMS
    expect(state.teams?.[0].name).toBe('Águias');
    expect(state.schedule.length).toBe(2);
    expect(state.players.length).toBe(2);
  });

  it('buildSnapshot produces a version 8 snapshot with sport football', () => {
    state.config = defaultConfig();
    const snap = buildSnapshot();
    expect(snap.version).toBe(8);
    expect(snap.config.sport).toBe('football');
  });
});

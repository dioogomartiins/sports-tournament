import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
  resyncFromServer: vi.fn(async () => {}),
}));

import {
  applySnapshot,
  state,
  defaultConfig,
  defaultMeta,
  SNAPSHOT_VERSION,
  buildSnapshot,
  setCurrentTournamentId,
  getCurrentTournamentId,
} from '../src/state.js';
import type { TournamentSnapshot } from '../src/types.js';

describe('state and snapshot versioning', () => {
  beforeEach(() => {
    state.currentTournamentId = 'default';
    state.meta = null;
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

  it('SNAPSHOT_VERSION is 11', () => {
    expect(SNAPSHOT_VERSION).toBe(11);
  });

  it('defaultConfig initializes sport as football', () => {
    const config = defaultConfig();
    expect(config.sport).toBe('football');
    expect(config.nome).toBe('Futebol ILOG');
  });

  it('defaultMeta initializes sport as football and active status', () => {
    const meta = defaultMeta();
    expect(meta.sport).toBe('football');
    expect(meta.name).toBe('Futebol ILOG');
    expect(meta.status).toBe('active');
    expect(typeof meta.createdAt).toBe('number');
  });

  it('manages currentTournamentId', () => {
    expect(getCurrentTournamentId()).toBe('default');
    setCurrentTournamentId('padel-2026');
    expect(getCurrentTournamentId()).toBe('padel-2026');
  });

  it('loads a real version 7 snapshot and assigns football as sport and creates meta', () => {
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
        // Notice: version 7 snapshots do NOT have a `sport` or `meta` field
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
    expect(state.meta).toBeDefined();
    expect(state.meta?.sport).toBe('football');
    expect(state.meta?.name).toBe('Torneio da Primavera');
    expect(state.meta?.status).toBe('active');
    expect(state.teams?.length).toBe(32); // ensureTeamsStructure pads to MAX_TEAMS
    expect(state.teams?.[0].name).toBe('Águias');
    expect(state.schedule.length).toBe(2);
    expect(state.players.length).toBe(2);
  });

  it('loads a version 8 snapshot (sport in config, no meta) and derives meta', () => {
    const v8Snapshot = {
      version: 8,
      config: { nome: 'Padel Cup 2026', sport: 'padel', numEquipas: 4, numGrupos: 1, numVoltas: 1 },
      teams: [],
      schedule: [],
      results: {},
    };

    applySnapshot(v8Snapshot as unknown as TournamentSnapshot);

    expect(state.config?.sport).toBe('padel');
    expect(state.meta?.sport).toBe('padel');
    expect(state.meta?.name).toBe('Padel Cup 2026');
    expect(state.meta?.status).toBe('active');
  });

  it('loads a version 9 snapshot with explicit meta', () => {
    const v9Snapshot = {
      version: 9,
      meta: { name: 'Super Liga', sport: 'futsal', status: 'finished' as const, createdAt: 99999 },
      config: { nome: 'Super Liga', sport: 'futsal' },
      teams: [],
      schedule: [],
      results: {},
    };

    applySnapshot(v9Snapshot as unknown as TournamentSnapshot);

    expect(state.meta?.sport).toBe('futsal');
    expect(state.meta?.name).toBe('Super Liga');
    expect(state.meta?.status).toBe('finished');
    expect(state.meta?.createdAt).toBe(99999);
  });

  it('buildSnapshot produces a version 11 snapshot with meta and sport', () => {
    state.config = defaultConfig();
    state.meta = defaultMeta('padel', 'Open Padel');
    const snap = buildSnapshot();
    expect(snap.version).toBe(11);
    expect(snap.config.sport).toBe('football');
    expect(snap.meta.sport).toBe('padel');
    expect(snap.meta.name).toBe('Open Padel');
    expect(snap.meta.status).toBe('active');
  });
});

describe('refused saves', () => {
  it('re-reads the server when a save is refused before the first sync', async () => {
    const firebase = await import('../src/firebase.js');
    vi.mocked(firebase.pushStateToFirebase).mockReturnValueOnce({ ok: false, reason: 'sem-sync' });
    vi.mocked(firebase.resyncFromServer).mockClear();
    const { persistResults } = await import('../src/state.js');
    await persistResults();
    expect(firebase.resyncFromServer).toHaveBeenCalledTimes(1);
  });
});

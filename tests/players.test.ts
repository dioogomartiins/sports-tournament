import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
}));

import {
  defaultPlayerAttrs,
  normalizePlayer,
  normalizePlayers,
} from '../src/sync.js';
import { state, applySnapshot } from '../src/state.js';

describe('defaultPlayerAttrs', () => {
  it('cria atributos a zero para qualquer modalidade', () => {
    const attrs = defaultPlayerAttrs('football');
    expect(attrs).toEqual({
      velocidade: 0,
      finalizacao: 0,
      passe: 0,
      drible: 0,
      defesa: 0,
      fisico: 0,
    });
  });
});

describe('normalizePlayer', () => {
  it('migra atributos antigos de futebol para ratings.football e mantém atributos como alias', () => {
    const legacy = {
      id: 'p1',
      nome: 'Cristiano',
      teamIdx: 0,
      atributos: {
        velocidade: 5,
        finalizacao: 5,
        passe: 4,
        drible: 4,
        defesa: 2,
        fisico: 4,
      },
    };

    const p = normalizePlayer(legacy);
    expect(p.id).toBe('p1');
    expect(p.nome).toBe('Cristiano');
    expect(p.teamIdx).toBe(0);
    expect(p.ratings).toBeDefined();
    expect(p.ratings?.football).toEqual({
      velocidade: 5,
      finalizacao: 5,
      passe: 4,
      drible: 4,
      defesa: 2,
      fisico: 4,
    });
    // Backwards compatibility alias
    expect(p.atributos).toEqual(p.ratings?.football);
  });

  it('preserva ratings de múltiplas modalidades', () => {
    const multi = {
      id: 'p2',
      nome: 'Multiatleta',
      ratings: {
        football: { velocidade: 4, finalizacao: 4, passe: 4, drible: 4, defesa: 4, fisico: 4 },
        padel: { velocidade: 5, finalizacao: 3, passe: 5, drible: 2, defesa: 5, fisico: 3 },
      },
    };

    const p = normalizePlayer(multi);
    expect(p.ratings?.football?.velocidade).toBe(4);
    expect(p.ratings?.padel?.velocidade).toBe(5);
    expect(p.ratings?.padel?.defesa).toBe(5);
    expect(p.atributos).toEqual(p.ratings?.football);
  });

  it('lida com jogador nulo retornando null e objeto vazio criando defaults', () => {
    expect(normalizePlayer(null)).toBeNull();
    const p = normalizePlayer({});
    expect(p?.id).toBeDefined();
    expect(p?.nome).toBe('');
    expect(p?.ratings?.football).toBeDefined();
    expect(p?.atributos).toBeDefined();
  });
});

describe('normalizePlayers', () => {
  it('normaliza um array de jogadores', () => {
    const list = [
      { id: '1', nome: 'A', atributos: { velocidade: 3 } },
      { id: '2', nome: 'B' },
    ];
    const normalized = normalizePlayers(list);
    expect(normalized).toHaveLength(2);
    expect(normalized[0].nome).toBe('A');
    expect(normalized[0].ratings?.football.velocidade).toBe(3);
    expect(normalized[1].nome).toBe('B');
    expect(normalized[1].ratings?.football.velocidade).toBe(0);
  });

  it('normaliza um objeto de jogadores recebido do Firebase Realtime Database', () => {
    const firebaseObj = {
      p1: { id: 'p1', nome: 'Jogador 1', atributos: { velocidade: 4 } },
      p2: { id: 'p2', nome: 'Jogador 2' },
    };
    const normalized = normalizePlayers(firebaseObj);
    expect(normalized).toHaveLength(2);
    expect(normalized.map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('retorna array vazio para undefined ou null', () => {
    expect(normalizePlayers(undefined)).toEqual([]);
    expect(normalizePlayers(null)).toEqual([]);
  });
});

describe('applySnapshot com players', () => {
  it('carrega players globais para state.players', () => {
    const snap = {
      players: {
        p1: { id: 'p1', nome: 'João', ratings: { football: { velocidade: 4 } } },
      },
    };
    applySnapshot(snap);
    expect(state.players).toHaveLength(1);
    expect(state.players[0].nome).toBe('João');
    expect(state.players[0].ratings?.football.velocidade).toBe(4);
  });
});

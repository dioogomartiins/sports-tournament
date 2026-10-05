import { describe, it, expect } from 'vitest';
import {
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  balancedPairs,
  balancedDraft,
  type PlayerWithAttributes,
} from '../../src/core/draft.js';

describe('ratings e snake draft', () => {
  const p = (name: string, v: number): PlayerWithAttributes => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });

  it('calcula o rating como média dos atributos', () => {
    expect(getPlayerRating(p('x', 4))).toBe(4);
    expect(getPlayerRating({})).toBe(0);
    expect(getTeamTotalRating([p('x', 4), p('y', 3.5)])).toBe(7.5);
  });

  it('calcula rating específico para cada modalidade', () => {
    const multiPlayer: PlayerWithAttributes = {
      name: 'Atleta',
      ratings: {
        football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
        padel: { volley: 2, smash: 2, lob: 2, walls: 2, defense: 2, fitness: 2 },
      },
    };
    expect(getPlayerRating(multiPlayer, 'football')).toBe(5);
    expect(getPlayerRating(multiPlayer, 'padel')).toBe(2);
    // Modalidade não registada faz fallback para football
    expect(getPlayerRating(multiPlayer, 'basquetebol')).toBe(5);
    expect(getTeamTotalRating([multiPlayer], 'padel')).toBe(2);
  });

  it('padel só usa os atributos de padel', () => {
    const footballOnly: PlayerWithAttributes = {
      name: 'Avançado',
      ratings: { football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 } },
    };
    expect(getPlayerRating(footballOnly, 'padel')).toBe(0);
    // Old padel ratings saved with football keys count as unrated
    const legacy: PlayerWithAttributes = { name: 'X', ratings: { padel: { velocidade: 4 } } };
    expect(getPlayerRating(legacy, 'padel')).toBe(0);
    const half: PlayerWithAttributes = { name: 'Y', ratings: { padel: { volley: 3, smash: 3, lob: 3 } } };
    expect(getPlayerRating(half, 'padel')).toBe(1.5);
  });

  it('sorteia pares equilibrados: o melhor com o pior', () => {
    const players = [5, 4, 3, 2, 1, 0].map((v) => ({
      name: `p${v}`,
      ratings: { padel: { volley: v, smash: v, lob: v, walls: v, defense: v, fitness: v } },
    }));
    const { pairs, leftOver } = balancedPairs(players, 'padel');
    expect(pairs.map((pr) => pr.map((x) => x.name))).toEqual([['p5', 'p0'], ['p4', 'p1'], ['p3', 'p2']]);
    expect(leftOver).toBeNull();
    const odd = balancedPairs(players.slice(0, 5), 'padel');
    expect(odd.pairs).toHaveLength(2);
    expect(odd.leftOver?.name).toBe('p3');
  });

  it('distribui os picks no padrão A, B, B, A, A, B, B, A', () => {
    const players = [8, 7, 6, 5, 4, 3, 2, 1].map((v) => p(`p${v}`, v / 2));
    const { equipaA, equipaB } = snakeDraft(players);
    expect(equipaA.map((x) => x.name)).toEqual(['p8', 'p5', 'p4', 'p1']);
    expect(equipaB.map((x) => x.name)).toEqual(['p7', 'p6', 'p3', 'p2']);
  });

  it('faz draft equilibrado baseado na modalidade selecionada', () => {
    // p1 é forte no padel (5) mas fraco no futebol (1)
    // p2 é forte no futebol (5) mas fraco no padel (1)
    const p1: PlayerWithAttributes = {
      name: 'Especialista Padel',
      ratings: {
        football: { velocidade: 1, finalizacao: 1, passe: 1, drible: 1, defesa: 1, fisico: 1 },
        padel: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
      },
    };
    const p2: PlayerWithAttributes = {
      name: 'Especialista Futebol',
      ratings: {
        football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
        padel: { velocidade: 1, finalizacao: 1, passe: 1, drible: 1, defesa: 1, fisico: 1 },
      },
    };
    // No padel, draft deve colocar p1 e p2 em equipas opostas
    const draftPadel = balancedDraft([p1, p2], 'padel');
    expect(draftPadel.equipaA.length).toBe(1);
    expect(draftPadel.equipaB.length).toBe(1);
    expect(draftPadel.equipaA[0].name).not.toBe(draftPadel.equipaB[0].name);
  });
});

describe('equipas equilibradas', () => {
  const p = (name: string, v: number): PlayerWithAttributes => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });
  const sum = (arr: PlayerWithAttributes[]) => arr.reduce((s, x) => s + getPlayerRating(x), 0);
  const gap = ({ equipaA, equipaB }: { equipaA: PlayerWithAttributes[]; equipaB: PlayerWithAttributes[] }) =>
    Math.round(Math.abs(sum(equipaA) - sum(equipaB)) * 10) / 10;

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
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
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

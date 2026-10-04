import { describe, it, expect } from 'vitest';
import {
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
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

  it('distribui os picks no padrão A, B, B, A, A, B, B, A', () => {
    const players = [8, 7, 6, 5, 4, 3, 2, 1].map((v) => p(`p${v}`, v / 2));
    const { equipaA, equipaB } = snakeDraft(players);
    expect(equipaA.map((x) => x.name)).toEqual(['p8', 'p5', 'p4', 'p1']);
    expect(equipaB.map((x) => x.name)).toEqual(['p7', 'p6', 'p3', 'p2']);
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

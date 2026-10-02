import { describe, it, expect } from 'vitest';
import { diffSnapshot, normalizeResults, normalizeArquivo, describeUpdates } from '../js/sync.js';

describe('diffSnapshot', () => {
  const base = {
    config: { nome: 'T' },
    schedule: [{ home: 0, away: 1 }],
    results: { 0: { score: '1-0' }, 1: { score: '2-2' } },
  };

  it('sem sincronização anterior envia todas as secções', () => {
    expect(diffSnapshot(null, base)).toEqual(base);
  });

  it('envia só o resultado do jogo alterado', () => {
    const next = { ...base, results: { ...base.results, 1: { score: '3-2' } } };
    expect(diffSnapshot(base, next)).toEqual({ 'results/1': { score: '3-2' } });
  });

  it('apaga resultados removidos e secções esvaziadas', () => {
    const next = { ...base, schedule: [], results: { 0: base.results[0] } };
    expect(diffSnapshot(base, next)).toEqual({ schedule: [], 'results/1': null });
  });

  it('não envia nada quando nada mudou', () => {
    expect(diffSnapshot(base, JSON.parse(JSON.stringify(base)))).toEqual({});
  });
});

describe('normalizeResults', () => {
  it('repõe marcadores vazios e ignora buracos de arrays do Firebase', () => {
    const fromFirebase = [null, { score: '1-0', status: 'terminado' }, { score: '0-0', scorers: { home: ['p1'] } }];
    expect(normalizeResults(fromFirebase)).toEqual({
      1: { score: '1-0', status: 'terminado', scorers: { home: [], away: [] }, assists: { home: [], away: [] } },
      2: { score: '0-0', scorers: { home: ['p1'], away: [] }, assists: { home: [], away: [] } },
    });
  });

  it('mantém as assistências alinhadas com os marcadores', () => {
    const r = normalizeResults({ 0: { score: '2-0', scorers: { home: ['a', 'b'] }, assists: { home: ['', 'a'] } } });
    expect(r[0].assists).toEqual({ home: ['', 'a'], away: [] });
  });

  it('aceita resultados antigos em texto e ausência de resultados', () => {
    expect(normalizeResults({ 0: '2-1' })).toEqual({ 0: '2-1' });
    expect(normalizeResults(undefined)).toEqual({});
  });
});

describe('describeUpdates', () => {
  const snap = {
    teams: [{ name: 'Leões' }, { name: 'Águias' }],
    schedule: [{ home: 0, away: 1 }, { home: 'Vencedor A', away: 1 }],
  };

  it('descreve o resultado com os nomes das equipas', () => {
    const r = { score: '2-1', status: 'terminado', scorers: { home: [], away: [] } };
    expect(describeUpdates({ 'results/0': r, exportedAt: 'x' }, snap))
      .toBe('Resultado Leões vs Águias: 2-1, terminado');
  });

  it('inclui penáltis e resultados apagados', () => {
    expect(describeUpdates({ 'results/1': { score: '1-1', penalties: '4-3' } }, snap))
      .toBe('Resultado Vencedor A vs Águias: 1-1 (g.p. 4-3)');
    expect(describeUpdates({ 'results/0': null }, snap)).toBe('Resultado apagado: Leões vs Águias');
  });

  it('resume secções e ignora metadados', () => {
    expect(describeUpdates({ config: {}, teams: [], exportedAt: 'x', version: 5 }, snap))
      .toBe('Configuração alterada; Equipas alteradas');
    expect(describeUpdates({ exportedAt: 'x', version: 5 }, snap)).toBe('');
  });

  it('resume vários resultados apagados numa só frase', () => {
    expect(describeUpdates({ schedule: [], 'results/0': null, 'results/1': null, arquivo: [] }, snap))
      .toBe('2 resultados apagados; Calendário alterado; Histórico de torneios alterado');
  });

  it('jogo sem calendário usa o número', () => {
    expect(describeUpdates({ 'results/7': { score: '0-0' } }, snap)).toBe('Resultado jogo 8: 0-0');
  });
});

describe('normalizeArquivo', () => {
  it('repõe listas apagadas pelo Firebase', () => {
    expect(normalizeArquivo(undefined)).toEqual([]);
    expect(normalizeArquivo([{ nome: 'T', grupos: [{ nome: 'G' }] }])).toEqual([
      { nome: 'T', grupos: [{ nome: 'G', tabela: [] }], jogadores: [] },
    ]);
  });

  it('converte objetos com chaves numéricas em listas', () => {
    const fb = { 0: { nome: 'A', jogadores: { 0: { pid: 'x' } } }, 2: { nome: 'B' } };
    expect(normalizeArquivo(fb).map((e) => e.nome)).toEqual(['A', 'B']);
    expect(normalizeArquivo(fb)[0].jogadores).toEqual([{ pid: 'x' }]);
  });
});

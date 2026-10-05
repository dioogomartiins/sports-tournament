import { describe, it, expect } from 'vitest';
import {
  diffSnapshot,
  normalizeResults,
  normalizeArquivo,
  describeUpdates,
  onlyMetadata,
  normalizeConfig,
  normalizeMeta,
  legacyRoleUpdates,
} from '../src/sync.js';

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
    expect(diffSnapshot(base, next)).toEqual({ 'schedule/0': null, 'results/1': null });
  });

  it('grava o calendário campo a campo (passar o vencedor de uma eliminatória)', () => {
    const prev = { schedule: [{ home: 0, away: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true }] };
    const next = { schedule: [{ home: 0, away: 1 }, { home: 0, away: 2, isPlayoff: true }] };
    expect(diffSnapshot(prev, next)).toEqual({ 'schedule/1/home': 0 });
  });

  it('jogos novos no calendário vão inteiros', () => {
    const prev = { schedule: [{ home: 0, away: 1 }] };
    const next = { schedule: [{ home: 0, away: 1 }, { home: 1, away: 0 }] };
    expect(diffSnapshot(prev, next)).toEqual({ 'schedule/1': { home: 1, away: 0 } });
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

describe('onlyMetadata', () => {
  it('só data de exportação e versão não contam como alteração', () => {
    expect(onlyMetadata({ exportedAt: 'x', version: 7 })).toBe(true);
    expect(onlyMetadata({})).toBe(true);
    expect(onlyMetadata({ exportedAt: 'x', 'results/0': null })).toBe(false);
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
      .toBe('Result Leões vs Águias: 2-1, terminado');
  });

  it('inclui penáltis e resultados apagados', () => {
    expect(describeUpdates({ 'results/1': { score: '1-1', penalties: '4-3' } }, snap))
      .toBe('Result Vencedor A vs Águias: 1-1 (pen. 4-3)');
    expect(describeUpdates({ 'results/0': null }, snap)).toBe('Result deleted: Leões vs Águias');
  });

  it('resume secções e ignora metadados', () => {
    expect(describeUpdates({ meta: {}, config: {}, teams: [], exportedAt: 'x', version: 5 }, snap))
      .toBe('Tournament details updated; Settings updated; Teams updated');
    expect(describeUpdates({ exportedAt: 'x', version: 5 }, snap)).toBe('');
  });

  it('resume vários resultados apagados numa só frase', () => {
    expect(describeUpdates({ schedule: [], 'results/0': null, 'results/1': null, arquivo: [] }, snap))
      .toBe('2 results deleted; Schedule updated; Tournament history updated');
  });

  it('jogo sem calendário usa o número', () => {
    expect(describeUpdates({ 'results/7': { score: '0-0' } }, snap)).toBe('Result match 8: 0-0');
  });

  it('alterações campo a campo do calendário aparecem uma vez', () => {
    expect(describeUpdates({ 'schedule/3/home': 0, 'schedule/3/away': 1 }, snap)).toBe('Schedule updated');
  });
});

describe('normalizeArquivo', () => {
  it('repõe listas apagadas pelo Firebase e garante campo sport', () => {
    expect(normalizeArquivo(undefined)).toEqual([]);
    expect(normalizeArquivo([{ nome: 'T', grupos: [{ nome: 'G' }] }])).toEqual([
      { nome: 'T', sport: 'football', grupos: [{ nome: 'G', tabela: [] }], jogadores: [] },
    ]);
  });

  it('converte objetos com chaves numéricas em listas', () => {
    const fb = { 0: { nome: 'A', sport: 'padel', jogadores: { 0: { pid: 'x' } } }, 2: { nome: 'B' } };
    expect(normalizeArquivo(fb).map((e) => e.nome)).toEqual(['A', 'B']);
    expect(normalizeArquivo(fb)[0].sport).toBe('padel');
    expect(normalizeArquivo(fb)[1].sport).toBe('football');
    expect(normalizeArquivo(fb)[0].jogadores).toEqual([{ pid: 'x' }]);
  });
});

describe('normalizeConfig', () => {
  it('applies defaults and sets sport to football when undefined', () => {
    const cfg = normalizeConfig();
    expect(cfg.sport).toBe('football');
    expect(cfg.nome).toBe('Futebol ILOG');
    expect(cfg.numEquipas).toBe(8);
  });

  it('sets sport to football when config lacks sport (version <= 7)', () => {
    const cfg = normalizeConfig({ nome: 'Torneio Teste', numEquipas: 6 });
    expect(cfg.sport).toBe('football');
    expect(cfg.nome).toBe('Torneio Teste');
    expect(cfg.numEquipas).toBe(6);
  });

  it('preserves existing sport if present', () => {
    const cfg = normalizeConfig({ sport: 'padel', nome: 'Open Padel' });
    expect(cfg.sport).toBe('padel');
    expect(cfg.nome).toBe('Open Padel');
  });

  it('normalizes empty sport string to football', () => {
    const cfg = normalizeConfig({ sport: '' });
    expect(cfg.sport).toBe('football');
  });
});

describe('normalizeMeta', () => {
  it('creates default meta when undefined', () => {
    const meta = normalizeMeta();
    expect(meta.sport).toBe('football');
    expect(meta.name).toBe('Futebol ILOG');
    expect(meta.status).toBe('active');
    expect(typeof meta.createdAt).toBe('number');
  });

  it('inherits from config when meta is missing fields', () => {
    const meta = normalizeMeta({}, { nome: 'Meu Torneio', sport: 'padel' });
    expect(meta.name).toBe('Meu Torneio');
    expect(meta.sport).toBe('padel');
    expect(meta.status).toBe('active');
  });

  it('preserves valid meta fields', () => {
    const meta = normalizeMeta({
      id: 'tourney-1',
      name: 'Custom',
      sport: 'basketball',
      status: 'finished',
      createdAt: 12345,
    });
    expect(meta.id).toBe('tourney-1');
    expect(meta.name).toBe('Custom');
    expect(meta.sport).toBe('basketball');
    expect(meta.status).toBe('finished');
    expect(meta.createdAt).toBe(12345);
  });
});


describe('legacyRoleUpdates', () => {
  it('copies roles of users without a role in users', () => {
    const utilizadores = { a: { role: 'admin' }, u: { role: 'user' }, x: { role: 'hacker' }, n: null };
    const users = { a: { role: null }, u: {} };
    expect(legacyRoleUpdates(utilizadores, users)).toEqual({
      'users/a/role': 'admin',
      'users/a/admin/football': true,
      'users/u/role': 'user',
    });
  });

  it('keeps roles already set in users', () => {
    expect(legacyRoleUpdates({ a: { role: 'admin' } }, { a: { role: 'user' } })).toEqual({});
    expect(legacyRoleUpdates(null, null)).toEqual({});
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
  initFirebaseListener: vi.fn(),
  onFirebaseStateChange: vi.fn(),
  onFirebasePushError: vi.fn(),
  setSyncedSnapshot: vi.fn(),
  initAuth: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOutUser: vi.fn(),
  getCurrentUser: vi.fn(),
  listenUsers: vi.fn(),
  listenLog: vi.fn(),
  setUserRole: vi.fn(),
  listenTournaments: vi.fn(),
  createTournament: vi.fn(),
  finishTournament: vi.fn(),
  setActiveTournamentId: vi.fn(),
}));

import { renderTournamentsList, renderHeaderTournament } from '../src/ui/torneios.js';
import { dom } from '../src/ui/dom.js';
import { getLastViewedTournamentId, setLastViewedTournamentId } from '../src/main.js';

interface MockElement {
  innerHTML?: string;
  textContent?: string;
  dataset?: Record<string, string>;
  querySelectorAll?: (selector: string) => MockElement[];
  addEventListener?: (event: string, handler: (e?: unknown) => void) => void;
}

type ListenerFn = (e?: unknown) => void;

describe('ui/torneios', () => {
  let mockContainer: MockElement;
  let mockTitle: MockElement;
  let mockBadge: MockElement;

  beforeEach(() => {
    mockContainer = {
      innerHTML: '',
      querySelectorAll: vi.fn(() => []),
    };
    mockTitle = { textContent: '' };
    mockBadge = { textContent: '' };

    dom.listaTorneiosAtivos = mockContainer as unknown as HTMLElement;
    dom.tournamentTitle = mockTitle as unknown as HTMLElement;
    dom.headerSportBadge = mockBadge as unknown as HTMLElement;
  });

  it('exibe mensagem vazia se não houver torneios ativos', () => {
    renderTournamentsList([], 'default', vi.fn(), vi.fn());
    expect(mockContainer.innerHTML).toContain('Não há torneios ativos de momento');
  });

  it('filtra torneios terminados e lista apenas ativos no HTML gerado', () => {
    const list = [
      { id: 't1', name: 'Torneio Ativo', sport: 'football', status: 'active', createdAt: 1000 },
      { id: 't2', name: 'Torneio Arquivado', sport: 'padel', status: 'finished', createdAt: 2000 },
    ];
    renderTournamentsList(list, 't1', vi.fn(), vi.fn());

    expect(mockContainer.innerHTML).toContain('Torneio Ativo');
    expect(mockContainer.innerHTML).not.toContain('Torneio Arquivado');
    expect(mockContainer.innerHTML).toContain('data-tid="t1"');
    expect(mockContainer.innerHTML).not.toContain('data-tid="t2"');
  });

  it('destaca o torneio atual e mostra o botão Terminar Torneio com data-requires="admin"', () => {
    const list = [
      { id: 't1', name: 'Torneio Futebol', sport: 'football', status: 'active', createdAt: 1000 },
      { id: 't2', name: 'Torneio Padel', sport: 'padel', status: 'active', createdAt: 2000 },
    ];
    renderTournamentsList(list, 't1', vi.fn(), vi.fn());

    expect(mockContainer.innerHTML).toContain('torneio-card active');
    expect(mockContainer.innerHTML).toContain('✓ A ver agora');
    expect(mockContainer.innerHTML).toContain('btn-terminar-torneio');
    expect(mockContainer.innerHTML).toContain('data-requires="admin"');
    expect(mockContainer.innerHTML).toContain('btn-trocar-torneio');
  });

  it('anexa listeners de seleção e terminar torneio', () => {
    const card1Listeners: Record<string, ListenerFn> = {};
    const finishListeners: Record<string, ListenerFn> = {};
    const card2Listeners: Record<string, ListenerFn> = {};

    const mockCard1: MockElement = {
      dataset: { tid: 't1' },
      addEventListener: vi.fn((ev, cb) => { card1Listeners[ev] = cb; }),
    };
    const mockCard2: MockElement = {
      dataset: { tid: 't2' },
      addEventListener: vi.fn((ev, cb) => { card2Listeners[ev] = cb; }),
    };
    const mockBtnFinish: MockElement = {
      dataset: { tid: 't1' },
      addEventListener: vi.fn((ev, cb) => { finishListeners[ev] = cb; }),
    };

    mockContainer.querySelectorAll = vi.fn((selector: string) => {
      if (selector === '.torneio-card') return [mockCard1, mockCard2];
      if (selector === '.btn-terminar-torneio') return [mockBtnFinish];
      return [];
    });

    const onSelect = vi.fn();
    const onFinish = vi.fn();

    const list = [
      { id: 't1', name: 'T1', sport: 'football', status: 'active', createdAt: 1000 },
      { id: 't2', name: 'T2', sport: 'padel', status: 'active', createdAt: 2000 },
    ];
    renderTournamentsList(list, 't1', onSelect, onFinish);

    // Clicar em terminar torneio no botão
    expect(finishListeners['click']).toBeDefined();
    finishListeners['click']({ stopPropagation: vi.fn() });
    expect(onFinish).toHaveBeenCalledWith('t1');

    // Clicar no card 2 para trocar de torneio
    expect(card2Listeners['click']).toBeDefined();
    card2Listeners['click']({
      target: mockCard2,
      closest: vi.fn(() => null),
    });
    expect(onSelect).toHaveBeenCalledWith('t2');
  });

  it('renderHeaderTournament atualiza título e modalidade', () => {
    renderHeaderTournament({ name: 'Liga de Primavera', sport: 'padel' });
    expect(mockTitle.textContent).toBe('Liga de Primavera');
    expect(mockBadge.textContent).toContain('Padel');
  });
});

describe('Persistência de dispositivo (last viewed tournament)', () => {
  let storageMap: Record<string, string>;

  beforeEach(() => {
    storageMap = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => storageMap[key] || null),
      setItem: vi.fn((key: string, val: string) => { storageMap[key] = String(val); }),
      removeItem: vi.fn((key: string) => { delete storageMap[key]; }),
      clear: vi.fn(() => { storageMap = {}; }),
    };
    vi.stubGlobal('localStorage', mockStorage);
  });

  it('devolve default se não existir torneio no localStorage', () => {
    expect(getLastViewedTournamentId()).toBe('default');
  });

  it('guarda e recupera o ID do torneio visualizado', () => {
    setLastViewedTournamentId('t_primavera_2026');
    expect(getLastViewedTournamentId()).toBe('t_primavera_2026');
  });

  it('remove o item se for passado null/vazio', () => {
    setLastViewedTournamentId('t1');
    expect(getLastViewedTournamentId()).toBe('t1');
    setLastViewedTournamentId('');
    expect(getLastViewedTournamentId()).toBe('default');
  });
});

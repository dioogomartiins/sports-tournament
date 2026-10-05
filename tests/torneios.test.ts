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

import { renderHeaderTournament } from '../src/ui/tournaments.js';
import { activeTournaments, sportBadge } from '../src/components/TournamentList.js';
import { dom } from '../src/ui/dom.js';
import { getLastViewedTournamentId, setLastViewedTournamentId } from '../src/main.js';

describe('tournament list', () => {
  it('keeps only active tournaments', () => {
    const list = [
      { id: 't1', name: 'Active', sport: 'football', status: 'active' as const, createdAt: 1000 },
      { id: 't2', name: 'Archived', sport: 'padel', status: 'finished' as const, createdAt: 2000 },
    ];
    expect(activeTournaments(list).map((t) => t.id)).toEqual(['t1']);
    expect(activeTournaments(null)).toEqual([]);
  });

  it('labels each sport with its icon, falling back to football', () => {
    expect(sportBadge('padel')).toBe('🎾 Padel');
    expect(sportBadge('futebol')).toBe('⚽ Football');
    expect(sportBadge(undefined)).toBe('⚽ Football');
    expect(sportBadge('curling')).toBe('⚽ Football');
  });
});

describe('ui/tournaments header', () => {
  let title: { textContent: string };
  let badge: { textContent: string };

  beforeEach(() => {
    title = { textContent: '' };
    badge = { textContent: '' };
    dom.tournamentTitle = title as unknown as HTMLElement;
    dom.headerSportBadge = badge as unknown as HTMLElement;
  });

  it('shows the tournament name and sport', () => {
    renderHeaderTournament({ name: 'Spring League', sport: 'padel' });
    expect(title.textContent).toBe('Spring League');
    expect(badge.textContent).toBe('🎾 Padel');
  });

  it('falls back to a generic title', () => {
    renderHeaderTournament(null);
    expect(title.textContent).toBe('Tournament');
    expect(badge.textContent).toBe('⚽ Football');
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

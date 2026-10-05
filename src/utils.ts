import { state } from './state.js';
import type { PlayerIndex, Team, ArchiveEntry, Match } from './types.js';

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function numOr(v: unknown, fallback: number): number {
  const n = parseFloat(String(v));
  return isFinite(n) ? n : fallback;
}

export function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] || c));
}

/** Accepts only hex colors (#rgb or #rrggbb); any other value falls back to the default color. */
export function safeColor(c: unknown): string {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c)) ? String(c) : '#2F7A4F';
}

export function fmtTimestamp(iso: string | number): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return String(iso);
  }
}

export function fmtDate(isoOrMillis: string | number): string {
  try {
    const d = new Date(isoOrMillis);
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return String(isoOrMillis);
  }
}

export function getTeamName(idx: number | string): string {
  if (typeof idx === 'string') return idx;
  const teams = state.teams as Team[] | null | undefined;
  const t = teams?.[idx];
  return t && t.name ? t.name : `Team ${idx + 1}`;
}

/** Name of a match side: the team, or both players of a rotating pair ("Ana / Rui"). */
export function sideName(game: Match, side: 'home' | 'away'): string {
  const partner = game.partners?.[side];
  const first = getTeamName(game[side]);
  return typeof partner === 'number' ? `${first} / ${getTeamName(partner)}` : first;
}

export function getActiveTeamNames(): string[] {
  const arr: string[] = [];
  const count = state.scheduleTeamCount || 0;
  for (let i = 0; i < count; i++) {
    arr.push(getTeamName(i));
  }
  return arr;
}

/**
 * Builds a player index map pId -> { name, team } traversing squads once to avoid O(n^2) lookups.
 */
export function buildPlayerIndex(): PlayerIndex {
  const index: PlayerIndex = {};
  (state.players || []).forEach((p: { id: string; nome: string; teamIdx?: number | null }) => {
    const tName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'No Team';
    index[p.id] = { name: p.nome, team: tName };
  });
  (state.squads || []).forEach((squad: Array<{ id: string; name: string }>, teamIndex: number) => {
    (squad || []).forEach((player: { id: string; name: string }) => {
      index[player.id] = { name: player.name, team: getTeamName(teamIndex) };
    });
  });
  return index;
}

/** Resolves player display name from database, squads or archive. */
export function playerName(pid: string): string {
  const info = buildPlayerIndex()[pid];
  if (info) return info.name;
  const archive = state.arquivo as ArchiveEntry[] | null | undefined;
  for (const e of archive || []) {
    const j = (e.jogadores || []).find((x: { pid: string; nome: string }) => x.pid === pid);
    if (j) return j.nome;
  }
  return 'Unknown Player';
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

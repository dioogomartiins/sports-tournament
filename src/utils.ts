import { state } from './state.js';
import type { PlayerIndex, Team, ArchiveEntry } from './types.js';

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

export function fmtTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

export function getTeamName(idx: number | string): string {
  if (typeof idx === 'string') return idx;
  const teams = state.teams as Team[] | null | undefined;
  const t = teams?.[idx];
  return t && t.name ? t.name : `Equipa ${idx + 1}`;
}

export function getTeamDisplay(idx: number | string): string {
  if (typeof idx === 'string') {
    return `<span style="color:var(--ink-faint); font-style:italic; font-size:12px;">${escapeHtml(idx)}</span>`;
  }
  const teams = state.teams as Team[] | null | undefined;
  const t = teams?.[idx] || { name: `Equipa ${idx + 1}`, color: '#2F7A4F' };
  const name = escapeHtml(t.name || `Equipa ${idx + 1}`);
  const colorBadge = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${safeColor(t.color)}; margin-right:6px; box-shadow:0 0 2px rgba(0,0,0,0.3);"></span>`;
  return `<span style="display:inline-flex; align-items:center; white-space:nowrap;">${colorBadge}${name}</span>`;
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
    const tName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'Sem Equipa';
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
  return 'Jogador Desconhecido';
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

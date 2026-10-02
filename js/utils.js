import { state } from './state.js';

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function numOr(v, fallback) {
  const n = parseFloat(v);
  return isFinite(n) ? n : fallback;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/** Aceita só cores hex (#rgb ou #rrggbb); qualquer outro valor volta à cor por defeito. */
export function safeColor(c) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c)) ? c : '#2F7A4F';
}

export function fmtTimestamp(iso) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  } catch (e) {
    return iso;
  }
}

export function getTeamName(idx) {
  if (typeof idx === 'string') return idx;
  const t = state.teams[idx];
  return t && t.name ? t.name : `Equipa ${idx + 1}`;
}

export function getTeamDisplay(idx) {
  if (typeof idx === 'string') {
    return `<span style="color:var(--ink-faint); font-style:italic; font-size:12px;">${escapeHtml(idx)}</span>`;
  }
  const t = state.teams[idx] || { name: `Equipa ${idx + 1}`, color: '#2F7A4F' };
  const name = escapeHtml(t.name || `Equipa ${idx + 1}`);
  const colorBadge = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${safeColor(t.color)}; margin-right:6px; box-shadow:0 0 2px rgba(0,0,0,0.3);"></span>`;
  return `<span style="display:inline-flex; align-items:center; white-space:nowrap;">${colorBadge}${name}</span>`;
}

export function getActiveTeamNames() {
  const arr = [];
  for (let i = 0; i < state.scheduleTeamCount; i++) {
    arr.push(getTeamName(i));
  }
  return arr;
}

/**
 * Constrói um índice pId → { name, team } percorrendo os plantéis uma única vez,
 * evitando a busca O(n²) anterior.
 */
export function buildPlayerIndex() {
  const index = {};
  state.players.forEach((p) => {
    const tName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'Sem Equipa';
    index[p.id] = { name: p.nome, team: tName };
  });
  state.squads.forEach((squad, teamIndex) => {
    squad.forEach((player) => {
      index[player.id] = { name: player.name, team: getTeamName(teamIndex) };
    });
  });
  return index;
}

/** Nome de um jogador (base de dados, plantéis ou arquivo). */
export function playerName(pid) {
  const info = buildPlayerIndex()[pid];
  if (info) return info.name;
  for (const e of state.arquivo) {
    const j = e.jogadores.find((x) => x.pid === pid);
    if (j) return j.nome;
  }
  return 'Jogador Desconhecido';
}

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// ---------------------------------------------------------------------------
// Global Application State & Persistence
// ---------------------------------------------------------------------------

import type { TemplateResult } from 'lit';
import { generateSchedule } from './algorithms.js';
import { americanoRounds, mexicanoRound, rotationSchedule, type RotationFormat } from './core/americano.js';
import { pushStateToFirebase, getSyncedSnapshot, getCurrentRole, resyncFromServer } from './firebase.js';
import {
  normalizeResults,
  normalizeArquivo,
  normalizeConfig,
  normalizeMeta,
  normalizePlayer,
  normalizePlayers,
  defaultPlayerAttrs,
} from './sync.js';
import type {
  TournamentSnapshot,
  TournamentMeta,
  Config,
  Team,
  SquadPlayer,
  Match,
  RoundMeta,
  Score,
  Player,
  SingleMatch,
  ArchiveEntry,
} from './types.js';
import { en } from './i18n/en.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
// 10: config.setFormat (padel) and per-sport rating attribute keys
// 11: padel Americano / Mexicano (config.padelFormat, config.matchPoints, schedule[].partners)
// 12: archived players' played / won, config.winPoints (padel and tennis)
export const SNAPSHOT_VERSION = 12;
export const MAX_TEAMS = 32;
const DEFAULT_COLOR = '#2F7A4F';

// ---------------------------------------------------------------------------
// UI Notifications and Rendering Hooks
// Registered by main.js at startup via setStateHooks, so state.ts does not import ui.js.
// ---------------------------------------------------------------------------
export interface StateHooks {
  flashError?: () => void;
  flashSaved?: () => void;
  flashBackup?: (exportedAt?: string) => void;
  showToast?: (msg: string, type?: 'ok' | 'error') => void;
  openConfirm?: (title: string, message: string | TemplateResult, onConfirm: () => void | Promise<void>) => void;
  renderAll?: () => void;
}

const ui: Required<StateHooks> = {
  flashError() {},
  flashSaved() {},
  flashBackup() {},
  showToast() {},
  openConfirm() {},
  renderAll() {},
};

export function setStateHooks(hooks: StateHooks): void {
  Object.assign(ui, hooks);
}

// ---------------------------------------------------------------------------
// Theme (dark mode)
// ---------------------------------------------------------------------------
export let currentTheme: string =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('torneio_theme') || 'light'
    : 'light';

export function setCurrentTheme(t: string): void {
  currentTheme = t;
}

// ---------------------------------------------------------------------------
// Default Data Structures
// ---------------------------------------------------------------------------
export function defaultConfig(): Config {
  return normalizeConfig();
}

export function defaultMeta(sport?: string, name?: string): TournamentMeta {
  return normalizeMeta({}, { sport, nome: name });
}

export function ensureTeamsStructure(arr?: unknown[]): Team[] {
  const out: Team[] = (arr || []).slice(0, MAX_TEAMS).map((t, i) => {
    if (typeof t === 'object' && t !== null && 'name' in t) {
      const obj: Team = {
        name: String((t as { name: unknown }).name),
        color: String((t as { color?: unknown }).color || DEFAULT_COLOR),
      };
      if ('group' in t && typeof (t as { group?: unknown }).group === 'number') {
        obj.group = (t as { group: number }).group;
      }
      return obj;
    }
    return {
      name: typeof t === 'string' ? t : `Team ${i + 1}`,
      color: DEFAULT_COLOR,
    };
  });

  while (out.length < MAX_TEAMS) {
    out.push({ name: '', color: DEFAULT_COLOR });
  }

  return out;
}

export function defaultTeams(): Team[] {
  return ensureTeamsStructure([]);
}

export function defaultSquads(): SquadPlayer[][] {
  const arr: SquadPlayer[][] = [];
  for (let i = 0; i < MAX_TEAMS; i++) arr.push([]);
  return arr;
}

export function ensureSquadsLength(arr?: unknown[]): SquadPlayer[][] {
  const out: SquadPlayer[][] = (arr || [])
    .map((s) => (Array.isArray(s) ? (s as SquadPlayer[]) : []))
    .slice(0, MAX_TEAMS);
  while (out.length < MAX_TEAMS) out.push([]);
  return out;
}

// ---------------------------------------------------------------------------
// Global Application State
// ---------------------------------------------------------------------------
export interface AppState {
  currentTournamentId: string;
  meta: TournamentMeta | null;
  config: Config | null;
  teams: Team[] | null;
  squads: SquadPlayer[][] | null;
  schedule: Match[];
  roundsMeta: RoundMeta[];
  scheduleTeamCount: number;
  scheduleVoltas: number;
  results: Record<string | number, Score | string>;
  players: Player[];
  jogosSingulares: SingleMatch[];
  arquivo: ArchiveEntry[];
}

export const state: AppState = {
  currentTournamentId: 'default',
  meta: null,
  config: null,
  teams: null,
  squads: null,
  schedule: [],
  roundsMeta: [],
  scheduleTeamCount: 0,
  scheduleVoltas: 0,
  results: {},
  players: [],
  jogosSingulares: [],
  arquivo: [],
};

/** The tournament settings. They load before any handler runs, so a missing one is a bug. */
export function loadedConfig(): Config {
  if (!state.config) throw new Error('Tournament config not loaded');
  return state.config;
}

export function loadedTeams(): Team[] {
  if (!state.teams) throw new Error('Teams not loaded');
  return state.teams;
}

export function loadedSquads(): SquadPlayer[][] {
  if (!state.squads) throw new Error('Squads not loaded');
  return state.squads;
}

export function setCurrentTournamentId(id: string): void {
  state.currentTournamentId = id || 'default';
}

export function getCurrentTournamentId(): string {
  return state.currentTournamentId || 'default';
}

// ---------------------------------------------------------------------------
// Persistence Layer (localStorage with in-memory fallback)
// ---------------------------------------------------------------------------
const memoryFallback: Record<string, string> = {};
let storageWarned = false;
const noStorage = typeof window === 'undefined' || typeof window.localStorage === 'undefined';
const STORAGE_PREFIX = 'torneio_ilog_';

export function warnNoStorage(): void {
  if (storageWarned) return;
  storageWarned = true;
  ui.showToast(en.toasts.browserStorageBlocked, 'error');
}

/** Async to facilitate future migration to IndexedDB without breaking caller APIs. */
export async function storageGet(key: string): Promise<{ value: string } | null> {
  if (noStorage) {
    warnNoStorage();
    return key in memoryFallback ? { value: memoryFallback[key] } : null;
  }
  try {
    const result = window.localStorage.getItem(STORAGE_PREFIX + key);
    return result !== null ? { value: result } : null;
  } catch {
    return null;
  }
}

/** Async to facilitate future migration to IndexedDB without breaking caller APIs. */
export async function storageSet(key: string, value: string): Promise<{ value: string } | null> {
  if (noStorage) {
    warnNoStorage();
    memoryFallback[key] = value;
    return { value };
  }
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, value);
    return { value };
  } catch {
    ui.flashError();
    return null;
  }
}

// ---------------------------------------------------------------------------
// Player Normalization Helpers
// ---------------------------------------------------------------------------
export { defaultPlayerAttrs, normalizePlayer, normalizePlayers };

// ---------------------------------------------------------------------------
// Snapshot — Serialization & Deserialization
// ---------------------------------------------------------------------------
export function buildSnapshot(): TournamentSnapshot {
  const config = JSON.parse(JSON.stringify(state.config || defaultConfig()));
  return {
    version: SNAPSHOT_VERSION,
    exportedAt: new Date().toISOString(),
    meta: JSON.parse(JSON.stringify(state.meta || defaultMeta(config.sport, config.nome))),
    config,
    teams: JSON.parse(JSON.stringify(state.teams || defaultTeams())),
    squads: JSON.parse(JSON.stringify(state.squads || defaultSquads())),
    schedule: state.schedule.slice(),
    roundsMeta: state.roundsMeta.slice(),
    scheduleTeamCount: state.scheduleTeamCount,
    scheduleVoltas: state.scheduleVoltas,
    results: JSON.parse(JSON.stringify(state.results)),
    players: JSON.parse(JSON.stringify(state.players)),
    jogosSingulares: JSON.parse(JSON.stringify(state.jogosSingulares)),
    arquivo: JSON.parse(JSON.stringify(state.arquivo)),
  };
}

export function validateSnapshot(s: unknown): s is TournamentSnapshot {
  if (!s || typeof s !== 'object') return false;
  const snap = s as Record<string, unknown>;
  if (!snap.config || !Array.isArray(snap.teams) || !Array.isArray(snap.schedule)) return false;
  if (!snap.results || typeof snap.results !== 'object') return false;
  return true;
}

export function applySnapshot(s: Partial<TournamentSnapshot>): void {
  state.config = normalizeConfig(s.config);
  state.meta = normalizeMeta(s.meta, state.config);
  state.teams = ensureTeamsStructure(s.teams);
  state.squads = ensureSquadsLength(s.squads);
  state.schedule = (s.schedule as Match[]) || [];
  state.roundsMeta = (s.roundsMeta as RoundMeta[]) || [];
  state.scheduleTeamCount = s.scheduleTeamCount || state.config.numEquipas;
  state.scheduleVoltas = s.scheduleVoltas || state.config.numVoltas;
  state.results = normalizeResults(s.results);
  state.players = normalizePlayers(s.players);
  state.jogosSingulares = (s.jogosSingulares as SingleMatch[]) || [];
  if (s.arquivo) {
    state.arquivo = normalizeArquivo(s.arquivo);
  }
}

// ---------------------------------------------------------------------------
// Layer Persistence (config, schedule, results, backup)
// ---------------------------------------------------------------------------
export async function persistBackup(): Promise<void> {
  const snap = buildSnapshot();
  await storageSet('backup', JSON.stringify(snap));
  ui.flashBackup(snap.exportedAt);
  const res = pushStateToFirebase(snap);
  if (!res.ok) await rejectLocalChange(res.reason);
}

const REJECT_MESSAGES: Record<string, string> = {
  'sem-sync': en.toasts.dbStillConnecting,
  'sem-sessao': en.toasts.dbSignInRequired,
  'sem-torneio': en.toasts.noTournamentToSave,
};

let lastErrorToast = { msg: '', at: 0 };

/** Displays a save error without repeating the toast if triggered in rapid succession. */
function showSaveError(msg: string): void {
  const now = Date.now();
  if (msg === lastErrorToast.msg && now - lastErrorToast.at < 2000) return;
  lastErrorToast = { msg, at: now };
  ui.showToast(msg, 'error');
}

/** Firebase rejected a push that was already applied locally (server value will revert). */
export function notifyPushError(err?: { code?: string; message?: string } | Error): void {
  const codeOrMsg = String((err && ('code' in err ? err.code : err.message)) || '');
  const denied = /permission/i.test(codeOrMsg);
  showSaveError(
    denied
      ? en.toasts.dbRejectedPermission
      : en.toasts.dbSaveFailed,
  );
}

/** Undoes a local change that could not be saved to Firebase. */
async function rejectLocalChange(reason?: string): Promise<void> {
  let msg = reason ? REJECT_MESSAGES[reason] : undefined;
  if (!msg) {
    msg =
      getCurrentRole() === 'user'
        ? en.toasts.onlyAdminCanChange
        : en.toasts.accountNotApproved;
  }
  showSaveError(msg);

  const synced = getSyncedSnapshot();
  // Not synced yet (the first read has not arrived): read the server instead,
  // so the refused change does not stay in the local cache
  if (!validateSnapshot(synced)) {
    await resyncFromServer();
    return;
  }
  applySnapshot(synced);
  await storeAllLayers();
  ui.renderAll();
}

export async function persistConfigTeams(): Promise<void> {
  await storageSet(
    'config-teams',
    JSON.stringify({
      meta: state.meta,
      config: state.config,
      teams: state.teams,
      squads: state.squads,
    }),
  );
  ui.flashSaved();
  await persistBackup();
}

export async function persistSchedule(): Promise<void> {
  await storageSet(
    'schedule',
    JSON.stringify({
      schedule: state.schedule,
      roundsMeta: state.roundsMeta,
      scheduleTeamCount: state.scheduleTeamCount,
      scheduleVoltas: state.scheduleVoltas,
    }),
  );
  ui.flashSaved();
  await persistBackup();
}

export async function persistResults(): Promise<void> {
  await storageSet('results', JSON.stringify(state.results));
  ui.flashSaved();
  await persistBackup();
}

export async function persistPlayers(): Promise<void> {
  await storageSet('players', JSON.stringify(state.players));
  ui.flashSaved();
  await persistBackup();
}

export async function persistJogosSingulares(): Promise<void> {
  await storageSet('jogos-singulares', JSON.stringify(state.jogosSingulares));
  ui.flashSaved();
  await persistBackup();
}

export async function persistArquivo(): Promise<void> {
  await storageSet('arquivo', JSON.stringify(state.arquivo));
  ui.flashSaved();
  await persistBackup();
}

/** Stores all layers to localStorage (after restore, import, or receiving Firebase data). */
export async function storeAllLayers(): Promise<void> {
  await storageSet(
    'config-teams',
    JSON.stringify({ meta: state.meta, config: state.config, teams: state.teams, squads: state.squads }),
  );
  await storageSet(
    'schedule',
    JSON.stringify({
      schedule: state.schedule,
      roundsMeta: state.roundsMeta,
      scheduleTeamCount: state.scheduleTeamCount,
      scheduleVoltas: state.scheduleVoltas,
    }),
  );
  await storageSet('results', JSON.stringify(state.results));
  await storageSet('players', JSON.stringify(state.players));
  await storageSet('jogos-singulares', JSON.stringify(state.jogosSingulares));
  await storageSet('arquivo', JSON.stringify(state.arquivo));
}

// ---------------------------------------------------------------------------
// Schedule Generation and Group Assignment
// ---------------------------------------------------------------------------
export function applyGeneratedSchedule(
  numEquipas: number,
  numVoltas: number,
  randomizeGroups: boolean,
): void {
  const nGrupos = state.config?.numGrupos || 1;
  let indices: number[] = [];
  for (let i = 0; i < numEquipas; i++) indices.push(i);

  if (randomizeGroups) {
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  } else {
    const byGroup: Record<number, number[]> = {};
    for (let i = 0; i < numEquipas; i++) {
      let g = state.teams?.[i]?.group || 0;
      if (g >= nGrupos) g = nGrupos - 1;
      if (!byGroup[g]) byGroup[g] = [];
      byGroup[g].push(i);
    }
    indices = [];
    for (let g = 0; g < nGrupos; g++) {
      if (byGroup[g]) indices = indices.concat(byGroup[g]);
    }
  }

  const teamsPerGroup = Math.ceil(numEquipas / nGrupos);
  const groupsIndices: number[][] = [];

  for (let g = 0; g < nGrupos; g++) {
    const chunk = indices.slice(g * teamsPerGroup, (g + 1) * teamsPerGroup);
    groupsIndices.push(chunk);
    chunk.forEach((idx) => {
      if (state.teams && state.teams[idx]) state.teams[idx].group = g;
    });
  }

  const out = generateSchedule(groupsIndices, numVoltas);
  state.schedule = out.schedule;
  state.roundsMeta = out.roundsMeta;
  state.scheduleTeamCount = numEquipas;
  state.scheduleVoltas = numVoltas;
}

/**
 * Americano / Mexicano schedule: each team slot is one player. Americano plays
 * every partner rotation `numVoltas` times; Mexicano draws only the first round,
 * from `ranking` (player slots, best first), and the next ones from the standings.
 */
export function applyRotationSchedule(
  format: RotationFormat,
  numPlayers: number,
  numVoltas: number,
  ranking: number[],
): void {
  const cycle = americanoRounds(numPlayers);
  const rounds = format === 'americano'
    ? Array.from({ length: numVoltas }, () => cycle).flat()
    : [mexicanoRound(ranking)];
  const out = rotationSchedule(rounds);
  for (let i = 0; i < numPlayers; i++) {
    if (state.teams?.[i]) state.teams[i].group = 0;
  }
  state.schedule = out.games;
  state.roundsMeta = out.rounds;
  state.scheduleTeamCount = numPlayers;
  state.scheduleVoltas = format === 'americano' ? numVoltas : 1;
}

// ---------------------------------------------------------------------------
// State Loading from localStorage
// ---------------------------------------------------------------------------
export async function loadState(): Promise<void> {
  let ct: { config?: Partial<Config>; teams?: Team[]; squads?: SquadPlayer[][] } | null;
  let sc: {
    schedule?: Match[];
    roundsMeta?: RoundMeta[];
    scheduleTeamCount?: number;
    scheduleVoltas?: number;
  } | null;
  let rs: Record<string | number, unknown> | null;
  let bk: TournamentSnapshot | null;
  let pl: unknown[] | null;
  let js: SingleMatch[] | null;
  let ar: unknown | null;

  try { const r = await storageGet('config-teams'); ct = r ? JSON.parse(r.value) : null; } catch { ct = null; }
  try { const r = await storageGet('schedule'); sc = r ? JSON.parse(r.value) : null; } catch { sc = null; }
  try { const r = await storageGet('results'); rs = r ? JSON.parse(r.value) : null; } catch { rs = null; }
  try { const r = await storageGet('backup'); bk = r ? JSON.parse(r.value) : null; } catch { bk = null; }
  try { const r = await storageGet('players'); pl = r ? JSON.parse(r.value) : null; } catch { pl = null; }
  try { const r = await storageGet('jogos-singulares'); js = r ? JSON.parse(r.value) : null; } catch { js = null; }
  try { const r = await storageGet('arquivo'); ar = r ? JSON.parse(r.value) : null; } catch { ar = null; }

  if (ct && ct.config && ct.teams) {
    state.config = normalizeConfig(ct.config);
    state.meta = normalizeMeta((ct as { meta?: unknown }).meta, state.config);
    state.teams = ensureTeamsStructure(ct.teams);
    state.squads = ensureSquadsLength(ct.squads);

    // A cleared schedule is saved as an empty array and should not be regenerated.
    if (sc && Array.isArray(sc.schedule)) {
      state.schedule = sc.schedule;
      state.roundsMeta = sc.roundsMeta || [];
      state.scheduleTeamCount = sc.scheduleTeamCount || state.config.numEquipas;
      state.scheduleVoltas = sc.scheduleVoltas || state.config.numVoltas;
    } else {
      applyGeneratedSchedule(state.config.numEquipas, state.config.numVoltas, false);
    }

    state.results = normalizeResults(rs);
    state.players = normalizePlayers(pl);
    state.jogosSingulares = js || [];
    state.arquivo = normalizeArquivo(ar);
  } else if (validateSnapshot(bk)) {
    applySnapshot(bk);
    await storeAllLayers();
    ui.showToast(en.toasts.backupRestored, 'ok');
    ui.flashBackup(bk.exportedAt);
  } else {
    state.config = defaultConfig();
    state.meta = defaultMeta(state.config.sport, state.config.nome);
    state.teams = defaultTeams();
    state.squads = defaultSquads();
    state.players = [];
    state.jogosSingulares = [];
    state.arquivo = [];
    applyGeneratedSchedule(state.config.numEquipas, state.config.numVoltas, false);
  }

  if (bk && bk.exportedAt) ui.flashBackup(bk.exportedAt);
}

// ---------------------------------------------------------------------------
// JSON Export / Import
// ---------------------------------------------------------------------------
export function exportJSON(): void {
  const snap = buildSnapshot();
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const safeName = (state.config?.nome || 'tournament').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  ui.showToast(en.toasts.tournamentExported, 'ok');
}

export function importJSON(file: File | null): void {
  if (!file) return;
  const reader = new FileReader();

  reader.onload = (e) => {
    let snap: unknown;
    try {
      snap = JSON.parse(e.target?.result as string);
    } catch {
      ui.showToast(en.toasts.invalidFile, 'error');
      return;
    }

    if (!validateSnapshot(snap)) {
      ui.showToast(en.toasts.invalidStructure, 'error');
      return;
    }

    ui.openConfirm(en.confirmations.importTournamentTitle, en.confirmations.importTournamentPrompt, async () => {
      applySnapshot(snap);
      await storeAllLayers();
      await persistBackup();
      ui.renderAll();
      ui.showToast(en.toasts.tournamentImported, 'ok');
    });
  };

  reader.readAsText(file);
}

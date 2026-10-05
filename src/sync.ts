// ---------------------------------------------------------------------------
// Synchronization — snapshot diffing for Firebase updates and data normalization
// ---------------------------------------------------------------------------

import type {
  Match,
  Tournament,
  TournamentMeta,
  Config,
  Score,
  ArchiveEntry,
  ArchiveStandingRow,
  ArchivePlayer,
  Player,
  PlayerAttributes,
  RatingAttributes,
} from './types.js';
import { en } from './i18n/en.js';
import { getSport } from './sports/registry.js';

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Computes the delta between the last synchronized snapshot and the current one,
 * in Firebase `update()` format (path -> value, where null deletes).
 *
 * Results are saved game-by-game so that two people entering results for different
 * matches simultaneously do not overwrite each other. Other sections are only sent
 * when changed.
 *
 * @param prev - Last synchronized snapshot (null if none)
 * @param next - Current snapshot
 * @returns Map of Firebase paths to values
 */
export function diffSnapshot(
  prev: Partial<Tournament> | null,
  next: Partial<Tournament>,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};

  if (!prev) {
    Object.keys(next).forEach((key) => {
      updates[key] = (next as Record<string, unknown>)[key] ?? null;
    });
    return updates;
  }

  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.forEach((key) => {
    if (key === 'results') {
      const a = (prev.results || {}) as Record<string, unknown>;
      const b = (next.results || {}) as Record<string, unknown>;
      new Set([...Object.keys(a), ...Object.keys(b)]).forEach((gi) => {
        if (!same(a[gi], b[gi])) updates[`results/${gi}`] = b[gi] ?? null;
      });
    } else if (key === 'schedule' && Array.isArray(prev.schedule) && Array.isArray(next.schedule)) {
      diffSchedule(prev.schedule, next.schedule, updates);
    } else if (!same((prev as Record<string, unknown>)[key], (next as Record<string, unknown>)[key])) {
      updates[key] = (next as Record<string, unknown>)[key] ?? null;
    }
  });

  return updates;
}

/**
 * Schedule is saved field-by-field for each game: this allows a user advancing
 * a knockout stage winner to only save `schedule/<game>/home` or `away`
 * (the rest of the schedule is admin-only).
 */
function diffSchedule(a: unknown[], b: unknown[], updates: Record<string, unknown>): void {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (same(a[i], b[i])) continue;
    const ga = a[i];
    const gb = b[i];
    if (ga && gb && typeof ga === 'object' && typeof gb === 'object') {
      const gaObj = ga as Record<string, unknown>;
      const gbObj = gb as Record<string, unknown>;
      new Set([...Object.keys(gaObj), ...Object.keys(gbObj)]).forEach((k) => {
        if (!same(gaObj[k], gbObj[k])) updates[`schedule/${i}/${k}`] = gbObj[k] ?? null;
      });
    } else {
      updates[`schedule/${i}`] = gb ?? null;
    }
  }
}

/** Sections that store only metadata: alone, they do not justify a database save. */
const META_SECTIONS: readonly string[] = ['exportedAt', 'version'];

/** Checks whether the update only modifies metadata (export timestamp, version). */
export function onlyMetadata(updates: Record<string, unknown>): boolean {
  return Object.keys(updates).every((p) => META_SECTIONS.includes(p));
}

/**
 * Normalizes a tournament configuration, applying default values and ensuring
 * the sport is defined. If no sport is specified (e.g. from version <= 7 snapshots),
 * it defaults to 'football'.
 */
export function normalizeConfig(config?: Partial<Config> | null): Config {
  const raw = config || {};
  return {
    nome: typeof raw.nome === 'string' ? raw.nome : 'Futebol ILOG',
    numEquipas: typeof raw.numEquipas === 'number' ? raw.numEquipas : 8,
    numGrupos: typeof raw.numGrupos === 'number' ? raw.numGrupos : 1,
    numVoltas: typeof raw.numVoltas === 'number' ? raw.numVoltas : 2,
    pontosVitoria: typeof raw.pontosVitoria === 'number' ? raw.pontosVitoria : 3,
    pontosEmpate: typeof raw.pontosEmpate === 'number' ? raw.pontosEmpate : 1,
    pontosDerrota: typeof raw.pontosDerrota === 'number' ? raw.pontosDerrota : 0,
    bonusGoleada: typeof raw.bonusGoleada === 'number' ? raw.bonusGoleada : 1,
    golosGoleada: typeof raw.golosGoleada === 'number' ? raw.golosGoleada : 3,
    mataMata: Boolean(raw.mataMata),
    numPlayoffTeams: typeof raw.numPlayoffTeams === 'number' ? raw.numPlayoffTeams : 4,
    ...raw,
    sport: typeof raw.sport === 'string' && raw.sport ? raw.sport : 'football',
  };
}

/**
 * Normalizes tournament metadata, ensuring sport, name, status, and createdAt
 * are defined. Defaults to config values or football defaults.
 */
export function normalizeMeta(
  meta?: unknown,
  config?: Partial<Config> | null,
): TournamentMeta {
  const raw = (meta && typeof meta === 'object' ? meta : {}) as Partial<TournamentMeta>;
  const sport =
    typeof raw.sport === 'string' && raw.sport
      ? raw.sport
      : (typeof config?.sport === 'string' && config.sport ? config.sport : 'football');
  const name =
    typeof raw.name === 'string' && raw.name
      ? raw.name
      : (typeof config?.nome === 'string' && config.nome ? config.nome : 'Futebol ILOG');
  const status = raw.status === 'finished' ? 'finished' : 'active';
  const createdAt =
    typeof raw.createdAt === 'number' && !isNaN(raw.createdAt) ? raw.createdAt : Date.now();
  const res: TournamentMeta = { name, sport, status, createdAt };
  if (typeof raw.id === 'string' && raw.id) res.id = raw.id;
  return res;
}

/**
 * Firebase removes empty arrays and converts objects with numeric keys into
 * sparse arrays (with null holes). Restores the expected structure for match results.
 */
export function normalizeResults(
  results?: Record<string | number, unknown> | unknown[] | null,
): Record<string, Score | string> {
  const out: Record<string, Score | string> = {};
  if (!results || typeof results !== 'object') return out;

  Object.keys(results).forEach((gi) => {
    const r = (results as Record<string, unknown>)[gi];
    if (r === null || r === undefined) return;
    if (typeof r === 'object') {
      const rObj = r as Record<string, unknown>;
      const scorers = (rObj.scorers || {}) as { home?: unknown[]; away?: unknown[] };
      const assists = (rObj.assists || {}) as { home?: unknown[]; away?: unknown[] };
      const fix = (arr?: unknown[]) => Array.from(arr || [], (v) => (v ? String(v) : ''));
      out[gi] = {
        ...rObj,
        scorers: {
          home: (scorers.home || []) as string[],
          away: (scorers.away || []) as string[],
        },
        assists: {
          home: fix(assists.home),
          away: fix(assists.away),
        },
      } as Score;
    } else {
      out[gi] = String(r);
    }
  });
  return out;
}

/**
 * Restores empty lists that Firebase removes in tournament archives
 * (and converts objects with numeric keys back to arrays).
 */
export function normalizeArquivo(arquivo?: unknown): ArchiveEntry[] {
  const list = <T>(v: unknown): T[] => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v && typeof v === 'object') return Object.values(v).filter(Boolean) as T[];
    return [];
  };

  return list<Record<string, unknown>>(arquivo).map((e) => ({
    ...e,
    sport: typeof e.sport === 'string' && e.sport ? e.sport : 'football',
    grupos: list<Record<string, unknown>>(e.grupos).map((g) => ({
      ...g,
      tabela: list<ArchiveStandingRow>(g.tabela),
    })),
    jogadores: list<ArchivePlayer>(e.jogadores),
  })) as unknown as ArchiveEntry[];
}

/** All of a sport's rating attributes at 0 (football when the sport is unknown). */
export function defaultPlayerAttrs(sport?: string): RatingAttributes {
  return Object.fromEntries(Object.keys(getSport(sport).ratingAttributes()).map((k) => [k, 0]));
}

/**
 * Normalizes a player, ensuring per-sport ratings dictionary exists.
 * Migrates legacy `atributos` to `ratings.football` if needed.
 */
export function normalizePlayer(p: unknown): Player | null {
  if (!p || typeof p !== 'object') return null;
  const obj = p as Record<string, unknown>;

  const ratingsRaw =
    obj.ratings && typeof obj.ratings === 'object'
      ? (obj.ratings as Record<string, unknown>)
      : {};
  const ratings: Record<string, RatingAttributes> = {};

  Object.keys(ratingsRaw).forEach((s) => {
    if (ratingsRaw[s] && typeof ratingsRaw[s] === 'object') {
      ratings[s] = Object.assign(
        defaultPlayerAttrs(s),
        ratingsRaw[s] as RatingAttributes,
      );
    }
  });

  // Migrate legacy atributos to ratings.football if not present
  if (!ratings.football) {
    const legacyAttrs =
      obj.atributos && typeof obj.atributos === 'object'
        ? (obj.atributos as Partial<PlayerAttributes>)
        : {};
    ratings.football = Object.assign(defaultPlayerAttrs('football'), legacyAttrs);
  }

  return {
    id: typeof obj.id === 'string' && obj.id ? obj.id : crypto.randomUUID(),
    nome: typeof obj.nome === 'string' ? obj.nome : '',
    teamIdx:
      obj.teamIdx !== undefined && obj.teamIdx !== null
        ? (typeof obj.teamIdx === 'number' ? obj.teamIdx : Number(obj.teamIdx))
        : null,
    ratings,
    atributos: ratings.football as PlayerAttributes,
  };
}

/**
 * Restores empty lists or objects that Firebase removes in player database
 * (and converts objects with numeric/UUID keys back to arrays).
 */
export function normalizePlayers(players?: unknown): Player[] {
  const list = <T>(v: unknown): T[] => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v && typeof v === 'object') return Object.values(v).filter(Boolean) as T[];
    return [];
  };

  return list<unknown>(players)
    .map(normalizePlayer)
    .filter((p): p is Player => p !== null);
}

const SECTION_LABELS: Record<string, string | null> = {
  meta: en.sync.sectionLabels.meta,
  config: en.sync.sectionLabels.config,
  teams: en.sync.sectionLabels.teams,
  squads: en.sync.sectionLabels.squads,
  schedule: en.sync.sectionLabels.schedule,
  roundsMeta: null,
  scheduleTeamCount: null,
  scheduleVoltas: null,
  players: en.sync.sectionLabels.players,
  jogosSingulares: en.sync.sectionLabels.jogosSingulares,
  results: en.sync.sectionLabels.results,
  arquivo: en.sync.sectionLabels.arquivo,
  exportedAt: null,
  version: null,
};

function teamLabel(snap: Partial<Tournament>, idx: number | string): string {
  if (typeof idx === 'string') return idx;
  const t = snap.teams && snap.teams[idx];
  return t && t.name ? t.name : en.sync.defaultTeamLabel(Number(idx) + 1);
}

function sideText(snap: Partial<Tournament>, game: Match, side: 'home' | 'away'): string {
  const partner = game.partners?.[side];
  const first = teamLabel(snap, game[side]);
  return typeof partner === 'number' ? `${first} / ${teamLabel(snap, partner)}` : first;
}

/**
 * Formats a human-readable description of Firebase updates for the audit log
 * (who changed what).
 *
 * @param updates - Path map returned by diffSnapshot
 * @param snap - Snapshot after the change
 * @returns Description, or '' if only metadata changed
 */
export function describeUpdates(
  updates: Record<string, unknown>,
  snap: Partial<Tournament>,
): string {
  const parts: string[] = [];
  const deleted = Object.keys(updates).filter(
    (p) => p.startsWith('results/') && updates[p] == null,
  );
  if (deleted.length > 1) parts.push(en.sync.resultsDeleted(deleted.length));

  Object.keys(updates).forEach((path) => {
    const [section, gi] = path.split('/');
    if (section === 'schedule' && gi !== undefined) {
      const scheduleLabel = en.sync.sectionLabels.schedule;
      if (!parts.includes(scheduleLabel)) parts.push(scheduleLabel);
      return;
    }
    if (section === 'results' && gi !== undefined) {
      if (deleted.length > 1 && updates[path] == null) return;
      const game = (snap.schedule || [])[Number(gi)];
      const jogo = game
        ? `${sideText(snap, game, 'home')} vs ${sideText(snap, game, 'away')}`
        : en.sync.defaultMatchLabel(Number(gi) + 1);
      const r = updates[path] as Score | string | null | undefined;
      if (r === null || r === undefined) {
        parts.push(en.sync.resultDeleted(jogo));
      } else {
        const score = typeof r === 'object' ? r.score : r;
        const pen = typeof r === 'object' && r && r.penalties ? en.sync.penaltiesSuffix(r.penalties) : '';
        const status = typeof r === 'object' && r && r.status ? en.sync.statusSuffix(r.status) : '';
        parts.push(en.sync.resultUpdated(jogo, String(score), pen, status));
      }
      return;
    }
    const label = Object.prototype.hasOwnProperty.call(SECTION_LABELS, section)
      ? SECTION_LABELS[section]
      : en.sync.genericSectionUpdated(section);
    if (label && !parts.includes(label)) parts.push(label);
  });
  return parts.join('; ').slice(0, 500);
}

/**
 * Roles to copy from the legacy `utilizadores` node into `users`, as
 * `update()` paths. Only users who have no role in `users` yet are copied,
 * and only `role` / `admin` are written (the profile fields belong to each
 * user). The legacy tournament was football, so a legacy `admin` becomes a
 * football admin.
 */
export function legacyRoleUpdates(
  utilizadores: Record<string, { role?: string } | null> | null | undefined,
  users: Record<string, { role?: string | null } | null> | null | undefined
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  Object.entries(utilizadores || {}).forEach(([uid, legacy]) => {
    const oldRole = legacy && legacy.role;
    if (oldRole !== 'admin' && oldRole !== 'user') return;
    if (users && users[uid] && users[uid]!.role) return;
    updates[`users/${uid}/role`] = oldRole;
    if (oldRole === 'admin') updates[`users/${uid}/admin/football`] = true;
  });
  return updates;
}

import type { Role } from './types.js';

// ---------------------------------------------------------------------------
// Permissions — what each user role can modify in the tournament
// ---------------------------------------------------------------------------
// Must match database.rules.json: Firebase security rules are the real protection;
// this client-side module only warns before sending and hides UI buttons.

export const ROLES: Record<Role, string> = {
  master: 'Master Admin',
  admin: 'Admin',
  user: 'User',
};

/**
 * Sections of a tournament that a regular user (or an admin of another sport)
 * can write to. Results, match status, the schedule and single matches are
 * for the sport's admins only.
 */
const USER_SECTIONS = ['exportedAt', 'version'] as const;

/** Single matches are a football feature: only football admins see and edit them. */
export const SINGLE_MATCH_SPORT = 'football';

function isAnyAdmin(role: string | null | undefined, userAdmin?: Record<string, boolean> | null): boolean {
  return role === 'master' || role === 'admin' || !!(userAdmin && Object.keys(userAdmin).length);
}

export function canSeeSingleMatches(role: string | null | undefined, userAdmin?: Record<string, boolean> | null): boolean {
  return isSportAdmin(role, SINGLE_MATCH_SPORT, userAdmin);
}

/**
 * Can this role write a root path of a global node (`players/<id>/...`,
 * `arquivo/<id>`, `singleMatches/<id>`)? `value` is what is written (null
 * deletes) and `prevSport` the sport of the archive entry it replaces.
 */
export function canWriteGlobalPath(
  role: string | null | undefined,
  path: string,
  value: unknown,
  options: { userAdmin?: Record<string, boolean> | null; prevSport?: string } = {},
): boolean {
  if (role === 'master') return true;
  const { userAdmin } = options;
  const [node, , field, sport] = String(path).split('/');
  if (node === 'singleMatches') return canSeeSingleMatches(role, userAdmin);
  if (node === 'players') {
    if (!isAnyAdmin(role, userAdmin)) return false;
    // Adding a player is open to every admin; deleting one removes it from
    // every sport, so only the master does it
    if (field === undefined) return value !== null && value !== undefined;
    if (field === 'ratings') return isSportAdmin(role, sport, userAdmin);
    if (field === 'atributos') return isSportAdmin(role, 'football', userAdmin);
    return field === 'nome' || field === 'teamIdx';
  }
  if (node === 'arquivo') {
    const newSport = value && typeof value === 'object' ? (value as { sport?: string }).sport || 'football' : undefined;
    if (options.prevSport !== undefined) {
      if (!isSportAdmin(role, options.prevSport, userAdmin)) return false;
      return newSport === undefined || newSport === options.prevSport;
    }
    return newSport !== undefined && isSportAdmin(role, newSport, userAdmin);
  }
  return false;
}

export function isKnownRole(role: string | null | undefined): role is Role {
  return typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLES, role);
}

export function isMaster(role: string | null | undefined): boolean {
  return role === 'master';
}

/**
 * Checks if the user is an admin for the specified sport.
 * Master is always an admin for all sports.
 * An admin is authorized if userAdmin[sport] is true.
 */
export function isSportAdmin(
  role: string | null | undefined,
  sport?: string,
  userAdmin?: Record<string, boolean> | null
): boolean {
  if (role === 'master') return true;
  if (role === 'admin' && sport && userAdmin && userAdmin[sport] === true) return true;
  return false;
}

export function roleLabel(
  role: string | null | undefined,
  userAdmin?: Record<string, boolean> | null
): string {
  if (role === 'master') return 'Master Admin';
  if (role === 'admin') {
    if (userAdmin) {
      const sports = Object.entries(userAdmin)
        .filter(([, v]) => v)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
      if (sports.length) return `Admin (${sports.join(', ')})`;
    }
    return 'Admin';
  }
  if (role === 'user') return 'User';
  return 'Pending';
}

export interface WritePathOptions {
  sport?: string;
  userAdmin?: Record<string, boolean> | null;
}

/**
 * Can this role write to the given path (relative to the tournament root)?
 */
export function canWritePath(
  role: string | null | undefined,
  path: string,
  options?: WritePathOptions
): boolean {
  const parts = String(path).split('/');
  // meta/sport is immutable after creation and cannot be updated directly
  if (parts[0] === 'meta' && parts[1] === 'sport') return false;

  if (role === 'master') return true;

  if (role === 'admin') {
    if (options && options.sport !== undefined) {
      if (isSportAdmin(role, options.sport, options.userAdmin)) return true;
    } else {
      return true;
    }
  }

  if (role !== 'user' && role !== 'admin') return false;
  return (USER_SECTIONS as readonly string[]).includes(parts[0]);
}

/**
 * Paths in an `update()` call that this role is not permitted to write.
 */
export function blockedPaths(
  role: string | null | undefined,
  updates: Record<string, unknown>,
  options?: WritePathOptions & { archiveSports?: Record<string, string> }
): string[] {
  return Object.keys(updates).filter((p) => {
    const [node, id] = p.split('/');
    if (id !== undefined && (node === 'players' || node === 'arquivo' || node === 'singleMatches')) {
      return !canWriteGlobalPath(role, p, updates[p], {
        userAdmin: options?.userAdmin,
        prevSport: node === 'arquivo' ? options?.archiveSports?.[id] : undefined,
      });
    }
    return !canWritePath(role, p, options);
  });
}

import type { Role } from './types.js';

// ---------------------------------------------------------------------------
// Permissions — what each user role can modify in the tournament
// ---------------------------------------------------------------------------
// Must match database.rules.json: Firebase security rules are the real protection;
// this client-side module only warns before sending and hides UI buttons.

export const ROLES: Record<Role, string> = {
  master: 'Master Admin',
  admin: 'Admin',
  user: 'Utilizador',
};

/**
 * Sections of tournament_state that a regular user (non-admin) can write to.
 * From schedule, they can only write `schedule/<game>/home` and `away` (playoffs).
 */
const USER_SECTIONS = ['results', 'jogosSingulares', 'exportedAt', 'version'] as const;

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
  if (role === 'user') return 'Utilizador';
  return 'Pendente';
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

  // In the schedule, a regular user can only pass winning teams to subsequent playoff matches
  if (parts[0] === 'schedule') {
    return parts.length === 3 && (parts[2] === 'home' || parts[2] === 'away');
  }
  return (USER_SECTIONS as readonly string[]).includes(parts[0]);
}

/**
 * Paths in an `update()` call that this role is not permitted to write.
 */
export function blockedPaths(
  role: string | null | undefined,
  updates: Record<string, unknown>,
  options?: WritePathOptions
): string[] {
  return Object.keys(updates).filter((p) => !canWritePath(role, p, options));
}

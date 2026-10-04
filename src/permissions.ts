import type { Role } from './types.js';

// ---------------------------------------------------------------------------
// Permissions — what each user role can modify in the tournament
// ---------------------------------------------------------------------------
// Must match database.rules.json: Firebase security rules are the real protection;
// this client-side module only warns before sending and hides UI buttons.

export const ROLES: Record<Role, string> = {
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

/**
 * Display label of the role for the user interface.
 */
export function roleLabel(role: string | null | undefined): string {
  return isKnownRole(role) ? ROLES[role] : 'Pendente';
}

/**
 * Can this role write to the given path (relative to torneio_state)?
 */
export function canWritePath(role: string | null | undefined, path: string): boolean {
  if (role === 'admin') return true;
  if (role !== 'user') return false;
  const parts = String(path).split('/');
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
  updates: Record<string, unknown>
): string[] {
  return Object.keys(updates).filter((p) => !canWritePath(role, p));
}

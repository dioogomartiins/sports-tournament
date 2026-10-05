import { html, render } from 'lit';
import { state } from '../state.js';
import { roleLabel } from '../permissions.js';
import { listSports } from '../sports/registry.js';
import type { UserProfile } from '../types.js';
import type { UserList } from '../components/UserList.js';
import type { ActivityLog, LogEntry } from '../components/ActivityLog.js';
import '../components/UserList.js';
import '../components/ActivityLog.js';
import { dom } from './dom.js';
import { switchTab } from './navigation.js';
import { renderTeams, renderSquadList } from './teams.js';
import { renderPlayersList } from './players.js';
import { renderCalendar, renderResults } from './schedule.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Session and administration
// ---------------------------------------------------------------------------

/** The signed-in user, as Firebase Auth gives it. */
export interface AuthUser {
  displayName?: string | null;
  email?: string | null;
}

/** Updates the account button and the data-role CSS uses to show or hide controls. */
export function renderAuth(user: AuthUser | null, role: string | null, userAdmin: Record<string, boolean> | null = null): void {
  const sport = state.meta?.sport || state.config?.sport || 'football';
  let effectiveRole = 'viewer';
  if (user) {
    if (role === 'master') effectiveRole = 'master';
    else if (role === 'admin') effectiveRole = userAdmin && userAdmin[sport] === true ? 'admin' : 'user';
    else if (role === 'user') effectiveRole = 'user';
  }

  document.body.dataset.role = effectiveRole;
  document.body.dataset.master = role === 'master' ? 'true' : 'false';

  // Editable fields and empty list messages depend on permissions
  if (state.config) { renderTeams(); renderSquadList(); renderPlayersList(); renderCalendar(); renderResults(); }

  const btn = dom.btnConta;
  if (btn) {
    if (user) {
      const name = (user.displayName || user.email || '').split(' ')[0];
      const label = roleLabel(role, userAdmin);
      // On mobile only the avatar icon shows; the name and role are in the title
      render(html`👤<span class="auth-label"> ${name} · ${label}</span>`, btn);
      btn.title = `${name} · ${label} — ${en.header.signOut}`;
    } else {
      render(html`🔑 ${en.header.signIn}`, btn);
      btn.title = en.header.signInWithGoogle;
    }
  }

  // If the active tab became hidden by the new permissions, go back to the dashboard
  const active = document.querySelector('.tab.active[data-requires]');
  if (active && getComputedStyle(active).display === 'none') switchTab('dashboard');
}

/**
 * @param users - every signed-in user
 * @param selfUid - the master cannot change their own role
 */
export function renderUsers(users: UserProfile[], selfUid: string): void {
  const list = dom.usersList as UserList | undefined;
  if (!list) return;
  list.sports = listSports().map((s) => ({ id: s.id, label: `${s.icon} ${s.name}` }));
  list.selfUid = selfUid;
  list.users = users;
}

/** @param entries - newest first */
export function renderLog(entries: LogEntry[]): void {
  const log = dom.logList as ActivityLog | undefined;
  if (log) log.entries = entries;
}

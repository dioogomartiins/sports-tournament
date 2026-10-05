// ---------------------------------------------------------------------------
// <user-list> — signed-in users and their roles (Users tab, master only)
// ---------------------------------------------------------------------------
// Admins also get a checkbox per sport they administer. Emits `role-change`
// (detail: { uid, name, role, sportAdmins }) when the role or a sport changes;
// the signed-in master cannot change their own row.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Role, UserProfile } from '../types.js';
import { ROLES, isKnownRole } from '../permissions.js';
import { fmtTimestamp } from '../utils.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface UserSport {
  id: string;
  label: string;
}

export interface RoleChange {
  uid: string;
  name: string;
  role: Role | null;
  /** Sports the user administers (admin and master), or null. */
  sportAdmins: Record<string, boolean> | null;
}

const ORDER: Record<string, number> = { master: 0, admin: 1, user: 2 };

export class UserList extends LightElement {
  static properties = {
    users: { attribute: false },
    sports: { attribute: false },
    selfUid: { type: String },
    drafts: { state: true },
  };

  /** null until the first read from Firebase. */
  declare users: UserProfile[] | null;
  declare sports: UserSport[];
  declare selfUid: string;
  /** Role picked on screen per uid, so the sport boxes show before the save comes back. */
  private declare drafts: Record<string, string>;

  constructor() {
    super();
    this.users = null;
    this.sports = [];
    this.selfUid = '';
    this.drafts = {};
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    // Fresh data from Firebase replaces what was picked on screen
    if (changed.has('users')) this.drafts = {};
  }

  render(): TemplateResult {
    if (!this.users) return html`<p class="empty">${en.common.loading}</p>`;
    if (!this.users.length) return html`<p class="empty">${en.adminTab.noUsersYet}</p>`;
    const sorted = this.users.slice().sort((a, b) =>
      (ORDER[a.role || ''] ?? 3) - (ORDER[b.role || ''] ?? 3) || String(a.nome || '').localeCompare(String(b.nome || '')));
    return html`${sorted.map((u) => this.rowTemplate(u))}`;
  }

  private change(u: UserProfile, row: HTMLElement): void {
    const role = (row.querySelector('select') as HTMLSelectElement).value;
    this.drafts = { ...this.drafts, [u.uid]: role };
    let sportAdmins: Record<string, boolean> | null = null;
    if (role === 'admin') {
      sportAdmins = {};
      row.querySelectorAll<HTMLInputElement>('input[data-sport]').forEach((cb) => { sportAdmins![cb.dataset.sport!] = cb.checked; });
    } else if (role === 'master') {
      sportAdmins = Object.fromEntries(this.sports.map((s) => [s.id, true]));
    }
    this.emit<RoleChange>('role-change', {
      uid: u.uid,
      name: u.nome || '',
      role: isKnownRole(role) ? role : null,
      sportAdmins,
    });
  }

  private rowTemplate(u: UserProfile): TemplateResult {
    const saved = isKnownRole(u.role) ? u.role : '';
    const role = this.drafts[u.uid] ?? saved;
    const self = u.uid === this.selfUid;
    const last = typeof u.ultimoAcesso === 'number' ? fmtTimestamp(new Date(u.ultimoAcesso).toISOString()) : '—';
    const onChange = (e: Event) => this.change(u, (e.target as HTMLElement).closest('.user-row') as HTMLElement);
    const option = (value: string, label: string) => html`<option value=${value} ?selected=${role === value}>${label}</option>`;
    return html`
      <div class="user-row">
        <div class="user-row__info">
          <div class="user-row__name">${u.nome || en.common.unnamed}</div>
          <div class="user-row__meta">${u.email || ''} · ${en.adminTab.lastActive(last)}</div>
          ${role === 'admin' ? html`
            <div class="user-sport-admins" style="display:flex; gap:10px; margin-top:6px; font-size:12px;">
              ${this.sports.map((s) => html`
                <label style="cursor:pointer;"><input type="checkbox" data-sport=${s.id} .checked=${!!u.admin?.[s.id]}
                  ?disabled=${self} @change=${onChange}> ${s.label}</label>`)}
            </div>` : nothing}
        </div>
        <select ?disabled=${self} title=${self ? en.roles.cannotChangeOwn : nothing} @change=${onChange}>
          ${option('', en.roles.pending)}${option('user', ROLES.user)}${option('admin', ROLES.admin)}${option('master', ROLES.master)}
        </select>
      </div>`;
  }
}

if (!customElements.get('user-list')) customElements.define('user-list', UserList);

declare global {
  interface HTMLElementTagNameMap {
    'user-list': UserList;
  }
}

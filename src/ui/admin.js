import { state } from '../state.js';
import { escapeHtml, fmtTimestamp } from '../utils.js';
import { ROLES, isKnownRole, roleLabel } from '../permissions.js';
import { dom } from './dom.js';
import { switchTab } from './navigation.js';
import { renderTeams, renderSquadList } from './teams.js';
import { renderPlayersList } from './players.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Session & Administration
// ---------------------------------------------------------------------------

/** Updates the user account button and the data-role used by CSS. */
export function renderAuth(user, role, userAdmin = null) {
  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  let effectiveRole = 'viewer';
  if (user) {
    if (role === 'master') {
      effectiveRole = 'master';
    } else if (role === 'admin') {
      const hasSport = userAdmin && userAdmin[currentSport] === true;
      effectiveRole = hasSport ? 'admin' : 'user';
    } else if (role === 'user') {
      effectiveRole = 'user';
    }
  }

  document.body.dataset.role = effectiveRole;
  document.body.dataset.master = role === 'master' ? 'true' : 'false';

  // Editable fields and empty list messages depend on permissions
  if (state.config) { renderTeams(); renderSquadList(); renderPlayersList(); }

  if (dom.btnConta) {
    if (user) {
      const nome = (user.displayName || user.email || '').split(' ')[0];
      // On mobile only the avatar icon is displayed; full name and role are in title
      dom.btnConta.innerHTML = `👤<span class="auth-label"> ${escapeHtml(nome)} · ${escapeHtml(roleLabel(role, userAdmin))}</span>`;
      dom.btnConta.title = `${nome} · ${roleLabel(role, userAdmin)} — ${en.header.signOut}`;
    } else {
      dom.btnConta.textContent = `🔑 ${en.header.signIn}`;
      dom.btnConta.title = en.header.signInWithGoogle;
    }
  }

  // If active tab became hidden due to permissions, return to dashboard
  const active = document.querySelector('.tab.active[data-requires]');
  if (active && getComputedStyle(active).display === 'none') switchTab('dashboard');
}

function fmtMillis(ms) {
  return typeof ms === 'number' ? fmtTimestamp(new Date(ms).toISOString()) : '—';
}

/**
 * @param {object[]} users — { uid, nome, email, role, admin, ultimoAcesso }
 * @param {string}   selfUid — current admin cannot change their own role
 */
export function renderUsers(users, selfUid) {
  if (!dom.usersList) return;
  if (!users.length) {
    dom.usersList.innerHTML = `<p class="empty">${en.adminTab.noUsersYet}</p>`;
    return;
  }
  const order = { master: 0, admin: 1, user: 2 };
  const sorted = users.slice().sort((a, b) =>
    (order[a.role] ?? 3) - (order[b.role] ?? 3) || String(a.nome || '').localeCompare(String(b.nome || '')));

  dom.usersList.innerHTML = sorted.map((u) => {
    const role = isKnownRole(u.role) ? u.role : '';
    const opt = (val, label) => `<option value="${val}"${role === val ? ' selected' : ''}>${label}</option>`;
    const showSports = role === 'admin';
    return `<div class="user-row">` +
      `<div class="user-row__info">` +
      `<div class="user-row__name">${escapeHtml(u.nome || en.common.unnamed)}</div>` +
      `<div class="user-row__meta">${escapeHtml(u.email || '')} · ${escapeHtml(en.adminTab.lastActive(fmtMillis(u.ultimoAcesso)))}</div>` +
      `<div class="user-sport-admins" style="${showSports ? 'display:flex; gap:10px; margin-top:6px; font-size:12px;' : 'display:none; gap:10px; margin-top:6px; font-size:12px;'}" data-uid="${escapeHtml(u.uid)}">` +
      `<label style="cursor:pointer;"><input type="checkbox" class="user-sport-cb" data-uid="${escapeHtml(u.uid)}" data-sport="football"${u.admin?.football ? ' checked' : ''}${u.uid === selfUid ? ' disabled' : ''}> ⚽ ${en.common.football}</label>` +
      `<label style="cursor:pointer;"><input type="checkbox" class="user-sport-cb" data-uid="${escapeHtml(u.uid)}" data-sport="padel"${u.admin?.padel ? ' checked' : ''}${u.uid === selfUid ? ' disabled' : ''}> 🎾 ${en.common.padel}</label>` +
      `</div>` +
      `</div>` +
      `<select data-uid="${escapeHtml(u.uid)}" data-nome="${escapeHtml(u.nome || '')}"${u.uid === selfUid ? ` disabled title="${en.roles.cannotChangeOwn}"` : ''}>` +
      opt('', en.roles.pending) + opt('user', ROLES.user) + opt('admin', ROLES.admin) + opt('master', ROLES.master) +
      `</select>` +
      `</div>`;
  }).join('');

  // Handle live toggle of sport checkboxes container on role select change
  dom.usersList.querySelectorAll('select[data-uid]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const row = sel.closest('.user-row');
      const sportsEl = row?.querySelector('.user-sport-admins');
      if (sportsEl) {
        sportsEl.style.display = sel.value === 'admin' ? 'flex' : 'none';
      }
    });
  });
}

/** @param {object[]} entries — { nome, acao, quando }, newest first */
export function renderLog(entries) {
  if (!dom.logList) return;
  dom.logList.innerHTML = entries.length
    ? entries.map((e) =>
      `<div class="log-row"><div class="log-row__info">` +
      `<div class="log-row__acao">${escapeHtml(e.acao || '')}</div>` +
      `<div class="log-row__meta">${escapeHtml(e.nome || '')} · ${escapeHtml(fmtMillis(e.quando))}</div>` +
      `</div></div>`
    ).join('')
    : `<p class="empty">${en.adminTab.noChangesYet}</p>`;
}

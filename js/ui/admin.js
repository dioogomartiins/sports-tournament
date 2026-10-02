import { state } from '../state.js';
import { escapeHtml, fmtTimestamp } from '../utils.js';
import { ROLES, isKnownRole, roleLabel } from '../permissions.js';
import { dom, isAdminView } from './dom.js';
import { switchTab } from './navegacao.js';
import { renderSquadList } from './equipas.js';
import { renderPlayersList } from './jogadores.js';

// ---------------------------------------------------------------------------
// Sessão e administração
// ---------------------------------------------------------------------------

/** Atualiza o botão de conta e o perfil usado pelo CSS para esconder controlos. */
export function renderAuth(user, role) {
  document.body.dataset.role = (user && isKnownRole(role)) ? role : 'viewer';
  if (dom.teamsList) {
    dom.teamsList.querySelectorAll('.team-prop').forEach((inp) => { inp.disabled = !isAdminView(); });
  }
  // Textos de lista vazia dependem do perfil
  if (state.config) { renderSquadList(); renderPlayersList(); }

  if (dom.btnConta) {
    if (user) {
      const nome = (user.displayName || user.email || '').split(' ')[0];
      // No telemóvel só se vê o ícone; o nome e o perfil ficam no title
      dom.btnConta.innerHTML = `👤<span class="auth-label"> ${escapeHtml(nome)} · ${escapeHtml(roleLabel(role))}</span>`;
      dom.btnConta.title = `${nome} · ${roleLabel(role)} — Terminar sessão`;
    } else {
      dom.btnConta.textContent = '🔑 Entrar';
      dom.btnConta.title = 'Entrar com Google';
    }
  }

  // Se o separador atual ficou escondido, volta ao dashboard
  const active = document.querySelector('.tab.active[data-requires]');
  if (active && getComputedStyle(active).display === 'none') switchTab('dashboard');
}

function fmtMillis(ms) {
  return typeof ms === 'number' ? fmtTimestamp(new Date(ms).toISOString()) : '—';
}

/**
 * @param {object[]} users — { uid, nome, email, role, ultimoAcesso }
 * @param {string}   selfUid — o admin atual não pode mudar o próprio perfil
 */
export function renderUsers(users, selfUid) {
  if (!dom.usersList) return;
  if (!users.length) {
    dom.usersList.innerHTML = '<p class="empty">Ainda ninguém entrou.</p>';
    return;
  }
  const order = { admin: 0, user: 1 };
  const sorted = users.slice().sort((a, b) =>
    (order[a.role] ?? 2) - (order[b.role] ?? 2) || String(a.nome || '').localeCompare(String(b.nome || '')));

  dom.usersList.innerHTML = sorted.map((u) => {
    const role = isKnownRole(u.role) ? u.role : '';
    const opt = (val, label) => `<option value="${val}"${role === val ? ' selected' : ''}>${label}</option>`;
    return `<div class="user-row">` +
      `<div class="user-row__info">` +
      `<div class="user-row__name">${escapeHtml(u.nome || 'Sem nome')}</div>` +
      `<div class="user-row__meta">${escapeHtml(u.email || '')} · último acesso ${escapeHtml(fmtMillis(u.ultimoAcesso))}</div>` +
      `</div>` +
      `<select data-uid="${escapeHtml(u.uid)}" data-nome="${escapeHtml(u.nome || '')}"${u.uid === selfUid ? ' disabled title="Não podes mudar o teu próprio perfil"' : ''}>` +
      opt('', 'Pendente') + opt('user', ROLES.user) + opt('admin', ROLES.admin) +
      `</select>` +
      `</div>`;
  }).join('');
}

/** @param {object[]} entries — { nome, acao, quando }, mais recentes primeiro */
export function renderLog(entries) {
  if (!dom.logList) return;
  dom.logList.innerHTML = entries.length
    ? entries.map((e) =>
      `<div class="log-row"><div class="log-row__info">` +
      `<div class="log-row__acao">${escapeHtml(e.acao || '')}</div>` +
      `<div class="log-row__meta">${escapeHtml(e.nome || '')} · ${escapeHtml(fmtMillis(e.quando))}</div>` +
      `</div></div>`
    ).join('')
    : '<p class="empty">Ainda não há alterações registadas.</p>';
}

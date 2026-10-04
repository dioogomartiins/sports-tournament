import { state, normalizePlayer, persistPlayers, persistConfigTeams } from '../state.js';
import { getTeamName, escapeHtml } from '../utils.js';
import { getPlayerRating } from '../algorithms.js';
import { dom, isAdminView } from './dom.js';
import { showToast } from './avisos.js';
import { renderSquadList, renderSquadPlayerFromDBDropdown } from './equipas.js';
import { setConfirmCallback, openConfirm } from './modais.js';
import { renderDraftPlayerList } from './singular.js';
import { computeAllTimeStats } from './historico.js';

// ---------------------------------------------------------------------------
// Render — Jogadores (Base de Dados)
// ---------------------------------------------------------------------------

const ATTR_LABELS = {
  velocidade: 'Velocidade',
  finalizacao: 'Finalização',
  passe: 'Passe',
  drible: 'Drible',
  defesa: 'Defesa',
  fisico: 'Físico',
};

function playerInitials(nome) {
  return (nome || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function renderPlayersList() {
  if (!dom.playersList) return;

  const search = (dom.playerSearchInput ? dom.playerSearchInput.value.toLowerCase() : '');
  const players = state.players.filter((p) => !search || p.nome.toLowerCase().includes(search));

  if (!players.length) {
    dom.playersList.innerHTML = `<p class="empty">${search ? 'Nenhum jogador encontrado.' : (isAdminView() ? 'Ainda não há jogadores. Clica em "+ Novo Jogador" para começar!' : 'Ainda não há jogadores.')}</p>`;
    return;
  }

  const sorted = players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const cards = sorted.map((p) => {
    const rating = getPlayerRating(p);
    const teamName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'Sem equipa';
    const attrs = Object.entries(ATTR_LABELS).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(p.atributos[key]) || 0}</span>` +
      `</div>`
    ).join('');

    return (
      `<div class="player-db-card">` +
      `<div class="player-db-header">` +
      `<div class="player-avatar">${escapeHtml(playerInitials(p.nome))}</div>` +
      `<div>` +
      `<div class="player-db-name">${escapeHtml(p.nome)}</div>` +
      `<div class="player-db-team">${escapeHtml(teamName)}</div>` +
      `</div>` +
      `<div class="player-db-rating">★ ${rating.toFixed(1)}</div>` +
      `</div>` +
      `<div class="player-attrs-mini">${attrs}</div>` +
      `<div class="player-db-actions">` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-action="view-profile" data-pid="${escapeHtml(p.id)}">📊 Ficha</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-requires="admin" data-action="edit-player" data-pid="${escapeHtml(p.id)}">✏️ Editar</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-requires="admin" data-action="del-player" data-pid="${escapeHtml(p.id)}">🗑️</button>` +
      `</div>` +
      `</div>`
    );
  }).join('');

  dom.playersList.innerHTML = `<div class="player-db-grid">${cards}</div>`;

  dom.playersList.querySelectorAll('[data-action="view-profile"]').forEach((btn) => {
    btn.addEventListener('click', () => openPlayerProfile(btn.dataset.pid));
  });
  dom.playersList.querySelectorAll('[data-action="edit-player"]').forEach((btn) => {
    btn.addEventListener('click', () => openPlayerModal(btn.dataset.pid));
  });
  dom.playersList.querySelectorAll('[data-action="del-player"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.pid;
      const pl = state.players.find((p) => p.id === pid);
      openConfirm('Apagar Jogador', `Tens a certeza que queres apagar <strong>${escapeHtml(pl ? pl.nome : pid)}</strong>? Será removido de todos os plantéis.`, async () => {
        state.players = state.players.filter((p) => p.id !== pid);
        // Remove dos squads também
        state.squads.forEach((squad, i) => {
          state.squads[i] = squad.filter((p) => p.id !== pid);
        });
        await persistPlayers();
        await persistConfigTeams();
        renderPlayersList();
        renderSquadList();
        renderSquadPlayerFromDBDropdown();
        renderDraftPlayerList();
      });
    });
  });
}

/**
 * Opens the player create/edit modal.
 * @param {string|null} pid - Player ID to edit, or null to create new.
 */
export function openPlayerModal(pid = null) {
  const existing = pid ? state.players.find((p) => p.id === pid) : null;
  const title = existing ? 'Editar Jogador' : 'Novo Jogador';

  // Build team options
  const teamOpts = ['<option value="">Sem equipa</option>'];
  for (let i = 0; i < state.scheduleTeamCount; i++) {
    const sel = existing && existing.teamIdx === i ? 'selected' : '';
    teamOpts.push(`<option value="${i}" ${sel}>${escapeHtml(getTeamName(i))}</option>`);
  }

  // Build attr rows
  const currentAttrs = existing ? existing.atributos : { velocidade: 0, finalizacao: 0, passe: 0, drible: 0, defesa: 0, fisico: 0 };
  const attrRows = Object.entries(ATTR_LABELS).map(([key, label]) => {
    const val = currentAttrs[key] || 0;
    const stars = [1, 2, 3, 4, 5].map((n) =>
      `<button type="button" class="star-btn${n <= val ? ' filled' : ''}" data-attr="${key}" data-val="${n}">★</button>`
    ).join('');
    return (
      `<div class="star-row">` +
      `<span class="star-row-label">${label}</span>` +
      `<div class="stars-input" data-attr="${key}">${stars}</div>` +
      `</div>`
    );
  }).join('');

  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML =
    `<div style="margin-bottom:12px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">Nome</label>` +
    `<input type="text" id="playerModalNome" class="input" value="${escapeHtml(existing ? existing.nome : '')}" placeholder="Ex: João Silva" maxlength="60" style="width:100%;">` +
    `</div>` +
    `<div style="margin-bottom:16px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">Equipa</label>` +
    `<select id="playerModalTeam" class="input" style="width:100%;">${teamOpts.join('')}</select>` +
    `</div>` +
    `<div id="playerModalRatingPreview" class="rating-preview">★ 0.0</div>` +
    `<div class="rating-preview-label">Rating Global</div>` +
    `${attrRows}`;

  // Live star interaction
  const currentVals = { ...currentAttrs };

  function updateRatingPreview() {
    const avg = Object.values(currentVals).reduce((s, v) => s + v, 0) / 6;
    const el = document.getElementById('playerModalRatingPreview');
    if (el) el.textContent = `★ ${avg.toFixed(1)}`;
  }

  updateRatingPreview();

  dom.modalBody.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const attr = btn.dataset.attr;
      const val = parseInt(btn.dataset.val, 10);
      // Toggle: click same star = set to 0
      currentVals[attr] = currentVals[attr] === val ? 0 : val;
      // Re-render stars in this row
      const row = dom.modalBody.querySelector(`.stars-input[data-attr="${attr}"]`);
      row.querySelectorAll('.star-btn').forEach((s) => {
        s.classList.toggle('filled', parseInt(s.dataset.val, 10) <= currentVals[attr]);
      });
      updateRatingPreview();
    });
  });

  dom.modalCancel.innerHTML = 'Cancelar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = existing ? '💾 Guardar' : '✅ Criar Jogador';
  dom.modalConfirm.style.background = 'var(--pitch-600)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  setConfirmCallback(async () => {
    const nome = document.getElementById('playerModalNome').value.trim();
    if (!nome) { showToast('O nome é obrigatório.', 'error'); return; }

    const teamVal = document.getElementById('playerModalTeam').value;
    const teamIdx = teamVal !== '' ? parseInt(teamVal, 10) : null;

    if (existing) {
      const idx = state.players.findIndex((p) => p.id === existing.id);
      if (idx !== -1) {
        state.players[idx] = normalizePlayer({ ...existing, nome, teamIdx, atributos: { ...currentVals } });
        // Update name in all squads
        state.squads.forEach((squad) => {
          const sp = squad.find((p) => p.id === existing.id);
          if (sp) sp.name = nome;
        });
      }
    } else {
      const newPlayer = normalizePlayer({ id: crypto.randomUUID(), nome, teamIdx, atributos: { ...currentVals } });
      state.players.push(newPlayer);
    }

    await persistPlayers();
    renderPlayersList();
    renderSquadPlayerFromDBDropdown();
    renderDraftPlayerList();
    dom.modalOverlay.hidden = true;
    showToast(existing ? 'Jogador atualizado!' : 'Jogador criado!', 'ok');
  });

  dom.modalOverlay.hidden = false;
  document.getElementById('playerModalNome').focus();
}

// ---------------------------------------------------------------------------
// Ficha do jogador
// ---------------------------------------------------------------------------
export function openPlayerProfile(pId, tIdx = null) {
  const dbPlayer = state.players.find((p) => p.id === pId);
  let player = dbPlayer ? { id: dbPlayer.id, name: dbPlayer.nome, num: '?' } : null;
  let teamName = dbPlayer && dbPlayer.teamIdx !== null && dbPlayer.teamIdx !== undefined ? getTeamName(dbPlayer.teamIdx) : 'Sem equipa';

  if (!player && tIdx !== null) {
    const sqPlayer = (state.squads[tIdx] || []).find((p) => p.id === pId);
    if (sqPlayer) {
      player = sqPlayer;
      teamName = getTeamName(tIdx);
    }
  }

  if (tIdx !== null && dbPlayer) {
    const sqPlayer = (state.squads[tIdx] || []).find((p) => p.id === pId);
    if (sqPlayer) { player.num = sqPlayer.num; teamName = getTeamName(tIdx); }
  }

  if (!player) return;

  let attrsHtml = '';
  if (dbPlayer) {
    const rating = getPlayerRating(dbPlayer);
    const ATTR_LABELS = { velocidade: 'Velocidade', finalizacao: 'Finalização', passe: 'Passe', drible: 'Drible', defesa: 'Defesa', fisico: 'Físico' };
    const attrs = Object.entries(ATTR_LABELS).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(dbPlayer.atributos[key]) || 0}</span>` +
      `</div>`
    ).join('');
    attrsHtml =
      `<div style="margin-top: 20px; padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">` +
      `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">` +
      `<div style="font-size:12px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">Atributos Base</div>` +
      `<div style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);">★ ${rating.toFixed(1)}</div>` +
      `</div>` +
      `<div class="player-attrs-mini">${attrs}</div>` +
      `</div>`;
  }

  const totais = computeAllTimeStats()[pId] || { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };

  dom.modalTitle.textContent = 'Ficha de Jogador';
  dom.modalBody.innerHTML =
    `<div style="text-align:center; padding: 10px 0;">` +
    `<div style="font-size:40px; margin-bottom:10px;">👤</div>` +
    `<h2 style="font-size:24px; margin-bottom:4px;">${escapeHtml(player.name)}</h2>` +
    `<div style="color:var(--ink-faint); font-weight:600;">Camisola ${player.num} • ${escapeHtml(teamName)}</div>` +
    `</div>` +
    attrsHtml +
    `<div class="stats-grid" style="margin-top:20px; grid-template-columns: 1fr 1fr;">` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Total de Golos</div><div class="stat-value">${totais.golos}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Assistências</div><div class="stat-value">${totais.assistencias}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">MVP</div><div class="stat-value">${totais.mvp}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">Jogos a Marcar</div><div class="stat-value">${totais.jogosAMarcar}</div></div>` +
    `<div class="stat-card" style="grid-column: span 2; text-align:center;"><div class="stat-label">Recorde num só jogo</div><div class="stat-value">${totais.recorde} <span style="font-size:14px; font-weight:normal; color:var(--ink-faint);">golos</span></div></div>` +
    `</div>` +
    `<p style="text-align:center; font-size:12px; color:var(--ink-faint); margin-top:8px;">Inclui torneios arquivados e jogos singulares.</p>`;

  dom.modalCancel.innerHTML = 'Fechar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;
  dom.modalConfirm.hidden = true;
  dom.modalConfirm.style.display = 'none';

  dom.modalOverlay.hidden = false;
  setConfirmCallback(null);
}

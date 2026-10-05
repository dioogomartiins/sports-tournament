import { state, normalizePlayer, defaultPlayerAttrs, persistPlayers, persistConfigTeams } from '../state.js';
import { getTeamName, escapeHtml } from '../utils.js';
import { getPlayerRating } from '../algorithms.js';
import { dom, isAdminView } from './dom.js';
import { showToast } from './toasts.js';
import { renderSquadList, renderSquadPlayerFromDBDropdown } from './equipas.js';
import { setConfirmCallback, openConfirm } from './modais.js';
import { renderDraftPlayerList } from './singular.js';
import { computeAllTimeStats } from './history.js';
import { en } from '../i18n/en.js';
import { getSport } from '../sports/registry.js';

// ---------------------------------------------------------------------------
// Render — Players (Database)
// ---------------------------------------------------------------------------

/** Rating attribute labels of a sport (key → label). */
function attrLabels(sportId) {
  return getSport(sportId).ratingAttributes();
}

/** A player's ratings for one sport (football also reads the legacy `atributos`). */
function sportAttrs(p, sportId) {
  const id = getSport(sportId).id;
  return (id === 'football' ? (p.ratings?.football || p.atributos) : p.ratings?.[id]) || {};
}

function playerInitials(nome) {
  return (nome || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function renderPlayersList() {
  if (!dom.playersList) return;

  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const search = (dom.playerSearchInput ? dom.playerSearchInput.value.toLowerCase() : '');
  const players = state.players.filter((p) => !search || p.nome.toLowerCase().includes(search));

  if (!players.length) {
    dom.playersList.innerHTML = `<p class="empty">${search ? en.players.noPlayersFound : (isAdminView() ? en.players.noPlayersAdmin : en.players.noPlayersReadonly)}</p>`;
    return;
  }

  const sorted = players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const cards = sorted.map((p) => {
    const rating = getPlayerRating(p, currentSport);
    const teamName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : en.players.noTeam;
    const playerAttrs = sportAttrs(p, currentSport);
    const attrs = Object.entries(attrLabels(currentSport)).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(playerAttrs[key]) || 0}</span>` +
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
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-action="view-profile" data-pid="${escapeHtml(p.id)}">${en.players.statsButton}</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--line);" data-requires="admin" data-action="edit-player" data-pid="${escapeHtml(p.id)}">${en.players.editButton}</button>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-requires="admin" data-action="del-player" data-pid="${escapeHtml(p.id)}">${en.players.deleteButton}</button>` +
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
      openConfirm(en.players.deleteModalTitle, en.players.deleteModalPrompt(escapeHtml(pl ? pl.nome : pid)), async () => {
        state.players = state.players.filter((p) => p.id !== pid);
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
  const title = existing ? en.players.editModalTitle : en.players.createModalTitle;
  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  let activeSport = currentSport;

  const playerRatings = {
    football: { ...(existing?.ratings?.football || existing?.atributos || defaultPlayerAttrs('football')) },
    ...(existing?.ratings || {}),
    padel: { ...defaultPlayerAttrs('padel'), ...(existing?.ratings?.padel || {}) },
  };

  const teamOpts = [`<option value="">${en.players.noTeam}</option>`];
  for (let i = 0; i < state.scheduleTeamCount; i++) {
    const sel = existing && existing.teamIdx === i ? 'selected' : '';
    teamOpts.push(`<option value="${i}" ${sel}>${escapeHtml(getTeamName(i))}</option>`);
  }

  const sportOpts = [
    { id: 'football', label: `⚽ ${en.common.football}` },
    { id: 'padel', label: `🎾 ${en.common.padel}` },
  ];
  if (!sportOpts.some((s) => s.id === activeSport)) {
    sportOpts.push({ id: activeSport, label: activeSport });
  }

  function getActiveAttrs() {
    if (!playerRatings[activeSport]) {
      playerRatings[activeSport] = defaultPlayerAttrs(activeSport);
    }
    return playerRatings[activeSport];
  }

  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML =
    `<div style="margin-bottom:12px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">${en.players.nameLabel}</label>` +
    `<input type="text" id="playerModalNome" class="input" value="${escapeHtml(existing ? existing.nome : '')}" placeholder="${en.players.namePlaceholder}" maxlength="60" style="width:100%;">` +
    `</div>` +
    `<div style="margin-bottom:12px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">${en.players.teamLabel}</label>` +
    `<select id="playerModalTeam" class="input" style="width:100%;">${teamOpts.join('')}</select>` +
    `</div>` +
    `<div style="margin-bottom:16px;">` +
    `<label style="display:block; font-weight:600; margin-bottom:6px; font-size:13px;">${en.players.attributeSportLabel}</label>` +
    `<select id="playerModalSport" class="input" style="width:100%;">` +
    sportOpts.map((s) => `<option value="${s.id}" ${s.id === activeSport ? 'selected' : ''}>${escapeHtml(s.label)}</option>`).join('') +
    `</select>` +
    `</div>` +
    `<div id="playerModalRatingPreview" class="rating-preview">★ 0.0</div>` +
    `<div class="rating-preview-label">${en.players.ratingLabel(escapeHtml(sportOpts.find((s) => s.id === activeSport)?.label || activeSport))}</div>` +
    `<div id="playerModalAttrsRows"></div>`;

  function updateRatingPreview() {
    const currentAttrs = getActiveAttrs();
    const keys = Object.keys(attrLabels(activeSport));
    const avg = keys.reduce((s, k) => s + (Number(currentAttrs[k]) || 0), 0) / keys.length;
    const el = document.getElementById('playerModalRatingPreview');
    if (el) el.textContent = `★ ${avg.toFixed(1)}`;
  }

  function attachStarEvents() {
    const currentAttrs = getActiveAttrs();
    dom.modalBody.querySelectorAll('.star-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const attr = btn.dataset.attr;
        const val = parseInt(btn.dataset.val, 10);
        currentAttrs[attr] = currentAttrs[attr] === val ? 0 : val;
        const row = dom.modalBody.querySelector(`.stars-input[data-attr="${attr}"]`);
        if (row) {
          row.querySelectorAll('.star-btn').forEach((s) => {
            s.classList.toggle('filled', parseInt(s.dataset.val, 10) <= currentAttrs[attr]);
          });
        }
        updateRatingPreview();
      });
    });
  }

  function renderStarRows() {
    const currentAttrs = getActiveAttrs();
    const rows = Object.entries(attrLabels(activeSport)).map(([key, label]) => {
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

    const container = document.getElementById('playerModalAttrsRows');
    if (container) {
      container.innerHTML = rows;
      attachStarEvents();
    }
    updateRatingPreview();
  }

  renderStarRows();

  const sportSelect = document.getElementById('playerModalSport');
  if (sportSelect) {
    sportSelect.addEventListener('change', () => {
      activeSport = sportSelect.value;
      const labelEl = dom.modalBody.querySelector('.rating-preview-label');
      const sportObj = sportOpts.find((s) => s.id === activeSport);
      if (labelEl) labelEl.textContent = en.players.ratingLabel(sportObj ? sportObj.label : activeSport);
      renderStarRows();
    });
  }

  dom.modalCancel.innerHTML = en.common.cancel;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = existing ? en.players.savePlayer : en.players.createPlayer;
  dom.modalConfirm.style.background = 'var(--pitch-600)';
  dom.modalConfirm.style.color = '#fff';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  setConfirmCallback(async () => {
    const nome = document.getElementById('playerModalNome').value.trim();
    if (!nome) { showToast(en.toasts.nameRequired, 'error'); return; }

    const teamVal = document.getElementById('playerModalTeam').value;
    const teamIdx = teamVal !== '' ? parseInt(teamVal, 10) : null;

    const footballAttrs = playerRatings.football || defaultPlayerAttrs('football');

    if (existing) {
      const idx = state.players.findIndex((p) => p.id === existing.id);
      if (idx !== -1) {
        state.players[idx] = normalizePlayer({
          ...existing,
          nome,
          teamIdx,
          ratings: playerRatings,
          atributos: footballAttrs,
        });
        state.squads.forEach((squad) => {
          const sp = squad.find((p) => p.id === existing.id);
          if (sp) sp.name = nome;
        });
      }
    } else {
      const newPlayer = normalizePlayer({
        id: crypto.randomUUID(),
        nome,
        teamIdx,
        ratings: playerRatings,
        atributos: footballAttrs,
      });
      state.players.push(newPlayer);
    }

    await persistPlayers();
    renderPlayersList();
    renderSquadPlayerFromDBDropdown();
    renderDraftPlayerList();
    dom.modalOverlay.hidden = true;
    showToast(existing ? en.toasts.playerUpdated : en.toasts.playerCreated, 'ok');
  });

  dom.modalOverlay.hidden = false;
  document.getElementById('playerModalNome').focus();
}

// ---------------------------------------------------------------------------
// Player Profile
// ---------------------------------------------------------------------------
export function openPlayerProfile(pId, tIdx = null) {
  const dbPlayer = state.players.find((p) => p.id === pId);
  let player = dbPlayer ? { id: dbPlayer.id, name: dbPlayer.nome, num: '?' } : null;
  let teamName = dbPlayer && dbPlayer.teamIdx !== null && dbPlayer.teamIdx !== undefined ? getTeamName(dbPlayer.teamIdx) : en.players.noTeam;

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
    const currentSport = state.meta?.sport || state.config?.sport || 'football';
    const rating = getPlayerRating(dbPlayer, currentSport);
    const sportLabel = currentSport === 'padel' ? `🎾 ${en.common.padel}` : `⚽ ${en.common.football}`;
    const playerAttrs = sportAttrs(dbPlayer, currentSport);
    const attrs = Object.entries(attrLabels(currentSport)).map(([key, label]) =>
      `<div class="player-attr-item">` +
      `<span class="player-attr-label">${label.substring(0, 3)}</span>` +
      `<span class="player-attr-val">${Number(playerAttrs[key]) || 0}</span>` +
      `</div>`
    ).join('');
    attrsHtml =
      `<div style="margin-top: 20px; padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">` +
      `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">` +
      `<div style="font-size:12px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">${en.players.attributeSportLabel} (${escapeHtml(sportLabel)})</div>` +
      `<div style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);">★ ${rating.toFixed(1)}</div>` +
      `</div>` +
      `<div class="player-attrs-mini">${attrs}</div>` +
      `</div>`;
  }

  const totais = computeAllTimeStats()[pId] || { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };

  dom.modalTitle.textContent = en.players.profileTitle;
  dom.modalBody.innerHTML =
    `<div style="text-align:center; padding: 10px 0;">` +
    `<div style="font-size:40px; margin-bottom:10px;">👤</div>` +
    `<h2 style="font-size:24px; margin-bottom:4px;">${escapeHtml(player.name)}</h2>` +
    `<div style="color:var(--ink-faint); font-weight:600;">${getSport(state.meta?.sport).usesJerseyNumbers ? en.players.jerseyTeamLabel(escapeHtml(player.num), escapeHtml(teamName)) : escapeHtml(teamName)}</div>` +
    `</div>` +
    attrsHtml +
    `<div class="stats-grid" style="margin-top:20px; grid-template-columns: 1fr 1fr;">` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">${en.players.totalGoals}</div><div class="stat-value">${totais.golos}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">${en.players.assists}</div><div class="stat-value">${totais.assistencias}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">${en.players.mvp}</div><div class="stat-value">${totais.mvp}</div></div>` +
    `<div class="stat-card" style="text-align:center;"><div class="stat-label">${en.players.scoringMatches}</div><div class="stat-value">${totais.jogosAMarcar}</div></div>` +
    `<div class="stat-card" style="grid-column: span 2; text-align:center;"><div class="stat-label">${en.players.singleMatchRecord}</div><div class="stat-value">${totais.recorde} <span style="font-size:14px; font-weight:normal; color:var(--ink-faint);">${en.players.recordGoalsUnit}</span></div></div>` +
    `</div>` +
    `<p style="text-align:center; font-size:12px; color:var(--ink-faint); margin-top:8px;">${en.players.profileFooterNote}</p>`;

  dom.modalCancel.innerHTML = en.common.close;
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;
  dom.modalConfirm.hidden = true;
  dom.modalConfirm.style.display = 'none';

  dom.modalOverlay.hidden = false;
  setConfirmCallback(null);
}

import { state, persistJogosSingulares } from '../state.js';
import { getTeamName, escapeHtml, fmtTimestamp, playerName } from '../utils.js';
import { getPlayerRating, getTeamTotalRating } from '../algorithms.js';
import { dom } from './dom.js';
import { openConfirm, openPickPlayerModal } from './modais.js';

// ---------------------------------------------------------------------------
// Render — Jogo Singular (Draft + Histórico)
// ---------------------------------------------------------------------------

// Stores current draft state (module-level, not persisted)
export let currentDraft = { equipaA: [], equipaB: [] };

export function renderDraftPlayerList() {
  if (!dom.draftPlayerList) return;

  if (!state.players.length) {
    dom.draftPlayerList.innerHTML = '<p class="empty">Ainda não há jogadores na base de dados. Cria-os primeiro na aba 👤 Jogadores.</p>';
    if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = true;
    return;
  }

  const sorted = state.players.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const rows = sorted.map((p) => {
    const rating = getPlayerRating(p);
    const teamName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : '';
    const badge = teamName ? `<span class="draft-player-team-badge">${escapeHtml(teamName)}</span>` : '';
    return (
      `<label class="draft-player-row">` +
      `<input type="checkbox" class="draft-checkbox" data-pid="${escapeHtml(p.id)}">` +
      `<span class="draft-player-nome">${escapeHtml(p.nome)}</span>` +
      `${badge}` +
      `<span class="draft-player-rating">★ ${rating.toFixed(1)}</span>` +
      `</label>`
    );
  }).join('');

  dom.draftPlayerList.innerHTML =
    `<p class="draft-selected-count" id="draftSelectedCount">0 jogadores selecionados</p>` +
    rows;

  // Update counter + enable button
  dom.draftPlayerList.querySelectorAll('.draft-checkbox').forEach((cb) => {
    cb.addEventListener('change', () => {
      const count = dom.draftPlayerList.querySelectorAll('.draft-checkbox:checked').length;
      const el = document.getElementById('draftSelectedCount');
      if (el) el.textContent = `${count} jogador${count !== 1 ? 'es' : ''} selecionado${count !== 1 ? 's' : ''}`;
      if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = count < 2;
    });
  });

  if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = true;
}

export function renderDraftTeams(nomeA, nomeB, equipaA, equipaB) {
  if (!dom.draftTeamsResult) return;

  const ratingA = getTeamTotalRating(equipaA);
  const ratingB = getTeamTotalRating(equipaB);
  const diff = Math.abs(ratingA - ratingB).toFixed(1);

  function teamCard(nome, players, cls) {
    const isTeamA = cls === 'team-a';
    const scorersArr = isTeamA ? (currentDraft.scorersA || []) : (currentDraft.scorersB || []);

    const rows = players.map((p, i) => {
      const gCount = scorersArr.filter(id => id === p.id).length;
      const assistsArr = isTeamA ? (currentDraft.assistsA || []) : (currentDraft.assistsB || []);
      const aCount = assistsArr.filter(id => id === p.id).length;
      return (
        `<div class="draft-team-player-row">` +
        `<span class="draft-pick-num">${i + 1}.</span>` +
        `<span style="flex:1; font-weight:600;">${escapeHtml(p.nome)}${currentDraft.mvp === p.id ? ' ⭐' : ''}${aCount ? ` <span style="font-size:12px; color:var(--ink-faint); font-weight:500;">${aCount} 🅰️</span>` : ''}</span>` +
        `<span style="font-size:12px; color:var(--gold-dark); font-weight:700; margin-right:12px;">★ ${getPlayerRating(p).toFixed(1)}</span>` +
        `<div style="display:flex; align-items:center; gap:8px;">` +
        `<button class="btn btn-ghost" style="padding: 2px 8px; font-size:14px; color:var(--danger); border:1px solid var(--line);" data-action="draft-goal-sub" data-side="${isTeamA ? 'A' : 'B'}" data-pid="${escapeHtml(p.id)}">-</button>` +
        `<span style="font-weight:700; color:var(--pitch-600); min-width:14px; text-align:center;">${gCount}</span>` +
        `<button class="btn btn-ghost" style="padding: 2px 8px; font-size:14px; color:var(--pitch-600); border:1px solid var(--line);" data-action="draft-goal-add" data-side="${isTeamA ? 'A' : 'B'}" data-pid="${escapeHtml(p.id)}">⚽+</button>` +
        `</div>` +
        `</div>`
      );
    }).join('');

    return (
      `<div class="draft-team-card ${cls}">` +
      `<div class="draft-team-name">${escapeHtml(nome)}</div>` +
      `<div class="draft-team-rating-total">Rating total: ${cls === 'team-a' ? ratingA : ratingB}</div>` +
      rows +
      `</div>`
    );
  }

  dom.draftTeamsResult.innerHTML =
    `<div class="draft-teams-grid">` +
    teamCard(nomeA, equipaA, 'team-a') +
    teamCard(nomeB, equipaB, 'team-b') +
    `<div class="draft-balance-bar">Diferença de rating: <span class="draft-balance-diff">${diff} ★</span></div>` +
    `<button class="btn btn-ghost draft-mvp-btn" data-action="draft-mvp">⭐ MVP: ${currentDraft.mvp ? escapeHtml(playerName(currentDraft.mvp)) : 'escolher'}</button>` +
    `</div>`;

  // Golos e assistências do draft: as listas de assistências ficam alinhadas com as de marcadores
  const lists = (side) => {
    const sc = side === 'A' ? 'scorersA' : 'scorersB';
    const as = side === 'A' ? 'assistsA' : 'assistsB';
    if (!currentDraft[sc]) currentDraft[sc] = [];
    if (!currentDraft[as]) currentDraft[as] = [];
    while (currentDraft[as].length < currentDraft[sc].length) currentDraft[as].push('');
    return { scorers: currentDraft[sc], assists: currentDraft[as] };
  };
  const scoreInput = (side) => (side === 'A' ? dom.draftScoreA : dom.draftScoreB);
  const rerender = () => renderDraftTeams(nomeA, nomeB, equipaA, equipaB);

  dom.draftTeamsResult.querySelectorAll('[data-action="draft-goal-add"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const pid = btn.dataset.pid;
      const team = side === 'A' ? equipaA : equipaB;
      const mates = team.filter((p) => p.id !== pid).map((p) => ({ id: p.id, label: p.nome }));
      openPickPlayerModal('Assistência', mates, 'Sem assistência', (aid) => {
        const { scorers, assists } = lists(side);
        scorers.push(pid);
        assists.push(aid);
        const inp = scoreInput(side);
        if (inp) inp.value = (parseInt(inp.value || 0, 10) + 1);
        rerender();
      });
    });
  });

  dom.draftTeamsResult.querySelectorAll('[data-action="draft-goal-sub"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      const { scorers, assists } = lists(side);
      const idx = scorers.lastIndexOf(btn.dataset.pid);
      if (idx === -1) return;
      scorers.splice(idx, 1);
      assists.splice(idx, 1);
      const inp = scoreInput(side);
      if (inp) inp.value = Math.max(0, (parseInt(inp.value || 0, 10) - 1));
      rerender();
    });
  });

  const mvpBtn = dom.draftTeamsResult.querySelector('[data-action="draft-mvp"]');
  if (mvpBtn) {
    mvpBtn.addEventListener('click', () => {
      const all = [...equipaA, ...equipaB].map((p) => ({ id: p.id, label: p.nome }));
      openPickPlayerModal('MVP do Jogo', all, 'Sem MVP', (pid) => {
        currentDraft.mvp = pid;
        rerender();
      });
    });
  }

  // Update score labels
  if (dom.draftLabelA) dom.draftLabelA.textContent = nomeA || 'Equipa A';
  if (dom.draftLabelB) dom.draftLabelB.textContent = nomeB || 'Equipa B';

  if (dom.draftResultCard) dom.draftResultCard.style.display = 'block';
}

export function renderSingularHistorico() {
  if (!dom.singularHistoricoList) return;

  if (!state.jogosSingulares.length) {
    dom.singularHistoricoList.innerHTML = '<p class="empty">Ainda não há jogos registados.</p>';
    return;
  }

  const sorted = state.jogosSingulares.slice().reverse();
  const cards = sorted.map((jogo) => {
    const dateStr = fmtTimestamp(jogo.data);
    const playersA = (jogo.equipaA || []).map((pid) => {
      const p = state.players.find((pl) => pl.id === pid);
      return p ? p.nome : pid;
    }).join(', ');
    const playersB = (jogo.equipaB || []).map((pid) => {
      const p = state.players.find((pl) => pl.id === pid);
      return p ? p.nome : pid;
    }).join(', ');

    return (
      `<div class="historico-card">` +
      `<div class="historico-header">` +
      `<span class="historico-date">📅 ${escapeHtml(dateStr)}</span>` +
      `<button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-action="del-jogo" data-jid="${escapeHtml(jogo.id)}">🗑️</button>` +
      `</div>` +
      `<div class="historico-teams">` +
      `<div>` +
      `<div class="historico-team-name">${escapeHtml(jogo.nomeEquipaA)}</div>` +
      `<div class="historico-team-players">${escapeHtml(playersA)}</div>` +
      `</div>` +
      `<div class="historico-resultado">${escapeHtml(jogo.resultado || '—')}${jogo.mvp ? `<div class="historico-mvp">⭐ ${escapeHtml(playerName(jogo.mvp))}</div>` : ''}</div>` +
      `<div style="text-align:right;">` +
      `<div class="historico-team-name">${escapeHtml(jogo.nomeEquipaB)}</div>` +
      `<div class="historico-team-players">${escapeHtml(playersB)}</div>` +
      `</div>` +
      `</div>` +
      `</div>`
    );
  }).join('');

  dom.singularHistoricoList.innerHTML = cards;

  dom.singularHistoricoList.querySelectorAll('[data-action="del-jogo"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const jid = btn.dataset.jid;
      openConfirm('Apagar Jogo', 'Tens a certeza que queres apagar este registo do histórico?', async () => {
        state.jogosSingulares = state.jogosSingulares.filter((j) => j.id !== jid);
        await persistJogosSingulares();
        renderSingularHistorico();
      });
    });
  });
}

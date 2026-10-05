import { escapeHtml, fmtDate } from '../utils.js';
import { getSport } from '../sports/registry.js';
import { dom } from './dom.js';
import { setConfirmCallback } from './modais.js';

/**
 * Renderiza a lista de torneios ativos no Dashboard.
 *
 * @param {Array} tournaments - Lista de todos os torneios (com meta)
 * @param {string} currentId - ID do torneio atualmente selecionado
 * @param {Function} onSelect - Callback chamado ao selecionar um torneio
 * @param {Function} onFinish - Callback chamado ao terminar um torneio
 */
export function renderTournamentsList(tournaments, currentId, onSelect, onFinish) {
  if (!dom.listaTorneiosAtivos) return;

  const active = (tournaments || []).filter((t) => t.status === 'active');

  if (!active.length) {
    dom.listaTorneiosAtivos.innerHTML = `
      <p class="empty" style="margin: 8px 0;">Não há torneios ativos de momento. Um administrador pode criar um novo torneio.</p>
    `;
    return;
  }

  dom.listaTorneiosAtivos.innerHTML = active.map((t) => {
    const isCurrent = t.id === currentId;
    const sport = getSport(t.sport);
    const isKnown = t.sport && (t.sport === 'football' || t.sport === 'futebol' || sport.id === t.sport);
    const label = isKnown ? (sport.name || 'Futebol') : (t.sport ? t.sport.charAt(0).toUpperCase() + t.sport.slice(1) : 'Futebol');
    const icon = isKnown ? (sport.icon || '🏆') : (t.sport === 'padel' ? '🎾' : '🏆');
    const sportLabel = `${icon} ${label}`;
    const dateStr = t.createdAt ? fmtDate(t.createdAt) : 'Data indisponível';

    return `
      <div class="torneio-card ${isCurrent ? 'active' : ''}" data-tid="${escapeHtml(t.id)}">
        <div class="torneio-card-top">
          <div>
            <div class="torneio-card-title">${escapeHtml(t.name || 'Torneio')}</div>
            <div class="torneio-badges" style="margin-top:6px;">
              <span class="sport-badge">${escapeHtml(sportLabel)}</span>
              <span class="status-badge-active">🟢 Ativo</span>
              ${isCurrent ? '<span class="current-badge">✓ A ver agora</span>' : ''}
            </div>
          </div>
        </div>
        <div class="torneio-card-meta">
          <span>Criado a ${escapeHtml(dateStr)}</span>
        </div>
        <div class="torneio-card-actions">
          ${!isCurrent ? `<button class="btn btn-sm btn-ghost btn-trocar-torneio" data-tid="${escapeHtml(t.id)}">👁️ Ver Torneio</button>` : ''}
          ${isCurrent ? `<button class="btn btn-sm btn-danger btn-terminar-torneio" data-requires="admin" data-tid="${escapeHtml(t.id)}">🏁 Terminar Torneio</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Event listeners para trocar de torneio
  dom.listaTorneiosAtivos.querySelectorAll('.torneio-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      // Se clicou no botão de terminar, não muda de seleção
      if (e?.target?.closest?.('.btn-terminar-torneio')) return;
      const tid = card.dataset.tid;
      if (tid && tid !== currentId && onSelect) {
        onSelect(tid);
      }
    });
  });

  // Event listeners para o botão de terminar
  dom.listaTorneiosAtivos.querySelectorAll('.btn-terminar-torneio').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tid = btn.dataset.tid;
      if (tid && onFinish) {
        onFinish(tid);
      }
    });
  });
}

/**
 * Atualiza o cabeçalho principal com o nome e modalidade do torneio atual.
 */
export function renderHeaderTournament(meta) {
  if (dom.tournamentTitle) {
    dom.tournamentTitle.textContent = meta?.name || 'Futebol ILOG';
  }
  if (dom.headerSportBadge) {
    const sport = getSport(meta?.sport);
    const isKnown = meta?.sport && (meta.sport === 'football' || meta.sport === 'futebol' || sport.id === meta.sport);
    const label = isKnown ? (sport.name || 'Futebol') : (meta?.sport ? meta.sport.charAt(0).toUpperCase() + meta.sport.slice(1) : 'Futebol');
    const icon = isKnown ? (sport.icon || '🏆') : (meta?.sport === 'padel' ? '🎾' : '🏆');
    dom.headerSportBadge.textContent = `${icon} ${label}`;
  }
}

/**
 * Abre o modal para criar um novo torneio.
 */
export function openNovoTorneioModal(onCreate) {
  dom.modalTitle.textContent = 'Novo Torneio';
  dom.modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="field">
        <label for="novoTorneioNome">Nome do Torneio</label>
        <input type="text" id="novoTorneioNome" class="input" placeholder="Ex: Torneio de Primavera" maxlength="60" required>
      </div>
      <div class="field">
        <label for="novoTorneioSport">Modalidade</label>
        <select id="novoTorneioSport" class="input">
          <option value="football">⚽ Futebol</option>
          <option value="padel">🎾 Padel</option>
        </select>
      </div>
      <div class="field">
        <label for="novoTorneioEquipas">Número de Equipas (2–32)</label>
        <input type="number" id="novoTorneioEquipas" class="input" min="2" max="32" value="8">
      </div>
    </div>
  `;
  dom.modalCancel.innerHTML = 'Cancelar';
  dom.modalCancel.style.background = 'var(--paper)';
  dom.modalCancel.style.color = 'var(--ink)';
  dom.modalCancel.hidden = false;

  dom.modalConfirm.innerHTML = 'Criar Torneio';
  dom.modalConfirm.style.background = 'var(--gold)';
  dom.modalConfirm.style.color = '#000';
  dom.modalConfirm.hidden = false;
  dom.modalConfirm.style.display = '';

  setConfirmCallback(async () => {
    const nomeInput = document.getElementById('novoTorneioNome');
    const sportSelect = document.getElementById('novoTorneioSport');
    const equipasInput = document.getElementById('novoTorneioEquipas');
    const nome = (nomeInput?.value || '').trim() || 'Novo Torneio';
    const sport = sportSelect?.value || 'football';
    const numEquipas = Number(equipasInput?.value) || 8;
    if (onCreate) {
      await onCreate({ name: nome, sport, numEquipas });
    }
  });

  dom.modalOverlay.hidden = false;
  const input = document.getElementById('novoTorneioNome');
  if (input) input.focus();
}

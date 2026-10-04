import { state, persistArquivo } from '../state.js';
import { escapeHtml, safeColor, buildPlayerIndex } from '../utils.js';
import { tallyPlayerStats, mergePlayerStats, archiveTally } from '../algorithms.js';
import { dom } from './dom.js';
import { openConfirm } from './modais.js';

// ---------------------------------------------------------------------------
// Histórico — torneios arquivados e estatísticas de sempre
// ---------------------------------------------------------------------------

/** Estatísticas de sempre por jogador: arquivo + torneio atual + jogos singulares. */
export function computeAllTimeStats() {
  return mergePlayerStats(
    ...state.arquivo.map(archiveTally),
    tallyPlayerStats(state.results, state.jogosSingulares),
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('pt-PT');
}

function allTimeRows() {
  const index = buildPlayerIndex();
  const archivedNames = {};
  state.arquivo.forEach((e) => e.jogadores.forEach((j) => { archivedNames[j.pid] = j.nome; }));
  const titles = {};
  state.arquivo.forEach((e) => { if (e.campeao) titles[e.campeao.nome] = (titles[e.campeao.nome] || 0) + 1; });

  const totals = computeAllTimeStats();
  const rows = Object.keys(totals)
    .map((pid) => ({ pid, nome: (index[pid] && index[pid].name) || archivedNames[pid] || 'Jogador Desconhecido', ...totals[pid] }))
    .filter((r) => r.golos || r.assistencias || r.mvp)
    .sort((a, b) => (b.golos - a.golos) || (b.assistencias - a.assistencias) || (b.mvp - a.mvp));
  return { rows, titles };
}

export function renderHistorico() {
  if (!dom.historicoSempre || !dom.arquivoList) return;

  const { rows, titles } = allTimeRows();
  const titleList = Object.keys(titles).sort((a, b) => titles[b] - titles[a]);
  const titlesHtml = titleList.length
    ? `<div class="historico-titulos">${titleList.map((n) => `<span class="historico-titulo">🏆 ${escapeHtml(n)} × ${titles[n]}</span>`).join('')}</div>`
    : '';

  dom.historicoSempre.innerHTML = titlesHtml + (rows.length
    ? `<table class="standings-table historico-sempre"><thead><tr>` +
      `<th style="text-align:left;">Jogador</th><th title="Golos">⚽</th><th title="Assistências">🅰️</th><th title="MVP">⭐</th>` +
      `</tr></thead><tbody>` +
      rows.slice(0, 20).map((r) =>
        `<tr><td class="team-cell">${escapeHtml(r.nome)}</td><td class="num">${r.golos}</td><td class="num">${r.assistencias}</td><td class="num">${r.mvp}</td></tr>`
      ).join('') +
      `</tbody></table>`
    : '<p class="empty">Ainda não há golos registados.</p>');

  if (!state.arquivo.length) {
    dom.arquivoList.innerHTML = '<p class="empty">Ainda não há torneios arquivados. Um admin pode arquivar o torneio atual em Gestão → Dados.</p>';
    return;
  }

  dom.arquivoList.innerHTML = state.arquivo.slice().reverse().map((e) => {
    const campeao = e.campeao
      ? `<span class="arquivo-campeao"><span class="arquivo-cor" style="background:${safeColor(e.campeao.cor)}"></span>${escapeHtml(e.campeao.nome)}</span>`
      : '<span class="arquivo-campeao">Sem campeão</span>';
    const tabelas = e.grupos.map((g) =>
      (e.grupos.length > 1 ? `<div class="arquivo-grupo">${escapeHtml(g.nome)}</div>` : '') +
      `<table class="standings-table"><thead><tr><th>Pos</th><th style="text-align:left;">Equipa</th><th>J</th><th>DG</th><th>Pts</th></tr></thead><tbody>` +
      g.tabela.map((t, i) =>
        `<tr><td><span class="pos-badge">${i + 1}</span></td>` +
        `<td class="team-cell"><span class="arquivo-cor" style="background:${safeColor(t.cor)}"></span>${escapeHtml(t.nome)}</td>` +
        `<td class="num">${Number(t.J) || 0}</td><td class="num">${(Number(t.DG) || 0) > 0 ? '+' : ''}${Number(t.DG) || 0}</td><td class="num pts-cell">${Number(t.Pts) || 0}</td></tr>`
      ).join('') +
      `</tbody></table>`
    ).join('');
    const top = e.jogadores.filter((j) => j.golos || j.assistencias || j.mvp).slice(0, 5);
    const topHtml = top.length
      ? `<div class="arquivo-top">${top.map((j) =>
        `<div>${escapeHtml(j.nome)} — ${Number(j.golos) || 0} ⚽ · ${Number(j.assistencias) || 0} 🅰️ · ${Number(j.mvp) || 0} ⭐</div>`).join('')}</div>`
      : '';
    return (
      `<details class="arquivo-card">` +
      `<summary><div class="arquivo-head"><div>` +
      `<div class="arquivo-nome">${escapeHtml(e.nome)}</div>` +
      `<div class="arquivo-meta">${escapeHtml(fmtDate(e.data))} · ${Number(e.jogos) || 0} jogos · ${Number(e.golos) || 0} golos</div>` +
      `</div><span>🏆 ${campeao}</span></div></summary>` +
      tabelas + topHtml +
      `<button class="btn btn-ghost arquivo-del" data-requires="admin" data-aid="${escapeHtml(e.id)}">🗑️ Apagar do histórico</button>` +
      `</details>`
    );
  }).join('');

  dom.arquivoList.querySelectorAll('.arquivo-del').forEach((btn) => {
    btn.addEventListener('click', () => {
      openConfirm('Apagar do Histórico', 'Este torneio arquivado vai ser apagado. Continuar?', async () => {
        state.arquivo = state.arquivo.filter((x) => x.id !== btn.dataset.aid);
        await persistArquivo();
        renderHistorico();
      });
    });
  });
}

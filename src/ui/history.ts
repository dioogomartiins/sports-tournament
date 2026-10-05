import { state, persistArquivo } from '../state.js';
import { buildPlayerIndex } from '../utils.js';
import { tallyPlayerStats, mergePlayerStats, archiveTally } from '../algorithms.js';
import type { PlayerStats } from '../types.js';
import type { AllTimeRow, AllTimeStats, TitleCount } from '../components/AllTimeStats.js';
import type { ArchiveList } from '../components/ArchiveList.js';
import '../components/AllTimeStats.js';
import '../components/ArchiveList.js';
import { dom } from './dom.js';
import { openConfirm } from './modais.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// History tab — archived tournaments and all-time stats
// ---------------------------------------------------------------------------

/** All-time stats per player: archive + current tournament + single matches. */
export function computeAllTimeStats(): Record<string, PlayerStats> {
  return mergePlayerStats(
    ...state.arquivo.map(archiveTally),
    tallyPlayerStats(state.results, state.jogosSingulares),
  );
}

/** Players with any goal, assist or MVP, best first, and titles per champion. */
function allTimeRows(): { rows: AllTimeRow[]; titles: TitleCount } {
  const index = buildPlayerIndex();
  const archivedNames: Record<string, string> = {};
  state.arquivo.forEach((e) => (e.jogadores || []).forEach((j) => { archivedNames[j.pid] = j.nome; }));
  const titles: TitleCount = {};
  state.arquivo.forEach((e) => { if (e.campeao) titles[e.campeao.nome] = (titles[e.campeao.nome] || 0) + 1; });

  const totals = computeAllTimeStats();
  const rows = Object.keys(totals)
    .map((pid) => ({ pid, name: (index[pid] && index[pid].name) || archivedNames[pid] || en.common.unknownPlayer, ...totals[pid] }))
    .filter((r) => r.golos || r.assistencias || r.mvp)
    .sort((a, b) => (b.golos - a.golos) || (b.assistencias - a.assistencias) || (b.mvp - a.mvp));
  return { rows, titles };
}

export function renderHistorico(): void {
  const allTime = dom.historicoSempre as AllTimeStats | undefined;
  const archive = dom.arquivoList as ArchiveList | undefined;
  if (!allTime || !archive) return;

  const { rows, titles } = allTimeRows();
  allTime.rows = rows;
  allTime.titles = titles;
  archive.entries = state.arquivo;
}

/** Wires the History tab's events; called once at start-up. */
export function bindHistoryEvents(): void {
  dom.arquivoList?.addEventListener('archive-delete', (e) => {
    const id = (e as CustomEvent<string>).detail;
    openConfirm(en.historyTab.deleteModalTitle, en.historyTab.deleteModalPrompt, async () => {
      state.arquivo = state.arquivo.filter((x) => x.id !== id);
      await persistArquivo();
      renderHistorico();
    });
  });
}

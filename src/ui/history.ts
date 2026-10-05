import { state, persistArquivo } from '../state.js';
import { buildPlayerIndex } from '../utils.js';
import { tallyPlayerStats, mergePlayerStats, archiveTally } from '../algorithms.js';
import type { PlayerStats } from '../types.js';
import { archiveRecords } from '../core/archive.js';
import { getSport } from '../sports/registry.js';
import type { PlayerRecord, Sport } from '../sports/Sport.js';
import type { AllTimeRow, AllTimeStats, TitleCount } from '../components/AllTimeStats.js';
import type { ArchiveList } from '../components/ArchiveList.js';
import '../components/AllTimeStats.js';
import '../components/ArchiveList.js';
import { dom } from './dom.js';
import { openConfirm } from './modals.js';
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

/**
 * Matches played and won per player in one sport: its archived tournaments
 * plus the tournament on screen and its single matches.
 */
export function computeAllTimeRecords(sport: Sport): Record<string, PlayerRecord> {
  return sumRecords([
    ...state.arquivo.filter((e) => e.sport === sport.id).map(archiveRecords),
    sport.playerRecords(state.schedule, state.results, state.squads, state.jogosSingulares, state.config),
  ]);
}

function sumRecords(list: Record<string, PlayerRecord>[]): Record<string, PlayerRecord> {
  const out: Record<string, PlayerRecord> = Object.create(null);
  list.forEach((records) => {
    Object.keys(records).forEach((pid) => {
      const r = out[pid] || (out[pid] = { played: 0, won: 0 });
      r.played += records[pid].played;
      r.won += records[pid].won;
    });
  });
  return out;
}

/**
 * The all-time table of the sport on screen, best first, and titles per
 * champion in that sport. Only finished (archived) tournaments count; a
 * player is listed with any match or any of the sport's stats (goals,
 * assists, MVP in football).
 */
function allTimeRows(sport: Sport): { rows: AllTimeRow[]; titles: TitleCount } {
  const index = buildPlayerIndex();
  const archive = state.arquivo.filter((e) => e.sport === sport.id);
  const archivedNames: Record<string, string> = {};
  archive.forEach((e) => (e.jogadores || []).forEach((j) => { archivedNames[j.pid] = j.nome; }));
  const titles: TitleCount = {};
  archive.forEach((e) => { if (e.campeao) titles[e.campeao.nome] = (titles[e.campeao.nome] || 0) + 1; });

  const columns = sport.allTimeColumns();
  const totals = columns.length ? mergePlayerStats(...archive.map(archiveTally)) : {};
  const records = sumRecords(archive.map(archiveRecords));
  const empty: PlayerStats = { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
  const rows = [...new Set([...Object.keys(totals), ...Object.keys(records)])]
    .map((pid) => ({
      pid,
      name: (index[pid] && index[pid].name) || archivedNames[pid] || en.common.unknownPlayer,
      ...empty,
      ...totals[pid],
      played: records[pid]?.played ?? 0,
      won: records[pid]?.won ?? 0,
    }))
    .filter((r) => r.played || columns.some((c) => r[c.key]))
    // The sport's columns first (goals, assists, MVP), then wins and matches
    .sort((a, b) => columns.reduce((d, c) => d || (Number(b[c.key]) - Number(a[c.key])), 0) || (b.won - a.won) || (b.played - a.played));
  return { rows, titles };
}

export function renderHistorico(): void {
  const allTime = dom.historicoSempre as AllTimeStats | undefined;
  const archive = dom.arquivoList as ArchiveList | undefined;
  if (!allTime || !archive) return;

  const sport = getSport(state.meta?.sport || state.config?.sport);
  const { rows, titles } = allTimeRows(sport);
  allTime.columns = sport.allTimeColumns();
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

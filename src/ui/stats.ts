import { state } from '../state.js';
import { sideName, buildPlayerIndex } from '../utils.js';
import { GAME_STATUS } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import { RacketSport } from '../sports/RacketSport.js';
import type { GroupStandings, Score, StandingsRow } from '../types.js';
import type { StatsTable } from '../components/StatsTable.js';
import type { StatCard, StatCards } from '../components/StatCards.js';
import type { DashboardPodium } from '../components/DashboardPodium.js';
import type { ScorerRow, TopScorers } from '../components/TopScorers.js';
import '../components/StatsTable.js';
import '../components/StatCards.js';
import '../components/DashboardPodium.js';
import '../components/TopScorers.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Stats tab, dashboard and the header ticker
// ---------------------------------------------------------------------------

/** What the dashboard, the Stats tab and the playoff draw need to know. */
export interface StatsSummary {
  groupsData: GroupStandings[];
  flatStandings: StandingsRow[];
  total: number;
  played: number;
  pendentes: number;
  totalGoals: number;
  media: number;
  racket: boolean;
  bestAtkLabel: string;
  bestDefLabel: string;
  mostWinsLabel: string;
  mostDrawsLabel: string;
  biggestWinLabel: string;
  totalRounds: number;
  currentRound: number | string;
}

/** Goals per player in the tournament and the single matches, most first. */
export function computeScorerStats(): ScorerRow[] {
  const playerIndex = buildPlayerIndex();
  const stats: Record<string, ScorerRow> = {};

  function addGoal(pId: string): void {
    if (pId === 'auto') return;
    if (!stats[pId]) {
      const info = playerIndex[pId] || { name: en.common.unknownPlayer, team: en.common.noTeam };
      stats[pId] = { name: info.name, team: info.team, count: 0 };
    }
    stats[pId].count++;
  }

  Object.keys(state.results).forEach((gi) => {
    const res = state.results[gi];
    if (!res || typeof res !== 'object' || !res.scorers) return;
    (res.scorers.home || []).forEach(addGoal);
    (res.scorers.away || []).forEach(addGoal);
  });

  state.jogosSingulares.forEach((jogo) => {
    (jogo.scorersA || []).forEach(addGoal);
    (jogo.scorersB || []).forEach(addGoal);
  });

  return Object.values(stats).sort((a, b) => b.count - a.count);
}

/** The summary cards, with racket-sport wording where the points are games. */
export function statCards(summary: StatsSummary): StatCard[] {
  const t = summary.racket ? { ...en.statsTab, ...en.statsTab.racket } : null;
  const cards: StatCard[] = [
    { label: en.statsTab.matchesPlayed, value: `${summary.played} / ${summary.total}` },
    { label: en.statsTab.remainingMatches, value: String(summary.pendentes) },
    { label: t ? t.gamesPlayed : en.statsTab.goalsScored, value: String(summary.totalGoals) },
    { label: t ? t.gamesPerMatchAvg : en.statsTab.goalsPerMatchAvg, value: summary.media.toFixed(2) },
    { label: t ? t.mostGamesWon : en.statsTab.bestAttack, value: summary.bestAtkLabel },
    { label: t ? t.fewestGamesLost : en.statsTab.bestDefense, value: summary.bestDefLabel },
    { label: en.statsTab.biggestBlowout, value: summary.biggestWinLabel },
    { label: en.statsTab.mostWins, value: summary.mostWinsLabel },
  ];
  // No draws in racket sports
  if (!summary.racket) cards.push({ label: en.statsTab.mostDraws, value: summary.mostDrawsLabel });
  return cards;
}

export function renderStatsGrid(summary: StatsSummary): void {
  const cards = dom.statsCards as StatCards | undefined;
  const table = dom.statsTable as StatsTable | undefined;
  if (!cards || !table) return;
  const sport = getSport(state.meta?.sport);
  cards.cards = statCards(summary);
  table.sport = sport;
  table.tally = sport.tallyPlayerStats(state.results, state.jogosSingulares);
  table.players = buildPlayerIndex();
}

/** Score text of a result, or '' when it is scheduled or empty. */
function playedScore(res: Score | string | undefined): string {
  if (!res) return '';
  if (typeof res === 'object') return res.status === GAME_STATUS.AGENDADO ? '' : (res.score || '');
  return String(res);
}

// ---------------------------------------------------------------------------
// General stats (dashboard, Stats tab and playoff generation)
// ---------------------------------------------------------------------------
export function computeStatsSummary(): StatsSummary {
  const teamsArray = (state.teams || []).slice(0, state.scheduleTeamCount);
  const sport = getSport(state.meta?.sport);
  const config = state.config!;
  const racket = sport instanceof RacketSport;
  const groupsData = sport.computeStandings(teamsArray, state.schedule, state.results, config);
  const flatStandings = groupsData.flatMap((g) => g.standings);

  const total = state.schedule.length;
  const played = Object.keys(state.results)
    .filter((k) => /^\d+-\d+( \d+-\d+)*$/.test(playedScore(state.results[k]).trim())).length;
  const totalGoals = flatStandings.reduce((s, t) => s + t.GM, 0);
  const media = played > 0 ? totalGoals / played : 0;
  const withGames = flatStandings.filter((s) => s.J > 0);

  function pick(arr: StandingsRow[], better: (b: StandingsRow, a: StandingsRow) => boolean): StandingsRow | null {
    if (!arr.length) return null;
    return arr.reduce((a, b) => (better(b, a) ? b : a));
  }

  const bestAtk = pick(withGames, (b, a) => b.GM > a.GM);
  const bestDef = pick(withGames, (b, a) => b.GS < a.GS);
  const mostWins = pick(withGames, (b, a) => b.V > a.V);
  const mostDraws = pick(withGames, (b, a) => b.E > a.E);

  let biggestWin: { diff: number; text: string } | null = null;
  state.schedule.forEach((g, gi) => {
    const resStr = playedScore(state.results[gi]);
    if (!resStr) return;
    const pts = sport instanceof RacketSport ? sport.scoreTotals(resStr, config) : sport.scoreTotals(resStr);
    if (!pts) return;
    const diff = Math.abs(pts.home - pts.away);
    if (!biggestWin || diff > biggestWin.diff) {
      biggestWin = { diff, text: `${sideName(g, 'home')} ${resStr} ${sideName(g, 'away')}` };
    }
  });

  const roundPlayed: Record<string, { played: number; total: number }> = {};
  state.schedule.forEach((g, gi) => {
    const r = (roundPlayed[g.jornada] ||= { played: 0, total: 0 });
    r.total++;
    // Started matches count, even before the first goal
    const val = state.results[gi];
    if (val && typeof val === 'object' ? val.status !== GAME_STATUS.AGENDADO : String(val ?? '').trim() !== '') r.played++;
  });

  let currentRound = state.roundsMeta.length ? state.roundsMeta[state.roundsMeta.length - 1].jornada : 0;
  for (const rm of state.roundsMeta) {
    const rp = roundPlayed[rm.jornada] || { played: 0, total: 0 };
    if (rp.played < rp.total) { currentRound = rm.jornada; break; }
  }

  const win = biggestWin as { diff: number; text: string } | null;
  return {
    groupsData,
    flatStandings,
    total,
    played,
    pendentes: total - played,
    totalGoals,
    media,
    racket,
    bestAtkLabel: bestAtk ? `${bestAtk.name} — ${racket ? en.statsTab.racket.gamesLabel(bestAtk.GM) : en.statsTab.goalsLabel(bestAtk.GM)}` : '—',
    bestDefLabel: bestDef ? `${bestDef.name} — ${racket ? en.statsTab.racket.lostLabel(bestDef.GS) : en.statsTab.concededLabel(bestDef.GS)}` : '—',
    mostWinsLabel: mostWins ? `${mostWins.name} — ${en.statsTab.winsLabel(mostWins.V)}` : '—',
    mostDrawsLabel: mostDraws ? `${mostDraws.name} — ${en.statsTab.drawsLabel(mostDraws.E)}` : '—',
    biggestWinLabel: win ? `${win.text}  ${en.statsTab.diffLabel(win.diff)}` : '—',
    totalRounds: state.roundsMeta.length,
    currentRound,
  };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export function renderDashboard(summary: StatsSummary): void {
  dom.tournamentTitle.textContent = (state.config?.nome || en.common.tournament).toUpperCase();

  const podium = dom.dashboardPodium as DashboardPodium | undefined;
  if (podium) {
    podium.teams = state.teams || [];
    podium.rows = summary.flatStandings.slice().sort((a, b) =>
      (b.Pts - a.Pts) || ((b.DG || 0) - (a.DG || 0)) || (b.GM - a.GM));
  }
  const cards = dom.dashboardStats as StatCards | undefined;
  if (cards) cards.cards = statCards(summary);
  const scorers = dom.dashboardScorers as TopScorers | undefined;
  if (scorers) scorers.scorers = computeScorerStats();
}

export function updateTicker(summary: StatsSummary): void {
  if (!summary.totalRounds) {
    dom.marqueeTicker.textContent = en.header.noSchedule;
    return;
  }
  dom.marqueeTicker.textContent = en.header.roundTicker(
    summary.currentRound,
    summary.totalRounds,
    summary.played,
    summary.total,
  );
}

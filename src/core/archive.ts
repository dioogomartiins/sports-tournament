import { getSport } from '../sports/registry.js';
import type { Sport } from '../sports/Sport.js';
import {
  GAME_STATUS,
  type ArchiveEntry,
  type ArchivePlayer,
  type Config,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type Team,
  type TournamentMeta,
} from '../types.js';

// ---------------------------------------------------------------------------
// Tournament Archive
// ---------------------------------------------------------------------------

/**
 * Determines the tournament champion index: winner of the playoff final if playoffs exist,
 * or 1st place in the league table (when single group). Returns null if not yet determined.
 */
export function getChampion(
  schedule: Match[],
  results: Record<string | number, MatchResult>,
  groupsData: GroupStandings[],
  sport: Sport = getSport(),
  config?: Config
): number | null {
  const playoffs = schedule.map((g, gi) => ({ g, gi })).filter(({ g }) => g.isPlayoff);
  if (playoffs.length) {
    const final = playoffs.find(({ g }) => !g.nextMatchId);
    if (!final) return null;
    const winner = sport.getPlayoffWinner(final.g, results[final.gi], config);
    return typeof winner === 'number' ? winner : null;
  }
  if (groupsData.length !== 1) return null;
  const leader = groupsData[0].standings[0];
  return leader && leader.J > 0 ? leader.idx : null;
}

/**
 * Count of tournament matches with an entered score (not scheduled).
 */
export function countPlayedGames(results: Record<string | number, MatchResult>): number {
  return Object.keys(results || {}).filter((gi) => {
    const r = results[gi];
    if (!r) return false;
    if (typeof r === 'object' && r.status === GAME_STATUS.AGENDADO) return false;
    const score = typeof r === 'object' ? r.score : String(r);
    return /^\d+-\d+$/.test(String(score || '').trim());
  }).length;
}

export interface ArchiveSnapshotInput {
  meta?: TournamentMeta;
  config: Config;
  teams: (Team | string)[];
  schedule: Match[];
  results: Record<string | number, MatchResult>;
  scheduleTeamCount?: number;
}

/**
 * Creates an archive entry for a concluded tournament.
 */
export function buildArchiveEntry(
  snap: ArchiveSnapshotInput,
  playerNames: Record<string, string>,
  id: string,
  dataIso: string
): ArchiveEntry {
  const sportId = snap.meta?.sport || snap.config?.sport || 'football';
  const sport = getSport(sportId);
  const teamsArray = snap.teams.slice(0, snap.scheduleTeamCount || snap.config.numEquipas);
  const groupsData = sport.computeStandings(teamsArray, snap.schedule, snap.results, snap.config);

  const teamOf = (idx: number) => {
    const t = teamsArray[idx];
    return {
      nome: (typeof t === 'object' && t !== null && t.name) ? t.name : `Team ${idx + 1}`,
      cor: (typeof t === 'object' && t !== null && t.color) ? t.color : '',
    };
  };

  const champIdx = getChampion(snap.schedule, snap.results, groupsData, sport, snap.config);
  const tally = sport.tallyPlayerStats(snap.results, []);
  const jogadores: ArchivePlayer[] = Object.keys(tally)
    .map((pid) => ({
      pid,
      nome: playerNames[pid] || 'Unknown Player',
      ...tally[pid],
    }))
    .sort(
      (a, b) =>
        b.golos - a.golos ||
        b.assistencias - a.assistencias ||
        b.mvp - a.mvp
    );

  return {
    id,
    nome: snap.meta?.name || snap.config.nome || 'Tournament',
    sport: sportId,
    data: dataIso,
    campeao: champIdx === null ? null : teamOf(champIdx),
    jogos: countPlayedGames(snap.results),
    golos: groupsData.reduce((s, g) => s + g.standings.reduce((t, x) => t + x.GM, 0), 0),
    grupos: groupsData.map((g) => ({
      nome: g.name,
      tabela: g.standings.map((s) => ({
        ...teamOf(s.idx),
        J: s.J,
        V: s.V,
        E: s.E,
        D: s.D,
        GM: s.GM,
        GS: s.GS,
        DG: s.DG ?? 0,
        Pts: s.Pts,
      })),
    })),
    jogadores,
  };
}

/**
 * Extracts player stats from an archive entry in the format of tallyPlayerStats.
 */
export function archiveTally(entry: { jogadores?: ArchivePlayer[] }): Record<string, PlayerStats> {
  const out: Record<string, PlayerStats> = Object.create(null);
  (entry.jogadores || []).forEach((j) => {
    out[j.pid] = {
      golos: j.golos || 0,
      assistencias: j.assistencias || 0,
      mvp: j.mvp || 0,
      jogosAMarcar: j.jogosAMarcar || 0,
      recorde: j.recorde || 0,
    };
  });
  return out;
}

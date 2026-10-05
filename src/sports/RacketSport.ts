import { Sport, type PlayerStatColumn, type StandingsColumn } from './Sport.js';
import {
  GAME_STATUS,
  type Config,
  type GameEvent,
  type GameStatus,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type Score,
  type SetFormat,
  type StandingsRow,
  type Team,
} from '../types.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// RacketSport — sets and games (padel now, tennis later)
// ---------------------------------------------------------------------------
// A match is scored game by game (no 15-30-40). The score is saved as the
// games of each set, e.g. "6-4 3-6 10-7"; the last set is the one being
// played. Standings count games only: games won, then game difference, then
// head-to-head. There are no points per win.

export type Side = 'home' | 'away';

/** Games of one set (points, in a super tie-break). */
export interface SetScore {
  home: number;
  away: number;
}

/** Per pair: matches played and won, games won and lost. */
export interface PairStats {
  played: number;
  won: number;
  lost: number;
  gamesWon: number;
  gamesLost: number;
  /** Matches won / finished matches, 0-100. */
  winPct: number;
}

const SUPER_TIE_BREAK_POINTS = 10;

export abstract class RacketSport extends Sport {
  /** Set format used when the tournament config has none. */
  abstract readonly defaultFormat: SetFormat;

  // -------------------------------------------------------------------------
  // Set format and score text
  // -------------------------------------------------------------------------

  /** The tournament's set format, with out-of-range values replaced by the defaults. */
  format(config?: Partial<Config> | null): SetFormat {
    const f = (config && config.setFormat) || this.defaultFormat;
    const sets = [1, 3, 5].includes(Number(f.sets)) ? Number(f.sets) : this.defaultFormat.sets;
    const games = Number(f.gamesPerSet);
    return {
      sets,
      gamesPerSet: Number.isInteger(games) && games >= 1 && games <= 9 ? games : this.defaultFormat.gamesPerSet,
      superTieBreak: sets > 1 && f.superTieBreak === true,
    };
  }

  /** "6-4 3-6 10-7" → sets; anything else → no sets. */
  parseSets(score: unknown): SetScore[] {
    const text = String(score || '').trim();
    if (!/^\d{1,2}-\d{1,2}( \d{1,2}-\d{1,2})*$/.test(text)) return [];
    return text.split(' ').map((s) => {
      const [home, away] = s.split('-').map(Number);
      return { home, away };
    });
  }

  formatSets(sets: SetScore[]): string {
    return sets.map((s) => `${s.home}-${s.away}`).join(' ');
  }

  /** Sets of a saved result. */
  setsOf(res: MatchResult | undefined): SetScore[] {
    if (!res) return [];
    return this.parseSets(typeof res === 'object' ? res.score : res);
  }

  // -------------------------------------------------------------------------
  // Set and match completion
  // -------------------------------------------------------------------------

  /** Is set number `index` (0-based) the deciding super tie-break? */
  isSuperTieBreak(index: number, format: SetFormat): boolean {
    return format.superTieBreak && index === format.sets - 1;
  }

  /** Winner of a set, or null while it is being played. */
  setWinner(set: SetScore, index: number, format: SetFormat): Side | null {
    for (const side of ['home', 'away'] as const) {
      const mine = set[side];
      const theirs = set[side === 'home' ? 'away' : 'home'];
      if (this.isSuperTieBreak(index, format)) {
        if (mine >= SUPER_TIE_BREAK_POINTS && mine - theirs >= 2) return side;
      } else {
        const g = format.gamesPerSet;
        // 6-4 or better, or 7-5 / 7-6 (tie-break) with 6 games per set
        if ((mine >= g && mine - theirs >= 2) || (mine === g + 1 && theirs === g)) return side;
      }
    }
    return null;
  }

  setsWon(sets: SetScore[], format: SetFormat): SetScore {
    const won = { home: 0, away: 0 };
    sets.forEach((s, i) => {
      const w = this.setWinner(s, i, format);
      if (w) won[w]++;
    });
    return won;
  }

  /** Winner of the match, once a side has won the majority of the sets. */
  matchWinner(sets: SetScore[], format: SetFormat): Side | null {
    const need = Math.ceil(format.sets / 2);
    const won = this.setsWon(sets, format);
    if (won.home >= need) return 'home';
    if (won.away >= need) return 'away';
    return null;
  }

  /**
   * Games per side for the standings. A super tie-break counts as one game
   * for its winner, not as its points.
   */
  gamesOf(sets: SetScore[], format: SetFormat): SetScore {
    const games = { home: 0, away: 0 };
    sets.forEach((s, i) => {
      if (this.isSuperTieBreak(i, format)) {
        const w = this.setWinner(s, i, format);
        if (w) games[w]++;
      } else {
        games.home += s.home;
        games.away += s.away;
      }
    });
    return games;
  }

  /** Games per side of a set score string, for summaries (biggest win…). */
  scoreTotals(score: string | undefined, config?: Config | null): SetScore | null {
    const sets = this.parseSets(score);
    return sets.length ? this.gamesOf(sets, this.format(config)) : null;
  }

  // -------------------------------------------------------------------------
  // Scoring, game by game
  // -------------------------------------------------------------------------

  private copy(res: MatchResult | undefined): Score {
    if (res && typeof res === 'object') return JSON.parse(JSON.stringify(res));
    return { score: typeof res === 'string' ? res : '' };
  }

  /** Changes the status; a match that starts with no score starts at 0-0 in the first set. */
  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out = super.setGameStatus(res, status);
    if (!this.parseSets(out.score).length) out.score = '0-0';
    return out;
  }

  /** Adds one game to a side; a finished set opens the next one. No-op once the match is decided. */
  addPoint(res: MatchResult | undefined, side: Side, config: Config): Score {
    const format = this.format(config);
    const sets = this.setsOf(res);
    if (this.matchWinner(sets, format)) return this.copy(res);

    const out = this.copy(res);
    if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
    const last = sets.length - 1;
    if (last < 0 || this.setWinner(sets[last], last, format)) sets.push({ home: 0, away: 0 });
    sets[sets.length - 1][side]++;
    out.score = this.formatSets(sets);
    return out;
  }

  /** Removes the last game of a side in the current set (reopening the previous set if the current one is empty). */
  removePoint(res: MatchResult | undefined, side: Side): Score {
    const sets = this.setsOf(res);
    while (sets.length > 1 && sets[sets.length - 1].home === 0 && sets[sets.length - 1].away === 0) sets.pop();
    const current = sets[sets.length - 1];
    if (!current || current[side] <= 0) return this.copy(res);
    current[side]--;
    const out = this.copy(res);
    out.score = this.formatSets(sets);
    return out;
  }

  // -------------------------------------------------------------------------
  // Standings: games won, game difference, head-to-head
  // -------------------------------------------------------------------------

  /** Matches that count: league stage, not scheduled, with a valid score. */
  private countedMatches(
    schedule: Match[],
    results: Record<string | number, MatchResult>
  ): Array<{ game: Match; home: number; away: number; sets: SetScore[] }> {
    const out: Array<{ game: Match; home: number; away: number; sets: SetScore[] }> = [];
    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;
      const res = results[gi];
      if (!res) return;
      if (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      const sets = this.setsOf(res);
      if (!sets.length) return;
      out.push({ game, home: game.home, away: game.away, sets });
    });
    return out;
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    const format = this.format(config);
    const nGroups = config.numGrupos || 1;
    const groups: GroupStandings[] = [];
    for (let g = 0; g < nGroups; g++) {
      groups.push({
        name: nGroups > 1 ? en.standings.groupName(String.fromCharCode(65 + g)) : en.standings.generalStandings,
        standings: [],
      });
    }

    const rows: StandingsRow[] = teamsArray.map((t, idx) => {
      const name = typeof t === 'string' ? t : (t && t.name ? t.name : `Team ${idx + 1}`);
      return { idx, name, J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, Pts: 0 };
    });

    this.countedMatches(schedule, results).forEach(({ home, away, sets }) => {
      const h = rows[home];
      const a = rows[away];
      if (!h || !a) return;
      const games = this.gamesOf(sets, format);
      h.J++;
      a.J++;
      h.GM += games.home;
      h.GS += games.away;
      a.GM += games.away;
      a.GS += games.home;
      const winner = this.matchWinner(sets, format);
      if (winner === 'home') { h.V++; a.D++; }
      if (winner === 'away') { a.V++; h.D++; }
    });

    rows.forEach((r) => {
      r.DG = r.GM - r.GS;
      r.Pts = r.GM; // ranking value: games won
      const t = teamsArray[r.idx];
      let g = typeof t === 'object' && t !== null && t.group !== undefined ? t.group : 0;
      if (g >= nGroups) g = nGroups - 1;
      groups[g].standings.push(r);
    });

    groups.forEach((group) => {
      const sorted = group.standings.sort((x, y) => y.GM - x.GM || (y.DG ?? 0) - (x.DG ?? 0));
      let ordered: StandingsRow[] = [];
      let i = 0;
      while (i < sorted.length) {
        let j = i + 1;
        while (j < sorted.length && sorted[j].GM === sorted[i].GM && sorted[j].DG === sorted[i].DG) j++;
        const cluster = sorted.slice(i, j);
        ordered = ordered.concat(cluster.length > 1 ? this.resolveHeadToHead(cluster, schedule, results, config) : cluster);
        i = j;
      }
      group.standings = ordered;
    });

    return groups;
  }

  /** Among tied pairs: games won between them, then game difference, then fewest games lost, then name. */
  resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[] {
    const format = this.format(config);
    const mini = new Map<number, SetScore>();
    cluster.forEach((c) => mini.set(c.idx, { home: 0, away: 0 })); // home = won, away = lost

    this.countedMatches(schedule, results).forEach(({ home, away, sets }) => {
      const h = mini.get(home);
      const a = mini.get(away);
      if (!h || !a) return;
      const games = this.gamesOf(sets, format);
      h.home += games.home;
      h.away += games.away;
      a.home += games.away;
      a.away += games.home;
    });

    return cluster.slice().sort((x, y) => {
      const mx = mini.get(x.idx)!;
      const my = mini.get(y.idx)!;
      return (my.home - mx.home) ||
        ((my.home - my.away) - (mx.home - mx.away)) ||
        (x.GS - y.GS) ||
        x.name.localeCompare(y.name);
    });
  }

  getPlayoffWinner(game: Match, res: MatchResult | undefined, config?: Config): number | string | null {
    if (!game || !game.isPlayoff || !res || typeof res !== 'object') return null;
    if (res.status !== GAME_STATUS.TERMINADO) return null;
    const winner = this.matchWinner(this.setsOf(res), this.format(config));
    return winner ? game[winner] : null;
  }

  /** Matches, wins and games per pair (team index), league and playoffs. */
  pairStats(
    teamCount: number,
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): PairStats[] {
    const format = this.format(config);
    const out: PairStats[] = Array.from({ length: teamCount }, () => ({
      played: 0, won: 0, lost: 0, gamesWon: 0, gamesLost: 0, winPct: 0,
    }));
    schedule.forEach((game, gi) => {
      const res = results[gi];
      if (!res || (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO)) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      const h = out[game.home];
      const a = out[game.away];
      const sets = this.setsOf(res);
      if (!h || !a || !sets.length) return;
      const games = this.gamesOf(sets, format);
      h.played++;
      a.played++;
      h.gamesWon += games.home;
      h.gamesLost += games.away;
      a.gamesWon += games.away;
      a.gamesLost += games.home;
      const winner = this.matchWinner(sets, format);
      if (winner === 'home') { h.won++; a.lost++; }
      if (winner === 'away') { a.won++; h.lost++; }
    });
    out.forEach((p) => {
      const decided = p.won + p.lost;
      p.winPct = decided ? Math.round((p.won / decided) * 100) : 0;
    });
    return out;
  }

  // -------------------------------------------------------------------------
  // Live events
  // -------------------------------------------------------------------------

  /** Kick-off, each game won (`set` when it also wins the set), cancelled game, full time. */
  resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined,
    config?: Config
  ): GameEvent[] {
    const format = this.format(config);
    const events: GameEvent[] = [];
    const a = prev || {};
    Object.keys(next || {}).forEach((gi) => {
      const ra = a[gi];
      const rb = next![gi];
      if (!rb) return;
      const sa = this.statusOf(ra);
      const sb = this.statusOf(rb);
      if (sb === GAME_STATUS.TERMINADO && sa !== GAME_STATUS.TERMINADO) {
        events.push({ type: 'fim', gi });
        return;
      }
      const setsA = this.setsOf(ra);
      const setsB = this.setsOf(rb);
      const totalA = this.rawGames(setsA);
      const totalB = this.rawGames(setsB);
      let changed = false;
      (['home', 'away'] as const).forEach((side) => {
        if (totalB[side] === totalA[side]) return;
        changed = true;
        if (totalB[side] < totalA[side]) {
          events.push({ type: 'anulado', gi, side });
          return;
        }
        const last = setsB.length - 1;
        const wonSet = this.setWinner(setsB[last], last, format) === side;
        events.push({ type: wonSet ? 'set' : 'game', gi, side });
      });
      if (!changed && sb === GAME_STATUS.DECORRER && sa !== GAME_STATUS.DECORRER) {
        events.push({ type: 'inicio', gi });
      }
    });
    return events;
  }

  private rawGames(sets: SetScore[]): SetScore {
    return sets.reduce((t, s) => ({ home: t.home + s.home, away: t.away + s.away }), { home: 0, away: 0 });
  }

  private statusOf(res: MatchResult | undefined): string | null {
    if (!res) return null;
    if (typeof res !== 'object') return GAME_STATUS.TERMINADO;
    return res.status || GAME_STATUS.AGENDADO;
  }

  // -------------------------------------------------------------------------
  // Tables
  // -------------------------------------------------------------------------

  standingsColumns(): StandingsColumn[] {
    const c = en.standings.racketCols;
    return [
      { label: c.gw, value: (s) => s.GM, className: 'pts-cell' },
      { label: c.p, value: (s) => s.J },
      { label: c.w, value: (s) => s.V },
      { label: c.l, value: (s) => s.D },
      { label: c.gl, value: (s) => s.GS },
      { label: c.gd, value: (s) => { const d = s.DG ?? s.GM - s.GS; return (d > 0 ? '+' : '') + d; } },
    ];
  }

  /** Racket sports record no per-player events (goals, assists). */
  playerStatColumns(): PlayerStatColumn[] {
    return [];
  }

  tallyPlayerStats(): Record<string, PlayerStats> {
    return {};
  }
}

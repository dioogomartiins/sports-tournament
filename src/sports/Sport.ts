import { GAME_STATUS } from '../types.js';
import { en } from '../i18n/en.js';
import type {
  Config,
  GameEvent,
  GameStatus,
  GroupStandings,
  Match,
  MatchResult,
  PlayerStats,
  Score,
  SingleMatch,
  SquadPlayer,
  StandingsRow,
  Team,
} from '../types.js';

/** One numeric column of the standings table (after position and team). */
export interface StandingsColumn {
  label: string;
  value: (row: StandingsRow) => string | number;
  /** Extra class on the cell (e.g. the highlighted points column). */
  className?: string;
}

/** One player leaderboard of the stats tab (top scorers, assists…). */
export interface PlayerStatColumn {
  key: keyof PlayerStats;
  title: string;
  /** Text after the count, e.g. "goals". */
  unit: string;
  /** Shown when nobody has any yet. */
  empty: string;
}

/** Matches a player played and won (finished matches only). */
export interface PlayerRecord {
  played: number;
  won: number;
}

/** One extra column of the all-time table in History (goals, assists… in football). */
export interface AllTimeColumn {
  key: keyof PlayerStats;
  /** Short header (an icon), with `title` as its tooltip. */
  label: string;
  title: string;
}

/** One card of the player profile. */
export interface ProfileStat {
  label: string;
  value: string | number;
  /** Small text after the value, e.g. "goals". */
  unit?: string;
  /** Takes the full width of the two-column grid. */
  wide?: boolean;
}

/** A player with goals, for the football leaderboard. */
export interface ScorerCount {
  name: string;
  team: string;
  count: number;
}

/** One line of the dashboard leaderboard. */
export interface LeaderRow {
  name: string;
  /** Small text after the name (team, matches…). */
  detail?: string;
  value: string;
}

/** The dashboard leaderboard: top scorers in football, most wins elsewhere. */
export interface Leaderboard {
  title: string;
  rows: LeaderRow[];
  empty: string;
}

// ---------------------------------------------------------------------------
// Abstract Sport Base Class
// ---------------------------------------------------------------------------

export abstract class Sport {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly icon: string;

  /** Columns of the standings table, in order (some sports change them with the tournament's config). */
  abstract standingsColumns(config?: Config | null): StandingsColumn[];

  /** Player rating attributes (key → label), each rated 0-5 in the player editor. */
  abstract ratingAttributes(): Record<string, string>;

  /** Whether squad players get a jersey number. */
  readonly usesJerseyNumbers: boolean = true;

  /** Player leaderboards shown in the stats tab, in order. */
  abstract playerStatColumns(): PlayerStatColumn[];

  /**
   * Computes group and overall standings for the tournament league stage.
   */
  abstract computeStandings(
    teams: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[];

  /**
   * Resolves head-to-head tiebreak among tied teams.
   */
  abstract resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[];

  /**
   * Determines the winner index of a finished playoff match, accounting for extra-time/penalties if applicable.
   * Returns null if match is not finished or has no winner.
   */
  abstract getPlayoffWinner(
    game: Match,
    res: MatchResult | undefined,
    config?: Config
  ): number | string | null;

  /**
   * Tallies individual player statistics (goals, assists, MVPs, games scored, etc.) across tournament and single matches.
   */
  abstract tallyPlayerStats(
    results: Record<string | number, MatchResult>,
    singleMatches?: SingleMatch[]
  ): Record<string, PlayerStats>;

  /**
   * Merges multiple PlayerStats maps into a combined map.
   */
  mergePlayerStats(
    ...tallies: Array<Record<string, PlayerStats> | undefined | null>
  ): Record<string, PlayerStats> {
    const out: Record<string, PlayerStats> = Object.create(null);
    tallies.forEach((tally) => {
      Object.keys(tally || {}).forEach((pid) => {
        const t = tally![pid];
        if (!out[pid]) out[pid] = { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
        const o = out[pid];
        o.golos += t.golos || 0;
        o.assistencias += t.assistencias || 0;
        o.mvp += t.mvp || 0;
        o.jogosAMarcar += t.jogosAMarcar || 0;
        o.recorde = Math.max(o.recorde, t.recorde || 0);
      });
    });
    return out;
  }

  /**
   * Detects score and status changes between two states to generate animation events.
   */
  abstract resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined,
    config?: Config
  ): GameEvent[];

  /**
   * Adds one point for a side (a goal in football, a game in padel), starting
   * the match if it was scheduled. Scorer and assist are used where the sport
   * records them.
   */
  abstract addPoint(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    config: Config,
    pid?: string,
    aid?: string
  ): Score;

  /**
   * Removes the last point of a side (a cancelled goal or game).
   */
  abstract removePoint(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    config: Config
  ): Score;

  /**
   * Points per side in a score string (goals in football, games in padel),
   * or null when the score is not a valid result.
   */
  scoreTotals(score: string | undefined): { home: number; away: number } | null {
    const m = /^(\d+)-(\d+)$/.exec((score || '').trim());
    return m ? { home: +m[1], away: +m[2] } : null;
  }

  /**
   * The score shown for a match in the schedule and results lists (goals in
   * football), or null when it has none yet.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shownScore(res: MatchResult | undefined, config?: Config | null): { home: number; away: number } | null {
    return this.scoreTotals(res && typeof res === 'object' ? res.score : res);
  }

  /** Is the match finished? A legacy result saved as plain text counts as finished. */
  isFinished(res: MatchResult | undefined): boolean {
    if (!res) return false;
    return typeof res === 'string' ? !!res.trim() : res.status === GAME_STATUS.TERMINADO;
  }

  /** Side that won a finished match, or null (not finished yet, or a draw). */
  winnerSide(res: MatchResult | undefined, config?: Config | null): 'home' | 'away' | null {
    if (!this.isFinished(res)) return null;
    const score = this.shownScore(res, config);
    if (!score || score.home === score.away) return null;
    return score.home > score.away ? 'home' : 'away';
  }

  /**
   * Matches played and won per player id, the same for every sport: a side's
   * players are its squad (and, in Americano, the partner's), and single
   * matches count with their two teams.
   */
  playerRecords(
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    squads: SquadPlayer[][] | null | undefined,
    singleMatches: SingleMatch[] = [],
    config?: Config | null
  ): Record<string, PlayerRecord> {
    const out: Record<string, PlayerRecord> = Object.create(null);
    const count = (ids: string[], won: boolean) => {
      new Set(ids.filter(Boolean)).forEach((id) => {
        const r = out[id] || (out[id] = { played: 0, won: 0 });
        r.played++;
        if (won) r.won++;
      });
    };
    const squadIds = (idx: unknown) => (typeof idx === 'number' ? (squads?.[idx] || []).map((p) => p?.id) : []);

    (schedule || []).forEach((game, gi) => {
      const res = results?.[gi];
      if (!this.isFinished(res)) return;
      const winner = this.winnerSide(res, config);
      (['home', 'away'] as const).forEach((side) => {
        count([...squadIds(game[side]), ...squadIds(game.partners?.[side])], winner === side);
      });
    });

    (singleMatches || []).forEach((m) => {
      const score = this.scoreTotals(m.resultado ?? undefined);
      if (!score) return;
      count(m.equipaA || [], score.home > score.away);
      count(m.equipaB || [], score.away > score.home);
    });
    return out;
  }

  /** Extra columns of the all-time table, after matches and wins. None by default. */
  allTimeColumns(): AllTimeColumn[] {
    return [];
  }

  /**
   * The dashboard leaderboard: by default the sides (teams, pairs or, in
   * Americano, players) with the most wins, then the most points.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  leaderboard(standings: StandingsRow[], scorers: ScorerCount[]): Leaderboard {
    const rows = standings
      .filter((s) => s.V > 0)
      .sort((a, b) => (b.V - a.V) || (b.Pts - a.Pts) || (a.J - b.J))
      .map((s) => ({ name: s.name, detail: en.dashboard.matchesLabel(s.J), value: en.dashboard.winsLabel(s.V) }));
    return { title: en.dashboard.mostWins, rows, empty: en.dashboard.noWinsYet };
  }

  /**
   * The sport's own cards in the player profile, after matches and wins
   * (goals, assists… in football). None by default.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  profileStats(totals: PlayerStats): ProfileStat[] {
    return [];
  }

  /**
   * Updates the game status (scheduled, in progress, finished).
   */
  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out: Score = res && typeof res === 'object'
      ? JSON.parse(JSON.stringify(res))
      : { score: typeof res === 'string' ? res : '' };
    out.status = status;
    return out;
  }

  /**
   * Maps each team to its position in standings: teamIdx -> { g: groupIndex, r: rank }.
   */
  standingsOrder(groupsData: GroupStandings[]): Map<string, { g: number; r: number }> {
    const order = new Map<string, { g: number; r: number }>();
    (groupsData || []).forEach((group, g) => {
      group.standings.forEach((row, r) => order.set(String(row.idx), { g, r }));
    });
    return order;
  }

  /**
   * Calculates rank positions gained/lost by each team between two standings snapshots.
   */
  rankMoves(
    before: Map<string, { g: number; r: number }> | null | undefined,
    after: Map<string, { g: number; r: number }> | null | undefined
  ): Map<string, number> {
    const moves = new Map<string, number>();
    if (!before || !after) return moves;
    after.forEach((now, team) => {
      const old = before.get(team);
      if (old && old.g === now.g && old.r !== now.r) moves.set(team, old.r - now.r);
    });
    return moves;
  }
}

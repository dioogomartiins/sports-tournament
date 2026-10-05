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

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

  /** Columns of the standings table, in order. */
  abstract standingsColumns(): StandingsColumn[];

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
    res: MatchResult | undefined
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
  abstract mergePlayerStats(
    ...tallies: Array<Record<string, PlayerStats> | undefined | null>
  ): Record<string, PlayerStats>;

  /**
   * Records a goal/point event in a match result.
   */
  abstract addGoal(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    pid: string,
    aid?: string
  ): Score;

  /**
   * Removes the last goal/point event for a side in a match result.
   */
  abstract removeGoal(
    res: MatchResult | undefined,
    side: 'home' | 'away'
  ): Score;

  /**
   * Aligns the assists array with the scorers array length.
   */
  abstract alignAssists(
    scorers: string[],
    assists?: string[]
  ): string[];

  /**
   * Updates the game status (scheduled, in progress, finished).
   */
  abstract setGameStatus(
    res: MatchResult | undefined,
    status: GameStatus
  ): Score;

  /**
   * Returns ordered list of goals with scorer and assist for display.
   */
  abstract gameGoals(
    res: MatchResult | undefined
  ): { home: Array<{ pid: string; aid: string }>; away: Array<{ pid: string; aid: string }> };

  /**
   * Detects score and status changes between two states to generate animation events.
   */
  abstract resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined
  ): GameEvent[];

  /**
   * Maps each team to its position in standings: teamIdx -> { g: groupIndex, r: rank }.
   */
  abstract standingsOrder(
    groupsData: GroupStandings[]
  ): Map<string, { g: number; r: number }>;

  /**
   * Calculates rank positions gained/lost by each team between two standings snapshots.
   */
  abstract rankMoves(
    before: Map<string, { g: number; r: number }> | null | undefined,
    after: Map<string, { g: number; r: number }> | null | undefined
  ): Map<string, number>;
}

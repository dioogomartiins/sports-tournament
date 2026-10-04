// ---------------------------------------------------------------------------
// Re-export core algorithms and football sport implementation
// Maintains backwards compatibility for modules importing from algorithms.js
// ---------------------------------------------------------------------------

export { GAME_STATUS } from './types.js';

// Core domain logic: scheduling, draft, and archive
export {
  bergerRounds,
  generateSchedule,
  buildExtraVolta,
  buildFirstRoundSeeding,
  type BergerRound,
  type GeneratedSchedule,
  type ExtraVoltaResult,
} from './core/schedule.js';

export {
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  balancedDraft,
  type DraftTeams,
  type PlayerWithAttributes,
} from './core/draft.js';

export {
  getChampion,
  countPlayedGames,
  buildArchiveEntry,
  archiveTally,
  type ArchiveSnapshotInput,
} from './core/archive.js';

// Football sport implementation: standings, tiebreaks, goals, stats
export {
  Football,
  football,
  computeStandings,
  resolveHeadToHead,
  getPlayoffWinner,
  tallyPlayerStats,
  mergePlayerStats,
  alignAssists,
  addGoal,
  removeGoal,
  setGameStatus,
  gameGoals,
  resultEvents,
  standingsOrder,
  rankMoves,
} from './sports/football/Football.js';

// ---------------------------------------------------------------------------
// Domain Types for Torneio ILOG
// ---------------------------------------------------------------------------

export type Role = 'master' | 'admin' | 'user';

export interface UserProfile {
  uid: string;
  nome?: string;
  email?: string;
  foto?: string;
  ultimoAcesso?: number;
  role?: Role | null;
  admin?: Record<string, boolean>;
}

export type GameStatus = 'agendado' | 'decorrer' | 'terminado';

export const GAME_STATUS = Object.freeze({
  AGENDADO: 'agendado',
  DECORRER: 'decorrer',
  TERMINADO: 'terminado',
} as const);

export interface GameEvent {
  /** golo: a goal; game / set: a padel game, or a game that also won the set. */
  type: 'inicio' | 'golo' | 'anulado' | 'fim' | 'game' | 'set';
  gi: string;
  side?: 'home' | 'away';
  pid?: string;
  aid?: string;
}

export interface PlayerStats {
  golos: number;
  assistencias: number;
  mvp: number;
  jogosAMarcar: number;
  recorde: number;
}

export interface PlayerAttributes {
  velocidade: number;
  finalizacao: number;
  passe: number;
  drible: number;
  defesa: number;
  fisico: number;
  [key: string]: number;
}

/** One sport's ratings of a player: attribute key → 0-5 (keys from `Sport.ratingAttributes()`). */
export type RatingAttributes = Record<string, number>;

export interface Player {
  id: string;
  nome: string;
  teamIdx: number | null;
  ratings?: Record<string, RatingAttributes>;
  atributos?: PlayerAttributes;
}

export interface SquadPlayer {
  id: string;
  num: number | string;
  name: string;
}

export interface Team {
  name: string;
  color: string;
  group?: number;
}

export interface Config {
  nome: string;
  numEquipas: number;
  numGrupos: number;
  numVoltas: number;
  pontosVitoria: number;
  pontosEmpate: number;
  pontosDerrota: number;
  bonusGoleada: number;
  golosGoleada: number;
  mataMata: boolean;
  numPlayoffTeams: number;
  sport: string;
  /** Racket sports: how a match is played (see RacketSport). */
  setFormat?: SetFormat;
  /** Padel: fixed pairs (default), or partners that rotate every round. */
  padelFormat?: 'pairs' | 'americano' | 'mexicano';
  /** Americano / Mexicano: total points of each match (24 by default). */
  matchPoints?: number;
  [key: string]: unknown;
}

/** Set format of a racket-sport tournament. */
export interface SetFormat {
  /** Best of this many sets (1, 3 or 5). */
  sets: number;
  /** Games needed to win a set (6 in padel). */
  gamesPerSet: number;
  /** The deciding set is a super tie-break to 10 points. */
  superTieBreak: boolean;
}

export interface Match {
  jornada: number | string;
  home: number | string;
  away: number | string;
  group?: number;
  isPlayoff?: boolean;
  playoffMatchId?: string | number;
  nextMatchId?: string | number | null;
  label?: string;
  /** Americano / Mexicano: the second player of each pair (home and away hold the first). */
  partners?: { home: number; away: number };
  [key: string]: unknown;
}

export interface GameScorers {
  home?: string[];
  away?: string[];
}

export interface GameAssists {
  home?: string[];
  away?: string[];
}

export interface Score {
  score?: string;
  status?: GameStatus;
  scorers?: GameScorers;
  assists?: GameAssists;
  mvp?: string;
  penalties?: string;
  [key: string]: unknown;
}

export type MatchResult = Score | string;

export interface RoundMeta {
  jornada: number | string;
  bye: string | number | null;
}

/** A friendly match outside the tournament (Single Match tab), as saved. */
export interface SingleMatch {
  id: string;
  data: string;
  nomeEquipaA: string;
  nomeEquipaB: string;
  /** Player ids of each team. */
  equipaA: string[];
  equipaB: string[];
  scorersA?: string[];
  scorersB?: string[];
  assistsA?: string[];
  assistsB?: string[];
  /** "goalsA-goalsB", or null when no score was typed. */
  resultado: string | null;
  mvp?: string;
}

export interface ArchiveTeam {
  nome: string;
  cor: string;
}

export interface ArchiveStandingRow extends ArchiveTeam {
  J: number;
  V: number;
  E: number;
  D: number;
  GM: number;
  GS: number;
  DG: number;
  Pts: number;
}

export interface ArchiveGroup {
  nome: string;
  tabela: ArchiveStandingRow[];
}

export interface ArchivePlayer {
  pid: string;
  nome: string;
  golos: number;
  assistencias: number;
  mvp: number;
  jogosAMarcar: number;
  recorde: number;
}

export type TournamentStatus = 'active' | 'finished';

export interface TournamentMeta {
  id?: string;
  name: string;
  sport: string;
  status: TournamentStatus;
  createdAt: number;
}

export interface ArchiveEntry {
  id: string;
  nome: string;
  sport: string;
  data: string;
  campeao: ArchiveTeam | null;
  jogos: number;
  golos: number;
  grupos: ArchiveGroup[];
  jogadores: ArchivePlayer[];
}

export interface Tournament {
  version?: number;
  exportedAt?: string;
  logRef?: string;
  meta: TournamentMeta;
  config: Config;
  teams: Team[];
  squads: SquadPlayer[][];
  schedule: Match[];
  roundsMeta: RoundMeta[];
  scheduleTeamCount: number;
  scheduleVoltas: number;
  results: Record<string | number, Score | string>;
  players: Player[];
  jogosSingulares: SingleMatch[];
  arquivo?: ArchiveEntry[];
}

export type TournamentSnapshot = Tournament;

export type PlayerIndex = Record<string, { name: string; team: string }>;

export interface StandingsRow {
  idx: number;
  name: string;
  J: number;
  V: number;
  E: number;
  D: number;
  GM: number;
  GS: number;
  DG?: number;
  Pts: number;
}

export interface GroupStandings {
  name: string;
  standings: StandingsRow[];
}

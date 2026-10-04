// ---------------------------------------------------------------------------
// Domain Types for Torneio ILOG
// ---------------------------------------------------------------------------

export type Role = 'admin' | 'user';

export type GameStatus = 'agendado' | 'decorrer' | 'terminado';

export const GAME_STATUS = Object.freeze({
  AGENDADO: 'agendado',
  DECORRER: 'decorrer',
  TERMINADO: 'terminado',
} as const);

export interface GameEvent {
  type: 'inicio' | 'golo' | 'anulado' | 'fim';
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

export interface Player {
  id: string;
  nome: string;
  teamIdx: number | null;
  atributos: PlayerAttributes;
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
  [key: string]: unknown;
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

export interface SingleMatch {
  id?: string;
  data?: string;
  nomeA: string;
  nomeB: string;
  scoreA: number | string;
  scoreB: number | string;
  scorersA?: string[];
  scorersB?: string[];
  assistsA?: string[];
  assistsB?: string[];
  mvp?: string;
  equipaA?: Player[];
  equipaB?: Player[];
  [key: string]: unknown;
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

export interface ArchiveEntry {
  id: string;
  nome: string;
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
  arquivo: ArchiveEntry[];
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

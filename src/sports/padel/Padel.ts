import { RacketSport } from '../RacketSport.js';
import type { Config, GroupStandings, Match, MatchResult, SetFormat, Team } from '../../types.js';
import { isRotationFormat, playerStandings, type RotationFormat } from '../../core/americano.js';
import { en } from '../../i18n/en.js';

// ---------------------------------------------------------------------------
// Padel — best of 3 sets to 6 games, deciding set as a super tie-break
// ---------------------------------------------------------------------------
// The format can be changed per tournament (config.setFormat). A tournament
// can also rotate partners (config.padelFormat: Americano or Mexicano): each
// team slot is then one player, matches are played to config.matchPoints and
// the standings rank players by points won (see core/americano.ts).

export const DEFAULT_MATCH_POINTS = 24;

export class Padel extends RacketSport {
  readonly id = 'padel';
  readonly name = 'Padel';
  readonly icon = '🎾';
  readonly defaultFormat: SetFormat = { sets: 3, gamesPerSet: 6, superTieBreak: true };

  ratingAttributes(): Record<string, string> {
    return en.players.padelAttributes;
  }

  /** Americano or Mexicano, or null for fixed pairs. */
  rotation(config?: Partial<Config> | null): RotationFormat | null {
    const f = config?.padelFormat;
    return isRotationFormat(f) ? f : null;
  }

  /** Rotating formats play each match to a total of points (4 to 99, 24 by default). */
  pointsPerMatch(config?: Partial<Config> | null): number | null {
    if (!this.rotation(config)) return null;
    const n = Number(config?.matchPoints);
    return Number.isInteger(n) && n >= 4 && n <= 99 ? n : DEFAULT_MATCH_POINTS;
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    if (!this.rotation(config)) return super.computeStandings(teamsArray, schedule, results, config);
    return [{ name: en.standings.generalStandings, standings: playerStandings(teamsArray, schedule, results) }];
  }

  /** Rotating formats have no playoffs. */
  getPlayoffWinner(game: Match, res: MatchResult | undefined, config?: Config): number | string | null {
    return this.rotation(config) ? null : super.getPlayoffWinner(game, res, config);
  }
}

export const padel = new Padel();

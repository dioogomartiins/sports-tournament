import { RacketSport } from '../RacketSport.js';
import type { SetFormat } from '../../types.js';
import { en } from '../../i18n/en.js';

// ---------------------------------------------------------------------------
// Padel — best of 3 sets to 6 games, deciding set as a super tie-break
// ---------------------------------------------------------------------------
// The format can be changed per tournament (config.setFormat).

export class Padel extends RacketSport {
  readonly id = 'padel';
  readonly name = 'Padel';
  readonly icon = '🎾';
  readonly defaultFormat: SetFormat = { sets: 3, gamesPerSet: 6, superTieBreak: true };

  ratingAttributes(): Record<string, string> {
    return en.players.padelAttributes;
  }
}

export const padel = new Padel();

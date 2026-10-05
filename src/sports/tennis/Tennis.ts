import { RacketSport } from '../RacketSport.js';
import type { SetFormat } from '../../types.js';
import { en } from '../../i18n/en.js';

// ---------------------------------------------------------------------------
// Tennis — best of 3 sets to 6 games, a full deciding set
// ---------------------------------------------------------------------------
// Singles or doubles: a team is one or two players. Scored game by game like
// padel; the format can be changed per tournament (config.setFormat), e.g.
// best of 5, or a super tie-break instead of the deciding set.

export class Tennis extends RacketSport {
  readonly id = 'tennis';
  readonly name = 'Tennis';
  readonly icon = '🎾';
  readonly defaultFormat: SetFormat = { sets: 3, gamesPerSet: 6, superTieBreak: false };

  ratingAttributes(): Record<string, string> {
    return en.players.tennisAttributes;
  }
}

export const tennis = new Tennis();

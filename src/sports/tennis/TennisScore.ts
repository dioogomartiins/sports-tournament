// ---------------------------------------------------------------------------
// <tennis-score> — the tennis match panel (see RacketScore)
// ---------------------------------------------------------------------------
import { RacketScore } from '../RacketScore.js';
import { tennis } from './Tennis.js';

export class TennisScore extends RacketScore {
  protected readonly sport = tennis;
}

if (!customElements.get('tennis-score')) customElements.define('tennis-score', TennisScore);

declare global {
  interface HTMLElementTagNameMap {
    'tennis-score': TennisScore;
  }
}

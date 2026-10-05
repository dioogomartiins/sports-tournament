// ---------------------------------------------------------------------------
// <padel-score> — the padel match panel (see RacketScore)
// ---------------------------------------------------------------------------
import { RacketScore } from '../RacketScore.js';
import { padel } from './Padel.js';

export class PadelScore extends RacketScore {
  protected readonly sport = padel;
}

if (!customElements.get('padel-score')) customElements.define('padel-score', PadelScore);

declare global {
  interface HTMLElementTagNameMap {
    'padel-score': PadelScore;
  }
}

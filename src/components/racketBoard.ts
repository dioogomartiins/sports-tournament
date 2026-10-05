// ---------------------------------------------------------------------------
// Racket scoreboard — one line per side, as on a padel or tennis broadcast
// ---------------------------------------------------------------------------
// Used by the schedule and results lists. Each line has the side, the games
// of every set (the set being played highlighted, a lost set faded) and the
// sets won; a match played to points shows the points only. With `onStep`
// (an admin in Results) each line also gets − / +.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Config, MatchResult } from '../types.js';
import type { RacketSport, SetScore } from '../sports/RacketSport.js';
import { GAME_STATUS } from '../types.js';
import { en } from '../i18n/en.js';
import { statusOf } from './rounds.js';

export type BoardSide = 'home' | 'away';

export interface RacketBoardOptions {
  sport: RacketSport;
  config: Config | null;
  result: MatchResult | undefined;
  /** The side's label (team, or pair of players). */
  label: (side: BoardSide) => TemplateResult;
  /** − / + of one side; none for a read-only board. */
  onStep?: (side: BoardSide, action: 'add' | 'sub') => void;
}

export function racketBoard(o: RacketBoardOptions): TemplateResult {
  const { sport, config, result } = o;
  const total = sport.pointsPerMatch(config);
  const format = sport.format(config);
  const sets: SetScore[] = total ? [] : sport.setsOf(result);
  const shown = sport.shownScore(result, config);
  const winner = total
    ? (statusOf(result) === GAME_STATUS.TERMINADO && shown && shown.home !== shown.away ? (shown.home > shown.away ? 'home' : 'away') : null)
    : sport.matchWinner(sets, format);
  const playing = !winner && statusOf(result) !== GAME_STATUS.TERMINADO;
  const current = sets.length - 1;
  // One set: its games are the score, a "sets won" column would only say 1-0
  const showSetsWon = !total && format.sets > 1;
  const titles = total
    ? { sub: en.racketScore.cancelPointTitle, add: en.racketScore.addPointTitle }
    : { sub: en.racketScore.cancelGameTitle, add: en.racketScore.addGameTitle };

  const line = (side: BoardSide) => html`
    <div class="rb-line ${winner === side ? 'rb-won' : ''}">
      <span class="rb-team">${o.label(side)}</span>
      <span class="rb-sets">${sets.map((s, i) => {
        const setWinner = sport.setWinner(s, i, format);
        const cls = playing && i === current ? 'rb-current' : (setWinner && setWinner !== side ? 'rb-lost' : '');
        return html`<span class="rb-set ${cls}" data-side=${showSetsWon || total ? nothing : side}>${s[side]}</span>`;
      })}</span>
      ${showSetsWon || total ? html`<span class="rb-total" data-side=${side}>${shown ? shown[side] : '–'}</span>` : nothing}
      ${o.onStep ? html`
        <span class="rb-steps">
          <button class="score-btn" title=${titles.sub} @click=${() => o.onStep!(side, 'sub')}>-</button>
          <button class="score-btn" title=${titles.add} @click=${() => o.onStep!(side, 'add')}>+</button>
        </span>` : nothing}
    </div>`;

  return html`
    <div class="racket-board">
      ${line('home')}${line('away')}
      ${total ? html`<div class="rb-note">${en.racketScore.pointsLine(total, Math.max(0, total - (shown ? shown.home + shown.away : 0)))}</div>` : nothing}
    </div>`;
}

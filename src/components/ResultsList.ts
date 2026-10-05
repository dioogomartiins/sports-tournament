// ---------------------------------------------------------------------------
// <results-list> — a result row per match, by round (Results tab)
// ---------------------------------------------------------------------------
// Football rows have score boxes and − / + per side (penalties in a tied
// playoff); racket rows show sets won with − / + one game, and the games of
// each set below. Events (detail always has the match `gi`):
//   score-step   { gi, side, action: 'add' | 'sub' }   a − / + button
//   score-commit { gi, score: '3-1' | null, penalties? } boxes left with a valid score
//   status-click gi                                    the status pill
//   open-match   gi                                    the "Match" button
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import { GAME_STATUS } from '../types.js';
import type { Config, Match, MatchResult, RoundMeta, Team } from '../types.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { sideLabel } from './templates.js';
import { groupRounds, statusBadge, statusOf } from './rounds.js';
import type { Round } from './rounds.js';

export type ScoreSide = 'home' | 'away';

export interface ScoreStep {
  gi: string;
  side: ScoreSide;
  action: 'add' | 'sub';
}

export interface ScoreCommit {
  gi: string;
  /** "home-away", or null to clear the result. */
  score: string | null;
  penalties?: string;
}

const SCORE = /^(\d+)-(\d+)$/;

export class ResultsList extends LightElement {
  static properties = {
    schedule: { attribute: false },
    roundsMeta: { attribute: false },
    results: { attribute: false },
    teams: { attribute: false },
    sport: { attribute: false },
    config: { attribute: false },
  };

  declare schedule: Match[];
  declare roundsMeta: RoundMeta[];
  declare results: Record<string | number, MatchResult>;
  declare teams: Team[];
  declare sport: Sport | null;
  declare config: Config | null;

  constructor() {
    super();
    this.schedule = [];
    this.roundsMeta = [];
    this.results = {};
    this.teams = [];
    this.sport = null;
    this.config = null;
  }

  render(): TemplateResult {
    if (!this.schedule.length) return html`<p class="empty">${en.schedule.noScheduledMatches}</p>`;
    const rounds = groupRounds(this.schedule, this.roundsMeta).filter((r) => r.games.length);
    return html`${rounds.map((r) => this.roundTemplate(r))}`;
  }

  private roundTemplate(round: Round): TemplateResult {
    const racket = this.sport instanceof RacketSport ? this.sport : null;
    return html`
      <div class="round-card"><div class="round-head">${round.title}</div><div class="round-games">
        ${round.games.map(({ game, gi }) => (racket ? this.racketRow(racket, game, gi) : this.footballRow(game, gi)))}
      </div></div>`;
  }

  // -------------------------------------------------------------------------
  // Rows
  // -------------------------------------------------------------------------

  private footballRow(game: Match, gi: number): TemplateResult {
    const val = this.results[gi];
    const status = statusOf(val);
    const score = SCORE.exec(String((val && typeof val === 'object' ? val.score : val) || ''));
    const pen = SCORE.exec(String((val && typeof val === 'object' && val.penalties) || ''));
    const tied = !!score && score[1] === score[2];
    const showPenalties = tied && status === GAME_STATUS.TERMINADO && !!game.isPlayoff;
    const box = (side: ScoreSide, value: string, cls: string) => html`
      <input type="number" class="input ${cls}" data-side=${side} min="0" max="99" inputmode="numeric"
        .value=${live(value)} @keydown=${ResultsList.blurOnEnter} @focusout=${(e: FocusEvent) => this.commit(e, String(gi))}>`;

    return html`
      <div class="fixture fixture-input" data-game=${gi}>
        <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
        <div class="result-split">
          ${this.stepButton(gi, 'home', 'sub')}${box('home', score ? score[1] : '', 'res-box')}${this.stepButton(gi, 'home', 'add')}
          <span class="res-sep">-</span>
          ${this.stepButton(gi, 'away', 'sub')}${box('away', score ? score[2] : '', 'res-box')}${this.stepButton(gi, 'away', 'add')}
        </div>
        <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
        ${showPenalties ? html`
          <div class="penalties-split">
            <span class="pen-label">${en.results.penalties}</span>
            ${box('home', pen ? pen[1] : '', 'pen-box')}<span class="res-sep">-</span>${box('away', pen ? pen[2] : '', 'pen-box')}
          </div>` : nothing}
        ${this.actionsTemplate(gi, status)}
      </div>`;
  }

  /**
   * Sets won with − / + one game per side; scores are typed game by game only.
   * In a match played to points (Americano), the points with − / + one point.
   */
  private racketRow(sport: RacketSport, game: Match, gi: number): TemplateResult {
    const val = this.results[gi];
    const toPoints = !!sport.pointsPerMatch(this.config);
    const sets = toPoints ? [] : sport.setsOf(val);
    const shown = toPoints ? sport.pointsOf(val) : (sets.length ? sport.setsWon(sets, sport.format(this.config)) : null);
    const titles = toPoints
      ? { sub: en.racketScore.cancelPointTitle, add: en.racketScore.addPointTitle }
      : { sub: en.racketScore.cancelGameTitle, add: en.racketScore.addGameTitle };
    const side = (s: ScoreSide) => html`
      ${this.stepButton(gi, s, 'sub', titles.sub)}
      <span class="res-box res-static" data-side=${s}>${shown ? shown[s] : ''}</span>
      ${this.stepButton(gi, s, 'add', titles.add)}`;
    return html`
      <div class="fixture fixture-input" data-game=${gi}>
        <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
        <div class="result-split">${side('home')}<span class="res-sep">-</span>${side('away')}</div>
        <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
        ${sets.length ? html`<div class="sets-line">${sport.formatSets(sets)}</div>` : nothing}
        ${this.actionsTemplate(gi, statusOf(val))}
      </div>`;
  }

  private stepButton(gi: number, side: ScoreSide, action: 'add' | 'sub', title?: string): TemplateResult {
    return html`<button class="score-btn" data-side=${side} title=${title ?? nothing}
      @click=${() => this.emit<ScoreStep>('score-step', { gi: String(gi), side, action })}>${action === 'add' ? '+' : '-'}</button>`;
  }

  private actionsTemplate(gi: number, status: ReturnType<typeof statusOf>): TemplateResult {
    return html`
      <div class="fixture-actions">
        ${statusBadge(status, () => this.emit('status-click', String(gi)))}
        <button class="mini-btn game-open-btn" title=${en.results.matchButtonTitle}
          @click=${() => this.emit('open-match', String(gi))}>${en.results.matchButton}</button>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Typed scores
  // -------------------------------------------------------------------------

  private static blurOnEnter(e: KeyboardEvent): void {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
  }

  /**
   * Reads the boxes of a row when one loses focus. Both empty clears the
   * result; one empty or not a number marks the boxes and saves nothing.
   */
  private commit(e: FocusEvent, gi: string): void {
    const row = (e.target as HTMLElement).closest('.fixture-input');
    if (!row) return;
    const boxes = [...row.querySelectorAll<HTMLInputElement>('.res-box')];
    const pens = [...row.querySelectorAll<HTMLInputElement>('.pen-box')];
    const [home, away] = boxes.map((b) => b.value.trim());
    const valid = (v: string) => v !== '' && !isNaN(Number(v));
    const all = [...boxes, ...pens];

    if (home === '' && away === '') {
      all.forEach((b) => b.classList.remove('input-invalid'));
      this.emit<ScoreCommit>('score-commit', { gi, score: null });
      return;
    }
    if (!valid(home) || !valid(away)) {
      boxes[0].classList.toggle('input-invalid', !valid(home));
      boxes[1].classList.toggle('input-invalid', !valid(away));
      return;
    }
    all.forEach((b) => b.classList.remove('input-invalid'));
    const [pHome, pAway] = pens.map((b) => b.value.trim());
    const penalties = pens.length && valid(pHome) && valid(pAway)
      ? `${parseInt(pHome, 10)}-${parseInt(pAway, 10)}` : undefined;
    this.emit<ScoreCommit>('score-commit', { gi, score: `${parseInt(home, 10)}-${parseInt(away, 10)}`, penalties });
  }
}

if (!customElements.get('results-list')) customElements.define('results-list', ResultsList);

declare global {
  interface HTMLElementTagNameMap {
    'results-list': ResultsList;
  }
}

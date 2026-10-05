// ---------------------------------------------------------------------------
// <schedule-list> — the fixtures of every round (Schedule tab)
// ---------------------------------------------------------------------------
// A played match shows its score in place of "VS". Emits `open-match`
// (detail: gi) when a fixture is clicked and, when `editable`,
// `status-click` (detail: gi) when its status pill is.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Config, Match, MatchResult, RoundMeta, Team } from '../types.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { racketBoard } from './racketBoard.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { teamLabel, sideLabel } from './templates.js';
import { groupRounds, statusBadge, statusOf } from './rounds.js';
import type { Round } from './rounds.js';

export class ScheduleList extends LightElement {
  static properties = {
    schedule: { attribute: false },
    roundsMeta: { attribute: false },
    results: { attribute: false },
    teams: { attribute: false },
    sport: { attribute: false },
    config: { attribute: false },
    editable: { attribute: false },
  };

  declare schedule: Match[];
  declare roundsMeta: RoundMeta[];
  declare results: Record<string | number, MatchResult>;
  declare teams: Team[];
  declare sport: Sport | null;
  declare config: Config | null;
  /** Can the profile change results? Otherwise the status pill is a label. */
  declare editable: boolean;

  constructor() {
    super();
    this.schedule = [];
    this.roundsMeta = [];
    this.results = {};
    this.teams = [];
    this.sport = null;
    this.config = null;
    this.editable = false;
  }

  render(): TemplateResult {
    if (!this.schedule.length) return html`<p class="empty">${en.schedule.empty}</p>`;
    return html`${groupRounds(this.schedule, this.roundsMeta).map((r) => this.roundTemplate(r))}`;
  }

  private roundTemplate(round: Round): TemplateResult {
    return html`
      <div class="round-card"><div class="round-head">${round.title}</div><div class="round-games">
        ${round.games.map(({ game, gi }) => this.sport instanceof RacketSport ? this.racketRow(this.sport, game, gi) : html`
          <div class="fixture fixture-open" data-game=${gi} title=${en.schedule.viewMatchTitle}
            @click=${() => this.emit('open-match', String(gi))}>
            <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
            <span class="fx-vs">${this.statusTemplate(gi)}${this.scoreTemplate(gi)}</span>
            <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
          </div>`)}
        ${round.bye !== null ? html`<div class="fixture fixture-bye">${en.schedule.byeRound(teamLabel(this.teams, round.bye))}</div>` : nothing}
      </div></div>`;
  }

  /** Padel and tennis: the scoreboard, read-only, and the status below. */
  private racketRow(sport: RacketSport, game: Match, gi: number): TemplateResult {
    return html`
      <div class="fixture fixture-open fixture-racket" data-game=${gi} title=${en.schedule.viewMatchTitle}
        @click=${() => this.emit('open-match', String(gi))}>
        ${racketBoard({ sport, config: this.config, result: this.results[gi], label: (side) => sideLabel(this.teams, game, side) })}
        <div class="rb-status">${this.statusTemplate(gi)}</div>
      </div>`;
  }

  private statusTemplate(gi: number): TemplateResult {
    const onClick = this.editable
      ? (e: Event) => {
        e.stopPropagation();
        this.emit('status-click', String(gi));
      }
      : undefined;
    return statusBadge(statusOf(this.results[gi]), onClick);
  }

  private scoreTemplate(gi: number): TemplateResult {
    const score = this.sport?.shownScore(this.results[gi], this.config) ?? null;
    return score
      ? html`<span class="fx-score">${score.home} - ${score.away}</span>`
      : html`<span>VS</span>`;
  }
}

if (!customElements.get('schedule-list')) customElements.define('schedule-list', ScheduleList);

declare global {
  interface HTMLElementTagNameMap {
    'schedule-list': ScheduleList;
  }
}

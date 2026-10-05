// ---------------------------------------------------------------------------
// <schedule-list> — the fixtures of every round (Schedule tab)
// ---------------------------------------------------------------------------
// Emits `open-match` (detail: gi) when a fixture is clicked and
// `status-click` (detail: gi) when its status pill is.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Match, MatchResult, RoundMeta, Team } from '../types.js';
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
  };

  declare schedule: Match[];
  declare roundsMeta: RoundMeta[];
  declare results: Record<string | number, MatchResult>;
  declare teams: Team[];

  constructor() {
    super();
    this.schedule = [];
    this.roundsMeta = [];
    this.results = {};
    this.teams = [];
  }

  render(): TemplateResult {
    if (!this.schedule.length) return html`<p class="empty">${en.schedule.empty}</p>`;
    return html`${groupRounds(this.schedule, this.roundsMeta).map((r) => this.roundTemplate(r))}`;
  }

  private roundTemplate(round: Round): TemplateResult {
    return html`
      <div class="round-card"><div class="round-head">${round.title}</div><div class="round-games">
        ${round.games.map(({ game, gi }) => html`
          <div class="fixture fixture-open" data-game=${gi} title=${en.schedule.viewMatchTitle}
            @click=${() => this.emit('open-match', String(gi))}>
            <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
            <span class="fx-vs">${statusBadge(statusOf(this.results[gi]), (e) => {
              e.stopPropagation();
              this.emit('status-click', String(gi));
            })} VS</span>
            <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
          </div>`)}
        ${round.bye !== null ? html`<div class="fixture fixture-bye">${en.schedule.byeRound(teamLabel(this.teams, round.bye))}</div>` : nothing}
      </div></div>`;
  }
}

if (!customElements.get('schedule-list')) customElements.define('schedule-list', ScheduleList);

declare global {
  interface HTMLElementTagNameMap {
    'schedule-list': ScheduleList;
  }
}

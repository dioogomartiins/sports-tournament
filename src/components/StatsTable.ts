// ---------------------------------------------------------------------------
// <stats-table> — player leaderboards, one card per stat of the sport
// ---------------------------------------------------------------------------
// Light DOM with `display: contents`, so each card is a direct item of the
// stats grid next to the summary cards, styled by the app's CSS.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { PlayerStatColumn, Sport } from '../sports/Sport.js';
import type { PlayerStats } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface PlayerInfo {
  name: string;
  team: string;
}

export class StatsTable extends LightElement {
  static properties = {
    sport: { attribute: false },
    tally: { attribute: false },
    players: { attribute: false },
    limit: { type: Number },
  };

  declare sport: Sport | null;
  /** Totals per player id, from Sport.tallyPlayerStats. */
  declare tally: Record<string, PlayerStats>;
  /** Name and team per player id. */
  declare players: Record<string, PlayerInfo>;
  declare limit: number;

  constructor() {
    super();
    this.sport = null;
    this.tally = {};
    this.players = {};
    this.limit = 10;
  }

  protected hostDisplay = 'contents' as const;

  render(): TemplateResult {
    const columns = this.sport ? this.sport.playerStatColumns() : [];
    return html`${columns.map((c) => this.cardTemplate(c))}`;
  }

  /** Top players for one stat, highest first. */
  leaders(key: PlayerStatColumn['key']): string[] {
    return Object.keys(this.tally)
      .filter((pid) => this.tally[pid][key] > 0)
      .sort((a, b) => this.tally[b][key] - this.tally[a][key])
      .slice(0, this.limit);
  }

  private cardTemplate(column: PlayerStatColumn): TemplateResult {
    const rows = this.leaders(column.key);
    return html`
      <div class="card stats-half">
        <div class="section-title">${column.title}</div>
        ${rows.length ? rows.map((pid) => this.rowTemplate(pid, column)) : html`<p class="empty">${column.empty}</p>`}
      </div>`;
  }

  private rowTemplate(pid: string, column: PlayerStatColumn): TemplateResult {
    const info = this.players[pid] || { name: en.common.unknownPlayer, team: en.common.noTeam };
    return html`<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${this.tally[pid][column.key]}</strong> ${column.unit} — ${info.name} <span style="color:var(--ink-faint); font-size:13px;">(${info.team})</span></div>`;
  }
}

if (!customElements.get('stats-table')) customElements.define('stats-table', StatsTable);

declare global {
  interface HTMLElementTagNameMap {
    'stats-table': StatsTable;
  }
}

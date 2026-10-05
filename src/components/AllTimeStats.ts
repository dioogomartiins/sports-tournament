// ---------------------------------------------------------------------------
// <all-time-stats> — titles won and the all-time player table (History tab)
// ---------------------------------------------------------------------------
// Every sport has matches and wins; the sport adds its own columns
// (`Sport.allTimeColumns()`: goals, assists and MVP in football).
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { PlayerStats } from '../types.js';
import type { AllTimeColumn, PlayerRecord } from '../sports/Sport.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

/** One player of the all-time table. */
export interface AllTimeRow extends PlayerStats, PlayerRecord {
  pid: string;
  name: string;
}

/** Tournaments won, per champion team name. */
export type TitleCount = Record<string, number>;

export class AllTimeStats extends LightElement {
  static properties = {
    rows: { attribute: false },
    titles: { attribute: false },
    columns: { attribute: false },
    limit: { type: Number },
  };

  /** Players, best first. */
  declare rows: AllTimeRow[];
  declare titles: TitleCount;
  declare columns: AllTimeColumn[];
  declare limit: number;

  constructor() {
    super();
    this.rows = [];
    this.titles = {};
    this.columns = [];
    this.limit = 20;
  }

  render(): TemplateResult {
    return html`${this.titlesTemplate()}${this.rows.length ? this.tableTemplate() : html`<p class="empty">${en.historyTab.noStatsYet}</p>`}`;
  }

  private titlesTemplate(): TemplateResult | typeof nothing {
    const names = Object.keys(this.titles).sort((a, b) => this.titles[b] - this.titles[a]);
    if (!names.length) return nothing;
    return html`<div class="historico-titulos">${names.map((n) => html`<span class="historico-titulo">🏆 ${n} × ${this.titles[n]}</span>`)}</div>`;
  }

  private tableTemplate(): TemplateResult {
    return html`
      <table class="standings-table historico-sempre">
        <thead><tr>
          <th style="text-align:left;">${en.historyTab.playerCol}</th>
          <th title=${en.historyTab.matchesTitle}>${en.historyTab.matchesTitle}</th>
          <th title=${en.historyTab.winsTitle}>${en.historyTab.winsTitle}</th>
          ${this.columns.map((c) => html`<th title=${c.title}>${c.label}</th>`)}
        </tr></thead>
        <tbody>${this.rows.slice(0, this.limit).map((r) => html`
          <tr>
            <td class="team-cell">${r.name}</td><td class="num">${r.played}</td><td class="num">${r.won}</td>
            ${this.columns.map((c) => html`<td class="num">${r[c.key] ?? 0}</td>`)}
          </tr>`)}
        </tbody>
      </table>`;
  }
}

if (!customElements.get('all-time-stats')) customElements.define('all-time-stats', AllTimeStats);

declare global {
  interface HTMLElementTagNameMap {
    'all-time-stats': AllTimeStats;
  }
}

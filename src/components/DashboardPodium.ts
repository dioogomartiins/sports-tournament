// ---------------------------------------------------------------------------
// <dashboard-podium> — top 3 teams and the next five places (dashboard)
// ---------------------------------------------------------------------------
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { StandingsRow, Team } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { teamLabel } from './templates.js';

export class DashboardPodium extends LightElement {
  static properties = {
    rows: { attribute: false },
    teams: { attribute: false },
  };

  /** Every team of every group, best first. */
  declare rows: StandingsRow[];
  declare teams: Team[];

  constructor() {
    super();
    this.rows = [];
    this.teams = [];
  }

  render(): TemplateResult {
    const top = this.rows.slice(0, 3);
    return html`
      <div class="podium">
        ${top.length ? top.map((s, i) => html`
          <div class="podium-card podium-${i + 1}">
            <div class="podium-rank">${en.dashboard.place(i + 1)}</div>
            <div class="podium-name">${s.name}</div>
            <div class="podium-pts">${en.dashboard.ptsMatches(s.Pts, s.J)}</div>
          </div>`) : html`<p class="empty">${en.dashboard.noTeamsConfigured}</p>`}
      </div>
      ${this.restTemplate()}`;
  }

  private restTemplate(): TemplateResult | typeof nothing {
    const rest = this.rows.slice(3, 8);
    if (!rest.length) return nothing;
    return html`
      <table class="mini-table">
        <thead><tr>
          <th class="num">${en.standings.cols.pos}</th><th>${en.standings.cols.team}</th>
          <th class="num">${en.standings.cols.p}</th><th class="num">${en.standings.cols.pts}</th>
        </tr></thead>
        <tbody>${rest.map((s, i) => html`
          <tr><td class="num">${i + 4}</td><td>${teamLabel(this.teams, s.idx)}</td><td class="num">${s.J}</td><td class="num">${s.Pts}</td></tr>`)}
        </tbody>
      </table>`;
  }
}

if (!customElements.get('dashboard-podium')) customElements.define('dashboard-podium', DashboardPodium);

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-podium': DashboardPodium;
  }
}

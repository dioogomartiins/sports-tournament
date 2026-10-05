// ---------------------------------------------------------------------------
// <standings-table> — one table per group, columns from the tournament's sport
// ---------------------------------------------------------------------------
// Rendered in the light DOM so it keeps the app's table styles
// (css/classificacao.css and the mobile tweaks) without copying them.
// When the data changes, teams that changed places slide to their new row.
import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { Sport, StandingsColumn } from '../sports/Sport.js';
import type { GroupStandings, StandingsRow, Team } from '../types.js';
import { en } from '../i18n/en.js';
import { prefersReducedMotion, safeColor } from '../utils.js';

const MEDALS = ['pos-gold', 'pos-silver', 'pos-bronze'];

export class StandingsTable extends LitElement {
  static properties = {
    groups: { attribute: false },
    sport: { attribute: false },
    teams: { attribute: false },
    moves: { attribute: false },
  };

  declare groups: GroupStandings[];
  declare sport: Sport | null;
  declare teams: Team[];
  /** Places gained (>0) or lost (<0) per team index, shown as arrows. */
  declare moves: Map<string, number>;

  /** How long rows take to slide on the next update; 0 to jump. */
  slideDuration = 450;
  private rowTops = new Map<string, number>();

  constructor() {
    super();
    this.groups = [];
    this.sport = null;
    this.teams = [];
    this.moves = new Map();
  }

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  /** Shows new standings, sliding the rows that moved for `duration` ms. */
  show(groups: GroupStandings[], moves: Map<string, number>, duration: number): void {
    this.slideDuration = duration;
    this.groups = groups;
    this.moves = moves;
  }

  protected willUpdate(): void {
    this.rowTops = new Map();
    this.querySelectorAll<HTMLElement>('tr[data-team]').forEach((r) => {
      const top = r.getBoundingClientRect().top;
      if (top) this.rowTops.set(r.dataset.team!, top);
    });
  }

  protected updated(): void {
    const duration = this.slideDuration;
    if (!duration || !this.rowTops.size || prefersReducedMotion()) return;
    this.querySelectorAll<HTMLElement>('tr[data-team]').forEach((r) => {
      const old = this.rowTops.get(r.dataset.team!);
      const now = r.getBoundingClientRect().top;
      if (old === undefined || !now || Math.abs(old - now) < 1 || !r.animate) return;
      r.animate(
        [{ transform: `translateY(${old - now}px)`, background: 'rgba(203,161,53,.22)' }, { transform: 'none' }],
        { duration, easing: 'cubic-bezier(.2,.8,.2,1)' },
      );
    });
  }

  render(): TemplateResult {
    const columns = this.sport ? this.sport.standingsColumns() : [];
    if (!this.groups.length || !this.groups[0].standings.length) {
      return html`<table class="standings-table"><tr><td colspan=${columns.length + 2} class="empty">${en.standings.noTeams}</td></tr></table>`;
    }
    const titled = this.groups.length > 1;
    return html`${this.groups.map((group) => this.groupTemplate(group, columns, titled))}`;
  }

  private groupTemplate(group: GroupStandings, columns: StandingsColumn[], titled: boolean): TemplateResult {
    return html`
      ${titled ? html`<h3 style="margin-top:20px; margin-bottom:10px; color:var(--pitch-800); font-weight:600;">${group.name}</h3>` : nothing}
      <table class="standings-table">
        <thead><tr>
          <th>${en.standings.cols.pos}</th><th class="team-cell">${en.standings.cols.team}</th>
          ${columns.map((c) => html`<th>${c.label}</th>`)}
        </tr></thead>
        <tbody>${group.standings.map((row, i) => this.rowTemplate(row, i, columns))}</tbody>
      </table>`;
  }

  private rowTemplate(row: StandingsRow, i: number, columns: StandingsColumn[]): TemplateResult {
    return html`
      <tr class=${MEDALS[i] || ''} data-team=${row.idx}>
        <td class="pos-cell"><span class="pos-badge">${i + 1}</span>${this.moveBadge(row.idx)}</td>
        <td class="team-cell">${this.teamTemplate(row.idx)}</td>
        ${columns.map((c) => html`<td class="num ${c.className || ''}">${c.value(row)}</td>`)}
      </tr>`;
  }

  /** Team colour dot and name, as in the other tables. */
  private teamTemplate(idx: number): TemplateResult {
    const team = this.teams[idx];
    const name = (team && team.name) || `Team ${idx + 1}`;
    const color = safeColor(team ? team.color : '#2F7A4F');
    return html`<span style="display:inline-flex; align-items:center; white-space:nowrap;"><span style=${styleMap({
      display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
      backgroundColor: color, marginRight: '6px', boxShadow: '0 0 2px rgba(0,0,0,0.3)',
    })}></span>${name}</span>`;
  }

  /** Arrow for places gained (green) or lost (red). */
  private moveBadge(idx: number): TemplateResult | typeof nothing {
    const n = this.moves.get(String(idx));
    if (!n) return nothing;
    const up = n > 0;
    const label = up ? en.standings.movedUp(Math.abs(n)) : en.standings.movedDown(Math.abs(n));
    return html`<span class="pos-move ${up ? 'up' : 'down'}" title=${label} aria-label=${label}>${up ? '▲' : '▼'}${Math.abs(n)}</span>`;
  }
}

if (!customElements.get('standings-table')) customElements.define('standings-table', StandingsTable);

declare global {
  interface HTMLElementTagNameMap {
    'standings-table': StandingsTable;
  }
}

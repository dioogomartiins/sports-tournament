// ---------------------------------------------------------------------------
// <dashboard-leaders> — the sport's leaderboard on the dashboard
// ---------------------------------------------------------------------------
// Top scorers in football, the sides with the most wins in other sports
// (`Sport.leaderboard()`); the controller passes the board in.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Leaderboard } from '../sports/Sport.js';
import { LightElement } from './LightElement.js';

export class DashboardLeaders extends LightElement {
  static properties = {
    board: { attribute: false },
    limit: { type: Number },
  };

  declare board: Leaderboard | null;
  declare limit: number;

  constructor() {
    super();
    this.board = null;
    this.limit = 5;
  }

  render(): TemplateResult {
    if (!this.board) return html``;
    const rows = this.board.rows.slice(0, this.limit);
    return html`
      <div class="section-title" style="margin-top:20px;">${this.board.title}</div>
      ${rows.length ? rows.map((r, i) => html`
        <div style="display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid var(--line);">
          <span>${i + 1}. ${r.name}${r.detail ? html` <span style="color:var(--ink-faint); font-size:12px;">(${r.detail})</span>` : ''}</span>
          <span style="font-weight:700; white-space:nowrap;">${r.value}</span>
        </div>`) : html`<p class="empty" style="padding-top:20px;">${this.board.empty}</p>`}`;
  }
}

if (!customElements.get('dashboard-leaders')) customElements.define('dashboard-leaders', DashboardLeaders);

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-leaders': DashboardLeaders;
  }
}

// ---------------------------------------------------------------------------
// <top-scorers> — the five top scorers of the tournament (dashboard)
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface ScorerRow {
  name: string;
  team: string;
  count: number;
}

export class TopScorers extends LightElement {
  static properties = {
    scorers: { attribute: false },
    limit: { type: Number },
  };

  /** Players with goals, most first. */
  declare scorers: ScorerRow[];
  declare limit: number;

  constructor() {
    super();
    this.scorers = [];
    this.limit = 5;
  }

  render(): TemplateResult {
    const rows = this.scorers.slice(0, this.limit);
    return html`
      <div class="section-title" style="margin-top:20px;">${en.dashboard.topScorers}</div>
      ${rows.length ? rows.map((s, i) => html`
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">
          <span>${i + 1}. ${s.name} <span style="color:var(--ink-faint); font-size:12px;">(${s.team})</span></span>
          <span style="font-weight:700;">${en.statsTab.goalsLabel(s.count)}</span>
        </div>`) : html`<p class="empty" style="padding-top:20px;">${en.statsTab.noGoalsYet}</p>`}`;
  }
}

if (!customElements.get('top-scorers')) customElements.define('top-scorers', TopScorers);

declare global {
  interface HTMLElementTagNameMap {
    'top-scorers': TopScorers;
  }
}

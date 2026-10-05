// ---------------------------------------------------------------------------
// <single-match-history> — saved single matches, newest first
// ---------------------------------------------------------------------------
// Emits `single-delete` (detail: match id).
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface SingleMatchCard {
  id: string;
  date: string;
  teamA: string;
  teamB: string;
  playersA: string[];
  playersB: string[];
  result: string;
  mvp: string;
}

export class SingleMatchHistory extends LightElement {
  static properties = {
    cards: { attribute: false },
  };

  /** Newest first. */
  declare cards: SingleMatchCard[];

  constructor() {
    super();
    this.cards = [];
  }

  render(): TemplateResult {
    if (!this.cards.length) return html`<p class="empty">${en.singleMatch.noMatchesRecorded}</p>`;
    return html`${this.cards.map((m) => html`
      <div class="historico-card">
        <div class="historico-header">
          <span class="historico-date">📅 ${m.date}</span>
          <button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);"
            @click=${() => this.emit('single-delete', m.id)}>🗑️</button>
        </div>
        <div class="historico-teams">
          <div>
            <div class="historico-team-name">${m.teamA}</div>
            <div class="historico-team-players">${m.playersA.join(', ')}</div>
          </div>
          <div class="historico-resultado">${m.result || '—'}${m.mvp ? html`<div class="historico-mvp">⭐ ${m.mvp}</div>` : nothing}</div>
          <div style="text-align:right;">
            <div class="historico-team-name">${m.teamB}</div>
            <div class="historico-team-players">${m.playersB.join(', ')}</div>
          </div>
        </div>
      </div>`)}`;
  }
}

if (!customElements.get('single-match-history')) customElements.define('single-match-history', SingleMatchHistory);

declare global {
  interface HTMLElementTagNameMap {
    'single-match-history': SingleMatchHistory;
  }
}

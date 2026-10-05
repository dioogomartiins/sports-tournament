// ---------------------------------------------------------------------------
// <stat-cards> — the tournament summary cards (dashboard and Stats tab)
// ---------------------------------------------------------------------------
// `display: contents`: each card is a direct item of the parent `.stats-grid`.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { LightElement } from './LightElement.js';

export interface StatCard {
  label: string;
  value: string;
}

export class StatCards extends LightElement {
  static properties = {
    cards: { attribute: false },
  };

  declare cards: StatCard[];
  protected hostDisplay = 'contents' as const;

  constructor() {
    super();
    this.cards = [];
  }

  render(): TemplateResult {
    return html`${this.cards.map((c) => html`
      <div class="stat-card"><div class="stat-label">${c.label}</div><div class="stat-value">${c.value}</div></div>`)}`;
  }
}

if (!customElements.get('stat-cards')) customElements.define('stat-cards', StatCards);

declare global {
  interface HTMLElementTagNameMap {
    'stat-cards': StatCards;
  }
}

// ---------------------------------------------------------------------------
// <player-cards> — the players database as cards (Players tab)
// ---------------------------------------------------------------------------
// Emits `player-profile`, `player-edit` and `player-delete` (detail: player
// id); CSS hides edit and delete from non-admins.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

/** One rating attribute of a player, as the mini table shows it. */
export interface AttributeValue {
  label: string;
  value: number;
}

export interface PlayerCard {
  id: string;
  name: string;
  team: string;
  rating: number;
  attributes: AttributeValue[];
}

/** First letters of the first two names, for the avatar. */
export function initials(name: string): string {
  return (name || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/** The attribute mini table (first three letters of each label). */
export function attributesTemplate(attributes: AttributeValue[]): TemplateResult {
  return html`<div class="player-attrs-mini">${attributes.map((a) => html`
    <div class="player-attr-item"><span class="player-attr-label">${a.label.substring(0, 3)}</span><span class="player-attr-val">${a.value}</span></div>`)}</div>`;
}

const SMALL_BTN = 'font-size:12px; padding:4px 10px; border:1px solid var(--line);';

export class PlayerCards extends LightElement {
  static properties = {
    cards: { attribute: false },
    empty: { type: String },
  };

  declare cards: PlayerCard[];
  /** Shown when the list is empty (no players, or none match the search). */
  declare empty: string;

  constructor() {
    super();
    this.cards = [];
    this.empty = '';
  }

  render(): TemplateResult {
    if (!this.cards.length) return html`<p class="empty">${this.empty}</p>`;
    return html`<div class="player-db-grid">${this.cards.map((p) => this.cardTemplate(p))}</div>`;
  }

  private cardTemplate(p: PlayerCard): TemplateResult {
    return html`
      <div class="player-db-card">
        <div class="player-db-header">
          <div class="player-avatar">${initials(p.name)}</div>
          <div><div class="player-db-name">${p.name}</div><div class="player-db-team">${p.team}</div></div>
          <div class="player-db-rating">★ ${p.rating.toFixed(1)}</div>
        </div>
        ${attributesTemplate(p.attributes)}
        <div class="player-db-actions">
          <button class="btn btn-ghost" style=${SMALL_BTN} @click=${() => this.emit('player-profile', p.id)}>${en.players.statsButton}</button>
          <button class="btn btn-ghost" style=${SMALL_BTN} data-requires="admin" @click=${() => this.emit('player-edit', p.id)}>${en.players.editButton}</button>
          <button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-requires="master"
            @click=${() => this.emit('player-delete', p.id)}>${en.players.deleteButton}</button>
        </div>
      </div>`;
  }
}

if (!customElements.get('player-cards')) customElements.define('player-cards', PlayerCards);

declare global {
  interface HTMLElementTagNameMap {
    'player-cards': PlayerCards;
  }
}

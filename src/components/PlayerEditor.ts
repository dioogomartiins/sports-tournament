// ---------------------------------------------------------------------------
// <player-editor> — name, team and star ratings per sport (player dialog)
// ---------------------------------------------------------------------------
// Ratings are kept for every sport: switching the sport shows its attributes
// without losing the others. The dialog reads `value` when it is confirmed.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { RatingAttributes } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface EditorSport {
  id: string;
  label: string;
  /** Attribute key → label (Sport.ratingAttributes()). */
  attributes: Record<string, string>;
}

export interface PlayerEditorValue {
  name: string;
  teamIdx: number | null;
  ratings: Record<string, RatingAttributes>;
}

const LABEL = 'display:block; font-weight:600; margin-bottom:6px; font-size:13px;';

export class PlayerEditor extends LightElement {
  static properties = {
    sports: { attribute: false },
    teams: { attribute: false },
    sportId: { state: true },
    ratings: { state: true },
  };

  declare sports: EditorSport[];
  /** Team names of the tournament, by index. */
  declare teams: string[];
  private declare sportId: string;
  private declare ratings: Record<string, RatingAttributes>;

  private name = '';
  private teamIdx: number | null = null;

  constructor() {
    super();
    this.sports = [];
    this.teams = [];
    this.sportId = '';
    this.ratings = {};
  }

  /** Starts editing: the player's current values and the sport shown first. */
  load(value: PlayerEditorValue, sportId: string): void {
    this.name = value.name;
    this.teamIdx = value.teamIdx;
    this.ratings = JSON.parse(JSON.stringify(value.ratings || {}));
    this.sportId = sportId;
  }

  get value(): PlayerEditorValue {
    return { name: this.name.trim(), teamIdx: this.teamIdx, ratings: this.ratings };
  }

  private get sport(): EditorSport {
    return this.sports.find((s) => s.id === this.sportId) || this.sports[0];
  }

  private attrs(): RatingAttributes {
    return this.ratings[this.sport.id] || {};
  }

  /** Average of the shown sport's attributes. */
  private average(): number {
    const keys = Object.keys(this.sport.attributes);
    const a = this.attrs();
    return keys.length ? keys.reduce((s, k) => s + (Number(a[k]) || 0), 0) / keys.length : 0;
  }

  private setStar(key: string, n: number): void {
    const a = { ...this.attrs() };
    a[key] = a[key] === n ? 0 : n;
    this.ratings = { ...this.ratings, [this.sport.id]: a };
  }

  render(): TemplateResult {
    if (!this.sports.length) return html``;
    const sport = this.sport;
    const a = this.attrs();
    return html`
      <div style="margin-bottom:12px;">
        <label style=${LABEL}>${en.players.nameLabel}</label>
        <input type="text" class="input" .value=${this.name} placeholder=${en.players.namePlaceholder} maxlength="60" style="width:100%;"
          @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }}>
      </div>
      <div style="margin-bottom:12px;">
        <label style=${LABEL}>${en.players.teamLabel}</label>
        <select class="input" style="width:100%;" @change=${(e: Event) => {
          const v = (e.target as HTMLSelectElement).value;
          this.teamIdx = v === '' ? null : parseInt(v, 10);
        }}>
          <option value="">${en.players.noTeam}</option>
          ${this.teams.map((t, i) => html`<option value=${i} ?selected=${this.teamIdx === i}>${t}</option>`)}
        </select>
      </div>
      <div style="margin-bottom:16px;">
        <label style=${LABEL}>${en.players.attributeSportLabel}</label>
        <select class="input" style="width:100%;" @change=${(e: Event) => { this.sportId = (e.target as HTMLSelectElement).value; }}>
          ${this.sports.map((s) => html`<option value=${s.id} ?selected=${s.id === sport.id}>${s.label}</option>`)}
        </select>
      </div>
      <div class="rating-preview">★ ${this.average().toFixed(1)}</div>
      <div class="rating-preview-label">${en.players.ratingLabel(sport.label)}</div>
      <div>${Object.entries(sport.attributes).map(([key, label]) => html`
        <div class="star-row">
          <span class="star-row-label">${label}</span>
          <div class="stars-input">${[1, 2, 3, 4, 5].map((n) => html`
            <button type="button" class="star-btn${n <= (Number(a[key]) || 0) ? ' filled' : ''}" @click=${() => this.setStar(key, n)}>★</button>`)}</div>
        </div>`)}</div>`;
  }
}

if (!customElements.get('player-editor')) customElements.define('player-editor', PlayerEditor);

declare global {
  interface HTMLElementTagNameMap {
    'player-editor': PlayerEditor;
  }
}

// ---------------------------------------------------------------------------
// <squad-list> — the players of one team, with the squad's average rating
// ---------------------------------------------------------------------------
// Emits `player-stats` (detail: player id) and `squad-remove` (detail: player
// id); CSS hides the remove button from non-admins.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface SquadRow {
  id: string;
  num: number | string;
  name: string;
  /** Rating in the tournament's sport, or null for a player not in the database. */
  rating: number | null;
}

export class SquadList extends LightElement {
  static properties = {
    rows: { attribute: false },
    teamSelected: { type: Boolean },
    numbered: { type: Boolean },
    editable: { type: Boolean },
  };

  /** Players in squad order. */
  declare rows: SquadRow[];
  declare teamSelected: boolean;
  /** Football squads show jersey numbers; padel pairs do not. */
  declare numbered: boolean;
  declare editable: boolean;

  constructor() {
    super();
    this.rows = [];
    this.teamSelected = false;
    this.numbered = true;
    this.editable = false;
  }

  render(): TemplateResult {
    if (!this.teamSelected) return html`<p class="empty">${en.squads.noTeamSelected}</p>`;
    if (!this.rows.length) {
      return html`<p class="empty" style="padding-top:20px;">${this.editable ? en.squads.noPlayersAdmin : en.squads.noPlayersReadonly}</p>`;
    }
    const rated = this.rows.filter((r) => r.rating !== null);
    const avg = rated.length ? rated.reduce((s, r) => s + (r.rating || 0), 0) / rated.length : 0;
    return html`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; margin-bottom:12px; padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm);">
        <span style="font-size:13px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">${en.squads.playersCount(this.rows.length)}</span>
        <span style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);" title=${en.squads.avgRatingTitle}>${en.squads.avgRating(avg.toFixed(1))}</span>
      </div>
      <div>${this.rows.map((p) => this.rowTemplate(p))}</div>`;
  }

  private rowTemplate(p: SquadRow): TemplateResult {
    return html`
      <div class="player-row">
        <div class="player-info">
          ${this.numbered ? html`<span class="player-num">${p.num}</span>` : nothing}<span style="font-weight:600;">${p.name}</span>
          ${p.rating !== null ? html` <span style="font-size:12px; color:var(--gold-dark); font-weight:700;">★ ${p.rating.toFixed(1)}</span>` : nothing}
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost player-stats-btn" style="color:var(--pitch-800); background:var(--paper); border:1px solid var(--line); padding:4px 8px; font-size:12px;"
            @click=${() => this.emit('player-stats', p.id)}>📊 ${en.common.stats}</button>
          <button class="player-del" data-requires="admin" title=${en.squads.removePlayerTitle}
            @click=${() => this.emit('squad-remove', p.id)}>&times;</button>
        </div>
      </div>`;
  }
}

if (!customElements.get('squad-list')) customElements.define('squad-list', SquadList);

declare global {
  interface HTMLElementTagNameMap {
    'squad-list': SquadList;
  }
}

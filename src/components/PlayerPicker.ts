// ---------------------------------------------------------------------------
// <player-picker> — a checkbox per player, with a count of those chosen
// ---------------------------------------------------------------------------
// Used by the single match draft and the padel pair draw. Emits
// `selection-change` (detail: the chosen ids) whenever a box changes.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { LightElement } from './LightElement.js';

export interface PickerRow {
  id: string;
  name: string;
  rating: number;
  /** Small label after the name (e.g. the player's team). */
  badge?: string;
}

export class PlayerPicker extends LightElement {
  static properties = {
    rows: { attribute: false },
    countLabel: { attribute: false },
    empty: { type: String },
    selected: { state: true },
  };

  declare rows: PickerRow[];
  /** Text of the count line, e.g. "3 players selected". */
  declare countLabel: (n: number) => string;
  /** Shown when there are no players. */
  declare empty: string;
  private declare selected: Set<string>;

  constructor() {
    super();
    this.rows = [];
    this.countLabel = (n) => String(n);
    this.empty = '';
    this.selected = new Set();
  }

  /** Chosen player ids, in list order. */
  get selectedIds(): string[] {
    return this.rows.filter((r) => this.selected.has(r.id)).map((r) => r.id);
  }

  /** Unticks every box. */
  clear(): void {
    this.selected = new Set();
    this.emit('selection-change', []);
  }

  protected willUpdate(): void {
    // Players removed from the list are no longer chosen
    const ids = new Set(this.rows.map((r) => r.id));
    if ([...this.selected].some((id) => !ids.has(id))) {
      this.selected = new Set([...this.selected].filter((id) => ids.has(id)));
    }
  }

  private toggle(id: string, on: boolean): void {
    const next = new Set(this.selected);
    if (on) next.add(id);
    else next.delete(id);
    this.selected = next;
    this.emit('selection-change', this.selectedIds);
  }

  render(): TemplateResult {
    if (!this.rows.length) return html`<p class="empty">${this.empty}</p>`;
    return html`
      <p class="draft-selected-count">${this.countLabel(this.selected.size)}</p>
      ${this.rows.map((r) => html`
        <label class="draft-player-row">
          <input type="checkbox" class="draft-checkbox" .checked=${this.selected.has(r.id)}
            @change=${(e: Event) => this.toggle(r.id, (e.target as HTMLInputElement).checked)}>
          <span class="draft-player-nome">${r.name}</span>
          ${r.badge ? html`<span class="draft-player-team-badge">${r.badge}</span>` : nothing}
          <span class="draft-player-rating">★ ${r.rating.toFixed(1)}</span>
        </label>`)}`;
  }
}

if (!customElements.get('player-picker')) customElements.define('player-picker', PlayerPicker);

declare global {
  interface HTMLElementTagNameMap {
    'player-picker': PlayerPicker;
  }
}

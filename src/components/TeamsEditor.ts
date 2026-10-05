// ---------------------------------------------------------------------------
// <teams-editor> — colour and name of every team slot (Teams tab)
// ---------------------------------------------------------------------------
// Slots past the schedule's team count are greyed out. Emits `team-change`
// (detail: { idx, prop: 'name' | 'color', value }) when a field is left or a
// colour is picked. Read-only unless `editable`.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import type { Team } from '../types.js';
import { en } from '../i18n/en.js';
import { safeColor } from '../utils.js';
import { LightElement } from './LightElement.js';

export interface TeamChange {
  idx: number;
  prop: 'name' | 'color';
  value: string;
}

export class TeamsEditor extends LightElement {
  static properties = {
    teams: { attribute: false },
    slots: { type: Number },
    activeCount: { type: Number },
    showGroups: { type: Boolean },
    editable: { type: Boolean },
  };

  declare teams: Team[];
  /** How many slots to list (MAX_TEAMS). */
  declare slots: number;
  /** Teams in the current schedule. */
  declare activeCount: number;
  declare showGroups: boolean;
  declare editable: boolean;
  protected hostDisplay = 'contents' as const;

  constructor() {
    super();
    this.teams = [];
    this.slots = 0;
    this.activeCount = 0;
    this.showGroups = false;
    this.editable = false;
  }

  private change(idx: number, prop: TeamChange['prop'], e: Event): void {
    const value = (e.target as HTMLInputElement).value.trim();
    if ((this.teams[idx]?.[prop] ?? '') === value) return;
    this.emit<TeamChange>('team-change', { idx, prop, value });
  }

  render(): TemplateResult {
    return html`${Array.from({ length: this.slots }, (_, i) => this.rowTemplate(i))}`;
  }

  private rowTemplate(i: number): TemplateResult {
    const active = i < this.activeCount;
    const t = this.teams[i] || { name: '', color: '#2F7A4F' };
    const group = active && this.showGroups && t.group !== undefined
      ? html`<span class="team-tag" style="background:var(--pitch-800); color:#fff; border:none; margin-left: 8px;">${en.teams.groupBadge(String.fromCharCode(65 + t.group))}</span>`
      : nothing;
    return html`
      <div class="team-row${active ? '' : ' team-row-inactive'}">
        <span class="team-num">${i + 1}</span>
        <input type="color" class="team-color-picker team-prop" .value=${live(safeColor(t.color))} title=${en.teams.teamColorTitle}
          ?disabled=${!this.editable} @change=${(e: Event) => this.change(i, 'color', e)}>
        <input type="text" class="input team-prop" .value=${live(t.name || '')} placeholder=${en.teams.teamPlaceholder(i + 1)}
          ?disabled=${!this.editable} @focusout=${(e: Event) => this.change(i, 'name', e)}
          @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}>
        ${group}
        ${active ? nothing : html`<span class="team-tag">${en.teams.outsideSchedule}</span>`}
      </div>`;
  }
}

if (!customElements.get('teams-editor')) customElements.define('teams-editor', TeamsEditor);

declare global {
  interface HTMLElementTagNameMap {
    'teams-editor': TeamsEditor;
  }
}

// ---------------------------------------------------------------------------
// <draft-teams> — the two drafted teams of a single match, with goals
// ---------------------------------------------------------------------------
// Shows each player's rating, goals and assists, the rating difference and the
// MVP. Emits `draft-goal-add` and `draft-goal-sub` (detail: { side, pid }) and
// `draft-mvp`; the controller keeps the goals and asks for the assist.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export type DraftSide = 'A' | 'B';

export interface DraftPlayer {
  id: string;
  name: string;
  rating: number;
}

export interface DraftTeam {
  name: string;
  players: DraftPlayer[];
  /** Scorer id per goal, in order. */
  scorers: string[];
  /** Assist id per goal ('' for none), aligned with `scorers`. */
  assists: string[];
}

export interface DraftGoal {
  side: DraftSide;
  pid: string;
}

const STEP_BTN = 'padding: 2px 8px; font-size:14px; border:1px solid var(--line);';

export class DraftTeams extends LightElement {
  static properties = {
    teamA: { attribute: false },
    teamB: { attribute: false },
    mvpName: { type: String },
    mvpId: { type: String },
  };

  declare teamA: DraftTeam | null;
  declare teamB: DraftTeam | null;
  /** MVP's name, or '' before one is picked. */
  declare mvpName: string;
  declare mvpId: string;

  constructor() {
    super();
    this.teamA = null;
    this.teamB = null;
    this.mvpName = '';
    this.mvpId = '';
  }

  private static total(team: DraftTeam): number {
    return Math.round(team.players.reduce((s, p) => s + p.rating, 0) * 10) / 10;
  }

  render(): TemplateResult | typeof nothing {
    if (!this.teamA || !this.teamB) return nothing;
    const diff = Math.abs(DraftTeams.total(this.teamA) - DraftTeams.total(this.teamB)).toFixed(1);
    return html`
      <div class="draft-teams-grid">
        ${this.teamTemplate(this.teamA, 'A')}
        ${this.teamTemplate(this.teamB, 'B')}
        <div class="draft-balance-bar">${en.singleMatch.ratingDifference}<span class="draft-balance-diff">${diff} ★</span></div>
        <button class="btn btn-ghost draft-mvp-btn" @click=${() => this.emit('draft-mvp')}>⭐ MVP: ${this.mvpName || en.singleMatch.chooseMvp}</button>
      </div>`;
  }

  private teamTemplate(team: DraftTeam, side: DraftSide): TemplateResult {
    return html`
      <div class="draft-team-card team-${side.toLowerCase()}">
        <div class="draft-team-name">${team.name}</div>
        <div class="draft-team-rating-total">${en.singleMatch.totalRating(DraftTeams.total(team))}</div>
        ${team.players.map((p, i) => {
          const goals = team.scorers.filter((id) => id === p.id).length;
          const assists = team.assists.filter((id) => id === p.id).length;
          return html`
            <div class="draft-team-player-row">
              <span class="draft-pick-num">${i + 1}.</span>
              <span style="flex:1; font-weight:600;">${p.name}${this.mvpId === p.id ? ' ⭐' : ''}${assists
                ? html` <span style="font-size:12px; color:var(--ink-faint); font-weight:500;">${assists} 🅰️</span>` : nothing}</span>
              <span style="font-size:12px; color:var(--gold-dark); font-weight:700; margin-right:12px;">★ ${p.rating.toFixed(1)}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn btn-ghost" style="${STEP_BTN} color:var(--danger);"
                  @click=${() => this.emit<DraftGoal>('draft-goal-sub', { side, pid: p.id })}>-</button>
                <span style="font-weight:700; color:var(--pitch-600); min-width:14px; text-align:center;">${goals}</span>
                <button class="btn btn-ghost" style="${STEP_BTN} color:var(--pitch-600);"
                  @click=${() => this.emit<DraftGoal>('draft-goal-add', { side, pid: p.id })}>⚽+</button>
              </div>
            </div>`;
        })}
      </div>`;
  }
}

if (!customElements.get('draft-teams')) customElements.define('draft-teams', DraftTeams);

declare global {
  interface HTMLElementTagNameMap {
    'draft-teams': DraftTeams;
  }
}

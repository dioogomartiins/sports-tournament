// ---------------------------------------------------------------------------
// <football-score> — the football match panel: score, goals timeline, MVP.
// ---------------------------------------------------------------------------
// Adds to ScoreBase the football event banners (goal, cancelled goal,
// kick-off, full time) and the goals timeline. Emits `mvp` and `share`
// (detail: { gi }) besides the ScoreBase events; Pick MVP only shows with
// `canPickMvp` (the match opened from Results by an admin).
import { html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ScoreBase } from '../../components/ScoreBase.js';
import { GAME_STATUS } from '../../types.js';
import type { GameEvent } from '../../types.js';
import { gameGoals } from '../../algorithms.js';
import { playerName } from '../../utils.js';
import { en } from '../../i18n/en.js';

export class FootballScore extends ScoreBase {
  static properties = {
    ...ScoreBase.properties,
    canPickMvp: { attribute: false },
  };

  declare canPickMvp: boolean;

  constructor() {
    super();
    this.canPickMvp = false;
  }

  static styles = [...ScoreBase.styles, css`
    .gm-body {
      padding: 16px 12px;
      background: var(--paper);
      color: var(--ink);
    }

    .gm-goals {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      position: relative;
    }

    .gm-goals::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      border-left: 1px dashed var(--line);
    }

    .gm-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .gm-card {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 10px;
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      background: var(--card);
      box-shadow: var(--shadow-sm);
      min-width: 0;
      animation: card-in .25s ease-out both;
    }

    @keyframes card-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: none; }
    }

    .gm-col-home .gm-card {
      flex-direction: row-reverse;
      text-align: right;
    }

    .gm-ball {
      font-size: 18px;
      flex: none;
    }

    .gm-scorer {
      font-size: 13px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .gm-assist {
      font-size: 12px;
      color: var(--ink-soft);
      overflow-wrap: anywhere;
    }

    .gm-mvp {
      margin-top: 14px;
      text-align: center;
      font-size: 13px;
    }

    .gm-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .gm-action {
      flex: 1 1 160px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--card);
      color: var(--ink);
      font-size: 14px;
      font-weight: 600;
      transition: transform .12s ease;
    }

    .gm-action:active {
      transform: translateY(1px);
    }

    .gm-action strong {
      margin-left: 4px;
    }

    .gm-empty {
      margin: 0;
      padding: 14px 2px;
      font-size: 14px;
      text-align: center;
      color: var(--ink-faint);
      font-style: italic;
    }

    @media (prefers-reduced-motion: reduce) {
      .gm-card {
        animation: none !important;
      }
    }
  `];

  protected get pointLabels(): { add: string; cancel: string } {
    return { add: en.gameModal.addGoalTitle, cancel: en.gameModal.cancelGoalTitle };
  }

  message(ev: GameEvent): TemplateResult {
    const m = this.match;
    if (ev.type === 'golo') {
      const assist = ev.aid && ev.aid !== 'auto'
        ? html`<div class="anim-sub2">${en.animations.assist}${playerName(ev.aid)}</div>` : nothing;
      return html`<div class="anim-title">${en.animations.goal}</div><div class="anim-sub">⚽ ${this.eventScorer(ev)}</div>${assist}`;
    }
    if (ev.type === 'anulado') {
      return html`<div class="anim-title">${en.animations.goalCancelled}</div><div class="anim-sub"><s>${this.eventScorer(ev)}</s></div>`;
    }
    if (ev.type === 'inicio') {
      return this.whistleMessage(en.animations.kickOff, m ? `${m.home.name} vs ${m.away.name}` : '');
    }
    const score = this.score;
    return this.whistleMessage(en.animations.fullTime,
      m && score ? `${m.home.name} ${score.home}-${score.away} ${m.away.name}` : '');
  }

  /** Scorer shown in a banner: the player, "Own goal", or the team when unknown. */
  private eventScorer(ev: GameEvent): string {
    if (ev.pid === 'auto') return en.animations.ownGoal;
    if (ev.pid) return playerName(ev.pid);
    return this.match && ev.side ? this.match[ev.side].name : '';
  }

  protected renderBody(): TemplateResult {
    return html`<div class="gm-body">${this.goalsTemplate()}${this.mvpTemplate()}</div>`;
  }

  private goalsTemplate(): TemplateResult {
    const goals = gameGoals(this.match?.result);
    if (!goals.home.length && !goals.away.length) {
      return html`<p class="gm-empty">${en.gameModal.noGoalsInMatch}</p>`;
    }
    return html`
      <div class="gm-goals">
        <div class="gm-col gm-col-home">${goals.home.map((g) => this.goalCard(g))}</div>
        <div class="gm-col gm-col-away">${goals.away.map((g) => this.goalCard(g))}</div>
      </div>`;
  }

  private goalCard(goal: { pid: string; aid: string }): TemplateResult {
    const scorer = goal.pid === 'auto' ? en.gameModal.ownGoal : (goal.pid ? playerName(goal.pid) : en.gameModal.goal);
    const assist = goal.aid && goal.aid !== 'auto' ? html`<div class="gm-assist">${playerName(goal.aid)}</div>` : nothing;
    return html`
      <div class="gm-card">
        <span class="gm-ball" aria-hidden="true">⚽</span>
        <div><div class="gm-scorer">${scorer}</div>${assist}</div>
      </div>`;
  }

  /** MVP and sharing only make sense with the match finished. */
  private mvpTemplate(): TemplateResult | typeof nothing {
    const res = this.match?.result;
    const mvpName = res && typeof res === 'object' && res.mvp ? playerName(res.mvp) : '';
    if (this.status === GAME_STATUS.TERMINADO && res && typeof res === 'object') {
      return html`
        <div class="gm-actions">
          ${this.canPickMvp ? html`
            <button class="gm-action" title=${en.gameModal.pickMvpTitle} @click=${() => this.emitAction('mvp')}>
              ⭐ ${mvpName ? html`MVP: <strong>${mvpName}</strong>` : en.gameModal.pickMvpButton}
            </button>` : mvpName ? html`<div class="gm-mvp">⭐ MVP: <strong>${mvpName}</strong></div>` : nothing}
          <button class="gm-action" title=${en.gameModal.shareImageTitle} @click=${() => this.emitAction('share')}>
            ${en.gameModal.shareImageButton}
          </button>
        </div>`;
    }
    return mvpName ? html`<div class="gm-mvp">⭐ MVP: <strong>${mvpName}</strong></div>` : nothing;
  }

  private emitAction(name: 'mvp' | 'share'): void {
    if (!this.match) return;
    this.dispatchEvent(new CustomEvent(name, { detail: { gi: this.match.gi }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('football-score')) customElements.define('football-score', FootballScore);

declare global {
  interface HTMLElementTagNameMap {
    'football-score': FootballScore;
  }
}

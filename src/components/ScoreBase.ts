// ---------------------------------------------------------------------------
// ScoreBase — the live score panel shared by every sport.
// ---------------------------------------------------------------------------
// Draws the match header (teams, score, status) and plays the match events
// (kick-off, point, cancelled point, full time) on top of it. Each sport
// extends it with the event messages and the panel body.
//
// The panel never writes state: its controls emit `point`, `cancelled`,
// `started` and `finished` (detail: { gi, side? }) and main.js saves and syncs.
import { LitElement, html, css, nothing, render, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { styleMap } from 'lit/directives/style-map.js';
import eventStyles from '../../css/score-events.css?inline';
import { GAME_STATUS } from '../types.js';
import type { GameEvent, GameStatus, MatchResult, SetFormat } from '../types.js';
import { en } from '../i18n/en.js';
import { prefersReducedMotion, safeColor } from '../utils.js';

export type ScoreSide = 'home' | 'away';

export interface ScoreTeam {
  name: string;
  /** Team colour, or null for a placeholder (e.g. a playoff slot not decided yet). */
  color: string | null;
}

/** Everything the panel shows about one match, built from the state by the caller. */
export interface ScoreMatch {
  gi: string;
  round: string;
  home: ScoreTeam;
  away: ScoreTeam;
  result?: MatchResult;
  /** Racket sports: the tournament's set format. */
  format?: SetFormat;
}

const PLACEHOLDER_CREST = '#888888';
const PLACEHOLDER_EVENT = '#2F7A4F';
const CANCELLED_COLOR = '#D64535';

const WHISTLE = html`<svg class="anim-whistle" viewBox="0 0 64 40" aria-hidden="true">
  <path d="M6 14h22l4-6h10v6h4a14 14 0 1 1-14 14H6z" fill="currentColor"/>
  <circle cx="46" cy="28" r="6" fill="rgba(0,0,0,.25)"/>
  <path d="M44 4l3-4M50 6l4-3M38 4l-2-4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export abstract class ScoreBase extends LitElement {
  /** How long each event stays on screen, in ms. */
  static readonly DURATION = 2600;
  /** The score jumps as the banner fades out. */
  static readonly BUMP_DELAY = Math.round(ScoreBase.DURATION * 0.85);
  /** Events queued on the same match overlap slightly. */
  static readonly STAGGER = ScoreBase.DURATION - 400;

  static properties = {
    match: { attribute: false },
    canEdit: { type: Boolean, attribute: 'can-edit' },
    current: { state: true },
  };

  static styles = [unsafeCSS(eventStyles), css`
    :host {
      display: block;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    .gm-head {
      position: relative;
      padding: 18px 16px 16px;
      color: #fff;
      text-align: center;
      background:
        linear-gradient(160deg, rgba(255, 255, 255, .08) 0 35%, transparent 35% 100%),
        linear-gradient(180deg, #1b1b1b, #000);
    }

    .gm-round {
      display: inline-block;
      margin-bottom: 12px;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, .1);
      font-size: 12px;
      font-weight: 600;
    }

    .gm-score-row {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 10px;
    }

    .gm-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .gm-crest {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, .85);
      box-shadow: 0 2px 10px rgba(0, 0, 0, .5);
    }

    .gm-team-name {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 700;
      line-height: 1.15;
      overflow-wrap: anywhere;
    }

    .gm-score {
      font-family: var(--font-display);
      font-size: 44px;
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .gm-score span {
      display: inline-block;
    }

    .gm-colon {
      margin: 0 8px;
      opacity: .7;
    }

    .gm-status {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .gm-live {
      color: #ff7b6b;
    }

    .gm-pen {
      margin-top: 4px;
      font-size: 12px;
      opacity: .8;
    }

    /* Admin controls: - / + under each team, kick-off / full time below */
    .gm-point-controls {
      display: flex;
      gap: 8px;
    }

    .gm-point-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, .4);
      background: rgba(255, 255, 255, .1);
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }

    .gm-point-btn:active,
    .gm-status-btn:active {
      transform: translateY(1px);
    }

    .gm-status-btn {
      margin-top: 12px;
      padding: 8px 18px;
      border: none;
      border-radius: 8px;
      background: var(--gold);
      color: var(--pitch-900);
      font-size: 14px;
      font-weight: 600;
    }

    .gm-empty-state {
      margin: 0;
      padding: 14px 2px;
      font-size: 14px;
      text-align: center;
      color: var(--ink-faint);
      font-style: italic;
    }
  `];

  declare match: ScoreMatch | null;
  declare canEdit: boolean;
  /** Event on screen, or null. */
  declare protected current: GameEvent | null;

  private queue: GameEvent[] = [];
  private shown = 0;
  private timers: number[] = [];

  constructor() {
    super();
    this.match = null;
    this.canEdit = false;
    this.current = null;
  }

  // -------------------------------------------------------------------------
  // Sport hooks
  // -------------------------------------------------------------------------

  /** Banner content for one event (e.g. "GOAL!" and the scorer). */
  abstract message(ev: GameEvent): TemplateResult;

  /** Panel content below the header (e.g. the goals timeline). */
  protected abstract renderBody(): TemplateResult;

  /** Captions for the point controls; sports rename "point" (goal, basket…). */
  protected abstract get pointLabels(): { add: string; cancel: string };

  // -------------------------------------------------------------------------
  // Match data
  // -------------------------------------------------------------------------

  get status(): GameStatus {
    const res = this.match?.result;
    if (res && typeof res === 'object') return res.status || GAME_STATUS.AGENDADO;
    return res ? GAME_STATUS.TERMINADO : GAME_STATUS.AGENDADO;
  }

  /** Score per side, or null before the first result. */
  get score(): { home: number; away: number } | null {
    const res = this.match?.result;
    const text = (res && typeof res === 'object' ? res.score : res) || '';
    const m = /^(\d+)-(\d+)$/.exec(text);
    return m ? { home: Number(m[1]), away: Number(m[2]) } : null;
  }

  /** Is this event a point for a side (a goal, a game)? Sports override it. */
  protected isPointEvent(ev: GameEvent): boolean {
    return ev.type === 'golo';
  }

  /** Colour behind an event banner: the scoring team for a point. */
  protected eventColor(ev: GameEvent): string | null {
    if (!this.isPointEvent(ev) || !ev.side || !this.match) return null;
    return this.match[ev.side].color || PLACEHOLDER_EVENT;
  }

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------

  /** Plays a match event on the panel; events on the same match play in turn. */
  onPoint(ev: GameEvent): void {
    if (prefersReducedMotion()) return;
    this.queue.push(ev);
    if (!this.current) this.showNext();
  }

  private showNext(): void {
    const ev = this.queue.shift();
    if (!ev) {
      this.current = null;
      return;
    }
    this.current = ev;
    this.shown += 1;
    if (ev.side && (this.isPointEvent(ev) || ev.type === 'anulado')) {
      const side = ev.side;
      const color = this.isPointEvent(ev) ? this.eventColor(ev) || PLACEHOLDER_EVENT : CANCELLED_COLOR;
      this.later(ScoreBase.BUMP_DELAY, () => ScoreBase.bump(this.renderRoot, side, color));
    }
    this.later(ScoreBase.STAGGER, () => {
      if (this.queue.length) this.showNext();
      else this.later(ScoreBase.DURATION - ScoreBase.STAGGER, () => this.showNext());
    });
  }

  private later(ms: number, fn: () => void): void {
    this.timers.push(window.setTimeout(fn, ms));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    this.queue = [];
    this.current = null;
  }

  /**
   * Plays an event on an element outside the panel (a fixture card), with
   * this panel's banner. The element must be positioned by `.has-anim`.
   */
  playOn(target: HTMLElement, ev: GameEvent): void {
    const layer = document.createElement('div');
    layer.className = `game-anim anim-${ev.type}`;
    const color = this.eventColor(ev);
    if (color) {
      layer.style.setProperty('--anim-bg', color);
      layer.style.setProperty('--anim-ink', ScoreBase.textOn(color));
    }
    render(this.message(ev), layer);
    target.classList.add('has-anim');
    target.appendChild(layer);
    setTimeout(() => {
      layer.remove();
      if (!target.querySelector('.game-anim')) target.classList.remove('has-anim');
    }, ScoreBase.DURATION);

    if (ev.side && (this.isPointEvent(ev) || ev.type === 'anulado')) {
      const side = ev.side;
      const bump = this.isPointEvent(ev) ? color || PLACEHOLDER_EVENT : CANCELLED_COLOR;
      // Look the card up again: the list may have been redrawn meanwhile
      setTimeout(() => {
        document.querySelectorAll<HTMLElement>(`[data-game="${CSS.escape(String(ev.gi))}"]`)
          .forEach((card) => ScoreBase.bump(card, side, bump));
      }, ScoreBase.BUMP_DELAY);
    }
  }

  /** Makes the score of one side jump, highlighted in `color`. */
  static bump(root: ParentNode, side: ScoreSide, color: string): void {
    root.querySelectorAll<HTMLElement>(`[data-side="${side}"]:not(button):not(.pen-box)`).forEach((el) => {
      el.classList.remove('score-bump');
      void el.offsetWidth; // restarts the animation
      el.style.setProperty('--bump-color', color);
      el.classList.add('score-bump');
      el.addEventListener('animationend', () => el.classList.remove('score-bump'), { once: true });
    });
  }

  /** Text colour (light or dark) readable on top of a team colour. */
  static textOn(hex: string): string {
    const c = safeColor(hex).slice(1);
    const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.6 ? '#10231a' : '#ffffff';
  }

  /** Shared banner pieces for kick-off and full time. */
  protected whistleMessage(title: string, sub: string): TemplateResult {
    return html`${WHISTLE}<div class="anim-title">${title}</div>${sub ? html`<div class="anim-sub">${sub}</div>` : nothing}`;
  }

  private emit(name: 'point' | 'cancelled' | 'started' | 'finished', side?: ScoreSide): void {
    if (!this.match) return;
    this.dispatchEvent(new CustomEvent(name, {
      detail: { gi: this.match.gi, side },
      bubbles: true,
      composed: true,
    }));
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  render(): TemplateResult {
    const m = this.match;
    if (!m) return html`<p class="gm-empty-state">${en.gameModal.matchNotFound}</p>`;
    const score = this.score;
    const res = m.result;
    const pen = res && typeof res === 'object' && res.penalties
      ? html`<div class="gm-pen">${en.gameModal.penalties(res.penalties)}</div>` : nothing;

    return html`
      <div class="gm-head ${this.current ? 'has-anim' : ''}">
        ${m.round ? html`<div class="gm-round">${m.round}</div>` : nothing}
        <div class="gm-score-row">
          ${this.teamTemplate('home')}
          <div class="gm-score"><span data-side="home">${score ? score.home : '–'}</span><span class="gm-colon">:</span><span data-side="away">${score ? score.away : '–'}</span></div>
          ${this.teamTemplate('away')}
        </div>
        <div class="gm-status">${this.statusTemplate()}</div>
        ${pen}
        ${this.statusControlTemplate()}
        ${this.current ? keyed(this.shown, this.bannerTemplate(this.current)) : nothing}
      </div>
      ${this.renderBody()}
    `;
  }

  private teamTemplate(side: ScoreSide): TemplateResult {
    const team = this.match![side];
    const crest = team.color ? safeColor(team.color) : PLACEHOLDER_CREST;
    return html`
      <div class="gm-team">
        <span class="gm-crest" style=${styleMap({ background: crest })}></span>
        <span class="gm-team-name">${team.name}</span>
        ${this.pointControlsTemplate(side)}
      </div>`;
  }

  private pointControlsTemplate(side: ScoreSide): TemplateResult | typeof nothing {
    if (!this.canEdit || this.status === GAME_STATUS.TERMINADO) return nothing;
    const labels = this.pointLabels;
    return html`
      <div class="gm-point-controls">
        <button class="gm-point-btn" title=${labels.cancel} aria-label=${labels.cancel}
          @click=${() => this.emit('cancelled', side)}>−</button>
        <button class="gm-point-btn" title=${labels.add} aria-label=${labels.add}
          @click=${() => this.emit('point', side)}>+</button>
      </div>`;
  }

  private statusTemplate(): TemplateResult {
    const status = this.status;
    if (status === GAME_STATUS.DECORRER) return html`<span class="gm-live">${en.gameModal.liveStatus}</span>`;
    if (status === GAME_STATUS.TERMINADO) return html`${en.gameModal.finishedStatus}`;
    return html`${en.gameModal.scheduledStatus}`;
  }

  private statusControlTemplate(): TemplateResult | typeof nothing {
    if (!this.canEdit) return nothing;
    const status = this.status;
    if (status === GAME_STATUS.AGENDADO) {
      return html`<button class="gm-status-btn" @click=${() => this.emit('started')}>${en.gameModal.kickOffButton}</button>`;
    }
    if (status === GAME_STATUS.DECORRER) {
      return html`<button class="gm-status-btn" @click=${() => this.emit('finished')}>${en.gameModal.fullTimeButton}</button>`;
    }
    return nothing;
  }

  private bannerTemplate(ev: GameEvent): TemplateResult {
    const color = this.eventColor(ev);
    const style = color ? { '--anim-bg': color, '--anim-ink': ScoreBase.textOn(color) } : {};
    return html`<div class="game-anim anim-${ev.type}" style=${styleMap(style)}>${this.message(ev)}</div>`;
  }
}

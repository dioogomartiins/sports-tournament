// ---------------------------------------------------------------------------
// RacketScore — the match panel of set-based sports: sets won, set grid, game banners
// ---------------------------------------------------------------------------
// The header shows sets won; the body shows the games of every set, with the
// set being played highlighted. − / + add or cancel one game. Each racket
// sport has its own element (<padel-score>, <tennis-score>) that names its sport.
import { html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ScoreBase } from '../components/ScoreBase.js';
import { GAME_STATUS, type GameEvent } from '../types.js';
import type { RacketSport, SetScore } from './RacketSport.js';
import { en } from '../i18n/en.js';

export abstract class RacketScore extends ScoreBase {
  /** The sport whose rules (set format, set winner) the panel follows. */
  protected abstract readonly sport: RacketSport;

  static styles = [...ScoreBase.styles, css`
    .gm-body {
      padding: 16px 12px;
      background: var(--paper);
      color: var(--ink);
    }

    .ps-grid {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 6px;
      font-variant-numeric: tabular-nums;
    }

    .ps-grid th {
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-faint);
      text-transform: uppercase;
      letter-spacing: .04em;
      padding: 0 4px;
    }

    .ps-grid td {
      padding: 9px 6px;
      background: var(--card);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      text-align: center;
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
    }

    .ps-grid td:first-child {
      text-align: left;
      border-left: 1px solid var(--line);
      border-radius: var(--radius-sm) 0 0 var(--radius-sm);
      font-family: inherit;
      font-size: 14px;
      overflow-wrap: anywhere;
    }

    .ps-grid td:last-child {
      border-right: 1px solid var(--line);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .ps-grid td.ps-lost {
      color: var(--ink-faint);
      font-weight: 500;
    }

    .ps-grid td.ps-current {
      background: var(--gold);
      color: var(--pitch-900, #0F2A1C);
    }

    .ps-format {
      margin: 8px 0 0;
      font-size: 12px;
      color: var(--ink-faint);
      text-align: center;
    }

    .gm-empty {
      margin: 0;
      padding: 14px 2px;
      font-size: 14px;
      text-align: center;
      color: var(--ink-faint);
      font-style: italic;
    }
  `];

  protected get pointLabels(): { add: string; cancel: string } {
    return this.points
      ? { add: en.racketScore.addPointTitle, cancel: en.racketScore.cancelPointTitle }
      : { add: en.racketScore.addGameTitle, cancel: en.racketScore.cancelGameTitle };
  }

  protected isPointEvent(ev: GameEvent): boolean {
    return ev.type === 'game' || ev.type === 'set';
  }

  private get sets(): SetScore[] {
    return this.sport.setsOf(this.match?.result);
  }

  /** Total points of the match when it is played to points (Americano), else null. */
  private get points(): number | null {
    return this.match?.points || null;
  }

  private get setFormat() {
    return this.sport.format(this.match?.format ? { setFormat: this.match.format } : null);
  }

  /** The header shows sets won, or the points in a match played to points. */
  get score(): { home: number; away: number } | null {
    if (this.points) return this.sport.pointsOf(this.match?.result);
    const sets = this.sets;
    return sets.length ? this.sport.setsWon(sets, this.setFormat) : null;
  }

  message(ev: GameEvent): TemplateResult {
    const m = this.match;
    const team = ev.side && m ? m[ev.side].name : '';
    if (ev.type === 'game') {
      return html`<div class="anim-title">${this.points ? en.racketScore.point : en.racketScore.game}</div><div class="anim-sub">${this.sport.icon} ${team}</div>`;
    }
    if (ev.type === 'set') {
      const sets = this.sets;
      const last = sets[sets.length - 1];
      return html`<div class="anim-title">${en.racketScore.set}</div><div class="anim-sub">${this.sport.icon} ${team}</div>${last ? html`<div class="anim-sub2">${last.home}-${last.away}</div>` : nothing}`;
    }
    if (ev.type === 'anulado') {
      return html`<div class="anim-title">${this.points ? en.racketScore.pointCancelled : en.racketScore.gameCancelled}</div><div class="anim-sub"><s>${team}</s></div>`;
    }
    if (ev.type === 'inicio') {
      return this.whistleMessage(en.racketScore.matchStart, m ? `${m.home.name} vs ${m.away.name}` : '');
    }
    return this.whistleMessage(en.racketScore.matchOver,
      m ? `${m.home.name} ${this.sport.formatSets(this.sets)} ${m.away.name}` : '');
  }

  protected renderBody(): TemplateResult {
    const total = this.points;
    if (total) {
      const pts = this.score;
      const left = Math.max(0, total - (pts ? pts.home + pts.away : 0));
      return html`<div class="gm-body"><p class="ps-format">${en.racketScore.pointsLine(total, left)}</p></div>`;
    }
    const f = this.setFormat;
    return html`
      <div class="gm-body">
        ${this.sets.length ? this.gridTemplate() : html`<p class="gm-empty">${en.racketScore.noGamesYet}</p>`}
        <p class="ps-format">${en.racketScore.formatLine(f.sets, f.gamesPerSet, f.superTieBreak)}</p>
      </div>`;
  }

  private gridTemplate(): TemplateResult {
    const sets = this.sets;
    const f = this.setFormat;
    const playing = !this.sport.matchWinner(sets, f) && this.status !== GAME_STATUS.TERMINADO;
    const current = sets.length - 1;
    const head = sets.map((_, i) => html`<th>${this.sport.isSuperTieBreak(i, f) ? en.racketScore.superTieBreakCol : en.racketScore.setCol(i + 1)}</th>`);
    const row = (side: 'home' | 'away') => html`
      <tr>
        <td>${this.match![side].name}</td>
        ${sets.map((s, i) => {
          const winner = this.sport.setWinner(s, i, f);
          const cls = playing && i === current ? 'ps-current' : (winner && winner !== side ? 'ps-lost' : '');
          return html`<td class=${cls}>${s[side]}</td>`;
        })}
      </tr>`;
    return html`
      <table class="ps-grid">
        <thead><tr><th></th>${head}</tr></thead>
        <tbody>${row('home')}${row('away')}</tbody>
      </table>`;
  }
}

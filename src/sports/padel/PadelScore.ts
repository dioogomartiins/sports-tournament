// ---------------------------------------------------------------------------
// <padel-score> — the padel match panel: sets won, set grid, game banners
// ---------------------------------------------------------------------------
// The header shows sets won; the body shows the games of every set, with the
// set being played highlighted. − / + add or cancel one game.
import { html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ScoreBase } from '../../components/ScoreBase.js';
import { GAME_STATUS, type GameEvent } from '../../types.js';
import { padel } from './Padel.js';
import type { SetScore } from '../RacketSport.js';
import { en } from '../../i18n/en.js';

export class PadelScore extends ScoreBase {
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
    return { add: en.padelScore.addGameTitle, cancel: en.padelScore.cancelGameTitle };
  }

  protected isPointEvent(ev: GameEvent): boolean {
    return ev.type === 'game' || ev.type === 'set';
  }

  private get sets(): SetScore[] {
    return padel.setsOf(this.match?.result);
  }

  private get setFormat() {
    return padel.format(this.match?.format ? { setFormat: this.match.format } : null);
  }

  /** The header shows sets won. */
  get score(): { home: number; away: number } | null {
    const sets = this.sets;
    return sets.length ? padel.setsWon(sets, this.setFormat) : null;
  }

  message(ev: GameEvent): TemplateResult {
    const m = this.match;
    const team = ev.side && m ? m[ev.side].name : '';
    if (ev.type === 'game') {
      return html`<div class="anim-title">${en.padelScore.game}</div><div class="anim-sub">🎾 ${team}</div>`;
    }
    if (ev.type === 'set') {
      const sets = this.sets;
      const last = sets[sets.length - 1];
      return html`<div class="anim-title">${en.padelScore.set}</div><div class="anim-sub">🎾 ${team}</div>${last ? html`<div class="anim-sub2">${last.home}-${last.away}</div>` : nothing}`;
    }
    if (ev.type === 'anulado') {
      return html`<div class="anim-title">${en.padelScore.gameCancelled}</div><div class="anim-sub"><s>${team}</s></div>`;
    }
    if (ev.type === 'inicio') {
      return this.whistleMessage(en.padelScore.matchStart, m ? `${m.home.name} vs ${m.away.name}` : '');
    }
    return this.whistleMessage(en.padelScore.matchOver,
      m ? `${m.home.name} ${padel.formatSets(this.sets)} ${m.away.name}` : '');
  }

  protected renderBody(): TemplateResult {
    const f = this.setFormat;
    return html`
      <div class="gm-body">
        ${this.sets.length ? this.gridTemplate() : html`<p class="gm-empty">${en.padelScore.noGamesYet}</p>`}
        <p class="ps-format">${en.padelScore.formatLine(f.sets, f.gamesPerSet, f.superTieBreak)}</p>
      </div>`;
  }

  private gridTemplate(): TemplateResult {
    const sets = this.sets;
    const f = this.setFormat;
    const playing = !padel.matchWinner(sets, f) && this.status !== GAME_STATUS.TERMINADO;
    const current = sets.length - 1;
    const head = sets.map((_, i) => html`<th>${padel.isSuperTieBreak(i, f) ? en.padelScore.superTieBreakCol : en.padelScore.setCol(i + 1)}</th>`);
    const row = (side: 'home' | 'away') => html`
      <tr>
        <td>${this.match![side].name}</td>
        ${sets.map((s, i) => {
          const winner = padel.setWinner(s, i, f);
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

if (!customElements.get('padel-score')) customElements.define('padel-score', PadelScore);

declare global {
  interface HTMLElementTagNameMap {
    'padel-score': PadelScore;
  }
}

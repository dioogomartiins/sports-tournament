// ---------------------------------------------------------------------------
// <archive-list> — finished tournaments, newest first (History tab)
// ---------------------------------------------------------------------------
// Each entry opens to show its final standings and top players. The delete
// button emits `archive-delete` (detail: entry id); the Firebase rules decide
// who may delete, and CSS hides the button from non-admins.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { ArchiveEntry, ArchiveGroup } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { styleMap } from 'lit/directives/style-map.js';
import { safeColor } from '../utils.js';

export class ArchiveList extends LightElement {
  static properties = {
    entries: { attribute: false },
  };

  /** Archive entries, oldest first (as saved). */
  declare entries: ArchiveEntry[];

  constructor() {
    super();
    this.entries = [];
  }

  render(): TemplateResult {
    if (!this.entries.length) return html`<p class="empty">${en.historyTab.noArchivedYet}</p>`;
    return html`${this.entries.slice().reverse().map((e) => this.entryTemplate(e))}`;
  }

  private entryTemplate(e: ArchiveEntry): TemplateResult {
    const champion = e.campeao
      ? html`<span class="arquivo-campeao">${ArchiveList.dot(e.campeao.cor)}${e.campeao.nome}</span>`
      : html`<span class="arquivo-campeao">${en.historyTab.noChampion}</span>`;
    return html`
      <details class="arquivo-card">
        <summary><div class="arquivo-head"><div>
          <div class="arquivo-nome">${e.nome}</div>
          <div class="arquivo-meta">${ArchiveList.date(e.data)} · ${en.historyTab.matchesGoalsSummary(Number(e.jogos) || 0, Number(e.golos) || 0)}</div>
        </div><span>🏆 ${champion}</span></div></summary>
        ${(e.grupos || []).map((g) => this.groupTemplate(g, e.grupos.length > 1))}
        ${this.topPlayersTemplate(e)}
        <button class="btn btn-ghost arquivo-del" data-requires="admin"
          @click=${() => this.emit('archive-delete', e.id)}>${en.historyTab.deleteFromHistory}</button>
      </details>`;
  }

  private groupTemplate(g: ArchiveGroup, titled: boolean): TemplateResult {
    return html`
      ${titled ? html`<div class="arquivo-grupo">${g.nome}</div>` : nothing}
      <table class="standings-table">
        <thead><tr>
          <th>${en.standings.cols.pos}</th><th style="text-align:left;">${en.standings.cols.team}</th>
          <th>${en.standings.cols.p}</th><th>${en.standings.cols.gd}</th><th>${en.standings.cols.pts}</th>
        </tr></thead>
        <tbody>${(g.tabela || []).map((t, i) => {
          const gd = Number(t.DG) || 0;
          return html`<tr>
            <td><span class="pos-badge">${i + 1}</span></td>
            <td class="team-cell">${ArchiveList.dot(t.cor)}${t.nome}</td>
            <td class="num">${Number(t.J) || 0}</td><td class="num">${gd > 0 ? '+' : ''}${gd}</td>
            <td class="num pts-cell">${Number(t.Pts) || 0}</td>
          </tr>`;
        })}</tbody>
      </table>`;
  }

  private topPlayersTemplate(e: ArchiveEntry): TemplateResult | typeof nothing {
    const top = (e.jogadores || []).filter((j) => j.golos || j.assistencias || j.mvp).slice(0, 5);
    if (!top.length) return nothing;
    return html`<div class="arquivo-top">${top.map((j) => html`
      <div>${j.nome} — ${Number(j.golos) || 0} ⚽ · ${Number(j.assistencias) || 0} 🅰️ · ${Number(j.mvp) || 0} ⭐</div>`)}</div>`;
  }

  private static dot(color: string): TemplateResult {
    return html`<span class="arquivo-cor" style=${styleMap({ background: safeColor(color) })}></span>`;
  }

  private static date(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB');
  }
}

if (!customElements.get('archive-list')) customElements.define('archive-list', ArchiveList);

declare global {
  interface HTMLElementTagNameMap {
    'archive-list': ArchiveList;
  }
}

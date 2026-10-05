// ---------------------------------------------------------------------------
// <tournament-list> — the active tournaments, as cards (dashboard)
// ---------------------------------------------------------------------------
// Clicking another tournament's card emits `tournament-select`; the current
// one has a Finish button that emits `tournament-finish` (detail: id). CSS
// hides Finish from non-admins.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { TournamentMeta } from '../types.js';
import { getSport } from '../sports/registry.js';
import { fmtDate } from '../utils.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

/** A tournament of the list, with its Firebase key. */
export interface TournamentEntry extends Partial<TournamentMeta> {
  id: string;
}

/** Icon and name of a tournament's sport, e.g. "🎾 Padel" (unknown ids fall back to football). */
export function sportBadge(sportId: string | undefined): string {
  const sport = getSport(sportId);
  return `${sport.icon} ${sport.name}`;
}

/** Only the tournaments still being played. */
export function activeTournaments(list: TournamentEntry[] | null | undefined): TournamentEntry[] {
  return (list || []).filter((t) => t.status === 'active');
}

export class TournamentList extends LightElement {
  static properties = {
    tournaments: { attribute: false },
    currentId: { type: String },
  };

  declare tournaments: TournamentEntry[];
  declare currentId: string;

  constructor() {
    super();
    this.tournaments = [];
    this.currentId = '';
  }

  render(): TemplateResult {
    const active = activeTournaments(this.tournaments);
    if (!active.length) return html`<p class="empty" style="margin: 8px 0;">${en.dashboard.noActiveTournaments}</p>`;
    return html`${active.map((t) => this.cardTemplate(t))}`;
  }

  private cardTemplate(t: TournamentEntry): TemplateResult {
    const current = t.id === this.currentId;
    const date = t.createdAt ? fmtDate(t.createdAt) : en.dashboard.dateUnavailable;
    return html`
      <div class="torneio-card ${current ? 'active' : ''}" @click=${() => { if (!current) this.emit('tournament-select', t.id); }}>
        <div class="torneio-card-top"><div>
          <div class="torneio-card-title">${t.name || en.tournaments.defaultNewName}</div>
          <div class="torneio-badges" style="margin-top:6px;">
            <span class="sport-badge">${sportBadge(t.sport)}</span>
            <span class="status-badge-active">🟢 ${en.dashboard.activeBadge}</span>
            ${current ? html`<span class="current-badge">✓ ${en.dashboard.viewingNow}</span>` : nothing}
          </div>
        </div></div>
        <div class="torneio-card-meta"><span>${en.dashboard.createdOn(date)}</span></div>
        <div class="torneio-card-actions">
          ${current
            ? html`<button class="btn btn-sm btn-danger btn-terminar-torneio" data-requires="admin"
                @click=${(e: Event) => { e.stopPropagation(); this.emit('tournament-finish', t.id); }}>🏁 ${en.dashboard.finishTournament}</button>`
            : html`<button class="btn btn-sm btn-ghost btn-trocar-torneio">👁️ ${en.dashboard.viewTournament}</button>`}
        </div>
      </div>`;
  }
}

if (!customElements.get('tournament-list')) customElements.define('tournament-list', TournamentList);

declare global {
  interface HTMLElementTagNameMap {
    'tournament-list': TournamentList;
  }
}

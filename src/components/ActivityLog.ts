// ---------------------------------------------------------------------------
// <activity-log> — the latest changes and who made them (Users tab)
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { fmtTimestamp } from '../utils.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface LogEntry {
  nome?: string;
  acao?: string;
  /** Milliseconds since the epoch. */
  quando?: number;
}

export class ActivityLog extends LightElement {
  static properties = {
    entries: { attribute: false },
  };

  /** Newest first. */
  /** null until the first read from Firebase. */
  declare entries: LogEntry[] | null;

  constructor() {
    super();
    this.entries = null;
  }

  render(): TemplateResult {
    if (!this.entries) return html`<p class="empty">${en.common.loading}</p>`;
    if (!this.entries.length) return html`<p class="empty">${en.adminTab.noChangesYet}</p>`;
    return html`${this.entries.map((e) => html`
      <div class="log-row"><div class="log-row__info">
        <div class="log-row__acao">${e.acao || ''}</div>
        <div class="log-row__meta">${e.nome || ''} · ${typeof e.quando === 'number' ? fmtTimestamp(new Date(e.quando).toISOString()) : '—'}</div>
      </div></div>`)}`;
  }
}

if (!customElements.get('activity-log')) customElements.define('activity-log', ActivityLog);

declare global {
  interface HTMLElementTagNameMap {
    'activity-log': ActivityLog;
  }
}

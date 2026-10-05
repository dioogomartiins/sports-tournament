This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: .github/, .gemini/, .claude/, node_modules/, coverage/, dist/, scratch/, knowledge/, *.json, *.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
css/
  base.css
  classificacao.css
  componentes.css
  dados.css
  equipas.css
  historico.css
  jogadores.css
  jogo.css
  jogos.css
  layout.css
  mobile.css
  partilha.css
  score-events.css
  sessao.css
  singular.css
  style.css
  torneios.css
docker/
  app/
    Dockerfile
  firebase/
    Dockerfile
    entrypoint.sh
    seed.mjs
docs/
  assets/
    illustrations/
      01-do-calendario-ao-campeao.jpg
      02-algoritmo-de-berger.jpg
      03-bonus-de-goleada.jpg
      04-desempate-confronto-direto.jpg
      05-grupos-e-seeds.jpg
      06-rating-do-jogador.jpg
      07-equipas-equilibradas.jpg
      08-perfis-e-permissoes.jpg
      09-durante-os-jogos.jpg
      10-terminar-e-arquivar.jpg
      11-golos-assistencias-mvp.jpg
      12-sincronizacao-jogo-a-jogo.jpg
      13-regras-sao-a-protecao.jpg
      14-registo-de-alteracoes.jpg
      15-deploy-regras-e-site.jpg
      16-golo-ao-vivo.jpg
      17-desportos.jpg
      18-varios-torneios.jpg
      19-padel-jogo-a-jogo.jpg
      20-super-tie-break.jpg
      21-sorteio-de-pares.jpg
      22-tenis-singulares-pares.jpg
      23-americano-rotacao.jpg
      24-mexicano-ranking.jpg
      25-pontos-por-jogador.jpg
      26-componentes-lit.jpg
      27-uma-classe-por-desporto.jpg
  architecture.md
  configuration.md
  guide.md
  multi-sport.md
  rules.md
  sports.md
src/
  components/
    ActivityLog.ts
    AllTimeStats.ts
    ArchiveList.ts
    DashboardLeaders.ts
    DashboardPodium.ts
    DraftTeams.ts
    LightElement.ts
    PlayerCards.ts
    PlayerEditor.ts
    PlayerPicker.ts
    racketBoard.ts
    ResultsList.ts
    rounds.ts
    ScheduleList.ts
    ScoreBase.ts
    SingleMatchHistory.ts
    SquadList.ts
    StandingsTable.ts
    StatCards.ts
    StatsTable.ts
    TeamsEditor.ts
    templates.ts
    TournamentList.ts
    UserList.ts
  core/
    americano.ts
    archive.ts
    draft.ts
    index.ts
    playoffs.ts
    schedule.ts
  i18n/
    en.ts
  sports/
    football/
      Football.ts
      FootballScore.ts
    padel/
      Padel.ts
      PadelScore.ts
    tennis/
      Tennis.ts
      TennisScore.ts
    RacketScore.ts
    RacketSport.ts
    registry.ts
    Sport.ts
  ui/
    admin.ts
    dom.ts
    history.ts
    match.ts
    modals.ts
    navigation.ts
    players.ts
    schedule.ts
    settings.ts
    singular.ts
    standings.ts
    stats.ts
    teams.ts
    toasts.ts
    tournaments.ts
  algorithms.ts
  firebase.ts
  main.ts
  permissions.ts
  share.ts
  state.ts
  sync.ts
  types.ts
  ui.ts
  utils.ts
  vite-env.d.ts
tests/
  core/
    americano.test.ts
    archive.test.ts
    draft.test.ts
    playoffs.test.ts
    schedule.test.ts
  rules/
    firebase.json
    rules.check.mjs
  football.test.ts
  i18n.test.ts
  padel.test.ts
  permissions.test.js
  players.test.ts
  state.test.ts
  sync.test.ts
  tennis.test.ts
  torneios.test.ts
  utils.test.js
.dockerignore
.env.example
.gitattributes
.gitignore
docker-compose.yml
eslint.config.mjs
index.html
vite.config.js
````

# Files

## File: .env.example
````
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
````

## File: css/dados.css
````css
/* ---------- Zona de Perigo — Checkboxes ---------- */
.danger-checks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0 12px;
}

.danger-check {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: var(--card);
  cursor: pointer;
  transition: border-color .2s, background .2s;
}

.danger-check:hover:not(.danger-check--locked) {
  border-color: var(--danger);
  background: var(--danger-bg);
}

.danger-check--locked {
  opacity: .5;
  cursor: not-allowed;
}

.danger-check input[type="checkbox"] {
  accent-color: var(--danger);
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.danger-check__label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

.danger-check__desc {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 2px;
}

/* ---------- Modal — Danger Confirm ---------- */
.danger-confirm-summary {
  margin: 10px 0 14px;
  padding: 0;
  list-style: none;
}

.danger-confirm-summary li {
  font-size: 13px;
  padding: 4px 0;
  color: var(--danger);
  font-weight: 600;
}

.danger-confirm-summary li::before {
  content: '🗑️ ';
}

.danger-confirm-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--line);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: var(--font-body);
  background: var(--card);
  color: var(--ink);
  transition: border-color .2s;
  margin-top: 6px;
}

.danger-confirm-input:focus {
  outline: none;
  border-color: var(--danger);
}

.danger-confirm-input.danger-confirm-input--error {
  border-color: var(--danger);
  animation: shake .4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
````

## File: css/equipas.css
````css
/* ---------- Forms ---------- */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 18px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-soft);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.input {
  width: 100%;
  padding: 9px 11px;
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--ink);
  background: var(--card);
  transition: border-color .15s;
}

.input:focus {
  border-color: var(--pitch-500);
}

.input-invalid {
  border-color: var(--danger) !important;
  background: var(--danger-bg);
}

.field-note {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 5px;
}

.hint-box {
  margin-top: 6px;
  font-size: 13px;
  color: var(--pitch-700);
  background: rgba(47, 122, 79, .08);
  border: 1px solid rgba(47, 122, 79, .18);
  border-radius: var(--radius-sm);
  padding: 9px 11px;
}

[data-theme="dark"] .hint-box {
  color: #7dd8a0;
}

/* ---------- Teams & Squads ---------- */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 20px;
}

.team-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 0;
}

.team-num {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--ink-faint);
  width: 22px;
  text-align: right;
  flex: 0 0 auto;
}

.team-tag {
  font-size: 10px;
  color: var(--ink-faint);
  white-space: nowrap;
  flex: 0 0 auto;
}

.team-color-picker {
  width: 34px;
  height: 38px;
  padding: 2px;
  background: none;
  border: 1px solid var(--line);
  border-radius: 6px;
  cursor: pointer;
  flex: 0 0 auto;
}

.player-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 14px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-num {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--ink-soft);
  background: var(--paper);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.player-del {
  color: var(--danger);
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
}

.player-del:hover {
  background: var(--danger-bg);
}

.player-stats-btn:hover {
  background: var(--line) !important;
}
````

## File: css/historico.css
````css
/* ---------------------------------------------------------------------
   Histórico (torneios arquivados)
   --------------------------------------------------------------------- */
.historico-titulos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.historico-titulo {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink);
}

.arquivo-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-bottom: 10px;
  background: var(--card);
}

.arquivo-card summary {
  cursor: pointer;
  list-style: none;
}

.arquivo-card summary::-webkit-details-marker {
  display: none;
}

.arquivo-card[open] summary {
  margin-bottom: 12px;
}

.arquivo-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.arquivo-nome {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.arquivo-meta,
.arquivo-grupo {
  font-size: 12px;
  color: var(--ink-soft);
}

.arquivo-grupo {
  font-weight: 700;
  text-transform: uppercase;
  margin: 10px 0 6px;
}

.arquivo-campeao {
  font-weight: 700;
  color: var(--gold-dark);
}

.arquivo-cor {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.arquivo-top {
  margin-top: 12px;
  font-size: 14px;
  color: var(--ink);
  line-height: 1.7;
}

.arquivo-del {
  margin-top: 12px;
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--danger);
  color: var(--danger);
}
````

## File: css/jogadores.css
````css
/* =====================================================================
   JOGADORES — Base de Dados
   ===================================================================== */

.player-db-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.player-db-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow .2s, transform .2s;
}

.player-db-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.player-db-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--pitch-600);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.player-db-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--ink);
  line-height: 1.3;
}

.player-db-team {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 2px;
}

.player-db-rating {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--gold-dark);
  margin-left: auto;
  flex-shrink: 0;
}

.player-attrs-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.player-attr-item {
  background: var(--paper);
  border-radius: var(--radius-sm);
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.player-attr-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--ink-faint);
}

.player-attr-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--pitch-600);
}

.player-db-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  margin-top: 4px;
}

/* Stars widget */
.star-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.star-row-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  width: 90px;
  flex-shrink: 0;
}

.stars-input {
  display: flex;
  gap: 4px;
}

.star-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  color: var(--silver);
  line-height: 1;
  transition: color .15s, transform .15s;
}

.star-btn.filled {
  color: var(--gold);
}

.star-btn:hover {
  transform: scale(1.2);
  color: var(--gold);
}

.rating-preview {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--gold-dark);
  text-align: center;
  margin: 12px 0 4px;
}

.rating-preview-label {
  font-size: 12px;
  color: var(--ink-faint);
  text-align: center;
  margin-bottom: 16px;
}
````

## File: css/singular.css
````css
/* =====================================================================
   JOGO SINGULAR
   ===================================================================== */

.singular-subtabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 4px;
}

.singular-subtab {
  flex: 1;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
  transition: background .15s, color .15s;
}

.singular-subtab.active {
  background: var(--pitch-600);
  color: #fff;
}

.singular-panel {
  display: none;
}

.singular-panel.active {
  display: block;
}

.draft-player-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: var(--card);
  margin-bottom: 6px;
  transition: background .15s;
  cursor: pointer;
}

.draft-player-row:hover {
  background: var(--paper);
}

.draft-player-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--pitch-600);
}

.draft-player-nome {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.draft-player-team-badge {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--pitch-700);
  color: #fff;
  font-weight: 600;
}

.draft-player-rating {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--gold-dark);
}

.draft-selected-count {
  font-size: 13px;
  color: var(--ink-faint);
  margin-bottom: 12px;
}

.draft-teams-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .draft-teams-grid {
    grid-template-columns: 1fr;
  }
}

.draft-team-card {
  background: var(--paper);
  border: 2px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
}

.draft-team-card.team-a {
  border-color: var(--pitch-600);
}

.draft-team-card.team-b {
  border-color: var(--gold);
}

.draft-team-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.draft-team-rating-total {
  font-size: 12px;
  color: var(--ink-faint);
  margin-bottom: 12px;
}

.draft-team-player-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.draft-team-player-row:last-child {
  border-bottom: none;
}

.draft-pick-num {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-faint);
  width: 20px;
  flex-shrink: 0;
}

.draft-balance-bar {
  margin: 16px 0;
  padding: 12px 16px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  text-align: center;
  font-size: 13px;
  color: var(--ink-soft);
  grid-column: 1 / -1;
}

.draft-balance-diff {
  font-weight: 700;
  color: var(--pitch-600);
}

/* =====================================================================
   HISTÓRICO de Jogos Singulares
   ===================================================================== */

.historico-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
}

.historico-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.historico-date {
  font-size: 12px;
  color: var(--ink-faint);
  font-weight: 600;
}

.historico-resultado {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--pitch-800);
  text-align: center;
  margin: 10px 0;
}

.historico-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: center;
}

.historico-team-name {
  font-weight: 700;
  font-size: 14px;
}

.historico-team-players {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 4px;
}

[data-theme="dark"] .player-db-card {
  background: var(--card);
}

[data-theme="dark"] .draft-player-row {
  background: var(--card);
}

[data-theme="dark"] .draft-player-row:hover {
  background: var(--pitch-900);
}
````

## File: docker/app/Dockerfile
````dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source files
COPY . .

# Expose Vite dev server default port
EXPOSE 5173

# Run Vite with 0.0.0.0 host binding so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
````

## File: src/components/ActivityLog.ts
````typescript
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
````

## File: src/components/ArchiveList.ts
````typescript
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
````

## File: src/components/DashboardLeaders.ts
````typescript
// ---------------------------------------------------------------------------
// <dashboard-leaders> — the sport's leaderboard on the dashboard
// ---------------------------------------------------------------------------
// Top scorers in football, the sides with the most wins in other sports
// (`Sport.leaderboard()`); the controller passes the board in.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Leaderboard } from '../sports/Sport.js';
import { LightElement } from './LightElement.js';

export class DashboardLeaders extends LightElement {
  static properties = {
    board: { attribute: false },
    limit: { type: Number },
  };

  declare board: Leaderboard | null;
  declare limit: number;

  constructor() {
    super();
    this.board = null;
    this.limit = 5;
  }

  render(): TemplateResult {
    if (!this.board) return html``;
    const rows = this.board.rows.slice(0, this.limit);
    return html`
      <div class="section-title" style="margin-top:20px;">${this.board.title}</div>
      ${rows.length ? rows.map((r, i) => html`
        <div style="display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid var(--line);">
          <span>${i + 1}. ${r.name}${r.detail ? html` <span style="color:var(--ink-faint); font-size:12px;">(${r.detail})</span>` : ''}</span>
          <span style="font-weight:700; white-space:nowrap;">${r.value}</span>
        </div>`) : html`<p class="empty" style="padding-top:20px;">${this.board.empty}</p>`}`;
  }
}

if (!customElements.get('dashboard-leaders')) customElements.define('dashboard-leaders', DashboardLeaders);

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-leaders': DashboardLeaders;
  }
}
````

## File: src/components/DashboardPodium.ts
````typescript
// ---------------------------------------------------------------------------
// <dashboard-podium> — top 3 teams and the next five places (dashboard)
// ---------------------------------------------------------------------------
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { StandingsRow, Team } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { teamLabel } from './templates.js';

export class DashboardPodium extends LightElement {
  static properties = {
    rows: { attribute: false },
    teams: { attribute: false },
  };

  /** Every team of every group, best first. */
  declare rows: StandingsRow[];
  declare teams: Team[];

  constructor() {
    super();
    this.rows = [];
    this.teams = [];
  }

  render(): TemplateResult {
    const top = this.rows.slice(0, 3);
    return html`
      <div class="podium">
        ${top.length ? top.map((s, i) => html`
          <div class="podium-card podium-${i + 1}">
            <div class="podium-rank">${en.dashboard.place(i + 1)}</div>
            <div class="podium-name">${s.name}</div>
            <div class="podium-pts">${en.dashboard.ptsMatches(s.Pts, s.J)}</div>
          </div>`) : html`<p class="empty">${en.dashboard.noTeamsConfigured}</p>`}
      </div>
      ${this.restTemplate()}`;
  }

  private restTemplate(): TemplateResult | typeof nothing {
    const rest = this.rows.slice(3, 8);
    if (!rest.length) return nothing;
    return html`
      <table class="mini-table">
        <thead><tr>
          <th>${en.standings.cols.pos}</th><th style="text-align:left;">${en.standings.cols.team}</th>
          <th>${en.standings.cols.p}</th><th>${en.standings.cols.pts}</th>
        </tr></thead>
        <tbody>${rest.map((s, i) => html`
          <tr><td class="num">${i + 4}</td><td style="text-align:left;">${teamLabel(this.teams, s.idx)}</td><td class="num">${s.J}</td><td class="num">${s.Pts}</td></tr>`)}
        </tbody>
      </table>`;
  }
}

if (!customElements.get('dashboard-podium')) customElements.define('dashboard-podium', DashboardPodium);

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-podium': DashboardPodium;
  }
}
````

## File: src/components/DraftTeams.ts
````typescript
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
````

## File: src/components/PlayerCards.ts
````typescript
// ---------------------------------------------------------------------------
// <player-cards> — the players database as cards (Players tab)
// ---------------------------------------------------------------------------
// Emits `player-profile`, `player-edit` and `player-delete` (detail: player
// id); CSS hides edit and delete from non-admins.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

/** One rating attribute of a player, as the mini table shows it. */
export interface AttributeValue {
  label: string;
  value: number;
}

export interface PlayerCard {
  id: string;
  name: string;
  team: string;
  rating: number;
  attributes: AttributeValue[];
}

/** First letters of the first two names, for the avatar. */
export function initials(name: string): string {
  return (name || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/** The attribute mini table (first three letters of each label). */
export function attributesTemplate(attributes: AttributeValue[]): TemplateResult {
  return html`<div class="player-attrs-mini">${attributes.map((a) => html`
    <div class="player-attr-item"><span class="player-attr-label">${a.label.substring(0, 3)}</span><span class="player-attr-val">${a.value}</span></div>`)}</div>`;
}

const SMALL_BTN = 'font-size:12px; padding:4px 10px; border:1px solid var(--line);';

export class PlayerCards extends LightElement {
  static properties = {
    cards: { attribute: false },
    empty: { type: String },
  };

  declare cards: PlayerCard[];
  /** Shown when the list is empty (no players, or none match the search). */
  declare empty: string;

  constructor() {
    super();
    this.cards = [];
    this.empty = '';
  }

  render(): TemplateResult {
    if (!this.cards.length) return html`<p class="empty">${this.empty}</p>`;
    return html`<div class="player-db-grid">${this.cards.map((p) => this.cardTemplate(p))}</div>`;
  }

  private cardTemplate(p: PlayerCard): TemplateResult {
    return html`
      <div class="player-db-card">
        <div class="player-db-header">
          <div class="player-avatar">${initials(p.name)}</div>
          <div><div class="player-db-name">${p.name}</div><div class="player-db-team">${p.team}</div></div>
          <div class="player-db-rating">★ ${p.rating.toFixed(1)}</div>
        </div>
        ${attributesTemplate(p.attributes)}
        <div class="player-db-actions">
          <button class="btn btn-ghost" style=${SMALL_BTN} @click=${() => this.emit('player-profile', p.id)}>${en.players.statsButton}</button>
          <button class="btn btn-ghost" style=${SMALL_BTN} data-requires="admin" @click=${() => this.emit('player-edit', p.id)}>${en.players.editButton}</button>
          <button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);" data-requires="admin"
            @click=${() => this.emit('player-delete', p.id)}>${en.players.deleteButton}</button>
        </div>
      </div>`;
  }
}

if (!customElements.get('player-cards')) customElements.define('player-cards', PlayerCards);

declare global {
  interface HTMLElementTagNameMap {
    'player-cards': PlayerCards;
  }
}
````

## File: src/components/PlayerEditor.ts
````typescript
// ---------------------------------------------------------------------------
// <player-editor> — name, team and star ratings per sport (player dialog)
// ---------------------------------------------------------------------------
// Ratings are kept for every sport: switching the sport shows its attributes
// without losing the others. The dialog reads `value` when it is confirmed.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { RatingAttributes } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface EditorSport {
  id: string;
  label: string;
  /** Attribute key → label (Sport.ratingAttributes()). */
  attributes: Record<string, string>;
}

export interface PlayerEditorValue {
  name: string;
  teamIdx: number | null;
  ratings: Record<string, RatingAttributes>;
}

const LABEL = 'display:block; font-weight:600; margin-bottom:6px; font-size:13px;';

export class PlayerEditor extends LightElement {
  static properties = {
    sports: { attribute: false },
    teams: { attribute: false },
    sportId: { state: true },
    ratings: { state: true },
  };

  declare sports: EditorSport[];
  /** Team names of the tournament, by index. */
  declare teams: string[];
  private declare sportId: string;
  private declare ratings: Record<string, RatingAttributes>;

  private name = '';
  private teamIdx: number | null = null;

  constructor() {
    super();
    this.sports = [];
    this.teams = [];
    this.sportId = '';
    this.ratings = {};
  }

  /** Starts editing: the player's current values and the sport shown first. */
  load(value: PlayerEditorValue, sportId: string): void {
    this.name = value.name;
    this.teamIdx = value.teamIdx;
    this.ratings = JSON.parse(JSON.stringify(value.ratings || {}));
    this.sportId = sportId;
  }

  get value(): PlayerEditorValue {
    return { name: this.name.trim(), teamIdx: this.teamIdx, ratings: this.ratings };
  }

  private get sport(): EditorSport {
    return this.sports.find((s) => s.id === this.sportId) || this.sports[0];
  }

  private attrs(): RatingAttributes {
    return this.ratings[this.sport.id] || {};
  }

  /** Average of the shown sport's attributes. */
  private average(): number {
    const keys = Object.keys(this.sport.attributes);
    const a = this.attrs();
    return keys.length ? keys.reduce((s, k) => s + (Number(a[k]) || 0), 0) / keys.length : 0;
  }

  private setStar(key: string, n: number): void {
    const a = { ...this.attrs() };
    a[key] = a[key] === n ? 0 : n;
    this.ratings = { ...this.ratings, [this.sport.id]: a };
  }

  render(): TemplateResult {
    if (!this.sports.length) return html``;
    const sport = this.sport;
    const a = this.attrs();
    return html`
      <div style="margin-bottom:12px;">
        <label style=${LABEL}>${en.players.nameLabel}</label>
        <input type="text" class="input" .value=${this.name} placeholder=${en.players.namePlaceholder} maxlength="60" style="width:100%;"
          @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }}>
      </div>
      <div style="margin-bottom:12px;">
        <label style=${LABEL}>${en.players.teamLabel}</label>
        <select class="input" style="width:100%;" @change=${(e: Event) => {
          const v = (e.target as HTMLSelectElement).value;
          this.teamIdx = v === '' ? null : parseInt(v, 10);
        }}>
          <option value="">${en.players.noTeam}</option>
          ${this.teams.map((t, i) => html`<option value=${i} ?selected=${this.teamIdx === i}>${t}</option>`)}
        </select>
      </div>
      <div style="margin-bottom:16px;">
        <label style=${LABEL}>${en.players.attributeSportLabel}</label>
        <select class="input" style="width:100%;" @change=${(e: Event) => { this.sportId = (e.target as HTMLSelectElement).value; }}>
          ${this.sports.map((s) => html`<option value=${s.id} ?selected=${s.id === sport.id}>${s.label}</option>`)}
        </select>
      </div>
      <div class="rating-preview">★ ${this.average().toFixed(1)}</div>
      <div class="rating-preview-label">${en.players.ratingLabel(sport.label)}</div>
      <div>${Object.entries(sport.attributes).map(([key, label]) => html`
        <div class="star-row">
          <span class="star-row-label">${label}</span>
          <div class="stars-input">${[1, 2, 3, 4, 5].map((n) => html`
            <button type="button" class="star-btn${n <= (Number(a[key]) || 0) ? ' filled' : ''}" @click=${() => this.setStar(key, n)}>★</button>`)}</div>
        </div>`)}</div>`;
  }
}

if (!customElements.get('player-editor')) customElements.define('player-editor', PlayerEditor);

declare global {
  interface HTMLElementTagNameMap {
    'player-editor': PlayerEditor;
  }
}
````

## File: src/components/PlayerPicker.ts
````typescript
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
````

## File: src/components/racketBoard.ts
````typescript
// ---------------------------------------------------------------------------
// Racket scoreboard — one line per side, as on a padel or tennis broadcast
// ---------------------------------------------------------------------------
// Used by the schedule and results lists. Each line has the side, the games
// of every set (the set being played highlighted, a lost set faded) and the
// sets won; a match played to points shows the points only. With `onStep`
// (an admin in Results) each line also gets − / +.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Config, MatchResult } from '../types.js';
import type { RacketSport, SetScore } from '../sports/RacketSport.js';
import { GAME_STATUS } from '../types.js';
import { en } from '../i18n/en.js';
import { statusOf } from './rounds.js';

export type BoardSide = 'home' | 'away';

export interface RacketBoardOptions {
  sport: RacketSport;
  config: Config | null;
  result: MatchResult | undefined;
  /** The side's label (team, or pair of players). */
  label: (side: BoardSide) => TemplateResult;
  /** − / + of one side; none for a read-only board. */
  onStep?: (side: BoardSide, action: 'add' | 'sub') => void;
}

export function racketBoard(o: RacketBoardOptions): TemplateResult {
  const { sport, config, result } = o;
  const total = sport.pointsPerMatch(config);
  const format = sport.format(config);
  const sets: SetScore[] = total ? [] : sport.setsOf(result);
  const shown = sport.shownScore(result, config);
  const winner = total
    ? (statusOf(result) === GAME_STATUS.TERMINADO && shown && shown.home !== shown.away ? (shown.home > shown.away ? 'home' : 'away') : null)
    : sport.matchWinner(sets, format);
  const playing = !winner && statusOf(result) !== GAME_STATUS.TERMINADO;
  const current = sets.length - 1;
  // One set: its games are the score, a "sets won" column would only say 1-0
  const showSetsWon = !total && format.sets > 1;
  const titles = total
    ? { sub: en.racketScore.cancelPointTitle, add: en.racketScore.addPointTitle }
    : { sub: en.racketScore.cancelGameTitle, add: en.racketScore.addGameTitle };

  const line = (side: BoardSide) => html`
    <div class="rb-line ${winner === side ? 'rb-won' : ''}">
      <span class="rb-team">${o.label(side)}</span>
      <span class="rb-sets">${sets.map((s, i) => {
        const setWinner = sport.setWinner(s, i, format);
        const cls = playing && i === current ? 'rb-current' : (setWinner && setWinner !== side ? 'rb-lost' : '');
        return html`<span class="rb-set ${cls}" data-side=${showSetsWon || total ? nothing : side}>${s[side]}</span>`;
      })}</span>
      ${showSetsWon || total ? html`<span class="rb-total" data-side=${side}>${shown ? shown[side] : '–'}</span>` : nothing}
      ${o.onStep ? html`
        <span class="rb-steps">
          <button class="score-btn" title=${titles.sub} @click=${() => o.onStep!(side, 'sub')}>-</button>
          <button class="score-btn" title=${titles.add} @click=${() => o.onStep!(side, 'add')}>+</button>
        </span>` : nothing}
    </div>`;

  return html`
    <div class="racket-board">
      ${line('home')}${line('away')}
      ${total ? html`<div class="rb-note">${en.racketScore.pointsLine(total, Math.max(0, total - (shown ? shown.home + shown.away : 0)))}</div>` : nothing}
    </div>`;
}
````

## File: src/components/SingleMatchHistory.ts
````typescript
// ---------------------------------------------------------------------------
// <single-match-history> — saved single matches, newest first
// ---------------------------------------------------------------------------
// Emits `single-delete` (detail: match id).
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface SingleMatchCard {
  id: string;
  date: string;
  teamA: string;
  teamB: string;
  playersA: string[];
  playersB: string[];
  result: string;
  mvp: string;
}

export class SingleMatchHistory extends LightElement {
  static properties = {
    cards: { attribute: false },
  };

  /** Newest first. */
  declare cards: SingleMatchCard[];

  constructor() {
    super();
    this.cards = [];
  }

  render(): TemplateResult {
    if (!this.cards.length) return html`<p class="empty">${en.singleMatch.noMatchesRecorded}</p>`;
    return html`${this.cards.map((m) => html`
      <div class="historico-card">
        <div class="historico-header">
          <span class="historico-date">📅 ${m.date}</span>
          <button class="btn btn-ghost" style="font-size:12px; padding:4px 10px; border:1px solid var(--danger); color:var(--danger);"
            @click=${() => this.emit('single-delete', m.id)}>🗑️</button>
        </div>
        <div class="historico-teams">
          <div>
            <div class="historico-team-name">${m.teamA}</div>
            <div class="historico-team-players">${m.playersA.join(', ')}</div>
          </div>
          <div class="historico-resultado">${m.result || '—'}${m.mvp ? html`<div class="historico-mvp">⭐ ${m.mvp}</div>` : nothing}</div>
          <div style="text-align:right;">
            <div class="historico-team-name">${m.teamB}</div>
            <div class="historico-team-players">${m.playersB.join(', ')}</div>
          </div>
        </div>
      </div>`)}`;
  }
}

if (!customElements.get('single-match-history')) customElements.define('single-match-history', SingleMatchHistory);

declare global {
  interface HTMLElementTagNameMap {
    'single-match-history': SingleMatchHistory;
  }
}
````

## File: src/components/SquadList.ts
````typescript
// ---------------------------------------------------------------------------
// <squad-list> — the players of one team, with the squad's average rating
// ---------------------------------------------------------------------------
// Emits `player-stats` (detail: player id) and `squad-remove` (detail: player
// id); CSS hides the remove button from non-admins.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface SquadRow {
  id: string;
  num: number | string;
  name: string;
  /** Rating in the tournament's sport, or null for a player not in the database. */
  rating: number | null;
}

export class SquadList extends LightElement {
  static properties = {
    rows: { attribute: false },
    teamSelected: { type: Boolean },
    numbered: { type: Boolean },
    editable: { type: Boolean },
  };

  /** Players in squad order. */
  declare rows: SquadRow[];
  declare teamSelected: boolean;
  /** Football squads show jersey numbers; padel pairs do not. */
  declare numbered: boolean;
  declare editable: boolean;

  constructor() {
    super();
    this.rows = [];
    this.teamSelected = false;
    this.numbered = true;
    this.editable = false;
  }

  render(): TemplateResult {
    if (!this.teamSelected) return html`<p class="empty">${en.squads.noTeamSelected}</p>`;
    if (!this.rows.length) {
      return html`<p class="empty" style="padding-top:20px;">${this.editable ? en.squads.noPlayersAdmin : en.squads.noPlayersReadonly}</p>`;
    }
    const rated = this.rows.filter((r) => r.rating !== null);
    const avg = rated.length ? rated.reduce((s, r) => s + (r.rating || 0), 0) / rated.length : 0;
    return html`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; margin-bottom:12px; padding:8px 12px; background:var(--paper); border:1px solid var(--line); border-radius:var(--radius-sm);">
        <span style="font-size:13px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">${en.squads.playersCount(this.rows.length)}</span>
        <span style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);" title=${en.squads.avgRatingTitle}>${en.squads.avgRating(avg.toFixed(1))}</span>
      </div>
      <div>${this.rows.map((p) => this.rowTemplate(p))}</div>`;
  }

  private rowTemplate(p: SquadRow): TemplateResult {
    return html`
      <div class="player-row">
        <div class="player-info">
          ${this.numbered ? html`<span class="player-num">${p.num}</span>` : nothing}<span style="font-weight:600;">${p.name}</span>
          ${p.rating !== null ? html` <span style="font-size:12px; color:var(--gold-dark); font-weight:700;">★ ${p.rating.toFixed(1)}</span>` : nothing}
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost player-stats-btn" style="color:var(--pitch-800); background:var(--paper); border:1px solid var(--line); padding:4px 8px; font-size:12px;"
            @click=${() => this.emit('player-stats', p.id)}>📊 ${en.common.stats}</button>
          <button class="player-del" data-requires="admin" title=${en.squads.removePlayerTitle}
            @click=${() => this.emit('squad-remove', p.id)}>&times;</button>
        </div>
      </div>`;
  }
}

if (!customElements.get('squad-list')) customElements.define('squad-list', SquadList);

declare global {
  interface HTMLElementTagNameMap {
    'squad-list': SquadList;
  }
}
````

## File: src/components/StatCards.ts
````typescript
// ---------------------------------------------------------------------------
// <stat-cards> — the tournament summary cards (dashboard and Stats tab)
// ---------------------------------------------------------------------------
// `display: contents`: each card is a direct item of the parent `.stats-grid`.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { LightElement } from './LightElement.js';

export interface StatCard {
  label: string;
  value: string;
}

export class StatCards extends LightElement {
  static properties = {
    cards: { attribute: false },
  };

  declare cards: StatCard[];
  protected hostDisplay = 'contents' as const;

  constructor() {
    super();
    this.cards = [];
  }

  render(): TemplateResult {
    return html`${this.cards.map((c) => html`
      <div class="stat-card"><div class="stat-label">${c.label}</div><div class="stat-value">${c.value}</div></div>`)}`;
  }
}

if (!customElements.get('stat-cards')) customElements.define('stat-cards', StatCards);

declare global {
  interface HTMLElementTagNameMap {
    'stat-cards': StatCards;
  }
}
````

## File: src/components/TeamsEditor.ts
````typescript
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
````

## File: src/components/TournamentList.ts
````typescript
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
````

## File: src/components/UserList.ts
````typescript
// ---------------------------------------------------------------------------
// <user-list> — signed-in users and their roles (Users tab, master only)
// ---------------------------------------------------------------------------
// Admins also get a checkbox per sport they administer. Emits `role-change`
// (detail: { uid, name, role, sportAdmins }) when the role or a sport changes;
// the signed-in master cannot change their own row.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Role, UserProfile } from '../types.js';
import { ROLES, isKnownRole } from '../permissions.js';
import { fmtTimestamp } from '../utils.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface UserSport {
  id: string;
  label: string;
}

export interface RoleChange {
  uid: string;
  name: string;
  role: Role | null;
  /** Sports the user administers (admin and master), or null. */
  sportAdmins: Record<string, boolean> | null;
}

const ORDER: Record<string, number> = { master: 0, admin: 1, user: 2 };

export class UserList extends LightElement {
  static properties = {
    users: { attribute: false },
    sports: { attribute: false },
    selfUid: { type: String },
    drafts: { state: true },
  };

  /** null until the first read from Firebase. */
  declare users: UserProfile[] | null;
  declare sports: UserSport[];
  declare selfUid: string;
  /** Role picked on screen per uid, so the sport boxes show before the save comes back. */
  private declare drafts: Record<string, string>;

  constructor() {
    super();
    this.users = null;
    this.sports = [];
    this.selfUid = '';
    this.drafts = {};
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    // Fresh data from Firebase replaces what was picked on screen
    if (changed.has('users')) this.drafts = {};
  }

  render(): TemplateResult {
    if (!this.users) return html`<p class="empty">${en.common.loading}</p>`;
    if (!this.users.length) return html`<p class="empty">${en.adminTab.noUsersYet}</p>`;
    const sorted = this.users.slice().sort((a, b) =>
      (ORDER[a.role || ''] ?? 3) - (ORDER[b.role || ''] ?? 3) || String(a.nome || '').localeCompare(String(b.nome || '')));
    return html`${sorted.map((u) => this.rowTemplate(u))}`;
  }

  private change(u: UserProfile, row: HTMLElement): void {
    const role = (row.querySelector('select') as HTMLSelectElement).value;
    this.drafts = { ...this.drafts, [u.uid]: role };
    let sportAdmins: Record<string, boolean> | null = null;
    if (role === 'admin') {
      sportAdmins = {};
      row.querySelectorAll<HTMLInputElement>('input[data-sport]').forEach((cb) => { sportAdmins![cb.dataset.sport!] = cb.checked; });
    } else if (role === 'master') {
      sportAdmins = Object.fromEntries(this.sports.map((s) => [s.id, true]));
    }
    this.emit<RoleChange>('role-change', {
      uid: u.uid,
      name: u.nome || '',
      role: isKnownRole(role) ? role : null,
      sportAdmins,
    });
  }

  private rowTemplate(u: UserProfile): TemplateResult {
    const saved = isKnownRole(u.role) ? u.role : '';
    const role = this.drafts[u.uid] ?? saved;
    const self = u.uid === this.selfUid;
    const last = typeof u.ultimoAcesso === 'number' ? fmtTimestamp(new Date(u.ultimoAcesso).toISOString()) : '—';
    const onChange = (e: Event) => this.change(u, (e.target as HTMLElement).closest('.user-row') as HTMLElement);
    const option = (value: string, label: string) => html`<option value=${value} ?selected=${role === value}>${label}</option>`;
    return html`
      <div class="user-row">
        <div class="user-row__info">
          <div class="user-row__name">${u.nome || en.common.unnamed}</div>
          <div class="user-row__meta">${u.email || ''} · ${en.adminTab.lastActive(last)}</div>
          ${role === 'admin' ? html`
            <div class="user-sport-admins" style="display:flex; gap:10px; margin-top:6px; font-size:12px;">
              ${this.sports.map((s) => html`
                <label style="cursor:pointer;"><input type="checkbox" data-sport=${s.id} .checked=${!!u.admin?.[s.id]}
                  ?disabled=${self} @change=${onChange}> ${s.label}</label>`)}
            </div>` : nothing}
        </div>
        <select ?disabled=${self} title=${self ? en.roles.cannotChangeOwn : nothing} @change=${onChange}>
          ${option('', en.roles.pending)}${option('user', ROLES.user)}${option('admin', ROLES.admin)}${option('master', ROLES.master)}
        </select>
      </div>`;
  }
}

if (!customElements.get('user-list')) customElements.define('user-list', UserList);

declare global {
  interface HTMLElementTagNameMap {
    'user-list': UserList;
  }
}
````

## File: src/core/americano.ts
````typescript
import type { Match, MatchResult, RoundMeta, StandingsRow, Team } from '../types.js';
import { GAME_STATUS } from '../types.js';
import { bergerRounds } from './schedule.js';

// ---------------------------------------------------------------------------
// Americano and Mexicano (padel with rotating partners)
// ---------------------------------------------------------------------------
// Every team slot holds one player. A match is two pairs of players: `home`
// and `away` are the first player of each pair and `partners` the second.
// Each match is played to a fixed total of points ("15-9" of 24) and every
// player keeps the points their pair won.
//
// - Americano: every player partners every other player once (n − 1 rounds).
// - Mexicano: one round at a time; in each group of four by ranking,
//   1st + 4th play 2nd + 3rd.

export type RotationFormat = 'americano' | 'mexicano';

export const ROTATION_FORMATS: readonly RotationFormat[] = ['americano', 'mexicano'];

/** Players per match. Rotating formats need a multiple of this many players. */
export const PLAYERS_PER_MATCH = 4;

export interface RotationMatch {
  home: [number, number];
  away: [number, number];
}

export function isRotationFormat(value: unknown): value is RotationFormat {
  return ROTATION_FORMATS.includes(value as RotationFormat);
}

/** Can a rotating tournament be played with this many players? */
export function validPlayerCount(n: number): boolean {
  return Number.isInteger(n) && n >= PLAYERS_PER_MATCH && n % PLAYERS_PER_MATCH === 0;
}

/**
 * Americano rounds: the Berger round-robin of the players gives the partner
 * pairs of each round (every pair exactly once), and consecutive pairs play
 * each other.
 */
export function americanoRounds(n: number): RotationMatch[][] {
  if (!validPlayerCount(n)) return [];
  return bergerRounds(n).map(({ pairs }) => {
    const matches: RotationMatch[] = [];
    for (let i = 0; i + 1 < pairs.length; i += 2) matches.push({ home: pairs[i], away: pairs[i + 1] });
    return matches;
  });
}

/** A Mexicano round from a ranking (best first): 1st + 4th vs 2nd + 3rd in each group of four. */
export function mexicanoRound(ranking: number[]): RotationMatch[] {
  if (!validPlayerCount(ranking.length)) return [];
  const matches: RotationMatch[] = [];
  for (let i = 0; i < ranking.length; i += PLAYERS_PER_MATCH) {
    const [a, b, c, d] = ranking.slice(i, i + PLAYERS_PER_MATCH);
    matches.push({ home: [a, d], away: [b, c] });
  }
  return matches;
}

/** Turns rounds into schedule matches, numbering the rounds from firstRound. */
export function rotationSchedule(rounds: RotationMatch[][], firstRound = 1): { games: Match[]; rounds: RoundMeta[] } {
  const games: Match[] = [];
  const meta: RoundMeta[] = [];
  rounds.forEach((matches, r) => {
    const jornada = firstRound + r;
    meta.push({ jornada, bye: null });
    matches.forEach((m) => {
      games.push({ jornada, home: m.home[0], away: m.away[0], partners: { home: m.home[1], away: m.away[1] } });
    });
  });
  return { games, rounds: meta };
}

/** The partner of a match side, if the match has rotating pairs. */
export function partnerOf(game: Match, side: 'home' | 'away'): number | null {
  const v = game.partners?.[side];
  return typeof v === 'number' ? v : null;
}

/** Both players of a side (just one for a fixed team). */
export function sidePlayers(game: Match, side: 'home' | 'away'): number[] {
  const first = game[side];
  if (typeof first !== 'number') return [];
  const partner = partnerOf(game, side);
  return partner === null ? [first] : [first, partner];
}

/** Points of a "15-9" score, or null. */
export function parsePoints(score: unknown): { home: number; away: number } | null {
  const m = /^(\d{1,3})-(\d{1,3})$/.exec(String(score ?? '').trim());
  return m ? { home: Number(m[1]), away: Number(m[2]) } : null;
}

function scoreOf(res: MatchResult | undefined): string {
  if (!res) return '';
  return typeof res === 'object' ? res.score || '' : res;
}

/**
 * Standings per player: points won (Pts and GM), points lost (GS), difference,
 * matches played, won, drawn and lost. Ranked by points won, then difference,
 * then wins, then name.
 */
export function playerStandings(
  teams: (Team | string)[],
  schedule: Match[],
  results: Record<string | number, MatchResult>,
): StandingsRow[] {
  const rows: StandingsRow[] = teams.map((t, idx) => ({
    idx,
    name: typeof t === 'string' ? t : t?.name || `Player ${idx + 1}`,
    J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, DG: 0, Pts: 0,
  }));

  schedule.forEach((game, gi) => {
    const res = results[gi];
    if (!res || (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO)) return;
    const pts = parsePoints(scoreOf(res));
    if (!pts) return;
    (['home', 'away'] as const).forEach((side) => {
      const mine = pts[side];
      const theirs = pts[side === 'home' ? 'away' : 'home'];
      sidePlayers(game, side).forEach((p) => {
        const r = rows[p];
        if (!r) return;
        r.J++;
        r.GM += mine;
        r.GS += theirs;
        if (mine > theirs) r.V++;
        else if (mine < theirs) r.D++;
        else r.E++;
      });
    });
  });

  rows.forEach((r) => {
    r.DG = r.GM - r.GS;
    r.Pts = r.GM;
  });
  return rows.sort((x, y) => y.Pts - x.Pts || (y.DG ?? 0) - (x.DG ?? 0) || y.V - x.V || x.name.localeCompare(y.name));
}

/** Have all matches of the latest round been played? */
export function lastRoundFinished(schedule: Match[], results: Record<string | number, MatchResult>): boolean {
  if (!schedule.length) return false;
  const last = schedule[schedule.length - 1].jornada;
  return schedule.every((g, gi) => {
    if (g.jornada !== last) return true;
    const res = results[gi];
    return !!res && (typeof res !== 'object' || res.status === GAME_STATUS.TERMINADO);
  });
}
````

## File: src/core/playoffs.ts
````typescript
import type { Match, RoundMeta, StandingsRow } from '../types.js';
import { en } from '../i18n/en.js';
import { buildFirstRoundSeeding } from './schedule.js';

// ---------------------------------------------------------------------------
// Knockout bracket
// ---------------------------------------------------------------------------

export interface PlayoffRound {
  prefix: string;
  label: string;
}

/**
 * Every knockout round, largest first: Round of 16 → Quarter-Finals → Semi-Finals → Final.
 * A bracket of N teams starts at index `length - log2(N)`; supporting 32 teams
 * only needs one more entry at the start.
 */
export const ROUND_CHAIN: readonly PlayoffRound[] = [
  { prefix: 'OF', label: en.playoffs.roundOf16 },
  { prefix: 'QF', label: en.playoffs.quarterFinals },
  { prefix: 'MF', label: en.playoffs.semiFinals },
  { prefix: 'F', label: en.playoffs.final },
];

/** Index in ROUND_CHAIN of the first round for teamCount teams, or null if it is not supported. */
export function firstRoundIndex(teamCount: number): number | null {
  const start = ROUND_CHAIN.length - Math.log2(teamCount);
  return Number.isInteger(start) && start >= 0 ? start : null;
}

/**
 * Picks the knockout teams by position, alternating groups (1st A, 1st B, 2nd A, 2nd B, …).
 * Returns null when a group has fewer than perGroup teams.
 */
export function playoffSeeds(groups: { standings: StandingsRow[] }[], perGroup: number): StandingsRow[] | null {
  if (!groups.every((g) => g.standings.length >= perGroup)) return null;
  const seeds: StandingsRow[] = [];
  for (let pos = 0; pos < perGroup; pos++) {
    groups.forEach((g) => seeds.push(g.standings[pos]));
  }
  return seeds;
}

/**
 * Builds the whole knockout bracket.
 *
 * The 1st round pairs the highest seed with the lowest (1 vs N, …) so the best
 * teams do not meet early. Later rounds hold "Winner Xn" placeholders that are
 * filled in when results come in (see advanceWinner).
 *
 * @param teamCount - Teams in the bracket (a power of 2, at most 16)
 * @param seeds - Teams ordered by seed (index 0 = 1st seed)
 */
export function buildPlayoffBracket(teamCount: number, seeds: { idx: number }[]): { games: Match[]; rounds: RoundMeta[] } {
  const startIndex = firstRoundIndex(teamCount);
  if (startIndex === null || seeds.length < teamCount) return { games: [], rounds: [] };

  const roundDefs = ROUND_CHAIN.slice(startIndex);
  const firstRoundSeeding = buildFirstRoundSeeding(teamCount);
  const games: Match[] = [];
  const rounds: RoundMeta[] = [];

  roundDefs.forEach(({ prefix, label }, roundIndex) => {
    const next = roundDefs[roundIndex + 1]?.prefix ?? null;
    const matchCount = teamCount / Math.pow(2, roundIndex + 1);
    rounds.push({ jornada: label, bye: null });

    for (let i = 0; i < matchCount; i++) {
      const nextMatchId = next ? `${next}${Math.floor(i / 2) + 1}_${i % 2 === 0 ? 'home' : 'away'}` : null;
      let home: number | string;
      let away: number | string;
      if (roundIndex === 0) {
        const [seedA, seedB] = firstRoundSeeding[i];
        home = seeds[seedA].idx;
        away = seeds[seedB].idx;
      } else {
        const prevPrefix = roundDefs[roundIndex - 1].prefix;
        home = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 1);
        away = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 2);
      }
      games.push({ jornada: label, home, away, isPlayoff: true, playoffMatchId: `${prefix}${i + 1}`, nextMatchId });
    }
  });

  return { games, rounds };
}

/**
 * Puts the winner of a knockout match into its slot of the next match.
 * @returns true when the schedule changed
 */
export function advanceWinner(schedule: Match[], game: Match, winnerIdx: number | string): boolean {
  if (!game.nextMatchId) return false;
  const [targetMatchId, targetSide] = String(game.nextMatchId).split('_');
  if (targetSide !== 'home' && targetSide !== 'away') return false;
  const target = schedule.find((g) => g.playoffMatchId === targetMatchId);
  if (!target || target[targetSide] === winnerIdx) return false;
  target[targetSide] = winnerIdx;
  return true;
}
````

## File: src/core/schedule.ts
````typescript
import type { Match, RoundMeta } from '../types.js';

// ---------------------------------------------------------------------------
// Berger Algorithm (round-robin scheduling)
// ---------------------------------------------------------------------------

export interface BergerRound {
  pairs: [number, number][];
  bye: number | null;
}

/**
 * Computes round-robin rounds for n teams using Berger tables.
 * If n is odd, an extra dummy team (-1) is used for byes.
 */
export function bergerRounds(n: number): BergerRound[] {
  const teams: number[] = [];
  for (let i = 0; i < n; i++) teams.push(i);
  if (n % 2 !== 0) teams.push(-1); // bye slot

  const total = teams.length;
  const fixed = teams[0];
  let rest = teams.slice(1);
  const rounds: BergerRound[] = [];

  for (let r = 0; r < total - 1; r++) {
    const l = [fixed, ...rest];
    const pairs: [number, number][] = [];
    let bye: number | null = null;

    for (let k = 0; k < total / 2; k++) {
      let t1 = l[k];
      let t2 = l[total - 1 - k];

      if (r % 2 === 1) {
        [t1, t2] = [t2, t1];
      }

      if (t1 === -1) bye = t2;
      else if (t2 === -1) bye = t1;
      else pairs.push([t1, t2]);
    }

    rounds.push({ pairs, bye });
    rest = [rest[rest.length - 1], ...rest.slice(0, -1)];
  }

  return rounds;
}

// ---------------------------------------------------------------------------
// Complete schedule generation (league + groups + voltas/rounds)
// ---------------------------------------------------------------------------

export interface GeneratedSchedule {
  schedule: Match[];
  roundsMeta: RoundMeta[];
}

export function generateSchedule(groupsIndices: number[][], numVoltas: number): GeneratedSchedule {
  const schedule: Match[] = [];
  const roundsMeta: RoundMeta[] = [];
  const nGrupos = groupsIndices.length;

  let maxRoundsPerVolta = 0;
  const groupBergerRounds = groupsIndices.map((group) => {
    const bRounds = bergerRounds(group.length);
    if (bRounds.length > maxRoundsPerVolta) maxRoundsPerVolta = bRounds.length;
    return bRounds;
  });

  let jornada = 1;

  for (let v = 0; v < numVoltas; v++) {
    const mirror = v % 2 === 1;

    for (let ri = 0; ri < maxRoundsPerVolta; ri++) {
      const roundByes: number[] = [];

      for (let g = 0; g < nGrupos; g++) {
        if (ri >= groupBergerRounds[g].length) continue;

        const round = groupBergerRounds[g][ri];

        for (const pair of round.pairs) {
          const t1 = pair[0] === -1 ? -1 : groupsIndices[g][pair[0]];
          const t2 = pair[1] === -1 ? -1 : groupsIndices[g][pair[1]];
          const home = mirror ? t2 : t1;
          const away = mirror ? t1 : t2;
          schedule.push({ jornada, home, away, group: g });
        }

        if (round.bye !== null) {
          roundByes.push(groupsIndices[g][round.bye]);
        }
      }

      roundsMeta.push({ jornada, bye: roundByes.length ? roundByes.join(', ') : null });
      jornada++;
    }
  }

  return { schedule, roundsMeta };
}

// ---------------------------------------------------------------------------
// Extra round (appended to an existing schedule)
// ---------------------------------------------------------------------------

export interface ExtraVoltaResult {
  games: Match[];
  rounds: RoundMeta[];
}

/**
 * Generates matches for a new round (volta) based on round 1 of the current schedule,
 * preserving existing games so stored results remain at their original indices.
 */
export function buildExtraVolta(
  schedule: Match[],
  roundsMeta: RoundMeta[],
  numVoltas: number
): ExtraVoltaResult {
  const roundsPerVolta = roundsMeta.length / numVoltas;
  const offset = roundsPerVolta * numVoltas;
  const mirror = numVoltas % 2 === 1; // new volta index is numVoltas

  const games: Match[] = schedule
    .filter((g) => !g.isPlayoff && (typeof g.jornada === 'number' && g.jornada <= roundsPerVolta))
    .map((g) => ({
      ...g,
      jornada: (g.jornada as number) + offset,
      home: mirror ? g.away : g.home,
      away: mirror ? g.home : g.away,
    }));

  const rounds: RoundMeta[] = roundsMeta
    .slice(0, roundsPerVolta)
    .map((r) => ({
      ...r,
      jornada: (typeof r.jornada === 'number' ? r.jornada + offset : r.jornada),
    }));

  return { games, rounds };
}

// ---------------------------------------------------------------------------
// Playoffs / Elimination seeding
// ---------------------------------------------------------------------------

/**
 * Computes seed pairings for the 1st round of an N-team single elimination bracket.
 * Standard bracket ordering: seed s plays m-1-s, and seeds 1 and 2 can only meet in the final.
 * Example for N=8: [0,7], [3,4], [1,6], [2,5]
 */
export function buildFirstRoundSeeding(n: number): [number, number][] {
  let order = [0];
  while (order.length < n) {
    const m = order.length * 2;
    order = order.flatMap((s) => [s, m - 1 - s]);
  }

  const pairs: [number, number][] = [];
  for (let i = 0; i < order.length; i += 2) {
    pairs.push([order[i], order[i + 1]]);
  }
  return pairs;
}
````

## File: src/sports/tennis/Tennis.ts
````typescript
import { RacketSport } from '../RacketSport.js';
import type { SetFormat } from '../../types.js';
import { en } from '../../i18n/en.js';

// ---------------------------------------------------------------------------
// Tennis — best of 3 sets to 6 games, a full deciding set
// ---------------------------------------------------------------------------
// Singles or doubles: a team is one or two players. Scored game by game like
// padel; the format can be changed per tournament (config.setFormat), e.g.
// best of 5, or a super tie-break instead of the deciding set.

export class Tennis extends RacketSport {
  readonly id = 'tennis';
  readonly name = 'Tennis';
  readonly icon = '🎾';
  readonly defaultFormat: SetFormat = { sets: 3, gamesPerSet: 6, superTieBreak: false };

  ratingAttributes(): Record<string, string> {
    return en.players.tennisAttributes;
  }
}

export const tennis = new Tennis();
````

## File: src/sports/tennis/TennisScore.ts
````typescript
// ---------------------------------------------------------------------------
// <tennis-score> — the tennis match panel (see RacketScore)
// ---------------------------------------------------------------------------
import { RacketScore } from '../RacketScore.js';
import { tennis } from './Tennis.js';

export class TennisScore extends RacketScore {
  protected readonly sport = tennis;
}

if (!customElements.get('tennis-score')) customElements.define('tennis-score', TennisScore);

declare global {
  interface HTMLElementTagNameMap {
    'tennis-score': TennisScore;
  }
}
````

## File: src/ui/modals.ts
````typescript
import { html, render } from 'lit';
import type { TemplateResult } from 'lit';
import { state } from '../state.js';
import { getTeamName } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// The app dialog (#modalOverlay): confirmations, pickers and editors
// ---------------------------------------------------------------------------
// One dialog for the whole app: a title, a body drawn with a Lit template and
// two buttons. The confirm button runs the dialog's callback; the bodies that
// need input (the delete word, the pair picker) enable it with
// setConfirmEnabled().

/** Dialog body: a Lit template, or plain text. */
export type DialogContent = TemplateResult | string;

/** Colour of a dialog button. */
export type ButtonTone = 'danger' | 'gold' | 'pitch' | 'paper' | 'green';

export interface DialogButton {
  label: string;
  tone: ButtonTone;
}

export interface DialogOptions {
  title: string;
  body: DialogContent;
  /** The right-hand button; null hides it (an information dialog). */
  confirm: DialogButton | null;
  /** The left-hand button, which closes the dialog. */
  cancel?: DialogButton;
  onConfirm?: (() => void) | null;
}

const TONES: Record<ButtonTone, { background: string; color: string }> = {
  danger: { background: 'var(--danger)', color: '#fff' },
  gold: { background: 'var(--gold)', color: '#000' },
  pitch: { background: 'var(--pitch-500)', color: '#fff' },
  green: { background: 'var(--pitch-600)', color: '#fff' },
  paper: { background: 'var(--paper)', color: 'var(--ink)' },
};

const CANCEL: DialogButton = { label: en.common.cancel, tone: 'paper' };

let confirmCallback: (() => void) | null = null;

function styleButton(btn: HTMLElement, b: DialogButton): void {
  btn.textContent = b.label;
  btn.style.background = TONES[b.tone].background;
  btn.style.color = TONES[b.tone].color;
  btn.hidden = false;
  btn.style.display = '';
}

/** Opens the dialog; the body's first field (or the confirm button) gets the focus. */
export function openDialog(o: DialogOptions): void {
  dom.modalTitle.textContent = o.title;
  render(o.body, dom.modalBody);
  confirmCallback = o.onConfirm ?? null;
  styleButton(dom.modalCancel, o.cancel ?? CANCEL);
  const confirm = dom.modalConfirm as HTMLButtonElement;
  if (o.confirm) styleButton(confirm, o.confirm);
  else {
    confirm.hidden = true;
    confirm.style.display = 'none';
  }
  setConfirmEnabled(true);
  dom.modalOverlay.hidden = false;
  const first = dom.modalBody.querySelector<HTMLElement>('input, select');
  (first || (o.confirm ? confirm : dom.modalCancel)).focus();
}

/** Enables the confirm button (bodies that need a valid input first). */
export function setConfirmEnabled(enabled: boolean): void {
  const confirm = dom.modalConfirm as HTMLButtonElement;
  confirm.disabled = !enabled;
  confirm.style.opacity = enabled ? '' : '0.4';
  confirm.style.cursor = enabled ? '' : 'not-allowed';
}

export function closeConfirm(): void {
  dom.modalOverlay.hidden = true;
  confirmCallback = null;
  setConfirmEnabled(true);
}

/** The confirm button: closes the dialog, then runs its callback. */
export function runConfirm(): void {
  const cb = confirmCallback;
  if ((dom.modalConfirm as HTMLButtonElement).disabled) return;
  closeConfirm();
  if (cb) cb();
}

/** A yes/no question; the confirm button is red. */
export function openConfirm(title: string, body: DialogContent, onConfirm: () => void | Promise<void>): void {
  openDialog({ title, body, confirm: { label: en.common.confirm, tone: 'danger' }, onConfirm: () => { onConfirm(); } });
}

/**
 * Opens a danger confirmation that needs the delete word typed. Who may
 * delete is decided by the Firebase rules (admins only); the word only guards
 * against accidental taps.
 * @param itemLabels - what is being deleted, one per line
 */
export function openDangerConfirm(title: string, itemLabels: string[], onConfirm: () => void | Promise<void>): void {
  const word = en.modals.deleteWord;
  const onInput = (e: Event) => {
    const inp = e.target as HTMLInputElement;
    const ok = inp.value.trim() === word;
    setConfirmEnabled(ok);
    if (ok) inp.classList.remove('danger-confirm-input--error');
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const inp = e.target as HTMLInputElement;
    if (inp.value.trim() === word) {
      runConfirm();
    } else {
      inp.classList.add('danger-confirm-input--error');
      setTimeout(() => inp.classList.remove('danger-confirm-input--error'), 500);
    }
  };
  openDialog({
    title,
    body: html`
      <p style="margin-bottom:6px;">${en.modals.permanentlyDelete}</p>
      <ul class="danger-confirm-summary">${itemLabels.map((l) => html`<li>${l}</li>`)}</ul>
      <label style="font-size:13px;font-weight:600;color:var(--ink-soft);">${en.modals.toConfirmType(word)}</label>
      <input type="text" class="danger-confirm-input" autocomplete="off" spellcheck="false" placeholder=${word}
        @input=${onInput} @keydown=${onKeydown}>`,
    confirm: { label: en.modals.confirmDelete, tone: 'danger' },
    onConfirm: () => { onConfirm(); },
  });
  setConfirmEnabled(false);
}

/** A player in a pick list. */
export interface PickPlayer {
  id: string;
  label: string;
}

/** A column of player buttons; picking one closes the dialog. */
function playerButtons(players: PickPlayer[], empty: string, onSelect: (pid: string) => void): TemplateResult {
  if (!players.length) return html`<p class="empty" style="margin-bottom:14px;">${empty}</p>`;
  return html`${players.map((p) => html`
    <button class="btn btn-ghost scorer-btn" @click=${() => { closeConfirm(); onSelect(p.id); }}>${p.label}</button>`)}`;
}

/**
 * Modal to pick a player (assist, MVP).
 * @param noneLabel - the confirm button, for "none" (returns '')
 * @param onSelect - receives the chosen id, or ''
 */
export function openPickPlayerModal(title: string, players: PickPlayer[], noneLabel: string, onSelect: (pid: string) => void): void {
  openDialog({
    title,
    body: playerButtons(players, en.modals.noPlayersAvailable, onSelect),
    confirm: { label: noneLabel, tone: 'pitch' },
    onConfirm: () => onSelect(''),
  });
}

/** Squad players of a tournament team, in openPickPlayerModal format. */
export function squadPickList(teamIdx: number | string, excludeId?: string): PickPlayer[] {
  if (typeof teamIdx !== 'number' && !/^\d+$/.test(String(teamIdx))) return [];
  return (state.squads?.[Number(teamIdx)] || [])
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, label: `${p.num} - ${p.name}` }));
}

/** Who scored for one side; "Own goal" returns 'auto'. */
export function openScorerModal(gi: string | number, side: 'home' | 'away', onSelect: (pid: string) => void): void {
  const game = state.schedule[Number(gi)];
  if (!game) return;
  const teamIdx = side === 'home' ? game.home : game.away;
  openDialog({
    title: en.modals.goalForTeam(getTeamName(teamIdx)),
    body: playerButtons(squadPickList(teamIdx), en.modals.noPlayersInTeam, onSelect),
    cancel: { label: en.modals.cancelButton, tone: 'danger' },
    confirm: { label: en.modals.ownGoalButton, tone: 'pitch' },
    onConfirm: () => onSelect('auto'),
  });
}
````

## File: src/ui/navigation.ts
````typescript
import { panels } from './dom.js';
import { replayStandings } from './standings.js';

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------
export function switchTab(name: string): void {
  const tabsContainer = document.getElementById('tabs');
  document.querySelectorAll<HTMLElement>('.tab').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  panels.forEach((p) => { p.classList.toggle('active', p.id === `tab-${name}`); });
  if (tabsContainer) tabsContainer.classList.remove('menu-open');
  if (name === 'standings') replayStandings();
}
````

## File: src/ui/singular.ts
````typescript
import { state, persistJogosSingulares } from '../state.js';
import { fmtTimestamp, playerName } from '../utils.js';
import { getPlayerRating, balancedDraft, alignAssists } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import type { Player, SingleMatch } from '../types.js';
import type { PlayerPicker } from '../components/PlayerPicker.js';
import type { DraftTeams, DraftTeam, DraftSide, DraftGoal } from '../components/DraftTeams.js';
import type { SingleMatchHistory } from '../components/SingleMatchHistory.js';
import '../components/PlayerPicker.js';
import '../components/DraftTeams.js';
import '../components/SingleMatchHistory.js';
import { dom } from './dom.js';
import { showToast } from './toasts.js';
import { openConfirm, openPickPlayerModal } from './modals.js';
import { pickerRows } from './teams.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Single Match tab — draft two balanced teams, record goals, keep a history
// ---------------------------------------------------------------------------

/** The match being played (not saved until "Save match"). */
class Draft {
  teams: Record<DraftSide, { name: string; players: Player[]; scorers: string[]; assists: string[] }> = {
    A: { name: '', players: [], scorers: [], assists: [] },
    B: { name: '', players: [], scorers: [], assists: [] },
  };

  mvp = '';

  get empty(): boolean {
    return !this.teams.A.players.length && !this.teams.B.players.length;
  }

  start(nameA: string, nameB: string, a: Player[], b: Player[]): void {
    this.teams = {
      A: { name: nameA, players: a, scorers: [], assists: [] },
      B: { name: nameB, players: b, scorers: [], assists: [] },
    };
    this.mvp = '';
  }

  addGoal(side: DraftSide, pid: string, aid: string): void {
    this.teams[side].scorers.push(pid);
    this.teams[side].assists.push(aid);
  }

  /** Removes the player's last goal (and its assist); false if they had none. */
  removeGoal(side: DraftSide, pid: string): boolean {
    const t = this.teams[side];
    const idx = t.scorers.lastIndexOf(pid);
    if (idx === -1) return false;
    t.scorers.splice(idx, 1);
    t.assists.splice(idx, 1);
    return true;
  }

  reset(): void {
    this.start('', '', [], []);
  }
}

const draft = new Draft();

function sportId(): string {
  return getSport(state.meta?.sport || state.config?.sport).id;
}

function input(id: string): HTMLInputElement | undefined {
  return dom[id] as HTMLInputElement | undefined;
}

export function renderDraftPlayerList(): void {
  const picker = dom.draftPlayerList as PlayerPicker | undefined;
  if (!picker) return;
  picker.rows = pickerRows(state.players, true);
  picker.countLabel = en.singleMatch.playersSelected;
  picker.empty = en.singleMatch.noPlayersInDB;
  picker.updateComplete.then(() => {
    (dom.btnFazerDraft as HTMLButtonElement).disabled = picker.selectedIds.length < 2;
  });
}

function draftTeam(side: DraftSide): DraftTeam {
  const t = draft.teams[side];
  const sport = sportId();
  return {
    name: t.name,
    players: t.players.map((p) => ({ id: p.id, name: p.nome, rating: getPlayerRating(p, sport) })),
    scorers: t.scorers,
    assists: t.assists,
  };
}

function renderDraftTeams(): void {
  const view = dom.draftTeamsResult as DraftTeams | undefined;
  if (!view) return;
  view.teamA = draftTeam('A');
  view.teamB = draftTeam('B');
  view.mvpId = draft.mvp;
  view.mvpName = draft.mvp ? playerName(draft.mvp) : '';
  view.requestUpdate(); // goals are changed in place
  dom.draftLabelA.textContent = draft.teams.A.name;
  dom.draftLabelB.textContent = draft.teams.B.name;
  dom.draftResultCard.style.display = draft.empty ? 'none' : 'block';
}

/** Adds one to (or takes one from) a side's typed score. */
function bumpScore(side: DraftSide, delta: number): void {
  const inp = input(side === 'A' ? 'draftScoreA' : 'draftScoreB');
  if (inp) inp.value = String(Math.max(0, (parseInt(inp.value || '0', 10) || 0) + delta));
}

function onDraft(): void {
  const picker = dom.draftPlayerList as PlayerPicker;
  const ids = picker.selectedIds;
  if (ids.length < 2) {
    showToast(en.toasts.selectAtLeast2Players, 'error');
    return;
  }
  const players = ids.map((id) => state.players.find((p) => p.id === id)).filter((p): p is Player => !!p);
  const { equipaA, equipaB } = balancedDraft(players, sportId());
  draft.start(
    input('draftNomeA')?.value.trim() || en.singleMatch.teamA,
    input('draftNomeB')?.value.trim() || en.singleMatch.teamB,
    equipaA,
    equipaB,
  );
  renderDraftTeams();
}

function onGoalAdd({ side, pid }: DraftGoal): void {
  const mates = draft.teams[side].players.filter((p) => p.id !== pid).map((p) => ({ id: p.id, label: p.nome }));
  openPickPlayerModal(en.singleMatch.pickAssistTitle, mates, en.singleMatch.noAssistLabel, (aid) => {
    draft.addGoal(side, pid, aid);
    bumpScore(side, 1);
    renderDraftTeams();
  });
}

function onGoalRemove({ side, pid }: DraftGoal): void {
  if (!draft.removeGoal(side, pid)) return;
  bumpScore(side, -1);
  renderDraftTeams();
}

function onMvp(): void {
  const all = [...draft.teams.A.players, ...draft.teams.B.players].map((p) => ({ id: p.id, label: p.nome }));
  openPickPlayerModal(en.singleMatch.pickMvpTitle, all, en.singleMatch.noMvpLabel, (pid) => {
    draft.mvp = pid;
    renderDraftTeams();
  });
}

/** Shows the "new match" or "history" sub-tab. */
function showSubtab(name: 'novo' | 'historico'): void {
  document.querySelectorAll<HTMLElement>('.singular-subtab').forEach((b) => b.classList.toggle('active', b.dataset.subtab === name));
  document.querySelectorAll<HTMLElement>('.singular-panel').forEach((p) => p.classList.toggle('active', p.id === `singular-${name}`));
  if (name === 'historico') renderSingularHistorico();
}

async function onSave(): Promise<void> {
  if (draft.empty) {
    showToast(en.toasts.runDraftFirst, 'error');
    return;
  }
  const scoreA = input('draftScoreA')?.value.trim() || '';
  const scoreB = input('draftScoreB')?.value.trim() || '';
  const { A, B } = draft.teams;
  const match: SingleMatch = {
    id: crypto.randomUUID(),
    data: new Date().toISOString(),
    nomeEquipaA: A.name,
    nomeEquipaB: B.name,
    equipaA: A.players.map((p) => p.id),
    equipaB: B.players.map((p) => p.id),
    scorersA: [...A.scorers],
    scorersB: [...B.scorers],
    assistsA: alignAssists(A.scorers, A.assists),
    assistsB: alignAssists(B.scorers, B.assists),
    resultado: scoreA !== '' && scoreB !== '' ? `${parseInt(scoreA, 10)}-${parseInt(scoreB, 10)}` : null,
  };
  if (draft.mvp) match.mvp = draft.mvp;

  state.jogosSingulares.push(match);
  await persistJogosSingulares();

  draft.reset();
  renderDraftTeams();
  const a = input('draftScoreA');
  const b = input('draftScoreB');
  if (a) a.value = '';
  if (b) b.value = '';
  (dom.draftPlayerList as PlayerPicker).clear();
  showToast(en.toasts.matchSavedToHistory, 'ok');
  showSubtab('historico');
}

function playerNames(ids: string[] | undefined): string[] {
  return (ids || []).map((pid) => state.players.find((p) => p.id === pid)?.nome || pid);
}

export function renderSingularHistorico(): void {
  const list = dom.singularHistoricoList as SingleMatchHistory | undefined;
  if (!list) return;
  list.cards = state.jogosSingulares.slice().reverse().map((m) => ({
    id: m.id,
    date: fmtTimestamp(m.data),
    teamA: m.nomeEquipaA,
    teamB: m.nomeEquipaB,
    playersA: playerNames(m.equipaA),
    playersB: playerNames(m.equipaB),
    result: m.resultado || '',
    mvp: m.mvp ? playerName(m.mvp) : '',
  }));
}

/** Wires the Single Match tab; called once at start-up. */
export function bindSingleMatchEvents(): void {
  document.querySelectorAll<HTMLElement>('.singular-subtab').forEach((btn) => {
    btn.addEventListener('click', () => showSubtab(btn.dataset.subtab === 'historico' ? 'historico' : 'novo'));
  });
  dom.draftPlayerList?.addEventListener('selection-change', (e) => {
    (dom.btnFazerDraft as HTMLButtonElement).disabled = (e as CustomEvent<string[]>).detail.length < 2;
  });
  dom.btnFazerDraft?.addEventListener('click', onDraft);
  dom.btnGuardarJogo?.addEventListener('click', () => { onSave(); });
  const teams = dom.draftTeamsResult;
  teams?.addEventListener('draft-goal-add', (e) => onGoalAdd((e as CustomEvent<DraftGoal>).detail));
  teams?.addEventListener('draft-goal-sub', (e) => onGoalRemove((e as CustomEvent<DraftGoal>).detail));
  teams?.addEventListener('draft-mvp', onMvp);
  dom.singularHistoricoList?.addEventListener('single-delete', (e) => {
    const id = (e as CustomEvent<string>).detail;
    openConfirm(en.singleMatch.deleteMatchTitle, en.singleMatch.deleteMatchPrompt, async () => {
      state.jogosSingulares = state.jogosSingulares.filter((j) => j.id !== id);
      await persistJogosSingulares();
      renderSingularHistorico();
    });
  });
}
````

## File: src/ui/toasts.ts
````typescript
import { fmtTimestamp } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Toasts and save status pills
// ---------------------------------------------------------------------------
let flashSavedTimer: number | undefined;

export type ToastType = 'ok' | 'error';

export function showToast(msg: string, type?: ToastType): void {
  const t = document.createElement('div');
  t.className = `toast${type === 'error' ? ' toast-error' : type === 'ok' ? ' toast-ok' : ''}`;
  t.textContent = msg;
  dom.toastRoot.appendChild(t);
  requestAnimationFrame(() => { t.classList.add('show'); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.remove(); }, 300);
  }, 3200);
}

export function flashSaved(): void {
  dom.savePill.textContent = en.common.savedCheck;
  dom.savePill.classList.remove('pill-error');
  dom.savePill.classList.add('pill-ok');
  clearTimeout(flashSavedTimer);
  flashSavedTimer = window.setTimeout(() => {
    dom.savePill.textContent = en.common.saved;
    dom.savePill.classList.remove('pill-ok');
  }, 1600);
}

export function flashError(): void {
  dom.savePill.textContent = en.common.error;
  dom.savePill.classList.add('pill-error');
}

export function flashBackup(isoTimestamp?: string): void {
  if (!isoTimestamp) return;
  dom.backupPill.textContent = `💾 ${en.common.backup} ${fmtTimestamp(isoTimestamp)}`;
  dom.backupPill.classList.add('pill-fresh');
}
````

## File: src/vite-env.d.ts
````typescript
/// <reference types="vite/client" />
````

## File: tests/core/playoffs.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import { buildPlayoffBracket, firstRoundIndex, playoffSeeds, advanceWinner, ROUND_CHAIN } from '../../src/core/playoffs.js';
import type { StandingsRow } from '../../src/types.js';

const seeds = (n: number) => Array.from({ length: n }, (_, i) => ({ idx: i * 10 }));
const row = (idx: number) => ({ idx, name: `T${idx}` }) as StandingsRow;

describe('firstRoundIndex', () => {
  it('starts 2, 4, 8 and 16 team brackets at the final, semis, quarters and round of 16', () => {
    expect([2, 4, 8, 16].map(firstRoundIndex)).toEqual([3, 2, 1, 0]);
  });

  it('rejects sizes that are not a power of two or are too big', () => {
    expect(firstRoundIndex(6)).toBeNull();
    expect(firstRoundIndex(32)).toBeNull();
  });
});

describe('buildPlayoffBracket', () => {
  it('builds semi-finals and a final for 4 teams, 1st against 4th', () => {
    const { games, rounds } = buildPlayoffBracket(4, seeds(4));
    expect(rounds.map((r) => r.jornada)).toEqual([ROUND_CHAIN[2].label, ROUND_CHAIN[3].label]);
    expect(games).toHaveLength(3);
    expect(games[0]).toMatchObject({ home: 0, away: 30, playoffMatchId: 'MF1', nextMatchId: 'F1_home', isPlayoff: true });
    expect(games[1]).toMatchObject({ home: 10, away: 20, playoffMatchId: 'MF2', nextMatchId: 'F1_away' });
    expect(games[2]).toMatchObject({ playoffMatchId: 'F1', nextMatchId: null });
    expect(typeof games[2].home).toBe('string');
  });

  it('builds 15 matches for 16 teams', () => {
    expect(buildPlayoffBracket(16, seeds(16)).games).toHaveLength(15);
  });

  it('returns nothing for an unsupported size or too few seeds', () => {
    expect(buildPlayoffBracket(6, seeds(6)).games).toEqual([]);
    expect(buildPlayoffBracket(8, seeds(4)).games).toEqual([]);
  });
});

describe('playoffSeeds', () => {
  it('alternates groups by position', () => {
    const groups = [{ standings: [row(1), row(2), row(3)] }, { standings: [row(4), row(5)] }];
    expect(playoffSeeds(groups, 2)?.map((s) => s.idx)).toEqual([1, 4, 2, 5]);
  });

  it('returns null when a group is too small', () => {
    expect(playoffSeeds([{ standings: [row(1)] }], 2)).toBeNull();
  });
});

describe('advanceWinner', () => {
  it('fills the slot of the next match once', () => {
    const { games } = buildPlayoffBracket(4, seeds(4));
    expect(advanceWinner(games, games[1], 20)).toBe(true);
    expect(games[2].away).toBe(20);
    expect(advanceWinner(games, games[1], 20)).toBe(false);
  });

  it('does nothing for the final', () => {
    const { games } = buildPlayoffBracket(2, seeds(2));
    expect(advanceWinner(games, games[0], 0)).toBe(false);
  });
});
````

## File: tests/core/schedule.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  bergerRounds,
  generateSchedule,
  buildExtraVolta,
  buildFirstRoundSeeding,
} from '../../src/core/schedule.js';

function pairKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join('-');
}

describe('bergerRounds', () => {
  it.each([4, 5, 6, 7, 8])('com %i equipas, cada par joga exatamente uma vez', (n) => {
    const rounds = bergerRounds(n);
    expect(rounds).toHaveLength(n % 2 === 0 ? n - 1 : n);

    const seen = new Set<string>();
    for (const r of rounds) {
      const inRound = new Set<number>();
      for (const [a, b] of r.pairs) {
        expect(inRound.has(a) || inRound.has(b)).toBe(false);
        inRound.add(a);
        inRound.add(b);
        const key = pairKey(a, b);
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
    expect(seen.size).toBe((n * (n - 1)) / 2);
  });

  it('com número ímpar, cada equipa folga exatamente uma vez', () => {
    const byes = bergerRounds(5).map((r) => r.bye);
    expect(byes.slice().sort()).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('generateSchedule', () => {
  it('a segunda volta inverte casa e fora', () => {
    const { schedule, roundsMeta } = generateSchedule([[0, 1, 2, 3]], 2);
    expect(schedule).toHaveLength(12);
    expect(roundsMeta).toHaveLength(6);
    const first = schedule.slice(0, 6).map((g) => `${g.home}-${g.away}`);
    const second = schedule.slice(6).map((g) => `${g.away}-${g.home}`);
    expect(second).toEqual(first);
  });

  it('mapeia os índices de cada grupo para as equipas reais', () => {
    const { schedule } = generateSchedule([[0, 2], [1, 3]], 1);
    expect(schedule).toEqual([
      { jornada: 1, home: 0, away: 2, group: 0 },
      { jornada: 1, home: 1, away: 3, group: 1 },
    ]);
  });
});

describe('volta extra', () => {
  it('acrescenta a volta no fim, espelhada, sem mexer nos jogos existentes', () => {
    const { schedule, roundsMeta } = generateSchedule([[0, 1, 2, 3]], 1);
    const { games, rounds } = buildExtraVolta(schedule, roundsMeta, 1);
    const full = generateSchedule([[0, 1, 2, 3]], 2);

    expect(games).toEqual(full.schedule.slice(schedule.length));
    expect(rounds).toEqual(full.roundsMeta.slice(roundsMeta.length));
  });

  it('a 3ª volta repete a orientação da 1ª', () => {
    const two = generateSchedule([[0, 1, 2, 3, 4]], 2);
    const three = generateSchedule([[0, 1, 2, 3, 4]], 3);
    const { games, rounds } = buildExtraVolta(two.schedule, two.roundsMeta, 2);

    expect(games).toEqual(three.schedule.slice(two.schedule.length));
    expect(rounds).toEqual(three.roundsMeta.slice(two.roundsMeta.length));
  });
});

describe('eliminatórias - seeding', () => {
  const seeded = (n: number) => buildFirstRoundSeeding(n).map((p) => p.map((s) => s + 1));

  it('emparelha os seeds no padrão de bracket', () => {
    expect(seeded(2)).toEqual([[1, 2]]);
    expect(seeded(4)).toEqual([[1, 4], [2, 3]]);
    expect(seeded(8)).toEqual([[1, 8], [4, 5], [2, 7], [3, 6]]);
    expect(seeded(16)).toEqual([
      [1, 16], [8, 9], [4, 13], [5, 12], [2, 15], [7, 10], [3, 14], [6, 11],
    ]);
  });
});
````

## File: tests/rules/firebase.json
````json
{
  "emulators": {
    "database": { "port": 9100 }
  }
}
````

## File: tests/i18n.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { en } from '../src/i18n/en.js';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(js|ts)$/.test(name) ? [path] : [];
  });
}

describe('en strings', () => {
  it('every en.section.key used in src exists', () => {
    const table = en as unknown as Record<string, Record<string, unknown>>;
    const missing = new Set<string>();
    for (const file of sourceFiles(join(__dirname, '../src'))) {
      for (const [ref, section, key] of readFileSync(file, 'utf8').matchAll(/\ben\.(\w+)\.(\w+)/g)) {
        if (table[section]?.[key] === undefined) missing.add(`${ref} (${file.split('/src/')[1]})`);
      }
    }
    expect([...missing]).toEqual([]);
  });
});
````

## File: tests/tennis.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import { tennis } from '../src/sports/tennis/Tennis.js';
import { getSport, listSports } from '../src/sports/registry.js';
import { RacketSport } from '../src/sports/RacketSport.js';
import type { Config, MatchResult } from '../src/types.js';

const config = (extra: Partial<Config> = {}): Config => ({
  nome: 'Tennis', numEquipas: 4, numGrupos: 1, numVoltas: 1,
  pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0, bonusGoleada: 0, golosGoleada: 99,
  mataMata: false, numPlayoffTeams: 2, sport: 'tennis', ...extra,
});
const F = tennis.format(config());

/** Plays games in order: 'h' for home, 'a' for away. */
function play(games: string, cfg = config()): MatchResult | undefined {
  let res: MatchResult | undefined;
  for (const g of games) res = tennis.addPoint(res, g === 'h' ? 'home' : 'away', cfg);
  return res;
}

describe('tennis', () => {
  it('is registered as a racket sport with its own ratings and no jersey numbers', () => {
    expect(getSport('tennis')).toBe(tennis);
    expect(listSports()).toContain(tennis);
    expect(tennis).toBeInstanceOf(RacketSport);
    expect(tennis.usesJerseyNumbers).toBe(false);
    expect(Object.keys(tennis.ratingAttributes())).toEqual(['serve', 'return', 'forehand', 'backhand', 'volley', 'fitness']);
  });

  it('defaults to best of 3 sets of 6 games with a full deciding set', () => {
    expect(F).toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: false });
  });

  it('plays the deciding set as a normal set, not a super tie-break', () => {
    expect(tennis.isSuperTieBreak(2, F)).toBe(false);
    expect(tennis.setWinner({ home: 10, away: 8 }, 2, F)).toBe('home');
    expect(tennis.setWinner({ home: 7, away: 6 }, 2, F)).toBe('home');
    expect(tennis.setWinner({ home: 6, away: 6 }, 2, F)).toBeNull();
  });

  it('can use a super tie-break or best of 5 when the tournament says so', () => {
    expect(tennis.format(config({ setFormat: { sets: 3, gamesPerSet: 6, superTieBreak: true } })).superTieBreak).toBe(true);
    const five = tennis.format(config({ setFormat: { sets: 5, gamesPerSet: 6, superTieBreak: false } }));
    expect(tennis.matchWinner(tennis.parseSets('6-4 6-4'), five)).toBeNull();
    expect(tennis.matchWinner(tennis.parseSets('6-4 6-4 6-4'), five)).toBe('home');
  });

  it('scores a three-set match game by game and stops once it is decided', () => {
    const res = play('hhhhhh' + 'aaaaaa' + 'hhhhhaaaaahh');
    expect(typeof res === 'object' && res.score).toBe('6-0 0-6 7-5');
    expect(tennis.matchWinner(tennis.setsOf(res), F)).toBe('home');
    const after = tennis.addPoint(res, 'away', config());
    expect(after.score).toBe('6-0 0-6 7-5');
  });

  it('counts every game of the deciding set in the standings', () => {
    expect(tennis.gamesOf(tennis.parseSets('6-4 3-6 7-6'), F)).toEqual({ home: 16, away: 16 });
  });
});
````

## File: tests/utils.test.js
````javascript
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/state.js', () => ({ state: { teams: [] } }));

const { escapeHtml, safeColor } = await import('../src/utils.js');

describe('escapeHtml', () => {
  it('escapa os caracteres especiais de HTML', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;'
    );
  });

  it('converte valores que não são texto', () => {
    expect(escapeHtml(7)).toBe('7');
  });
});

describe('safeColor', () => {
  it('aceita cores hex', () => {
    expect(safeColor('#2f7a4f')).toBe('#2f7a4f');
    expect(safeColor('#FFF')).toBe('#FFF');
  });

  it('substitui qualquer outro valor pela cor por defeito', () => {
    expect(safeColor('red; background:url(https://x)')).toBe('#2F7A4F');
    expect(safeColor(undefined)).toBe('#2F7A4F');
  });
});
````

## File: .gitattributes
````
# Enforce LF for shell scripts to prevent Docker "no such file or directory" on Windows
*.sh text eol=lf
*.mjs text eol=lf
````

## File: .gitignore
````
### Windows
# Windows thumbnail cache files
Thumbs.db

# Folder config file
[Dd]esktop.ini

# Recycle Bin used on file shares
$RECYCLE.BIN/

# Windows shortcuts
*.lnk
.vscode/settings.json

# Node.js
node_modules/

# Vite build output
dist/

# Local env (Firebase config and delete password)
.env
.env.*
!.env.example

# Emulador do Firebase
*-debug.log
.idea
````

## File: vite.config.js
````javascript
import { defineConfig } from 'vite';

export default defineConfig({
  // The base URL for the repository on GitHub Pages
  base: '/sports-tournament/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
````

## File: css/partilha.css
````css
/* ---------------------------------------------------------------------
   Assistências, MVP e partilha
   --------------------------------------------------------------------- */
.stats-half {
  grid-column: 1 / -1;
}

.fixture-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.mini-btn {
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 14px;
  min-height: var(--tap);
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: border-color var(--quick) ease, transform var(--press) var(--ease-out);
}

@media (hover: hover) {
  .mini-btn:hover {
    border-color: var(--gold);
  }
}

.mini-btn:active {
  transform: scale(.97);
}

.draft-mvp-btn {
  grid-column: 1 / -1;
  justify-self: center;
  border: 1px solid var(--line);
  color: var(--ink);
}

.historico-mvp {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--gold-dark);
  margin-top: 4px;
}

/* Botão só com ícone no canto do título (ex.: partilhar classificação) */
.icon-action {
  margin-left: auto;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--paper);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform .1s ease, background .2s ease;
}

.icon-action:hover {
  background: var(--line);
}

.icon-action:active {
  transform: scale(.94);
}
````

## File: css/sessao.css
````css
/* ---------------------------------------------------------------------
   Sessão e perfis
   --------------------------------------------------------------------- */
body:not([data-role="admin"]):not([data-role="master"]) [data-requires="admin"] {
  display: none !important;
}

body:not([data-role="master"]) [data-requires="master"] {
  display: none !important;
}

body[data-role="admin"] [data-hide-for="admin"],
body[data-role="master"] [data-hide-for="admin"] {
  display: none !important;
}

.readonly-note {
  color: var(--ink-soft);
}

/* Quem não é admin só vê as equipas do calendário atual */
body:not([data-role="admin"]):not([data-role="master"]) .team-row-inactive {
  display: none;
}

@media (max-width: 600px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }
}

.team-row .input {
  min-width: 0;
}

[data-theme="dark"] .player-attr-val {
  color: var(--pitch-500);
}

[data-theme="dark"] .player-stats-btn {
  color: var(--ink) !important;
}

.team-row .input:disabled,
.team-color-picker:disabled {
  opacity: 1;
  cursor: default;
  background: transparent;
}

.auth-btn {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.user-row,
.log-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.user-row:last-child,
.log-row:last-child {
  border-bottom: none;
}

.user-row__info,
.log-row__info {
  flex: 1;
  min-width: 0;
}

.user-row__name,
.log-row__acao {
  font-weight: 600;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.user-row__meta,
.log-row__meta {
  font-size: 12px;
  color: var(--ink-soft);
  overflow-wrap: anywhere;
}

.user-row select {
  flex-shrink: 0;
  width: auto;
}
````

## File: docker/firebase/Dockerfile
````dockerfile
FROM eclipse-temurin:21-jre-alpine

# Install Node.js, npm, bash, and curl
RUN apk add --no-cache nodejs npm bash curl

# Install firebase-tools
RUN npm install -g firebase-tools@15.5.0

# Pre-download database emulator JAR to speed up startup
RUN firebase setup:emulators:database

WORKDIR /app

# Expose Firebase Emulator Suite ports:
# 9000: Realtime Database
# 9099: Authentication
# 4000: Emulator Suite UI
# 4400: Emulator Hub
EXPOSE 9000 9099 4000 4400

COPY docker/firebase/seed.mjs /usr/local/bin/seed.mjs
COPY docker/firebase/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
````

## File: docker/firebase/entrypoint.sh
````bash
#!/bin/sh
set -e

DATA_DIR="/data"
PROJECT_ID="${FIREBASE_PROJECT_ID:-demo-torneio}"

echo "=================================================="
echo " Starting Firebase Emulator Suite"
echo " Project: ${PROJECT_ID}"
echo " Database Emulator:  http://0.0.0.0:9000"
echo " Auth Emulator:      http://0.0.0.0:9099"
echo " Emulator Suite UI:  http://0.0.0.0:4000"
echo "=================================================="

# Run seed script in the background once emulator is online
(
  for i in $(seq 1 30); do
    if curl -s http://127.0.0.1:9000/ > /dev/null 2>&1 && curl -s http://127.0.0.1:9099/ > /dev/null 2>&1; then
      sleep 1
      if [ -f "/usr/local/bin/seed.mjs" ]; then
        node /usr/local/bin/seed.mjs || true
      fi
      break
    fi
    sleep 1
  done
) &

CMD="firebase emulators:start --project ${PROJECT_ID}"

# If data folder exists and contains export metadata, import it
if [ -f "${DATA_DIR}/firebase-export-metadata.json" ]; then
  echo "Found existing export metadata. Importing data from ${DATA_DIR}..."
  CMD="${CMD} --import=${DATA_DIR}"
else
  echo "No existing data found in ${DATA_DIR}. Starting clean."
fi

# Configure export on exit so state is preserved between container restarts
mkdir -p "${DATA_DIR}"
CMD="${CMD} --export-on-exit=${DATA_DIR}"

# Execute emulators
exec ${CMD} "$@"
````

## File: docker/firebase/seed.mjs
````javascript
// Seeds the dev accounts (master, admin, user) into the Auth and Database emulators
const DB_HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST || '127.0.0.1:9000';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'demo-torneio';
// The emulator loads database.rules.json into the project's default instance
const DB_NS = process.env.FIREBASE_DATABASE_NAMESPACE || `${PROJECT_ID}-default-rtdb`;

// Keep in sync with DEV_USERS in src/firebase.ts
const USERS = [
  { email: 'master@torneio.local', password: 'password123', displayName: 'Master Admin', role: 'master', admin: null },
  { email: 'admin@torneio.local', password: 'password123', displayName: 'Football Admin', role: 'admin', admin: { football: true } },
  { email: 'user@torneio.local', password: 'password123', displayName: 'Test User', role: 'user', admin: null },
];

async function authCall(method, body) {
  const res = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:${method}?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Creates the account, or signs in to get its uid when it already exists
async function accountId(u) {
  const created = await authCall('signUp', {
    email: u.email,
    password: u.password,
    displayName: u.displayName,
    returnSecureToken: true,
  });
  if (created.localId) return created.localId;
  if (created.error?.message !== 'EMAIL_EXISTS') throw new Error(JSON.stringify(created.error));
  const signedIn = await authCall('signInWithPassword', { email: u.email, password: u.password, returnSecureToken: true });
  if (!signedIn.localId) throw new Error(JSON.stringify(signedIn.error));
  return signedIn.localId;
}

async function seed() {
  console.log(`[Seed] Seeding dev users (database namespace ${DB_NS})...`);
  let failed = false;
  for (const u of USERS) {
    try {
      const uid = await accountId(u);
      // "Bearer owner" is the emulator's admin token: the rules only let a master set roles
      const res = await fetch(`http://${DB_HOST}/users/${uid}.json?ns=${DB_NS}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
        body: JSON.stringify({ nome: u.displayName, email: u.email, role: u.role, admin: u.admin }),
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      console.log(`[Seed] Seeded ${u.displayName} (${u.role}) -> ${uid}`);
    } catch (err) {
      failed = true;
      console.warn(`[Seed] Could not seed ${u.email}:`, err);
    }
  }
  console.log(failed ? '[Seed] Finished with errors.' : '[Seed] Dev users seeded.');
}

seed();
````

## File: src/components/AllTimeStats.ts
````typescript
// ---------------------------------------------------------------------------
// <all-time-stats> — titles won and the all-time player table (History tab)
// ---------------------------------------------------------------------------
// Every sport has matches and wins; the sport adds its own columns
// (`Sport.allTimeColumns()`: goals, assists and MVP in football).
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { PlayerStats } from '../types.js';
import type { AllTimeColumn, PlayerRecord } from '../sports/Sport.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

/** One player of the all-time table. */
export interface AllTimeRow extends PlayerStats, PlayerRecord {
  pid: string;
  name: string;
}

/** Tournaments won, per champion team name. */
export type TitleCount = Record<string, number>;

export class AllTimeStats extends LightElement {
  static properties = {
    rows: { attribute: false },
    titles: { attribute: false },
    columns: { attribute: false },
    limit: { type: Number },
  };

  /** Players, best first. */
  declare rows: AllTimeRow[];
  declare titles: TitleCount;
  declare columns: AllTimeColumn[];
  declare limit: number;

  constructor() {
    super();
    this.rows = [];
    this.titles = {};
    this.columns = [];
    this.limit = 20;
  }

  render(): TemplateResult {
    return html`${this.titlesTemplate()}${this.rows.length ? this.tableTemplate() : html`<p class="empty">${en.historyTab.noStatsYet}</p>`}`;
  }

  private titlesTemplate(): TemplateResult | typeof nothing {
    const names = Object.keys(this.titles).sort((a, b) => this.titles[b] - this.titles[a]);
    if (!names.length) return nothing;
    return html`<div class="historico-titulos">${names.map((n) => html`<span class="historico-titulo">🏆 ${n} × ${this.titles[n]}</span>`)}</div>`;
  }

  private tableTemplate(): TemplateResult {
    return html`
      <table class="standings-table historico-sempre">
        <thead><tr>
          <th style="text-align:left;">${en.historyTab.playerCol}</th>
          <th title=${en.historyTab.matchesTitle}>${en.historyTab.matchesTitle}</th>
          <th title=${en.historyTab.winsTitle}>${en.historyTab.winsTitle}</th>
          ${this.columns.map((c) => html`<th title=${c.title}>${c.label}</th>`)}
        </tr></thead>
        <tbody>${this.rows.slice(0, this.limit).map((r) => html`
          <tr>
            <td class="team-cell">${r.name}</td><td class="num">${r.played}</td><td class="num">${r.won}</td>
            ${this.columns.map((c) => html`<td class="num">${r[c.key] ?? 0}</td>`)}
          </tr>`)}
        </tbody>
      </table>`;
  }
}

if (!customElements.get('all-time-stats')) customElements.define('all-time-stats', AllTimeStats);

declare global {
  interface HTMLElementTagNameMap {
    'all-time-stats': AllTimeStats;
  }
}
````

## File: src/components/LightElement.ts
````typescript
// ---------------------------------------------------------------------------
// LightElement — base class of the app's Lit components
// ---------------------------------------------------------------------------
// Renders in the light DOM, so the components keep the app's CSS (css/*.css
// and the mobile tweaks) instead of copying it into each one. Like a Blazor
// component without CSS isolation: properties in, events out.
import { LitElement } from 'lit';

export abstract class LightElement extends LitElement {
  /**
   * CSS `display` of the host element. `contents` makes the children direct
   * items of the parent's grid or flex layout (e.g. cards in `.stats-grid`);
   * `block` is only applied when the page's CSS leaves the tag inline.
   */
  protected hostDisplay: 'block' | 'contents' = 'block';

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // A class on the tag (e.g. `.torneios-grid`) may already set its display
    if (this.hostDisplay === 'contents' || getComputedStyle(this).display === 'inline') {
      this.style.display = this.hostDisplay;
    }
  }

  /** Sends a bubbling event to the controller in src/ui/ (like a Blazor EventCallback). */
  protected emit<T>(name: string, detail?: T): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}
````

## File: src/components/rounds.ts
````typescript
// ---------------------------------------------------------------------------
// Rounds of the schedule, as the schedule and results lists show them
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { GAME_STATUS } from '../types.js';
import type { GameStatus, Match, MatchResult, RoundMeta } from '../types.js';
import { en } from '../i18n/en.js';

export interface RoundGame {
  game: Match;
  /** Index of the match in the schedule (the key of its result). */
  gi: number;
}

export interface Round {
  title: string;
  games: RoundGame[];
  /** Team resting this round (odd number of teams), if any. */
  bye: number | string | null;
}

/** Groups the schedule by round, in the order of `roundsMeta`. */
export function groupRounds(schedule: Match[], roundsMeta: RoundMeta[]): Round[] {
  const byRound = new Map<string, RoundGame[]>();
  schedule.forEach((game, gi) => {
    const key = String(game.jornada);
    if (!byRound.has(key)) byRound.set(key, []);
    byRound.get(key)!.push({ game, gi });
  });
  return roundsMeta.map((rm) => ({
    title: typeof rm.jornada === 'number' ? en.schedule.roundHead(rm.jornada) : String(rm.jornada),
    games: byRound.get(String(rm.jornada)) || [],
    bye: rm.bye ?? null,
  }));
}

/** Status of a result; only known values are accepted (results come from Firebase). */
export function statusOf(res: MatchResult | undefined): GameStatus {
  const status = res && typeof res === 'object' ? res.status : undefined;
  return status === GAME_STATUS.DECORRER || status === GAME_STATUS.TERMINADO ? status : GAME_STATUS.AGENDADO;
}

const STATUS_LABELS: Record<GameStatus, string> = {
  [GAME_STATUS.AGENDADO]: en.results.statusScheduled,
  [GAME_STATUS.DECORRER]: en.results.statusInProgress,
  [GAME_STATUS.TERMINADO]: en.results.statusFinished,
};

/**
 * The status pill; clicking it moves the match to the next status. Without
 * `onClick` (a profile that cannot change results) it is only a label.
 */
export function statusBadge(status: GameStatus, onClick?: (e: Event) => void): TemplateResult {
  if (!onClick) return html`<span class="status-badge status-${status}">${STATUS_LABELS[status]}</span>`;
  return html`<button class="status-badge status-${status}" title=${en.results.changeStatusTitle}
    @click=${onClick}>${STATUS_LABELS[status]}</button>`;
}
````

## File: src/components/StatsTable.ts
````typescript
// ---------------------------------------------------------------------------
// <stats-table> — player leaderboards, one card per stat of the sport
// ---------------------------------------------------------------------------
// Light DOM with `display: contents`, so each card is a direct item of the
// stats grid next to the summary cards, styled by the app's CSS.
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { PlayerStatColumn, Sport } from '../sports/Sport.js';
import type { PlayerStats } from '../types.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';

export interface PlayerInfo {
  name: string;
  team: string;
}

export class StatsTable extends LightElement {
  static properties = {
    sport: { attribute: false },
    tally: { attribute: false },
    players: { attribute: false },
    limit: { type: Number },
  };

  declare sport: Sport | null;
  /** Totals per player id, from Sport.tallyPlayerStats. */
  declare tally: Record<string, PlayerStats>;
  /** Name and team per player id. */
  declare players: Record<string, PlayerInfo>;
  declare limit: number;

  constructor() {
    super();
    this.sport = null;
    this.tally = {};
    this.players = {};
    this.limit = 10;
  }

  protected hostDisplay = 'contents' as const;

  render(): TemplateResult {
    const columns = this.sport ? this.sport.playerStatColumns() : [];
    return html`${columns.map((c) => this.cardTemplate(c))}`;
  }

  /** Top players for one stat, highest first. */
  leaders(key: PlayerStatColumn['key']): string[] {
    return Object.keys(this.tally)
      .filter((pid) => this.tally[pid][key] > 0)
      .sort((a, b) => this.tally[b][key] - this.tally[a][key])
      .slice(0, this.limit);
  }

  private cardTemplate(column: PlayerStatColumn): TemplateResult {
    const rows = this.leaders(column.key);
    return html`
      <div class="card stats-half">
        <div class="section-title">${column.title}</div>
        ${rows.length ? rows.map((pid) => this.rowTemplate(pid, column)) : html`<p class="empty">${column.empty}</p>`}
      </div>`;
  }

  private rowTemplate(pid: string, column: PlayerStatColumn): TemplateResult {
    const info = this.players[pid] || { name: en.common.unknownPlayer, team: en.common.noTeam };
    return html`<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${this.tally[pid][column.key]}</strong> ${column.unit} — ${info.name} <span style="color:var(--ink-faint); font-size:13px;">(${info.team})</span></div>`;
  }
}

if (!customElements.get('stats-table')) customElements.define('stats-table', StatsTable);

declare global {
  interface HTMLElementTagNameMap {
    'stats-table': StatsTable;
  }
}
````

## File: src/components/templates.ts
````typescript
// ---------------------------------------------------------------------------
// Small Lit templates shared by several components
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { Match, Team } from '../types.js';
import { safeColor } from '../utils.js';

/** A coloured dot, like a team crest in the tables. */
export function colorDot(color: string, size = 10): TemplateResult {
  return html`<span style=${styleMap({
    display: 'inline-block', width: `${size}px`, height: `${size}px`, borderRadius: '50%',
    backgroundColor: safeColor(color), marginRight: '6px', boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  })}></span>`;
}

/**
 * Team name with its colour dot. A string instead of an index is a placeholder
 * (e.g. "Winner QF1", a playoff slot not decided yet) and is shown in italics.
 */
export function teamLabel(teams: (Team | undefined)[] | null | undefined, idx: number | string): TemplateResult {
  if (typeof idx === 'string') {
    return html`<span style="color:var(--ink-faint); font-style:italic; font-size:12px;">${idx}</span>`;
  }
  const team = teams?.[idx];
  const name = (team && team.name) || `Team ${idx + 1}`;
  return html`<span style="display:inline-flex; align-items:center; white-space:nowrap;">${colorDot(team ? team.color : '#2F7A4F')}${name}</span>`;
}

/** A match side: the team label, or both players of a rotating pair ("Ana / Rui", no dot). */
export function sideLabel(teams: (Team | undefined)[] | null | undefined, game: Match, side: 'home' | 'away'): TemplateResult {
  const partner = game.partners?.[side];
  const first = game[side];
  if (typeof partner !== 'number' || typeof first !== 'number') return teamLabel(teams, first);
  const name = (idx: number) => teams?.[idx]?.name || `Player ${idx + 1}`;
  return html`<span class="pair-label">${name(first)} / ${name(partner)}</span>`;
}
````

## File: src/sports/football/FootballScore.ts
````typescript
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
````

## File: src/sports/padel/PadelScore.ts
````typescript
// ---------------------------------------------------------------------------
// <padel-score> — the padel match panel (see RacketScore)
// ---------------------------------------------------------------------------
import { RacketScore } from '../RacketScore.js';
import { padel } from './Padel.js';

export class PadelScore extends RacketScore {
  protected readonly sport = padel;
}

if (!customElements.get('padel-score')) customElements.define('padel-score', PadelScore);

declare global {
  interface HTMLElementTagNameMap {
    'padel-score': PadelScore;
  }
}
````

## File: src/sports/RacketScore.ts
````typescript
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
````

## File: src/ui/admin.ts
````typescript
import { html, render } from 'lit';
import { state } from '../state.js';
import { roleLabel } from '../permissions.js';
import { listSports } from '../sports/registry.js';
import type { UserProfile } from '../types.js';
import type { UserList } from '../components/UserList.js';
import type { ActivityLog, LogEntry } from '../components/ActivityLog.js';
import '../components/UserList.js';
import '../components/ActivityLog.js';
import { dom } from './dom.js';
import { switchTab } from './navigation.js';
import { renderTeams, renderSquadList } from './teams.js';
import { renderPlayersList } from './players.js';
import { renderCalendar, renderResults } from './schedule.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Session and administration
// ---------------------------------------------------------------------------

/** The signed-in user, as Firebase Auth gives it. */
export interface AuthUser {
  displayName?: string | null;
  email?: string | null;
}

/** Updates the account button and the data-role CSS uses to show or hide controls. */
export function renderAuth(user: AuthUser | null, role: string | null, userAdmin: Record<string, boolean> | null = null): void {
  const sport = state.meta?.sport || state.config?.sport || 'football';
  let effectiveRole = 'viewer';
  if (user) {
    if (role === 'master') effectiveRole = 'master';
    else if (role === 'admin') effectiveRole = userAdmin && userAdmin[sport] === true ? 'admin' : 'user';
    else if (role === 'user') effectiveRole = 'user';
  }

  document.body.dataset.role = effectiveRole;
  document.body.dataset.master = role === 'master' ? 'true' : 'false';

  // Editable fields and empty list messages depend on permissions
  if (state.config) { renderTeams(); renderSquadList(); renderPlayersList(); renderCalendar(); renderResults(); }

  const btn = dom.btnConta;
  if (btn) {
    if (user) {
      const name = (user.displayName || user.email || '').split(' ')[0];
      const label = roleLabel(role, userAdmin);
      // On mobile only the avatar icon shows; the name and role are in the title
      render(html`👤<span class="auth-label"> ${name} · ${label}</span>`, btn);
      btn.title = `${name} · ${label} — ${en.header.signOut}`;
    } else {
      render(html`🔑 ${en.header.signIn}`, btn);
      btn.title = en.header.signInWithGoogle;
    }
  }

  // If the active tab became hidden by the new permissions, go back to the dashboard
  const active = document.querySelector('.tab.active[data-requires]');
  if (active && getComputedStyle(active).display === 'none') switchTab('dashboard');
}

/**
 * @param users - every signed-in user
 * @param selfUid - the master cannot change their own role
 */
export function renderUsers(users: UserProfile[], selfUid: string): void {
  const list = dom.usersList as UserList | undefined;
  if (!list) return;
  list.sports = listSports().map((s) => ({ id: s.id, label: `${s.icon} ${s.name}` }));
  list.selfUid = selfUid;
  list.users = users;
}

/** @param entries - newest first */
export function renderLog(entries: LogEntry[]): void {
  const log = dom.logList as ActivityLog | undefined;
  if (log) log.entries = entries;
}
````

## File: src/ui/schedule.ts
````typescript
import { state } from '../state.js';
import { getSport } from '../sports/registry.js';
import type { Sport } from '../sports/Sport.js';
import type { ScheduleList } from '../components/ScheduleList.js';
import type { ResultsList } from '../components/ResultsList.js';
import '../components/ScheduleList.js';
import '../components/ResultsList.js';
import { dom, isAdminView } from './dom.js';
import { refreshGameModal } from './match.js';

// ---------------------------------------------------------------------------
// Schedule and Results tabs (<schedule-list>, <results-list>)
// ---------------------------------------------------------------------------
// Their events (open-match, status-click, score-step, score-commit) are
// handled in main.js, which saves the result. Only admins of the sport get
// the controls (the same profiles the match window lets edit).

function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

export function renderCalendar(): void {
  dom.calendarActions.style.display = state.schedule.length ? 'block' : 'none';
  const list = dom.calendarList as ScheduleList;
  list.schedule = state.schedule;
  list.roundsMeta = state.roundsMeta;
  list.results = state.results;
  list.teams = state.teams || [];
  list.sport = currentSport();
  list.config = state.config;
  list.editable = isAdminView();
  list.requestUpdate(); // the state is changed in place
}

export function renderResults(): void {
  const list = dom.resultsList as ResultsList;
  list.schedule = state.schedule;
  list.roundsMeta = state.roundsMeta;
  list.results = state.results;
  list.teams = state.teams || [];
  list.sport = currentSport();
  list.config = state.config;
  list.editable = isAdminView();
  list.requestUpdate(); // the state is changed in place
  refreshGameModal();
}
````

## File: src/ui/standings.ts
````typescript
import { state } from '../state.js';
import { prefersReducedMotion } from '../utils.js';
import { standingsOrder, rankMoves } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import { StandingsTable } from '../components/StandingsTable.js';
import type { GroupStandings } from '../types.js';
import { dom } from './dom.js';

// ---------------------------------------------------------------------------
// Standings tab (<standings-table>)
// ---------------------------------------------------------------------------
// The arrows show places gained or lost since the standings were last seen,
// and opening the tab replays the change: the old table holds for a moment
// and then the teams slide to their new places.
const STANDINGS_HOLD = 600;

interface Seen {
  groups: GroupStandings[];
  moves: Map<string, number>;
  key: string;
}

let seen: Seen | null = null; // last shown with the tab visible
let seenOrder: Map<string, { g: number; r: number }> | null = null;
let standingsMoves = new Map<string, number>();
let lastGroupsData: GroupStandings[] | null = null;
let replayTimer: number | undefined;

function standingsTable(): StandingsTable {
  let table = dom.standingsWrapper.querySelector('standings-table');
  if (!table) {
    table = new StandingsTable();
    dom.standingsWrapper.replaceChildren(table);
  }
  table.sport = getSport(state.meta?.sport);
  table.config = state.config;
  table.teams = state.teams || [];
  return table;
}

function noteStandingsSeen(groupsData: GroupStandings[]): void {
  const order = standingsOrder(groupsData);
  const moves = rankMoves(seenOrder, order);
  if (moves.size) standingsMoves = moves;
  seenOrder = order;
}

function snapshot(groups: GroupStandings[]): Seen {
  const moves = standingsMoves;
  return { groups, moves, key: JSON.stringify([groups, [...moves]]) };
}

export function renderStandingsWrapper(groupsData: GroupStandings[]): void {
  lastGroupsData = groupsData;
  clearTimeout(replayTimer);
  const visible = !!dom.standingsWrapper.offsetParent;
  if (visible) noteStandingsSeen(groupsData);
  standingsTable().show(groupsData, standingsMoves, 450);
  if (visible) seen = snapshot(groupsData);
}

export function replayStandings(): void {
  if (!dom.standingsWrapper || !lastGroupsData) return;
  clearTimeout(replayTimer);
  const previous = seen;
  noteStandingsSeen(lastGroupsData);
  const current = snapshot(lastGroupsData);
  seen = current;
  const table = standingsTable();
  if (previous === null || previous.key === current.key || prefersReducedMotion()) {
    table.show(current.groups, current.moves, 0);
    return;
  }
  table.show(previous.groups, previous.moves, 0);
  replayTimer = window.setTimeout(() => table.show(current.groups, current.moves, 800), STANDINGS_HOLD);
}
````

## File: src/ui/teams.ts
````typescript
import { html, render } from 'lit';
import { state, MAX_TEAMS } from '../state.js';
import { getTeamName } from '../utils.js';
import { getPlayerRating } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import type { Sport } from '../sports/Sport.js';
import type { Player } from '../types.js';
import type { TeamsEditor } from '../components/TeamsEditor.js';
import type { SquadList } from '../components/SquadList.js';
import type { PickerRow } from '../components/PlayerPicker.js';
import '../components/TeamsEditor.js';
import '../components/SquadList.js';
import '../components/PlayerPicker.js';
import { dom, isAdminView } from './dom.js';
import { openDialog, setConfirmEnabled } from './modals.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Teams and Squads tabs (<teams-editor>, <squad-list>)
// ---------------------------------------------------------------------------
// Their events (team-change, squad-remove, player-stats) are handled in main.js.

function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

function byName(a: Player, b: Player): number {
  return a.nome.localeCompare(b.nome);
}

export function renderTeams(): void {
  const editor = dom.teamsList as TeamsEditor;
  editor.teams = state.teams || [];
  editor.slots = MAX_TEAMS;
  editor.activeCount = state.scheduleTeamCount;
  editor.showGroups = (state.config?.numGrupos || 1) > 1;
  editor.editable = isAdminView();
  editor.requestUpdate(); // the teams are changed in place
}

/** The team whose squad is shown, or '' before there are teams. */
function selectedTeam(): string {
  return (dom.squadTeamSelect as HTMLSelectElement).value;
}

export function renderSquadsDropdown(): void {
  const select = dom.squadTeamSelect as HTMLSelectElement;
  const previous = select.value;
  const teams = Array.from({ length: state.scheduleTeamCount }, (_, i) => i);
  render(html`${teams.map((i) => html`<option value=${i}>${getTeamName(i)}</option>`)}`, select);
  if (previous && teams.includes(Number(previous))) select.value = previous;
  renderSquadList();
}

export function renderSquadList(): void {
  const list = dom.squadList as SquadList;
  const tIdx = selectedTeam();
  const sport = currentSport();
  const squad = tIdx ? state.squads?.[Number(tIdx)] || [] : [];
  const sorted = squad.slice().sort((a, b) => (sport.usesJerseyNumbers ? Number(a.num) - Number(b.num) : a.name.localeCompare(b.name)));
  list.teamSelected = !!tIdx;
  list.numbered = sport.usesJerseyNumbers;
  list.editable = isAdminView();
  list.rows = sorted.map((p) => {
    const player = state.players.find((pl) => pl.id === p.id);
    return { id: p.id, num: p.num, name: p.name, rating: player ? getPlayerRating(player, sport.id) : null };
  });
}

/** The players not yet in the selected squad, in the "add player" dropdown. */
export function renderSquadPlayerFromDBDropdown(): void {
  const select = dom.squadPlayerFromDB as HTMLSelectElement | undefined;
  if (!select) return;
  const tIdx = selectedTeam();
  const inSquad = new Set((tIdx ? state.squads?.[Number(tIdx)] || [] : []).map((p) => p.id));
  const sport = currentSport().id;
  const free = state.players.filter((p) => !inSquad.has(p.id)).sort(byName);
  render(html`<option value="">${en.squads.selectPlayerPlaceholder}</option>${free.map((p) =>
    html`<option value=${p.id}>${p.nome} (★ ${getPlayerRating(p, sport).toFixed(1)})</option>`)}`, select);
  select.value = '';
}

/** Rows of a player picker for the tournament's sport, sorted by name. */
export function pickerRows(players: Player[], withTeam = false): PickerRow[] {
  const sport = currentSport().id;
  return players.slice().sort(byName).map((p) => ({
    id: p.id,
    name: p.nome,
    rating: getPlayerRating(p, sport),
    badge: withTeam && p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : undefined,
  }));
}

/**
 * Asks which players to draw into pairs (two per team, balanced by rating).
 * @param onDraw - receives the chosen player ids.
 */
export function openDrawPairsModal(onDraw: (ids: string[]) => void): void {
  const needed = state.scheduleTeamCount * 2;
  openChoosePlayersModal(needed, {
    title: en.squads.drawPairsTitle,
    note: en.squads.drawPairsNote(needed),
    button: en.squads.drawPairsButton,
  }, onDraw);
}

/** Americano / Mexicano: picks one player per team. */
export function openRotationPlayersModal(needed: number, onPick: (ids: string[]) => void): void {
  openChoosePlayersModal(needed, {
    title: en.squads.rotationPlayersTitle,
    note: en.squads.rotationPlayersNote(needed),
    button: en.squads.rotationPlayersButton,
  }, onPick);
}

/** A dialog that picks exactly `needed` players from the database. */
function openChoosePlayersModal(needed: number, text: { title: string; note: string; button: string }, onPick: (ids: string[]) => void): void {
  let chosen: string[] = [];
  const onChange = (e: Event) => {
    chosen = (e as CustomEvent<string[]>).detail;
    setConfirmEnabled(chosen.length === needed);
  };
  openDialog({
    title: text.title,
    body: html`
      <p class="field-note" style="margin-bottom:10px;">${text.note}</p>
      <player-picker .rows=${pickerRows(state.players)} .countLabel=${(n: number) => en.squads.drawPairsCount(n, needed)}
        empty=${en.players.noPlayersAdmin} @selection-change=${onChange}></player-picker>`,
    confirm: { label: text.button, tone: 'gold' },
    onConfirm: () => onPick(chosen),
  });
  setConfirmEnabled(false);
}
````

## File: src/algorithms.ts
````typescript
// ---------------------------------------------------------------------------
// Re-export core algorithms and football sport implementation
// Maintains backwards compatibility for modules importing from algorithms.js
// ---------------------------------------------------------------------------

export { GAME_STATUS } from './types.js';

// Core domain logic: scheduling, draft, and archive
export {
  bergerRounds,
  generateSchedule,
  buildExtraVolta,
  buildFirstRoundSeeding,
  type BergerRound,
  type GeneratedSchedule,
  type ExtraVoltaResult,
} from './core/schedule.js';

export {
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  balancedDraft,
  balancedPairs,
  type DraftTeams,
  type PlayerWithAttributes,
} from './core/draft.js';

export {
  getChampion,
  countPlayedGames,
  buildArchiveEntry,
  archiveTally,
  type ArchiveSnapshotInput,
} from './core/archive.js';

// Football sport implementation: standings, tiebreaks, goals, stats
export {
  Football,
  football,
  computeStandings,
  resolveHeadToHead,
  getPlayoffWinner,
  tallyPlayerStats,
  mergePlayerStats,
  alignAssists,
  addGoal,
  removeGoal,
  setGameStatus,
  gameGoals,
  resultEvents,
  standingsOrder,
  rankMoves,
} from './sports/football/Football.js';
````

## File: src/share.ts
````typescript
// ---------------------------------------------------------------------------
// Share — draws a PNG of the standings or a match result to send on WhatsApp
// or other apps. Uses the Web Share API when supported; otherwise downloads it.
// ---------------------------------------------------------------------------
import { state } from './state.js';
import { getSport } from './sports/registry.js';
import { RacketSport } from './sports/RacketSport.js';
import { sideName, safeColor, playerName } from './utils.js';
import { showToast } from './ui/toasts.js';
import type { Score } from './types.js';
import { en } from './i18n/en.js';

const W = 1080;
const PAD = 64;
const C = {
  bg: '#0F2A1C',
  band: '#153826',
  row: '#1C4A32',
  rowAlt: '#245E3F',
  text: '#FFFFFF',
  soft: '#B9CDBE',
  gold: '#CBA135',
};
const DISPLAY = "'Oswald', 'Arial Narrow', Impact, sans-serif";
const BODY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";

interface TextStyle {
  font: string;
  color?: string;
  align?: CanvasTextAlign;
  maxW?: number;
}

/** A share image being drawn: a canvas of the app's width and a few drawing helpers. */
class ShareImage {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(readonly height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = C.bg;
    this.ctx.fillRect(0, 0, W, height);
    this.ctx.textBaseline = 'middle';
  }

  /** Waits for the app fonts (falls back to system fonts on failure). */
  static async fontsReady(): Promise<void> {
    try {
      await Promise.all([
        document.fonts.load(`700 48px ${DISPLAY}`),
        document.fonts.load(`600 32px ${BODY}`),
      ]);
    } catch { /* use system fallback fonts */ }
  }

  /** Truncates text with an ellipsis to fit within maxW. */
  private fit(value: string, maxW: number): string {
    let t = value;
    if (this.ctx.measureText(t).width <= maxW) return t;
    while (t.length > 1 && this.ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
    return `${t}…`;
  }

  text(str: string, x: number, y: number, { font, color = C.text, align = 'left', maxW = W }: TextStyle): void {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.fillText(this.fit(String(str), maxW), x, y);
  }

  rect(x: number, y: number, w: number, h: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  /** A team colour dot with a light outline. */
  dot(x: number, y: number, r: number, color: string | undefined): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = safeColor(color);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.stroke();
  }

  header(title: string, subtitle: string): void {
    this.rect(0, 0, W, 210, C.band);
    this.rect(0, 206, W, 4, C.gold);
    this.text(title.toUpperCase(), PAD, 90, { font: `700 64px ${DISPLAY}`, maxW: W - 2 * PAD });
    this.text(subtitle.toUpperCase(), PAD, 160, { font: `600 30px ${BODY}`, color: C.gold, maxW: W - 2 * PAD });
  }

  footer(): void {
    const d = new Date().toLocaleDateString('en-GB');
    this.text(`${getSport(state.meta?.sport).icon} ${en.share.brand} · ${d}`, W / 2, this.height - 44,
      { font: `500 24px ${BODY}`, color: C.soft, align: 'center', maxW: W - 2 * PAD });
  }

  /** Shares the PNG, or downloads it where sharing files is not supported. */
  async deliver(filename: string, title: string): Promise<void> {
    const blob = await new Promise<Blob | null>((resolve) => this.canvas.toBlob(resolve, 'image/png'));
    if (!blob) { showToast(en.share.errorCreatingImage, 'error'); return; }
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(en.share.imageDownloaded, 'ok');
  }
}

function tournamentName(): string {
  return state.config?.nome || en.common.tournament;
}

// ---------------------------------------------------------------------------
// Standings
// ---------------------------------------------------------------------------
export async function shareStandings(): Promise<void> {
  const config = state.config;
  if (!config) return;
  const teamsArray = (state.teams || []).slice(0, state.scheduleTeamCount || config.numEquipas);
  const sport = getSport(state.meta?.sport);
  const groups = sport.computeStandings(teamsArray, state.schedule, state.results, config)
    .filter((g) => g.standings.length);
  if (!groups.length) { showToast(en.share.noStandingsYet, 'error'); return; }

  await ShareImage.fontsReady();

  const ROW = 72;
  const GROUP_HEAD = groups.length > 1 ? 70 : 0;
  const COLS_HEAD = 56;
  const height = 210 + 40 + groups.reduce((h, g) => h + GROUP_HEAD + COLS_HEAD + g.standings.length * ROW + 30, 0) + 90;
  const img = new ShareImage(height);

  const played = Object.values(state.results).filter((r) => r && typeof r === 'object' && r.status === 'terminado').length;
  img.header(tournamentName(), en.share.standingsSubtitle(played));

  // Columns of the sport, the highlighted one (Pts, GW) last, right-aligned in the row
  const sportCols = sport.standingsColumns(config);
  const ordered = [...sportCols.filter((c) => !c.className), ...sportCols.filter((c) => c.className)];
  const COL_W = 64;
  const lastX = W - PAD - 20;
  const cols = ordered.map((c, i) => ({ ...c, x: lastX - (ordered.length - 1 - i) * COL_W }));
  const teamMaxW = cols[0].x - COL_W / 2 - (PAD + 90) - 10;

  let y = 250;
  groups.forEach((g) => {
    if (groups.length > 1) {
      img.text(g.name.toUpperCase(), PAD, y + 30, { font: `700 36px ${DISPLAY}`, color: C.gold });
      y += GROUP_HEAD;
    }
    cols.forEach((c) => img.text(c.label, c.x, y + 26, { font: `700 24px ${BODY}`, color: C.soft, align: 'center' }));
    y += COLS_HEAD;

    g.standings.forEach((s, i) => {
      img.rect(PAD - 16, y, W - 2 * PAD + 32, ROW - 6, i % 2 ? C.rowAlt : C.row);
      const cy = y + (ROW - 6) / 2;
      img.text(String(i + 1), PAD + 14, cy, { font: `700 32px ${DISPLAY}`, color: i === 0 ? C.gold : C.text, align: 'center' });
      img.dot(PAD + 62, cy, 13, state.teams?.[s.idx]?.color);
      img.text(s.name, PAD + 90, cy, { font: `600 32px ${BODY}`, maxW: teamMaxW });
      cols.forEach((c) => {
        img.text(String(c.value(s)), c.x, cy, {
          font: c.className ? `700 36px ${DISPLAY}` : `500 30px ${BODY}`,
          color: c.className ? C.gold : C.text,
          align: 'center',
        });
      });
      y += ROW;
    });
    y += 30;
  });

  img.footer();
  await img.deliver(en.share.standingsFilename, en.share.standingsShareTitle(tournamentName()));
}

// ---------------------------------------------------------------------------
// Match result
// ---------------------------------------------------------------------------
function goalLines(res: Score, side: 'home' | 'away'): string[] {
  const scorers = res.scorers?.[side] || [];
  const assists = res.assists?.[side] || [];
  return scorers.map((pid, i) => {
    if (pid === 'auto') return en.share.ownGoal;
    const a = assists[i] && assists[i] !== 'auto' ? en.share.assist(playerName(assists[i])) : '';
    return `${playerName(pid)}${a}`;
  });
}

export async function shareResult(gi: string | number): Promise<void> {
  const game = state.schedule[Number(gi)];
  const res = state.results[gi];
  if (!game || !res || typeof res !== 'object') return;

  await ShareImage.fontsReady();

  const home = goalLines(res, 'home');
  const away = goalLines(res, 'away');
  const lines = Math.max(home.length, away.length);
  const height = 210 + 420 + lines * 48 + (res.mvp ? 90 : 0) + 110;
  const img = new ShareImage(height);

  const round = typeof game.jornada === 'number' ? en.gameModal.roundLabel(game.jornada) : String(game.jornada || '');
  img.header(tournamentName(), round ? en.share.roundResult(round) : en.share.finalResult);

  // Football and matches played to points: the score. Racket sports: sets won, with the games of each set underneath
  const sport = getSport(state.meta?.sport);
  const racket = sport instanceof RacketSport && !sport.pointsPerMatch(state.config) ? sport : null;
  const sets = racket ? racket.setsOf(res) : [];
  const [h, a] = racket
    ? Object.values(racket.setsWon(sets, racket.format(state.config)))
    : String(res.score || '0-0').split('-');
  const colHome = W / 4;
  const colAway = (3 * W) / 4;
  const teamColor = (idx: number | string) => (typeof idx === 'number' && state.teams?.[idx] ? state.teams[idx].color : '#888888');

  img.dot(colHome, 300, 34, teamColor(game.home));
  img.dot(colAway, 300, 34, teamColor(game.away));
  img.text(sideName(game, 'home'), colHome, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });
  img.text(sideName(game, 'away'), colAway, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });

  img.text(`${h}  -  ${a}`, W / 2, 500, { font: `700 140px ${DISPLAY}`, color: C.gold, align: 'center' });
  let y = 600;
  if (racket && sets.length) {
    img.text(racket.formatSets(sets), W / 2, y, { font: `600 34px ${BODY}`, color: C.soft, align: 'center' });
  } else if (res.penalties) {
    img.text(en.share.penalties(res.penalties), W / 2, y, { font: `600 30px ${BODY}`, color: C.soft, align: 'center' });
  }
  y += 50;

  for (let i = 0; i < lines; i++) {
    if (home[i]) img.text(`⚽ ${home[i]}`, colHome, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    if (away[i]) img.text(`⚽ ${away[i]}`, colAway, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    y += 48;
  }

  if (res.mvp) {
    y += 30;
    img.text(`⭐ ${en.share.mvp(playerName(res.mvp))}`, W / 2, y, { font: `700 36px ${DISPLAY}`, color: C.gold, align: 'center', maxW: W - 2 * PAD });
  }

  img.footer();
  await img.deliver(en.share.resultFilename, `${sideName(game, 'home')} ${res.score} ${sideName(game, 'away')}`);
}
````

## File: src/ui.ts
````typescript
import { state } from './state.js';
import { GAME_STATUS } from './algorithms.js';
import { dom } from './ui/dom.js';
import { populateConfigForm, renderScheduleHint } from './ui/settings.js';
import { renderTeams, renderSquadsDropdown, renderSquadPlayerFromDBDropdown } from './ui/teams.js';
import { renderCalendar, renderResults } from './ui/schedule.js';
import { renderStandingsWrapper } from './ui/standings.js';
import { renderStatsGrid, computeStatsSummary, renderDashboard, updateTicker } from './ui/stats.js';
import { renderPlayersList } from './ui/players.js';
import { renderDraftPlayerList, renderSingularHistorico } from './ui/singular.js';
import { renderHistorico } from './ui/history.js';
import { renderHeaderTournament } from './ui/tournaments.js';
import { getSport } from './sports/registry.js';
import { padel } from './sports/padel/Padel.js';
import { en } from './i18n/en.js';

// The rest of the interface lives in src/ui/, one module per section; this file
// brings everything together for modules importing from './ui.js'.
export * from './ui/dom.js';
export * from './ui/toasts.js';
export * from './ui/navigation.js';
export * from './ui/settings.js';
export * from './ui/teams.js';
export * from './ui/schedule.js';
export * from './ui/standings.js';
export * from './ui/stats.js';
export * from './ui/modals.js';
export * from './ui/players.js';
export * from './ui/singular.js';
export * from './ui/admin.js';
export * from './ui/history.js';
export * from './ui/match.js';
export * from './ui/tournaments.js';

// ---------------------------------------------------------------------------
// Render de topo — redesenha toda a UI
// ---------------------------------------------------------------------------
export function renderAll() {
  renderHeaderTournament(state.meta);
  populateConfigForm();
  renderTeams();
  renderSquadsDropdown();
  renderCalendar();
  renderResults();
  refreshComputed();
  renderPlayersList();
  renderSquadPlayerFromDBDropdown();
  renderDraftPlayerList();
  renderSingularHistorico();
  renderHistorico();
}

export function refreshComputed() {
  const summary = computeStatsSummary();
  renderStandingsWrapper(summary.groupsData);
  renderStatsGrid(summary);
  renderDashboard(summary);
  updateTicker(summary);
  renderScheduleHint();

  // Hide "Add Extra Round" when the tournament uses groups (only a single league is supported)
  // Mexicano draws its rounds one at a time with the same button
  const rotation = getSport(state.meta?.sport) === padel ? padel.rotation(state.config) : null;
  if (dom.btnAdicionarVolta) {
    const isLeague = (state.config?.numGrupos || 1) === 1;
    dom.btnAdicionarVolta.style.display = isLeague ? '' : 'none';
    dom.btnAdicionarVolta.textContent = rotation === 'mexicano' ? en.schedule.nextMexicanoRound : en.schedule.addExtraRound;
  }

  if (dom.standingsNoteRacket) dom.standingsNoteRacket.textContent = rotation ? en.standings.rotationNote : en.standings.racketNote;

  if (dom.btnGerarEliminatorias && rotation) dom.btnGerarEliminatorias.style.display = 'none';
  else if (state.config?.mataMata && dom.btnGerarEliminatorias) {
    let leagueTotal = 0;
    let leaguePlayed = 0;
    let hasPlayoffs = false;

    state.schedule.forEach((g, gi) => {
      if (g.isPlayoff) { hasPlayoffs = true; return; }
      leagueTotal++;
      const res = state.results[gi];
      if (res && typeof res === 'object' && res.status === GAME_STATUS.TERMINADO) leaguePlayed++;
    });

    const leagueFinished = leagueTotal > 0 && leagueTotal === leaguePlayed;
    dom.btnGerarEliminatorias.style.display = (leagueFinished && !hasPlayoffs) ? 'inline-flex' : 'none';
  }
}
````

## File: tests/football.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  computeStandings,
  getPlayoffWinner,
  addGoal,
  removeGoal,
  setGameStatus,
  gameGoals,
  resultEvents,
  tallyPlayerStats,
  mergePlayerStats,
  standingsOrder,
  rankMoves,
  football,
} from '../src/sports/football/Football.js';
import { GAME_STATUS, type Config, type Match, type MatchResult, type Team } from '../src/types.js';

const config: Config = {
  nome: 'Futebol ILOG',
  numEquipas: 8,
  numGrupos: 1,
  numVoltas: 2,
  pontosVitoria: 3,
  pontosEmpate: 1,
  pontosDerrota: 0,
  bonusGoleada: 1,
  golosGoleada: 3,
  mataMata: false,
  numPlayoffTeams: 4,
};

describe('computeStandings', () => {
  const teams: Team[] = [{ name: 'A', color: '#111' }, { name: 'B', color: '#222' }, { name: 'C', color: '#333' }];

  it('soma pontos com bónus de goleada e ignora jogos agendados', () => {
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 2 },
      { jornada: 3, home: 2, away: 0 },
    ];
    const results: Record<string | number, MatchResult> = {
      0: { score: '3-0', status: GAME_STATUS.TERMINADO },
      1: '1-1',
      2: { score: '5-0', status: GAME_STATUS.AGENDADO },
    };
    const [group] = computeStandings(teams, schedule, results, config);
    const byName = Object.fromEntries(group.standings.map((s) => [s.name, s]));
    expect(byName.A.Pts).toBe(4); // vitória + bónus de goleada
    expect(byName.B.Pts).toBe(1);
    expect(byName.C.Pts).toBe(1);
    expect(byName.C.J).toBe(1);
    expect(group.standings[0].name).toBe('A');
  });

  it('desempata pelo confronto direto', () => {
    // A e B acabam iguais em pontos, DG e golos marcados; B venceu o jogo entre eles,
    // por isso fica à frente apesar da ordem alfabética.
    const four: Team[] = [...teams, { name: 'D', color: '#444' }];
    const schedule: Match[] = [
      { jornada: 1, home: 1, away: 0 },
      { jornada: 2, home: 2, away: 1 },
      { jornada: 3, home: 0, away: 3 },
    ];
    const results: Record<string | number, MatchResult> = { 0: '1-0', 1: '1-0', 2: '1-0' };
    const [group] = computeStandings(four, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['C', 'B', 'A', 'D']);
  });

  it('ignora jogos de playoff', () => {
    const [group] = computeStandings(teams, [{ jornada: 1, home: 0, away: 1, isPlayoff: true }], { 0: '2-0' }, config);
    expect(group.standings.every((s) => s.J === 0)).toBe(true);
  });

  it('ignora jogos de playoff no confronto direto', () => {
    // A e B empatam na liga; B vence A nas eliminatórias, o que não pode mexer na tabela.
    const two: Team[] = [{ name: 'A', color: '#111' }, { name: 'B', color: '#222' }];
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 0, isPlayoff: true },
    ];
    const results: Record<string | number, MatchResult> = { 0: '1-1', 1: '2-0' };
    const [group] = computeStandings(two, schedule, results, config);
    expect(group.standings.map((s) => s.name)).toEqual(['A', 'B']);
  });
});

describe('eliminatórias - playoff winner', () => {
  it('decide o vencedor pelo resultado ou pelos penáltis', () => {
    const game: Match = { jornada: 1, home: 3, away: 5, isPlayoff: true };
    const done = (score: string, penalties?: string): MatchResult => ({ score, penalties, status: GAME_STATUS.TERMINADO });

    expect(getPlayoffWinner(game, done('2-1'))).toBe(3);
    expect(getPlayoffWinner(game, done('0-1'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1', '4-5'))).toBe(5);
    expect(getPlayoffWinner(game, done('1-1'))).toBe(null);
    expect(getPlayoffWinner(game, { score: '2-1', status: GAME_STATUS.DECORRER })).toBe(null);
  });
});

describe('estatísticas de jogadores', () => {
  const results: Record<string | number, MatchResult> = {
    0: {
      score: '3-1',
      scorers: { home: ['ana', 'ana', 'auto'], away: ['rui'] },
      assists: { home: ['rui', '', ''], away: ['ze'] },
      mvp: 'ana',
    },
    1: { score: '1-0', scorers: { home: ['rui'], away: [] } },
    2: '2-2',
  };
  const singulares = [{ nomeA: 'Equipa A', nomeB: 'Equipa B', scoreA: 1, scoreB: 0, scorersA: ['ana'], scorersB: [], assistsA: ['ze'], mvp: 'ze' }];

  it('conta golos, assistências, MVP e recorde, sem autogolos', () => {
    const t = tallyPlayerStats(results, singulares);
    expect(t.ana).toEqual({ golos: 3, assistencias: 0, mvp: 1, jogosAMarcar: 2, recorde: 2 });
    expect(t.rui).toEqual({ golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 2, recorde: 1 });
    expect(t.ze).toEqual({ golos: 0, assistencias: 2, mvp: 1, jogosAMarcar: 0, recorde: 0 });
    expect((t as Record<string, unknown>).auto).toBeUndefined();
  });

  it('dados antigos sem assistências continuam a contar', () => {
    const t = tallyPlayerStats({ 0: { scorers: { home: ['a'], away: [] } } }, [{ nomeA: 'A', nomeB: 'B', scoreA: 2, scoreB: 0, scorersA: ['a', 'a'] }]);
    expect(t.a.golos).toBe(3);
    expect(t.a.recorde).toBe(2);
  });

  it('ids como __proto__ não poluem o protótipo de Object', () => {
    const t = tallyPlayerStats(
      { 0: { scorers: { home: ['__proto__', 'constructor'], away: [] }, assists: { home: ['__proto__', ''], away: [] }, mvp: '__proto__' } },
      []
    );
    expect(t['__proto__']).toEqual({ golos: 1, assistencias: 1, mvp: 1, jogosAMarcar: 1, recorde: 1 });
    expect(t.constructor.golos).toBe(1);
    expect(({} as Record<string, unknown>).golos).toBeUndefined();
    expect((Object as unknown as Record<string, unknown>).golos).toBeUndefined();
  });

  it('junta contagens somando e mantendo o recorde máximo', () => {
    const a = { x: { golos: 2, assistencias: 1, mvp: 0, jogosAMarcar: 1, recorde: 2 } };
    const b = {
      x: { golos: 1, assistencias: 0, mvp: 1, jogosAMarcar: 1, recorde: 1 },
      y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 },
    };
    expect(mergePlayerStats(a, b)).toEqual({
      x: { golos: 3, assistencias: 1, mvp: 1, jogosAMarcar: 2, recorde: 2 },
      y: { golos: 1, assistencias: 0, mvp: 0, jogosAMarcar: 1, recorde: 1 },
    });
  });
});

describe('golos de um jogo', () => {
  it('soma ao resultado guardado e não ao que estava no ecrã', () => {
    // Outro telemóvel já registou o 1-0; este regista um golo do visitante
    const guardado: MatchResult = { score: '1-0', status: 'decorrer', scorers: { home: ['ana'], away: [] }, assists: { home: [''], away: [] } };
    const novo = addGoal(guardado, 'away', 'rui', 'ze');
    expect(novo.score).toBe('1-1');
    expect(novo.scorers).toEqual({ home: ['ana'], away: ['rui'] });
    expect(novo.assists).toEqual({ home: [''], away: ['ze'] });
    expect(guardado.score).toBe('1-0');
  });

  it('primeiro golo cria o resultado e põe o jogo a decorrer', () => {
    expect(addGoal(undefined, 'home', 'auto', '')).toEqual({
      score: '1-0',
      status: 'decorrer',
      scorers: { home: ['auto'], away: [] },
      assists: { home: [''] },
    });
    expect(addGoal({ score: '0-0', status: 'agendado', scorers: { home: [], away: [] } }, 'home', 'a', '').status).toBe('decorrer');
  });

  it('resultados antigos só com texto mantêm o marcador', () => {
    expect(addGoal('2-1', 'home', 'a', '').score).toBe('3-1');
    expect(removeGoal('2-1', 'away')).toMatchObject({ score: '2-0', status: 'terminado' });
  });

  it('tirar golo remove o último marcador e a assistência', () => {
    const r: MatchResult = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['c'] } };
    const novo = removeGoal(r, 'home');
    expect(novo.score).toBe('1-0');
    expect(novo.scorers?.home).toEqual(['a']);
    expect(novo.assists?.home).toEqual(['c']);
    expect(novo.status).toBe('terminado');
  });

  it('com 0 golos ou sem resultado não muda nada', () => {
    const r: MatchResult = { score: '0-1', scorers: { home: [], away: ['x'] } };
    expect(removeGoal(r, 'home')).toBe(r);
    expect(removeGoal(undefined, 'home')).toBeUndefined();
  });
});

describe('estado e golos de um jogo', () => {
  it('muda o estado e converte resultados antigos em texto', () => {
    expect(setGameStatus(undefined, 'decorrer')).toMatchObject({ score: '0-0', status: 'decorrer' });
    expect(setGameStatus('2-1', 'terminado')).toMatchObject({ score: '2-1', status: 'terminado' });
  });

  it('golos de cada equipa pela ordem, com assistências', () => {
    const r: MatchResult = { score: '2-1', scorers: { home: ['a', 'b'], away: ['c'] }, assists: { home: ['', 'x'], away: [] } };
    expect(gameGoals(r)).toEqual({
      home: [{ pid: 'a', aid: '' }, { pid: 'b', aid: 'x' }],
      away: [{ pid: 'c', aid: '' }],
    });
    expect(gameGoals('1-0')).toEqual({ home: [], away: [] });
  });
});

describe('eventos para animações', () => {
  const base: Record<string, MatchResult> = {
    0: { score: '1-0', status: 'decorrer', scorers: { home: ['a'], away: [] } },
  };

  it('golo com marcador e assistência', () => {
    const next: Record<string, MatchResult> = {
      0: { score: '1-1', status: 'decorrer', scorers: { home: ['a'], away: ['b'] }, assists: { home: [], away: ['c'] } },
    };
    expect(resultEvents(base, next)).toEqual([{ type: 'golo', gi: '0', side: 'away', pid: 'b', aid: 'c' }]);
  });

  it('golo anulado', () => {
    const next: Record<string, MatchResult> = {
      0: { score: '0-0', status: 'decorrer', scorers: { home: [], away: [] } },
    };
    expect(resultEvents(base, next)).toEqual([{ type: 'anulado', gi: '0', side: 'home', pid: 'a' }]);
  });

  it('jogo começou e jogo terminou', () => {
    expect(resultEvents({}, { 1: { score: '0-0', status: 'decorrer' } })).toEqual([{ type: 'inicio', gi: '1' }]);
    expect(resultEvents(base, { 0: { ...(base[0] as object), status: 'terminado' } })).toEqual([{ type: 'fim', gi: '0' }]);
  });

  it('primeiro golo num jogo agendado só anima o golo', () => {
    const next: Record<string, MatchResult> = {
      1: { score: '1-0', status: 'decorrer', scorers: { home: ['z'], away: [] } },
    };
    expect(resultEvents({ 1: { score: '0-0', status: 'agendado' } }, next).map((e) => e.type)).toEqual(['golo']);
  });

  it('resultado escrito já terminado só anima o fim; sem mudanças não anima', () => {
    expect(resultEvents({}, { 2: { score: '3-1', status: 'terminado' } })).toEqual([{ type: 'fim', gi: '2' }]);
    expect(resultEvents(base, JSON.parse(JSON.stringify(base)))).toEqual([]);
  });
});

describe('rankMoves', () => {
  const groups = (...ids: number[][]) =>
    ids.map((g) => ({
      name: 'Grupo',
      standings: g.map((idx) => ({
        idx,
        name: `Team ${idx}`,
        J: 0,
        V: 0,
        E: 0,
        D: 0,
        GM: 0,
        GS: 0,
        Pts: 0,
      })),
    }));

  it('conta lugares ganhos e perdidos', () => {
    const before = standingsOrder(groups([0, 1, 2, 3]));
    const after = standingsOrder(groups([2, 0, 1, 3]));
    expect(Object.fromEntries(rankMoves(before, after))).toEqual({ 2: 2, 0: -1, 1: -1 });
  });

  it('ignora equipas sem mudança, novas ou noutro grupo', () => {
    const before = standingsOrder(groups([0, 1], [2, 3]));
    const after = standingsOrder(groups([0, 2], [1, 3, 4]));
    expect(rankMoves(before, after).size).toBe(0);
  });

  it('sem classificação anterior não há mudanças', () => {
    expect(rankMoves(null, standingsOrder(groups([0, 1]))).size).toBe(0);
  });
});

describe('player records and profile', () => {
  it('wins on goals or penalties; draws and unfinished matches are not won', () => {
    expect(football.winnerSide({ score: '2-1', status: 'terminado' })).toBe('home');
    expect(football.winnerSide({ score: '1-1', status: 'terminado', penalties: '3-4' })).toBe('away');
    expect(football.winnerSide({ score: '1-1', status: 'terminado' })).toBe(null);
    expect(football.winnerSide({ score: '2-1', status: 'decorrer' })).toBe(null);
    expect(football.winnerSide('3-0')).toBe('home');
  });

  it('counts single matches and shows the football cards', () => {
    const records = football.playerRecords([], {}, [], [
      { id: 's1', data: '', nomeEquipaA: 'A', nomeEquipaB: 'B', equipaA: ['ana'], equipaB: ['rui'], resultado: '3-2' },
      { id: 's2', data: '', nomeEquipaA: 'A', nomeEquipaB: 'B', equipaA: ['ana'], equipaB: ['rui'], resultado: null },
    ]);
    expect(records).toEqual({ ana: { played: 1, won: 1 }, rui: { played: 1, won: 0 } });
    const cards = football.profileStats({ golos: 4, assistencias: 2, mvp: 1, jogosAMarcar: 3, recorde: 2 });
    expect(cards.map((c) => c.value)).toEqual([4, 2, 1, 3, 2]);
  });
});
````

## File: tests/players.test.ts
````typescript
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
}));

import {
  defaultPlayerAttrs,
  normalizePlayer,
  normalizePlayers,
} from '../src/sync.js';
import { state, applySnapshot } from '../src/state.js';

describe('defaultPlayerAttrs', () => {
  it('cria atributos a zero para qualquer modalidade', () => {
    const attrs = defaultPlayerAttrs('football');
    expect(attrs).toEqual({
      velocidade: 0,
      finalizacao: 0,
      passe: 0,
      drible: 0,
      defesa: 0,
      fisico: 0,
    });
  });

  it('usa os atributos de cada modalidade', () => {
    expect(defaultPlayerAttrs('padel')).toEqual({ volley: 0, smash: 0, lob: 0, walls: 0, defense: 0, fitness: 0 });
    // Unknown sport falls back to football
    expect(Object.keys(defaultPlayerAttrs('curling'))).toContain('velocidade');
  });
});

describe('normalizePlayer', () => {
  it('migra atributos antigos de futebol para ratings.football e mantém atributos como alias', () => {
    const legacy = {
      id: 'p1',
      nome: 'Cristiano',
      teamIdx: 0,
      atributos: {
        velocidade: 5,
        finalizacao: 5,
        passe: 4,
        drible: 4,
        defesa: 2,
        fisico: 4,
      },
    };

    const p = normalizePlayer(legacy);
    expect(p.id).toBe('p1');
    expect(p.nome).toBe('Cristiano');
    expect(p.teamIdx).toBe(0);
    expect(p.ratings).toBeDefined();
    expect(p.ratings?.football).toEqual({
      velocidade: 5,
      finalizacao: 5,
      passe: 4,
      drible: 4,
      defesa: 2,
      fisico: 4,
    });
    // Backwards compatibility alias
    expect(p.atributos).toEqual(p.ratings?.football);
  });

  it('preserva ratings de múltiplas modalidades', () => {
    const multi = {
      id: 'p2',
      nome: 'Multiatleta',
      ratings: {
        football: { velocidade: 4, finalizacao: 4, passe: 4, drible: 4, defesa: 4, fisico: 4 },
        padel: { velocidade: 5, finalizacao: 3, passe: 5, drible: 2, defesa: 5, fisico: 3 },
      },
    };

    const p = normalizePlayer(multi);
    expect(p.ratings?.football?.velocidade).toBe(4);
    expect(p.ratings?.padel?.velocidade).toBe(5);
    expect(p.ratings?.padel?.defesa).toBe(5);
    expect(p.atributos).toEqual(p.ratings?.football);
  });

  it('lida com jogador nulo retornando null e objeto vazio criando defaults', () => {
    expect(normalizePlayer(null)).toBeNull();
    const p = normalizePlayer({});
    expect(p?.id).toBeDefined();
    expect(p?.nome).toBe('');
    expect(p?.ratings?.football).toBeDefined();
    expect(p?.atributos).toBeDefined();
  });
});

describe('normalizePlayers', () => {
  it('normaliza um array de jogadores', () => {
    const list = [
      { id: '1', nome: 'A', atributos: { velocidade: 3 } },
      { id: '2', nome: 'B' },
    ];
    const normalized = normalizePlayers(list);
    expect(normalized).toHaveLength(2);
    expect(normalized[0].nome).toBe('A');
    expect(normalized[0].ratings?.football.velocidade).toBe(3);
    expect(normalized[1].nome).toBe('B');
    expect(normalized[1].ratings?.football.velocidade).toBe(0);
  });

  it('normaliza um objeto de jogadores recebido do Firebase Realtime Database', () => {
    const firebaseObj = {
      p1: { id: 'p1', nome: 'Jogador 1', atributos: { velocidade: 4 } },
      p2: { id: 'p2', nome: 'Jogador 2' },
    };
    const normalized = normalizePlayers(firebaseObj);
    expect(normalized).toHaveLength(2);
    expect(normalized.map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('retorna array vazio para undefined ou null', () => {
    expect(normalizePlayers(undefined)).toEqual([]);
    expect(normalizePlayers(null)).toEqual([]);
  });
});

describe('applySnapshot com players', () => {
  it('carrega players globais para state.players', () => {
    const snap = {
      players: {
        p1: { id: 'p1', nome: 'João', ratings: { football: { velocidade: 4 } } },
      },
    };
    applySnapshot(snap);
    expect(state.players).toHaveLength(1);
    expect(state.players[0].nome).toBe('João');
    expect(state.players[0].ratings?.football.velocidade).toBe(4);
  });
});
````

## File: .dockerignore
````
node_modules
dist
.git
.idea
.vscode
*.log
.env
.env.*
.firebase
````

## File: docker-compose.yml
````yaml
services:
  # Firebase Emulator Suite (Realtime Database + Authentication + Emulator UI)
  firebase:
    build:
      context: .
      dockerfile: docker/firebase/Dockerfile
    image: torneio-firebase:latest
    container_name: torneio-firebase
    restart: unless-stopped
    ports:
      - "9000:9000" # Firebase Realtime Database Emulator
      - "9099:9099" # Firebase Authentication Emulator
      - "4000:4000" # Firebase Emulator Suite UI
      - "4400:4400" # Firebase Emulator Hub
    volumes:
      - ./firebase.json:/app/firebase.json:ro
      - ./database.rules.json:/app/database.rules.json:ro
      - firebase-data:/data
    environment:
      - FIREBASE_PROJECT_ID=demo-torneio
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://127.0.0.1:4000/ || curl -f http://127.0.0.1:9000/ || exit 1"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

  # Torneio ILOG frontend (Vite dev server with hot reload)
  app:
    build:
      context: .
      dockerfile: docker/app/Dockerfile
    image: torneio-app:latest
    container_name: torneio-app
    restart: unless-stopped
    ports:
      - "5173:5173" # Vite development server
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_USE_EMULATORS=true
      - VITE_FIREBASE_PROJECT_ID=demo-torneio
      - VITE_FIREBASE_DATABASE_URL=https://demo-torneio-default-rtdb.firebaseio.com
    depends_on:
      firebase:
        condition: service_healthy

volumes:
  firebase-data:
    name: torneio-firebase-data
````

## File: css/base.css
````css
:root {
  --pitch-900: #0F2A1C;
  --pitch-800: #153826;
  --pitch-700: #1C4A32;
  --pitch-600: #245E3F;
  --pitch-500: #2F7A4F;
  --gold: #CBA135;
  --gold-dark: #A9832A;
  --paper: #F1F4EE;
  --card: #FFFFFF;
  --ink: #152018;
  --ink-soft: #51604F;
  --ink-faint: #636E63;
  --line: #DCE3D7;
  --silver: #C4C9C4;
  --bronze: #C08552;
  --danger: #B3261E;
  --danger-bg: #FBEAE8;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, .07);
  --shadow-md: 0 6px 20px rgba(0, 0, 0, .10);
  --radius: 12px;
  --radius-sm: 8px;
  --font-display: 'Oswald', 'Arial Narrow', Impact, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Motion: one curve for things entering or leaving, one for things moving
     on screen, and the iOS sheet curve for the bottom drawer. Durations stay
     under 300ms so the app keeps feeling instant. */
  --ease-out: cubic-bezier(.23, 1, .32, 1);
  --ease-in-out: cubic-bezier(.77, 0, .175, 1);
  --ease-drawer: cubic-bezier(.32, .72, 0, 1);
  --press: 120ms;
  --quick: 180ms;
  --slide: 280ms;

  /* Smallest comfortable tap target on a phone. */
  --tap: 44px;
}

[data-theme="dark"] {
  --paper: #121212;
  --card: #1E1E1E;
  --ink: #EAEAEA;
  --ink-soft: #A0A0A0;
  --ink-faint: #8C8C8C;
  --line: #333333;
  --pitch-900: #050a07;
  --pitch-800: #091710;
  --pitch-700: #0e2318;
  --pitch-600: #163625;
  --danger-bg: #4a110e;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, .5);
  --shadow-md: 0 6px 20px rgba(0, 0, 0, .5);
}

* {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--paper);
  color: var(--ink);
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s, color 0.3s;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  margin: 0;
  letter-spacing: .01em;
}

p {
  margin: 0;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  /* No double-tap zoom delay and no grey flash when tapped on a phone:
     every button below draws its own pressed state. */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

input,
select {
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--card);
}

table {
  border-collapse: collapse;
  width: 100%;
}

.num {
  font-variant-numeric: tabular-nums;
}

:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}

.app {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0 48px;
}
````

## File: css/classificacao.css
````css
/* ---------- Podium ---------- */
.podium {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.podium-card {
  border-radius: var(--radius);
  padding: 16px 14px;
  text-align: center;
  color: #0F2A1C;
  box-shadow: var(--shadow-sm);
}

.podium-1 {
  background: linear-gradient(145deg, #D8B84A, var(--gold-dark));
}

.podium-2 {
  background: linear-gradient(145deg, #C9CDC8, #9AA29A);
}

.podium-3 {
  background: linear-gradient(145deg, #CE9868, var(--bronze));
}

.podium-rank {
  font-family: var(--font-display);
  font-size: 13px;
  opacity: .78;
  letter-spacing: .06em;
}

.podium-name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  margin: 2px 0 4px;
  text-transform: uppercase;
}

.podium-pts {
  font-size: 13px;
  opacity: .85;
}

/* ---------- Tables ---------- */
.table-wrap {
  overflow-x: auto;
}

th,
td {
  padding: 9px 10px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid var(--line);
}

th {
  font-family: var(--font-display);
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 600;
}

td.num,
th.num {
  text-align: center;
}

.standings-table th,
.standings-table td {
  text-align: center;
}

.standings-table th.team-cell {
  text-align: left;
}

.standings-table td.team-cell {
  text-align: left;
  font-weight: 600;
}

/* No telemóvel a tabela tem de caber sem scroll horizontal */
@media (max-width: 600px) {
  .standings-table th,
  .standings-table td {
    padding: 8px 3px;
    font-size: 13px;
  }

  .standings-table th {
    font-size: 10px;
    letter-spacing: .02em;
  }

  /* getTeamDisplay usa white-space:nowrap em linha; aqui o nome pode partir */
  .standings-table td.team-cell > span {
    white-space: normal !important;
  }

  .standings-table td.team-cell > span > span {
    flex-shrink: 0;
  }

  .standings-table .pos-badge {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }

  .pos-move {
    display: block;
    margin: 2px 0 0;
    font-size: 10px;
  }
}

.standings-table td.pts-cell {
  font-weight: 700;
  color: var(--pitch-800);
}

[data-theme="dark"] .standings-table td.pts-cell {
  color: var(--gold);
}

.pos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--paper);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 700;
}

.standings-table td.pos-cell {
  white-space: nowrap;
}

/* Lugares ganhos/perdidos desde a última vez que a classificação foi vista */
.pos-move {
  display: inline-block;
  margin-left: 4px;
  font-size: 11px;
  font-weight: 700;
  vertical-align: middle;
}

.pos-move.up {
  color: #1E8E4A;
}

.pos-move.down {
  color: var(--danger);
}

[data-theme="dark"] .pos-move.up {
  color: #4ADE80;
}

[data-theme="dark"] .pos-move.down {
  color: #F87171;
}

/* Medal badges carry dark ink: white on gold, silver or bronze reads at
   2.4:1 and disappears outdoors, which is where these matches are played. */
tr.pos-gold .pos-badge {
  background: var(--gold);
  color: #0F2A1C;
}

tr.pos-silver .pos-badge {
  background: var(--silver);
  color: #0F2A1C;
}

tr.pos-bronze .pos-badge {
  background: var(--bronze);
  color: #0F2A1C;
}

tr.pos-gold {
  background: rgba(203, 161, 53, .07);
}

tr.pos-silver {
  background: rgba(196, 201, 196, .10);
}

tr.pos-bronze {
  background: rgba(192, 133, 82, .07);
}

.mini-table td,
.mini-table th {
  padding: 6px 8px;
  font-size: 13px;
}
````

## File: css/componentes.css
````css
/* ---------- Stats ---------- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 13px 14px;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--ink-faint);
  margin-bottom: 5px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 600;
  color: var(--pitch-800);
}

[data-theme="dark"] .stat-value {
  color: var(--ink);
}

.empty {
  color: var(--ink-faint);
  font-size: 14px;
  padding: 14px 2px;
  font-style: italic;
  text-align: center;
}

/* ---------- Modal ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  /* dvh, not vh: on a phone the browser bar would otherwise push the bottom
     of the dialog off screen. */
  height: 100dvh;
  background: rgba(0, 0, 0, .7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: overlay-in var(--quick) ease-out;
}

.modal-overlay[hidden] {
  display: none !important;
}

.modal {
  background: var(--card);
  border-radius: var(--radius);
  padding: 22px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-height: 90dvh;
  overflow-y: auto;
  animation: modal-scale-in 200ms var(--ease-out);
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(.96); }
  to { opacity: 1; transform: none; }
}

.modal .btn-ghost {
  display: block !important;
  background: var(--paper) !important;
  color: var(--ink) !important;
  border: 1px solid var(--line) !important;
  margin-bottom: 8px !important;
  padding: 12px !important;
  width: 100% !important;
  text-align: left !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.modal .modal-actions {
  display: flex !important;
  justify-content: space-between !important;
  margin-top: 18px;
  width: 100%;
  gap: 10px;
}

.modal .modal-actions .btn {
  display: inline-flex !important;
  width: 48% !important;
  margin-bottom: 0 !important;
  justify-content: center !important;
}

.modal .modal-actions .btn[hidden] {
  display: none !important;
}

/* ---------- Toast ---------- */
.toast-root {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.toast {
  background: var(--pitch-900);
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: var(--shadow-md);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 200ms ease-out, transform 200ms var(--ease-out);
  max-width: 90vw;
  text-align: center;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-error {
  background: var(--danger);
}

.toast-ok {
  background: var(--pitch-600);
}

.dropdown.open .dropdown-content {
  display: block;
}

.foot {
  padding: 22px 20px 10px;
  text-align: center;
  color: var(--ink-faint);
  font-size: 12px;
}
````

## File: css/mobile.css
````css
/* =========================================================
   📱 MELHORIAS MOBILE (RESPONSIVE)
========================================================= */
/* Barra de baixo e painel "Mais": só existem no telemóvel */
.bottom-nav,
.drawer-head,
.drawer-backdrop {
  display: none;
}

@media (max-width: 760px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .podium {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  /* Topo fino, preso em cima: nome do torneio e jornada à esquerda,
     atualizar, tema e conta à direita */
  .marquee {
    position: sticky;
    top: 0;
    z-index: 200;
    padding: calc(8px + env(safe-area-inset-top)) 12px 8px 16px;
  }

  .marquee-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 10px;
  }

  .marquee-top {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  #tournamentTitle {
    grid-column: 1;
    grid-row: 1;
    font-size: 19px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .marquee-ticker {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0;
    border: none;
    background: none;
    font-size: 11px;
    letter-spacing: .02em;
    color: var(--gold);
  }

  .marquee-top {
    flex-wrap: nowrap;
    justify-content: flex-end;
  }

  .marquee-top .eyebrow,
  .backup-pill,
  .save-pill:not(.pill-ok):not(.pill-error) {
    display: none;
  }

  .header-pills {
    flex-wrap: nowrap;
    gap: 6px;
  }

  .marquee-top .theme-toggle-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 9px;
    font-size: 16px;
  }

  .auth-btn {
    max-width: none;
  }

  .auth-label {
    display: none;
  }

  /* Pílula flutuante em baixo, ao alcance do polegar */
  .content {
    padding-bottom: calc(76px + env(safe-area-inset-bottom));
  }

  .bottom-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    position: fixed;
    left: 50%;
    bottom: calc(12px + env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 250;
    max-width: calc(100% - 24px);
    padding: 4px;
    border-radius: 999px;
    background: var(--card);
    border: 1px solid var(--line);
    box-shadow: 0 8px 28px rgba(0, 0, 0, .18);
  }

  .bottom-nav .tab,
  .bottom-nav .bn-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    min-width: 42px;
    height: 40px;
    justify-content: center;
    padding: 0 10px;
    border: none;
    border-radius: 999px;
    background: none;
    color: var(--ink-soft);
    font-size: 14px;
    font-weight: 700;
    transition: background var(--quick) ease-out, color var(--quick) ease-out, transform var(--press) var(--ease-out);
  }

  .bottom-nav .tab:active,
  .bottom-nav .bn-more:active {
    transform: scale(.93);
  }

  .bn-icon {
    font-size: 18px;
    line-height: 1;
  }

  /* Só o separador ativo mostra o nome */
  .bn-label {
    display: none;
    white-space: nowrap;
  }

  .bottom-nav .tab.active {
    background: var(--pitch-900);
    color: #fff;
    padding: 0 14px 0 12px;
  }

  .bottom-nav .tab.active .bn-label {
    display: inline;
  }

  [data-theme="dark"] .bottom-nav .tab.active {
    background: var(--gold);
    color: var(--pitch-900);
  }

  /* "Mais" fica marcado quando o separador aberto está no painel */
  body:has(.tabs .tab.active:not([data-tab="dashboard"]):not([data-tab="results"]):not([data-tab="standings"]):not([data-tab="calendar"])) .bn-more,
  .bn-more[aria-expanded="true"] {
    background: var(--paper);
    color: var(--ink);
    box-shadow: inset 0 0 0 2px var(--gold);
  }

  .toast-root {
    bottom: calc(72px + env(safe-area-inset-bottom));
  }

  /* Painel "Mais": sobe de baixo com os restantes separadores */
  .tabs {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    max-height: 80dvh;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 0;
    padding: 0 0 calc(12px + env(safe-area-inset-bottom));
    overflow-y: auto;
    overscroll-behavior: contain;
    border: none;
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: var(--shadow-md);
    transform: translateY(100%);
    visibility: hidden;
    transition: transform var(--slide) var(--ease-drawer), visibility 0s linear var(--slide);
  }

  .tabs.menu-open {
    transform: none;
    visibility: visible;
    transition: transform var(--slide) var(--ease-drawer);
  }

  .tabs > .tab[data-tab="dashboard"],
  .tabs > .tab[data-tab="results"],
  .tabs > .tab[data-tab="standings"],
  .tabs > .tab[data-tab="calendar"] {
    display: none;
  }

  .drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 12px 12px 12px 18px;
    background: linear-gradient(180deg, var(--pitch-800), var(--pitch-900));
    color: #fff;
  }

  .drawer-title {
    font-family: var(--font-display);
    font-size: 14px;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
  }

  .drawer-close {
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, .12);
    color: #dfe8de;
    font-size: 16px;
    transition: transform var(--press) var(--ease-out), background-color var(--quick) ease;
  }

  .drawer-close:active {
    transform: scale(.92);
  }

  .drawer-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 299;
    background: rgba(0, 0, 0, .45);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--slide) ease-out;
  }

  .tabs.menu-open + .drawer-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  body:has(.tabs.menu-open) {
    overflow: hidden;
  }

  /* "Gestão" fica sempre aberta, como secção da gaveta */
  .tabs .dropdown {
    display: block;
  }

  .tabs .dropdown-content {
    position: static;
    display: flex;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background: transparent;
    padding: 0;
  }

  .tabs .dropdown-btn {
    width: 100%;
    pointer-events: none;
    padding: 18px 18px 6px;
    font-family: var(--font-display);
    font-size: 12px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--gold-dark);
    border-bottom: 1px solid var(--line);
  }

  .dropdown-caret {
    display: none;
  }

  .tabs .tab {
    width: 100%;
    text-align: left;
    padding: 14px 18px;
    border-bottom: 1px solid var(--line);
    border-left: 3px solid transparent;
  }

  .tabs .dropdown-content .tab {
    padding: 14px 18px;
    border-bottom: 1px solid var(--line) !important;
    border-left: 3px solid transparent !important;
  }

  .tabs .tab.active {
    border-bottom-color: var(--line);
    border-left-color: var(--gold) !important;
    background: var(--paper);
  }

  /* Resultados em Duas Linhas */
  .fixture {
    grid-template-columns: 1fr 1fr;
    gap: 8px 4px;
  }

  .fixture .fx-home {
    grid-column: 1;
    grid-row: 1;
    text-align: center;
  }

  .fixture .fx-away {
    grid-column: 2;
    grid-row: 1;
    text-align: center;
  }

  .fixture .fx-vs {
    grid-column: 1 / span 2;
    grid-row: 3;
    flex-direction: row;
    justify-content: center;
    margin-top: 4px;
  }

  .result-split {
    grid-column: 1 / span 2;
    grid-row: 2;
    margin: 0 auto;
  }

  .fixture-bye {
    display: flex;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Reduced motion means less movement, not no feedback: colour and opacity
   transitions stay so a tapped control still answers, while anything that
   moves, scales or loops is dropped. */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-property: opacity, background-color, border-color, color, box-shadow !important;
    transition-duration: 120ms !important;
    scroll-behavior: auto !important;
  }
}
````

## File: css/score-events.css
````css
/* ---------------------------------------------------------------------
   Match event animations (goal, cancelled goal, kick-off, full time).
   Imported globally for the fixture cards and inlined into the
   <football-score> shadow DOM by ScoreBase.
   --------------------------------------------------------------------- */
.has-anim {
  position: relative;
  overflow: hidden;
}

.game-anim {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, #0F2A1C, #1C4A32);
  pointer-events: none;
  animation: anim-overlay 2.6s ease-in-out both;
}

.anim-golo,
.anim-game,
.anim-set {
  color: var(--anim-ink, #fff);
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, .28), transparent 60%),
    var(--anim-bg, #2F7A4F);
}

.anim-anulado {
  background: linear-gradient(135deg, #5c1410, #8e2219);
}

.anim-fim {
  background: linear-gradient(135deg, #000, #2a2a2a);
}

.anim-title {
  font-family: var(--font-display);
  font-size: clamp(26px, 8vw, 40px);
  font-weight: 700;
  letter-spacing: .04em;
  line-height: 1;
  animation: anim-pop .32s var(--ease-out) both .05s;
}

.anim-sub {
  font-size: 15px;
  font-weight: 700;
  animation: anim-rise .4s ease-out both .3s;
}

.anim-sub2 {
  font-size: 12px;
  opacity: .85;
  animation: anim-rise .4s ease-out both .45s;
}

.anim-anulado .anim-title {
  position: relative;
}

.anim-anulado .anim-title::after {
  content: '';
  position: absolute;
  left: -4%;
  top: 50%;
  height: 4px;
  width: 108%;
  background: #fff;
  transform-origin: left;
  animation: anim-strike .4s ease-out both .45s;
}

.anim-whistle {
  width: 46px;
  height: 30px;
  margin-bottom: 4px;
  animation: anim-whistle .5s ease-in-out 3 both .05s;
}

@keyframes anim-overlay {
  0% { opacity: 0; transform: scale(1.04); }
  10% { opacity: 1; transform: none; }
  78% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes anim-pop {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: none; }
}

@keyframes anim-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

@keyframes anim-strike {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes anim-whistle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-12deg); }
  75% { transform: rotate(12deg); }
}

.score-bump {
  animation: score-bump 1.1s cubic-bezier(.2, 1.4, .4, 1);
}

/* Salto do número com destaque (--bump-color: cor da equipa ou vermelho) */
@keyframes score-bump {
  0% { transform: none; }
  25% {
    transform: scale(1.45);
    color: var(--bump-color);
    text-shadow: 0 0 12px var(--bump-color);
    box-shadow: 0 0 0 3px var(--bump-color);
    border-color: var(--bump-color);
  }
  70% {
    transform: none;
    color: var(--bump-color);
    box-shadow: 0 0 0 3px var(--bump-color);
    border-color: var(--bump-color);
  }
  100% { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .score-bump {
    animation: none !important;
  }

  .game-anim {
    display: none;
  }
}
````

## File: css/torneios.css
````css
/* ---------------------------------------------------------------------
   Torneios Ativos (Dashboard & Switcher)
   --------------------------------------------------------------------- */
.torneios-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.torneios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.torneio-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 14px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  position: relative;
}

.torneio-card:hover {
  border-color: var(--gold);
  transform: translateY(-1px);
}

.torneio-card.active {
  border: 2px solid var(--gold);
  background: var(--paper);
}

.torneio-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.torneio-card-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
}

.torneio-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sport-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid var(--line);
}

.status-badge-active {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.current-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--gold);
  color: #000;
}

.torneio-card-meta {
  font-size: 12px;
  color: var(--ink-faint);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.torneio-card-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.torneio-card-actions .btn {
  font-size: 12px;
  padding: 4px 10px;
}

/* The Active Tournaments card folds to its header; the choice is kept per device */
.collapse-toggle {
  margin-bottom: 0;
  min-height: var(--tap);
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-family: var(--font-display);
  font-size: 19px;
  text-align: left;
  cursor: pointer;
  transition: transform var(--press) var(--ease-out);
}

.collapse-toggle:active {
  transform: scale(.97);
}

.collapse-count {
  font-size: 13px;
  color: var(--ink-faint);
  letter-spacing: 0;
}

.collapse-chevron {
  font-size: 14px;
  color: var(--ink-faint);
  transition: transform var(--quick) var(--ease-out);
}

.collapse-toggle[aria-expanded="false"] .collapse-chevron {
  transform: rotate(-90deg);
}
````

## File: src/components/StandingsTable.ts
````typescript
// ---------------------------------------------------------------------------
// <standings-table> — one table per group, columns from the tournament's sport
// ---------------------------------------------------------------------------
// Rendered in the light DOM so it keeps the app's table styles
// (css/classificacao.css and the mobile tweaks) without copying them.
// When the data changes, teams that changed places slide to their new row.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Sport, StandingsColumn } from '../sports/Sport.js';
import type { Config, GroupStandings, StandingsRow, Team } from '../types.js';
import { en } from '../i18n/en.js';
import { prefersReducedMotion } from '../utils.js';
import { LightElement } from './LightElement.js';
import { teamLabel } from './templates.js';

const MEDALS = ['pos-gold', 'pos-silver', 'pos-bronze'];

export class StandingsTable extends LightElement {
  static properties = {
    groups: { attribute: false },
    sport: { attribute: false },
    config: { attribute: false },
    teams: { attribute: false },
    moves: { attribute: false },
  };

  declare groups: GroupStandings[];
  declare sport: Sport | null;
  declare config: Config | null;
  declare teams: Team[];
  /** Places gained (>0) or lost (<0) per team index, shown as arrows. */
  declare moves: Map<string, number>;

  /** How long rows take to slide on the next update; 0 to jump. */
  slideDuration = 450;
  private rowTops = new Map<string, number>();

  constructor() {
    super();
    this.groups = [];
    this.sport = null;
    this.config = null;
    this.teams = [];
    this.moves = new Map();
  }

  /** Shows new standings, sliding the rows that moved for `duration` ms. */
  show(groups: GroupStandings[], moves: Map<string, number>, duration: number): void {
    this.slideDuration = duration;
    this.groups = groups;
    this.moves = moves;
  }

  protected willUpdate(): void {
    this.rowTops = new Map();
    this.querySelectorAll<HTMLElement>('tr[data-team]').forEach((r) => {
      const top = r.getBoundingClientRect().top;
      if (top) this.rowTops.set(r.dataset.team!, top);
    });
  }

  protected updated(): void {
    const duration = this.slideDuration;
    if (!duration || !this.rowTops.size || prefersReducedMotion()) return;
    this.querySelectorAll<HTMLElement>('tr[data-team]').forEach((r) => {
      const old = this.rowTops.get(r.dataset.team!);
      const now = r.getBoundingClientRect().top;
      if (old === undefined || !now || Math.abs(old - now) < 1 || !r.animate) return;
      r.animate(
        [{ transform: `translateY(${old - now}px)`, background: 'rgba(203,161,53,.22)' }, { transform: 'none' }],
        { duration, easing: 'cubic-bezier(.2,.8,.2,1)' },
      );
    });
  }

  render(): TemplateResult {
    const columns = this.sport ? this.sport.standingsColumns(this.config) : [];
    if (!this.groups.length || !this.groups[0].standings.length) {
      return html`<table class="standings-table"><tr><td colspan=${columns.length + 2} class="empty">${en.standings.noTeams}</td></tr></table>`;
    }
    const titled = this.groups.length > 1;
    return html`${this.groups.map((group) => this.groupTemplate(group, columns, titled))}`;
  }

  private groupTemplate(group: GroupStandings, columns: StandingsColumn[], titled: boolean): TemplateResult {
    return html`
      ${titled ? html`<h3 style="margin-top:20px; margin-bottom:10px; color:var(--pitch-800); font-weight:600;">${group.name}</h3>` : nothing}
      <table class="standings-table">
        <thead><tr>
          <th>${en.standings.cols.pos}</th><th class="team-cell">${en.standings.cols.team}</th>
          ${columns.map((c) => html`<th>${c.label}</th>`)}
        </tr></thead>
        <tbody>${group.standings.map((row, i) => this.rowTemplate(row, i, columns))}</tbody>
      </table>`;
  }

  private rowTemplate(row: StandingsRow, i: number, columns: StandingsColumn[]): TemplateResult {
    return html`
      <tr class=${MEDALS[i] || ''} data-team=${row.idx}>
        <td class="pos-cell"><span class="pos-badge">${i + 1}</span>${this.moveBadge(row.idx)}</td>
        <td class="team-cell">${teamLabel(this.teams, row.idx)}</td>
        ${columns.map((c) => html`<td class="num ${c.className || ''}">${c.value(row)}</td>`)}
      </tr>`;
  }

  /** Arrow for places gained (green) or lost (red). */
  private moveBadge(idx: number): TemplateResult | typeof nothing {
    const n = this.moves.get(String(idx));
    if (!n) return nothing;
    const up = n > 0;
    const label = up ? en.standings.movedUp(Math.abs(n)) : en.standings.movedDown(Math.abs(n));
    return html`<span class="pos-move ${up ? 'up' : 'down'}" title=${label} aria-label=${label}>${up ? '▲' : '▼'}${Math.abs(n)}</span>`;
  }
}

if (!customElements.get('standings-table')) customElements.define('standings-table', StandingsTable);

declare global {
  interface HTMLElementTagNameMap {
    'standings-table': StandingsTable;
  }
}
````

## File: src/core/index.ts
````typescript
export * from './schedule.js';
export * from './draft.js';
export * from './archive.js';
export * from './playoffs.js';
export * from './americano.js';
````

## File: src/sports/padel/Padel.ts
````typescript
import { RacketSport } from '../RacketSport.js';
import type { Config, GroupStandings, Match, MatchResult, SetFormat, Team } from '../../types.js';
import { isRotationFormat, playerStandings, type RotationFormat } from '../../core/americano.js';
import { en } from '../../i18n/en.js';

// ---------------------------------------------------------------------------
// Padel — best of 3 sets to 6 games, deciding set as a super tie-break
// ---------------------------------------------------------------------------
// The format can be changed per tournament (config.setFormat). A tournament
// can also rotate partners (config.padelFormat: Americano or Mexicano): each
// team slot is then one player, matches are played to config.matchPoints and
// the standings rank players by points won (see core/americano.ts).

export const DEFAULT_MATCH_POINTS = 24;

export class Padel extends RacketSport {
  readonly id = 'padel';
  readonly name = 'Padel';
  readonly icon = '🎾';
  readonly defaultFormat: SetFormat = { sets: 3, gamesPerSet: 6, superTieBreak: true };

  ratingAttributes(): Record<string, string> {
    return en.players.padelAttributes;
  }

  /** Americano or Mexicano, or null for fixed pairs. */
  rotation(config?: Partial<Config> | null): RotationFormat | null {
    const f = config?.padelFormat;
    return isRotationFormat(f) ? f : null;
  }

  /** Rotating formats play each match to a total of points (4 to 99, 24 by default). */
  pointsPerMatch(config?: Partial<Config> | null): number | null {
    if (!this.rotation(config)) return null;
    const n = Number(config?.matchPoints);
    return Number.isInteger(n) && n >= 4 && n <= 99 ? n : DEFAULT_MATCH_POINTS;
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    if (!this.rotation(config)) return super.computeStandings(teamsArray, schedule, results, config);
    return [{ name: en.standings.generalStandings, standings: playerStandings(teamsArray, schedule, results) }];
  }

  /** Rotating formats have no playoffs. */
  getPlayoffWinner(game: Match, res: MatchResult | undefined, config?: Config): number | string | null {
    return this.rotation(config) ? null : super.getPlayoffWinner(game, res, config);
  }
}

export const padel = new Padel();
````

## File: src/sports/registry.ts
````typescript
import type { Sport } from './Sport.js';
import { football } from './football/Football.js';
import { padel } from './padel/Padel.js';
import { tennis } from './tennis/Tennis.js';

const sportsRegistry = new Map<string, Sport>();

// Register default sport
sportsRegistry.set('football', football);
sportsRegistry.set('futebol', football); // alias
sportsRegistry.set('padel', padel);
sportsRegistry.set('tennis', tennis);

export function registerSport(sport: Sport): void {
  sportsRegistry.set(sport.id, sport);
}

export function getSport(id?: string): Sport {
  if (id && sportsRegistry.has(id)) {
    return sportsRegistry.get(id)!;
  }
  // Default to football
  return football;
}

export function listSports(): Sport[] {
  return Array.from(new Set(sportsRegistry.values()));
}
````

## File: src/ui/players.ts
````typescript
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { state, normalizePlayer, defaultPlayerAttrs, persistPlayers, persistConfigTeams } from '../state.js';
import { getTeamName } from '../utils.js';
import { getPlayerRating } from '../algorithms.js';
import { getSport, listSports } from '../sports/registry.js';
import type { Player, RatingAttributes } from '../types.js';
import type { PlayerCards, AttributeValue } from '../components/PlayerCards.js';
import { attributesTemplate } from '../components/PlayerCards.js';
import { PlayerEditor } from '../components/PlayerEditor.js';
import type { EditorSport } from '../components/PlayerEditor.js';
import { dom, isAdminView } from './dom.js';
import { showToast } from './toasts.js';
import { renderSquadList, renderSquadPlayerFromDBDropdown } from './teams.js';
import { openDialog, openConfirm } from './modals.js';
import { renderDraftPlayerList } from './singular.js';
import { computeAllTimeStats, computeAllTimeRecords } from './history.js';
import type { ProfileStat } from '../sports/Sport.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Players tab (<player-cards>), the player editor and the player profile
// ---------------------------------------------------------------------------

function currentSportId(): string {
  return getSport(state.meta?.sport || state.config?.sport).id;
}

/** A player's ratings for one sport (football also reads the legacy `atributos`). */
function sportAttrs(p: Player, sportId: string): RatingAttributes {
  const id = getSport(sportId).id;
  return (id === 'football' ? (p.ratings?.football || p.atributos) : p.ratings?.[id]) || {};
}

/** The sport's attributes with the player's values, for the mini table. */
function attributeValues(p: Player, sportId: string): AttributeValue[] {
  const values = sportAttrs(p, sportId);
  return Object.entries(getSport(sportId).ratingAttributes())
    .map(([key, label]) => ({ label, value: Number(values[key]) || 0 }));
}

function teamOf(p: Player): string {
  return p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : en.players.noTeam;
}

export function renderPlayersList(): void {
  const list = dom.playersList as PlayerCards | undefined;
  if (!list) return;
  const sport = currentSportId();
  const search = ((dom.playerSearchInput as HTMLInputElement | undefined)?.value || '').toLowerCase();
  const players = state.players
    .filter((p) => !search || p.nome.toLowerCase().includes(search))
    .sort((a, b) => a.nome.localeCompare(b.nome));
  list.empty = search ? en.players.noPlayersFound : (isAdminView() ? en.players.noPlayersAdmin : en.players.noPlayersReadonly);
  list.cards = players.map((p) => ({
    id: p.id,
    name: p.nome,
    team: teamOf(p),
    rating: getPlayerRating(p, sport),
    attributes: attributeValues(p, sport),
  }));
}

/** Redraws everything that lists players (after a create, edit or delete). */
function refreshPlayerLists(): void {
  renderPlayersList();
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
  renderDraftPlayerList();
}

/** Wires the Players tab's card events; called once at start-up. */
export function bindPlayersEvents(): void {
  const list = dom.playersList;
  if (!list) return;
  list.addEventListener('player-profile', (e) => openPlayerProfile((e as CustomEvent<string>).detail));
  list.addEventListener('player-edit', (e) => openPlayerModal((e as CustomEvent<string>).detail));
  list.addEventListener('player-delete', (e) => confirmDeletePlayer((e as CustomEvent<string>).detail));
}

function confirmDeletePlayer(pid: string): void {
  const pl = state.players.find((p) => p.id === pid);
  openConfirm(en.players.deleteModalTitle, en.players.deleteModalPrompt(pl ? pl.nome : pid), async () => {
    state.players = state.players.filter((p) => p.id !== pid);
    (state.squads || []).forEach((squad, i) => {
      state.squads![i] = squad.filter((p) => p.id !== pid);
    });
    await persistPlayers();
    await persistConfigTeams();
    refreshPlayerLists();
  });
}

// ---------------------------------------------------------------------------
// Player editor (create / edit)
// ---------------------------------------------------------------------------

/** Every sport, with its icon, for the editor's sport selector. */
function editorSports(): EditorSport[] {
  return listSports().map((s) => ({ id: s.id, label: `${s.icon} ${s.name}`, attributes: s.ratingAttributes() }));
}

/** The player's ratings in every sport, with zeros where none were set. */
function allRatings(p: Player | null): Record<string, RatingAttributes> {
  const out: Record<string, RatingAttributes> = { ...(p?.ratings || {}) };
  listSports().forEach((s) => {
    const own = s.id === 'football' ? (p?.ratings?.football || p?.atributos) : p?.ratings?.[s.id];
    out[s.id] = { ...defaultPlayerAttrs(s.id), ...(own || {}) };
  });
  return out;
}

/**
 * Opens the player create/edit dialog.
 * @param pid - player to edit, or null to create one.
 */
export function openPlayerModal(pid: string | null = null): void {
  const existing = pid ? state.players.find((p) => p.id === pid) || null : null;
  const editor = new PlayerEditor();
  editor.sports = editorSports();
  editor.teams = Array.from({ length: state.scheduleTeamCount }, (_, i) => getTeamName(i));
  editor.load({ name: existing?.nome || '', teamIdx: existing?.teamIdx ?? null, ratings: allRatings(existing) }, currentSportId());
  showEditor(existing, editor);
}

function showEditor(existing: Player | null, editor: PlayerEditor): void {
  openDialog({
    title: existing ? en.players.editModalTitle : en.players.createModalTitle,
    body: html`${editor}`,
    confirm: { label: existing ? en.players.savePlayer : en.players.createPlayer, tone: 'green' },
    onConfirm: () => { savePlayer(existing, editor); },
  });
  editor.updateComplete.then(() => editor.querySelector('input')?.focus());
}

async function savePlayer(existing: Player | null, editor: PlayerEditor): Promise<void> {
  const { name, teamIdx, ratings } = editor.value;
  if (!name) {
    showToast(en.toasts.nameRequired, 'error');
    showEditor(existing, editor); // keeps what was typed
    return;
  }
  const fields = { nome: name, teamIdx, ratings, atributos: ratings.football || defaultPlayerAttrs('football') };

  let saved: Player | null;
  if (existing) {
    const idx = state.players.findIndex((p) => p.id === existing.id);
    const updated = normalizePlayer({ ...existing, ...fields });
    if (idx !== -1 && updated) state.players[idx] = updated;
    saved = updated;
    (state.squads || []).forEach((squad) => {
      const sp = squad.find((p) => p.id === existing.id);
      if (sp) sp.name = name;
    });
  } else {
    const created = normalizePlayer({ id: crypto.randomUUID(), ...fields });
    if (created) state.players.push(created);
    saved = created;
  }

  await persistPlayers();
  // The team picked in the editor is the player's squad in this tournament
  if (saved && (!existing || existing.teamIdx !== teamIdx)) await placeInSquad(saved, teamIdx);
  refreshPlayerLists();
  showToast(existing ? en.toasts.playerUpdated : en.toasts.playerCreated, 'ok');
}

/**
 * Moves a player to a team's squad in the tournament on screen (out of any
 * other squad), with the next jersey number; no team takes them out.
 */
async function placeInSquad(player: Player, teamIdx: number | null): Promise<void> {
  const squads = state.squads;
  if (!squads) return;
  const target = teamIdx !== null ? squads[teamIdx] : undefined;
  if (target?.some((p) => p.id === player.id)) return;
  if (target && !getSport(currentSportId()).usesJerseyNumbers && target.length >= 2) {
    showToast(en.toasts.pairFull, 'error');
    return;
  }
  squads.forEach((squad, i) => { squads[i] = squad.filter((p) => p.id !== player.id); });
  if (target) {
    const next = Math.max(0, ...target.map((p) => Number(p.num) || 0)) + 1;
    squads[teamIdx!].push({ id: player.id, num: next, name: player.nome });
  }
  await persistConfigTeams();
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
}

// ---------------------------------------------------------------------------
// Player profile
// ---------------------------------------------------------------------------
function statCard({ label, value, unit, wide }: ProfileStat): TemplateResult {
  return html`<div class="stat-card" style="text-align:center;${wide ? ' grid-column: span 2;' : ''}">
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value}${unit ? html` <span style="font-size:14px; font-weight:normal; color:var(--ink-faint);">${unit}</span>` : ''}</div></div>`;
}

export function openPlayerProfile(pId: string, tIdx: number | null = null): void {
  const dbPlayer = state.players.find((p) => p.id === pId) || null;
  const squadPlayer = tIdx !== null ? (state.squads?.[tIdx] || []).find((p) => p.id === pId) : undefined;
  if (!dbPlayer && !squadPlayer) return;

  const name = dbPlayer ? dbPlayer.nome : squadPlayer!.name;
  const num = squadPlayer ? squadPlayer.num : '?';
  const teamName = squadPlayer ? getTeamName(tIdx!) : teamOf(dbPlayer!);
  const sport = getSport(currentSportId());
  const totals = computeAllTimeStats()[pId] || { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
  const record = computeAllTimeRecords(sport)[pId] || { played: 0, won: 0 };
  // Every sport: matches and wins; then the sport's own (goals, assists… in football)
  const cards: ProfileStat[] = [
    { label: en.players.matchesPlayed, value: record.played },
    { label: en.players.wins, value: record.won },
    ...sport.profileStats(totals),
  ];

  const ratings = dbPlayer ? html`
    <div style="margin-top: 20px; padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="font-size:12px; font-weight:700; color:var(--ink-soft); text-transform:uppercase;">${en.players.attributeSportLabel} (${sport.icon} ${sport.name})</div>
        <div style="font-family:var(--font-display); font-size:14px; font-weight:700; color:var(--gold-dark);">★ ${getPlayerRating(dbPlayer, sport.id).toFixed(1)}</div>
      </div>
      ${attributesTemplate(attributeValues(dbPlayer, sport.id))}
    </div>` : '';

  openDialog({
    title: en.players.profileTitle,
    body: html`
      <div style="text-align:center; padding: 10px 0;">
        <div style="font-size:40px; margin-bottom:10px;">👤</div>
        <h2 style="font-size:24px; margin-bottom:4px;">${name}</h2>
        <div style="color:var(--ink-faint); font-weight:600;">${sport.usesJerseyNumbers ? en.players.jerseyTeamLabel(num, teamName) : teamName}</div>
      </div>
      ${ratings}
      <div class="stats-grid" style="margin-top:20px; grid-template-columns: 1fr 1fr;">
        ${cards.map(statCard)}
      </div>
      <p style="text-align:center; font-size:12px; color:var(--ink-faint); margin-top:8px;">${en.players.profileFooterNote}</p>`,
    cancel: { label: en.common.close, tone: 'paper' },
    confirm: null,
  });
}
````

## File: src/ui/stats.ts
````typescript
import { state } from '../state.js';
import { sideName, buildPlayerIndex } from '../utils.js';
import { GAME_STATUS } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import { RacketSport } from '../sports/RacketSport.js';
import type { GroupStandings, Score, StandingsRow } from '../types.js';
import type { StatsTable } from '../components/StatsTable.js';
import type { StatCard, StatCards } from '../components/StatCards.js';
import type { DashboardPodium } from '../components/DashboardPodium.js';
import type { DashboardLeaders } from '../components/DashboardLeaders.js';
import type { ScorerCount } from '../sports/Sport.js';
import '../components/StatsTable.js';
import '../components/StatCards.js';
import '../components/DashboardPodium.js';
import '../components/DashboardLeaders.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Stats tab, dashboard and the header ticker
// ---------------------------------------------------------------------------

/** What the dashboard, the Stats tab and the playoff draw need to know. */
export interface StatsSummary {
  groupsData: GroupStandings[];
  flatStandings: StandingsRow[];
  total: number;
  played: number;
  pendentes: number;
  totalGoals: number;
  media: number;
  racket: boolean;
  bestAtkLabel: string;
  bestDefLabel: string;
  mostWinsLabel: string;
  mostDrawsLabel: string;
  biggestWinLabel: string;
  totalRounds: number;
  currentRound: number | string;
}

/** Goals per player in the tournament and the single matches, most first. */
export function computeScorerStats(): ScorerCount[] {
  const playerIndex = buildPlayerIndex();
  const stats: Record<string, ScorerCount> = {};

  function addGoal(pId: string): void {
    if (pId === 'auto') return;
    if (!stats[pId]) {
      const info = playerIndex[pId] || { name: en.common.unknownPlayer, team: en.common.noTeam };
      stats[pId] = { name: info.name, team: info.team, count: 0 };
    }
    stats[pId].count++;
  }

  Object.keys(state.results).forEach((gi) => {
    const res = state.results[gi];
    if (!res || typeof res !== 'object' || !res.scorers) return;
    (res.scorers.home || []).forEach(addGoal);
    (res.scorers.away || []).forEach(addGoal);
  });

  state.jogosSingulares.forEach((jogo) => {
    (jogo.scorersA || []).forEach(addGoal);
    (jogo.scorersB || []).forEach(addGoal);
  });

  return Object.values(stats).sort((a, b) => b.count - a.count);
}

/** The summary cards, with racket-sport wording where the points are games. */
export function statCards(summary: StatsSummary): StatCard[] {
  const t = summary.racket ? { ...en.statsTab, ...en.statsTab.racket } : null;
  const cards: StatCard[] = [
    { label: en.statsTab.matchesPlayed, value: `${summary.played} / ${summary.total}` },
    { label: en.statsTab.remainingMatches, value: String(summary.pendentes) },
    { label: t ? t.gamesPlayed : en.statsTab.goalsScored, value: String(summary.totalGoals) },
    { label: t ? t.gamesPerMatchAvg : en.statsTab.goalsPerMatchAvg, value: summary.media.toFixed(2) },
    { label: t ? t.mostGamesWon : en.statsTab.bestAttack, value: summary.bestAtkLabel },
    { label: t ? t.fewestGamesLost : en.statsTab.bestDefense, value: summary.bestDefLabel },
    { label: en.statsTab.biggestBlowout, value: summary.biggestWinLabel },
    { label: en.statsTab.mostWins, value: summary.mostWinsLabel },
  ];
  // No draws in racket sports
  if (!summary.racket) cards.push({ label: en.statsTab.mostDraws, value: summary.mostDrawsLabel });
  return cards;
}

export function renderStatsGrid(summary: StatsSummary): void {
  const cards = dom.statsCards as StatCards | undefined;
  const table = dom.statsTable as StatsTable | undefined;
  if (!cards || !table) return;
  const sport = getSport(state.meta?.sport);
  cards.cards = statCards(summary);
  table.sport = sport;
  table.tally = sport.tallyPlayerStats(state.results, state.jogosSingulares);
  table.players = buildPlayerIndex();
}

/** Score text of a result, or '' when it is scheduled or empty. */
function playedScore(res: Score | string | undefined): string {
  if (!res) return '';
  if (typeof res === 'object') return res.status === GAME_STATUS.AGENDADO ? '' : (res.score || '');
  return String(res);
}

// ---------------------------------------------------------------------------
// General stats (dashboard, Stats tab and playoff generation)
// ---------------------------------------------------------------------------
export function computeStatsSummary(): StatsSummary {
  const teamsArray = (state.teams || []).slice(0, state.scheduleTeamCount);
  const sport = getSport(state.meta?.sport);
  const config = state.config!;
  const racket = sport instanceof RacketSport;
  const groupsData = sport.computeStandings(teamsArray, state.schedule, state.results, config);
  const flatStandings = groupsData.flatMap((g) => g.standings);

  const total = state.schedule.length;
  const played = Object.keys(state.results)
    .filter((k) => /^\d+-\d+( \d+-\d+)*$/.test(playedScore(state.results[k]).trim())).length;
  const totalGoals = flatStandings.reduce((s, t) => s + t.GM, 0);
  const media = played > 0 ? totalGoals / played : 0;
  const withGames = flatStandings.filter((s) => s.J > 0);

  function pick(arr: StandingsRow[], better: (b: StandingsRow, a: StandingsRow) => boolean): StandingsRow | null {
    if (!arr.length) return null;
    return arr.reduce((a, b) => (better(b, a) ? b : a));
  }

  const bestAtk = pick(withGames, (b, a) => b.GM > a.GM);
  const bestDef = pick(withGames, (b, a) => b.GS < a.GS);
  const mostWins = pick(withGames, (b, a) => b.V > a.V);
  const mostDraws = pick(withGames, (b, a) => b.E > a.E);

  let biggestWin: { diff: number; text: string } | null = null;
  state.schedule.forEach((g, gi) => {
    const resStr = playedScore(state.results[gi]);
    if (!resStr) return;
    const pts = sport instanceof RacketSport ? sport.scoreTotals(resStr, config) : sport.scoreTotals(resStr);
    if (!pts) return;
    const diff = Math.abs(pts.home - pts.away);
    if (!biggestWin || diff > biggestWin.diff) {
      biggestWin = { diff, text: `${sideName(g, 'home')} ${resStr} ${sideName(g, 'away')}` };
    }
  });

  const roundPlayed: Record<string, { played: number; total: number }> = {};
  state.schedule.forEach((g, gi) => {
    const r = (roundPlayed[g.jornada] ||= { played: 0, total: 0 });
    r.total++;
    // Started matches count, even before the first goal
    const val = state.results[gi];
    if (val && typeof val === 'object' ? val.status !== GAME_STATUS.AGENDADO : String(val ?? '').trim() !== '') r.played++;
  });

  let currentRound = state.roundsMeta.length ? state.roundsMeta[state.roundsMeta.length - 1].jornada : 0;
  for (const rm of state.roundsMeta) {
    const rp = roundPlayed[rm.jornada] || { played: 0, total: 0 };
    if (rp.played < rp.total) { currentRound = rm.jornada; break; }
  }

  const win = biggestWin as { diff: number; text: string } | null;
  return {
    groupsData,
    flatStandings,
    total,
    played,
    pendentes: total - played,
    totalGoals,
    media,
    racket,
    bestAtkLabel: bestAtk ? `${bestAtk.name} — ${racket ? en.statsTab.racket.gamesLabel(bestAtk.GM) : en.statsTab.goalsLabel(bestAtk.GM)}` : '—',
    bestDefLabel: bestDef ? `${bestDef.name} — ${racket ? en.statsTab.racket.lostLabel(bestDef.GS) : en.statsTab.concededLabel(bestDef.GS)}` : '—',
    mostWinsLabel: mostWins ? `${mostWins.name} — ${en.statsTab.winsLabel(mostWins.V)}` : '—',
    mostDrawsLabel: mostDraws ? `${mostDraws.name} — ${en.statsTab.drawsLabel(mostDraws.E)}` : '—',
    biggestWinLabel: win ? `${win.text}  ${en.statsTab.diffLabel(win.diff)}` : '—',
    totalRounds: state.roundsMeta.length,
    currentRound,
  };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export function renderDashboard(summary: StatsSummary): void {
  dom.tournamentTitle.textContent = (state.config?.nome || en.common.tournament).toUpperCase();

  const podium = dom.dashboardPodium as DashboardPodium | undefined;
  if (podium) {
    podium.teams = state.teams || [];
    podium.rows = summary.flatStandings.slice().sort((a, b) =>
      (b.Pts - a.Pts) || ((b.DG || 0) - (a.DG || 0)) || (b.GM - a.GM));
  }
  const cards = dom.dashboardStats as StatCards | undefined;
  if (cards) cards.cards = statCards(summary);
  const leaders = dom.dashboardScorers as DashboardLeaders | undefined;
  if (leaders) leaders.board = getSport(state.meta?.sport).leaderboard(summary.flatStandings, computeScorerStats());
}

export function updateTicker(summary: StatsSummary): void {
  if (!summary.totalRounds) {
    dom.marqueeTicker.textContent = en.header.noSchedule;
    return;
  }
  dom.marqueeTicker.textContent = en.header.roundTicker(
    summary.currentRound,
    summary.totalRounds,
    summary.played,
    summary.total,
  );
}
````

## File: src/ui/tournaments.ts
````typescript
import { html } from 'lit';
import { getSport } from '../sports/registry.js';
import type { TournamentList, TournamentEntry } from '../components/TournamentList.js';
import { sportBadge } from '../components/TournamentList.js';
import '../components/TournamentList.js';
import { dom } from './dom.js';
import { openDialog } from './modals.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Active tournaments (dashboard), the header and the new tournament dialog
// ---------------------------------------------------------------------------
// The list's events (tournament-select, tournament-finish) are handled in main.js.

export function renderTournamentsList(tournaments: TournamentEntry[], currentId: string): void {
  const list = dom.listaTorneiosAtivos as TournamentList | undefined;
  if (!list) return;
  list.tournaments = tournaments;
  list.currentId = currentId;
  if (dom.torneiosCount) dom.torneiosCount.textContent = tournaments.length ? `(${tournaments.length})` : '';
}

const COLLAPSED_KEY = 'torneio_tournaments_collapsed';

/** Folds or unfolds the Active Tournaments card. */
function setTournamentsOpen(open: boolean): void {
  dom.btnToggleTorneios?.setAttribute('aria-expanded', String(open));
  if (dom.torneiosBody) dom.torneiosBody.hidden = !open;
}

/** Wires the fold button of Active Tournaments; the choice is remembered on this device. */
export function bindTournamentsToggle(): void {
  let collapsed = false;
  try { collapsed = localStorage.getItem(COLLAPSED_KEY) === '1'; } catch { /* storage blocked */ }
  setTournamentsOpen(!collapsed);
  dom.btnToggleTorneios?.addEventListener('click', () => {
    const open = dom.btnToggleTorneios.getAttribute('aria-expanded') !== 'true';
    setTournamentsOpen(open);
    try { localStorage.setItem(COLLAPSED_KEY, open ? '0' : '1'); } catch { /* storage blocked */ }
  });
}

/** Header title and sport badge of the tournament on screen; shows only its sport's settings. */
export function renderHeaderTournament(meta: { name?: string; sport?: string } | null | undefined): void {
  if (dom.tournamentTitle) dom.tournamentTitle.textContent = meta?.name || en.common.tournament;
  if (dom.headerSportBadge) dom.headerSportBadge.textContent = sportBadge(meta?.sport);
  if (typeof document === 'undefined') return;
  const sportId = getSport(meta?.sport).id;
  document.body.dataset.sport = sportId;
  document.querySelectorAll<HTMLElement>('[data-sport-only]').forEach((el) => {
    // A space-separated list of sport ids, e.g. "padel tennis"
    el.hidden = !(el.dataset.sportOnly || '').split(' ').includes(sportId);
  });
}

export interface NewTournament {
  name: string;
  sport: string;
  numEquipas: number;
}

/**
 * Opens the new tournament dialog.
 * @param sports - the sports the user may create tournaments in
 */
export function openNovoTorneioModal(onCreate: (t: NewTournament) => void, sports: { id: string; label: string }[]): void {
  const value = (id: string) => dom.modalBody.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)?.value || '';
  openDialog({
    title: en.tournaments.modalTitle,
    body: html`
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="field">
          <label for="novoTorneioNome">${en.tournaments.nameLabel}</label>
          <input type="text" id="novoTorneioNome" class="input" placeholder=${en.tournaments.namePlaceholder} maxlength="60" required>
        </div>
        <div class="field">
          <label for="novoTorneioSport">${en.tournaments.sportLabel}</label>
          <select id="novoTorneioSport" class="input">${sports.map((s) => html`<option value=${s.id}>${s.label}</option>`)}</select>
        </div>
        <div class="field">
          <label for="novoTorneioEquipas">${en.tournaments.numTeamsLabel}</label>
          <input type="number" id="novoTorneioEquipas" class="input" min="2" max="32" value="8">
        </div>
      </div>`,
    confirm: { label: en.tournaments.createButton, tone: 'gold' },
    onConfirm: () => onCreate({
      name: value('novoTorneioNome').trim() || en.tournaments.defaultNewName,
      sport: value('novoTorneioSport') || 'football',
      numEquipas: Number(value('novoTorneioEquipas')) || 8,
    }),
  });
}
````

## File: tests/core/americano.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  americanoRounds, mexicanoRound, rotationSchedule, playerStandings, lastRoundFinished,
  validPlayerCount, sidePlayers, parsePoints,
} from '../../src/core/americano.js';
import { padel } from '../../src/sports/padel/Padel.js';
import type { Config, MatchResult } from '../../src/types.js';

const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

describe('americanoRounds', () => {
  it('needs a multiple of 4 players', () => {
    expect([4, 8, 12].map(validPlayerCount)).toEqual([true, true, true]);
    expect([2, 6, 10].map(validPlayerCount)).toEqual([false, false, false]);
    expect(americanoRounds(6)).toEqual([]);
  });

  it.each([4, 8, 12])('makes every player partner every other player exactly once with %i players', (n) => {
    const rounds = americanoRounds(n);
    expect(rounds).toHaveLength(n - 1);
    const partners = new Map<string, number>();
    rounds.forEach((matches) => {
      expect(matches).toHaveLength(n / 4);
      // Everyone plays every round, once
      const seen = matches.flatMap((m) => [...m.home, ...m.away]).sort((a, b) => a - b);
      expect(seen).toEqual(Array.from({ length: n }, (_, i) => i));
      matches.forEach((m) => [m.home, m.away].forEach(([a, b]) => {
        partners.set(pairKey(a, b), (partners.get(pairKey(a, b)) || 0) + 1);
      }));
    });
    expect(partners.size).toBe((n * (n - 1)) / 2);
    expect([...partners.values()].every((c) => c === 1)).toBe(true);
  });
});

describe('mexicanoRound', () => {
  it('pairs 1st with 4th against 2nd and 3rd in each group of four', () => {
    expect(mexicanoRound([7, 3, 5, 1, 0, 2, 4, 6])).toEqual([
      { home: [7, 1], away: [3, 5] },
      { home: [0, 6], away: [2, 4] },
    ]);
  });
});

describe('rotationSchedule', () => {
  it('stores the first player of each pair in home / away and the second in partners', () => {
    const { games, rounds } = rotationSchedule([[{ home: [0, 3], away: [1, 2] }]], 5);
    expect(rounds).toEqual([{ jornada: 5, bye: null }]);
    expect(games[0]).toEqual({ jornada: 5, home: 0, away: 1, partners: { home: 3, away: 2 } });
    expect(sidePlayers(games[0], 'home')).toEqual([0, 3]);
    expect(sidePlayers({ jornada: 1, home: 4, away: 5 }, 'away')).toEqual([5]);
  });
});

describe('playerStandings', () => {
  const teams = ['Ana', 'Bruno', 'Carla', 'Rui'].map((name) => ({ name, color: '#000' }));
  const { games } = rotationSchedule(americanoRounds(4));

  it('gives every player the points of their pair and ranks by points won', () => {
    const results: Record<number, MatchResult> = {
      0: { score: '15-9', status: 'terminado' },
      1: { score: '12-12', status: 'terminado' },
    };
    const rows = playerStandings(teams, games, results);
    const byIdx = new Map(rows.map((r) => [r.idx, r]));
    const [h1, h2] = sidePlayers(games[0], 'home');
    expect(byIdx.get(h1)).toMatchObject({ J: 2 });
    expect(byIdx.get(h1)!.GM).toBe(15 + 12);
    expect(byIdx.get(h2)!.V).toBe(1);
    expect(rows[0].Pts).toBeGreaterThanOrEqual(rows[3].Pts);
    expect(rows.reduce((s, r) => s + r.J, 0)).toBe(8);
  });

  it('ignores scheduled matches', () => {
    const rows = playerStandings(teams, games, { 0: { score: '10-14', status: 'agendado' } });
    expect(rows.every((r) => r.J === 0)).toBe(true);
  });

  it('knows when the last round has been played', () => {
    const one = rotationSchedule([[{ home: [0, 3], away: [1, 2] }]]).games;
    expect(lastRoundFinished(one, {})).toBe(false);
    expect(lastRoundFinished(one, { 0: { score: '13-11', status: 'terminado' } })).toBe(true);
  });
});

describe('padel played to points', () => {
  const config = (extra: Partial<Config> = {}): Config => ({
    nome: 'A', numEquipas: 4, numGrupos: 1, numVoltas: 1, pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0,
    bonusGoleada: 0, golosGoleada: 99, mataMata: false, numPlayoffTeams: 2, sport: 'padel', ...extra,
  });

  it('plays to 24 points by default only in Americano and Mexicano', () => {
    expect(padel.pointsPerMatch(config())).toBeNull();
    expect(padel.pointsPerMatch(config({ padelFormat: 'americano' }))).toBe(24);
    expect(padel.pointsPerMatch(config({ padelFormat: 'mexicano', matchPoints: 32 }))).toBe(32);
    expect(padel.pointsPerMatch(config({ padelFormat: 'americano', matchPoints: 2 }))).toBe(24);
  });

  it('adds points until the total and cancels them', () => {
    const cfg = config({ padelFormat: 'americano', matchPoints: 4 });
    let res: MatchResult | undefined;
    for (const side of ['home', 'home', 'away', 'home', 'away'] as const) res = padel.addPoint(res, side, cfg);
    expect(parsePoints(typeof res === 'object' ? res.score : res)).toEqual({ home: 3, away: 1 });
    expect(padel.removePoint(res, 'home').score).toBe('2-1');
  });

  it('finishes the match when the points total is reached', () => {
    const cfg = config({ padelFormat: 'americano', matchPoints: 4 });
    expect(padel.addPoint({ score: '2-0', status: 'decorrer' }, 'away', cfg).status).toBe('decorrer');
    expect(padel.addPoint({ score: '2-1', status: 'decorrer' }, 'away', cfg)).toEqual({ score: '2-2', status: 'terminado' });
    expect(padel.removePoint({ score: '2-2', status: 'terminado' }, 'away', cfg)).toEqual({ score: '2-1', status: 'decorrer' });
  });

  it('ranks players, not pairs, with points columns', () => {
    const cfg = config({ padelFormat: 'americano' });
    const teams = ['A', 'B', 'C', 'D'].map((name) => ({ name, color: '#000' }));
    const { games } = rotationSchedule(americanoRounds(4));
    const groups = padel.computeStandings(teams, games, { 0: { score: '20-4', status: 'terminado' } }, cfg);
    expect(groups).toHaveLength(1);
    expect(groups[0].standings[0].Pts).toBe(20);
    expect(padel.standingsColumns(cfg)[0].label).toBe('PW');
    expect(padel.standingsColumns()[0].label).toBe('Pts');
  });

  it('reports points, never sets, as live events', () => {
    const cfg = config({ padelFormat: 'americano' });
    const ev = padel.resultEvents({ 0: { score: '5-6', status: 'decorrer' } }, { 0: { score: '6-6', status: 'decorrer' } }, cfg);
    expect(ev).toEqual([{ type: 'game', gi: '0', side: 'home' }]);
  });
});
````

## File: tests/core/draft.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  getPlayerRating,
  getTeamTotalRating,
  snakeDraft,
  balancedPairs,
  balancedDraft,
  type PlayerWithAttributes,
} from '../../src/core/draft.js';

describe('ratings e snake draft', () => {
  const p = (name: string, v: number): PlayerWithAttributes => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });

  it('calcula o rating como média dos atributos', () => {
    expect(getPlayerRating(p('x', 4))).toBe(4);
    expect(getPlayerRating({})).toBe(0);
    expect(getTeamTotalRating([p('x', 4), p('y', 3.5)])).toBe(7.5);
  });

  it('calcula rating específico para cada modalidade', () => {
    const multiPlayer: PlayerWithAttributes = {
      name: 'Atleta',
      ratings: {
        football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
        padel: { volley: 2, smash: 2, lob: 2, walls: 2, defense: 2, fitness: 2 },
      },
    };
    expect(getPlayerRating(multiPlayer, 'football')).toBe(5);
    expect(getPlayerRating(multiPlayer, 'padel')).toBe(2);
    // Modalidade não registada faz fallback para football
    expect(getPlayerRating(multiPlayer, 'basquetebol')).toBe(5);
    expect(getTeamTotalRating([multiPlayer], 'padel')).toBe(2);
  });

  it('padel só usa os atributos de padel', () => {
    const footballOnly: PlayerWithAttributes = {
      name: 'Avançado',
      ratings: { football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 } },
    };
    expect(getPlayerRating(footballOnly, 'padel')).toBe(0);
    // Old padel ratings saved with football keys count as unrated
    const legacy: PlayerWithAttributes = { name: 'X', ratings: { padel: { velocidade: 4 } } };
    expect(getPlayerRating(legacy, 'padel')).toBe(0);
    const half: PlayerWithAttributes = { name: 'Y', ratings: { padel: { volley: 3, smash: 3, lob: 3 } } };
    expect(getPlayerRating(half, 'padel')).toBe(1.5);
  });

  it('sorteia pares equilibrados: o melhor com o pior', () => {
    const players = [5, 4, 3, 2, 1, 0].map((v) => ({
      name: `p${v}`,
      ratings: { padel: { volley: v, smash: v, lob: v, walls: v, defense: v, fitness: v } },
    }));
    const { pairs, leftOver } = balancedPairs(players, 'padel');
    expect(pairs.map((pr) => pr.map((x) => x.name))).toEqual([['p5', 'p0'], ['p4', 'p1'], ['p3', 'p2']]);
    expect(leftOver).toBeNull();
    const odd = balancedPairs(players.slice(0, 5), 'padel');
    expect(odd.pairs).toHaveLength(2);
    expect(odd.leftOver?.name).toBe('p3');
  });

  it('distribui os picks no padrão A, B, B, A, A, B, B, A', () => {
    const players = [8, 7, 6, 5, 4, 3, 2, 1].map((v) => p(`p${v}`, v / 2));
    const { equipaA, equipaB } = snakeDraft(players);
    expect(equipaA.map((x) => x.name)).toEqual(['p8', 'p5', 'p4', 'p1']);
    expect(equipaB.map((x) => x.name)).toEqual(['p7', 'p6', 'p3', 'p2']);
  });

  it('faz draft equilibrado baseado na modalidade selecionada', () => {
    // p1 é forte no padel (5) mas fraco no futebol (1)
    // p2 é forte no futebol (5) mas fraco no padel (1)
    const p1: PlayerWithAttributes = {
      name: 'Especialista Padel',
      ratings: {
        football: { velocidade: 1, finalizacao: 1, passe: 1, drible: 1, defesa: 1, fisico: 1 },
        padel: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
      },
    };
    const p2: PlayerWithAttributes = {
      name: 'Especialista Futebol',
      ratings: {
        football: { velocidade: 5, finalizacao: 5, passe: 5, drible: 5, defesa: 5, fisico: 5 },
        padel: { velocidade: 1, finalizacao: 1, passe: 1, drible: 1, defesa: 1, fisico: 1 },
      },
    };
    // No padel, draft deve colocar p1 e p2 em equipas opostas
    const draftPadel = balancedDraft([p1, p2], 'padel');
    expect(draftPadel.equipaA.length).toBe(1);
    expect(draftPadel.equipaB.length).toBe(1);
    expect(draftPadel.equipaA[0].name).not.toBe(draftPadel.equipaB[0].name);
  });
});

describe('equipas equilibradas', () => {
  const p = (name: string, v: number): PlayerWithAttributes => ({
    name,
    atributos: { velocidade: v, finalizacao: v, passe: v, drible: v, defesa: v, fisico: v },
  });
  const sum = (arr: PlayerWithAttributes[]) => arr.reduce((s, x) => s + getPlayerRating(x), 0);
  const gap = ({ equipaA, equipaB }: { equipaA: PlayerWithAttributes[]; equipaB: PlayerWithAttributes[] }) =>
    Math.round(Math.abs(sum(equipaA) - sum(equipaB)) * 10) / 10;

  it('encontra a divisão perfeita que o snake draft falha', () => {
    const players = [10, 9, 6, 5, 3, 1].map((v) => p(`p${v}`, v / 2));
    expect(gap(snakeDraft(players))).toBe(1);
    const out = balancedDraft(players);
    expect(gap(out)).toBe(0);
    expect(out.equipaA.length).toBe(3);
    expect(out.equipaB.length).toBe(3);
  });

  it('nunca fica pior que o snake draft e mantém o tamanho das equipas', () => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let n = 2; n <= 24; n++) {
      const players = Array.from({ length: n }, (_, i) => p(`p${i}`, Math.round(rand() * 50) / 10));
      const out = balancedDraft(players);
      expect(gap(out)).toBeLessThanOrEqual(gap(snakeDraft(players)));
      expect(Math.abs(out.equipaA.length - out.equipaB.length)).toBeLessThanOrEqual(1);
      expect(out.equipaA.length + out.equipaB.length).toBe(n);
    }
  });

  it('lida com um só jogador', () => {
    const out = balancedDraft([p('a', 3)]);
    expect(out.equipaA.length + out.equipaB.length).toBe(1);
  });
});
````

## File: tests/torneios.test.ts
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
  initFirebaseListener: vi.fn(),
  onFirebaseStateChange: vi.fn(),
  onFirebasePushError: vi.fn(),
  setSyncedSnapshot: vi.fn(),
  initAuth: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOutUser: vi.fn(),
  getCurrentUser: vi.fn(),
  listenUsers: vi.fn(),
  listenLog: vi.fn(),
  setUserRole: vi.fn(),
  listenTournaments: vi.fn(),
  createTournament: vi.fn(),
  finishTournament: vi.fn(),
  setActiveTournamentId: vi.fn(),
}));

import { renderHeaderTournament } from '../src/ui/tournaments.js';
import { activeTournaments, sportBadge } from '../src/components/TournamentList.js';
import { dom } from '../src/ui/dom.js';
import { getLastViewedTournamentId, setLastViewedTournamentId } from '../src/main.js';

describe('tournament list', () => {
  it('keeps only active tournaments', () => {
    const list = [
      { id: 't1', name: 'Active', sport: 'football', status: 'active' as const, createdAt: 1000 },
      { id: 't2', name: 'Archived', sport: 'padel', status: 'finished' as const, createdAt: 2000 },
    ];
    expect(activeTournaments(list).map((t) => t.id)).toEqual(['t1']);
    expect(activeTournaments(null)).toEqual([]);
  });

  it('labels each sport with its icon, falling back to football', () => {
    expect(sportBadge('padel')).toBe('🎾 Padel');
    expect(sportBadge('futebol')).toBe('⚽ Football');
    expect(sportBadge(undefined)).toBe('⚽ Football');
    expect(sportBadge('curling')).toBe('⚽ Football');
  });
});

describe('ui/tournaments header', () => {
  let title: { textContent: string };
  let badge: { textContent: string };

  beforeEach(() => {
    title = { textContent: '' };
    badge = { textContent: '' };
    dom.tournamentTitle = title as unknown as HTMLElement;
    dom.headerSportBadge = badge as unknown as HTMLElement;
  });

  it('shows the tournament name and sport', () => {
    renderHeaderTournament({ name: 'Spring League', sport: 'padel' });
    expect(title.textContent).toBe('Spring League');
    expect(badge.textContent).toBe('🎾 Padel');
  });

  it('falls back to a generic title', () => {
    renderHeaderTournament(null);
    expect(title.textContent).toBe('Tournament');
    expect(badge.textContent).toBe('⚽ Football');
  });
});

describe('Persistência de dispositivo (last viewed tournament)', () => {
  let storageMap: Record<string, string>;

  beforeEach(() => {
    storageMap = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => storageMap[key] || null),
      setItem: vi.fn((key: string, val: string) => { storageMap[key] = String(val); }),
      removeItem: vi.fn((key: string) => { delete storageMap[key]; }),
      clear: vi.fn(() => { storageMap = {}; }),
    };
    vi.stubGlobal('localStorage', mockStorage);
  });

  it('devolve default se não existir torneio no localStorage', () => {
    expect(getLastViewedTournamentId()).toBe('default');
  });

  it('guarda e recupera o ID do torneio visualizado', () => {
    setLastViewedTournamentId('t_primavera_2026');
    expect(getLastViewedTournamentId()).toBe('t_primavera_2026');
  });

  it('remove o item se for passado null/vazio', () => {
    setLastViewedTournamentId('t1');
    expect(getLastViewedTournamentId()).toBe('t1');
    setLastViewedTournamentId('');
    expect(getLastViewedTournamentId()).toBe('default');
  });
});
````

## File: css/jogo.css
````css
/* ---------------------------------------------------------------------
   Janela do jogo
   --------------------------------------------------------------------- */
.fixture-open {
  cursor: pointer;
  transition: background-color var(--quick) ease;
}

/* Only where there is a real pointer: on a phone a tapped row keeps the
   hover background until something else is touched. */
@media (hover: hover) {
  .fixture-open:hover {
    background: var(--paper);
  }
}

.fixture-open:active {
  background: var(--paper);
}

/* Transição ao mudar de separador */
.panel.active {
  animation: panel-in .22s var(--ease-out);
}

@keyframes panel-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

/* Janela do jogo */
.game-modal {
  max-width: 560px;
  padding: 0;
  overflow: hidden auto;
  animation: modal-in .22s var(--ease-out);
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to { opacity: 1; transform: none; }
}

.modal.game-modal .modal-actions {
  display: block !important;
  padding: 14px 16px 16px;
  margin-top: 0;
}

.modal.game-modal .modal-actions .btn {
  width: 100% !important;
}

/* As escolhas (MVP) abrem por cima da janela do jogo */
#modalOverlay {
  z-index: 1100;
}

@media (prefers-reduced-motion: reduce) {
  .panel.active,
  .game-modal,
  .status-decorrer {
    animation: none !important;
  }
}
````

## File: css/layout.css
````css
/* ---------- Marquee header ---------- */
.marquee {
  position: relative;
  background: linear-gradient(180deg, var(--pitch-800), var(--pitch-900));
  color: #fff;
  padding: 22px 24px 18px;
  overflow: hidden;
}

.marquee-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, .04) 0 36px, transparent 36px 78px);
  pointer-events: none;
}

.marquee-content {
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
}

.marquee-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
}

.header-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.save-pill {
  font-size: 11px;
  letter-spacing: .04em;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .12);
  color: #dfe8de;
  transition: background .2s, color .2s;
}

.save-pill.pill-ok {
  background: rgba(203, 161, 53, .22);
  color: var(--gold);
}

.save-pill.pill-error {
  background: rgba(179, 38, 30, .28);
  color: #ffb4ae;
}

.backup-pill {
  font-size: 11px;
  letter-spacing: .04em;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .08);
  color: #9ab09a;
  transition: background .2s, color .2s;
}

.backup-pill.pill-fresh {
  background: rgba(47, 122, 79, .28);
  color: #7dd8a0;
}

.theme-toggle-btn {
  background: rgba(255, 255, 255, .12);
  border: none;
  color: #dfe8de;
  border-radius: 999px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background .2s ease, transform .1s ease;
  line-height: 1;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, .2);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.dev-role-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(203, 161, 53, 0.16);
  border: 1px solid rgba(203, 161, 53, 0.4);
  padding: 3px 8px;
  border-radius: 999px;
  transition: background var(--quick) var(--ease-out), border-color var(--quick) var(--ease-out);
}

.dev-role-container:hover {
  background: rgba(203, 161, 53, 0.28);
  border-color: var(--gold);
}

.dev-role-label {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.06em;
  user-select: none;
}

.dev-role-select {
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.dev-role-select option {
  background: var(--card);
  color: var(--ink);
}

#tournamentTitle {
  font-size: clamp(28px, 6vw, 44px);
  font-weight: 700;
  text-transform: uppercase;
  margin: 6px 0 10px;
  line-height: 1.05;
}

.marquee-ticker {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: .08em;
  background: rgba(0, 0, 0, .28);
  border: 1px solid rgba(255, 255, 255, .14);
  padding: 5px 12px;
  border-radius: 6px;
  color: #EAF0E7;
}

/* ---------- Toolbar ---------- */
.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 24px;
  background: var(--pitch-700);
}

.toolbar-sep {
  width: 1px;
  background: rgba(255, 255, 255, .2);
  margin: 0 2px;
  align-self: stretch;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: transform var(--press) var(--ease-out), filter var(--press) ease;
}

.btn:active {
  transform: scale(.97);
}

.btn-gold {
  background: var(--gold);
  color: var(--pitch-900);
}

.btn-gold:hover {
  filter: brightness(1.08);
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, .4);
}

.btn-outline:hover {
  border-color: #fff;
}

.btn-ghost {
  background: rgba(255, 255, 255, .1);
  color: #fff;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, .18);
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}

.btn-danger:hover {
  filter: brightness(1.08);
}

.btn-teal {
  background: rgba(47, 122, 79, .55);
  color: #d0f0dc;
  border: 1.5px solid rgba(125, 216, 160, .35);
}

.btn-teal:hover {
  background: rgba(47, 122, 79, .80);
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* ---------- Tabs ---------- */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 10px 20px 0;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  transition: background-color 0.3s;
}

.tab {
  background: none;
  border: none;
  padding: 10px 14px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  flex: 0 0 auto;
}

.tab.active {
  color: var(--pitch-800);
  border-bottom-color: var(--gold);
}

.tab:hover:not(.active) {
  color: var(--pitch-700);
}

[data-theme="dark"] .tab.active {
  color: var(--gold);
}

[data-theme="dark"] .tab:hover:not(.active) {
  color: var(--ink);
}

/* ---------- Tabs Dropdown ---------- */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--card);
  min-width: 160px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--line);
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  z-index: 100;
  flex-direction: column;
  padding: 4px 0;
}

.dropdown:hover .dropdown-content,
.dropdown:focus-within .dropdown-content,
.dropdown.open .dropdown-content {
  display: flex;
}

.dropdown-content .tab {
  width: 100%;
  text-align: left;
  border: none !important;
  border-bottom: 1px solid var(--line) !important;
  padding: 10px 16px;
  border-radius: 0;
  margin: 0;
}

.dropdown-content .tab:last-child {
  border-bottom: none !important;
}

.dropdown-content .tab:hover {
  background-color: var(--paper);
}

/* ---------- Content ---------- */
.content {
  padding: 22px 20px 0;
}

.panel {
  display: none;
}

.panel.active {
  display: block;
  animation: fadein .25s ease;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 18px;
  transition: background-color 0.3s, border-color 0.3s;
}

.section-title {
  font-size: 19px;
  text-transform: uppercase;
  letter-spacing: .02em;
  color: var(--pitch-800);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

[data-theme="dark"] .section-title {
  color: var(--ink);
}

.section-sub {
  font-size: 13px;
  color: var(--ink-faint);
  margin: -8px 0 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
````

## File: docs/sports.md
````markdown
# Sports

![One tournament, one sport](assets/illustrations/17-desportos.jpg)

Every tournament has one sport, chosen when it is created and fixed afterwards (`meta.sport`). The sport decides how a match is scored, how the standings are ranked, what the match window shows and which player ratings are used. The schedule, groups, playoffs, archive and permissions work the same for every sport.

| | ⚽ Football | 🎾 Padel | 🎾 Padel Americano / Mexicano | 🎾 Tennis |
|---|---|---|---|---|
| **Score** | Goals, `3-1` | Games of each set, `6-4 3-6 10-7` | Points to a total, `15-9` of 24 | Games of each set, `6-4 6-7 7-5` |
| **Entered** | ＋ / − per goal (scorer and assist) or typed | ＋ / − one game | ＋ / − one point | ＋ / − one game |
| **Default format** | Configurable points per win, draw and loss, blowout bonus | Best of 3, 6 games, super tie-break | 24 points per match | Best of 3, 6 games, full deciding set |
| **Draws** | Yes (penalties in playoffs) | No | Yes (equal points) | No |
| **Ranked by** | Pts → GD → GF → head-to-head | Matches won (Win points, 1 by default) → set difference → game difference → head-to-head | Points won → point difference → wins | Matches won (Win points, 1 by default) → set difference → game difference → head-to-head |
| **Team** | A squad with jersey numbers | A pair, fixed or drawn by rating | One player; partners rotate every round | One player (singles) or two (doubles) |
| **Player stats** | Goals, assists, MVP | Games (no player events) | The standings are per player | Games (no player events) |
| **Player profile** | Matches, wins, goals, assists, MVP, scoring matches, record | Matches, wins | Matches, wins | Matches, wins |
| **Ratings** | Pace, Shooting, Passing, Dribbling, Defending, Physical | Volley, Smash, Lob, Wall play, Defense, Fitness | Padel ratings | Serve, Return, Forehand, Backhand, Volley, Fitness |
| **Match window** | `<football-score>` | `<padel-score>` | `<padel-score>` (points) | `<tennis-score>` |
| **Rules** | [Rules](rules.md#scoring) | [Padel](rules.md#padel) | [Americano and Mexicano](rules.md#americano-and-mexicano) | [Tennis](rules.md#tennis) |

## Admins per sport

An **Admin** manages the tournaments of the sports ticked for them in 👮 Users (`users/<uid>/admin/<sport>`), and only those: an admin of padel cannot change a football tournament. The **Master Admin** manages every sport. See [Accounts and roles](guide.md#accounts-and-roles).

## Code

Each sport is a class in `src/sports/` registered in `src/sports/registry.ts`: `football/Football.ts`, and the set-based sports on `RacketSport.ts` (`padel/Padel.ts`, `tennis/Tennis.ts`). Each has its own match window component next to it, and the racket ones share `RacketScore.ts`. Americano and Mexicano are padel formats (`config.padelFormat`) with their logic in `src/core/americano.ts`. See [Architecture](architecture.md) and, for adding a sport, [Multi-Sport](multi-sport.md).

## Planned

Basketball 🏀 ([#59](https://github.com/dioogomartiins/sports-tournament/issues/59)), handball 🤾 ([#60](https://github.com/dioogomartiins/sports-tournament/issues/60)) and volleyball 🏐 ([#61](https://github.com/dioogomartiins/sports-tournament/issues/61)) are planned, each with its own rules, score component and tests.
````

## File: src/components/ScheduleList.ts
````typescript
// ---------------------------------------------------------------------------
// <schedule-list> — the fixtures of every round (Schedule tab)
// ---------------------------------------------------------------------------
// A played match shows its score in place of "VS". Emits `open-match`
// (detail: gi) when a fixture is clicked and, when `editable`,
// `status-click` (detail: gi) when its status pill is.
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Config, Match, MatchResult, RoundMeta, Team } from '../types.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { racketBoard } from './racketBoard.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { teamLabel, sideLabel } from './templates.js';
import { groupRounds, statusBadge, statusOf } from './rounds.js';
import type { Round } from './rounds.js';

export class ScheduleList extends LightElement {
  static properties = {
    schedule: { attribute: false },
    roundsMeta: { attribute: false },
    results: { attribute: false },
    teams: { attribute: false },
    sport: { attribute: false },
    config: { attribute: false },
    editable: { attribute: false },
  };

  declare schedule: Match[];
  declare roundsMeta: RoundMeta[];
  declare results: Record<string | number, MatchResult>;
  declare teams: Team[];
  declare sport: Sport | null;
  declare config: Config | null;
  /** Can the profile change results? Otherwise the status pill is a label. */
  declare editable: boolean;

  constructor() {
    super();
    this.schedule = [];
    this.roundsMeta = [];
    this.results = {};
    this.teams = [];
    this.sport = null;
    this.config = null;
    this.editable = false;
  }

  render(): TemplateResult {
    if (!this.schedule.length) return html`<p class="empty">${en.schedule.empty}</p>`;
    return html`${groupRounds(this.schedule, this.roundsMeta).map((r) => this.roundTemplate(r))}`;
  }

  private roundTemplate(round: Round): TemplateResult {
    return html`
      <div class="round-card"><div class="round-head">${round.title}</div><div class="round-games">
        ${round.games.map(({ game, gi }) => this.sport instanceof RacketSport ? this.racketRow(this.sport, game, gi) : html`
          <div class="fixture fixture-open" data-game=${gi} title=${en.schedule.viewMatchTitle}
            @click=${() => this.emit('open-match', String(gi))}>
            <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
            <span class="fx-vs">${this.statusTemplate(gi)}${this.scoreTemplate(gi)}</span>
            <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
          </div>`)}
        ${round.bye !== null ? html`<div class="fixture fixture-bye">${en.schedule.byeRound(teamLabel(this.teams, round.bye))}</div>` : nothing}
      </div></div>`;
  }

  /** Padel and tennis: the scoreboard, read-only, and the status below. */
  private racketRow(sport: RacketSport, game: Match, gi: number): TemplateResult {
    return html`
      <div class="fixture fixture-open fixture-racket" data-game=${gi} title=${en.schedule.viewMatchTitle}
        @click=${() => this.emit('open-match', String(gi))}>
        ${racketBoard({ sport, config: this.config, result: this.results[gi], label: (side) => sideLabel(this.teams, game, side) })}
        <div class="rb-status">${this.statusTemplate(gi)}</div>
      </div>`;
  }

  private statusTemplate(gi: number): TemplateResult {
    const onClick = this.editable
      ? (e: Event) => {
        e.stopPropagation();
        this.emit('status-click', String(gi));
      }
      : undefined;
    return statusBadge(statusOf(this.results[gi]), onClick);
  }

  private scoreTemplate(gi: number): TemplateResult {
    const score = this.sport?.shownScore(this.results[gi], this.config) ?? null;
    return score
      ? html`<span class="fx-score">${score.home} - ${score.away}</span>`
      : html`<span>VS</span>`;
  }
}

if (!customElements.get('schedule-list')) customElements.define('schedule-list', ScheduleList);

declare global {
  interface HTMLElementTagNameMap {
    'schedule-list': ScheduleList;
  }
}
````

## File: src/core/draft.ts
````typescript
import type { Player } from '../types.js';
import { getSport } from '../sports/registry.js';

// ---------------------------------------------------------------------------
// Player Ratings & Snake / Balanced Draft (Single Match / Jogo Singular)
// ---------------------------------------------------------------------------

export type PlayerWithAttributes = Partial<Player> & {
  ratings?: Record<string, Record<string, unknown>>;
  atributos?: Record<string, unknown>;
};

/**
 * Calculates a player's overall rating for a given sport: the average of that
 * sport's rating attributes (0-5). Football also reads the legacy `atributos`;
 * other sports only their own ratings.
 * @returns rating rounded to 1 decimal place.
 */
export function getPlayerRating(
  player: PlayerWithAttributes | null | undefined,
  sport = 'football'
): number {
  if (!player) return 0;
  const s = getSport(sport);
  const ratings = player.ratings || {};
  const a = s.id === 'football' ? (ratings.football || player.atributos) : ratings[s.id];
  if (!a) return 0;
  const keys = Object.keys(s.ratingAttributes());
  const sum = keys.reduce((acc, k) => acc + (Number(a[k]) || 0), 0);
  return Math.round((sum / keys.length) * 10) / 10;
}

/**
 * Calculates the combined total rating of a team (sum of individual ratings).
 */
export function getTeamTotalRating(
  players: PlayerWithAttributes[],
  sport = 'football'
): number {
  return Math.round(players.reduce((s, p) => s + getPlayerRating(p, sport), 0) * 10) / 10;
}

export interface DraftTeams<T> {
  equipaA: T[];
  equipaB: T[];
}

/**
 * Splits players into two teams using the Snake Draft algorithm.
 *
 * Sorts players by descending rating and applies the pick pattern:
 * Pick 1 -> A, Pick 2 -> B, Pick 3 -> B, Pick 4 -> A, Pick 5 -> A, ...
 * (A, BB, AA, BB, AA, ...)
 */
export function snakeDraft<T extends PlayerWithAttributes>(
  players: T[],
  sport = 'football'
): DraftTeams<T> {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b, sport) - getPlayerRating(a, sport));
  const equipaA: T[] = [];
  const equipaB: T[] = [];

  sorted.forEach((player, i) => {
    const cycle = Math.floor(i / 2) % 2; // 0 or 1, alternates every 2 picks
    const pickA = (i === 0) || (i % 2 === 0 && cycle === 0) || (i % 2 !== 0 && cycle === 1);
    if (pickA) {
      equipaA.push(player);
    } else {
      equipaB.push(player);
    }
  });

  return { equipaA, equipaB };
}

/**
 * Splits players into 2 teams with total ratings as close as possible.
 *
 * Teams receive the same number of players (or differing by 1).
 * For up to 20 players, it explores all combinations. Above 20, it starts from snake draft
 * and greedily swaps player pairs to minimize rating difference.
 */
export function balancedDraft<T extends PlayerWithAttributes>(
  players: T[],
  sport = 'football'
): DraftTeams<T> {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b, sport) - getPlayerRating(a, sport));
  const n = sorted.length;
  if (n < 2) return { equipaA: sorted, equipaB: [] };

  // Ratings in tenths to avoid floating point precision issues
  const r = sorted.map((p) => Math.round(getPlayerRating(p, sport) * 10));
  const total = r.reduce((s, v) => s + v, 0);
  const sizeA = Math.ceil(n / 2);

  let bestMask: number | null = null;

  if (n <= 20) {
    // First player is always placed in team A to avoid exploring symmetric partitions
    const sizes = new Set([Math.floor(n / 2), sizeA]);
    let bestDiff = Infinity;
    const pick = (i: number, count: number, sum: number, mask: number) => {
      if (bestDiff === 0 || count > sizeA) return;
      if (i === n) {
        if (!sizes.has(count)) return;
        const diff = Math.abs(total - 2 * sum);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestMask = mask;
        }
        return;
      }
      if (count + (n - i) < Math.floor(n / 2)) return;
      pick(i + 1, count + 1, sum + r[i], mask | (1 << i));
      if (i > 0) pick(i + 1, count, sum, mask);
    };
    pick(0, 0, 0, 0);
  }

  let inA: boolean[];
  if (bestMask !== null) {
    const mask = bestMask;
    inA = sorted.map((_, i) => (mask & (1 << i)) !== 0);
  } else {
    const snake = snakeDraft(sorted, sport);
    const setA = new Set(snake.equipaA);
    inA = sorted.map((p) => setA.has(p));
    let sumA = r.reduce((s, v, i) => s + (inA[i] ? v : 0), 0);
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < n && !improved; i++) {
        if (!inA[i]) continue;
        for (let j = 0; j < n; j++) {
          if (inA[j]) continue;
          const newSum = sumA - r[i] + r[j];
          if (Math.abs(total - 2 * newSum) < Math.abs(total - 2 * sumA)) {
            inA[i] = false;
            inA[j] = true;
            sumA = newSum;
            improved = true;
            break;
          }
        }
      }
    }
  }

  return {
    equipaA: sorted.filter((_, i) => inA[i]),
    equipaB: sorted.filter((_, i) => !inA[i]),
  };
}

/**
 * Draws balanced pairs: players sorted by rating, the best paired with the
 * worst, the second best with the second worst, and so on. An odd player out
 * is left unpaired.
 */
export function balancedPairs<T extends PlayerWithAttributes>(
  players: T[],
  sport = 'football'
): { pairs: [T, T][]; leftOver: T | null } {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b, sport) - getPlayerRating(a, sport));
  const leftOver = sorted.length % 2 ? sorted.splice(Math.floor(sorted.length / 2), 1)[0] : null;
  const pairs: [T, T][] = [];
  for (let i = 0; i < sorted.length / 2; i++) {
    pairs.push([sorted[i], sorted[sorted.length - 1 - i]]);
  }
  return { pairs, leftOver };
}
````

## File: src/ui/history.ts
````typescript
import { state, persistArquivo } from '../state.js';
import { buildPlayerIndex } from '../utils.js';
import { tallyPlayerStats, mergePlayerStats, archiveTally } from '../algorithms.js';
import type { PlayerStats } from '../types.js';
import { archiveRecords } from '../core/archive.js';
import { getSport } from '../sports/registry.js';
import type { PlayerRecord, Sport } from '../sports/Sport.js';
import type { AllTimeRow, AllTimeStats, TitleCount } from '../components/AllTimeStats.js';
import type { ArchiveList } from '../components/ArchiveList.js';
import '../components/AllTimeStats.js';
import '../components/ArchiveList.js';
import { dom } from './dom.js';
import { openConfirm } from './modals.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// History tab — archived tournaments and all-time stats
// ---------------------------------------------------------------------------

/** All-time stats per player: archive + current tournament + single matches. */
export function computeAllTimeStats(): Record<string, PlayerStats> {
  return mergePlayerStats(
    ...state.arquivo.map(archiveTally),
    tallyPlayerStats(state.results, state.jogosSingulares),
  );
}

/**
 * Matches played and won per player in one sport: its archived tournaments
 * plus the tournament on screen and its single matches.
 */
export function computeAllTimeRecords(sport: Sport): Record<string, PlayerRecord> {
  return sumRecords([
    ...state.arquivo.filter((e) => e.sport === sport.id).map(archiveRecords),
    sport.playerRecords(state.schedule, state.results, state.squads, state.jogosSingulares, state.config),
  ]);
}

function sumRecords(list: Record<string, PlayerRecord>[]): Record<string, PlayerRecord> {
  const out: Record<string, PlayerRecord> = Object.create(null);
  list.forEach((records) => {
    Object.keys(records).forEach((pid) => {
      const r = out[pid] || (out[pid] = { played: 0, won: 0 });
      r.played += records[pid].played;
      r.won += records[pid].won;
    });
  });
  return out;
}

/**
 * The all-time table of the sport on screen, best first, and titles per
 * champion in that sport. Only finished (archived) tournaments count; a
 * player is listed with any match or any of the sport's stats (goals,
 * assists, MVP in football).
 */
function allTimeRows(sport: Sport): { rows: AllTimeRow[]; titles: TitleCount } {
  const index = buildPlayerIndex();
  const archive = state.arquivo.filter((e) => e.sport === sport.id);
  const archivedNames: Record<string, string> = {};
  archive.forEach((e) => (e.jogadores || []).forEach((j) => { archivedNames[j.pid] = j.nome; }));
  const titles: TitleCount = {};
  archive.forEach((e) => { if (e.campeao) titles[e.campeao.nome] = (titles[e.campeao.nome] || 0) + 1; });

  const columns = sport.allTimeColumns();
  const totals = columns.length ? mergePlayerStats(...archive.map(archiveTally)) : {};
  const records = sumRecords(archive.map(archiveRecords));
  const empty: PlayerStats = { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
  const rows = [...new Set([...Object.keys(totals), ...Object.keys(records)])]
    .map((pid) => ({
      pid,
      name: (index[pid] && index[pid].name) || archivedNames[pid] || en.common.unknownPlayer,
      ...empty,
      ...totals[pid],
      played: records[pid]?.played ?? 0,
      won: records[pid]?.won ?? 0,
    }))
    .filter((r) => r.played || columns.some((c) => r[c.key]))
    // The sport's columns first (goals, assists, MVP), then wins and matches
    .sort((a, b) => columns.reduce((d, c) => d || (Number(b[c.key]) - Number(a[c.key])), 0) || (b.won - a.won) || (b.played - a.played));
  return { rows, titles };
}

export function renderHistorico(): void {
  const allTime = dom.historicoSempre as AllTimeStats | undefined;
  const archive = dom.arquivoList as ArchiveList | undefined;
  if (!allTime || !archive) return;

  const sport = getSport(state.meta?.sport || state.config?.sport);
  const { rows, titles } = allTimeRows(sport);
  allTime.columns = sport.allTimeColumns();
  allTime.rows = rows;
  allTime.titles = titles;
  archive.entries = state.arquivo;
}

/** Wires the History tab's events; called once at start-up. */
export function bindHistoryEvents(): void {
  dom.arquivoList?.addEventListener('archive-delete', (e) => {
    const id = (e as CustomEvent<string>).detail;
    openConfirm(en.historyTab.deleteModalTitle, en.historyTab.deleteModalPrompt, async () => {
      state.arquivo = state.arquivo.filter((x) => x.id !== id);
      await persistArquivo();
      renderHistorico();
    });
  });
}
````

## File: src/ui/match.ts
````typescript
import { state } from '../state.js';
import { sideName, safeColor, prefersReducedMotion } from '../utils.js';
import { getSport } from '../sports/registry.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { ScoreBase } from '../components/ScoreBase.js';
import type { ScoreMatch } from '../components/ScoreBase.js';
import { FootballScore } from '../sports/football/FootballScore.js';
import { PadelScore } from '../sports/padel/PadelScore.js';
import { TennisScore } from '../sports/tennis/TennisScore.js';
import type { GameEvent, MatchResult } from '../types.js';
import { isAdminView } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Match window — hosts the sport's score panel and plays match events everywhere
// ---------------------------------------------------------------------------
let openGameGi: string | null = null;
/** Where the open match window was opened from: Pick MVP only from Results. */
let openedFrom: MatchSource = 'schedule';

export type MatchSource = 'schedule' | 'results';

/** Score panel class per sport id; sports without one use football's. */
const SCORE_PANELS: Record<string, new () => ScoreBase> = { football: FootballScore, padel: PadelScore, tennis: TennisScore };

function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

function newScorePanel(): ScoreBase {
  const Panel = SCORE_PANELS[currentSport().id] || FootballScore;
  return new Panel();
}

/** What the score panel shows about one match, read from the state. */
export function matchView(gi: string | number): ScoreMatch | null {
  const g = state.schedule[Number(gi)];
  if (!g) return null;
  const sport = currentSport();
  const team = (side: 'home' | 'away') => {
    const idx = g[side];
    return {
      name: sideName(g, side),
      color: typeof idx === 'number' && state.teams?.[idx] ? safeColor(state.teams[idx].color) : null,
    };
  };
  return {
    gi: String(gi),
    round: typeof g.jornada === 'number' ? en.gameModal.roundLabel(g.jornada) : String(g.jornada || ''),
    home: team('home'),
    away: team('away'),
    result: state.results[gi],
    format: sport instanceof RacketSport ? sport.format(state.config) : undefined,
    points: sport instanceof RacketSport ? sport.pointsPerMatch(state.config) ?? undefined : undefined,
  };
}

function openPanel(): ScoreBase | null {
  const panel = document.getElementById('gameModalContent')?.firstElementChild;
  return panel instanceof ScoreBase ? panel : null;
}

export function openGameModal(gi: string | number, from: MatchSource = 'schedule'): void {
  const overlay = document.getElementById('gameOverlay');
  const content = document.getElementById('gameModalContent');
  if (!overlay || !content) return;
  openGameGi = String(gi);
  openedFrom = from;
  content.replaceChildren(newScorePanel());
  refreshGameModal();
  overlay.hidden = false;
  document.getElementById('gameModalClose')?.focus();
}

export function closeGameModal(): void {
  const overlay = document.getElementById('gameOverlay');
  if (overlay) overlay.hidden = true;
  openGameGi = null;
  document.getElementById('gameModalContent')?.replaceChildren();
}

/** Redraws the open match window (results changed here or on another phone). */
export function refreshGameModal(): void {
  const panel = openPanel();
  if (openGameGi === null || !panel) return;
  panel.match = matchView(openGameGi);
  panel.canEdit = isAdminView();
  if (panel instanceof FootballScore) panel.canPickMvp = openedFrom === 'results' && isAdminView();
}

// ---------------------------------------------------------------------------
// Match events — kick-off, point, cancelled point, full time
// ---------------------------------------------------------------------------
// Events come from comparing the last results with the current ones, so they
// play on every phone: on the one that saved and on those that got the change
// from Firebase.
let baseline: Record<string, MatchResult> | null = null;

/**
 * Compares the results with the previous call and plays what changed.
 * `silent` only records the state (first Firebase read, rejected save).
 */
export function animateResultChanges({ silent = false } = {}): void {
  const prev = baseline;
  baseline = JSON.parse(JSON.stringify(state.results || {}));
  if (silent || !prev || prefersReducedMotion()) return;

  const events = currentSport().resultEvents(prev, state.results as Record<string, MatchResult>, state.config ?? undefined);
  if (!events.length) return;

  // Wait for the redraw; several events on the same match play in turn
  const queue: Record<string, number> = {};
  requestAnimationFrame(() => {
    events.forEach((ev) => {
      const panel = openPanel();
      if (panel && openGameGi === String(ev.gi)) panel.onPoint(ev);

      const n = queue[ev.gi] || 0;
      queue[ev.gi] = n + 1;
      setTimeout(() => playOnCards(ev), n * ScoreBase.STAGGER);
    });
  });
}

/** Plays an event on the visible fixture cards of its match. */
function playOnCards(ev: GameEvent): void {
  const view = matchView(ev.gi);
  if (!view) return;
  const banner = newScorePanel();
  banner.match = view;
  document.querySelectorAll<HTMLElement>(`[data-game="${CSS.escape(String(ev.gi))}"]`).forEach((card) => {
    // Only what is on screen (active tab)
    if (card.offsetParent) banner.playOn(card, ev);
  });
}
````

## File: src/ui/settings.ts
````typescript
import { html, render } from 'lit';
import { state } from '../state.js';
import { clamp } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';
import { padel } from '../sports/padel/Padel.js';
import { getSport } from '../sports/registry.js';
import { RacketSport } from '../sports/RacketSport.js';

// ---------------------------------------------------------------------------
// Settings form
// ---------------------------------------------------------------------------
type Field = HTMLInputElement & HTMLSelectElement;

/** A settings field by id (inputs and selects share `value`). */
function field(id: string): Field {
  return dom[id] as Field;
}

export function populateConfigForm(): void {
  const c = state.config;
  if (!c) return;
  field('cfgNome').value = c.nome;
  field('cfgNumEquipas').value = String(c.numEquipas);
  field('cfgNumGrupos').value = String(c.numGrupos || 1);
  field('cfgNumVoltas').value = String(c.numVoltas);
  field('cfgVitoria').value = String(c.pontosVitoria);
  field('cfgEmpate').value = String(c.pontosEmpate);
  field('cfgDerrota').value = String(c.pontosDerrota);
  field('cfgBonus').value = String(c.bonusGoleada);
  field('cfgGoleada').value = String(c.golosGoleada);
  field('cfgMataMata').checked = c.mataMata || false;
  field('cfgNumPlayoffTeams').value = String(c.numPlayoffTeams || 4);
  // Set format of a racket sport (the fields are hidden for the others)
  const sport = getSport(state.meta?.sport || c.sport);
  const f = (sport instanceof RacketSport ? sport : padel).format(c);
  field('cfgSets').value = String(f.sets);
  field('cfgGamesPerSet').value = String(f.gamesPerSet);
  field('cfgSuperTieBreak').checked = f.superTieBreak;
  field('cfgWinPoints').value = String((sport instanceof RacketSport ? sport : padel).winPoints(c));
  field('cfgPadelFormat').value = padel.rotation(c) || 'pairs';
  field('cfgMatchPoints').value = String(padel.pointsPerMatch({ ...c, padelFormat: 'americano' }));
}

/** The schedule in use, and the configured one when it differs (not generated yet). */
export function renderScheduleHint(): void {
  const c = state.config;
  if (!c || !dom.scheduleHint) return;
  const confN = clamp(parseInt(field('cfgNumEquipas').value, 10) || c.numEquipas, 2, 32);
  const confV = clamp(parseInt(field('cfgNumVoltas').value, 10) || c.numVoltas, 1, 20);
  const changed = confN !== state.scheduleTeamCount || confV !== state.scheduleVoltas;
  render(html`${en.config.scheduleHintCurrent(state.scheduleTeamCount, state.scheduleVoltas, state.schedule.length)}${
    changed ? en.config.scheduleHintConfigured(confN, confV) : ''}`, dom.scheduleHint);
}
````

## File: src/firebase.ts
````typescript
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, onValue, update, push, query, orderByChild, limitToLast, serverTimestamp, get } from "firebase/database";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { diffSnapshot, describeUpdates, onlyMetadata, normalizeMeta, normalizeConfig, legacyRoleUpdates } from "./sync.js";
import { en } from "./i18n/en.js";
import { blockedPaths, roleLabel, isSportAdmin, isMaster } from "./permissions.js";
import type { User } from "firebase/auth";
import type { Unsubscribe } from "firebase/database";
import type { ArchiveEntry, Role, Tournament, TournamentMeta, UserProfile } from "./types.js";
import type { LogEntry } from "./components/ActivityLog.js";

/** A tournament snapshot as read from or sent to Firebase (sections may be missing). */
export type Snapshot = Partial<Tournament>;
/** A tournament as listed in tournaments/ (its meta plus the id). */
export type TournamentListing = TournamentMeta & { id: string };
export type PushResult = { ok: true } | { ok: false; reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' };
export interface AuthInfo { user: User | null; role: Role | null; admin: Record<string, boolean> }
type Updates = Record<string, unknown>;

export const isEmulator = import.meta.env.VITE_USE_EMULATORS === 'true';

export type DevRole = 'master' | 'admin' | 'user' | 'none';

// Emulator-only accounts for the role switcher (also seeded by docker/firebase/seed.mjs)
export const DEV_USERS: Record<'master' | 'admin' | 'user', { email: string; password: string; name: string; role: Role; admin?: Record<string, boolean> }> = {
  master: {
    email: 'master@torneio.local',
    password: 'password123',
    name: 'Master Admin',
    role: 'master',
  },
  admin: {
    email: 'admin@torneio.local',
    password: 'password123',
    name: 'Football Admin',
    role: 'admin',
    admin: { football: true },
  },
  user: {
    email: 'user@torneio.local',
    password: 'password123',
    name: 'Test User',
    role: 'user',
  },
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isEmulator ? 'demo-api-key' : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (isEmulator ? 'demo-torneio.firebaseapp.com' : undefined),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || (isEmulator ? 'https://demo-torneio-default-rtdb.firebaseio.com' : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (isEmulator ? 'demo-torneio' : undefined),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (isEmulator ? 'demo-app-id' : undefined),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Development: use the local Firebase emulators instead of the real database
const EMULATOR_HOST = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1';
const EMULATOR_DB_PORT = 9000;
if (isEmulator) {
  connectDatabaseEmulator(database, EMULATOR_HOST, EMULATOR_DB_PORT);
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
}

const LOG_LIMIT = 200;

let activeTournamentId = 'default';
let onStateChangeCallback: ((data: Snapshot, firstLoad: boolean) => void) | null = null;
let onPushErrorCallback: ((err: Error) => void) | null = null;
let isFirstLoad = true;
let lastSynced: Snapshot | null = null; // last snapshot equal to what Firebase holds
let stopStateListener: Unsubscribe | null = null;
/** Counts tournament values from Firebase, so only the latest one is applied. */
let serverStateSeq = 0;
let stopArquivoListener: Unsubscribe | null = null;
let stopPlayersListener: Unsubscribe | null = null;

export function setActiveTournamentId(id: string): void {
  if (!id || id === activeTournamentId) return;
  activeTournamentId = id;
  lastSynced = null;
  isFirstLoad = true;
  initFirebaseListener(activeTournamentId);
}

export function getActiveTournamentId(): string {
  return activeTournamentId;
}

// Set the callback that will be called whenever the DB updates
export function onFirebaseStateChange(callback: (data: Snapshot, firstLoad: boolean) => void): void {
  onStateChangeCallback = callback;
}

// Start listening to the "tournaments/<id>" node, global "arquivo", and global "players"
export function initFirebaseListener(tournamentId: string = activeTournamentId): void {
  activeTournamentId = tournamentId || 'default';
  if (stopStateListener) {
    stopStateListener();
    stopStateListener = null;
  }

  const stateRef = ref(database, `tournaments/${activeTournamentId}`);
  stopStateListener = onValue(stateRef, (snapshot) => {
    void applyServerState(snapshot.val());
  }, (err) => console.error("Firebase error reading tournament:", err));

  if (!stopArquivoListener) {
    const arquivoRef = ref(database, 'arquivo');
    stopArquivoListener = onValue(arquivoRef, (snapshot) => {
      const arqVal = snapshot.val();
      if (arqVal && onStateChangeCallback && !isFirstLoad) {
        const current = getSyncedSnapshot() || {};
        current.arquivo = arqVal;
        onStateChangeCallback(current, false);
      }
    }, (err) => console.error("Firebase error reading arquivo:", err));
  }

  if (!stopPlayersListener) {
    const playersRef = ref(database, 'players');
    stopPlayersListener = onValue(playersRef, (snapshot) => {
      const playersVal = snapshot.val();
      if (playersVal && onStateChangeCallback && !isFirstLoad) {
        const current = getSyncedSnapshot() || {};
        current.players = playersVal;
        onStateChangeCallback(current, false);
      }
    }, (err) => console.error("Firebase error reading players:", err));
  }
}

/**
 * Applies the tournament as Firebase holds it (from the listener or a
 * re-read), adding the global archive and players.
 */
async function applyServerState(value: Snapshot | null): Promise<void> {
  const seq = ++serverStateSeq;
  let data: Snapshot | null = value;
  if (!data) {
    // Fall back to the legacy data while the migration has not run yet
    try {
      const legacySnap = await get(ref(database, 'torneio_state'));
      data = legacySnap.val();
    } catch {
      // Ignore permission or network errors
    }
  }
  if (data) {
    // The global archive lives in /arquivo
    try {
      const arqSnap = await get(ref(database, 'arquivo'));
      const arqVal = arqSnap.val();
      if (arqVal) data.arquivo = arqVal;
    } catch {
      // Ignora
    }

    // Global players live in /players
    try {
      const playersSnap = await get(ref(database, 'players'));
      const playersVal = playersSnap.val();
      if (playersVal) data.players = playersVal;
    } catch {
      // Ignora
    }
  }
  // A newer value arrived while this one was reading the archive and players
  // (a rejected save fires the optimistic value, then the server one): skip it
  if (seq !== serverStateSeq) return;
  // Empty database: already in sync, the first save sends everything
  if (!data && !lastSynced) lastSynced = {};
  if (data && onStateChangeCallback) {
    onStateChangeCallback(data, isFirstLoad);
    isFirstLoad = false;
  }
}

/**
 * Reads the tournament from Firebase again and applies it, so a save the
 * server refused does not stay on screen or in the local cache.
 */
export async function resyncFromServer(): Promise<void> {
  try {
    const snap = await get(ref(database, `tournaments/${activeTournamentId}`));
    await applyServerState(snap.val());
  } catch (err) {
    console.error("Firebase error re-reading tournament:", err);
  }
}

// Called when Firebase rejects a save that was already applied locally
export function onFirebasePushError(callback: (err: Error) => void): void {
  onPushErrorCallback = callback;
}

// Record the snapshot that matches what Firebase currently holds
export function setSyncedSnapshot(snap: Snapshot): void {
  lastSynced = JSON.parse(JSON.stringify(snap));
}

export function getSyncedSnapshot(): Snapshot | null {
  return lastSynced ? JSON.parse(JSON.stringify(lastSynced)) : null;
}

// Push only what changed since the last sync, so concurrent edits to
// different games or sections don't overwrite each other. Each push also
// appends an entry to tournament_log/<id> with who made the change.
//
// Returns { ok: true } or { ok: false, reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' }.
// When it fails nothing is sent and the caller should restore the last synced state.
export function pushStateToFirebase(newState: Snapshot, tournamentId: string = activeTournamentId): PushResult {
  if (!lastSynced) return { ok: false, reason: 'sem-sync' };

  const updates = diffSnapshot(lastSynced, newState);
  // Only the export date changed: nothing to save
  if (onlyMetadata(updates)) return { ok: true };

  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  const sport = newState?.meta?.sport || newState?.config?.sport || 'football';
  if (blockedPaths(currentRole, updates, { sport, userAdmin: currentUserAdmin }).length) return { ok: false, reason: 'sem-permissao' };

  lastSynced = JSON.parse(JSON.stringify(newState));

  const rootUpdates: Updates = {};
  Object.keys(updates).forEach((p) => {
    if (p === 'arquivo') {
      rootUpdates['arquivo'] = updates[p];
    } else if (p === 'players') {
      rootUpdates['players'] = updates[p];
    } else {
      rootUpdates[`tournaments/${tournamentId}/${p}`] = updates[p];
    }
  });

  // The rules require every save to point (logRef) at a new change-log
  // entry written in the same update()
  const log = logEntry(describeUpdates(updates, newState) || en.sync.tournamentChanged, tournamentId);
  Object.assign(rootUpdates, log);
  const logKey = Object.keys(log)[0].split('/')[2];
  rootUpdates[`tournaments/${tournamentId}/logRef`] = logKey;

  update(ref(database), rootUpdates).catch((err) => {
    console.error("Firebase error pushing state:", err);
    // Firebase reverts its own cache; read the server value again so the
    // screen and the local cache follow it too
    void resyncFromServer();
    if (onPushErrorCallback) onPushErrorCallback(err);
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Session (Google) and profiles
// ---------------------------------------------------------------------------
let currentUser: User | null = null;
let currentRole: Role | null = null;
let currentUserAdmin: Record<string, boolean> = {};
let stopRoleListener: Unsubscribe | null = null;

export function getCurrentUser(): User | null { return currentUser; }
export function getCurrentRole(): Role | null { return currentRole; }
export function getCurrentUserAdmin(): Record<string, boolean> { return currentUserAdmin; }
export function isCurrentSportAdmin(sport = 'football'): boolean {
  return isSportAdmin(currentRole, sport, currentUserAdmin);
}
export function isCurrentMaster(): boolean {
  return isMaster(currentRole);
}

function displayName(user: User): string {
  return (user.displayName || user.email || en.common.noName).slice(0, 100);
}

function logEntry(acao: string, tournamentId: string = activeTournamentId): Updates {
  const user = currentUser!;
  const key = push(ref(database, `tournament_log/${tournamentId}`)).key;
  return {
    [`tournament_log/${tournamentId}/${key}`]: {
      uid: user.uid,
      nome: displayName(user),
      acao: acao.slice(0, 500),
      quando: serverTimestamp(),
    },
  };
}

// Migration: the master admin's first load copies torneio_state to tournaments/default
async function checkAndMigrateLegacyState(): Promise<void> {
  const user = currentUser;
  if (!user) return;
  const defaultTourneyRef = ref(database, 'tournaments/default');
  const defaultSnap = await get(defaultTourneyRef);
  if (defaultSnap.exists()) return;

  const legacyRef = ref(database, 'torneio_state');
  const legacySnap = await get(legacyRef);
  const legacyData: Record<string, unknown> & Snapshot | null = legacySnap.val();
  if (!legacyData) return;

  console.log("Migrating torneio_state to tournaments/default...");
  const meta = {
    name: (legacyData.config && legacyData.config.nome) || 'Futebol ILOG',
    sport: 'football',
    status: 'active',
    createdAt: Date.now(),
  };

  const key = push(ref(database, 'tournament_log/default')).key;
  const rootUpdates: Updates = {
    [`tournament_log/default/${key}`]: {
      uid: user.uid,
      nome: displayName(user),
      acao: en.sync.legacyMigrated,
      quando: serverTimestamp(),
    },
    'tournaments/default/logRef': key,
    'tournaments/default/meta': meta,
    'tournaments/default/version': 9,
  };

  Object.keys(legacyData).forEach((k) => {
    if (k === 'arquivo') {
      rootUpdates['arquivo'] = legacyData.arquivo;
    } else if (k === 'players') {
      const rawPlayers: unknown = legacyData.players || [];
      const list: unknown[] = Array.isArray(rawPlayers) ? rawPlayers : Object.values(rawPlayers as object);
      rootUpdates['players'] = (list as Record<string, unknown>[]).map((p) => {
        if (!p || typeof p !== 'object') return p;
        const ratings = (p.ratings || {}) as Record<string, unknown>;
        if (!ratings.football && p.atributos) {
          ratings.football = p.atributos;
        }
        return {
          ...p,
          ratings,
          atributos: ratings.football || p.atributos,
        };
      });
    } else if (k !== 'logRef' && k !== 'version' && k !== 'meta') {
      rootUpdates[`tournaments/default/${k}`] = legacyData[k];
    }
  });

  await update(ref(database), rootUpdates);
  console.log("Tournament migration completed");
}

// Copies the legacy roles (utilizadores) of users who have no role in users
// yet. Only a master may write roles, so it runs once per session for them.
let legacyRolesChecked = false;
async function migrateLegacyRoles(): Promise<void> {
  if (legacyRolesChecked) return;
  legacyRolesChecked = true;
  const [utilSnap, usersSnap] = await Promise.all([get(ref(database, 'utilizadores')), get(ref(database, 'users'))]);
  const roleUpdates = legacyRoleUpdates(utilSnap.val(), usersSnap.val());
  if (Object.keys(roleUpdates).length) {
    await update(ref(database), roleUpdates);
    console.log(`Legacy roles copied to users: ${Object.keys(roleUpdates).length} paths`);
  }
}

// Calls callback({ user, role, admin }) on sign-in, sign-out and role changes
export function initAuth(callback: (info: AuthInfo) => void): void {
  onAuthStateChanged(auth, (user) => {
    if (stopRoleListener) { stopRoleListener(); stopRoleListener = null; }
    currentUser = user;
    currentRole = null;
    currentUserAdmin = {};

    if (!user) {
      callback({ user: null, role: null, admin: {} });
      return;
    }

    const profile: Record<string, unknown> = {
      nome: displayName(user),
      ultimoAcesso: serverTimestamp(),
    };
    if (user.email) profile.email = user.email;
    if (user.photoURL) profile.foto = user.photoURL.slice(0, 500);
    update(ref(database, `users/${user.uid}`), profile).catch((err) => {
      console.error("Firebase error saving profile:", err);
    });

    callback({ user, role: null, admin: {} });
    stopRoleListener = onValue(ref(database, `users/${user.uid}`), async (snap) => {
      const val = snap.val() || {};
      currentRole = (val.role as Role) || null;
      currentUserAdmin = val.admin || {};
      callback({ user, role: currentRole, admin: currentUserAdmin });

      if (currentRole === 'master' || currentRole === 'admin') {
        try {
          await checkAndMigrateLegacyState();
        } catch (err) {
          console.error("Legacy migration check failed:", err);
        }
      }
      if (currentRole === 'master') {
        migrateLegacyRoles().catch((err) => console.error("Users migration failed:", err));
      }
    }, (err) => {
      console.error("Firebase error reading user role:", err);
    });
  });

  // In emulator/docker mode, default to the saved dev role (or 'master')
  if (isEmulator && !currentUser) {
    const initialDevRole = getCurrentDevRole();
    if (initialDevRole !== 'none') {
      setDevRole(initialDevRole).catch((err) => console.error("Auto dev role initialization error:", err));
    }
  }
}

export function getCurrentDevRole(): DevRole {
  return (localStorage.getItem('torneio_dev_role') as DevRole) || 'master';
}

export async function setDevRole(role: DevRole): Promise<void> {
  if (!isEmulator) return;

  if (role === 'none') {
    await signOut(auth);
    localStorage.setItem('torneio_dev_role', 'none');
    return;
  }

  const devUser = DEV_USERS[role];
  let userCred;
  try {
    userCred = await signInWithEmailAndPassword(auth, devUser.email, devUser.password);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== 'auth/user-not-found' && code !== 'auth/invalid-credential') throw err;
    userCred = await createUserWithEmailAndPassword(auth, devUser.email, devUser.password);
    await updateProfile(userCred.user, { displayName: devUser.name });
  }

  // The rules only let a master write roles, so the emulator's admin token
  // ("Bearer owner") sets them. The namespace comes from the database URL,
  // which must be the one the emulator loaded database.rules.json into.
  const ns = new URL(firebaseConfig.databaseURL ?? '').hostname.split('.')[0];
  const res = await fetch(`http://${EMULATOR_HOST}:${EMULATOR_DB_PORT}/users/${userCred.user.uid}.json?ns=${ns}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({
      nome: devUser.name,
      email: devUser.email,
      role: devUser.role,
      admin: devUser.admin || null,
    }),
  });
  if (!res.ok) throw new Error(`Emulator role update failed: ${res.status} ${await res.text()}`);

  localStorage.setItem('torneio_dev_role', role);
}

export function signInWithGoogle(): ReturnType<typeof signInWithPopup> {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

// ---------------------------------------------------------------------------
// Administration (only the master can read)
// ---------------------------------------------------------------------------
export function listenUsers(callback: (users: UserProfile[]) => void): Unsubscribe {
  return onValue(ref(database, 'users'), (snap) => {
    const val: Record<string, Omit<UserProfile, 'uid'>> = snap.val() || {};
    callback(Object.keys(val).map((uid) => ({ uid, ...val[uid] })));
  }, (err) => console.error("Firebase error reading users:", err));
}

export function listenLog(callback: (entries: LogEntry[]) => void, tournamentId: string = activeTournamentId): Unsubscribe {
  const q = query(ref(database, `tournament_log/${tournamentId}`), orderByChild('quando'), limitToLast(LOG_LIMIT));
  return onValue(q, (snap) => {
    const entries: LogEntry[] = [];
    snap.forEach((child) => { entries.push({ id: child.key, ...child.val() }); });
    callback(entries.reverse());
  }, (err) => console.error("Firebase error reading log:", err));
}

// role: 'master' | 'admin' | 'user' | null (pending)
export function setUserRole(uid: string, role: Role | null, sportAdmins: Record<string, boolean> | null = null, nome = ''): Promise<void> {
  const updates: Updates = {
    [`users/${uid}/role`]: role || null,
    ...logEntry(en.sync.roleChanged(nome || uid, roleLabel(role, sportAdmins))),
  };
  if (sportAdmins !== null) {
    updates[`users/${uid}/admin`] = sportAdmins;
  }
  return update(ref(database), updates);
}

// ---------------------------------------------------------------------------
// Tournaments (list, create and finish)
// ---------------------------------------------------------------------------
export function listenTournaments(callback: (list: TournamentListing[]) => void): Unsubscribe {
  return onValue(ref(database, 'tournaments'), async (snapshot) => {
    let val: Record<string, Snapshot> = snapshot.val() || {};
    if (Object.keys(val).length === 0) {
      try {
        const legacySnap = await get(ref(database, 'torneio_state'));
        const legacyVal = legacySnap.val();
        if (legacyVal) {
          val = {
            default: {
              meta: {
                name: (legacyVal.config && legacyVal.config.nome) || 'Futebol ILOG',
                sport: 'football',
                status: 'active',
                createdAt: Date.now(),
              },
              config: legacyVal.config,
            },
          } as Record<string, Snapshot>;
        }
      } catch {
        // ignore
      }
    }
    const list = Object.keys(val).map((id) => {
      const t = val[id] || {};
      const meta = normalizeMeta(t.meta, t.config);
      return {
        id,
        ...meta,
      };
    });
    callback(list);
  }, (err) => console.error("Firebase error reading tournaments:", err));
}

export async function finishTournament(tournamentId: string = activeTournamentId, archiveEntry?: ArchiveEntry | null): Promise<PushResult> {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };

  let currentMeta: Partial<TournamentMeta> = {};
  try {
    const metaSnap = await get(ref(database, `tournaments/${tournamentId}/meta`));
    currentMeta = metaSnap.val() || {};
  } catch {
    // fallback
  }

  const sport = currentMeta.sport || 'football';
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const updatedMeta: TournamentMeta = {
    name: currentMeta.name || en.common.tournament,
    sport,
    status: 'finished',
    createdAt: currentMeta.createdAt || Date.now(),
  };

  const log = logEntry(en.sync.tournamentFinished(updatedMeta.name), tournamentId);
  const logKey = Object.keys(log)[0].split('/')[2];

  const rootUpdates: Updates = {
    ...log,
    [`tournaments/${tournamentId}/logRef`]: logKey,
    [`tournaments/${tournamentId}/meta`]: updatedMeta,
  };

  if (archiveEntry && archiveEntry.id) {
    rootUpdates[`arquivo/${archiveEntry.id}`] = archiveEntry;
  }

  await update(ref(database), rootUpdates);
  return { ok: true };
}

export interface NewTournament { name: string; sport?: string; numEquipas?: number | string; numVoltas?: number | string }

export async function createTournament({ name, sport = 'football', numEquipas = 8, numVoltas = 2 }: NewTournament): Promise<PushResult & { tournamentId?: string }> {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const tournamentId = 't_' + Date.now();
  const meta: TournamentMeta = {
    name: (name || en.common.tournament).slice(0, 100),
    sport,
    status: 'active',
    createdAt: Date.now(),
  };

  const config = normalizeConfig({
    nome: meta.name,
    sport,
    numEquipas: Number(numEquipas) || 8,
    numVoltas: Number(numVoltas) || 2,
  });

  const emptyTeams = Array.from({ length: 32 }, () => ({ name: '', color: '#2F7A4F' }));
  const emptySquads = Array.from({ length: 32 }, () => []);

  const log = logEntry(en.sync.tournamentCreated(meta.name, sport), tournamentId);
  const logKey = Object.keys(log)[0].split('/')[2];

  const rootUpdates = {
    ...log,
    [`tournaments/${tournamentId}/logRef`]: logKey,
    [`tournaments/${tournamentId}/meta`]: meta,
    [`tournaments/${tournamentId}/config`]: config,
    [`tournaments/${tournamentId}/teams`]: emptyTeams,
    [`tournaments/${tournamentId}/squads`]: emptySquads,
    [`tournaments/${tournamentId}/schedule`]: [],
    [`tournaments/${tournamentId}/roundsMeta`]: [],
    [`tournaments/${tournamentId}/scheduleTeamCount`]: config.numEquipas,
    [`tournaments/${tournamentId}/scheduleVoltas`]: config.numVoltas,
    [`tournaments/${tournamentId}/results`]: {},
    [`tournaments/${tournamentId}/players`]: [],
    [`tournaments/${tournamentId}/jogosSingulares`]: [],
    [`tournaments/${tournamentId}/version`]: 9,
    [`tournaments/${tournamentId}/exportedAt`]: new Date().toISOString(),
  };

  await update(ref(database), rootUpdates);
  return { ok: true, tournamentId };
}
````

## File: tests/core/archive.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  countPlayedGames,
  getChampion,
  buildArchiveEntry,
  archiveTally,
  archiveRecords,
} from '../../src/core/archive.js';
import { computeStandings } from '../../src/sports/football/Football.js';
import { GAME_STATUS, type Config, type Match, type MatchResult, type Team } from '../../src/types.js';

const config: Config = {
  nome: 'Futebol ILOG',
  numEquipas: 8,
  numGrupos: 1,
  numVoltas: 2,
  pontosVitoria: 3,
  pontosEmpate: 1,
  pontosDerrota: 0,
  bonusGoleada: 1,
  golosGoleada: 3,
  mataMata: false,
  numPlayoffTeams: 4,
};

describe('arquivo de torneios', () => {
  const teams: Team[] = [
    { name: 'Leões', color: '#111111' },
    { name: 'Águias', color: '#222222' },
    { name: 'Dragões', color: '#333333' },
  ];
  const schedule: Match[] = [
    { jornada: 1, home: 0, away: 1 },
    { jornada: 2, home: 1, away: 2 },
    { jornada: 3, home: 2, away: 0 },
  ];
  const done = (score: string, extra: Record<string, unknown> = {}): MatchResult => ({
    score,
    status: GAME_STATUS.TERMINADO,
    scorers: { home: [], away: [] },
    ...extra,
  });

  it('campeão é o líder da liga sem eliminatórias', () => {
    const results: Record<string | number, MatchResult> = {
      0: done('2-0'),
      1: done('1-1'),
      2: done('0-1'),
    };
    const groups = computeStandings(teams, schedule, results, config);
    expect(getChampion(schedule, results, groups)).toBe(0);
    expect(getChampion(schedule, {}, computeStandings(teams, schedule, {}, config))).toBe(null);
  });

  it('com eliminatórias, campeão é o vencedor da final', () => {
    const sch: Match[] = [
      ...schedule,
      { jornada: 4, home: 0, away: 2, isPlayoff: true, playoffMatchId: 'm1', nextMatchId: 'm2_home' },
      { jornada: 5, home: 0, away: 1, isPlayoff: true, playoffMatchId: 'm2' },
    ];
    const results: Record<string | number, MatchResult> = {
      0: done('2-0'),
      3: done('1-0'),
      4: done('1-1', { penalties: '3-4' }),
    };
    const groups = computeStandings(teams, sch, results, config);
    expect(getChampion(sch, results, groups)).toBe(1);
    expect(getChampion(sch, { 0: done('2-0') }, groups)).toBe(null);
  });

  it('guarda tabela, campeão e jogadores do torneio', () => {
    const results: Record<string | number, MatchResult> = {
      0: done('2-0', {
        scorers: { home: ['ana', 'ana'], away: [] },
        assists: { home: ['rui', ''], away: [] },
        mvp: 'ana',
      }),
      1: done('1-1', { scorers: { home: ['rui'], away: ['ze'] } }),
      2: { score: '0-0', status: GAME_STATUS.AGENDADO },
    };
    const entry = buildArchiveEntry(
      {
        config: { ...config, nome: 'Verão' }, teams, schedule, results, scheduleTeamCount: 3,
        squads: [[{ id: 'ana', num: 9, name: 'Ana' }], [{ id: 'rui', num: 7, name: 'Rui' }], [{ id: 'ze', num: 1, name: 'Zé' }]],
      },
      { ana: 'Ana', rui: 'Rui' },
      'id1',
      '2026-10-02T10:00:00.000Z'
    );
    expect(entry.nome).toBe('Verão');
    expect(entry.sport).toBe('football');
    expect(entry.campeao).toEqual({ nome: 'Leões', cor: '#111111' });
    expect(countPlayedGames(results)).toBe(2);
    expect(entry.jogos).toBe(2);
    expect(entry.golos).toBe(4);
    expect(entry.grupos[0].tabela.map((t) => t.nome)).toEqual(['Leões', 'Dragões', 'Águias']);
    expect(entry.jogadores[0]).toEqual({
      pid: 'ana',
      nome: 'Ana',
      golos: 2,
      assistencias: 0,
      mvp: 1,
      jogosAMarcar: 1,
      recorde: 2,
      played: 1,
      won: 1,
    });
    // Finished matches only: a draw is played, not won; the scheduled match does not count
    expect(archiveRecords(entry)).toEqual({ ana: { played: 1, won: 1 }, rui: { played: 2, won: 0 }, ze: { played: 1, won: 0 } });
    expect(entry.jogadores.find((j) => j.pid === 'ze')?.nome).toBe('Unknown Player');
    expect(archiveTally(entry).rui).toEqual({
      golos: 1,
      assistencias: 1,
      mvp: 0,
      jogosAMarcar: 1,
      recorde: 1,
    });

    const entryWithMeta = buildArchiveEntry(
      {
        meta: { name: 'Padel Open', sport: 'padel', status: 'finished', createdAt: 123 },
        config: { ...config, nome: 'Padel Open' },
        teams,
        schedule,
        results,
        scheduleTeamCount: 3,
      },
      {},
      'id2',
      '2026-10-02T10:00:00.000Z'
    );
    expect(entryWithMeta.sport).toBe('padel');
    expect(entryWithMeta.nome).toBe('Padel Open');
  });
});
````

## File: tests/sync.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import {
  diffSnapshot,
  normalizeResults,
  normalizeArquivo,
  describeUpdates,
  onlyMetadata,
  normalizeConfig,
  normalizeMeta,
  legacyRoleUpdates,
} from '../src/sync.js';

describe('diffSnapshot', () => {
  const base = {
    config: { nome: 'T' },
    schedule: [{ home: 0, away: 1 }],
    results: { 0: { score: '1-0' }, 1: { score: '2-2' } },
  };

  it('sem sincronização anterior envia todas as secções', () => {
    expect(diffSnapshot(null, base)).toEqual(base);
  });

  it('envia só o resultado do jogo alterado', () => {
    const next = { ...base, results: { ...base.results, 1: { score: '3-2' } } };
    expect(diffSnapshot(base, next)).toEqual({ 'results/1': { score: '3-2' } });
  });

  it('apaga resultados removidos e secções esvaziadas', () => {
    const next = { ...base, schedule: [], results: { 0: base.results[0] } };
    expect(diffSnapshot(base, next)).toEqual({ 'schedule/0': null, 'results/1': null });
  });

  it('grava o calendário campo a campo (passar o vencedor de uma eliminatória)', () => {
    const prev = { schedule: [{ home: 0, away: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true }] };
    const next = { schedule: [{ home: 0, away: 1 }, { home: 0, away: 2, isPlayoff: true }] };
    expect(diffSnapshot(prev, next)).toEqual({ 'schedule/1/home': 0 });
  });

  it('jogos novos no calendário vão inteiros', () => {
    const prev = { schedule: [{ home: 0, away: 1 }] };
    const next = { schedule: [{ home: 0, away: 1 }, { home: 1, away: 0 }] };
    expect(diffSnapshot(prev, next)).toEqual({ 'schedule/1': { home: 1, away: 0 } });
  });

  it('não envia nada quando nada mudou', () => {
    expect(diffSnapshot(base, JSON.parse(JSON.stringify(base)))).toEqual({});
  });
});

describe('normalizeResults', () => {
  it('repõe marcadores vazios e ignora buracos de arrays do Firebase', () => {
    const fromFirebase = [null, { score: '1-0', status: 'terminado' }, { score: '0-0', scorers: { home: ['p1'] } }];
    expect(normalizeResults(fromFirebase)).toEqual({
      1: { score: '1-0', status: 'terminado', scorers: { home: [], away: [] }, assists: { home: [], away: [] } },
      2: { score: '0-0', scorers: { home: ['p1'], away: [] }, assists: { home: [], away: [] } },
    });
  });

  it('mantém as assistências alinhadas com os marcadores', () => {
    const r = normalizeResults({ 0: { score: '2-0', scorers: { home: ['a', 'b'] }, assists: { home: ['', 'a'] } } });
    expect(r[0].assists).toEqual({ home: ['', 'a'], away: [] });
  });

  it('aceita resultados antigos em texto e ausência de resultados', () => {
    expect(normalizeResults({ 0: '2-1' })).toEqual({ 0: '2-1' });
    expect(normalizeResults(undefined)).toEqual({});
  });
});

describe('onlyMetadata', () => {
  it('só data de exportação e versão não contam como alteração', () => {
    expect(onlyMetadata({ exportedAt: 'x', version: 7 })).toBe(true);
    expect(onlyMetadata({})).toBe(true);
    expect(onlyMetadata({ exportedAt: 'x', 'results/0': null })).toBe(false);
  });
});

describe('describeUpdates', () => {
  const snap = {
    teams: [{ name: 'Leões' }, { name: 'Águias' }],
    schedule: [{ home: 0, away: 1 }, { home: 'Vencedor A', away: 1 }],
  };

  it('descreve o resultado com os nomes das equipas', () => {
    const r = { score: '2-1', status: 'terminado', scorers: { home: [], away: [] } };
    expect(describeUpdates({ 'results/0': r, exportedAt: 'x' }, snap))
      .toBe('Result Leões vs Águias: 2-1, terminado');
  });

  it('inclui penáltis e resultados apagados', () => {
    expect(describeUpdates({ 'results/1': { score: '1-1', penalties: '4-3' } }, snap))
      .toBe('Result Vencedor A vs Águias: 1-1 (pen. 4-3)');
    expect(describeUpdates({ 'results/0': null }, snap)).toBe('Result deleted: Leões vs Águias');
  });

  it('resume secções e ignora metadados', () => {
    expect(describeUpdates({ meta: {}, config: {}, teams: [], exportedAt: 'x', version: 5 }, snap))
      .toBe('Tournament details updated; Settings updated; Teams updated');
    expect(describeUpdates({ exportedAt: 'x', version: 5 }, snap)).toBe('');
  });

  it('resume vários resultados apagados numa só frase', () => {
    expect(describeUpdates({ schedule: [], 'results/0': null, 'results/1': null, arquivo: [] }, snap))
      .toBe('2 results deleted; Schedule updated; Tournament history updated');
  });

  it('jogo sem calendário usa o número', () => {
    expect(describeUpdates({ 'results/7': { score: '0-0' } }, snap)).toBe('Result match 8: 0-0');
  });

  it('alterações campo a campo do calendário aparecem uma vez', () => {
    expect(describeUpdates({ 'schedule/3/home': 0, 'schedule/3/away': 1 }, snap)).toBe('Schedule updated');
  });
});

describe('normalizeArquivo', () => {
  it('repõe listas apagadas pelo Firebase e garante campo sport', () => {
    expect(normalizeArquivo(undefined)).toEqual([]);
    expect(normalizeArquivo([{ nome: 'T', grupos: [{ nome: 'G' }] }])).toEqual([
      { nome: 'T', sport: 'football', grupos: [{ nome: 'G', tabela: [] }], jogadores: [] },
    ]);
  });

  it('converte objetos com chaves numéricas em listas', () => {
    const fb = { 0: { nome: 'A', sport: 'padel', jogadores: { 0: { pid: 'x' } } }, 2: { nome: 'B' } };
    expect(normalizeArquivo(fb).map((e) => e.nome)).toEqual(['A', 'B']);
    expect(normalizeArquivo(fb)[0].sport).toBe('padel');
    expect(normalizeArquivo(fb)[1].sport).toBe('football');
    expect(normalizeArquivo(fb)[0].jogadores).toEqual([{ pid: 'x' }]);
  });
});

describe('normalizeConfig', () => {
  it('applies defaults and sets sport to football when undefined', () => {
    const cfg = normalizeConfig();
    expect(cfg.sport).toBe('football');
    expect(cfg.nome).toBe('Futebol ILOG');
    expect(cfg.numEquipas).toBe(8);
  });

  it('sets sport to football when config lacks sport (version <= 7)', () => {
    const cfg = normalizeConfig({ nome: 'Torneio Teste', numEquipas: 6 });
    expect(cfg.sport).toBe('football');
    expect(cfg.nome).toBe('Torneio Teste');
    expect(cfg.numEquipas).toBe(6);
  });

  it('preserves existing sport if present', () => {
    const cfg = normalizeConfig({ sport: 'padel', nome: 'Open Padel' });
    expect(cfg.sport).toBe('padel');
    expect(cfg.nome).toBe('Open Padel');
  });

  it('normalizes empty sport string to football', () => {
    const cfg = normalizeConfig({ sport: '' });
    expect(cfg.sport).toBe('football');
  });
});

describe('normalizeMeta', () => {
  it('creates default meta when undefined', () => {
    const meta = normalizeMeta();
    expect(meta.sport).toBe('football');
    expect(meta.name).toBe('Futebol ILOG');
    expect(meta.status).toBe('active');
    expect(typeof meta.createdAt).toBe('number');
  });

  it('inherits from config when meta is missing fields', () => {
    const meta = normalizeMeta({}, { nome: 'Meu Torneio', sport: 'padel' });
    expect(meta.name).toBe('Meu Torneio');
    expect(meta.sport).toBe('padel');
    expect(meta.status).toBe('active');
  });

  it('preserves valid meta fields', () => {
    const meta = normalizeMeta({
      id: 'tourney-1',
      name: 'Custom',
      sport: 'basketball',
      status: 'finished',
      createdAt: 12345,
    });
    expect(meta.id).toBe('tourney-1');
    expect(meta.name).toBe('Custom');
    expect(meta.sport).toBe('basketball');
    expect(meta.status).toBe('finished');
    expect(meta.createdAt).toBe(12345);
  });
});


describe('legacyRoleUpdates', () => {
  it('copies roles of users without a role in users', () => {
    const utilizadores = { a: { role: 'admin' }, u: { role: 'user' }, x: { role: 'hacker' }, n: null };
    const users = { a: { role: null }, u: {} };
    expect(legacyRoleUpdates(utilizadores, users)).toEqual({
      'users/a/role': 'admin',
      'users/a/admin/football': true,
      'users/u/role': 'user',
    });
  });

  it('keeps roles already set in users', () => {
    expect(legacyRoleUpdates({ a: { role: 'admin' } }, { a: { role: 'user' } })).toEqual({});
    expect(legacyRoleUpdates(null, null)).toEqual({});
  });
});
````

## File: eslint.config.mjs
````javascript
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '.claude/skills/', 'docker/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // App code: runs in the browser
    files: ['src/**/*.{js,ts}'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Tests, rules and config: runs in Node
    files: ['tests/**/*.{js,mjs,ts}', '*.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
);
````

## File: css/jogos.css
````css
/* ---------- Rounds (calendar/results) ---------- */
.round-card {
  margin-bottom: 14px;
}

.round-head {
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #fff;
  background: var(--pitch-600);
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  display: inline-block;
}

.round-games {
  border: 1px solid var(--line);
  border-top: none;
  border-radius: 0 8px 8px 8px;
  background: var(--card);
}

.fixture {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.fixture:last-child {
  border-bottom: none;
}

.fx-home {
  text-align: right;
  font-weight: 600;
}

.fx-away {
  text-align: left;
  font-weight: 600;
}

.fx-vs {
  color: var(--ink-faint);
  font-size: 11px;
  font-family: var(--font-display);
  letter-spacing: .05em;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-direction: column;
}

.fx-score {
  color: var(--ink);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: .04em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.fixture-bye {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--ink-faint);
  font-style: italic;
  font-size: 13px;
}

.result-split {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-self: center;
}

.res-box {
  width: 40px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 15px;
  padding: 6px 4px;
  border: 1.5px solid var(--line);
  border-radius: 6px;
  -moz-appearance: textfield;
  background: var(--card);
  color: var(--ink);
}

.res-box::-webkit-outer-spin-button,
.res-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.res-static {
  display: inline-block;
  min-height: 1.4em;
  line-height: 1.4em;
}

.res-sep {
  color: var(--ink-faint);
  font-weight: 600;
}

.penalties-split {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  grid-column: 1 / span 3;
  margin-top: 4px;
  padding: 6px 12px;
  background: rgba(203, 161, 53, 0.1);
  border: 1px solid rgba(203, 161, 53, 0.3);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--pitch-800);
}

[data-theme="dark"] .penalties-split {
  color: var(--gold);
}

.pen-box {
  width: 32px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 13px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 4px;
  -moz-appearance: textfield;
  background: var(--card);
  color: var(--ink);
}

.pen-box::-webkit-outer-spin-button,
.pen-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pen-label {
  font-weight: 600;
  margin-right: 4px;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
}

.score-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--press) ease, transform var(--press) var(--ease-out);
  padding: 0;
  line-height: 1;
}

/* The circle stays small so a fixture fits one line, but the thumb gets the
   full 44px of height: scoring happens one-handed, next to the pitch. The
   target only grows vertically so it never covers the box beside it. */
.score-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: var(--tap);
  transform: translateY(-50%);
}

.score-btn:active {
  background: var(--line);
  transform: scale(0.94);
}

/* Estado da Partida Badge */
.status-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: 1px solid transparent;
}

/* On the results page the pill is the control that moves a match on, so it is
   tapped during the game: give it a 44px target. On the schedule the whole
   row opens the match, so the pill there keeps its own size and nothing more,
   otherwise it would swallow taps meant for the row. */
.fixture-input button.status-badge {
  position: relative;
  padding: 7px 12px;
  font-size: 11px;
  transition: transform var(--press) var(--ease-out);
}

.fixture-input button.status-badge::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: var(--tap);
  transform: translateY(-50%);
}

/* A profile that cannot change results sees the status as a label */
span.status-badge {
  cursor: default;
}

button.status-badge:active {
  transform: scale(.97);
}

.status-agendado {
  background: var(--paper);
  color: var(--ink-soft);
  border-color: var(--line);
}

.status-decorrer {
  background: rgba(203, 161, 53, .15);
  color: #7E601C;
  border-color: rgba(203, 161, 53, .3);
  animation: pulse 2s infinite;
}

.status-terminado {
  background: rgba(47, 122, 79, .15);
  color: #246B42;
  border-color: rgba(47, 122, 79, .3);
}

[data-theme="dark"] .status-decorrer {
  color: var(--gold);
}

[data-theme="dark"] .status-terminado {
  color: #7dd8a0;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

/* ---------- Racket scoreboard (padel, tennis) ----------
   One line per side, like a broadcast scoreboard: the side, the games of
   each set, the sets won and, for admins in Results, − / +. */
.fixture-racket {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.racket-board {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  font-variant-numeric: tabular-nums;
}

.rb-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 4px 0 10px;
  border-radius: var(--radius-sm, 6px);
  background: var(--paper);
}

.rb-team {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: var(--ink-soft);
}

.rb-won .rb-team {
  font-weight: 700;
  color: var(--ink);
}

.rb-sets {
  display: flex;
  gap: 2px;
}

.rb-set {
  width: 24px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  border-radius: 4px;
}

.rb-set.rb-lost {
  color: var(--ink-faint);
  font-weight: 500;
}

.rb-set.rb-current {
  background: var(--gold);
  color: #0F2A1C;
}

.rb-total {
  min-width: 30px;
  padding: 2px 6px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  border-radius: 4px;
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink);
}

.rb-won .rb-total {
  background: var(--pitch-500);
  border-color: transparent;
  color: #fff;
}

.rb-steps {
  display: flex;
  gap: 6px;
}

.rb-note {
  text-align: center;
  font-size: 12px;
  color: var(--ink-faint);
}

.rb-status {
  display: flex;
  justify-content: center;
}

.fixture-racket .fixture-actions {
  margin-top: 4px;
}

/* Phone: the name wraps instead of being cut by the − / + buttons */
@media (max-width: 480px) {
  .rb-line {
    gap: 6px;
    padding-left: 8px;
  }

  .rb-team {
    white-space: normal;
    overflow-wrap: anywhere;
    line-height: 1.2;
    padding: 4px 0;
  }

  /* teamLabel() sets nowrap inline on the name */
  .rb-team > span {
    white-space: normal !important;
  }

  .rb-set {
    width: 20px;
  }

  .rb-steps {
    gap: 4px;
  }
}
````

## File: docs/configuration.md
````markdown
# Setup and Deployment

[← Back to the README](../README.md)

How to get the app running: the Firebase project, the environment variables, local development and deployment to GitHub Pages.

- [Requirements](#requirements)
- [Setting up Firebase (once)](#setting-up-firebase-once)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Deployment](#deployment)
- [Common problems](#common-problems)

## Requirements

- Node.js 20 (the version used in CI)
- A Firebase project with **Realtime Database** and **Authentication**
- Optional: the [Firebase CLI](https://firebase.google.com/docs/cli) and Java (CI uses Java 21), for the emulators and for `npm run test:rules`

## Setting up Firebase (once)

1. **Authentication → Sign-in method:** enable **Google**.
2. **Authentication → Settings → Authorized domains:** add `dioogomartiins.github.io` (and `localhost` for development, which is usually already there).
3. **Realtime Database → Rules:** nothing to do by hand. The deploy publishes [`database.rules.json`](../database.rules.json) by itself (see [Deployment](#deployment)); you only need to create the service account described there.
4. **Master Admin:** open the site, sign in with Google, and then in **Realtime Database → Data** create `users/<your uid>/role` with the value `"master"` (the uid is shown in Authentication → Users). From then on, the other roles (User, per-sport Admin) are assigned in the app itself, in Manage → 👮 Users.

**Data saved by older versions.** Before multiple tournaments, the whole state lived in `torneio_state` and roles in `utilizadores/<uid>/role`. When a Master Admin signs in and `tournaments/default` does not exist yet, the app copies `torneio_state` into `tournaments/default`, moves the archive to `/arquivo` and the players to `/players` (their attributes become the football ratings). Every time a Master Admin signs in, the app also copies the roles from `utilizadores` to `users` for anyone who has no role there yet: an old `admin` becomes a football Admin and an old `user` stays a User. Profiles are not copied; each person's name and photo appear the next time they sign in. The old nodes stay in the database, read-only.

The rules are published automatically on every release tag (`release/*`) before the site (or via *workflow_dispatch*). Do not edit them in the console: the next deployment overwrites whatever is there. To publish them by hand (for example, to test on your own Firebase project), use `npx firebase-tools deploy --only database --project <id>`.

## Environment variables

`.env.example` lists the variables the app reads:

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase console → Project settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | same |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database (URL at the top of the Data page) |
| `VITE_FIREBASE_PROJECT_ID` | Project settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Project settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Project settings |
| `VITE_FIREBASE_APP_ID` | Project settings |
| `VITE_FIREBASE_MEASUREMENT_ID` | Project settings (Analytics) |
| `VITE_USE_EMULATORS` | Optional. `true` connects the app to the local emulators. |

`VITE_*` variables end up in the published JavaScript, so **none of them is secret**. Data is protected by the Realtime Database rules. Even so, `.env` is in `.gitignore` and must never be committed.

## Running locally

> ⚠️ Every action in the app writes to Firebase. If the local server uses the production database, a test click changes the real tournaments on everyone's phone.

```bash
npm install
npm run dev
```

Open `http://localhost:5173/sports-tournament/` (the app is served on the same path as on GitHub Pages; the root is blank).

Pick one of these ways to stay away from the real tournaments:

**A. Test database.** Vite reads `.env.development.local` on top of `.env` in `npm run dev`. Create it with the URL of another database (for example, a second instance in the same project):

```env
VITE_FIREBASE_DATABASE_URL=https://<test-database>.firebasedatabase.app
```

**B. Firebase emulators (fully offline).**

```bash
firebase emulators:start --only database,auth --project demo-torneio
```

And in `.env.development.local`:

```env
VITE_USE_EMULATORS=true
VITE_FIREBASE_PROJECT_ID=demo-torneio
VITE_FIREBASE_DATABASE_URL=https://demo-torneio-default-rtdb.firebaseio.com
```

The emulator loads `database.rules.json` (from `firebase.json`) into the `demo-torneio-default-rtdb` namespace only, so the database URL must use that name: any other namespace runs with no rules and every write succeeds. With `VITE_USE_EMULATORS=true` the header shows a role switcher instead of Google sign-in. It signs in as one of the dev accounts (`master@torneio.local`, `admin@torneio.local` with `admin/football: true`, `user@torneio.local`, all with password `password123`) and sets its role through the emulator's admin token; **Viewer** signs out.

**C. Docker Compose (fully containerized, zero local Java/Firebase install needed).**

Run both the Firebase Emulator Suite (Realtime Database + Auth + Emulator UI) and the Vite frontend inside Docker:

```bash
docker compose up -d
```

- **Torneio App**: `http://localhost:5173/sports-tournament/`
- **Firebase Emulator Suite UI**: `http://localhost:4000/` (explore database, auth users, logs)
- **Realtime Database Emulator**: `localhost:9000`
- **Auth Emulator**: `localhost:9099`

On startup the `firebase` container seeds the three dev accounts described in B, and the app signs in as Master. Switch role from the header.

To run only the Firebase emulators in Docker while running `npm run dev` on your host machine:

```bash
docker compose up -d firebase
npm run dev
```

Data in the emulator persists in the `torneio-firebase-data` volume across container restarts. To stop containers:

```bash
docker compose down
```

**Before opening a PR:**

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # logic tests
npm run test:rules   # rules tests in the emulator (if you changed database.rules.json; needs Java)
npm run build        # must pass
```

And check UI changes at a phone width (about 390px) and in both themes.

## Deployment

![Deploy: rules first, then the site](assets/illustrations/15-deploy-regras-e-site.jpg)

Deployment runs through the [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) workflow when a release tag (`release/*`) is pushed, or manually via *workflow_dispatch*. Merging or pushing to `main` does not deploy. It runs two jobs in a row:

1. **Rules (`rules`):** tests `database.rules.json` in the Firebase emulator (`npm run test:rules`) and, if it passes, publishes the rules to the Realtime Database with `firebase deploy --only database`.
2. **Site (`deploy`):** only starts if the rules were published. Installs dependencies, runs ESLint, the type check and the tests, creates `.env` from the secrets, builds, and publishes `dist/` to GitHub Pages.

The rules go first because the new site depends on them (for example, the `logRef` of the [activity log](architecture.md#activity-log)). If the rules fail, the old site stays up and nothing is left half-done. That is why changes are made on a branch with a PR, and released with a tag.

When the rules change in an incompatible way, phones with the old page open can no longer save ("The change was rejected by the database (permission denied). It has been reverted.") until they reload the page.

What must be configured on GitHub:

- **Settings → Pages → Source:** *GitHub Actions* (with *Deploy from a branch* the site serves the source code and does not work).
- **Settings → Secrets and variables → Actions → Repository secrets:**
  - a secret with the same name for each `VITE_FIREBASE_*` in `.env.example`;
  - `FIREBASE_SERVICE_ACCOUNT`: the JSON of a service account of the Firebase project (Firebase console → ⚙️ Project settings → Service accounts → Generate new private key). It is only used to publish the rules. The `firebase-adminsdk` account the console creates already has permission; if you use another one, give it the *Firebase Realtime Database Admin* role.

  They must be **repository** secrets, not only secrets of the `github-pages` environment: the rules job does not use that environment and cannot see them. Without them the deployment fails with an explicit error.

The site lives at `https://dioogomartiins.github.io/sports-tournament/` (the path comes from `base` in `vite.config.js`).

## Common problems

| Symptom | Likely cause |
|---|---|
| Blank page on the local server | You opened `localhost:5173/` instead of `localhost:5173/sports-tournament/` |
| Firebase errors in the browser console | Missing `.env` or wrong database URL |
| "Your account has not been approved by an admin yet." | The account has no role: the Master Admin must give it one in Manage → 👮 Users |
| "Only an admin can make this change." | The account is a User (or an Admin of another sport) and the change needs an admin of this tournament's sport |
| "The change was rejected by the database (permission denied). It has been reverted." | The page is out of date compared with the published rules: reload. If it persists, the account does not have the role for that change |
| Google sign-in fails on the published site | `dioogomartiins.github.io` is not in the authorized domains |
| A push to `main` did not update the site | Expected: deployment only runs on `release/*` tags or a manual run of the workflow |
| Deploy fails at "Create .env from repository secrets" | The repository's `VITE_FIREBASE_*` secrets are missing |
| Deploy fails at "Test rules in the emulator" | `database.rules.json` broke a case in `tests/rules/rules.check.mjs`; run `npm run test:rules` locally |
| Deploy fails at "Deploy database rules" | The `FIREBASE_SERVICE_ACCOUNT` secret is missing (or only in the `github-pages` environment), or the service account lacks the *Firebase Realtime Database Admin* role |
| Published site shows `Failed to resolve module specifier` | Pages is set to *Deploy from a branch* instead of *GitHub Actions* |
````

## File: src/components/ResultsList.ts
````typescript
// ---------------------------------------------------------------------------
// <results-list> — a result row per match, by round (Results tab)
// ---------------------------------------------------------------------------
// Football rows have score boxes and − / + per side (penalties in a tied
// playoff); racket rows are a scoreboard (racketBoard.ts) with − / + one game
// per side. Without `editable` (signed out, or not an admin of the
// sport) the scores are read-only: no − / + and the status pill is a label.
// Events (detail always has the match `gi`):
//   score-step   { gi, side, action: 'add' | 'sub' }   a − / + button
//   score-commit { gi, score: '3-1' | null, penalties? } boxes left with a valid score
//   status-click gi                                    the status pill
//   open-match   gi                                    the "Match" button
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import { GAME_STATUS } from '../types.js';
import type { Config, Match, MatchResult, RoundMeta, Team } from '../types.js';
import type { Sport } from '../sports/Sport.js';
import { RacketSport } from '../sports/RacketSport.js';
import { en } from '../i18n/en.js';
import { LightElement } from './LightElement.js';
import { sideLabel } from './templates.js';
import { groupRounds, statusBadge, statusOf } from './rounds.js';
import { racketBoard } from './racketBoard.js';
import type { Round } from './rounds.js';

export type ScoreSide = 'home' | 'away';

export interface ScoreStep {
  gi: string;
  side: ScoreSide;
  action: 'add' | 'sub';
}

export interface ScoreCommit {
  gi: string;
  /** "home-away", or null to clear the result. */
  score: string | null;
  penalties?: string;
}

const SCORE = /^(\d+)-(\d+)$/;

export class ResultsList extends LightElement {
  static properties = {
    schedule: { attribute: false },
    roundsMeta: { attribute: false },
    results: { attribute: false },
    teams: { attribute: false },
    sport: { attribute: false },
    config: { attribute: false },
    editable: { attribute: false },
  };

  declare schedule: Match[];
  declare roundsMeta: RoundMeta[];
  declare results: Record<string | number, MatchResult>;
  declare teams: Team[];
  declare sport: Sport | null;
  declare config: Config | null;
  /** Can the profile change results? */
  declare editable: boolean;

  constructor() {
    super();
    this.schedule = [];
    this.roundsMeta = [];
    this.results = {};
    this.teams = [];
    this.sport = null;
    this.config = null;
    this.editable = false;
  }

  render(): TemplateResult {
    if (!this.schedule.length) return html`<p class="empty">${en.schedule.noScheduledMatches}</p>`;
    const rounds = groupRounds(this.schedule, this.roundsMeta).filter((r) => r.games.length);
    return html`${rounds.map((r) => this.roundTemplate(r))}`;
  }

  private roundTemplate(round: Round): TemplateResult {
    const racket = this.sport instanceof RacketSport ? this.sport : null;
    return html`
      <div class="round-card"><div class="round-head">${round.title}</div><div class="round-games">
        ${round.games.map(({ game, gi }) => (racket ? this.racketRow(racket, game, gi) : this.footballRow(game, gi)))}
      </div></div>`;
  }

  // -------------------------------------------------------------------------
  // Rows
  // -------------------------------------------------------------------------

  private footballRow(game: Match, gi: number): TemplateResult {
    const val = this.results[gi];
    const status = statusOf(val);
    const score = SCORE.exec(String((val && typeof val === 'object' ? val.score : val) || ''));
    const pen = SCORE.exec(String((val && typeof val === 'object' && val.penalties) || ''));
    const tied = !!score && score[1] === score[2];
    const showPenalties = tied && status === GAME_STATUS.TERMINADO && !!game.isPlayoff;
    const box = (side: ScoreSide, value: string, cls: string) => !this.editable
      ? html`<span class="${cls} res-static" data-side=${side}>${value}</span>`
      : html`
      <input type="number" class="input ${cls}" data-side=${side} min="0" max="99" inputmode="numeric"
        .value=${live(value)} @keydown=${ResultsList.blurOnEnter} @focusout=${(e: FocusEvent) => this.commit(e, String(gi))}>`;

    return html`
      <div class="fixture fixture-input" data-game=${gi}>
        <span class="fx-home">${sideLabel(this.teams, game, 'home')}</span>
        <div class="result-split">
          ${this.stepButton(gi, 'home', 'sub')}${box('home', score ? score[1] : '', 'res-box')}${this.stepButton(gi, 'home', 'add')}
          <span class="res-sep">-</span>
          ${this.stepButton(gi, 'away', 'sub')}${box('away', score ? score[2] : '', 'res-box')}${this.stepButton(gi, 'away', 'add')}
        </div>
        <span class="fx-away">${sideLabel(this.teams, game, 'away')}</span>
        ${showPenalties ? html`
          <div class="penalties-split">
            <span class="pen-label">${en.results.penalties}</span>
            ${box('home', pen ? pen[1] : '', 'pen-box')}<span class="res-sep">-</span>${box('away', pen ? pen[2] : '', 'pen-box')}
          </div>` : nothing}
        ${this.actionsTemplate(gi, status)}
      </div>`;
  }

  /**
   * A scoreboard line per side (games of every set, sets won) with − / + one
   * game; in a match played to points (Americano), the points with − / + one
   * point. Scores are not typed.
   */
  private racketRow(sport: RacketSport, game: Match, gi: number): TemplateResult {
    const val = this.results[gi];
    return html`
      <div class="fixture fixture-input fixture-racket" data-game=${gi}>
        ${racketBoard({
          sport, config: this.config, result: val,
          label: (side) => sideLabel(this.teams, game, side),
          onStep: this.editable ? (side, action) => this.emit<ScoreStep>('score-step', { gi: String(gi), side, action }) : undefined,
        })}
        ${this.actionsTemplate(gi, statusOf(val))}
      </div>`;
  }

  private stepButton(gi: number, side: ScoreSide, action: 'add' | 'sub'): TemplateResult | typeof nothing {
    if (!this.editable) return nothing;
    return html`<button class="score-btn" data-side=${side}
      @click=${() => this.emit<ScoreStep>('score-step', { gi: String(gi), side, action })}>${action === 'add' ? '+' : '-'}</button>`;
  }

  private actionsTemplate(gi: number, status: ReturnType<typeof statusOf>): TemplateResult {
    return html`
      <div class="fixture-actions">
        ${statusBadge(status, this.editable ? () => this.emit('status-click', String(gi)) : undefined)}
        <button class="mini-btn game-open-btn" title=${en.results.matchButtonTitle}
          @click=${() => this.emit('open-match', String(gi))}>${en.results.matchButton}</button>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Typed scores
  // -------------------------------------------------------------------------

  private static blurOnEnter(e: KeyboardEvent): void {
    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
  }

  /**
   * Reads the boxes of a row when one loses focus. Both empty clears the
   * result; one empty or not a number marks the boxes and saves nothing.
   */
  private commit(e: FocusEvent, gi: string): void {
    const row = (e.target as HTMLElement).closest('.fixture-input');
    if (!row) return;
    const boxes = [...row.querySelectorAll<HTMLInputElement>('.res-box')];
    const pens = [...row.querySelectorAll<HTMLInputElement>('.pen-box')];
    const [home, away] = boxes.map((b) => b.value.trim());
    const valid = (v: string) => v !== '' && !isNaN(Number(v));
    const all = [...boxes, ...pens];

    if (home === '' && away === '') {
      all.forEach((b) => b.classList.remove('input-invalid'));
      this.emit<ScoreCommit>('score-commit', { gi, score: null });
      return;
    }
    if (!valid(home) || !valid(away)) {
      boxes[0].classList.toggle('input-invalid', !valid(home));
      boxes[1].classList.toggle('input-invalid', !valid(away));
      return;
    }
    all.forEach((b) => b.classList.remove('input-invalid'));
    const [pHome, pAway] = pens.map((b) => b.value.trim());
    const penalties = pens.length && valid(pHome) && valid(pAway)
      ? `${parseInt(pHome, 10)}-${parseInt(pAway, 10)}` : undefined;
    this.emit<ScoreCommit>('score-commit', { gi, score: `${parseInt(home, 10)}-${parseInt(away, 10)}`, penalties });
  }
}

if (!customElements.get('results-list')) customElements.define('results-list', ResultsList);

declare global {
  interface HTMLElementTagNameMap {
    'results-list': ResultsList;
  }
}
````

## File: src/components/ScoreBase.ts
````typescript
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

/** Detail of the panel's events (point, cancelled, started, finished, mvp, share). */
export interface ScoreEvent {
  gi: string;
  side?: ScoreSide;
}

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
  /** Racket sports played to points (padel Americano): the match total. */
  points?: number;
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
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
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
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, .4);
      background: rgba(255, 255, 255, .1);
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      transition: transform var(--press) var(--ease-out), background var(--press) ease;
    }

    .gm-point-btn:active,
    .gm-status-btn:active {
      transform: scale(.94);
    }

    .gm-point-btn:active {
      background: rgba(255, 255, 255, .2);
    }

    .gm-status-btn {
      margin-top: 12px;
      padding: 11px 20px;
      min-height: 44px;
      border: none;
      border-radius: 8px;
      background: var(--gold);
      color: var(--pitch-900);
      font-size: 14px;
      font-weight: 600;
      transition: transform var(--press) var(--ease-out);
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
    this.dispatchEvent(new CustomEvent<ScoreEvent>(name, {
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
````

## File: src/core/archive.ts
````typescript
import { getSport } from '../sports/registry.js';
import type { PlayerRecord, Sport } from '../sports/Sport.js';
import {
  GAME_STATUS,
  type ArchiveEntry,
  type ArchivePlayer,
  type Config,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type SquadPlayer,
  type Team,
  type TournamentMeta,
} from '../types.js';

// ---------------------------------------------------------------------------
// Tournament Archive
// ---------------------------------------------------------------------------

/**
 * Determines the tournament champion index: winner of the playoff final if playoffs exist,
 * or 1st place in the league table (when single group). Returns null if not yet determined.
 */
export function getChampion(
  schedule: Match[],
  results: Record<string | number, MatchResult>,
  groupsData: GroupStandings[],
  sport: Sport = getSport(),
  config?: Config
): number | null {
  const playoffs = schedule.map((g, gi) => ({ g, gi })).filter(({ g }) => g.isPlayoff);
  if (playoffs.length) {
    const final = playoffs.find(({ g }) => !g.nextMatchId);
    if (!final) return null;
    const winner = sport.getPlayoffWinner(final.g, results[final.gi], config);
    return typeof winner === 'number' ? winner : null;
  }
  if (groupsData.length !== 1) return null;
  const leader = groupsData[0].standings[0];
  return leader && leader.J > 0 ? leader.idx : null;
}

/**
 * Count of tournament matches with an entered score (not scheduled).
 */
export function countPlayedGames(results: Record<string | number, MatchResult>): number {
  return Object.keys(results || {}).filter((gi) => {
    const r = results[gi];
    if (!r) return false;
    if (typeof r === 'object' && r.status === GAME_STATUS.AGENDADO) return false;
    const score = typeof r === 'object' ? r.score : String(r);
    return /^\d+-\d+$/.test(String(score || '').trim());
  }).length;
}

export interface ArchiveSnapshotInput {
  meta?: TournamentMeta;
  config: Config;
  teams: (Team | string)[];
  schedule: Match[];
  results: Record<string | number, MatchResult>;
  scheduleTeamCount?: number;
  /** Players of each team, for matches played and won per player. */
  squads?: SquadPlayer[][] | null;
}

/**
 * Creates an archive entry for a concluded tournament.
 */
export function buildArchiveEntry(
  snap: ArchiveSnapshotInput,
  playerNames: Record<string, string>,
  id: string,
  dataIso: string
): ArchiveEntry {
  const sportId = snap.meta?.sport || snap.config?.sport || 'football';
  const sport = getSport(sportId);
  const teamsArray = snap.teams.slice(0, snap.scheduleTeamCount || snap.config.numEquipas);
  const groupsData = sport.computeStandings(teamsArray, snap.schedule, snap.results, snap.config);

  const teamOf = (idx: number) => {
    const t = teamsArray[idx];
    return {
      nome: (typeof t === 'object' && t !== null && t.name) ? t.name : `Team ${idx + 1}`,
      cor: (typeof t === 'object' && t !== null && t.color) ? t.color : '',
    };
  };

  const champIdx = getChampion(snap.schedule, snap.results, groupsData, sport, snap.config);
  const tally = sport.tallyPlayerStats(snap.results, []);
  const records = sport.playerRecords(snap.schedule, snap.results, snap.squads, [], snap.config);
  const empty: PlayerStats = { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
  const jogadores: ArchivePlayer[] = [...new Set([...Object.keys(tally), ...Object.keys(records)])]
    .map((pid) => ({
      pid,
      nome: playerNames[pid] || 'Unknown Player',
      ...empty,
      ...tally[pid],
      played: records[pid]?.played ?? 0,
      won: records[pid]?.won ?? 0,
    }))
    .sort(
      (a, b) =>
        b.golos - a.golos ||
        b.assistencias - a.assistencias ||
        b.mvp - a.mvp
    );

  return {
    id,
    nome: snap.meta?.name || snap.config.nome || 'Tournament',
    sport: sportId,
    data: dataIso,
    campeao: champIdx === null ? null : teamOf(champIdx),
    jogos: countPlayedGames(snap.results),
    golos: groupsData.reduce((s, g) => s + g.standings.reduce((t, x) => t + x.GM, 0), 0),
    grupos: groupsData.map((g) => ({
      nome: g.name,
      tabela: g.standings.map((s) => ({
        ...teamOf(s.idx),
        J: s.J,
        V: s.V,
        E: s.E,
        D: s.D,
        GM: s.GM,
        GS: s.GS,
        DG: s.DG ?? 0,
        Pts: s.Pts,
      })),
    })),
    jogadores,
  };
}

/**
 * Extracts player stats from an archive entry in the format of tallyPlayerStats.
 */
export function archiveTally(entry: { jogadores?: ArchivePlayer[] }): Record<string, PlayerStats> {
  const out: Record<string, PlayerStats> = Object.create(null);
  (entry.jogadores || []).forEach((j) => {
    out[j.pid] = {
      golos: j.golos || 0,
      assistencias: j.assistencias || 0,
      mvp: j.mvp || 0,
      jogosAMarcar: j.jogosAMarcar || 0,
      recorde: j.recorde || 0,
    };
  });
  return out;
}

/** Matches played and won per player in an archive entry (none before v12). */
export function archiveRecords(entry: { jogadores?: ArchivePlayer[] }): Record<string, PlayerRecord> {
  const out: Record<string, PlayerRecord> = Object.create(null);
  (entry.jogadores || []).forEach((j) => {
    if (j.played) out[j.pid] = { played: j.played, won: j.won || 0 };
  });
  return out;
}
````

## File: src/permissions.ts
````typescript
import type { Role } from './types.js';

// ---------------------------------------------------------------------------
// Permissions — what each user role can modify in the tournament
// ---------------------------------------------------------------------------
// Must match database.rules.json: Firebase security rules are the real protection;
// this client-side module only warns before sending and hides UI buttons.

export const ROLES: Record<Role, string> = {
  master: 'Master Admin',
  admin: 'Admin',
  user: 'User',
};

/**
 * Sections of a tournament that a regular user (or an admin of another sport)
 * can write to. Results, match status and the schedule are for the sport's
 * admins only.
 */
const USER_SECTIONS = ['jogosSingulares', 'exportedAt', 'version'] as const;

export function isKnownRole(role: string | null | undefined): role is Role {
  return typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLES, role);
}

export function isMaster(role: string | null | undefined): boolean {
  return role === 'master';
}

/**
 * Checks if the user is an admin for the specified sport.
 * Master is always an admin for all sports.
 * An admin is authorized if userAdmin[sport] is true.
 */
export function isSportAdmin(
  role: string | null | undefined,
  sport?: string,
  userAdmin?: Record<string, boolean> | null
): boolean {
  if (role === 'master') return true;
  if (role === 'admin' && sport && userAdmin && userAdmin[sport] === true) return true;
  return false;
}

export function roleLabel(
  role: string | null | undefined,
  userAdmin?: Record<string, boolean> | null
): string {
  if (role === 'master') return 'Master Admin';
  if (role === 'admin') {
    if (userAdmin) {
      const sports = Object.entries(userAdmin)
        .filter(([, v]) => v)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
      if (sports.length) return `Admin (${sports.join(', ')})`;
    }
    return 'Admin';
  }
  if (role === 'user') return 'User';
  return 'Pending';
}

export interface WritePathOptions {
  sport?: string;
  userAdmin?: Record<string, boolean> | null;
}

/**
 * Can this role write to the given path (relative to the tournament root)?
 */
export function canWritePath(
  role: string | null | undefined,
  path: string,
  options?: WritePathOptions
): boolean {
  const parts = String(path).split('/');
  // meta/sport is immutable after creation and cannot be updated directly
  if (parts[0] === 'meta' && parts[1] === 'sport') return false;

  if (role === 'master') return true;

  if (role === 'admin') {
    if (options && options.sport !== undefined) {
      if (isSportAdmin(role, options.sport, options.userAdmin)) return true;
    } else {
      return true;
    }
  }

  if (role !== 'user' && role !== 'admin') return false;
  return (USER_SECTIONS as readonly string[]).includes(parts[0]);
}

/**
 * Paths in an `update()` call that this role is not permitted to write.
 */
export function blockedPaths(
  role: string | null | undefined,
  updates: Record<string, unknown>,
  options?: WritePathOptions
): string[] {
  return Object.keys(updates).filter((p) => !canWritePath(role, p, options));
}
````

## File: src/utils.ts
````typescript
import { state } from './state.js';
import type { PlayerIndex, Team, ArchiveEntry, Match } from './types.js';

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function numOr(v: unknown, fallback: number): number {
  const n = parseFloat(String(v));
  return isFinite(n) ? n : fallback;
}

export function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] || c));
}

/** Accepts only hex colors (#rgb or #rrggbb); any other value falls back to the default color. */
export function safeColor(c: unknown): string {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c)) ? String(c) : '#2F7A4F';
}

export function fmtTimestamp(iso: string | number): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return String(iso);
  }
}

export function fmtDate(isoOrMillis: string | number): string {
  try {
    const d = new Date(isoOrMillis);
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return String(isoOrMillis);
  }
}

export function getTeamName(idx: number | string): string {
  if (typeof idx === 'string') return idx;
  const teams = state.teams as Team[] | null | undefined;
  const t = teams?.[idx];
  return t && t.name ? t.name : `Team ${idx + 1}`;
}

/** Name of a match side: the team, or both players of a rotating pair ("Ana / Rui"). */
export function sideName(game: Match, side: 'home' | 'away'): string {
  const partner = game.partners?.[side];
  const first = getTeamName(game[side]);
  return typeof partner === 'number' ? `${first} / ${getTeamName(partner)}` : first;
}

export function getActiveTeamNames(): string[] {
  const arr: string[] = [];
  const count = state.scheduleTeamCount || 0;
  for (let i = 0; i < count; i++) {
    arr.push(getTeamName(i));
  }
  return arr;
}

/**
 * Builds a player index map pId -> { name, team } traversing squads once to avoid O(n^2) lookups.
 */
export function buildPlayerIndex(): PlayerIndex {
  const index: PlayerIndex = {};
  (state.players || []).forEach((p: { id: string; nome: string; teamIdx?: number | null }) => {
    const tName = p.teamIdx !== null && p.teamIdx !== undefined ? getTeamName(p.teamIdx) : 'No Team';
    index[p.id] = { name: p.nome, team: tName };
  });
  (state.squads || []).forEach((squad: Array<{ id: string; name: string }>, teamIndex: number) => {
    (squad || []).forEach((player: { id: string; name: string }) => {
      index[player.id] = { name: player.name, team: getTeamName(teamIndex) };
    });
  });
  return index;
}

/** Resolves player display name from database, squads or archive. */
export function playerName(pid: string): string {
  const info = buildPlayerIndex()[pid];
  if (info) return info.name;
  const archive = state.arquivo as ArchiveEntry[] | null | undefined;
  for (const e of archive || []) {
    const j = (e.jogadores || []).find((x: { pid: string; nome: string }) => x.pid === pid);
    if (j) return j.nome;
  }
  return 'Unknown Player';
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
````

## File: tests/padel.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import { padel } from '../src/sports/padel/Padel.js';
import type { Config, Match, MatchResult } from '../src/types.js';

const config = (extra: Partial<Config> = {}): Config => ({
  nome: 'Padel', numEquipas: 4, numGrupos: 1, numVoltas: 1,
  pontosVitoria: 3, pontosEmpate: 1, pontosDerrota: 0, bonusGoleada: 0, golosGoleada: 99,
  mataMata: false, numPlayoffTeams: 2, sport: 'padel', ...extra,
});
const F = padel.format(config());

describe('set format', () => {
  it('defaults to best of 3, 6 games, super tie-break', () => {
    expect(F).toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: true });
  });

  it('uses the tournament format and fixes invalid values', () => {
    expect(padel.format(config({ setFormat: { sets: 1, gamesPerSet: 4, superTieBreak: true } })))
      .toEqual({ sets: 1, gamesPerSet: 4, superTieBreak: false });
    expect(padel.format(config({ setFormat: { sets: 2, gamesPerSet: 50, superTieBreak: false } })))
      .toEqual({ sets: 3, gamesPerSet: 6, superTieBreak: false });
  });
});

describe('score text', () => {
  it('parses and writes sets', () => {
    expect(padel.parseSets('6-4 3-6 10-7')).toEqual([{ home: 6, away: 4 }, { home: 3, away: 6 }, { home: 10, away: 7 }]);
    expect(padel.formatSets(padel.parseSets('6-4 3-6 10-7'))).toBe('6-4 3-6 10-7');
    expect(padel.parseSets('')).toEqual([]);
    expect(padel.parseSets('6-4,3-6')).toEqual([]);
  });
});

describe('set and match completion', () => {
  it('wins a set with two games ahead, or 7-5 / 7-6', () => {
    expect(padel.setWinner({ home: 6, away: 4 }, 0, F)).toBe('home');
    expect(padel.setWinner({ home: 6, away: 5 }, 0, F)).toBeNull();
    expect(padel.setWinner({ home: 5, away: 7 }, 0, F)).toBe('away');
    expect(padel.setWinner({ home: 7, away: 6 }, 1, F)).toBe('home');
  });

  it('plays the deciding set as a super tie-break to 10', () => {
    expect(padel.setWinner({ home: 10, away: 8 }, 2, F)).toBe('home');
    expect(padel.setWinner({ home: 10, away: 9 }, 2, F)).toBeNull();
    expect(padel.setWinner({ home: 7, away: 6 }, 2, F)).toBeNull();
  });

  it('decides the match on the majority of sets', () => {
    expect(padel.matchWinner(padel.parseSets('6-4 6-3'), F)).toBe('home');
    expect(padel.matchWinner(padel.parseSets('6-4 3-6'), F)).toBeNull();
    expect(padel.matchWinner(padel.parseSets('6-4 3-6 7-10'), F)).toBe('away');
  });

  it('counts a super tie-break as one game for its winner', () => {
    expect(padel.gamesOf(padel.parseSets('6-4 3-6 10-7'), F)).toEqual({ home: 10, away: 10 });
  });
});

describe('scoring game by game', () => {
  it('starts the match and adds games to the current set', () => {
    let res: MatchResult | undefined = padel.addPoint(undefined, 'home', config());
    expect(res).toEqual({ score: '1-0', status: 'decorrer' });
    res = padel.addPoint(res, 'away', config());
    expect(res.score).toBe('1-1');
  });

  it('opens the next set when one is won and stops when the match is decided', () => {
    let res: MatchResult = { score: '5-4', status: 'decorrer' };
    res = padel.addPoint(res, 'home', config());
    expect(res.score).toBe('6-4');
    res = padel.addPoint(res, 'away', config());
    expect(res.score).toBe('6-4 0-1');
    const done = padel.addPoint({ score: '6-4 6-3', status: 'decorrer' }, 'away', config());
    expect(done.score).toBe('6-4 6-3');
  });

  it('cancels the last game of a side, reopening the previous set when the current one is empty', () => {
    expect(padel.removePoint({ score: '6-4 2-1', status: 'decorrer' }, 'home').score).toBe('6-4 1-1');
    expect(padel.removePoint({ score: '6-4 0-0', status: 'decorrer' }, 'home').score).toBe('5-4');
    expect(padel.removePoint({ score: '6-4 0-1', status: 'decorrer' }, 'home').score).toBe('6-4 0-1');
  });

  it('finishes the match on the game that decides it', () => {
    const won = padel.addPoint({ score: '6-4 5-3', status: 'decorrer' }, 'home', config());
    expect(won).toEqual({ score: '6-4 6-3', status: 'terminado' });
    // A set that is not the last one keeps the match going
    expect(padel.addPoint({ score: '5-4', status: 'decorrer' }, 'home', config()).status).toBe('decorrer');
    // One set of 4 games
    const oneSet = config({ setFormat: { sets: 1, gamesPerSet: 4, superTieBreak: false } });
    expect(padel.addPoint({ score: '3-2', status: 'decorrer' }, 'away', oneSet).status).toBe('decorrer');
    expect(padel.addPoint({ score: '3-2', status: 'decorrer' }, 'home', oneSet)).toEqual({ score: '4-2', status: 'terminado' });
  });

  it('reopens a finished match when the deciding game is cancelled', () => {
    expect(padel.removePoint({ score: '6-4 6-3', status: 'terminado' }, 'home', config())).toEqual({ score: '6-4 5-3', status: 'decorrer' });
    // Still decided (the other side lost a game): stays finished
    expect(padel.removePoint({ score: '6-4 6-3', status: 'terminado' }, 'away', config()).status).toBe('terminado');
  });

  it('starts at 0-0 in the first set', () => {
    expect(padel.setGameStatus(undefined, 'decorrer')).toEqual({ score: '0-0', status: 'decorrer' });
    expect(padel.addPoint(padel.setGameStatus(undefined, 'decorrer'), 'away', config()).score).toBe('0-1');
  });

  it('does not change the saved result', () => {
    const saved: MatchResult = { score: '1-0', status: 'decorrer' };
    padel.addPoint(saved, 'home', config());
    expect(saved.score).toBe('1-0');
  });
});

describe('standings by matches won', () => {
  const teams = ['A', 'B', 'C'];
  const schedule: Match[] = [
    { jornada: 1, home: 0, away: 1 },
    { jornada: 1, home: 1, away: 2 },
    { jornada: 2, home: 0, away: 2 },
    { jornada: 3, home: 0, away: 1, isPlayoff: true },
  ];

  it('gives the win points per match won and counts sets and games', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B 2-0
      1: { score: '6-0 6-0', status: 'terminado' }, // B beats C 2-0
      2: { score: '3-6 6-3 10-8', status: 'terminado' }, // A beats C 2-1
    };
    const [group] = padel.computeStandings(teams, schedule, results, config());
    expect(group.standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
    const a = group.standings[0];
    expect([a.J, a.V, a.D, a.SW, a.SL, a.Pts]).toEqual([2, 2, 0, 4, 1, 2]);
    const [three] = padel.computeStandings(teams, schedule, results, config({ winPoints: 3 }));
    expect(three.standings.map((r) => r.Pts)).toEqual([6, 3, 0]);
  });

  it('breaks level wins on set difference, then game difference', () => {
    // One win each. A +1 set (0 games), B 0 sets (+8 games), C -1 set: sets come first
    const circle: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B 2-0
      1: { score: '6-0 6-0', status: 'terminado' }, // B beats C 2-0
      2: { score: '6-4 2-6 4-6', status: 'terminado' }, // C beats A 2-1
    };
    expect(padel.computeStandings(teams, schedule, circle, config())[0].standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
    // A and C both beat B 2-0: A has the better game difference
    const games: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' }, // A beats B
      1: { score: '0-6 0-6', status: 'terminado' }, // C beats B
    };
    expect(padel.computeStandings(teams, schedule, games, config())[0].standings.map((r) => r.name)).toEqual(['C', 'A', 'B']);
  });

  it('goes to head-to-head when wins, sets and games are level', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-3', status: 'terminado' }, // A beats B
      2: { score: '3-6', status: 'terminado' }, // C beats A
      1: { score: '6-3', status: 'terminado' }, // B beats C
    };
    const fmt = config({ setFormat: { sets: 1, gamesPerSet: 6, superTieBreak: false } });
    const [group] = padel.computeStandings(teams, schedule, results, fmt);
    // all one win, 1-1 sets, 9-9 games, and a circle in head-to-head: fewest games lost, then name
    expect(group.standings.map((r) => r.name)).toEqual(['A', 'B', 'C']);
  });

  it('puts the pair that won the match between them first', () => {
    const rows = [
      { idx: 0, name: 'Zeta', J: 1, V: 1, E: 0, D: 0, GM: 9, GS: 9, DG: 0, Pts: 1 },
      { idx: 1, name: 'Alfa', J: 1, V: 1, E: 0, D: 0, GM: 9, GS: 9, DG: 0, Pts: 1 },
    ];
    const games: Match[] = [{ jornada: 1, home: 1, away: 0 }];
    const sorted = padel.resolveHeadToHead(rows, games, { 0: { score: '4-6', status: 'terminado' } }, config());
    expect(sorted.map((r) => r.name)).toEqual(['Zeta', 'Alfa']);
  });

  it('ignores scheduled matches and the playoffs', () => {
    const results: Record<string, MatchResult> = {
      0: { score: '6-0', status: 'agendado' },
      3: { score: '6-0 6-0', status: 'terminado' },
    };
    const [group] = padel.computeStandings(teams, schedule, results, config());
    expect(group.standings.every((r) => r.J === 0)).toBe(true);
  });

  it('reads the win points from the settings (1 by default, 0 to 10)', () => {
    expect(padel.winPoints(config())).toBe(1);
    expect(padel.winPoints(config({ winPoints: 3 }))).toBe(3);
    expect(padel.winPoints(config({ winPoints: 0 }))).toBe(0);
    expect(padel.winPoints(config({ winPoints: 99 }))).toBe(1);
  });
});

describe('playoffs and pair stats', () => {
  const final: Match = { jornada: 'Final', home: 0, away: 1, isPlayoff: true };

  it('gives the playoff to the side that won the match', () => {
    expect(padel.getPlayoffWinner(final, { score: '4-6 6-3 8-10', status: 'terminado' })).toBe(1);
    expect(padel.getPlayoffWinner(final, { score: '6-4 2-1', status: 'terminado' })).toBeNull();
    expect(padel.getPlayoffWinner(final, { score: '6-4 6-4', status: 'decorrer' })).toBeNull();
  });

  it('counts matches, wins, games and win percentage per pair', () => {
    const schedule: Match[] = [{ jornada: 1, home: 0, away: 1 }, { jornada: 2, home: 1, away: 0 }];
    const results: Record<string, MatchResult> = {
      0: { score: '6-4 6-4', status: 'terminado' },
      1: { score: '6-2 6-2', status: 'terminado' },
    };
    const [p0, p1] = padel.pairStats(2, schedule, results, config());
    expect(p0).toEqual({ played: 2, won: 1, lost: 1, gamesWon: 16, gamesLost: 20, winPct: 50 });
    expect(p1.gamesWon).toBe(20);
  });
});

describe('live events', () => {
  it('reports games, sets, cancelled games, kick-off and full time', () => {
    const ev = (prev: MatchResult | undefined, next: MatchResult) =>
      padel.resultEvents(prev ? { 0: prev } : {}, { 0: next }, config());
    expect(ev(undefined, padel.setGameStatus(undefined, 'decorrer'))).toEqual([{ type: 'inicio', gi: '0' }]);
    expect(ev({ score: '1-0', status: 'decorrer' }, { score: '1-1', status: 'decorrer' })).toEqual([{ type: 'game', gi: '0', side: 'away' }]);
    expect(ev({ score: '5-4', status: 'decorrer' }, { score: '6-4', status: 'decorrer' })).toEqual([{ type: 'set', gi: '0', side: 'home' }]);
    expect(ev({ score: '6-4 1-0', status: 'decorrer' }, { score: '6-4 0-0', status: 'decorrer' })).toEqual([{ type: 'anulado', gi: '0', side: 'home' }]);
    expect(ev({ score: '6-4 6-4', status: 'decorrer' }, { score: '6-4 6-4', status: 'terminado' })).toEqual([{ type: 'fim', gi: '0' }]);
  });
});

describe('player records', () => {
  it('counts matches played and won per player from the pairs', () => {
    const schedule: Match[] = [
      { jornada: 1, home: 0, away: 1 },
      { jornada: 1, home: 0, away: 1 },
      { jornada: 2, home: 1, away: 0 },
    ];
    const squads = [[{ id: 'a', num: '', name: 'A' }, { id: 'b', num: '', name: 'B' }], [{ id: 'c', num: '', name: 'C' }]];
    const results: Record<number, MatchResult> = {
      0: { score: '6-4 6-3', status: 'terminado' },
      1: { score: '6-4 2-1', status: 'decorrer' },
      2: { score: '4-6 7-5 10-8', status: 'terminado' },
    };
    expect(padel.playerRecords(schedule, results, squads, [], config({ setFormat: { sets: 3, gamesPerSet: 6, superTieBreak: true } })))
      .toEqual({ a: { played: 2, won: 1 }, b: { played: 2, won: 1 }, c: { played: 2, won: 1 } });
    expect(padel.profileStats({ golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 })).toEqual([]);
  });
});
````

## File: tests/permissions.test.js
````javascript
import { describe, it, expect } from 'vitest';
import { canWritePath, blockedPaths, roleLabel, isMaster, isSportAdmin } from '../src/permissions.js';

describe('canWritePath', () => {
  it('master pode gravar tudo exceto campos imutáveis', () => {
    expect(canWritePath('master', 'config')).toBe(true);
    expect(canWritePath('master', 'players')).toBe(true);
    expect(canWritePath('master', 'meta')).toBe(true);
    expect(canWritePath('master', 'meta/name')).toBe(true);
    expect(canWritePath('master', 'meta/sport')).toBe(false);
  });

  it('admin com modalidade autorizada pode gravar config do seu desporto', () => {
    const footAdminOpts = { sport: 'football', userAdmin: { football: true } };
    expect(canWritePath('admin', 'config', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'schedule', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'meta/name', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'meta/sport', footAdminOpts)).toBe(false);
  });

  it('admin NÃO altera config nem resultados de modalidade diferente', () => {
    const footAdminOnPadel = { sport: 'padel', userAdmin: { football: true } };
    expect(canWritePath('admin', 'config', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'schedule', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'meta/name', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'results/0', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'schedule/1/home', footAdminOnPadel)).toBe(false);
  });

  it('admin sem contexto de modalidade mantém compatibilidade', () => {
    expect(canWritePath('admin', 'config')).toBe(true);
    expect(canWritePath('admin', 'players')).toBe(true);
    expect(canWritePath('admin', 'meta/sport')).toBe(false);
  });

  it('utilizador grava jogos singulares, mas não resultados nem vencedores de playoff', () => {
    expect(canWritePath('user', 'results/3')).toBe(false);
    expect(canWritePath('user', 'schedule/4/home')).toBe(false);
    expect(canWritePath('user', 'schedule/4/away')).toBe(false);
    expect(canWritePath('user', 'jogosSingulares')).toBe(true);
    expect(canWritePath('user', 'exportedAt')).toBe(true);
  });

  it('utilizador não altera configuração, equipas, jogadores nem metadados', () => {
    expect(canWritePath('user', 'config')).toBe(false);
    expect(canWritePath('user', 'meta')).toBe(false);
    expect(canWritePath('user', 'meta/name')).toBe(false);
    expect(canWritePath('user', 'meta/sport')).toBe(false);
    expect(canWritePath('user', 'teams')).toBe(false);
    expect(canWritePath('user', 'squads')).toBe(false);
    expect(canWritePath('user', 'players')).toBe(false);
    expect(canWritePath('user', 'roundsMeta')).toBe(false);
  });

  it('utilizador não apaga nem reescreve o calendário', () => {
    expect(canWritePath('user', 'schedule')).toBe(false);
    expect(canWritePath('user', 'schedule/4')).toBe(false);
    expect(canWritePath('user', 'schedule/4/jornada')).toBe(false);
  });

  it('pendentes e visitantes não gravam nada', () => {
    expect(canWritePath(null, 'results/0')).toBe(false);
    expect(canWritePath(undefined, 'exportedAt')).toBe(false);
    expect(canWritePath('outro', 'results/0')).toBe(false);
  });
});

describe('blockedPaths', () => {
  it('devolve só os caminhos proibidos', () => {
    const updates = { 'results/1': {}, config: {}, exportedAt: 'x' };
    expect(blockedPaths('user', updates)).toEqual(['results/1', 'config']);
    expect(blockedPaths('master', updates)).toEqual([]);
    expect(blockedPaths('admin', updates)).toEqual([]);
    expect(blockedPaths('admin', updates, { sport: 'padel', userAdmin: { football: true } })).toEqual(['results/1', 'config']);
    expect(blockedPaths('master', { 'meta/sport': 'padel' })).toEqual(['meta/sport']);
  });
});

describe('roleLabel, isMaster e isSportAdmin', () => {
  it('mostra etiquetas corretas', () => {
    expect(roleLabel('master')).toBe('Master Admin');
    expect(roleLabel('admin')).toBe('Admin');
    expect(roleLabel('admin', { football: true })).toBe('Admin (Football)');
    expect(roleLabel('admin', { football: true, padel: true })).toBe('Admin (Football, Padel)');
    expect(roleLabel('user')).toBe('User');
    expect(roleLabel(null)).toBe('Pending');
  });

  it('isMaster valida corretamente', () => {
    expect(isMaster('master')).toBe(true);
    expect(isMaster('admin')).toBe(false);
    expect(isMaster('user')).toBe(false);
  });

  it('isSportAdmin valida modalidade', () => {
    expect(isSportAdmin('master', 'football')).toBe(true);
    expect(isSportAdmin('master', 'padel')).toBe(true);
    expect(isSportAdmin('admin', 'football', { football: true })).toBe(true);
    expect(isSportAdmin('admin', 'padel', { football: true })).toBe(false);
    expect(isSportAdmin('user', 'football', { football: true })).toBe(false);
  });
});
````

## File: docs/rules.md
````markdown
# Rules and Calculations

[← Back to the README](../README.md)

How the app gets to the numbers it shows. The schedule, draft and archive logic lives in `src/core/`, and each sport's rules (standings, tiebreaks, playoff winner, player stats) in its class: `src/sports/football/Football.ts`, and `src/sports/RacketSport.ts` with `src/sports/padel/Padel.ts` and `src/sports/tennis/Tennis.ts`. Tests are in `tests/core/`, `tests/football.test.ts`, `tests/padel.test.ts` and `tests/tennis.test.ts`.

Scoring, standings and player stats depend on the tournament's sport. The schedule, groups, playoffs and champion work the same for every sport. Padel's own rules are in [Padel](#padel), and tennis follows them with the differences in [Tennis](#tennis).

- [Scoring](#scoring)
- [Standings and tiebreaks](#standings-and-tiebreaks)
- [Schedule (Berger algorithm)](#schedule-berger-algorithm)
- [Groups](#groups)
- [Playoffs](#playoffs)
- [Champion](#champion)
- [Player rating](#player-rating)
- [Balanced teams (Single Match)](#balanced-teams-single-match)
- [Player stats](#player-stats)
- [Padel](#padel)
- [Americano and Mexicano](#americano-and-mexicano)
- [Tennis](#tennis)

## Scoring

Football. Padel and tennis only give points per match won (see [Padel](#padel)).

![Blowout bonus](assets/illustrations/03-bonus-de-goleada.jpg)

Configurable in ⚙️ Settings. Default values:

| | Points |
|---|---|
| Win | 3 |
| Draw | 1 |
| Loss | 0 |
| Bonus (blowout win) | +1 |

The **blowout bonus** goes to the team that wins scoring at least the configured number of goals (*Goals scored for bonus*, 3 by default). It counts goals scored, not the difference: a 3-2 also earns the bonus.

Only league-stage matches with a score that are not *Scheduled* count. Playoff matches do not count towards the standings.

## Standings and tiebreaks

![Head-to-head tiebreak](assets/illustrations/04-desempate-confronto-direto.jpg)

In football, teams are ranked by:

1. Points
2. Goal difference
3. Goals scored

If two or more teams are still level on all three, they are separated by **head-to-head** (only the matches between the tied teams):

4. Points in the matches between them
5. Goal difference in the matches between them
6. Goals scored in the matches between them
7. Fewest goals conceded overall
8. Alphabetical order

With groups, each group has its own table.

## Schedule (Berger algorithm)

![Berger algorithm](assets/illustrations/02-algoritmo-de-berger.jpg)

Each round is a single round-robin in which every team plays every other team once. The Berger algorithm fixes one team and rotates the others, which gives balanced matchdays and alternates who plays at home.

- **Odd number of teams:** on each matchday one team has a bye; the bye is shown in the schedule.
- **Several rounds:** in even rounds (2nd, 4th, …) the matches repeat with home and away swapped.
- **Extra round:** adds one more round at the end without touching existing matches (single league only, and before the playoffs), so results are kept.

A schedule with N teams has N−1 matchdays per round (N if N is odd) and N×(N−1)/2 matches per round.

## Groups

With 2, 4 or 8 groups, the teams are **drawn** into the groups every time the schedule is generated, in parts as equal as possible (the last groups may have fewer teams). Each group has its own Berger schedule, played on the same matchdays.

## Playoffs

![Groups and seeds](assets/illustrations/05-grupos-e-seeds.jpg)

The number of qualified teams is *qualified per group × number of groups* and must be 2, 4, 8 or 16. The bracket starts at:

| Teams | First round |
|---|---|
| 16 | Round of 16 |
| 8 | Quarter-Finals |
| 4 | Semi-Finals |
| 2 | Final |

**Seeds:** qualified teams are ordered by position, interleaving groups: 1st of A, 1st of B, …, 2nd of A, 2nd of B, … In the first round seed 1 plays the last seed, seed 2 the second-to-last, and so on, arranged so that seeds 1 and 2 can only meet in the final.

**Draws:** a playoff match that finishes level is decided on penalties. The winner moves by itself to the right slot of the next match.

## Champion

- With playoffs: the winner of the final (on penalties in football if it ends level; in padel and tennis, the side that wins the most sets).
- Without playoffs and with a single group: the league leader.
- With several groups and no playoffs there is no automatic champion.

## Player rating

![Player rating](assets/illustrations/06-rating-do-jogador.jpg)

Each player has 0 to 5 stars in six attributes per sport, kept separately:

| Sport | Attributes |
|---|---|
| ⚽ Football | Pace, Shooting, Passing, Dribbling, Defending, Physical |
| 🎾 Padel | Volley, Smash, Lob, Wall play, Defense, Fitness |
| 🎾 Tennis | Serve, Return, Forehand, Backhand, Volley, Fitness |

The **★ rating** is the average of that sport's six attributes for the tournament's sport, with one decimal place. A player never rated in a sport has ★ 0.0 there. A team's rating is the sum of its players' ratings.

## Balanced teams (Single Match)

![Balanced teams](assets/illustrations/07-equipas-equilibradas.jpg)

**⚽ Run Draft** splits the players who are there into two teams, using their rating for the sport of the tournament being viewed:

- The teams get the same number of players, or one apart if the total is odd.
- **Up to 20 players**, the app tries every possible split and keeps the one with the smallest total rating difference.
- **More than 20**, it starts from a *snake draft* (A, B, B, A, A, B, …, in rating order) and keeps swapping pairs of players between the teams while the difference goes down.

## Player stats

For each player the app counts:

| Stat | How it is counted |
|---|---|
| Goals | Each goal recorded with that scorer (own goals count for nobody) |
| Assists | Each goal where they were picked as the assist |
| MVP | Matches in which they were the MVP |
| Scoring matches | Matches in which they scored at least one goal |
| Record | Most goals in a single match |

The Stats tab adds up the current tournament and its single matches. History and the player profile also add the archived tournaments.

## Padel

![Padel game by game](assets/illustrations/19-padel-jogo-a-jogo.jpg)

Padel is scored **game by game**: no 15-30-40 points. A score is saved as the games of each set, e.g. `6-4 3-6 10-7`.

### Set format

Set per tournament in ⚙️ Settings → *Set format*. Defaults are in brackets.

| Setting | Values |
|---|---|
| Sets per match | 1, best of 3 [3], best of 5 |
| Games per set | 1 to 9 [6] |
| Super tie-break in the deciding set | on [on] / off |

- A set is won by reaching the games per set with a 2-game lead (6-4), or 7-6 with 6 games per set.
- The **super tie-break** replaces the deciding set (the 3rd of 3, the 5th of 5). It is played to 10 points with a 2-point lead and is entered with the same − / + buttons.
- The match ends when a pair has won the majority of the sets. After that, + does nothing.

### Standings

![Super tie-break in standings](assets/illustrations/20-super-tie-break.jpg)

Each match won is worth the **Win** points set in ⚙️ Settings → *Scoring* (1 by default, 0 to 10); a lost match is worth nothing. Pairs are ranked by:

1. Points (**Pts**), that is matches won
2. Set difference (**SD**: sets won − sets lost)
3. Game difference (**GD**: games won − games lost)
4. Head-to-head: matches won, then set difference, then game difference, in the matches between the tied pairs
5. Fewest games lost
6. Alphabetical order

A super tie-break counts as a set, and as **one game** for the pair that wins it (10-7 counts as 1-0), so it does not outweigh a whole set. The table also shows matches played (P), won (W) and lost (L).

### Pairs

![Draw pairs](assets/illustrations/21-sorteio-de-pares.jpg)

Each team is a pair of two players, without jersey numbers. In 👕 Squads an admin can:

- **Fix the pairs:** add two players to each team.
- **🎲 Draw pairs:** tick exactly two players per team. The players are sorted by the sport's rating, and the best is paired with the weakest, the second best with the second weakest, and so on. The pairs fill the teams in order, each team is renamed after its pair (e.g. "Rui / Nuno"), and the existing pairs are replaced.

### Stats

Padel records no goals, assists or MVP. The Stats tab shows games played, games per match, most games won, fewest games lost, the biggest win (by game difference) and most wins.

## Americano and Mexicano

![Americano partner rotation](assets/illustrations/23-americano-rotacao.jpg)

![Mexicano ranking](assets/illustrations/24-mexicano-ranking.jpg)

Padel formats where **partners change every round** and every player is ranked on their own. They are chosen in ⚙️ Settings → *Pairs* → *Format* (Fixed pairs is the default). The logic is in `src/core/americano.ts`.

- **Players:** each team is one player. The number of teams is the number of players, a multiple of 4 (4, 8, 12, …). **👤 Choose players** (same card) picks them from the database and names each team after its player.
- **Matches:** each match is two pairs of players, played to a fixed total of **points** (*Points per match*, 24 by default, 4 to 99). − / + add or remove one point; once the total is reached, + does nothing. Every player keeps the points their pair won.
- **Americano:** the schedule has n − 1 rounds for n players, and every player partners every other player exactly once. *Number of rounds* repeats that cycle, and **➕ Add Extra Round** adds one more cycle.
- **Mexicano:** **🔄 Generate Schedule** draws only the first round, from the padel rating: in each group of four, the 1st and 4th play the 2nd and 3rd. When every match of the round is finished, **➕ Next Mexicano Round** (Schedule) draws the next round the same way from the current standings.
- **Standings:** per player, by points won (**PW**), then point difference (**PD**), then matches won, then alphabetical order. The table also shows points lost (**PL**) and matches played, won and lost.

![Points per player](assets/illustrations/25-pontos-por-jogador.jpg)

- **No playoffs:** the standings are the final ranking, and the champion is the player at the top.

## Tennis

![Tennis singles and doubles](assets/illustrations/22-tenis-singulares-pares.jpg)

Tennis uses the same rules as padel: scored **game by game** (no 15-30-40), saved as the games of each set, ranked by games won, with the same tiebreaks and stats. The differences:

- **Set format defaults:** best of 3 sets of 6 games, and the deciding set is a **full set** (super tie-break off). An admin can switch on the super tie-break, or play 1 set or best of 5, in ⚙️ Settings → *Set format*.
- **Singles or doubles:** a team is one player (singles) or two (doubles). In 👕 Squads add one or two players per team, or use **🎲 Draw pairs** for doubles, balanced by tennis rating.
````

## File: src/ui/dom.ts
````typescript
// ---------------------------------------------------------------------------
// DOM element cache
// ---------------------------------------------------------------------------
// Elements of index.html by id, looked up once at start-up. Form fields are
// read and written through fieldValue / setFieldValue / isChecked.
export const dom: Record<string, HTMLElement> = {};

/** The tab panels (`<section class="panel">`). */
export const panels: HTMLElement[] = [];

export function cacheDom(): void {
  [
    'tournamentTitle', 'savePill', 'backupPill', 'marqueeTicker',
    'btnGerarCalendario', 'btnNovoTorneio', 'btnAtualizar', 'btnDarkMode', 'btnExportar', 'btnImportar', 'inputImportar',
    'btnMobileMenu', 'tabs',
    'btnAdicionarVolta', 'btnGerarEliminatorias', 'calendarActions',
    'dashboardPodium', 'dashboardStats', 'dashboardScorers',
    'cfgNome', 'cfgNumEquipas', 'cfgNumGrupos', 'cfgNumVoltas', 'cfgVitoria', 'cfgEmpate', 'cfgDerrota', 'cfgBonus', 'cfgGoleada', 'cfgSets', 'cfgGamesPerSet', 'cfgSuperTieBreak', 'cfgPadelFormat', 'cfgMatchPoints', 'cfgWinPoints', 'btnPickRotationPlayers', 'scheduleHint',
    'cfgMataMata', 'cfgNumPlayoffTeams',
    'teamsList', 'squadTeamSelect', 'squadPlayerNum', 'squadPlayerFromDB', 'btnAddPlayerFromDB', 'btnDrawPairs', 'squadList',
    'calendarList', 'resultsList', 'standingsWrapper', 'standingsNoteRacket', 'statsCards', 'statsTable',
    'modalOverlay', 'modalTitle', 'modalBody', 'modalCancel', 'modalConfirm', 'toastRoot',
    'btnNewPlayer', 'playerSearchInput', 'playersList',
    'draftNomeA', 'draftNomeB', 'draftPlayerList', 'btnFazerDraft', 'draftResultCard', 'draftTeamsResult',
    'draftLabelA', 'draftLabelB', 'draftScoreA', 'draftScoreB', 'btnGuardarJogo',
    'singularHistoricoList',
    'btnConta', 'devRoleContainer', 'devRoleSelect', 'usersList', 'logList',
    'historicoSempre', 'arquivoList', 'btnArquivar', 'btnPartilharTabela',
    'cardTorneiosAtivos', 'listaTorneiosAtivos', 'btnToggleTorneios', 'torneiosBody', 'torneiosCount', 'btnNovoTorneioModal', 'headerSportBadge',
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) dom[id] = el;
  });

  panels.splice(0, panels.length, ...document.querySelectorAll<HTMLElement>('.panel'));
}

/** Is the current profile admin or master? (the same check CSS uses to hide controls) */
export function isAdminView(): boolean {
  return document.body.dataset.role === 'admin' || document.body.dataset.role === 'master';
}

/** Is the current profile master? */
export function isMasterView(): boolean {
  return document.body.dataset.master === 'true' || document.body.dataset.role === 'master';
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** The value of a cached input or select. */
export function fieldValue(id: string): string {
  return (dom[id] as Field | undefined)?.value ?? '';
}

export function setFieldValue(id: string, value: string | number): void {
  const el = dom[id] as Field | undefined;
  if (el) el.value = String(value);
}

/** Is a cached checkbox ticked? */
export function isChecked(id: string): boolean {
  return (dom[id] as HTMLInputElement | undefined)?.checked ?? false;
}

/** Listens to a CustomEvent from a Lit component and hands its detail to the handler. */
export function onEvent<T>(target: EventTarget, name: string, handler: (detail: T) => void): void {
  target.addEventListener(name, (e) => handler((e as CustomEvent<T>).detail));
}
````

## File: tests/state.test.ts
````typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/firebase.js', () => ({
  pushStateToFirebase: vi.fn(() => ({ ok: true })),
  getSyncedSnapshot: vi.fn(() => null),
  getCurrentRole: vi.fn(() => 'admin'),
  resyncFromServer: vi.fn(async () => {}),
}));

import {
  applySnapshot,
  state,
  defaultConfig,
  defaultMeta,
  SNAPSHOT_VERSION,
  buildSnapshot,
  setCurrentTournamentId,
  getCurrentTournamentId,
} from '../src/state.js';
import type { TournamentSnapshot } from '../src/types.js';

describe('state and snapshot versioning', () => {
  beforeEach(() => {
    state.currentTournamentId = 'default';
    state.meta = null;
    state.config = null;
    state.teams = null;
    state.squads = null;
    state.schedule = [];
    state.roundsMeta = [];
    state.scheduleTeamCount = 0;
    state.scheduleVoltas = 0;
    state.results = {};
    state.players = [];
    state.jogosSingulares = [];
    state.arquivo = [];
  });

  it('SNAPSHOT_VERSION is 12', () => {
    expect(SNAPSHOT_VERSION).toBe(12);
  });

  it('defaultConfig initializes sport as football', () => {
    const config = defaultConfig();
    expect(config.sport).toBe('football');
    expect(config.nome).toBe('Futebol ILOG');
  });

  it('defaultMeta initializes sport as football and active status', () => {
    const meta = defaultMeta();
    expect(meta.sport).toBe('football');
    expect(meta.name).toBe('Futebol ILOG');
    expect(meta.status).toBe('active');
    expect(typeof meta.createdAt).toBe('number');
  });

  it('manages currentTournamentId', () => {
    expect(getCurrentTournamentId()).toBe('default');
    setCurrentTournamentId('padel-2026');
    expect(getCurrentTournamentId()).toBe('padel-2026');
  });

  it('loads a real version 7 snapshot and assigns football as sport and creates meta', () => {
    const v7Snapshot: Record<string, unknown> = {
      version: 7,
      exportedAt: '2026-03-01T10:00:00.000Z',
      config: {
        nome: 'Torneio da Primavera',
        numEquipas: 4,
        numGrupos: 1,
        numVoltas: 1,
        pontosVitoria: 3,
        pontosEmpate: 1,
        pontosDerrota: 0,
        bonusGoleada: 1,
        golosGoleada: 3,
        mataMata: false,
        numPlayoffTeams: 4,
        // Notice: version 7 snapshots do NOT have a `sport` or `meta` field
      },
      teams: [
        { name: 'Águias', color: '#2F7A4F' },
        { name: 'Leões', color: '#C0392B' },
        { name: 'Tigres', color: '#2980B9' },
        { name: 'Panteras', color: '#8E44AD' },
      ],
      squads: [[], [], [], []],
      schedule: [
        { jornada: 1, home: 0, away: 1 },
        { jornada: 1, home: 2, away: 3 },
      ],
      roundsMeta: [{ jornada: 1, bye: null }],
      scheduleTeamCount: 4,
      scheduleVoltas: 1,
      results: {
        0: { score: '2-1', status: 'terminado', scorers: { home: ['p1', 'p1'], away: ['p2'] } },
      },
      players: [
        {
          id: 'p1',
          nome: 'Avançado',
          teamIdx: 0,
          atributos: { velocidade: 80, finalizacao: 85, passe: 70, drible: 75, defesa: 50, fisico: 60 },
        },
        {
          id: 'p2',
          nome: 'Defesa',
          teamIdx: 1,
          atributos: { velocidade: 75, finalizacao: 80, passe: 65, drible: 70, defesa: 55, fisico: 65 },
        },
      ],
      jogosSingulares: [],
      arquivo: [],
    };

    applySnapshot(v7Snapshot as unknown as TournamentSnapshot);

    expect(state.config).toBeDefined();
    expect(state.config?.sport).toBe('football');
    expect(state.config?.nome).toBe('Torneio da Primavera');
    expect(state.meta).toBeDefined();
    expect(state.meta?.sport).toBe('football');
    expect(state.meta?.name).toBe('Torneio da Primavera');
    expect(state.meta?.status).toBe('active');
    expect(state.teams?.length).toBe(32); // ensureTeamsStructure pads to MAX_TEAMS
    expect(state.teams?.[0].name).toBe('Águias');
    expect(state.schedule.length).toBe(2);
    expect(state.players.length).toBe(2);
  });

  it('loads a version 8 snapshot (sport in config, no meta) and derives meta', () => {
    const v8Snapshot = {
      version: 8,
      config: { nome: 'Padel Cup 2026', sport: 'padel', numEquipas: 4, numGrupos: 1, numVoltas: 1 },
      teams: [],
      schedule: [],
      results: {},
    };

    applySnapshot(v8Snapshot as unknown as TournamentSnapshot);

    expect(state.config?.sport).toBe('padel');
    expect(state.meta?.sport).toBe('padel');
    expect(state.meta?.name).toBe('Padel Cup 2026');
    expect(state.meta?.status).toBe('active');
  });

  it('loads a version 9 snapshot with explicit meta', () => {
    const v9Snapshot = {
      version: 9,
      meta: { name: 'Super Liga', sport: 'futsal', status: 'finished' as const, createdAt: 99999 },
      config: { nome: 'Super Liga', sport: 'futsal' },
      teams: [],
      schedule: [],
      results: {},
    };

    applySnapshot(v9Snapshot as unknown as TournamentSnapshot);

    expect(state.meta?.sport).toBe('futsal');
    expect(state.meta?.name).toBe('Super Liga');
    expect(state.meta?.status).toBe('finished');
    expect(state.meta?.createdAt).toBe(99999);
  });

  it('buildSnapshot produces a version 11 snapshot with meta and sport', () => {
    state.config = defaultConfig();
    state.meta = defaultMeta('padel', 'Open Padel');
    const snap = buildSnapshot();
    expect(snap.version).toBe(12);
    expect(snap.config.sport).toBe('football');
    expect(snap.meta.sport).toBe('padel');
    expect(snap.meta.name).toBe('Open Padel');
    expect(snap.meta.status).toBe('active');
  });
});

describe('refused saves', () => {
  it('re-reads the server when a save is refused before the first sync', async () => {
    const firebase = await import('../src/firebase.js');
    vi.mocked(firebase.pushStateToFirebase).mockReturnValueOnce({ ok: false, reason: 'sem-sync' });
    vi.mocked(firebase.resyncFromServer).mockClear();
    const { persistResults } = await import('../src/state.js');
    await persistResults();
    expect(firebase.resyncFromServer).toHaveBeenCalledTimes(1);
  });
});
````

## File: docs/multi-sport.md
````markdown
# 🏟️ Multi-Sport Architecture

> **Status:** original proposal, kept for reference. The plan is now tracked in issue [#23](https://github.com/dioogomartiins/sports-tournament/issues/23), and its phases 1 to 4 are implemented: the abstract `Sport` class (`src/sports/Sport.ts`), the registry (`src/sports/registry.ts`, `getSport(id)`) and the football implementation (`src/sports/football/Football.ts`); multiple tournaments with a sport fixed at creation (`meta.sport`), global players with per-sport ratings, and per-sport admins. Padel has its own `Sport` class, score panel, standings and ratings. See [What exists today](#what-exists-today).

Torneio ILOG started as a football-only app. This document describes the plan to make it **sport-agnostic**, supporting football, padel, basketball, handball, volleyball or any other sport — all in the same codebase.

## Motivation

The scheduling (Berger), groups, playoffs, sync and permissions infrastructure is already generic. What varies between sports is:

- The **score format** (goals, sets/games, points)
- The **standings columns** and tiebreak criteria
- The **individual stats** (goals/assists vs points/rebounds)
- The **team composition** (squad of N vs pair of 2)
- The players' **rating attributes**
- The UI **terminology and icons**

## Sport profiles

The core idea: each sport is **one file** in `src/sports/` that exports an object with all the logic and configuration that varies. The app engine delegates to that profile instead of having `if/else` scattered around.

```
src/sports/
├── index.js          # registry: getSport(id) → profile
├── futebol.js        # ⚽ current profile (extracted from the existing code)
├── padel.js          # 🎾
├── basquetebol.js    # 🏀
├── andebol.js        # 🤾
└── voleibol.js       # 🏐
```

### Profile interface

```js
export default {
  id: 'futebol',
  nome: 'Futebol',
  icon: '⚽',

  // ── Score ──
  parseScore(str) { },       // "3-1" → { home: 3, away: 1 }
  formatScore(parsed) { },   // → "3-1"
  validateScore(str) { },    // → boolean
  hasDraws: true,
  tiebreakType: 'penalties', // 'penalties' | 'overtime' | 'tiebreak' | null

  // ── Standings ──
  defaultPoints: { win: 3, draw: 1, loss: 0 },
  standingsColumns: ['J', 'V', 'E', 'D', 'GM', 'GS', 'DG', 'Pts'],
  sortCriteria: ['Pts', 'DG', 'GM', 'head-to-head'],
  computeRow(parsed, config) { },

  // ── Individual stats ──
  statFields: ['golos', 'assistencias', 'mvp'],
  statLabels: { golos: 'Golos', assistencias: 'Assistências', mvp: 'MVP' },
  statIcons:  { golos: '⚽', assistencias: '🅰️', mvp: '⭐' },
  tallyStats(results, players) { },

  // ── Team ──
  teamSize: { min: 1, max: 30 },
  hasJerseyNumber: true,
  playerAttrs: ['velocidade', 'finalizacao', 'passe', 'drible', 'defesa', 'fisico'],

  // ── UI ──
  scoreInputType: 'counter',  // 'counter' | 'sets-grid' | 'number-pair'
  animationEvents: {
    score:  { title: 'GOLO!', icon: '⚽' },
    cancel: { title: 'GOLO ANULADO', icon: '❌' },
  },
}
```

(The snippet is the original proposal and keeps its Portuguese identifiers. What was built is a class instead: see [What exists today](#what-exists-today).)

## Comparison between sports

### Score format

| Sport | Format | Example | Draw | Playoff tiebreak |
|---|---|---|---|---|
| ⚽ Football | Goals | `3-1` | ✅ | Penalties |
| 🎾 Padel | Sets/Games | `6-4 3-6 10-7` | ❌ | Tiebreak / Super tiebreak |
| 🏀 Basketball | Points | `87-82` | ❌ | Overtime |
| 🤾 Handball | Goals | `28-24` | ✅ | Extra time + 7m throws |
| 🏐 Volleyball | Sets/Points | `25-20 22-25 25-18` | ❌ | 5th set to 15 |

### Standings

| Sport | Columns | Points | Tiebreak criteria |
|---|---|---|---|
| ⚽ Football | P W D L GF GA GD Pts | 3-1-0 + blowout bonus | Pts → GD → GF → H2H |
| 🎾 Padel | P W L SW SL SD GW GL GD Pts | 3-2-1-0 (by margin) | Pts → SD → GD → H2H |
| 🏀 Basketball | P W L PF PA PD Pts | 2-0 | Pts → PD → PF → H2H |
| 🤾 Handball | P W D L GF GA GD Pts | 2-1-0 | Pts → GD → GF → H2H |
| 🏐 Volleyball | P W L SW SL SD PF PA PD Pts | 3-2-1-0 (by margin) | Pts → SD → PD → H2H |

(For padel, GW/GL/GD are games won, lost and difference.)

### Individual stats

| Sport | Metrics |
|---|---|
| ⚽ Football | Goals, Assists, MVP |
| 🎾 Padel | Matches, Wins, Win rate % |
| 🏀 Basketball | Points, Rebounds, Assists, Steals, Blocks |
| 🤾 Handball | Goals, Assists, Saves (GK) |
| 🏐 Volleyball | Aces, Blocks, Attacks, Errors |

### Team

| Sport | Size | Jersey | Rating attributes |
|---|---|---|---|
| ⚽ Football | N players | Yes | Pace, Shooting, Passing, Dribbling, Defending, Physical |
| 🎾 Padel | 2 (pair) | No | Smash, Volley, Bandeja, Serve, Positioning, Defence |
| 🏀 Basketball | 5 + subs | Yes | Shooting, Passing, Dribbling, Defence, Rebounding, Physical |
| 🤾 Handball | 7 + subs | Yes | Shooting, Passing, Defence, Pace, Physical, Positioning |
| 🏐 Volleyball | 6 + subs | Yes | Attack, Block, Serve, Reception, Defence, Setting |

## What changes and what stays

### ✅ Does not change (sport-agnostic engine)

- Berger algorithm (round-robin)
- Schedule generation and extra round
- Playoff seeding
- Match-by-match sync (`diffSnapshot`)
- Permissions (admin / user / pending)
- Sign-in and user management
- Tournament archive (structure)

### 🔄 Delegated to the profile

- `computeStandings()` — columns and sort criteria
- `resolveHeadToHead()` — mini-table with the sport's metrics
- `getPlayoffWinner()` — tiebreak type
- `tallyPlayerStats()` — individual metrics
- `addGoal/removeGoal` → generic `addScore/removeScore`
- Live animations and banners
- Results UI (counter input vs sets grid vs number pair)
- Columns and icons in the standings and stats
- Share image

### 🆕 New

- `src/sports/*.js` — sport profiles
- `getSport(config.tipoDesporto)` — registry
- Sport selector in the settings
- Sets input (grid) for padel and volleyball
- Flexible Firebase rules accepting several score formats

## Implementation plan

The phases below are the original ones. The current phases (TypeScript and `Sport` class; multiple tournaments, global players and per-sport admins; English UI and Lit components; padel; the rest) are in issue [#23](https://github.com/dioogomartiins/sports-tournament/issues/23).

### Phase 1 — Foundation (without breaking anything)

1. Create `src/sports/futebol.js` — extract the current logic into the profile.
2. Create `src/sports/index.js` — registry with `getSport(id)`.
3. Add `tipoDesporto: 'futebol'` to `defaultConfig` (default value = current behaviour unchanged).
4. Refactor `computeStandings` and `tallyPlayerStats` to delegate to the profile.
5. Tests — make sure **nothing changes** for football.

### Phase 2 — Second sport

1. Create the second sport's profile (e.g. `padel.js` or `basquetebol.js`).
2. Add a selector to the settings UI.
3. Adapt the score input.
4. Adapt the standings and stats columns.
5. Update `database.rules.json` to accept both formats.

### Phase 3 — Generalisation

1. Add more profiles as needed.
2. Americano/Mexicano format for padel (players switch partners every round).
3. Documentation and illustrations per sport.

## Impact per file

| File | Change | Effort |
|---|---|---|
| `src/sports/*.js` | 🆕 Sport profiles | 🟡 Medium |
| `src/algorithms.js` | 🔄 Delegate standings and stats to the profile | 🟡 Medium |
| `src/state.js` | 🔄 `config.tipoDesporto`, dynamic attributes | 🟢 Low |
| `src/ui.js` | 🔄 Labels, icons, conditional columns | 🔴 High |
| `src/main.js` | 🔄 Score input delegated to the profile | 🟡 Medium |
| `src/components/ScoreBase.ts` | 🔄 Event banners come from each sport's score component | 🟢 Low |
| `src/share.js` | 🔄 Columns and labels from the profile | 🟡 Medium |
| `src/sync.js` | 🔄 Conditional `normalizeResults` | 🟢 Low |
| `index.html` | 🔄 Sport selector, dynamic labels | 🟡 Medium |
| `database.rules.json` | 🔄 Flexible score validation | 🟡 Medium |
| `tests/*.test.js` | 🔄 Fixtures parameterised by sport | 🟡 Medium |

## What exists today

![One class per sport](assets/illustrations/27-uma-classe-por-desporto.jpg)

How the code on `main` differs from the proposal above:

- **A class, not an object.** `src/sports/Sport.ts` is an abstract class with `id`, `name`, `icon` and the methods that vary (`computeStandings`, `resolveHeadToHead`, `getPlayoffWinner`, `tallyPlayerStats`, `mergePlayerStats`, `addGoal`, `removeGoal`, …). `Football` in `src/sports/football/Football.ts` implements it; `src/algorithms.ts` re-exports its methods for older modules.
- **Registry.** `src/sports/registry.ts` exposes `getSport(id)`, `registerSport()` and `listSports()`. `football` (with `futebol` as an alias), `padel` and `tennis` are registered; unknown ids fall back to football.
- **The sport lives in the tournament.** It is `meta.sport` (and `config.sport`), chosen when the tournament is created and fixed afterwards; there is no `tipoDesporto`. Data saved before this defaults to `football`.
- **Ratings per sport.** Players are global (`/players`) with `ratings.<sport>`; each sport declares its own attributes (`Sport.ratingAttributes()`).
- **Padel.** `src/sports/RacketSport.ts` (shared by set-based sports) and `src/sports/padel/Padel.ts`, with `<padel-score>`, a configurable set format, game-based standings, pairs fixed or drawn by rating, and rules that accept set scores in padel tournaments. The rules are in [Rules](rules.md#padel).
- **Tennis.** `src/sports/tennis/Tennis.ts` reuses `RacketSport` with a full deciding set by default; singles or doubles. `<tennis-score>` and `<padel-score>` share `RacketScore`. See [Rules](rules.md#tennis).
- **Per-sport admins.** `users/<uid>/admin/<sport>`, enforced by `database.rules.json` (see [Architecture](architecture.md#permissions)).
- **Americano / Mexicano.** Padel tournaments can rotate partners (`config.padelFormat`); matches are played to points and players are ranked on their own (`src/core/americano.ts`, [Rules](rules.md#americano-and-mexicano)).
- **Not done yet:** basketball, handball and volleyball, planned in [#59](https://github.com/dioogomartiins/sports-tournament/issues/59), [#60](https://github.com/dioogomartiins/sports-tournament/issues/60) and [#61](https://github.com/dioogomartiins/sports-tournament/issues/61). What each sport does today is in [Sports](sports.md).
````

## File: src/sports/football/Football.ts
````typescript
import { Sport, type AllTimeColumn, type Leaderboard, type PlayerStatColumn, type ProfileStat, type ScorerCount, type StandingsColumn } from '../Sport.js';
import { en } from '../../i18n/en.js';
import {
  GAME_STATUS,
  type Config,
  type GameEvent,
  type GameStatus,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type Score,
  type SingleMatch,
  type StandingsRow,
  type Team,
} from '../../types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyPlayerTally(): PlayerStats {
  return { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
}

function scoreParts(score: unknown): { home: number; away: number } {
  const m = /^(\d+)-(\d+)$/.exec(String(score || '').trim());
  return m ? { home: Number(m[1]), away: Number(m[2]) } : { home: 0, away: 0 };
}

function resultObject(res: MatchResult | undefined): Score {
  if (res && typeof res === 'object') {
    const out: Score = JSON.parse(JSON.stringify(res));
    out.scorers = { home: [], away: [], ...(out.scorers || {}) };
    return out;
  }
  return { score: typeof res === 'string' ? res : '0-0', scorers: { home: [], away: [] } };
}

function statusOf(res: MatchResult | undefined): GameStatus | null {
  if (!res) return null;
  if (typeof res !== 'object') return GAME_STATUS.TERMINADO;
  return res.status || GAME_STATUS.AGENDADO;
}

// ---------------------------------------------------------------------------
// Football Sport Implementation
// ---------------------------------------------------------------------------

export class Football extends Sport {
  readonly id = 'football';
  readonly name = 'Football';
  readonly icon = '⚽';

  standingsColumns(): StandingsColumn[] {
    const c = en.standings.cols;
    return [
      { label: c.pts, value: (s) => s.Pts, className: 'pts-cell' },
      { label: c.p, value: (s) => s.J },
      { label: c.w, value: (s) => s.V },
      { label: c.d, value: (s) => s.E },
      { label: c.l, value: (s) => s.D },
      { label: c.gf, value: (s) => s.GM },
      { label: c.ga, value: (s) => s.GS },
      { label: c.gd, value: (s) => { const dg = s.DG ?? s.GM - s.GS; return (dg > 0 ? '+' : '') + dg; } },
    ];
  }

  ratingAttributes(): Record<string, string> {
    return en.players.attributes;
  }

  playerStatColumns(): PlayerStatColumn[] {
    return [
      { key: 'golos', title: en.statsTab.topScorers, unit: en.common.goals, empty: en.statsTab.noGoalsYet },
      { key: 'assistencias', title: en.statsTab.assistsTitle, unit: 'assist.', empty: en.statsTab.nothingRecordedYet },
      { key: 'mvp', title: en.statsTab.mvpTitle, unit: '×', empty: en.statsTab.nothingRecordedYet },
    ];
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    const nGrupos = config.numGrupos || 1;
    const groupStats: GroupStandings[] = [];

    for (let g = 0; g < nGrupos; g++) {
      groupStats.push({
        name: nGrupos > 1 ? `Group ${String.fromCharCode(65 + g)}` : 'General Standings',
        standings: [],
      });
    }

    const stats: StandingsRow[] = teamsArray.map((t, idx) => {
      const name = typeof t === 'string' ? t : (t && t.name ? t.name : `Team ${idx + 1}`);
      return { idx, name, J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, Pts: 0 };
    });

    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;

      const resObj = results[gi];
      if (!resObj) return;

      if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;

      const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
      const m = /^(\d+)-(\d+)$/.exec(String(resStr || '').trim());
      if (!m) return;

      const gc = parseInt(m[1], 10);
      const gf = parseInt(m[2], 10);
      const home = typeof game.home === 'number' ? stats[game.home] : undefined;
      const away = typeof game.away === 'number' ? stats[game.away] : undefined;
      if (!home || !away) return;

      home.J++;
      away.J++;
      home.GM += gc;
      home.GS += gf;
      away.GM += gf;
      away.GS += gc;

      if (gc > gf) {
        home.V++;
        away.D++;
        home.Pts += config.pontosVitoria + (gc >= config.golosGoleada ? config.bonusGoleada : 0);
        away.Pts += config.pontosDerrota;
      } else if (gc < gf) {
        away.V++;
        home.D++;
        away.Pts += config.pontosVitoria + (gf >= config.golosGoleada ? config.bonusGoleada : 0);
        home.Pts += config.pontosDerrota;
      } else {
        home.E++;
        away.E++;
        home.Pts += config.pontosEmpate;
        away.Pts += config.pontosEmpate;
      }
    });

    stats.forEach((s) => {
      s.DG = s.GM - s.GS;
    });

    stats.forEach((s) => {
      const t = teamsArray[s.idx];
      let g = typeof t === 'object' && t !== null && t.group !== undefined ? t.group : 0;
      if (g >= nGrupos) g = nGrupos - 1;
      groupStats[g].standings.push(s);
    });

    groupStats.forEach((group) => {
      const sorted = group.standings.sort(
        (a, b) =>
          b.Pts - a.Pts ||
          (b.DG ?? 0) - (a.DG ?? 0) ||
          b.GM - a.GM
      );

      let finalArr: StandingsRow[] = [];
      let i = 0;
      while (i < sorted.length) {
        let j = i + 1;
        while (
          j < sorted.length &&
          sorted[j].Pts === sorted[i].Pts &&
          sorted[j].DG === sorted[i].DG &&
          sorted[j].GM === sorted[i].GM
        ) {
          j++;
        }

        let cluster = sorted.slice(i, j);
        if (cluster.length > 1) {
          cluster = this.resolveHeadToHead(cluster, schedule, results, config);
        }
        finalArr = finalArr.concat(cluster);
        i = j;
      }

      group.standings = finalArr;
    });

    return groupStats;
  }

  resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[] {
    const ids: Record<number, boolean> = {};
    cluster.forEach((c) => {
      ids[c.idx] = true;
    });

    const mini: Record<number, { pts: number; gm: number; gs: number }> = {};
    cluster.forEach((c) => {
      mini[c.idx] = { pts: 0, gm: 0, gs: 0 };
    });

    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;

      const resObj = results[gi];
      if (!resObj) return;
      if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      if (!ids[game.home] || !ids[game.away]) return;

      const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
      const m = /^(\d+)-(\d+)$/.exec(String(resStr || '').trim());
      if (!m) return;

      const gc = parseInt(m[1], 10);
      const gf = parseInt(m[2], 10);
      mini[game.home].gm += gc;
      mini[game.home].gs += gf;
      mini[game.away].gm += gf;
      mini[game.away].gs += gc;

      if (gc > gf) {
        mini[game.home].pts += config.pontosVitoria + (gc >= config.golosGoleada ? config.bonusGoleada : 0);
      } else if (gc < gf) {
        mini[game.away].pts += config.pontosVitoria + (gf >= config.golosGoleada ? config.bonusGoleada : 0);
      } else {
        mini[game.home].pts += config.pontosEmpate;
        mini[game.away].pts += config.pontosEmpate;
      }
    });

    return cluster.slice().sort((a, b) => {
      const ma = mini[a.idx];
      const mb = mini[b.idx];
      if (mb.pts !== ma.pts) return mb.pts - ma.pts;
      const dgA = ma.gm - ma.gs;
      const dgB = mb.gm - mb.gs;
      if (dgB !== dgA) return dgB - dgA;
      if (mb.gm !== ma.gm) return mb.gm - ma.gm;
      if (a.GS !== b.GS) return a.GS - b.GS;
      return a.name.localeCompare(b.name);
    });
  }

  /** A level match decided on penalties is won by the side that won them. */
  winnerSide(res: MatchResult | undefined, config?: Config | null): 'home' | 'away' | null {
    const winner = super.winnerSide(res, config);
    if (winner || !this.isFinished(res) || typeof res !== 'object') return winner;
    const pen = this.scoreTotals(res.penalties);
    if (!pen || pen.home === pen.away) return null;
    return pen.home > pen.away ? 'home' : 'away';
  }

  allTimeColumns(): AllTimeColumn[] {
    return [
      { key: 'golos', label: '⚽', title: en.historyTab.goalsTitle },
      { key: 'assistencias', label: '🅰️', title: en.historyTab.assistsTitle },
      { key: 'mvp', label: '⭐', title: en.historyTab.mvpTitle },
    ];
  }

  /** Football's dashboard leaderboard is the top scorers. */
  leaderboard(_standings: StandingsRow[], scorers: ScorerCount[]): Leaderboard {
    return {
      title: en.dashboard.topScorers,
      rows: scorers.map((s) => ({ name: s.name, detail: s.team, value: en.statsTab.goalsLabel(s.count) })),
      empty: en.statsTab.noGoalsYet,
    };
  }

  profileStats(totals: PlayerStats): ProfileStat[] {
    return [
      { label: en.players.totalGoals, value: totals.golos },
      { label: en.players.assists, value: totals.assistencias },
      { label: en.players.mvp, value: totals.mvp },
      { label: en.players.scoringMatches, value: totals.jogosAMarcar },
      { label: en.players.singleMatchRecord, value: totals.recorde, unit: en.players.recordGoalsUnit, wide: true },
    ];
  }

  getPlayoffWinner(game: Match, res: MatchResult | undefined): number | string | null {
    if (!game || !game.isPlayoff || !res || typeof res !== 'object') return null;
    if (res.status !== GAME_STATUS.TERMINADO) return null;

    const m = /^(\d+)-(\d+)$/.exec(String(res.score || '').trim());
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const a = parseInt(m[2], 10);
    if (h > a) return game.home;
    if (a > h) return game.away;

    const p = /^(\d+)-(\d+)$/.exec(String(res.penalties || '').trim());
    if (!p) return null;
    const ph = parseInt(p[1], 10);
    const pa = parseInt(p[2], 10);
    if (ph > pa) return game.home;
    if (pa > ph) return game.away;
    return null;
  }

  tallyPlayerStats(
    results: Record<string | number, MatchResult>,
    jogosSingulares: SingleMatch[] = []
  ): Record<string, PlayerStats> {
    const out: Record<string, PlayerStats> = Object.create(null);
    const get = (pid: string) => {
      if (!out[pid]) out[pid] = emptyPlayerTally();
      return out[pid];
    };

    function addGame(scorers: string[], assists: string[], mvp?: string) {
      const golosNoJogo: Record<string, number> = Object.create(null);
      scorers.forEach((pid) => {
        if (!pid || pid === 'auto') return;
        get(pid).golos++;
        golosNoJogo[pid] = (golosNoJogo[pid] || 0) + 1;
      });
      Object.keys(golosNoJogo).forEach((pid) => {
        const t = get(pid);
        t.jogosAMarcar++;
        t.recorde = Math.max(t.recorde, golosNoJogo[pid]);
      });
      assists.forEach((pid) => {
        if (pid && pid !== 'auto') get(pid).assistencias++;
      });
      if (mvp) get(mvp).mvp++;
    }

    Object.keys(results || {}).forEach((gi) => {
      const res = results[gi];
      if (!res || typeof res !== 'object') return;
      const sc = res.scorers || { home: [], away: [] };
      const as = res.assists || { home: [], away: [] };
      addGame(
        [...(sc.home || []), ...(sc.away || [])],
        [...(as.home || []), ...(as.away || [])],
        res.mvp
      );
    });

    (jogosSingulares || []).forEach((jogo) => {
      addGame(
        [...(jogo.scorersA || []), ...(jogo.scorersB || [])],
        [...(jogo.assistsA || []), ...(jogo.assistsB || [])],
        jogo.mvp
      );
    });

    return out;
  }

  alignAssists(scorers: string[], assists?: string[]): string[] {
    const out = (assists || []).slice(0, (scorers || []).length);
    while (out.length < (scorers || []).length) out.push('');
    return out;
  }

  addGoal(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    pid: string,
    aid?: string
  ): Score {
    const out = resultObject(res);
    if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
    const s = scoreParts(out.score);
    s[side]++;
    out.score = `${s.home}-${s.away}`;
    const assists = { ...(out.assists || {}) };
    out.assists = assists;
    const scorers = out.scorers || { home: [], away: [] };
    out.scorers = scorers;
    const sideScorers = scorers[side] || [];
    scorers[side] = sideScorers;
    assists[side] = this.alignAssists(sideScorers, assists[side]);
    sideScorers.push(pid);
    assists[side]!.push(aid || '');
    return out;
  }

  addPoint(res: MatchResult | undefined, side: 'home' | 'away', _config?: Config, pid = '', aid = ''): Score {
    return this.addGoal(res, side, pid, aid);
  }

  removePoint(res: MatchResult | undefined, side: 'home' | 'away'): Score {
    return this.removeGoal(res, side);
  }

  removeGoal(res: MatchResult | undefined, side: 'home' | 'away'): Score {
    if (res === null || res === undefined) return res as unknown as Score;
    const s = scoreParts(typeof res === 'object' ? res.score : res);
    if (s[side] <= 0) return res as Score;
    const out = resultObject(res);
    if (!out.status) out.status = GAME_STATUS.TERMINADO;
    s[side]--;
    out.score = `${s.home}-${s.away}`;
    const sideScorers = out.scorers?.[side];
    if (sideScorers && sideScorers.length > 0) {
      const assists = { ...(out.assists || {}) };
      out.assists = assists;
      assists[side] = this.alignAssists(sideScorers, assists[side]);
      sideScorers.pop();
      assists[side]?.pop();
    }
    return out;
  }

  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out = resultObject(res);
    out.status = status;
    return out;
  }

  gameGoals(
    res: MatchResult | undefined
  ): { home: Array<{ pid: string; aid: string }>; away: Array<{ pid: string; aid: string }> } {
    const out: { home: Array<{ pid: string; aid: string }>; away: Array<{ pid: string; aid: string }> } = {
      home: [],
      away: [],
    };
    if (!res || typeof res !== 'object') return out;
    (['home', 'away'] as const).forEach((side) => {
      const sc = (res.scorers && res.scorers[side]) || [];
      const as = this.alignAssists(sc, res.assists && res.assists[side]);
      out[side] = sc.map((pid, i) => ({ pid, aid: as[i] || '' }));
    });
    return out;
  }

  resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined
  ): GameEvent[] {
    const events: GameEvent[] = [];
    const a = prev || {};
    const b = next || {};
    Object.keys(b).forEach((gi) => {
      const ra = a[gi];
      const rb = b[gi];
      if (!rb) return;
      const sa = statusOf(ra);
      const sb = statusOf(rb);
      if (sb === GAME_STATUS.TERMINADO && sa !== GAME_STATUS.TERMINADO) {
        events.push({ type: 'fim', gi });
        return;
      }
      const pa = scoreParts(ra && (typeof ra === 'object' ? ra.score : ra));
      const pb = scoreParts(typeof rb === 'object' ? rb.score : rb);
      let golos = false;
      (['home', 'away'] as const).forEach((side) => {
        if (pb[side] === pa[side]) return;
        golos = true;
        const scA = (ra && typeof ra === 'object' && ra.scorers && ra.scorers[side]) || [];
        const scB = (typeof rb === 'object' && rb.scorers && rb.scorers[side]) || [];
        if (pb[side] > pa[side]) {
          const i = scB.length - 1;
          const as = (rb && typeof rb === 'object' && rb.assists && rb.assists[side]) || [];
          events.push({
            type: 'golo',
            gi,
            side,
            pid: scB.length > scA.length ? scB[i] : '',
            aid: scB.length > scA.length ? (as[i] || '') : '',
          });
        } else {
          events.push({
            type: 'anulado',
            gi,
            side,
            pid: scA.length > scB.length ? scA[scA.length - 1] : '',
          });
        }
      });
      if (!golos && sb === GAME_STATUS.DECORRER && sa !== GAME_STATUS.DECORRER) {
        events.push({ type: 'inicio', gi });
      }
    });
    return events;
  }
}

export const football = new Football();

// Convenient standalone function exports delegating to the football singleton
export const computeStandings = football.computeStandings.bind(football);
export const resolveHeadToHead = football.resolveHeadToHead.bind(football);
export const getPlayoffWinner = football.getPlayoffWinner.bind(football);
export const tallyPlayerStats = football.tallyPlayerStats.bind(football);
export const mergePlayerStats = football.mergePlayerStats.bind(football);
export const alignAssists = football.alignAssists.bind(football);
export const addGoal = football.addGoal.bind(football);
export const removeGoal = football.removeGoal.bind(football);
export const setGameStatus = football.setGameStatus.bind(football);
export const gameGoals = football.gameGoals.bind(football);
export const resultEvents = football.resultEvents.bind(football);
export const standingsOrder = football.standingsOrder.bind(football);
export const rankMoves = football.rankMoves.bind(football);
````

## File: src/main.ts
````typescript
import { state, loadedConfig, loadedTeams, loadedSquads, persistConfigTeams, loadState, persistSchedule, persistResults, storeAllLayers, notifyPushError, currentTheme, setCurrentTheme, exportJSON, importJSON, applyGeneratedSchedule, applyRotationSchedule, applySnapshot, buildSnapshot, defaultTeams, defaultSquads, setStateHooks, setCurrentTournamentId, getCurrentTournamentId } from './state.js';
import { closeGameModal, openGameModal, animateResultChanges, dom, cacheDom, renderAll, refreshComputed, renderScheduleHint, renderSquadList, renderSquadsDropdown, flashError, flashBackup, renderCalendar, renderResults, showToast, flashSaved, openConfirm, closeConfirm, runConfirm, openDangerConfirm, switchTab, openScorerModal, openPlayerProfile, computeStatsSummary, renderPlayersList, openPlayerModal, renderSquadPlayerFromDBDropdown, renderAuth, renderUsers, renderLog, openPickPlayerModal, squadPickList, renderTournamentsList, openNovoTorneioModal, openDrawPairsModal, openRotationPlayersModal, bindHistoryEvents, bindTournamentsToggle, bindPlayersEvents, bindSingleMatchEvents, fieldValue, setFieldValue, isChecked, onEvent } from './ui.js';
import { html } from 'lit';
import { clamp, numOr, buildPlayerIndex } from './utils.js';
import { shareStandings, shareResult } from './share.js';
import { bergerRounds, balancedPairs, buildExtraVolta, buildArchiveEntry, GAME_STATUS } from './algorithms.js';
import { buildPlayoffBracket, firstRoundIndex, playoffSeeds, advanceWinner } from './core/playoffs.js';
import { americanoRounds, mexicanoRound, rotationSchedule, lastRoundFinished, isRotationFormat, validPlayerCount, type RotationFormat, type RotationMatch } from './core/americano.js';
import { getPlayerRating } from './core/draft.js';
import { Padel, DEFAULT_MATCH_POINTS } from './sports/padel/Padel.js';
import type { Sport } from './sports/Sport.js';
import type { GameStatus, MatchResult, Player, Score } from './types.js';
import type { AuthInfo, TournamentListing } from './firebase.js';
import type { ScoreEvent, ScoreSide as Side } from './components/ScoreBase.js';
import type { ScoreStep, ScoreCommit } from './components/ResultsList.js';
import type { TeamChange } from './components/TeamsEditor.js';
import type { RoleChange } from './components/UserList.js';
import { getSport, listSports } from './sports/registry.js';
import { initFirebaseListener, onFirebaseStateChange, onFirebasePushError, setSyncedSnapshot, initAuth, signInWithGoogle, signOutUser, getCurrentUser, getCurrentRole, getCurrentUserAdmin, listenUsers, listenLog, setUserRole, listenTournaments, createTournament, finishTournament, setActiveTournamentId, isEmulator, setDevRole, getCurrentDevRole, type DevRole } from './firebase.js';
import { roleLabel } from './permissions.js';
import { en } from './i18n/en.js';

// ---------------------------------------------------------------------------
// Settings handlers
// ---------------------------------------------------------------------------
export function onConfigFieldChange(): void {
  const config = loadedConfig();
  config.nome = fieldValue('cfgNome').trim() || en.common.tournament;
  // The name in Active Tournaments and the header comes from meta
  if (state.meta) state.meta.name = config.nome;
  config.pontosVitoria = numOr(fieldValue('cfgVitoria'), 3);
  config.pontosEmpate = numOr(fieldValue('cfgEmpate'), 1);
  config.pontosDerrota = numOr(fieldValue('cfgDerrota'), 0);
  config.bonusGoleada = numOr(fieldValue('cfgBonus'), 1);
  config.golosGoleada = numOr(fieldValue('cfgGoleada'), 3);
  config.setFormat = {
    sets: [1, 3, 5].includes(+fieldValue('cfgSets')) ? +fieldValue('cfgSets') : 3,
    gamesPerSet: clamp(parseInt(fieldValue('cfgGamesPerSet'), 10) || 6, 1, 9),
    superTieBreak: isChecked('cfgSuperTieBreak'),
  };
  config.mataMata = isChecked('cfgMataMata');
  config.numPlayoffTeams = parseInt(fieldValue('cfgNumPlayoffTeams'), 10) || 4;
  config.numGrupos = parseInt(fieldValue('cfgNumGrupos'), 10) || 1;
  const padelFormat = fieldValue('cfgPadelFormat');
  config.padelFormat = isRotationFormat(padelFormat) ? padelFormat : 'pairs';
  config.matchPoints = clamp(parseInt(fieldValue('cfgMatchPoints'), 10) || DEFAULT_MATCH_POINTS, 4, 99);
  config.winPoints = clamp(Math.round(numOr(fieldValue('cfgWinPoints'), 1)), 0, 10);
  persistConfigTeams();
  refreshComputed();
}

export function onFormatFieldChange(): void {
  const config = loadedConfig();
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || config.numEquipas, 2, 32);
  const v = clamp(parseInt(fieldValue('cfgNumVoltas'), 10) || config.numVoltas, 1, 20);
  setFieldValue('cfgNumEquipas', n);
  setFieldValue('cfgNumVoltas', v);
  config.numEquipas = n;
  config.numVoltas = v;
  persistConfigTeams();
  renderScheduleHint();
}

// ---------------------------------------------------------------------------
// Team and squad handlers
// ---------------------------------------------------------------------------
/** A team's name or colour changed in <teams-editor> (detail: { idx, prop, value }). */
function onTeamChange({ idx, prop, value }: TeamChange): void {
  loadedTeams()[idx][prop] = value;
  persistConfigTeams();
  renderSquadsDropdown();
  renderCalendar();
  renderResults();
  refreshComputed();
}

export function onAddPlayerFromDB(): void {
  const tIdx = Number(fieldValue('squadTeamSelect'));
  const num = parseInt(fieldValue('squadPlayerNum'), 10);
  const pid = fieldValue('squadPlayerFromDB');
  const numbered = currentSport().usesJerseyNumbers;

  if (!fieldValue('squadTeamSelect')) { showToast(en.toasts.selectTeam, 'error'); return; }
  if (numbered && (isNaN(num) || num < 1)) { showToast(en.toasts.enterJerseyNumber, 'error'); return; }
  if (!numbered && loadedSquads()[tIdx].length >= 2) { showToast(en.toasts.pairFull, 'error'); return; }
  if (!pid) { showToast(en.toasts.choosePlayerFromList, 'error'); return; }

  const player = state.players.find((p) => p.id === pid);
  if (!player) { showToast(en.toasts.playerNotFound, 'error'); return; }

  // Check if already in squad
  if (loadedSquads()[tIdx].some((p) => p.id === pid)) {
    showToast(en.toasts.playerAlreadyInSquad, 'error');
    return;
  }

  // Without jersey numbers the number only keeps the squad order
  loadedSquads()[tIdx].push({ id: player.id, num: numbered ? num : loadedSquads()[tIdx].length + 1, name: player.nome });
  persistConfigTeams();
  setFieldValue('squadPlayerNum', '');
  setFieldValue('squadPlayerFromDB', '');
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
  showToast(en.toasts.playerAddedToSquad, 'ok');
}

/** Draws balanced pairs from the chosen players into the tournament's teams, in order. */
function onDrawPairs(): void {
  if (rotationFormat()) { showToast(en.toasts.rotationNoPairs, 'error'); return; }
  const sportId = currentSport().id;
  openDrawPairsModal((ids) => {
    const chosen = ids.map((id) => state.players.find((p) => p.id === id)).filter((p): p is Player => !!p);
    const { pairs } = balancedPairs(chosen, sportId);
    if (pairs.length !== state.scheduleTeamCount) return;
    const firstName = (p: Player) => (p.nome || '').split(' ')[0];
    pairs.forEach((pair, i) => {
      loadedSquads()[i] = pair.map((p, n) => ({ id: p.id, num: n + 1, name: p.nome }));
      loadedTeams()[i].name = pair.map(firstName).join(' / ');
    });
    persistConfigTeams();
    renderAll();
    showToast(en.toasts.pairsDrawn, 'ok');
  });
}

function onSquadRemove(pid: string): void {
  const tIdx = Number(fieldValue('squadTeamSelect'));
  loadedSquads()[tIdx] = loadedSquads()[tIdx].filter((p) => p.id !== pid);
  persistConfigTeams();
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
}

// ---------------------------------------------------------------------------
// Result handlers
// ---------------------------------------------------------------------------
/** Moves the winner of a finished knockout match into the next match of the bracket. */
function propagatePlayoffWinner(gi: number): void {
  const game = state.schedule[gi];
  if (!game) return;
  const winnerIdx = currentSport().getPlayoffWinner(game, state.results[gi], loadedConfig());
  if (winnerIdx !== null && advanceWinner(state.schedule, game, winnerIdx)) persistSchedule();
}

/** Saves a match result and plays the change on every screen. */
function commitResult(gi: number, next: MatchResult | undefined): void {
  if (next === state.results[gi]) return;
  if (next === undefined) delete state.results[gi];
  else state.results[gi] = next;
  propagatePlayoffWinner(gi);

  // Animate after saving: if the save is refused the state has already been rolled back
  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

/** The sport of the tournament on screen. */
function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

/** Americano or Mexicano when the tournament on screen rotates padel partners, else null. */
function rotationFormat(): RotationFormat | null {
  const sport = currentSport();
  return sport instanceof Padel ? sport.rotation(state.config) : null;
}

/** Player slots ordered by their padel rating, best first (Mexicano's first round). */
function ratingRanking(n: number): number[] {
  const rating = (i: number) => {
    const id = state.squads?.[i]?.[0]?.id;
    return getPlayerRating(state.players.find((p) => p.id === id), 'padel');
  };
  return Array.from({ length: n }, (_, i) => i).sort((a, b) => rating(b) - rating(a) || a - b);
}

/** Americano / Mexicano: one player from the database in each of the first n team slots. */
function onPickRotationPlayers(): void {
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || loadedConfig().numEquipas, 2, 32);
  if (!validPlayerCount(n)) { showToast(en.toasts.rotationPlayerCount, 'error'); return; }
  openRotationPlayersModal(n, (ids) => {
    const teams = loadedTeams();
    const squads = loadedSquads();
    ids.forEach((id, i) => {
      const p = state.players.find((x) => x.id === id);
      if (!p) return;
      teams[i].name = p.nome;
      squads[i] = [{ id: p.id, num: 1, name: p.nome }];
    });
    persistConfigTeams();
    renderAll();
    showToast(en.toasts.rotationPlayersSet(ids.length), 'ok');
  });
}

function changeGameStatus(gi: number, status: GameStatus): void {
  commitResult(gi, currentSport().setGameStatus(state.results[gi], status));
}

/** Moves a match to the next status: scheduled → in progress → finished → scheduled. */
function onStatusClick(gi: number): void {
  const res = state.results[gi];
  const current = (res && typeof res === 'object' && res.status) || 'agendado';
  const cycle: Record<string, GameStatus> = { agendado: 'decorrer', decorrer: 'terminado', terminado: 'agendado' };
  changeGameStatus(gi, cycle[current] ?? 'agendado');
}

/** Adds a point: in football asks for the scorer (and assist) first; in padel adds a game. */
function onGoalAdd(gi: number, side: Side): void {
  const sport = currentSport();
  if (sport.id !== 'football') {
    commitResult(gi, sport.addPoint(state.results[gi], side, loadedConfig()));
    return;
  }
  // The result is always worked out from the state at save time: a goal from
  // another phone can arrive between the click and picking the scorer.
  openScorerModal(gi, side, (pid) => {
    const game = state.schedule[gi];
    if (!game) return;
    const teamIdx = side === 'home' ? game.home : game.away;
    const registerGoal = (aid: string) => commitResult(gi, sport.addPoint(state.results[gi], side, loadedConfig(), pid, aid));

    // An own goal has no assist
    if (pid === 'auto') registerGoal('');
    else openPickPlayerModal(en.singleMatch.pickAssistTitle, squadPickList(teamIdx, pid), en.singleMatch.noAssistLabel, registerGoal);
  });
}

function onGoalCancel(gi: number, side: Side): void {
  commitResult(gi, currentSport().removePoint(state.results[gi], side, loadedConfig()));
}

/** A − / + button of the results list (detail: { gi, side, action }). */
function onScoreStep({ gi, side, action }: ScoreStep): void {
  if (action === 'add') onGoalAdd(Number(gi), side);
  else if (action === 'sub') onGoalCancel(Number(gi), side);
}

export function onMvpClick(gi: number): void {
  const game = state.schedule[gi];
  if (!game) return;
  const players = [...squadPickList(game.home), ...squadPickList(game.away)];
  openPickPlayerModal(en.singleMatch.pickMvpTitle, players, en.singleMatch.noMvpLabel, (pid) => {
    const res = state.results[gi];
    if (!res || typeof res !== 'object') return;
    if (pid) res.mvp = pid;
    else delete res.mvp;
    persistResults();
    renderResults();
    refreshComputed();
  });
}

/**
 * A score typed in the results list (detail: { gi, score, penalties }).
 * The list has already checked the boxes; a null score clears the result.
 */
function onScoreCommit({ gi: key, score, penalties }: ScoreCommit): void {
  const gi = Number(key);
  if (score === null) {
    if (!(gi in state.results)) return;
    delete state.results[gi];
  } else {
    const prev = state.results[gi];
    const res: Score = prev && typeof prev === 'object' ? prev : { score, scorers: { home: [], away: [] }, status: 'terminado' };
    res.score = score;
    if (res.status === 'agendado') res.status = 'terminado';
    if (penalties) res.penalties = penalties;
    else delete res.penalties;
    state.results[gi] = res;

    propagatePlayoffWinner(gi);
  }

  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

// ---------------------------------------------------------------------------
// Schedule and tournament handlers
// ---------------------------------------------------------------------------
export function onGerarCalendario(): void {
  const config = loadedConfig();
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || loadedConfig().numEquipas, 2, 32);
  const v = clamp(parseInt(fieldValue('cfgNumVoltas'), 10) || loadedConfig().numVoltas, 1, 20);
  const hasResults = Object.keys(state.results).length > 0;
  const estimate = bergerRounds(n).reduce((s, r) => s + r.pairs.length, 0) * v;
  const rotation = rotationFormat();
  if (rotation && !validPlayerCount(n)) { showToast(en.toasts.rotationPlayerCount, 'error'); return; }

  function doIt() {
    config.numEquipas = n;
    config.numVoltas = v;
    if (rotation) applyRotationSchedule(rotation, n, v, ratingRanking(n));
    else applyGeneratedSchedule(n, v, true);
    state.results = {};
    persistConfigTeams();
    persistSchedule();
    persistResults();
    renderAll();
    showToast(en.toasts.scheduleGenerated(state.schedule.length), 'ok');
  }

  const msgParts: string[] = [];
  if (hasResults) msgParts.push(en.confirmations.replaceScheduleWarn);
  if (estimate > 1500) msgParts.push(en.confirmations.largeScheduleWarn(estimate));
  msgParts.push(en.confirmations.teamsSquadsPreserved);

  if (hasResults || estimate > 1500) {
    openConfirm(en.confirmations.generateNewSchedule, msgParts.join(' '), doIt);
  } else {
    doIt();
  }
}

export function onNovoTorneio(): void {
  const ticked = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.checked ?? false;
  const delResults = ticked('chkDeleteResults');
  const delSchedule = ticked('chkDeleteSchedule');
  const delTeams = ticked('chkDeleteTeams');

  if (!delResults && !delSchedule && !delTeams) {
    showToast(en.toasts.selectCategoryToDelete, 'error');
    return;
  }

  // Build summary labels
  const labels: string[] = [];
  if (delResults) labels.push(en.dataTab.checkResults);
  if (delSchedule) labels.push(en.dataTab.checkSchedule);
  if (delTeams) labels.push(en.dataTab.checkTeams);

  openDangerConfirm(en.confirmations.deleteData, labels, async () => {
    if (delResults) {
      state.results = {};
      await persistResults();
    }
    if (delSchedule) {
      state.schedule = [];
      state.roundsMeta = [];
      state.scheduleTeamCount = 0;
      state.scheduleVoltas = 0;
      await persistSchedule();
    }
    if (delTeams) {
      state.teams = defaultTeams();
      state.squads = defaultSquads();
      await persistConfigTeams();
    }
    renderAll();
    showToast(en.toasts.dataDeletedSuccess, 'ok');
  });
}

// ---------------------------------------------------------------------------
// Active tournaments
// ---------------------------------------------------------------------------
const LAST_VIEWED_TOURNAMENT_KEY = 'torneio_last_viewed_tournament';

export function getLastViewedTournamentId(): string {
  try {
    return localStorage.getItem(LAST_VIEWED_TOURNAMENT_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function setLastViewedTournamentId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(LAST_VIEWED_TOURNAMENT_KEY, id);
    } else {
      localStorage.removeItem(LAST_VIEWED_TOURNAMENT_KEY);
    }
  } catch {
    // ignore in restricted environments
  }
}

let allTournaments: TournamentListing[] = [];

export function getAllTournaments(): TournamentListing[] {
  return allTournaments;
}

export function setAllTournaments(tourneys: TournamentListing[]): void {
  allTournaments = tourneys;
}

export function renderTournaments(): void {
  renderTournamentsList(allTournaments, getCurrentTournamentId());
}

export function onSelectTournament(id: string): void {
  if (!id || id === getCurrentTournamentId()) return;
  setLastViewedTournamentId(id);
  setCurrentTournamentId(id);
  setActiveTournamentId(id);
  const found = allTournaments.find((t) => t.id === id);
  if (found) {
    state.meta = { ...found };
  }
  renderTournaments();
  renderAuth(getCurrentUser(), getCurrentRole(), getCurrentUserAdmin());
  renderAll();
}

export function onNovoTorneioModalClick(): void {
  const role = getCurrentRole();
  const userAdmin = getCurrentUserAdmin();
  const allSports = listSports().map((s) => ({ id: s.id, label: `${s.icon} ${s.name}` }));
  const allowedSports = role === 'master'
    ? allSports
    : allSports.filter((s) => userAdmin && userAdmin[s.id] === true);

  if (!allowedSports.length) {
    showToast(en.toasts.noPermissionCreateTournament, 'error');
    return;
  }

  openNovoTorneioModal(async ({ name, sport, numEquipas }) => {
    const res = await createTournament({ name, sport, numEquipas });
    if (res && res.ok && res.tournamentId) {
      showToast(en.toasts.tournamentCreatedSuccess, 'ok');
      onSelectTournament(res.tournamentId);
    } else {
      showToast(en.toasts.couldNotCreateTournament, 'error');
    }
  }, allowedSports);
}

export function onTerminarTorneio(tid: string = getCurrentTournamentId()): void {
  const tourneyName = state.meta?.name || state.config?.nome || en.tournaments.defaultNewName;
  const porJogar = state.schedule.filter((g, gi) => {
    const r = state.results[gi];
    return !(r && typeof r === 'object' ? r.status === GAME_STATUS.TERMINADO : typeof r === 'string');
  }).length;
  const aviso = porJogar ? en.tournaments.finishPendingMatches(porJogar) : '';

  openConfirm(
    en.tournaments.finishTitle,
    html`${en.tournaments.finishPrompt(tourneyName)}${aviso}`,
    async () => {
      const index = buildPlayerIndex();
      const names: Record<string, string> = {};
      Object.keys(index).forEach((pid) => { names[pid] = index[pid].name; });

      const entry = buildArchiveEntry({ ...state, meta: state.meta ?? undefined, config: loadedConfig(), teams: loadedTeams() }, names, crypto.randomUUID(), new Date().toISOString());

      const res = await finishTournament(tid, entry);
      if (!res.ok) {
        showToast(en.toasts.errorFinishingTournament(('reason' in res && res.reason) || en.toasts.permissionDenied), 'error');
        return;
      }

      showToast(en.toasts.tournamentFinishedSuccess, 'ok');

      // If the finished tournament was the one on screen, switch to the next active one
      const remainingActive = allTournaments.filter((t) => t.id !== tid && t.status === 'active');
      if (remainingActive.length > 0) {
        onSelectTournament(remainingActive[0].id);
      } else {
        renderTournaments();
        renderAll();
      }
      switchTab('historico');
    },
  );
}

export function onArquivar(): void {
  onTerminarTorneio(getCurrentTournamentId());
}

export function onAtualizar(): void {
  renderAll();
  showToast(en.toasts.dashboardRefreshed, 'ok');
}

export function onAdicionarVolta(): void {
  if (!state.schedule.length) return;
  const rotation = rotationFormat();
  if (rotation) { addRotationRound(rotation); return; }

  if ((loadedConfig().numGrupos || 1) > 1) {
    showToast(en.toasts.extraRoundGroupsUnsupported, 'error');
    return;
  }

  if (state.schedule.some((g) => g.isPlayoff)) {
    showToast(en.toasts.cannotAddRoundsAfterPlayoffs, 'error');
    return;
  }

  const novaVolta = state.scheduleVoltas + 1;

  openConfirm(
    en.confirmations.addExtraRoundTitle,
    en.confirmations.addExtraRoundPrompt(novaVolta),
    () => {
      const { games, rounds } = buildExtraVolta(state.schedule, state.roundsMeta, state.scheduleVoltas);
      state.schedule = state.schedule.concat(games);
      state.roundsMeta = state.roundsMeta.concat(rounds);
      state.scheduleVoltas = novaVolta;
      loadedConfig().numVoltas = novaVolta;
      setFieldValue('cfgNumVoltas', novaVolta);
      persistConfigTeams();
      persistSchedule();
      renderAll();
      showToast(en.toasts.extraRoundAdded, 'ok');
    }
  );
}

/** Americano: plays every partner rotation once more. Mexicano: draws the next round from the standings. */
function addRotationRound(format: RotationFormat): void {
  const n = state.scheduleTeamCount;
  const last = state.roundsMeta.reduce((m, r) => Math.max(m, Number(r.jornada) || 0), 0);
  const append = (rounds: RotationMatch[][]) => {
    const { games, rounds: meta } = rotationSchedule(rounds, last + 1);
    state.schedule = state.schedule.concat(games);
    state.roundsMeta = state.roundsMeta.concat(meta);
    persistSchedule();
    renderAll();
  };

  if (format === 'mexicano') {
    if (!lastRoundFinished(state.schedule, state.results)) { showToast(en.toasts.mexicanoRoundPending, 'error'); return; }
    const ranking = computeStatsSummary().groupsData[0]?.standings.map((s) => s.idx) || [];
    append([mexicanoRound(ranking)]);
    showToast(en.toasts.mexicanoRoundAdded(last + 1), 'ok');
    return;
  }

  const novaVolta = state.scheduleVoltas + 1;
  openConfirm(en.confirmations.addExtraRoundTitle, en.confirmations.addExtraRoundPrompt(novaVolta), () => {
    state.scheduleVoltas = novaVolta;
    loadedConfig().numVoltas = novaVolta;
    setFieldValue('cfgNumVoltas', novaVolta);
    persistConfigTeams();
    append(americanoRounds(n));
    showToast(en.toasts.extraRoundAdded, 'ok');
  });
}

export function onGerarEliminatorias(): void {
  if (rotationFormat()) { showToast(en.toasts.rotationNoPlayoffs, 'error'); return; }
  const summary = computeStatsSummary();
  const numPlayoffTeamsPerGroup = loadedConfig().numPlayoffTeams || 4;
  const numGrupos = loadedConfig().numGrupos || 1;
  const totalPlayoffTeams = numPlayoffTeamsPerGroup * numGrupos;

  if (totalPlayoffTeams > 16) {
    showToast(en.playoffs.maxTeamsError, 'error');
    return;
  }

  if (firstRoundIndex(totalPlayoffTeams) === null) {
    showToast(en.playoffs.configNotSupported(totalPlayoffTeams), 'error');
    return;
  }

  // Teams by position, alternating groups: 1st A, 1st B, 2nd A, 2nd B, …
  const seeds = playoffSeeds(summary.groupsData, numPlayoffTeamsPerGroup);
  if (!seeds) {
    showToast(en.playoffs.notEnoughTeamsInGroup(numPlayoffTeamsPerGroup), 'error');
    return;
  }

  const { games: newGames, rounds: newRounds } = buildPlayoffBracket(totalPlayoffTeams, seeds);

  openConfirm(
    en.playoffs.generatePlayoffsTitle,
    en.playoffs.generatePlayoffsPrompt(totalPlayoffTeams),
    () => {
      state.schedule = state.schedule.concat(newGames);
      state.roundsMeta = state.roundsMeta.concat(newRounds);
      persistSchedule();
      renderAll();
      showToast(en.playoffs.playoffsGenerated, 'ok');
    }
  );
}

// ---------------------------------------------------------------------------
// Session (Google) and administration
// ---------------------------------------------------------------------------
let stopAdminListeners: (() => void) | null = null;

export function onContaClick(): void {
  const user = getCurrentUser();
  if (!user) {
    signInWithGoogle().catch((err) => {
      if (err && err.code === 'auth/popup-closed-by-user') return;
      console.error('Sign-in failed:', err);
      showToast(en.toasts.couldNotSignInGoogle, 'error');
    });
    return;
  }
  // On a phone the button only shows 👤, so the prompt says who is signed in
  const quem = `${user.displayName || user.email || ''} (${roleLabel(getCurrentRole(), getCurrentUserAdmin())})`;
  openConfirm(en.modals.signOutTitle, en.modals.signOutPrompt(quem), () => {
    signOutUser();
  });
}

function onAuthChange({ user, role, admin }: AuthInfo): void {
  renderAuth(user, role, admin);

  if (isEmulator && dom.devRoleSelect) {
    const select = dom.devRoleSelect as HTMLSelectElement;
    if (!user) select.value = 'none';
    else if (role === 'master') select.value = 'master';
    else if (role === 'admin') select.value = 'admin';
    else if (role === 'user') select.value = 'user';
  }

  const isMst = !!user && role === 'master';
  if (isMst && !stopAdminListeners) {
    const stopUsers = listenUsers((users) => renderUsers(users, user.uid));
    const stopLog = listenLog(renderLog);
    stopAdminListeners = () => { stopUsers(); stopLog(); };
  } else if (!isMst && stopAdminListeners) {
    stopAdminListeners();
    stopAdminListeners = null;
  }
}

/** A role or sport box changed in <user-list> (detail: { uid, name, role, sportAdmins }). */
export function onUserRoleChange({ uid, name: nome, role, sportAdmins }: RoleChange): void {
  setUserRole(uid, role, sportAdmins, nome)
    .then(() => showToast(en.toasts.roleUpdated, 'ok'))
    .catch((err) => {
      console.error('Role change failed:', err);
      showToast(en.toasts.couldNotUpdateRole, 'error');
    });
}

// ---------------------------------------------------------------------------
// Phone: the "More" drawer (opens from the bottom, from the navigation pill)
// ---------------------------------------------------------------------------
function bindMenuDrawer(): void {
  const drawer = document.getElementById('tabs');
  const btnMenu = document.getElementById('btnMobileMenu');
  const btnClose = document.getElementById('btnFecharMenu');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer || !btnMenu || !backdrop) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const isOpen = () => drawer.classList.contains('menu-open');
  const setOpen = (open: boolean) => drawer.classList.toggle('menu-open', open);

  // switchTab also closes the drawer: aria-expanded follows the class
  new MutationObserver(() => btnMenu.setAttribute('aria-expanded', String(isOpen())))
    .observe(drawer, { attributes: true, attributeFilter: ['class'] });

  btnMenu.addEventListener('click', () => setOpen(!isOpen()));
  if (btnClose) btnClose.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
}

// ---------------------------------------------------------------------------
// Event binding and start-up
// ---------------------------------------------------------------------------
export function bindEvents(): void {
  bindMenuDrawer();
  bindHistoryEvents();
  bindTournamentsToggle();
  bindPlayersEvents();
  bindSingleMatchEvents();

  document.querySelectorAll<HTMLElement>('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab) {
        switchTab(btn.dataset.tab);
      } else if (btn.classList.contains('dropdown-btn')) {
        const dropdown = btn.closest('.dropdown');
        if (dropdown) dropdown.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element | null)?.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  dom.btnGerarCalendario.addEventListener('click', onGerarCalendario);
  dom.btnNovoTorneio.addEventListener('click', onNovoTorneio);
  dom.btnArquivar.addEventListener('click', onArquivar);
  dom.btnPartilharTabela.addEventListener('click', shareStandings);
  dom.btnAtualizar.addEventListener('click', onAtualizar);
  dom.btnAdicionarVolta.addEventListener('click', onAdicionarVolta);
  dom.btnGerarEliminatorias.addEventListener('click', onGerarEliminatorias);

  // Dark / light theme
  const updateThemeIcon = () => {
    dom.btnDarkMode.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  };
  // Apply the saved theme on load, not only when the button is pressed
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  dom.btnDarkMode.addEventListener('click', () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('torneio_theme', currentTheme);
    updateThemeIcon();
  });

  // Squads
  dom.squadTeamSelect.addEventListener('change', () => {
    renderSquadList();
    renderSquadPlayerFromDBDropdown();
  });
  dom.btnAddPlayerFromDB.addEventListener('click', onAddPlayerFromDB);
  dom.btnDrawPairs.addEventListener('click', onDrawPairs);
  dom.btnPickRotationPlayers.addEventListener('click', onPickRotationPlayers);
  onEvent<string>(dom.squadList, 'squad-remove', onSquadRemove);
  onEvent<string>(dom.squadList, 'player-stats', (pid) => openPlayerProfile(pid, Number(fieldValue('squadTeamSelect'))));

  // Lit components emit their events to the container element
  onEvent<TeamChange>(dom.teamsList, 'team-change', onTeamChange);
  // <schedule-list> and <results-list> (detail: the match gi, or an object with it)
  onEvent<string>(dom.calendarList, 'open-match', (gi) => openGameModal(gi, 'schedule'));
  onEvent<string>(dom.resultsList, 'open-match', (gi) => openGameModal(gi, 'results'));
  [dom.calendarList, dom.resultsList].forEach((list) => {
    onEvent<string>(list, 'status-click', (gi) => onStatusClick(Number(gi)));
  });
  onEvent<ScoreStep>(dom.resultsList, 'score-step', onScoreStep);
  onEvent<ScoreCommit>(dom.resultsList, 'score-commit', onScoreCommit);

  // Account and administration
  if (isEmulator) {
    if (dom.btnConta) dom.btnConta.style.display = 'none';
    if (dom.devRoleContainer) dom.devRoleContainer.style.display = 'inline-flex';
    if (dom.devRoleSelect) {
      (dom.devRoleSelect as HTMLSelectElement).value = getCurrentDevRole();
      dom.devRoleSelect.addEventListener('change', async (e) => {
        const selected = (e.target as HTMLSelectElement).value as DevRole;
        try {
          await setDevRole(selected);
          showToast(en.toasts.devRoleSwitched(selected === 'none' ? en.roles.viewer : en.roles[selected]), 'ok');
        } catch (err) {
          console.error("Failed to switch dev role:", err);
          showToast(en.toasts.couldNotSwitchDevRole, 'error');
        }
      });
    }
  } else {
    dom.btnConta.addEventListener('click', onContaClick);
  }
  onEvent<RoleChange>(dom.usersList, 'role-change', onUserRoleChange);

  // Export / import
  dom.btnExportar.addEventListener('click', exportJSON);
  const importInput = dom.inputImportar as HTMLInputElement;
  dom.btnImportar.addEventListener('click', () => { importInput.value = ''; importInput.click(); });
  importInput.addEventListener('change', () => { importJSON(importInput.files?.[0] ?? null); });

  // Settings
  dom.cfgNome.addEventListener('blur', onConfigFieldChange);
  [dom.cfgVitoria, dom.cfgEmpate, dom.cfgDerrota, dom.cfgBonus, dom.cfgGoleada, dom.cfgGamesPerSet].forEach((el) => {
    el.addEventListener('blur', onConfigFieldChange);
  });
  [dom.cfgSets, dom.cfgSuperTieBreak].forEach((el) => el.addEventListener('change', onConfigFieldChange));
  [dom.cfgNumEquipas, dom.cfgNumVoltas].forEach((el) => {
    el.addEventListener('input', renderScheduleHint);
    el.addEventListener('blur', onFormatFieldChange);
  });
  dom.cfgNumGrupos.addEventListener('change', () => { onConfigFieldChange(); renderScheduleHint(); });
  dom.cfgPadelFormat.addEventListener('change', () => { onConfigFieldChange(); renderAll(); });
  dom.cfgMatchPoints.addEventListener('blur', onConfigFieldChange);
  dom.cfgWinPoints.addEventListener('blur', onConfigFieldChange);
  dom.cfgMataMata.addEventListener('change', onConfigFieldChange);
  dom.cfgNumPlayoffTeams.addEventListener('change', onConfigFieldChange);

  // Match window
  const gameOverlay = document.getElementById('gameOverlay')!;
  document.getElementById('gameModalClose')!.addEventListener('click', closeGameModal);
  // Events from the score panel (<football-score>, <padel-score>; detail: { gi, side })
  const gameModalContent = document.getElementById('gameModalContent')!;
  onEvent<ScoreEvent>(gameModalContent, 'point', ({ gi, side }) => side && onGoalAdd(Number(gi), side));
  onEvent<ScoreEvent>(gameModalContent, 'cancelled', ({ gi, side }) => side && onGoalCancel(Number(gi), side));
  onEvent<ScoreEvent>(gameModalContent, 'started', ({ gi }) => changeGameStatus(Number(gi), GAME_STATUS.DECORRER));
  onEvent<ScoreEvent>(gameModalContent, 'finished', ({ gi }) => changeGameStatus(Number(gi), GAME_STATUS.TERMINADO));
  onEvent<ScoreEvent>(gameModalContent, 'mvp', ({ gi }) => onMvpClick(Number(gi)));
  onEvent<ScoreEvent>(gameModalContent, 'share', ({ gi }) => shareResult(gi));
  gameOverlay.addEventListener('click', (e) => { if (e.target === gameOverlay) closeGameModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gameOverlay.hidden) closeGameModal(); });

  // Modal
  dom.modalCancel.addEventListener('click', closeConfirm);
  dom.modalConfirm.addEventListener('click', runConfirm);
  dom.modalOverlay.addEventListener('click', (e) => { if (e.target === dom.modalOverlay) closeConfirm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dom.modalOverlay.hidden) closeConfirm(); });

  // Players database
  if (dom.btnNewPlayer) dom.btnNewPlayer.addEventListener('click', () => openPlayerModal(null));
  if (dom.playerSearchInput) {
    dom.playerSearchInput.addEventListener('input', renderPlayersList);
  }

  // Tournaments
  if (dom.btnNovoTorneioModal) dom.btnNovoTorneioModal.addEventListener('click', onNovoTorneioModalClick);
  onEvent<string>(dom.listaTorneiosAtivos, 'tournament-select', onSelectTournament);
  onEvent<string>(dom.listaTorneiosAtivos, 'tournament-finish', onTerminarTorneio);
}

// ---------------------------------------------------------------------------
// Updates from Firebase
// ---------------------------------------------------------------------------
let renderPending = false;

/** Is a text or number field focused (someone typing)? */
function isEditingField(): boolean {
  const el = document.activeElement as HTMLInputElement | null;
  if (!el || el.closest('.modal-overlay')) return false;
  if (el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'file'].includes(el.type);
}

/** Redraws now, or when the person leaves the field they are typing in. */
function renderWhenIdle(): void {
  if (isEditingField()) { renderPending = true; return; }
  renderPending = false;
  renderAll();
  renderTournaments();
}

export async function init(): Promise<void> {
  const initialTournamentId = getLastViewedTournamentId();
  setCurrentTournamentId(initialTournamentId);

  setStateHooks({
    flashError,
    flashSaved,
    flashBackup,
    showToast,
    openConfirm,
    renderAll: () => {
      renderAll();
      renderTournaments();
    },
  });
  cacheDom();
  bindEvents();
  await loadState();

  renderAuth(null, null);
  initAuth(onAuthChange);

  initFirebaseListener(initialTournamentId);
  onFirebasePushError(notifyPushError);
  onFirebaseStateChange((data, isFirstLoad) => {
    if (data) {
      applySnapshot(data);
      setSyncedSnapshot(buildSnapshot());
      storeAllLayers();
      renderWhenIdle();
      // The first read only records the state: it does not animate what changed while the app was closed
      animateResultChanges({ silent: isFirstLoad });
    }
  });

  listenTournaments((tournaments) => {
    allTournaments = tournaments;
    const currentId = getCurrentTournamentId();
    const activeTournaments = tournaments.filter((t) => t.status === 'active');

    // If the current tournament is not active but others are, switch to the first active one
    if (activeTournaments.length > 0 && !activeTournaments.some((t) => t.id === currentId)) {
      onSelectTournament(activeTournaments[0].id);
      return;
    }

    renderTournaments();
  });

  // Someone typing in a field saves when they leave it; only then redraw
  document.addEventListener('focusout', () => {
    if (!renderPending) return;
    setTimeout(() => {
      if (renderPending && !isEditingField()) {
        renderPending = false;
        renderAll();
        renderTournaments();
      }
    }, 0);
  });

  renderAll();
  renderTournaments();
  switchTab('dashboard');
}

// Entry point
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
````

## File: src/sync.ts
````typescript
// ---------------------------------------------------------------------------
// Synchronization — snapshot diffing for Firebase updates and data normalization
// ---------------------------------------------------------------------------

import type {
  Match,
  Tournament,
  TournamentMeta,
  Config,
  Score,
  ArchiveEntry,
  ArchiveStandingRow,
  ArchivePlayer,
  Player,
  PlayerAttributes,
  RatingAttributes,
} from './types.js';
import { en } from './i18n/en.js';
import { getSport } from './sports/registry.js';

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Computes the delta between the last synchronized snapshot and the current one,
 * in Firebase `update()` format (path -> value, where null deletes).
 *
 * Results are saved game-by-game so that two people entering results for different
 * matches simultaneously do not overwrite each other. Other sections are only sent
 * when changed.
 *
 * @param prev - Last synchronized snapshot (null if none)
 * @param next - Current snapshot
 * @returns Map of Firebase paths to values
 */
export function diffSnapshot(
  prev: Partial<Tournament> | null,
  next: Partial<Tournament>,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};

  if (!prev) {
    Object.keys(next).forEach((key) => {
      updates[key] = (next as Record<string, unknown>)[key] ?? null;
    });
    return updates;
  }

  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.forEach((key) => {
    if (key === 'results') {
      const a = (prev.results || {}) as Record<string, unknown>;
      const b = (next.results || {}) as Record<string, unknown>;
      new Set([...Object.keys(a), ...Object.keys(b)]).forEach((gi) => {
        if (!same(a[gi], b[gi])) updates[`results/${gi}`] = b[gi] ?? null;
      });
    } else if (key === 'schedule' && Array.isArray(prev.schedule) && Array.isArray(next.schedule)) {
      diffSchedule(prev.schedule, next.schedule, updates);
    } else if (!same((prev as Record<string, unknown>)[key], (next as Record<string, unknown>)[key])) {
      updates[key] = (next as Record<string, unknown>)[key] ?? null;
    }
  });

  return updates;
}

/**
 * Schedule is saved field-by-field for each game: this allows a user advancing
 * a knockout stage winner to only save `schedule/<game>/home` or `away`
 * (the rest of the schedule is admin-only).
 */
function diffSchedule(a: unknown[], b: unknown[], updates: Record<string, unknown>): void {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (same(a[i], b[i])) continue;
    const ga = a[i];
    const gb = b[i];
    if (ga && gb && typeof ga === 'object' && typeof gb === 'object') {
      const gaObj = ga as Record<string, unknown>;
      const gbObj = gb as Record<string, unknown>;
      new Set([...Object.keys(gaObj), ...Object.keys(gbObj)]).forEach((k) => {
        if (!same(gaObj[k], gbObj[k])) updates[`schedule/${i}/${k}`] = gbObj[k] ?? null;
      });
    } else {
      updates[`schedule/${i}`] = gb ?? null;
    }
  }
}

/** Sections that store only metadata: alone, they do not justify a database save. */
const META_SECTIONS: readonly string[] = ['exportedAt', 'version'];

/** Checks whether the update only modifies metadata (export timestamp, version). */
export function onlyMetadata(updates: Record<string, unknown>): boolean {
  return Object.keys(updates).every((p) => META_SECTIONS.includes(p));
}

/**
 * Normalizes a tournament configuration, applying default values and ensuring
 * the sport is defined. If no sport is specified (e.g. from version <= 7 snapshots),
 * it defaults to 'football'.
 */
export function normalizeConfig(config?: Partial<Config> | null): Config {
  const raw = config || {};
  return {
    nome: typeof raw.nome === 'string' ? raw.nome : 'Futebol ILOG',
    numEquipas: typeof raw.numEquipas === 'number' ? raw.numEquipas : 8,
    numGrupos: typeof raw.numGrupos === 'number' ? raw.numGrupos : 1,
    numVoltas: typeof raw.numVoltas === 'number' ? raw.numVoltas : 2,
    pontosVitoria: typeof raw.pontosVitoria === 'number' ? raw.pontosVitoria : 3,
    pontosEmpate: typeof raw.pontosEmpate === 'number' ? raw.pontosEmpate : 1,
    pontosDerrota: typeof raw.pontosDerrota === 'number' ? raw.pontosDerrota : 0,
    bonusGoleada: typeof raw.bonusGoleada === 'number' ? raw.bonusGoleada : 1,
    golosGoleada: typeof raw.golosGoleada === 'number' ? raw.golosGoleada : 3,
    mataMata: Boolean(raw.mataMata),
    numPlayoffTeams: typeof raw.numPlayoffTeams === 'number' ? raw.numPlayoffTeams : 4,
    ...raw,
    sport: typeof raw.sport === 'string' && raw.sport ? raw.sport : 'football',
  };
}

/**
 * Normalizes tournament metadata, ensuring sport, name, status, and createdAt
 * are defined. Defaults to config values or football defaults.
 */
export function normalizeMeta(
  meta?: unknown,
  config?: Partial<Config> | null,
): TournamentMeta {
  const raw = (meta && typeof meta === 'object' ? meta : {}) as Partial<TournamentMeta>;
  const sport =
    typeof raw.sport === 'string' && raw.sport
      ? raw.sport
      : (typeof config?.sport === 'string' && config.sport ? config.sport : 'football');
  const name =
    typeof raw.name === 'string' && raw.name
      ? raw.name
      : (typeof config?.nome === 'string' && config.nome ? config.nome : 'Futebol ILOG');
  const status = raw.status === 'finished' ? 'finished' : 'active';
  const createdAt =
    typeof raw.createdAt === 'number' && !isNaN(raw.createdAt) ? raw.createdAt : Date.now();
  const res: TournamentMeta = { name, sport, status, createdAt };
  if (typeof raw.id === 'string' && raw.id) res.id = raw.id;
  return res;
}

/**
 * Firebase removes empty arrays and converts objects with numeric keys into
 * sparse arrays (with null holes). Restores the expected structure for match results.
 */
export function normalizeResults(
  results?: Record<string | number, unknown> | unknown[] | null,
): Record<string, Score | string> {
  const out: Record<string, Score | string> = {};
  if (!results || typeof results !== 'object') return out;

  Object.keys(results).forEach((gi) => {
    const r = (results as Record<string, unknown>)[gi];
    if (r === null || r === undefined) return;
    if (typeof r === 'object') {
      const rObj = r as Record<string, unknown>;
      const scorers = (rObj.scorers || {}) as { home?: unknown[]; away?: unknown[] };
      const assists = (rObj.assists || {}) as { home?: unknown[]; away?: unknown[] };
      const fix = (arr?: unknown[]) => Array.from(arr || [], (v) => (v ? String(v) : ''));
      out[gi] = {
        ...rObj,
        scorers: {
          home: (scorers.home || []) as string[],
          away: (scorers.away || []) as string[],
        },
        assists: {
          home: fix(assists.home),
          away: fix(assists.away),
        },
      } as Score;
    } else {
      out[gi] = String(r);
    }
  });
  return out;
}

/**
 * Restores empty lists that Firebase removes in tournament archives
 * (and converts objects with numeric keys back to arrays).
 */
export function normalizeArquivo(arquivo?: unknown): ArchiveEntry[] {
  const list = <T>(v: unknown): T[] => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v && typeof v === 'object') return Object.values(v).filter(Boolean) as T[];
    return [];
  };

  return list<Record<string, unknown>>(arquivo).map((e) => ({
    ...e,
    sport: typeof e.sport === 'string' && e.sport ? e.sport : 'football',
    grupos: list<Record<string, unknown>>(e.grupos).map((g) => ({
      ...g,
      tabela: list<ArchiveStandingRow>(g.tabela),
    })),
    jogadores: list<ArchivePlayer>(e.jogadores),
  })) as unknown as ArchiveEntry[];
}

/** All of a sport's rating attributes at 0 (football when the sport is unknown). */
export function defaultPlayerAttrs(sport?: string): RatingAttributes {
  return Object.fromEntries(Object.keys(getSport(sport).ratingAttributes()).map((k) => [k, 0]));
}

/**
 * Normalizes a player, ensuring per-sport ratings dictionary exists.
 * Migrates legacy `atributos` to `ratings.football` if needed.
 */
export function normalizePlayer(p: unknown): Player | null {
  if (!p || typeof p !== 'object') return null;
  const obj = p as Record<string, unknown>;

  const ratingsRaw =
    obj.ratings && typeof obj.ratings === 'object'
      ? (obj.ratings as Record<string, unknown>)
      : {};
  const ratings: Record<string, RatingAttributes> = {};

  Object.keys(ratingsRaw).forEach((s) => {
    if (ratingsRaw[s] && typeof ratingsRaw[s] === 'object') {
      ratings[s] = Object.assign(
        defaultPlayerAttrs(s),
        ratingsRaw[s] as RatingAttributes,
      );
    }
  });

  // Migrate legacy atributos to ratings.football if not present
  if (!ratings.football) {
    const legacyAttrs =
      obj.atributos && typeof obj.atributos === 'object'
        ? (obj.atributos as Partial<PlayerAttributes>)
        : {};
    ratings.football = Object.assign(defaultPlayerAttrs('football'), legacyAttrs);
  }

  return {
    id: typeof obj.id === 'string' && obj.id ? obj.id : crypto.randomUUID(),
    nome: typeof obj.nome === 'string' ? obj.nome : '',
    teamIdx:
      obj.teamIdx !== undefined && obj.teamIdx !== null
        ? (typeof obj.teamIdx === 'number' ? obj.teamIdx : Number(obj.teamIdx))
        : null,
    ratings,
    atributos: ratings.football as PlayerAttributes,
  };
}

/**
 * Restores empty lists or objects that Firebase removes in player database
 * (and converts objects with numeric/UUID keys back to arrays).
 */
export function normalizePlayers(players?: unknown): Player[] {
  const list = <T>(v: unknown): T[] => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v && typeof v === 'object') return Object.values(v).filter(Boolean) as T[];
    return [];
  };

  return list<unknown>(players)
    .map(normalizePlayer)
    .filter((p): p is Player => p !== null);
}

const SECTION_LABELS: Record<string, string | null> = {
  meta: en.sync.sectionLabels.meta,
  config: en.sync.sectionLabels.config,
  teams: en.sync.sectionLabels.teams,
  squads: en.sync.sectionLabels.squads,
  schedule: en.sync.sectionLabels.schedule,
  roundsMeta: null,
  scheduleTeamCount: null,
  scheduleVoltas: null,
  players: en.sync.sectionLabels.players,
  jogosSingulares: en.sync.sectionLabels.jogosSingulares,
  results: en.sync.sectionLabels.results,
  arquivo: en.sync.sectionLabels.arquivo,
  exportedAt: null,
  version: null,
};

function teamLabel(snap: Partial<Tournament>, idx: number | string): string {
  if (typeof idx === 'string') return idx;
  const t = snap.teams && snap.teams[idx];
  return t && t.name ? t.name : en.sync.defaultTeamLabel(Number(idx) + 1);
}

function sideText(snap: Partial<Tournament>, game: Match, side: 'home' | 'away'): string {
  const partner = game.partners?.[side];
  const first = teamLabel(snap, game[side]);
  return typeof partner === 'number' ? `${first} / ${teamLabel(snap, partner)}` : first;
}

/**
 * Formats a human-readable description of Firebase updates for the audit log
 * (who changed what).
 *
 * @param updates - Path map returned by diffSnapshot
 * @param snap - Snapshot after the change
 * @returns Description, or '' if only metadata changed
 */
export function describeUpdates(
  updates: Record<string, unknown>,
  snap: Partial<Tournament>,
): string {
  const parts: string[] = [];
  const deleted = Object.keys(updates).filter(
    (p) => p.startsWith('results/') && updates[p] == null,
  );
  if (deleted.length > 1) parts.push(en.sync.resultsDeleted(deleted.length));

  Object.keys(updates).forEach((path) => {
    const [section, gi] = path.split('/');
    if (section === 'schedule' && gi !== undefined) {
      const scheduleLabel = en.sync.sectionLabels.schedule;
      if (!parts.includes(scheduleLabel)) parts.push(scheduleLabel);
      return;
    }
    if (section === 'results' && gi !== undefined) {
      if (deleted.length > 1 && updates[path] == null) return;
      const game = (snap.schedule || [])[Number(gi)];
      const jogo = game
        ? `${sideText(snap, game, 'home')} vs ${sideText(snap, game, 'away')}`
        : en.sync.defaultMatchLabel(Number(gi) + 1);
      const r = updates[path] as Score | string | null | undefined;
      if (r === null || r === undefined) {
        parts.push(en.sync.resultDeleted(jogo));
      } else {
        const score = typeof r === 'object' ? r.score : r;
        const pen = typeof r === 'object' && r && r.penalties ? en.sync.penaltiesSuffix(r.penalties) : '';
        const status = typeof r === 'object' && r && r.status ? en.sync.statusSuffix(r.status) : '';
        parts.push(en.sync.resultUpdated(jogo, String(score), pen, status));
      }
      return;
    }
    const label = Object.prototype.hasOwnProperty.call(SECTION_LABELS, section)
      ? SECTION_LABELS[section]
      : en.sync.genericSectionUpdated(section);
    if (label && !parts.includes(label)) parts.push(label);
  });
  return parts.join('; ').slice(0, 500);
}

/**
 * Roles to copy from the legacy `utilizadores` node into `users`, as
 * `update()` paths. Only users who have no role in `users` yet are copied,
 * and only `role` / `admin` are written (the profile fields belong to each
 * user). The legacy tournament was football, so a legacy `admin` becomes a
 * football admin.
 */
export function legacyRoleUpdates(
  utilizadores: Record<string, { role?: string } | null> | null | undefined,
  users: Record<string, { role?: string | null } | null> | null | undefined
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  Object.entries(utilizadores || {}).forEach(([uid, legacy]) => {
    const oldRole = legacy && legacy.role;
    if (oldRole !== 'admin' && oldRole !== 'user') return;
    if (users && users[uid] && users[uid]!.role) return;
    updates[`users/${uid}/role`] = oldRole;
    if (oldRole === 'admin') updates[`users/${uid}/admin/football`] = true;
  });
  return updates;
}
````

## File: tests/rules/rules.check.mjs
````javascript
// Verifica database.rules.json no emulador do Firebase (precisa de Java).
// Correr com: npm run test:rules
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, update, set, push, get, serverTimestamp } from 'firebase/database';
import fs from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'demo-torneio',
  database: { host: '127.0.0.1', port: 9100, rules: fs.readFileSync(new URL('../../database.rules.json', import.meta.url), 'utf8') },
});
await env.withSecurityRulesDisabled(async (ctx) => {
  await set(ref(ctx.database()), {
    users: {
      mst: { role: 'master', nome: 'Master' },
      adm_foot: { role: 'admin', admin: { football: true }, nome: 'Admin Futebol' },
      adm_padel: { role: 'admin', admin: { padel: true }, nome: 'Admin Padel' },
      usr: { role: 'user', nome: 'User' },
      pend: { nome: 'Pendente' },
    },
    utilizadores: { adm: { role: 'admin' }, usr: { role: 'user' } },
    torneio_state: {
      config: { nome: 'T' },
      schedule: [{ home: 0, away: 1, jornada: 1 }],
    },
    tournaments: {
      t1: {
        meta: { name: 'T1 Futebol', sport: 'football', status: 'active', createdAt: 1000 },
        config: { nome: 'T1' },
        schedule: [{ home: 0, away: 1, jornada: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true, jornada: 'Final' }],
        results: { 0: { score: '1-0', status: 'terminado', scorers: { home: ['a'] } } },
        logRef: 'antigo',
      },
      t2: {
        meta: { name: 'T2 Padel', sport: 'padel', status: 'active', createdAt: 1500 },
        config: { nome: 'T2' },
        schedule: [{ home: 0, away: 1, jornada: 1 }],
        results: { 0: { score: '6-4', status: 'terminado', scorers: { home: ['a'] } } },
        logRef: 'antigo_padel',
      },
      tt: {
        meta: { name: 'Tennis Open', sport: 'tennis', status: 'active', createdAt: 1600 },
        config: { nome: 'TT' },
        schedule: [{ home: 0, away: 1, jornada: 1 }],
        logRef: 'antigo_tennis',
      },
    },
    tournament_log: {
      t1: { antigo: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
      t2: { antigo_padel: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
      tt: { antigo_tennis: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
    },
    arquivo: {
      a1: { id: 'a1', nome: 'Antigo', sport: 'football' },
    },
  });
});

function db(uid) { return env.authenticatedContext(uid).database(); }
function withLog(d, uid, upd, tournamentId = 't1') {
  const key = push(ref(d, `tournament_log/${tournamentId}`)).key;
  return {
    ...upd,
    [`tournament_log/${tournamentId}/${key}`]: { uid, nome: 'n', acao: 'teste', quando: serverTimestamp() },
    [`tournaments/${tournamentId}/logRef`]: key,
  };
}

let ok = 0, bad = 0;
async function check(name, expect, p) {
  try {
    await (expect ? assertSucceeds(p) : assertFails(p));
    ok++;
    console.log('ok  ', name);
  } catch (e) {
    bad++;
    console.log('FAIL', name, e.message);
  }
}

const u = db('usr'),
  mst = db('mst'),
  adm_foot = db('adm_foot'),
  adm_padel = db('adm_padel'),
  p = db('pend'),
  anon = env.unauthenticatedContext().database();

const res = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['', 'c'] }, mvp: 'a' };

// --- torneio_state (read-only) ---
await check('anónimo lê torneio_state', true, get(ref(anon, 'torneio_state')));
await check('master não escreve em torneio_state', false, update(ref(mst), { 'torneio_state/config/nome': 'Hacked' }));
await check('user não escreve em torneio_state', false, update(ref(u), { 'torneio_state/results/0': res }));

// --- tournaments / tournament_log ---
// Results and playoff winners are written only by the sport's admins (and master)
await check('user NÃO grava resultado', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': res })));
await check('user NÃO apaga resultado', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': null })));
await check('user NÃO muda estado do jogo', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/1': { score: '0-0', status: 'decorrer' } })));
await check('user NÃO passa vencedor (schedule/1/home)', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/home': 0 })));
await check('admin futebol grava resultado de futebol', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t1/results/1': { score: '0-0', status: 'decorrer' } })));
await check('admin padel NÃO grava resultado de futebol', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t1/results/1': { score: '1-0', status: 'decorrer' } })));
await check('master grava resultado com registo', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/0': res })));
await check('master grava resultado sem registo', false, update(ref(mst), { 'tournaments/t1/results/0': res }));
await check('master apaga resultado sem registo', false, update(ref(mst), { 'tournaments/t1/results/0': null }));
await check('master apaga resultado com registo', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/0': null })));
await check('master estado com HTML', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '0-0', status: '"><img src=x onerror=alert(1)>' } })));
await check('master score inválido', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '<b>' } })));
await check('master campo desconhecido', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '0-0', hack: 1 } })));
await check('master resultado antigo em texto', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/2': '3-1' })));

// --- score formats: sets only in padel and tennis; scorers and assists only in football ---
await check('padel score by sets', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/1': { score: '6-4 3-6 10-7', status: 'terminado' } }, 't2')));
await check('padel set being played', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/2': { score: '6-4 0-0', status: 'decorrer' } }, 't2')));
await check('padel single set', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/3': { score: '6-4', status: 'terminado' } }, 't2')));
await check('padel too many sets', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/4': { score: '6-4 6-4 6-4 6-4 6-4 6-4' } }, 't2')));
await check('padel with scorers', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/5': { score: '6-4 6-4', scorers: { home: ['a'] } } }, 't2')));
await check('padel with assists', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/6': { score: '6-4 6-4', assists: { home: ['a'] } } }, 't2')));
await check('tennis score by sets', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/0': { score: '6-4 6-7 7-5', status: 'terminado' } }, 'tt')));
await check('tennis with scorers', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/1': { score: '6-4', scorers: { home: ['a'] } } }, 'tt')));
await check('tennis with assists', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/2': { score: '6-4', assists: { home: ['a'] } } }, 'tt')));
await check('football score by sets', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/3': { score: '6-4 3-6' } })));
await check('football with scorers', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/4': { score: '1-0', scorers: { home: ['a'] }, assists: { home: ['b'] } } })));
await check('master passa vencedor (schedule/1/home)', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/schedule/1/home': 0 })));
await check('user apaga calendário', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule': null })));
await check('user reescreve jogo', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1': { home: 1, away: 2 } })));
await check('user muda jornada', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/jornada': 'x' })));
await check('user muda config', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/config/nome': 'x' })));
await check('user muda meta', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/meta/name': 'x' })));
await check('user grava exportedAt sozinho', true, update(ref(u), { 'tournaments/t1/exportedAt': '2026-10-02T10:00:00Z', 'tournaments/t1/version': 9 }));
await check('master logRef para entrada antiga', false, update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': 'antigo' }));
await check('master apaga logRef', false, update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': null }));
await check('master registo em nome de outro', false, (() => {
  const key = push(ref(mst, 'tournament_log/t1')).key;
  return update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, [`tournament_log/t1/${key}`]: { uid: 'usr', nome: 'n', acao: 'x', quando: serverTimestamp() }, 'tournaments/t1/logRef': key });
})());
await check('user jogos singulares com registo', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/jogosSingulares': [{ resultado: '1-0' }] })));
await check('pendente grava resultado', false, update(ref(p), withLog(p, 'pend', { 'tournaments/t1/results/1': { score: '0-0' } })));
await check('anónimo lê torneio', true, get(ref(anon, 'tournaments/t1')));

// --- master operations ---
await check('master muda config com registo', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/config/nome': 'Novo' })));
await check('master muda config sem registo', false, update(ref(mst), { 'tournaments/t1/config/nome': 'Novo2' }));
await check('master novo calendário inteiro', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/schedule': [{ home: 0, away: 1 }], 'tournaments/t1/results': null })));
await check('master altera meta.name', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'active', createdAt: 1000 },
})));
await check('master tenta alterar meta.sport (imutável)', false, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'T1', sport: 'basketball', status: 'active', createdAt: 1000 },
})));
await check('master envia novo torneio de qualquer modalidade', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t3_mst/meta': { name: 'Basquetebol Cup', sport: 'basketball', status: 'active', createdAt: 2000 },
  'tournaments/t3_mst/results': { 0: res },
  'tournaments/t3_mst/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_mst/teams': [{ name: 'A' }],
}, 't3_mst')));

// --- per-sport admin operations ---
await check('admin futebol muda config de futebol', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t1/config/nome': 'Futebol Editado' })));
await check('admin futebol NÃO muda config de padel', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t2/config/nome': 'Padel Hack' }, 't2')));
await check('admin padel muda config de padel', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t2/config/nome': 'Padel Editado' }, 't2')));
await check('admin padel NÃO muda config de futebol', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t1/config/nome': 'Futebol Hack' })));
await check('admin padel cria novo torneio de padel', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t3_padel/meta': { name: 'Open Padel', sport: 'padel', status: 'active', createdAt: 3000 },
  'tournaments/t3_padel/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_padel/teams': [{ name: 'A' }],
}, 't3_padel')));
await check('admin padel NÃO cria torneio de futebol', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t4_foot/meta': { name: 'Futebol Não Autorizado', sport: 'football', status: 'active', createdAt: 4000 },
  'tournaments/t4_foot/schedule': [{ home: 0, away: 1 }],
  'tournaments/t4_foot/teams': [{ name: 'A' }],
}, 't4_foot')));

// --- users management (only master manages roles) ---
await check('master altera role de utilizador', true, update(ref(mst), { 'users/pend/role': 'user' }));
await check('master define admin de modalidade', true, update(ref(mst), { 'users/pend/role': 'admin', 'users/pend/admin/padel': true }));
await check('admin futebol NÃO altera role de utilizador', false, update(ref(adm_foot), { 'users/pend/role': 'admin' }));
await check('admin padel NÃO altera role de utilizador', false, update(ref(adm_padel), { 'users/pend/role': 'admin' }));
await check('user NÃO altera role de utilizador', false, update(ref(u), { 'users/pend/role': 'admin' }));
await check('master lê lista de utilizadores', true, get(ref(mst, 'users')));
await check('admin futebol NÃO lê lista de utilizadores', false, get(ref(adm_foot, 'users')));
await check('user NÃO lê lista de utilizadores', false, get(ref(u, 'users')));

// --- arquivo e terminar torneio ---
await check('anónimo lê arquivo', true, get(ref(anon, 'arquivo')));
await check('master grava arquivo', true, update(ref(mst), { 'arquivo/a2': { id: 'a2', nome: 'Final 2025', sport: 'football' } }));
await check('admin futebol grava arquivo de futebol', true, update(ref(adm_foot), { 'arquivo/a_foot': { id: 'a_foot', nome: 'Futebol 2025', sport: 'football' } }));
await check('admin futebol NÃO grava arquivo de padel', false, update(ref(adm_foot), { 'arquivo/a_padel_bad': { id: 'a_padel_bad', nome: 'Padel 2025', sport: 'padel' } }));
await check('user não grava arquivo', false, update(ref(u), { 'arquivo/a3': { id: 'a3', nome: 'Hack' } }));
await check('admin futebol termina torneio de futebol com registo', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t1/meta': { name: 'T1 Finalizado', sport: 'football', status: 'finished', createdAt: 1000 },
  'arquivo/entry_t1': { id: 'entry_t1', nome: 'T1 Finalizado', sport: 'football' },
})));
await check('admin futebol NÃO termina torneio de padel', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t2/meta': { name: 'T2 Finalizado', sport: 'padel', status: 'finished', createdAt: 1500 },
  'arquivo/entry_t2': { id: 'entry_t2', nome: 'T2 Finalizado', sport: 'padel' },
}, 't2')));
await check('user não termina torneio', false, update(ref(u), withLog(u, 'usr', {
  'tournaments/t2/meta': { name: 'T2 Hack', sport: 'padel', status: 'finished', createdAt: 1500 },
}, 't2')));

// --- players (global) ---
await check('anónimo lê players', true, get(ref(anon, 'players')));
await check('master grava players', true, update(ref(mst), { 'players/p1': { id: 'p1', nome: 'Jogador 1', ratings: { football: { velocidade: 5 } } } }));
await check('admin futebol grava players', true, update(ref(adm_foot), { 'players/p2': { id: 'p2', nome: 'Jogador 2', ratings: { football: { velocidade: 4 } } } }));
await check('user não grava players', false, update(ref(u), { 'players/p3': { id: 'p3', nome: 'Hacker' } }));

console.log(`\n${ok} ok, ${bad} falharam`);
await env.cleanup();
process.exit(bad ? 1 : 0);
````

## File: css/style.css
````css
/* Estilos da app, partidos por área. A ordem conta: é a mesma cascata
   do antigo style.css, e o Vite junta tudo num só ficheiro no build. */
@import './base.css'; /* Variáveis, temas claro/escuro e reset */
@import './layout.css'; /* Topo, barra de ferramentas, separadores e conteúdo */
@import './classificacao.css'; /* Pódio, tabelas e setas de lugares da classificação */
@import './equipas.css'; /* Formulários, equipas e plantéis */
@import './jogos.css'; /* Jornadas, resultados e estado da partida */
@import './componentes.css'; /* Estatísticas, modal e toasts */
@import './mobile.css'; /* Telemóvel: barra de baixo, painel "Mais", gaveta e ajustes */
@import './jogadores.css'; /* Base de dados de jogadores e estrelas de rating */
@import './singular.css'; /* Jogo singular e o seu histórico */
@import './dados.css'; /* Zona de perigo (apagar dados) e confirmação */
@import './sessao.css'; /* Sessão, perfis e utilizadores */
@import './historico.css'; /* Histórico de torneios arquivados */
@import './torneios.css'; /* Lista de torneios ativos e cartões */
@import './partilha.css'; /* Assistências, MVP e partilha */
@import './jogo.css'; /* Janela do jogo */
@import './score-events.css'; /* Match event animations */
````

## File: src/sports/RacketSport.ts
````typescript
import { Sport, type PlayerStatColumn, type StandingsColumn } from './Sport.js';
import {
  GAME_STATUS,
  type Config,
  type GameEvent,
  type GameStatus,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type Score,
  type SetFormat,
  type StandingsRow,
  type Team,
} from '../types.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// RacketSport — sets and games (padel now, tennis later)
// ---------------------------------------------------------------------------
// A match is scored game by game (no 15-30-40). The score is saved as the
// games of each set, e.g. "6-4 3-6 10-7"; the last set is the one being
// played. A sport can instead play matches to a total of points
// (pointsPerMatch, e.g. padel Americano): the score is then "15-9". Standings count games only: games won, then game difference, then
// head-to-head. There are no points per win.

export type Side = 'home' | 'away';

/** Games of one set (points, in a super tie-break). */
export interface SetScore {
  home: number;
  away: number;
}

/** Per pair: matches played and won, games won and lost. */
export interface PairStats {
  played: number;
  won: number;
  lost: number;
  gamesWon: number;
  gamesLost: number;
  /** Matches won / finished matches, 0-100. */
  winPct: number;
}

const SUPER_TIE_BREAK_POINTS = 10;

export abstract class RacketSport extends Sport {
  /** Set format used when the tournament config has none. */
  abstract readonly defaultFormat: SetFormat;

  // -------------------------------------------------------------------------
  // Set format and score text
  // -------------------------------------------------------------------------

  /** The tournament's set format, with out-of-range values replaced by the defaults. */
  format(config?: Partial<Config> | null): SetFormat {
    const f = (config && config.setFormat) || this.defaultFormat;
    const sets = [1, 3, 5].includes(Number(f.sets)) ? Number(f.sets) : this.defaultFormat.sets;
    const games = Number(f.gamesPerSet);
    return {
      sets,
      gamesPerSet: Number.isInteger(games) && games >= 1 && games <= 9 ? games : this.defaultFormat.gamesPerSet,
      superTieBreak: sets > 1 && f.superTieBreak === true,
    };
  }

  /** "6-4 3-6 10-7" → sets; anything else → no sets. */
  parseSets(score: unknown): SetScore[] {
    const text = String(score || '').trim();
    if (!/^\d{1,2}-\d{1,2}( \d{1,2}-\d{1,2})*$/.test(text)) return [];
    return text.split(' ').map((s) => {
      const [home, away] = s.split('-').map(Number);
      return { home, away };
    });
  }

  formatSets(sets: SetScore[]): string {
    return sets.map((s) => `${s.home}-${s.away}`).join(' ');
  }

  /**
   * Total points of a match when matches are played to points instead of
   * sets (e.g. 24 in padel Americano), or null. None by default.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointsPerMatch(config?: Partial<Config> | null): number | null {
    return null;
  }

  /** Points per side of a match played to points ("15-9"), or null. */
  pointsOf(res: MatchResult | undefined): SetScore | null {
    const sets = this.setsOf(res);
    return sets.length === 1 ? sets[0] : null;
  }

  /** Sets of a saved result. */
  setsOf(res: MatchResult | undefined): SetScore[] {
    if (!res) return [];
    return this.parseSets(typeof res === 'object' ? res.score : res);
  }

  // -------------------------------------------------------------------------
  // Set and match completion
  // -------------------------------------------------------------------------

  /** Is set number `index` (0-based) the deciding super tie-break? */
  isSuperTieBreak(index: number, format: SetFormat): boolean {
    return format.superTieBreak && index === format.sets - 1;
  }

  /** Winner of a set, or null while it is being played. */
  setWinner(set: SetScore, index: number, format: SetFormat): Side | null {
    for (const side of ['home', 'away'] as const) {
      const mine = set[side];
      const theirs = set[side === 'home' ? 'away' : 'home'];
      if (this.isSuperTieBreak(index, format)) {
        if (mine >= SUPER_TIE_BREAK_POINTS && mine - theirs >= 2) return side;
      } else {
        const g = format.gamesPerSet;
        // 6-4 or better, or 7-5 / 7-6 (tie-break) with 6 games per set
        if ((mine >= g && mine - theirs >= 2) || (mine === g + 1 && theirs === g)) return side;
      }
    }
    return null;
  }

  setsWon(sets: SetScore[], format: SetFormat): SetScore {
    const won = { home: 0, away: 0 };
    sets.forEach((s, i) => {
      const w = this.setWinner(s, i, format);
      if (w) won[w]++;
    });
    return won;
  }

  /** Winner of the match, once a side has won the majority of the sets. */
  matchWinner(sets: SetScore[], format: SetFormat): Side | null {
    const need = Math.ceil(format.sets / 2);
    const won = this.setsWon(sets, format);
    if (won.home >= need) return 'home';
    if (won.away >= need) return 'away';
    return null;
  }

  /**
   * Games per side for the standings. A super tie-break counts as one game
   * for its winner, not as its points.
   */
  gamesOf(sets: SetScore[], format: SetFormat): SetScore {
    const games = { home: 0, away: 0 };
    sets.forEach((s, i) => {
      if (this.isSuperTieBreak(i, format)) {
        const w = this.setWinner(s, i, format);
        if (w) games[w]++;
      } else {
        games.home += s.home;
        games.away += s.away;
      }
    });
    return games;
  }

  /** Games per side of a set score string, for summaries (biggest win…). */
  scoreTotals(score: string | undefined, config?: Config | null): SetScore | null {
    const sets = this.parseSets(score);
    return sets.length ? this.gamesOf(sets, this.format(config)) : null;
  }

  /** Sets won per side, or the points of a match played to points. */
  shownScore(res: MatchResult | undefined, config?: Config | null): SetScore | null {
    if (this.pointsPerMatch(config)) return this.pointsOf(res);
    const sets = this.setsOf(res);
    return sets.length ? this.setsWon(sets, this.format(config)) : null;
  }

  // -------------------------------------------------------------------------
  // Scoring, game by game
  // -------------------------------------------------------------------------

  private copy(res: MatchResult | undefined): Score {
    if (res && typeof res === 'object') return JSON.parse(JSON.stringify(res));
    return { score: typeof res === 'string' ? res : '' };
  }

  /** Changes the status; a match that starts with no score starts at 0-0 in the first set. */
  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out = super.setGameStatus(res, status);
    if (!this.parseSets(out.score).length) out.score = '0-0';
    return out;
  }

  /**
   * Adds one game to a side; a finished set opens the next one. The game that
   * decides the match finishes it, and once decided adding is a no-op. In a
   * match played to points, adds a point until the total, which finishes it.
   */
  addPoint(res: MatchResult | undefined, side: Side, config: Config): Score {
    const total = this.pointsPerMatch(config);
    if (total) return this.addMatchPoint(res, side, total);
    const format = this.format(config);
    const sets = this.setsOf(res);
    if (this.matchWinner(sets, format)) return this.copy(res);

    const out = this.copy(res);
    if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
    const last = sets.length - 1;
    if (last < 0 || this.setWinner(sets[last], last, format)) sets.push({ home: 0, away: 0 });
    sets[sets.length - 1][side]++;
    out.score = this.formatSets(sets);
    if (this.matchWinner(sets, format)) out.status = GAME_STATUS.TERMINADO;
    return out;
  }

  private addMatchPoint(res: MatchResult | undefined, side: Side, total: number): Score {
    const pts = this.pointsOf(res) || { home: 0, away: 0 };
    const out = this.copy(res);
    if (pts.home + pts.away >= total) return out;
    if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
    pts[side]++;
    out.score = this.formatSets([pts]);
    if (pts.home + pts.away >= total) out.status = GAME_STATUS.TERMINADO;
    return out;
  }

  /**
   * Removes the last game of a side in the current set (reopening the previous
   * set if the current one is empty). A finished match that is no longer
   * decided goes back to in progress.
   */
  removePoint(res: MatchResult | undefined, side: Side, config?: Config): Score {
    const sets = this.setsOf(res);
    while (sets.length > 1 && sets[sets.length - 1].home === 0 && sets[sets.length - 1].away === 0) sets.pop();
    const current = sets[sets.length - 1];
    if (!current || current[side] <= 0) return this.copy(res);
    current[side]--;
    const out = this.copy(res);
    out.score = this.formatSets(sets);
    if (out.status === GAME_STATUS.TERMINADO && !this.isDecided(sets, config)) out.status = GAME_STATUS.DECORRER;
    return out;
  }

  /** Is the match over: a side won the sets it needs, or the points total is reached? */
  isDecided(sets: SetScore[], config?: Config | null): boolean {
    const total = this.pointsPerMatch(config);
    if (total) return sets.length === 1 && sets[0].home + sets[0].away >= total;
    return !!this.matchWinner(sets, this.format(config));
  }

  // -------------------------------------------------------------------------
  // Standings: games won, game difference, head-to-head
  // -------------------------------------------------------------------------

  /** Matches that count: league stage, not scheduled, with a valid score. */
  private countedMatches(
    schedule: Match[],
    results: Record<string | number, MatchResult>
  ): Array<{ game: Match; home: number; away: number; sets: SetScore[] }> {
    const out: Array<{ game: Match; home: number; away: number; sets: SetScore[] }> = [];
    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;
      const res = results[gi];
      if (!res) return;
      if (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      const sets = this.setsOf(res);
      if (!sets.length) return;
      out.push({ game, home: game.home, away: game.away, sets });
    });
    return out;
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    const format = this.format(config);
    const nGroups = config.numGrupos || 1;
    const groups: GroupStandings[] = [];
    for (let g = 0; g < nGroups; g++) {
      groups.push({
        name: nGroups > 1 ? en.standings.groupName(String.fromCharCode(65 + g)) : en.standings.generalStandings,
        standings: [],
      });
    }

    const rows: StandingsRow[] = teamsArray.map((t, idx) => {
      const name = typeof t === 'string' ? t : (t && t.name ? t.name : `Team ${idx + 1}`);
      return { idx, name, J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, SW: 0, SL: 0, Pts: 0 };
    });

    this.countedMatches(schedule, results).forEach(({ home, away, sets }) => {
      const h = rows[home];
      const a = rows[away];
      if (!h || !a) return;
      const games = this.gamesOf(sets, format);
      const won = this.setsWon(sets, format);
      h.J++;
      a.J++;
      h.GM += games.home;
      h.GS += games.away;
      a.GM += games.away;
      a.GS += games.home;
      h.SW! += won.home;
      h.SL! += won.away;
      a.SW! += won.away;
      a.SL! += won.home;
      const winner = this.matchWinner(sets, format);
      if (winner === 'home') { h.V++; a.D++; }
      if (winner === 'away') { a.V++; h.D++; }
    });

    const winPoints = this.winPoints(config);
    rows.forEach((r) => {
      r.DG = r.GM - r.GS;
      r.Pts = r.V * winPoints;
      const t = teamsArray[r.idx];
      let g = typeof t === 'object' && t !== null && t.group !== undefined ? t.group : 0;
      if (g >= nGroups) g = nGroups - 1;
      groups[g].standings.push(r);
    });

    // Matches won (points), set difference, game difference; pairs still level
    // go to head-to-head
    const key = (r: StandingsRow) => [r.Pts, r.V, setDiff(r), r.DG ?? 0];
    const compare = (x: StandingsRow, y: StandingsRow) => {
      const kx = key(x);
      const ky = key(y);
      for (let i = 0; i < kx.length; i++) if (ky[i] !== kx[i]) return ky[i] - kx[i];
      return 0;
    };
    groups.forEach((group) => {
      const sorted = group.standings.sort(compare);
      let ordered: StandingsRow[] = [];
      let i = 0;
      while (i < sorted.length) {
        let j = i + 1;
        while (j < sorted.length && compare(sorted[i], sorted[j]) === 0) j++;
        const cluster = sorted.slice(i, j);
        ordered = ordered.concat(cluster.length > 1 ? this.resolveHeadToHead(cluster, schedule, results, config) : cluster);
        i = j;
      }
      group.standings = ordered;
    });

    return groups;
  }

  /** Standings points per match won (0 to 10, 1 by default). */
  winPoints(config?: Partial<Config> | null): number {
    const n = Number(config?.winPoints);
    return Number.isInteger(n) && n >= 0 && n <= 10 ? n : 1;
  }

  /**
   * Among tied pairs, their matches against each other: matches won, then set
   * difference, then game difference; then fewest games lost overall, then name.
   */
  resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[] {
    const format = this.format(config);
    const mini = new Map<number, { won: number; sets: number; games: number }>();
    cluster.forEach((c) => mini.set(c.idx, { won: 0, sets: 0, games: 0 }));

    this.countedMatches(schedule, results).forEach(({ home, away, sets }) => {
      const h = mini.get(home);
      const a = mini.get(away);
      if (!h || !a) return;
      const games = this.gamesOf(sets, format);
      const won = this.setsWon(sets, format);
      const winner = this.matchWinner(sets, format);
      if (winner === 'home') h.won++;
      if (winner === 'away') a.won++;
      h.sets += won.home - won.away;
      a.sets += won.away - won.home;
      h.games += games.home - games.away;
      a.games += games.away - games.home;
    });

    return cluster.slice().sort((x, y) => {
      const mx = mini.get(x.idx)!;
      const my = mini.get(y.idx)!;
      return (my.won - mx.won) ||
        (my.sets - mx.sets) ||
        (my.games - mx.games) ||
        (x.GS - y.GS) ||
        x.name.localeCompare(y.name);
    });
  }

  getPlayoffWinner(game: Match, res: MatchResult | undefined, config?: Config): number | string | null {
    if (!game || !game.isPlayoff || !res || typeof res !== 'object') return null;
    if (res.status !== GAME_STATUS.TERMINADO) return null;
    const winner = this.matchWinner(this.setsOf(res), this.format(config));
    return winner ? game[winner] : null;
  }

  /** Matches, wins and games per pair (team index), league and playoffs. */
  pairStats(
    teamCount: number,
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): PairStats[] {
    const format = this.format(config);
    const out: PairStats[] = Array.from({ length: teamCount }, () => ({
      played: 0, won: 0, lost: 0, gamesWon: 0, gamesLost: 0, winPct: 0,
    }));
    schedule.forEach((game, gi) => {
      const res = results[gi];
      if (!res || (typeof res === 'object' && res.status === GAME_STATUS.AGENDADO)) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      const h = out[game.home];
      const a = out[game.away];
      const sets = this.setsOf(res);
      if (!h || !a || !sets.length) return;
      const games = this.gamesOf(sets, format);
      h.played++;
      a.played++;
      h.gamesWon += games.home;
      h.gamesLost += games.away;
      a.gamesWon += games.away;
      a.gamesLost += games.home;
      const winner = this.matchWinner(sets, format);
      if (winner === 'home') { h.won++; a.lost++; }
      if (winner === 'away') { a.won++; h.lost++; }
    });
    out.forEach((p) => {
      const decided = p.won + p.lost;
      p.winPct = decided ? Math.round((p.won / decided) * 100) : 0;
    });
    return out;
  }

  // -------------------------------------------------------------------------
  // Live events
  // -------------------------------------------------------------------------

  /** Kick-off, each game won (`set` when it also wins the set), cancelled game, full time. */
  resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined,
    config?: Config
  ): GameEvent[] {
    const format = this.format(config);
    const events: GameEvent[] = [];
    const a = prev || {};
    Object.keys(next || {}).forEach((gi) => {
      const ra = a[gi];
      const rb = next![gi];
      if (!rb) return;
      const sa = this.statusOf(ra);
      const sb = this.statusOf(rb);
      if (sb === GAME_STATUS.TERMINADO && sa !== GAME_STATUS.TERMINADO) {
        events.push({ type: 'fim', gi });
        return;
      }
      const setsA = this.setsOf(ra);
      const setsB = this.setsOf(rb);
      const totalA = this.rawGames(setsA);
      const totalB = this.rawGames(setsB);
      let changed = false;
      (['home', 'away'] as const).forEach((side) => {
        if (totalB[side] === totalA[side]) return;
        changed = true;
        if (totalB[side] < totalA[side]) {
          events.push({ type: 'anulado', gi, side });
          return;
        }
        const last = setsB.length - 1;
        const wonSet = !this.pointsPerMatch(config) && this.setWinner(setsB[last], last, format) === side;
        events.push({ type: wonSet ? 'set' : 'game', gi, side });
      });
      if (!changed && sb === GAME_STATUS.DECORRER && sa !== GAME_STATUS.DECORRER) {
        events.push({ type: 'inicio', gi });
      }
    });
    return events;
  }

  private rawGames(sets: SetScore[]): SetScore {
    return sets.reduce((t, s) => ({ home: t.home + s.home, away: t.away + s.away }), { home: 0, away: 0 });
  }

  private statusOf(res: MatchResult | undefined): string | null {
    if (!res) return null;
    if (typeof res !== 'object') return GAME_STATUS.TERMINADO;
    return res.status || GAME_STATUS.AGENDADO;
  }

  // -------------------------------------------------------------------------
  // Tables
  // -------------------------------------------------------------------------

  /** Games won first; in a match played to points, points won (PW, PL, PD). */
  standingsColumns(config?: Config | null): StandingsColumn[] {
    const diff = (d: number) => (d > 0 ? '+' : '') + d;
    if (!this.pointsPerMatch(config)) {
      const c = en.standings.racketCols;
      return [
        { label: c.pts, value: (s) => s.Pts, className: 'pts-cell' },
        { label: c.p, value: (s) => s.J },
        { label: c.w, value: (s) => s.V },
        { label: c.l, value: (s) => s.D },
        { label: c.sd, value: (s) => diff(setDiff(s)) },
        { label: c.gd, value: (s) => diff(s.DG ?? s.GM - s.GS) },
      ];
    }
    const c = en.standings.pointsCols;
    return [
      { label: c.gw, value: (s) => s.GM, className: 'pts-cell' },
      { label: c.p, value: (s) => s.J },
      { label: c.w, value: (s) => s.V },
      { label: c.l, value: (s) => s.D },
      { label: c.gl, value: (s) => s.GS },
      { label: c.gd, value: (s) => { const d = s.DG ?? s.GM - s.GS; return (d > 0 ? '+' : '') + d; } },
    ];
  }

  readonly usesJerseyNumbers: boolean = false;

  /** Racket sports record no per-player events (goals, assists). */
  playerStatColumns(): PlayerStatColumn[] {
    return [];
  }

  tallyPlayerStats(): Record<string, PlayerStats> {
    return {};
  }
}

/** Sets won minus sets lost of a standings row. */
function setDiff(r: StandingsRow): number {
  return (r.SW ?? 0) - (r.SL ?? 0);
}
````

## File: src/sports/Sport.ts
````typescript
import { GAME_STATUS } from '../types.js';
import { en } from '../i18n/en.js';
import type {
  Config,
  GameEvent,
  GameStatus,
  GroupStandings,
  Match,
  MatchResult,
  PlayerStats,
  Score,
  SingleMatch,
  SquadPlayer,
  StandingsRow,
  Team,
} from '../types.js';

/** One numeric column of the standings table (after position and team). */
export interface StandingsColumn {
  label: string;
  value: (row: StandingsRow) => string | number;
  /** Extra class on the cell (e.g. the highlighted points column). */
  className?: string;
}

/** One player leaderboard of the stats tab (top scorers, assists…). */
export interface PlayerStatColumn {
  key: keyof PlayerStats;
  title: string;
  /** Text after the count, e.g. "goals". */
  unit: string;
  /** Shown when nobody has any yet. */
  empty: string;
}

/** Matches a player played and won (finished matches only). */
export interface PlayerRecord {
  played: number;
  won: number;
}

/** One extra column of the all-time table in History (goals, assists… in football). */
export interface AllTimeColumn {
  key: keyof PlayerStats;
  /** Short header (an icon), with `title` as its tooltip. */
  label: string;
  title: string;
}

/** One card of the player profile. */
export interface ProfileStat {
  label: string;
  value: string | number;
  /** Small text after the value, e.g. "goals". */
  unit?: string;
  /** Takes the full width of the two-column grid. */
  wide?: boolean;
}

/** A player with goals, for the football leaderboard. */
export interface ScorerCount {
  name: string;
  team: string;
  count: number;
}

/** One line of the dashboard leaderboard. */
export interface LeaderRow {
  name: string;
  /** Small text after the name (team, matches…). */
  detail?: string;
  value: string;
}

/** The dashboard leaderboard: top scorers in football, most wins elsewhere. */
export interface Leaderboard {
  title: string;
  rows: LeaderRow[];
  empty: string;
}

// ---------------------------------------------------------------------------
// Abstract Sport Base Class
// ---------------------------------------------------------------------------

export abstract class Sport {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly icon: string;

  /** Columns of the standings table, in order (some sports change them with the tournament's config). */
  abstract standingsColumns(config?: Config | null): StandingsColumn[];

  /** Player rating attributes (key → label), each rated 0-5 in the player editor. */
  abstract ratingAttributes(): Record<string, string>;

  /** Whether squad players get a jersey number. */
  readonly usesJerseyNumbers: boolean = true;

  /** Player leaderboards shown in the stats tab, in order. */
  abstract playerStatColumns(): PlayerStatColumn[];

  /**
   * Computes group and overall standings for the tournament league stage.
   */
  abstract computeStandings(
    teams: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[];

  /**
   * Resolves head-to-head tiebreak among tied teams.
   */
  abstract resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[];

  /**
   * Determines the winner index of a finished playoff match, accounting for extra-time/penalties if applicable.
   * Returns null if match is not finished or has no winner.
   */
  abstract getPlayoffWinner(
    game: Match,
    res: MatchResult | undefined,
    config?: Config
  ): number | string | null;

  /**
   * Tallies individual player statistics (goals, assists, MVPs, games scored, etc.) across tournament and single matches.
   */
  abstract tallyPlayerStats(
    results: Record<string | number, MatchResult>,
    singleMatches?: SingleMatch[]
  ): Record<string, PlayerStats>;

  /**
   * Merges multiple PlayerStats maps into a combined map.
   */
  mergePlayerStats(
    ...tallies: Array<Record<string, PlayerStats> | undefined | null>
  ): Record<string, PlayerStats> {
    const out: Record<string, PlayerStats> = Object.create(null);
    tallies.forEach((tally) => {
      Object.keys(tally || {}).forEach((pid) => {
        const t = tally![pid];
        if (!out[pid]) out[pid] = { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
        const o = out[pid];
        o.golos += t.golos || 0;
        o.assistencias += t.assistencias || 0;
        o.mvp += t.mvp || 0;
        o.jogosAMarcar += t.jogosAMarcar || 0;
        o.recorde = Math.max(o.recorde, t.recorde || 0);
      });
    });
    return out;
  }

  /**
   * Detects score and status changes between two states to generate animation events.
   */
  abstract resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined,
    config?: Config
  ): GameEvent[];

  /**
   * Adds one point for a side (a goal in football, a game in padel), starting
   * the match if it was scheduled. Scorer and assist are used where the sport
   * records them.
   */
  abstract addPoint(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    config: Config,
    pid?: string,
    aid?: string
  ): Score;

  /**
   * Removes the last point of a side (a cancelled goal or game).
   */
  abstract removePoint(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    config: Config
  ): Score;

  /**
   * Points per side in a score string (goals in football, games in padel),
   * or null when the score is not a valid result.
   */
  scoreTotals(score: string | undefined): { home: number; away: number } | null {
    const m = /^(\d+)-(\d+)$/.exec((score || '').trim());
    return m ? { home: +m[1], away: +m[2] } : null;
  }

  /**
   * The score shown for a match in the schedule and results lists (goals in
   * football), or null when it has none yet.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shownScore(res: MatchResult | undefined, config?: Config | null): { home: number; away: number } | null {
    return this.scoreTotals(res && typeof res === 'object' ? res.score : res);
  }

  /** Is the match finished? A legacy result saved as plain text counts as finished. */
  isFinished(res: MatchResult | undefined): boolean {
    if (!res) return false;
    return typeof res === 'string' ? !!res.trim() : res.status === GAME_STATUS.TERMINADO;
  }

  /** Side that won a finished match, or null (not finished yet, or a draw). */
  winnerSide(res: MatchResult | undefined, config?: Config | null): 'home' | 'away' | null {
    if (!this.isFinished(res)) return null;
    const score = this.shownScore(res, config);
    if (!score || score.home === score.away) return null;
    return score.home > score.away ? 'home' : 'away';
  }

  /**
   * Matches played and won per player id, the same for every sport: a side's
   * players are its squad (and, in Americano, the partner's), and single
   * matches count with their two teams.
   */
  playerRecords(
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    squads: SquadPlayer[][] | null | undefined,
    singleMatches: SingleMatch[] = [],
    config?: Config | null
  ): Record<string, PlayerRecord> {
    const out: Record<string, PlayerRecord> = Object.create(null);
    const count = (ids: string[], won: boolean) => {
      new Set(ids.filter(Boolean)).forEach((id) => {
        const r = out[id] || (out[id] = { played: 0, won: 0 });
        r.played++;
        if (won) r.won++;
      });
    };
    const squadIds = (idx: unknown) => (typeof idx === 'number' ? (squads?.[idx] || []).map((p) => p?.id) : []);

    (schedule || []).forEach((game, gi) => {
      const res = results?.[gi];
      if (!this.isFinished(res)) return;
      const winner = this.winnerSide(res, config);
      (['home', 'away'] as const).forEach((side) => {
        count([...squadIds(game[side]), ...squadIds(game.partners?.[side])], winner === side);
      });
    });

    (singleMatches || []).forEach((m) => {
      const score = this.scoreTotals(m.resultado ?? undefined);
      if (!score) return;
      count(m.equipaA || [], score.home > score.away);
      count(m.equipaB || [], score.away > score.home);
    });
    return out;
  }

  /** Extra columns of the all-time table, after matches and wins. None by default. */
  allTimeColumns(): AllTimeColumn[] {
    return [];
  }

  /**
   * The dashboard leaderboard: by default the sides (teams, pairs or, in
   * Americano, players) with the most wins, then the most points.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  leaderboard(standings: StandingsRow[], scorers: ScorerCount[]): Leaderboard {
    const rows = standings
      .filter((s) => s.V > 0)
      .sort((a, b) => (b.V - a.V) || (b.Pts - a.Pts) || (a.J - b.J))
      .map((s) => ({ name: s.name, detail: en.dashboard.matchesLabel(s.J), value: en.dashboard.winsLabel(s.V) }));
    return { title: en.dashboard.mostWins, rows, empty: en.dashboard.noWinsYet };
  }

  /**
   * The sport's own cards in the player profile, after matches and wins
   * (goals, assists… in football). None by default.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  profileStats(totals: PlayerStats): ProfileStat[] {
    return [];
  }

  /**
   * Updates the game status (scheduled, in progress, finished).
   */
  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out: Score = res && typeof res === 'object'
      ? JSON.parse(JSON.stringify(res))
      : { score: typeof res === 'string' ? res : '' };
    out.status = status;
    return out;
  }

  /**
   * Maps each team to its position in standings: teamIdx -> { g: groupIndex, r: rank }.
   */
  standingsOrder(groupsData: GroupStandings[]): Map<string, { g: number; r: number }> {
    const order = new Map<string, { g: number; r: number }>();
    (groupsData || []).forEach((group, g) => {
      group.standings.forEach((row, r) => order.set(String(row.idx), { g, r }));
    });
    return order;
  }

  /**
   * Calculates rank positions gained/lost by each team between two standings snapshots.
   */
  rankMoves(
    before: Map<string, { g: number; r: number }> | null | undefined,
    after: Map<string, { g: number; r: number }> | null | undefined
  ): Map<string, number> {
    const moves = new Map<string, number>();
    if (!before || !after) return moves;
    after.forEach((now, team) => {
      const old = before.get(team);
      if (old && old.g === now.g && old.r !== now.r) moves.set(team, old.r - now.r);
    });
    return moves;
  }
}
````

## File: src/state.ts
````typescript
// ---------------------------------------------------------------------------
// Global Application State & Persistence
// ---------------------------------------------------------------------------

import type { TemplateResult } from 'lit';
import { generateSchedule } from './algorithms.js';
import { americanoRounds, mexicanoRound, rotationSchedule, type RotationFormat } from './core/americano.js';
import { pushStateToFirebase, getSyncedSnapshot, getCurrentRole, resyncFromServer } from './firebase.js';
import {
  normalizeResults,
  normalizeArquivo,
  normalizeConfig,
  normalizeMeta,
  normalizePlayer,
  normalizePlayers,
  defaultPlayerAttrs,
} from './sync.js';
import type {
  TournamentSnapshot,
  TournamentMeta,
  Config,
  Team,
  SquadPlayer,
  Match,
  RoundMeta,
  Score,
  Player,
  SingleMatch,
  ArchiveEntry,
} from './types.js';
import { en } from './i18n/en.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
// 10: config.setFormat (padel) and per-sport rating attribute keys
// 11: padel Americano / Mexicano (config.padelFormat, config.matchPoints, schedule[].partners)
// 12: archived players' played / won, config.winPoints (padel and tennis)
export const SNAPSHOT_VERSION = 12;
export const MAX_TEAMS = 32;
const DEFAULT_COLOR = '#2F7A4F';

// ---------------------------------------------------------------------------
// UI Notifications and Rendering Hooks
// Registered by main.js at startup via setStateHooks, so state.ts does not import ui.js.
// ---------------------------------------------------------------------------
export interface StateHooks {
  flashError?: () => void;
  flashSaved?: () => void;
  flashBackup?: (exportedAt?: string) => void;
  showToast?: (msg: string, type?: 'ok' | 'error') => void;
  openConfirm?: (title: string, message: string | TemplateResult, onConfirm: () => void | Promise<void>) => void;
  renderAll?: () => void;
}

const ui: Required<StateHooks> = {
  flashError() {},
  flashSaved() {},
  flashBackup() {},
  showToast() {},
  openConfirm() {},
  renderAll() {},
};

export function setStateHooks(hooks: StateHooks): void {
  Object.assign(ui, hooks);
}

// ---------------------------------------------------------------------------
// Theme (dark mode)
// ---------------------------------------------------------------------------
export let currentTheme: string =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('torneio_theme') || 'light'
    : 'light';

export function setCurrentTheme(t: string): void {
  currentTheme = t;
}

// ---------------------------------------------------------------------------
// Default Data Structures
// ---------------------------------------------------------------------------
export function defaultConfig(): Config {
  return normalizeConfig();
}

export function defaultMeta(sport?: string, name?: string): TournamentMeta {
  return normalizeMeta({}, { sport, nome: name });
}

export function ensureTeamsStructure(arr?: unknown[]): Team[] {
  const out: Team[] = (arr || []).slice(0, MAX_TEAMS).map((t, i) => {
    if (typeof t === 'object' && t !== null && 'name' in t) {
      const obj: Team = {
        name: String((t as { name: unknown }).name),
        color: String((t as { color?: unknown }).color || DEFAULT_COLOR),
      };
      if ('group' in t && typeof (t as { group?: unknown }).group === 'number') {
        obj.group = (t as { group: number }).group;
      }
      return obj;
    }
    return {
      name: typeof t === 'string' ? t : `Team ${i + 1}`,
      color: DEFAULT_COLOR,
    };
  });

  while (out.length < MAX_TEAMS) {
    out.push({ name: '', color: DEFAULT_COLOR });
  }

  return out;
}

export function defaultTeams(): Team[] {
  return ensureTeamsStructure([]);
}

export function defaultSquads(): SquadPlayer[][] {
  const arr: SquadPlayer[][] = [];
  for (let i = 0; i < MAX_TEAMS; i++) arr.push([]);
  return arr;
}

export function ensureSquadsLength(arr?: unknown[]): SquadPlayer[][] {
  const out: SquadPlayer[][] = (arr || [])
    .map((s) => (Array.isArray(s) ? (s as SquadPlayer[]) : []))
    .slice(0, MAX_TEAMS);
  while (out.length < MAX_TEAMS) out.push([]);
  return out;
}

// ---------------------------------------------------------------------------
// Global Application State
// ---------------------------------------------------------------------------
export interface AppState {
  currentTournamentId: string;
  meta: TournamentMeta | null;
  config: Config | null;
  teams: Team[] | null;
  squads: SquadPlayer[][] | null;
  schedule: Match[];
  roundsMeta: RoundMeta[];
  scheduleTeamCount: number;
  scheduleVoltas: number;
  results: Record<string | number, Score | string>;
  players: Player[];
  jogosSingulares: SingleMatch[];
  arquivo: ArchiveEntry[];
}

export const state: AppState = {
  currentTournamentId: 'default',
  meta: null,
  config: null,
  teams: null,
  squads: null,
  schedule: [],
  roundsMeta: [],
  scheduleTeamCount: 0,
  scheduleVoltas: 0,
  results: {},
  players: [],
  jogosSingulares: [],
  arquivo: [],
};

/** The tournament settings. They load before any handler runs, so a missing one is a bug. */
export function loadedConfig(): Config {
  if (!state.config) throw new Error('Tournament config not loaded');
  return state.config;
}

export function loadedTeams(): Team[] {
  if (!state.teams) throw new Error('Teams not loaded');
  return state.teams;
}

export function loadedSquads(): SquadPlayer[][] {
  if (!state.squads) throw new Error('Squads not loaded');
  return state.squads;
}

export function setCurrentTournamentId(id: string): void {
  state.currentTournamentId = id || 'default';
}

export function getCurrentTournamentId(): string {
  return state.currentTournamentId || 'default';
}

// ---------------------------------------------------------------------------
// Persistence Layer (localStorage with in-memory fallback)
// ---------------------------------------------------------------------------
const memoryFallback: Record<string, string> = {};
let storageWarned = false;
const noStorage = typeof window === 'undefined' || typeof window.localStorage === 'undefined';
const STORAGE_PREFIX = 'torneio_ilog_';

export function warnNoStorage(): void {
  if (storageWarned) return;
  storageWarned = true;
  ui.showToast(en.toasts.browserStorageBlocked, 'error');
}

/** Async to facilitate future migration to IndexedDB without breaking caller APIs. */
export async function storageGet(key: string): Promise<{ value: string } | null> {
  if (noStorage) {
    warnNoStorage();
    return key in memoryFallback ? { value: memoryFallback[key] } : null;
  }
  try {
    const result = window.localStorage.getItem(STORAGE_PREFIX + key);
    return result !== null ? { value: result } : null;
  } catch {
    return null;
  }
}

/** Async to facilitate future migration to IndexedDB without breaking caller APIs. */
export async function storageSet(key: string, value: string): Promise<{ value: string } | null> {
  if (noStorage) {
    warnNoStorage();
    memoryFallback[key] = value;
    return { value };
  }
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, value);
    return { value };
  } catch {
    ui.flashError();
    return null;
  }
}

// ---------------------------------------------------------------------------
// Player Normalization Helpers
// ---------------------------------------------------------------------------
export { defaultPlayerAttrs, normalizePlayer, normalizePlayers };

// ---------------------------------------------------------------------------
// Snapshot — Serialization & Deserialization
// ---------------------------------------------------------------------------
export function buildSnapshot(): TournamentSnapshot {
  const config = JSON.parse(JSON.stringify(state.config || defaultConfig()));
  return {
    version: SNAPSHOT_VERSION,
    exportedAt: new Date().toISOString(),
    meta: JSON.parse(JSON.stringify(state.meta || defaultMeta(config.sport, config.nome))),
    config,
    teams: JSON.parse(JSON.stringify(state.teams || defaultTeams())),
    squads: JSON.parse(JSON.stringify(state.squads || defaultSquads())),
    schedule: state.schedule.slice(),
    roundsMeta: state.roundsMeta.slice(),
    scheduleTeamCount: state.scheduleTeamCount,
    scheduleVoltas: state.scheduleVoltas,
    results: JSON.parse(JSON.stringify(state.results)),
    players: JSON.parse(JSON.stringify(state.players)),
    jogosSingulares: JSON.parse(JSON.stringify(state.jogosSingulares)),
    arquivo: JSON.parse(JSON.stringify(state.arquivo)),
  };
}

export function validateSnapshot(s: unknown): s is TournamentSnapshot {
  if (!s || typeof s !== 'object') return false;
  const snap = s as Record<string, unknown>;
  if (!snap.config || !Array.isArray(snap.teams) || !Array.isArray(snap.schedule)) return false;
  if (!snap.results || typeof snap.results !== 'object') return false;
  return true;
}

export function applySnapshot(s: Partial<TournamentSnapshot>): void {
  state.config = normalizeConfig(s.config);
  state.meta = normalizeMeta(s.meta, state.config);
  state.teams = ensureTeamsStructure(s.teams);
  state.squads = ensureSquadsLength(s.squads);
  state.schedule = (s.schedule as Match[]) || [];
  state.roundsMeta = (s.roundsMeta as RoundMeta[]) || [];
  state.scheduleTeamCount = s.scheduleTeamCount || state.config.numEquipas;
  state.scheduleVoltas = s.scheduleVoltas || state.config.numVoltas;
  state.results = normalizeResults(s.results);
  state.players = normalizePlayers(s.players);
  state.jogosSingulares = (s.jogosSingulares as SingleMatch[]) || [];
  if (s.arquivo) {
    state.arquivo = normalizeArquivo(s.arquivo);
  }
}

// ---------------------------------------------------------------------------
// Layer Persistence (config, schedule, results, backup)
// ---------------------------------------------------------------------------
export async function persistBackup(): Promise<void> {
  const snap = buildSnapshot();
  await storageSet('backup', JSON.stringify(snap));
  ui.flashBackup(snap.exportedAt);
  const res = pushStateToFirebase(snap);
  if (!res.ok) await rejectLocalChange(res.reason);
}

const REJECT_MESSAGES: Record<string, string> = {
  'sem-sync': en.toasts.dbStillConnecting,
  'sem-sessao': en.toasts.dbSignInRequired,
};

let lastErrorToast = { msg: '', at: 0 };

/** Displays a save error without repeating the toast if triggered in rapid succession. */
function showSaveError(msg: string): void {
  const now = Date.now();
  if (msg === lastErrorToast.msg && now - lastErrorToast.at < 2000) return;
  lastErrorToast = { msg, at: now };
  ui.showToast(msg, 'error');
}

/** Firebase rejected a push that was already applied locally (server value will revert). */
export function notifyPushError(err?: { code?: string; message?: string } | Error): void {
  const codeOrMsg = String((err && ('code' in err ? err.code : err.message)) || '');
  const denied = /permission/i.test(codeOrMsg);
  showSaveError(
    denied
      ? en.toasts.dbRejectedPermission
      : en.toasts.dbSaveFailed,
  );
}

/** Undoes a local change that could not be saved to Firebase. */
async function rejectLocalChange(reason?: string): Promise<void> {
  let msg = reason ? REJECT_MESSAGES[reason] : undefined;
  if (!msg) {
    msg =
      getCurrentRole() === 'user'
        ? en.toasts.onlyAdminCanChange
        : en.toasts.accountNotApproved;
  }
  showSaveError(msg);

  const synced = getSyncedSnapshot();
  // Not synced yet (the first read has not arrived): read the server instead,
  // so the refused change does not stay in the local cache
  if (!validateSnapshot(synced)) {
    await resyncFromServer();
    return;
  }
  applySnapshot(synced);
  await storeAllLayers();
  ui.renderAll();
}

export async function persistConfigTeams(): Promise<void> {
  await storageSet(
    'config-teams',
    JSON.stringify({
      meta: state.meta,
      config: state.config,
      teams: state.teams,
      squads: state.squads,
    }),
  );
  ui.flashSaved();
  await persistBackup();
}

export async function persistSchedule(): Promise<void> {
  await storageSet(
    'schedule',
    JSON.stringify({
      schedule: state.schedule,
      roundsMeta: state.roundsMeta,
      scheduleTeamCount: state.scheduleTeamCount,
      scheduleVoltas: state.scheduleVoltas,
    }),
  );
  ui.flashSaved();
  await persistBackup();
}

export async function persistResults(): Promise<void> {
  await storageSet('results', JSON.stringify(state.results));
  ui.flashSaved();
  await persistBackup();
}

export async function persistPlayers(): Promise<void> {
  await storageSet('players', JSON.stringify(state.players));
  ui.flashSaved();
  await persistBackup();
}

export async function persistJogosSingulares(): Promise<void> {
  await storageSet('jogos-singulares', JSON.stringify(state.jogosSingulares));
  ui.flashSaved();
  await persistBackup();
}

export async function persistArquivo(): Promise<void> {
  await storageSet('arquivo', JSON.stringify(state.arquivo));
  ui.flashSaved();
  await persistBackup();
}

/** Stores all layers to localStorage (after restore, import, or receiving Firebase data). */
export async function storeAllLayers(): Promise<void> {
  await storageSet(
    'config-teams',
    JSON.stringify({ meta: state.meta, config: state.config, teams: state.teams, squads: state.squads }),
  );
  await storageSet(
    'schedule',
    JSON.stringify({
      schedule: state.schedule,
      roundsMeta: state.roundsMeta,
      scheduleTeamCount: state.scheduleTeamCount,
      scheduleVoltas: state.scheduleVoltas,
    }),
  );
  await storageSet('results', JSON.stringify(state.results));
  await storageSet('players', JSON.stringify(state.players));
  await storageSet('jogos-singulares', JSON.stringify(state.jogosSingulares));
  await storageSet('arquivo', JSON.stringify(state.arquivo));
}

// ---------------------------------------------------------------------------
// Schedule Generation and Group Assignment
// ---------------------------------------------------------------------------
export function applyGeneratedSchedule(
  numEquipas: number,
  numVoltas: number,
  randomizeGroups: boolean,
): void {
  const nGrupos = state.config?.numGrupos || 1;
  let indices: number[] = [];
  for (let i = 0; i < numEquipas; i++) indices.push(i);

  if (randomizeGroups) {
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  } else {
    const byGroup: Record<number, number[]> = {};
    for (let i = 0; i < numEquipas; i++) {
      let g = state.teams?.[i]?.group || 0;
      if (g >= nGrupos) g = nGrupos - 1;
      if (!byGroup[g]) byGroup[g] = [];
      byGroup[g].push(i);
    }
    indices = [];
    for (let g = 0; g < nGrupos; g++) {
      if (byGroup[g]) indices = indices.concat(byGroup[g]);
    }
  }

  const teamsPerGroup = Math.ceil(numEquipas / nGrupos);
  const groupsIndices: number[][] = [];

  for (let g = 0; g < nGrupos; g++) {
    const chunk = indices.slice(g * teamsPerGroup, (g + 1) * teamsPerGroup);
    groupsIndices.push(chunk);
    chunk.forEach((idx) => {
      if (state.teams && state.teams[idx]) state.teams[idx].group = g;
    });
  }

  const out = generateSchedule(groupsIndices, numVoltas);
  state.schedule = out.schedule;
  state.roundsMeta = out.roundsMeta;
  state.scheduleTeamCount = numEquipas;
  state.scheduleVoltas = numVoltas;
}

/**
 * Americano / Mexicano schedule: each team slot is one player. Americano plays
 * every partner rotation `numVoltas` times; Mexicano draws only the first round,
 * from `ranking` (player slots, best first), and the next ones from the standings.
 */
export function applyRotationSchedule(
  format: RotationFormat,
  numPlayers: number,
  numVoltas: number,
  ranking: number[],
): void {
  const cycle = americanoRounds(numPlayers);
  const rounds = format === 'americano'
    ? Array.from({ length: numVoltas }, () => cycle).flat()
    : [mexicanoRound(ranking)];
  const out = rotationSchedule(rounds);
  for (let i = 0; i < numPlayers; i++) {
    if (state.teams?.[i]) state.teams[i].group = 0;
  }
  state.schedule = out.games;
  state.roundsMeta = out.rounds;
  state.scheduleTeamCount = numPlayers;
  state.scheduleVoltas = format === 'americano' ? numVoltas : 1;
}

// ---------------------------------------------------------------------------
// State Loading from localStorage
// ---------------------------------------------------------------------------
export async function loadState(): Promise<void> {
  let ct: { config?: Partial<Config>; teams?: Team[]; squads?: SquadPlayer[][] } | null;
  let sc: {
    schedule?: Match[];
    roundsMeta?: RoundMeta[];
    scheduleTeamCount?: number;
    scheduleVoltas?: number;
  } | null;
  let rs: Record<string | number, unknown> | null;
  let bk: TournamentSnapshot | null;
  let pl: unknown[] | null;
  let js: SingleMatch[] | null;
  let ar: unknown | null;

  try { const r = await storageGet('config-teams'); ct = r ? JSON.parse(r.value) : null; } catch { ct = null; }
  try { const r = await storageGet('schedule'); sc = r ? JSON.parse(r.value) : null; } catch { sc = null; }
  try { const r = await storageGet('results'); rs = r ? JSON.parse(r.value) : null; } catch { rs = null; }
  try { const r = await storageGet('backup'); bk = r ? JSON.parse(r.value) : null; } catch { bk = null; }
  try { const r = await storageGet('players'); pl = r ? JSON.parse(r.value) : null; } catch { pl = null; }
  try { const r = await storageGet('jogos-singulares'); js = r ? JSON.parse(r.value) : null; } catch { js = null; }
  try { const r = await storageGet('arquivo'); ar = r ? JSON.parse(r.value) : null; } catch { ar = null; }

  if (ct && ct.config && ct.teams) {
    state.config = normalizeConfig(ct.config);
    state.meta = normalizeMeta((ct as { meta?: unknown }).meta, state.config);
    state.teams = ensureTeamsStructure(ct.teams);
    state.squads = ensureSquadsLength(ct.squads);

    // A cleared schedule is saved as an empty array and should not be regenerated.
    if (sc && Array.isArray(sc.schedule)) {
      state.schedule = sc.schedule;
      state.roundsMeta = sc.roundsMeta || [];
      state.scheduleTeamCount = sc.scheduleTeamCount || state.config.numEquipas;
      state.scheduleVoltas = sc.scheduleVoltas || state.config.numVoltas;
    } else {
      applyGeneratedSchedule(state.config.numEquipas, state.config.numVoltas, false);
    }

    state.results = normalizeResults(rs);
    state.players = normalizePlayers(pl);
    state.jogosSingulares = js || [];
    state.arquivo = normalizeArquivo(ar);
  } else if (validateSnapshot(bk)) {
    applySnapshot(bk);
    await storeAllLayers();
    ui.showToast(en.toasts.backupRestored, 'ok');
    ui.flashBackup(bk.exportedAt);
  } else {
    state.config = defaultConfig();
    state.meta = defaultMeta(state.config.sport, state.config.nome);
    state.teams = defaultTeams();
    state.squads = defaultSquads();
    state.players = [];
    state.jogosSingulares = [];
    state.arquivo = [];
    applyGeneratedSchedule(state.config.numEquipas, state.config.numVoltas, false);
  }

  if (bk && bk.exportedAt) ui.flashBackup(bk.exportedAt);
}

// ---------------------------------------------------------------------------
// JSON Export / Import
// ---------------------------------------------------------------------------
export function exportJSON(): void {
  const snap = buildSnapshot();
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const safeName = (state.config?.nome || 'tournament').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  ui.showToast(en.toasts.tournamentExported, 'ok');
}

export function importJSON(file: File | null): void {
  if (!file) return;
  const reader = new FileReader();

  reader.onload = (e) => {
    let snap: unknown;
    try {
      snap = JSON.parse(e.target?.result as string);
    } catch {
      ui.showToast(en.toasts.invalidFile, 'error');
      return;
    }

    if (!validateSnapshot(snap)) {
      ui.showToast(en.toasts.invalidStructure, 'error');
      return;
    }

    ui.openConfirm(en.confirmations.importTournamentTitle, en.confirmations.importTournamentPrompt, async () => {
      applySnapshot(snap);
      await storeAllLayers();
      await persistBackup();
      ui.renderAll();
      ui.showToast(en.toasts.tournamentImported, 'ok');
    });
  };

  reader.readAsText(file);
}
````

## File: docs/guide.md
````markdown
# User Guide

[← Back to the README](../README.md)

This guide explains how to use the app day to day: who can do what, how to create a tournament and take it from zero to a champion, and how to use single matches. Points, tiebreaks and balanced teams are explained in [Rules and Calculations](rules.md).

- [Accounts and roles](#accounts-and-roles)
- [App map](#app-map)
- [Tournaments](#tournaments)
- [Setting up a tournament](#setting-up-a-tournament)
- [During the matches](#during-the-matches)
- [Playoffs](#playoffs)
- [Finishing and archiving](#finishing-and-archiving)
- [Single Match](#single-match)
- [Stats, player profile and sharing](#stats-player-profile-and-sharing)
- [Data: export, import and delete](#data-export-import-and-delete)

## Accounts and roles

![Roles and permissions](assets/illustrations/08-perfis-e-permissoes.jpg)

Anyone with the link can view the tournaments, without an account. To change anything you need to tap **🔑 Sign In**, sign in with Google, and have a role given to you by the Master Admin.

| Role | Can |
|---|---|
| **Pending** (just signed in) | Only view. Waits for the Master Admin to give them a role. |
| **User** | Record single matches. Results, scorers, MVP and match status are recorded by the admins of the tournament's sport. |
| **Admin** (per sport) | For tournaments of the sports they administer (⚽ Football, 🎾 Padel, 🎾 Tennis): everything else — create and finish tournaments, settings, schedule, playoffs, teams, squads, import, delete data and remove archived tournaments from History. Admins can also edit the players database. In tournaments of other sports they have no admin rights. |
| **Master Admin** | Everything, in every sport, plus managing users. |

The Master Admin assigns roles in **🛠️ Manage → 👮 Users**: pick *Pending*, *User*, *Admin* or *Master Admin* for each person and, for an Admin, tick the sports they administer. The same page has the **Activity Log**: the last 200 changes to the tournament being viewed, with who made them and when.

Buttons your role cannot use are hidden. Even if someone bypasses the app, Firebase rejects the write (see [Architecture](architecture.md#permissions)).

## App map

| Tab | What for |
|---|---|
| 🏠 Dashboard | List of active tournaments (to switch between them), plus a summary of the one being viewed: top 3 of the standings, the tournament numbers and a leaderboard (top scorers in football, most wins in padel and tennis). The 🔁 button at the top refreshes the numbers. |
| 🏆 Standings | Full table (per group, with the points right after the team) and the playoff bracket. |
| 📅 Schedule | Rounds, matches and byes, with each match's status and score; generate playoffs and add rounds. Tapping a match opens the match window. |
| ⚽ Results | Where matches are recorded live. Only shown to admins of the tournament's sport and the Master Admin; everyone else follows the scores in the Schedule. |
| 📊 Stats | Scorers, assists and MVPs of the current tournament and its single matches. |
| 🗄️ History | Archived tournaments and all-time stats. |
| ⚙️ Settings | Name, format and scoring (admins only). |
| 🛠️ Manage | 👥 Teams, 👕 Squads, 👤 Players, 💾 Data (admins) and 👮 Users (Master Admin). |
| ⚽ Single Match | One-off matches with balanced teams. |

The header shows the tournament name and its sport. The theme button switches between light and dark.

On a phone, the header is a single line pinned to the top: on the left the tournament name and the round, on the right 🔁 (refresh), the theme and the account (👤 when signed in; tapping it shows which account and role you are using before confirming the sign-out). At the bottom there is a floating navigation pill with 🏠 Home, ⚽ Results, 🏆 Standings, 📅 Schedule and ☰ More (the open tab shows its name; ⚽ Results only for admins); **More** opens a panel with the remaining tabs (Stats, History, Settings, Manage and Single Match). The "Saved ✓" notice only appears at the top right after a save or if there is an error.

## Tournaments

![Multiple tournaments and device memory](assets/illustrations/18-varios-torneios.jpg)

Several tournaments can run at the same time, each with its own sport, teams, schedule, results and single matches. The players database and the History are shared by all of them.

- **🏆 Active Tournaments** (on the 🏠 Dashboard) lists every tournament that has not been finished. Tap a card, or **👁️ View Tournament**, to follow it; the whole app then shows that tournament. Each device remembers the last tournament it viewed. Tap the card's title to fold it; each device remembers that too. Renaming the tournament in ⚙️ Settings renames it in this list.
- **➕ New Tournament** (Master Admin, or an Admin of at least one sport) asks for the **Tournament Name**, the **Sport** and the **Number of Teams (2–32)**, then **Create Tournament**. The sport cannot be changed later. An Admin can only pick the sports they administer. What each sport changes is in [Sports](sports.md).
- **🏁 Finish Tournament** appears on the card of the tournament being viewed (for its admins): see [Finishing and archiving](#finishing-and-archiving).

## Setting up a tournament

These steps are done by an **admin** of the tournament's sport (or the Master Admin). Anyone else sees Teams, Squads and Players read-only, without edit buttons.

1. **Players** (Manage → 👤 Players): create each player and give them 0 to 5 stars in six attributes. Each sport has its own (football: Pace, Shooting, Passing, Dribbling, Defending, Physical; padel: Volley, Smash, Lob, Wall play, Defense, Fitness; tennis: Serve, Return, Forehand, Backhand, Volley, Fitness), chosen in **Attribute Sport** in the player window; the average is the player's ★ rating for that sport. This database is shared by every tournament and by single matches.
2. **Tournament** (🏠 Dashboard → ➕ New Tournament): create it as described in [Tournaments](#tournaments).
3. **Settings** (⚙️): set the name, the number of teams (2 to 32), the number of groups (1, 2, 4 or 8), the number of rounds, and whether there are playoffs and how many teams qualify. The remaining cards on the Settings page adapt dynamically to the sport:
   - **⚽ Football — 📐 Scoring card:** points for Win (default 3), Draw (1), Loss (0), Bonus (+1), and Goals scored for bonus (3).
   - **🎾 Padel — 🔄 Pairs card:** Format (*Fixed pairs*, *Americano*, or *Mexicano*), Points per match (4–99, default 24), and the **👤 Choose players** button.
   - **🎾 Padel & Tennis — 🎾 Set format card:** Sets per match (*1 set*, *Best of 3*, *Best of 5*), Games per set (1 to 9, default 6), and the **Super tie-break in the deciding set** checkbox (checked by default in padel; unchecked by default in tennis).
4. **Teams** (Manage → 👥 Teams): give each team a name and a colour.
5. **Squads** (Manage → 👕 Squads): pick the team and add players from the database, with their jersey number. The squad's average ★ is shown at the top. In padel each team is a pair: add two players to each (no jersey number), or tap **🎲 Draw pairs**, tick two players per team, and the app pairs them by padel rating and names each team after its pair (see [Rules](rules.md#pairs)). In tennis a team is one player (singles) or two (doubles), added the same way. Picking a team when creating or editing a player in 👤 Players also adds them to that team's squad here (with the next jersey number) and takes them out of any other squad.
6. **🔄 Generate Schedule** (⚙️ Settings): creates all the rounds. With more than one group, the teams are drawn into the groups at this point.

Generating a new schedule deletes the results already entered (the app asks for confirmation). Teams, squads and settings are kept.

**Americano and Mexicano (padel):** in ⚙️ Settings → *Pairs*, pick the format and the points per match, set the number of teams to the number of players (a multiple of 4) and tap **👤 Choose players**. Then generate the schedule. In Mexicano only the first round is drawn; when it is finished, tap **➕ Next Mexicano Round** in the Schedule. See [Rules](rules.md#americano-and-mexicano).

**Extra round:** in a single-league tournament without playoffs, the **➕ Add Extra Round (Keep Results)** button in the Schedule adds one more round without losing results. The new round swaps who plays at home.

## During the matches

![During the matches](assets/illustrations/09-durante-os-jogos.jpg)

![Live goal](assets/illustrations/16-golo-ao-vivo.jpg)

In the **⚽ Results** tab, each match has:

- **Status**: tapping the button cycles through *Scheduled → In Progress → Finished*. Scheduled matches do not count towards the standings.
- **＋ / −** on each side: ＋ asks who scored (or *Own Goal*) and then who assisted (or *No assist*; own goals have none). − removes that team's last goal. Scoring the first goal sets the match to *In Progress*.
- **📋 Match**: opens the match window (see below).

You can also type the score straight into the boxes; in that case no scorers are attached.

Only admins of the tournament's sport (and the Master Admin) see the Results tab. In the Schedule everyone sees each match's status and score; only admins can tap the status to change it.

**Padel.** ＋ / − add or remove **one game** for that pair, with no scorer to pick. Each match is a small scoreboard with one line per pair: the games of every set (the set being played highlighted, lost sets faded), the sets won on the right, and ＋ / − for admins. The Schedule shows the same scoreboard, read-only. When a set ends the next one starts on its own, the game that decides the match (the sets needed in best of 3 or 5, or the games of a one-set match, or the points total in Americano and Mexicano) sets it to *Finished*, and cancelling that game sets it back to *In Progress*; in the deciding set the super tie-break points are entered the same way. The match window shows a grid with each set's games and the set being played highlighted, and the animations say *GAME* and *SET!* instead of *GOAL*. Scores cannot be typed in padel. **Tennis** works the same way; by default its deciding set is a normal set, not a super tie-break.

**Match window.** Opens with **📋 Match** in Results, or by tapping the match in the Schedule. It shows the score and, per team, each goal with the scorer and the assist. It updates by itself when someone records a goal on another phone. Once the match is finished, it has the **📤 Share image** button (the result image) and, when opened from Results, **⭐ Pick MVP**. From the Schedule the MVP is only shown, never picked.

**Live on every phone.** When a match kicks off, a goal is scored (background in the team colour, scorer and assist), a goal is cancelled or the match ends, a short animation appears on every device, and in the Standings the teams slide to their new place. If the standings changed while you were on another tab, when you open it you briefly see the order from the last time you looked and then the teams slide to their current position. Next to the position, a green (▲) or red (▼) arrow shows how many places each team gained or lost since then, and stays until the order changes again. With *reduced motion* turned on in the phone, the animations do not play.

The standings, dashboard and stats update by themselves on every device.

## Playoffs

With playoffs enabled in the settings, the **🏆 Generate Playoffs** button appears in the Schedule (for admins) once every league match is *Finished*. The app qualifies the top teams of each group from the current standings and builds the bracket (up to 16 teams: Round of 16, Quarter-Finals, Semi-Finals and Final). How teams are paired is in [Rules and Calculations](rules.md#playoffs).

A football playoff match that finishes level shows the **Penalties** boxes (a padel match always has a winner). The winner moves automatically to the next match of the bracket.

## Finishing and archiving

![Finishing and archiving](assets/illustrations/10-terminar-e-arquivar.jpg)

When the tournament is over, an admin taps **🏁 Finish Tournament** on its card in the 🏠 Dashboard, or **Manage → 💾 Data → 🏁 Finish and Archive Tournament**. The app:

1. Saves to **🗄️ History** the final standings, the champion (winner of the final, or the league leader when there is a single group and no playoffs), the number of matches and goals, and each player's stats.
2. Marks the tournament as finished, so it leaves the active tournaments list, and switches to another active tournament (if there is one).

If there are still unfinished matches, the app warns first: the saved champion will be whoever leads at that moment, or none if the final has not finished.

Finishing does not delete anything: the finished tournament's data stays in the database, and the players database and the other tournaments are untouched. To play again, create a new tournament.

## Single Match

For when there are not enough people for a tournament:

1. Name the two teams (optional).
2. Tick the players who are there.
3. Tap **⚽ Run Draft**: the app splits them into two teams with total ratings as close as possible (using the ratings for the sport of the tournament being viewed).
4. During the match, record goals with ＋ (scorer and assist) and pick the MVP.
5. Enter the score and tap **💾 Save Match**. The match goes into the *📅 History* sub-tab of Single Match.

Single matches are saved with the tournament being viewed. Their goals, assists and MVPs count towards the stats and each player's profile.

## Stats, player profile and sharing

![Goals, assists and MVP (football)](assets/illustrations/11-golos-assistencias-mvp.jpg)

*(The illustration above shows football's Stats tab with goals, assists and MVPs. Padel and tennis track games, and Americano/Mexicano track individual points.)*

- **📊 Stats**: what is displayed depends on the sport:
  - **⚽ Football:** leaderboards for Top Scorers, Top Assists, and MVPs for the current tournament and its single matches, plus stat cards (total goals, goals per match, highest score, most wins).
  - **🎾 Padel & Tennis:** stat cards highlighting games played, games per match, most games won, fewest games lost, biggest win (by game difference), and most match wins. There are no individual scorer tables because matches are tracked game by game without player goal events.
  - **🎾 Americano & Mexicano:** rankings and stats are strictly per individual player (points won, point difference, and matches won) rather than team pairs.
- **🗄️ History**: list of archived tournaments and an all-time table of the sport on screen, from its finished tournaments: matches and wins per player, plus goals, assists and MVPs in football.
- **Player profile**: tap a player's name to see their attributes and rating for the tournament's sport, the matches they played and won in that sport (finished matches only; a draw is played, not won), and the sport's own stats: in football, goals, assists, MVPs, scoring matches and the single match record.
- **Share**: the **📤** button next to the Standings title, and **📤 Share image** in the window of each finished match. The standings image uses the sport's columns (Pts in football, GW in padel); a padel result image shows the sets won with the games of each set. On a phone it opens the system share sheet (WhatsApp, etc.); on a computer it downloads the PNG image.

## Data: export, import and delete

All in **Manage → 💾 Data** (admins only), for the tournament being viewed:

- **⬇️ Export JSON**: downloads a full copy of the state. A good idea before big changes.
- **⬆️ Import JSON**: replaces the current state with an exported file. Affects every device.
- **🏁 Finish and Archive Tournament**: see [Finishing and archiving](#finishing-and-archiving).
- **🧹 Danger Zone**: deletes, as you choose, results, schedule, or teams and squads. The players database and the single matches history are protected and cannot be deleted here.

An archived tournament can be removed from History with **🗑️ Delete from history** (admins of its sport, or the Master Admin).
````

## File: src/types.ts
````typescript
// ---------------------------------------------------------------------------
// Domain Types for Torneio ILOG
// ---------------------------------------------------------------------------

export type Role = 'master' | 'admin' | 'user';

export interface UserProfile {
  uid: string;
  nome?: string;
  email?: string;
  foto?: string;
  ultimoAcesso?: number;
  role?: Role | null;
  admin?: Record<string, boolean>;
}

export type GameStatus = 'agendado' | 'decorrer' | 'terminado';

export const GAME_STATUS = Object.freeze({
  AGENDADO: 'agendado',
  DECORRER: 'decorrer',
  TERMINADO: 'terminado',
} as const);

export interface GameEvent {
  /** golo: a goal; game / set: a padel game, or a game that also won the set. */
  type: 'inicio' | 'golo' | 'anulado' | 'fim' | 'game' | 'set';
  gi: string;
  side?: 'home' | 'away';
  pid?: string;
  aid?: string;
}

export interface PlayerStats {
  golos: number;
  assistencias: number;
  mvp: number;
  jogosAMarcar: number;
  recorde: number;
}

export interface PlayerAttributes {
  velocidade: number;
  finalizacao: number;
  passe: number;
  drible: number;
  defesa: number;
  fisico: number;
  [key: string]: number;
}

/** One sport's ratings of a player: attribute key → 0-5 (keys from `Sport.ratingAttributes()`). */
export type RatingAttributes = Record<string, number>;

export interface Player {
  id: string;
  nome: string;
  teamIdx: number | null;
  ratings?: Record<string, RatingAttributes>;
  atributos?: PlayerAttributes;
}

export interface SquadPlayer {
  id: string;
  num: number | string;
  name: string;
}

export interface Team {
  name: string;
  color: string;
  group?: number;
}

export interface Config {
  nome: string;
  numEquipas: number;
  numGrupos: number;
  numVoltas: number;
  pontosVitoria: number;
  pontosEmpate: number;
  pontosDerrota: number;
  bonusGoleada: number;
  golosGoleada: number;
  mataMata: boolean;
  numPlayoffTeams: number;
  sport: string;
  /** Racket sports: how a match is played (see RacketSport). */
  setFormat?: SetFormat;
  /** Padel: fixed pairs (default), or partners that rotate every round. */
  padelFormat?: 'pairs' | 'americano' | 'mexicano';
  /** Americano / Mexicano: total points of each match (24 by default). */
  matchPoints?: number;
  /** Padel and tennis (fixed pairs): standings points per match won (0-10, 1 by default). */
  winPoints?: number;
  [key: string]: unknown;
}

/** Set format of a racket-sport tournament. */
export interface SetFormat {
  /** Best of this many sets (1, 3 or 5). */
  sets: number;
  /** Games needed to win a set (6 in padel). */
  gamesPerSet: number;
  /** The deciding set is a super tie-break to 10 points. */
  superTieBreak: boolean;
}

export interface Match {
  jornada: number | string;
  home: number | string;
  away: number | string;
  group?: number;
  isPlayoff?: boolean;
  playoffMatchId?: string | number;
  nextMatchId?: string | number | null;
  label?: string;
  /** Americano / Mexicano: the second player of each pair (home and away hold the first). */
  partners?: { home: number; away: number };
  [key: string]: unknown;
}

export interface GameScorers {
  home?: string[];
  away?: string[];
}

export interface GameAssists {
  home?: string[];
  away?: string[];
}

export interface Score {
  score?: string;
  status?: GameStatus;
  scorers?: GameScorers;
  assists?: GameAssists;
  mvp?: string;
  penalties?: string;
  [key: string]: unknown;
}

export type MatchResult = Score | string;

export interface RoundMeta {
  jornada: number | string;
  bye: string | number | null;
}

/** A friendly match outside the tournament (Single Match tab), as saved. */
export interface SingleMatch {
  id: string;
  data: string;
  nomeEquipaA: string;
  nomeEquipaB: string;
  /** Player ids of each team. */
  equipaA: string[];
  equipaB: string[];
  scorersA?: string[];
  scorersB?: string[];
  assistsA?: string[];
  assistsB?: string[];
  /** "goalsA-goalsB", or null when no score was typed. */
  resultado: string | null;
  mvp?: string;
}

export interface ArchiveTeam {
  nome: string;
  cor: string;
}

export interface ArchiveStandingRow extends ArchiveTeam {
  J: number;
  V: number;
  E: number;
  D: number;
  GM: number;
  GS: number;
  DG: number;
  Pts: number;
}

export interface ArchiveGroup {
  nome: string;
  tabela: ArchiveStandingRow[];
}

export interface ArchivePlayer {
  pid: string;
  nome: string;
  golos: number;
  assistencias: number;
  mvp: number;
  jogosAMarcar: number;
  recorde: number;
  /** Finished matches played and won (entries archived before v12 have none). */
  played?: number;
  won?: number;
}

export type TournamentStatus = 'active' | 'finished';

export interface TournamentMeta {
  id?: string;
  name: string;
  sport: string;
  status: TournamentStatus;
  createdAt: number;
}

export interface ArchiveEntry {
  id: string;
  nome: string;
  sport: string;
  data: string;
  campeao: ArchiveTeam | null;
  jogos: number;
  golos: number;
  grupos: ArchiveGroup[];
  jogadores: ArchivePlayer[];
}

export interface Tournament {
  version?: number;
  exportedAt?: string;
  logRef?: string;
  meta: TournamentMeta;
  config: Config;
  teams: Team[];
  squads: SquadPlayer[][];
  schedule: Match[];
  roundsMeta: RoundMeta[];
  scheduleTeamCount: number;
  scheduleVoltas: number;
  results: Record<string | number, Score | string>;
  players: Player[];
  jogosSingulares: SingleMatch[];
  arquivo?: ArchiveEntry[];
}

export type TournamentSnapshot = Tournament;

export type PlayerIndex = Record<string, { name: string; team: string }>;

export interface StandingsRow {
  idx: number;
  name: string;
  J: number;
  V: number;
  E: number;
  D: number;
  GM: number;
  GS: number;
  DG?: number;
  /** Padel and tennis: sets won and lost. */
  SW?: number;
  SL?: number;
  Pts: number;
}

export interface GroupStandings {
  name: string;
  standings: StandingsRow[];
}
````

## File: docs/architecture.md
````markdown
# Architecture

[← Back to the README](../README.md)

How the code is organised, how data is stored and synced, and how who-can-write-what is enforced. For code conventions and contribution rules, see also [`CLAUDE.md`](../CLAUDE.md).

- [Overview](#overview)
- [Modules](#modules)
- [Data model](#data-model)
- [Sync](#sync)
- [Permissions](#permissions)
- [Activity log](#activity-log)
- [Changing the state shape](#changing-the-state-shape)
- [HTML safety](#html-safety)
- [Tests](#tests)

## Overview

It is a single page app in TypeScript and JavaScript (ES Modules) with no framework, built with Vite and served statically by GitHub Pages. There is no server of its own: the Firebase Realtime Database stores the state and pushes changes to every connected device, and Firebase Authentication handles the Google accounts.

```
 browser (each phone)                           Firebase
┌───────────────────────────────┐            ┌──────────────────────────────────┐
│ main.ts  events ──► state.ts  │── update ─►│ tournaments/<id>  (tournaments)  │
│              ▲         │      │            │ players           (global)       │
│ ui.ts ◄──────┘   localStorage │◄─ onValue ─│ arquivo           (history)      │
└───────────────────────────────┘            │ users             (roles)        │
                                             │ tournament_log/<id> (log)        │
                                             └──────────────────────────────────┘
                                               protected by database.rules.json
```

## Modules

![Lit components in the light DOM](assets/illustrations/26-componentes-lit.jpg)

| File | Role |
|---|---|
| `index.html` | Structure of every tab and modal. |
| `css/` | Styles split by area (`base.css` holds the light and dark theme variables). `style.css` only `@import`s the others, in cascade order; Vite merges everything into one file in the build. New styles go into the file for their area. |
| `src/main.ts` | Wires UI events to actions (generate schedule, record goals, create, switch and finish tournaments, …) and starts the app. Lit components emit events (`open-match`, `score-commit`, …) that bubble to their container, where `main.ts` handles them through `onEvent<T>()` (typed detail); the single match tab wires its own events (`bindSingleMatchEvents`). Remembers the last tournament viewed on the device. |
| `src/state.ts` | Global state (including the current tournament id; `loadedConfig()`, `loadedTeams()` and `loadedSquads()` return the sections handlers rely on), default values, snapshots (`buildSnapshot` / `applySnapshot`), persistence in localStorage and pushes to Firebase. Undoes local changes Firebase would not accept. Does not import `ui.ts`: notices and `renderAll` come in through `setStateHooks`, called by `main.ts` at startup. |
| `src/core/` | Core tournament logic in TypeScript: Berger, schedule, extra round and first-round seeding (`schedule.ts`), the knockout bracket and winner advancement (`playoffs.ts`), Americano / Mexicano rounds and per-player standings (`americano.ts`), ratings and draft (`draft.ts`), archive and champion (`archive.ts`). |
| `src/sports/` | Multi-sport architecture: the abstract `Sport.ts` class, the sport registry (`registry.ts`, `getSport(id)`, falling back to football), and one class per sport. `football/Football.ts` has standings, tiebreaks, playoff winner, player stats and goals. `RacketSport.ts` holds what set-based sports share (set format, set and match winner, game-by-game scoring, game-based standings), and `padel/Padel.ts` and `tennis/Tennis.ts` extend it with each sport's default format. Each sport also declares its standings columns, player leaderboards, rating attributes and whether squads use jersey numbers. The UI asks the tournament's sport (`getSport(state.meta.sport)`) instead of calling football directly. |
| `src/algorithms.ts` | Re-exports core and football functions for compatibility with existing modules. |
| `src/sync.ts` | Diffs between snapshots for `update()`, normalisation of data saved by Firebase or by older versions (config, meta, results, archive, players) and the activity log text. |
| `src/firebase.ts` | Firebase connection: listens to `tournaments/<id>`, `players` and `arquivo`, pushes changes, lists, creates and finishes tournaments, migrates legacy data, Google sign-in, user role, user list and activity log. |
| `src/permissions.ts` | Roles (`master`, `admin`, `user`), per-sport admin checks and which sections each role may write. Mirrors `database.rules.json`. |
| `src/types.ts` | TypeScript domain types (`Tournament`, `TournamentMeta`, `Config`, `Match`, `Score`, `Player`, `Team`, etc.). |
| `src/i18n/en.ts` | Every user-facing string, in English. |
| `src/ui.ts` and `src/ui/` | Controllers of every screen and modal. Each section has its own module in `src/ui/` (`tournaments.ts`, `standings.ts`, `schedule.ts`, `match.ts`, `players.ts`, `teams.ts`, `history.ts`, `stats.ts`, `settings.ts`, `singular.ts`, `admin.ts`, `modals.ts`); `dom.ts` holds the elements, the form field helpers (`fieldValue`, `setFieldValue`, `isChecked`) and `onEvent`, and `toasts.ts` the toasts. A migrated controller reads the state, sets the properties of its Lit components and handles their events; it builds no HTML. `ui.ts` has `renderAll`/`refreshComputed` and re-exports the rest, so other modules import everything from `./ui.ts`. Modules in `src/ui/` never import `ui.ts`. |
| `src/components/` | Lit components of the sections, rendered in the light DOM so the app's CSS applies (`LightElement` is their base class; `templates.ts` has the team label and colour dot). Properties in, events out: `<standings-table>`, `<stats-table>`, `<stat-cards>`, `<dashboard-podium>`, `<top-scorers>`, `<all-time-stats>`, `<archive-list>` (emits `archive-delete`), `<schedule-list>` and `<results-list>` (emit `open-match`, `status-click`, `score-step` and `score-commit`; `rounds.ts` groups the schedule by round), `<teams-editor>` (`team-change`), `<squad-list>` (`squad-remove`, `player-stats`), `<player-cards>` (`player-profile`, `player-edit`, `player-delete`), `<player-picker>` (`selection-change`), `<player-editor>`, `<draft-teams>` (`draft-goal-add`, `draft-goal-sub`, `draft-mvp`), `<single-match-history>` (`single-delete`), `<user-list>` (`role-change`), `<activity-log>` and `<tournament-list>` (`tournament-select`, `tournament-finish`). Every dialog goes through `openDialog()` in `ui/modals.ts`: a title, a Lit template as body and two buttons; `setConfirmEnabled()` lets a body hold the confirm button until its input is valid. Lit escapes every value, so they need no `escapeHtml`. |
| `src/components/ScoreBase.ts` | Lit base class of the live score panel: header, admin controls (emits `point`, `cancelled`, `started`, `finished`) and the event banners (kick-off, goal, goal cancelled, full time) with the score bump. Turned off with *reduced motion*. |
| `src/sports/football/FootballScore.ts` | `<football-score>`: the match window for football (goal banners, goals timeline, MVP and share). |
| `src/sports/RacketScore.ts` | Base of the racket match windows (sets won, a set grid with the current set highlighted, GAME / SET! banners), following the rules of its `sport`. `padel/PadelScore.ts` (`<padel-score>`) and `tennis/TennisScore.ts` (`<tennis-score>`) only name their sport. `ui/match.ts` picks the panel by sport. |
| `src/share.ts` | Draws the standings and result PNG images on a `<canvas>` and shares them. |
| `src/utils.ts` | Small helpers: `escapeHtml`, `safeColor`, team and player names (`playerName`, `buildPlayerIndex`), dates, `prefersReducedMotion`. |
| `database.rules.json` | Realtime Database security rules, published by the deployment. |
| `firebase.json` | Tells the Firebase CLI where the rules are (used by the deployment). |
| `tests/` | Vitest tests; `tests/rules/` holds the rules tests for the emulator. |

## Multi-sport architecture

![One class per sport](assets/illustrations/27-uma-classe-por-desporto.jpg)

Every tournament belongs to one sport (`meta.sport`), which delegates scoring, standings, leaderboards, and UI panels to a sport profile class.

### Adding a sport (checklist)

When implementing a new sport (e.g. basketball, handball, volleyball):

1. **Sport class (`src/sports/<sport>/<Sport>.ts`):**
   - Extend `Sport` (or a base like `RacketSport`).
   - Define `id`, `name`, `icon`, `ratingAttributes`, `standingsColumns`, `usesJerseyNumbers`.
   - Implement `computeStandings`, `resolveHeadToHead`, `getPlayoffWinner`, `tallyPlayerStats`, and scoring methods (`addPoint`/`removePoint` or sport-specific events).
2. **Registry (`src/sports/registry.ts`):**
   - Register the new sport with `registerSport(sportInstance)`.
3. **Live score component (`src/sports/<sport>/<Sport>Score.ts`):**
   - Create custom element `<sport-score>` extending `ScoreBase`.
   - Register it in `SCORE_PANELS` inside `src/ui/match.ts`.
4. **Translations (`src/i18n/en.ts`):**
   - Add rating attribute names (e.g. `en.players.<sport>Attributes`).
   - Add live banner text, score panel buttons, and sport-specific labels.
5. **UI & Forms (`index.html` and `src/ui/settings.ts`):**
   - Tag sport-specific settings or squad options with `data-sport-only="<sport>"`.
   - Update `populateConfigForm` in `src/ui/settings.ts` if the sport adds configurable scoring parameters.
6. **Firebase Security Rules (`database.rules.json`):**
   - Add validation rules under `tournaments/$tournamentId/results/$jogo` for the sport's score format.
   - Update `src/permissions.ts` if new data paths are introduced.
   - Add emulator test cases in `tests/rules/rules.check.mjs`.
7. **Unit tests (`tests/<sport>.test.ts`):**
   - Test standings calculation, tiebreaker chain, playoff winner determination, score formatting, and player stats tallying.
8. **Documentation:**
   - Add a column to `docs/sports.md`.
   - Document rules, scoring and formats in `docs/rules.md`.
   - Update `docs/guide.md` and `README.md`.

## Data model

Each tournament lives in its own node, `tournaments/<id>` (`default` for the tournament migrated from older versions, `t_<timestamp>` for new ones), with these sections:

| Section | Contents |
|---|---|
| `meta` | `{ name, sport, status, createdAt }`. `status` is `active` or `finished`; `sport` (`football`, `padel`, `tennis`, …) is fixed at creation. |
| `config` | Name, sport, number of teams, groups, rounds, scoring, playoffs. Padel and tennis tournaments also have `setFormat: { sets, gamesPerSet, superTieBreak }` (defaults 3, 6, true in padel; 3, 6, false in tennis). Padel also has `padelFormat` (`pairs`, `americano` or `mexicano`) and `matchPoints` (24 by default), the points each Americano / Mexicano match is played to. |
| `teams` | 32 slots `{ name, color, group }` (unused ones have an empty name). |
| `squads` | 32 lists of players per team `{ id, num, name }`. In padel a squad is a pair, and in tennis one player or a pair; `num` (1, 2) only keeps the order. |
| `schedule` | List of matches `{ jornada, home, away, group }`; playoff matches have `isPlayoff`, `playoffMatchId` and `nextMatchId`. In padel Americano / Mexicano each team slot is one player: `home` and `away` are the first player of each pair and `partners: { home, away }` the second. |
| `roundsMeta` | One entry per matchday, with the team that has a bye. |
| `scheduleTeamCount`, `scheduleVoltas` | Teams and rounds the schedule was generated with. |
| `results` | By the match's index in `schedule`: `{ score: "2-1", status, scorers: { home, away }, assists: { home, away }, mvp, penalties }`. In padel and tennis `score` holds the games of each set (`"6-4 3-6 10-7"`) and there are no scorers, assists or penalties; the rules only accept that format in tournaments whose `meta.sport` is `padel` or `tennis`. |
| `jogosSingulares` | The tournament's single matches, with both teams, score, scorers, assists and MVP. |
| `version`, `exportedAt` | Format version (`SNAPSHOT_VERSION`, currently 12) and date of the last save. |
| `logRef` | Key of the `tournament_log/<id>` entry of the last save (see [Activity log](#activity-log)). |

Shared by every tournament, at the root of the database:

| Node | Contents |
|---|---|
| `players` | Global players database `{ id, nome, teamIdx, ratings: { <sport>: attributes }, atributos }`. Each sport has its own attribute keys (`Sport.ratingAttributes()`: football `velocidade`, `finalizacao`, …; padel `volley`, `smash`, `lob`, `walls`, `defense`, `fitness`; tennis `serve`, `return`, `forehand`, `backhand`, `volley`, `fitness`). `atributos` is a copy of the football ratings, kept for older data. |
| `arquivo` | Archived tournaments: name, sport, date, champion, final tables and per-player stats. |
| `users/<uid>` | Name, email, photo, last access, `role` (`master`, `admin` or `user`; none = pending) and `admin: { <sport>: true }` for per-sport admins. |
| `tournament_log/<id>` | Activity log of each tournament. |

Notes:

- `results` is indexed by the match's **position** in `schedule`. That is why the extra round and the playoffs append matches at the end and never reorder existing ones.
- In `scorers`, `'auto'` is an own goal. `assists` is aligned with `scorers` (same position = same goal; `''` = no assist).
- Player names in `arquivo` are copied when archiving, so the history survives deleted players.
- In the app, the snapshot of the current tournament also carries `players` and `arquivo`; `pushStateToFirebase` writes them to the root nodes.
- Legacy nodes from before multiple tournaments (`torneio_state`, `torneio_log`, `utilizadores`) are read-only. `firebase.ts` falls back to `torneio_state` while `tournaments/default` does not exist, and migrates it the first time a Master Admin signs in (see [Setup](configuration.md#setting-up-firebase-once)).

Each device also keeps a copy in localStorage, to show the tournament as soon as it opens, before Firebase replies, and remembers the last tournament viewed.

## Sync

![Match-by-match sync](assets/illustrations/12-sincronizacao-jogo-a-jogo.jpg)

1. On startup, `firebase.ts` listens to `tournaments/<id>` of the selected tournament with `onValue` (plus `players` and `arquivo`). Each time a value arrives, `applySnapshot` replaces the local state and that snapshot becomes the "last synced" one. Switching tournament restarts the listener on the new node.
2. Each action saves its section to localStorage and calls `pushStateToFirebase` with the full snapshot.
3. `diffSnapshot` compares it with the last synced snapshot and produces an `update()` with only what changed:
   - `results` goes **match by match** (`results/<index>`), so that two people recording different matches at the same time do not overwrite each other;
   - `schedule` goes field by field per match (`schedule/<index>/<field>`), so that advancing a playoff winner only writes `home` or `away`;
   - the other sections go whole; if two people change the same section at the same time, the last one wins.
4. The same `update()` appends the entry to `tournament_log/<id>`, so the change and the log entry are saved together (or neither is).

Firebase deletes empty lists and turns arrays into objects with numeric keys. `normalizeResults`, `normalizeArquivo` and `normalizePlayers` restore the expected shape on load; `normalizeConfig` and `normalizeMeta` fill in defaults for data saved by older versions.

## Permissions

![Firebase rules are the protection](assets/illustrations/13-regras-sao-a-protecao.jpg)

The Firebase rules are the real protection; the client only hides buttons and warns before sending. "Sport admin" below means a user with `role: "admin"` and `admin/<sport>: true` for the tournament's sport.

| Path | Read | Write |
|---|---|---|
| `tournaments/<id>` | Everyone | `jogosSingulares`, `exportedAt`, `version`: User, sport admin and Master Admin. `results`, `schedule`, `meta` and the other sections: sport admin and Master Admin. `meta/sport` cannot change. |
| `players` | Everyone | Master Admin and any Admin. |
| `arquivo` | Everyone | Each entry: Master Admin or an admin of the entry's sport. The whole node: Master Admin. |
| `users` | Master Admin (all); each user their own | Each user their own name, email, photo and last access; `role` and `admin`: Master Admin only. |
| `tournament_log/<id>` | Master Admin and the tournament's sport admins | User, Admin and Master Admin, new entries only, with their own `uid` and the server time. |
| `torneio_state`, `torneio_log`, `utilizadores` | Legacy | Nobody. |

Besides who can write, the rules validate what is written: scores in the `"2-1"` format, known statuses (`agendado`, `decorrer`, `terminado`), per-side lists of scorers and assists, the fields of `meta`, and length-limited text. Every write to a tournament's sections (other than `exportedAt` and `version`) must also bring a new `logRef` (see [Activity log](#activity-log)).

In the app, anyone who is not an admin of the tournament's sport sees Teams, Squads and Players read-only, with a note explaining why, and does not see the Results tab, sees scores and match status read-only in the Schedule and the match window, and cannot pick the MVP; Pick MVP only appears when an admin opens the match from Results; the 👮 Users tab is only shown to the Master Admin.

**Changing permissions:** change `database.rules.json` and `src/permissions.ts` (`USER_SECTIONS`, `canWritePath`) together, update `tests/permissions.test.js` and `tests/rules/rules.check.mjs`, and run `npm run test:rules`. The rules are published by the next deployment (see [Deployment](configuration.md#deployment)).

If Firebase rejects a write the client let through, the server value comes back by itself and the app warns: "The change was rejected by the database (permission denied). It has been reverted."

When the client knows before sending that the change is not allowed (not signed in, no role, or an admin-only section), it sends nothing: `state.ts` goes back to the last synced snapshot and shows the reason. If nothing has synced yet, or Firebase refuses a save the client did send, the app reads the tournament from Firebase again (`resyncFromServer`) and stores that, so a refused change does not stay on screen or in the local cache. Only the latest value from Firebase is applied: a refused save fires its optimistic value and then the server value, and the older one is skipped.

## Activity log

![Activity log](assets/illustrations/14-registo-de-alteracoes.jpg)

`describeUpdates` (in `sync.ts`) turns each `update()` into a readable sentence (for example, "Teams updated", or the match whose result changed). The entry `{ uid, nome, acao, quando }` goes to `tournament_log/<id>`. Creating, finishing and migrating tournaments and changing roles are logged too. The Master Admin sees the last 200 entries of the tournament being viewed in Manage → 👮 Users.

The log is mandatory, not just a client convention: the same `update()` writes `tournaments/<id>/logRef` with the key of the new entry, and the rules only accept the write if that entry is new, belongs to the user and the `logRef` changes. A write without a log entry is rejected.

## Changing the state shape

Any change to the state shape (new field, new section, different format) must:

1. Bump `SNAPSHOT_VERSION` in `src/state.ts`.
2. Keep loading data saved by earlier versions, already in Firebase and on phones (defaults in `applySnapshot`, normalisation in `sync.ts`).
3. For a new section in `tournaments/<id>`, decide who may write it (see [Permissions](#permissions)). By default it is admin-only.

## HTML safety

Anyone with the public config can try to write to Firebase, so everything that comes from the state is treated as untrusted:

- Every state value that goes into an HTML string goes through `escapeHtml`.
- Team colours go through `safeColor`.

## Tests

```bash
npm run lint         # ESLint (eslint.config.mjs)
npm run typecheck    # TypeScript type check (tsc --noEmit)
npm test             # app logic
npm run test:rules   # Firebase rules in the emulator (needs Java)
```

`npm test` runs without a browser or Firebase (Firebase and the DOM are mocked where needed):

| File | Covers |
|---|---|
| `tests/football.test.ts` | Football logic: standings, head-to-head, playoff winner, player stats, goals, animation events, rank moves |
| `tests/padel.test.ts` | Padel logic: set format, parsing sets, set and match winner, adding and removing games, super tie-break, game-based standings and head-to-head, playoff winner, animation events |
| `tests/tennis.test.ts` | Tennis: registry, default format with a full deciding set, best of 5, scoring a three-set match, games in the standings |
| `tests/core/` | Core logic: `schedule.test.ts` (Berger, rounds, seeding), `draft.test.ts` (ratings per sport, drafts, balanced pairs), `archive.test.ts` (archive), `playoffs.test.ts` (bracket, seeds, winner advancement), `americano.test.ts` (partner rotation, Mexicano pairing, player standings, padel played to points) |
| `tests/sync.test.ts` | `diffSnapshot`, `normalizeResults`, `onlyMetadata`, `describeUpdates`, `normalizeArquivo`, `normalizeConfig`, `normalizeMeta` |
| `tests/state.test.ts` | `SNAPSHOT_VERSION`, `applySnapshot` with version 7 to 10 snapshots (meta derived for older ones), `buildSnapshot`, `defaultConfig`, `defaultMeta`, current tournament id |
| `tests/players.test.ts` | `defaultPlayerAttrs`, `normalizePlayer`, `normalizePlayers` and per-sport ratings in `applySnapshot` |
| `tests/torneios.test.ts` | Active tournament filter and sport badge (`src/components/TournamentList.ts`), the header (`src/ui/tournaments.ts`) and the last tournament viewed on the device |
| `tests/permissions.test.js` | `canWritePath`, `blockedPaths`, `roleLabel`, `isMaster`, `isSportAdmin` |
| `tests/utils.test.js` | `escapeHtml`, `safeColor` |

The core and sports modules do not depend on the UI or Firebase, so the tests import them directly. There are no circular imports: `ui.ts` does not import `main.ts` and `state.ts` does not import `ui.ts`; keep it that way when adding code. The UI is checked by hand (see [Running locally](configuration.md#running-locally)).

`npm run test:rules` starts the Realtime Database emulator with `database.rules.json` and runs `tests/rules/rules.check.mjs`: who can write each path, the validations and the `logRef`. It uses the config in `tests/rules/firebase.json`, separate from the root one.

CI runs everything before each deployment: the rules in the `rules` job, and ESLint, the type check and the logic tests in the `deploy` job.
````

## File: src/i18n/en.ts
````typescript
// ---------------------------------------------------------------------------
// English UI Strings (i18n)
// ---------------------------------------------------------------------------

import { html } from 'lit';

// Strings with markup are Lit templates: values in them are escaped by Lit.
export const en = {
  common: {
    tournament: 'Tournament',
    noName: 'No name',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    delete: 'Delete',
    loading: 'Loading…',
    saved: 'Saved',
    savedCheck: 'Saved ✓',
    error: 'Error',
    noBackup: 'No backup',
    backup: 'Backup',
    name: 'Name',
    team: 'Team',
    player: 'Player',
    sport: 'Sport',
    football: 'Football',
    padel: 'Padel',
    tennis: 'Tennis',
    unnamed: 'Unnamed',
    unknownPlayer: 'Unknown Player',
    noTeam: 'No Team',
    none: 'None',
    edit: 'Edit',
    stats: 'Stats',
    remove: 'Remove',
    pts: 'Pts',
    goals: 'goals',
    assists: 'assists',
    mvp: 'MVP',
  },

  roles: {
    master: 'Master Admin',
    admin: 'Admin',
    user: 'User',
    pending: 'Pending',
    cannotChangeOwn: 'You cannot change your own role',
    viewer: 'Viewer',
  },

  nav: {
    dashboard: 'Dashboard',
    standings: 'Standings',
    schedule: 'Schedule',
    results: 'Results',
    stats: 'Stats',
    history: 'History',
    settings: 'Settings',
    manage: 'Manage',
    teams: 'Teams',
    squads: 'Squads',
    players: 'Players',
    data: 'Data',
    users: 'Users',
    singleMatch: 'Single Match',
    home: 'Home',
    more: 'More',
    closeMenu: 'Close menu',
  },

  header: {
    eyebrow: 'Tournament Manager',
    refreshStandings: 'Refresh Standings',
    toggleTheme: 'Toggle Dark/Light Mode',
    signInWithGoogle: 'Sign in with Google',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    noSchedule: 'NO SCHEDULE',
    roundTicker: (current: number | string, total: number, played: number, matchesTotal: number) =>
      `ROUND ${current} / ${total}   ·   ${played}/${matchesTotal} MATCHES PLAYED`,
  },

  dashboard: {
    activeTournaments: 'Active Tournaments',
    newTournament: 'New Tournament',
    selectTournamentHelp: 'Select the tournament you want to follow on this device.',
    noActiveTournaments: 'No active tournaments right now. An administrator can create a new tournament.',
    standingsTop3: 'Standings — Top 3',
    stats: 'Stats',
    topScorers: 'Top Scorers',
    mostWins: 'Most Wins',
    noWinsYet: 'No finished matches yet.',
    winsLabel: (count: number) => `${count} ${count === 1 ? 'win' : 'wins'}`,
    matchesLabel: (count: number) => `${count} ${count === 1 ? 'match' : 'matches'}`,
    noTeamsConfigured: 'No teams configured.',
    viewTournament: 'View Tournament',
    finishTournament: 'Finish Tournament',
    activeBadge: 'Active',
    viewingNow: 'Viewing now',
    createdOn: (date: string) => `Created on ${date}`,
    dateUnavailable: 'Date unavailable',
    place: (rank: number) => `${rank}${['st', 'nd', 'rd'][rank - 1] || 'th'} PLACE`,
    ptsMatches: (pts: number, matches: number) => `${pts} pts · ${matches} matches`,
  },

  tournaments: {
    modalTitle: 'New Tournament',
    nameLabel: 'Tournament Name',
    namePlaceholder: 'e.g. Spring Championship',
    sportLabel: 'Sport',
    numTeamsLabel: 'Number of Teams (2–32)',
    createButton: 'Create Tournament',
    defaultNewName: 'New Tournament',
    finishTitle: 'Finish Tournament',
    finishPrompt: (name: string) =>
      html`Are you sure you want to finish tournament <strong>${name}</strong>?
        Final standings and player stats will be saved to History and the tournament will be marked as finished.`,
    finishPendingMatches: (count: number) =>
      html`<br><br>⚠️ There ${count === 1 ? 'is' : 'are'} still <strong>${count} unfinished match${count !== 1 ? 'es' : ''}</strong>:
        the saved champion will be the current leader (or none, if the final is unfinished).`,
  },

  config: {
    generalSettings: 'General Settings',
    tournamentName: 'Tournament name',
    formatTitle: 'Tournament Format',
    formatSub: 'Configure the base format of your tournament here.',
    numTeams: 'Number of teams (2–32)',
    numGroups: 'Number of Groups',
    singleLeague: '1 (Single League)',
    groupsOption: (n: number) => `${n} Groups`,
    numRounds: 'Number of rounds',
    roundsNote: '1 = each team plays once · 2 = home and away · 3+ = configurable repeat',
    generateSchedule: 'Generate Schedule',
    playoffsTitle: 'Playoffs (Knockout)',
    playoffsSub: 'Enable the playoff stage to be played after the league phase.',
    enablePlayoffs: 'Enable Playoffs',
    qualifiedTeams: 'Qualified Teams (from League)',
    playoffOptions: {
      2: 'Top 2 (Final)',
      4: 'Top 4 (Semi-Finals)',
      8: 'Top 8 (Quarter-Finals)',
      16: 'Top 16 (Round of 16)',
    },
    scoringTitle: 'Scoring',
    win: 'Win',
    draw: 'Draw',
    loss: 'Loss',
    bonusBlowout: 'Bonus (blowout win)',
    blowoutGoals: 'Goals scored for bonus',
    scoringExample:
      'Example: Porto 4–1 Benfica with win=3 and bonus=1 for 3+ goals scored → Porto gets 3+1 = 4 points.',
    scheduleHintCurrent: (teams: number | string, rounds: number | string, matches: number) =>
      html`Current schedule: <strong>${teams} teams / ${rounds} round(s)</strong> · ${matches} matches.`,
    scheduleHintConfigured: (teams: number, rounds: number) =>
      ` Currently configured: ${teams} teams / ${rounds} round(s) — click 🔄 Generate Schedule to apply.`,
  },

  teams: {
    title: 'Teams (Colors)',
    adminSub: 'Change names and pick the primary color for each team freely.',
    readonlySub: '🔒 Only an admin can change team names and colors.',
    teamColorTitle: 'Team Color',
    teamPlaceholder: (num: number) => `Team ${num}`,
    groupBadge: (g: string) => `Group ${g}`,
    outsideSchedule: 'outside current schedule',
  },

  squads: {
    title: 'Squad Management',
    adminSub: 'Select a team and assign players from the database to track top scorers.',
    readonlySub: '🔒 Select a team to view the squad. Only an admin can edit squads.',
    selectTeamLabel: 'Select Team',
    jerseyNumLabel: 'No.',
    jerseyNumPlaceholder: 'e.g. 10',
    addPlayerFromDB: 'Add Player from Database',
    selectPlayerPlaceholder: '-- Select player --',
    addButton: 'Add',
    createFirstNote: 'If a player does not exist yet, create them first in the <strong>👤 Players</strong> tab.',
    noTeamSelected: 'No team selected.',
    noPlayersAdmin: 'No players yet. Add them using the dropdown above!',
    noPlayersReadonly: 'No players in this squad.',
    removePlayerTitle: 'Remove player',
    playersCount: (n: number) => `Players (${n})`,
    avgRating: (avg: string) => `Avg ★ ${avg}`,
    avgRatingTitle: 'Average Rating (calculated from Database)',
    drawPairsTitle: '🎲 Draw pairs',
    drawPairsButton: '🎲 Draw pairs',
    drawPairsNote: (needed: number) =>
      `Pick ${needed} players. The best is paired with the weakest, and so on, by rating. This replaces the current pairs and team names.`,
    drawPairsCount: (n: number, needed: number) => `${n} / ${needed} players selected`,
    rotationPlayersTitle: '👤 Choose players',
    rotationPlayersButton: 'Use these players',
    rotationPlayersNote: (needed: number) =>
      `Pick ${needed} players, one per team. Partners change every round. This replaces the current teams and squads.`,
  },

  players: {
    title: 'Players Database',
    adminSub: 'Register players and set their attributes. You can assign each player to a tournament team.',
    readonlySub: '🔒 Only an admin can create, edit, or delete players.',
    newPlayerButton: '➕ New Player',
    searchPlaceholder: '🔍 Search player...',
    noPlayersFound: 'No players found.',
    noPlayersAdmin: 'No players yet. Click "+ New Player" to get started!',
    noPlayersReadonly: 'No players yet.',
    noTeam: 'No team',
    statsButton: '📊 Stats',
    editButton: '✏️ Edit',
    deleteButton: '🗑️',
    deleteModalTitle: 'Delete Player',
    deleteModalPrompt: (name: string) =>
      html`Are you sure you want to delete <strong>${name}</strong>? They will be removed from all squads.`,
    editModalTitle: 'Edit Player',
    createModalTitle: 'New Player',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. John Doe',
    teamLabel: 'Team',
    attributeSportLabel: 'Attribute Sport',
    ratingLabel: (sport: string) => `Rating (${sport})`,
    savePlayer: '💾 Save',
    createPlayer: '✅ Create Player',
    profileTitle: 'Player Profile',
    jerseyTeamLabel: (num: string | number, team: string) => `Jersey ${num} • ${team}`,
    matchesPlayed: 'Matches',
    wins: 'Wins',
    totalGoals: 'Total Goals',
    assists: 'Assists',
    mvp: 'MVP',
    scoringMatches: 'Scoring Matches',
    singleMatchRecord: 'Single Match Record',
    recordGoalsUnit: 'goals',
    profileFooterNote: 'Includes archived tournaments and single matches.',
    attributes: {
      velocidade: 'Pace',
      finalizacao: 'Shooting',
      passe: 'Passing',
      drible: 'Dribbling',
      defesa: 'Defending',
      fisico: 'Physical',
    },
    padelAttributes: {
      volley: 'Volley',
      smash: 'Smash',
      lob: 'Lob',
      walls: 'Wall play',
      defense: 'Defense',
      fitness: 'Fitness',
    },
    tennisAttributes: {
      serve: 'Serve',
      return: 'Return',
      forehand: 'Forehand',
      backhand: 'Backhand',
      volley: 'Volley',
      fitness: 'Fitness',
    },
  },

  singleMatch: {
    newMatchTab: '⚽ New Match',
    historyTab: '📅 History',
    balancedTeamsTitle: '🎯 Balanced Teams',
    description:
      'Set team names, select available players, and click <strong>Run Draft</strong>: ' +
      'the app splits them into two teams with the closest possible total rating. For each goal you can track who assisted.',
    teamANameLabel: 'Team A Name',
    teamBNameLabel: 'Team B Name',
    teamAPlaceholder: 'e.g. Reds',
    teamBPlaceholder: 'e.g. Blues',
    selectPlayersTitle: 'Select Available Players',
    noPlayersInDB: 'No players in the database yet. Create them first in the 👤 Players tab.',
    playersSelected: (count: number) => `${count} player${count !== 1 ? 's' : ''} selected`,
    runDraftButton: '⚽ Run Draft',
    generatedTeamsTitle: '👥 Generated Teams',
    totalRating: (r: number | string) => `Total rating: ${r}`,
    ratingDifference: 'Rating difference: ',
    recordResultTitle: '📝 Record Result',
    teamA: 'Team A',
    teamB: 'Team B',
    saveMatchButton: '💾 Save Match',
    historyTitle: '📅 Single Matches History',
    noMatchesRecorded: 'No matches recorded yet.',
    deleteMatchTitle: 'Delete Match',
    deleteMatchPrompt: 'Are you sure you want to delete this match record from history?',
    pickAssistTitle: 'Assist',
    noAssistLabel: 'No assist',
    pickMvpTitle: 'Match MVP',
    noMvpLabel: 'No MVP',
    chooseMvp: 'pick',
  },

  schedule: {
    title: 'Schedule',
    sub: 'Generated automatically using the Berger pairing system.',
    empty: 'No schedule yet. Go to Settings and click 🔄 Generate Schedule.',
    addExtraRound: '➕ Add Extra Round (Keep Results)',
    nextMexicanoRound: '➕ Next Mexicano Round',
    generatePlayoffs: '🏆 Generate Playoffs',
    roundHead: (j: string | number) => `Round ${j}`,
    viewMatchTitle: 'View match',
    byeRound: (team: unknown) => html`💤 ${team} — bye this round`,
    noScheduledMatches: 'No scheduled matches.',
  },

  results: {
    title: 'Results and Match Status',
    sub: 'Enter the score and click the status pill (e.g. Scheduled) to change match status to In Progress or Finished.',
    penalties: 'Penalties',
    matchButtonTitle: 'View goals, assists and MVP',
    matchButton: '📋 Match',
    statusScheduled: '📅 Scheduled',
    statusInProgress: '⏳ In Progress',
    statusFinished: '✅ Finished',
    changeStatusTitle: 'Click to change status',
  },

  standings: {
    title: 'Standings',
    shareTitle: 'Share Standings',
    tiebreakerNote:
      'Tiebreaker criteria, in order: points → goal difference → goals scored → head-to-head (mini-table of matches between tied teams) → fewest goals conceded → alphabetical order.',
    noTeams: 'No teams configured.',
    generalStandings: 'General Standings',
    groupName: (g: string) => `Group ${g}`,
    movedUp: (n: number) => `Moved up ${n} ${n === 1 ? 'place' : 'places'}`,
    movedDown: (n: number) => `Moved down ${n} ${n === 1 ? 'place' : 'places'}`,
    cols: {
      pos: 'Pos',
      team: 'Team',
      pts: 'Pts',
      p: 'P',
      w: 'W',
      d: 'D',
      l: 'L',
      gf: 'GF',
      ga: 'GA',
      gd: 'GD',
    },
    racketCols: {
      pts: 'Pts',
      p: 'P',
      w: 'W',
      l: 'L',
      sd: 'SD',
      gd: 'GD',
    },
    racketNote: 'Ranked by points (Pts, from matches won). Tiebreaker criteria, in order: set difference (SD) → game difference (GD) → head-to-head (matches won, then set and game difference between the tied pairs) → fewest games lost → alphabetical order. A super tie-break counts as a set and as one game.',
    rotationNote: 'Each player is ranked on their own by points won (PW). Tiebreaker criteria, in order: point difference → matches won → alphabetical order.',
    /** Americano / Mexicano: points instead of games. */
    pointsCols: {
      p: 'P',
      w: 'W',
      l: 'L',
      gw: 'PW',
      gl: 'PL',
      gd: 'PD',
    },
  },

  statsTab: {
    title: 'Stats',
    matchesPlayed: 'Matches played',
    remainingMatches: 'Remaining matches',
    goalsScored: 'Goals scored',
    goalsPerMatchAvg: 'Goals / match avg',
    bestAttack: '🔥 Best attack',
    bestDefense: '🧱 Best defense',
    biggestBlowout: 'Biggest blowout',
    mostWins: 'Most wins',
    mostDraws: 'Most draws',
    topScorers: '👟 Top Scorers',
    noGoalsYet: 'No goals recorded yet.',
    assistsTitle: '🅰️ Assists',
    mvpTitle: '⭐ MVP',
    nothingRecordedYet: 'Nothing recorded yet.',
    goalsLabel: (count: number) => `${count} goals`,
    concededLabel: (count: number) => `${count} conceded`,
    winsLabel: (count: number) => `${count} wins`,
    drawsLabel: (count: number) => `${count} draws`,
    diffLabel: (diff: number) => `(diff ${diff})`,
    /** Labels for racket sports, where the points are games. */
    racket: {
      gamesPlayed: 'Games played',
      gamesPerMatchAvg: 'Games / match avg',
      mostGamesWon: '🔥 Most games won',
      fewestGamesLost: '🧱 Fewest games lost',
      gamesLabel: (count: number) => `${count} games`,
      lostLabel: (count: number) => `${count} lost`,
    },
  },

  historyTab: {
    allTimeTitle: '🌟 All-Time Stats',
    archivedTitle: '🗄️ Archived Tournaments',
    playerCol: 'Player',
    goalsTitle: 'Goals',
    assistsTitle: 'Assists',
    mvpTitle: 'MVP',
    noStatsYet: 'No stats yet.',
    matchesTitle: 'Matches',
    winsTitle: 'Wins',
    noArchivedYet: 'No archived tournaments yet. An admin can archive the current tournament in Manage → Data.',
    noChampion: 'No champion',
    matchesGoalsSummary: (matches: number, goals: number) => `${matches} matches · ${goals} goals`,
    deleteFromHistory: '🗑️ Delete from history',
    deleteModalTitle: 'Delete from History',
    deleteModalPrompt: 'This archived tournament will be deleted. Continue?',
  },

  adminTab: {
    title: 'Users',
    sub: 'Users who sign in with Google start as pending (read-only) until you assign them a role. Users record results and single matches; admins can configure everything.',
    activityLogTitle: 'Activity Log',
    activityLogSub: 'The last 200 changes, along with who made them.',
    noUsersYet: 'No users have signed in yet.',
    lastActive: (time: string) => `last active ${time}`,
    noChangesYet: 'No changes recorded yet.',
  },

  dataTab: {
    backupTitle: 'Backup and Restore',
    backupSub: 'Save a backup of your tournament (teams, squads, results) to a .json file that you can import later on any device.',
    exportJson: '⬇️ Export JSON',
    importJson: '⬆️ Import JSON',
    finishArchiveTitle: 'Finish and Archive Tournament',
    finishArchiveSub: 'Finish the current tournament, save final standings, champion, and player stats in History, and remove the tournament from the active tournaments list.',
    finishArchiveBtn: '🏁 Finish and Archive Tournament',
    dangerZoneTitle: 'Danger Zone',
    dangerZoneSub: 'Select the data you want to delete. Players database and single matches history are protected.',
    checkResults: 'Results and Standings',
    checkResultsDesc: 'Delete all recorded match results in the tournament',
    checkSchedule: 'Schedule',
    checkScheduleDesc: 'Delete generated schedule (rounds and matches)',
    checkTeams: 'Teams and Squads',
    checkTeamsDesc: 'Delete team names, colors, and squads',
    checkPlayers: 'Players (Database)',
    checkPlayersDesc: 'Protected — cannot be deleted here',
    checkSingleMatches: 'Single Matches History',
    deleteSelectedBtn: '🧹 Delete Selected Data',
    footerNote: 'Data saved automatically while you use this application.',
  },

  gameModal: {
    matchNotFound: 'This match no longer exists.',
    ownGoal: 'Own goal',
    goal: 'Goal',
    liveStatus: '● In Progress',
    finishedStatus: 'Finished',
    scheduledStatus: 'Scheduled',
    penalties: (pens: string) => `Penalties ${pens}`,
    pickMvpTitle: 'Pick match MVP',
    pickMvpButton: 'Pick MVP',
    mvpLabel: (name: string) => `MVP: ${name}`,
    shareImageTitle: 'Share match result image',
    shareImageButton: '📤 Share image',
    noGoalsInMatch: 'No goals in this match yet.',
    roundLabel: (r: string | number) => `Round ${r}`,
    addGoalTitle: 'Add goal',
    cancelGoalTitle: 'Cancel last goal',
    kickOffButton: '▶ Kick off',
    fullTimeButton: '⏹ Full time',
  },

  racketScore: {
    addGameTitle: 'Add game',
    cancelGameTitle: 'Cancel last game',
    addPointTitle: 'Add point',
    cancelPointTitle: 'Cancel last point',
    pointsLine: (total: number, left: number) => `Played to ${total} points · ${left} left`,
    point: 'POINT',
    pointCancelled: 'POINT CANCELLED',
    setCol: (n: number) => `Set ${n}`,
    superTieBreakCol: 'STB',
    formatLine: (sets: number, games: number, stb: boolean) =>
      `Best of ${sets} · ${games} games per set${stb ? ' · super tie-break' : ''}`,
    noGamesYet: 'No games played yet.',
    game: 'GAME',
    set: 'SET!',
    gameCancelled: 'GAME CANCELLED',
    matchStart: 'MATCH START',
    matchOver: 'MATCH OVER',
  },

  animations: {
    goal: 'GOAL!',
    goalCancelled: 'GOAL CANCELLED',
    kickOff: 'KICK-OFF',
    fullTime: 'FULL TIME',
    assist: 'Assist: ',
    ownGoal: 'Own goal',
  },

  share: {
    brand: 'Tournament Manager',
    standingsSubtitle: (played: number) => `Standings · ${played} matches finished`,
    standingsFilename: 'standings.png',
    standingsShareTitle: (name: string) => `${name} — Standings`,
    finalResult: 'Final result',
    roundResult: (round: string) => `${round} · Final result`,
    resultFilename: 'result.png',
    penalties: (pens: string) => `Penalties ${pens}`,
    mvp: (name: string) => `MVP: ${name}`,
    assist: (name: string) => ` (assist ${name})`,
    ownGoal: 'Own goal',
    errorCreatingImage: 'Could not create image.',
    imageDownloaded: 'Image downloaded.',
    noStandingsYet: 'No standings available yet.',
  },

  modals: {
    deleteWord: 'DELETE',
    permanentlyDelete: 'You will permanently delete:',
    toConfirmType: (word: string) => `To confirm, type ${word}:`,
    confirmDelete: '🔒 Confirm',
    noPlayersAvailable: 'No players available.',
    goalForTeam: (team: string) => `Goal: ${team}`,
    noPlayersInTeam: 'No players registered in this team.',
    ownGoalButton: '✅ Own Goal',
    cancelButton: '❌ Cancel',
    signOutTitle: 'Sign out',
    signOutPrompt: (user: string) =>
      html`You are signed in as <strong>${user}</strong>. Do you want to sign out? You will still be able to view the tournament, but without edit permissions.`,
  },

  playoffs: {
    roundOf16: 'Round of 16',
    quarterFinals: 'Quarter-Finals',
    semiFinals: 'Semi-Finals',
    final: 'Final',
    winnerPlaceholder: (prefix: string, n: number) => `Winner ${prefix}${n}`,
    generatePlayoffsTitle: '🏆 Generate Playoffs',
    generatePlayoffsPrompt: (total: number) =>
      `Playoff matches will be generated based on current standings (Top ${total}). Continue?`,
    maxTeamsError: 'The system supports up to 16 teams in Playoffs. Adjust settings.',
    configNotSupported: (total: number) => `Configuration of ${total} teams not supported.`,
    notEnoughTeamsInGroup: (top: number) => `Some groups do not have enough teams to qualify Top ${top}.`,
    playoffsGenerated: 'Playoffs generated!',
  },

  toasts: {
    selectTeam: 'Select a team.',
    enterJerseyNumber: 'Enter the jersey number.',
    choosePlayerFromList: 'Choose a player from the list.',
    playerNotFound: 'Player not found.',
    playerAlreadyInSquad: 'This player is already in the squad.',
    playerAddedToSquad: 'Player added to squad!',
    pairFull: 'This pair already has 2 players.',
    pairsDrawn: 'Pairs drawn!',
    rotationPlayersSet: (n: number) => `${n} players ready. Generate the schedule to start.`,
    rotationPlayerCount: 'Americano and Mexicano need a multiple of 4 players (4, 8, 12, …). Change the number of teams.',
    rotationNoPairs: 'Partners rotate in this format: use 👤 Choose players in Settings instead.',
    rotationNoPlayoffs: 'Americano and Mexicano have no playoffs: the standings are the final ranking.',
    mexicanoRoundPending: 'Finish every match of the current round first.',
    mexicanoRoundAdded: (r: number) => `Round ${r} drawn from the standings.`,
    nameRequired: 'Name is required.',
    playerUpdated: 'Player updated!',
    playerCreated: 'Player created!',
    selectCategoryToDelete: 'Select at least one category to delete.',
    dataDeletedSuccess: 'Data deleted successfully.',
    noPermissionCreateTournament: 'You do not have permission to create tournaments.',
    tournamentCreatedSuccess: 'Tournament created successfully!',
    couldNotCreateTournament: 'Could not create tournament.',
    errorFinishingTournament: (reason: string) => `Error finishing tournament: ${reason}`,
    permissionDenied: 'permission denied',
    tournamentFinishedSuccess: 'Tournament finished and saved to History!',
    dashboardRefreshed: 'Dashboard refreshed.',
    extraRoundGroupsUnsupported: 'Adding extra rounds is not supported for tournaments with groups. Use Single League mode.',
    cannotAddRoundsAfterPlayoffs: 'Cannot add rounds after generating playoffs.',
    extraRoundAdded: 'Extra round added!',
    selectAtLeast2Players: 'Select at least 2 players.',
    runDraftFirst: 'Run draft first.',
    matchSavedToHistory: 'Match saved to history!',
    couldNotSignInGoogle: 'Could not sign in with Google.',
    roleUpdated: 'Role updated.',
    couldNotUpdateRole: 'Could not update role.',
    devRoleSwitched: (role: string) => `Signed in as ${role}.`,
    couldNotSwitchDevRole: 'Could not switch role.',
    scheduleGenerated: (count: number) => `Schedule generated: ${count} matches.`,
    tournamentExported: 'Tournament exported successfully!',
    invalidFile: 'Invalid file.',
    invalidStructure: 'Invalid structure.',
    tournamentImported: 'Tournament imported successfully!',
    browserStorageBlocked: 'Your browser blocks local storage — data will not be saved.',
    backupRestored: 'State restored from automatic backup.',
    dbRejectedPermission: 'The change was rejected by the database (permission denied). It has been reverted.',
    dbSaveFailed: 'Could not save the change to the database. It has been reverted.',
    dbStillConnecting: 'Still connecting to the database. Try again shortly.',
    dbSignInRequired: 'Sign in with your Google account to make changes.',
    onlyAdminCanChange: 'Only an admin can make this change.',
    accountNotApproved: 'Your account has not been approved by an admin yet.',
  },

  confirmations: {
    generateNewSchedule: 'Generate new schedule',
    replaceScheduleWarn: 'This replaces the current schedule and clears all recorded results.',
    largeScheduleWarn: (estimate: number) => `This schedule will have ${estimate} matches — it is quite large.`,
    teamsSquadsPreserved: 'Teams, squads, and settings are preserved.',
    deleteData: '🧹 Delete Data',
    addExtraRoundTitle: 'Add Extra Round',
    addExtraRoundPrompt: (v: number) => `Round ${v} will be added. Results will be kept. Continue?`,
    importTournamentTitle: 'Import tournament',
    importTournamentPrompt: 'This will replace ALL current state. Continue?',
  },

  sync: {
    sectionLabels: {
      meta: 'Tournament details updated',
      config: 'Settings updated',
      teams: 'Teams updated',
      squads: 'Squads updated',
      schedule: 'Schedule updated',
      players: 'Players database updated',
      jogosSingulares: 'Single matches updated',
      results: 'Results updated',
      arquivo: 'Tournament history updated',
    } as Record<string, string>,
    resultsDeleted: (count: number) => `${count} results deleted`,
    resultDeleted: (match: string) => `Result deleted: ${match}`,
    resultUpdated: (match: string, score: string, pen: string, status: string) =>
      `Result ${match}: ${score}${pen}${status}`,
    penaltiesSuffix: (pen: string) => ` (pen. ${pen})`,
    statusSuffix: (status: string) => `, ${status}`,
    defaultTeamLabel: (idx: number) => `Team ${idx}`,
    defaultMatchLabel: (idx: number) => `match ${idx}`,
    genericSectionUpdated: (section: string) => `${section} updated`,
    tournamentChanged: 'Tournament changes',
    legacyMigrated: 'Legacy tournament migrated to tournaments/default',
    roleChanged: (name: string, role: string) => `${name}'s role changed to ${role}`,
    tournamentFinished: (name: string) => `Tournament ${name} finished and archived`,
    tournamentCreated: (name: string, sport: string) => `Tournament ${name} created (${sport})`,
  },
};

export type Translations = typeof en;
export default en;
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tournament — League Manager</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="./css/style.css">
</head>

<body>
  <div class="app">

    <header class="marquee">
      <div class="marquee-lines" aria-hidden="true"></div>
      <div class="marquee-content">
        <div class="marquee-top">
          <span class="eyebrow">Tournament Manager</span>
          <div class="header-pills">
            <button class="theme-toggle-btn" id="btnAtualizar" title="Refresh Standings">🔁</button>
            <span class="save-pill" id="savePill">Saved</span>
            <span class="backup-pill" id="backupPill">No backup</span>
            <button class="theme-toggle-btn" id="btnDarkMode" title="Toggle Dark/Light Mode">🌙</button>
            <div id="devRoleContainer" class="dev-role-container" style="display:none;" title="Role Switcher (Emulator)">
              <label for="devRoleSelect" class="dev-role-label">Role:</label>
              <select id="devRoleSelect" class="dev-role-select" aria-label="Development Role">
                <option value="master">👑 Master</option>
                <option value="admin">🛡️ Admin</option>
                <option value="user">👤 User</option>
                <option value="none">👁️ Viewer</option>
              </select>
            </div>
            <button class="theme-toggle-btn auth-btn" id="btnConta" title="Sign in with Google"></button>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <h1 id="tournamentTitle">Football Tournament</h1>
          <span class="sport-badge" id="headerSportBadge">⚽ Football</span>
        </div>
        <span class="marquee-ticker" id="marqueeTicker">—</span>
      </div>
    </header>

    <nav class="tabs" id="tabs" aria-label="Tabs">
      <div class="drawer-head">
        <span class="drawer-title">More</span>
        <button class="drawer-close" id="btnFecharMenu" title="Close menu" aria-label="Close menu">✕</button>
      </div>
      <button class="tab active" data-tab="dashboard">🏠 Dashboard</button>
      <button class="tab" data-tab="standings">🏆 Standings</button>
      <button class="tab" data-tab="calendar">📅 Schedule</button>
      <button class="tab" data-requires="admin" data-tab="results">⚽ Results</button>
      <button class="tab" data-tab="stats">📊 Stats</button>
      <button class="tab" data-tab="historico">🗄️ History</button>
      <button class="tab" data-tab="config" data-requires="admin">⚙️ Settings</button>

      <div class="dropdown">
        <button class="tab dropdown-btn">🛠️ Manage <span class="dropdown-caret">▾</span></button>
        <div class="dropdown-content">
          <button class="tab" data-tab="teams">👥 Teams</button>
          <button class="tab" data-tab="squads">👕 Squads</button>
          <button class="tab" data-tab="players">👤 Players</button>
          <button class="tab" data-tab="data" data-requires="admin">💾 Data</button>
          <button class="tab" data-tab="admin" data-requires="master">👮 Users</button>
        </div>
      </div>

      <button class="tab" data-tab="singular">⚽ Single Match</button>
    </nav>
    <div class="drawer-backdrop" id="drawerBackdrop" aria-hidden="true"></div>

    <!-- NAVIGATION PILL (mobile only): match tabs and "More" for the rest -->
    <nav class="bottom-nav" aria-label="Main navigation">
      <button class="tab" data-tab="dashboard" aria-label="Home"><span class="bn-icon" aria-hidden="true">🏠</span><span class="bn-label">Home</span></button>
      <button class="tab" data-requires="admin" data-tab="results" aria-label="Results"><span class="bn-icon" aria-hidden="true">⚽</span><span class="bn-label">Results</span></button>
      <button class="tab" data-tab="standings" aria-label="Standings"><span class="bn-icon" aria-hidden="true">🏆</span><span class="bn-label">Standings</span></button>
      <button class="tab" data-tab="calendar" aria-label="Schedule"><span class="bn-icon" aria-hidden="true">📅</span><span class="bn-label">Schedule</span></button>
      <button class="bn-more" id="btnMobileMenu" aria-label="More" aria-controls="tabs" aria-expanded="false"><span class="bn-icon" aria-hidden="true">☰</span><span class="bn-label">More</span></button>
    </nav>

    <main class="content">

      <!-- DASHBOARD -->
      <section id="tab-dashboard" class="panel active">
        <div class="card" id="cardTorneiosAtivos">
          <div class="torneios-header">
            <button type="button" class="section-title collapse-toggle" id="btnToggleTorneios" aria-expanded="true" aria-controls="torneiosBody">
              🏆 Active Tournaments <span class="collapse-count" id="torneiosCount"></span><span class="collapse-chevron" aria-hidden="true">▾</span>
            </button>
            <button class="btn btn-sm btn-gold" id="btnNovoTorneioModal" data-requires="admin">➕ New Tournament</button>
          </div>
          <div id="torneiosBody">
            <p class="section-sub">Select the tournament you want to follow on this device.</p>
            <tournament-list class="torneios-grid" id="listaTorneiosAtivos"></tournament-list>
          </div>
        </div>

        <div class="card">
          <div class="section-title">🏆 Standings — Top 3</div>
          <dashboard-podium id="dashboardPodium"></dashboard-podium>
        </div>
        <div class="card">
          <div class="section-title">⚽ Stats</div>
          <div class="stats-grid"><stat-cards id="dashboardStats"></stat-cards></div>
        </div>
        <div class="card">
          <dashboard-leaders id="dashboardScorers"></dashboard-leaders>
        </div>
      </section>

      <!-- SETTINGS -->
      <section id="tab-config" class="panel">
        <div class="card">
          <div class="section-title">⚙️ General Settings</div>
          <div class="form-grid">
            <div class="field">
              <label for="cfgNome">Tournament name</label>
              <input type="text" id="cfgNome" class="input" maxlength="60">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-title">⚽ Tournament Format</div>
          <p class="section-sub">Configure the base format of your tournament here.</p>
          <div class="form-grid">
            <div class="field">
              <label for="cfgNumEquipas">Number of teams (2–32)</label>
              <input type="number" id="cfgNumEquipas" class="input" min="2" max="32" step="1">
            </div>
            <div class="field">
              <label for="cfgNumGrupos">Number of Groups</label>
              <select id="cfgNumGrupos" class="input">
                <option value="1">1 (Single League)</option>
                <option value="2">2 Groups</option>
                <option value="4">4 Groups</option>
                <option value="8">8 Groups</option>
              </select>
            </div>
            <div class="field">
              <label for="cfgNumVoltas">Number of rounds</label>
              <input type="number" id="cfgNumVoltas" class="input" min="1" max="20" step="1">
              <p class="field-note">1 = each team plays once · 2 = home and away · 3+ = configurable repeat</p>
            </div>
          </div>
          <div class="hint-box" id="scheduleHint"></div>

          <button class="btn btn-gold" id="btnGerarCalendario"
            style="margin-top: 16px; width: 100%; justify-content: center;">🔄 Generate Schedule</button>
        </div>

        <div class="card">
          <div class="section-title">🏆 Playoffs (Knockout)</div>
          <p class="section-sub">Enable the playoff stage to be played after the league phase.</p>
          <div class="form-grid">
            <div class="field" style="display:flex; align-items:center; gap:8px; margin-top:20px;">
              <input type="checkbox" id="cfgMataMata" style="width:18px;height:18px;cursor:pointer;">
              <label for="cfgMataMata" style="margin:0;cursor:pointer;">Enable Playoffs</label>
            </div>
            <div class="field">
              <label for="cfgNumPlayoffTeams">Qualified Teams (from League)</label>
              <select id="cfgNumPlayoffTeams" class="input">
                <option value="2">Top 2 (Final)</option>
                <option value="4">Top 4 (Semi-Finals)</option>
                <option value="8">Top 8 (Quarter-Finals)</option>
                <option value="16">Top 16 (Round of 16)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card" data-sport-only="padel" hidden>
          <div class="section-title">🔄 Pairs</div>
          <div class="form-grid">
            <div class="field">
              <label for="cfgPadelFormat">Format</label>
              <select id="cfgPadelFormat" class="input">
                <option value="pairs">Fixed pairs</option>
                <option value="americano">Americano (partners rotate)</option>
                <option value="mexicano">Mexicano (partners by ranking)</option>
              </select>
            </div>
            <div class="field">
              <label for="cfgMatchPoints">Points per match</label>
              <input type="number" id="cfgMatchPoints" class="input" min="4" max="99" step="1">
            </div>
          </div>
          <p class="field-note" style="margin-top:10px;">In Americano and Mexicano each team is one player and partners
            change every round. Each match is played to the points above and every player keeps the points their pair
            won. Americano: everyone partners everyone once. Mexicano: one round at a time, 1st and 4th play 2nd and 3rd.
            The number of teams is the number of players, a multiple of 4.</p>
          <button class="btn btn-gold" id="btnPickRotationPlayers" style="margin-top:10px;">👤 Choose players</button>
        </div>

        <div class="card" data-sport-only="padel tennis" hidden>
          <div class="section-title">🎾 Set format</div>
          <div class="form-grid">
            <div class="field">
              <label for="cfgSets">Sets per match</label>
              <select id="cfgSets" class="input">
                <option value="1">1 set</option>
                <option value="3">Best of 3</option>
                <option value="5">Best of 5</option>
              </select>
            </div>
            <div class="field">
              <label for="cfgGamesPerSet">Games per set</label>
              <input type="number" id="cfgGamesPerSet" class="input" min="1" max="9" step="1">
            </div>
            <div class="field" style="flex-direction:row;align-items:center;gap:10px;">
              <input type="checkbox" id="cfgSuperTieBreak" style="width:18px;height:18px;cursor:pointer;">
              <label for="cfgSuperTieBreak" style="margin:0;cursor:pointer;">Super tie-break in the deciding set</label>
            </div>
          </div>
          <p class="field-note" style="margin-top:10px;">A set is won with a 2-game lead (6-4) or 7-6. The super
            tie-break is played to 10 points by 2 and counts as one game in the standings.</p>
        </div>

        <div class="card" data-sport-only="padel tennis" hidden>
          <div class="section-title">📐 Scoring</div>
          <div class="form-grid">
            <div class="field"><label for="cfgWinPoints">Win</label><input type="number" id="cfgWinPoints" class="input"
                min="0" max="10" step="1"></div>
          </div>
          <p class="field-note" style="margin-top:10px;">Points per match won (1 by default). Pairs are ranked by points,
            then set difference, game difference and head-to-head. Not used in Americano and Mexicano, which rank
            players by points won.</p>
        </div>

        <div class="card" data-sport-only="football">
          <div class="section-title">📐 Scoring</div>
          <div class="form-grid">
            <div class="field"><label for="cfgVitoria">Win</label><input type="number" id="cfgVitoria" class="input"
                min="0" step="1"></div>
            <div class="field"><label for="cfgEmpate">Draw</label><input type="number" id="cfgEmpate" class="input"
                min="0" step="1"></div>
            <div class="field"><label for="cfgDerrota">Loss</label><input type="number" id="cfgDerrota" class="input"
                min="0" step="1"></div>
            <div class="field"><label for="cfgBonus">Bonus (blowout win)</label><input type="number"
                id="cfgBonus" class="input" min="0" step="1"></div>
            <div class="field">
              <label for="cfgGoleada">Goals scored for bonus</label>
              <input type="number" id="cfgGoleada" class="input" min="1" step="1">
            </div>
          </div>
          <p class="field-note" style="margin-top:10px;">Example: Porto 4–1 Benfica with win=3 and bonus=1 for 3+
            goals scored → Porto gets 3+1 = 4 points.</p>
        </div>
      </section>

      <!-- TEAMS -->
      <section id="tab-teams" class="panel">
        <div class="card">
          <div class="section-title">👥 Teams (Colors)</div>
          <p class="section-sub" data-requires="admin">Change names and pick the primary color for each team freely.</p>
          <p class="section-sub readonly-note" data-hide-for="admin">🔒 Only an admin can change team names and colors.</p>
          <div class="teams-grid"><teams-editor id="teamsList"></teams-editor></div>
        </div>
      </section>

      <!-- SQUADS -->
      <section id="tab-squads" class="panel">
        <div class="card">
          <div class="section-title">👕 Squad Management</div>
          <p class="section-sub" data-requires="admin">Select a team and assign players from the database to track top
            scorers.</p>
          <p class="section-sub readonly-note" data-hide-for="admin">🔒 Select a team to view the squad. Only an admin can edit squads.</p>

          <div class="form-grid" style="margin-bottom: 20px;">
            <div class="field">
              <label for="squadTeamSelect">Select Team</label>
              <select id="squadTeamSelect" class="input"></select>
            </div>
          </div>

          <div
            style="background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 16px;">
            <div data-requires="admin">
            <div class="form-grid" style="align-items: end; margin-bottom: 16px;">
              <div class="field" style="grid-column: span 1; max-width: 80px;" data-sport-only="football">
                <label for="squadPlayerNum">No.</label>
                <input type="number" id="squadPlayerNum" class="input" min="1" max="99" placeholder="e.g. 10">
              </div>
              <div class="field" style="grid-column: span 1; width: 100%;">
                <label for="squadPlayerFromDB">Add Player from Database</label>
                <div style="display: flex; gap: 8px;">
                  <select id="squadPlayerFromDB" class="input" style="flex:1;"></select>
                  <button class="btn btn-gold" id="btnAddPlayerFromDB">Add</button>
                </div>
              </div>
            </div>
            <div data-sport-only="padel tennis" hidden style="margin-bottom:12px;">
              <p class="field-note" style="margin-bottom:8px;">Pick the two players of each pair above, or draw every pair
                at once, balanced by rating.</p>
              <button class="btn btn-gold" id="btnDrawPairs">🎲 Draw pairs</button>
            </div>
            <p class="field-note" style="margin-bottom:12px;">If a player does not exist yet, create them first in the
              <strong>👤 Players</strong> tab.
            </p>
            </div>

            <squad-list id="squadList"></squad-list>
          </div>
        </div>
      </section>

      <!-- PLAYERS (DATABASE) -->
      <section id="tab-players" class="panel">
        <div class="card">
          <div
            style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
            <div>
              <div class="section-title" style="margin-bottom:4px;">👤 Players Database</div>
              <p class="section-sub" style="margin:0;" data-requires="admin">Register players and set their attributes. You can assign each
                player to a tournament team.</p>
              <p class="section-sub readonly-note" style="margin:0;" data-hide-for="admin">🔒 Only an admin can create, edit, or delete players.</p>
            </div>
            <button class="btn btn-gold" id="btnNewPlayer" data-requires="admin">➕ New Player</button>
          </div>

          <div style="margin-bottom:16px;">
            <input type="text" id="playerSearchInput" class="input" placeholder="🔍 Search player..."
              style="max-width:320px;">
          </div>

          <player-cards id="playersList"></player-cards>
        </div>
      </section>

      <!-- SINGLE MATCH -->
      <section id="tab-singular" class="panel">
        <!-- Sub-tab nav -->
        <div class="singular-subtabs">
          <button class="singular-subtab active" data-subtab="novo">⚽ New Match</button>
          <button class="singular-subtab" data-subtab="historico">📅 History</button>
        </div>

        <!-- NEW MATCH -->
        <div id="singular-novo" class="singular-panel active">
          <div class="card">
            <div class="section-title">🎯 Balanced Teams</div>
            <p class="section-sub">Set team names, select available players, and click
              <strong>Run Draft</strong>: the app splits them into two teams with the closest possible total
              rating. For each goal you can track who assisted.
            </p>

            <div class="form-grid" style="margin-bottom:20px;">
              <div class="field">
                <label for="draftNomeA">Team A Name</label>
                <input type="text" id="draftNomeA" class="input" placeholder="e.g. Reds" maxlength="40">
              </div>
              <div class="field">
                <label for="draftNomeB">Team B Name</label>
                <input type="text" id="draftNomeB" class="input" placeholder="e.g. Blues" maxlength="40">
              </div>
            </div>

            <div class="section-title" style="font-size:14px; margin-bottom:12px;">Select Available Players
            </div>
            <player-picker id="draftPlayerList" style="margin-bottom:20px;"></player-picker>

            <button class="btn btn-gold" id="btnFazerDraft" style="width:100%; justify-content:center;" disabled>⚽ Run
              Draft</button>
          </div>

          <div class="card" id="draftResultCard" style="display:none;">
            <div class="section-title">👥 Generated Teams</div>
            <draft-teams id="draftTeamsResult"></draft-teams>

            <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--line);">
              <div class="section-title" style="font-size:14px; margin-bottom:12px;">📝 Record Result</div>
              <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span id="draftLabelA" style="font-weight:700; font-size:15px;">Team A</span>
                  <input type="number" id="draftScoreA" class="input"
                    style="width:72px; text-align:center; font-size:20px; font-weight:700;" min="0" max="99"
                    placeholder="0">
                </div>
                <span style="font-size:22px; font-weight:900; color:var(--ink-faint);">-</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <input type="number" id="draftScoreB" class="input"
                    style="width:72px; text-align:center; font-size:20px; font-weight:700;" min="0" max="99"
                    placeholder="0">
                  <span id="draftLabelB" style="font-weight:700; font-size:15px;">Team B</span>
                </div>
                <button class="btn btn-gold" id="btnGuardarJogo" style="margin-left:auto;">💾 Save Match</button>
              </div>
            </div>
          </div>
        </div>

        <!-- HISTORY -->
        <div id="singular-historico" class="singular-panel">
          <div class="card">
            <div class="section-title">📅 Single Matches History</div>
            <single-match-history id="singularHistoricoList"></single-match-history>
          </div>
        </div>
      </section>

      <!-- SCHEDULE -->
      <section id="tab-calendar" class="panel">
        <div class="card">
          <div class="section-title">📅 Schedule</div>
          <p class="section-sub">Generated automatically using the Berger pairing system.</p>
          <schedule-list id="calendarList"></schedule-list>
          <div id="calendarActions" data-requires="admin"
            style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); text-align: center; display: none;">
            <button class="btn" id="btnAdicionarVolta"
              style="background:var(--paper); border:1px solid var(--line); color:var(--pitch-800);">➕ Add Extra
              Round (Keep Results)</button>
            <button class="btn btn-gold" id="btnGerarEliminatorias" style="display: none; margin-left: 10px;">🏆 Generate
              Playoffs</button>
          </div>
        </div>
      </section>

      <!-- RESULTS -->
      <section id="tab-results" class="panel">
        <div class="card">
          <div class="section-title">⚽ Results and Match Status</div>
          <p class="section-sub">Enter the score and click the status pill (e.g. Scheduled) to change match status to In
            Progress or Finished.</p>
          <results-list id="resultsList"></results-list>
        </div>
      </section>

      <!-- STANDINGS -->
      <section id="tab-standings" class="panel">
        <div class="card">
          <div class="section-title">🏆 Standings
            <button class="icon-action" id="btnPartilharTabela" title="Share Standings" aria-label="Share Standings">📤</button>
          </div>
          <div class="table-wrap" id="standingsWrapper">
          </div>
          <p class="field-note" style="margin-top:14px;" data-sport-only="football">Tiebreaker criteria, in order: points → goal difference → goals
            scored → head-to-head (mini-table of matches between tied teams) → fewest goals conceded → alphabetical order.</p>
          <p id="standingsNoteRacket" class="field-note" style="margin-top:14px;" data-sport-only="padel tennis" hidden>Ranked by points (Pts, from matches won).
            Tiebreaker criteria, in order: set difference (SD) → game difference (GD) → head-to-head (matches won, then set
            and game difference between the tied pairs) → fewest games lost → alphabetical order. A super tie-break counts
            as a set and as one game.</p>
        </div>
      </section>

      <!-- STATS -->
      <section id="tab-stats" class="panel">
        <div class="card">
          <div class="section-title">📊 Stats</div>
          <div class="stats-grid"><stat-cards id="statsCards"></stat-cards><stats-table id="statsTable"></stats-table></div>
        </div>
      </section>

      <!-- HISTORY -->
      <section id="tab-historico" class="panel">
        <div class="card">
          <div class="section-title">🌟 All-Time Stats</div>
          <p class="section-sub">Finished tournaments of this sport. The tournament being played counts once it is finished.</p>
          <all-time-stats id="historicoSempre"></all-time-stats>
        </div>
        <div class="card">
          <div class="section-title">🗄️ Archived Tournaments</div>
          <archive-list id="arquivoList"></archive-list>
        </div>
      </section>

      <!-- DATA & USERS -->
      <section id="tab-admin" class="panel">
        <div class="card">
          <div class="section-title">👮 Users</div>
          <p class="section-sub">Users who sign in with Google start as pending (read-only) until you assign them a role.
            Users record results and single matches; admins can configure everything.</p>
          <user-list id="usersList"></user-list>
        </div>
        <div class="card">
          <div class="section-title">📜 Activity Log</div>
          <p class="section-sub">The last 200 changes, along with who made them.</p>
          <activity-log id="logList"></activity-log>
        </div>
      </section>

      <section id="tab-data" class="panel">
        <div class="card">
          <div class="section-title">💾 Backup and Restore</div>
          <p class="section-sub">Save a backup of your tournament (teams, squads, results) to a .json file that you can
            import later on any device.</p>
          <div style="display:flex; gap:12px; margin-top: 18px; flex-wrap: wrap;">
            <button class="btn btn-teal" id="btnExportar">⬇️ Export JSON</button>
            <button class="btn btn-teal" id="btnImportar">⬆️ Import JSON</button>
            <input type="file" id="inputImportar" accept=".json,application/json" style="display:none">
          </div>
        </div>

        <div class="card">
          <div class="section-title">🏁 Finish and Archive Tournament</div>
          <p class="section-sub">Finish the current tournament, save final standings, champion, and player stats in
            History, and remove the tournament from the active tournaments list.</p>
          <button class="btn btn-gold" id="btnArquivar" style="margin-top: 12px;">🏁 Finish and Archive Tournament</button>
        </div>

        <div class="card" style="border-color: var(--danger);">
          <div class="section-title" style="color: var(--danger);">🧹 Danger Zone</div>
          <p class="section-sub">Select the data you want to delete. Players database and single matches history are
            protected.</p>

          <div class="danger-checks">
            <label class="danger-check">
              <input type="checkbox" id="chkDeleteResults" checked>
              <div>
                <div class="danger-check__label">📊 Results and Standings</div>
                <div class="danger-check__desc">Delete all recorded match results in the tournament</div>
              </div>
            </label>

            <label class="danger-check">
              <input type="checkbox" id="chkDeleteSchedule">
              <div>
                <div class="danger-check__label">📅 Schedule</div>
                <div class="danger-check__desc">Delete generated schedule (rounds and matches)</div>
              </div>
            </label>

            <label class="danger-check">
              <input type="checkbox" id="chkDeleteTeams">
              <div>
                <div class="danger-check__label">👕 Teams and Squads</div>
                <div class="danger-check__desc">Delete team names, colors, and squads</div>
              </div>
            </label>

            <label class="danger-check danger-check--locked">
              <input type="checkbox" disabled>
              <div>
                <div class="danger-check__label">🔒 Players (Database)</div>
                <div class="danger-check__desc">Protected — cannot be deleted here</div>
              </div>
            </label>

            <label class="danger-check danger-check--locked">
              <input type="checkbox" disabled>
              <div>
                <div class="danger-check__label">🔒 Single Matches History</div>
                <div class="danger-check__desc">Protected — cannot be deleted here</div>
              </div>
            </label>
          </div>

          <button class="btn btn-danger" id="btnNovoTorneio" style="margin-top: 8px;">🧹 Delete Selected
            Data</button>
        </div>
      </section>

    </main>
    <p class="foot">Data saved automatically while you use this application.</p>
  </div>

  <div class="modal-overlay" id="modalOverlay" hidden>
    <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalBody">
      <h3 id="modalTitle" style="margin-bottom:14px;"></h3>
      <div id="modalBody"></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="modalCancel"
          style="color:var(--ink);background:var(--paper);">Cancel</button>
        <button class="btn btn-danger" id="modalConfirm">Confirm</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay game-overlay" id="gameOverlay" hidden>
    <div class="modal game-modal" role="dialog" aria-modal="true" aria-label="Match">
      <div id="gameModalContent"></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="gameModalClose" style="color:var(--ink);background:var(--paper);">Close</button>
      </div>
    </div>
  </div>

  <div class="toast-root" id="toastRoot" aria-live="polite"></div>

  <script type="module" src="./src/main.ts"></script>
</body>

</html>
````

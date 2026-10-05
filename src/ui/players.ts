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


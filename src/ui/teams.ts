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


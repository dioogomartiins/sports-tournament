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

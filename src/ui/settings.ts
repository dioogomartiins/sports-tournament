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

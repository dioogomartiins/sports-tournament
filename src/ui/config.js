import { state } from '../state.js';
import { escapeHtml, clamp } from '../utils.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Settings Form
// ---------------------------------------------------------------------------
export function populateConfigForm() {
  dom.cfgNome.value = state.config.nome;
  dom.cfgNumEquipas.value = state.config.numEquipas;
  dom.cfgNumGrupos.value = state.config.numGrupos || 1;
  dom.cfgNumVoltas.value = state.config.numVoltas;
  dom.cfgVitoria.value = state.config.pontosVitoria;
  dom.cfgEmpate.value = state.config.pontosEmpate;
  dom.cfgDerrota.value = state.config.pontosDerrota;
  dom.cfgBonus.value = state.config.bonusGoleada;
  dom.cfgGoleada.value = state.config.golosGoleada;
  dom.cfgMataMata.checked = state.config.mataMata || false;
  dom.cfgNumPlayoffTeams.value = state.config.numPlayoffTeams || 4;
}

export function renderScheduleHint() {
  const confN = clamp(parseInt(dom.cfgNumEquipas.value, 10) || state.config.numEquipas, 2, 32);
  const confV = clamp(parseInt(dom.cfgNumVoltas.value, 10) || state.config.numVoltas, 1, 20);
  let live = en.config.scheduleHintCurrent(
    escapeHtml(state.scheduleTeamCount),
    escapeHtml(state.scheduleVoltas),
    state.schedule.length,
  );

  if (confN !== state.scheduleTeamCount || confV !== state.scheduleVoltas) {
    live += en.config.scheduleHintConfigured(confN, confV);
  }

  dom.scheduleHint.innerHTML = live;
}

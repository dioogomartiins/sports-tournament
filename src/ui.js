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

  // Esconde "Adicionar Volta Extra" quando o torneio usa grupos (apenas Liga Única suportada)
  if (dom.btnAdicionarVolta) {
    const isLeague = (state.config.numGrupos || 1) === 1;
    dom.btnAdicionarVolta.style.display = isLeague ? '' : 'none';
  }

  if (state.config.mataMata && dom.btnGerarEliminatorias) {
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

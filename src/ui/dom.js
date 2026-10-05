// ---------------------------------------------------------------------------
// Cache de elementos DOM
// ---------------------------------------------------------------------------
export const dom = {};

export function cacheDom() {
  [
    'tournamentTitle', 'savePill', 'backupPill', 'marqueeTicker',
    'btnGerarCalendario', 'btnNovoTorneio', 'btnAtualizar', 'btnDarkMode', 'btnExportar', 'btnImportar', 'inputImportar',
    'btnMobileMenu', 'tabs',
    'btnAdicionarVolta', 'btnGerarEliminatorias', 'calendarActions',
    'dashboardPodium', 'dashboardStandings', 'dashboardStats', 'dashboardScorers',
    'cfgNome', 'cfgNumEquipas', 'cfgNumGrupos', 'cfgNumVoltas', 'cfgVitoria', 'cfgEmpate', 'cfgDerrota', 'cfgBonus', 'cfgGoleada', 'cfgSets', 'cfgGamesPerSet', 'cfgSuperTieBreak', 'scheduleHint',
    'cfgMataMata', 'cfgNumPlayoffTeams',
    'teamsList', 'squadTeamSelect', 'squadPlayerNum', 'squadPlayerFromDB', 'btnAddPlayerFromDB', 'btnDrawPairs', 'squadList',
    'calendarList', 'resultsList', 'standingsWrapper', 'statsGrid',
    'modalOverlay', 'modalTitle', 'modalBody', 'modalCancel', 'modalConfirm', 'toastRoot',
    'btnNewPlayer', 'playerSearchInput', 'playersList',
    'draftNomeA', 'draftNomeB', 'draftPlayerList', 'btnFazerDraft', 'draftResultCard', 'draftTeamsResult',
    'draftLabelA', 'draftLabelB', 'draftScoreA', 'draftScoreB', 'btnGuardarJogo',
    'singularHistoricoList',
    'btnConta', 'usersList', 'logList',
    'historicoSempre', 'arquivoList', 'btnArquivar', 'btnPartilharTabela',
    'cardTorneiosAtivos', 'listaTorneiosAtivos', 'btnNovoTorneioModal', 'headerSportBadge',
  ].forEach((id) => { dom[id] = document.getElementById(id); });

  dom.panels = Array.from(document.querySelectorAll('.panel'));
}

/** O perfil atual é admin ou master? (o mesmo que o CSS usa para esconder controlos) */
export function isAdminView() {
  return document.body.dataset.role === 'admin' || document.body.dataset.role === 'master';
}

/** O perfil atual é master? */
export function isMasterView() {
  return document.body.dataset.master === 'true' || document.body.dataset.role === 'master';
}

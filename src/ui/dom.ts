// ---------------------------------------------------------------------------
// DOM element cache
// ---------------------------------------------------------------------------
// Elements of index.html by id, looked up once at start-up. TypeScript callers
// read them with a cast (`dom.cfgNome as HTMLInputElement`).
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
    'cfgNome', 'cfgNumEquipas', 'cfgNumGrupos', 'cfgNumVoltas', 'cfgVitoria', 'cfgEmpate', 'cfgDerrota', 'cfgBonus', 'cfgGoleada', 'cfgSets', 'cfgGamesPerSet', 'cfgSuperTieBreak', 'scheduleHint',
    'cfgMataMata', 'cfgNumPlayoffTeams',
    'teamsList', 'squadTeamSelect', 'squadPlayerNum', 'squadPlayerFromDB', 'btnAddPlayerFromDB', 'btnDrawPairs', 'squadList',
    'calendarList', 'resultsList', 'standingsWrapper', 'statsCards', 'statsTable',
    'modalOverlay', 'modalTitle', 'modalBody', 'modalCancel', 'modalConfirm', 'toastRoot',
    'btnNewPlayer', 'playerSearchInput', 'playersList',
    'draftNomeA', 'draftNomeB', 'draftPlayerList', 'btnFazerDraft', 'draftResultCard', 'draftTeamsResult',
    'draftLabelA', 'draftLabelB', 'draftScoreA', 'draftScoreB', 'btnGuardarJogo',
    'singularHistoricoList',
    'btnConta', 'usersList', 'logList',
    'historicoSempre', 'arquivoList', 'btnArquivar', 'btnPartilharTabela',
    'cardTorneiosAtivos', 'listaTorneiosAtivos', 'btnNovoTorneioModal', 'headerSportBadge',
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

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

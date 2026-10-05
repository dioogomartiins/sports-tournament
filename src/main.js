import { state, persistConfigTeams, loadState, persistSchedule, persistResults, storeAllLayers, notifyPushError, currentTheme, setCurrentTheme, exportJSON, importJSON, applyGeneratedSchedule, applySnapshot, buildSnapshot, defaultTeams, defaultSquads, setStateHooks, setCurrentTournamentId, getCurrentTournamentId } from './state.js';
import { closeGameModal, openGameModal, animateResultChanges, dom, cacheDom, renderAll, refreshComputed, renderScheduleHint, renderSquadList, renderSquadsDropdown, flashError, flashBackup, renderCalendar, renderResults, showToast, flashSaved, openConfirm, closeConfirm, runConfirm, openDangerConfirm, switchTab, openScorerModal, openPlayerProfile, computeStatsSummary, renderPlayersList, openPlayerModal, renderSquadPlayerFromDBDropdown, renderAuth, renderUsers, renderLog, openPickPlayerModal, squadPickList, renderTournamentsList, openNovoTorneioModal, openDrawPairsModal, bindHistoryEvents, bindPlayersEvents, bindSingleMatchEvents } from './ui.js';
import { html } from 'lit';
import { clamp, numOr, buildPlayerIndex } from './utils.js';
import { shareStandings, shareResult } from './share.js';
import { bergerRounds, balancedPairs, buildFirstRoundSeeding, buildExtraVolta, buildArchiveEntry, GAME_STATUS } from './algorithms.js';
import { getSport, listSports } from './sports/registry.js';
import { initFirebaseListener, onFirebaseStateChange, onFirebasePushError, setSyncedSnapshot, initAuth, signInWithGoogle, signOutUser, getCurrentUser, getCurrentRole, getCurrentUserAdmin, listenUsers, listenLog, setUserRole, listenTournaments, createTournament, finishTournament, setActiveTournamentId } from './firebase.js';
import { roleLabel } from './permissions.js';
import { en } from './i18n/en.js';

// ---------------------------------------------------------------------------
// Handlers de configuração
// ---------------------------------------------------------------------------
export function onConfigFieldChange() {
  state.config.nome = dom.cfgNome.value.trim() || 'Tournament';
  state.config.pontosVitoria = numOr(dom.cfgVitoria.value, 3);
  state.config.pontosEmpate = numOr(dom.cfgEmpate.value, 1);
  state.config.pontosDerrota = numOr(dom.cfgDerrota.value, 0);
  state.config.bonusGoleada = numOr(dom.cfgBonus.value, 1);
  state.config.golosGoleada = numOr(dom.cfgGoleada.value, 3);
  state.config.setFormat = {
    sets: [1, 3, 5].includes(+dom.cfgSets.value) ? +dom.cfgSets.value : 3,
    gamesPerSet: clamp(parseInt(dom.cfgGamesPerSet.value, 10) || 6, 1, 9),
    superTieBreak: dom.cfgSuperTieBreak.checked,
  };
  state.config.mataMata = dom.cfgMataMata.checked;
  state.config.numPlayoffTeams = parseInt(dom.cfgNumPlayoffTeams.value, 10) || 4;
  state.config.numGrupos = parseInt(dom.cfgNumGrupos.value, 10) || 1;
  persistConfigTeams();
  refreshComputed();
}

export function onFormatFieldChange() {
  const n = clamp(parseInt(dom.cfgNumEquipas.value, 10) || state.config.numEquipas, 2, 32);
  const v = clamp(parseInt(dom.cfgNumVoltas.value, 10) || state.config.numVoltas, 1, 20);
  dom.cfgNumEquipas.value = n;
  dom.cfgNumVoltas.value = v;
  state.config.numEquipas = n;
  state.config.numVoltas = v;
  persistConfigTeams();
  renderScheduleHint();
}

// ---------------------------------------------------------------------------
// Handlers de equipas e plantéis
// ---------------------------------------------------------------------------
/** A team's name or colour changed in <teams-editor> (detail: { idx, prop, value }). */
function onTeamChange({ idx, prop, value }) {
  state.teams[idx][prop] = value;
  persistConfigTeams();
  renderSquadsDropdown();
  renderCalendar();
  renderResults();
  refreshComputed();
}

export function onAddPlayerFromDB() {
  const tIdx = dom.squadTeamSelect.value;
  const num = parseInt(dom.squadPlayerNum.value, 10);
  const pid = dom.squadPlayerFromDB.value;
  const numbered = currentSport().usesJerseyNumbers;

  if (!tIdx) { showToast(en.toasts.selectTeam, 'error'); return; }
  if (numbered && (isNaN(num) || num < 1)) { showToast(en.toasts.enterJerseyNumber, 'error'); return; }
  if (!numbered && state.squads[tIdx].length >= 2) { showToast(en.toasts.pairFull, 'error'); return; }
  if (!pid) { showToast(en.toasts.choosePlayerFromList, 'error'); return; }

  const player = state.players.find((p) => p.id === pid);
  if (!player) { showToast(en.toasts.playerNotFound, 'error'); return; }

  // Check if already in squad
  if (state.squads[tIdx].some((p) => p.id === pid)) {
    showToast(en.toasts.playerAlreadyInSquad, 'error');
    return;
  }

  // Without jersey numbers the number only keeps the squad order
  state.squads[tIdx].push({ id: player.id, num: numbered ? num : state.squads[tIdx].length + 1, name: player.nome });
  persistConfigTeams();
  dom.squadPlayerNum.value = '';
  dom.squadPlayerFromDB.value = '';
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
  showToast(en.toasts.playerAddedToSquad, 'ok');
}

/** Draws balanced pairs from the chosen players into the tournament's teams, in order. */
function onDrawPairs() {
  const sportId = currentSport().id;
  openDrawPairsModal((ids) => {
    const chosen = ids.map((id) => state.players.find((p) => p.id === id)).filter(Boolean);
    const { pairs } = balancedPairs(chosen, sportId);
    if (pairs.length !== state.scheduleTeamCount) return;
    const firstName = (p) => (p.nome || '').split(' ')[0];
    pairs.forEach((pair, i) => {
      state.squads[i] = pair.map((p, n) => ({ id: p.id, num: n + 1, name: p.nome }));
      state.teams[i].name = pair.map(firstName).join(' / ');
    });
    persistConfigTeams();
    renderAll();
    showToast(en.toasts.pairsDrawn, 'ok');
  });
}

function onSquadRemove(pid) {
  const tIdx = dom.squadTeamSelect.value;
  state.squads[tIdx] = state.squads[tIdx].filter((p) => p.id !== pid);
  persistConfigTeams();
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
}

// ---------------------------------------------------------------------------
// Handlers de resultados
// ---------------------------------------------------------------------------
/** Passa o vencedor de um jogo de eliminatória terminado para o jogo seguinte do bracket. */
function propagatePlayoffWinner(gi) {
  const game = state.schedule[gi];
  const winnerIdx = currentSport().getPlayoffWinner(game, state.results[gi], state.config);
  if (winnerIdx === null || !game.nextMatchId) return;

  const [targetMatchId, targetSide] = game.nextMatchId.split('_');
  const targetGame = state.schedule.find((g) => g.playoffMatchId === targetMatchId);
  if (targetGame && targetGame[targetSide] !== winnerIdx) {
    targetGame[targetSide] = winnerIdx;
    persistSchedule();
  }
}

/** Saves a match result and plays the change on every screen. */
function commitResult(gi, next) {
  if (next === state.results[gi]) return;
  state.results[gi] = next;
  propagatePlayoffWinner(gi);

  // Anima depois de gravar: se a gravação for recusada o estado já voltou atrás
  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

/** The sport of the tournament on screen. */
function currentSport() {
  return getSport(state.meta?.sport || state.config?.sport);
}

function changeGameStatus(gi, status) {
  commitResult(gi, currentSport().setGameStatus(state.results[gi], status));
}

/** Moves a match to the next status: scheduled → in progress → finished → scheduled. */
function onStatusClick(gi) {
  const res = state.results[gi];
  const current = (res && typeof res === 'object' && res.status) || 'agendado';
  const cycle = { agendado: 'decorrer', decorrer: 'terminado', terminado: 'agendado' };
  changeGameStatus(gi, cycle[current] ?? 'agendado');
}

/** Adds a point: in football asks for the scorer (and assist) first; in padel adds a game. */
function onGoalAdd(gi, side) {
  const sport = currentSport();
  if (sport.id !== 'football') {
    commitResult(gi, sport.addPoint(state.results[gi], side, state.config));
    return;
  }
  // O resultado é sempre calculado a partir do estado no momento de gravar:
  // entre o clique e a escolha do marcador pode chegar um golo de outro telemóvel.
  openScorerModal(gi, side, (pid) => {
    const game = state.schedule[gi];
    if (!game) return;
    const teamIdx = side === 'home' ? game.home : game.away;
    const registerGoal = (aid) => commitResult(gi, sport.addPoint(state.results[gi], side, state.config, pid, aid));

    // Autogolo não tem assistência
    if (pid === 'auto') registerGoal('');
    else openPickPlayerModal(en.singleMatch.pickAssistTitle, squadPickList(teamIdx, pid), en.singleMatch.noAssistLabel, registerGoal);
  });
}

function onGoalCancel(gi, side) {
  commitResult(gi, currentSport().removePoint(state.results[gi], side, state.config));
}

/** A − / + button of the results list (detail: { gi, side, action }). */
function onScoreStep({ gi, side, action }) {
  if (action === 'add') onGoalAdd(gi, side);
  else if (action === 'sub') onGoalCancel(gi, side);
}

export function onMvpClick(gi) {
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
function onScoreCommit({ gi, score, penalties }) {
  if (score === null) {
    if (!(gi in state.results)) return;
    delete state.results[gi];
  } else {
    if (!state.results[gi] || typeof state.results[gi] === 'string') {
      state.results[gi] = { score, scorers: { home: [], away: [] }, status: 'terminado' };
    } else {
      state.results[gi].score = score;
      if (state.results[gi].status === 'agendado') state.results[gi].status = 'terminado';
    }

    if (penalties) state.results[gi].penalties = penalties;
    else delete state.results[gi].penalties;

    // Propagar vencedor para o próximo jogo de playoff
    propagatePlayoffWinner(gi);
  }

  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

// ---------------------------------------------------------------------------
// Handlers de calendário / torneio
// ---------------------------------------------------------------------------
export function onGerarCalendario() {
  const n = clamp(parseInt(dom.cfgNumEquipas.value, 10) || state.config.numEquipas, 2, 32);
  const v = clamp(parseInt(dom.cfgNumVoltas.value, 10) || state.config.numVoltas, 1, 20);
  const hasResults = Object.keys(state.results).length > 0;
  const estimate = bergerRounds(n).reduce((s, r) => s + r.pairs.length, 0) * v;

  function doIt() {
    state.config.numEquipas = n;
    state.config.numVoltas = v;
    applyGeneratedSchedule(n, v, true);
    state.results = {};
    persistConfigTeams();
    persistSchedule();
    persistResults();
    renderAll();
    showToast(en.toasts.scheduleGenerated(state.schedule.length), 'ok');
  }

  const msgParts = [];
  if (hasResults) msgParts.push(en.confirmations.replaceScheduleWarn);
  if (estimate > 1500) msgParts.push(en.confirmations.largeScheduleWarn(estimate));
  msgParts.push(en.confirmations.teamsSquadsPreserved);

  if (hasResults || estimate > 1500) {
    openConfirm(en.confirmations.generateNewSchedule, msgParts.join(' '), doIt);
  } else {
    doIt();
  }
}

export function onNovoTorneio() {
  const chkResults = document.getElementById('chkDeleteResults');
  const chkSchedule = document.getElementById('chkDeleteSchedule');
  const chkTeams = document.getElementById('chkDeleteTeams');

  const delResults = chkResults && chkResults.checked;
  const delSchedule = chkSchedule && chkSchedule.checked;
  const delTeams = chkTeams && chkTeams.checked;

  if (!delResults && !delSchedule && !delTeams) {
    showToast(en.toasts.selectCategoryToDelete, 'error');
    return;
  }

  // Build summary labels
  const labels = [];
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
// Gestão de Torneios Ativos
// ---------------------------------------------------------------------------
const LAST_VIEWED_TOURNAMENT_KEY = 'torneio_last_viewed_tournament';

export function getLastViewedTournamentId() {
  try {
    return localStorage.getItem(LAST_VIEWED_TOURNAMENT_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function setLastViewedTournamentId(id) {
  try {
    if (id) {
      localStorage.setItem(LAST_VIEWED_TOURNAMENT_KEY, id);
    } else {
      localStorage.removeItem(LAST_VIEWED_TOURNAMENT_KEY);
    }
  } catch {
    // ignora em ambientes restritos
  }
}

let allTournaments = [];

export function getAllTournaments() {
  return allTournaments;
}

export function setAllTournaments(tourneys) {
  allTournaments = tourneys;
}

export function renderTournaments() {
  renderTournamentsList(allTournaments, getCurrentTournamentId());
}

export function onSelectTournament(id) {
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

export function onNovoTorneioModalClick() {
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

export function onTerminarTorneio(tid = getCurrentTournamentId()) {
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
      const names = {};
      Object.keys(index).forEach((pid) => { names[pid] = index[pid].name; });

      const entry = buildArchiveEntry(state, names, crypto.randomUUID(), new Date().toISOString());

      const res = await finishTournament(tid, entry);
      if (!res.ok) {
        showToast(en.toasts.errorFinishingTournament(res.reason || en.toasts.permissionDenied), 'error');
        return;
      }

      showToast(en.toasts.tournamentFinishedSuccess, 'ok');

      // Se o torneio terminado era o que estava a ser visualizado, muda para o próximo ativo
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

export function onArquivar() {
  onTerminarTorneio(getCurrentTournamentId());
}

export function onAtualizar() {
  renderAll();
  showToast(en.toasts.dashboardRefreshed, 'ok');
}

export function onAdicionarVolta() {
  if (!state.schedule.length) return;

  if ((state.config.numGrupos || 1) > 1) {
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
      state.config.numVoltas = novaVolta;
      if (dom.cfgNumVoltas) dom.cfgNumVoltas.value = novaVolta;
      persistConfigTeams();
      persistSchedule();
      renderAll();
      showToast(en.toasts.extraRoundAdded, 'ok');
    }
  );
}

// A cadeia completa de rondas, da maior para a menor.
// A ordem é sempre invariável: Oitavos → Quartos → Meias → Final.
// Para adicionar suporte a 32 equipas basta adicionar uma entrada no início.
const ROUND_CHAIN = [
  { prefix: 'OF', label: en.playoffs.roundOf16 },
  { prefix: 'QF', label: en.playoffs.quarterFinals },
  { prefix: 'MF', label: en.playoffs.semiFinals },
  { prefix: 'F', label: en.playoffs.final },
];

// Para N equipas, as rondas activas começam em: ROUND_CHAIN.length - log2(N)
// Ex: 16 equipas → índice 0 (começa nos Oitavos)
//      4 equipas → índice 2 (começa nas Meias-Finais)
//      2 equipas → índice 3 (começa na Final)

/**
 * Gera o bracket completo de eliminatórias de forma algorítmica.
 *
 * Lógica de seeding da 1ª ronda: emparelha o seed mais alto com o mais
 * baixo em cada par da metade do bracket (1 vs N, N/2 vs N/2+1, 2 vs N-1, …)
 * — padrão UEFA/FIFA para evitar que as melhores equipas se cruzem cedo.
 *
 * Rondas seguintes: os slots home/away ficam como placeholders "Vencedor Xn"
 * e são preenchidos em runtime quando os resultados são introduzidos.
 *
 * @param {number}   teamCount - Número total de equipas no bracket (potência de 2, max 16)
 * @param {object[]} seeds     - Array de equipas ordenado por seed (índice 0 = 1º)
 * @returns {{ games: object[], rounds: object[] }}
 */
function buildPlayoffBracket(teamCount, seeds) {
  const startIndex = ROUND_CHAIN.length - Math.log2(teamCount);
  if (!Number.isInteger(startIndex) || startIndex < 0) return { games: [], rounds: [] };

  const roundDefs = ROUND_CHAIN.slice(startIndex);


  const games = [];
  const rounds = [];

  // Ordem de seeding da 1ª ronda para evitar confrontos prematuros entre os melhores:
  // Num bracket de N equipas, emparelha: [0 vs N-1], [N/2-1 vs N/2], [1 vs N-2], [N/2-2 vs N/2+1], …
  const firstRoundSeeding = buildFirstRoundSeeding(teamCount);

  roundDefs.forEach((roundDef, roundIndex) => {
    const { prefix, label } = roundDef;
    const next = roundDefs[roundIndex + 1]?.prefix ?? null;
    const matchCount = teamCount / Math.pow(2, roundIndex + 1);

    rounds.push({ jornada: label, bye: null });

    for (let i = 0; i < matchCount; i++) {
      const matchId = `${prefix}${i + 1}`;
      const nextMatchId = next ? `${next}${Math.floor(i / 2) + 1}_${i % 2 === 0 ? 'home' : 'away'}` : null;

      let home, away;

      if (roundIndex === 0) {
        // 1ª ronda: usa o seeding real
        const [seedA, seedB] = firstRoundSeeding[i];
        home = seeds[seedA].idx;
        away = seeds[seedB].idx;
      } else {
        // Rondas seguintes: placeholders que são preenchidos em runtime
        const prevPrefix = roundDefs[roundIndex - 1].prefix;
        home = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 1);
        away = en.playoffs.winnerPlaceholder(prevPrefix, i * 2 + 2);
      }

      games.push({ jornada: label, home, away, isPlayoff: true, playoffMatchId: matchId, nextMatchId });
    }
  });

  return { games, rounds };
}

export function onGerarEliminatorias() {
  const summary = computeStatsSummary();
  const numPlayoffTeamsPerGroup = state.config.numPlayoffTeams || 4;
  const numGrupos = state.config.numGrupos || 1;
  const totalPlayoffTeams = numPlayoffTeamsPerGroup * numGrupos;

  if (totalPlayoffTeams > 16) {
    showToast(en.playoffs.maxTeamsError, 'error');
    return;
  }

  const startIndex = ROUND_CHAIN.length - Math.log2(totalPlayoffTeams);
  if (!Number.isInteger(startIndex) || startIndex < 0) {
    showToast(en.playoffs.configNotSupported(totalPlayoffTeams), 'error');
    return;
  }

  const ok = summary.groupsData.every((g) => g.standings.length >= numPlayoffTeamsPerGroup);
  if (!ok) {
    showToast(en.playoffs.notEnoughTeamsInGroup(numPlayoffTeamsPerGroup), 'error');
    return;
  }

  // Selecciona equipas por posição (intercalando grupos: 1ºA, 1ºB, 2ºA, 2ºB, …)
  const topTeams = [];
  for (let pos = 0; pos < numPlayoffTeamsPerGroup; pos++) {
    for (let g = 0; g < numGrupos; g++) {
      topTeams.push(summary.groupsData[g].standings[pos]);
    }
  }

  const { games: newGames, rounds: newRounds } = buildPlayoffBracket(totalPlayoffTeams, topTeams);

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
// Sessão (Google) e administração
// ---------------------------------------------------------------------------
let stopAdminListeners = null;

export function onContaClick() {
  if (!getCurrentUser()) {
    signInWithGoogle().catch((err) => {
      if (err && err.code === 'auth/popup-closed-by-user') return;
      console.error('Erro ao entrar:', err);
      showToast(en.toasts.couldNotSignInGoogle, 'error');
    });
    return;
  }
  // No telemóvel o botão só mostra 👤, por isso a confirmação diz quem tem a sessão
  const user = getCurrentUser();
  const quem = `${user.displayName || user.email || ''} (${roleLabel(getCurrentRole(), getCurrentUserAdmin())})`;
  openConfirm(en.modals.signOutTitle, en.modals.signOutPrompt(quem), () => {
    signOutUser();
  });
}

function onAuthChange({ user, role, admin }) {
  renderAuth(user, role, admin);

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
export function onUserRoleChange({ uid, name: nome, role, sportAdmins }) {
  setUserRole(uid, role, sportAdmins, nome)
    .then(() => showToast(en.toasts.roleUpdated, 'ok'))
    .catch((err) => {
      console.error('Erro ao mudar perfil:', err);
      showToast(en.toasts.couldNotUpdateRole, 'error');
    });
}

// ---------------------------------------------------------------------------
// Telemóvel: painel "Mais" (abre de baixo a partir da pílula de navegação)
// ---------------------------------------------------------------------------
function bindMenuDrawer() {
  const drawer = document.getElementById('tabs');
  const btnMenu = document.getElementById('btnMobileMenu');
  const btnClose = document.getElementById('btnFecharMenu');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer || !btnMenu || !backdrop) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const isOpen = () => drawer.classList.contains('menu-open');
  const setOpen = (open) => drawer.classList.toggle('menu-open', open);

  // switchTab também fecha o painel: o aria-expanded segue a classe
  new MutationObserver(() => btnMenu.setAttribute('aria-expanded', String(isOpen())))
    .observe(drawer, { attributes: true, attributeFilter: ['class'] });

  btnMenu.addEventListener('click', () => setOpen(!isOpen()));
  if (btnClose) btnClose.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
}

// ---------------------------------------------------------------------------
// Binding de eventos e inicialização
// ---------------------------------------------------------------------------
export function bindEvents() {
  bindMenuDrawer();
  bindHistoryEvents();
  bindPlayersEvents();
  bindSingleMatchEvents();

  Array.from(document.querySelectorAll('.tab')).forEach((btn) => {
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
    if (!e.target.closest('.dropdown')) {
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

  // Tema dark/light
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

  // Plantéis — agora com dropdown da BD
  dom.squadTeamSelect.addEventListener('change', () => {
    renderSquadList();
    renderSquadPlayerFromDBDropdown();
  });
  dom.btnAddPlayerFromDB.addEventListener('click', onAddPlayerFromDB);
  dom.btnDrawPairs.addEventListener('click', onDrawPairs);
  dom.squadList.addEventListener('squad-remove', (e) => onSquadRemove(e.detail));
  dom.squadList.addEventListener('player-stats', (e) => openPlayerProfile(e.detail, Number(dom.squadTeamSelect.value)));

  // Lit components emit their events to the container element
  dom.teamsList.addEventListener('team-change', (e) => onTeamChange(e.detail));
  // <schedule-list> and <results-list> (detail: the match gi, or an object with it)
  [dom.calendarList, dom.resultsList].forEach((list) => {
    list.addEventListener('open-match', (e) => openGameModal(e.detail));
    list.addEventListener('status-click', (e) => onStatusClick(e.detail));
  });
  dom.resultsList.addEventListener('score-step', (e) => onScoreStep(e.detail));
  dom.resultsList.addEventListener('score-commit', (e) => onScoreCommit(e.detail));

  // Conta e administração
  dom.btnConta.addEventListener('click', onContaClick);
  dom.usersList.addEventListener('role-change', (e) => onUserRoleChange(e.detail));

  // Exportar / Importar
  dom.btnExportar.addEventListener('click', exportJSON);
  dom.btnImportar.addEventListener('click', () => { dom.inputImportar.value = ''; dom.inputImportar.click(); });
  dom.inputImportar.addEventListener('change', () => { importJSON(dom.inputImportar.files[0]); });

  // Configuração
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
  dom.cfgMataMata.addEventListener('change', onConfigFieldChange);
  dom.cfgNumPlayoffTeams.addEventListener('change', onConfigFieldChange);

  // Janela do jogo
  const gameOverlay = document.getElementById('gameOverlay');
  document.getElementById('gameModalClose').addEventListener('click', closeGameModal);
  // Events from <football-score> (detail: { gi, side })
  const gameModalContent = document.getElementById('gameModalContent');
  gameModalContent.addEventListener('point', (e) => onGoalAdd(e.detail.gi, e.detail.side));
  gameModalContent.addEventListener('cancelled', (e) => onGoalCancel(e.detail.gi, e.detail.side));
  gameModalContent.addEventListener('started', (e) => changeGameStatus(e.detail.gi, GAME_STATUS.DECORRER));
  gameModalContent.addEventListener('finished', (e) => changeGameStatus(e.detail.gi, GAME_STATUS.TERMINADO));
  gameModalContent.addEventListener('mvp', (e) => onMvpClick(e.detail.gi));
  gameModalContent.addEventListener('share', (e) => shareResult(e.detail.gi));
  gameOverlay.addEventListener('click', (e) => { if (e.target === gameOverlay) closeGameModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gameOverlay.hidden) closeGameModal(); });

  // Modal
  dom.modalCancel.addEventListener('click', closeConfirm);
  dom.modalConfirm.addEventListener('click', runConfirm);
  dom.modalOverlay.addEventListener('click', (e) => { if (e.target === dom.modalOverlay) closeConfirm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dom.modalOverlay.hidden) closeConfirm(); });

  // Jogadores BD
  if (dom.btnNewPlayer) dom.btnNewPlayer.addEventListener('click', () => openPlayerModal(null));
  if (dom.playerSearchInput) {
    dom.playerSearchInput.addEventListener('input', renderPlayersList);
  }

  // Torneios
  if (dom.btnNovoTorneioModal) dom.btnNovoTorneioModal.addEventListener('click', onNovoTorneioModalClick);
  dom.listaTorneiosAtivos.addEventListener('tournament-select', (e) => onSelectTournament(e.detail));
  dom.listaTorneiosAtivos.addEventListener('tournament-finish', (e) => onTerminarTorneio(e.detail));
}

// ---------------------------------------------------------------------------
// Atualizações vindas do Firebase
// ---------------------------------------------------------------------------
let renderPending = false;

/** Há um campo de texto ou número com foco (alguém a escrever)? */
function isEditingField() {
  const el = document.activeElement;
  if (!el || el.closest('.modal-overlay')) return false;
  if (el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'file'].includes(el.type);
}

/** Redesenha já, ou quando a pessoa sair do campo onde está a escrever. */
function renderWhenIdle() {
  if (isEditingField()) { renderPending = true; return; }
  renderPending = false;
  renderAll();
  renderTournaments();
}

export async function init() {
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
      // Na primeira leitura só regista o estado: não anima o que mudou com a app fechada
      animateResultChanges({ silent: isFirstLoad });
    }
  });

  listenTournaments((tournaments) => {
    allTournaments = tournaments;
    const currentId = getCurrentTournamentId();
    const activeTournaments = tournaments.filter((t) => t.status === 'active');

    // Se o torneio atual não for ativo mas existirem torneios ativos, muda para o primeiro ativo
    if (activeTournaments.length > 0 && !activeTournaments.some((t) => t.id === currentId)) {
      onSelectTournament(activeTournaments[0].id);
      return;
    }

    renderTournaments();
  });

  // Quem está a escrever num campo grava ao sair dele; só depois se redesenha
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

// Ponto de entrada
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

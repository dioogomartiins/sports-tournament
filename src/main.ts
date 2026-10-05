import { state, loadedConfig, loadedTeams, loadedSquads, persistConfigTeams, loadState, persistSchedule, persistResults, storeAllLayers, notifyPushError, currentTheme, setCurrentTheme, exportJSON, importJSON, applyGeneratedSchedule, applyRotationSchedule, applySnapshot, buildSnapshot, defaultTeams, defaultSquads, setStateHooks, setCurrentTournamentId, getCurrentTournamentId } from './state.js';
import { closeGameModal, openGameModal, animateResultChanges, dom, cacheDom, renderAll, refreshComputed, renderScheduleHint, renderSquadList, renderSquadsDropdown, flashError, flashBackup, renderCalendar, renderResults, showToast, flashSaved, openConfirm, closeConfirm, runConfirm, openDangerConfirm, switchTab, openScorerModal, openPlayerProfile, computeStatsSummary, renderPlayersList, openPlayerModal, renderSquadPlayerFromDBDropdown, renderAuth, renderUsers, renderLog, openPickPlayerModal, squadPickList, renderTournamentsList, openNovoTorneioModal, openDrawPairsModal, openRotationPlayersModal, bindHistoryEvents, bindPlayersEvents, bindSingleMatchEvents, fieldValue, setFieldValue, isChecked, onEvent } from './ui.js';
import { html } from 'lit';
import { clamp, numOr, buildPlayerIndex } from './utils.js';
import { shareStandings, shareResult } from './share.js';
import { bergerRounds, balancedPairs, buildExtraVolta, buildArchiveEntry, GAME_STATUS } from './algorithms.js';
import { buildPlayoffBracket, firstRoundIndex, playoffSeeds, advanceWinner } from './core/playoffs.js';
import { americanoRounds, mexicanoRound, rotationSchedule, lastRoundFinished, isRotationFormat, validPlayerCount, type RotationFormat, type RotationMatch } from './core/americano.js';
import { getPlayerRating } from './core/draft.js';
import { Padel, DEFAULT_MATCH_POINTS } from './sports/padel/Padel.js';
import type { Sport } from './sports/Sport.js';
import type { GameStatus, MatchResult, Player, Score } from './types.js';
import type { AuthInfo, TournamentListing } from './firebase.js';
import type { ScoreEvent, ScoreSide as Side } from './components/ScoreBase.js';
import type { ScoreStep, ScoreCommit } from './components/ResultsList.js';
import type { TeamChange } from './components/TeamsEditor.js';
import type { RoleChange } from './components/UserList.js';
import { getSport, listSports } from './sports/registry.js';
import { initFirebaseListener, onFirebaseStateChange, onFirebasePushError, setSyncedSnapshot, initAuth, signInWithGoogle, signOutUser, getCurrentUser, getCurrentRole, getCurrentUserAdmin, listenUsers, listenLog, setUserRole, listenTournaments, createTournament, finishTournament, setActiveTournamentId } from './firebase.js';
import { roleLabel } from './permissions.js';
import { en } from './i18n/en.js';

// ---------------------------------------------------------------------------
// Settings handlers
// ---------------------------------------------------------------------------
export function onConfigFieldChange(): void {
  const config = loadedConfig();
  config.nome = fieldValue('cfgNome').trim() || en.common.tournament;
  config.pontosVitoria = numOr(fieldValue('cfgVitoria'), 3);
  config.pontosEmpate = numOr(fieldValue('cfgEmpate'), 1);
  config.pontosDerrota = numOr(fieldValue('cfgDerrota'), 0);
  config.bonusGoleada = numOr(fieldValue('cfgBonus'), 1);
  config.golosGoleada = numOr(fieldValue('cfgGoleada'), 3);
  config.setFormat = {
    sets: [1, 3, 5].includes(+fieldValue('cfgSets')) ? +fieldValue('cfgSets') : 3,
    gamesPerSet: clamp(parseInt(fieldValue('cfgGamesPerSet'), 10) || 6, 1, 9),
    superTieBreak: isChecked('cfgSuperTieBreak'),
  };
  config.mataMata = isChecked('cfgMataMata');
  config.numPlayoffTeams = parseInt(fieldValue('cfgNumPlayoffTeams'), 10) || 4;
  config.numGrupos = parseInt(fieldValue('cfgNumGrupos'), 10) || 1;
  const padelFormat = fieldValue('cfgPadelFormat');
  config.padelFormat = isRotationFormat(padelFormat) ? padelFormat : 'pairs';
  config.matchPoints = clamp(parseInt(fieldValue('cfgMatchPoints'), 10) || DEFAULT_MATCH_POINTS, 4, 99);
  persistConfigTeams();
  refreshComputed();
}

export function onFormatFieldChange(): void {
  const config = loadedConfig();
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || config.numEquipas, 2, 32);
  const v = clamp(parseInt(fieldValue('cfgNumVoltas'), 10) || config.numVoltas, 1, 20);
  setFieldValue('cfgNumEquipas', n);
  setFieldValue('cfgNumVoltas', v);
  config.numEquipas = n;
  config.numVoltas = v;
  persistConfigTeams();
  renderScheduleHint();
}

// ---------------------------------------------------------------------------
// Team and squad handlers
// ---------------------------------------------------------------------------
/** A team's name or colour changed in <teams-editor> (detail: { idx, prop, value }). */
function onTeamChange({ idx, prop, value }: TeamChange): void {
  loadedTeams()[idx][prop] = value;
  persistConfigTeams();
  renderSquadsDropdown();
  renderCalendar();
  renderResults();
  refreshComputed();
}

export function onAddPlayerFromDB(): void {
  const tIdx = Number(fieldValue('squadTeamSelect'));
  const num = parseInt(fieldValue('squadPlayerNum'), 10);
  const pid = fieldValue('squadPlayerFromDB');
  const numbered = currentSport().usesJerseyNumbers;

  if (!fieldValue('squadTeamSelect')) { showToast(en.toasts.selectTeam, 'error'); return; }
  if (numbered && (isNaN(num) || num < 1)) { showToast(en.toasts.enterJerseyNumber, 'error'); return; }
  if (!numbered && loadedSquads()[tIdx].length >= 2) { showToast(en.toasts.pairFull, 'error'); return; }
  if (!pid) { showToast(en.toasts.choosePlayerFromList, 'error'); return; }

  const player = state.players.find((p) => p.id === pid);
  if (!player) { showToast(en.toasts.playerNotFound, 'error'); return; }

  // Check if already in squad
  if (loadedSquads()[tIdx].some((p) => p.id === pid)) {
    showToast(en.toasts.playerAlreadyInSquad, 'error');
    return;
  }

  // Without jersey numbers the number only keeps the squad order
  loadedSquads()[tIdx].push({ id: player.id, num: numbered ? num : loadedSquads()[tIdx].length + 1, name: player.nome });
  persistConfigTeams();
  setFieldValue('squadPlayerNum', '');
  setFieldValue('squadPlayerFromDB', '');
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
  showToast(en.toasts.playerAddedToSquad, 'ok');
}

/** Draws balanced pairs from the chosen players into the tournament's teams, in order. */
function onDrawPairs(): void {
  if (rotationFormat()) { showToast(en.toasts.rotationNoPairs, 'error'); return; }
  const sportId = currentSport().id;
  openDrawPairsModal((ids) => {
    const chosen = ids.map((id) => state.players.find((p) => p.id === id)).filter((p): p is Player => !!p);
    const { pairs } = balancedPairs(chosen, sportId);
    if (pairs.length !== state.scheduleTeamCount) return;
    const firstName = (p: Player) => (p.nome || '').split(' ')[0];
    pairs.forEach((pair, i) => {
      loadedSquads()[i] = pair.map((p, n) => ({ id: p.id, num: n + 1, name: p.nome }));
      loadedTeams()[i].name = pair.map(firstName).join(' / ');
    });
    persistConfigTeams();
    renderAll();
    showToast(en.toasts.pairsDrawn, 'ok');
  });
}

function onSquadRemove(pid: string): void {
  const tIdx = Number(fieldValue('squadTeamSelect'));
  loadedSquads()[tIdx] = loadedSquads()[tIdx].filter((p) => p.id !== pid);
  persistConfigTeams();
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
}

// ---------------------------------------------------------------------------
// Result handlers
// ---------------------------------------------------------------------------
/** Moves the winner of a finished knockout match into the next match of the bracket. */
function propagatePlayoffWinner(gi: number): void {
  const game = state.schedule[gi];
  if (!game) return;
  const winnerIdx = currentSport().getPlayoffWinner(game, state.results[gi], loadedConfig());
  if (winnerIdx !== null && advanceWinner(state.schedule, game, winnerIdx)) persistSchedule();
}

/** Saves a match result and plays the change on every screen. */
function commitResult(gi: number, next: MatchResult | undefined): void {
  if (next === state.results[gi]) return;
  if (next === undefined) delete state.results[gi];
  else state.results[gi] = next;
  propagatePlayoffWinner(gi);

  // Animate after saving: if the save is refused the state has already been rolled back
  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

/** The sport of the tournament on screen. */
function currentSport(): Sport {
  return getSport(state.meta?.sport || state.config?.sport);
}

/** Americano or Mexicano when the tournament on screen rotates padel partners, else null. */
function rotationFormat(): RotationFormat | null {
  const sport = currentSport();
  return sport instanceof Padel ? sport.rotation(state.config) : null;
}

/** Player slots ordered by their padel rating, best first (Mexicano's first round). */
function ratingRanking(n: number): number[] {
  const rating = (i: number) => {
    const id = state.squads?.[i]?.[0]?.id;
    return getPlayerRating(state.players.find((p) => p.id === id), 'padel');
  };
  return Array.from({ length: n }, (_, i) => i).sort((a, b) => rating(b) - rating(a) || a - b);
}

/** Americano / Mexicano: one player from the database in each of the first n team slots. */
function onPickRotationPlayers(): void {
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || loadedConfig().numEquipas, 2, 32);
  if (!validPlayerCount(n)) { showToast(en.toasts.rotationPlayerCount, 'error'); return; }
  openRotationPlayersModal(n, (ids) => {
    const teams = loadedTeams();
    const squads = loadedSquads();
    ids.forEach((id, i) => {
      const p = state.players.find((x) => x.id === id);
      if (!p) return;
      teams[i].name = p.nome;
      squads[i] = [{ id: p.id, num: 1, name: p.nome }];
    });
    persistConfigTeams();
    renderAll();
    showToast(en.toasts.rotationPlayersSet(ids.length), 'ok');
  });
}

function changeGameStatus(gi: number, status: GameStatus): void {
  commitResult(gi, currentSport().setGameStatus(state.results[gi], status));
}

/** Moves a match to the next status: scheduled → in progress → finished → scheduled. */
function onStatusClick(gi: number): void {
  const res = state.results[gi];
  const current = (res && typeof res === 'object' && res.status) || 'agendado';
  const cycle: Record<string, GameStatus> = { agendado: 'decorrer', decorrer: 'terminado', terminado: 'agendado' };
  changeGameStatus(gi, cycle[current] ?? 'agendado');
}

/** Adds a point: in football asks for the scorer (and assist) first; in padel adds a game. */
function onGoalAdd(gi: number, side: Side): void {
  const sport = currentSport();
  if (sport.id !== 'football') {
    commitResult(gi, sport.addPoint(state.results[gi], side, loadedConfig()));
    return;
  }
  // The result is always worked out from the state at save time: a goal from
  // another phone can arrive between the click and picking the scorer.
  openScorerModal(gi, side, (pid) => {
    const game = state.schedule[gi];
    if (!game) return;
    const teamIdx = side === 'home' ? game.home : game.away;
    const registerGoal = (aid: string) => commitResult(gi, sport.addPoint(state.results[gi], side, loadedConfig(), pid, aid));

    // An own goal has no assist
    if (pid === 'auto') registerGoal('');
    else openPickPlayerModal(en.singleMatch.pickAssistTitle, squadPickList(teamIdx, pid), en.singleMatch.noAssistLabel, registerGoal);
  });
}

function onGoalCancel(gi: number, side: Side): void {
  commitResult(gi, currentSport().removePoint(state.results[gi], side, loadedConfig()));
}

/** A − / + button of the results list (detail: { gi, side, action }). */
function onScoreStep({ gi, side, action }: ScoreStep): void {
  if (action === 'add') onGoalAdd(Number(gi), side);
  else if (action === 'sub') onGoalCancel(Number(gi), side);
}

export function onMvpClick(gi: number): void {
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
function onScoreCommit({ gi: key, score, penalties }: ScoreCommit): void {
  const gi = Number(key);
  if (score === null) {
    if (!(gi in state.results)) return;
    delete state.results[gi];
  } else {
    const prev = state.results[gi];
    const res: Score = prev && typeof prev === 'object' ? prev : { score, scorers: { home: [], away: [] }, status: 'terminado' };
    res.score = score;
    if (res.status === 'agendado') res.status = 'terminado';
    if (penalties) res.penalties = penalties;
    else delete res.penalties;
    state.results[gi] = res;

    propagatePlayoffWinner(gi);
  }

  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

// ---------------------------------------------------------------------------
// Schedule and tournament handlers
// ---------------------------------------------------------------------------
export function onGerarCalendario(): void {
  const config = loadedConfig();
  const n = clamp(parseInt(fieldValue('cfgNumEquipas'), 10) || loadedConfig().numEquipas, 2, 32);
  const v = clamp(parseInt(fieldValue('cfgNumVoltas'), 10) || loadedConfig().numVoltas, 1, 20);
  const hasResults = Object.keys(state.results).length > 0;
  const estimate = bergerRounds(n).reduce((s, r) => s + r.pairs.length, 0) * v;
  const rotation = rotationFormat();
  if (rotation && !validPlayerCount(n)) { showToast(en.toasts.rotationPlayerCount, 'error'); return; }

  function doIt() {
    config.numEquipas = n;
    config.numVoltas = v;
    if (rotation) applyRotationSchedule(rotation, n, v, ratingRanking(n));
    else applyGeneratedSchedule(n, v, true);
    state.results = {};
    persistConfigTeams();
    persistSchedule();
    persistResults();
    renderAll();
    showToast(en.toasts.scheduleGenerated(state.schedule.length), 'ok');
  }

  const msgParts: string[] = [];
  if (hasResults) msgParts.push(en.confirmations.replaceScheduleWarn);
  if (estimate > 1500) msgParts.push(en.confirmations.largeScheduleWarn(estimate));
  msgParts.push(en.confirmations.teamsSquadsPreserved);

  if (hasResults || estimate > 1500) {
    openConfirm(en.confirmations.generateNewSchedule, msgParts.join(' '), doIt);
  } else {
    doIt();
  }
}

export function onNovoTorneio(): void {
  const ticked = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.checked ?? false;
  const delResults = ticked('chkDeleteResults');
  const delSchedule = ticked('chkDeleteSchedule');
  const delTeams = ticked('chkDeleteTeams');

  if (!delResults && !delSchedule && !delTeams) {
    showToast(en.toasts.selectCategoryToDelete, 'error');
    return;
  }

  // Build summary labels
  const labels: string[] = [];
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
// Active tournaments
// ---------------------------------------------------------------------------
const LAST_VIEWED_TOURNAMENT_KEY = 'torneio_last_viewed_tournament';

export function getLastViewedTournamentId(): string {
  try {
    return localStorage.getItem(LAST_VIEWED_TOURNAMENT_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function setLastViewedTournamentId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(LAST_VIEWED_TOURNAMENT_KEY, id);
    } else {
      localStorage.removeItem(LAST_VIEWED_TOURNAMENT_KEY);
    }
  } catch {
    // ignore in restricted environments
  }
}

let allTournaments: TournamentListing[] = [];

export function getAllTournaments(): TournamentListing[] {
  return allTournaments;
}

export function setAllTournaments(tourneys: TournamentListing[]): void {
  allTournaments = tourneys;
}

export function renderTournaments(): void {
  renderTournamentsList(allTournaments, getCurrentTournamentId());
}

export function onSelectTournament(id: string): void {
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

export function onNovoTorneioModalClick(): void {
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

export function onTerminarTorneio(tid: string = getCurrentTournamentId()): void {
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
      const names: Record<string, string> = {};
      Object.keys(index).forEach((pid) => { names[pid] = index[pid].name; });

      const entry = buildArchiveEntry({ ...state, meta: state.meta ?? undefined, config: loadedConfig(), teams: loadedTeams() }, names, crypto.randomUUID(), new Date().toISOString());

      const res = await finishTournament(tid, entry);
      if (!res.ok) {
        showToast(en.toasts.errorFinishingTournament(('reason' in res && res.reason) || en.toasts.permissionDenied), 'error');
        return;
      }

      showToast(en.toasts.tournamentFinishedSuccess, 'ok');

      // If the finished tournament was the one on screen, switch to the next active one
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

export function onArquivar(): void {
  onTerminarTorneio(getCurrentTournamentId());
}

export function onAtualizar(): void {
  renderAll();
  showToast(en.toasts.dashboardRefreshed, 'ok');
}

export function onAdicionarVolta(): void {
  if (!state.schedule.length) return;
  const rotation = rotationFormat();
  if (rotation) { addRotationRound(rotation); return; }

  if ((loadedConfig().numGrupos || 1) > 1) {
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
      loadedConfig().numVoltas = novaVolta;
      setFieldValue('cfgNumVoltas', novaVolta);
      persistConfigTeams();
      persistSchedule();
      renderAll();
      showToast(en.toasts.extraRoundAdded, 'ok');
    }
  );
}

/** Americano: plays every partner rotation once more. Mexicano: draws the next round from the standings. */
function addRotationRound(format: RotationFormat): void {
  const n = state.scheduleTeamCount;
  const last = state.roundsMeta.reduce((m, r) => Math.max(m, Number(r.jornada) || 0), 0);
  const append = (rounds: RotationMatch[][]) => {
    const { games, rounds: meta } = rotationSchedule(rounds, last + 1);
    state.schedule = state.schedule.concat(games);
    state.roundsMeta = state.roundsMeta.concat(meta);
    persistSchedule();
    renderAll();
  };

  if (format === 'mexicano') {
    if (!lastRoundFinished(state.schedule, state.results)) { showToast(en.toasts.mexicanoRoundPending, 'error'); return; }
    const ranking = computeStatsSummary().groupsData[0]?.standings.map((s) => s.idx) || [];
    append([mexicanoRound(ranking)]);
    showToast(en.toasts.mexicanoRoundAdded(last + 1), 'ok');
    return;
  }

  const novaVolta = state.scheduleVoltas + 1;
  openConfirm(en.confirmations.addExtraRoundTitle, en.confirmations.addExtraRoundPrompt(novaVolta), () => {
    state.scheduleVoltas = novaVolta;
    loadedConfig().numVoltas = novaVolta;
    setFieldValue('cfgNumVoltas', novaVolta);
    persistConfigTeams();
    append(americanoRounds(n));
    showToast(en.toasts.extraRoundAdded, 'ok');
  });
}

export function onGerarEliminatorias(): void {
  if (rotationFormat()) { showToast(en.toasts.rotationNoPlayoffs, 'error'); return; }
  const summary = computeStatsSummary();
  const numPlayoffTeamsPerGroup = loadedConfig().numPlayoffTeams || 4;
  const numGrupos = loadedConfig().numGrupos || 1;
  const totalPlayoffTeams = numPlayoffTeamsPerGroup * numGrupos;

  if (totalPlayoffTeams > 16) {
    showToast(en.playoffs.maxTeamsError, 'error');
    return;
  }

  if (firstRoundIndex(totalPlayoffTeams) === null) {
    showToast(en.playoffs.configNotSupported(totalPlayoffTeams), 'error');
    return;
  }

  // Teams by position, alternating groups: 1st A, 1st B, 2nd A, 2nd B, …
  const seeds = playoffSeeds(summary.groupsData, numPlayoffTeamsPerGroup);
  if (!seeds) {
    showToast(en.playoffs.notEnoughTeamsInGroup(numPlayoffTeamsPerGroup), 'error');
    return;
  }

  const { games: newGames, rounds: newRounds } = buildPlayoffBracket(totalPlayoffTeams, seeds);

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
// Session (Google) and administration
// ---------------------------------------------------------------------------
let stopAdminListeners: (() => void) | null = null;

export function onContaClick(): void {
  const user = getCurrentUser();
  if (!user) {
    signInWithGoogle().catch((err) => {
      if (err && err.code === 'auth/popup-closed-by-user') return;
      console.error('Sign-in failed:', err);
      showToast(en.toasts.couldNotSignInGoogle, 'error');
    });
    return;
  }
  // On a phone the button only shows 👤, so the prompt says who is signed in
  const quem = `${user.displayName || user.email || ''} (${roleLabel(getCurrentRole(), getCurrentUserAdmin())})`;
  openConfirm(en.modals.signOutTitle, en.modals.signOutPrompt(quem), () => {
    signOutUser();
  });
}

function onAuthChange({ user, role, admin }: AuthInfo): void {
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
export function onUserRoleChange({ uid, name: nome, role, sportAdmins }: RoleChange): void {
  setUserRole(uid, role, sportAdmins, nome)
    .then(() => showToast(en.toasts.roleUpdated, 'ok'))
    .catch((err) => {
      console.error('Role change failed:', err);
      showToast(en.toasts.couldNotUpdateRole, 'error');
    });
}

// ---------------------------------------------------------------------------
// Phone: the "More" drawer (opens from the bottom, from the navigation pill)
// ---------------------------------------------------------------------------
function bindMenuDrawer(): void {
  const drawer = document.getElementById('tabs');
  const btnMenu = document.getElementById('btnMobileMenu');
  const btnClose = document.getElementById('btnFecharMenu');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer || !btnMenu || !backdrop) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const isOpen = () => drawer.classList.contains('menu-open');
  const setOpen = (open: boolean) => drawer.classList.toggle('menu-open', open);

  // switchTab also closes the drawer: aria-expanded follows the class
  new MutationObserver(() => btnMenu.setAttribute('aria-expanded', String(isOpen())))
    .observe(drawer, { attributes: true, attributeFilter: ['class'] });

  btnMenu.addEventListener('click', () => setOpen(!isOpen()));
  if (btnClose) btnClose.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
}

// ---------------------------------------------------------------------------
// Event binding and start-up
// ---------------------------------------------------------------------------
export function bindEvents(): void {
  bindMenuDrawer();
  bindHistoryEvents();
  bindPlayersEvents();
  bindSingleMatchEvents();

  document.querySelectorAll<HTMLElement>('.tab').forEach((btn) => {
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
    if (!(e.target as Element | null)?.closest('.dropdown')) {
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

  // Dark / light theme
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

  // Squads
  dom.squadTeamSelect.addEventListener('change', () => {
    renderSquadList();
    renderSquadPlayerFromDBDropdown();
  });
  dom.btnAddPlayerFromDB.addEventListener('click', onAddPlayerFromDB);
  dom.btnDrawPairs.addEventListener('click', onDrawPairs);
  dom.btnPickRotationPlayers.addEventListener('click', onPickRotationPlayers);
  onEvent<string>(dom.squadList, 'squad-remove', onSquadRemove);
  onEvent<string>(dom.squadList, 'player-stats', (pid) => openPlayerProfile(pid, Number(fieldValue('squadTeamSelect'))));

  // Lit components emit their events to the container element
  onEvent<TeamChange>(dom.teamsList, 'team-change', onTeamChange);
  // <schedule-list> and <results-list> (detail: the match gi, or an object with it)
  [dom.calendarList, dom.resultsList].forEach((list) => {
    onEvent<string>(list, 'open-match', openGameModal);
    onEvent<string>(list, 'status-click', (gi) => onStatusClick(Number(gi)));
  });
  onEvent<ScoreStep>(dom.resultsList, 'score-step', onScoreStep);
  onEvent<ScoreCommit>(dom.resultsList, 'score-commit', onScoreCommit);

  // Account and administration
  dom.btnConta.addEventListener('click', onContaClick);
  onEvent<RoleChange>(dom.usersList, 'role-change', onUserRoleChange);

  // Export / import
  dom.btnExportar.addEventListener('click', exportJSON);
  const importInput = dom.inputImportar as HTMLInputElement;
  dom.btnImportar.addEventListener('click', () => { importInput.value = ''; importInput.click(); });
  importInput.addEventListener('change', () => { importJSON(importInput.files?.[0] ?? null); });

  // Settings
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
  dom.cfgPadelFormat.addEventListener('change', () => { onConfigFieldChange(); renderAll(); });
  dom.cfgMatchPoints.addEventListener('blur', onConfigFieldChange);
  dom.cfgMataMata.addEventListener('change', onConfigFieldChange);
  dom.cfgNumPlayoffTeams.addEventListener('change', onConfigFieldChange);

  // Match window
  const gameOverlay = document.getElementById('gameOverlay')!;
  document.getElementById('gameModalClose')!.addEventListener('click', closeGameModal);
  // Events from the score panel (<football-score>, <padel-score>; detail: { gi, side })
  const gameModalContent = document.getElementById('gameModalContent')!;
  onEvent<ScoreEvent>(gameModalContent, 'point', ({ gi, side }) => side && onGoalAdd(Number(gi), side));
  onEvent<ScoreEvent>(gameModalContent, 'cancelled', ({ gi, side }) => side && onGoalCancel(Number(gi), side));
  onEvent<ScoreEvent>(gameModalContent, 'started', ({ gi }) => changeGameStatus(Number(gi), GAME_STATUS.DECORRER));
  onEvent<ScoreEvent>(gameModalContent, 'finished', ({ gi }) => changeGameStatus(Number(gi), GAME_STATUS.TERMINADO));
  onEvent<ScoreEvent>(gameModalContent, 'mvp', ({ gi }) => onMvpClick(Number(gi)));
  onEvent<ScoreEvent>(gameModalContent, 'share', ({ gi }) => shareResult(gi));
  gameOverlay.addEventListener('click', (e) => { if (e.target === gameOverlay) closeGameModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gameOverlay.hidden) closeGameModal(); });

  // Modal
  dom.modalCancel.addEventListener('click', closeConfirm);
  dom.modalConfirm.addEventListener('click', runConfirm);
  dom.modalOverlay.addEventListener('click', (e) => { if (e.target === dom.modalOverlay) closeConfirm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dom.modalOverlay.hidden) closeConfirm(); });

  // Players database
  if (dom.btnNewPlayer) dom.btnNewPlayer.addEventListener('click', () => openPlayerModal(null));
  if (dom.playerSearchInput) {
    dom.playerSearchInput.addEventListener('input', renderPlayersList);
  }

  // Tournaments
  if (dom.btnNovoTorneioModal) dom.btnNovoTorneioModal.addEventListener('click', onNovoTorneioModalClick);
  onEvent<string>(dom.listaTorneiosAtivos, 'tournament-select', onSelectTournament);
  onEvent<string>(dom.listaTorneiosAtivos, 'tournament-finish', onTerminarTorneio);
}

// ---------------------------------------------------------------------------
// Updates from Firebase
// ---------------------------------------------------------------------------
let renderPending = false;

/** Is a text or number field focused (someone typing)? */
function isEditingField(): boolean {
  const el = document.activeElement as HTMLInputElement | null;
  if (!el || el.closest('.modal-overlay')) return false;
  if (el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'file'].includes(el.type);
}

/** Redraws now, or when the person leaves the field they are typing in. */
function renderWhenIdle(): void {
  if (isEditingField()) { renderPending = true; return; }
  renderPending = false;
  renderAll();
  renderTournaments();
}

export async function init(): Promise<void> {
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
      // The first read only records the state: it does not animate what changed while the app was closed
      animateResultChanges({ silent: isFirstLoad });
    }
  });

  listenTournaments((tournaments) => {
    allTournaments = tournaments;
    const currentId = getCurrentTournamentId();
    const activeTournaments = tournaments.filter((t) => t.status === 'active');

    // If the current tournament is not active but others are, switch to the first active one
    if (activeTournaments.length > 0 && !activeTournaments.some((t) => t.id === currentId)) {
      onSelectTournament(activeTournaments[0].id);
      return;
    }

    renderTournaments();
  });

  // Someone typing in a field saves when they leave it; only then redraw
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

// Entry point
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

import { state, persistConfigTeams, loadState, persistSchedule, persistResults, persistJogosSingulares, storeAllLayers, notifyPushError, currentTheme, setCurrentTheme, exportJSON, importJSON, applyGeneratedSchedule, applySnapshot, buildSnapshot, defaultTeams, defaultSquads, setStateHooks, setCurrentTournamentId, getCurrentTournamentId } from './state.js';
import { closeGameModal, dom, cacheDom, renderAll, refreshComputed, renderScheduleHint, renderSquadList, renderSquadsDropdown, flashError, flashBackup, renderCalendar, renderResults, showToast, flashSaved, openConfirm, closeConfirm, openDangerConfirm, switchTab, confirmCallback, openScorerModal, openPlayerProfile, computeStatsSummary, renderPlayersList, openPlayerModal, renderSquadPlayerFromDBDropdown, renderDraftTeams, renderSingularHistorico, currentDraft, renderAuth, renderUsers, renderLog, openPickPlayerModal, squadPickList, renderTournamentsList, openNovoTorneioModal } from './ui.js';
import { clamp, numOr, escapeHtml, buildPlayerIndex } from './utils.js';
import { shareStandings, shareResult } from './share.js';
import { animateResultChanges } from './animations.js';
import { bergerRounds, balancedDraft, buildFirstRoundSeeding, buildExtraVolta, getPlayoffWinner, buildArchiveEntry, GAME_STATUS, alignAssists, addGoal, removeGoal, setGameStatus } from './algorithms.js';
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
function onTeamPropChange(inp) {
  const idx = parseInt(inp.dataset.idx, 10);
  const prop = inp.dataset.prop;
  state.teams[idx][prop] = inp.value.trim();
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

  if (!tIdx) { showToast(en.toasts.selectTeam, 'error'); return; }
  if (isNaN(num) || num < 1) { showToast(en.toasts.enterJerseyNumber, 'error'); return; }
  if (!pid) { showToast(en.toasts.choosePlayerFromList, 'error'); return; }

  const player = state.players.find((p) => p.id === pid);
  if (!player) { showToast(en.toasts.playerNotFound, 'error'); return; }

  // Check if already in squad
  if (state.squads[tIdx].some((p) => p.id === pid)) {
    showToast(en.toasts.playerAlreadyInSquad, 'error');
    return;
  }

  state.squads[tIdx].push({ id: player.id, num, name: player.nome });
  persistConfigTeams();
  dom.squadPlayerNum.value = '';
  dom.squadPlayerFromDB.value = '';
  renderSquadList();
  renderSquadPlayerFromDBDropdown();
  showToast(en.toasts.playerAddedToSquad, 'ok');
}

function onSquadListClick(e) {
  const btnDel = e.target.closest('.player-del');
  const btnStats = e.target.closest('.player-stats-btn');

  if (btnDel) {
    const tIdx = btnDel.dataset.idx;
    const pid = btnDel.dataset.pid;
    state.squads[tIdx] = state.squads[tIdx].filter((p) => p.id !== pid);
    persistConfigTeams();
    renderSquadList();
  } else if (btnStats) {
    openPlayerProfile(btnStats.dataset.pid, Number(btnStats.dataset.idx));
  }
}

// ---------------------------------------------------------------------------
// Handlers de resultados
// ---------------------------------------------------------------------------
/** Passa o vencedor de um jogo de eliminatória terminado para o jogo seguinte do bracket. */
function propagatePlayoffWinner(gi) {
  const game = state.schedule[gi];
  const winnerIdx = getPlayoffWinner(game, state.results[gi]);
  if (winnerIdx === null || !game.nextMatchId) return;

  const [targetMatchId, targetSide] = game.nextMatchId.split('_');
  const targetGame = state.schedule.find((g) => g.playoffMatchId === targetMatchId);
  if (targetGame && targetGame[targetSide] !== winnerIdx) {
    targetGame[targetSide] = winnerIdx;
    persistSchedule();
  }
}

function onStatusBtnClick(btn) {
  const gi = btn.dataset.gi;

  const res = state.results[gi];
  const current = (res && typeof res === 'object' && res.status) || 'agendado';
  const cycle = { agendado: 'decorrer', decorrer: 'terminado', terminado: 'agendado' };
  state.results[gi] = setGameStatus(res, cycle[current] ?? 'agendado');
  propagatePlayoffWinner(gi);

  // Anima depois de gravar: se a gravação for recusada o estado já voltou atrás
  persistResults().then(() => animateResultChanges());
  renderResults();
  renderCalendar();
  refreshComputed();
}

function onScoreBtnClick(btn) {
  const gi = btn.dataset.gi;
  const side = btn.dataset.side;
  const action = btn.dataset.action;

  // O resultado é sempre calculado a partir do estado no momento de gravar:
  // entre o clique e a escolha do marcador pode chegar um golo de outro telemóvel.
  const commitGoal = (next) => {
    if (next === state.results[gi]) return;
    state.results[gi] = next;
    propagatePlayoffWinner(gi);
    persistResults().then(() => animateResultChanges());
    renderResults();
    renderCalendar();
    refreshComputed();
  };

  if (action === 'add') {
    openScorerModal(gi, side, (pid) => {
      const game = state.schedule[gi];
      if (!game) return;
      const teamIdx = side === 'home' ? game.home : game.away;
      const registerGoal = (aid) => commitGoal(addGoal(state.results[gi], side, pid, aid));

      // Autogolo não tem assistência
      if (pid === 'auto') registerGoal('');
      else openPickPlayerModal(en.singleMatch.pickAssistTitle, squadPickList(teamIdx, pid), en.singleMatch.noAssistLabel, registerGoal);
    });
  } else if (action === 'sub') {
    commitGoal(removeGoal(state.results[gi], side));
  }
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

function onResultCommit(inp) {
  const gi = inp.dataset.gi;
  const row = inp.closest('.fixture-input') || inp.closest('.result-split').parentNode;

  const inps = row.querySelectorAll('.res-box');
  const penInps = row.querySelectorAll('.pen-box');

  const vHome = inps[0].value.trim();
  const vAway = inps[1].value.trim();
  const pHome = penInps.length ? penInps[0].value.trim() : '';
  const pAway = penInps.length ? penInps[1].value.trim() : '';

  const clearInvalid = () => {
    inps[0].classList.remove('input-invalid');
    inps[1].classList.remove('input-invalid');
    if (penInps.length) {
      penInps[0].classList.remove('input-invalid');
      penInps[1].classList.remove('input-invalid');
    }
  };

  if (vHome === '' && vAway === '') {
    delete state.results[gi];
    clearInvalid();
  } else if (vHome !== '' && vAway !== '' && !isNaN(vHome) && !isNaN(vAway)) {
    const newScore = `${parseInt(vHome, 10)}-${parseInt(vAway, 10)}`;
    let newPenalties;

    if (pHome !== '' && pAway !== '' && !isNaN(pHome) && !isNaN(pAway)) {
      newPenalties = `${parseInt(pHome, 10)}-${parseInt(pAway, 10)}`;
    }

    if (!state.results[gi] || typeof state.results[gi] === 'string') {
      state.results[gi] = { score: newScore, scorers: { home: [], away: [] }, status: 'terminado' };
    } else {
      state.results[gi].score = newScore;
      if (state.results[gi].status === 'agendado') state.results[gi].status = 'terminado';
    }

    if (newPenalties) state.results[gi].penalties = newPenalties;
    else delete state.results[gi].penalties;

    // Propagar vencedor para o próximo jogo de playoff
    propagatePlayoffWinner(gi);

    clearInvalid();
  } else {
    inps[0].classList.toggle('input-invalid', vHome === '' || isNaN(vHome));
    inps[1].classList.toggle('input-invalid', vAway === '' || isNaN(vAway));
    return;
  }

  persistResults().then(() => animateResultChanges());
  renderResults();
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
  renderTournamentsList(
    allTournaments,
    getCurrentTournamentId(),
    onSelectTournament,
    onTerminarTorneio,
  );
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
  const allSports = [
    { id: 'football', label: '⚽ Football' },
    { id: 'padel', label: '🎾 Padel' },
  ];
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
    en.tournaments.finishPrompt(escapeHtml(tourneyName)) + aviso,
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
// Handlers — Jogo Singular
// ---------------------------------------------------------------------------
export function onFazerDraft() {
  const nomeA = (dom.draftNomeA.value.trim()) || en.singleMatch.teamA;
  const nomeB = (dom.draftNomeB.value.trim()) || en.singleMatch.teamB;

  const checkedBoxes = dom.draftPlayerList.querySelectorAll('.draft-checkbox:checked');
  const selectedIds = Array.from(checkedBoxes).map((cb) => cb.dataset.pid);

  if (selectedIds.length < 2) {
    showToast(en.toasts.selectAtLeast2Players, 'error');
    return;
  }

  const players = selectedIds.map((id) => state.players.find((p) => p.id === id)).filter(Boolean);
  const currentSport = state.meta?.sport || state.config?.sport || 'football';
  const { equipaA, equipaB } = balancedDraft(players, currentSport);

  // Store in module-level variable (imported as currentDraft)
  currentDraft.equipaA = equipaA;
  currentDraft.equipaB = equipaB;
  currentDraft.scorersA = [];
  currentDraft.scorersB = [];
  currentDraft.assistsA = [];
  currentDraft.assistsB = [];
  currentDraft.mvp = '';

  renderDraftTeams(nomeA, nomeB, equipaA, equipaB);
}

export async function onGuardarJogo() {
  const nomeA = dom.draftLabelA ? dom.draftLabelA.textContent : en.singleMatch.teamA;
  const nomeB = dom.draftLabelB ? dom.draftLabelB.textContent : en.singleMatch.teamB;
  const scoreA = dom.draftScoreA ? dom.draftScoreA.value.trim() : '';
  const scoreB = dom.draftScoreB ? dom.draftScoreB.value.trim() : '';

  if (!currentDraft.equipaA.length && !currentDraft.equipaB.length) {
    showToast(en.toasts.runDraftFirst, 'error');
    return;
  }

  const resultado = (scoreA !== '' && scoreB !== '') ? `${parseInt(scoreA, 10)}-${parseInt(scoreB, 10)}` : null;

  const jogo = {
    id: crypto.randomUUID(),
    data: new Date().toISOString(),
    nomeEquipaA: nomeA,
    nomeEquipaB: nomeB,
    equipaA: currentDraft.equipaA.map((p) => p.id),
    equipaB: currentDraft.equipaB.map((p) => p.id),
    scorersA: [...(currentDraft.scorersA || [])],
    scorersB: [...(currentDraft.scorersB || [])],
    assistsA: alignAssists(currentDraft.scorersA, currentDraft.assistsA),
    assistsB: alignAssists(currentDraft.scorersB, currentDraft.assistsB),
    resultado,
  };
  if (currentDraft.mvp) jogo.mvp = currentDraft.mvp;

  state.jogosSingulares.push(jogo);
  await persistJogosSingulares();
  renderSingularHistorico();

  // Reset
  currentDraft.equipaA = [];
  currentDraft.equipaB = [];
  currentDraft.scorersA = [];
  currentDraft.scorersB = [];
  currentDraft.assistsA = [];
  currentDraft.assistsB = [];
  currentDraft.mvp = '';
  if (dom.draftResultCard) dom.draftResultCard.style.display = 'none';
  if (dom.draftScoreA) dom.draftScoreA.value = '';
  if (dom.draftScoreB) dom.draftScoreB.value = '';
  dom.draftPlayerList.querySelectorAll('.draft-checkbox:checked').forEach((cb) => { cb.checked = false; });
  const countEl = document.getElementById('draftSelectedCount');
  if (countEl) countEl.textContent = en.singleMatch.playersSelected(0);
  if (dom.btnFazerDraft) dom.btnFazerDraft.disabled = true;

  showToast(en.toasts.matchSavedToHistory, 'ok');

  // Switch to history tab
  document.querySelectorAll('.singular-subtab').forEach((b) => b.classList.toggle('active', b.dataset.subtab === 'historico'));
  document.querySelectorAll('.singular-panel').forEach((p) => p.classList.toggle('active', p.id === 'singular-historico'));
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
  const quem = `${escapeHtml(user.displayName || user.email || '')} (${escapeHtml(roleLabel(getCurrentRole(), getCurrentUserAdmin()))})`;
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

export function onUserRoleChange(e) {
  const row = e.target.closest('.user-row');
  if (!row) return;
  const sel = row.querySelector('select[data-uid]');
  if (!sel) return;
  const uid = sel.dataset.uid;
  const nome = sel.dataset.nome;
  const role = sel.value || null;

  let sportAdmins = null;
  if (role === 'admin') {
    sportAdmins = {};
    row.querySelectorAll('.user-sport-cb').forEach((cb) => {
      sportAdmins[cb.dataset.sport] = cb.checked;
    });
  } else if (role === 'master') {
    sportAdmins = { football: true, padel: true };
  }

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
  dom.squadList.addEventListener('click', onSquadListClick);

  // Equipas, calendário e resultados são redesenhados com innerHTML: um listener
  // por contentor em vez de um por elemento a cada render.
  // (focusout porque o blur não sobe até ao contentor)
  dom.teamsList.addEventListener('focusout', (e) => {
    if (e.target.matches('.team-prop')) onTeamPropChange(e.target);
  });
  dom.teamsList.addEventListener('change', (e) => {
    if (e.target.matches('.team-prop[type="color"]')) onTeamPropChange(e.target);
  });
  dom.calendarList.addEventListener('click', (e) => {
    const badge = e.target.closest('.status-badge');
    if (badge) onStatusBtnClick(badge);
  });
  dom.resultsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.score-btn, .status-badge');
    if (!btn) return;
    if (btn.matches('.score-btn')) onScoreBtnClick(btn);
    else onStatusBtnClick(btn);
  });
  dom.resultsList.addEventListener('focusout', (e) => {
    if (e.target.matches('.res-box, .pen-box')) onResultCommit(e.target);
  });

  // Conta e administração
  dom.btnConta.addEventListener('click', onContaClick);
  dom.usersList.addEventListener('change', onUserRoleChange);

  // Exportar / Importar
  dom.btnExportar.addEventListener('click', exportJSON);
  dom.btnImportar.addEventListener('click', () => { dom.inputImportar.value = ''; dom.inputImportar.click(); });
  dom.inputImportar.addEventListener('change', () => { importJSON(dom.inputImportar.files[0]); });

  // Configuração
  dom.cfgNome.addEventListener('blur', onConfigFieldChange);
  [dom.cfgVitoria, dom.cfgEmpate, dom.cfgDerrota, dom.cfgBonus, dom.cfgGoleada].forEach((el) => {
    el.addEventListener('blur', onConfigFieldChange);
  });
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
  document.getElementById('gameModalContent').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    const head = document.querySelector('#gameModalContent [data-game]');
    if (!btn || !head) return;
    if (btn.dataset.action === 'mvp') onMvpClick(head.dataset.game);
    else if (btn.dataset.action === 'share') shareResult(head.dataset.game);
  });
  gameOverlay.addEventListener('click', (e) => { if (e.target === gameOverlay) closeGameModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gameOverlay.hidden) closeGameModal(); });

  // Modal
  dom.modalCancel.addEventListener('click', closeConfirm);
  dom.modalConfirm.addEventListener('click', () => {
    const cb = confirmCallback;
    closeConfirm();
    if (cb) cb();
  });
  dom.modalOverlay.addEventListener('click', (e) => { if (e.target === dom.modalOverlay) closeConfirm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dom.modalOverlay.hidden) closeConfirm(); });

  // Jogadores BD
  if (dom.btnNewPlayer) dom.btnNewPlayer.addEventListener('click', () => openPlayerModal(null));
  if (dom.playerSearchInput) {
    dom.playerSearchInput.addEventListener('input', renderPlayersList);
  }

  // Jogo Singular — subtabs
  document.querySelectorAll('.singular-subtab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.singular-subtab').forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.singular-panel').forEach((p) => p.classList.toggle('active', p.id === `singular-${btn.dataset.subtab}`));
      if (btn.dataset.subtab === 'historico') renderSingularHistorico();
    });
  });

  // Jogo Singular — Draft
  if (dom.btnFazerDraft) dom.btnFazerDraft.addEventListener('click', onFazerDraft);
  if (dom.btnGuardarJogo) dom.btnGuardarJogo.addEventListener('click', onGuardarJogo);

  // Torneios
  if (dom.btnNovoTorneioModal) dom.btnNovoTorneioModal.addEventListener('click', onNovoTorneioModalClick);
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

import { state, persistJogosSingulares } from '../state.js';
import { fmtTimestamp, playerName } from '../utils.js';
import { getPlayerRating, balancedDraft, alignAssists } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import type { Player, SingleMatch } from '../types.js';
import type { PlayerPicker } from '../components/PlayerPicker.js';
import type { DraftTeams, DraftTeam, DraftSide, DraftGoal } from '../components/DraftTeams.js';
import type { SingleMatchHistory } from '../components/SingleMatchHistory.js';
import '../components/PlayerPicker.js';
import '../components/DraftTeams.js';
import '../components/SingleMatchHistory.js';
import { dom } from './dom.js';
import { showToast } from './toasts.js';
import { openConfirm, openPickPlayerModal } from './modals.js';
import { pickerRows } from './teams.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Single Match tab — draft two balanced teams, record goals, keep a history
// ---------------------------------------------------------------------------

/** The match being played (not saved until "Save match"). */
class Draft {
  teams: Record<DraftSide, { name: string; players: Player[]; scorers: string[]; assists: string[] }> = {
    A: { name: '', players: [], scorers: [], assists: [] },
    B: { name: '', players: [], scorers: [], assists: [] },
  };

  mvp = '';

  get empty(): boolean {
    return !this.teams.A.players.length && !this.teams.B.players.length;
  }

  start(nameA: string, nameB: string, a: Player[], b: Player[]): void {
    this.teams = {
      A: { name: nameA, players: a, scorers: [], assists: [] },
      B: { name: nameB, players: b, scorers: [], assists: [] },
    };
    this.mvp = '';
  }

  addGoal(side: DraftSide, pid: string, aid: string): void {
    this.teams[side].scorers.push(pid);
    this.teams[side].assists.push(aid);
  }

  /** Removes the player's last goal (and its assist); false if they had none. */
  removeGoal(side: DraftSide, pid: string): boolean {
    const t = this.teams[side];
    const idx = t.scorers.lastIndexOf(pid);
    if (idx === -1) return false;
    t.scorers.splice(idx, 1);
    t.assists.splice(idx, 1);
    return true;
  }

  reset(): void {
    this.start('', '', [], []);
  }
}

const draft = new Draft();

function sportId(): string {
  return getSport(state.meta?.sport || state.config?.sport).id;
}

function input(id: string): HTMLInputElement | undefined {
  return dom[id] as HTMLInputElement | undefined;
}

export function renderDraftPlayerList(): void {
  const picker = dom.draftPlayerList as PlayerPicker | undefined;
  if (!picker) return;
  picker.rows = pickerRows(state.players, true);
  picker.countLabel = en.singleMatch.playersSelected;
  picker.empty = en.singleMatch.noPlayersInDB;
  picker.updateComplete.then(() => {
    (dom.btnFazerDraft as HTMLButtonElement).disabled = picker.selectedIds.length < 2;
  });
}

function draftTeam(side: DraftSide): DraftTeam {
  const t = draft.teams[side];
  const sport = sportId();
  return {
    name: t.name,
    players: t.players.map((p) => ({ id: p.id, name: p.nome, rating: getPlayerRating(p, sport) })),
    scorers: t.scorers,
    assists: t.assists,
  };
}

function renderDraftTeams(): void {
  const view = dom.draftTeamsResult as DraftTeams | undefined;
  if (!view) return;
  view.teamA = draftTeam('A');
  view.teamB = draftTeam('B');
  view.mvpId = draft.mvp;
  view.mvpName = draft.mvp ? playerName(draft.mvp) : '';
  view.requestUpdate(); // goals are changed in place
  dom.draftLabelA.textContent = draft.teams.A.name;
  dom.draftLabelB.textContent = draft.teams.B.name;
  dom.draftResultCard.style.display = draft.empty ? 'none' : 'block';
}

/** Adds one to (or takes one from) a side's typed score. */
function bumpScore(side: DraftSide, delta: number): void {
  const inp = input(side === 'A' ? 'draftScoreA' : 'draftScoreB');
  if (inp) inp.value = String(Math.max(0, (parseInt(inp.value || '0', 10) || 0) + delta));
}

function onDraft(): void {
  const picker = dom.draftPlayerList as PlayerPicker;
  const ids = picker.selectedIds;
  if (ids.length < 2) {
    showToast(en.toasts.selectAtLeast2Players, 'error');
    return;
  }
  const players = ids.map((id) => state.players.find((p) => p.id === id)).filter((p): p is Player => !!p);
  const { equipaA, equipaB } = balancedDraft(players, sportId());
  draft.start(
    input('draftNomeA')?.value.trim() || en.singleMatch.teamA,
    input('draftNomeB')?.value.trim() || en.singleMatch.teamB,
    equipaA,
    equipaB,
  );
  renderDraftTeams();
}

function onGoalAdd({ side, pid }: DraftGoal): void {
  const mates = draft.teams[side].players.filter((p) => p.id !== pid).map((p) => ({ id: p.id, label: p.nome }));
  openPickPlayerModal(en.singleMatch.pickAssistTitle, mates, en.singleMatch.noAssistLabel, (aid) => {
    draft.addGoal(side, pid, aid);
    bumpScore(side, 1);
    renderDraftTeams();
  });
}

function onGoalRemove({ side, pid }: DraftGoal): void {
  if (!draft.removeGoal(side, pid)) return;
  bumpScore(side, -1);
  renderDraftTeams();
}

function onMvp(): void {
  const all = [...draft.teams.A.players, ...draft.teams.B.players].map((p) => ({ id: p.id, label: p.nome }));
  openPickPlayerModal(en.singleMatch.pickMvpTitle, all, en.singleMatch.noMvpLabel, (pid) => {
    draft.mvp = pid;
    renderDraftTeams();
  });
}

/** Shows the "new match" or "history" sub-tab. */
function showSubtab(name: 'novo' | 'historico'): void {
  document.querySelectorAll<HTMLElement>('.singular-subtab').forEach((b) => b.classList.toggle('active', b.dataset.subtab === name));
  document.querySelectorAll<HTMLElement>('.singular-panel').forEach((p) => p.classList.toggle('active', p.id === `singular-${name}`));
  if (name === 'historico') renderSingularHistorico();
}

async function onSave(): Promise<void> {
  if (draft.empty) {
    showToast(en.toasts.runDraftFirst, 'error');
    return;
  }
  const scoreA = input('draftScoreA')?.value.trim() || '';
  const scoreB = input('draftScoreB')?.value.trim() || '';
  const { A, B } = draft.teams;
  const match: SingleMatch = {
    id: crypto.randomUUID(),
    data: new Date().toISOString(),
    nomeEquipaA: A.name,
    nomeEquipaB: B.name,
    equipaA: A.players.map((p) => p.id),
    equipaB: B.players.map((p) => p.id),
    scorersA: [...A.scorers],
    scorersB: [...B.scorers],
    assistsA: alignAssists(A.scorers, A.assists),
    assistsB: alignAssists(B.scorers, B.assists),
    resultado: scoreA !== '' && scoreB !== '' ? `${parseInt(scoreA, 10)}-${parseInt(scoreB, 10)}` : null,
  };
  if (draft.mvp) match.mvp = draft.mvp;

  state.jogosSingulares.push(match);
  await persistJogosSingulares();

  draft.reset();
  renderDraftTeams();
  const a = input('draftScoreA');
  const b = input('draftScoreB');
  if (a) a.value = '';
  if (b) b.value = '';
  (dom.draftPlayerList as PlayerPicker).clear();
  showToast(en.toasts.matchSavedToHistory, 'ok');
  showSubtab('historico');
}

function playerNames(ids: string[] | undefined): string[] {
  return (ids || []).map((pid) => state.players.find((p) => p.id === pid)?.nome || pid);
}

export function renderSingularHistorico(): void {
  const list = dom.singularHistoricoList as SingleMatchHistory | undefined;
  if (!list) return;
  list.cards = state.jogosSingulares.slice().reverse().map((m) => ({
    id: m.id,
    date: fmtTimestamp(m.data),
    teamA: m.nomeEquipaA,
    teamB: m.nomeEquipaB,
    playersA: playerNames(m.equipaA),
    playersB: playerNames(m.equipaB),
    result: m.resultado || '',
    mvp: m.mvp ? playerName(m.mvp) : '',
  }));
}

/** Wires the Single Match tab; called once at start-up. */
export function bindSingleMatchEvents(): void {
  document.querySelectorAll<HTMLElement>('.singular-subtab').forEach((btn) => {
    btn.addEventListener('click', () => showSubtab(btn.dataset.subtab === 'historico' ? 'historico' : 'novo'));
  });
  dom.draftPlayerList?.addEventListener('selection-change', (e) => {
    (dom.btnFazerDraft as HTMLButtonElement).disabled = (e as CustomEvent<string[]>).detail.length < 2;
  });
  dom.btnFazerDraft?.addEventListener('click', onDraft);
  dom.btnGuardarJogo?.addEventListener('click', () => { onSave(); });
  const teams = dom.draftTeamsResult;
  teams?.addEventListener('draft-goal-add', (e) => onGoalAdd((e as CustomEvent<DraftGoal>).detail));
  teams?.addEventListener('draft-goal-sub', (e) => onGoalRemove((e as CustomEvent<DraftGoal>).detail));
  teams?.addEventListener('draft-mvp', onMvp);
  dom.singularHistoricoList?.addEventListener('single-delete', (e) => {
    const id = (e as CustomEvent<string>).detail;
    openConfirm(en.singleMatch.deleteMatchTitle, en.singleMatch.deleteMatchPrompt, async () => {
      state.jogosSingulares = state.jogosSingulares.filter((j) => j.id !== id);
      await persistJogosSingulares();
      renderSingularHistorico();
    });
  });
}

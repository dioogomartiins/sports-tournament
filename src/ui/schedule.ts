import { state } from '../state.js';
import { getSport } from '../sports/registry.js';
import type { ScheduleList } from '../components/ScheduleList.js';
import type { ResultsList } from '../components/ResultsList.js';
import '../components/ScheduleList.js';
import '../components/ResultsList.js';
import { dom } from './dom.js';
import { refreshGameModal } from './match.js';

// ---------------------------------------------------------------------------
// Schedule and Results tabs (<schedule-list>, <results-list>)
// ---------------------------------------------------------------------------
// Their events (open-match, status-click, score-step, score-commit) are
// handled in main.js, which saves the result.

export function renderCalendar(): void {
  dom.calendarActions.style.display = state.schedule.length ? 'block' : 'none';
  const list = dom.calendarList as ScheduleList;
  list.schedule = state.schedule;
  list.roundsMeta = state.roundsMeta;
  list.results = state.results;
  list.teams = state.teams || [];
  list.requestUpdate(); // the state is changed in place
}

export function renderResults(): void {
  const list = dom.resultsList as ResultsList;
  list.schedule = state.schedule;
  list.roundsMeta = state.roundsMeta;
  list.results = state.results;
  list.teams = state.teams || [];
  list.sport = getSport(state.meta?.sport);
  list.config = state.config;
  list.requestUpdate(); // the state is changed in place
  refreshGameModal();
}

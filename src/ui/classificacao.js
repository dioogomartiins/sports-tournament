import { state } from '../state.js';
import { prefersReducedMotion } from '../utils.js';
import { standingsOrder, rankMoves } from '../algorithms.js';
import { getSport } from '../sports/registry.js';
import { StandingsTable } from '../components/StandingsTable.js';
import { dom } from './dom.js';

// ---------------------------------------------------------------------------
// Render — Standings (<standings-table>)
// ---------------------------------------------------------------------------
// The arrows show places gained or lost since the standings were last seen,
// and opening the tab replays the change: the old table holds for a moment
// and then the teams slide to their new places.
const STANDINGS_HOLD = 600;

let seen = null; // { groups, moves, key } last shown with the tab visible
let seenOrder = null;
let standingsMoves = new Map();
let lastGroupsData = null;
let replayTimer = null;

function standingsTable() {
  let table = dom.standingsWrapper.querySelector('standings-table');
  if (!table) {
    table = new StandingsTable();
    dom.standingsWrapper.replaceChildren(table);
  }
  table.sport = getSport(state.meta?.sport);
  table.teams = state.teams || [];
  return table;
}

function noteStandingsSeen(groupsData) {
  const order = standingsOrder(groupsData);
  const moves = rankMoves(seenOrder, order);
  if (moves.size) standingsMoves = moves;
  seenOrder = order;
}

function snapshot(groups) {
  const moves = standingsMoves;
  return { groups, moves, key: JSON.stringify([groups, [...moves]]) };
}

export function renderStandingsWrapper(groupsData) {
  lastGroupsData = groupsData;
  clearTimeout(replayTimer);
  const visible = !!dom.standingsWrapper.offsetParent;
  if (visible) noteStandingsSeen(groupsData);
  standingsTable().show(groupsData, standingsMoves, 450);
  if (visible) seen = snapshot(groupsData);
}

export function replayStandings() {
  if (!dom.standingsWrapper || !lastGroupsData) return;
  clearTimeout(replayTimer);
  const previous = seen;
  noteStandingsSeen(lastGroupsData);
  const current = snapshot(lastGroupsData);
  seen = current;
  const table = standingsTable();
  if (previous === null || previous.key === current.key || prefersReducedMotion()) {
    table.show(current.groups, current.moves, 0);
    return;
  }
  table.show(previous.groups, previous.moves, 0);
  replayTimer = setTimeout(() => table.show(current.groups, current.moves, 800), STANDINGS_HOLD);
}

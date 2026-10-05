import { state } from '../state.js';
import { getTeamName, getTeamDisplay, escapeHtml, buildPlayerIndex } from '../utils.js';
import { computeStandings, GAME_STATUS, tallyPlayerStats } from '../algorithms.js';
import { dom } from './dom.js';
import { en } from '../i18n/en.js';

// ---------------------------------------------------------------------------
// Stats — Scorers
// ---------------------------------------------------------------------------

export function computeScorerStats() {
  const playerIndex = buildPlayerIndex();
  const stats = {};

  function addGoal(pId) {
    if (pId === 'auto') return;
    if (!stats[pId]) {
      const info = playerIndex[pId] || { name: en.common.unknownPlayer, team: en.common.noTeam };
      stats[pId] = { name: info.name, team: info.team, count: 0 };
    }
    stats[pId].count++;
  }

  Object.keys(state.results).forEach((gi) => {
    const res = state.results[gi];
    if (!res || typeof res !== 'object' || !res.scorers) return;

    ['home', 'away'].forEach((side) => {
      if (!res.scorers[side]) return;
      res.scorers[side].forEach(addGoal);
    });
  });

  state.jogosSingulares.forEach((jogo) => {
    if (jogo.scorersA) jogo.scorersA.forEach(addGoal);
    if (jogo.scorersB) jogo.scorersB.forEach(addGoal);
  });

  return Object.values(stats).sort((a, b) => b.count - a.count);
}

export function statCardsHtml(summary) {
  const cards = [
    [en.statsTab.matchesPlayed, `${summary.played} / ${summary.total}`],
    [en.statsTab.remainingMatches, String(summary.pendentes)],
    [en.statsTab.goalsScored, String(summary.totalGoals)],
    [en.statsTab.goalsPerMatchAvg, summary.media.toFixed(2)],
    [en.statsTab.bestAttack, summary.bestAtkLabel],
    [en.statsTab.bestDefense, summary.bestDefLabel],
    [en.statsTab.biggestBlowout, summary.biggestWinLabel],
    [en.statsTab.mostWins, summary.mostWinsLabel],
    [en.statsTab.mostDraws, summary.mostDrawsLabel],
  ];

  return cards.map(([label, value]) =>
    `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${escapeHtml(value)}</div></div>`
  ).join('');
}

export function renderStatsGrid(summary) {
  const scorers = computeScorerStats().slice(0, 10);
  let html = statCardsHtml(summary);

  const scorerRows = scorers.length
    ? scorers.map((s) =>
      `<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${s.count}</strong> ${en.common.goals} — ${escapeHtml(s.name)} <span style="color:var(--ink-faint); font-size:13px;">(${escapeHtml(s.team)})</span></div>`
    ).join('')
    : `<p class="empty">${en.statsTab.noGoalsYet}</p>`;

  html += `<div class="card stats-half"><div class="section-title">${en.statsTab.topScorers}</div>${scorerRows}</div>`;

  const tally = tallyPlayerStats(state.results, state.jogosSingulares);
  const index = buildPlayerIndex();
  const topBy = (key, unit) => {
    const rows = Object.keys(tally)
      .filter((pid) => tally[pid][key] > 0)
      .sort((a, b) => tally[b][key] - tally[a][key])
      .slice(0, 10);
    return rows.length
      ? rows.map((pid) => {
        const info = index[pid] || { name: en.common.unknownPlayer, team: en.common.noTeam };
        return `<div style="padding:6px 0; border-bottom:1px solid var(--line);"><strong>${tally[pid][key]}</strong> ${unit} — ${escapeHtml(info.name)} <span style="color:var(--ink-faint); font-size:13px;">(${escapeHtml(info.team)})</span></div>`;
      }).join('')
      : `<p class="empty">${en.statsTab.nothingRecordedYet}</p>`;
  };

  html += `<div class="card stats-half"><div class="section-title">${en.statsTab.assistsTitle}</div>${topBy('assistencias', 'assist.')}</div>`;
  html += `<div class="card stats-half"><div class="section-title">${en.statsTab.mvpTitle}</div>${topBy('mvp', '×')}</div>`;
  dom.statsGrid.innerHTML = html;
}

// ---------------------------------------------------------------------------
// General Stats (used on dashboard and playoff generation)
// ---------------------------------------------------------------------------
export function computeStatsSummary() {
  const teamsArray = state.teams.slice(0, state.scheduleTeamCount);
  const groupsData = computeStandings(teamsArray, state.schedule, state.results, state.config);
  let flatStandings = [];
  groupsData.forEach((g) => { flatStandings = flatStandings.concat(g.standings); });

  const total = state.schedule.length;

  const playedKeys = Object.keys(state.results).filter((k) => {
    const val = state.results[k];
    if (typeof val === 'object' && val.status === GAME_STATUS.AGENDADO) return false;
    const scoreStr = val ? (typeof val === 'object' ? val.score : String(val)) : '';
    return /^\d+-\d+$/.test(scoreStr.trim());
  });

  const played = playedKeys.length;
  const totalGoals = flatStandings.reduce((s, t) => s + t.GM, 0);
  const media = played > 0 ? totalGoals / played : 0;
  const withGames = flatStandings.filter((s) => s.J > 0);

  function pick(arr, better) {
    if (!arr.length) return null;
    return arr.reduce((a, b) => (better(b, a) ? b : a));
  }

  const bestAtk = pick(withGames, (b, a) => b.GM > a.GM);
  const bestDef = pick(withGames, (b, a) => b.GS < a.GS);
  const mostWins = pick(withGames, (b, a) => b.V > a.V);
  const mostDraws = pick(withGames, (b, a) => b.E > a.E);

  let biggestWin = null;
  state.schedule.forEach((g, gi) => {
    const resObj = state.results[gi];
    if (!resObj) return;
    if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;
    const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
    const m = /^(\d+)-(\d+)$/.exec(resStr.trim());
    if (!m) return;
    const diff = Math.abs(+m[1] - +m[2]);
    if (!biggestWin || diff > biggestWin.diff) {
      biggestWin = { diff, text: `${getTeamName(g.home)} ${resStr} ${getTeamName(g.away)}` };
    }
  });

  const roundPlayed = {};
  state.schedule.forEach((g, gi) => {
    if (!roundPlayed[g.jornada]) roundPlayed[g.jornada] = { played: 0, total: 0 };
    roundPlayed[g.jornada].total++;
    const val = state.results[gi];
    if (val && typeof val === 'object' && val.status !== GAME_STATUS.AGENDADO) roundPlayed[g.jornada].played++;
    else if (typeof val === 'string' && val.trim() !== '') roundPlayed[g.jornada].played++;
  });

  let currentRound = state.roundsMeta.length ? state.roundsMeta[state.roundsMeta.length - 1].jornada : 0;
  for (const rm of state.roundsMeta) {
    const rp = roundPlayed[rm.jornada] || { played: 0, total: 0 };
    if (rp.played < rp.total) { currentRound = rm.jornada; break; }
  }

  return {
    groupsData,
    flatStandings,
    total,
    played,
    pendentes: total - played,
    totalGoals,
    media,
    bestAtkLabel: bestAtk ? `${bestAtk.name} — ${en.statsTab.goalsLabel(bestAtk.GM)}` : '—',
    bestDefLabel: bestDef ? `${bestDef.name} — ${en.statsTab.concededLabel(bestDef.GS)}` : '—',
    mostWinsLabel: mostWins ? `${mostWins.name} — ${en.statsTab.winsLabel(mostWins.V)}` : '—',
    mostDrawsLabel: mostDraws ? `${mostDraws.name} — ${en.statsTab.drawsLabel(mostDraws.E)}` : '—',
    biggestWinLabel: biggestWin ? `${biggestWin.text}  ${en.statsTab.diffLabel(biggestWin.diff)}` : '—',
    totalRounds: state.roundsMeta.length,
    currentRound,
  };
}

// ---------------------------------------------------------------------------
// Render — Dashboard
// ---------------------------------------------------------------------------
export function renderDashboard(summary) {
  dom.tournamentTitle.textContent = (state.config.nome || en.common.tournament).toUpperCase();

  const sortedAll = summary.flatStandings.slice().sort((a, b) =>
    (b.Pts - a.Pts) || (b.DG - a.DG) || (b.GM - a.GM)
  );
  const top3 = sortedAll.slice(0, 3);

  dom.dashboardPodium.innerHTML = top3.length
    ? top3.map((s, i) =>
      `<div class="podium-card podium-${i + 1}">` +
      `<div class="podium-rank">${en.dashboard.place(i + 1)}</div>` +
      `<div class="podium-name">${escapeHtml(s.name)}</div>` +
      `<div class="podium-pts">${en.dashboard.ptsMatches(s.Pts, s.J)}</div>` +
      `</div>`
    ).join('')
    : `<p class="empty">${en.dashboard.noTeamsConfigured}</p>`;

  const rest = sortedAll.slice(3, 8);
  dom.dashboardStandings.innerHTML = rest.length
    ? `<table class="mini-table"><thead><tr><th>${en.standings.cols.pos}</th><th style="text-align:left;">${en.standings.cols.team}</th><th>${en.standings.cols.p}</th><th>${en.standings.cols.pts}</th></tr></thead><tbody>` +
    rest.map((s, i) =>
      `<tr><td class="num">${i + 4}</td><td style="text-align:left;">${getTeamDisplay(s.idx)}</td><td class="num">${s.J}</td><td class="num">${s.Pts}</td></tr>`
    ).join('') +
    `</tbody></table>`
    : '';

  dom.dashboardStats.innerHTML = statCardsHtml(summary);

  const scorers = computeScorerStats().slice(0, 5);
  const scorerHtml = scorers.length > 0
    ? scorers.map((s, i) =>
      `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">` +
      `<span>${i + 1}. ${escapeHtml(s.name)} <span style="color:var(--ink-faint); font-size:12px;">(${escapeHtml(s.team)})</span></span>` +
      `<span style="font-weight:700;">${en.statsTab.goalsLabel(s.count)}</span></div>`
    ).join('')
    : `<p class="empty" style="padding-top:20px;">${en.statsTab.noGoalsYet}</p>`;

  document.getElementById('dashboardScorers').innerHTML =
    `<div class="section-title" style="margin-top:20px;">${en.dashboard.topScorers}</div>${scorerHtml}`;
}

export function updateTicker(summary) {
  if (!summary.totalRounds) {
    dom.marqueeTicker.textContent = en.header.noSchedule;
    return;
  }
  dom.marqueeTicker.textContent = en.header.roundTicker(
    summary.currentRound,
    summary.totalRounds,
    summary.played,
    summary.total,
  );
}

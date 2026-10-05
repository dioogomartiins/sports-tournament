import { Sport, type PlayerStatColumn, type StandingsColumn } from '../Sport.js';
import { en } from '../../i18n/en.js';
import {
  GAME_STATUS,
  type Config,
  type GameEvent,
  type GameStatus,
  type GroupStandings,
  type Match,
  type MatchResult,
  type PlayerStats,
  type Score,
  type SingleMatch,
  type StandingsRow,
  type Team,
} from '../../types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyPlayerTally(): PlayerStats {
  return { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
}

function scoreParts(score: unknown): { home: number; away: number } {
  const m = /^(\d+)-(\d+)$/.exec(String(score || '').trim());
  return m ? { home: Number(m[1]), away: Number(m[2]) } : { home: 0, away: 0 };
}

function resultObject(res: MatchResult | undefined): Score {
  if (res && typeof res === 'object') {
    const out: Score = JSON.parse(JSON.stringify(res));
    out.scorers = { home: [], away: [], ...(out.scorers || {}) };
    return out;
  }
  return { score: typeof res === 'string' ? res : '0-0', scorers: { home: [], away: [] } };
}

function statusOf(res: MatchResult | undefined): GameStatus | null {
  if (!res) return null;
  if (typeof res !== 'object') return GAME_STATUS.TERMINADO;
  return res.status || GAME_STATUS.AGENDADO;
}

// ---------------------------------------------------------------------------
// Football Sport Implementation
// ---------------------------------------------------------------------------

export class Football extends Sport {
  readonly id = 'football';
  readonly name = 'Football';
  readonly icon = '⚽';

  standingsColumns(): StandingsColumn[] {
    const c = en.standings.cols;
    return [
      { label: c.pts, value: (s) => s.Pts, className: 'pts-cell' },
      { label: c.p, value: (s) => s.J },
      { label: c.w, value: (s) => s.V },
      { label: c.d, value: (s) => s.E },
      { label: c.l, value: (s) => s.D },
      { label: c.gf, value: (s) => s.GM },
      { label: c.ga, value: (s) => s.GS },
      { label: c.gd, value: (s) => { const dg = s.DG ?? s.GM - s.GS; return (dg > 0 ? '+' : '') + dg; } },
    ];
  }

  ratingAttributes(): Record<string, string> {
    return en.players.attributes;
  }

  playerStatColumns(): PlayerStatColumn[] {
    return [
      { key: 'golos', title: en.statsTab.topScorers, unit: en.common.goals, empty: en.statsTab.noGoalsYet },
      { key: 'assistencias', title: en.statsTab.assistsTitle, unit: 'assist.', empty: en.statsTab.nothingRecordedYet },
      { key: 'mvp', title: en.statsTab.mvpTitle, unit: '×', empty: en.statsTab.nothingRecordedYet },
    ];
  }

  computeStandings(
    teamsArray: (Team | string)[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): GroupStandings[] {
    const nGrupos = config.numGrupos || 1;
    const groupStats: GroupStandings[] = [];

    for (let g = 0; g < nGrupos; g++) {
      groupStats.push({
        name: nGrupos > 1 ? `Group ${String.fromCharCode(65 + g)}` : 'General Standings',
        standings: [],
      });
    }

    const stats: StandingsRow[] = teamsArray.map((t, idx) => {
      const name = typeof t === 'string' ? t : (t && t.name ? t.name : `Team ${idx + 1}`);
      return { idx, name, J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, Pts: 0 };
    });

    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;

      const resObj = results[gi];
      if (!resObj) return;

      if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;

      const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
      const m = /^(\d+)-(\d+)$/.exec(String(resStr || '').trim());
      if (!m) return;

      const gc = parseInt(m[1], 10);
      const gf = parseInt(m[2], 10);
      const home = typeof game.home === 'number' ? stats[game.home] : undefined;
      const away = typeof game.away === 'number' ? stats[game.away] : undefined;
      if (!home || !away) return;

      home.J++;
      away.J++;
      home.GM += gc;
      home.GS += gf;
      away.GM += gf;
      away.GS += gc;

      if (gc > gf) {
        home.V++;
        away.D++;
        home.Pts += config.pontosVitoria + (gc >= config.golosGoleada ? config.bonusGoleada : 0);
        away.Pts += config.pontosDerrota;
      } else if (gc < gf) {
        away.V++;
        home.D++;
        away.Pts += config.pontosVitoria + (gf >= config.golosGoleada ? config.bonusGoleada : 0);
        home.Pts += config.pontosDerrota;
      } else {
        home.E++;
        away.E++;
        home.Pts += config.pontosEmpate;
        away.Pts += config.pontosEmpate;
      }
    });

    stats.forEach((s) => {
      s.DG = s.GM - s.GS;
    });

    stats.forEach((s) => {
      const t = teamsArray[s.idx];
      let g = typeof t === 'object' && t !== null && t.group !== undefined ? t.group : 0;
      if (g >= nGrupos) g = nGrupos - 1;
      groupStats[g].standings.push(s);
    });

    groupStats.forEach((group) => {
      const sorted = group.standings.sort(
        (a, b) =>
          b.Pts - a.Pts ||
          (b.DG ?? 0) - (a.DG ?? 0) ||
          b.GM - a.GM
      );

      let finalArr: StandingsRow[] = [];
      let i = 0;
      while (i < sorted.length) {
        let j = i + 1;
        while (
          j < sorted.length &&
          sorted[j].Pts === sorted[i].Pts &&
          sorted[j].DG === sorted[i].DG &&
          sorted[j].GM === sorted[i].GM
        ) {
          j++;
        }

        let cluster = sorted.slice(i, j);
        if (cluster.length > 1) {
          cluster = this.resolveHeadToHead(cluster, schedule, results, config);
        }
        finalArr = finalArr.concat(cluster);
        i = j;
      }

      group.standings = finalArr;
    });

    return groupStats;
  }

  resolveHeadToHead(
    cluster: StandingsRow[],
    schedule: Match[],
    results: Record<string | number, MatchResult>,
    config: Config
  ): StandingsRow[] {
    const ids: Record<number, boolean> = {};
    cluster.forEach((c) => {
      ids[c.idx] = true;
    });

    const mini: Record<number, { pts: number; gm: number; gs: number }> = {};
    cluster.forEach((c) => {
      mini[c.idx] = { pts: 0, gm: 0, gs: 0 };
    });

    schedule.forEach((game, gi) => {
      if (game.isPlayoff) return;

      const resObj = results[gi];
      if (!resObj) return;
      if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;
      if (typeof game.home !== 'number' || typeof game.away !== 'number') return;
      if (!ids[game.home] || !ids[game.away]) return;

      const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
      const m = /^(\d+)-(\d+)$/.exec(String(resStr || '').trim());
      if (!m) return;

      const gc = parseInt(m[1], 10);
      const gf = parseInt(m[2], 10);
      mini[game.home].gm += gc;
      mini[game.home].gs += gf;
      mini[game.away].gm += gf;
      mini[game.away].gs += gc;

      if (gc > gf) {
        mini[game.home].pts += config.pontosVitoria + (gc >= config.golosGoleada ? config.bonusGoleada : 0);
      } else if (gc < gf) {
        mini[game.away].pts += config.pontosVitoria + (gf >= config.golosGoleada ? config.bonusGoleada : 0);
      } else {
        mini[game.home].pts += config.pontosEmpate;
        mini[game.away].pts += config.pontosEmpate;
      }
    });

    return cluster.slice().sort((a, b) => {
      const ma = mini[a.idx];
      const mb = mini[b.idx];
      if (mb.pts !== ma.pts) return mb.pts - ma.pts;
      const dgA = ma.gm - ma.gs;
      const dgB = mb.gm - mb.gs;
      if (dgB !== dgA) return dgB - dgA;
      if (mb.gm !== ma.gm) return mb.gm - ma.gm;
      if (a.GS !== b.GS) return a.GS - b.GS;
      return a.name.localeCompare(b.name);
    });
  }

  getPlayoffWinner(game: Match, res: MatchResult | undefined): number | string | null {
    if (!game || !game.isPlayoff || !res || typeof res !== 'object') return null;
    if (res.status !== GAME_STATUS.TERMINADO) return null;

    const m = /^(\d+)-(\d+)$/.exec(String(res.score || '').trim());
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const a = parseInt(m[2], 10);
    if (h > a) return game.home;
    if (a > h) return game.away;

    const p = /^(\d+)-(\d+)$/.exec(String(res.penalties || '').trim());
    if (!p) return null;
    const ph = parseInt(p[1], 10);
    const pa = parseInt(p[2], 10);
    if (ph > pa) return game.home;
    if (pa > ph) return game.away;
    return null;
  }

  tallyPlayerStats(
    results: Record<string | number, MatchResult>,
    jogosSingulares: SingleMatch[] = []
  ): Record<string, PlayerStats> {
    const out: Record<string, PlayerStats> = Object.create(null);
    const get = (pid: string) => {
      if (!out[pid]) out[pid] = emptyPlayerTally();
      return out[pid];
    };

    function addGame(scorers: string[], assists: string[], mvp?: string) {
      const golosNoJogo: Record<string, number> = Object.create(null);
      scorers.forEach((pid) => {
        if (!pid || pid === 'auto') return;
        get(pid).golos++;
        golosNoJogo[pid] = (golosNoJogo[pid] || 0) + 1;
      });
      Object.keys(golosNoJogo).forEach((pid) => {
        const t = get(pid);
        t.jogosAMarcar++;
        t.recorde = Math.max(t.recorde, golosNoJogo[pid]);
      });
      assists.forEach((pid) => {
        if (pid && pid !== 'auto') get(pid).assistencias++;
      });
      if (mvp) get(mvp).mvp++;
    }

    Object.keys(results || {}).forEach((gi) => {
      const res = results[gi];
      if (!res || typeof res !== 'object') return;
      const sc = res.scorers || { home: [], away: [] };
      const as = res.assists || { home: [], away: [] };
      addGame(
        [...(sc.home || []), ...(sc.away || [])],
        [...(as.home || []), ...(as.away || [])],
        res.mvp
      );
    });

    (jogosSingulares || []).forEach((jogo) => {
      addGame(
        [...(jogo.scorersA || []), ...(jogo.scorersB || [])],
        [...(jogo.assistsA || []), ...(jogo.assistsB || [])],
        jogo.mvp
      );
    });

    return out;
  }

  alignAssists(scorers: string[], assists?: string[]): string[] {
    const out = (assists || []).slice(0, (scorers || []).length);
    while (out.length < (scorers || []).length) out.push('');
    return out;
  }

  addGoal(
    res: MatchResult | undefined,
    side: 'home' | 'away',
    pid: string,
    aid?: string
  ): Score {
    const out = resultObject(res);
    if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
    const s = scoreParts(out.score);
    s[side]++;
    out.score = `${s.home}-${s.away}`;
    const assists = { ...(out.assists || {}) };
    out.assists = assists;
    const scorers = out.scorers || { home: [], away: [] };
    out.scorers = scorers;
    const sideScorers = scorers[side] || [];
    scorers[side] = sideScorers;
    assists[side] = this.alignAssists(sideScorers, assists[side]);
    sideScorers.push(pid);
    assists[side]!.push(aid || '');
    return out;
  }

  addPoint(res: MatchResult | undefined, side: 'home' | 'away', _config?: Config, pid = '', aid = ''): Score {
    return this.addGoal(res, side, pid, aid);
  }

  removePoint(res: MatchResult | undefined, side: 'home' | 'away'): Score {
    return this.removeGoal(res, side);
  }

  removeGoal(res: MatchResult | undefined, side: 'home' | 'away'): Score {
    if (res === null || res === undefined) return res as unknown as Score;
    const s = scoreParts(typeof res === 'object' ? res.score : res);
    if (s[side] <= 0) return res as Score;
    const out = resultObject(res);
    if (!out.status) out.status = GAME_STATUS.TERMINADO;
    s[side]--;
    out.score = `${s.home}-${s.away}`;
    const sideScorers = out.scorers?.[side];
    if (sideScorers && sideScorers.length > 0) {
      const assists = { ...(out.assists || {}) };
      out.assists = assists;
      assists[side] = this.alignAssists(sideScorers, assists[side]);
      sideScorers.pop();
      assists[side]?.pop();
    }
    return out;
  }

  setGameStatus(res: MatchResult | undefined, status: GameStatus): Score {
    const out = resultObject(res);
    out.status = status;
    return out;
  }

  gameGoals(
    res: MatchResult | undefined
  ): { home: Array<{ pid: string; aid: string }>; away: Array<{ pid: string; aid: string }> } {
    const out: { home: Array<{ pid: string; aid: string }>; away: Array<{ pid: string; aid: string }> } = {
      home: [],
      away: [],
    };
    if (!res || typeof res !== 'object') return out;
    (['home', 'away'] as const).forEach((side) => {
      const sc = (res.scorers && res.scorers[side]) || [];
      const as = this.alignAssists(sc, res.assists && res.assists[side]);
      out[side] = sc.map((pid, i) => ({ pid, aid: as[i] || '' }));
    });
    return out;
  }

  resultEvents(
    prev: Record<string, MatchResult> | null | undefined,
    next: Record<string, MatchResult> | null | undefined
  ): GameEvent[] {
    const events: GameEvent[] = [];
    const a = prev || {};
    const b = next || {};
    Object.keys(b).forEach((gi) => {
      const ra = a[gi];
      const rb = b[gi];
      if (!rb) return;
      const sa = statusOf(ra);
      const sb = statusOf(rb);
      if (sb === GAME_STATUS.TERMINADO && sa !== GAME_STATUS.TERMINADO) {
        events.push({ type: 'fim', gi });
        return;
      }
      const pa = scoreParts(ra && (typeof ra === 'object' ? ra.score : ra));
      const pb = scoreParts(typeof rb === 'object' ? rb.score : rb);
      let golos = false;
      (['home', 'away'] as const).forEach((side) => {
        if (pb[side] === pa[side]) return;
        golos = true;
        const scA = (ra && typeof ra === 'object' && ra.scorers && ra.scorers[side]) || [];
        const scB = (typeof rb === 'object' && rb.scorers && rb.scorers[side]) || [];
        if (pb[side] > pa[side]) {
          const i = scB.length - 1;
          const as = (rb && typeof rb === 'object' && rb.assists && rb.assists[side]) || [];
          events.push({
            type: 'golo',
            gi,
            side,
            pid: scB.length > scA.length ? scB[i] : '',
            aid: scB.length > scA.length ? (as[i] || '') : '',
          });
        } else {
          events.push({
            type: 'anulado',
            gi,
            side,
            pid: scA.length > scB.length ? scA[scA.length - 1] : '',
          });
        }
      });
      if (!golos && sb === GAME_STATUS.DECORRER && sa !== GAME_STATUS.DECORRER) {
        events.push({ type: 'inicio', gi });
      }
    });
    return events;
  }
}

export const football = new Football();

// Convenient standalone function exports delegating to the football singleton
export const computeStandings = football.computeStandings.bind(football);
export const resolveHeadToHead = football.resolveHeadToHead.bind(football);
export const getPlayoffWinner = football.getPlayoffWinner.bind(football);
export const tallyPlayerStats = football.tallyPlayerStats.bind(football);
export const mergePlayerStats = football.mergePlayerStats.bind(football);
export const alignAssists = football.alignAssists.bind(football);
export const addGoal = football.addGoal.bind(football);
export const removeGoal = football.removeGoal.bind(football);
export const setGameStatus = football.setGameStatus.bind(football);
export const gameGoals = football.gameGoals.bind(football);
export const resultEvents = football.resultEvents.bind(football);
export const standingsOrder = football.standingsOrder.bind(football);
export const rankMoves = football.rankMoves.bind(football);

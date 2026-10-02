// ---------------------------------------------------------------------------
// Constantes de status de jogo
// ---------------------------------------------------------------------------
export const GAME_STATUS = Object.freeze({
  AGENDADO: 'agendado',
  DECORRER: 'decorrer',
  TERMINADO: 'terminado',
});

// ---------------------------------------------------------------------------
// Algoritmo de Berger (round-robin)
// ---------------------------------------------------------------------------
export function bergerRounds(n) {
  const teams = [];
  for (let i = 0; i < n; i++) teams.push(i);
  if (n % 2 !== 0) teams.push(-1); // bye slot

  const total = teams.length;
  const fixed = teams[0];
  let rest = teams.slice(1);
  const rounds = [];

  for (let r = 0; r < total - 1; r++) {
    const l = [fixed, ...rest];
    const pairs = [];
    let bye = null;

    for (let k = 0; k < total / 2; k++) {
      let t1 = l[k];
      let t2 = l[total - 1 - k];

      if (r % 2 === 1) {
        [t1, t2] = [t2, t1];
      }

      if (t1 === -1) bye = t2;
      else if (t2 === -1) bye = t1;
      else pairs.push([t1, t2]);
    }

    rounds.push({ pairs, bye });
    rest = [rest[rest.length - 1], ...rest.slice(0, -1)];
  }

  return rounds;
}

// ---------------------------------------------------------------------------
// Geração do calendário completo (liga + grupos + voltas)
// ---------------------------------------------------------------------------
export function generateSchedule(groupsIndices, numVoltas) {
  const schedule = [];
  const roundsMeta = [];
  const nGrupos = groupsIndices.length;

  let maxRoundsPerVolta = 0;
  const groupBergerRounds = groupsIndices.map((group) => {
    const bRounds = bergerRounds(group.length);
    if (bRounds.length > maxRoundsPerVolta) maxRoundsPerVolta = bRounds.length;
    return bRounds;
  });

  let jornada = 1;

  for (let v = 0; v < numVoltas; v++) {
    const mirror = v % 2 === 1;

    for (let ri = 0; ri < maxRoundsPerVolta; ri++) {
      const roundByes = [];

      for (let g = 0; g < nGrupos; g++) {
        if (ri >= groupBergerRounds[g].length) continue;

        const round = groupBergerRounds[g][ri];

        for (const pair of round.pairs) {
          const t1 = pair[0] === -1 ? -1 : groupsIndices[g][pair[0]];
          const t2 = pair[1] === -1 ? -1 : groupsIndices[g][pair[1]];
          const home = mirror ? t2 : t1;
          const away = mirror ? t1 : t2;
          schedule.push({ jornada, home, away, group: g });
        }

        if (round.bye !== null) {
          roundByes.push(groupsIndices[g][round.bye]);
        }
      }

      roundsMeta.push({ jornada, bye: roundByes.length ? roundByes.join(', ') : null });
      jornada++;
    }
  }

  return { schedule, roundsMeta };
}

// ---------------------------------------------------------------------------
// Volta extra (acrescentada a um calendário já existente)
// ---------------------------------------------------------------------------
/**
 * Gera os jogos de uma nova volta a partir da 1ª volta do calendário atual,
 * sem tocar nos jogos existentes (os resultados estão guardados pela posição
 * do jogo em `schedule`, por isso os índices antigos não podem mudar).
 *
 * @param {object[]} schedule   - Calendário atual (só liga, sem eliminatórias)
 * @param {object[]} roundsMeta - Metadados das jornadas atuais
 * @param {number}   numVoltas  - Número de voltas já existentes
 * @returns {{ games: object[], rounds: object[] }}
 */
export function buildExtraVolta(schedule, roundsMeta, numVoltas) {
  const roundsPerVolta = roundsMeta.length / numVoltas;
  const offset = roundsPerVolta * numVoltas;
  const mirror = numVoltas % 2 === 1; // a nova volta tem índice numVoltas

  const games = schedule
    .filter((g) => !g.isPlayoff && g.jornada <= roundsPerVolta)
    .map((g) => ({
      ...g,
      jornada: g.jornada + offset,
      home: mirror ? g.away : g.home,
      away: mirror ? g.home : g.away,
    }));

  const rounds = roundsMeta
    .slice(0, roundsPerVolta)
    .map((r) => ({ ...r, jornada: r.jornada + offset }));

  return { games, rounds };
}

// ---------------------------------------------------------------------------
// Eliminatórias
// ---------------------------------------------------------------------------
/**
 * Calcula os pares de seeds para a 1ª ronda de um bracket de N equipas.
 * Ordem de bracket padrão: cada seed s numa ronda de tamanho m defronta m-1-s,
 * e os pares ficam arrumados para que 1 e 2 só se possam cruzar na final.
 * Exemplo para N=8: [0,7], [3,4], [1,6], [2,5]
 *
 * @param {number} n - Número total de equipas (potência de 2)
 * @returns {[number, number][]} - Pares de índices de seed (0-based)
 */
export function buildFirstRoundSeeding(n) {
  let order = [0];
  while (order.length < n) {
    const m = order.length * 2;
    order = order.flatMap((s) => [s, m - 1 - s]);
  }

  const pairs = [];
  for (let i = 0; i < order.length; i += 2) pairs.push([order[i], order[i + 1]]);
  return pairs;
}

/**
 * Devolve o índice da equipa vencedora de um jogo de eliminatória terminado,
 * usando os penáltis em caso de empate. Devolve null se ainda não há vencedor.
 */
export function getPlayoffWinner(game, res) {
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

// ---------------------------------------------------------------------------
// Cálculo de classificação (standings) por grupo
// ---------------------------------------------------------------------------
export function computeStandings(teamsArray, schedule, results, config) {
  const nGrupos = config.numGrupos || 1;
  const groupStats = [];

  for (let g = 0; g < nGrupos; g++) {
    groupStats.push({
      name: nGrupos > 1 ? `Grupo ${String.fromCharCode(65 + g)}` : 'Classificação Geral',
      standings: [],
    });
  }

  const stats = teamsArray.map((t, idx) => {
    const name = typeof t === 'string' ? t : (t && t.name ? t.name : `Equipa ${idx + 1}`);
    return { idx, name, J: 0, V: 0, E: 0, D: 0, GM: 0, GS: 0, Pts: 0 };
  });

  schedule.forEach((game, gi) => {
    if (game.isPlayoff) return;

    const resObj = results[gi];
    if (!resObj) return;

    if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;

    const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
    const m = /^(\d+)-(\d+)$/.exec(resStr.trim());
    if (!m) return;

    const gc = parseInt(m[1], 10);
    const gf = parseInt(m[2], 10);
    const home = stats[game.home];
    const away = stats[game.away];
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

  stats.forEach((s) => { s.DG = s.GM - s.GS; });

  stats.forEach((s) => {
    const t = teamsArray[s.idx];
    let g = t && t.group !== undefined ? t.group : 0;
    if (g >= nGrupos) g = nGrupos - 1;
    groupStats[g].standings.push(s);
  });

  groupStats.forEach((group) => {
    const sorted = group.standings.sort((a, b) =>
      (b.Pts - a.Pts) || (b.DG - a.DG) || (b.GM - a.GM)
    );

    let finalArr = [];
    let i = 0;
    while (i < sorted.length) {
      let j = i + 1;
      while (
        j < sorted.length &&
        sorted[j].Pts === sorted[i].Pts &&
        sorted[j].DG === sorted[i].DG &&
        sorted[j].GM === sorted[i].GM
      ) j++;

      let cluster = sorted.slice(i, j);
      if (cluster.length > 1) cluster = resolveHeadToHead(cluster, schedule, results, config);
      finalArr = finalArr.concat(cluster);
      i = j;
    }

    group.standings = finalArr;
  });

  return groupStats;
}

// ---------------------------------------------------------------------------
// Desempate por confronto direto (head-to-head)
// ---------------------------------------------------------------------------
export function resolveHeadToHead(cluster, schedule, results, config) {
  const ids = {};
  cluster.forEach((c) => { ids[c.idx] = true; });

  const mini = {};
  cluster.forEach((c) => { mini[c.idx] = { pts: 0, gm: 0, gs: 0 }; });

  schedule.forEach((game, gi) => {
    if (game.isPlayoff) return;

    const resObj = results[gi];
    if (!resObj) return;
    if (typeof resObj === 'object' && resObj.status === GAME_STATUS.AGENDADO) return;
    if (!ids[game.home] || !ids[game.away]) return;

    const resStr = typeof resObj === 'object' ? resObj.score : String(resObj);
    const m = /^(\d+)-(\d+)$/.exec(resStr.trim());
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

// ---------------------------------------------------------------------------
// Avaliação e Snake Draft — Jogo Singular
// ---------------------------------------------------------------------------

/**
 * Calcula o rating global de um jogador (média dos 6 atributos, 0–5).
 * @param {object} player - Jogador da base de dados global
 * @returns {number} rating arredondado a 1 casa decimal
 */
export function getPlayerRating(player) {
  if (!player || !player.atributos) return 0;
  const a = player.atributos;
  const vals = [a.velocidade, a.finalizacao, a.passe, a.drible, a.defesa, a.fisico];
  const sum = vals.reduce((s, v) => s + (Number(v) || 0), 0);
  return Math.round((sum / 6) * 10) / 10;
}

/**
 * Calcula o rating total de uma equipa (soma dos ratings individuais).
 * @param {object[]} players
 * @returns {number}
 */
export function getTeamTotalRating(players) {
  return Math.round(players.reduce((s, p) => s + getPlayerRating(p), 0) * 10) / 10;
}

/**
 * Divide os jogadores em 2 equipas pelo método Snake Draft.
 *
 * Ordena por rating decrescente e aplica o padrão:
 *   Pick 1 → A, Pick 2 → B, Pick 3 → B, Pick 4 → A, Pick 5 → A, ...
 * (A, BB, AA, BB, AA, ...)
 *
 * @param {object[]} players - Lista de jogadores selecionados
 * @returns {{ equipaA: object[], equipaB: object[] }}
 */
export function snakeDraft(players) {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b) - getPlayerRating(a));
  const equipaA = [];
  const equipaB = [];

  // Padrão de picks: A=0, B=1, B=1, A=0, A=0, B=1, B=1, ...
  // pick index 0→A, 1→B, 2→B, 3→A, 4→A, 5→B, 6→B, ...
  sorted.forEach((player, i) => {
    const cycle = Math.floor(i / 2) % 2; // 0 ou 1, alterna a cada 2 picks
    const pickA = (i === 0) || (i % 2 === 0 && cycle === 0) || (i % 2 !== 0 && cycle === 1);
    if (pickA) {
      equipaA.push(player);
    } else {
      equipaB.push(player);
    }
  });

  return { equipaA, equipaB };
}

/**
 * Divide os jogadores em 2 equipas com o rating total o mais próximo possível.
 *
 * As equipas ficam com o mesmo número de jogadores (ou um de diferença).
 * Até 20 jogadores testa todas as divisões; acima disso parte do snake draft
 * e troca pares de jogadores enquanto a diferença diminuir.
 *
 * @param {object[]} players - Lista de jogadores selecionados
 * @returns {{ equipaA: object[], equipaB: object[] }}
 */
export function balancedDraft(players) {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b) - getPlayerRating(a));
  const n = sorted.length;
  if (n < 2) return { equipaA: sorted, equipaB: [] };

  // Ratings em décimas, para comparar sem erros de vírgula flutuante
  const r = sorted.map((p) => Math.round(getPlayerRating(p) * 10));
  const total = r.reduce((s, v) => s + v, 0);
  const sizeA = Math.ceil(n / 2);

  let bestMask = null;

  if (n <= 20) {
    // O primeiro jogador fica sempre na equipa A, para não repetir divisões espelhadas
    const sizes = new Set([Math.floor(n / 2), sizeA]);
    let bestDiff = Infinity;
    const pick = (i, count, sum, mask) => {
      if (bestDiff === 0 || count > sizeA) return;
      if (i === n) {
        if (!sizes.has(count)) return;
        const diff = Math.abs(total - 2 * sum);
        if (diff < bestDiff) { bestDiff = diff; bestMask = mask; }
        return;
      }
      if (count + (n - i) < Math.floor(n / 2)) return;
      pick(i + 1, count + 1, sum + r[i], mask | (1 << i));
      if (i > 0) pick(i + 1, count, sum, mask);
    };
    pick(0, 0, 0, 0);
  }

  let inA;
  if (bestMask !== null) {
    inA = sorted.map((_, i) => (bestMask & (1 << i)) !== 0);
  } else {
    const snake = snakeDraft(sorted);
    const setA = new Set(snake.equipaA);
    inA = sorted.map((p) => setA.has(p));
    let sumA = r.reduce((s, v, i) => s + (inA[i] ? v : 0), 0);
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < n && !improved; i++) {
        if (!inA[i]) continue;
        for (let j = 0; j < n; j++) {
          if (inA[j]) continue;
          const newSum = sumA - r[i] + r[j];
          if (Math.abs(total - 2 * newSum) < Math.abs(total - 2 * sumA)) {
            inA[i] = false;
            inA[j] = true;
            sumA = newSum;
            improved = true;
            break;
          }
        }
      }
    }
  }

  return {
    equipaA: sorted.filter((_, i) => inA[i]),
    equipaB: sorted.filter((_, i) => !inA[i]),
  };
}

// ---------------------------------------------------------------------------
// Estatísticas de jogadores (golos, assistências, MVP)
// ---------------------------------------------------------------------------

function emptyPlayerTally() {
  return { golos: 0, assistencias: 0, mvp: 0, jogosAMarcar: 0, recorde: 0 };
}

/**
 * Soma golos, assistências e MVPs por jogador.
 *
 * Um jogo pode ter `scorers` (lista de ids, 'auto' = autogolo), `assists`
 * (alinhada com scorers, '' = sem assistência) e `mvp`.
 *
 * @param {object} results - Resultados do torneio (por índice de jogo)
 * @param {object[]} jogosSingulares - Jogos singulares
 * @returns {Object<string, {golos:number, assistencias:number, mvp:number, jogosAMarcar:number, recorde:number}>}
 */
export function tallyPlayerStats(results, jogosSingulares) {
  // Sem protótipo: os ids vêm do Firebase e podem ser '__proto__' ou 'constructor'
  const out = Object.create(null);
  const get = (pid) => {
    if (!out[pid]) out[pid] = emptyPlayerTally();
    return out[pid];
  };

  function addGame(scorers, assists, mvp) {
    const golosNoJogo = Object.create(null);
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
    const sc = res.scorers || {};
    const as = res.assists || {};
    addGame(
      [...(sc.home || []), ...(sc.away || [])],
      [...(as.home || []), ...(as.away || [])],
      res.mvp,
    );
  });

  (jogosSingulares || []).forEach((jogo) => {
    addGame(
      [...(jogo.scorersA || []), ...(jogo.scorersB || [])],
      [...(jogo.assistsA || []), ...(jogo.assistsB || [])],
      jogo.mvp,
    );
  });

  return out;
}

/** Junta várias contagens de tallyPlayerStats (recorde fica o máximo). */
export function mergePlayerStats(...tallies) {
  const out = Object.create(null);
  tallies.forEach((tally) => {
    Object.keys(tally || {}).forEach((pid) => {
      const t = tally[pid];
      if (!out[pid]) out[pid] = emptyPlayerTally();
      const o = out[pid];
      o.golos += t.golos || 0;
      o.assistencias += t.assistencias || 0;
      o.mvp += t.mvp || 0;
      o.jogosAMarcar += t.jogosAMarcar || 0;
      o.recorde = Math.max(o.recorde, t.recorde || 0);
    });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Arquivo de torneios
// ---------------------------------------------------------------------------

/**
 * Índice da equipa campeã: vencedor da final se houver eliminatórias, senão o
 * primeiro da liga (só com um grupo). null se ainda não há campeão.
 */
export function getChampion(schedule, results, groupsData) {
  const playoffs = schedule.map((g, gi) => ({ g, gi })).filter(({ g }) => g.isPlayoff);
  if (playoffs.length) {
    const final = playoffs.find(({ g }) => !g.nextMatchId);
    return final ? getPlayoffWinner(final.g, results[final.gi]) : null;
  }
  if (groupsData.length !== 1) return null;
  const leader = groupsData[0].standings[0];
  return leader && leader.J > 0 ? leader.idx : null;
}

/** Número de jogos do torneio com resultado (não agendados). */
export function countPlayedGames(results) {
  return Object.keys(results || {}).filter((gi) => {
    const r = results[gi];
    if (!r) return false;
    if (typeof r === 'object' && r.status === GAME_STATUS.AGENDADO) return false;
    const score = typeof r === 'object' ? r.score : String(r);
    return /^\d+-\d+$/.test(String(score || '').trim());
  }).length;
}

/**
 * Cria o registo de um torneio terminado para o arquivo: tabela final,
 * campeão e estatísticas por jogador (só jogos do torneio).
 *
 * @param {object} snap - { config, teams, schedule, results, scheduleTeamCount }
 * @param {Object<string,string>} playerNames - pid → nome
 * @param {string} id
 * @param {string} dataIso
 */
export function buildArchiveEntry(snap, playerNames, id, dataIso) {
  const teamsArray = snap.teams.slice(0, snap.scheduleTeamCount || snap.config.numEquipas);
  const groupsData = computeStandings(teamsArray, snap.schedule, snap.results, snap.config);
  const teamOf = (idx) => {
    const t = teamsArray[idx];
    return { nome: (t && t.name) || `Equipa ${idx + 1}`, cor: (t && t.color) || '' };
  };

  const champIdx = getChampion(snap.schedule, snap.results, groupsData);
  const tally = tallyPlayerStats(snap.results, []);
  const jogadores = Object.keys(tally)
    .map((pid) => ({ pid, nome: playerNames[pid] || 'Jogador Desconhecido', ...tally[pid] }))
    .sort((a, b) => (b.golos - a.golos) || (b.assistencias - a.assistencias) || (b.mvp - a.mvp));

  return {
    id,
    nome: snap.config.nome || 'Torneio',
    data: dataIso,
    campeao: champIdx === null ? null : teamOf(champIdx),
    jogos: countPlayedGames(snap.results),
    golos: groupsData.reduce((s, g) => s + g.standings.reduce((t, x) => t + x.GM, 0), 0),
    grupos: groupsData.map((g) => ({
      nome: g.name,
      tabela: g.standings.map((s) => ({
        ...teamOf(s.idx), J: s.J, V: s.V, E: s.E, D: s.D, GM: s.GM, GS: s.GS, DG: s.DG, Pts: s.Pts,
      })),
    })),
    jogadores,
  };
}

/** Estatísticas de jogador guardadas num registo do arquivo, no formato de tallyPlayerStats. */
export function archiveTally(entry) {
  const out = Object.create(null);
  (entry.jogadores || []).forEach((j) => {
    out[j.pid] = {
      golos: j.golos || 0, assistencias: j.assistencias || 0, mvp: j.mvp || 0,
      jogosAMarcar: j.jogosAMarcar || 0, recorde: j.recorde || 0,
    };
  });
  return out;
}

// ---------------------------------------------------------------------------
// Golos de um jogo do torneio
// ---------------------------------------------------------------------------

/** Lista de assistências com o mesmo tamanho que a de marcadores ('' = sem assistência). */
export function alignAssists(scorers, assists) {
  const out = (assists || []).slice(0, (scorers || []).length);
  while (out.length < (scorers || []).length) out.push('');
  return out;
}

/** Cópia do resultado de um jogo como objeto (resultados antigos podem ser só '2-1'). */
function resultObject(res) {
  if (res && typeof res === 'object') {
    const out = JSON.parse(JSON.stringify(res));
    out.scorers = { home: [], away: [], ...(out.scorers || {}) };
    return out;
  }
  return { score: typeof res === 'string' ? res : '0-0', scorers: { home: [], away: [] } };
}

function scoreParts(score) {
  const m = /^(\d+)-(\d+)$/.exec(String(score || '').trim());
  return m ? { home: Number(m[1]), away: Number(m[2]) } : { home: 0, away: 0 };
}

/**
 * Regista um golo a partir do resultado guardado (e não do que está no ecrã),
 * para não perder golos registados entretanto noutro telemóvel.
 *
 * @param {object|string|undefined} res - Resultado atual do jogo
 * @param {'home'|'away'} side
 * @param {string} pid - Marcador ('auto' = autogolo)
 * @param {string} aid - Assistência ('' = sem assistência)
 * @returns {object} Novo resultado
 */
export function addGoal(res, side, pid, aid) {
  const out = resultObject(res);
  if (!out.status || out.status === GAME_STATUS.AGENDADO) out.status = GAME_STATUS.DECORRER;
  const s = scoreParts(out.score);
  s[side]++;
  out.score = `${s.home}-${s.away}`;
  out.assists = { ...(out.assists || {}) };
  out.assists[side] = alignAssists(out.scorers[side], out.assists[side]);
  out.scorers[side].push(pid);
  out.assists[side].push(aid || '');
  return out;
}

/**
 * Tira o último golo de uma equipa. Sem resultado ou com 0 golos devolve o
 * resultado tal como está.
 */
export function removeGoal(res, side) {
  if (res === null || res === undefined) return res;
  const s = scoreParts(typeof res === 'object' ? res.score : res);
  if (s[side] <= 0) return res;
  const out = resultObject(res);
  if (!out.status) out.status = GAME_STATUS.TERMINADO;
  s[side]--;
  out.score = `${s.home}-${s.away}`;
  if (out.scorers[side].length > 0) {
    out.assists = { ...(out.assists || {}) };
    out.assists[side] = alignAssists(out.scorers[side], out.assists[side]);
    out.scorers[side].pop();
    out.assists[side].pop();
  }
  return out;
}

/** Muda o estado de um jogo (resultados antigos só com texto passam a objeto). */
export function setGameStatus(res, status) {
  const out = resultObject(res);
  out.status = status;
  return out;
}

/**
 * Golos de cada equipa pela ordem em que foram marcados, para a janela do jogo.
 *
 * @returns {{home: {pid:string, aid:string}[], away: {pid:string, aid:string}[]}}
 */
export function gameGoals(res) {
  const out = { home: [], away: [] };
  if (!res || typeof res !== 'object') return out;
  ['home', 'away'].forEach((side) => {
    const sc = (res.scorers && res.scorers[side]) || [];
    const as = alignAssists(sc, res.assists && res.assists[side]);
    out[side] = sc.map((pid, i) => ({ pid, aid: as[i] || '' }));
  });
  return out;
}

function statusOf(res) {
  if (!res) return null;
  if (typeof res !== 'object') return GAME_STATUS.TERMINADO;
  return res.status || GAME_STATUS.AGENDADO;
}

/**
 * Compara dois estados dos resultados e devolve o que aconteceu, para as
 * animações: jogo começou, golo, golo anulado, jogo terminou.
 *
 * Um resultado escrito de uma vez já terminado (sem passar por "a decorrer")
 * só dá o evento de fim, para não animar cada golo.
 *
 * @returns {{type:'inicio'|'golo'|'anulado'|'fim', gi:string, side?:string, pid?:string, aid?:string}[]}
 */
export function resultEvents(prev, next) {
  const events = [];
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
    ['home', 'away'].forEach((side) => {
      if (pb[side] === pa[side]) return;
      golos = true;
      const scA = (ra && typeof ra === 'object' && ra.scorers && ra.scorers[side]) || [];
      const scB = (typeof rb === 'object' && rb.scorers && rb.scorers[side]) || [];
      if (pb[side] > pa[side]) {
        const i = scB.length - 1;
        const as = (rb.assists && rb.assists[side]) || [];
        events.push({ type: 'golo', gi, side, pid: scB.length > scA.length ? scB[i] : '', aid: scB.length > scA.length ? (as[i] || '') : '' });
      } else {
        events.push({ type: 'anulado', gi, side, pid: scA.length > scB.length ? scA[scA.length - 1] : '' });
      }
    });
    if (!golos && sb === GAME_STATUS.DECORRER && sa !== GAME_STATUS.DECORRER) events.push({ type: 'inicio', gi });
  });
  return events;
}

/**
 * Lugar de cada equipa na classificação: Map equipa → { g: grupo, r: posição }.
 * @param {Array<{standings: Array<{idx: number}>}>} groupsData
 */
export function standingsOrder(groupsData) {
  const order = new Map();
  (groupsData || []).forEach((group, g) => {
    group.standings.forEach((s, r) => order.set(String(s.idx), { g, r }));
  });
  return order;
}

/**
 * Lugares ganhos (positivo) ou perdidos (negativo) por equipa entre duas
 * classificações. Só entram equipas que mudaram de lugar no mesmo grupo.
 */
export function rankMoves(before, after) {
  const moves = new Map();
  if (!before || !after) return moves;
  after.forEach((now, team) => {
    const old = before.get(team);
    if (old && old.g === now.g && old.r !== now.r) moves.set(team, old.r - now.r);
  });
  return moves;
}

import type { Match, RoundMeta } from '../types.js';

// ---------------------------------------------------------------------------
// Berger Algorithm (round-robin scheduling)
// ---------------------------------------------------------------------------

export interface BergerRound {
  pairs: [number, number][];
  bye: number | null;
}

/**
 * Computes round-robin rounds for n teams using Berger tables.
 * If n is odd, an extra dummy team (-1) is used for byes.
 */
export function bergerRounds(n: number): BergerRound[] {
  const teams: number[] = [];
  for (let i = 0; i < n; i++) teams.push(i);
  if (n % 2 !== 0) teams.push(-1); // bye slot

  const total = teams.length;
  const fixed = teams[0];
  let rest = teams.slice(1);
  const rounds: BergerRound[] = [];

  for (let r = 0; r < total - 1; r++) {
    const l = [fixed, ...rest];
    const pairs: [number, number][] = [];
    let bye: number | null = null;

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
// Complete schedule generation (league + groups + voltas/rounds)
// ---------------------------------------------------------------------------

export interface GeneratedSchedule {
  schedule: Match[];
  roundsMeta: RoundMeta[];
}

export function generateSchedule(groupsIndices: number[][], numVoltas: number): GeneratedSchedule {
  const schedule: Match[] = [];
  const roundsMeta: RoundMeta[] = [];
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
      const roundByes: number[] = [];

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
// Extra round (appended to an existing schedule)
// ---------------------------------------------------------------------------

export interface ExtraVoltaResult {
  games: Match[];
  rounds: RoundMeta[];
}

/**
 * Generates matches for a new round (volta) based on round 1 of the current schedule,
 * preserving existing games so stored results remain at their original indices.
 */
export function buildExtraVolta(
  schedule: Match[],
  roundsMeta: RoundMeta[],
  numVoltas: number
): ExtraVoltaResult {
  const roundsPerVolta = roundsMeta.length / numVoltas;
  const offset = roundsPerVolta * numVoltas;
  const mirror = numVoltas % 2 === 1; // new volta index is numVoltas

  const games: Match[] = schedule
    .filter((g) => !g.isPlayoff && (typeof g.jornada === 'number' && g.jornada <= roundsPerVolta))
    .map((g) => ({
      ...g,
      jornada: (g.jornada as number) + offset,
      home: mirror ? g.away : g.home,
      away: mirror ? g.home : g.away,
    }));

  const rounds: RoundMeta[] = roundsMeta
    .slice(0, roundsPerVolta)
    .map((r) => ({
      ...r,
      jornada: (typeof r.jornada === 'number' ? r.jornada + offset : r.jornada),
    }));

  return { games, rounds };
}

// ---------------------------------------------------------------------------
// Playoffs / Elimination seeding
// ---------------------------------------------------------------------------

/**
 * Computes seed pairings for the 1st round of an N-team single elimination bracket.
 * Standard bracket ordering: seed s plays m-1-s, and seeds 1 and 2 can only meet in the final.
 * Example for N=8: [0,7], [3,4], [1,6], [2,5]
 */
export function buildFirstRoundSeeding(n: number): [number, number][] {
  let order = [0];
  while (order.length < n) {
    const m = order.length * 2;
    order = order.flatMap((s) => [s, m - 1 - s]);
  }

  const pairs: [number, number][] = [];
  for (let i = 0; i < order.length; i += 2) {
    pairs.push([order[i], order[i + 1]]);
  }
  return pairs;
}

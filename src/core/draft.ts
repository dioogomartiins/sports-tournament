import type { Player, PlayerAttributes } from '../types.js';

// ---------------------------------------------------------------------------
// Player Ratings & Snake / Balanced Draft (Single Match / Jogo Singular)
// ---------------------------------------------------------------------------

export type PlayerWithAttributes = Partial<Player> & {
  atributos?: Partial<PlayerAttributes>;
  [key: string]: unknown;
};

/**
 * Calculates a player's overall rating (average of 6 attributes, 0-5).
 * @returns rating rounded to 1 decimal place.
 */
export function getPlayerRating(player: PlayerWithAttributes | null | undefined): number {
  if (!player || !player.atributos) return 0;
  const a = player.atributos;
  const vals = [a.velocidade, a.finalizacao, a.passe, a.drible, a.defesa, a.fisico];
  const sum = vals.reduce((s, v) => s + (Number(v) || 0), 0);
  return Math.round((sum / 6) * 10) / 10;
}

/**
 * Calculates the combined total rating of a team (sum of individual ratings).
 */
export function getTeamTotalRating(players: PlayerWithAttributes[]): number {
  return Math.round(players.reduce((s, p) => s + getPlayerRating(p), 0) * 10) / 10;
}

export interface DraftTeams<T> {
  equipaA: T[];
  equipaB: T[];
}

/**
 * Splits players into two teams using the Snake Draft algorithm.
 *
 * Sorts players by descending rating and applies the pick pattern:
 * Pick 1 -> A, Pick 2 -> B, Pick 3 -> B, Pick 4 -> A, Pick 5 -> A, ...
 * (A, BB, AA, BB, AA, ...)
 */
export function snakeDraft<T extends PlayerWithAttributes>(players: T[]): DraftTeams<T> {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b) - getPlayerRating(a));
  const equipaA: T[] = [];
  const equipaB: T[] = [];

  sorted.forEach((player, i) => {
    const cycle = Math.floor(i / 2) % 2; // 0 or 1, alternates every 2 picks
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
 * Splits players into 2 teams with total ratings as close as possible.
 *
 * Teams receive the same number of players (or differing by 1).
 * For up to 20 players, it explores all combinations. Above 20, it starts from snake draft
 * and greedily swaps player pairs to minimize rating difference.
 */
export function balancedDraft<T extends PlayerWithAttributes>(players: T[]): DraftTeams<T> {
  const sorted = players.slice().sort((a, b) => getPlayerRating(b) - getPlayerRating(a));
  const n = sorted.length;
  if (n < 2) return { equipaA: sorted, equipaB: [] };

  // Ratings in tenths to avoid floating point precision issues
  const r = sorted.map((p) => Math.round(getPlayerRating(p) * 10));
  const total = r.reduce((s, v) => s + v, 0);
  const sizeA = Math.ceil(n / 2);

  let bestMask: number | null = null;

  if (n <= 20) {
    // First player is always placed in team A to avoid exploring symmetric partitions
    const sizes = new Set([Math.floor(n / 2), sizeA]);
    let bestDiff = Infinity;
    const pick = (i: number, count: number, sum: number, mask: number) => {
      if (bestDiff === 0 || count > sizeA) return;
      if (i === n) {
        if (!sizes.has(count)) return;
        const diff = Math.abs(total - 2 * sum);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestMask = mask;
        }
        return;
      }
      if (count + (n - i) < Math.floor(n / 2)) return;
      pick(i + 1, count + 1, sum + r[i], mask | (1 << i));
      if (i > 0) pick(i + 1, count, sum, mask);
    };
    pick(0, 0, 0, 0);
  }

  let inA: boolean[];
  if (bestMask !== null) {
    const mask = bestMask;
    inA = sorted.map((_, i) => (mask & (1 << i)) !== 0);
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

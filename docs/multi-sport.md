# 🏟️ Multi-Sport Architecture

> **Status:** original proposal, kept for reference. The plan is now tracked in issue [#23](https://github.com/dioogomartiins/sports-tournament/issues/23), and its phases 1 to 4 are implemented: the abstract `Sport` class (`src/sports/Sport.ts`), the registry (`src/sports/registry.ts`, `getSport(id)`) and the football implementation (`src/sports/football/Football.ts`); multiple tournaments with a sport fixed at creation (`meta.sport`), global players with per-sport ratings, and per-sport admins. Padel has its own `Sport` class, score panel, standings and ratings. See [What exists today](#what-exists-today).

Torneio ILOG started as a football-only app. This document describes the plan to make it **sport-agnostic**, supporting football, padel, basketball, handball, volleyball or any other sport — all in the same codebase.

## Motivation

The scheduling (Berger), groups, playoffs, sync and permissions infrastructure is already generic. What varies between sports is:

- The **score format** (goals, sets/games, points)
- The **standings columns** and tiebreak criteria
- The **individual stats** (goals/assists vs points/rebounds)
- The **team composition** (squad of N vs pair of 2)
- The players' **rating attributes**
- The UI **terminology and icons**

## Sport profiles

The core idea: each sport is **one file** in `src/sports/` that exports an object with all the logic and configuration that varies. The app engine delegates to that profile instead of having `if/else` scattered around.

```
src/sports/
├── index.js          # registry: getSport(id) → profile
├── futebol.js        # ⚽ current profile (extracted from the existing code)
├── padel.js          # 🎾
├── basquetebol.js    # 🏀
├── andebol.js        # 🤾
└── voleibol.js       # 🏐
```

### Profile interface

```js
export default {
  id: 'futebol',
  nome: 'Futebol',
  icon: '⚽',

  // ── Score ──
  parseScore(str) { },       // "3-1" → { home: 3, away: 1 }
  formatScore(parsed) { },   // → "3-1"
  validateScore(str) { },    // → boolean
  hasDraws: true,
  tiebreakType: 'penalties', // 'penalties' | 'overtime' | 'tiebreak' | null

  // ── Standings ──
  defaultPoints: { win: 3, draw: 1, loss: 0 },
  standingsColumns: ['J', 'V', 'E', 'D', 'GM', 'GS', 'DG', 'Pts'],
  sortCriteria: ['Pts', 'DG', 'GM', 'head-to-head'],
  computeRow(parsed, config) { },

  // ── Individual stats ──
  statFields: ['golos', 'assistencias', 'mvp'],
  statLabels: { golos: 'Golos', assistencias: 'Assistências', mvp: 'MVP' },
  statIcons:  { golos: '⚽', assistencias: '🅰️', mvp: '⭐' },
  tallyStats(results, players) { },

  // ── Team ──
  teamSize: { min: 1, max: 30 },
  hasJerseyNumber: true,
  playerAttrs: ['velocidade', 'finalizacao', 'passe', 'drible', 'defesa', 'fisico'],

  // ── UI ──
  scoreInputType: 'counter',  // 'counter' | 'sets-grid' | 'number-pair'
  animationEvents: {
    score:  { title: 'GOLO!', icon: '⚽' },
    cancel: { title: 'GOLO ANULADO', icon: '❌' },
  },
}
```

(The snippet is the original proposal and keeps its Portuguese identifiers. What was built is a class instead: see [What exists today](#what-exists-today).)

## Comparison between sports

### Score format

| Sport | Format | Example | Draw | Playoff tiebreak |
|---|---|---|---|---|
| ⚽ Football | Goals | `3-1` | ✅ | Penalties |
| 🎾 Padel | Sets/Games | `6-4 3-6 10-7` | ❌ | Tiebreak / Super tiebreak |
| 🏀 Basketball | Points | `87-82` | ❌ | Overtime |
| 🤾 Handball | Goals | `28-24` | ✅ | Extra time + 7m throws |
| 🏐 Volleyball | Sets/Points | `25-20 22-25 25-18` | ❌ | 5th set to 15 |

### Standings

| Sport | Columns | Points | Tiebreak criteria |
|---|---|---|---|
| ⚽ Football | P W D L GF GA GD Pts | 3-1-0 + blowout bonus | Pts → GD → GF → H2H |
| 🎾 Padel | P W L SW SL SD GW GL GD Pts | 3-2-1-0 (by margin) | Pts → SD → GD → H2H |
| 🏀 Basketball | P W L PF PA PD Pts | 2-0 | Pts → PD → PF → H2H |
| 🤾 Handball | P W D L GF GA GD Pts | 2-1-0 | Pts → GD → GF → H2H |
| 🏐 Volleyball | P W L SW SL SD PF PA PD Pts | 3-2-1-0 (by margin) | Pts → SD → PD → H2H |

(For padel, GW/GL/GD are games won, lost and difference.)

### Individual stats

| Sport | Metrics |
|---|---|
| ⚽ Football | Goals, Assists, MVP |
| 🎾 Padel | Matches, Wins, Win rate % |
| 🏀 Basketball | Points, Rebounds, Assists, Steals, Blocks |
| 🤾 Handball | Goals, Assists, Saves (GK) |
| 🏐 Volleyball | Aces, Blocks, Attacks, Errors |

### Team

| Sport | Size | Jersey | Rating attributes |
|---|---|---|---|
| ⚽ Football | N players | Yes | Pace, Shooting, Passing, Dribbling, Defending, Physical |
| 🎾 Padel | 2 (pair) | No | Smash, Volley, Bandeja, Serve, Positioning, Defence |
| 🏀 Basketball | 5 + subs | Yes | Shooting, Passing, Dribbling, Defence, Rebounding, Physical |
| 🤾 Handball | 7 + subs | Yes | Shooting, Passing, Defence, Pace, Physical, Positioning |
| 🏐 Volleyball | 6 + subs | Yes | Attack, Block, Serve, Reception, Defence, Setting |

## What changes and what stays

### ✅ Does not change (sport-agnostic engine)

- Berger algorithm (round-robin)
- Schedule generation and extra round
- Playoff seeding
- Match-by-match sync (`diffSnapshot`)
- Permissions (admin / user / pending)
- Sign-in and user management
- Tournament archive (structure)

### 🔄 Delegated to the profile

- `computeStandings()` — columns and sort criteria
- `resolveHeadToHead()` — mini-table with the sport's metrics
- `getPlayoffWinner()` — tiebreak type
- `tallyPlayerStats()` — individual metrics
- `addGoal/removeGoal` → generic `addScore/removeScore`
- Live animations and banners
- Results UI (counter input vs sets grid vs number pair)
- Columns and icons in the standings and stats
- Share image

### 🆕 New

- `src/sports/*.js` — sport profiles
- `getSport(config.tipoDesporto)` — registry
- Sport selector in the settings
- Sets input (grid) for padel and volleyball
- Flexible Firebase rules accepting several score formats

## Implementation plan

The phases below are the original ones. The current phases (TypeScript and `Sport` class; multiple tournaments, global players and per-sport admins; English UI and Lit components; padel; the rest) are in issue [#23](https://github.com/dioogomartiins/sports-tournament/issues/23).

### Phase 1 — Foundation (without breaking anything)

1. Create `src/sports/futebol.js` — extract the current logic into the profile.
2. Create `src/sports/index.js` — registry with `getSport(id)`.
3. Add `tipoDesporto: 'futebol'` to `defaultConfig` (default value = current behaviour unchanged).
4. Refactor `computeStandings` and `tallyPlayerStats` to delegate to the profile.
5. Tests — make sure **nothing changes** for football.

### Phase 2 — Second sport

1. Create the second sport's profile (e.g. `padel.js` or `basquetebol.js`).
2. Add a selector to the settings UI.
3. Adapt the score input.
4. Adapt the standings and stats columns.
5. Update `database.rules.json` to accept both formats.

### Phase 3 — Generalisation

1. Add more profiles as needed.
2. Americano/Mexicano format for padel (players switch partners every round).
3. Documentation and illustrations per sport.

## Impact per file

| File | Change | Effort |
|---|---|---|
| `src/sports/*.js` | 🆕 Sport profiles | 🟡 Medium |
| `src/algorithms.js` | 🔄 Delegate standings and stats to the profile | 🟡 Medium |
| `src/state.js` | 🔄 `config.tipoDesporto`, dynamic attributes | 🟢 Low |
| `src/ui.js` | 🔄 Labels, icons, conditional columns | 🔴 High |
| `src/main.js` | 🔄 Score input delegated to the profile | 🟡 Medium |
| `src/components/ScoreBase.ts` | 🔄 Event banners come from each sport's score component | 🟢 Low |
| `src/share.js` | 🔄 Columns and labels from the profile | 🟡 Medium |
| `src/sync.js` | 🔄 Conditional `normalizeResults` | 🟢 Low |
| `index.html` | 🔄 Sport selector, dynamic labels | 🟡 Medium |
| `database.rules.json` | 🔄 Flexible score validation | 🟡 Medium |
| `tests/*.test.js` | 🔄 Fixtures parameterised by sport | 🟡 Medium |

## What exists today

How the code on `main` differs from the proposal above:

- **A class, not an object.** `src/sports/Sport.ts` is an abstract class with `id`, `name`, `icon` and the methods that vary (`computeStandings`, `resolveHeadToHead`, `getPlayoffWinner`, `tallyPlayerStats`, `mergePlayerStats`, `addGoal`, `removeGoal`, …). `Football` in `src/sports/football/Football.ts` implements it; `src/algorithms.ts` re-exports its methods for older modules.
- **Registry.** `src/sports/registry.ts` exposes `getSport(id)`, `registerSport()` and `listSports()`. `football` (with `futebol` as an alias) and `padel` are registered; unknown ids fall back to football.
- **The sport lives in the tournament.** It is `meta.sport` (and `config.sport`), chosen when the tournament is created and fixed afterwards; there is no `tipoDesporto`. Data saved before this defaults to `football`.
- **Ratings per sport.** Players are global (`/players`) with `ratings.<sport>`; each sport declares its own attributes (`Sport.ratingAttributes()`).
- **Padel.** `src/sports/RacketSport.ts` (shared by set-based sports) and `src/sports/padel/Padel.ts`, with `<padel-score>`, a configurable set format, game-based standings, pairs fixed or drawn by rating, and rules that accept set scores in padel tournaments. The rules are in [Rules](rules.md#padel).
- **Per-sport admins.** `users/<uid>/admin/<sport>`, enforced by `database.rules.json` (see [Architecture](architecture.md#permissions)).
- **Not done yet:** the other sports (tennis can reuse `RacketSport`), and Americano/Mexicano padel formats.

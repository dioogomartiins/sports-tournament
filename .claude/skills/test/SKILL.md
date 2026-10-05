---
name: test
description: Run and extend the Torneio ILOG test suite. Use before committing any change to src/core/, src/sports/ or to scheduling, standings, tiebreak, rating or draft behaviour.
---

# Testing Torneio ILOG

```bash
npm run lint        # ESLint, also run by CI
npm run typecheck   # TypeScript type check (tsc --noEmit)
npm test            # vitest run, all tests in tests/
npm run build       # must also pass
```

## What is covered

- `tests/football.test.ts`: football sport logic in `src/sports/football/Football.ts`
  (standings, head-to-head tiebreak, playoff winner, player stats, and goal handling).
- `tests/core/`: core tournament logic in `src/core/` (schedule, Berger rounds,
  draft ratings and balanced teams, archive entries).
- `tests/sync.test.ts`: `diffSnapshot`, `normalizeConfig`, `normalizeResults`,
  `normalizeArquivo`, `describeUpdates` and `legacyRoleUpdates` in `src/sync.ts`.
- `tests/players.test.ts` and `tests/torneios.test.ts`: global players with
  per-sport ratings, and the tournament list.
- `tests/i18n.test.ts`: every `en.section.key` used in `src/` exists in
  `src/i18n/en.ts`.
- `tests/rules/`: `database.rules.json` against the Firebase emulator
  (`npm run test:rules`, needs Java).
- `tests/state.test.ts`: `applySnapshot` (v7 backwards compatibility), `buildSnapshot`,
  `defaultConfig` in `src/state.ts`.
- `tests/permissions.test.js`: `canWritePath`, `blockedPaths` and `roleLabel`.
  Keep these in step with `database.rules.json`.
- `tests/utils.test.js`: `escapeHtml` and `safeColor`.

## Adding tests

- `src/core/` and `src/sports/` don't read `state`, so tests import them
  directly. Keep it that way: pass data in as arguments.
- When fixing a bug in scheduling or standings, first add a test that fails
  with the bug, then fix it.
- Write new test names in English, like the rest of the code (older tests
  still have Portuguese names).
- UI and Firebase code have no tests; check those with the `run` skill.

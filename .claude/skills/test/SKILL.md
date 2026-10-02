---
name: test
description: Run and extend the Torneio ILOG test suite. Use before committing any change to js/algorithms.js or to scheduling, standings, tiebreak, rating or draft behaviour.
---

# Testing Torneio ILOG

```bash
npm run lint        # ESLint, also run by CI
npm test            # vitest run, all tests in tests/
npm run build       # must also pass
```

## What is covered

- `tests/algorithms.test.js`: pure logic in `js/algorithms.js`. Berger rounds
  (even and odd team counts, byes), home/away mirroring across voltas, the
  extra volta, group index mapping, points with the goleada bonus, head-to-head
  tiebreaks, playoff games excluded from standings and playoff winners, player
  ratings, snake draft and balanced teams, player stats (goals, assists, MVP)
  and tournament archive entries.
- `tests/sync.test.js`: `diffSnapshot`, `normalizeResults`,
  `normalizeArquivo` and `describeUpdates` in `js/sync.js`.
- `tests/permissions.test.js`: `canWritePath`, `blockedPaths` and `roleLabel`.
  Keep these in step with `database.rules.json`.
- `tests/utils.test.js`: `escapeHtml` and `safeColor`.

## Adding tests

- `algorithms.js` imports no other module, so tests import it directly. Keep
  it that way: pass data in as arguments instead of reading `state`.
- When fixing a bug in scheduling or standings, first add a test that fails
  with the bug, then fix it.
- Keep test names in Portuguese, like the rest of the code.
- UI and Firebase code have no tests; check those with the `run` skill.

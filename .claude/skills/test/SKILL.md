---
name: test
description: Run and extend the Torneio ILOG test suite. Use before committing any change to js/algorithms.js or to scheduling, standings, tiebreak, rating or draft behaviour.
---

# Testing Torneio ILOG

```bash
npm test            # vitest run, all tests in tests/
npm run build       # must also pass
```

## What is covered

`tests/algorithms.test.js` covers the pure logic in `js/algorithms.js`:
Berger rounds (even and odd team counts, byes), home/away mirroring across
voltas, group index mapping, points with the goleada bonus, head-to-head
tiebreaks, playoff games excluded from standings, player ratings and the
snake draft order.

## Adding tests

- `algorithms.js` imports `state.js` and `utils.js`, which load the UI and
  Firebase. Tests mock both with `vi.mock` and then `await import` the module;
  copy that pattern instead of importing the real modules.
- When fixing a bug in scheduling or standings, first add a test that fails
  with the bug, then fix it.
- Keep test names in Portuguese, like the rest of the code.
- UI and Firebase code have no tests; check those with the `run` skill.

# Torneio ILOG

Vite + vanilla JS single-page app (no framework) for running friendly football
tournaments, synced live across devices through Firebase Realtime Database.
Deployed to GitHub Pages at `/torneio-ilog/` on every push to `main`.

## Conventions

- UI text, code comments and identifiers are in European Portuguese ("equipas",
  "jogos singulares", "mata-mata"). Keep new strings consistent with that.
- Module roles:
  - `js/state.js` owns global state and persistence (localStorage + Firebase push).
  - `js/algorithms.js` holds pure logic: Berger schedule, standings, head-to-head
    tiebreaks, ratings, snake draft. Keep logic here so it stays testable.
  - `js/ui.js` renders; `js/main.js` wires event handlers; `js/firebase.js` syncs.
- All state lives in one Firebase node, `torneio_state`. Saves send only what
  changed since the last sync with `update()` (`js/sync.js`): results per game,
  other sections whole (last write wins within a section). Any change to the state shape must bump `SNAPSHOT_VERSION`
  in `js/state.js` and still load data already saved on other devices.
- Who may write what is enforced by `database.rules.json` (Google sign-in;
  roles in `utilizadores/<uid>/role`: `admin` or `user`, none = read-only).
  `js/permissions.js` mirrors those rules client-side; change both together.
  Every save also appends an entry to `torneio_log` (who changed what).
- When building HTML strings, pass every value that comes from state through
  `escapeHtml` (and team colours through `safeColor`). The Firebase data is
  writable by anyone with the public config, so it is untrusted input.
- The app is used live on phones during matches: check mobile widths and both
  light and dark themes when touching UI.
- Commit messages follow conventional commits (`feat:`, `fix:`, `refactor:`, ...).

## Checks

- `npm test` runs the Vitest suite in `tests/` (pure logic only).
- `npm run build` must pass.
- See `.claude/skills/run` before starting the dev server: it talks to the live
  tournament database unless pointed elsewhere.

## Rules

- Pushing to `main` deploys immediately. Work on a branch and open a PR.
- `.env` is local only and must never be committed, printed or copied into code.
  CI builds it from repository secrets (see `.github/workflows/deploy.yml`).
- `VITE_*` values end up in the public bundle, so none of them is a real secret.
  Protect data with Firebase security rules, not client-side checks.

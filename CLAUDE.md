# Torneio ILOG

Vite + vanilla TypeScript single-page app (no framework) for running friendly
football tournaments, synced live across devices through Firebase Realtime
Database. Deployed to GitHub Pages at `/torneio-ilog/` on release tags (`release/*`) or manual dispatch.

## Language policy

- **Code, comments, commit messages and documentation** are in **English**.
- **UI-facing text** (labels, toasts, button captions shown to the user) stays
  in **European Portuguese** (the app's audience). Keep new user-visible strings
  consistent with the existing ones.

## Conventions

- Module roles:
  - `src/state.js` owns global state and persistence (localStorage + Firebase push).
  - `src/algorithms.js` holds pure logic: Berger schedule, standings, head-to-head
    tiebreaks, ratings, balanced team split (`balancedDraft`, which starts from `snakeDraft`
    and swaps pairs above 20 players), player stats (goals, assists, MVP) and
    tournament archive entries. Keep logic here so it stays testable.
  - `src/sync.js` diffs snapshots for `update()`, normalizes older saved data
    and describes changes for the log; `src/permissions.js` mirrors the rules.
  - `src/ui.js` renders (one module per section in `src/ui/`, re-exported by
    `ui.js`; `src/ui/` modules never import `ui.js`); `src/main.js` wires event
    handlers; `src/firebase.js` syncs and handles Google sign-in; `src/share.js`
    draws the PNG share images.
- All state lives in one Firebase node, `torneio_state`. Saves send only what
  changed since the last sync with `update()` (`src/sync.js`): results per game,
  other sections whole (last write wins within a section). Any change to the
  state shape must bump `SNAPSHOT_VERSION` in `src/state.js` and still load data
  already saved on other devices.
- Who may write what is enforced by `database.rules.json` (Google sign-in;
  roles in `utilizadores/<uid>/role`: `admin` or `user`, none = read-only).
  `src/permissions.js` mirrors those rules client-side; change both together.
  Every save also appends an entry to `torneio_log` (who changed what).
- When building HTML strings, pass every value that comes from state through
  `escapeHtml` (and team colours through `safeColor`). The Firebase data is
  writable by anyone with the public config, so it is untrusted input.
- The app is used live on phones during matches: check mobile widths and both
  light and dark themes when touching UI.
- Docs live in `README.md` and `docs/` (in Portuguese): `guia.md` (using the
  app), `regras.md` (scoring, tiebreaks, draft), `configuracao.md` (Firebase,
  env, deploy), `arquitetura.md` (modules, data model, sync, permissions).
  Update the matching page in the same PR when behaviour, rules or the state
  shape change.
- Commit messages follow conventional commits (`feat:`, `fix:`, `refactor:`, ...).
- Documentation illustrations use the `ian-xiaohei-illustrations` skill (same
  style as the CarCity docs); the shot list and prompts live in issue #10.

## Checks

- `npm run lint` runs ESLint (`eslint.config.mjs`) with `typescript-eslint`.
- `npm run typecheck` runs `tsc --noEmit` (strict, `allowJs`).
- `npm test` runs the Vitest suite in `tests/` (pure logic only).
- `npm run build` must pass.
- See `.claude/skills/run` before starting the dev server: it talks to the live
  tournament database unless pointed elsewhere.

## Rules

- Deployment runs on release tags (`release/*`) or manual workflow dispatch: the workflow tests and
  publishes `database.rules.json` first, then the site. Work on a branch and open a PR.
- `.env` is local only and must never be committed, printed or copied into code.
  CI builds it from repository secrets (see `.github/workflows/deploy.yml`).
- `VITE_*` values end up in the public bundle, so none of them is a real secret.
  Protect data with Firebase security rules, not client-side checks.

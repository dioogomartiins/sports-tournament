# Torneio ILOG

Vite + vanilla TypeScript single-page app (no framework) for running friendly
football tournaments, synced live across devices through Firebase Realtime
Database. Deployed to GitHub Pages at `/torneio-ilog/` on release tags (`release/*`) or manual dispatch.

## Language policy

- **Code, comments, commit messages, documentation and UI text** are in
  **English**. Every user-visible string lives in `src/i18n/en.ts`; add new
  ones there instead of writing them inline.

## Conventions

- Module roles:
  - `src/state.ts` owns global state and persistence (localStorage + Firebase push).
  - `src/core/` holds pure tournament logic (Berger schedule, playoff bracket, Americano/Mexicano rounds, snake/balanced draft, archive).
  - `src/sports/` defines the abstract `Sport` class, `registry.ts` (`getSport(id)`), and sport implementations (`src/sports/football/Football.ts` for standings, head-to-head, playoff winner, player stats and goal handling).
  - `src/algorithms.ts` re-exports core and football sport methods for backward compatibility.
  - `src/sync.ts` diffs snapshots for `update()`, normalizes older saved data
    and describes changes for the log; `src/permissions.ts` mirrors the rules.
  - `src/types.ts` defines domain models (`Tournament`, `Config`, `Match`, `Score`, `Player`, `Team`).
  - `src/utils.ts` provides shared utility functions (`escapeHtml`, `safeColor`, `playerName`, `clamp`, etc.).
  - `src/ui.ts` renders (one module per section in `src/ui/`, re-exported by
    `ui.ts`; `src/ui/` modules never import `ui.ts`); `src/main.ts` wires event
    handlers; `src/firebase.ts` syncs and handles Google sign-in; `src/share.ts`
    draws the PNG share images.
- Each tournament lives in `tournaments/<id>` (players and the archive are
  global, in `players` and `arquivo`). Saves send only what
  changed since the last sync with `update()` (`src/sync.ts`): results per game,
  other sections whole (last write wins within a section). Any change to the
  state shape must bump `SNAPSHOT_VERSION` in `src/state.ts` and still load data
  already saved on other devices.
- Who may write what is enforced by `database.rules.json` (Google sign-in;
  roles in `users/<uid>/role`: `master`, `admin` with `admin/<sport>: true`, or
  `user`; none = read-only). `src/permissions.ts` mirrors those rules
  client-side; change both together. Every save also appends an entry to
  `tournament_log/<id>` (who changed what).
- New UI is a Lit component in `src/components/` (base class `LightElement`,
  light DOM, properties in and events out); the controller in `src/ui/` sets
  its properties and handles its events instead of building HTML. Lit escapes
  values in templates; never use `unsafeHTML` with state. Where HTML strings
  remain, pass every value that comes from state through `escapeHtml`, and team
  colours always through `safeColor`. The Firebase data is
  writable by anyone with the public config, so it is untrusted input.
- The app is used live on phones during matches: check mobile widths and both
  light and dark themes when touching UI.
- Docs live in `README.md` and `docs/` (in English): `guide.md` (using the
  app), `sports.md` (what changes per sport), `rules.md` (scoring, tiebreaks, draft), `configuration.md` (Firebase,
  env, deploy), `architecture.md` (modules, data model, sync, permissions),
  `multi-sport.md` (multi-sport plan).
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

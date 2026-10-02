---
name: run
description: Start the Torneio ILOG dev server safely and open the app, without writing to the live tournament database. Use before running, previewing or screenshotting the app.
---

# Running Torneio ILOG

Every action in the app (saving a result, adding a player, generating a schedule)
writes to the `torneio_state` node in Firebase. If the dev server uses the
production database, a test click changes the real tournament on everyone's phone.

## 1. Point the app at a test database

Vite loads `.env.development.local` on top of `.env` when running `npm run dev`,
and `.gitignore` already excludes it. Create it with a database that is not the
production one:

```env
VITE_FIREBASE_DATABASE_URL=https://<test-database>.firebasedatabase.app
```

- If there is no `.env` at all (fresh cloud sessions), copy `.env.example` to
  `.env.development.local` and ask the user for test Firebase values. Do not
  guess or reuse production values.
- Or run fully offline with the Firebase emulators (`firebase emulators:start
  --only database,auth --project demo-torneio`) and set
  `VITE_USE_EMULATORS=true` plus `VITE_FIREBASE_PROJECT_ID=demo-torneio` and
  `VITE_FIREBASE_DATABASE_URL=https://demo-torneio.firebaseio.com`. Load
  `database.rules.json` into the emulator to test roles; editing needs a
  signed-in user with `utilizadores/<uid>/role` set.
- If the user explicitly says to use the production database, say once that
  any change will be visible to everyone, then continue.

## 2. Start the server

```bash
npm install          # first time only
npm run dev -- --host --port 5173
```

The app is served under the Pages base path: open
`http://localhost:5173/torneio-ilog/` (the root URL is blank).

## 3. Check what you changed

- Resize to a phone width (about 390px) as well as desktop.
- Toggle the theme button in the header and check dark mode.
- Watch the browser console for Firebase errors (usually a wrong database URL
  or missing `.env` values).

For a production-like check, `npm run build && npm run preview` serves `dist/`
the same way GitHub Pages does.

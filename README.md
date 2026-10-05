# Torneio ILOG 🏆⚽

Web app for running friendly sports tournaments: teams, squads, schedule, live results, playoffs, player stats and single matches. Several tournaments can run at the same time, and every connected phone sees each change instantly, without reloading the page.

Football is fully supported today. The app is moving towards [supporting any sport](docs/multi-sport.md) — padel 🎾, basketball 🏀, handball 🤾, volleyball 🏐 and others — through one class per sport.

**App:** <https://dioogomartiins.github.io/torneio-ilog/>

## ✨ What it does

![From schedule to champion](docs/assets/illustrations/01-do-calendario-ao-campeao.jpg)

- **Several tournaments at once**: the Dashboard lists the active tournaments, each with its own sport (fixed when it is created); each device remembers which one it is following.
- **Automatic schedule** using the Berger algorithm, with 1 to 8 groups, several rounds and an extra round.
- **Live results**: match status (scheduled, in progress, finished), scorers, assists and MVP, with a window per match and goal animations on every phone.
- **Standings** with configurable points, a blowout bonus and head-to-head tiebreaks.
- **Playoffs** (knockout) generated from the standings, with penalties.
- **Single Match**: pick who is there and the app splits the players into two teams balanced by rating.
- **Global players database** with a rating per sport, shared by every tournament.
- **Stats and Player Profile** with all-time goals, assists and MVPs.
- **History**: the **🏁 Finish Tournament** button archives a tournament with its final table and champion.
- **Share as image** the standings or a result (WhatsApp, etc.).
- **Google accounts with roles**: Master Admin, per-sport admins and users; anyone not signed in can only view, and every change is logged with who made it.
- Light and dark theme, built for use on a phone during matches.

## 📚 Documentation

| Document | For | Contents |
|---|---|---|
| [User Guide](docs/guide.md) | People using the app | Roles, tournaments, setting up and playing a tournament, single matches, history, data |
| [Rules and Calculations](docs/rules.md) | Anyone who wants to understand the numbers | Scoring, tiebreaks, schedule, playoffs, ratings, balanced teams |
| [Setup and Deployment](docs/configuration.md) | People maintaining the app | Firebase, `.env`, running locally without touching the real tournament, deploying the site and the rules |
| [Architecture](docs/architecture.md) | People changing the code | Modules, data model, sync, permissions, tests |
| [Multi-Sport](docs/multi-sport.md) | Contributors | Multi-sport plan: sport profiles, comparison between sports, implementation phases |

## 🚀 Quick start (development)

```bash
git clone https://github.com/dioogomartiins/torneio-ilog.git
cd torneio-ilog
npm install
cp .env.example .env.development.local   # fill in with a TEST Firebase project
npm run dev
```

Open `http://localhost:5173/torneio-ilog/`.

> ⚠️ With the production keys, any click on the local server changes the real tournaments on every phone. Use a test database or the Firebase emulators: see [Setup and Deployment](docs/configuration.md#running-locally).

| Command | What it does |
|---|---|
| `npm run dev` | Development server with *hot reload* |
| `npm run lint` | ESLint on `src/`, `tests/` and config files |
| `npm run typecheck` | TypeScript type check (`tsc --noEmit`) |
| `npm test` | Tests (Vitest) of the app logic |
| `npm run test:rules` | Firebase rules tests in the emulator (needs Java) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves `dist/` the way GitHub Pages does |

## 🛠️ Technologies

TypeScript and JavaScript (ES Modules) with no framework, HTML and CSS, [Vite](https://vitejs.dev/) for the build, and Firebase (Realtime Database and Authentication) for sync and accounts. Published to GitHub Pages when a release tag (`release/*`) is pushed, or by running the deploy workflow manually; pushes to `main` do not deploy (see [Deployment](docs/configuration.md#deployment)).

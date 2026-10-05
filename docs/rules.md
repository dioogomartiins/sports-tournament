# Rules and Calculations

[← Back to the README](../README.md)

How the app gets to the numbers it shows. The schedule, draft and archive logic lives in `src/core/`, and the football rules (standings, tiebreaks, playoff winner, player stats) in `src/sports/football/Football.ts`; `src/algorithms.ts` re-exports both. Tests are in `tests/core/` and `tests/football.test.ts`.

The rules below are football's, the only sport with its own rules so far. A tournament created with another sport (such as padel) currently uses the same rules (see [Multi-Sport](multi-sport.md)).

- [Scoring](#scoring)
- [Standings and tiebreaks](#standings-and-tiebreaks)
- [Schedule (Berger algorithm)](#schedule-berger-algorithm)
- [Groups](#groups)
- [Playoffs](#playoffs)
- [Champion](#champion)
- [Player rating](#player-rating)
- [Balanced teams (Single Match)](#balanced-teams-single-match)
- [Player stats](#player-stats)

## Scoring

![Blowout bonus](assets/illustrations/03-bonus-de-goleada.jpg)

Configurable in ⚙️ Settings. Default values:

| | Points |
|---|---|
| Win | 3 |
| Draw | 1 |
| Loss | 0 |
| Bonus (blowout win) | +1 |

The **blowout bonus** goes to the team that wins scoring at least the configured number of goals (*Goals scored for bonus*, 3 by default). It counts goals scored, not the difference: a 3-2 also earns the bonus.

Only league-stage matches with a score that are not *Scheduled* count. Playoff matches do not count towards the standings.

## Standings and tiebreaks

![Head-to-head tiebreak](assets/illustrations/04-desempate-confronto-direto.jpg)

Teams are ranked by:

1. Points
2. Goal difference
3. Goals scored

If two or more teams are still level on all three, they are separated by **head-to-head** (only the matches between the tied teams):

4. Points in the matches between them
5. Goal difference in the matches between them
6. Goals scored in the matches between them
7. Fewest goals conceded overall
8. Alphabetical order

With groups, each group has its own table.

## Schedule (Berger algorithm)

![Berger algorithm](assets/illustrations/02-algoritmo-de-berger.jpg)

Each round is a single round-robin in which every team plays every other team once. The Berger algorithm fixes one team and rotates the others, which gives balanced matchdays and alternates who plays at home.

- **Odd number of teams:** on each matchday one team has a bye; the bye is shown in the schedule.
- **Several rounds:** in even rounds (2nd, 4th, …) the matches repeat with home and away swapped.
- **Extra round:** adds one more round at the end without touching existing matches (single league only, and before the playoffs), so results are kept.

A schedule with N teams has N−1 matchdays per round (N if N is odd) and N×(N−1)/2 matches per round.

## Groups

With 2, 4 or 8 groups, the teams are **drawn** into the groups every time the schedule is generated, in parts as equal as possible (the last groups may have fewer teams). Each group has its own Berger schedule, played on the same matchdays.

## Playoffs

![Groups and seeds](assets/illustrations/05-grupos-e-seeds.jpg)

The number of qualified teams is *qualified per group × number of groups* and must be 2, 4, 8 or 16. The bracket starts at:

| Teams | First round |
|---|---|
| 16 | Round of 16 |
| 8 | Quarter-Finals |
| 4 | Semi-Finals |
| 2 | Final |

**Seeds:** qualified teams are ordered by position, interleaving groups: 1st of A, 1st of B, …, 2nd of A, 2nd of B, … In the first round seed 1 plays the last seed, seed 2 the second-to-last, and so on, arranged so that seeds 1 and 2 can only meet in the final.

**Draws:** a playoff match that finishes level is decided on penalties. The winner moves by itself to the right slot of the next match.

## Champion

- With playoffs: the winner of the final.
- Without playoffs and with a single group: the league leader.
- With several groups and no playoffs there is no automatic champion.

## Player rating

![Player rating](assets/illustrations/06-rating-do-jogador.jpg)

Each player has 0 to 5 stars in six attributes: Pace, Shooting, Passing, Dribbling, Defending and Physical. Ratings are kept **per sport** (each player has a separate set for football, padel, …; today every sport uses these same six attributes). The **★ rating** is the average of the six for the tournament's sport, with one decimal place. A team's rating is the sum of its players' ratings.

## Balanced teams (Single Match)

![Balanced teams](assets/illustrations/07-equipas-equilibradas.jpg)

**⚽ Run Draft** splits the players who are there into two teams, using their rating for the sport of the tournament being viewed:

- The teams get the same number of players, or one apart if the total is odd.
- **Up to 20 players**, the app tries every possible split and keeps the one with the smallest total rating difference.
- **More than 20**, it starts from a *snake draft* (A, B, B, A, A, B, …, in rating order) and keeps swapping pairs of players between the teams while the difference goes down.

## Player stats

For each player the app counts:

| Stat | How it is counted |
|---|---|
| Goals | Each goal recorded with that scorer (own goals count for nobody) |
| Assists | Each goal where they were picked as the assist |
| MVP | Matches in which they were the MVP |
| Scoring matches | Matches in which they scored at least one goal |
| Record | Most goals in a single match |

The Stats tab adds up the current tournament and its single matches. History and the player profile also add the archived tournaments.

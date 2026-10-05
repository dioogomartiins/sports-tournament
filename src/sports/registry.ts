import type { Sport } from './Sport.js';
import { football } from './football/Football.js';
import { padel } from './padel/Padel.js';
import { tennis } from './tennis/Tennis.js';

const sportsRegistry = new Map<string, Sport>();

// Register default sport
sportsRegistry.set('football', football);
sportsRegistry.set('futebol', football); // alias
sportsRegistry.set('padel', padel);
sportsRegistry.set('tennis', tennis);

export function registerSport(sport: Sport): void {
  sportsRegistry.set(sport.id, sport);
}

export function getSport(id?: string): Sport {
  if (id && sportsRegistry.has(id)) {
    return sportsRegistry.get(id)!;
  }
  // Default to football
  return football;
}

export function listSports(): Sport[] {
  return Array.from(new Set(sportsRegistry.values()));
}

import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, onValue, update, push, query, orderByChild, limitToLast, serverTimestamp, get } from "firebase/database";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { diffSnapshot, describeUpdates, onlyMetadata, globalUpdatesOnly, normalizeMeta, normalizeConfig, legacyRoleUpdates, keyedUpdates, playerUpdates, isKeyedById, keyById, normalizeSingleMatches, normalizePlayers, normalizeArquivo } from "./sync.js";
import { en } from "./i18n/en.js";
import { blockedPaths, roleLabel, isSportAdmin, isMaster, canSeeSingleMatches } from "./permissions.js";
import type { User } from "firebase/auth";
import type { Unsubscribe } from "firebase/database";
import type { ArchiveEntry, Player, Role, SingleMatch, Tournament, TournamentMeta, UserProfile } from "./types.js";
import type { LogEntry } from "./components/ActivityLog.js";

/** A tournament snapshot as read from or sent to Firebase (sections may be missing). */
export type Snapshot = Partial<Tournament>;
/** A tournament as listed in tournaments/ (its meta plus the id). */
export type TournamentListing = TournamentMeta & { id: string };
export type PushResult = { ok: true } | { ok: false; reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' | 'sem-torneio' | 'sem-migracao' };
export interface AuthInfo { user: User | null; role: Role | null; admin: Record<string, boolean> }
type Updates = Record<string, unknown>;

export const isEmulator = import.meta.env.VITE_USE_EMULATORS === 'true';

export type DevRole = 'master' | 'admin' | 'user' | 'none';

// Emulator-only accounts for the role switcher (also seeded by docker/firebase/seed.mjs)
export const DEV_USERS: Record<'master' | 'admin' | 'user', { email: string; password: string; name: string; role: Role; admin?: Record<string, boolean> }> = {
  master: {
    email: 'master@torneio.local',
    password: 'password123',
    name: 'Master Admin',
    role: 'master',
  },
  admin: {
    email: 'admin@torneio.local',
    password: 'password123',
    name: 'Football Admin',
    role: 'admin',
    admin: { football: true },
  },
  user: {
    email: 'user@torneio.local',
    password: 'password123',
    name: 'Test User',
    role: 'user',
  },
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isEmulator ? 'demo-api-key' : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (isEmulator ? 'demo-torneio.firebaseapp.com' : undefined),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || (isEmulator ? 'https://demo-torneio-default-rtdb.firebaseio.com' : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (isEmulator ? 'demo-torneio' : undefined),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (isEmulator ? 'demo-app-id' : undefined),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Development: use the local Firebase emulators instead of the real database
const EMULATOR_HOST = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1';
const EMULATOR_DB_PORT = 9000;
if (isEmulator) {
  connectDatabaseEmulator(database, EMULATOR_HOST, EMULATOR_DB_PORT);
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
}

const LOG_LIMIT = 200;

let activeTournamentId = 'default';
let onStateChangeCallback: ((data: Snapshot, firstLoad: boolean) => void) | null = null;
let onPushErrorCallback: ((err: Error) => void) | null = null;
let isFirstLoad = true;
let lastSynced: Snapshot | null = null; // last snapshot equal to what Firebase holds
/** False while tournaments/<id> holds nothing: only global sections may be saved then. */
let tournamentExists = true;
let stopStateListener: Unsubscribe | null = null;
/** Counts tournament values from Firebase, so only the latest one is applied. */
let serverStateSeq = 0;
let stopArquivoListener: Unsubscribe | null = null;
let stopPlayersListener: Unsubscribe | null = null;
let stopSinglesListener: Unsubscribe | null = null;
/**
 * Whether players and the archive are already stored keyed by id. Older
 * saves wrote arrays; until the master's first load rewrites them, records
 * cannot be saved one by one.
 */
let playersKeyed = true;
let arquivoKeyed = true;
/** Single matches still stored inside the current tournament (older saves). */
let legacySingles: unknown = null;

/** Single matches from both places, oldest first, each once. */
function mergeSingles(legacy: unknown, remote: unknown): SingleMatch[] {
  const byId = new Map<string, SingleMatch>();
  [...normalizeSingleMatches(legacy), ...normalizeSingleMatches(remote)].forEach((m) => byId.set(m.id, m));
  return normalizeSingleMatches([...byId.values()]);
}

export function setActiveTournamentId(id: string): void {
  if (!id || id === activeTournamentId) return;
  activeTournamentId = id;
  lastSynced = null;
  isFirstLoad = true;
  initFirebaseListener(activeTournamentId);
}

export function getActiveTournamentId(): string {
  return activeTournamentId;
}

// Set the callback that will be called whenever the DB updates
export function onFirebaseStateChange(callback: (data: Snapshot, firstLoad: boolean) => void): void {
  onStateChangeCallback = callback;
}

// Start listening to the "tournaments/<id>" node, global "arquivo", and global "players"
export function initFirebaseListener(tournamentId: string = activeTournamentId): void {
  activeTournamentId = tournamentId || 'default';
  // A read of the previous tournament still in flight must not be applied
  serverStateSeq++;
  if (stopStateListener) {
    stopStateListener();
    stopStateListener = null;
  }

  const stateRef = ref(database, `tournaments/${activeTournamentId}`);
  stopStateListener = onValue(stateRef, (snapshot) => {
    void applyServerState(snapshot.val());
  }, (err) => console.error("Firebase error reading tournament:", err));

  if (!stopArquivoListener) {
    const arquivoRef = ref(database, 'arquivo');
    stopArquivoListener = onValue(arquivoRef, (snapshot) => {
      const arqVal = snapshot.val();
      arquivoKeyed = isKeyedById(arqVal);
      if (arqVal && onStateChangeCallback && !isFirstLoad) {
        const current = getSyncedSnapshot() || {};
        current.arquivo = arqVal;
        onStateChangeCallback(current, false);
      }
    }, (err) => console.error("Firebase error reading arquivo:", err));
  }

  if (!stopPlayersListener) {
    const playersRef = ref(database, 'players');
    stopPlayersListener = onValue(playersRef, (snapshot) => {
      const playersVal = snapshot.val();
      playersKeyed = isKeyedById(playersVal);
      if (playersVal && onStateChangeCallback && !isFirstLoad) {
        const current = getSyncedSnapshot() || {};
        current.players = playersVal;
        onStateChangeCallback(current, false);
      }
    }, (err) => console.error("Firebase error reading players:", err));
  }
}

/**
 * Applies the tournament as Firebase holds it (from the listener or a
 * re-read), adding the global archive and players.
 */
async function applyServerState(value: Snapshot | null): Promise<void> {
  const seq = ++serverStateSeq;
  let data: Snapshot | null = value;
  if (!data) {
    // Fall back to the legacy data while the migration has not run yet
    try {
      const legacySnap = await get(ref(database, 'torneio_state'));
      data = legacySnap.val();
    } catch {
      // Ignore permission or network errors
    }
  }
  const exists = !!data;
  const legacy = data?.jogosSingulares ?? null;
  // No tournament under this id (none created yet, or the last one was
  // removed): still read the global sections, so the empty tournament on
  // screen becomes the synced baseline and changes to it can be told apart
  const snap: Snapshot = data || {};

  // The global archive lives in /arquivo
  try {
    const arqSnap = await get(ref(database, 'arquivo'));
    const arqVal = arqSnap.val();
    arquivoKeyed = isKeyedById(arqVal);
    if (arqVal) snap.arquivo = arqVal;
  } catch {
    // Ignora
  }

  // Global players live in /players
  try {
    const playersSnap = await get(ref(database, 'players'));
    const playersVal = playersSnap.val();
    playersKeyed = isKeyedById(playersVal);
    if (playersVal) snap.players = playersVal;
  } catch {
    // Ignora
  }
  // Single matches live in /singleMatches, readable only by football admins.
  // Older saves kept them inside the tournament: those stay until the
  // master's first load moves them.
  if (canSeeSingleMatches(currentRole, currentUserAdmin)) {
    try {
      const singlesSnap = await get(ref(database, 'singleMatches'));
      snap.jogosSingulares = mergeSingles(legacy, singlesSnap.val());
    } catch {
      // Ignora
    }
  }
  // A newer value arrived while this one was reading the archive and players
  // (a rejected save fires the optimistic value, then the server one): skip it
  if (seq !== serverStateSeq) return;
  tournamentExists = exists;
  legacySingles = legacy;
  if (onStateChangeCallback) {
    onStateChangeCallback(snap, isFirstLoad);
    isFirstLoad = false;
  }
}

/**
 * Reads the tournament from Firebase again and applies it, so a save the
 * server refused does not stay on screen or in the local cache.
 */
export async function resyncFromServer(): Promise<void> {
  try {
    const snap = await get(ref(database, `tournaments/${activeTournamentId}`));
    await applyServerState(snap.val());
  } catch (err) {
    console.error("Firebase error re-reading tournament:", err);
  }
}

// Called when Firebase rejects a save that was already applied locally
export function onFirebasePushError(callback: (err: Error) => void): void {
  onPushErrorCallback = callback;
}

// Record the snapshot that matches what Firebase currently holds
export function setSyncedSnapshot(snap: Snapshot): void {
  lastSynced = JSON.parse(JSON.stringify(snap));
}

export function getSyncedSnapshot(): Snapshot | null {
  return lastSynced ? JSON.parse(JSON.stringify(lastSynced)) : null;
}

// Push only what changed since the last sync, so concurrent edits to
// different games or sections don't overwrite each other. Each push also
// appends an entry to tournament_log/<id> with who made the change.
//
// Returns { ok: true } or { ok: false, reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' | 'sem-torneio' | 'sem-migracao' }.
// When it fails nothing is sent and the caller should restore the last synced state.
export function pushStateToFirebase(newState: Snapshot, tournamentId: string = activeTournamentId): PushResult {
  if (!lastSynced) return { ok: false, reason: 'sem-sync' };

  let updates = diffSnapshot(lastSynced, newState);
  // Only the export date changed: nothing to save
  if (onlyMetadata(updates)) return { ok: true };
  // No tournament to save into: writing it would create one with default
  // settings, so only players and the archive are saved
  const exists = tournamentExists;
  if (!exists) {
    const global = globalUpdatesOnly(updates);
    if (global.blocked) return { ok: false, reason: 'sem-torneio' };
    updates = global.updates;
  }

  if (!currentUser) return { ok: false, reason: 'sem-sessao' };

  // Global sections live at the root, one record per path, so the rules can
  // check each change against the sport it belongs to
  const prev = lastSynced;
  const globalWrites: Updates = {};
  const tournamentUpdates: Updates = {};
  Object.keys(updates).forEach((p) => {
    if (p === 'players') {
      const next = (newState.players || []) as Player[];
      if (!playersKeyed && isMaster(currentRole)) globalWrites['players'] = keyById(next);
      else Object.assign(globalWrites, playerUpdates((prev.players || []) as Player[], next));
    } else if (p === 'arquivo') {
      const next = normalizeArquivo(newState.arquivo);
      if (!arquivoKeyed && isMaster(currentRole)) globalWrites['arquivo'] = keyById(next);
      else Object.assign(globalWrites, keyedUpdates('arquivo', normalizeArquivo(prev.arquivo), next));
    } else if (p === 'jogosSingulares') {
      Object.assign(globalWrites, keyedUpdates('singleMatches', (prev.jogosSingulares || []) as SingleMatch[], (newState.jogosSingulares || []) as SingleMatch[]));
    } else {
      tournamentUpdates[p] = updates[p];
    }
  });
  const needsUpgrade = (!playersKeyed && Object.keys(globalWrites).some((k) => k.startsWith('players/')))
    || (!arquivoKeyed && Object.keys(globalWrites).some((k) => k.startsWith('arquivo/')));
  if (needsUpgrade) return { ok: false, reason: 'sem-migracao' };

  const sport = newState?.meta?.sport || newState?.config?.sport || 'football';
  const archiveSports: Record<string, string> = {};
  normalizeArquivo(prev.arquivo).forEach((e) => { if (e.id) archiveSports[e.id] = e.sport || 'football'; });
  const allUpdates = { ...tournamentUpdates, ...globalWrites };
  if (blockedPaths(currentRole, allUpdates, { sport, userAdmin: currentUserAdmin, archiveSports }).length) return { ok: false, reason: 'sem-permissao' };

  lastSynced = JSON.parse(JSON.stringify(newState));
  if (!Object.keys(allUpdates).length) return { ok: true };
  if (globalWrites['players']) playersKeyed = true;
  if (globalWrites['arquivo']) arquivoKeyed = true;

  const rootUpdates: Updates = { ...globalWrites };
  Object.keys(tournamentUpdates).forEach((p) => {
    rootUpdates[`tournaments/${tournamentId}/${p}`] = tournamentUpdates[p];
  });

  // The rules require every save to point (logRef) at a new change-log
  // entry written in the same update(). With no tournament there is no log
  // to append to: players and the archive need no logRef.
  if (exists) {
    const log = logEntry(describeUpdates(updates, newState) || en.sync.tournamentChanged, tournamentId);
    Object.assign(rootUpdates, log);
    const logKey = Object.keys(log)[0].split('/')[2];
    rootUpdates[`tournaments/${tournamentId}/logRef`] = logKey;
  }

  update(ref(database), rootUpdates).catch((err) => {
    console.error("Firebase error pushing state:", err);
    // Firebase reverts its own cache; read the server value again so the
    // screen and the local cache follow it too
    void resyncFromServer();
    if (onPushErrorCallback) onPushErrorCallback(err);
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Session (Google) and profiles
// ---------------------------------------------------------------------------
let currentUser: User | null = null;
let currentRole: Role | null = null;
let currentUserAdmin: Record<string, boolean> = {};
let stopRoleListener: Unsubscribe | null = null;

export function getCurrentUser(): User | null { return currentUser; }
export function getCurrentRole(): Role | null { return currentRole; }
export function getCurrentUserAdmin(): Record<string, boolean> { return currentUserAdmin; }
export function isCurrentSportAdmin(sport = 'football'): boolean {
  return isSportAdmin(currentRole, sport, currentUserAdmin);
}
export function isCurrentMaster(): boolean {
  return isMaster(currentRole);
}

function displayName(user: User): string {
  return (user.displayName || user.email || en.common.noName).slice(0, 100);
}

function logEntry(acao: string, tournamentId: string = activeTournamentId): Updates {
  const user = currentUser!;
  const key = push(ref(database, `tournament_log/${tournamentId}`)).key;
  return {
    [`tournament_log/${tournamentId}/${key}`]: {
      uid: user.uid,
      nome: displayName(user),
      acao: acao.slice(0, 500),
      quando: serverTimestamp(),
    },
  };
}

// Migration: the master admin's first load copies torneio_state to tournaments/default
async function checkAndMigrateLegacyState(): Promise<void> {
  const user = currentUser;
  if (!user) return;
  const defaultTourneyRef = ref(database, 'tournaments/default');
  const defaultSnap = await get(defaultTourneyRef);
  if (defaultSnap.exists()) return;

  const legacyRef = ref(database, 'torneio_state');
  const legacySnap = await get(legacyRef);
  const legacyData: Record<string, unknown> & Snapshot | null = legacySnap.val();
  if (!legacyData) return;

  console.log("Migrating torneio_state to tournaments/default...");
  const meta = {
    name: (legacyData.config && legacyData.config.nome) || 'Futebol ILOG',
    sport: 'football',
    status: 'active',
    createdAt: Date.now(),
  };

  const key = push(ref(database, 'tournament_log/default')).key;
  const rootUpdates: Updates = {
    [`tournament_log/default/${key}`]: {
      uid: user.uid,
      nome: displayName(user),
      acao: en.sync.legacyMigrated,
      quando: serverTimestamp(),
    },
    'tournaments/default/logRef': key,
    'tournaments/default/meta': meta,
    'tournaments/default/version': 9,
  };

  Object.keys(legacyData).forEach((k) => {
    if (k === 'arquivo') {
      rootUpdates['arquivo'] = keyById(normalizeArquivo(legacyData.arquivo));
    } else if (k === 'jogosSingulares') {
      normalizeSingleMatches(legacyData.jogosSingulares).forEach((m) => { rootUpdates[`singleMatches/${m.id}`] = m; });
    } else if (k === 'players') {
      const rawPlayers: unknown = legacyData.players || [];
      const list: unknown[] = Array.isArray(rawPlayers) ? rawPlayers : Object.values(rawPlayers as object);
      rootUpdates['players'] = keyById(normalizePlayers(list));
    } else if (k !== 'logRef' && k !== 'version' && k !== 'meta') {
      rootUpdates[`tournaments/default/${k}`] = legacyData[k];
    }
  });

  await update(ref(database), rootUpdates);
  console.log("Tournament migration completed");
}

// Copies the legacy roles (utilizadores) of users who have no role in users
// yet. Only a master may write roles, so it runs once per session for them.
let legacyRolesChecked = false;
async function migrateLegacyRoles(): Promise<void> {
  if (legacyRolesChecked) return;
  legacyRolesChecked = true;
  const [utilSnap, usersSnap] = await Promise.all([get(ref(database, 'utilizadores')), get(ref(database, 'users'))]);
  const roleUpdates = legacyRoleUpdates(utilSnap.val(), usersSnap.val());
  if (Object.keys(roleUpdates).length) {
    await update(ref(database), roleUpdates);
    console.log(`Legacy roles copied to users: ${Object.keys(roleUpdates).length} paths`);
  }
}

/** Follows /singleMatches while the signed-in user may see it (football admins). */
function syncSinglesListener(): void {
  if (!canSeeSingleMatches(currentRole, currentUserAdmin)) {
    if (stopSinglesListener) { stopSinglesListener(); stopSinglesListener = null; }
    return;
  }
  if (stopSinglesListener) return;
  stopSinglesListener = onValue(ref(database, 'singleMatches'), (snapshot) => {
    if (!onStateChangeCallback || isFirstLoad) return;
    const current = getSyncedSnapshot() || {};
    current.jogosSingulares = mergeSingles(legacySingles, snapshot.val());
    onStateChangeCallback(current, false);
  }, (err) => console.error("Firebase error reading single matches:", err));
}

// One-time rewrite by the master: players and the archive keyed by id (older
// saves wrote arrays), and single matches moved out of the tournaments, which
// anyone can read, into /singleMatches
let globalRecordsChecked = false;
async function migrateGlobalRecords(): Promise<void> {
  if (globalRecordsChecked) return;
  globalRecordsChecked = true;
  const [playersSnap, arqSnap, tournamentsSnap] = await Promise.all([
    get(ref(database, 'players')), get(ref(database, 'arquivo')), get(ref(database, 'tournaments')),
  ]);
  const updates: Updates = {};
  if (!isKeyedById(playersSnap.val())) updates['players'] = keyById(normalizePlayers(playersSnap.val()));
  if (!isKeyedById(arqSnap.val())) updates['arquivo'] = keyById(normalizeArquivo(arqSnap.val()));
  const tournaments = (tournamentsSnap.val() || {}) as Record<string, Snapshot | null>;
  Object.keys(tournaments).forEach((id) => {
    const stored = tournaments[id]?.jogosSingulares;
    if (stored === undefined || stored === null) return;
    normalizeSingleMatches(stored).forEach((m) => { updates[`singleMatches/${m.id}`] = m; });
    updates[`tournaments/${id}/jogosSingulares`] = null;
    const log = logEntry(en.sync.singleMatchesMoved, id);
    Object.assign(updates, log);
    updates[`tournaments/${id}/logRef`] = Object.keys(log)[0].split('/')[2];
  });
  if (!Object.keys(updates).length) return;
  await update(ref(database), updates);
  console.log(`Global records migrated: ${Object.keys(updates).length} paths`);
}

// Calls callback({ user, role, admin }) on sign-in, sign-out and role changes
export function initAuth(callback: (info: AuthInfo) => void): void {
  onAuthStateChanged(auth, (user) => {
    if (stopRoleListener) { stopRoleListener(); stopRoleListener = null; }
    currentUser = user;
    currentRole = null;
    currentUserAdmin = {};

    if (!user) {
      syncSinglesListener();
      callback({ user: null, role: null, admin: {} });
      return;
    }

    const profile: Record<string, unknown> = {
      nome: displayName(user),
      ultimoAcesso: serverTimestamp(),
    };
    if (user.email) profile.email = user.email;
    if (user.photoURL) profile.foto = user.photoURL.slice(0, 500);
    update(ref(database, `users/${user.uid}`), profile).catch((err) => {
      console.error("Firebase error saving profile:", err);
    });

    callback({ user, role: null, admin: {} });
    stopRoleListener = onValue(ref(database, `users/${user.uid}`), async (snap) => {
      const val = snap.val() || {};
      currentRole = (val.role as Role) || null;
      currentUserAdmin = val.admin || {};
      syncSinglesListener();
      callback({ user, role: currentRole, admin: currentUserAdmin });

      if (currentRole === 'master' || currentRole === 'admin') {
        try {
          await checkAndMigrateLegacyState();
        } catch (err) {
          console.error("Legacy migration check failed:", err);
        }
      }
      if (currentRole === 'master') {
        migrateLegacyRoles().catch((err) => console.error("Users migration failed:", err));
        migrateGlobalRecords().catch((err) => console.error("Players, archive and single matches migration failed:", err));
      }
    }, (err) => {
      console.error("Firebase error reading user role:", err);
    });
  });

  // In emulator/docker mode, default to the saved dev role (or 'master')
  if (isEmulator && !currentUser) {
    const initialDevRole = getCurrentDevRole();
    if (initialDevRole !== 'none') {
      setDevRole(initialDevRole).catch((err) => console.error("Auto dev role initialization error:", err));
    }
  }
}

export function getCurrentDevRole(): DevRole {
  return (localStorage.getItem('torneio_dev_role') as DevRole) || 'master';
}

export async function setDevRole(role: DevRole): Promise<void> {
  if (!isEmulator) return;

  if (role === 'none') {
    await signOut(auth);
    localStorage.setItem('torneio_dev_role', 'none');
    return;
  }

  const devUser = DEV_USERS[role];
  let userCred;
  try {
    userCred = await signInWithEmailAndPassword(auth, devUser.email, devUser.password);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== 'auth/user-not-found' && code !== 'auth/invalid-credential') throw err;
    userCred = await createUserWithEmailAndPassword(auth, devUser.email, devUser.password);
    await updateProfile(userCred.user, { displayName: devUser.name });
  }

  // The rules only let a master write roles, so the emulator's admin token
  // ("Bearer owner") sets them. The namespace comes from the database URL,
  // which must be the one the emulator loaded database.rules.json into.
  const ns = new URL(firebaseConfig.databaseURL ?? '').hostname.split('.')[0];
  const res = await fetch(`http://${EMULATOR_HOST}:${EMULATOR_DB_PORT}/users/${userCred.user.uid}.json?ns=${ns}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({
      nome: devUser.name,
      email: devUser.email,
      role: devUser.role,
      admin: devUser.admin || null,
    }),
  });
  if (!res.ok) throw new Error(`Emulator role update failed: ${res.status} ${await res.text()}`);

  localStorage.setItem('torneio_dev_role', role);
}

export function signInWithGoogle(): ReturnType<typeof signInWithPopup> {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

// ---------------------------------------------------------------------------
// Administration (only the master can read)
// ---------------------------------------------------------------------------
export function listenUsers(callback: (users: UserProfile[]) => void): Unsubscribe {
  return onValue(ref(database, 'users'), (snap) => {
    const val: Record<string, Omit<UserProfile, 'uid'>> = snap.val() || {};
    callback(Object.keys(val).map((uid) => ({ uid, ...val[uid] })));
  }, (err) => console.error("Firebase error reading users:", err));
}

export function listenLog(callback: (entries: LogEntry[]) => void, tournamentId: string = activeTournamentId): Unsubscribe {
  const q = query(ref(database, `tournament_log/${tournamentId}`), orderByChild('quando'), limitToLast(LOG_LIMIT));
  return onValue(q, (snap) => {
    const entries: LogEntry[] = [];
    snap.forEach((child) => { entries.push({ id: child.key, ...child.val() }); });
    callback(entries.reverse());
  }, (err) => console.error("Firebase error reading log:", err));
}

// role: 'master' | 'admin' | 'user' | null (pending)
export function setUserRole(uid: string, role: Role | null, sportAdmins: Record<string, boolean> | null = null, nome = ''): Promise<void> {
  const updates: Updates = {
    [`users/${uid}/role`]: role || null,
    ...logEntry(en.sync.roleChanged(nome || uid, roleLabel(role, sportAdmins))),
  };
  if (sportAdmins !== null) {
    updates[`users/${uid}/admin`] = sportAdmins;
  }
  return update(ref(database), updates);
}

// ---------------------------------------------------------------------------
// Tournaments (list, create and finish)
// ---------------------------------------------------------------------------
export function listenTournaments(callback: (list: TournamentListing[]) => void): Unsubscribe {
  return onValue(ref(database, 'tournaments'), async (snapshot) => {
    let val: Record<string, Snapshot> = snapshot.val() || {};
    if (Object.keys(val).length === 0) {
      try {
        const legacySnap = await get(ref(database, 'torneio_state'));
        const legacyVal = legacySnap.val();
        if (legacyVal) {
          val = {
            default: {
              meta: {
                name: (legacyVal.config && legacyVal.config.nome) || 'Futebol ILOG',
                sport: 'football',
                status: 'active',
                createdAt: Date.now(),
              },
              config: legacyVal.config,
            },
          } as Record<string, Snapshot>;
        }
      } catch {
        // ignore
      }
    }
    const list = Object.keys(val).map((id) => {
      const t = val[id] || {};
      const meta = normalizeMeta(t.meta, t.config);
      return {
        id,
        ...meta,
      };
    });
    callback(list);
  }, (err) => console.error("Firebase error reading tournaments:", err));
}

export async function finishTournament(tournamentId: string = activeTournamentId, archiveEntry?: ArchiveEntry | null): Promise<PushResult> {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };

  let currentMeta: Partial<TournamentMeta> = {};
  try {
    const metaSnap = await get(ref(database, `tournaments/${tournamentId}/meta`));
    currentMeta = metaSnap.val() || {};
  } catch {
    // fallback
  }

  const sport = currentMeta.sport || 'football';
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const updatedMeta: TournamentMeta = {
    name: currentMeta.name || en.common.tournament,
    sport,
    status: 'finished',
    createdAt: currentMeta.createdAt || Date.now(),
  };

  const log = logEntry(en.sync.tournamentFinished(updatedMeta.name), tournamentId);
  const logKey = Object.keys(log)[0].split('/')[2];

  const rootUpdates: Updates = {
    ...log,
    [`tournaments/${tournamentId}/logRef`]: logKey,
    [`tournaments/${tournamentId}/meta`]: updatedMeta,
  };

  if (archiveEntry && archiveEntry.id) {
    rootUpdates[`arquivo/${archiveEntry.id}`] = archiveEntry;
  }

  await update(ref(database), rootUpdates);
  return { ok: true };
}

export interface NewTournament { name: string; sport?: string; numEquipas?: number | string; numVoltas?: number | string }

export async function createTournament({ name, sport = 'football', numEquipas = 8, numVoltas = 2 }: NewTournament): Promise<PushResult & { tournamentId?: string }> {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const tournamentId = 't_' + Date.now();
  const meta: TournamentMeta = {
    name: (name || en.common.tournament).slice(0, 100),
    sport,
    status: 'active',
    createdAt: Date.now(),
  };

  const config = normalizeConfig({
    nome: meta.name,
    sport,
    numEquipas: Number(numEquipas) || 8,
    numVoltas: Number(numVoltas) || 2,
  });

  const emptyTeams = Array.from({ length: 32 }, () => ({ name: '', color: '#2F7A4F' }));
  const emptySquads = Array.from({ length: 32 }, () => []);

  const log = logEntry(en.sync.tournamentCreated(meta.name, sport), tournamentId);
  const logKey = Object.keys(log)[0].split('/')[2];

  const rootUpdates = {
    ...log,
    [`tournaments/${tournamentId}/logRef`]: logKey,
    [`tournaments/${tournamentId}/meta`]: meta,
    [`tournaments/${tournamentId}/config`]: config,
    [`tournaments/${tournamentId}/teams`]: emptyTeams,
    [`tournaments/${tournamentId}/squads`]: emptySquads,
    [`tournaments/${tournamentId}/schedule`]: [],
    [`tournaments/${tournamentId}/roundsMeta`]: [],
    [`tournaments/${tournamentId}/scheduleTeamCount`]: config.numEquipas,
    [`tournaments/${tournamentId}/scheduleVoltas`]: config.numVoltas,
    [`tournaments/${tournamentId}/results`]: {},
    [`tournaments/${tournamentId}/version`]: 9,
    [`tournaments/${tournamentId}/exportedAt`]: new Date().toISOString(),
  };

  await update(ref(database), rootUpdates);
  return { ok: true, tournamentId };
}

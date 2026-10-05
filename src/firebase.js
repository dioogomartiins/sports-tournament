import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, onValue, update, push, query, orderByChild, limitToLast, serverTimestamp, get } from "firebase/database";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { diffSnapshot, describeUpdates, onlyMetadata, normalizeMeta, normalizeConfig } from "./sync.js";
import { en } from "./i18n/en.js";
import { blockedPaths, roleLabel, isSportAdmin, isMaster } from "./permissions.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Desenvolvimento: usar os emuladores locais do Firebase em vez da base de dados real
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectDatabaseEmulator(database, '127.0.0.1', 9000);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}

const LOG_LIMIT = 200;

let activeTournamentId = 'default';
let onStateChangeCallback = null;
let onPushErrorCallback = null;
let isFirstLoad = true;
let lastSynced = null; // último snapshot igual ao que está no Firebase
let stopStateListener = null;
let stopArquivoListener = null;
let stopPlayersListener = null;

export function setActiveTournamentId(id) {
  if (!id || id === activeTournamentId) return;
  activeTournamentId = id;
  lastSynced = null;
  isFirstLoad = true;
  initFirebaseListener(activeTournamentId);
}

export function getActiveTournamentId() {
  return activeTournamentId;
}

// Set the callback that will be called whenever the DB updates
export function onFirebaseStateChange(callback) {
  onStateChangeCallback = callback;
}

// Start listening to the "tournaments/<id>" node, global "arquivo", and global "players"
export function initFirebaseListener(tournamentId = activeTournamentId) {
  activeTournamentId = tournamentId || 'default';
  if (stopStateListener) {
    stopStateListener();
    stopStateListener = null;
  }

  const stateRef = ref(database, `tournaments/${activeTournamentId}`);
  stopStateListener = onValue(stateRef, async (snapshot) => {
    let data = snapshot.val();
    if (!data) {
      // Fallback para ler dados legados caso a migração ainda não tenha corrido
      try {
        const legacySnap = await get(ref(database, 'torneio_state'));
        data = legacySnap.val();
      } catch {
        // Ignora erros de permissão ou rede
      }
    }
    if (data) {
      // Arquivo global vive em /arquivo
      try {
        const arqSnap = await get(ref(database, 'arquivo'));
        const arqVal = arqSnap.val();
        if (arqVal) data.arquivo = arqVal;
      } catch {
        // Ignora
      }

      // Jogadores globais vivem em /players
      try {
        const playersSnap = await get(ref(database, 'players'));
        const playersVal = playersSnap.val();
        if (playersVal) data.players = playersVal;
      } catch {
        // Ignora
      }
    }
    // Base de dados vazia: já está sincronizada, a primeira gravação envia tudo
    if (!data && !lastSynced) lastSynced = {};
    if (data && onStateChangeCallback) {
      onStateChangeCallback(data, isFirstLoad);
      isFirstLoad = false;
    }
  });

  if (!stopArquivoListener) {
    const arquivoRef = ref(database, 'arquivo');
    stopArquivoListener = onValue(arquivoRef, (snapshot) => {
      const arqVal = snapshot.val();
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
      if (playersVal && onStateChangeCallback && !isFirstLoad) {
        const current = getSyncedSnapshot() || {};
        current.players = playersVal;
        onStateChangeCallback(current, false);
      }
    }, (err) => console.error("Firebase error reading players:", err));
  }
}

// Called when Firebase rejects a save that was already applied locally
export function onFirebasePushError(callback) {
  onPushErrorCallback = callback;
}

// Record the snapshot that matches what Firebase currently holds
export function setSyncedSnapshot(snap) {
  lastSynced = JSON.parse(JSON.stringify(snap));
}

export function getSyncedSnapshot() {
  return lastSynced ? JSON.parse(JSON.stringify(lastSynced)) : null;
}

// Push only what changed since the last sync, so concurrent edits to
// different games or sections don't overwrite each other. Each push also
// appends an entry to tournament_log/<id> with who made the change.
//
// Returns { ok: true } or { ok: false, reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' }.
// When it fails nothing is sent and the caller should restore the last synced state.
export function pushStateToFirebase(newState, tournamentId = activeTournamentId) {
  if (!lastSynced) return { ok: false, reason: 'sem-sync' };

  const updates = diffSnapshot(lastSynced, newState);
  // Só mudou a data de exportação: nada a gravar
  if (onlyMetadata(updates)) return { ok: true };

  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  const sport = newState?.meta?.sport || newState?.config?.sport || 'football';
  if (blockedPaths(currentRole, updates, { sport, userAdmin: currentUserAdmin }).length) return { ok: false, reason: 'sem-permissao' };

  lastSynced = JSON.parse(JSON.stringify(newState));

  const rootUpdates = {};
  Object.keys(updates).forEach((p) => {
    if (p === 'arquivo') {
      rootUpdates['arquivo'] = updates[p];
    } else if (p === 'players') {
      rootUpdates['players'] = updates[p];
    } else {
      rootUpdates[`tournaments/${tournamentId}/${p}`] = updates[p];
    }
  });

  // As regras exigem que cada gravação aponte (logRef) para uma entrada nova
  // do registo de alterações, escrita no mesmo update()
  const log = logEntry(describeUpdates(updates, newState) || en.sync.tournamentChanged, tournamentId);
  Object.assign(rootUpdates, log);
  const logKey = Object.keys(log)[0].split('/')[2];
  rootUpdates[`tournaments/${tournamentId}/logRef`] = logKey;

  update(ref(database), rootUpdates).catch((err) => {
    console.error("Firebase error pushing state:", err);
    // O Firebase repõe sozinho o valor do servidor (onValue); só falta avisar
    if (onPushErrorCallback) onPushErrorCallback(err);
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Sessão (Google) e perfis
// ---------------------------------------------------------------------------
let currentUser = null;
let currentRole = null;
let currentUserAdmin = {};
let stopRoleListener = null;

export function getCurrentUser() { return currentUser; }
export function getCurrentRole() { return currentRole; }
export function getCurrentUserAdmin() { return currentUserAdmin; }
export function isCurrentSportAdmin(sport = 'football') {
  return isSportAdmin(currentRole, sport, currentUserAdmin);
}
export function isCurrentMaster() {
  return isMaster(currentRole);
}

function displayName(user) {
  return (user.displayName || user.email || 'Sem nome').slice(0, 100);
}

function logEntry(acao, tournamentId = activeTournamentId) {
  const key = push(ref(database, `tournament_log/${tournamentId}`)).key;
  return {
    [`tournament_log/${tournamentId}/${key}`]: {
      uid: currentUser.uid,
      nome: displayName(currentUser),
      acao: acao.slice(0, 500),
      quando: serverTimestamp(),
    },
  };
}

// Migração: o primeiro load do master admin copia torneio_state para tournaments/default
async function checkAndMigrateLegacyState() {
  const defaultTourneyRef = ref(database, 'tournaments/default');
  const defaultSnap = await get(defaultTourneyRef);
  if (defaultSnap.exists()) return;

  const legacyRef = ref(database, 'torneio_state');
  const legacySnap = await get(legacyRef);
  const legacyData = legacySnap.val();
  if (!legacyData) return;

  console.log("A migrar torneio_state para tournaments/default...");
  const meta = {
    name: (legacyData.config && legacyData.config.nome) || 'Futebol ILOG',
    sport: 'football',
    status: 'active',
    createdAt: Date.now(),
  };

  const key = push(ref(database, 'tournament_log/default')).key;
  const rootUpdates = {
    [`tournament_log/default/${key}`]: {
      uid: currentUser.uid,
      nome: displayName(currentUser),
      acao: en.sync.legacyMigrated,
      quando: serverTimestamp(),
    },
    'tournaments/default/logRef': key,
    'tournaments/default/meta': meta,
    'tournaments/default/version': 9,
  };

  Object.keys(legacyData).forEach((k) => {
    if (k === 'arquivo') {
      rootUpdates['arquivo'] = legacyData.arquivo;
    } else if (k === 'players') {
      const rawPlayers = legacyData.players || [];
      const list = Array.isArray(rawPlayers) ? rawPlayers : Object.values(rawPlayers);
      rootUpdates['players'] = list.map((p) => {
        if (!p || typeof p !== 'object') return p;
        const ratings = p.ratings || {};
        if (!ratings.football && p.atributos) {
          ratings.football = p.atributos;
        }
        return {
          ...p,
          ratings,
          atributos: ratings.football || p.atributos,
        };
      });
    } else if (k !== 'logRef' && k !== 'version' && k !== 'meta') {
      rootUpdates[`tournaments/default/${k}`] = legacyData[k];
    }
  });

  await update(ref(database), rootUpdates);
  console.log("Tournament migration completed");

  // Migração de utilizadores para users se users ainda não existir
  try {
    const usersSnap = await get(ref(database, 'users'));
    if (!usersSnap.exists() || Object.keys(usersSnap.val() || {}).length === 0) {
      const utilSnap = await get(ref(database, 'utilizadores'));
      const utilData = utilSnap.val();
      if (utilData && typeof utilData === 'object') {
        const userUpdates = {};
        Object.keys(utilData).forEach((uid) => {
          const u = utilData[uid];
          const isMasterUser = u.role === 'admin';
          userUpdates[`users/${uid}`] = {
            nome: u.nome || '',
            email: u.email || '',
            foto: u.foto || '',
            ultimoAcesso: u.ultimoAcesso || Date.now(),
            role: isMasterUser ? 'master' : (u.role || 'user'),
            ...(isMasterUser ? { admin: { football: true, padel: true } } : {}),
          };
        });
        await update(ref(database), userUpdates);
        console.log("utilizadores migrated to users");
      }
    }
  } catch (err) {
    console.error("Users migration failed:", err);
  }
}

// Calls callback({ user, role, admin }) on sign-in, sign-out and role changes
export function initAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (stopRoleListener) { stopRoleListener(); stopRoleListener = null; }
    currentUser = user;
    currentRole = null;
    currentUserAdmin = {};

    if (!user) {
      callback({ user: null, role: null, admin: {} });
      return;
    }

    const profile = {
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
      currentRole = val.role || null;
      currentUserAdmin = val.admin || {};
      callback({ user, role: currentRole, admin: currentUserAdmin });

      if (currentRole === 'master' || currentRole === 'admin') {
        try {
          await checkAndMigrateLegacyState();
        } catch (err) {
          console.error("Legacy migration check failed:", err);
        }
      }
    }, (err) => {
      console.error("Firebase error reading user role:", err);
    });
  });
}

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser() {
  return signOut(auth);
}

// ---------------------------------------------------------------------------
// Administração (só master consegue ler)
// ---------------------------------------------------------------------------
export function listenUsers(callback) {
  return onValue(ref(database, 'users'), (snap) => {
    const val = snap.val() || {};
    callback(Object.keys(val).map((uid) => ({ uid, ...val[uid] })));
  }, (err) => console.error("Firebase error reading users:", err));
}

export function listenLog(callback, tournamentId = activeTournamentId) {
  const q = query(ref(database, `tournament_log/${tournamentId}`), orderByChild('quando'), limitToLast(LOG_LIMIT));
  return onValue(q, (snap) => {
    const entries = [];
    snap.forEach((child) => { entries.push({ id: child.key, ...child.val() }); });
    callback(entries.reverse());
  }, (err) => console.error("Firebase error reading log:", err));
}

// role: 'master' | 'admin' | 'user' | null (pendente)
export function setUserRole(uid, role, sportAdmins = null, nome = '') {
  const updates = {
    [`users/${uid}/role`]: role || null,
    ...logEntry(en.sync.roleChanged(nome || uid, roleLabel(role, sportAdmins))),
  };
  if (sportAdmins !== null) {
    updates[`users/${uid}/admin`] = sportAdmins;
  }
  return update(ref(database), updates);
}

// ---------------------------------------------------------------------------
// Torneios (listar, criar e terminar)
// ---------------------------------------------------------------------------
export function listenTournaments(callback) {
  return onValue(ref(database, 'tournaments'), async (snapshot) => {
    let val = snapshot.val() || {};
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
          };
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

export async function finishTournament(tournamentId = activeTournamentId, archiveEntry) {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };

  let currentMeta = {};
  try {
    const metaSnap = await get(ref(database, `tournaments/${tournamentId}/meta`));
    currentMeta = metaSnap.val() || {};
  } catch {
    // fallback
  }

  const sport = currentMeta.sport || 'football';
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const updatedMeta = {
    name: currentMeta.name || 'Torneio',
    sport,
    status: 'finished',
    createdAt: currentMeta.createdAt || Date.now(),
  };

  const log = logEntry(en.sync.tournamentFinished(updatedMeta.name), tournamentId);
  const logKey = Object.keys(log)[0].split('/')[2];

  const rootUpdates = {
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

export async function createTournament({ name, sport = 'football', numEquipas = 8, numVoltas = 2 }) {
  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  if (!isSportAdmin(currentRole, sport, currentUserAdmin)) return { ok: false, reason: 'sem-permissao' };

  const tournamentId = 't_' + Date.now();
  const meta = {
    name: (name || 'Novo Torneio').slice(0, 100),
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
    [`tournaments/${tournamentId}/players`]: [],
    [`tournaments/${tournamentId}/jogosSingulares`]: [],
    [`tournaments/${tournamentId}/version`]: 9,
    [`tournaments/${tournamentId}/exportedAt`]: new Date().toISOString(),
  };

  await update(ref(database), rootUpdates);
  return { ok: true, tournamentId };
}

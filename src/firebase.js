import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, onValue, update, push, query, orderByChild, limitToLast, serverTimestamp, get } from "firebase/database";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { diffSnapshot, describeUpdates, onlyMetadata } from "./sync.js";
import { blockedPaths, roleLabel } from "./permissions.js";

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

// Start listening to the "tournaments/<id>" node and global "arquivo"
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
  if (blockedPaths(currentRole, updates).length) return { ok: false, reason: 'sem-permissao' };

  lastSynced = JSON.parse(JSON.stringify(newState));

  const rootUpdates = {};
  Object.keys(updates).forEach((p) => {
    if (p === 'arquivo') {
      rootUpdates['arquivo'] = updates[p];
    } else {
      rootUpdates[`tournaments/${tournamentId}/${p}`] = updates[p];
    }
  });

  // As regras exigem que cada gravação aponte (logRef) para uma entrada nova
  // do registo de alterações, escrita no mesmo update()
  const log = logEntry(describeUpdates(updates, newState) || 'Alterações ao torneio', tournamentId);
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
let stopRoleListener = null;

export function getCurrentUser() { return currentUser; }
export function getCurrentRole() { return currentRole; }

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
      acao: 'Migração do torneio legado para tournaments/default',
      quando: serverTimestamp(),
    },
    'tournaments/default/logRef': key,
    'tournaments/default/meta': meta,
    'tournaments/default/version': 9,
  };

  Object.keys(legacyData).forEach((k) => {
    if (k === 'arquivo') {
      rootUpdates['arquivo'] = legacyData.arquivo;
    } else if (k !== 'logRef' && k !== 'version' && k !== 'meta') {
      rootUpdates[`tournaments/default/${k}`] = legacyData[k];
    }
  });

  await update(ref(database), rootUpdates);
  console.log("Migração concluída com sucesso!");
}

// Calls callback({ user, role }) on sign-in, sign-out and role changes
export function initAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (stopRoleListener) { stopRoleListener(); stopRoleListener = null; }
    currentUser = user;
    currentRole = null;

    if (!user) {
      callback({ user: null, role: null });
      return;
    }

    const profile = {
      nome: displayName(user),
      ultimoAcesso: serverTimestamp(),
    };
    if (user.email) profile.email = user.email;
    if (user.photoURL) profile.foto = user.photoURL.slice(0, 500);
    update(ref(database, `utilizadores/${user.uid}`), profile).catch((err) => {
      console.error("Firebase error saving profile:", err);
    });

    callback({ user, role: null });
    stopRoleListener = onValue(ref(database, `utilizadores/${user.uid}/role`), async (snap) => {
      currentRole = snap.val();
      callback({ user, role: currentRole });

      if (currentRole === 'admin') {
        try {
          await checkAndMigrateLegacyState();
        } catch (err) {
          console.error("Erro na verificação de migração legada:", err);
        }
      }
    }, (err) => {
      console.error("Firebase error reading role:", err);
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
// Administração (só admins conseguem ler)
// ---------------------------------------------------------------------------
export function listenUsers(callback) {
  return onValue(ref(database, 'utilizadores'), (snap) => {
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

// role: 'admin' | 'user' | null (pendente)
export function setUserRole(uid, role, nome) {
  return update(ref(database), {
    [`utilizadores/${uid}/role`]: role,
    ...logEntry(`Perfil de ${nome || uid} alterado para ${roleLabel(role)}`),
  });
}

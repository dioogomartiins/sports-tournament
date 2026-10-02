import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, onValue, update, push, query, orderByChild, limitToLast, serverTimestamp } from "firebase/database";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { diffSnapshot, describeUpdates } from "./sync.js";
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

let onStateChangeCallback = null;
let isFirstLoad = true;
let lastSynced = null; // último snapshot igual ao que está no Firebase

// Set the callback that will be called whenever the DB updates
export function onFirebaseStateChange(callback) {
  onStateChangeCallback = callback;
}

// Start listening to the "torneio_state" node
export function initFirebaseListener() {
  const stateRef = ref(database, 'torneio_state');
  onValue(stateRef, (snapshot) => {
    const data = snapshot.val();
    // Base de dados vazia: já está sincronizada, a primeira gravação envia tudo
    if (!data && !lastSynced) lastSynced = {};
    if (data && onStateChangeCallback) {
      onStateChangeCallback(data, isFirstLoad);
      isFirstLoad = false;
    }
  });
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
// appends an entry to torneio_log with who made the change.
//
// Returns { ok: true } or { ok: false, reason: 'sem-sync' | 'sem-sessao' | 'sem-permissao' }.
// When it fails nothing is sent and the caller should restore the last synced state.
export function pushStateToFirebase(newState) {
  if (!lastSynced) return { ok: false, reason: 'sem-sync' };

  const updates = diffSnapshot(lastSynced, newState);
  if (!Object.keys(updates).length) return { ok: true };

  if (!currentUser) return { ok: false, reason: 'sem-sessao' };
  if (blockedPaths(currentRole, updates).length) return { ok: false, reason: 'sem-permissao' };

  lastSynced = JSON.parse(JSON.stringify(newState));

  const rootUpdates = {};
  Object.keys(updates).forEach((p) => { rootUpdates[`torneio_state/${p}`] = updates[p]; });
  const acao = describeUpdates(updates, newState);
  if (acao) Object.assign(rootUpdates, logEntry(acao));

  update(ref(database), rootUpdates).catch((err) => {
    console.error("Firebase error pushing state:", err);
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

function logEntry(acao) {
  const key = push(ref(database, 'torneio_log')).key;
  return {
    [`torneio_log/${key}`]: {
      uid: currentUser.uid,
      nome: displayName(currentUser),
      acao: acao.slice(0, 500),
      quando: serverTimestamp(),
    },
  };
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
    stopRoleListener = onValue(ref(database, `utilizadores/${user.uid}/role`), (snap) => {
      currentRole = snap.val();
      callback({ user, role: currentRole });
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

export function listenLog(callback) {
  const q = query(ref(database, 'torneio_log'), orderByChild('quando'), limitToLast(LOG_LIMIT));
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

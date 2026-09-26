import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { diffSnapshot } from "./sync.js";

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

// Push only what changed since the last sync, so concurrent edits to
// different games or sections don't overwrite each other
export function pushStateToFirebase(newState) {
  const updates = diffSnapshot(lastSynced, newState);
  lastSynced = JSON.parse(JSON.stringify(newState));
  if (!Object.keys(updates).length) return;

  const stateRef = ref(database, 'torneio_state');
  update(stateRef, updates).catch((err) => {
    console.error("Firebase error pushing state:", err);
  });
}

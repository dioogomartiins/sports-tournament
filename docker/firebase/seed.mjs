// Seeds the dev accounts (master, admin, user) into the Auth and Database emulators
const DB_HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST || '127.0.0.1:9000';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'demo-torneio';
// The emulator loads database.rules.json into the project's default instance
const DB_NS = process.env.FIREBASE_DATABASE_NAMESPACE || `${PROJECT_ID}-default-rtdb`;

// Keep in sync with DEV_USERS in src/firebase.ts
const USERS = [
  { email: 'master@torneio.local', password: 'password123', displayName: 'Master Admin', role: 'master', admin: null },
  { email: 'admin@torneio.local', password: 'password123', displayName: 'Football Admin', role: 'admin', admin: { football: true } },
  { email: 'user@torneio.local', password: 'password123', displayName: 'Test User', role: 'user', admin: null },
];

async function authCall(method, body) {
  const res = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:${method}?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Creates the account, or signs in to get its uid when it already exists
async function accountId(u) {
  const created = await authCall('signUp', {
    email: u.email,
    password: u.password,
    displayName: u.displayName,
    returnSecureToken: true,
  });
  if (created.localId) return created.localId;
  if (created.error?.message !== 'EMAIL_EXISTS') throw new Error(JSON.stringify(created.error));
  const signedIn = await authCall('signInWithPassword', { email: u.email, password: u.password, returnSecureToken: true });
  if (!signedIn.localId) throw new Error(JSON.stringify(signedIn.error));
  return signedIn.localId;
}

async function seed() {
  console.log(`[Seed] Seeding dev users (database namespace ${DB_NS})...`);
  let failed = false;
  for (const u of USERS) {
    try {
      const uid = await accountId(u);
      // "Bearer owner" is the emulator's admin token: the rules only let a master set roles
      const res = await fetch(`http://${DB_HOST}/users/${uid}.json?ns=${DB_NS}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
        body: JSON.stringify({ nome: u.displayName, email: u.email, role: u.role, admin: u.admin }),
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      console.log(`[Seed] Seeded ${u.displayName} (${u.role}) -> ${uid}`);
    } catch (err) {
      failed = true;
      console.warn(`[Seed] Could not seed ${u.email}:`, err);
    }
  }
  console.log(failed ? '[Seed] Finished with errors.' : '[Seed] Dev users seeded.');
}

seed();

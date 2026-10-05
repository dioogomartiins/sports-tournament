// Automatically seeds default fake accounts (master, admin, user) in the emulator
const DB_HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST || '127.0.0.1:9000';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'demo-torneio';

const USERS = [
  {
    email: 'master@torneio.local',
    password: 'password123',
    displayName: 'Master Admin',
    role: 'master',
    admin: { football: true, padel: true, tennis: true },
  },
  {
    email: 'admin@torneio.local',
    password: 'password123',
    displayName: 'Admin Futebol',
    role: 'admin',
    admin: { football: true, padel: true, tennis: true },
  },
  {
    email: 'user@torneio.local',
    password: 'password123',
    displayName: 'Utilizador',
    role: 'user',
    admin: null,
  },
];

async function seed() {
  console.log('[Seed] Seeding dev users in Firebase Auth & Database emulators...');
  for (const u of USERS) {
    let localId;
    try {
      const res = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: u.email,
          password: u.password,
          displayName: u.displayName,
          returnSecureToken: true,
        }),
      });
      const data = await res.json();
      localId = data.localId;
      if (!localId && data.error?.message === 'EMAIL_EXISTS') {
        // Look up user to get localId
        const lookupRes = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:lookup?key=demo-key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: data.idToken }),
        });
        const lookupData = await lookupRes.json();
        localId = lookupData.users?.[0]?.localId;
      }
    } catch (err) {
      console.warn(`[Seed] Sign up for ${u.email} skipped or failed:`, err);
    }

    if (localId) {
      try {
        await fetch(`http://${DB_HOST}/users/${localId}.json?ns=${PROJECT_ID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: u.displayName,
            email: u.email,
            role: u.role,
            admin: u.admin,
            ultimoAcesso: Date.now(),
          }),
        });
        console.log(`[Seed] Seeded ${u.displayName} (${u.role}) -> ${localId}`);
      } catch (err) {
        console.warn(`[Seed] Database patch failed for ${localId}:`, err);
      }
    }
  }
  console.log('[Seed] Dev users seeded successfully.');
}

seed();

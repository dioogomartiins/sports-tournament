// Checks database.rules.json in the Firebase emulator (needs Java).
// Run with: npm run test:rules
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, update, set, push, get, serverTimestamp } from 'firebase/database';
import fs from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'demo-torneio',
  database: { host: '127.0.0.1', port: 9100, rules: fs.readFileSync(new URL('../../database.rules.json', import.meta.url), 'utf8') },
});
await env.withSecurityRulesDisabled(async (ctx) => {
  await set(ref(ctx.database()), {
    users: {
      mst: { role: 'master', nome: 'Master' },
      adm_foot: { role: 'admin', admin: { football: true }, nome: 'Admin Futebol' },
      adm_padel: { role: 'admin', admin: { padel: true }, nome: 'Admin Padel' },
      usr: { role: 'user', nome: 'User' },
      pend: { nome: 'Pendente' },
    },
    utilizadores: { adm: { role: 'admin' }, usr: { role: 'user' } },
    torneio_state: {
      config: { nome: 'T' },
      schedule: [{ home: 0, away: 1, jornada: 1 }],
    },
    tournaments: {
      t1: {
        meta: { name: 'T1 Futebol', sport: 'football', status: 'active', createdAt: 1000 },
        config: { nome: 'T1' },
        schedule: [{ home: 0, away: 1, jornada: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true, jornada: 'Final' }],
        results: { 0: { score: '1-0', status: 'terminado', scorers: { home: ['a'] } } },
        logRef: 'antigo',
      },
      t2: {
        meta: { name: 'T2 Padel', sport: 'padel', status: 'active', createdAt: 1500 },
        config: { nome: 'T2' },
        schedule: [{ home: 0, away: 1, jornada: 1 }],
        results: { 0: { score: '6-4', status: 'terminado', scorers: { home: ['a'] } } },
        logRef: 'antigo_padel',
      },
      tt: {
        meta: { name: 'Tennis Open', sport: 'tennis', status: 'active', createdAt: 1600 },
        config: { nome: 'TT' },
        schedule: [{ home: 0, away: 1, jornada: 1 }],
        logRef: 'antigo_tennis',
      },
    },
    tournament_log: {
      t1: { antigo: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
      t2: { antigo_padel: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
      tt: { antigo_tennis: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
    },
    arquivo: {
      a1: { id: 'a1', nome: 'Antigo', sport: 'football' },
      a_old: { id: 'a_old', nome: 'Sem modalidade' },
    },
    players: {
      px: { id: 'px', nome: 'Existente', ratings: { football: { velocidade: 5 }, padel: { smash: 3 } }, atributos: { velocidade: 5 } },
    },
    singleMatches: {
      s1: { id: 's1', data: '2026-01-01', resultado: '1-0' },
    },
  });
});

function db(uid) { return env.authenticatedContext(uid).database(); }
function withLog(d, uid, upd, tournamentId = 't1') {
  const key = push(ref(d, `tournament_log/${tournamentId}`)).key;
  return {
    ...upd,
    [`tournament_log/${tournamentId}/${key}`]: { uid, nome: 'n', acao: 'teste', quando: serverTimestamp() },
    [`tournaments/${tournamentId}/logRef`]: key,
  };
}

let ok = 0, bad = 0;
async function check(name, expect, p) {
  try {
    await (expect ? assertSucceeds(p) : assertFails(p));
    ok++;
    console.log('ok  ', name);
  } catch (e) {
    bad++;
    console.log('FAIL', name, e.message);
  }
}

const u = db('usr'),
  mst = db('mst'),
  adm_foot = db('adm_foot'),
  adm_padel = db('adm_padel'),
  p = db('pend'),
  anon = env.unauthenticatedContext().database();

const res = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['', 'c'] }, mvp: 'a' };

// --- torneio_state (read-only) ---
await check('anonymous does NOT read torneio_state', false, get(ref(anon, 'torneio_state')));
await check('user does NOT read torneio_state', false, get(ref(u, 'torneio_state')));
await check('padel admin does NOT read torneio_state', false, get(ref(adm_padel, 'torneio_state')));
await check('football admin reads torneio_state', true, get(ref(adm_foot, 'torneio_state')));
await check('master does not write torneio_state', false, update(ref(mst), { 'torneio_state/config/nome': 'Hacked' }));
await check('user does not write torneio_state', false, update(ref(u), { 'torneio_state/results/0': res }));

// --- tournaments / tournament_log ---
// Results and playoff winners are written only by the sport's admins (and master)
await check('user does NOT write a result', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': res })));
await check('user does NOT delete a result', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': null })));
await check('user does NOT change a match status', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/1': { score: '0-0', status: 'decorrer' } })));
await check('user does NOT advance a winner (schedule/1/home)', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/home': 0 })));
await check('football admin writes a football result', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t1/results/1': { score: '0-0', status: 'decorrer' } })));
await check('padel admin does NOT write a football result', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t1/results/1': { score: '1-0', status: 'decorrer' } })));
await check('master writes a result with a log entry', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/0': res })));
await check('master writes a result without a log entry', false, update(ref(mst), { 'tournaments/t1/results/0': res }));
await check('master deletes a result without a log entry', false, update(ref(mst), { 'tournaments/t1/results/0': null }));
await check('master deletes a result with a log entry', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/0': null })));
await check('master status with HTML', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '0-0', status: '"><img src=x onerror=alert(1)>' } })));
await check('master invalid score', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '<b>' } })));
await check('master unknown field', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/1': { score: '0-0', hack: 1 } })));
await check('master old text result', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/2': '3-1' })));

// --- score formats: sets only in padel and tennis; scorers and assists only in football ---
await check('padel score by sets', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/1': { score: '6-4 3-6 10-7', status: 'terminado' } }, 't2')));
await check('padel set being played', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/2': { score: '6-4 0-0', status: 'decorrer' } }, 't2')));
await check('padel single set', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/3': { score: '6-4', status: 'terminado' } }, 't2')));
await check('padel too many sets', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/4': { score: '6-4 6-4 6-4 6-4 6-4 6-4' } }, 't2')));
await check('padel with scorers', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/5': { score: '6-4 6-4', scorers: { home: ['a'] } } }, 't2')));
await check('padel with assists', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t2/results/6': { score: '6-4 6-4', assists: { home: ['a'] } } }, 't2')));
await check('tennis score by sets', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/0': { score: '6-4 6-7 7-5', status: 'terminado' } }, 'tt')));
await check('tennis with scorers', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/1': { score: '6-4', scorers: { home: ['a'] } } }, 'tt')));
await check('tennis with assists', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/tt/results/2': { score: '6-4', assists: { home: ['a'] } } }, 'tt')));
await check('football score by sets', false, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/3': { score: '6-4 3-6' } })));
await check('football with scorers', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/results/4': { score: '1-0', scorers: { home: ['a'] }, assists: { home: ['b'] } } })));
await check('master advances a winner (schedule/1/home)', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/schedule/1/home': 0 })));
await check('user deletes the schedule', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule': null })));
await check('user rewrites a match', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1': { home: 1, away: 2 } })));
await check('user changes a round', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/jornada': 'x' })));
await check('user changes config', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/config/nome': 'x' })));
await check('user changes meta', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/meta/name': 'x' })));
await check('user writes exportedAt alone', true, update(ref(u), { 'tournaments/t1/exportedAt': '2026-10-02T10:00:00Z', 'tournaments/t1/version': 9 }));
await check('master logRef pointing at an old entry', false, update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': 'antigo' }));
await check('master deletes logRef', false, update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': null }));
await check('master log entry in someone else\'s name', false, (() => {
  const key = push(ref(mst, 'tournament_log/t1')).key;
  return update(ref(mst), { 'tournaments/t1/results/1': { score: '0-0' }, [`tournament_log/t1/${key}`]: { uid: 'usr', nome: 'n', acao: 'x', quando: serverTimestamp() }, 'tournaments/t1/logRef': key });
})());
await check('user does NOT write single matches in the tournament', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/jogosSingulares': [{ resultado: '1-0' }] })));
await check('master moves single matches out of the tournament', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/jogosSingulares': null })));
await check('pending user writes a result', false, update(ref(p), withLog(p, 'pend', { 'tournaments/t1/results/1': { score: '0-0' } })));
await check('anonymous reads a tournament', true, get(ref(anon, 'tournaments/t1')));

// --- master operations ---
await check('master changes config with a log entry', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/config/nome': 'Novo' })));
await check('master changes config without a log entry', false, update(ref(mst), { 'tournaments/t1/config/nome': 'Novo2' }));
await check('master writes a whole new schedule', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/schedule': [{ home: 0, away: 1 }], 'tournaments/t1/results': null })));
await check('master changes meta.name', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'active', createdAt: 1000 },
})));
await check('master tries to change meta.sport (immutable)', false, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'T1', sport: 'basketball', status: 'active', createdAt: 1000 },
})));
await check('master creates a tournament of any sport', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t3_mst/meta': { name: 'Basquetebol Cup', sport: 'basketball', status: 'active', createdAt: 2000 },
  'tournaments/t3_mst/results': { 0: res },
  'tournaments/t3_mst/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_mst/teams': [{ name: 'A' }],
}, 't3_mst')));

// --- per-sport admin operations ---
await check('football admin changes football config', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t1/config/nome': 'Futebol Editado' })));
await check('football admin does NOT change padel config', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t2/config/nome': 'Padel Hack' }, 't2')));
await check('padel admin changes padel config', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t2/config/nome': 'Padel Editado' }, 't2')));
await check('padel admin does NOT change football config', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t1/config/nome': 'Futebol Hack' })));
await check('padel admin creates a padel tournament', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t3_padel/meta': { name: 'Open Padel', sport: 'padel', status: 'active', createdAt: 3000 },
  'tournaments/t3_padel/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_padel/teams': [{ name: 'A' }],
}, 't3_padel')));
await check('padel admin does NOT create a football tournament', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t4_foot/meta': { name: 'Futebol Não Autorizado', sport: 'football', status: 'active', createdAt: 4000 },
  'tournaments/t4_foot/schedule': [{ home: 0, away: 1 }],
  'tournaments/t4_foot/teams': [{ name: 'A' }],
}, 't4_foot')));

// --- users management (only master manages roles) ---
await check('master changes a user role', true, update(ref(mst), { 'users/pend/role': 'user' }));
await check('master makes a sport admin', true, update(ref(mst), { 'users/pend/role': 'admin', 'users/pend/admin/padel': true }));
await check('football admin does NOT change a user role', false, update(ref(adm_foot), { 'users/pend/role': 'admin' }));
await check('padel admin does NOT change a user role', false, update(ref(adm_padel), { 'users/pend/role': 'admin' }));
await check('user does NOT change a user role', false, update(ref(u), { 'users/pend/role': 'admin' }));
await check('master reads the user list', true, get(ref(mst, 'users')));
await check('football admin does NOT read the user list', false, get(ref(adm_foot, 'users')));
await check('user does NOT read the user list', false, get(ref(u, 'users')));

// --- history (arquivo) and finishing a tournament ---
await check('anonymous reads history', true, get(ref(anon, 'arquivo')));
await check('master writes history', true, update(ref(mst), { 'arquivo/a2': { id: 'a2', nome: 'Final 2025', sport: 'football' } }));
await check('football admin writes football history', true, update(ref(adm_foot), { 'arquivo/a_foot': { id: 'a_foot', nome: 'Futebol 2025', sport: 'football' } }));
await check('football admin does NOT write padel history', false, update(ref(adm_foot), { 'arquivo/a_padel_bad': { id: 'a_padel_bad', nome: 'Padel 2025', sport: 'padel' } }));
await check('user does not write history', false, update(ref(u), { 'arquivo/a3': { id: 'a3', nome: 'Hack' } }));
await check('padel admin does NOT turn a football entry into padel', false, update(ref(adm_padel), { 'arquivo/a1': { id: 'a1', nome: 'Roubado', sport: 'padel' } }));
await check('padel admin does NOT delete a football entry', false, update(ref(adm_padel), { 'arquivo/a1': null }));
await check('padel admin does NOT delete an entry with no sport (football)', false, update(ref(adm_padel), { 'arquivo/a_old': null }));
await check('football admin changes an entry with no sport', true, update(ref(adm_foot), { 'arquivo/a_old': { id: 'a_old', nome: 'Antigo 2', sport: 'football' } }));
await check('padel admin does NOT rewrite the whole history', false, update(ref(adm_padel), { arquivo: { a9: { id: 'a9', nome: 'x', sport: 'padel' } } }));
await check('football admin deletes a football entry', true, update(ref(adm_foot), { 'arquivo/a2': null }));
await check('football admin finishes a football tournament with a log entry', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t1/meta': { name: 'T1 Finalizado', sport: 'football', status: 'finished', createdAt: 1000 },
  'arquivo/entry_t1': { id: 'entry_t1', nome: 'T1 Finalizado', sport: 'football' },
})));
await check('football admin does NOT finish a padel tournament', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t2/meta': { name: 'T2 Finalizado', sport: 'padel', status: 'finished', createdAt: 1500 },
  'arquivo/entry_t2': { id: 'entry_t2', nome: 'T2 Finalizado', sport: 'padel' },
}, 't2')));
await check('user does not finish a tournament', false, update(ref(u), withLog(u, 'usr', {
  'tournaments/t2/meta': { name: 'T2 Hack', sport: 'padel', status: 'finished', createdAt: 1500 },
}, 't2')));

// --- players (global) ---
await check('anonymous reads players', true, get(ref(anon, 'players')));
await check('master writes players', true, update(ref(mst), { 'players/p1': { id: 'p1', nome: 'Jogador 1', ratings: { football: { velocidade: 5 } } } }));
await check('football admin writes players', true, update(ref(adm_foot), { 'players/p2': { id: 'p2', nome: 'Jogador 2', ratings: { football: { velocidade: 4 } } } }));
await check('user does not write players', false, update(ref(u), { 'players/p3': { id: 'p3', nome: 'Hacker' } }));
await check('padel admin creates a player', true, update(ref(adm_padel), { 'players/p4': { id: 'p4', nome: 'Novo', ratings: { padel: { smash: 2 } } } }));
await check('padel admin does NOT create a player with football ratings', false, update(ref(adm_padel), { 'players/p6': { id: 'p6', nome: 'x', ratings: { football: { velocidade: 5 } } } }));
await check('padel admin does NOT create a player with atributos (football)', false, update(ref(adm_padel), { 'players/p7': { id: 'p7', nome: 'x', atributos: { velocidade: 5 } } }));
await check('football admin creates a player with football ratings', true, update(ref(adm_foot), { 'players/p8': { id: 'p8', nome: 'x', ratings: { football: { velocidade: 5 } }, atributos: { velocidade: 5 } } }));
await check('padel admin renames a player', true, update(ref(adm_padel), { 'players/px/nome': 'Renomeado' }));
await check('padel admin changes a padel rating', true, update(ref(adm_padel), { 'players/px/ratings/padel': { smash: 4 } }));
await check('padel admin does NOT change a football rating', false, update(ref(adm_padel), { 'players/px/ratings/football': { velocidade: 1 } }));
await check('padel admin does NOT change atributos (football)', false, update(ref(adm_padel), { 'players/px/atributos': { velocidade: 1 } }));
await check('football admin changes a football rating', true, update(ref(adm_foot), { 'players/px/ratings/football': { velocidade: 6 }, 'players/px/atributos': { velocidade: 6 } }));
await check('padel admin does NOT delete a player', false, update(ref(adm_padel), { 'players/px': null }));
await check('padel admin does NOT rewrite an existing player', false, update(ref(adm_padel), { 'players/px': { id: 'px', nome: 'x' } }));
await check('padel admin does NOT rewrite the whole list', false, update(ref(adm_padel), { players: { px: { id: 'px', nome: 'x' } } }));
await check('admin does NOT create a player whose id differs from its key', false, update(ref(adm_foot), { 'players/p5': { id: 'outro', nome: 'x' } }));
await check('master deletes a player', true, update(ref(mst), { 'players/p4': null }));

// --- single matches (global, football admins only) ---
await check('anonymous does NOT read single matches', false, get(ref(anon, 'singleMatches')));
await check('user does NOT read single matches', false, get(ref(u, 'singleMatches')));
await check('padel admin does NOT read single matches', false, get(ref(adm_padel, 'singleMatches')));
await check('football admin reads single matches', true, get(ref(adm_foot, 'singleMatches')));
await check('football admin writes a single match', true, update(ref(adm_foot), { 'singleMatches/s2': { id: 's2', data: '2026-02-01', resultado: '2-2' } }));
await check('user does NOT write a single match', false, update(ref(u), { 'singleMatches/s3': { id: 's3', resultado: '9-0' } }));
await check('padel admin does NOT delete a single match', false, update(ref(adm_padel), { 'singleMatches/s1': null }));
await check('master deletes a single match', true, update(ref(mst), { 'singleMatches/s1': null }));

console.log(`\n${ok} ok, ${bad} failed`);
await env.cleanup();
process.exit(bad ? 1 : 0);

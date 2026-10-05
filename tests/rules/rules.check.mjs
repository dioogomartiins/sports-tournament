// Verifica database.rules.json no emulador do Firebase (precisa de Java).
// Correr com: npm run test:rules
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
await check('anónimo lê torneio_state', true, get(ref(anon, 'torneio_state')));
await check('master não escreve em torneio_state', false, update(ref(mst), { 'torneio_state/config/nome': 'Hacked' }));
await check('user não escreve em torneio_state', false, update(ref(u), { 'torneio_state/results/0': res }));

// --- tournaments / tournament_log ---
await check('user grava resultado com registo', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': res })));
await check('user grava resultado sem registo', false, update(ref(u), { 'tournaments/t1/results/0': res }));
await check('user apaga resultado sem registo', false, update(ref(u), { 'tournaments/t1/results/0': null }));
await check('user apaga resultado com registo', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/0': null })));
await check('user estado com HTML', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/1': { score: '0-0', status: '"><img src=x onerror=alert(1)>' } })));
await check('user score inválido', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/1': { score: '<b>' } })));
await check('user campo desconhecido', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/1': { score: '0-0', hack: 1 } })));
await check('user resultado antigo em texto', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/2': '3-1' })));

// --- score formats: sets only in padel and tennis; scorers and assists only in football ---
await check('padel score by sets', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/1': { score: '6-4 3-6 10-7', status: 'terminado' } }, 't2')));
await check('padel set being played', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/2': { score: '6-4 0-0', status: 'decorrer' } }, 't2')));
await check('padel single set', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/3': { score: '6-4', status: 'terminado' } }, 't2')));
await check('padel too many sets', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/4': { score: '6-4 6-4 6-4 6-4 6-4 6-4' } }, 't2')));
await check('padel with scorers', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/5': { score: '6-4 6-4', scorers: { home: ['a'] } } }, 't2')));
await check('padel with assists', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t2/results/6': { score: '6-4 6-4', assists: { home: ['a'] } } }, 't2')));
await check('tennis score by sets', true, update(ref(u), withLog(u, 'usr', { 'tournaments/tt/results/0': { score: '6-4 6-7 7-5', status: 'terminado' } }, 'tt')));
await check('tennis with scorers', false, update(ref(u), withLog(u, 'usr', { 'tournaments/tt/results/1': { score: '6-4', scorers: { home: ['a'] } } }, 'tt')));
await check('tennis with assists', false, update(ref(u), withLog(u, 'usr', { 'tournaments/tt/results/2': { score: '6-4', assists: { home: ['a'] } } }, 'tt')));
await check('football score by sets', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/3': { score: '6-4 3-6' } })));
await check('football with scorers', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/results/4': { score: '1-0', scorers: { home: ['a'] }, assists: { home: ['b'] } } })));
await check('user passa vencedor (schedule/1/home)', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/home': 0 })));
await check('user apaga calendário', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule': null })));
await check('user reescreve jogo', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1': { home: 1, away: 2 } })));
await check('user muda jornada', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/schedule/1/jornada': 'x' })));
await check('user muda config', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/config/nome': 'x' })));
await check('user muda meta', false, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/meta/name': 'x' })));
await check('user grava exportedAt sozinho', true, update(ref(u), { 'tournaments/t1/exportedAt': '2026-10-02T10:00:00Z', 'tournaments/t1/version': 9 }));
await check('user logRef para entrada antiga', false, update(ref(u), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': 'antigo' }));
await check('user apaga logRef', false, update(ref(u), { 'tournaments/t1/results/1': { score: '0-0' }, 'tournaments/t1/logRef': null }));
await check('user registo em nome de outro', false, (() => {
  const key = push(ref(u, 'tournament_log/t1')).key;
  return update(ref(u), { 'tournaments/t1/results/1': { score: '0-0' }, [`tournament_log/t1/${key}`]: { uid: 'mst', nome: 'n', acao: 'x', quando: serverTimestamp() }, 'tournaments/t1/logRef': key });
})());
await check('user jogos singulares com registo', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/jogosSingulares': [{ resultado: '1-0' }] })));
await check('pendente grava resultado', false, update(ref(p), withLog(p, 'pend', { 'tournaments/t1/results/1': { score: '0-0' } })));
await check('anónimo lê torneio', true, get(ref(anon, 'tournaments/t1')));

// --- master operations ---
await check('master muda config com registo', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/config/nome': 'Novo' })));
await check('master muda config sem registo', false, update(ref(mst), { 'tournaments/t1/config/nome': 'Novo2' }));
await check('master novo calendário inteiro', true, update(ref(mst), withLog(mst, 'mst', { 'tournaments/t1/schedule': [{ home: 0, away: 1 }], 'tournaments/t1/results': null })));
await check('master altera meta.name', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'active', createdAt: 1000 },
})));
await check('master tenta alterar meta.sport (imutável)', false, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t1/meta': { name: 'T1', sport: 'basketball', status: 'active', createdAt: 1000 },
})));
await check('master envia novo torneio de qualquer modalidade', true, update(ref(mst), withLog(mst, 'mst', {
  'tournaments/t3_mst/meta': { name: 'Basquetebol Cup', sport: 'basketball', status: 'active', createdAt: 2000 },
  'tournaments/t3_mst/results': { 0: res },
  'tournaments/t3_mst/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_mst/teams': [{ name: 'A' }],
}, 't3_mst')));

// --- per-sport admin operations ---
await check('admin futebol muda config de futebol', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t1/config/nome': 'Futebol Editado' })));
await check('admin futebol NÃO muda config de padel', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', { 'tournaments/t2/config/nome': 'Padel Hack' }, 't2')));
await check('admin padel muda config de padel', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t2/config/nome': 'Padel Editado' }, 't2')));
await check('admin padel NÃO muda config de futebol', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', { 'tournaments/t1/config/nome': 'Futebol Hack' })));
await check('admin padel cria novo torneio de padel', true, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t3_padel/meta': { name: 'Open Padel', sport: 'padel', status: 'active', createdAt: 3000 },
  'tournaments/t3_padel/schedule': [{ home: 0, away: 1 }],
  'tournaments/t3_padel/teams': [{ name: 'A' }],
}, 't3_padel')));
await check('admin padel NÃO cria torneio de futebol', false, update(ref(adm_padel), withLog(adm_padel, 'adm_padel', {
  'tournaments/t4_foot/meta': { name: 'Futebol Não Autorizado', sport: 'football', status: 'active', createdAt: 4000 },
  'tournaments/t4_foot/schedule': [{ home: 0, away: 1 }],
  'tournaments/t4_foot/teams': [{ name: 'A' }],
}, 't4_foot')));

// --- users management (only master manages roles) ---
await check('master altera role de utilizador', true, update(ref(mst), { 'users/pend/role': 'user' }));
await check('master define admin de modalidade', true, update(ref(mst), { 'users/pend/role': 'admin', 'users/pend/admin/padel': true }));
await check('admin futebol NÃO altera role de utilizador', false, update(ref(adm_foot), { 'users/pend/role': 'admin' }));
await check('admin padel NÃO altera role de utilizador', false, update(ref(adm_padel), { 'users/pend/role': 'admin' }));
await check('user NÃO altera role de utilizador', false, update(ref(u), { 'users/pend/role': 'admin' }));
await check('master lê lista de utilizadores', true, get(ref(mst, 'users')));
await check('admin futebol NÃO lê lista de utilizadores', false, get(ref(adm_foot, 'users')));
await check('user NÃO lê lista de utilizadores', false, get(ref(u, 'users')));

// --- arquivo e terminar torneio ---
await check('anónimo lê arquivo', true, get(ref(anon, 'arquivo')));
await check('master grava arquivo', true, update(ref(mst), { 'arquivo/a2': { id: 'a2', nome: 'Final 2025', sport: 'football' } }));
await check('admin futebol grava arquivo de futebol', true, update(ref(adm_foot), { 'arquivo/a_foot': { id: 'a_foot', nome: 'Futebol 2025', sport: 'football' } }));
await check('admin futebol NÃO grava arquivo de padel', false, update(ref(adm_foot), { 'arquivo/a_padel_bad': { id: 'a_padel_bad', nome: 'Padel 2025', sport: 'padel' } }));
await check('user não grava arquivo', false, update(ref(u), { 'arquivo/a3': { id: 'a3', nome: 'Hack' } }));
await check('admin futebol termina torneio de futebol com registo', true, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t1/meta': { name: 'T1 Finalizado', sport: 'football', status: 'finished', createdAt: 1000 },
  'arquivo/entry_t1': { id: 'entry_t1', nome: 'T1 Finalizado', sport: 'football' },
})));
await check('admin futebol NÃO termina torneio de padel', false, update(ref(adm_foot), withLog(adm_foot, 'adm_foot', {
  'tournaments/t2/meta': { name: 'T2 Finalizado', sport: 'padel', status: 'finished', createdAt: 1500 },
  'arquivo/entry_t2': { id: 'entry_t2', nome: 'T2 Finalizado', sport: 'padel' },
}, 't2')));
await check('user não termina torneio', false, update(ref(u), withLog(u, 'usr', {
  'tournaments/t2/meta': { name: 'T2 Hack', sport: 'padel', status: 'finished', createdAt: 1500 },
}, 't2')));

// --- players (global) ---
await check('anónimo lê players', true, get(ref(anon, 'players')));
await check('master grava players', true, update(ref(mst), { 'players/p1': { id: 'p1', nome: 'Jogador 1', ratings: { football: { velocidade: 5 } } } }));
await check('admin futebol grava players', true, update(ref(adm_foot), { 'players/p2': { id: 'p2', nome: 'Jogador 2', ratings: { football: { velocidade: 4 } } } }));
await check('user não grava players', false, update(ref(u), { 'players/p3': { id: 'p3', nome: 'Hacker' } }));

console.log(`\n${ok} ok, ${bad} falharam`);
await env.cleanup();
process.exit(bad ? 1 : 0);

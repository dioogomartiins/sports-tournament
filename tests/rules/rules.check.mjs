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
    utilizadores: { adm: { role: 'admin' }, usr: { role: 'user' }, pend: { nome: 'x' } },
    torneio_state: {
      config: { nome: 'T' },
      schedule: [{ home: 0, away: 1, jornada: 1 }],
    },
    tournaments: {
      t1: {
        meta: { name: 'T1', sport: 'football', status: 'active', createdAt: 1000 },
        config: { nome: 'T' },
        schedule: [{ home: 0, away: 1, jornada: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true, jornada: 'Final' }],
        results: { 0: { score: '1-0', status: 'terminado', scorers: { home: ['a'] } } },
        logRef: 'antigo',
      },
    },
    tournament_log: {
      t1: { antigo: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
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

const u = db('usr'), a = db('adm'), p = db('pend'), anon = env.unauthenticatedContext().database();
const res = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['', 'c'] }, mvp: 'a' };

// --- torneio_state (read-only) ---
await check('anónimo lê torneio_state', true, get(ref(anon, 'torneio_state')));
await check('admin não escreve em torneio_state', false, update(ref(a), { 'torneio_state/config/nome': 'Hacked' }));
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
  return update(ref(u), { 'tournaments/t1/results/1': { score: '0-0' }, [`tournament_log/t1/${key}`]: { uid: 'adm', nome: 'n', acao: 'x', quando: serverTimestamp() }, 'tournaments/t1/logRef': key });
})());
await check('user jogos singulares com registo', true, update(ref(u), withLog(u, 'usr', { 'tournaments/t1/jogosSingulares': [{ resultado: '1-0' }] })));
await check('pendente grava resultado', false, update(ref(p), withLog(p, 'pend', { 'tournaments/t1/results/1': { score: '0-0' } })));
await check('anónimo lê torneio', true, get(ref(anon, 'tournaments/t1')));

// --- admin operations ---
await check('admin muda config com registo', true, update(ref(a), withLog(a, 'adm', { 'tournaments/t1/config/nome': 'Novo' })));
await check('admin muda config sem registo', false, update(ref(a), { 'tournaments/t1/config/nome': 'Novo2' }));
await check('admin novo calendário inteiro', true, update(ref(a), withLog(a, 'adm', { 'tournaments/t1/schedule': [{ home: 0, away: 1 }], 'tournaments/t1/results': null })));
await check('admin envia novo torneio', true, update(ref(a), withLog(a, 'adm', {
  'tournaments/t2/meta': { name: 'Padel Cup', sport: 'padel', status: 'active', createdAt: 2000 },
  'tournaments/t2/results': { 0: res },
  'tournaments/t2/schedule': [{ home: 0, away: 1 }],
  'tournaments/t2/teams': [{ name: 'A' }],
}, 't2')));
await check('admin altera meta.name', true, update(ref(a), withLog(a, 'adm', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'active', createdAt: 1000 },
})));
await check('admin tenta alterar meta.sport (imutável)', false, update(ref(a), withLog(a, 'adm', {
  'tournaments/t1/meta': { name: 'T1', sport: 'basketball', status: 'active', createdAt: 1000 },
})));
await check('admin muda perfil', true, update(ref(a), { 'utilizadores/pend/role': 'user' }));

// --- arquivo e terminar torneio ---
await check('anónimo lê arquivo', true, get(ref(anon, 'arquivo')));
await check('admin grava arquivo', true, update(ref(a), { 'arquivo/a2': { id: 'a2', nome: 'Final 2025', sport: 'football' } }));
await check('user não grava arquivo', false, update(ref(u), { 'arquivo/a3': { id: 'a3', nome: 'Hack' } }));
await check('admin termina torneio e grava arquivo com registo', true, update(ref(a), withLog(a, 'adm', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'finished', createdAt: 1000 },
  'arquivo/entry_t1': { id: 'entry_t1', nome: 'T1 Finalizado', sport: 'football' },
})));
await check('user não termina torneio', false, update(ref(u), withLog(u, 'usr', {
  'tournaments/t1/meta': { name: 'Novo Nome', sport: 'football', status: 'finished', createdAt: 1000 },
})));

console.log(`\n${ok} ok, ${bad} falharam`);
await env.cleanup();
process.exit(bad ? 1 : 0);

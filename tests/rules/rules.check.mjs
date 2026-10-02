// Verifica database.rules.json no emulador do Firebase (precisa de Java).
// Correr com: npm run test:rules
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, update, set, push, serverTimestamp } from 'firebase/database';
import fs from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'demo-torneio',
  database: { host: '127.0.0.1', port: 9000, rules: fs.readFileSync(new URL('../../database.rules.json', import.meta.url), 'utf8') },
});
await env.withSecurityRulesDisabled(async (ctx) => {
  await set(ref(ctx.database()), {
    utilizadores: { adm: { role: 'admin' }, usr: { role: 'user' }, pend: { nome: 'x' } },
    torneio_state: {
      config: { nome: 'T' },
      schedule: [{ home: 0, away: 1, jornada: 1 }, { home: 'Vencedor M1', away: 2, isPlayoff: true, jornada: 'Final' }],
      results: { 0: { score: '1-0', status: 'terminado', scorers: { home: ['a'] } } },
      logRef: 'antigo',
    },
    torneio_log: { antigo: { uid: 'usr', nome: 'u', acao: 'x', quando: 1 } },
  });
});

function db(uid) { return env.authenticatedContext(uid).database(); }
function withLog(d, uid, upd) {
  const key = push(ref(d, 'torneio_log')).key;
  return { ...upd, [`torneio_log/${key}`]: { uid, nome: 'n', acao: 'teste', quando: serverTimestamp() }, 'torneio_state/logRef': key };
}
let ok = 0, bad = 0;
async function check(name, expect, p) {
  try { await (expect ? assertSucceeds(p) : assertFails(p)); ok++; console.log('ok  ', name); }
  catch (e) { bad++; console.log('FAIL', name, e.message); }
}
const u = db('usr'), a = db('adm'), p = db('pend');
const res = { score: '2-0', status: 'terminado', scorers: { home: ['a', 'b'], away: [] }, assists: { home: ['', 'c'] }, mvp: 'a' };

await check('user grava resultado com registo', true, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/0': res })));
await check('user grava resultado sem registo', false, update(ref(u), { 'torneio_state/results/0': res }));
await check('user apaga resultado sem registo', false, update(ref(u), { 'torneio_state/results/0': null }));
await check('user apaga resultado com registo', true, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/0': null })));
await check('user estado com HTML', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/1': { score: '0-0', status: '"><img src=x onerror=alert(1)>' } })));
await check('user score inválido', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/1': { score: '<b>' } })));
await check('user campo desconhecido', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/1': { score: '0-0', hack: 1 } })));
await check('user resultado antigo em texto', true, update(ref(u), withLog(u, 'usr', { 'torneio_state/results/2': '3-1' })));
await check('user passa vencedor (schedule/1/home)', true, update(ref(u), withLog(u, 'usr', { 'torneio_state/schedule/1/home': 0 })));
await check('user apaga calendário', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/schedule': null })));
await check('user reescreve jogo', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/schedule/1': { home: 1, away: 2 } })));
await check('user muda jornada', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/schedule/1/jornada': 'x' })));
await check('user muda config', false, update(ref(u), withLog(u, 'usr', { 'torneio_state/config/nome': 'x' })));
await check('user grava exportedAt sozinho', true, update(ref(u), { 'torneio_state/exportedAt': '2026-10-02T10:00:00Z', 'torneio_state/version': 7 }));
await check('user logRef para entrada antiga', false, update(ref(u), { 'torneio_state/results/1': { score: '0-0' }, 'torneio_state/logRef': 'antigo' }));
await check('user apaga logRef', false, update(ref(u), { 'torneio_state/results/1': { score: '0-0' }, 'torneio_state/logRef': null }));
await check('user registo em nome de outro', false, (() => {
  const key = push(ref(u, 'torneio_log')).key;
  return update(ref(u), { 'torneio_state/results/1': { score: '0-0' }, [`torneio_log/${key}`]: { uid: 'adm', nome: 'n', acao: 'x', quando: serverTimestamp() }, 'torneio_state/logRef': key });
})());
await check('user jogos singulares com registo', true, update(ref(u), withLog(u, 'usr', { 'torneio_state/jogosSingulares': [{ resultado: '1-0' }] })));
await check('pendente grava resultado', false, update(ref(p), withLog(p, 'pend', { 'torneio_state/results/1': { score: '0-0' } })));
await check('anónimo lê estado', true, (async () => { const { get } = await import('firebase/database'); return get(ref(env.unauthenticatedContext().database(), 'torneio_state')); })());
await check('admin muda config com registo', true, update(ref(a), withLog(a, 'adm', { 'torneio_state/config/nome': 'Novo' })));
await check('admin muda config sem registo', false, update(ref(a), { 'torneio_state/config/nome': 'Novo2' }));
await check('admin novo calendário inteiro', true, update(ref(a), withLog(a, 'adm', { 'torneio_state/schedule': [{ home: 0, away: 1 }], 'torneio_state/results': null })));
await check('admin envia tudo (base vazia)', true, update(ref(a), withLog(a, 'adm', { 'torneio_state/results': { 0: res }, 'torneio_state/schedule': [{ home: 0, away: 1 }], 'torneio_state/teams': [{ name: 'A' }] })));
await check('admin muda perfil', true, update(ref(a), { 'utilizadores/pend/role': 'user' }));

console.log(`\n${ok} ok, ${bad} falharam`);
await env.cleanup();
process.exit(bad ? 1 : 0);

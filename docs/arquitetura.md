# Arquitetura

[← Voltar ao README](../README.md)

Como o código está organizado, como os dados são guardados e sincronizados, e como se protege quem pode escrever o quê. Para convenções de código e regras de contribuição, ver também o [`CLAUDE.md`](../CLAUDE.md).

- [Visão geral](#visão-geral)
- [Módulos](#módulos)
- [Modelo de dados](#modelo-de-dados)
- [Sincronização](#sincronização)
- [Permissões](#permissões)
- [Registo de alterações](#registo-de-alterações)
- [Alterar a forma do estado](#alterar-a-forma-do-estado)
- [Segurança do HTML](#segurança-do-html)
- [Testes](#testes)

## Visão geral

É uma single page app em JavaScript (ES Modules) sem framework, construída com Vite e servida estaticamente pelo GitHub Pages. Não há servidor próprio: o Firebase Realtime Database guarda o estado e envia as alterações a todos os dispositivos ligados, e o Firebase Authentication trata das contas Google.

```
 browser (cada telemóvel)                     Firebase
┌──────────────────────────────┐            ┌───────────────────────────┐
│ main.js  eventos ──► state.js │── update ─►│ torneio_state  (estado)   │
│              ▲         │      │            │ torneio_log    (registo)  │
│ ui.js ◄──────┘   localStorage │◄─ onValue ─│ utilizadores   (perfis)   │
└──────────────────────────────┘            └───────────────────────────┘
                                               database.rules.json protege
```

## Módulos

| Ficheiro | Papel |
|---|---|
| `index.html` | Estrutura de todos os separadores e modais. |
| `css/` | Estilos partidos por área (`base.css` tem as variáveis dos temas claro e escuro). `style.css` só faz `@import` dos outros, pela ordem da cascata; o Vite junta tudo num ficheiro no build. Estilos novos vão para o ficheiro da área. |
| `src/main.js` | Liga os eventos da interface às ações (gerar calendário, registar golos, arquivar, …) e arranca a app. Os botões e campos das equipas, calendário e resultados, redesenhados com `innerHTML`, têm um só listener no contentor (delegação). |
| `src/state.ts` | Estado global, valores por defeito, snapshots (`buildSnapshot` / `applySnapshot`), persistência no localStorage e envio para o Firebase. Desfaz alterações locais que o Firebase não aceitaria. Não importa o `ui.js`: os avisos e o `renderAll` chegam por `setStateHooks`, chamado pelo `main.js` no arranque. |
| `src/core/` | Lógica central do torneio em TypeScript: Berger, calendário, volta extra, eliminatórias (`schedule.ts`), ratings e draft (`draft.ts`), arquivo (`archive.ts`). |
| `src/sports/` | Arquitetura multi-desporto: classe abstrata `Sport.ts`, registo de modalidades (`registry.ts`), e perfil de futebol (`football/Football.ts`) com classificação, desempates, eliminatórias, estatísticas e golos. |
| `src/algorithms.ts` | Re-exporta funções do core e de futebol para compatibilidade com os módulos existentes. |
| `src/sync.ts` | Diferenças entre snapshots para o `update()`, normalização de dados guardados pelo Firebase e texto do registo de alterações. |
| `src/firebase.js` | Ligação ao Firebase: escuta `torneio_state`, envia alterações, login Google, perfil do utilizador, lista de utilizadores e registo. |
| `src/permissions.ts` | Que secções cada perfil pode gravar. Espelha `database.rules.json`. |
| `src/types.ts` | Tipos TypeScript de domínio (`Tournament`, `Config`, `Match`, `Score`, `Player`, `Team`, etc.). |
| `src/ui.js` e `src/ui/` | Desenham todos os ecrãs e modais. Cada secção tem o seu módulo em `src/ui/` (`classificacao.js`, `calendario.js`, `jogo.js`, `jogadores.js`, `historico.js`, `modais.js`, …); `dom.js` guarda os elementos e `avisos.js` os toasts. `ui.js` tem o `renderAll`/`refreshComputed` e reexporta o resto, por isso os outros módulos importam tudo de `./ui.js`. Os módulos de `src/ui/` nunca importam `ui.js`. |
| `src/animations.js` | Animações ao vivo (jogo começa, golo, golo anulado, jogo termina). Nascem da comparação entre o resultado anterior e o novo, por isso aparecem em todos os dispositivos. Desligadas com *movimento reduzido*. |
| `src/share.js` | Desenha num `<canvas>` as imagens PNG da classificação e dos resultados, e partilha-as. |
| `src/utils.ts` | Funções pequenas: `escapeHtml`, `safeColor`, nomes de equipas e de jogadores (`playerName`, `buildPlayerIndex`), datas, `prefersReducedMotion`. |
| `database.rules.json` | Regras de segurança do Realtime Database, publicadas pelo deploy. |
| `firebase.json` | Diz ao Firebase CLI onde estão as regras (usado pelo deploy). |
| `tests/` | Testes Vitest; `tests/rules/` tem os testes das regras no emulador. |

## Modelo de dados

Todo o estado do torneio vive num só nó, `torneio_state`, com estas secções:

| Secção | Conteúdo |
|---|---|
| `config` | Nome, desporto ('football'), número de equipas, grupos, voltas, pontuação, eliminatórias. |
| `teams` | 32 posições `{ name, color, group }` (as não usadas ficam com nome vazio). |
| `squads` | 32 listas de jogadores por equipa `{ id, num, name }`. |
| `schedule` | Lista de jogos `{ jornada, home, away, group }`; os de eliminatória têm `isPlayoff`, `playoffMatchId` e `nextMatchId`. |
| `roundsMeta` | Uma entrada por jornada, com a equipa que folga. |
| `scheduleTeamCount`, `scheduleVoltas` | Equipas e voltas com que o calendário foi gerado. |
| `results` | Por índice do jogo em `schedule`: `{ score: "2-1", status, scorers: { home, away }, assists: { home, away }, mvp, penalties }`. |
| `players` | Base de dados de jogadores `{ id, nome, atributos }`. |
| `jogosSingulares` | Jogos singulares com as duas equipas, resultado, marcadores, assistências e MVP. |
| `arquivo` | Torneios arquivados: nome, data, campeão, tabelas finais e estatísticas por jogador. |
| `version`, `exportedAt` | Versão do formato (`SNAPSHOT_VERSION`, atualmente 8) e data da última gravação. |
| `logRef` | Chave da entrada de `torneio_log` da última gravação (ver [Registo de alterações](#registo-de-alterações)). |

Notas:

- `results` está indexado pela **posição** do jogo em `schedule`. Por isso a volta extra e as eliminatórias acrescentam jogos no fim e nunca reordenam os existentes.
- Em `scorers`, `'auto'` é um autogolo. `assists` está alinhada com `scorers` (mesma posição = mesmo golo; `''` = sem assistência).
- Os nomes dos jogadores no `arquivo` são copiados no momento de arquivar, para o histórico sobreviver a jogadores apagados.

Fora de `torneio_state` há `utilizadores/<uid>` (nome, email, foto, último acesso e `role`) e `torneio_log` (registo de alterações).

Cada dispositivo guarda também uma cópia no localStorage, para mostrar o torneio logo ao abrir, antes de o Firebase responder.

## Sincronização

![Sincronização jogo a jogo](assets/illustrations/12-sincronizacao-jogo-a-jogo.jpg)

1. Ao abrir, `firebase.js` escuta `torneio_state` com `onValue`. Cada vez que chega um valor, `applySnapshot` substitui o estado local e esse snapshot passa a ser o "último sincronizado".
2. Cada ação grava a sua secção no localStorage e chama `pushStateToFirebase` com o snapshot completo.
3. `diffSnapshot` compara com o último sincronizado e produz um `update()` só com o que mudou:
   - `results` vai **jogo a jogo** (`results/<índice>`), para que duas pessoas a registar jogos diferentes ao mesmo tempo não se apaguem uma à outra;
   - as outras secções vão inteiras; se duas pessoas mudarem a mesma secção ao mesmo tempo, fica a última.
4. O mesmo `update()` acrescenta a entrada no `torneio_log`, por isso a alteração e o registo gravam-se juntos (ou nenhum).

O Firebase apaga listas vazias e transforma arrays em objetos com chaves numéricas. `normalizeResults` e `normalizeArquivo` repõem a forma esperada ao carregar.

## Permissões

![As regras do Firebase são a proteção](assets/illustrations/13-regras-sao-a-protecao.jpg)

As regras do Firebase são a proteção real; o cliente só esconde botões e avisa antes de enviar.

| Caminho | Ler | Escrever |
|---|---|---|
| `torneio_state` | Todos | `results/<jogo>`, `schedule/<jogo>/home` e `away`, `jogosSingulares`, `exportedAt`, `version`: Utilizador e Admin. Restantes secções, e `results` ou `schedule` inteiros: só Admin. |
| `utilizadores` | Admin (todos); cada um o seu | Cada um o seu nome, email, foto e último acesso; `role` só Admin. |
| `torneio_log` | Admin | Utilizador e Admin, só entradas novas, com o próprio `uid` e a hora do servidor. |

Os utilizadores só podem gravar `home` e `away` de cada jogo do calendário porque terminar um jogo de eliminatória escreve o vencedor no jogo seguinte do bracket. O resto do calendário é só de admins.

Além de quem pode escrever, as regras validam o que se escreve: resultados no formato `"2-1"`, estados conhecidos (`agendado`, `decorrer`, `terminado`), listas de marcadores e assistências por lado, e textos com tamanho limitado. Qualquer gravação em `torneio_state` tem também de trazer um `logRef` novo (ver [Registo de alterações](#registo-de-alterações)).

Na app, quem não é admin vê Equipas, Plantéis e Jogadores só de leitura, com uma nota a explicar.

**Mudar permissões:** alterar `database.rules.json` e `src/permissions.ts` (`USER_SECTIONS`) juntos, atualizar `tests/permissions.test.js` e `tests/rules/rules.check.mjs`, e correr `npm run test:rules`. As regras são publicadas sozinhas no deploy depois do merge (ver [Publicação](configuracao.md#publicação-deploy)).

Se o Firebase recusar uma gravação que o cliente deixou passar, o valor do servidor volta sozinho e a app avisa: "A alteração foi recusada pela base de dados (sem permissão). Foi desfeita."

Quando o cliente percebe antes de enviar que a alteração não é permitida (sem sessão, sem perfil, ou secção só de admin), não envia nada: `state.ts` volta ao último snapshot sincronizado e mostra o motivo.

## Registo de alterações

![Registo de alterações](assets/illustrations/14-registo-de-alteracoes.jpg)

`describeUpdates` (em `sync.ts`) transforma cada `update()` numa frase legível (por exemplo, "Equipas alteradas", ou o jogo cujo resultado mudou). A entrada `{ uid, nome, acao, quando }` vai para `torneio_log`. Os admins veem as últimas 200 em Gestão → 👮 Utilizadores.

O registo é obrigatório, não só uma convenção do cliente: o mesmo `update()` grava `torneio_state/logRef` com a chave da entrada nova, e as regras só aceitam a gravação se essa entrada for nova, for do próprio utilizador e o `logRef` mudar. Uma gravação sem registo é recusada.

## Alterar a forma do estado

Qualquer mudança na forma do estado (campo novo, secção nova, formato diferente) tem de:

1. Subir `SNAPSHOT_VERSION` em `src/state.ts`.
2. Continuar a carregar dados guardados com versões anteriores, que já estão no Firebase e nos telemóveis (valores por defeito em `applySnapshot`, normalização em `sync.ts`).
3. Se for uma secção nova em `torneio_state`, decidir quem a pode escrever (ver [Permissões](#permissões)). Por defeito fica só para admins.

## Segurança do HTML

Qualquer pessoa com a configuração pública pode tentar escrever no Firebase, por isso tudo o que vem do estado é tratado como não confiável:

- Todo o valor do estado que entra numa string HTML passa por `escapeHtml`.
- As cores das equipas passam por `safeColor`.

## Testes

```bash
npm run lint         # ESLint (eslint.config.mjs)
npm run typecheck    # Verificação de tipos TypeScript (tsc --noEmit)
npm test             # lógica pura
npm run test:rules   # regras do Firebase no emulador (precisa de Java)
```

`npm test` cobre só a lógica pura, sem browser nem Firebase:

| Ficheiro | Cobre |
|---|---|
| `tests/football.test.ts` | Lógica de futebol: classificação, confronto direto, vencedor de playoff, estatísticas de jogadores, golos |
| `tests/core/` | Lógica central: `schedule.test.ts` (Berger, voltas, seeding), `draft.test.ts` (ratings, drafts), `archive.test.ts` (arquivo) |
| `tests/sync.test.ts` | `diffSnapshot`, `normalizeConfig`, `normalizeResults`, `normalizeArquivo`, `describeUpdates` |
| `tests/state.test.ts` | `applySnapshot` (retrocompatibilidade v7), `buildSnapshot`, `defaultConfig` |
| `tests/permissions.test.js` | `canWritePath`, `blockedPaths`, `roleLabel` |
| `tests/utils.test.js` | `escapeHtml`, `safeColor` |

Os módulos do core e desportos não dependem da UI nem do Firebase, por isso os testes importam-nos diretamente. Não há importações circulares: `ui.js` não importa `main.js` e `state.js` não importa `ui.js`; mantém assim ao acrescentar código. A interface verifica-se à mão (ver [Correr localmente](configuracao.md#correr-localmente)).

`npm run test:rules` arranca o emulador do Realtime Database com `database.rules.json` e corre `tests/rules/rules.check.mjs`: quem pode gravar cada caminho, as validações e o `logRef`. Usa a configuração de `tests/rules/firebase.json`, separada da da raiz.

O CI corre tudo antes de cada deploy: as regras no passo `rules`, o ESLint e a lógica no passo `deploy`.

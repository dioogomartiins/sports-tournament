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
| `css/style.css` | Estilos, com variáveis para os temas claro e escuro. |
| `js/main.js` | Liga os eventos da interface às ações (gerar calendário, registar golos, arquivar, …) e arranca a app. |
| `js/state.js` | Estado global, valores por defeito, snapshots (`buildSnapshot` / `applySnapshot`), persistência no localStorage e envio para o Firebase. Desfaz alterações locais que o Firebase não aceitaria. |
| `js/algorithms.js` | Lógica pura: Berger, calendário, classificação, desempates, eliminatórias, ratings, equipas equilibradas, estatísticas de jogadores, arquivo. Ver [Regras e Cálculos](regras.md). |
| `js/sync.js` | Diferenças entre snapshots para o `update()`, normalização de dados guardados pelo Firebase e texto do registo de alterações. |
| `js/firebase.js` | Ligação ao Firebase: escuta `torneio_state`, envia alterações, login Google, perfil do utilizador, lista de utilizadores e registo. |
| `js/permissions.js` | Que secções cada perfil pode gravar. Espelha `database.rules.json`. |
| `js/ui.js` | Desenha todos os ecrãs e modais (classificação, calendário, resultados, fichas, histórico, …). |
| `js/share.js` | Desenha num `<canvas>` as imagens PNG da classificação e dos resultados, e partilha-as. |
| `js/utils.js` | Funções pequenas: `escapeHtml`, `safeColor`, nomes de equipas, datas. |
| `database.rules.json` | Regras de segurança do Realtime Database. |
| `tests/` | Testes Vitest. |

## Modelo de dados

Todo o estado do torneio vive num só nó, `torneio_state`, com estas secções:

| Secção | Conteúdo |
|---|---|
| `config` | Nome, número de equipas, grupos, voltas, pontuação, eliminatórias. |
| `teams` | 32 posições `{ name, color, group }` (as não usadas ficam com nome vazio). |
| `squads` | 32 listas de jogadores por equipa `{ id, num, name }`. |
| `schedule` | Lista de jogos `{ jornada, home, away, group }`; os de eliminatória têm `isPlayoff`, `playoffMatchId` e `nextMatchId`. |
| `roundsMeta` | Uma entrada por jornada, com a equipa que folga. |
| `scheduleTeamCount`, `scheduleVoltas` | Equipas e voltas com que o calendário foi gerado. |
| `results` | Por índice do jogo em `schedule`: `{ score: "2-1", status, scorers: { home, away }, assists: { home, away }, mvp, penalties }`. |
| `players` | Base de dados de jogadores `{ id, nome, atributos }`. |
| `jogosSingulares` | Jogos singulares com as duas equipas, resultado, marcadores, assistências e MVP. |
| `arquivo` | Torneios arquivados: nome, data, campeão, tabelas finais e estatísticas por jogador. |
| `version`, `exportedAt` | Versão do formato (`SNAPSHOT_VERSION`) e data da última gravação. |

Notas:

- `results` está indexado pela **posição** do jogo em `schedule`. Por isso a volta extra e as eliminatórias acrescentam jogos no fim e nunca reordenam os existentes.
- Em `scorers`, `'auto'` é um autogolo. `assists` está alinhada com `scorers` (mesma posição = mesmo golo; `''` = sem assistência).
- Os nomes dos jogadores no `arquivo` são copiados no momento de arquivar, para o histórico sobreviver a jogadores apagados.

Fora de `torneio_state` há `utilizadores/<uid>` (nome, email, foto, último acesso e `role`) e `torneio_log` (registo de alterações).

Cada dispositivo guarda também uma cópia no localStorage, para mostrar o torneio logo ao abrir, antes de o Firebase responder.

## Sincronização

1. Ao abrir, `firebase.js` escuta `torneio_state` com `onValue`. Cada vez que chega um valor, `applySnapshot` substitui o estado local e esse snapshot passa a ser o "último sincronizado".
2. Cada ação grava a sua secção no localStorage e chama `pushStateToFirebase` com o snapshot completo.
3. `diffSnapshot` compara com o último sincronizado e produz um `update()` só com o que mudou:
   - `results` vai **jogo a jogo** (`results/<índice>`), para que duas pessoas a registar jogos diferentes ao mesmo tempo não se apaguem uma à outra;
   - as outras secções vão inteiras; se duas pessoas mudarem a mesma secção ao mesmo tempo, fica a última.
4. O mesmo `update()` acrescenta a entrada no `torneio_log`, por isso a alteração e o registo gravam-se juntos (ou nenhum).

O Firebase apaga listas vazias e transforma arrays em objetos com chaves numéricas. `normalizeResults` e `normalizeArquivo` repõem a forma esperada ao carregar.

## Permissões

As regras do Firebase são a proteção real; o cliente só esconde botões e avisa antes de enviar.

| Caminho | Ler | Escrever |
|---|---|---|
| `torneio_state` | Todos | `results`, `schedule`, `jogosSingulares`, `exportedAt`, `version`: Utilizador e Admin. Restantes secções: só Admin. |
| `utilizadores` | Admin (todos); cada um o seu | Cada um o seu nome, email, foto e último acesso; `role` só Admin. |
| `torneio_log` | Admin | Utilizador e Admin, só entradas novas, com o próprio `uid` e a hora do servidor. |

`schedule` é gravável por utilizadores porque terminar um jogo de eliminatória escreve o vencedor no jogo seguinte do bracket.

**Mudar permissões:** alterar `database.rules.json` e `js/permissions.js` (`USER_SECTIONS`) juntos, atualizar `tests/permissions.test.js`, e publicar as regras na consola Firebase depois do merge (ver [Instalação e Publicação](configuracao.md#configurar-o-firebase-uma-vez)).

Quando o cliente percebe antes de enviar que a alteração não é permitida (sem sessão, sem perfil, ou secção só de admin), não envia nada: `state.js` volta ao último snapshot sincronizado e mostra o motivo.

## Registo de alterações

`describeUpdates` (em `sync.js`) transforma cada `update()` numa frase legível (por exemplo, "Equipas alteradas", ou o jogo cujo resultado mudou). A entrada `{ uid, nome, acao, quando }` vai para `torneio_log`. Os admins veem as últimas 200 em Gestão → 👮 Utilizadores.

## Alterar a forma do estado

Qualquer mudança na forma do estado (campo novo, secção nova, formato diferente) tem de:

1. Subir `SNAPSHOT_VERSION` em `js/state.js`.
2. Continuar a carregar dados guardados com versões anteriores, que já estão no Firebase e nos telemóveis (valores por defeito em `applySnapshot`, normalização em `sync.js`).
3. Se for uma secção nova em `torneio_state`, decidir quem a pode escrever (ver [Permissões](#permissões)). Por defeito fica só para admins.

## Segurança do HTML

Qualquer pessoa com a configuração pública pode tentar escrever no Firebase, por isso tudo o que vem do estado é tratado como não confiável:

- Todo o valor do estado que entra numa string HTML passa por `escapeHtml`.
- As cores das equipas passam por `safeColor`.

## Testes

```bash
npm test
```

Os testes cobrem só a lógica pura, sem browser nem Firebase:

| Ficheiro | Cobre |
|---|---|
| `tests/algorithms.test.js` | Berger, calendário, volta extra, classificação, desempates, eliminatórias, ratings, snake draft, equipas equilibradas, estatísticas de jogadores, arquivo |
| `tests/sync.test.js` | `diffSnapshot`, `normalizeResults`, `normalizeArquivo`, `describeUpdates` |
| `tests/permissions.test.js` | `canWritePath`, `blockedPaths`, `roleLabel` |
| `tests/utils.test.js` | `escapeHtml`, `safeColor` |

`algorithms.js` importa `state.js` e `utils.js`, que carregam a interface e o Firebase; os testes substituem-nos com `vi.mock` e depois fazem `await import` do módulo. A interface e o Firebase verificam-se à mão (ver [Correr localmente](configuracao.md#correr-localmente)). O CI corre os testes antes de cada deploy.

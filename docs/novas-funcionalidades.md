# 🏟️ Novas Funcionalidades — Arquitetura Multi-Desporto

> **Estado:** proposta · ainda não implementado

Atualmente o Torneio ILOG é exclusivamente de futebol. Este documento descreve o plano para tornar a app **agnóstica ao desporto**, suportando futebol, padel, basquetebol, andebol, voleibol ou qualquer outra modalidade — tudo na mesma base de código.

## Motivação

A infraestrutura de calendário (Berger), grupos, eliminatórias, sincronização e permissões já é genérica. O que varia entre desportos é:

- O **formato do resultado** (golos, sets/games, pontos)
- As **colunas da classificação** e os critérios de desempate
- As **estatísticas individuais** (golos/assists vs pontos/ressaltos)
- A **composição da equipa** (plantel de N vs dupla de 2)
- Os **atributos de rating** dos jogadores
- A **terminologia e ícones** da interface

## Perfis de Desporto

A ideia central: cada modalidade é **um ficheiro** em `src/sports/` que exporta um objeto com toda a lógica e configuração que varia. O motor da app delega a esse perfil em vez de ter `if/else` espalhados.

```
src/sports/
├── index.js          # registry: getSport(id) → perfil
├── futebol.js        # ⚽ perfil actual (extraído do código existente)
├── padel.js          # 🎾
├── basquetebol.js    # 🏀
├── andebol.js        # 🤾
└── voleibol.js       # 🏐
```

### Interface de um perfil

```js
export default {
  id: 'futebol',
  nome: 'Futebol',
  icon: '⚽',

  // ── Resultado ──
  parseScore(str) { },       // "3-1" → { home: 3, away: 1 }
  formatScore(parsed) { },   // → "3-1"
  validateScore(str) { },    // → boolean
  hasDraws: true,
  tiebreakType: 'penalties', // 'penalties' | 'overtime' | 'tiebreak' | null

  // ── Classificação ──
  defaultPoints: { win: 3, draw: 1, loss: 0 },
  standingsColumns: ['J', 'V', 'E', 'D', 'GM', 'GS', 'DG', 'Pts'],
  sortCriteria: ['Pts', 'DG', 'GM', 'head-to-head'],
  computeRow(parsed, config) { },

  // ── Estatísticas individuais ──
  statFields: ['golos', 'assistencias', 'mvp'],
  statLabels: { golos: 'Golos', assistencias: 'Assistências', mvp: 'MVP' },
  statIcons:  { golos: '⚽', assistencias: '🅰️', mvp: '⭐' },
  tallyStats(results, players) { },

  // ── Equipa ──
  teamSize: { min: 1, max: 30 },
  hasJerseyNumber: true,
  playerAttrs: ['velocidade', 'finalizacao', 'passe', 'drible', 'defesa', 'fisico'],

  // ── UI ──
  scoreInputType: 'counter',  // 'counter' | 'sets-grid' | 'number-pair'
  animationEvents: {
    score:  { title: 'GOLO!', icon: '⚽' },
    cancel: { title: 'GOLO ANULADO', icon: '❌' },
  },
}
```

## Comparação entre desportos

### Formato do resultado

| Desporto | Formato | Exemplo | Empate | Desempate playoff |
|---|---|---|---|---|
| ⚽ Futebol | Golos | `3-1` | ✅ | Penáltis |
| 🎾 Padel | Sets/Games | `6-4 3-6 10-7` | ❌ | Tiebreak / Super tiebreak |
| 🏀 Basquetebol | Pontos | `87-82` | ❌ | Prolongamento |
| 🤾 Andebol | Golos | `28-24` | ✅ | Prolongamento + 7m |
| 🏐 Voleibol | Sets/Pontos | `25-20 22-25 25-18` | ❌ | 5.º set a 15 |

### Classificação

| Desporto | Colunas | Pontos | Critérios de desempate |
|---|---|---|---|
| ⚽ Futebol | J V E D GM GS DG Pts | 3-1-0 + bónus goleada | Pts → DG → GM → H2H |
| 🎾 Padel | J V D SG SP DS JG JP DJ Pts | 3-2-1-0 (por margem) | Pts → DS → DJ → H2H |
| 🏀 Basquetebol | J V D PM PS DP Pts | 2-0 | Pts → DP → PM → H2H |
| 🤾 Andebol | J V E D GM GS DG Pts | 2-1-0 | Pts → DG → GM → H2H |
| 🏐 Voleibol | J V D SG SP DS PG PP DP Pts | 3-2-1-0 (por margem) | Pts → DS → DP → H2H |

### Estatísticas individuais

| Desporto | Métricas |
|---|---|
| ⚽ Futebol | Golos, Assistências, MVP |
| 🎾 Padel | Jogos, Vitórias, % Win Rate |
| 🏀 Basquetebol | Pontos, Ressaltos, Assistências, Roubos, Blocos |
| 🤾 Andebol | Golos, Assistências, Defesas (GR) |
| 🏐 Voleibol | Aces, Blocos, Ataques, Erros |

### Equipa

| Desporto | Tamanho | Camisola | Atributos de rating |
|---|---|---|---|
| ⚽ Futebol | N jogadores | Sim | Velocidade, Finalização, Passe, Drible, Defesa, Físico |
| 🎾 Padel | 2 (dupla) | Não | Smash, Volei, Bandeja, Serviço, Posicionamento, Defesa |
| 🏀 Basquetebol | 5 + suplentes | Sim | Lançamento, Passe, Drible, Defesa, Ressalto, Físico |
| 🤾 Andebol | 7 + suplentes | Sim | Remate, Passe, Defesa, Velocidade, Físico, Posicionamento |
| 🏐 Voleibol | 6 + suplentes | Sim | Ataque, Bloco, Serviço, Receção, Defesa, Distribuição |

## O que muda e o que fica

### ✅ Não muda (motor agnóstico)

- Algoritmo de Berger (round-robin)
- Geração de calendário e volta extra
- Seeding de eliminatórias
- Sincronização jogo a jogo (`diffSnapshot`)
- Permissões (admin / user / pendente)
- Login e gestão de utilizadores
- Arquivo de torneios (estrutura)

### 🔄 Passa a delegar ao perfil

- `computeStandings()` — colunas e critérios de ordenação
- `resolveHeadToHead()` — mini-tabela com métricas do desporto
- `getPlayoffWinner()` — tipo de desempate
- `tallyPlayerStats()` — métricas individuais
- `addGoal/removeGoal` → `addScore/removeScore` genérico
- Animações e banners ao vivo
- UI de resultados (input counter vs grelha de sets vs par de números)
- Colunas e ícones na classificação e estatísticas
- Imagem de partilha

### 🆕 Novo

- `src/sports/*.js` — perfis de desporto
- `getSport(config.tipoDesporto)` — registry
- Seletor de desporto na configuração
- Input de sets (grelha) para padel e voleibol
- Regras do Firebase flexíveis para aceitar vários formatos de score

## Plano de implementação

### Fase 1 — Fundação (sem quebrar nada)

1. Criar `src/sports/futebol.js` — extrair a lógica actual para o perfil.
2. Criar `src/sports/index.js` — registry com `getSport(id)`.
3. Adicionar `tipoDesporto: 'futebol'` ao `defaultConfig` (valor por defeito = comportamento actual inalterado).
4. Refactorizar `computeStandings` e `tallyPlayerStats` para delegarem ao perfil.
5. Testes — garantir que **nada muda** com o futebol.

### Fase 2 — Segundo desporto

1. Criar o perfil do segundo desporto (ex.: `padel.js` ou `basquetebol.js`).
2. Adicionar seletor na UI de configuração.
3. Adaptar o input de resultado.
4. Adaptar colunas da classificação e estatísticas.
5. Atualizar `database.rules.json` para aceitar ambos os formatos.

### Fase 3 — Generalização

1. Adicionar mais perfis conforme necessário.
2. Formato Americano/Mexicano para padel (jogadores trocam de parceiro a cada ronda).
3. Documentação e ilustrações por desporto.

## Impacto por ficheiro

| Ficheiro | Mudança | Esforço |
|---|---|---|
| `src/sports/*.js` | 🆕 Perfis de desporto | 🟡 Médio |
| `src/algorithms.js` | 🔄 Delegar standings e stats ao perfil | 🟡 Médio |
| `src/state.js` | 🔄 `config.tipoDesporto`, atributos dinâmicos | 🟢 Baixo |
| `src/ui.js` | 🔄 Labels, ícones, colunas condicionais | 🔴 Alto |
| `src/main.js` | 🔄 Input de resultado delegado ao perfil | 🟡 Médio |
| `src/animations.js` | 🔄 Eventos lidos do perfil | 🟢 Baixo |
| `src/share.js` | 🔄 Colunas e labels do perfil | 🟡 Médio |
| `src/sync.js` | 🔄 `normalizeResults` condicional | 🟢 Baixo |
| `index.html` | 🔄 Seletor de desporto, labels dinâmicos | 🟡 Médio |
| `database.rules.json` | 🔄 Validação flexível do score | 🟡 Médio |
| `tests/*.test.js` | 🔄 Fixtures parametrizadas por desporto | 🟡 Médio |

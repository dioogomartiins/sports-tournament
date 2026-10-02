# Torneio ILOG 🏆⚽

Uma aplicação web moderna concebida para a gestão completa de torneios desportivos entre amigos. Organiza equipas, cria plantéis, mantém uma base de dados de atributos de jogadores, gera calendários (Algoritmo de Berger), introduz resultados de torneios ou jogos singulares, e acompanha estatísticas em tempo real, sincronizadas entre todos os participantes.

## ✨ Funcionalidades Principais

* **Sincronização em Tempo Real (Firebase):** Todos os telemóveis e computadores ligados atualizam instantaneamente quando um resultado ou golo é inserido noutro dispositivo. Sem necessidade de recarregar a página!
* **Base de Dados Global de Jogadores:** Regista jogadores com atributos (Velocidade, Finalização, Passe, Drible, Defesa, Físico) que determinam a sua classificação global (Rating) por estrelas.
* **Organização e Gestão Centralizada:** Um menu de gestão robusto para criar Equipas, alocar jogadores aos Plantéis e gerir as fichas técnicas de cada atleta.
* **Jogo Singular com Equipas Equilibradas:** Ideal para quando não há pessoas suficientes para um torneio inteiro. Escolhem-se os jogadores presentes da Base de Dados e a app divide-os em duas equipas com o rating total o mais próximo possível (testa todas as divisões até 20 jogadores). O resultado, os marcadores, as assistências e o MVP ficam no Histórico de Singulares.
* **Algoritmo de Berger:** Geração automática e justa do calendário da Liga (incluso números ímpares de equipas), agrupamento e eliminatórias ("mata-mata").
* **Golos, Assistências e MVP:** Em cada golo regista-se o marcador e quem assistiu (os autogolos não têm assistência), e cada jogo terminado tem um MVP. Vale tanto para os jogos do torneio como para os singulares.
* **Estatísticas e Ficha de Jogador:** O separador 📊 Estatísticas mostra os melhores marcadores, assistentes e MVPs do torneio atual e dos Jogos Singulares. O 🗄️ Histórico junta também os torneios arquivados, e clicar em qualquer jogador abre a sua "Ficha" com os totais de sempre.
* **Histórico de Torneios:** No fim de um torneio, um admin carrega em **Arquivar e Começar Novo** (Gestão → 💾 Dados). A classificação final, o campeão e as estatísticas dos jogadores ficam guardados no Histórico, e o calendário e os resultados são limpos. Equipas, plantéis, jogadores e jogos singulares mantêm-se.
* **Partilhar como Imagem:** O botão 📤 na Classificação e em cada resultado terminado gera uma imagem PNG e abre a partilha do telemóvel (WhatsApp, etc.). Onde a partilha não existe, a imagem é descarregada.
* **Design Premium e Responsivo:** UI/UX super cuidado com tema claro e escuro dinâmico (Dark Mode).

## 🛠️ Tecnologias Utilizadas

Esta é uma Single Page Application construída com tecnologias web nativas e servida estaticamente, otimizada para ser extremamente rápida.

* **HTML5 & CSS3** (Vanilla CSS com sistema de Design)
* **JavaScript (ES Modules)**
* **[Vite](https://vitejs.dev/)** (Ferramenta de *Build* e *Dev Server*)
* **Firebase Realtime Database** (Para sincronização *Serverless* instantânea)

## 🗂️ Estrutura do Código

| Ficheiro | Papel |
|---|---|
| `js/state.js` | Estado global e persistência (localStorage + envio para o Firebase). `SNAPSHOT_VERSION` muda sempre que a forma do estado muda. |
| `js/algorithms.js` | Lógica pura: calendário de Berger, classificação, desempates por confronto direto, ratings, equipas equilibradas, estatísticas de jogadores e arquivo. |
| `js/sync.js` | Calcula o que mudou desde a última sincronização (`update()` só com as diferenças), normaliza dados antigos e descreve as alterações para o registo. |
| `js/firebase.js` | Ligação ao Firebase: sincronização em tempo real, login com Google e registo de alterações. |
| `js/permissions.js` | O que cada perfil pode gravar; espelha `database.rules.json`. |
| `js/share.js` | Gera as imagens PNG para partilhar. |
| `js/ui.js` / `js/main.js` | Desenho dos ecrãs / ligação dos eventos. |
| `database.rules.json` | Regras de segurança do Realtime Database (a proteção real dos dados). |
| `tests/` | Testes Vitest da lógica pura. |

## 🚀 Como Correr Localmente (Desenvolvimento)

Para trabalhar nesta aplicação no teu computador e desfrutar do *Hot Reload* do Vite, segue estes passos:

1. **Clona o repositório:**
   ```bash
   git clone https://github.com/dioogomartiins/torneio-ilog.git
   cd torneio-ilog
   ```

2. **Configura o Firebase:**
   Copia `.env.example` para `.env` na raiz do projeto (o `.env` está no `.gitignore`, nunca faças commit dele) e insere as tuas chaves do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tuachave
   VITE_FIREBASE_AUTH_DOMAIN=teudominio.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://teudominio.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID=teuprojeto
   VITE_FIREBASE_STORAGE_BUCKET=teubucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=id
   VITE_FIREBASE_APP_ID=appid
   VITE_FIREBASE_MEASUREMENT_ID=medicao
   ```

3. **Instala as dependências:**
   O projeto necessita do Node.js instalado.
   ```bash
   npm install
   ```

4. **Inicia o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:5173/torneio-ilog/` (a app é servida no mesmo caminho que no GitHub Pages; a raiz fica em branco).

   > ⚠️ Com o `.env` de produção, qualquer clique altera o torneio real em todos os telemóveis. Para testar, cria um `.env.development.local` com `VITE_FIREBASE_DATABASE_URL` de uma base de dados de testes, ou usa os emuladores do Firebase (ver `.claude/skills/run/SKILL.md`).

5. **Correr os testes:**
   ```bash
   npm test
   ```

6. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```

## ☁️ Publicação (Deploy)

A aplicação é publicada automaticamente no **GitHub Pages** a cada push para `main` (ver `.github/workflows/deploy.yml`).

O workflow cria o `.env` a partir dos **Repository Secrets** (Settings → Secrets and variables → Actions). Tem de existir um secret com o mesmo nome para cada variável do `.env.example`; se faltarem, o deploy falha com um erro explícito.

> Nota: as variáveis `VITE_*` ficam visíveis no JavaScript publicado, por isso nenhuma é verdadeiramente secreta. A proteção dos dados vem das regras de segurança do Firebase Realtime Database (`database.rules.json`).

## 🔐 Contas e Perfis

Qualquer pessoa vê o torneio sem conta. Para editar é preciso entrar com Google (botão 🔑 Entrar) e ter um perfil:

| Perfil | Pode |
|---|---|
| Pendente (acabou de entrar) | Só ver |
| Utilizador | Registar resultados, marcadores, assistências e MVP, estados dos jogos, eliminatórias e jogos singulares |
| Admin | Tudo: configuração, equipas, plantéis, jogadores, importar, arquivar torneios, apagar dados e gerir utilizadores |

Cada alteração fica no **Registo de Alterações** (Gestão → 👮 Utilizadores, só para admins), com quem a fez e quando.

### Configuração inicial no Firebase (uma vez)

1. **Authentication → Sign-in method:** ativar **Google**.
2. **Authentication → Settings → Authorized domains:** adicionar `dioogomartiins.github.io`.
3. **Realtime Database → Rules:** colar o conteúdo de `database.rules.json` e publicar.
4. Abrir o site, entrar com Google, e depois em **Realtime Database → Data** criar `utilizadores/<o teu uid>/role` com o valor `"admin"` (o uid aparece em Authentication → Users). A partir daí, os outros perfis atribuem-se na própria app.

Sempre que `database.rules.json` mudar, é preciso voltar a publicá-lo na consola (ou com `firebase deploy --only database`).

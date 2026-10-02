# Instalação e Publicação

[← Voltar ao README](../README.md)

Como pôr a app a funcionar: o projeto Firebase, as variáveis de ambiente, o desenvolvimento local e o deploy para o GitHub Pages.

- [Requisitos](#requisitos)
- [Configurar o Firebase (uma vez)](#configurar-o-firebase-uma-vez)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Correr localmente](#correr-localmente)
- [Publicação (deploy)](#publicação-deploy)
- [Problemas comuns](#problemas-comuns)

## Requisitos

- Node.js 20 (a versão usada no CI)
- Um projeto Firebase com **Realtime Database** e **Authentication**
- Opcional: [Firebase CLI](https://firebase.google.com/docs/cli) para os emuladores e para publicar as regras

## Configurar o Firebase (uma vez)

1. **Authentication → Sign-in method:** ativar **Google**.
2. **Authentication → Settings → Authorized domains:** adicionar `dioogomartiins.github.io` (e `localhost` para desenvolvimento, que costuma já lá estar).
3. **Realtime Database → Rules:** colar o conteúdo de [`database.rules.json`](../database.rules.json) e publicar.
4. **Primeiro admin:** abrir o site, entrar com Google, e depois em **Realtime Database → Data** criar `utilizadores/<o teu uid>/role` com o valor `"admin"` (o uid aparece em Authentication → Users). A partir daí, os outros perfis atribuem-se na própria app, em Gestão → 👮 Utilizadores.

Sempre que `database.rules.json` mudar no repositório, é preciso voltar a publicá-lo na consola (ou com `firebase deploy --only database`). O deploy do site **não** publica as regras.

## Variáveis de ambiente

O `.env.example` lista as variáveis que a app lê:

| Variável | Onde a encontrar |
|---|---|
| `VITE_FIREBASE_API_KEY` | Consola Firebase → Definições do projeto → As tuas apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | idem |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database (URL no topo da página Data) |
| `VITE_FIREBASE_PROJECT_ID` | Definições do projeto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Definições do projeto |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Definições do projeto |
| `VITE_FIREBASE_APP_ID` | Definições do projeto |
| `VITE_FIREBASE_MEASUREMENT_ID` | Definições do projeto (Analytics) |
| `VITE_USE_EMULATORS` | Opcional. `true` liga a app aos emuladores locais. |

As variáveis `VITE_*` ficam no JavaScript publicado, por isso **nenhuma é secreta**. A proteção dos dados vem das regras do Realtime Database. Mesmo assim, o `.env` está no `.gitignore` e nunca deve entrar no repositório.

## Correr localmente

> ⚠️ Toda a ação na app grava no Firebase. Se o servidor local usar a base de dados de produção, um clique de teste muda o torneio real no telemóvel de toda a gente.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/torneio-ilog/` (a app é servida no mesmo caminho que no GitHub Pages; a raiz fica em branco).

Escolhe uma destas formas de não tocar no torneio real:

**A. Base de dados de testes.** O Vite lê o `.env.development.local` por cima do `.env` no `npm run dev`. Cria-o com o URL de outra base de dados (por exemplo, uma segunda instância no mesmo projeto):

```env
VITE_FIREBASE_DATABASE_URL=https://<base-de-testes>.firebasedatabase.app
```

**B. Emuladores do Firebase (tudo offline).**

```bash
firebase emulators:start --only database,auth --project demo-torneio
```

E no `.env.development.local`:

```env
VITE_USE_EMULATORS=true
VITE_FIREBASE_PROJECT_ID=demo-torneio
VITE_FIREBASE_DATABASE_URL=https://demo-torneio.firebaseio.com
```

Carrega `database.rules.json` no emulador para testar os perfis. Para editar precisas de um utilizador com `utilizadores/<uid>/role` definido (cria-o na UI do emulador).

**Antes de abrir um PR:**

```bash
npm test         # testes da lógica pura
npm run build    # tem de passar
```

E verifica as mudanças de interface numa largura de telemóvel (cerca de 390px) e nos dois temas.

## Publicação (deploy)

Cada push para `main` publica o site no GitHub Pages pelo workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): instala dependências, corre os testes, cria o `.env` a partir dos secrets, faz o build e publica `dist/`. Por isso, as mudanças fazem-se num branch com PR.

O que tem de estar configurado no GitHub:

- **Settings → Pages → Source:** *GitHub Actions* (com *Deploy from a branch* o site serve o código-fonte e não funciona).
- **Settings → Secrets and variables → Actions:** um secret com o mesmo nome para cada `VITE_FIREBASE_*` do `.env.example`. Sem eles o deploy falha com um erro explícito.

O site fica em `https://dioogomartiins.github.io/torneio-ilog/` (o caminho vem do `base` em `vite.config.js`).

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Página em branco no servidor local | Abriste `localhost:5173/` em vez de `localhost:5173/torneio-ilog/` |
| Erros do Firebase na consola do browser | `.env` em falta ou URL da base de dados errado |
| "A tua conta ainda não foi aprovada por um admin." | A conta não tem perfil: um admin tem de o dar em Gestão → 👮 Utilizadores |
| "Só um admin pode fazer esta alteração." | A conta é Utilizador e a alteração é de admin |
| A app deixa gravar mas a alteração desaparece | As regras publicadas na consola estão desatualizadas em relação a `database.rules.json` |
| Login com Google falha no site publicado | `dioogomartiins.github.io` não está nos domínios autorizados |
| Deploy falha em "Create .env" | Faltam os secrets do repositório |
| Site publicado com `Failed to resolve module specifier` | Pages está em *Deploy from a branch* em vez de *GitHub Actions* |

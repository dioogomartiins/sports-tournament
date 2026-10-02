# Guia de Utilização

[← Voltar ao README](../README.md)

Este guia explica como usar a app no dia a dia: quem pode fazer o quê, como montar um torneio do zero até ao campeão, e como usar os jogos singulares. As contas de pontos, desempates e equipas equilibradas estão em [Regras e Cálculos](regras.md).

- [Contas e perfis](#contas-e-perfis)
- [Mapa da app](#mapa-da-app)
- [Montar um torneio](#montar-um-torneio)
- [Durante os jogos](#durante-os-jogos)
- [Eliminatórias](#eliminatórias)
- [Terminar e arquivar](#terminar-e-arquivar)
- [Jogo Singular](#jogo-singular)
- [Estatísticas, ficha de jogador e partilha](#estatísticas-ficha-de-jogador-e-partilha)
- [Dados: exportar, importar e apagar](#dados-exportar-importar-e-apagar)

## Contas e perfis

![Perfis e permissões](assets/illustrations/08-perfis-e-permissoes.jpg)

Qualquer pessoa com o link vê o torneio, sem conta. Para alterar alguma coisa é preciso carregar em **🔑 Entrar**, entrar com Google, e ter um perfil atribuído por um admin.

| Perfil | Pode |
|---|---|
| **Pendente** (acabou de entrar) | Só ver. Fica à espera que um admin lhe dê um perfil. |
| **Utilizador** | Registar resultados, marcadores, assistências e MVP, mudar o estado dos jogos (incluindo os das eliminatórias) e registar jogos singulares. |
| **Admin** | Tudo o resto: configuração, calendário, eliminatórias, equipas, plantéis, base de dados de jogadores, importar, arquivar torneios, apagar dados e gerir utilizadores. |

Os admins dão perfis em **🛠️ Gestão → 👮 Utilizadores**. Na mesma página está o **Registo de Alterações**: cada gravação fica lá com quem a fez e quando.

Os botões que o teu perfil não pode usar ficam escondidos. Mesmo que alguém contorne a app, o Firebase recusa a gravação (ver [Arquitetura](arquitetura.md#permissões)).

## Mapa da app

| Separador | Para quê |
|---|---|
| 🏠 Dashboard | Resumo: top 3 da classificação e números do torneio. O botão 🔁 no topo atualiza os números. |
| 🏆 Classificação | Tabela completa (por grupo) e bracket das eliminatórias. |
| 📅 Calendário | Jornadas, jogos e folgas; gerar eliminatórias e adicionar voltas. Tocar num jogo abre a janela do jogo. |
| ⚽ Resultados | Onde se registam os jogos ao vivo. |
| 📊 Estatísticas | Marcadores, assistências e MVPs do torneio atual e dos jogos singulares. |
| 🗄️ Histórico | Torneios arquivados e estatísticas de sempre. |
| ⚙️ Configuração | Nome, formato e pontuação (só admins). |
| 🛠️ Gestão | 👥 Equipas, 👕 Plantéis, 👤 Jogadores, 💾 Dados e 👮 Utilizadores. |
| ⚽ Jogo Singular | Jogos avulsos com equipas equilibradas. |

O botão de tema no topo alterna entre claro e escuro.

## Montar um torneio

Estes passos são feitos por um **admin**. Quem não é admin vê Equipas, Plantéis e Jogadores só de leitura, sem botões de edição.

1. **Jogadores** (Gestão → 👤 Jogadores): cria cada jogador e dá-lhe de 0 a 5 estrelas em Velocidade, Finalização, Passe, Drible, Defesa e Físico. A média é o rating ★ do jogador. Esta base de dados é comum a todos os torneios e aos jogos singulares.
2. **Configuração** (⚙️): escolhe o nome, o número de equipas (2 a 32), o número de grupos (1, 2, 4 ou 8), o número de voltas, a pontuação e se há eliminatórias e quantas equipas se apuram.
3. **Equipas** (Gestão → 👥 Equipas): dá nome e cor a cada equipa.
4. **Plantéis** (Gestão → 👕 Plantéis): escolhe a equipa e adiciona jogadores da base de dados, com o número da camisola. A média ★ do plantel aparece no topo.
5. **🔄 Gerar Calendário** (⚙️ Configuração): cria todas as jornadas. Com mais de um grupo, as equipas são sorteadas pelos grupos neste momento.

Gerar um calendário novo apaga os resultados já introduzidos (a app pede confirmação). Equipas, plantéis e configuração mantêm-se.

**Volta extra:** num torneio de liga única sem eliminatórias, o botão **➕ Adicionar Volta Extra** no Calendário acrescenta mais uma volta sem perder resultados. A nova volta troca quem joga em casa.

## Durante os jogos

![Durante os jogos](assets/illustrations/09-durante-os-jogos.jpg)

No separador **⚽ Resultados**, cada jogo tem:

- **Estado**: carregar no botão alterna entre *Agendado → A decorrer → Terminado*. Jogos agendados não contam para a classificação.
- **＋ / −** de cada lado: o ＋ pergunta quem marcou (ou *autogolo*) e depois quem assistiu (ou *sem assistência*; os autogolos não têm). O − retira o último golo dessa equipa. Marcar o primeiro golo põe o jogo *A decorrer*.
- **📋 Jogo**: abre a janela do jogo (ver abaixo).

Também podes escrever o resultado diretamente nas caixas; nesse caso não ficam marcadores associados.

**Janela do jogo.** Abre com **📋 Jogo** nos Resultados, ou tocando no jogo no Calendário. Mostra o resultado e, por equipa, cada golo com o marcador e a assistência. Atualiza-se sozinha quando alguém regista um golo noutro telemóvel. Com o jogo terminado, tem os botões **⭐ Escolher MVP** e **📤 Partilhar imagem** (a imagem do resultado).

**Ao vivo em todos os telemóveis.** Quando um jogo começa, há golo (fundo com a cor da equipa, marcador e assistência), um golo é anulado ou o jogo termina, aparece uma animação curta em todos os dispositivos, e na Classificação as equipas deslizam para o novo lugar. Com *movimento reduzido* ligado no telemóvel, as animações não aparecem.

A classificação, o dashboard e as estatísticas atualizam sozinhos em todos os dispositivos.

## Eliminatórias

Com eliminatórias ativas na configuração, o botão **🏆 Gerar Eliminatórias** aparece no Calendário (para admins) quando todos os jogos da liga estão *Terminados*. A app apura os primeiros de cada grupo pela classificação atual e monta o bracket (até 16 equipas: oitavos, quartos, meias e final). Os detalhes do emparelhamento estão em [Regras e Cálculos](regras.md#eliminatórias).

Num jogo de eliminatória terminado empatado aparecem as caixas de **Penáltis**. O vencedor passa automaticamente para o jogo seguinte do bracket.

## Terminar e arquivar

![Terminar e arquivar](assets/illustrations/10-terminar-e-arquivar.jpg)

Quando o torneio acaba, um admin vai a **Gestão → 💾 Dados → 🗄️ Arquivar e Começar Novo**. A app:

1. Guarda no **🗄️ Histórico** a classificação final, o campeão (vencedor da final, ou primeiro da liga quando há um só grupo e sem eliminatórias), o número de jogos e golos, e as estatísticas de cada jogador.
2. Limpa o calendário e os resultados.

Se ainda houver jogos por terminar, a app avisa antes: o campeão guardado será quem lidera nesse momento, ou nenhum se a final não terminou.

Equipas, plantéis, jogadores, configuração e jogos singulares ficam como estavam, prontos para o próximo torneio.

## Jogo Singular

Para quando não há gente para um torneio:

1. Dá nome às duas equipas (opcional).
2. Marca os jogadores presentes.
3. Carrega em **⚽ Fazer Draft**: a app divide-os em duas equipas com o rating total o mais parecido possível.
4. Durante o jogo, regista os golos com ＋ (marcador e assistência) e escolhe o MVP.
5. Mete o resultado e carrega em **💾 Guardar Jogo**. O jogo vai para o *Histórico de Jogos Singulares*, logo abaixo.

Os golos, assistências e MVPs dos jogos singulares contam para as estatísticas e para a ficha de cada jogador.

## Estatísticas, ficha de jogador e partilha

![Golos, assistências e MVP](assets/illustrations/11-golos-assistencias-mvp.jpg)

- **📊 Estatísticas**: tabela de marcadores, assistências e MVPs do torneio atual e dos jogos singulares.
- **🗄️ Histórico**: lista dos torneios arquivados e uma tabela de sempre (torneios arquivados, torneio atual e jogos singulares).
- **Ficha de jogador**: carrega no nome de um jogador para ver atributos, rating, e golos, assistências e MVPs de sempre.
- **Partilhar**: **📤 Partilhar Classificação** na Classificação, e **📤 Partilhar imagem** na janela de cada jogo terminado. No telemóvel abre a partilha do sistema (WhatsApp, etc.); no computador descarrega a imagem PNG.

## Dados: exportar, importar e apagar

Tudo em **Gestão → 💾 Dados** (só admins):

- **⬇️ Exportar JSON**: descarrega uma cópia completa do estado. Boa ideia antes de mudanças grandes.
- **⬆️ Importar JSON**: substitui o estado atual por um ficheiro exportado. Afeta todos os dispositivos.
- **🗄️ Arquivar e Começar Novo**: ver [Terminar e arquivar](#terminar-e-arquivar).
- **🧹 Zona de Perigo**: apaga, à escolha, resultados, calendário, ou equipas e plantéis. A base de dados de jogadores e o histórico de singulares estão protegidos e não se apagam por aqui.

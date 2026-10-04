# Regras e Cálculos

[← Voltar ao README](../README.md)

Como a app chega aos números que mostra. Toda esta lógica está em `src/algorithms.js` e tem testes em `tests/algorithms.test.js`.

- [Pontuação](#pontuação)
- [Classificação e desempates](#classificação-e-desempates)
- [Calendário (Algoritmo de Berger)](#calendário-algoritmo-de-berger)
- [Grupos](#grupos)
- [Eliminatórias](#eliminatórias)
- [Campeão](#campeão)
- [Rating dos jogadores](#rating-dos-jogadores)
- [Equipas equilibradas (Jogo Singular)](#equipas-equilibradas-jogo-singular)
- [Estatísticas de jogadores](#estatísticas-de-jogadores)

## Pontuação

![Bónus de goleada](assets/illustrations/03-bonus-de-goleada.jpg)

Configurável em ⚙️ Configuração. Valores por defeito:

| | Pontos |
|---|---|
| Vitória | 3 |
| Empate | 1 |
| Derrota | 0 |
| Bónus de goleada | +1 |

O **bónus de goleada** vai para a equipa que ganha marcando pelo menos o número de golos configurado (por defeito 3). Conta os golos marcados, não a diferença: um 3-2 também dá bónus.

Só contam jogos da fase de liga com resultado e que não estejam *Agendados*. Os jogos das eliminatórias não entram na classificação.

## Classificação e desempates

![Desempate por confronto direto](assets/illustrations/04-desempate-confronto-direto.jpg)

As equipas ordenam-se por:

1. Pontos
2. Diferença de golos
3. Golos marcados

Se duas ou mais equipas continuarem empatadas nos três critérios, desempata-se entre elas pelo **confronto direto** (só os jogos entre as equipas empatadas):

4. Pontos nos jogos entre si
5. Diferença de golos nos jogos entre si
6. Golos marcados nos jogos entre si
7. Menos golos sofridos no total
8. Ordem alfabética

Com grupos, cada grupo tem a sua tabela.

## Calendário (Algoritmo de Berger)

![Algoritmo de Berger](assets/illustrations/02-algoritmo-de-berger.jpg)

Cada volta é um campeonato a uma mão em que todas as equipas se defrontam uma vez. O algoritmo de Berger fixa uma equipa e roda as outras, o que dá jornadas equilibradas e alterna quem joga em casa.

- **Número ímpar de equipas:** em cada jornada uma equipa folga; a folga aparece no calendário.
- **Várias voltas:** nas voltas pares (2.ª, 4.ª, …) os jogos repetem-se com casa e fora trocados.
- **Volta extra:** acrescenta mais uma volta no fim sem mexer nos jogos existentes (só em liga única e antes das eliminatórias), por isso os resultados mantêm-se.

Um calendário com N equipas tem N−1 jornadas por volta (N se N for ímpar) e N×(N−1)/2 jogos por volta.

## Grupos

Com 2, 4 ou 8 grupos, as equipas são **sorteadas** pelos grupos sempre que se gera o calendário, em partes o mais iguais possível (os últimos grupos podem ficar com menos equipas). Cada grupo tem o seu próprio calendário de Berger, jogado nas mesmas jornadas.

## Eliminatórias

![Grupos e seeds](assets/illustrations/05-grupos-e-seeds.jpg)

O número de equipas apuradas é *apuradas por grupo × número de grupos* e tem de ser 2, 4, 8 ou 16. O bracket começa em:

| Equipas | Primeira ronda |
|---|---|
| 16 | Oitavos-de-Final |
| 8 | Quartos-de-Final |
| 4 | Meias-Finais |
| 2 | Final |

**Seeds:** as apuradas são ordenadas por posição, intercalando grupos: 1.º do A, 1.º do B, …, 2.º do A, 2.º do B, … Na primeira ronda o seed 1 joga com o último, o 2 com o penúltimo, e assim por diante, arrumados de forma a que os seeds 1 e 2 só se possam encontrar na final.

**Empates:** um jogo de eliminatória terminado empatado decide-se nos penáltis. O vencedor passa sozinho para o lugar certo do jogo seguinte.

## Campeão

- Com eliminatórias: o vencedor da final.
- Sem eliminatórias e com um só grupo: o primeiro da classificação.
- Com vários grupos e sem eliminatórias não há campeão automático.

## Rating dos jogadores

![Rating do jogador](assets/illustrations/06-rating-do-jogador.jpg)

Cada jogador tem 0 a 5 estrelas em seis atributos: Velocidade, Finalização, Passe, Drible, Defesa e Físico. O **rating ★** é a média dos seis, com uma casa decimal. O rating de uma equipa é a soma dos ratings dos seus jogadores.

## Equipas equilibradas (Jogo Singular)

![Equipas equilibradas](assets/illustrations/07-equipas-equilibradas.jpg)

O **⚽ Fazer Draft** divide os jogadores presentes em duas equipas:

- As equipas ficam com o mesmo número de jogadores, ou com um de diferença se forem ímpares.
- **Até 20 jogadores**, a app experimenta todas as divisões possíveis e fica com a de menor diferença de rating total.
- **Mais de 20**, começa num *snake draft* (A, B, B, A, A, B, …, por ordem de rating) e vai trocando pares de jogadores entre as equipas enquanto a diferença diminuir.

## Estatísticas de jogadores

Por jogador contam-se:

| Estatística | Como se conta |
|---|---|
| Golos | Cada golo registado com esse marcador (autogolos não contam para ninguém) |
| Assistências | Cada golo em que foi escolhido como assistente |
| MVP | Jogos em que foi o MVP |
| Jogos a marcar | Jogos em que marcou pelo menos um golo |
| Recorde | Mais golos num só jogo |

O separador Estatísticas soma o torneio atual e os jogos singulares. O Histórico e a ficha do jogador somam também os torneios arquivados.

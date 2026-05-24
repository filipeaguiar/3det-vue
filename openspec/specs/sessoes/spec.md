# 📝 Sessões

## Visão Geral
O sistema de "Sessões" permite ao Mestre planejar os encontros de RPG e documentar o que aconteceu durante o jogo. É um sistema complexo e altamente relacional que tenta trazer o planejamento estruturado "Lazy Dungeon Master" para dentro do app.

## Estado Atual

### Funcionalidades
Planejamento em múltiplas vertentes de sub-entidades:
- Resumo e Descrição Geral
- Objetivos
- Ganchos Focados em Personagens
- Locais Interessantes (com características intrínsecas)
- NPCs Importantes
- Encontros e Desafios (incluindo descrições de mecânicas)
- Segredos e Rumores
- Tesouros e Recompensas

### Arquitetura e Fluxo de Componentes
- **Rotas**: O carregamento inicial para a lista de sessões é feito sob demanda (`lazy loaded`).
- **Store**: `sessions.js` — É a store mais complexa da aplicação (236 linhas), por lidar com o salvamento de múltiplos arrays associados a uma única Sessão Pai.
- **Componentes**:
  - `SessaoAtualView.vue`: Listagem filtrada por campanha.
  - `SessionForm.vue`: Formulário gigante (404 linhas) dividindo as sub-entidades em "tabs".
  - `SessionDetailsView.vue`: Apresentação de dados somente leitura (303 linhas).

## Modelo de Dados

Este domínio tem alta fragmentação no banco de dados.

- `sessions` (Tabela Pai)
- 7 Sub-tabelas filhas ligadas via `session_id`:
  - `session_objetivos`
  - `session_ganchos_personagens`
  - `session_locais_interessantes` (Que por sua vez é pai de `session_locais_caracteristicas`)
  - `session_npcs_importantes`
  - `session_encontros_desafios`
  - `session_segredos_rumores`
  - `session_tesouros_recompensas`

## Problemas Conhecidos e Dívidas Técnicas Críticas

1. **`SessionDetailsView` Bypassa a Pinia**: O componente `SessionDetailsView.vue` executa **7 queries Supabase diretas dentro do componente** para carregar os dados de exibição. Isso viola totalmente o padrão MVC/State Management imposto no resto do app e dessincroniza a store.
2. **UX Ruim no Formulário (NPC ID)**: No `SessionForm.vue`, o campo para "NPCs Importantes" é uma caixa de texto HTML (type=number) que espera que o usuário *digite o ID numérico do banco de dados* do NPC, em vez de exibir um Select/Dropdown listando os NPCs pelo nome.
3. **Padrão Delete-and-Reinsert em Cascata**: Semelhante ao domínio de Entidades, a edição de Sessão apaga todos os locais, objetivos, etc., e reinsere tudo no Supabase. Sem transações, é um vetor forte para dados inconsistentes.
4. **Acoplamento de `Locais Interessantes`**: Como `session_locais_caracteristicas` depende de `session_locais_interessantes`, a store (`sessions.js`) faz a inserção de maneira sequencial no laço de repetição (`await` dentro de `for...of`), tornando a requisição de salvamento da sessão pesada e lenta.

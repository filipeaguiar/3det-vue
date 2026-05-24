## ADDED Requirements

### Requirement: Enriquecimento de Dados das Junções de Entidades
O backend SHALL realizar as junções SQL (`JOIN`) apropriadas para obter e retornar o nome, descrição e demais atributos de Perícias, Vantagens, Desvantagens e Técnicas associadas a cada ficha consultada (Personagens, NPCs e Monstros).

#### Scenario: Consulta de Detalhes de Entidade
- **WHEN** a API de busca de entidade (`GET /api/entities/[type]` ou `GET /api/entities/[type]/[id]`) é chamada
- **THEN** o sistema realiza o `JOIN` das tabelas de junção com as tabelas de referência (`vantagens`, `desvantagens`, `pericias`, `tecnicas`)
- **THEN** o sistema retorna uma resposta contendo arrays populados de objetos com o identificador (`id`), o nome (`name`) e a descrição (`description`) de cada relacionamento

### Requirement: Retrocompatibilidade de Resposta da API de Fichas
O backend SHALL injetar propriedades retrocompatíveis na resposta JSON da consulta para evitar quebras nos templates e componentes que dependem do formato legado.

#### Scenario: Injeção de Propriedades Baseadas no Tipo
- **WHEN** uma entidade do tipo `npcs` é consultada na API
- **THEN** o JSON de retorno SHALL incluir o array populado sob as chaves limpas (`vantagens`, `desvantagens`, `pericias`, `tecnicas`)
- **AND** SHALL também duplicar e formatar estes arrays sob as chaves específicas `npcs_vantagens`, `npcs_desvantagens`, `npcs_pericias` e `npcs_tecnicas` no padrão esperado `{ npc_id, vantagens: { name } }`

### Requirement: Unificação da Exibição de Fichas
O componente `EntityDetailsView.vue` SHALL exibir corretamente os relacionamentos da ficha independentemente de seu tipo (Personagem, NPC ou Monstro).

#### Scenario: Visualização de Ficha de NPC ou Monstro
- **WHEN** o usuário seleciona um NPC ou um Monstro para ver os detalhes
- **THEN** o sistema lê os dados dinamicamente utilizando computed properties retrocompatíveis
- **THEN** o sistema exibe corretamente todas as Perícias, Vantagens, Desvantagens e Técnicas associadas no painel de detalhes, em vez de mostrar "Nenhuma"

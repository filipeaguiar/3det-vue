## Context

O sistema de RPG 3DeT Victory possui três tipos principais de fichas de personagens (Entidades):
1. **Personagens Jogadores** (`personagens`)
2. **Personagens do Mestre** (`npcs`)
3. **Monstros do Bestiário** (`monstros`)

Cada um desses tipos possui tabelas de junção muitos-para-muitos idênticas na estrutura com as tabelas de referência do livro de regras (`vantagens`, `desvantagens`, `pericias` e `tecnicas`). Por exemplo, `personagens_vantagens` aponta para `personagens` e `vantagens`, enquanto `npcs_vantagens` aponta para `npcs` e `vantagens`.

Na migração da aplicação para a API serverless baseada em SQLite local:
- O backend passou a retornar os relacionamentos sob a chave simplificada `vantagens` com um mapeamento simples: `entity.vantagens = [{ id }]`.
- Porém, o frontend legou duas dependências críticas dessa estrutura:
  1. No componente de visualização de detalhes (`EntityDetailsView.vue`), os dados de relacionamentos são obtidos acessando a propriedade Supabase antiga e aninhada: `selectedEntity.personagens_vantagens` e lendo `v.vantagens.name`.
  2. No componente de formulário (`EntityForm.vue`), o `watch` que carrega a entidade em edição lê individualmente `newEntity.personagens_vantagens` ou `npcs_vantagens` ou `monstros_vantagens` para mapear os IDs selecionados.

Como essas chaves específicas do tipo e os nomes/dados das vantagens não estão no retorno da API SQLite, as Perícias, Vantagens, Desvantagens e Técnicas ficam inacessíveis nos detalhes (mostrando "Nenhuma") e são limpas do banco de dados na edição de qualquer ficha (o formulário carrega com arrays de relacionamentos vazios e sobrescreve o banco ao salvar).

## Goals / Non-Goals

**Goals:**
- Ajustar os endpoints de listagem e detalhes do backend para enriquecer as Perícias, Vantagens, Desvantagens e Técnicas associadas às entidades, recuperando o nome, custo e descrição através de cláusulas SQL `JOIN`.
- Implementar uma camada de retrocompatibilidade direta nas respostas da API, inserindo chaves dinâmicas baseadas no tipo de entidade sob demanda (ex: gerando `personagens_vantagens`, `npcs_vantagens` ou `monstros_vantagens` de forma compatível).
- Ajustar o `EntityDetailsView.vue` para aceitar de forma robusta e dinâmica as novas propriedades simplificadas unificadas (`selectedEntity.vantagens`), oferecendo perfeita retrocompatibilidade com fichas legadas caso necessário.
- Restabelecer o funcionamento correto do `EntityForm.vue` ao abrir fichas para edição, impedindo a perda de dados no banco de dados.

**Non-Goals:**
- Mudar ou reestruturar as tabelas do banco de dados (o banco SQLite físico continuará usando o modelo atual de 12 tabelas de junção).
- Criar novos endpoints além de corrigir os arquivos `/api/entities/[type]/index.js` e `[id].js`.

## Decisions

### 1. Injeção de JOINs no Servidor (SQLite API)
- **Abordagem**: Alterar os arquivos `/api/entities/[type]/index.js` e `/api/entities/[type]/[id].js` para fazer JOIN com as tabelas de referência ao buscar relacionamentos.
- **Justificativa**: Evita requisições extras no frontend e permite que os componentes mostrem descrições e custos detalhados sem a necessidade de reprocessar mapeamentos complexos em client-side.
- **Estrutura do Join (ex: Vantagens)**:
  `SELECT j.vantagem_id as id, r.name, r.cost, r.description FROM ${type}_vantagens j JOIN vantagens r ON j.vantagem_id = r.id WHERE j.${singular}_id = ?`

### 2. Retrocompatibilidade Dinâmica via JSON
- **Abordagem**: No backend, após resolver os arrays estruturados com `{ id, name, description }`, mapeamos esses valores em dois formatos no JSON de resposta:
  - **Formato Direto Simplificado**: `entity.vantagens = vantagens`
  - **Formato Legado Supabase**: `entity[`${type}_vantagens`] = vantagens.map(v => ({ vantagem_id: v.id, vantagens: { name: v.name } }))`
- **Justificativa**: Garante que o `EntityForm.vue` (que consome `personagens_vantagens` etc.) e qualquer outra lógica legada no aplicativo permaneçam funcionando imediatamente de forma transparente.

### 3. Computeds Dinâmicos no EntityDetailsView.vue
- **Abordagem**: Em `EntityDetailsView.vue`, criar computed properties que unificam o acesso às listas de relacionamentos, independentemente do tipo (`personagem`, `npc` ou `monstro`), priorizando o formato direto moderno com fallback para o formato legado aninhado.
- **Justificativa**: Garante um componente desacoplado e imune a mudanças futuras nas chaves do banco de dados.

## Risks / Trade-offs

- **[Risco]** Impacto de performance por fazer múltiplas queries por linha na listagem geral.
  - *Mitigação*: Como as campanhas de RPG possuem volumes muito baixos de fichas cadastradas por vez (<50 por campanha) e o banco local SQLite em memória/Vercel é extremamente veloz, realizar queries separadas em um laço simples oferece latência imperceptível (<15ms no total). Dispensa a necessidade de Joins agregados complexos com `GROUP_CONCAT`.

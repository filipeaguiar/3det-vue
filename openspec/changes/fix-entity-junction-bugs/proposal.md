## Why

Atualmente, a exibição e a edição de relacionamentos (Perícias, Vantagens, Desvantagens e Técnicas) na visualização de fichas (`EntityDetailsView.vue` e `EntityForm.vue`) estão quebradas para todos os tipos de entidades (Personagens, NPCs e Monstros). Isso ocorre porque a migração para a API local SQLite reestruturou o JSON de retorno (/api/entities/[type] e [id]) para propriedades diretas (ex: `entity.vantagens = [{ id }]`) apenas com o ID, sem fazer os Joins com as tabelas de referência para retornar o nome/descrição, e omitindo as chaves aninhadas Supabase legadas que o frontend espera (ex: `personagens_vantagens` com `{ vantagem_id, vantagens: { name } }`). Como resultado, os detalhes das fichas mostram sempre "Nenhuma" perícia/vantagem e, ao tentar editar qualquer ficha, todas as seleções salvas no formulário são limpas.

## What Changes

- **Joins e Resolução de Dados no Backend**: Atualizar os arquivos `/api/entities/[type]/index.js` e `/api/entities/[type]/[id].js` para fazer JOIN automático com as tabelas de referência (`vantagens`, `desvantagens`, `pericias` e `tecnicas`), enriquecendo o retorno com dados como `name`, `description`, `cost` e `requirements`.
- **Camada de Compatibilidade Estrita no Retorno**: No backend, estruturar a resposta do JSON para incluir tanto as chaves diretas limpas (`vantagens`, `desvantagens`, etc.) quanto as chaves legadas aninhadas dinâmicas (ex: `personagens_vantagens`, `npcs_vantagens` ou `monstros_vantagens` contendo a estrutura `{ vantagem_id, vantagens: { name } }`) conforme o tipo da entidade sob consulta.
- **Consistência nos Componentes Compartilhados**: Ajustar o componente de detalhes `EntityDetailsView.vue` para aceitar a nova estrutura simplificada direta, mantendo fallback de segurança para o modelo antigo, e garantir que o `EntityForm.vue` preencha as seleções corretamente na edição.

## Capabilities

### New Capabilities

*(Nenhuma nova capacidade de negócio está sendo criada)*

### Modified Capabilities

- `entidades`: Ajustes na especificação de dados e nos fluxos de consulta e exibição de Perícias, Vantagens, Desvantagens e Técnicas associadas.

## Impact

- **APIs**:
  - `/api/entities/[type]/index.js`: Enriquecimento da busca em lote de entidades com Joins e injeção de retrocompatibilidade.
  - `/api/entities/[type]/[id].js`: Ajustes equivalentes na consulta de detalhes de entidade única (GET) e limpeza/re-inserção consistente (PUT).
- **Componentes**:
  - `src/components/EntityDetailsView.vue`: Unificação da lógica de mapeamento de Perícias, Vantagens, Desvantagens e Técnicas para que funcione independentemente do tipo de entidade selecionada (Personagem, NPC ou Monstro).
  - `src/components/EntityForm.vue`: Correção na lógica do watch block para manter as vantagens e perícias preenchidas.

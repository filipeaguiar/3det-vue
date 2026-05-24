# 🐉 Entidades (Personagens, NPCs e Monstros)

## Visão Geral
O sistema de "Entidades" engloba tudo o que possui ficha de regras dentro da campanha: Personagens (jogadores), NPCs (personagens do mestre) e Monstros. Este é o domínio mais complexo e massivo da aplicação.

## Estado Atual

O gerenciamento é funcional e permite criar fichas completas com atributos, características e relacionamentos complexos, mas sofre pesadamente com duplicação de código.

### Funcionalidades
- CRUD completo das fichas (Atributos Básicos, PV, PM, PA).
- Gestão de Relacionamentos muitos-para-muitos: Vantagens, Desvantagens, Perícias e Técnicas.
- Upload de imagem de avatar.
- Filtro inteligente: Exibe as entidades vinculadas à Campanha Ativa + Entidades Globais (com `campaign_id` nulo).

### Arquitetura (Duplicação Massiva)
A arquitetura atual praticamente copiou e colou a mesma estrutura três vezes (uma para cada tipo de entidade).
- **Views (Quase idênticas)**: `PersonagensView.vue`, `NpcsView.vue`, `BestiarioView.vue`.
- **Stores (Quase idênticas)**: `personagens.js`, `npcs.js`, `monstros.js` (~280 linhas cada).
- **Componentes Compartilhados**:
  - `EntityListView.vue` (lista).
  - `EntityForm.vue` (O maior componente da app: 461 linhas. Muito complexo por acomodar os 3 tipos através de condicionais `v-if`).
  - `EntityDetailsView.vue` (Visualização dos dados da entidade).

## Modelo de Dados

### Tabelas Core
- `personagens`
- `npcs`
- `monstros`
*(Estas três tabelas têm esquemas virtualmente idênticos: nome, atributos (H, P, R), stats (PV, PM, PA), arquétipo, etc).*

### Tabelas de Ligação (Junction Tables)
São 12 tabelas para lidar com os relacionamentos N:M:
- Para personagens: `personagens_pericias`, `personagens_vantagens`, `personagens_desvantagens`, `personagens_tecnicas`
- Para NPCs: `npcs_pericias`, `npcs_vantagens`, `npcs_desvantagens`, `npcs_tecnicas`
- Para monstros: `monstros_pericias`, `monstros_vantagens`, `monstros_desvantagens`, `monstros_tecnicas`

## Problemas Conhecidos e Dívidas Técnicas Críticas

1. **Massiva Duplicação de Código (DRY)**: A existência de 3 stores e 3 views separados para lidar com estruturas de dados 95% idênticas é um grande problema de manutenção.
2. **Tabelas de Banco de Dados Duplicadas**: Ter 3 tabelas base e 12 tabelas de ligação, em vez de 1 tabela genérica `entities` (com uma coluna discriminadora `type`) e 4 tabelas de ligação genéricas.
3. **`EntityDetailsView` Quebrado**: O componente hardcodou as chaves do objeto de resposta Supabase (`personagens_pericias`, `personagens_vantagens`), fazendo com que ele **falhe silenciosamente ao exibir dados de NPCs e Monstros**.
4. **Integração do ImageUpload Quebrada**: Há um descasamento de props/eventos. `EntityForm.vue` espera `@image-uploaded` e passa `:currentImageUrl`, enquanto `ImageUpload.vue` usa o padrão v-model (`modelValue` / `@update:modelValue`). O upload de imagem muito provavelmente não funciona na edição.
5. **Pattern de Edição (Delete & Reinsert)**: Ao atualizar Vantagens/Desvantagens/etc. em uma entidade, a store deleta todas as ligações e as insere novamente, **sem envolver isso numa transação do banco**. Isso pode gerar registros órfãos ou perdidos se houver falha de rede.
6. **Poluição por Logs e Variáveis Naming**: Diversos `console.log` deixados em produção nas stores. Há também uma mistura perigosa de casing nas colunas do Supabase (ex: `Habilidade`, `Poder` em PascalCase vs `campaign_id` em snake_case).

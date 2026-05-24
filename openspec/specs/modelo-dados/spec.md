# 🗄️ Modelo de Dados

## Visão Geral
A aplicação utiliza o **PostgreSQL** através do serviço do Supabase. O banco de dados faz uso extensivo do recurso de **Row Level Security (RLS)** do Postgres para garantir o isolamento Multi-Tenant: cada Mestre (usuário) enxerga estritamente os seus próprios dados sem que o aplicativo precise filtrar isso explicitamente no Backend (segurança em nível de linha).

Existem mais de 27 tabelas e nenhum arquivo de "Migration" SQL existe dentro do repositório `.git`. Todo o banco tem sido gerenciado diretamente pelo dashboard do Supabase, o que dificulta reconstruir o estado do banco num ambiente de desenvolvimento limpo.

## Diagrama Entidade-Relacionamento

```text
    [ auth.users ] (gerenciado pelo Supabase)
          |
          ▼
    [ profiles ]
          |
          ▼
   [ campaigns ] ──────┐
          |            |
          ├──▶ [ campaign_chapters ]
          |            |
          ├──▶ [ personagens ] ───────▶ (personagens_*)
          |            |                    │
          ├──▶ [ npcs ] ──────────────▶ (*_vantagens, *_desvantagens, *_pericias, *_tecnicas)
          |            |                    │
          ├──▶ [ monstros ] ──────────▶ (monstros_*)
          |
          ▼
    [ sessions ] ──────┐
          |            |
          ├──▶ [ session_objetivos ]
          ├──▶ [ session_ganchos_personagens ]
          ├──▶ [ session_locais_interessantes ] ──▶ [ session_locais_caracteristicas ]
          ├──▶ [ session_npcs_importantes ]
          ├──▶ [ session_encontros_desafios ]
          ├──▶ [ session_segredos_rumores ]
          └──▶ [ session_tesouros_recompensas ]
```

## Tabelas de Referência do RPG 3DeT (ReadOnly / Sistema)
Nessas tabelas não há a coluna `user_id`, pois contêm as regras-base do jogo fornecidas pela editora:
- `vantagens` (id, name, cost, description, requirements)
- `desvantagens` (id, name, cost, description)
- `pericias` (id, name, description)
- `tecnicas` (id, name, cost, description, duration, requirements)

## Tabelas Dinâmicas (User Scoped)
Possuem colunas obrigatórias como `user_id` e a política de RLS ativada.

### Entidades Core
- `campaigns` (id, name, description, user_id)
- `personagens` (id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id, user_id)
- `npcs` (Colunas idênticas a personagens)
- `monstros` (Colunas idênticas a personagens)

### Ligações Many-to-Many (A Grande Duplicação)
Em vez de haver uma única tabela abstrata (`entity_id`, `entity_type`, `vantagem_id`), a arquitetura criou uma tabela física individual para conectar cada entidade a cada aspecto das regras, totalizando 12 tabelas:
- `personagens_vantagens`, `personagens_desvantagens`, `personagens_pericias`, `personagens_tecnicas`
- `npcs_vantagens`, `npcs_desvantagens`, `npcs_pericias`, `npcs_tecnicas`
- `monstros_vantagens`, `monstros_desvantagens`, `monstros_pericias`, `monstros_tecnicas`

### Armazenamento de Sessões e "Lazy GM"
- `sessions` (id, campaign_id, title, description, comeco_forte, gancho_proxima_aventura, user_id)
*(E mais as 7 tabelas filhas detalhadas no Diagrama ER)*

## Problemas Conhecidos e Dívidas Técnicas Críticas

1. **Sem Controle de Versão (No Migrations)**: Não existem os scripts DDL (.sql) no repositório. O arquivo `database.types.ts` é o único indício do schema. Isso impossibilita deploy seguro ou espelhamento em novo ambiente sem intervenção manual na interface gráfica do Supabase.
2. **Casing (Camel vs Snake) Inconsistente**: Colunas do banco estão fragmentadas. Atributos vindos do sistema de RPG estão em PascalCase ou Title_Case (ex: `Habilidade`, `Pontos_Acao`), enquanto campos sistêmicos seguem o padrão PostgreSQL em snake_case (ex: `user_id`, `campaign_id`). Isso confunde parseamento nos objetos do Vue.
3. **Tipos Incorretos**: A coluna `pontos` nas tabelas de personagens foi declarada como texto (`string`/`text`) em vez de valor inteiro numérico, prejudicando somatórias de banco ou ordenações e forçando o parser a fazer Type Cast via Javascript no frontend.
4. **Relacionamentos sem Chave Estrangeira Estrita (Strings Lossy)**: A tabela de ganchos (`session_ganchos_personagens`) grava a propriedade `personagem_name` (texto livre com o nome do boneco) em vez de gravar um `personagem_id` apontando adequadamente pra tabela `personagens`. Se o personagem mudar de nome, o gancho fica desatualizado permanentemente e quebra links de navegação.

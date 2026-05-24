## Why

O projeto migrou do Supabase (PostgreSQL) para Turso (libSQL), e os dados do backup antigo do cluster Supabase (`db_cluster-04-09-2025@03-12-59.backup`) precisam ser importados para o novo banco. Existe um script de migração anterior (`migrate-backup.js`), mas ele precisa ser atualizado para refletir os requisitos atuais:

- **Dados do jogo** (vantagens, desvantagens, perícias, técnicas) devem ser importados como dados globais, acessíveis a **todos os usuários**.
- **Dados específicos do usuário** (campanhas, personagens, NPCs, monstros, sessões e sub-tabelas) devem ser importados e vinculados ao usuário `filipe_aac@yahoo.com`.

## What Changes

- Atualizar o script de migração `migrate-backup.js` para:
  - Resolver o `user_id` do usuário `filipe_aac@yahoo.com` dinamicamente no banco Turso (em vez de hardcoded UUID).
  - Importar tabelas de referência (vantagens, desvantagens, perícias, técnicas) sem vincular a nenhum usuário — elas são dados globais de regras do sistema 3DeT Victory.
  - Importar campanhas, capítulos, personagens, NPCs, monstros e todas as tabelas de junção (vantagens/desvantagens/perícias/técnicas de cada entidade) vinculados ao `user_id` do `filipe_aac@yahoo.com`.
  - Importar sessões e todas as sub-tabelas de sessão vinculadas ao mesmo usuário.
  - Lidar com conflitos via `INSERT OR IGNORE` para dados de referência e `INSERT OR REPLACE` para dados de usuário.
- Adicionar tratamento de erros robusto e log de progresso detalhado.
- Garantir que o usuário `filipe_aac@yahoo.com` já exista no banco antes da importação (validação pré-migração).

## Capabilities

### New Capabilities
- `backup-import`: Script de importação de dados do backup PostgreSQL/Supabase para o banco Turso/libSQL, com separação entre dados globais de regras e dados específicos do usuário.

### Modified Capabilities
_(nenhuma — esta mudança não altera specs de comportamento existentes, apenas executa uma migração de dados pontuais)_

## Impact

- **Arquivo principal**: `migrate-backup.js` — reescrita para atender os novos requisitos.
- **Banco de dados Turso**: Dados serão inseridos/atualizados nas tabelas existentes conforme o schema em `api/schema.sql`.
- **Dependências**: `@libsql/client`, `dotenv` (já existentes no projeto).
- **Tabelas afetadas**:
  - Globais (todos os usuários): `vantagens`, `desvantagens`, `pericias`, `tecnicas`
  - Específicas (filipe_aac@yahoo.com): `campaigns`, `campaign_chapters`, `personagens`, `npcs`, `monstros`, `sessions`, e todas as tabelas de junção e sub-tabelas de sessão.
- **Risco**: Baixo — usa `INSERT OR IGNORE`/`INSERT OR REPLACE`, não destrói dados existentes.

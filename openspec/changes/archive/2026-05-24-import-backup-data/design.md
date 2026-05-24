## Context

O projeto 3DeT Victory migrou do Supabase (PostgreSQL) para Turso (libSQL). O backup `db_cluster-04-09-2025@03-12-59.backup` contém um dump completo do cluster PostgreSQL do Supabase, incluindo schemas `auth`, `public`, `storage`, e `realtime`.

Apenas os dados do schema `public` são relevantes para importação. O script existente `migrate-backup.js` já implementa o parsing do formato COPY do PostgreSQL e a inserção no Turso, mas usa um UUID hardcoded para o usuário-alvo.

O banco Turso atual usa autenticação própria (bcrypt + JWT) definida em `api/auth/`, com tabela `users` local. O usuário `filipe_aac@yahoo.com` já deve existir no banco Turso com seu próprio UUID gerado na criação da conta.

## Goals / Non-Goals

**Goals:**
- Importar dados de referência do jogo (vantagens, desvantagens, perícias, técnicas) como dados globais compartilhados entre todos os usuários.
- Importar dados específicos (campanhas, capítulos, personagens, NPCs, monstros, sessões e sub-tabelas) vinculados ao usuário `filipe_aac@yahoo.com`.
- Resolver o `user_id` dinamicamente consultando a tabela `users` pelo email, eliminando UUIDs hardcoded.
- Manter compatibilidade com o schema existente em `api/schema.sql`.

**Non-Goals:**
- Não importar dados de autenticação (schema `auth`) — o novo sistema de auth é independente.
- Não importar dados de storage (schema `storage`), realtime, ou migrations do Supabase.
- Não criar funcionalidade de importação genérica reutilizável na UI — este é um script de migração pontual.
- Não alterar o schema do banco de dados.

## Decisions

### 1. Resolução dinâmica do `user_id`

**Decisão**: Consultar `SELECT id FROM users WHERE email = ?` no início do script, em vez de usar UUID hardcoded.

**Alternativa considerada**: Manter UUID hardcoded como o script anterior. Rejeitado porque é frágil — o UUID muda se o usuário for recriado.

### 2. Dados de referência sem `user_id`

**Decisão**: As tabelas `vantagens`, `desvantagens`, `pericias`, `tecnicas` no schema SQLite **não possuem** coluna `user_id`. Elas são naturalmente globais. Usar `INSERT OR IGNORE` para evitar duplicatas.

### 3. Parsing do backup PostgreSQL

**Decisão**: Manter a lógica de parsing existente do `migrate-backup.js`, que:
- Lê o arquivo texto completo.
- Usa regex `COPY public.(\w+) (...) FROM stdin;` para identificar blocos de dados.
- Parseia linhas tab-separated até encontrar `\.`.
- Decodifica escapes PostgreSQL (`\N` → null, `\n` → newline, etc.).

### 4. Estratégia de conflitos

**Decisão**:
- `INSERT OR IGNORE` para tabelas de referência (evita sobrescrever dados que podem ter sido editados).
- `INSERT OR REPLACE` para dados de usuário (garante que o estado mais recente do backup prevaleça).

### 5. Execução em uma única transação vs. por batch

**Decisão**: Execução sequencial sem transação explícita, como o script anterior. O Turso suporta reconexão automática e cada `INSERT` é atômico.

**Alternativa**: Usar `db.batch()` do libSQL. Porém, o volume de dados é pequeno (~500KB de backup) e a simplicidade é preferível.

## Risks / Trade-offs

- **Usuário inexistente** → O script DEVE falhar rapidamente com mensagem clara se `filipe_aac@yahoo.com` não existir no banco Turso.
- **IDs conflitantes** → Os UUIDs originais do PostgreSQL são preservados. Se já existirem no Turso, `INSERT OR REPLACE` os sobrescreve. Risco baixo pois UUIDs são únicos globalmente.
- **Imagens referenciadas** → O campo `image` de personagens/NPCs/monstros pode referenciar URLs do Supabase Storage que não existem mais. O script importa os valores como estão, sem validação.
- **Foreign keys** → A ordem de inserção é crítica: referências primeiro, depois campanhas, depois entidades, depois junções, depois sessões. O script existente já segue essa ordem.

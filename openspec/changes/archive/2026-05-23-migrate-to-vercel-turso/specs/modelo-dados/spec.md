## MODIFIED Requirements

### Requirement: Modelagem de Banco Relacional Distribuído
O banco de dados DEVE ser completamente transportado do dialeto PostgreSQL para o formato libSQL (SQLite) compatível com o provedor Turso, preservando todo o esquema estático (Perícias, Regras) e os diagramas e chaves estrangeiras originais.

#### Scenario: Integridade Referencial no SQLite
- **WHEN** o schema de banco de dados for inicializado no Turso via migrações manuais (`schema.sql`)
- **THEN** o banco DEVE manter ativas as restrições de chaves estrangeiras (`PRAGMA foreign_keys = ON;`) e estabelecer exclusões em cascata estritas (`ON DELETE CASCADE`) para garantir que uma campanha deletada limpe os seus personagens automaticamente — removendo essa obrigatoriedade/lógica errada de limpeza no frontend atual (Store).

#### Scenario: Migração de Permissões e RLS
- **WHEN** configurando a segurança do banco no Turso
- **THEN** diferentemente do PostgreSQL no Supabase, RLS (Row Level Security) não será declarado nativamente no banco. A segurança dos dados DEVE ser programaticamente validada no escopo das serverless functions (`WHERE user_id = ?`). Uma nova tabela `users` DEVE existir fisicamente no arquivo do Turso.

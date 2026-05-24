## 1. Setup Infraestrutura e Dependências

- [x] 1.1 Remover a dependência `@supabase/supabase-js` e configurar o `package.json` para suportar o ecossistema Vercel.
- [x] 1.2 Instalar `@libsql/client` para conexão com o banco de dados Turso no backend.
- [x] 1.3 Instalar bibliotecas de suporte ao Storage (ex: `@vercel/blob`) e Autenticação (ex: `jose` para JWT, ou biblioteca Auth escolhida).
- [x] 1.4 Configurar o ambiente local com as variáveis de conexão do Turso e Vercel.
- [x] 1.5 Criar a estrutura base de Serverless Functions (pasta `/api`).

## 2. Banco de Dados Turso (SQLite)

- [x] 2.1 Desenvolver o arquivo `schema.sql` reescrevendo o schema original do PostgreSQL do Supabase para SQLite (removendo features específicas do Postgres e definindo PRAGMA).
- [x] 2.2 Incluir fisicamente a tabela `users` no novo arquivo SQLite (já que o auth.users do Supabase será removido).
- [x] 2.3 Criar um arquivo client `/api/utils/db.js` para conectar o `@libsql/client` ao banco remoto/local.
- [x] 2.4 Migrar/inserir as regras base do RPG (Seed de Vantagens, Desvantagens, Técnicas, Perícias) no Turso.

## 3. Autenticação e Autorização (API e Frontend)

- [x] 3.1 Criar funções serverless para `/api/auth/register`, `/api/auth/login` (que gerem tokens HTTP-Only).
- [x] 3.2 Criar rota de validação `/api/auth/session` e utilitário middleware de proteção de rotas privadas na `/api`.
- [x] 3.3 Refatorar `AuthView.vue` para consumir os novos endpoints em vez de invocar diretamente o SDK do Supabase.
- [x] 3.4 Refatorar a store `auth.js` e limpar o `router/index.js` para não fazer chamadas de rede abusivas (caching da sessão).

## 4. Camada de API Serverless (Endpoints)

- [x] 4.1 Criar rota de arquivos `/api/upload` conectando ao Vercel Blob.
- [x] 4.2 Criar endpoints de Campanhas e Capítulos (`/api/campaigns` e `/api/campaigns/[id]/chapters`), protegendo com validação de `userId`.
- [x] 4.3 Criar rotas públicas (leitura) para as regras (`/api/rules/...`).
- [x] 4.4 Criar endpoints robustos para as Entidades (`/api/entities/...`), fazendo uso obrigatório de `transaction()` no insert/update de chaves Many-To-Many.
- [x] 4.5 Criar endpoints para as Sessões (`/api/sessions/...`), encapsulando a complexidade das 7 sub-tabelas em transações seguras no backend.

## 5. Refatoração Frontend (Stores e Componentes)

- [x] 5.1 Atualizar as stores estáticas (`vantagens.js`, `pericias.js`, etc.) para bater nos novos endpoints `fetch`.
- [x] 5.2 Refatorar as stores de entidades (`personagens.js`, `npcs.js`, `monstros.js`) e remover o padrão arriscado de Delete-And-Reinsert em favor da chamada da API segura.
- [x] 5.3 Refatorar a store `campaigns.js` para delegar o "Cascade Delete" ao novo backend/banco de dados, limpando código sujo do client-side.
- [x] 5.4 Refatorar fortemente o componente `SessionDetailsView.vue` (removendo a lógica que contorna a Pinia e faz 7 queries de Supabase diretas) para consumir dados apropriados.
- [x] 5.5 Arrumar as integrações quebradas do `ImageUpload.vue` e adaptá-las para conversar com `/api/upload`.

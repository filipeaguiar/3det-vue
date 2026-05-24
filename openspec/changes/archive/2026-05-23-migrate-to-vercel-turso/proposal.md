## Why

A aplicação atualmente utiliza Supabase como BaaS (Backend as a Service) para autenticação, banco de dados (PostgreSQL) e armazenamento. Para otimizar o deploy, aproveitar a arquitetura edge e experimentar novas tecnologias, queremos migrar a hospedagem do frontend para a **Vercel** e o banco de dados para o **Turso** (SQLite distribuído na edge). Essa mudança visa simplificar a infraestrutura e preparar a aplicação para um ecossistema mais focado em Serverless/Edge.

## What Changes

- **Hospedagem Frontend**: Configuração do projeto para deploy contínuo na Vercel.
- **Banco de Dados**: Substituição do PostgreSQL (Supabase) pelo SQLite distribuído (Turso).
- **Camada de Backend (API)**: Como o Turso e o frontend puro não proveem Row Level Security (RLS) out-of-the-box como o Supabase, será necessário introduzir Vercel Serverless Functions (API routes) para intermediar a comunicação com o banco e garantir o isolamento de dados por usuário.
- **Autenticação**: Remoção do Supabase Auth. Será necessário adotar uma nova solução (ex: Auth.js, Lucia, Firebase Auth ou JWT próprio) gerenciada através das rotas de API da Vercel.
- **Storage**: Remoção do Supabase Storage (usado para avatares). Adoção de um novo provedor (ex: Vercel Blob).
- **BREAKING**: A migração exigirá reescrita de todas as operações de banco de dados, abandonando o SDK do Supabase e o uso de chamadas diretas do frontend ao banco.

## Capabilities

### New Capabilities
- `api-serverless`: Criação de uma camada de API utilizando Vercel Functions para intermediar chamadas ao banco Turso, abstraindo as regras de segurança (RLS).
- `novo-storage`: Implementação de um sistema de armazenamento de arquivos (ex: Vercel Blob) para substituir o Supabase Storage.

### Modified Capabilities
- `infraestrutura`: Migração do ambiente de deploy (Vite SPA -> Vercel) e alteração do banco (Supabase -> Turso).
- `autenticacao`: Substituição completa do provedor de identidade.
- `modelo-dados`: Adaptação do schema relacional do PostgreSQL para o SQLite do Turso, incluindo reestruturação das lógicas de validação.

## Impact

- **Pinia Stores**: As 11 stores (personagens, npcs, monstros, etc.) sofrerão refatoração profunda. O SDK do Supabase será removido, e as stores passarão a consumir as novas rotas da API via requisições HTTP (fetch).
- **Componentes Vue**:
  - `SessionDetailsView.vue`: Precisará ser refatorado para parar de fazer chamadas diretas ao banco (Supabase) e passar a usar a respectiva store.
  - `AuthView.vue`: Terá sua lógica reescrita para conversar com o novo provedor de autenticação.
  - `EntityForm.vue` e `ImageUpload.vue`: A lógica de upload de imagens será adaptada para o novo provedor de storage.
- **Serviços**: Remoção de `src/services/supabase.js`.
- **Dependências (`package.json`)**: Remoção de `@supabase/supabase-js`. Adição das bibliotecas de auth e client do Turso (`@libsql/client`) apenas no escopo das serverless functions.

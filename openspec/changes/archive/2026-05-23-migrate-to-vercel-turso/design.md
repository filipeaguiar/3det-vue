## Context

A aplicação foi originalmente construída usando Vue 3 + Vite, e conectada diretamente ao Supabase para autenticação, banco de dados (PostgreSQL com RLS) e storage. Essa arquitetura de "client-side fetching" é rápida de desenvolver, mas atrela fortemente o frontend ao provedor.
Queremos migrar para a Vercel e usar o banco Turso (SQLite Edge). Como o Turso e Vercel não têm Auth nativo integrado ao banco para RLS (como o Supabase), não podemos conectar do frontend direto para o banco de dados. Precisaremos de uma camada de API (backend) para validar a sessão e intermediar as requisições com a devida segurança.

## Goals / Non-Goals

**Goals:**
- Mudar a hospedagem para Vercel.
- Mudar o Banco de Dados para Turso (SQLite Distribuído).
- Implementar Vercel Serverless Functions (`/api/*`) como backend BFF (Backend for Frontend).
- Migrar Autenticação (novo DB + Tokens).
- Migrar Storage de imagens para Vercel Blob.

**Non-Goals:**
- Não reescreveremos o frontend (Vue) para frameworks meta como Nuxt. Manteremos a SPA com Vite.
- Não alteraremos as regras do jogo RPG 3DeT Victory nem a interface gráfica (UI) - a aparência continuará a mesma.
- Não faremos neste momento a refatoração massiva para reduzir a duplicação de componentes/stores no front (Personagens, Monstros, NPCs), isso deve ser uma spec/mudança à parte. O foco aqui é migração infra.

## Decisions

1. **Camada de API (Vercel Functions)**: Adotaremos endpoints na pasta `/api/` (suportada out-of-the-box pela Vercel) que rodam funções Serverless. As Pinia Stores no frontend chamarão rotas como `GET /api/campaigns`, substituindo as chamadas nativas do SDK do Supabase. A API se conectará ao Turso.
2. **Autenticação Segura**: Usaremos uma abordagem com Cookies `HttpOnly` manipulada via backend Serverless. A nova tabela de usuários será incluída no Turso. O middleware (roteamento) verificará o token/cookie e injetará o `userId` em todas as consultas ao Turso (simulando a mecânica de Row Level Security).
3. **Storage de Arquivos**: Usaremos o **Vercel Blob** para armazenar imagens de personagens, em total substituição ao Supabase Storage. É simples e a API dele é muito semelhante.
4. **Driver de Banco**: Usaremos `@libsql/client` (SDK oficial do Turso) na camada de `/api`.
5. **Transações Database**: Como o padrão atual do front faz *delete and reinsert* com múltiplas chamadas para atualizar relações N:M (o que é perigoso sem RLS e sem transação estrita), implementaremos **Transações SQL** explícitas (`client.transaction()`) nas Vercel Functions para garantir a atomicidade (tudo ou nada) das edições de entidades e sessões.

## Risks / Trade-offs

- **[Risco] Vercel Functions Cold Starts**: Rotas serverless possuem um pequeno atraso ao ligar na primeira requisição após inatividade. → **Mitigação**: O uso do Turso (banco de dados edge que responde rápido) e queries enxutas na API minimizam a latência.
- **[Risco] SPA chamando Serverless e SEO**: A falta de SSR (como no Nuxt) pode manter um atraso de network nas primeiras telas. → **Mitigação**: Como o aplicativo é um dashboard fechado (painel do mestre), SEO não é prioritário, e o caching do Pinia no lado do cliente garantirá fluidez na navegação subsequente.
- **[Trade-off] Introdução de Código de Backend**: Antes tínhamos "zero" código de backend, pois toda a regra estava nas stores Pinia usando SDK e RLS do Supabase. Agora teremos uma nova camada `/api` que aumenta a verbosidade e as responsabilidades de desenvolvimento (endpoints, parse body, etc).
- **[Trade-off] Migração de Dados de Produção**: Os dados atuais no Postgresql terão que ser extraídos, convertidos e migrados para o Turso SQLite, ou iniciados do zero (se ainda não houver base produtiva real).

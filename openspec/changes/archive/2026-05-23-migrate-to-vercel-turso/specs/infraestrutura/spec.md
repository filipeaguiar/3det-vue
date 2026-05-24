## REMOVED Requirements

### Requirement: Dependência e Inicialização do Supabase JS
**Reason**: O serviço de banco de dados e autenticação serão alterados.
**Migration**: Remover o pacote `@supabase/supabase-js`. As rotas `/api` passarão a utilizar o cliente de banco nativo (`@libsql/client`), e as stores do Vue farão requisições HTTP normais (`fetch`). Deletar o arquivo `src/services/supabase.js`.

## MODIFIED Requirements

### Requirement: Build e Deploy Frontend
A arquitetura do projeto DEVE ser compatível e otimizada para implantação automática na Vercel (CI/CD).

#### Scenario: Build da aplicação pela Vercel
- **WHEN** um novo commit é enviado para o repositório (`git push`)
- **THEN** a plataforma Vercel builda a pasta de funções Serverless `/api` de forma integrada à compilação do Vite SPA (`dist`), mapeando as requisições API dinâmicas corretamente enquanto serve os ativos estáticos pelo CDN global.

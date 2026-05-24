## MODIFIED Requirements

### Requirement: Controle de Sessão e Autenticação
O sistema DEVE utilizar uma lógica própria ou bibliotecas gerenciadas por backend (como cookies HTTP-Only e Vercel APIs) no lugar das APIs integradas de auth do Supabase.

#### Scenario: Login com sucesso via Backend
- **WHEN** o usuário envia seu email e senha através do componente `AuthView.vue`
- **THEN** o frontend aciona o novo endpoint `POST /api/auth/login`. A API do backend checa credenciais na nova tabela de users no Turso e retorna um token de sessão via Set-Cookie `HttpOnly`, dificultando roubo de tokens via XSS.

#### Scenario: Sessão Global e Fim da Repetição de Request (Correção de Bug)
- **WHEN** o usuário navega entre rotas protegidas usando o Vue Router
- **THEN** o router guard (ou store de Auth) utiliza o cache local no Pinia ou solicita validação via API uma única vez. **Não DEVE** ser disparada uma requisição de validação de sessão na API (antigo `fetchUser()`) a cada clique no link (corrigindo a dívida técnica atual).

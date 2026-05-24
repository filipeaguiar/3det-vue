# 🔐 Autenticação

## Visão Geral
O sistema de autenticação gerencia o acesso dos usuários à aplicação. É uma implementação básica utilizando o Supabase Auth (email e senha), que protege as rotas privadas e asocia os dados criados (campanhas, personagens, etc.) ao usuário logado.

## Estado Atual

Atualmente, a aplicação possui um fluxo de login e registro funcional, mas com uma arquitetura de gerenciamento de estado ligeiramente fragmentada.

### Componentes Envolvidos
- `src/views/AuthView.vue`: Lida com o formulário de login e registro. As chamadas à API do Supabase (`signInWithPassword` e `signUp`) são feitas DIRETAMENTE neste componente, em vez de passar pela store.
- `src/App.vue`: Assina as mudanças de estado de autenticação (`supabase.auth.onAuthStateChange`) e inicializa o usuário no carregamento.
- `src/router/index.js`: Implementa o guard de navegação (`beforeEach`). Protege rotas exigindo autenticação e redireciona para `/auth` se o usuário não estiver logado.

### Store de Autenticação (`src/stores/auth.js`)
A store gerencia o estado da sessão:
- **State**: `user`, `session`, `loading`, `error`
- **Actions**: `setSession()`, `setUser()`, `signOut()`, `fetchUser()`

## Modelo de Dados
- Tabela Supabase subjacente: `auth.users` (gerenciada pelo próprio Supabase).
- Tabela de Perfil Pública: `profiles` (id, username, full_name, avatar_url) ligada à tabela `auth.users` através de uma constraint de chave estrangeira.

## Problemas Conhecidos e Dívidas Técnicas

1. **`fetchUser()` Chamado em Toda Navegação**: O guard do router chama `authStore.fetchUser()` em CADA troca de rota. Isso faz uma chamada de rede não necessária para o Supabase a cada clique, causando latência e possível bloqueio por limite de requisições. O estado da store deve atuar como cache após o carregamento inicial.
2. **AuthView Bypassa a Store**: As ações de login e registro (`signUp` / `signInWithPassword`) não estão encapsuladas na `authStore`. Elas acontecem diretamente no `AuthView.vue`.
3. **Ausência de Fluxos Secundários**: Não há interface ou lógica implementada para:
   - Recuperação de senha ("Esqueci minha senha")
   - Confirmação de e-mail
   - Login Social (OAuth: Google, GitHub, etc.)
4. **Sem Perfil de Usuário na UI**: Embora a tabela `profiles` pareça existir na definição de tipos do DB, não há interface para o usuário visualizar ou editar seu perfil na aplicação.

## Requisitos

### Requisito: Layout do AuthView
O sistema SHALL exibir o formulário de login e registro em uma interface dedicada e imersiva para o usuário.

#### Cenário: Visualização do AuthView
- **WHEN** o usuário não está autenticado e é redirecionado ou navega para a rota `/auth`
- **THEN** o sistema oculta a navegação superior (Header e Nav) do site
- **THEN** o sistema exibe a página em tela cheia (fullscreen) ocupando 100% da viewport (100vw e 100vh) sem margens
- **THEN** o sistema apresenta a imagem de plano de fundo do tema 3DeT (hero image)
- **THEN** o sistema exibe o formulário centralizado com um estilo _Glassmorphism_ translúcido que preserva a legibilidade independentemente do background

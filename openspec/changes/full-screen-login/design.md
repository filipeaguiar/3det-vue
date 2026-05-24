## Context

A atual tela de autenticação (`AuthView.vue`) utiliza um design muito utilitário, com fundo de cor sólida (slate) e formulário centralizado. O RPG 3DeT Victory possui uma identidade visual muito marcante (anime, sci-fi, heróis). A intenção é trazer essa identidade visual logo para o primeiro contato do usuário com o app, criando uma "landing page" épica com imagem de tela cheia.

## Goals / Non-Goals

**Goals:**
- Prover um visual impactante e imersivo (fullscreen) para o `/auth`.
- Ocultar qualquer elemento de navegação ou título global da aplicação caso o usuário esteja nesta tela.
- Manter o fluxo de lógica existente (registro, login, redirecionamento via cookies) inalterado.
- Adicionar a imagem fornecida pelo usuário como pano de fundo de alta qualidade.
- Implementar efeito _Glassmorphism_ (translucidez + desfoque de fundo) no card do formulário para garantir contraste com a imagem.

**Non-Goals:**
- Mudar regras de negócio do Auth.
- Adicionar login social ou "esqueci minha senha" nesta iteração.
- Reescrever os endpoints de API criados na iteração anterior.

## Decisions

- **Uso do Tailwind para UI Glass:** O design de "vidro" será alcançado usando as utilidades nativas do Tailwind 4 `bg-white/10` (ou preta), `backdrop-blur-md` e bordas translúcidas.
- **Ocultação de Navegação Global:** O componente base `App.vue` precisará saber quando ocultar a tag `<header>` e `<nav>`. Isso será feito com o `useRoute` e verificação da rota atual (`route.path === '/auth'`). 
- **Ocupação de Tela Cheia:** O container principal do `App.vue` hoje adiciona um padding (`p-4 sm:p-6 md:p-8`) e classes limitadoras em todos os filhos da `<main>`. Precisaremos remover a estilização estrita de padding do App.vue APENAS na rota Auth, permitindo que o `<router-view>` expanda 100%. Uma alternativa mais limpa será aplicar essas restrições não no Wrapper do App, mas sim no `main` apenas se não for a rota de Auth.
- **Alocação de Imagem:** A imagem épica será salva na pasta `src/assets/hero-login.jpg` e importada no componente `AuthView.vue` de forma estática para garantir que o Vite a otimize no build.

## Risks / Trade-offs

- [Risk] Legibilidade do formulário comprometida dependendo das cores predominantes na imagem escolhida.
  → **Mitigation**: Usar sobreposições escuras consistentes (`bg-slate-900/60` com `backdrop-blur-lg`) para criar um "palco" no qual o texto do formulário tenha alto contraste em branco, independente da foto de fundo.
- [Risk] A imagem fornecida ser pesada demais, impactando o LCP (Largest Contentful Paint) inicial.
  → **Mitigation**: Certificar-se que a imagem passa pelo build tool do Vite. Evitar arquivos nativos absurdos. Recomendável comprimir antes do commit.

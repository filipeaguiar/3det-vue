# 🏗️ Infraestrutura e Arquitetura

## Visão Geral
A infraestrutura do aplicativo define uma SPA (Single Page Application) hospedada e controlada estaticamente via Vite, enquanto o ecossistema de Backend as a Service (BaaS) Supabase cuida de toda a segurança (RLS), autorização, armazenamento e roteamento de API.

## Estado Atual da Stack

- **Framework Core**: Vue 3 (Composition API / `<script setup>`)
- **Bundler e Dev Tooling**: Vite 7
- **CSS Framework**: Tailwind CSS 4 (`@tailwindcss/vite`)
- **Estado (State Management)**: Pinia 3
- **Routing**: Vue Router 4
- **Backend / DB / Auth**: Supabase JS SDK 2.50

### Diagrama de Camadas

```
┌─────────────────────────────────────┐
│             UI / Views              │
│  (Interação do usuário, formatação) │
└──────────────────┬──────────────────┘
                   │ usa (storeToRefs / actions)
┌──────────────────▼──────────────────┐
│             Pinia Stores            │
│  (Lógica de negócio, cache local)   │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│      Serviço Supabase (Client)      │
│  (Configuração de token e URLs)     │
└──────────────────┬──────────────────┘
                   │ Rede (HTTPS)
┌──────────────────▼──────────────────┐
│         API REST do Supabase        │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│    PostgreSQL (com Row Level Sec.)  │
└─────────────────────────────────────┘
```

## Problemas Conhecidos e Dívidas Técnicas Críticas

Esta área é a que apresenta maior nível de débitos técnicos no repositório inteiro.

1. **Testes Automatizados Inexistentes**: Não existe um único teste Unitário (Vitest), de Integração ou E2E (Cypress/Playwright) configurado ou escrito na aplicação.
2. **TypeScript Ignorado**: O arquivo `database.types.ts` existe na raiz (gerado pelo Supabase CLI), mas **nenhum arquivo da aplicação o importa ou utiliza**. Todos os componentes e lojas estão escritos em JavaScript vanilla (`.js` e `<script>`), não havendo validação de compilação ou IntelliSense para os schemas do banco.
3. **PWA Desativado/Quebrado**: No arquivo `vite.config.js`, a importação e o plugin do `VitePWA` encontram-se comentados. A aplicação atualmente não funciona offline e não pode ser devidamente "instalada" nos celulares dos usuários.
4. **Tratamento de Erro Ausente**: Não há `Error Boundaries` na aplicação, nem manipulação genérica de falhas de rede no nível global. Erros do Supabase estouram muitas vezes direto no console sem feedback legível para o usuário final.
5. **Carregamento Otimizado (Lazy Loading) Inconsistente**: No Vue Router (`router/index.js`), 10 rotas são carregadas ansiosamente (eager), pesando o bundle inicial, enquanto apenas 2 (`/sessoes` e `/testes`) são _lazy loaded_. Curiosamente, `SessaoAtualView` é carregado *duas vezes*: via importação estática no topo do arquivo E depois dinamicamente, o que anula o ganho do lazy loading.
6. **Conflito de Pacotes CSS/JS (Font Awesome & Google Fonts)**: 
   - No `index.html`, os SVGs de Font Awesome são baixados integralmente via CDN (um arquivo css massivo).
   - No `main.js`, o Font Awesome também está configurado via JS (`@fortawesome/vue-fontawesome`), com a declaração explícita de **~90 ícones importados um a um**. Isso é redundante.
   - Mesmo problema para o Google Fonts, carregado no `index.html` e *também* importado dentro de um bloco `<style>` no `App.vue`.
7. **Modo Escuro (Dark Mode) Engessado**: O elemento raiz do HTML na `index.html` contém `<html class="dark">` de forma estática. Toda a aplicação foi construída sob Tailwind CSS apontando variantes `dark:`, mas nunca foi construído um toggle de tema, e o fallback para "light mode" vai apresentar layouts completamente bugados ou com contraste inaceitável.
8. **Alias de Path (`@/`) Não Configurado**: Importações profundas (ex: `../../components/EntityForm.vue`) ocorrem porque a configuração do Vite não definiu o alias raiz para o diretório `/src`.
9. **XSS via Componente Markdown**: O componente compartilhado `MarkdownRenderer.vue` utiliza a engine `marked` associada ao uso direto e não sanitizado da diretiva `v-html`. Embora haja intenção de renderizar rich-text confiável no diário, isso abre margem crítica para Stored XSS caso campos da Base de Dados sejam violados.

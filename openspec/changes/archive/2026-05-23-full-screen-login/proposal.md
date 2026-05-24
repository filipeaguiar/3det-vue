## Why

O fluxo atual de autenticação em `AuthView.vue` é funcional, mas carece de um impacto visual que transmita a temática "épica" e futurista do RPG 3DeT Victory. A proposta é transformar a tela de login em uma experiência imersiva de tela cheia (fullscreen), utilizando uma imagem de fundo (provida pelo usuário) que estabelece imediatamente o tom do sistema (tecnologia, heróis, anime).

## What Changes

- Transformação do `AuthView.vue` para ocupar toda a tela (h-screen, w-screen) sem margens do container principal.
- Adição da imagem `hero-login.jpg` (ou nome equivalente) como background cover na tela de login/registro.
- Refatoração do layout do formulário:
  - Adição de um painel de vidro (Glassmorphism) com `backdrop-blur` para que o formulário fique legível por cima da imagem rica em detalhes.
  - Ajuste de cores para um modo "dark" translúcido elegante que contraste bem com a imagem.
  - Ocultação do `header` e do `nav` global do `App.vue` quando a rota atual for a de `/auth`, garantindo imersão total.
- Melhoria nas transições e feedback visual de botões.

## Capabilities

### New Capabilities
- Nenhuma nova "capability" de domínio será introduzida, trata-se de uma refatoração puramente UI/UX do fluxo de Autenticação.

### Modified Capabilities
- `autenticacao`: Mudança visual profunda nos requisitos de UI para a tela de entrada.

## Impact

- `src/App.vue`: Precisará de lógica computada (`v-if`) ou refatoração no layout (`<router-view>`) para não exibir a navegação padrão e o título global se a rota ativa for `/auth`.
- `src/views/AuthView.vue`: Layout será totalmente reescrito com foco na imagem de fundo e no painel Glassmorphism.
- Imagem enviada pelo usuário precisará ser armazenada localmente (ex: `src/assets/hero-login.jpg`) ou referenciada no CSS.

## 1. Ajustes de Container Global

- [x] 1.1 Modificar o arquivo `src/App.vue` para detectar a rota atual (`useRoute`)
- [x] 1.2 Aplicar `v-if` nos componentes `<header>` e `<nav>` para que eles fiquem invisíveis se a rota for `/auth`
- [x] 1.3 Remover restrições de padding (`p-4`, `max-w-7xl`, etc) do container `main` do `App.vue` **apenas** quando a rota for `/auth`, permitindo que o login ocupe 100% da tela.

## 2. Refatoração Visual do AuthView

- [x] 2.1 Incluir a imagem épica `hero-login.jpg` enviada pelo usuário na pasta `src/assets/`
- [x] 2.2 Reescrever a tag `<template>` do componente `src/views/AuthView.vue` para forçar `w-screen` e `h-screen`
- [x] 2.3 Aplicar o `hero-login.jpg` via background css ou tag `<img>` absoluta como plano de fundo
- [x] 2.4 Extrair o formulário de login/registro para dentro de uma div com _Glassmorphism_ que se adapte ao tema (ex: `bg-white/70 dark:bg-slate-900/70`, `backdrop-blur-md`, bordas de vidro)
- [x] 2.5 Ajustar os inputs, ícones e botões para que o texto e as cores funcionem bem em ambos os modos (claro e escuro) contra o fundo translúcido

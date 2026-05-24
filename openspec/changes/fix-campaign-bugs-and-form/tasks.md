## 1. Ajustes de Container e Estado do CampanhaView

- [x] 1.1 Modificar o arquivo `src/views/CampanhaView.vue` para separar os blocos condicionais do template.
- [x] 1.2 Renderizar o componente `CampaignDetailsView` quando `isEditMode` for `false` (passando a campanha selecionada como prop, permitindo que ela trate a ausência de seleção internamente).
- [x] 1.3 Renderizar o componente `CampaignForm` quando `isEditMode` for `true`.
- [x] 1.4 Garantir que o evento `@startEditing` emitido por `CampaignDetailsView` chame a função `editCampaign(selectedCampaign)` no container pai `CampanhaView.vue`.

## 2. Nova Aparência do CampaignForm

- [x] 2.1 Atualizar a tag `<template>` do `src/components/CampaignForm.vue` para implementar a estética *Glassmorphism* (fundo translúcido `bg-white/85 dark:bg-slate-900/85`, efeito de desfoque `backdrop-blur-md` e bordas finas semi-transparentes).
- [x] 2.2 Reestilizar os inputs de texto e de área de texto do formulário com cores coerentes para modo claro e escuro (`text-slate-900 dark:text-slate-100 bg-white/50 dark:bg-slate-800/50`).
- [x] 2.3 Aplicar anéis de foco refinados nos inputs utilizando a paleta âmbar (`focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`).
- [x] 2.4 Ajustar o design dos botões de "Salvar" e "Cancelar" com transições fluidas (`transition-all duration-300`) e cores de hover premium.

## 3. Melhoria no CampaignDetailsView

- [x] 3.1 Adicionar um botão de ação "Editar Campanha" diretamente na barra de botões do `src/components/CampaignDetailsView.vue` (próximo a "Novo Capítulo").
- [x] 3.2 Fazer o botão "Editar Campanha" emitir o evento `startEditing` com o objeto da campanha ativa para acionar o formulário.

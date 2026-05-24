## Why

A tela de campanhas (`CampanhaView.vue`) possui um bug crítico na sua máquina de estado visual: quando a aplicação está buscando dados do backend ou quando o usuário não possui nenhuma campanha cadastrada, o formulário de campanha (`CampaignForm.vue`) é renderizado imediatamente em formato de modal sobreposto de tela cheia. Isso impede o usuário de navegar no menu principal ou fechar o modal, criando um "loop" de tela cheia. Além disso, o formulário atual possui um visual muito simples e básico, necessitando de uma repaginada estética moderna com suporte completo a temas claro/escuro.

## What Changes

- **Refatoração do Estado de Visualização da Tela de Campanhas**: Ajustar o `v-if/v-else` de `CampanhaView.vue` para que o formulário de campanha (`CampaignForm.vue`) seja exibido unicamente quando a variável de controle `isEditMode` estiver ativada, impedindo a exibição indevida do formulário quando não houver campanha selecionada.
- **Exibição Correta do Painel de Detalhes**: Garantir que o painel de detalhes (`CampaignDetailsView.vue`) seja exibido sempre que o usuário não estiver em modo de edição, permitindo a exibição de uma mensagem amigável de orientação caso nenhuma campanha esteja selecionada.
- **Nova Experiência Estética do Formulário de Campanhas**: Redesenhar o `CampaignForm.vue` com estética *premium* utilizando *Glassmorphism* translúcido, bordas suaves de vidro, suporte integrado a transições animadas e estilos consistentes com o modo claro e escuro.
- **Melhoria de Navegação de Edição**: Adicionar um botão de ação rápida "Editar Campanha" diretamente na visualização dos detalhes da campanha (`CampaignDetailsView.vue`), melhorando a usabilidade que antes ficava restrita ao ícone de lápis na lista lateral.

## Capabilities

### New Capabilities

*(Nenhuma nova capacidade de negócio está sendo criada)*

### Modified Capabilities

- `campanhas`: Modificação na lógica de controle de tela (View) de campanhas e na experiência visual do formulário de criação/edição de campanhas.

## Impact

- **Views**:
  - `src/views/CampanhaView.vue`: Mudança no fluxo de controle das variáveis `selectedCampaign` e `isEditMode` no template.
- **Componentes**:
  - `src/components/CampaignForm.vue`: Redesenho do template e estilos CSS para suporte ao design modernizado com Glassmorphism e suporte de cores nos temas Dark/Light.
  - `src/components/CampaignDetailsView.vue`: Inclusão de botão "Editar Campanha" com emissão de evento correspondente para acionamento do formulário de edição de campanha.

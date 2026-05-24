## ADDED Requirements

### Requirement: Controle do Estado de Edição de Campanhas
O sistema SHALL exibir o formulário de criação ou edição de campanha (`CampaignForm.vue`) única e exclusivamente quando o modo de edição estiver explicitamente ativado pelo usuário.

#### Scenario: Entrada na Tela sem Campanha Selecionada
- **WHEN** o usuário acessa a tela de campanhas (`/campanha`)
- **AND** nenhuma campanha está selecionada (ou a lista está vazia)
- **AND** o usuário não ativou o modo de edição ou adição
- **THEN** o sistema SHALL renderizar a visualização de detalhes (`CampaignDetailsView.vue`)
- **THEN** o sistema SHALL exibir uma mensagem amigável convidando o usuário a selecionar ou criar uma campanha
- **THEN** o formulário de campanha (`CampaignForm.vue`) SHALL permanecer oculto

#### Scenario: Ativação do Formulário de Nova Campanha
- **WHEN** o usuário clica no botão "Adicionar Novo" na lista lateral
- **THEN** o sistema SHALL ativar o modo de edição (`isEditMode` = true)
- **THEN** o sistema SHALL abrir o formulário de campanha em tela cheia na coluna da direita como um modal sobreposto modernizado

### Requirement: Design do Formulário de Campanhas
O formulário de campanhas SHALL possuir uma interface moderna baseada em Glassmorphism, adaptável ao modo escuro e claro da aplicação, oferecendo excelente contraste e legibilidade.

#### Scenario: Apresentação Estética do Formulário
- **WHEN** o formulário de campanhas é exibido na tela
- **THEN** o sistema exibe o container com fundo semi-translúcido (`bg-white/80` no tema claro e `bg-slate-900/80` no tema escuro) com efeito de desfoque (`backdrop-blur-md`)
- **THEN** os inputs de texto e áreas de texto SHALL possuir bordas e fundos adaptados com foco destacado com anéis na cor Amber do tema 3DeT

### Requirement: Atalho de Edição nos Detalhes
A visualização de detalhes da campanha SHALL prover um botão de atalho dedicado para permitir que o usuário inicie a edição dos dados da campanha ativa diretamente pela área de detalhes.

#### Scenario: Acionamento da Edição via Detalhes
- **WHEN** o usuário visualiza os detalhes de uma campanha selecionada
- **AND** clica no botão de atalho "Editar Detalhes"
- **THEN** o sistema SHALL ativar o modo de edição com os dados da campanha pré-carregados no formulário

# 🗺️ Campanhas

## Visão Geral
O domínio de Campanhas é o ponto de partida organizacional da aplicação. Todo o conteúdo jogável (personagens, NPCs, monstros, sessões) está atrelado a uma Campanha. O sistema permite criar, editar, listar e deletar campanhas, além de manter um diário de "capítulos" para cada uma.

## Estado Atual

### Funcionalidades Principais
- **CRUD de Campanhas**: Criação, edição, listagem e exclusão de campanhas pelo dono (usuário).
- **Conceito de "Campanha Ativa"**: A campanha ativa (armazenada via Pinia e `localStorage`) dita o que é exibido no resto do aplicativo. Se a campanha X está ativa, a view de personagens só mostrará personagens da campanha X (ou sem campanha atrelada).
- **Capítulos da Campanha**: Um diário textual da campanha, dividido em capítulos incrementais suportando Markdown.

### Arquitetura e Componentes
- **Views**: `CampanhaView.vue` (Container principal que exibe a lista, os detalhes e orquestra modais de formulário).
- **Componentes**: 
  - `CampaignForm.vue` (Modal CRUD de campanha).
  - `CampaignDetailsView.vue` (Exibe os dados e o diário/capítulos).
  - `ChapterForm.vue` (Modal CRUD de capítulos).
- **Stores**: `campaigns.js` e `campaignChapters.js`.
- **Rotas**: `/campanha`

## Modelo de Dados

### Tabelas Envolvidas
- `campaigns`:
  - `id` (uuid PK)
  - `name` (text)
  - `description` (text)
  - `user_id` (text FK lógico)
  - `created_at` (timestamp)
- `campaign_chapters`:
  - `id` (uuid PK)
  - `campaign_id` (uuid FK)
  - `chapter_number` (int)
  - `content` (text)
  - `created_at` (timestamp)

## Problemas Conhecidos e Dívidas Técnicas

1. **Delete em Cascata no Client-Side**: O método `deleteCampaign` em `campaigns.js` deleta *manualmente* via chamadas da API todos os npcs, personagens e sessões associados antes de deletar a campanha. Isso deveria ser resolvido no nível do banco de dados com uma constraint `ON DELETE CASCADE`.
2. **Exibição Limitada de Capítulos**: O componente `CampaignDetailsView` atualmente exibe *apenas o último capítulo criado*. Não existe interface para listar, navegar ou ver o histórico dos capítulos mais antigos da campanha.
3. **Setagem Automática de Campanha Ativa**: Ao buscar campanhas (`fetchCampaigns`), o sistema automaticamente seta a `activeCampaign` para a primeira campanha do array se nenhuma estiver ativa. Isso pode ser um comportamento não esperado pelo usuário dependendo do contexto.

## Requisitos

### Requisito: Controle do Estado de Edição de Campanhas
O sistema SHALL exibir o formulário de criação ou edição de campanha (`CampaignForm.vue`) única e exclusivamente quando o modo de edição estiver explicitamente ativado pelo usuário.

#### Cenário: Entrada na Tela sem Campanha Selecionada
- **WHEN** o usuário acessa a tela de campanhas (`/campanha`)
- **AND** nenhuma campanha está selecionada (ou a lista está vazia)
- **AND** o usuário não ativou o modo de edição ou adição
- **THEN** o sistema SHALL renderizar a visualização de detalhes (`CampaignDetailsView.vue`)
- **THEN** o sistema SHALL exibir uma mensagem amigável convidando o usuário a selecionar ou criar uma campanha
- **THEN** o formulário de campanha (`CampaignForm.vue`) SHALL permanecer oculto

#### Cenário: Ativação do Formulário de Nova Campanha
- **WHEN** o usuário clica no botão "Adicionar Novo" na lista lateral
- **THEN** o sistema SHALL ativar o modo de edição (`isEditMode` = true)
- **THEN** o sistema SHALL abrir o formulário de campanha em tela cheia na coluna da direita como um modal sobreposto modernizado

### Requisito: Design do Formulário de Campanhas
O formulário de campanhas SHALL possuir uma interface moderna baseada em Glassmorphism, adaptável ao modo escuro e claro da aplicação, oferecendo excelente contraste e legibilidade.

#### Cenário: Apresentação Estética do Formulário
- **WHEN** o formulário de campanhas é exibido na tela
- **THEN** o sistema exibe o container com fundo semi-translúcido (`bg-white/80` no tema claro e `bg-slate-900/80` no tema escuro) com efeito de desfoque (`backdrop-blur-md`)
- **THEN** os inputs de texto e áreas de texto SHALL possuir bordas e fundos adaptados com foco destacado com anéis na cor Amber do tema 3DeT

### Requisito: Atalho de Edição nos Detalhes
A visualização de detalhes da campanha SHALL prover um botão de atalho dedicado para permitir que o usuário inicie a edição dos dados da campanha ativa diretamente pela área de detalhes.

#### Cenário: Acionamento da Edição via Detalhes
- **WHEN** o usuário visualiza os detalhes de uma campanha selecionada
- **AND** clica no botão de atalho "Editar Detalhes"
- **THEN** o sistema SHALL ativar o modo de edição com os dados da campanha pré-carregados no formulário

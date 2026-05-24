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

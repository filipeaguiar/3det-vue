## Why

O planejamento de sessões de RPG pode ser uma tarefa demorada e desafiadora para o Mestre. Atualmente, o sistema oferece uma estrutura sólida para organizar sessões, mas a criação de conteúdo criativo e mecanicamente equilibrado ainda é puramente manual. A integração com uma LLM (como o Gemini) permitirá gerar sessões completas e contextualizadas, economizando tempo e fornecendo inspiração baseada no lore específico da campanha.

## What Changes

- **Novo Endpoint de Geração**: Criação de uma API `/api/ai/generate-session` (Vercel Edge Function) que utiliza o Vercel AI SDK e o modelo Google Gemini.
- **Evolução do Diário de Campanha**: Adição de uma coluna `summary` na tabela `campaign_chapters` para armazenar resumos curtos dos eventos.
- **Integração de Contexto (RAG e Sumarização)**: O backend coletará dados da campanha ativa. Em vez de enviar a prosa completa de todos os capítulos, o sistema enviará apenas os `summaries` curtos de todo o histórico, mantendo apenas o texto completo do último capítulo para contexto imediato.
- **Auto-Sumarização Silenciosa**: Ao salvar um capítulo, o sistema gerará automaticamente um resumo técnico estruturado (listando personagens, NPCs e eventos principais) para alimentar o histórico da IA, sem necessidade de intervenção manual do Mestre.
- **Interface de Geração**: Adição de um botão "Gerar com IA" na visualização de sessões, abrindo um modal onde o usuário pode inserir uma ideia base e selecionar NPCs e Monstros específicos que devem aparecer na sessão, definindo o papel de cada um.
- **Fluxo de Preenchimento**: A resposta estruturada da IA será enviada ao frontend para preencher automaticamente o formulário de criação de sessão (`SessionForm.vue`).

## Capabilities

### New Capabilities
- `ai-session-generation`: Gerenciamento da lógica de prompt, coleta de contexto e comunicação com a API de LLM.

### Modified Capabilities
- `sessoes`: Adicionar ponto de entrada para geração automática de dados estruturados.

## Impact

- **API de Geração**: Nova rota `/api/ai/generate-session`.
- **Componentes UI**: Novo componente `AISessionGeneratorModal.vue` e atualizações em `SessaoAtualView.vue`.
- **Stores Pinia**: Atualização em `sessions.js` para lidar com o preenchimento de dados vindos da IA.
- **Dependências**: Adição de `ai` e `@ai-sdk/google`.
- **Configuração**: Necessidade de `GOOGLE_GENERATIVE_AI_API_KEY` nas variáveis de ambiente.

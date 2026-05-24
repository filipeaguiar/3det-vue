## 1. Setup e Dependências

- [x] 1.1 Instalar dependências `ai` e `@ai-sdk/google`
- [x] 1.2 Configurar variável de ambiente `GOOGLE_GENERATIVE_AI_API_KEY` (instrução para o usuário)
- [x] 1.3 Criar estrutura de pastas para APIs de IA (`api/ai/`)

## 2. Preparação de Dados e Backend

- [x] 2.1 Adicionar coluna `summary` na tabela `campaign_chapters` (executar SQL no Turso)
- [x] 2.2 Atualizar `api/campaigns.js` para suportar o campo `summary`
- [x] 2.3 Implementar rota `/api/ai/generate-session` (Vercel Edge Function)
- [x] 2.4 Implementar lógica de coleta de contexto (Usando os novos `summaries` do histórico)
- [x] 2.5 Implementar lógica de auto-sumarização estruturada (ao salvar capítulo)
- [x] 2.6 Definir esquema Zod para o objeto de sessão e System Prompt
- [x] 2.7 Implementar streaming do objeto gerado usando `streamObject`

## 3. Frontend (Interface)

- [x] 3.1 Atualizar o salvamento de capítulos para processar o resumo estruturado automaticamente
- [x] 3.2 Criar componente `AISessionGeneratorModal.vue` com:
    - [x] Campo `textarea` para a ideia central
    - [x] Lista de multi-seleção de NPCs com campo de texto para o papel
    - [x] Lista de multi-seleção de Monstros com campo de texto para o papel
    - [x] Feedback de progresso de geração
- [x] 3.3 Adicionar botão "✨ Gerar com IA" no `SessaoAtualView.vue`
- [x] 3.4 Implementar lógica de consumo de stream no frontend (usando `useObject` do AI SDK)
- [x] 3.5 Integrar o resultado da IA com o formulário `SessionForm.vue`

## 4. Polimento e Validação

- [ ] 4.1 Melhorar o prompt para garantir que a IA use os monstros existentes corretamente
- [ ] 4.2 Adicionar tratamento de erros e estados de carregamento visuais
- [ ] 4.3 Validar se a geração respeita o contexto narrativo dos últimos capítulos

## Context

O sistema de sessões atual é composto por uma entidade principal (`sessions`) e diversas tabelas filhas que detalham objetivos, NPCs, encontros, ganchos, etc. A criação de uma nova sessão exige o preenchimento manual de todos esses campos. Aproveitando a inteligência do Google Gemini, podemos automatizar esse preenchimento a partir de uma descrição textual livre fornecida pelo Mestre, enriquecida com o contexto real da campanha armazenado no banco de dados.

## Goals / Non-Goals

**Goals:**
- Implementar um gerador de sessões baseado em IA que produz JSON estruturado.
- Alimentar a IA com contexto relevante: últimos capítulos da campanha, dados resumidos dos personagens (para ganchos), NPCs e monstros disponíveis.
- Garantir que a geração respeite os limites de tempo da Vercel através de streaming de resposta.
- Fornecer uma interface intuitiva para disparar a geração e revisar o resultado antes de salvar.

**Non-Goals:**
- Substituir totalmente a criatividade do Mestre (o resultado é um rascunho editável).
- Gerar fichas completas de novos monstros (foca em usar os monstros já existentes ou sugerir nomes/conceitos).
- Gerar imagens (focado puramente em texto estruturado).

## Decisions

### 1. Modelo de IA e Provedor
Utilizaremos o modelo **Gemini 1.5 Flash** através do **Vercel AI SDK**.
- **Racional**: O Gemini possui um tier gratuito excelente para desenvolvimento e uma janela de contexto ampla, permitindo enviar resumos de campanha sem estourar limites.

### 2. Formato de Saída (Object Generation)
Utilizaremos a função `generateObject` ou `streamObject` do Vercel AI SDK com um esquema Zod que espelha exatamente a estrutura do banco de dados/frontend.
- **Racional**: Garante que a IA retorne dados válidos e prontos para serem injetados no formulário Vue sem necessidade de parsing complexo de texto.

### 3. Estratégia de Contexto (Linfonodos Narrativos)
O backend coletará e processará o contexto de forma otimizada:
- **Linha do Tempo de Resumos**: Todos os capítulos anteriores serão enviados apenas como seus resumos curtos (`summary`).
- **Contexto Imediato**: O último capítulo será enviado na íntegra (prosa).
- **Entidades Selecionadas**: NPCs e Monstros escolhidos com seus papéis.
- **Racional**: Transformamos o histórico em uma "linha do tempo" leve, permitindo que a IA entenda a progressão da história sem ler volumes massivos de texto literário.

### 4. Mudanças no Esquema de Dados
- Tabela `campaign_chapters`: Adição da coluna `summary TEXT`.
- API de Capítulos: Integrada à lógica de IA para gerar o `summary` automaticamente no POST/PUT se o conteúdo em prosa for alterado.
- UI de Capítulos: O campo `summary` é preenchido automaticamente durante o salvamento.

### 5. Integração na UI
- Botão "✨ Gerar com IA" na tela de Sessão Atual.
- Modal `AISessionGeneratorModal.vue` contendo:
  - `textarea` para "Ideia central da sessão".
  - Lista de seleção de NPCs e Monstros da campanha atual.
  - Campos de texto curtos para definir o "Papel" de cada entidade selecionada (ex: "Vilão principal", "Dá uma pista").
- Ao concluir a geração, os dados são injetados no estado do `SessionForm.vue`.

## Risks / Trade-offs

- **Timeouts**: Gerar objetos complexos pode levar mais que 10s.
  - **Mitigação**: Uso de `streamObject` com Edge Functions na Vercel.
- **Custo de Tokens**: Enviar muito contexto pode gerar custos no futuro.
  - **Mitigação**: O modelo 1.5 Flash é barato/grátis no tier Hobby. Limitaremos o número de capítulos enviados.
- **Alucinações Mecânicas**: A IA pode inventar regras.
  - **Mitigação**: O rascunho é totalmente editável pelo Mestre antes do salvamento.

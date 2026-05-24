## ADDED Requirements
### Requirement: Histórico Eficiente de Campanha
O sistema SHALL utilizar resumos curtos dos capítulos para fornecer contexto histórico à LLM, mantendo apenas o capítulo mais recente na íntegra.

#### Scenario: Geração de prompt com linha do tempo de resumos
- **WHEN** uma campanha possui capítulos com resumos preenchidos
- **THEN** o sistema SHALL concatenar todos os `summary` anteriores em uma lista cronológica
- **AND** SHALL incluir o `content` (prosa) completo apenas do último capítulo
- **AND** SHALL enviar essa estrutura como contexto narrativo para a IA

### Requirement: Auto-Sumarização Técnica e Automática
O sistema SHALL gerar automaticamente um resumo estruturado sempre que um capítulo for salvo ou atualizado.

#### Scenario: Geração de resumo no salvamento
- **WHEN** o usuário salva um novo capítulo em prosa
- **THEN** o sistema SHALL enviar o texto para a LLM solicitando a extração de: Personagens Presentes, NPCs Envolvidos e Eventos Chave
- **AND** SHALL armazenar esse resumo estruturado no campo `summary` do banco de dados de forma transparente para o usuário

### Requirement: Geração de Sessão Contextualizada
O sistema SHALL permitir a geração de uma sessão de RPG estruturada utilizando IA, integrando dados reais da campanha para garantir relevância narrativa.

#### Scenario: Geração bem-sucedida com contexto e seleções manuais
...
- **WHEN** o usuário aciona o gerador de IA e fornece uma ideia base
- **AND** o usuário seleciona NPCs e Monstros específicos e define seus papéis
- **THEN** o sistema SHALL coletar o nome e descrição da campanha ativa
- **AND** SHALL buscar os últimos capítulos do diário de campanha
- **AND** SHALL buscar dados resumidos dos personagens da campanha (nome, conceito, desvantagens)
- **AND** SHALL enviar todos esses dados como contexto para a LLM, destacando as entidades selecionadas e seus papéis obrigatórios
- **THEN** o sistema SHALL retornar um objeto JSON contendo: título, descrição, começo forte, lista de objetivos, ganchos de personagens, NPCs importantes, encontros e segredos, respeitando as seleções feitas pelo usuário

### Requirement: Streaming de Objeto de Sessão
O sistema SHALL utilizar streaming para o transporte do objeto gerado pela IA, evitando timeouts na infraestrutura da Vercel.

#### Scenario: Visualização do progresso de geração
- **WHEN** a geração é iniciada
- **THEN** o sistema SHALL exibir um estado de carregamento na interface
- **AND** SHALL receber os dados parciais da IA conforme são gerados
- **THEN** o sistema SHALL abrir o formulário de sessão com os campos sendo preenchidos conforme a chegada dos dados ou ao final do stream

### Requirement: Mapeamento Inteligente de Entidades
A IA SHALL tentar utilizar NPCs e monstros já existentes no banco de dados do usuário para preencher os campos de "NPCs Importantes" e "Encontros".

#### Scenario: Seleção de monstros conhecidos
- **WHEN** a IA gera um encontro de combate
- **THEN** ela SHALL preferir selecionar monstros da lista de monstros fornecida no contexto
- **AND** SHALL preencher o nome e a descrição mecânica baseada no monstro selecionado
